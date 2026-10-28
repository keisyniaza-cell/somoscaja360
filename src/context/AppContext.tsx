import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  UserRole,
  SolicitudGasto, 
  FacturaRegistro, 
  ReposicionCiclo, 
  ArqueoCaja, 
  PHVAItem, 
  AuditLog, 
  AlertaSistema,
  FONDO_FIJO_TOTAL,
  LIMITE_MAX_COMPRA,
  CATEGORY_BUDGETS,
  ExpenseCategory,
  EstadoFactura,
} from '../types';
import { 
  USERS, 
  INITIAL_SOLICITUDES, 
  INITIAL_FACTURAS, 
  INITIAL_REPOSICIONES, 
  INITIAL_ARQUEOS, 
  INITIAL_PHVA, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_ALERTAS 
} from '../data/mockData';

interface AppContextType {
  currentUser: UserProfile;
  setCurrentUserRole: (role: UserRole) => void;
  users: UserProfile[];
  
  // Data
  solicitudes: SolicitudGasto[];
  facturas: FacturaRegistro[];
  reposiciones: ReposicionCiclo[];
  arqueos: ArqueoCaja[];
  phvaItems: PHVAItem[];
  auditLogs: AuditLog[];
  alertas: AlertaSistema[];
  
  // Financial metrics
  fondoFijoTotal: number;
  efectivoDisponible: number;
  anticiposEnTransito: number;
  facturasAprobadasTotal: number;
  totalGastosEjecutados: number;
  porcentajeEjecucion: number;
  gastosPorCategoria: Record<ExpenseCategory, number>;

