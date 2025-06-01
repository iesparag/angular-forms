declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | number[];
    filename?: string;
    image?: {
      type?: string;
      quality?: number;
    };
    html2canvas?: {
      scale?: number;
      useCORS?: boolean;
      letterRendering?: boolean;
      scrollY?: number;
      windowWidth?: number;
      height?: number;
      onclone?: (clonedDoc: Document) => void;
    };
    jsPDF?: {
      unit?: string;
      format?: string;
      orientation?: string;
      compress?: boolean;
      precision?: number;
    };
  }

  function html2pdf(element: HTMLElement, options?: Html2PdfOptions): Promise<void>;
  export default html2pdf;
}
