// Document Service for API calls
export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  status: 'pending' | 'verified' | 'rejected';
  url?: string;
}

export interface DocumentUploadResponse {
  success: boolean;
  document?: Document;
  error?: string;
}

class DocumentService {
  private baseURL = '/api/documents';

  async upload(file: File): Promise<DocumentUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.baseURL}/upload`, {
        method: 'POST',
        body: formData
      });

      return await response.json();
    } catch (error) {
      console.error('Upload error:', error);
      return { success: false, error: 'Upload failed' };
    }
  }

  async list(page = 1, limit = 10): Promise<{ documents: Document[], total: number }> {
    try {
      const response = await fetch(`${this.baseURL}/list?page=${page}&limit=${limit}`);
      return await response.json();
    } catch (error) {
      console.error('List error:', error);
      return { documents: [], total: 0 };
    }
  }

  async get(id: string): Promise<Document | null> {
    try {
      const response = await fetch(`${this.baseURL}/${id}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Get error:', error);
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'DELETE'
      });
      return response.ok;
    } catch (error) {
      console.error('Delete error:', error);
      return false;
    }
  }

  async verify(id: string, status: 'verified' | 'rejected', notes?: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, notes })
      });
      return response.ok;
    } catch (error) {
      console.error('Verify error:', error);
      return false;
    }
  }

  async share(id: string, email: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: id, sharedWith: email })
      });
      return response.ok;
    } catch (error) {
      console.error('Share error:', error);
      return false;
    }
  }

  async download(id: string): Promise<Blob | null> {
    try {
      const response = await fetch(`${this.baseURL}/download/${id}`);
      if (!response.ok) return null;
      return await response.blob();
    } catch (error) {
      console.error('Download error:', error);
      return null;
    }
  }
}

export const documentService = new DocumentService();