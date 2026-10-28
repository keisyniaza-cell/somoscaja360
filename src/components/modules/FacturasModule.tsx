import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FacturaRegistro, 
  EstadoFactura, 
  TipoDocumento, 
  ExpenseCategory, 
  CATEGORY_BUDGETS,
  LIMITE_MAX_COMPRA 
} from '../../types';
import { formatCOP, formatCOPShort, formatFecha } from '../../utils/formatters';
import { 
  Receipt, 
  PlusCircle, 
  Search, 
  FileCheck2, 
  Eye, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  FileText,
  Upload,
  ShieldCheck,
  Building,
  HelpCircle
} from 'lucide-react';

interface FacturasModuleProps {
  onViewFacturaModal: (factura: FacturaRegistro) => void;
  preselectedSolicitudId?: string | null;
  onClearPreselected?: () => void;
}

export const FacturasModule: React.FC<FacturasModuleProps> = ({ 
  onViewFacturaModal,
  preselectedSolicitudId,
  onClearPreselected
}) => {
  const { 
    facturas, 
    solicitudes, 
    currentUser, 
    registrarFactura, 
    revisarFactura 
  } = useApp();

  const [filterEstado, setFilterEstado] = useState<string>('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(!!preselectedSolicitudId);
  const [reviewModalData, setReviewModalData] = useState<{ id: string; estado: EstadoFactura } | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    solicitudId: preselectedSolicitudId || (solicitudes.find(s => s.estado === 'entregada' || s.estado === 'aprobada')?.id || ''),
    numeroFactura: '',
    tipoDocumento: 'Factura Electrónica de Venta' as TipoDocumento,
    fecha: new Date().toISOString().split('T')[0],
    proveedor: '',
    nit: '',
    concepto: '',
    categoria: 'Materiales para actividades comunitarias' as ExpenseCategory,
    valorAntesImpuestos: 0,
    impuestos: 0,
    valorTotal: 0,
    areaProyecto: 'Proyecto Jóvenes con Futuro',
    archivoNombre: 'Soporte_Factura_Digital.pdf',
    archivoTipo: 'pdf' as 'pdf' | 'xml' | 'imagen',
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Auto calculate total
  const handleSubtotalChange = (val: number) => {
    const iva = Math.round(val * 0.19);
    setFormData(prev => ({
      ...prev,
      valorAntesImpuestos: val,
      impuestos: iva,
      valorTotal: val + iva,
    }));
  };

  const handleTotalChange = (total: number) => {
    const base = Math.round(total / 1.19);
    const iva = total - base;
    setFormData(prev => ({
      ...prev,
      valorAntesImpuestos: base,
      impuestos: iva,
      valorTotal: total,
    }));
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.solicitudId) {
      setFormError('Debe asociar la factura a una solicitud autorizada de caja menor.');
      return;
    }
    if (!formData.numeroFactura.trim()) {
      setFormError('Ingrese el número consecutivo de la factura o documento soporte.');
      return;
    }
    if (!formData.proveedor.trim()) {
      setFormError('Ingrese el nombre o razón social del proveedor.');
      return;
    }
    if (!formData.nit.trim()) {
      setFormError('Ingrese el NIT o documento de identidad del proveedor.');
      return;
    }
    if (formData.valorTotal <= 0) {
      setFormError('El valor total debe ser mayor a cero.');
      return;
    }
    if (formData.valorTotal > LIMITE_MAX_COMPRA) {
      setFormError(`El valor no puede superar el límite estatutario de ${formatCOP(LIMITE_MAX_COMPRA)}.`);
      return;
    }

    // Verify if valor is greater than requested
    const relatedSol = solicitudes.find(s => s.id === formData.solicitudId);
    if (relatedSol && formData.valorTotal > relatedSol.valorEstimado * 1.15) {
      const confirmOver = window.confirm(
        `El valor de la factura (${formatCOP(formData.valorTotal)}) supera en más del 15% el valor inicialmente autorizado (${formatCOP(relatedSol.valorEstimado)}). ¿Desea continuar con el registro para revisión administrativa?`
      );
      if (!confirmOver) return;
    }

    const res = registrarFactura({
      solicitudId: formData.solicitudId,
      numeroFactura: formData.numeroFactura,
      tipoDocumento: formData.tipoDocumento,
      fecha: formData.fecha,
      proveedor: formData.proveedor,
      nit: formData.nit,
      concepto: formData.concepto,
      categoria: formData.categoria,
      valorAntesImpuestos: Number(formData.valorAntesImpuestos),
      impuestos: Number(formData.impuestos),
      valorTotal: Number(formData.valorTotal),
      responsable: currentUser.name,
      areaProyecto: formData.areaProyecto,
      archivoNombre: formData.archivoNombre,
      archivoTipo: formData.archivoTipo,
      archivoSimuladoData: {
        cufe: `dian-${Math.random().toString(36).substring(2, 12)}-${Math.random().toString(36).substring(2, 12)}`,
        fechaValidacionDian: `${formData.fecha} 15:30:00 COT`,
        items: [
          {
            descripcion: formData.concepto,
            cantidad: 1,
            unitario: Number(formData.valorAntesImpuestos),
            subtotal: Number(formData.valorAntesImpuestos),
          }
        ]
      }
    });

    if (res.success) {
      setSuccessMsg(res.message);
      setShowRegisterModal(false);
      if (onClearPreselected) onClearPreselected();
      setFormData({
        solicitudId: '',
        numeroFactura: '',
        tipoDocumento: 'Factura Electrónica de Venta',
        fecha: new Date().toISOString().split('T')[0],
        proveedor: '',
        nit: '',
        concepto: '',
        categoria: 'Materiales para actividades comunitarias',
        valorAntesImpuestos: 0,
        impuestos: 0,
        valorTotal: 0,
        areaProyecto: 'Proyecto Jóvenes con Futuro',
        archivoNombre: 'Soporte_Factura_Digital.pdf',
        archivoTipo: 'pdf',
      });
      setTimeout(() => setSuccessMsg(null), 4500);
    } else {
      setFormError(res.message);
    }
  };

  const handleReviewSubmit = () => {
    if (!reviewModalData) return;
    const res = revisarFactura(reviewModalData.id, reviewModalData.estado, reviewNotes);
    if (res.success) {
      setSuccessMsg(res.message);
      setReviewModalData(null);
      setReviewNotes('');
      setTimeout(() => setSuccessMsg(null), 3500);
    }
  };

  // Filtered invoices
  const filtered = facturas.filter(f => {
    const matchesFilter = filterEstado === 'todas' || f.estado === filterEstado;
    const matchesSearch = 
      f.numeroFactura.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.proveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.concepto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.nit.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const canReview = currentUser.role === 'coordinador' || currentUser.role === 'contador';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <span>Paso 4 del Proceso</span>
            <span>·</span>
            <span>Gestión Documental & DIAN</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Registro y Legalización de Facturas
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Control fiscal de compras, archivo de soportes en PDF/XML, prevención de registros duplicados y validación contable.
          </p>
        </div>

        <button
          onClick={() => {
            setFormError(null);
            setShowRegisterModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Registrar Factura
        </button>
      </div>

      {/* Success Banner */}
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
        <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-100 rounded-lg shrink-0">
          {[
            { id: 'todas', label: 'Todas' },
            { id: 'registrada', label: 'Registradas' },
            { id: 'en_revision', label: 'En Revisión' },
            { id: 'aprobada', label: 'Aprobadas' },
            { id: 'pendiente_correccion', label: 'Con Observaciones' },
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

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por NIT, proveedor o factura..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900"
          />
        </div>
      </div>

      {/* Invoice Cards / Table */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
            <Receipt className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-900">No hay facturas registradas</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No se encontraron documentos tributarios en este estado.
            </p>
          </div>
        ) : (
          filtered.map((fac) => {
            return (
              <div
                key={fac.id}
                className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Left Column */}
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono font-bold text-slate-900">{fac.numeroFactura}</span>
                      <span>·</span>
                      <span className="font-semibold text-slate-700">{fac.tipoDocumento}</span>
                      <span>·</span>
                      <span>{formatFecha(fac.fecha)}</span>
                      <span>·</span>
                      <span className="text-slate-600">{fac.categoria}</span>
                      <span>·</span>
                      <span className="font-mono text-slate-500">{fac.solicitudId}</span>
                    </div>

                    <div>
                      <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <span>{fac.proveedor}</span>
                        <span className="text-xs font-mono font-normal text-slate-500">NIT/CC: {fac.nit}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {fac.concepto}
                      </p>
                    </div>

                    {/* Metadata & Review trail */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                      <span>Responsable: <strong className="text-slate-800">{fac.responsable}</strong></span>
                      <span>·</span>
                      <span>Área: <strong className="text-slate-800">{fac.areaProyecto}</strong></span>
                      {fac.revisadoPor && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-1 text-slate-700">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            Revisó: <strong>{fac.revisadoPor}</strong>
                          </span>
                        </>
                      )}
                      {fac.incluidaEnReposicionId && (
                        <>
                          <span>·</span>
                          <span className="text-emerald-700 font-medium">
                            Repuesta en {fac.incluidaEnReposicionId}
                          </span>
                        </>
                      )}
                    </div>

                    {fac.observacionesRevision && (
                      <div className="p-2.5 bg-amber-50/80 border border-amber-200/60 rounded-lg text-xs text-amber-900">
                        <strong>Observaciones de Revisión:</strong> {fac.observacionesRevision}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Values & Actions */}
                  <div className="flex lg:flex-col items-center lg:items-end justify-between border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100 shrink-0 gap-3">
                    <div className="text-left lg:text-right">
                      <div className="text-base font-bold font-mono text-slate-900 tabular-nums">
                        {formatCOP(fac.valorTotal)}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono tabular-nums">
                        Subtotal: {formatCOPShort(fac.valorAntesImpuestos)} · IVA: {formatCOPShort(fac.impuestos)}
                      </div>
                      <div className="text-[11px] font-semibold uppercase tracking-wider mt-0.5">
                        {fac.estado === 'registrada' && <span className="text-amber-700">Registrada · Pendiente</span>}
                        {fac.estado === 'en_revision' && <span className="text-sky-700">En Revisión Contable</span>}
                        {fac.estado === 'aprobada' && <span className="text-emerald-700">Aprobada · Aceptada DIAN</span>}
                        {fac.estado === 'pendiente_correccion' && <span className="text-amber-800">Requiere Corrección</span>}
                        {fac.estado === 'rechazada' && <span className="text-rose-700">Rechazada</span>}
                      </div>
                    </div>

                    {/* Operational Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewFacturaModal(fac)}
                        className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Ver Soporte
                      </button>

                      {/* Review Buttons for Coordinador or Contador */}
                      {canReview && fac.estado !== 'aprobada' && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setReviewModalData({ id: fac.id, estado: 'aprobada' });
                              setReviewNotes('');
                            }}
                            className="px-2.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Aprobar
                          </button>
                          <button
                            onClick={() => {
                              setReviewModalData({ id: fac.id, estado: 'pendiente_correccion' });
                              setReviewNotes('');
                            }}
                            className="px-2.5 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                          >
                            Observar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Registrar Factura */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Legalización de Gasto / Factura
                </h2>
                <p className="text-xs text-slate-500">
                  Ingrese los datos fiscales del documento y adjunte el soporte
                </p>
              </div>
              <button
                onClick={() => {
                  setShowRegisterModal(false);
                  if (onClearPreselected) onClearPreselected();
                }}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
              {/* Linked Request */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Solicitud Previamente Autorizada
                </label>
                <select
                  value={formData.solicitudId}
                  onChange={(e) => {
                    const sol = solicitudes.find(s => s.id === e.target.value);
                    setFormData(prev => ({
                      ...prev,
                      solicitudId: e.target.value,
                      areaProyecto: sol ? sol.areaProyecto : prev.areaProyecto,
                      categoria: sol ? sol.categoria : prev.categoria,
                      concepto: sol ? sol.concepto : prev.concepto,
                    }));
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                  required
                >
                  <option value="">-- Seleccionar solicitud autorizada --</option>
                  {solicitudes.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.id} - {s.concepto} ({formatCOPShort(s.valorEstimado)}) [{s.estado}]
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tipo de Documento
                  </label>
                  <select
                    value={formData.tipoDocumento}
                    onChange={(e) => setFormData({ ...formData, tipoDocumento: e.target.value as TipoDocumento })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                  >
                    <option value="Factura Electrónica de Venta">Factura Electrónica de Venta</option>
                    <option value="Documento Soporte a No Obligados">Documento Soporte a No Obligados</option>
                    <option value="Documento Equivalente">Documento Equivalente (POS / Servicios)</option>
                    <option value="Comprobante Interno de Caja">Comprobante Interno de Caja</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Número de Factura / Consecutivo
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: FE-10928 ó DS-0051"
                    value={formData.numeroFactura}
                    onChange={(e) => setFormData({ ...formData, numeroFactura: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Proveedor (Razón Social o Nombre)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Distribuidora El Sol S.A.S."
                    value={formData.proveedor}
                    onChange={(e) => setFormData({ ...formData, proveedor: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    NIT o Cédula del Proveedor
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: 900.321.455-8"
                    value={formData.nit}
                    onChange={(e) => setFormData({ ...formData, nit: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Concepto / Descripción del Producto o Servicio
                </label>
                <input
                  type="text"
                  placeholder="Detalle los artículos o servicios adquiridos..."
                  value={formData.concepto}
                  onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Valor Antes Impuestos
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.valorAntesImpuestos}
                    onChange={(e) => handleSubtotalChange(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-mono tabular-nums focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    IVA / Impuestos
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.impuestos}
                    onChange={(e) => {
                      const iva = Number(e.target.value);
                      setFormData(prev => ({
                        ...prev,
                        impuestos: iva,
                        valorTotal: prev.valorAntesImpuestos + iva,
                      }));
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-mono tabular-nums focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Valor Total (COP)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="300000"
                    value={formData.valorTotal}
                    onChange={(e) => handleTotalChange(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-mono tabular-nums font-bold focus:outline-hidden focus:ring-1 focus:ring-slate-900 text-slate-900"
                    required
                  />
                </div>
              </div>

              {/* File upload simulated / real drag drop */}
              <div className="border border-dashed border-slate-300 rounded-xl p-4 bg-slate-50 text-center space-y-1">
                <Upload className="w-5 h-5 text-slate-400 mx-auto" />
                <div className="font-semibold text-slate-800">
                  {formData.archivoNombre}
                </div>
                <div className="text-[11px] text-slate-500">
                  Soporte digital vinculado (PDF o XML original legible con validez fiscal)
                </div>
                <div className="pt-1">
                  <input 
                    type="file" 
                    id="file-upload" 
                    className="hidden" 
                    accept=".pdf,.xml,.png,.jpg,.jpeg"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFormData({
                          ...formData,
                          archivoNombre: e.target.files[0].name,
                          archivoTipo: e.target.files[0].name.endsWith('.xml') ? 'xml' : 'pdf',
                        });
                      }
                    }}
                  />
                  <label 
                    htmlFor="file-upload" 
                    className="inline-block px-3 py-1 bg-white border border-slate-200 rounded text-[11px] font-semibold text-slate-700 cursor-pointer hover:bg-slate-100"
                  >
                    Examinar archivo...
                  </label>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-slate-900 hover:bg-slate-800 rounded-lg font-semibold shadow-xs"
                >
                  Registrar Documento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Observaciones de Revisión */}
      {reviewModalData && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              {reviewModalData.estado === 'aprobada' ? 'Aprobar Factura' : 'Observación para Corrección'}
            </h3>
            <p className="text-xs text-slate-500">
              {reviewModalData.estado === 'aprobada'
                ? 'El gasto cumple los controles tributarios y normativos internos.'
                : 'Indique qué debe corregir o aportar el colaborador (ej: RUT, detalle de ítems, soporte legible).'}
            </p>
            <textarea
              rows={3}
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Notas contables u observaciones de revisión..."
              className="w-full p-2.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900 resize-none"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setReviewModalData(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancelar
              </button>
              <button
                onClick={handleReviewSubmit}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
