import React from 'react';
import { FacturaRegistro } from '../../types';
import { formatCOP, formatCOPShort, formatFecha } from '../../utils/formatters';
import { 
  Receipt, 
  Printer, 
  Download, 
  X, 
  ShieldCheck, 
  QrCode, 
  FileText,
  CheckCircle2
} from 'lucide-react';

interface FacturaViewerModalProps {
  factura: FacturaRegistro | null;
  onClose: () => void;
}

export const FacturaViewerModal: React.FC<FacturaViewerModalProps> = ({ factura, onClose }) => {
  if (!factura) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col animate-in fade-in zoom-in-95">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <Receipt className="w-5 h-5 text-slate-800" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Visor de Soporte Fiscal Digital
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">
                {factura.numeroFactura} · {factura.tipoDocumento}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
              title="Imprimir Soporte"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Viewport */}
        <div className="p-8 space-y-6 text-xs text-slate-800 font-sans">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 border-b-2 border-slate-900 pb-5">
            <div>
              <div className="text-base font-bold text-slate-900 uppercase">
                {factura.proveedor}
              </div>
              <div className="text-slate-600 font-mono text-[11px]">NIT / Cédula: {factura.nit}</div>
              <div className="text-slate-500 text-[11px]">Proveedor Autorizado · Régimen Ordinario / Común</div>
              <div className="text-slate-500 text-[11px]">Colombia · Teléfono de Contacto Comercial</div>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <div className="text-xs uppercase font-bold text-slate-500">
                {factura.tipoDocumento}
              </div>
              <div className="text-lg font-bold font-mono text-slate-900">
                {factura.numeroFactura}
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                Fecha Emisión: {factura.fecha}
              </div>
            </div>
          </div>

          {/* Adquirente Info */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
            <div>
              <span className="text-slate-500 block uppercase font-bold text-[9px]">Adquiriente (Comprador):</span>
              <strong className="text-slate-900 text-xs">CORPORACIÓN SOCIAL SOMOS UNO</strong>
              <div className="font-mono text-slate-600">NIT: 900.821.554-1</div>
              <div className="text-slate-500">Calle 5 # 38-25, Cali, Valle del Cauca</div>
            </div>

            <div>
              <span className="text-slate-500 block uppercase font-bold text-[9px]">Responsable de Legalización:</span>
              <div className="font-semibold text-slate-800">{factura.responsable}</div>
              <div className="text-slate-500">Área: {factura.areaProyecto}</div>
              <div className="font-mono text-slate-600">Solicitud Vinculada: {factura.solicitudId}</div>
            </div>
          </div>

          {/* Items breakdown */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-[11px]">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-2.5 text-left">Ítem / Concepto</th>
                  <th className="p-2.5 text-right">Cant.</th>
                  <th className="p-2.5 text-right">Valor Unitario</th>
                  <th className="p-2.5 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {factura.archivoSimuladoData?.items ? (
                  factura.archivoSimuladoData.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5 text-slate-900 font-medium">{it.descripcion}</td>
                      <td className="p-2.5 text-right font-mono">{it.cantidad}</td>
                      <td className="p-2.5 text-right font-mono">{formatCOPShort(it.unitario)}</td>
                      <td className="p-2.5 text-right font-mono font-bold text-slate-900">{formatCOPShort(it.subtotal)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-2.5 text-slate-900 font-medium">{factura.concepto}</td>
                    <td className="p-2.5 text-right font-mono">1</td>
                    <td className="p-2.5 text-right font-mono">{formatCOPShort(factura.valorAntesImpuestos)}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-slate-900">{formatCOPShort(factura.valorAntesImpuestos)}</td>
                  </tr>
                )}
              </tbody>
              <tfoot className="border-t border-slate-200 bg-slate-50 text-slate-700">
                <tr>
                  <td colSpan={3} className="p-2 text-right">Subtotal Base:</td>
                  <td className="p-2 text-right font-mono">{formatCOPShort(factura.valorAntesImpuestos)}</td>
                </tr>
                <tr>
                  <td colSpan={3} className="p-2 text-right">IVA / Impuestos:</td>
                  <td className="p-2 text-right font-mono">{formatCOPShort(factura.impuestos)}</td>
                </tr>
                <tr className="border-t border-slate-300 font-bold text-slate-900 text-xs">
                  <td colSpan={3} className="p-2 text-right">TOTAL PAGADO:</td>
                  <td className="p-2 text-right font-mono text-emerald-800">{formatCOP(factura.valorTotal)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* CUFE & DIAN Stamp */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-16 h-16 bg-white border border-slate-200 rounded-lg flex items-center justify-center shrink-0 shadow-xs">
              <QrCode className="w-12 h-12 text-slate-800" />
            </div>
            <div className="space-y-1 text-[10px] min-w-0 flex-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>CUFE (Código Único de Factura Electrónica) - DIAN</span>
              </div>
              <div className="font-mono text-slate-600 break-all leading-tight bg-white p-1.5 rounded border border-slate-200">
                {factura.archivoSimuladoData?.cufe || 'a89c20184b912e912401824b019824b01924b01924109284102948120'}
              </div>
              <div className="text-slate-500">
                Validado electrónicamente · Fecha y hora de transmisión: {factura.archivoSimuladoData?.fechaValidacionDian || `${factura.fecha} 12:00:00 COT`}
              </div>
            </div>
          </div>

          {/* Audit Verification */}
          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-500 gap-2">
            <span>Archivo original: <strong>{factura.archivoNombre}</strong></span>
            <span className="flex items-center gap-1 font-semibold text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Estado: {factura.estado.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
