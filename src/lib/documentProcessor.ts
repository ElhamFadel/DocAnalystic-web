import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set the worker source to the CDN URL
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.0.375/pdf.worker.min.mjs';

interface ExtractedDocumentInfo {
  title: string;
  content: string;
  pageCount: number;
  metadata?: Record<string, any>;
}

export async function extractDocumentInfo(file: File): Promise<ExtractedDocumentInfo> {
  const fileType = file.name.split('.').pop()?.toLowerCase();

  switch (fileType) {
    case 'pdf':
      return extractPdfInfo(file);
    case 'docx':
      return extractDocxInfo(file);
    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }
}

async function extractPdfInfo(file: File): Promise<ExtractedDocumentInfo> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    // First, validate the PDF header
    const header = new Uint8Array(arrayBuffer.slice(0, 8));
    const pdfHeader = '%PDF-1.';
    const headerText = new TextDecoder().decode(header);
    
    if (!headerText.startsWith(pdfHeader)) {
      throw new Error('Invalid PDF header');
    }

    // Load and validate the PDF structure
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      useSystemFonts: true,
      standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/standard_fonts/`,
      cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
      cMapPacked: true,
    });

    const pdf = await loadingTask.promise;
    
    // Verify we can access the first page
    const firstPage = await pdf.getPage(1);
    const textContent = await firstPage.getTextContent();
    
    // Get document metadata
    const metadata = await pdf.getMetadata().catch(() => ({}));
    
    const firstPageText = textContent.items
      .map((item: any) => item.str)
      .join(' ')
      .trim();

    // Try to extract title from metadata or first page content
    let title = '';
    if (metadata?.info?.Title) {
      title = metadata.info.Title;
    } else {
      // Look for potential title in first page
      const lines = firstPageText.split('\n');
      // Usually, the title is one of the first non-empty lines
      title = lines.find(line => line.trim().length > 0) || '';
    }

    // If no title found, use file name without extension
    if (!title) {
      title = file.name.replace(/\.[^/.]+$/, '');
    }

    // Extract content from all pages
    let fullContent = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullContent += pageText + '\n';
    }

    return {
      title: title.trim(),
      content: fullContent.trim(),
      pageCount: pdf.numPages,
      metadata: metadata?.info || {}
    };
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Invalid or corrupted PDF file. Please ensure the file is a valid PDF document.');
  }
}

async function extractDocxInfo(file: File): Promise<ExtractedDocumentInfo> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    const content = result.value;
    const lines = content.split('\n').filter(line => line.trim().length > 0);
    
    // Usually, the first non-empty line is the title in a DOCX document
    let title = lines[0] || '';
    
    // If the first line looks too long to be a title, use filename
    if (title.length > 100) {
      title = file.name.replace(/\.[^/.]+$/, '');
    }

    // Estimate page count (rough approximation)
    const CHARS_PER_PAGE = 3000;
    const pageCount = Math.ceil(content.length / CHARS_PER_PAGE);

    return {
      title: title.trim(),
      content: content.trim(),
      pageCount,
      metadata: {}
    };
  } catch (error) {
    console.error('DOCX extraction error:', error);
    throw new Error('Invalid or corrupted DOCX file. Please ensure the file is a valid Word document.');
  }
}

export async function validateDocument(file: File): Promise<boolean> {
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ['pdf', 'docx'];

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds 10MB limit');
  }

  // Check file type
  const fileType = file.name.split('.').pop()?.toLowerCase();
  if (!fileType || !ALLOWED_TYPES.includes(fileType)) {
    throw new Error('Unsupported file type. Only PDF and DOCX files are allowed.');
  }

  try {
    // Additional validation for PDF files
    if (fileType === 'pdf') {
      const arrayBuffer = await file.arrayBuffer();
      
      // Check PDF header
      const header = new Uint8Array(arrayBuffer.slice(0, 8));
      const pdfHeader = '%PDF-1.';
      const headerText = new TextDecoder().decode(header);
      
      if (!headerText.startsWith(pdfHeader)) {
        throw new Error('Invalid PDF header');
      }

      // Try to load and parse the PDF
      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
        useSystemFonts: true,
        standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/standard_fonts/`,
        cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
        cMapPacked: true,
      });

      const pdf = await loadingTask.promise;
      await pdf.getPage(1); // Verify we can access the first page
    }

    // Additional validation for DOCX files
    if (fileType === 'docx') {
      const arrayBuffer = await file.arrayBuffer();
      await mammoth.extractRawText({ arrayBuffer });
    }

    return true;
  } catch (error) {
    console.error('Document validation error:', error);
    if (error instanceof Error) {
      throw new Error(`Invalid or corrupted ${fileType.toUpperCase()} file: ${error.message}`);
    }
    throw new Error(`Invalid or corrupted ${fileType.toUpperCase()} file`);
  }
}

export function sanitizeTitle(title: string): string {
  // Remove special characters and limit length
  return title
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .substring(0, 100); // Limit length to 100 characters
}