  // Actions
  createSolicitud: (data: Omit<SolicitudGasto, 'id' | 'fecha' | 'solicitanteId' | 'solicitanteNombre' | 'solicitanteCargo' | 'estado'>) => { success: boolean; message: string; id?: string };
  autorizarSolicitud: (id: string, aprobado: boolean, motivo?: string) => { success: boolean; message: string };
  entregarDineroAnticipo: (solicitudId: string) => { success: boolean; message: string };
  registrarFactura: (data: Omit<FacturaRegistro, 'id' | 'estado' | 'revisadoPor' | 'fechaRevision' | 'incluidaEnReposicionId'>) => { success: boolean; message: string; id?: string };
  revisarFactura: (id: string, nuevoEstado: EstadoFactura, observaciones?: string) => { success: boolean; message: string };
  solicitarReposicion: (facturasIds: string[]) => { success: boolean; message: string; id?: string };
  aprobarReposicion: (reposicionId: string, bancoCuenta: string, referencia: string) => { success: boolean; message: string };
  registrarArqueo: (data: Omit<ArqueoCaja, 'id' | 'fecha' | 'realizadoPor' | 'cargoRealizado' | 'saldoCalculado' | 'diferencia' | 'estadoDiferencia'>) => { success: boolean; message: string; id?: string };
  actualizarPHVA: (id: string, nuevoEstado: PHVAItem['estado'], nuevaEvidencia?: string) => void;
  resolverAlerta: (id: string) => void;
  reiniciarDatosDemo: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'somoscaja_360_data_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(USERS[1]); // Default: Karen Ortiz (Coordinadora Financiera)
  const [solicitudes, setSolicitudes] = useState<SolicitudGasto[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_solicitudes`);
    return saved ? JSON.parse(saved) : INITIAL_SOLICITUDES;
  });
  const [facturas, setFacturas] = useState<FacturaRegistro[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_facturas`);
    return saved ? JSON.parse(saved) : INITIAL_FACTURAS;
  });
  const [reposiciones, setReposiciones] = useState<ReposicionCiclo[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_reposiciones`);
    return saved ? JSON.parse(saved) : INITIAL_REPOSICIONES;
  });
  const [arqueos, setArqueos] = useState<ArqueoCaja[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_arqueos`);
    return saved ? JSON.parse(saved) : INITIAL_ARQUEOS;
  });
  const [phvaItems, setPhvaItems] = useState<PHVAItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_phva`);
    return saved ? JSON.parse(saved) : INITIAL_PHVA;
  });
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_logs`);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });
  const [alertas, setAlertas] = useState<AlertaSistema[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_alertas`);
    return saved ? JSON.parse(saved) : INITIAL_ALERTAS;
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_solicitudes`, JSON.stringify(solicitudes));
  }, [solicitudes]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_facturas`, JSON.stringify(facturas));
  }, [facturas]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_reposiciones`, JSON.stringify(reposiciones));
  }, [reposiciones]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_arqueos`, JSON.stringify(arqueos));
  }, [arqueos]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_phva`, JSON.stringify(phvaItems));
  }, [phvaItems]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_logs`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_alertas`, JSON.stringify(alertas));
  }, [alertas]);

  // Switch role helper
  const setCurrentUserRole = (role: UserRole) => {
    const found = USERS.find(u => u.role === role);
    if (found) setCurrentUser(found);
  };

  // Log an audit trail item
  const logAudit = (accion: string, modulo: string, detalles: string) => {
    const now = new Date();
    const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const newLog: AuditLog = {
      id: `LOG-${Date.now().toString().slice(-5)}`,
      timestamp: formatted,
      usuario: currentUser.name,
      rol: currentUser.cargo,
      accion,
      modulo,
      detalles,
      ipSimulada: `190.144.20.${100 + Math.floor(Math.random() * 50)}`,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Financial calculations
  // 1. Facturas aprobadas que NO han sido incluidas en un ciclo de reposición desembolsado
  const facturasAprobadasPendientesReposicion = facturas.filter(
    f => f.estado === 'aprobada' && !f.incluidaEnReposicionId
  );
  const facturasAprobadasTotal = facturasAprobadasPendientesReposicion.reduce(
    (sum, f) => sum + f.valorTotal, 0
  );

  // 2. Anticipos en tránsito: Solicitudes entregadas (dinero dado) que aún no tienen una factura legalizada y aprobada
  const anticiposEnTransitoList = solicitudes.filter(
    s => s.estado === 'entregada' && s.dineroEntregado
  );
  const anticiposEnTransito = anticiposEnTransitoList.reduce(
    (sum, s) => sum + s.valorEstimado, 0
  );

  // 3. Efectivo Físico Disponible en Custodia:
  // Formula formal de la propuesta (Página 5):
  // "La plataforma debe diferenciar entre dinero entregado como anticipo, gastos ya legalizados y dinero disponible.
  // Efectivo físico disponible = Fondo Fijo ($2.000.000) - Anticipos entregados - Gastos aprobados pendientes de reposición."
  const efectivoDisponible = Math.max(0, FONDO_FIJO_TOTAL - facturasAprobadasTotal - anticiposEnTransito);

  // Gastos por categoría
  const gastosPorCategoria: Record<ExpenseCategory, number> = {
    'Papelería y útiles': 0,
    'Transporte y movilización': 0,
    'Materiales para actividades comunitarias': 0,
    'Aseo y cafetería': 0,
    'Impresiones y fotocopias': 0,
    'Gastos imprevistos autorizados': 0,
  };

  facturas.forEach(f => {
    if (f.estado === 'aprobada' && gastosPorCategoria[f.categoria] !== undefined) {
      gastosPorCategoria[f.categoria] += f.valorTotal;
    }
  });

  const totalGastosEjecutados = Object.values(gastosPorCategoria).reduce((a, b) => a + b, 0);
  const porcentajeEjecucion = Math.min(100, Math.round((facturasAprobadasTotal / FONDO_FIJO_TOTAL) * 100));

  // 1. Crear Solicitud
  const createSolicitud = (data: Omit<SolicitudGasto, 'id' | 'fecha' | 'solicitanteId' | 'solicitanteNombre' | 'solicitanteCargo' | 'estado'>) => {
    if (data.valorEstimado > LIMITE_MAX_COMPRA) {
      return {
        success: false,
        message: `El valor excede el límite máximo por compra de $300.000 COP establecido en el reglamento institucional.`,
      };
    }

    if (data.valorEstimado <= 0) {
      return { success: false, message: 'El valor de la solicitud debe ser mayor a cero.' };
    }

    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const nextNum = solicitudes.length + 1;
    const newId = `SOL-2026-${String(nextNum).padStart(3, '0')}`;

    const newSol: SolicitudGasto = {
      ...data,
      id: newId,
      fecha: dateStr,
      solicitanteId: currentUser.id,
      solicitanteNombre: currentUser.name,
      solicitanteCargo: currentUser.cargo,
      estado: 'pendiente',
      dineroEntregado: false,
    };

    setSolicitudes(prev => [newSol, ...prev]);
    logAudit('Registro de Solicitud de Dinero', 'Solicitudes y Autorizaciones', `Creó solicitud ${newId} por $${data.valorEstimado.toLocaleString('es-CO')} para ${data.concepto}`);
    return { success: true, message: `Solicitud ${newId} radicada exitosamente.`, id: newId };
  };

  // 2. Autorizar o Rechazar Solicitud
  const autorizarSolicitud = (id: string, aprobado: boolean, motivo?: string) => {
    const sol = solicitudes.find(s => s.id === id);
    if (!sol) return { success: false, message: 'Solicitud no encontrada.' };

    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setSolicitudes(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          estado: aprobado ? 'aprobada' : 'rechazada',
          autorizadoPor: currentUser.name,
          fechaAutorizacion: dateStr,
          motivoRechazo: aprobado ? undefined : (motivo || 'No justificado conforme a las políticas del fondo.'),
        };
      }
      return s;
    }));

    logAudit(
      aprobado ? 'Aprobación de Solicitud' : 'Rechazo de Solicitud',
      'Solicitudes y Autorizaciones',
      `${aprobado ? 'Aprobó' : 'Rechazó'} la solicitud ${id} (${sol.concepto}). ${motivo ? 'Motivo: ' + motivo : ''}`
    );

    return {
      success: true,
      message: aprobado 
        ? `Solicitud ${id} aprobada con éxito. Ya puede realizarse el desembolso por el responsable de caja.` 
        : `Solicitud ${id} ha sido rechazada formalmente.`,
    };
  };

  // 3. Entregar Dinero Físico (Custodio)
  const entregarDineroAnticipo = (solicitudId: string) => {
    const sol = solicitudes.find(s => s.id === solicitudId);
    if (!sol) return { success: false, message: 'Solicitud no encontrada.' };

    if (efectivoDisponible < sol.valorEstimado) {
      return {
        success: false,
        message: `Efectivo insuficiente en caja menor. Disponible actual: $${efectivoDisponible.toLocaleString('es-CO')} COP. Se requiere reposición del fondo.`,
      };
    }

    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setSolicitudes(prev => prev.map(s => {
      if (s.id === solicitudId) {
        return {
          ...s,
          estado: 'entregada',
          dineroEntregado: true,
          fechaEntrega: dateStr,
          custodioEntrega: currentUser.name,
        };
      }
      return s;
    }));

    logAudit(
      'Entrega de Efectivo (Anticipo)',
      'Administración del Fondo',
      `Custodio entregó $${sol.valorEstimado.toLocaleString('es-CO')} COP en efectivo para la solicitud ${solicitudId} a ${sol.solicitanteNombre}`
    );

    return {
      success: true,
      message: `Entrega de dinero registrada. Se emitió comprobante provisional de egreso para ${sol.solicitanteNombre}.`,
    };
  };

  // 4. Registrar Factura (Legalización)
  const registrarFactura = (data: Omit<FacturaRegistro, 'id' | 'estado' | 'revisadoPor' | 'fechaRevision' | 'incluidaEnReposicionId'>) => {
    // Check for duplicates
    const duplicate = facturas.find(
      f => f.numeroFactura.trim().toLowerCase() === data.numeroFactura.trim().toLowerCase() &&
           f.nit.replace(/\D/g, '') === data.nit.replace(/\D/g, '')
    );

    if (duplicate) {
      return {
        success: false,
        message: `ALERTA DE DUPLICIDAD: Ya existe registrada una factura con el número "${data.numeroFactura}" para el proveedor con NIT "${data.nit}".`,
      };
    }

    if (data.valorTotal > LIMITE_MAX_COMPRA) {
      return {
        success: false,
        message: `El valor de la factura supera el límite reglamentario de $300.000 COP por compra.`,
      };
    }

    const nextNum = facturas.length + 1;
    const newId = `FAC-2026-${String(nextNum).padStart(3, '0')}`;

    const newFac: FacturaRegistro = {
      ...data,
      id: newId,
      estado: 'registrada',
    };

    setFacturas(prev => [newFac, ...prev]);

    // Update solicitud link
    if (data.solicitudId) {
      setSolicitudes(prev => prev.map(s => {
        if (s.id === data.solicitudId) {
          return {
            ...s,
            estado: 'legalizada',
            facturaId: newId,
          };
        }
        return s;
      }));
    }

    logAudit(
      'Legalización de Gasto / Factura',
      'Registro de Facturas',
      `Registró documento ${data.numeroFactura} de ${data.proveedor} por $${data.valorTotal.toLocaleString('es-CO')} COP asociada a ${data.solicitudId}`
    );

    return {
      success: true,
      message: `Factura ${data.numeroFactura} radicada exitosamente bajo el código ${newId}. Pasa a revisión administrativa.`,
      id: newId,
    };
  };

  // 5. Revisar Factura
  const revisarFactura = (id: string, nuevoEstado: EstadoFactura, observaciones?: string) => {
    const fac = facturas.find(f => f.id === id);
    if (!fac) return { success: false, message: 'Factura no encontrada.' };

    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setFacturas(prev => prev.map(f => {
      if (f.id === id) {
        return {
          ...f,
          estado: nuevoEstado,
          observacionesRevision: observaciones,
          revisadoPor: `${currentUser.name} (${currentUser.cargo})`,
          fechaRevision: dateStr,
        };
      }
      return f;
    }));

    logAudit(
      `Revisión Documental: ${nuevoEstado.toUpperCase()}`,
      'Registro de Facturas',
      `${currentUser.name} cambió estado de factura ${fac.numeroFactura} (${fac.proveedor}) a "${nuevoEstado}". ${observaciones ? 'Obs: ' + observaciones : ''}`
    );

    return {
      success: true,
      message: `Factura actualizada a estado "${nuevoEstado}".`,
    };
  };

  // 6. Solicitar Reposición de Fondo
  const solicitarReposicion = (facturasIds: string[]) => {
    if (facturasIds.length === 0) {
      return { success: false, message: 'Debe seleccionar al menos una factura aprobada para solicitar la reposición.' };
    }

    const seleccionadas = facturas.filter(f => facturasIds.includes(f.id));
    const totalReposicion = seleccionadas.reduce((sum, f) => sum + f.valorTotal, 0);

    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const nextNum = reposiciones.length + 1;
    const newId = `REP-2026-${String(nextNum).padStart(3, '0')}`;

    const newRep: ReposicionCiclo = {
      id: newId,
      fechaSolicitud: dateStr,
      solicitadoPor: `${currentUser.name} (${currentUser.cargo})`,
      valorTotal: totalReposicion,
      facturasIds,
      estado: 'solicitada',
    };

    setReposiciones(prev => [newRep, ...prev]);

    logAudit(
      'Solicitud de Reposición de Fondo',
      'Administración del Fondo',
      `Solicitó reposición ${newId} por valor de $${totalReposicion.toLocaleString('es-CO')} COP agrupando ${facturasIds.length} facturas.`
    );

    return {
      success: true,
      message: `Solicitud de reposición ${newId} por $${totalReposicion.toLocaleString('es-CO')} COP enviada a Gerencia para su aprobación.`,
      id: newId,
    };
  };

  // 7. Aprobar y Desembolsar Reposición (Gerente)
  const aprobarReposicion = (reposicionId: string, bancoCuenta: string, referencia: string) => {
    const rep = reposiciones.find(r => r.id === reposicionId);
    if (!rep) return { success: false, message: 'Reposición no encontrada.' };

    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Mark reposición as desembolsada
    setReposiciones(prev => prev.map(r => {
      if (r.id === reposicionId) {
        return {
          ...r,
          estado: 'desembolsada',
          aprobadoPor: `${currentUser.name} (${currentUser.cargo})`,
          fechaAprobacion: dateStr,
          bancoCuentaOrigen: bancoCuenta,
          referenciaTransferencia: referencia,
        };
      }
      return r;
    }));

    // Mark the invoices as included in this replenishment cycle
    setFacturas(prev => prev.map(f => {
      if (rep.facturasIds.includes(f.id)) {
        return {
          ...f,
          incluidaEnReposicionId: reposicionId,
        };
      }
      return f;
    }));

    logAudit(
      'Desembolso y Reposición de Caja Menor',
      'Administración del Fondo',
      `Gerencia autorizó y desembolsó reposición ${reposicionId} por $${rep.valorTotal.toLocaleString('es-CO')} COP. Fondo restablecido.`
    );

    return {
      success: true,
      message: `Reposición ${reposicionId} aprobada y ejecutada. El fondo ha sido restablecido a su tope de $2.000.000 COP.`,
    };
  };

  // 8. Registrar Arqueo Físico
  const registrarArqueo = (data: Omit<ArqueoCaja, 'id' | 'fecha' | 'realizadoPor' | 'cargoRealizado' | 'saldoCalculado' | 'diferencia' | 'estadoDiferencia'>) => {
    const saldoCalculado = data.conteoEfectivoFisico + data.anticiposPendientesTotal + data.facturasSoportesTotal;
    const diferencia = saldoCalculado - data.fondoFijoBase;
    const estadoDiferencia = diferencia === 0 ? 'cuadrado' : (diferencia > 0 ? 'sobrante' : 'faltante');

    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const nextNum = arqueos.length + 1;
    const newId = `ARQ-2026-${String(nextNum).padStart(3, '0')}`;

    const newArq: ArqueoCaja = {
      ...data,
      id: newId,
      fecha: dateStr,
      realizadoPor: currentUser.name,
      cargoRealizado: currentUser.cargo,
      saldoCalculado,
      diferencia,
      estadoDiferencia,
    };

    setArqueos(prev => [newArq, ...prev]);

    logAudit(
      'Realización de Arqueo Físico Mensual',
      'Informes y Arqueo',
      `Ejecutó arqueo ${newId}. Efectivo físico: $${data.conteoEfectivoFisico.toLocaleString('es-CO')}, Diferencia: $${diferencia.toLocaleString('es-CO')} (${estadoDiferencia})`
    );

    return {
      success: true,
      message: `Arqueo físico ${newId} registrado con éxito. Resultado: ${estadoDiferencia.toUpperCase()}.`,
      id: newId,
    };
  };

  // 9. Actualizar PHVA
  const actualizarPHVA = (id: string, nuevoEstado: PHVAItem['estado'], nuevaEvidencia?: string) => {
    setPhvaItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          estado: nuevoEstado,
          evidencia: nuevaEvidencia || item.evidencia,
        };
      }
      return item;
    }));

    logAudit(
      'Actualización Ciclo PHVA',
      'Control PHVA',
      `Modificó estado de tarea PHVA ${id} a "${nuevoEstado}"`
    );
  };

  // 10. Resolver Alerta
  const resolverAlerta = (id: string) => {
    setAlertas(prev => prev.map(a => a.id === id ? { ...a, resuelta: true } : a));
  };

  // Reiniciar datos
  const reiniciarDatosDemo = () => {
    localStorage.removeItem(`${STORAGE_KEY}_solicitudes`);
    localStorage.removeItem(`${STORAGE_KEY}_facturas`);
    localStorage.removeItem(`${STORAGE_KEY}_reposiciones`);
    localStorage.removeItem(`${STORAGE_KEY}_arqueos`);
    localStorage.removeItem(`${STORAGE_KEY}_phva`);
    localStorage.removeItem(`${STORAGE_KEY}_logs`);
    localStorage.removeItem(`${STORAGE_KEY}_alertas`);
    setSolicitudes(INITIAL_SOLICITUDES);
    setFacturas(INITIAL_FACTURAS);
    setReposiciones(INITIAL_REPOSICIONES);
    setArqueos(INITIAL_ARQUEOS);
    setPhvaItems(INITIAL_PHVA);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setAlertas(INITIAL_ALERTAS);
    setCurrentUser(USERS[1]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUserRole,
        users: USERS,
        solicitudes,
        facturas,
        reposiciones,
        arqueos,
        phvaItems,
        auditLogs,
        alertas,
        fondoFijoTotal: FONDO_FIJO_TOTAL,
        efectivoDisponible,
        anticiposEnTransito,
        facturasAprobadasTotal,
        totalGastosEjecutados,
        porcentajeEjecucion,
        gastosPorCategoria,
        createSolicitud,
        autorizarSolicitud,
        entregarDineroAnticipo,
        registrarFactura,
        revisarFactura,
        solicitarReposicion,
        aprobarReposicion,
        registrarArqueo,
        actualizarPHVA,
        resolverAlerta,
        reiniciarDatosDemo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
