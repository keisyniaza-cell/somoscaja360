import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { 
  Building2, 
  ShieldCheck, 
  ChevronDown, 
  AlertCircle,
  Bell,
  RotateCcw,
  BookOpen
} from 'lucide-react';

interface NavbarProps {
  onOpenAlerts?: () => void;
  onOpenManual?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAlerts, onOpenManual }) => {
  const { currentUser, setCurrentUserRole, users, alertas, reiniciarDatosDemo } = useApp();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const activeAlertsCount = alertas.filter(a => !a.resuelta).length;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="flex items-center justify-between gap-6 px-6 py-3.5 max-w-7xl mx-auto">
        {/* Zone 1: Brand & Organization */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-xs">
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap">
                SomosCaja 360
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs font-medium text-slate-600 whitespace-nowrap hidden sm:inline">
                Corporación Social Somos Uno
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden md:block">
              Fondo Fijo $2.000.000 COP · Límite $300.000 por compra · NIT 900.821.554-1
            </p>
          </div>
        </div>

        {/* Zone 2: Informational trust markers / Status indicator */}
        <div className="hidden lg:flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5 font-medium text-slate-700">
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            Entidad Privada sin Ánimo de Lucro
          </span>
          <span aria-hidden="true" className="text-slate-300">|</span>
          <span className="flex items-center gap-1.5 font-medium text-emerald-700">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Regulación DIAN & Estatuto Tributario
          </span>
        </div>

        {/* Zone 3: Actions & Role Switcher */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick Manual & Install Button */}
          {onOpenManual && (
            <button
              onClick={onOpenManual}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="Manual de Usuario, Instalación y Desinstalación"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-600" />
              <span>Manual & App</span>
            </button>
          )}

          {/* Quick Alert Bell */}
          <button
            onClick={onOpenAlerts}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="Ver Alertas del Sistema"
            aria-label="Alertas del sistema"
          >
            <Bell className="w-4 h-4" />
            {activeAlertsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
            )}
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={() => {
              if (window.confirm('¿Desea restablecer todos los datos al estado inicial propuesto para Corporación Social Somos Uno?')) {
                reiniciarDatosDemo();
              }
            }}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Restablecer datos demostrativos"
            aria-label="Restablecer datos"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* User Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-semibold shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-semibold text-slate-900 leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-500 leading-tight">
                  {currentUser.cargo}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-3.5 py-2 border-b border-slate-100">
                  <div className="text-xs font-semibold text-slate-900">Conmutador de Perfiles (Roles)</div>
                  <div className="text-[11px] text-slate-500">
                    Cambie de usuario para probar permisos y autorizaciones según el reglamento.
                  </div>
                </div>

                <div className="py-1">
                  {users.map((u) => {
                    const isSelected = u.id === currentUser.id;
                    return (
                      <button
                        key={u.id}
                        onClick={() => {
                          setCurrentUserRole(u.role as UserRole);
                          setShowRoleMenu(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 flex items-start gap-2.5 hover:bg-slate-50 transition-colors ${
                          isSelected ? 'bg-slate-50/80 font-medium' : ''
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                          isSelected ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {u.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs text-slate-900 truncate flex items-center justify-between">
                            <span>{u.name}</span>
                            {isSelected && (
                              <span className="text-[10px] text-slate-500 font-normal">Activo</span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">{u.cargo}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
