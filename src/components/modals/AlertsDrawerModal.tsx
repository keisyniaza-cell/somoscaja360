import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatFecha } from '../../utils/formatters';
import { ActiveModule } from '../Sidebar';
import { 
  Bell, 
  X, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';

interface AlertsDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (module: ActiveModule) => void;
}

export const AlertsDrawerModal: React.FC<AlertsDrawerModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const { alertas, resolverAlerta } = useApp();

  if (!isOpen) return null;

  const activeAlerts = alertas.filter(a => !a.resuelta);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-slate-800" />
            <h3 className="text-sm font-bold text-slate-900">
              Alertas Automatizadas del Sistema
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeAlerts.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
              <div className="text-xs font-semibold text-slate-700">No hay alertas pendientes</div>
              <p className="text-[11px] text-slate-500 mt-0.5">Todos los procesos de caja menor se encuentran al día.</p>
            </div>
          ) : (
            activeAlerts.map((alerta) => (
              <div
                key={alerta.id}
                className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                  alerta.tipo === 'warning'
                    ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                    : alerta.tipo === 'danger'
                    ? 'bg-rose-50 border-rose-200 text-rose-950'
                    : 'bg-sky-50 border-sky-200 text-sky-950'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold flex items-center gap-1.5">
                    {alerta.tipo === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                    {alerta.tipo === 'info' && <Info className="w-3.5 h-3.5 text-sky-600 shrink-0" />}
                    <span>{alerta.titulo}</span>
                  </div>
                  <button
                    onClick={() => resolverAlerta(alerta.id)}
                    className="text-[10px] opacity-60 hover:opacity-100 underline shrink-0"
                  >
                    Descartar
                  </button>
                </div>

                <p className="text-[11px] leading-relaxed opacity-90">
                  {alerta.mensaje}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-black/5 text-[10px]">
                  <span className="opacity-70">{formatFecha(alerta.fecha)}</span>
                  <button
                    onClick={() => {
                      onNavigate(alerta.moduloTarget as ActiveModule);
                      onClose();
                    }}
                    className="font-semibold underline flex items-center gap-0.5 hover:opacity-80"
                  >
                    Ir al módulo
                    <ArrowRight className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-3 border-t border-slate-200 bg-slate-50 text-center text-[11px] text-slate-500">
          Supervisión preventiva para el Fondo de Caja Menor ($2.000.000 COP)
        </div>
      </div>
    </div>
  );
};
