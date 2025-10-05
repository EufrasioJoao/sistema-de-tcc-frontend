"use client";

import { AxiosError } from "axios";
import { toast } from "sonner";
import { use, useEffect, useRef, useState } from "react";
import { Loading } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Maximize2, Download, ArrowLeft, Loader2Icon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import { getSessionData } from "@/app/session";
import { PdfViewer } from "./_components/PdfViewer";

export default function FilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(false);

  const [downloading, setDownloading] = useState(false);

  const [fileUrl, setFileUrl] = useState<string>("");
  const [authToken, setAuthToken] = useState<string>("");

  const [fileType, setFileType] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [tccId, setTccId] = useState<string>("");
  const viewerRef = useRef<HTMLDivElement>(null);

  const loadFile = async (fileId: string) => {
    if (loading || !fileId) return;

    setLoading(true);
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const name = urlParams.get("name") as string;
      setFileName(name);


      const sessionData = await getSessionData();
      const token = sessionData?.data?.token || '';
      setAuthToken(token);

      // Construir a URL do stream usando o baseURL da API
      const streamUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/tccs/stream/${fileId}`;
      setFileUrl(streamUrl);
    } catch (error) {
      console.error("Error downloading the file:", error);
      if (error instanceof AxiosError) {
        toast.error(
          error?.response?.data?.message || "Ocorreu um erro ao fazer download!"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadFile(id);
  }, [id]);

  const toggleFullscreen = () => {
    const elem = viewerRef.current;

    if (!document.fullscreenElement) {
      elem?.requestFullscreen().catch((err) => {
        console.error(`Error attempting fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleDownload = async () => {
    if (!fileUrl || !authToken || downloading) return;

    setDownloading(true);
    try {
      const response = await fetch(fileUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao fazer download do arquivo');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Download iniciado com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer download:', error);
      toast.error('Erro ao fazer download do arquivo');
    } finally {
      setDownloading(false);
    }
  };

  if (!id) return <div className="text-center text-red-500">ID inválido</div>;

  return (
    <div className="flex flex-col h-screen bg-white w-full">
      <div className="flex-none p-4 z-10 flex items-center justify-between bg-white border-b">
        <div className="flex items-center space-x-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Voltar</p>
            </TooltipContent>
          </Tooltip>

          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-gray-900">{fileName}</h1>
            <p className="text-sm text-gray-500">Visualizador de Arquivo TCC</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={handleDownload}
                disabled={downloading}
                className="hover:bg-gray-100"
              >
                {downloading ? (
                  <Loader2Icon className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleFullscreen}
                className="hover:bg-gray-100"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Fullscreen</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <div className="flex-1 relative w-full">
          <div
            ref={viewerRef}
            className="absolute inset-0 overflow-auto w-full"
          >
            {fileUrl && authToken && (
              <div className="h-full w-full">
                <PdfViewer file={fileUrl} token={authToken} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
