import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SolicitudGasto, SolicitudEstado, ExpenseCategory, CATEGORY_BUDGETS, LIMITE_MAX_COMPRA } from '../../types';
import { formatCOP, formatCOPShort, formatFecha } from '../../utils/formatters';
import { 
  FileText, 
  PlusCircle, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  DollarSign, 
  ArrowRight,
  AlertCircle,
  Building,
  User,
  Clock
} from 'lucide-react';

interface SolicitudesModuleProps {
  onOpenLegalizar: (solicitud: SolicitudGasto) => void;
  onOpenComprobanteEntrega?: (solicitud: SolicitudGasto) => void;
}

export const SolicitudesModule: React.FC<SolicitudesModuleProps> = ({ 
  onOpenLegalizar,
  onOpenComprobanteEntrega 
}) => {
  const { 
    solicitudes, 
    currentUser, 
    createSolicitud, 
    autorizarSolicitud, 
    entregarDineroAnticipo,
    efectivoDisponible
  } = useApp();

  const [filterEstado, setFilterEstado] = useState<string>('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [rejectModalId, setRejectModalId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Form state for new request
  const [formData, setFormData] = useState<{
    concepto: string;
    justificacion: string;
    categoria: ExpenseCategory;
    valorEstimado: number;
    areaProyecto: string;
  }>({
    concepto: '',
    justificacion: '',
    categoria: 'Materiales para actividades comunitarias',
    valorEstimado: 150000,
    areaProyecto: 'Proyecto Jóvenes con Futuro',
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Filtered requests
  const filtered = solicitudes.filter(s => {
    const matchesFilter = filterEstado === 'todas' || s.estado === filterEstado;
    const matchesSearch = 
      s.concepto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.solicitanteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.areaProyecto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.concepto.trim()) {
      setFormError('Por favor especifique el concepto de compra.');
      return;
    }
    if (!formData.justificacion.trim()) {
      setFormError('Debe ingresar la justificación social o administrativa del gasto.');
      return;
    }
    if (formData.valorEstimado <= 0) {
      setFormError('El valor debe ser superior a cero.');
      return;
    }
    if (formData.valorEstimado > LIMITE_MAX_COMPRA) {
      setFormError(`El valor no puede superar el límite institucional de ${formatCOP(LIMITE_MAX_COMPRA)}.`);
      return;
    }

    const res = createSolicitud({
      concepto: formData.concepto,
      justificacion: formData.justificacion,
      categoria: formData.categoria,
      valorEstimado: Number(formData.valorEstimado),
      areaProyecto: formData.areaProyecto,
    });

    if (res.success) {
      setSuccessMsg(res.message);
      setShowModal(false);
      setFormData({
        concepto: '',
        justificacion: '',
        categoria: 'Materiales para actividades comunitarias',
        valorEstimado: 150000,
        areaProyecto: 'Proyecto Jóvenes con Futuro',
      });
      setTimeout(() => setSuccessMsg(null), 4000);
    } else {
      setFormError(res.message);
    }
  };

  const handleApprove = (id: string) => {
    const res = autorizarSolicitud(id, true);
    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => setSuccessMsg(null), 3500);
    }
  };

  const handleReject = () => {
    if (!rejectModalId) return;
    const res = autorizarSolicitud(rejectModalId, false, rejectReason);
    if (res.success) {
      setSuccessMsg(res.message);
      setRejectModalId(null);
      setRejectReason('');
      setTimeout(() => setSuccessMsg(null), 3500);
    }
  };

  const handleDisburse = (sol: SolicitudGasto) => {
    const res = entregarDineroAnticipo(sol.id);
    if (res.success) {
      setSuccessMsg(res.message);
      if (onOpenComprobanteEntrega) {
        onOpenComprobanteEntrega(sol);
      }
      setTimeout(() => setSuccessMsg(null), 4000);
    } else {
      alert(res.message);
    }
  };

  const canApprove = currentUser.role === 'gerente' || currentUser.role === 'coordinador';
  const canDisburse = currentUser.role === 'custodio';

  return (
    <div className="space-y-6">
      {/* Header with Title and Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <span>Paso 2 del Proceso</span>
            <span>·</span>
            <span>Reglamento Fondo Fijo Somos Uno</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Solicitudes y Autorizaciones de Gasto
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Toda erogación de caja menor debe ser solicitada previamente y contar con autorización expresa antes de entregar el efectivo.
          </p>
        </div>

        <button
          onClick={() => {
            setFormError(null);
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Nueva Solicitud
        </button>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-700 font-semibold hover:underline">
            Cerrar
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-100 rounded-lg shrink-0">
          {[
            { id: 'todas', label: 'Todas' },
            { id: 'pendiente', label: 'Pendientes' },
            { id: 'aprobada', label: 'Aprobadas' },
            { id: 'entregada', label: 'Con Anticipo' },
            { id: 'legalizada', label: 'Legalizadas' },
            { id: 'rechazada', label: 'Rechazadas' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterEstado(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                filterEstado === tab.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por concepto, área..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900"
          />
        </div>
      </div>

      {/* Solicitudes List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
            <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-900">No se encontraron solicitudes</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No hay solicitudes que coincidan con los filtros aplicados.
            </p>
          </div>
        ) : (
          filtered.map((sol) => {
            return (
              <div
                key={sol.id}
                className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Left: Info */}
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono font-bold text-slate-900">{sol.id}</span>
                      <span>·</span>
                      <span>{formatFecha(sol.fecha)}</span>
                      <span>·</span>
                      <span className="font-medium text-slate-700">{sol.areaProyecto}</span>
                      <span>·</span>
                      <span className="text-slate-600">{sol.categoria}</span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {sol.concepto}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        <strong className="text-slate-700 font-medium">Justificación: </strong>
                        {sol.justificacion}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Solicitante: <strong className="text-slate-800">{sol.solicitanteNombre}</strong></span>
                      </div>

                      {sol.autorizadoPor && (
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Autorizó: <strong className="text-slate-800">{sol.autorizadoPor}</strong> ({sol.fechaAutorizacion})</span>
                        </div>
                      )}

                      {sol.dineroEntregado && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Efectivo entregado por: <strong className="text-slate-800">{sol.custodioEntrega}</strong></span>
                        </div>
                      )}

                      {sol.motivoRechazo && (
                        <div className="flex items-center gap-1.5 text-rose-600">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Motivo de rechazo: {sol.motivoRechazo}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Amount & Actions */}
                  <div className="flex lg:flex-col items-center lg:items-end justify-between border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100 shrink-0 gap-3">
                    <div className="text-left lg:text-right">
                      <div className="text-base font-bold font-mono text-slate-900 tabular-nums">
                        {formatCOP(sol.valorEstimado)}
                      </div>
                      <div className="text-[11px] font-semibold uppercase tracking-wider mt-0.5">
                        {sol.estado === 'pendiente' && <span className="text-amber-700">Pendiente Autorización</span>}
                        {sol.estado === 'aprobada' && <span className="text-sky-700">Aprobada · Sin Desembolsar</span>}
                        {sol.estado === 'entregada' && <span className="text-amber-700">Anticipo en Tránsito</span>}
                        {sol.estado === 'legalizada' && <span className="text-emerald-700">Legalizada con Factura</span>}
                        {sol.estado === 'rechazada' && <span className="text-rose-700">Rechazada</span>}
                      </div>
                    </div>

                    {/* Operational Action buttons */}
                    <div className="flex items-center gap-2">
                      {/* Step: Authorize (Gerente or Coordinador) */}
                      {sol.estado === 'pendiente' && canApprove && (
                        <>
                          <button
                            onClick={() => handleApprove(sol.id)}
                            className="px-2.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Aprobar
                          </button>
                          <button
                            onClick={() => {
                              setRejectModalId(sol.id);
                              setRejectReason('');
                            }}
                            className="px-2.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Rechazar
                          </button>
                        </>
                      )}

                      {/* Step: Disburse money (Custodio) */}
                      {sol.estado === 'aprobada' && canDisburse && (
                        <button
                          onClick={() => handleDisburse(sol)}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                        >
                          <DollarSign className="w-3.5 h-3.5" />
                          Entregar Dinero
                        </button>
                      )}

                      {/* Step: Legalize with invoice (Colaborador or anyone) */}
                      {sol.estado === 'entregada' && (
                        <button
                          onClick={() => onOpenLegalizar(sol)}
                          className="px-3 py-1.5 text-xs font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200/60 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Legalizar con Factura
                          <ArrowRight className="w-3 h-3 ml-0.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Nueva Solicitud */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Radicar Solicitud de Dinero
                </h2>
                <p className="text-xs text-slate-500">
                  Límite máximo por compra: $300.000 COP
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Área o Proyecto de Impacto
                </label>
                <select
                  value={formData.areaProyecto}
                  onChange={(e) => setFormData({ ...formData, areaProyecto: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                >
                  <option value="Proyecto Jóvenes con Futuro">Proyecto Jóvenes con Futuro</option>
                  <option value="Sembrando Paz Comunal">Sembrando Paz Comunal</option>
                  <option value="Proyecto Red de Mujeres Emprendedoras">Proyecto Red de Mujeres Emprendedoras</option>
                  <option value="Atención Primera Infancia">Atención Primera Infancia</option>
                  <option value="Campaña de Sensibilización Nutricional">Campaña de Sensibilización Nutricional</option>
                  <option value="Sede Administrativa Central">Sede Administrativa Central</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Categoría de Gasto
                </label>
                <select
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value as ExpenseCategory })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                >
                  {(Object.keys(CATEGORY_BUDGETS) as ExpenseCategory[]).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat} (Techo: {formatCOPShort(CATEGORY_BUDGETS[cat])})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Concepto de la Compra / Bien o Servicio
                </label>
                <input
                  type="text"
                  placeholder="Ej: Materiales para taller comunitario de jóvenes"
                  value={formData.concepto}
                  onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Justificación
                </label>
                <textarea
                  rows={2}
                  placeholder="Explique la necesidad y vinculación con las actividades de Somos Uno..."
                  value={formData.justificacion}
                  onChange={(e) => setFormData({ ...formData, justificacion: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Valor Aproximado (COP)</span>
                  <span className="text-[11px] text-slate-500 font-normal">Máx: $300.000 COP</span>
                </label>
                <input
                  type="number"
                  min="1000"
                  max="300000"
                  step="1000"
                  value={formData.valorEstimado}
                  onChange={(e) => setFormData({ ...formData, valorEstimado: Number(e.target.value) })}
                  className="w-full px-3 py-2 font-mono tabular-nums text-sm font-semibold rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-slate-900 hover:bg-slate-800 rounded-lg font-semibold shadow-xs"
                >
                  Radicar Solicitud
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Rechazar Solicitud */}
      {rejectModalId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              Rechazar Solicitud {rejectModalId}
            </h3>
            <p className="text-xs text-slate-500">
              Por favor indique el motivo de rechazo conforme a las políticas internas de la Corporación.
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Ej: El concepto no corresponde a gastos de caja menor o el soporte no es viable..."
              className="w-full p-2.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-rose-500 resize-none"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectModalId(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancelar
              </button>
              <button
                onClick={handleReject}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
              >
                Confirmar Rechazo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
