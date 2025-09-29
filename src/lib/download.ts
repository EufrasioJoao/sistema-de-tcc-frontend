import { api } from "./api";
import { toast } from "sonner";

/**
 * Download TCC file with loading state
 */
export async function downloadTCCFile(
  tccId: string, 
  fileType: 'main' | 'defense',
  filename: string,
  onLoadingChange?: (loading: boolean) => void
): Promise<void> {
  try {
    onLoadingChange?.(true);
    
    // Get presigned URL from backend
    const response = await api.get(`/api/tccs/${tccId}/download/${fileType}`);
    
    if (response.data.success) {
      const { downloadUrl, filename: serverFilename } = response.data;
      
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = serverFilename || filename;
      link.target = '_blank';
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Download iniciado: ${serverFilename || filename}`);
    } else {
      toast.error(response.data.message || "Erro ao gerar link de download");
    }
  } catch (error: any) {
    console.error("Error downloading file:", error);
    toast.error(error.response?.data?.message || "Erro ao fazer download do arquivo");
  } finally {
    onLoadingChange?.(false);
  }
}

/**
 * Download file using fetch with progress tracking
 */
export async function downloadFileWithProgress(
  url: string,
  filename: string,
  onProgress?: (progress: number) => void
): Promise<void> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const contentLength = response.headers.get('content-length');
    const total = contentLength ? parseInt(contentLength, 10) : 0;
    let loaded = 0;
    
    const reader = response.body?.getReader();
    const chunks: Uint8Array[] = [];
    
    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        chunks.push(value);
        loaded += value.length;
        
        if (total > 0 && onProgress) {
          onProgress((loaded / total) * 100);
        }
      }
    }
    
    // Create blob and download
    const blob = new Blob(chunks);
    const downloadUrl = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(downloadUrl);
    
    toast.success(`Download concluído: ${filename}`);
  } catch (error) {
    console.error("Error downloading file with progress:", error);
    toast.error("Erro ao fazer download do arquivo");
  }
}
