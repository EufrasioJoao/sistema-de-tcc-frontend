declare module "react-file-viewer" {
  import { Component } from "react";

  interface FileViewerProps {
    fileType: string;
    filePath: string;
    onError?: (error: Error) => void;
    style?: React.CSSProperties;
  }

  export default class FileViewer extends Component<FileViewerProps> {}
}
