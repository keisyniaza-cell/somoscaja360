import React from 'react';
import { SolicitudGasto } from '../../types';
import { formatCOP, formatFecha } from '../../utils/formatters';
import { DollarSign, Printer, X, CheckCircle2 } from 'lucide-react';

interface ComprobanteEntregaModalProps {
  solicitud: SolicitudGasto | null;
  onClose: () => void;
}

export const ComprobanteEntregaModal: React.FC<ComprobanteEntregaModalProps> = ({ solicitud, onClose }) => {
  if (!solicitud) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Comprobante de Entrega de Efectivo
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
              title="Imprimir"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4 text-xs font-sans">
          {/* Header */}
          <div className="border-b border-slate-200 pb-3 flex justify-between items-start">
            <div>
              <div className="font-bold text-slate-900 text-sm">CORPORACIÓN SOCIAL SOMOS UNO</div>
              <div className="text-[11px] text-slate-500">NIT: 900.821.554-1 · Caja Menor</div>
              <div className="text-[10px] text-slate-500">Comprobante Interno de Egreso Provisional</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Radicado</span>
              <span className="font-mono font-bold text-slate-900 text-xs">{solicitud.id}</span>
              <div className="text-[10px] text-slate-500">{solicitud.fechaEntrega || 'Fecha actual'}</div>
            </div>
          </div>

          {/* Body */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Valor Entregado en Efectivo:</span>
              <span className="font-mono font-bold text-emerald-800 text-sm">
                {formatCOP(solicitud.valorEstimado)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Entregado a:</span>
              <span className="font-semibold text-slate-900">{solicitud.solicitanteNombre}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Área / Proyecto:</span>
              <span className="text-slate-800">{solicitud.areaProyecto}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Categoría:</span>
              <span className="text-slate-800">{solicitud.categoria}</span>
            </div>
          </div>

          <div>
            <span className="text-slate-500 block mb-0.5 font-medium">Concepto Autorizado:</span>
            <p className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800">
              {solicitud.concepto}
            </p>
          </div>

          <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-[10px] text-amber-900 leading-relaxed">
            <strong>Compromiso de Legalización:</strong> El receptor se compromete a presentar las facturas electrónicas o documentos soporte debidamente válidos y con el cumplimiento de requisitos tributarios dentro del plazo reglamentario estipulado en las políticas de la Corporación.
          </div>

          {/* Signatures */}
          <div className="pt-6 grid grid-cols-2 gap-6 text-center text-[11px]">
            <div className="border-t border-slate-300 pt-1">
              <div className="font-semibold text-slate-900">{solicitud.custodioEntrega || 'Carlos Restrepo'}</div>
              <div className="text-[10px] text-slate-500">Custodio de Caja Menor (Entrega)</div>
            </div>

            <div className="border-t border-slate-300 pt-1">
              <div className="font-semibold text-slate-900">{solicitud.solicitanteNombre}</div>
              <div className="text-[10px] text-slate-500">Colaborador(a) Receptor (Recibe Conforme)</div>
            </div>
          </div>
        </div>

        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg"
          >
            Aceptar y Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
