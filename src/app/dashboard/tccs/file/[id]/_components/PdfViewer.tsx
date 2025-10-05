"use client";

import { useState, useMemo, useRef, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { Button } from '@/components/ui/button';
import {  ZoomIn, ZoomOut } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import '@/lib/pdf-worker';

interface PdfViewerProps {
  file: string;
  token: string;
}

export function PdfViewer({ file, token }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.0);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastTouchDistance = useRef<number>(0);

  // Memoizar o objeto file para evitar re-renders desnecessários
  const fileConfig = useMemo(() => ({ url: file }), [file]);

  // Memoizar as opções para evitar re-renders desnecessários
  const options = useMemo(
    () => ({
      httpHeaders: {
        Authorization: `Bearer ${token}`,
      },
    }),
    [token]
  );

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  function onDocumentLoadError(error: Error): void {
    console.error('Error loading PDF:', error);
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 3.0));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };

  // Função para calcular distância entre dois toques
  const getTouchDistance = (touch1: Touch, touch2: Touch): number => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Configurar eventos de touch para pinch-to-zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        lastTouchDistance.current = getTouchDistance(e.touches[0], e.touches[1]);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const currentDistance = getTouchDistance(e.touches[0], e.touches[1]);
        const delta = currentDistance - lastTouchDistance.current;
        
        if (Math.abs(delta) > 5) {
          setScale((prevScale) => {
            const newScale = prevScale + (delta > 0 ? 0.15 : -0.15);
            return Math.max(0.5, Math.min(3.0, newScale));
          });
          lastTouchDistance.current = currentDistance;
        }
      }
    };

    const handleTouchEnd = () => {
      lastTouchDistance.current = 0;
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div className="flex flex-col h-full w-full bg-gray-50">
      {/* Controls */}
      <div className="flex items-center justify-center gap-2 md:gap-4 p-3 md:p-4 bg-white border-b sticky top-0 z-10">
        <span className="text-xs md:text-sm font-medium">
          {numPages} {numPages === 1 ? 'página' : 'páginas'}
        </span>

        <div className="flex items-center gap-1 md:gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={zoomOut}
            disabled={scale <= 0.5}
            className="h-8 w-8 md:h-10 md:w-10"
          >
            <ZoomOut className="h-3 w-3 md:h-4 md:w-4" />
          </Button>
          <span className="text-xs md:text-sm font-medium min-w-[50px] md:min-w-[60px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={zoomIn}
            disabled={scale >= 3.0}
            className="h-8 w-8 md:h-10 md:w-10"
          >
            <ZoomIn className="h-3 w-3 md:h-4 md:w-4" />
          </Button>
        </div>
      </div>

      {/* PDF Document */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto flex justify-center p-2 md:p-4"
      >
        <Document
          file={fileConfig}
          options={options}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          }
          error={
            <div className="flex items-center justify-center p-8">
              <p className="text-red-500">Erro ao carregar o PDF.</p>
            </div>
          }
          noData={
            <div className="flex items-center justify-center p-8">
              <p className="text-gray-500">Nenhum PDF especificado.</p>
            </div>
          }
          className="flex flex-col gap-2 md:gap-4"
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              scale={scale}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              className="shadow-md md:shadow-lg"
            />
          ))}
        </Document>
      </div>
    </div>
  );
}
