import { describe, it, expect, vi } from 'vitest';
import { testBucketConnectivity, ensureBucketAccess, getSignedUrl } from './storageUtils';
import { supabase } from './supabase';

vi.mock('./supabase', () => ({
  supabase: {
    storage: {
      from: vi.fn().mockReturnValue({
        list: vi.fn(),
        createSignedUrl: vi.fn()
      })
    }
  }
}));

describe('storageUtils', () => {
  describe('testBucketConnectivity', () => {
    it('should return true when bucket is accessible', async () => {
      const mockList = vi.fn().mockResolvedValue({ data: [], error: null });
      supabase.storage.from().list = mockList;

      const result = await testBucketConnectivity();
      expect(result).toBe(true);
      expect(mockList).toHaveBeenCalledWith('', { limit: 1, offset: 0 });
    });

    it('should return false when bucket access fails', async () => {
      const mockList = vi.fn().mockResolvedValue({ data: null, error: new Error('Access denied') });
      supabase.storage.from().list = mockList;

      const result = await testBucketConnectivity();
      expect(result).toBe(false);
    });
  });

  describe('getSignedUrl', () => {
    it('should return signed URL when successful', async () => {
      const mockCreateSignedUrl = vi.fn().mockResolvedValue({
        data: { signedUrl: 'https://signed-url.com' },
        error: null
      });
      supabase.storage.from().createSignedUrl = mockCreateSignedUrl;

      const result = await getSignedUrl('https://supabase.com/storage/v1/object/public/documents/test.pdf');
      expect(result).toBe('https://signed-url.com');
      expect(mockCreateSignedUrl).toHaveBeenCalledWith('test.pdf', 24 * 60 * 60);
    });

    it('should return null for invalid URL format', async () => {
      const result = await getSignedUrl('invalid-url');
      expect(result).toBeNull();
    });

    it('should return null when signed URL creation fails', async () => {
      const mockCreateSignedUrl = vi.fn().mockResolvedValue({
        data: null,
        error: new Error('Failed to create signed URL')
      });
      supabase.storage.from().createSignedUrl = mockCreateSignedUrl;

      const result = await getSignedUrl('https://supabase.com/storage/v1/object/public/documents/test.pdf');
      expect(result).toBeNull();
    });
  });

  describe('ensureBucketAccess', () => {
    it('should return success when bucket is accessible', async () => {
      const mockList = vi.fn().mockResolvedValue({ data: [], error: null });
      supabase.storage.from().list = mockList;

      const result = await ensureBucketAccess();
      expect(result).toEqual({ success: true });
    });

    it('should return error when bucket is not accessible', async () => {
      const mockList = vi.fn().mockResolvedValue({ data: null, error: new Error('Access denied') });
      supabase.storage.from().list = mockList;

      const result = await ensureBucketAccess();
      expect(result).toEqual({
        success: false,
        error: 'Unable to access document storage. Please check your permissions or try again later.'
      });
    });
  });
});