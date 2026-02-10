import { QRCodeSVG } from 'qrcode.react';

interface TicketQRProps {
  bookingRef: string;
  size?: number;
}

const TicketQR = ({ bookingRef, size = 120 }: TicketQRProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="bg-white p-2 rounded-lg">
        <QRCodeSVG value={`CINEBOOK:${bookingRef}`} size={size} level="M" />
      </div>
      <div className="text-sm">
        <p className="font-medium">Scan at entry</p>
        <p className="text-muted-foreground">Show this QR code at the cinema</p>
        <p className="font-mono text-xs text-primary mt-1">{bookingRef}</p>
      </div>
    </div>
  );
};

export default TicketQR;
