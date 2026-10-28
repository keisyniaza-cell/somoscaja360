export type UserRole = 
  | 'gerente' 
  | 'coordinador' 
  | 'custodio' 
  | 'colaborador' 
  | 'contador';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  cargo: string;
  email: string;
  area: string;
}

export type ExpenseCategory =
  | 'Papelería y útiles'
  | 'Transporte y movilización'
  | 'Materiales para actividades comunitarias'
  | 'Aseo y cafetería'
  | 'Impresiones y fotocopias'
  | 'Gastos imprevistos autorizados';

export const CATEGORY_BUDGETS: Record<ExpenseCategory, number> = {
  'Papelería y útiles': 300000,
  'Transporte y movilización': 400000,
  'Materiales para actividades comunitarias': 500000,
  'Aseo y cafetería': 250000,
  'Impresiones y fotocopias': 150000,
  'Gastos imprevistos autorizados': 400000,
};

export const FONDO_FIJO_TOTAL = 2000000;
export const LIMITE_MAX_COMPRA = 300000;

export type SolicitudEstado = 
  | 'pendiente' 
  | 'aprobada' 
  | 'rechazada' 
  | 'entregada' 
  | 'legalizada';

export interface SolicitudGasto {
  id: string; // ej: SOL-2026-001
  fecha: string;
  solicitanteId: string;
  solicitanteNombre: string;
  solicitanteCargo: string;
  areaProyecto: string;
  concepto: string;
  justificacion: string;
  categoria: ExpenseCategory;
  valorEstimado: number;
  estado: SolicitudEstado;
  autorizadoPor?: string;
  fechaAutorizacion?: string;
  motivoRechazo?: string;
  dineroEntregado?: boolean;
  fechaEntrega?: string;
  custodioEntrega?: string;
  facturaId?: string;
}

export type TipoDocumento =
  | 'Factura Electrónica de Venta'
  | 'Documento Equivalente'
  | 'Documento Soporte a No Obligados'
  | 'Comprobante Interno de Caja';

export type EstadoFactura =
  | 'registrada'
  | 'en_revision'
  | 'aprobada'
  | 'rechazada'
  | 'pendiente_correccion';

export interface FacturaRegistro {
  id: string; // FAC-2026-001
  solicitudId: string;
  numeroFactura: string;
  tipoDocumento: TipoDocumento;
  fecha: string;
  proveedor: string;
  nit: string;
  concepto: string;
  categoria: ExpenseCategory;
  valorAntesImpuestos: number;
  impuestos: number;
  valorTotal: number;
  responsable: string;
  areaProyecto: string;
  archivoNombre: string;
  archivoTipo: 'pdf' | 'xml' | 'imagen';
  archivoSimuladoData?: {
    cufe?: string;
    fechaValidacionDian?: string;
    items?: Array<{ descripcion: string; cantidad: number; unitario: number; subtotal: number }>;
  };
  estado: EstadoFactura;
  observacionesRevision?: string;
  revisadoPor?: string;
  fechaRevision?: string;
  incluidaEnReposicionId?: string;
}

export interface ReposicionCiclo {
  id: string; // REP-2026-001
  fechaSolicitud: string;
  solicitadoPor: string;
  valorTotal: number;
  facturasIds: string[];
  estado: 'solicitada' | 'aprobada' | 'desembolsada';
  aprobadoPor?: string;
  fechaAprobacion?: string;
  bancoCuentaOrigen?: string;
  referenciaTransferencia?: string;
}

export interface DenominacionesConteo {
  billetes: Record<number, number>; // 100000, 50000, 20000, 10000, 5000, 2000
  monedas: Record<number, number>; // 1000, 500, 200, 100, 50
}

export interface ArqueoCaja {
  id: string; // ARQ-2026-001
  fecha: string;
  realizadoPor: string;
  cargoRealizado: string;
  verificadoPor: string;
  fondoFijoBase: number;
  conteoEfectivoFisico: number;
  denominaciones: DenominacionesConteo;
  anticiposPendientesTotal: number;
  facturasSoportesTotal: number;
  saldoCalculado: number;
  diferencia: number;
  estadoDiferencia: 'cuadrado' | 'sobrante' | 'faltante';
  observaciones: string;
}

export interface PHVAItem {
  id: string;
  etapa: 'P' | 'H' | 'V' | 'A';
  titulo: string;
  descripcion: string;
  responsable: string;
  estado: 'cumplido' | 'en_progreso' | 'pendiente';
  fechaMeta: string;
  evidencia: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  usuario: string;
  rol: string;
  accion: string;
  modulo: string;
  detalles: string;
  ipSimulada: string;
}

export interface AlertaSistema {
  id: string;
  tipo: 'warning' | 'info' | 'danger' | 'success';
  titulo: string;
  mensaje: string;
  fecha: string;
  moduloTarget: string;
  resuelta?: boolean;
}
