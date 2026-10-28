import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatFecha, downloadCSV } from '../../utils/formatters';
import { 
  ShieldCheck, 
  Search, 
  Download, 
  Lock, 
  User, 
  Clock, 
  Fingerprint,
  FileText
} from 'lucide-react';

export const AuditoriaModule: React.FC = () => {
  const { auditLogs } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.accion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.detalles.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.modulo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesModule = moduleFilter === 'ALL' || log.modulo === moduleFilter;
    return matchesSearch && matchesModule;
  });

  const handleExportLogs = () => {
    const headers = ['ID Log', 'Fecha y Hora', 'Usuario', 'Rol Institucional', 'Acción', 'Módulo', 'Detalles de la Operación', 'IP Auditoría'];
    const rows = auditLogs.map(l => [
      l.id,
      l.timestamp,
      l.usuario,
      l.rol,
      l.accion,
      l.modulo,
      l.detalles,
      l.ipSimulada
    ]);
    downloadCSV('Bitacora_Auditoria_SomosCaja_360', headers, rows);
  };

  const modulesList = Array.from(new Set(auditLogs.map(l => l.modulo)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <span>Seguridad Avanzada & Trazabilidad</span>
            <span>·</span>
            <span>Norma NIIF & Control Interno</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Registro de Auditoría & Trazabilidad (Audit Trail)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Historial inmutable de cada transacción, autorización, desembolso, modificación y arqueo efectuado en el sistema de caja menor.
          </p>
        </div>

        <button
          onClick={handleExportLogs}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          Descargar Bitácora CSV
        </button>
      </div>

      {/* Security Principles Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-start gap-3">
          <div className="p-2 bg-slate-100 rounded-lg text-slate-800 shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Segregación de Funciones</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              Quien solicita no puede autorizar, custodiar ni auditar sus propias operaciones, garantizando transparencia.
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-start gap-3">
          <div className="p-2 bg-slate-100 rounded-lg text-slate-800 shrink-0">
            <Fingerprint className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Firmas Digitales & Huellas</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              Cada aprobación queda sellada con marca de tiempo, usuario autenticado e identificador único de operación.
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-start gap-3">
          <div className="p-2 bg-slate-100 rounded-lg text-slate-800 shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Preparación para Auditorías</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              Registros listos para inspección de Revisoría Fiscal, DIAN y donantes de cooperación internacional.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-100 rounded-lg shrink-0">
          <button
            onClick={() => setModuleFilter('ALL')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              moduleFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todos los Módulos
          </button>
          {modulesList.map((m) => (
            <button
              key={m}
              onClick={() => setModuleFilter(m)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                moduleFilter === m ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por usuario, acción..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100 text-xs">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No se encontraron registros de auditoría para estos criterios.
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="p-4 hover:bg-slate-50/60 transition-colors space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-slate-500 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900">{log.id}</span>
                  <span>·</span>
                  <span className="font-mono">{log.timestamp}</span>
                  <span>·</span>
                  <span className="font-semibold text-slate-700">{log.modulo}</span>
                </div>
                <div className="font-mono text-slate-400">
                  IP: {log.ipSimulada}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pt-1">
                <div>
                  <div className="font-bold text-slate-900 text-xs">
                    {log.accion}
                  </div>
                  <div className="text-slate-600 text-xs mt-0.5 leading-relaxed">
                    {log.detalles}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-medium text-slate-800">{log.usuario}</span>
                  <span className="block text-[10px] text-slate-500">{log.rol}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
