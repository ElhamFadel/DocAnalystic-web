import { supabase } from './supabase';

export async function testBucketConnectivity(bucketName: string = 'documents'): Promise<boolean> {
  try {
    console.log(`Testing connectivity for bucket: ${bucketName}`);
    
    // Try to list files (with a limit of 1) to test bucket access
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list('', {
        limit: 1,
        offset: 0
      });

    if (error) {
      console.error('Bucket connectivity test failed:', error);
      return false;
    }

    console.log('Bucket connectivity test successful');
    console.log('Sample data:', data);
    return true;
  } catch (error) {
    console.error('Bucket connectivity test error:', error);
    return false;
  }
}

export async function ensureBucketAccess(): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('Checking bucket access...');
    const hasAccess = await testBucketConnectivity();
    
    if (!hasAccess) {
      console.error('Bucket access check failed');
      return {
        success: false,
        error: 'Unable to access document storage. Please check your permissions or try again later.'
      };
    }

    console.log('Bucket access check successful');
    return { success: true };
  } catch (error) {
    console.error('Error during bucket access check:', error);
    return {
      success: false,
      error: 'An error occurred while checking storage access. Please try again later.'
    };
  }
}

export async function getSignedUrl(url: string): Promise<string | null> {
  try {
    // Extract path from the URL
    const urlObj = new URL(url);
    const path = urlObj.pathname.split('/storage/v1/object/public/documents/')[1];
    
    if (!path) {
      console.error('Invalid storage URL format:', url);
      return null;
    }

    // Create signed URL with 24-hour expiry
    const { data, error } = await supabase.storage
      .from('documents')
      .createSignedUrl(path, 24 * 60 * 60); // 24 hours in seconds

    if (error) {
      console.error('Error creating signed URL:', error);
      return null;
    }

    console.log('Generated signed URL for:', path);
    return data.signedUrl;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return null;
  }
}

export function verifyStorageUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    // Verify the URL is from our Supabase storage
    const isSupabaseStorage = parsedUrl.hostname.includes('supabase');
    const hasStoragePath = parsedUrl.pathname.includes('/storage/v1/object/public/');
    
    console.log('Storage URL verification:', {
      url,
      isSupabaseStorage,
      hasStoragePath
    });
    
    return isSupabaseStorage && hasStoragePath;
  } catch (error) {
    console.error('Invalid storage URL:', url, error);
    return false;
  }
}

export function constructStorageUrl(bucket: string, path: string): string {
  const storageUrl = `${supabase.storageUrl}/object/public/${bucket}/${path}`;
  console.log('Constructed storage URL:', storageUrl);
  return storageUrl;
}