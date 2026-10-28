import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCOP, formatCOPShort, formatFecha } from '../../utils/formatters';
import { ReposicionCiclo } from '../../types';
import { 
  Wallet, 
  RefreshCw, 
  CheckCircle2, 
  ArrowRight, 
  Building, 
  FileText, 
  AlertCircle,
  Receipt,
  Scale,
  Landmark,
  ShieldCheck,
  Send
} from 'lucide-react';

export const FondoReposicionModule: React.FC = () => {
  const { 
    fondoFijoTotal,
    efectivoDisponible,
    anticiposEnTransito,
    facturasAprobadasTotal,
    facturas,
    reposiciones,
    currentUser,
    solicitarReposicion,
    aprobarReposicion
  } = useApp();

  const [selectedFacturas, setSelectedFacturas] = useState<string[]>([]);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Gerente Approval modal state
  const [approvalModalRep, setApprovalModalRep] = useState<ReposicionCiclo | null>(null);
  const [bancoCuenta, setBancoCuenta] = useState('Bancolombia Cta Cte No. 450-992019-12 (Somos Uno)');
  const [referenciaTransferencia, setReferenciaTransferencia] = useState('');

  // Facturas aprobadas que NO han sido incluidas en una reposición previa
  const facturasAprobadasDisponibles = facturas.filter(
    f => f.estado === 'aprobada' && !f.incluidaEnReposicionId
  );

  const totalSeleccionado = facturasAprobadasDisponibles
    .filter(f => selectedFacturas.includes(f.id))
    .reduce((sum, f) => sum + f.valorTotal, 0);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedFacturas(facturasAprobadasDisponibles.map(f => f.id));
    } else {
      setSelectedFacturas([]);
    }
  };

  const handleToggleFactura = (id: string) => {
    setSelectedFacturas(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleCreateReposicion = () => {
    setErrorMsg(null);
    if (selectedFacturas.length === 0) {
      setErrorMsg('Debe seleccionar al menos una factura aprobada para solicitar reposición.');
      return;
    }

    const res = solicitarReposicion(selectedFacturas);
    if (res.success) {
      setSuccessMsg(res.message);
      setSelectedFacturas([]);
      setTimeout(() => setSuccessMsg(null), 4500);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleExecuteAprobacion = () => {
    if (!approvalModalRep) return;
    if (!referenciaTransferencia.trim()) {
      alert('Por favor ingrese el número o referencia de la transferencia bancaria de desembolso.');
      return;
    }

    const res = aprobarReposicion(approvalModalRep.id, bancoCuenta, referenciaTransferencia);
    if (res.success) {
      setSuccessMsg(res.message);
      setApprovalModalRep(null);
      setReferenciaTransferencia('');
      setTimeout(() => setSuccessMsg(null), 4500);
    } else {
      alert(res.message);
    }
  };

  const isGerente = currentUser.role === 'gerente';
  const isCoordinador = currentUser.role === 'coordinador';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <span>Paso 9 del Proceso</span>
            <span>·</span>
            <span>Reintegro & Control del Fondo</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Administración del Fondo & Reposición
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Control del fondo fijo de $2.000.000 COP. La reposición se efectúa por el valor de los gastos aprobados y debidamente soportados para restablecer la liquidez de la Corporación.
          </p>
        </div>

        <div className="text-right bg-slate-50 p-3 rounded-lg border border-slate-200 shrink-0">
          <div className="text-[11px] text-slate-500">Fondo Fijo Estatutario</div>
          <div className="text-lg font-bold font-mono text-slate-900 tabular-nums">
            {formatCOP(fondoFijoTotal)}
          </div>
        </div>
      </div>

      {/* Notifications */}
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

      {errorMsg && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Fund Status & Dynamics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Box 1: Efectivo Físico */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 font-medium mb-1">Efectivo Físico en Custodia</div>
          <div className="text-2xl font-bold font-mono text-emerald-700 tabular-nums">
            {formatCOP(efectivoDisponible)}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Dinero líquido en caja fuerte disponible para nuevos desembolsos.
          </p>
        </div>

        {/* Box 2: Anticipos en Mano */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 font-medium mb-1">Anticipos Pendientes de Legalizar</div>
          <div className="text-2xl font-bold font-mono text-amber-600 tabular-nums">
            {formatCOP(anticiposEnTransito)}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Dinero entregado a colaboradores pendiente de entrega de factura.
          </p>
        </div>

        {/* Box 3: Gastos Aprobados */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 font-medium mb-1">Total Gastos Aprobados (Por Reponer)</div>
          <div className="text-2xl font-bold font-mono text-sky-700 tabular-nums">
            {formatCOP(facturasAprobadasTotal)}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Facturas validadas listas para solicitar reembolso a tesorería.
          </p>
        </div>
      </div>

      {/* Section 1: Iniciar Nueva Reposición */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Solicitar Reposición de Fondos
            </h2>
            <p className="text-xs text-slate-500">
              Seleccione las facturas y comprobantes soportados para solicitar el reembolso a Gerencia
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[11px] text-slate-500 block">Total a Reintegrar:</span>
              <span className="text-base font-bold font-mono text-slate-900 tabular-nums">
                {formatCOP(totalSeleccionado)}
              </span>
            </div>

            <button
              onClick={handleCreateReposicion}
              disabled={selectedFacturas.length === 0}
              className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors ${
                selectedFacturas.length > 0
                  ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-xs cursor-pointer'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              Radicar Reposición
            </button>
          </div>
        </div>

        {/* List of Facturas Disponibles */}
        {facturasAprobadasDisponibles.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-100">
            <Receipt className="w-6 h-6 text-slate-400 mx-auto mb-2" />
            <div className="text-xs font-semibold text-slate-700">No hay facturas pendientes de reposición</div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Todas las facturas aprobadas ya han sido incluidas en ciclos de reposición anteriores.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-2 text-xs font-medium text-slate-500">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedFacturas.length === facturasAprobadasDisponibles.length && facturasAprobadasDisponibles.length > 0}
                  onChange={handleSelectAll}
                  className="rounded text-slate-900 focus:ring-slate-900"
                />
                <span>Seleccionar todas ({facturasAprobadasDisponibles.length} facturas)</span>
              </label>
              <span>{selectedFacturas.length} seleccionadas</span>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {facturasAprobadasDisponibles.map((f) => {
                const isSelected = selectedFacturas.includes(f.id);
                return (
                  <div
                    key={f.id}
                    onClick={() => handleToggleFactura(f.id)}
                    className={`p-3.5 flex items-center justify-between text-xs cursor-pointer transition-colors ${
                      isSelected ? 'bg-slate-50/80' : 'hover:bg-slate-50/50 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}} // handled by row
                        className="rounded text-slate-900 focus:ring-slate-900 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 truncate">
                          {f.proveedor}
                          <span className="font-normal text-slate-500 ml-2 font-mono">{f.numeroFactura}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">{f.concepto}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {f.categoria} · {formatFecha(f.fecha)} · Solicitud: {f.solicitudId}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono font-bold text-slate-900 tabular-nums">
                        {formatCOP(f.valorTotal)}
                      </div>
                      <span className="text-[10px] font-medium text-emerald-700">Aprobada</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Section 2: Ciclos de Reposición (Historial y Aprobaciones Pendientes) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          Ciclos de Reposición Registrados
        </h2>
        <p className="text-xs text-slate-500">
          Historial de reintegros de fondos aprobados y ejecutados para mantener el saldo de $2.000.000 COP
        </p>

        <div className="space-y-3">
          {reposiciones.map((rep) => {
            const isPending = rep.estado === 'solicitada';

            return (
              <div
                key={rep.id}
                className={`p-4 rounded-xl border transition-colors ${
                  isPending ? 'bg-amber-50/30 border-amber-200' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono font-bold text-slate-900">{rep.id}</span>
                      <span>·</span>
                      <span className="text-slate-500">{formatFecha(rep.fechaSolicitud)}</span>
                      <span>·</span>
                      <span className="text-slate-600">{rep.facturasIds.length} facturas soportadas</span>
                    </div>

                    <div className="text-xs text-slate-700">
                      Solicitado por: <strong>{rep.solicitadoPor}</strong>
                    </div>

                    {rep.estado === 'desembolsada' && (
                      <div className="text-[11px] text-slate-500 space-y-0.5 pt-0.5">
                        <div>
                          Aprobado y Desembolsado por: <strong className="text-slate-800">{rep.aprobadoPor}</strong> ({rep.fechaAprobacion})
                        </div>
                        <div className="font-mono text-slate-600">
                          Origen: {rep.bancoCuentaOrigen} · Ref: {rep.referenciaTransferencia}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0 gap-2">
                    <div className="text-right">
                      <div className="text-base font-bold font-mono text-slate-900 tabular-nums">
                        {formatCOP(rep.valorTotal)}
                      </div>
                      <div className="text-[10px] font-semibold uppercase tracking-wider mt-0.5">
                        {rep.estado === 'solicitada' ? (
                          <span className="text-amber-700">Esperando Giro de Gerencia</span>
                        ) : (
                          <span className="text-emerald-700">Desembolsado · Fondo Restablecido</span>
                        )}
                      </div>
                    </div>

                    {/* Gerente approval button */}
                    {isPending && isGerente && (
                      <button
                        onClick={() => {
                          setApprovalModalRep(rep);
                          setReferenciaTransferencia(`TRANSF-${Date.now().toString().slice(-6)}`);
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs flex items-center gap-1.5"
                      >
                        <Landmark className="w-3.5 h-3.5" />
                        Aprobar y Desembolsar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Autorización de Giro por Gerencia */}
      {approvalModalRep && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Aprobación y Desembolso de Reposición
                </h2>
                <p className="text-xs text-slate-500">
                  Gerencia General · Dra. Keisy Niaza
                </p>
              </div>
              <button
                onClick={() => setApprovalModalRep(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Ciclo de Reposición:</span>
                <span className="font-mono font-bold text-slate-900">{approvalModalRep.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Monto a Restablecer:</span>
                <span className="font-mono font-bold text-emerald-700 text-sm">
                  {formatCOP(approvalModalRep.valorTotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Facturas Soportadas:</span>
                <span className="font-medium text-slate-900">{approvalModalRep.facturasIds.length} facturas aprobadas</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Cuenta Bancaria Institucional de Origen
                </label>
                <input
                  type="text"
                  value={bancoCuenta}
                  onChange={(e) => setBancoCuenta(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Número de Referencia de Transferencia / Comprobante de Egreso
                </label>
                <input
                  type="text"
                  value={referenciaTransferencia}
                  onChange={(e) => setReferenciaTransferencia(e.target.value)}
                  placeholder="Ej: TRANSF-981240"
                  className="w-full px-3 py-2 font-mono rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                  required
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setApprovalModalRep(null)}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleExecuteAprobacion}
                className="px-4 py-2 text-white bg-slate-900 hover:bg-slate-800 rounded-lg font-semibold text-xs shadow-xs"
              >
                Confirmar Desembolso y Restablecer Fondo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
