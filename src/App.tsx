import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar, ActiveModule } from './components/Sidebar';
import { DashboardModule } from './components/modules/DashboardModule';
import { SolicitudesModule } from './components/modules/SolicitudesModule';
import { FondoReposicionModule } from './components/modules/FondoReposicionModule';
import { FacturasModule } from './components/modules/FacturasModule';
import { InformesModule } from './components/modules/InformesModule';
import { PHVAModule } from './components/modules/PHVAModule';
import { NormatividadModule } from './components/modules/NormatividadModule';
import { AuditoriaModule } from './components/modules/AuditoriaModule';
import { ManualModule } from './components/modules/ManualModule';
import { FacturaViewerModal } from './components/modals/FacturaViewerModal';
import { ComprobanteEntregaModal } from './components/modals/ComprobanteEntregaModal';
import { AlertsDrawerModal } from './components/modals/AlertsDrawerModal';
import { FacturaRegistro, SolicitudGasto } from './types';

const AppContent: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ActiveModule>('dashboard');
  const [selectedFacturaForView, setSelectedFacturaForView] = useState<FacturaRegistro | null>(null);
  const [selectedSolicitudForEntrega, setSelectedSolicitudForEntrega] = useState<SolicitudGasto | null>(null);
  const [preselectedSolicitudId, setPreselectedSolicitudId] = useState<string | null>(null);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);

  // Trigger quick new solicitud
  const handleOpenNewSolicitud = () => {
    setActiveModule('solicitudes');
  };

  // Trigger legalizar factura from a solicitud
  const handleOpenLegalizar = (sol: SolicitudGasto) => {
    setPreselectedSolicitudId(sol.id);
    setActiveModule('facturas');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
      {/* Top Navbar */}
      <Navbar 
        onOpenAlerts={() => setIsAlertsOpen(true)} 
        onOpenManual={() => setActiveModule('manual')}
      />

      {/* Main Workspace with Sidebar and Content Viewport */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <Sidebar 
          activeModule={activeModule} 
          setActiveModule={(mod) => {
            setActiveModule(mod);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
        />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeModule === 'dashboard' && (
            <DashboardModule 
              onNavigate={(mod) => setActiveModule(mod)} 
              onOpenNewSolicitud={handleOpenNewSolicitud}
              onOpenNewFactura={() => setActiveModule('facturas')}
            />
          )}

          {activeModule === 'solicitudes' && (
            <SolicitudesModule 
              onOpenLegalizar={handleOpenLegalizar}
              onOpenComprobanteEntrega={(sol) => setSelectedSolicitudForEntrega(sol)}
            />
          )}

          {activeModule === 'fondo' && (
            <FondoReposicionModule />
          )}

          {activeModule === 'facturas' && (
            <FacturasModule 
              onViewFacturaModal={(fac) => setSelectedFacturaForView(fac)}
              preselectedSolicitudId={preselectedSolicitudId}
              onClearPreselected={() => setPreselectedSolicitudId(null)}
            />
          )}

          {activeModule === 'informes' && (
            <InformesModule />
          )}

          {activeModule === 'phva' && (
            <PHVAModule />
          )}

          {activeModule === 'normatividad' && (
            <NormatividadModule />
          )}

          {activeModule === 'manual' && (
            <ManualModule />
          )}

          {activeModule === 'auditoria' && (
            <AuditoriaModule />
          )}
        </main>
      </div>

      {/* Modals & Overlays */}
      <FacturaViewerModal 
        factura={selectedFacturaForView} 
        onClose={() => setSelectedFacturaForView(null)} 
      />

      <ComprobanteEntregaModal 
        solicitud={selectedSolicitudForEntrega} 
        onClose={() => setSelectedSolicitudForEntrega(null)} 
      />

      <AlertsDrawerModal 
        isOpen={isAlertsOpen} 
        onClose={() => setIsAlertsOpen(false)} 
        onNavigate={(mod) => setActiveModule(mod)} 
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
