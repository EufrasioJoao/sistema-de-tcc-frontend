import { useRouter } from "next/navigation";

/**
 * Open TCC file in the file viewer using router navigation
 */
export function openTCCFileViewer(
  router: any,
  tccId: string,
  fileId: string,
  fileName: string,
  fileType: 'main' | 'defense'
) {
  const params = new URLSearchParams({
    name: fileName,
    tccId: tccId,
    fileType: fileType,
  });

  const url = `/dashboard/tccs/file/${fileId}?${params.toString()}`;
  router.push(url);
}


/**
 * Hook to get file viewer functions
 */
export function useFileViewer() {
  const router = useRouter();

  const openFileInViewer = (
    tccId: string,
    fileId: string,
    fileName: string,
    fileType: "main" | "defense"
  ) => {
    openTCCFileViewer(router, tccId, fileId, fileName, fileType);
  };

  const navigateToFileViewer = (
    tccId: string,
    fileId: string,
    fileName: string,
    fileType: "main" | "defense"
  ) => {
    openTCCFileViewer(router, tccId, fileId, fileName, fileType);
  };

  return {
    openFileInViewer,
    navigateToFileViewer,
  };
}
