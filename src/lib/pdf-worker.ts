import { pdfjs } from 'react-pdf';

// Polyfill para URL.parse se não existir
if (typeof URL !== 'undefined' && !URL.parse) {
  URL.parse = (url: string, base?: string) => {
    try {
      return new URL(url, base);
    } catch {
      return null;
    }
  };
}

// Configure PDF.js worker usando CDN para compatibilidade universal (desktop e mobile)
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}
