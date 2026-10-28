import React, { useState } from 'react';
import { 
  BookOpen, 
  ShieldCheck, 
  FileCheck, 
  Printer, 
  AlertTriangle, 
  ExternalLink,
  Scale,
  Building,
  UserCheck
} from 'lucide-react';
import { formatCOP } from '../../utils/formatters';

export const NormatividadModule: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'compendio' | 'generador'>('compendio');

  // Generator state for "Documento Soporte en Adquisiciones Efectuadas a Sujetos No Obligados a Expedir Factura"
  const [docSoporte, setDocSoporte] = useState({
    numeroConsecutivo: 'DS-2026-0042',
    fecha: new Date().toISOString().split('T')[0],
    proveedorNombre: 'Jaime Alberto Montaño',
    proveedorDocumento: 'CC 14.892.301 de Cali',
    direccion: 'Carrera 15 # 24-50, Barrio Obrero',
    telefono: '312 849 2011',
    descripcionServicio: 'Servicio de logística y montaje de carpas para jornada comunitaria Somos Uno',
    valorOperacion: 180000,
    retencionFuente: 0,
    autorizadoPor: 'Karen Ortiz (Coordinadora Financiera)',
    elaboradoPor: 'Carlos Restrepo (Custodio de Caja Menor)',
  });

  const legalRules = [
    {
      norma: 'Estatuto Tributario, Artículo 615',
      tema: 'Obligación de expedir factura o documento equivalente',
      impacto: 'Para efectos tributarios, todas las personas o entidades que tengan la calidad de comerciantes, ejerzan profesiones liberales o presten servicios están obligadas a expedir factura.',
      aplicacion: 'La Corporación debe exigir factura electrónica a todo proveedor legalmente obligado.',
    },
    {
      norma: 'Estatuto Tributario, Artículo 617',
      tema: 'Requisitos de la factura de venta',
      impacto: 'Estar denominada expresamente como factura de venta, datos del vendedor (nombre, NIT), fecha, valor discriminado, CUFE y QR.',
      aplicacion: 'La plataforma valida que cada soporte adjunto contenga el NIT, numeración y valor total exacto.',
    },
    {
      norma: 'Estatuto Tributario, Artículo 618',
      tema: 'Obligación de exigir factura por parte del comprador',
      impacto: 'Los adquirentes de bienes y servicios tienen el deber legal de exigir factura o documento equivalente.',
      aplicacion: 'Ningún colaborador puede recibir un reembolso de caja menor sin haber solicitado y aportado la factura o documento válido.',
    },
    {
      norma: 'Estatuto Tributario, Artículo 771-2',
      tema: 'Requisitos para la procedencia de costos y deducciones',
      impacto: 'Para la procedencia de costos y deducciones en el impuesto sobre la renta se requerirá de facturas con el cumplimiento de requisitos fiscales.',
      aplicacion: 'Protege a Somos Uno ante auditorías fiscales de la DIAN evitando que los gastos de caja menor sean catalogados como no deducibles.',
    },
    {
      norma: 'Resolución DIAN 000167 de 2021',
      tema: 'Documento Soporte Electrónico a No Obligados a Facturar',
      impacto: 'Reglamenta el documento soporte en adquisiciones efectuadas a sujetos no obligados a expedir factura o documento equivalente.',
      aplicacion: 'Cuando se compra a personas naturales informales o transportadores comunitarios, Somos Uno debe emitir el documento soporte institucional.',
    },
    {
      norma: 'Ley 1314 de 2009 y Dec. 2420 de 2015',
      tema: 'Marco Técnico Normativo Contable (NIIF en Colombia)',
      impacto: 'Regula las normas de aseguramiento de la información y preparación de estados financieros.',
      aplicacion: 'La caja menor se clasifica contablemente en el activo corriente (Efectivo y equivalentes de efectivo).',
    },
    {
      norma: 'Ley 1581 de 2012',
      tema: 'Protección de Datos Personales (Habeas Data)',
      impacto: 'Garantiza la confidencialidad de la información personal de proveedores y colaboradores.',
      aplicacion: 'Los números de documento, firmas y teléfonos registrados en la plataforma son custodiados con estricta reserva.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <span>Paso 4 & 7 del Documento</span>
            <span>·</span>
            <span>Cumplimiento Legal Colombiano (DIAN)</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Normatividad Legal & Documento Soporte
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Fundamentos tributarios para entidades privadas sin ánimo de lucro y herramienta para emitir Documentos Soporte válidos ante la DIAN.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg shrink-0">
          <button
            onClick={() => setActiveSubTab('compendio')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSubTab === 'compendio' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Marco Legal Aplicable
          </button>
          <button
            onClick={() => setActiveSubTab('generador')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSubTab === 'generador' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Generar Doc. Soporte
          </button>
        </div>
      </div>

      {activeSubTab === 'compendio' && (
        <div className="space-y-4">
          {/* Important DIAN Clarification Note (Page 4) */}
          <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-amber-950">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Regla Fundamental de Gestión Documental Tributaria</span>
            </div>
            <p className="leading-relaxed">
              &quot;Cuando se compra a un proveedor no obligado a expedir factura, el comprador debe generar el documento soporte correspondiente cuando aplique, cumpliendo los requisitos y condiciones de la DIAN. Un recibo informal o una simple fotografía <strong>no sustituyen automáticamente el documento tributario exigible</strong>.&quot;
            </p>
          </div>

          {/* Legal Articles Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
            {legalRules.map((rule, idx) => (
              <div key={idx} className="p-5 hover:bg-slate-50/60 transition-colors space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Scale className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{rule.norma}</span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 font-mono">
                    {rule.tema}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {rule.impacto}
                </p>

                <div className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 text-slate-700">
                  <strong className="text-slate-900">Aplicación en la plataforma SomosCaja: </strong>
                  {rule.aplicacion}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 2: GENERADOR DE DOCUMENTO SOPORTE DIAN */}
      {activeSubTab === 'generador' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form parameters */}
          <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 space-y-3.5 text-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              Datos del Sujeto No Obligado a Facturar
            </h3>
            <p className="text-[11px] text-slate-500">
              Conforme a la Resolución DIAN 000167 de 2021 para compras o servicios de personas naturales.
            </p>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Consecutivo Documento Soporte
              </label>
              <input
                type="text"
                value={docSoporte.numeroConsecutivo}
                onChange={(e) => setDocSoporte({ ...docSoporte, numeroConsecutivo: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nombre Completo del Proveedor
              </label>
              <input
                type="text"
                value={docSoporte.proveedorNombre}
                onChange={(e) => setDocSoporte({ ...docSoporte, proveedorNombre: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Cédula / Documento
                </label>
                <input
                  type="text"
                  value={docSoporte.proveedorDocumento}
                  onChange={(e) => setDocSoporte({ ...docSoporte, proveedorDocumento: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="text"
                  value={docSoporte.telefono}
                  onChange={(e) => setDocSoporte({ ...docSoporte, telefono: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Descripción del Servicio o Bien Entregado
              </label>
              <textarea
                rows={2}
                value={docSoporte.descripcionServicio}
                onChange={(e) => setDocSoporte({ ...docSoporte, descripcionServicio: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 resize-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Valor Total Pagado en Efectivo (COP)
              </label>
              <input
                type="number"
                max="300000"
                value={docSoporte.valorOperacion}
                onChange={(e) => setDocSoporte({ ...docSoporte, valorOperacion: Number(e.target.value) })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 font-mono font-bold"
              />
            </div>

            <button
              onClick={() => window.print()}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-xs flex items-center justify-center gap-2"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir Documento Soporte Oficial
            </button>
          </div>

          {/* Printable Preview */}
          <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-300 shadow-xs space-y-4 text-xs font-sans">
            <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-start">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  CORPORACIÓN SOCIAL SOMOS UNO
                </h3>
                <div className="text-[11px] text-slate-600">NIT: 900.821.554-1 · Régimen Tributario Especial</div>
                <div className="text-[10px] text-slate-500">Calle 5 # 38-25, Cali, Valle del Cauca · Tel: (602) 555-0192</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-500">Documento Soporte</div>
                <div className="text-sm font-bold font-mono text-slate-900">{docSoporte.numeroConsecutivo}</div>
                <div className="text-[10px] text-slate-500">Res. DIAN 000167/2021</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px]">
              <div>
                <span className="text-slate-500 block">Adquirido de:</span>
                <span className="font-bold text-slate-900">{docSoporte.proveedorNombre}</span>
                <span className="block text-slate-600">{docSoporte.proveedorDocumento}</span>
                <span className="block text-slate-500">Tel: {docSoporte.telefono}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Fecha de Expedición:</span>
                <span className="font-bold text-slate-900">{docSoporte.fecha}</span>
                <span className="text-slate-500 block mt-1">Forma de Pago:</span>
                <span className="font-medium text-slate-800">Efectivo (Caja Menor)</span>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-[11px]">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-2 text-left">Descripción del Bien o Servicio</th>
                    <th className="p-2 text-right">Cantidad</th>
                    <th className="p-2 text-right">Valor Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 text-slate-800">{docSoporte.descripcionServicio}</td>
                    <td className="p-2 text-right">1</td>
                    <td className="p-2 text-right font-mono font-bold text-slate-900">{formatCOP(docSoporte.valorOperacion)}</td>
                  </tr>
                </tbody>
                <tfoot className="border-t border-slate-200 font-bold bg-slate-50">
                  <tr>
                    <td colSpan={2} className="p-2 text-right">TOTAL PAGADO:</td>
                    <td className="p-2 text-right font-mono text-slate-900">{formatCOP(docSoporte.valorOperacion)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="text-[10px] text-slate-500 leading-relaxed border-t border-slate-100 pt-2">
              El suscrito proveedor declara bajo la gravedad de juramento que no está obligado a expedir factura de venta ni documento equivalente, de conformidad con el artículo 616-2 del Estatuto Tributario y el Decreto 1625 de 2016.
            </div>

            <div className="pt-8 grid grid-cols-2 gap-8 text-[11px] text-center">
              <div className="border-t border-slate-400 pt-1">
                <div className="font-semibold text-slate-900">{docSoporte.proveedorNombre}</div>
                <div className="text-[10px] text-slate-500">Firma del Proveedor / Prestador</div>
              </div>
              <div className="border-t border-slate-400 pt-1">
                <div className="font-semibold text-slate-900">Carlos Restrepo</div>
                <div className="text-[10px] text-slate-500">Custodio Caja Menor Somos Uno</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
