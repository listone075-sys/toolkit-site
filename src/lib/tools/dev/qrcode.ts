import QRCode from "qrcode";

export interface QrOptions {
  text: string;
  width?: number;
  color?: string;
  bgColor?: string;
}

/**
 * Generate a QR code as a data URL (PNG)
 */
export async function generateQrCode(options: QrOptions): Promise<string> {
  const { text, width = 300, color = "#000000", bgColor = "#ffffff" } = options;
  if (!text.trim()) throw new Error("Please enter text or URL for the QR code");

  return await QRCode.toDataURL(text, {
    width,
    color: { dark: color, light: bgColor },
    margin: 2,
  });
}
