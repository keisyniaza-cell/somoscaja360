import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCOP, formatCOPShort, formatFecha, downloadCSV } from '../../utils/formatters';
import { 
  CATEGORY_BUDGETS, 
  ExpenseCategory, 
  DenominacionesConteo, 
  FONDO_FIJO_TOTAL 
} from '../../types';
import { 
  BarChart3, 
  Coins, 
  Download, 
  Printer, 
  CheckCircle2, 
  AlertTriangle, 
  Building, 
  Receipt, 
  Scale, 
  PlusCircle, 
  History,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';

export const InformesModule: React.FC = () => {
  const { 
    fondoFijoTotal,
    efectivoDisponible,
    anticiposEnTransito,
    facturasAprobadasTotal,
    gastosPorCategoria,
    facturas,
    solicitudes,
    arqueos,
    registrarArqueo,
    currentUser
  } = useApp();

  const [activeTab, setActiveTab] = useState<'arqueo' | 'estado' | 'facturas' | 'cierre'>('arqueo');

  // Arqueo simulation state (Colombian denominations)
  const [billetes, setBilletes] = useState<Record<number, number>>({
    100000: 8,
    50000: 8,
    20000: 5,
    10000: 4,
    5000: 1,
    2000: 2,
  });

  const [monedas, setMonedas] = useState<Record<number, number>>({
    1000: 1,
    500: 0,
    200: 0,
    100: 0,
    50: 0,
  });

  const [observacionesArqueo, setObservacionesArqueo] = useState('Arqueo físico ordinario de verificación de arqueo mensual de caja menor.');
  const [verificadorNombre, setVerificadorNombre] = useState('Andrés Felipe Vargas (Contador Público)');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Calculate totals for physical count
  const totalBilletes = Object.entries(billetes).reduce(
    (sum, [denom, count]) => sum + Number(denom) * count, 0
  );
  const totalMonedas = Object.entries(monedas).reduce(
    (sum, [denom, count]) => sum + Number(denom) * count, 0
  );
  const conteoEfectivoFisico = totalBilletes + totalMonedas;

  // Exact formula from page 5:
  // Saldo total verificado = Conteo Físico + Anticipos por Legalizar + Facturas Aprobadas
  const saldoVerificadoTotal = conteoEfectivoFisico + anticiposEnTransito + facturasAprobadasTotal;
  const diferencia = saldoVerificadoTotal - fondoFijoTotal;

  const handleUpdateBillete = (denom: number, count: number) => {
    setBilletes(prev => ({ ...prev, [denom]: Math.max(0, count) }));
  };

  const handleUpdateMoneda = (denom: number, count: number) => {
    setMonedas(prev => ({ ...prev, [denom]: Math.max(0, count) }));
  };

  const handleSaveArqueo = () => {
    const res = registrarArqueo({
      fondoFijoBase: fondoFijoTotal,
      conteoEfectivoFisico,
      denominaciones: { billetes, monedas },
      anticiposPendientesTotal: anticiposEnTransito,
      facturasSoportesTotal: facturasAprobadasTotal,
      verificadoPor: verificadorNombre,
      observaciones: observacionesArqueo,
    });

    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  // Export Facturas to CSV
  const handleExportFacturasCSV = () => {
    const headers = [
      'ID Factura',
      'Número Consecutivo',
      'Tipo Documento',
      'Fecha',
      'Proveedor',
      'NIT / Identificación',
      'Concepto',
      'Categoría',
      'Valor Antes Impuestos',
      'Impuestos (IVA)',
      'Valor Total COP',
      'Responsable',
      'Área o Proyecto',
      'Solicitud Vinculada',
      'Estado'
    ];

    const rows = facturas.map(f => [
      f.id,
      f.numeroFactura,
      f.tipoDocumento,
      f.fecha,
      f.proveedor,
      f.nit,
      f.concepto,
      f.categoria,
      f.valorAntesImpuestos,
      f.impuestos,
      f.valorTotal,
      f.responsable,
      f.areaProyecto,
      f.solicitudId,
      f.estado
    ]);

    downloadCSV('Informe_Facturas_Caja_Menor_Somos_Uno', headers, rows);
  };

  // Export Estado de Caja to CSV
  const handleExportEstadoCSV = () => {
    const headers = ['Categoría', 'Presupuesto Asignado COP', 'Gasto Ejecutado COP', 'Saldo Disponible COP', 'Porcentaje'];
    const rows = (Object.keys(CATEGORY_BUDGETS) as ExpenseCategory[]).map(cat => {
      const pres = CATEGORY_BUDGETS[cat];
      const gast = gastosPorCategoria[cat] || 0;
      const disp = Math.max(0, pres - gast);
      const porc = Math.round((gast / pres) * 100);
      return [cat, pres, gast, disp, `${porc}%`];
    });

    downloadCSV('Informe_Ejecucion_Presupuestal_Somos_Uno', headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <span>Paso 10 del Proceso</span>
            <span>·</span>
            <span>Auditoría & Trazabilidad Contable</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Informes Financieros y Arqueo de Caja
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Herramientas para conteo físico de dinero, generación de actas oficiales de arqueo, estado presupuestal y consolidado mensual.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg shrink-0">
          <button
            onClick={() => setActiveTab('arqueo')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'arqueo' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Arqueo Físico
          </button>
          <button
            onClick={() => setActiveTab('estado')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'estado' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Estado Presupuestal
          </button>
          <button
            onClick={() => setActiveTab('facturas')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'facturas' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Registro de Facturas
          </button>
          <button
            onClick={() => setActiveTab('cierre')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'cierre' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cierre Mensual
          </button>
        </div>
      </div>

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

      {/* TAB 1: ARQUEO FÍSICO */}
      {activeTab === 'arqueo' && (
        <div className="space-y-6">
          {/* Arqueo Banner Summary */}
          <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-800">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
                  <Scale className="w-4 h-4" />
                  <span>Acta de Arqueo Físico Mensual</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Conteo de Moneda en Custodia vs. Soportes Contables
                </h3>
                <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                  Conteo físico del dinero, cotejo contra anticipos pendientes y facturas en poder del custodio para certificar la existencia de los $2.000.000 COP.
                </p>
              </div>

              {/* Result Badge */}
              <div className="bg-slate-800/90 p-4 rounded-xl border border-slate-700/80 text-right min-w-[240px]">
                <div className="text-[11px] text-slate-400">Resultado del Cuadre</div>
                <div className={`text-xl font-bold font-mono tabular-nums ${
                  diferencia === 0 
                    ? 'text-emerald-400' 
                    : diferencia > 0 
                    ? 'text-sky-400' 
                    : 'text-rose-400'
                }`}>
                  {diferencia === 0 ? 'CUADRE EXACTO ($ 0)' : `${diferencia > 0 ? 'SOBRANTE: ' : 'FALTANTE: '} ${formatCOPShort(diferencia)}`}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Total Verificado: <strong className="text-white font-mono">{formatCOPShort(saldoVerificadoTotal)}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Cash counting grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Denominations Counter */}
            <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Coins className="w-4 h-4 text-amber-500" />
                  Conteo Físico por Denominación (Efectivo Colombiano)
                </h3>
                <span className="text-xs font-mono font-bold text-slate-900 tabular-nums">
                  Total Físico: {formatCOP(conteoEfectivoFisico)}
                </span>
              </div>

              {/* Billetes */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Billetes
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[100000, 50000, 20000, 10000, 5000, 2000].map((denom) => {
                    const count = billetes[denom] || 0;
                    const subtotal = denom * count;
                    return (
                      <div key={denom} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex justify-between items-center text-xs font-mono font-bold text-slate-800">
                          <span>${denom.toLocaleString('es-CO')}</span>
                          <span className="text-[10px] font-sans font-normal text-slate-500">COP</span>
                        </div>
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <input
                            type="number"
                            min="0"
                            value={count}
                            onChange={(e) => handleUpdateBillete(denom, Number(e.target.value))}
                            className="w-16 px-2 py-1 text-xs font-mono text-center rounded border border-slate-300 bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                          />
                          <span className="text-[11px] text-slate-500">und</span>
                        </div>
                        <div className="text-[10px] text-right font-mono font-semibold text-slate-600 mt-1">
                          = {formatCOPShort(subtotal)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Monedas */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Monedas
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {[1000, 500, 200, 100, 50].map((denom) => {
                    const count = monedas[denom] || 0;
                    const subtotal = denom * count;
                    return (
                      <div key={denom} className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-center">
                        <div className="text-[11px] font-mono font-bold text-slate-800">
                          ${denom}
                        </div>
                        <input
                          type="number"
                          min="0"
                          value={count}
                          onChange={(e) => handleUpdateMoneda(denom, Number(e.target.value))}
                          className="w-full mt-1 px-1 py-0.5 text-xs font-mono text-center rounded border border-slate-300 bg-white focus:outline-hidden"
                        />
                        <div className="text-[9px] font-mono text-slate-500 mt-0.5 truncate">
                          {formatCOPShort(subtotal)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Reconciliation Sheet & Save */}
            <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Liquidación y Cotejo del Arqueo
              </h3>

              <div className="space-y-2 text-xs divide-y divide-slate-100">
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-600">(+) Efectivo físico contado en caja:</span>
                  <span className="font-mono font-bold text-slate-900 tabular-nums">
                    {formatCOP(conteoEfectivoFisico)}
                  </span>
                </div>

                <div className="flex justify-between py-1.5">
                  <span className="text-slate-600">(+) Anticipos en tránsito (recibos pendientes):</span>
                  <span className="font-mono font-bold text-amber-700 tabular-nums">
                    {formatCOP(anticiposEnTransito)}
                  </span>
                </div>

                <div className="flex justify-between py-1.5">
                  <span className="text-slate-600">(+) Facturas y soportes de gasto aprobados:</span>
                  <span className="font-mono font-bold text-sky-700 tabular-nums">
                    {formatCOP(facturasAprobadasTotal)}
                  </span>
                </div>

                <div className="flex justify-between py-2 text-slate-900 font-bold border-t border-slate-200">
                  <span>(=) Total Fondos Soportados:</span>
                  <span className="font-mono text-sm tabular-nums">
                    {formatCOP(saldoVerificadoTotal)}
                  </span>
                </div>

                <div className="flex justify-between py-1.5 text-slate-500">
                  <span>(-) Fondo Fijo Autorizado por Gerencia:</span>
                  <span className="font-mono tabular-nums">{formatCOP(fondoFijoTotal)}</span>
                </div>

                <div className={`flex justify-between py-2.5 font-bold border-t ${
                  diferencia === 0 
                    ? 'text-emerald-700 bg-emerald-50/50 px-2 rounded' 
                    : 'text-rose-700 bg-rose-50/50 px-2 rounded'
                }`}>
                  <span>Diferencia en Arqueo:</span>
                  <span className="font-mono text-sm tabular-nums">
                    {formatCOP(diferencia)} {diferencia === 0 ? '(Exacto)' : ''}
                  </span>
                </div>
              </div>

              {/* Form to submit and print official acta */}
              <div className="space-y-3 pt-2 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Funcionario Revisor / Auditor
                  </label>
                  <input
                    type="text"
                    value={verificadorNombre}
                    onChange={(e) => setVerificadorNombre(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Observaciones y Hallazgos
                  </label>
                  <textarea
                    rows={2}
                    value={observacionesArqueo}
                    onChange={(e) => setObservacionesArqueo(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white resize-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleSaveArqueo}
                    className="flex-1 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Registrar Acta de Arqueo
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="p-2 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50"
                    title="Imprimir Acta"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Arqueos History */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-slate-400" />
              Histórico de Actas de Arqueo Físico
            </h3>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
              {arqueos.map((arq) => (
                <div key={arq.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white hover:bg-slate-50/50">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{arq.id}</span>
                      <span>·</span>
                      <span className="text-slate-500">{formatFecha(arq.fecha)}</span>
                      <span>·</span>
                      <span className="font-medium text-slate-700">Custodio: {arq.realizadoPor}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Auditor: {arq.verificadoPor} · Obs: {arq.observaciones}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono font-bold text-slate-900 tabular-nums">
                      Físico: {formatCOPShort(arq.conteoEfectivoFisico)}
                    </div>
                    <div className={`text-[10px] font-semibold uppercase ${
                      arq.diferencia === 0 ? 'text-emerald-700' : 'text-rose-700'
                    }`}>
                      {arq.estadoDiferencia.toUpperCase()} ({formatCOPShort(arq.diferencia)})
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ESTADO PRESUPUESTAL */}
      {activeTab === 'estado' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Estado Presupuestal por Categorías
              </h2>
              <p className="text-xs text-slate-500">
                Planificación y control de techos de gasto fijados para la Corporación Social Somos Uno ($2.000.000 COP)
              </p>
            </div>

            <button
              onClick={handleExportEstadoCSV}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Descargar Excel / CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 font-semibold">Categoría de Gasto</th>
                  <th className="py-2.5 font-semibold text-right">Presupuesto Asignado</th>
                  <th className="py-2.5 font-semibold text-right">Gasto Ejecutado</th>
                  <th className="py-2.5 font-semibold text-right">Saldo Disponible</th>
                  <th className="py-2.5 font-semibold text-right">% Ejecución</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(Object.keys(CATEGORY_BUDGETS) as ExpenseCategory[]).map((cat) => {
                  const pres = CATEGORY_BUDGETS[cat];
                  const gast = gastosPorCategoria[cat] || 0;
                  const disp = Math.max(0, pres - gast);
                  const porc = Math.round((gast / pres) * 100);

                  return (
                    <tr key={cat} className="hover:bg-slate-50/50">
                      <td className="py-3 font-semibold text-slate-900">{cat}</td>
                      <td className="py-3 text-right font-mono tabular-nums text-slate-700">{formatCOP(pres)}</td>
                      <td className="py-3 text-right font-mono tabular-nums font-bold text-slate-900">{formatCOP(gast)}</td>
                      <td className="py-3 text-right font-mono tabular-nums text-emerald-700">{formatCOP(disp)}</td>
                      <td className="py-3 text-right font-medium">
                        <span className={porc >= 80 ? 'text-rose-600' : 'text-slate-600'}>{porc}%</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-300 font-bold text-slate-900">
                  <td className="py-3">TOTAL FONDO FIJO</td>
                  <td className="py-3 text-right font-mono tabular-nums">{formatCOP(fondoFijoTotal)}</td>
                  <td className="py-3 text-right font-mono tabular-nums text-sky-800">{formatCOP(facturasAprobadasTotal)}</td>
                  <td className="py-3 text-right font-mono tabular-nums text-emerald-800">{formatCOP(efectivoDisponible)}</td>
                  <td className="py-3 text-right font-medium">
                    {Math.round((facturasAprobadasTotal / fondoFijoTotal) * 100)}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: REGISTRO DE FACTURAS */}
      {activeTab === 'facturas' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Registro Consolidado de Facturas & Documentos Soporte
              </h2>
              <p className="text-xs text-slate-500">
                Base de datos completa de proveedores, números de factura, fechas y valores para contabilidad y DIAN
              </p>
            </div>

            <button
              onClick={handleExportFacturasCSV}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Exportar CSV DIAN
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 font-semibold">Factura</th>
                  <th className="py-2.5 font-semibold">Fecha</th>
                  <th className="py-2.5 font-semibold">Proveedor & NIT</th>
                  <th className="py-2.5 font-semibold">Categoría</th>
                  <th className="py-2.5 font-semibold text-right">Base</th>
                  <th className="py-2.5 font-semibold text-right">IVA</th>
                  <th className="py-2.5 font-semibold text-right">Total</th>
                  <th className="py-2.5 font-semibold text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {facturas.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 font-mono font-bold text-slate-900">{f.numeroFactura}</td>
                    <td className="py-2.5 text-slate-600 whitespace-nowrap">{f.fecha}</td>
                    <td className="py-2.5">
                      <div className="font-semibold text-slate-900">{f.proveedor}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{f.nit}</div>
                    </td>
                    <td className="py-2.5 text-slate-600">{f.categoria}</td>
                    <td className="py-2.5 text-right font-mono tabular-nums text-slate-600">{formatCOPShort(f.valorAntesImpuestos)}</td>
                    <td className="py-2.5 text-right font-mono tabular-nums text-slate-600">{formatCOPShort(f.impuestos)}</td>
                    <td className="py-2.5 text-right font-mono tabular-nums font-bold text-slate-900">{formatCOPShort(f.valorTotal)}</td>
                    <td className="py-2.5 text-center">
                      <span className="text-[10px] font-semibold uppercase text-emerald-700">
                        {f.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: CIERRE MENSUAL */}
      {activeTab === 'cierre' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-5">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900">
              Informe de Cierre Mensual
            </h2>
            <p className="text-xs text-slate-500">
              Resumen ejecutivo consolidado del ciclo operativo mensual de la Corporación Social Somos Uno
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">Resumen de Movimientos</h4>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600">Saldo Inicial del Fondo:</span>
                <span className="font-mono font-bold">$ 2.000.000 COP</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600">Total Solicitudes Tramitadas:</span>
                <span className="font-medium">{solicitudes.length} solicitudes</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600">Total Facturas Aprobadas:</span>
                <span className="font-mono font-bold text-slate-900">{formatCOP(facturasAprobadasTotal)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600">Anticipos Pendientes de Cierre:</span>
                <span className="font-mono font-medium text-amber-700">{formatCOP(anticiposEnTransito)}</span>
              </div>
              <div className="flex justify-between py-1 pt-2 font-bold text-slate-900 text-sm">
                <span>Saldo en Efectivo al Cierre:</span>
                <span className="font-mono text-emerald-700">{formatCOP(efectivoDisponible)}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">Dictamen de Auditoría</h4>
              <p className="text-slate-600 leading-relaxed text-xs">
                Se certifica que los fondos de caja menor han sido administrados bajo el principio de fondo fijo de $2.000.000 COP, respetando el tope de $300.000 COP por erogación y contando con los soportes fiscales requeridos por los artículos 615 y 771-2 del Estatuto Tributario y la Resolución DIAN 000167 de 2021.
              </p>
              <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-500">
                <span>Responsable de Custodia: Carlos Restrepo</span>
                <span>Contador: Andrés Felipe Vargas</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
