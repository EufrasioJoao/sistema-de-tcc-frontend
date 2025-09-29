"use client";

import { AxiosError } from "axios";
import { toast } from "sonner";
import { use, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { Loading } from "@/components/Loading";
import { DocumentViewer } from "react-documents";
import { Button } from "@/components/ui/button";
import { Maximize2, Download, ArrowLeft } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";

export default function FilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<{
    presignedUrl: string | null;
  } | null>(null);
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
      const tccIdParam = urlParams.get("tccId") as string;
      const fileTypeParam = urlParams.get("fileType") as string; // 'main' or 'defense'

      setFileName(name);
      setTccId(tccIdParam);

      const extension = name.split(".").pop()?.toLowerCase() || "";
      setFileType(extension);

      // Use our TCC download endpoint to get presigned URL
      const response = await api.get(
        `/api/tccs/${tccIdParam}/download/${fileTypeParam}`
      );

      if (response.data.success) {
        setFile({
          presignedUrl: response.data.downloadUrl,
        });
      } else {
        toast.error(response.data.message || "Erro ao carregar arquivo");
      }
    } catch (error) {
      console.error("Error loading the file:", error);
      if (error instanceof AxiosError) {
        toast.error(
          error?.response?.data?.message ||
            "Ocorreu um erro ao carregar o arquivo!"
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
    if (!file?.presignedUrl) {
      toast.error("Arquivo não disponível para download");
      return;
    }

    try {
      toast.success("Download iniciado...");

      const link = document.createElement("a");
      link.href = file.presignedUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Erro ao fazer download do arquivo");
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
                className="hover:bg-gray-100"
              >
                <Download className="h-4 w-4" />
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
            {file?.presignedUrl && (
              <div className="h-full w-full">
                <DocumentViewer
                  url={file.presignedUrl}
                  viewer={fileType === "pdf" ? "pdf" : "google"}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
