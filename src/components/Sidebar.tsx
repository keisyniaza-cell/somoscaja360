import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Wallet, 
  Receipt, 
  BarChart3, 
  RefreshCw, 
  BookOpen, 
  ShieldCheck,
  Coins,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCOPShort } from '../utils/formatters';

export type ActiveModule = 
  | 'dashboard'
  | 'solicitudes'
  | 'fondo'
  | 'facturas'
  | 'informes'
  | 'phva'
  | 'normatividad'
  | 'manual'
  | 'auditoria';

interface SidebarProps {
  activeModule: ActiveModule;
  setActiveModule: (m: ActiveModule) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeModule, setActiveModule }) => {
  const { efectivoDisponible, anticiposEnTransito, facturasAprobadasTotal, solicitudes, facturas } = useApp();

  const pendientesAutorizacion = solicitudes.filter(s => s.estado === 'pendiente').length;
  const facturasEnRevision = facturas.filter(f => f.estado === 'registrada' || f.estado === 'en_revision').length;

  const navItems = [
    {
      id: 'dashboard' as ActiveModule,
      label: 'Panel Principal',
      description: 'Estado del fondo y métricas',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'solicitudes' as ActiveModule,
      label: 'Solicitudes y Aprobaciones',
      description: 'Gastos y flujo de autorización',
      icon: FileText,
      badge: pendientesAutorizacion > 0 ? `${pendientesAutorizacion} por revisar` : null,
    },
    {
      id: 'fondo' as ActiveModule,
      label: 'Administración del Fondo',
      description: 'Fondo $2.000.000 y reposición',
      icon: Wallet,
      badge: null,
    },
    {
      id: 'facturas' as ActiveModule,
      label: 'Registro de Facturas',
      description: 'Legalización y soportes DIAN',
      icon: Receipt,
      badge: facturasEnRevision > 0 ? `${facturasEnRevision} en revisión` : null,
    },
    {
      id: 'informes' as ActiveModule,
      label: 'Informes y Arqueo Físico',
      description: 'Conteo mensual y actas',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'phva' as ActiveModule,
      label: 'Control Ciclo PHVA',
      description: 'Mejora continua y auditoría',
      icon: RefreshCw,
      badge: null,
    },
    {
      id: 'normatividad' as ActiveModule,
      label: 'Normatividad & DIAN',
      description: 'Documento soporte y leyes',
      icon: BookOpen,
      badge: null,
    },
    {
      id: 'manual' as ActiveModule,
      label: 'Manual & Instalador',
      description: 'Uso, instalar y desinstalar',
      icon: BookOpen,
      badge: 'Guía PWA',
    },
  ];

  return (
    <aside className="w-full md:w-64 lg:w-72 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0">
      <div className="p-4 space-y-6">
        {/* Quick Fund Summary Card */}
        <div className="p-3.5 bg-slate-900 text-white rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
            <span className="font-medium">Fondo Fijo Autorizado</span>
            <span className="text-[10px] bg-slate-800 text-slate-200 px-1.5 py-0.5 rounded">Fondo Fijo</span>
          </div>
          <div className="text-xl font-bold tracking-tight font-mono tabular-nums mb-3">
            $ 2.000.000 COP
          </div>
          
          <div className="space-y-1.5 text-xs border-t border-slate-800 pt-2.5">
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1.5 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Efectivo en Caja:
              </span>
              <span className="font-mono font-medium text-white tabular-nums">
                {formatCOPShort(efectivoDisponible)}
              </span>
            </div>

            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1.5 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                Anticipos en Tránsito:
              </span>
              <span className="font-mono font-medium text-amber-200 tabular-nums">
                {formatCOPShort(anticiposEnTransito)}
              </span>
            </div>

            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1.5 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                Facturas sin Reponer:
              </span>
              <span className="font-mono font-medium text-sky-200 tabular-nums">
                {formatCOPShort(facturasAprobadasTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="space-y-1">
          <div className="text-[11px] font-semibold tracking-wider text-slate-600 px-3 py-1 uppercase">
            Módulos del Sistema
          </div>
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = activeModule === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveModule(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-normal text-amber-700 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Pinned Item: Auditoría & Security */}
      <div className="p-4 border-t border-slate-200 space-y-2">
        <button
          onClick={() => setActiveModule('auditoria')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
            activeModule === 'auditoria'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Auditoría & Trazabilidad</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
        </button>

        <div className="text-[11px] text-slate-600 text-center pt-1">
          Corporación Social Somos Uno · 2026
        </div>
      </div>
    </aside>
  );
};
