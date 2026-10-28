import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatCOP, formatCOPShort, formatFecha } from '../../utils/formatters';
import { CATEGORY_BUDGETS, ExpenseCategory } from '../../types';
import { 
  Wallet, 
  ArrowUpRight, 
  Clock, 
  Receipt, 
  AlertTriangle, 
  CheckCircle2, 
  PlusCircle, 
  ArrowRight,
  TrendingDown,
  Building,
  Scale
} from 'lucide-react';
import { ActiveModule } from '../Sidebar';

interface DashboardModuleProps {
  onNavigate: (module: ActiveModule) => void;
  onOpenNewSolicitud: () => void;
  onOpenNewFactura: () => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({ 
  onNavigate, 
  onOpenNewSolicitud, 
  onOpenNewFactura 
}) => {
  const { 
    fondoFijoTotal, 
    efectivoDisponible, 
    anticiposEnTransito, 
    facturasAprobadasTotal,
    porcentajeEjecucion,
    gastosPorCategoria,
    alertas,
    resolverAlerta,
    solicitudes,
    facturas
  } = useApp();

  const totalConciliado = efectivoDisponible + anticiposEnTransito + facturasAprobadasTotal;
  const isCuadrado = totalConciliado === fondoFijoTotal;

  const alertasActivas = alertas.filter(a => !a.resuelta);

  return (
    <div className="space-y-6">
      {/* Welcome Banner / Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <span>Corporación Social Somos Uno</span>
            <span>·</span>
            <span>Gestión Financiera 2026</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Control de Caja Menor & Movimientos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Monitoreo en tiempo real bajo la modalidad de fondo fijo de $2.000.000 COP con trazabilidad documental según la normatividad tributaria colombiana.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenNewSolicitud}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Nueva Solicitud
          </button>
          <button
            onClick={onOpenNewFactura}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
          >
            <Receipt className="w-3.5 h-3.5" />
            Legalizar Factura
          </button>
        </div>
      </div>

      {/* KPI 4-Card Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Fondo Fijo */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-medium">Fondo Fijo Total</span>
            <Building className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
            {formatCOP(fondoFijoTotal)}
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Modalidad fondo fijo autorizada
          </div>
        </div>

        {/* Card 2: Efectivo Disponible */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-medium">Efectivo Físico en Caja</span>
            <Wallet className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-emerald-700 font-mono tabular-nums">
            {formatCOP(efectivoDisponible)}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <span className="font-semibold text-emerald-600">
              {Math.round((efectivoDisponible / fondoFijoTotal) * 100)}%
            </span>
            <span>disponible para compras</span>
          </div>
        </div>

        {/* Card 3: Anticipos en Tránsito */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-medium">Anticipos en Tránsito</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-amber-600 font-mono tabular-nums">
            {formatCOP(anticiposEnTransito)}
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Entregado pendiente por legalizar
          </div>
        </div>

        {/* Card 4: Facturas por Reponer */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-medium">Gastos Legalizados</span>
            <Receipt className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-sky-700 font-mono tabular-nums">
            {formatCOP(facturasAprobadasTotal)}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Listos para reposición</span>
            <span className="font-medium text-slate-700">{porcentajeEjecucion}%</span>
          </div>
        </div>
      </div>

      {/* Zero-Deviation Conciliation Equation Formula (Page 5 of document) */}
      <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
              <Scale className="w-4 h-4 text-emerald-400" />
              <span>Principio de Conciliación Permanente (Fondo Fijo Somos Uno)</span>
            </div>
            <p className="text-xs text-slate-300">
              Efectivo Físico + Anticipos por Legalizar + Gastos Legalizados = Fondo Total ($2.000.000 COP) sin duplicidades.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm font-mono tabular-nums">
            <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
              <span className="text-[10px] block text-slate-300">Efectivo</span>
              <span className="font-bold text-emerald-400">{formatCOPShort(efectivoDisponible)}</span>
            </div>
            <span className="text-slate-400 font-sans">+</span>
            <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
              <span className="text-[10px] block text-slate-300">Anticipos</span>
              <span className="font-bold text-amber-300">{formatCOPShort(anticiposEnTransito)}</span>
            </div>
            <span className="text-slate-400 font-sans">+</span>
            <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
              <span className="text-[10px] block text-slate-300">Facturas</span>
              <span className="font-bold text-sky-300">{formatCOPShort(facturasAprobadasTotal)}</span>
            </div>
            <span className="text-slate-400 font-sans">=</span>
            <div className={`px-3 py-1.5 rounded-lg border font-bold ${
              isCuadrado 
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40' 
                : 'bg-rose-950/40 text-rose-300 border-rose-500/40'
            }`}>
              <span className="text-[10px] block opacity-80">Total Conciliado</span>
              <span>{formatCOPShort(totalConciliado)} {isCuadrado ? '✓ Cuadrado' : '⚠ Descuadre'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Bar (if any) */}
      {alertasActivas.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 px-1">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              Alertas del Sistema ({alertasActivas.length})
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {alertasActivas.map((alerta) => (
              <div 
                key={alerta.id} 
                className={`p-3.5 rounded-xl border flex flex-col justify-between text-xs ${
                  alerta.tipo === 'warning' 
                    ? 'bg-amber-50/70 border-amber-200 text-amber-900' 
                    : alerta.tipo === 'danger'
                    ? 'bg-rose-50 border-rose-200 text-rose-900'
                    : 'bg-sky-50 border-sky-200 text-sky-900'
                }`}
              >
                <div>
                  <div className="font-semibold text-xs mb-1 flex items-center justify-between">
                    <span>{alerta.titulo}</span>
                    <button 
                      onClick={() => resolverAlerta(alerta.id)}
                      className="text-[10px] opacity-60 hover:opacity-100 underline ml-2"
                    >
                      Descartar
                    </button>
                  </div>
                  <p className="text-[11px] leading-relaxed opacity-90">
                    {alerta.mensaje}
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-black/5 flex items-center justify-between text-[10px]">
                  <span className="opacity-70">{formatFecha(alerta.fecha)}</span>
                  <button
                    onClick={() => onNavigate(alerta.moduloTarget as ActiveModule)}
                    className="font-semibold underline flex items-center gap-0.5 hover:opacity-80"
                  >
                    Ver módulo
                    <ArrowRight className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2-Column Section: Presupuesto por Categorías & Recent Solicitudes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Presupuesto por Categorías */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Distribución Presupuestal Sugerida
              </h2>
              <p className="text-xs text-slate-500">
                Techos orientativos para planear los gastos según el proyecto Somos Uno
              </p>
            </div>
            <button
              onClick={() => onNavigate('informes')}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1"
            >
              Ver Informe
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3.5 pt-1">
            {(Object.keys(CATEGORY_BUDGETS) as ExpenseCategory[]).map((cat) => {
              const presupuesto = CATEGORY_BUDGETS[cat];
              const gastado = gastosPorCategoria[cat] || 0;
              const porcentaje = Math.min(100, Math.round((gastado / presupuesto) * 100));
              const disponible = Math.max(0, presupuesto - gastado);

              return (
                <div key={cat} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800 truncate max-w-[240px]">
                      {cat}
                    </span>
                    <div className="font-mono tabular-nums text-slate-600 space-x-2">
                      <span className="font-semibold text-slate-900">{formatCOPShort(gastado)}</span>
                      <span className="text-slate-400">/</span>
                      <span className="text-slate-500">{formatCOPShort(presupuesto)}</span>
                      <span className="text-[11px] text-slate-400 font-sans">({porcentaje}%)</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        porcentaje >= 90 
                          ? 'bg-rose-500' 
                          : porcentaje >= 70 
                          ? 'bg-amber-500' 
                          : 'bg-slate-800'
                      }`}
                      style={{ width: `${porcentaje}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-slate-600 flex justify-between">
                    <span>Disponible en categoría:</span>
                    <span className="font-mono font-medium text-slate-600">{formatCOPShort(disponible)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (5 cols): Activity & Quick Access */}
        <div className="lg:col-span-5 space-y-4">
          {/* Quick Module Navigation Box */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              Accesos Operativos Rápidos
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => onNavigate('solicitudes')}
                className="p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-left transition-colors"
              >
                <div className="font-semibold text-slate-900 mb-0.5">Autorizaciones</div>
                <div className="text-[11px] text-slate-500">Revisar solicitudes pendientes</div>
              </button>

              <button
                onClick={() => onNavigate('fondo')}
                className="p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-left transition-colors"
              >
                <div className="font-semibold text-slate-900 mb-0.5">Reposición</div>
                <div className="text-[11px] text-slate-500">Reintegrar fondo a $2.000.000</div>
              </button>

              <button
                onClick={() => onNavigate('informes')}
                className="p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-left transition-colors"
              >
                <div className="font-semibold text-slate-900 mb-0.5">Arqueo Mensual</div>
                <div className="text-[11px] text-slate-500">Conteo físico de billetes y monedas</div>
              </button>

              <button
                onClick={() => onNavigate('normatividad')}
                className="p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-left transition-colors"
              >
                <div className="font-semibold text-slate-900 mb-0.5">Doc. Soporte DIAN</div>
                <div className="text-[11px] text-slate-500">Generador para no obligados</div>
              </button>
            </div>
          </div>

          {/* Last Movement feed */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Últimos Movimientos
              </h3>
              <button
                onClick={() => onNavigate('facturas')}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Ver todas
              </button>
            </div>

            <div className="space-y-2.5">
              {facturas.slice(0, 3).map((f) => (
                <div key={f.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div className="min-w-0 pr-2">
                    <div className="font-semibold text-slate-900 truncate">{f.proveedor}</div>
                    <div className="text-[11px] text-slate-500 truncate">{f.concepto}</div>
                    <div className="text-[10px] text-slate-600 mt-0.5">{f.numeroFactura} · {formatFecha(f.fecha)}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono font-bold text-slate-900 tabular-nums">
                      {formatCOPShort(f.valorTotal)}
                    </div>
                    <span className="text-[10px] font-medium text-emerald-700">
                      {f.estado.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
