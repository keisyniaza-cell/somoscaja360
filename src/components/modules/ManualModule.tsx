import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { 
  BookOpen, 
  Download, 
  Printer, 
  Trash2, 
  Server, 
  Laptop, 
  Smartphone, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  Check, 
  FileJson, 
  AlertTriangle, 
  ArrowRight,
  ExternalLink,
  Layers,
  Terminal,
  HelpCircle,
  Users
} from 'lucide-react';

export const ManualModule: React.FC = () => {
  const { 
    solicitudes, 
    facturas, 
    reposiciones, 
    arqueos, 
    auditLogs, 
    currentUser,
    reiniciarDatosDemo
  } = useApp();

  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  const [activeTab, setActiveTab] = useState<'usuario' | 'instalar' | 'desinstalar'>('usuario');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [installStatusMsg, setInstallStatusMsg] = useState<string | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      const ok = await install();
      if (ok) {
        setInstallStatusMsg('¡Instalación completada exitosamente en este dispositivo!');
      }
    } else {
      // In web preview environments where beforeinstallprompt isn't fired yet
      setInstallStatusMsg(
        'Para instalar en su navegador: Haga clic en el ícono de instalar (pantalla con flecha) en la barra de direcciones de Chrome/Edge, o use el menú del navegador "Instalar SomosCaja 360".'
      );
    }
    setTimeout(() => setInstallStatusMsg(null), 7000);
  };

  // Full Backup Generator
  const handleDownloadFullBackup = () => {
    const backupData = {
      sistema: 'SomosCaja 360',
      organizacion: 'Corporación Social Somos Uno',
      nit: '900.821.554-1',
      fechaExportacion: new Date().toISOString(),
      exportadoPor: `${currentUser.name} (${currentUser.cargo})`,
      fondoFijoAutorizado: 2000000,
      limiteMaximoCompra: 300000,
      datos: {
        solicitudes,
        facturas,
        reposiciones,
        arqueos,
        bitacoraAuditoria: auditLogs,
      }
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Copia_Seguridad_SomosCaja_SomosUno_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Safe purge of local data
  const handlePurgeAllData = () => {
    const confirmBackup = window.confirm(
      'ADVERTENCIA DE SEGURIDAD:\n¿Ha descargado primero una copia de seguridad de auditoría?\n\nAl continuar, se eliminarán todos los registros locales de caja menor y la aplicación volverá al estado de fábrica.'
    );
    if (!confirmBackup) return;

    const confirmFinal = window.prompt(
      'Para confirmar la eliminación definitiva de datos locales, escriba "ELIMINAR":'
    );
    if (confirmFinal === 'ELIMINAR') {
      reiniciarDatosDemo();
      alert('Se han purgado los datos temporales del equipo.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <span>Guía Técnica & Operativa Oficial</span>
            <span>·</span>
            <span>Corporación Social Somos Uno</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Manual de Usuario, Instalación y Desinstalación
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Instructivo integral con los roles y procedimientos operativos de caja menor, despliegue como aplicación nativa/PWA, configuración en servidores y desinstalación segura.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg shrink-0">
          <button
            onClick={() => setActiveTab('usuario')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'usuario' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Manual de Usuario
          </button>
          <button
            onClick={() => setActiveTab('instalar')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'instalar' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cómo Instalar
          </button>
          <button
            onClick={() => setActiveTab('desinstalar')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'desinstalar' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cómo Desinstalar
          </button>
        </div>
      </div>

      {/* TAB 1: MANUAL DE USUARIO */}
      {activeTab === 'usuario' && (
        <div className="space-y-6">
          {/* Print Action Banner */}
          <div className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-xl border border-slate-800">
            <div>
              <div className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-0.5">
                Reglamento Operativo Oficial
              </div>
              <p className="text-xs text-slate-300">
                Fondo fijo autorizado: $2.000.000 COP · Límite máximo por compra: $300.000 COP · Arqueo físico: mensual.
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg transition-colors shrink-0"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir Manual Completo
            </button>
          </div>

          {/* Roles & Responsibilities Section */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-800" />
              1. Responsabilidades por Rol en la Plataforma
            </h2>
            <p className="text-xs text-slate-500">
              Conforme al principio de control interno recomendado: ninguna persona debe autorizar, custodiar y auditar sus propias operaciones.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">G</div>
                  <span>Gerente / Rep. Legal</span>
                </div>
                <div className="text-[11px] font-medium text-slate-600">Dra. Keisy Niaza</div>
                <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                  <li>Autorizar la apertura formal del fondo ($2.000.000 COP).</li>
                  <li>Supervisar el funcionamiento y autorizar excepciones justificadas.</li>
                  <li>Aprobar los ciclos de reposición y ordenar los giros bancarios de reembolso.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px]">C</div>
                  <span>Coordinador(a) Financiero(a)</span>
                </div>
                <div className="text-[11px] font-medium text-slate-600">Karen Ortiz</div>
                <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                  <li>Revisar y autorizar solicitudes de compra (&le; $300.000).</li>
                  <li>Validar facturas y verificar soportes cargados por colaboradores.</li>
                  <li>Consolidar las facturas aprobadas y radicar las reposiciones.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <div className="w-6 h-6 rounded-full bg-slate-700 text-white flex items-center justify-center text-[10px]">R</div>
                  <span>Custodio de Caja Menor</span>
                </div>
                <div className="text-[11px] font-medium text-slate-600">Carlos Restrepo</div>
                <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                  <li>Custodiar físicamente el efectivo en la caja de seguridad.</li>
                  <li>Entregar dinero únicamente con solicitud autorizada previa.</li>
                  <li>Emitir comprobante de entrega y realizar el conteo mensual en arqueo.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <div className="w-6 h-6 rounded-full bg-slate-600 text-white flex items-center justify-center text-[10px]">P</div>
                  <span>Colaboradores de Proyectos</span>
                </div>
                <div className="text-[11px] font-medium text-slate-600">María Camila Gómez y Equipo</div>
                <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                  <li>Radicar la solicitud antes de efectuar la compra.</li>
                  <li>Recibir el efectivo y firmar el comprobante provisional.</li>
                  <li>Cargar la factura electrónica o soporte en menos de 48 horas.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 md:col-span-2 lg:col-span-2">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px]">T</div>
                  <span>Contador(a) Público</span>
                </div>
                <div className="text-[11px] font-medium text-slate-600">Andrés Felipe Vargas (TP 189422-T)</div>
                <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                  <li>Verificar el cumplimiento tributario (CUFE, XML, Art. 617 E.T. y Res. DIAN 000167/2021).</li>
                  <li>Supervisar el arqueo físico de caja mensual y emitir el dictamen contable.</li>
                  <li>Realizar la causación contable e imputación en el software contable de Somos Uno.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 10 Step Operational Flow */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-800" />
              2. Paso a Paso Oficial para Manejar la Caja Menor
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {[
                {
                  paso: '1. Constitución del fondo',
                  desc: 'La Gerencia autoriza la apertura de la caja menor por $2.000.000 y designa al custodio responsable.',
                },
                {
                  paso: '2. Solicitud de dinero',
                  desc: 'El colaborador registra en el módulo de solicitudes qué necesita, justificación social, valor aproximado y proyecto.',
                },
                {
                  paso: '3. Revisión de la solicitud',
                  desc: 'El área administrativa verifica la necesidad, vinculación con Somos Uno y que el monto no exceda $300.000 COP.',
                },
                {
                  paso: '4. Autorización formal',
                  desc: 'La persona autorizada aprueba o rechaza. El sistema registra fecha, hora y usuario autorizador.',
                },
                {
                  paso: '5. Entrega del dinero',
                  desc: 'El custodio registra la entrega física en efectivo y emite el Comprobante Provisional de Egreso.',
                },
                {
                  paso: '6. Realización de la compra',
                  desc: 'El colaborador efectúa la compra y exige la factura electrónica o documento válido ante la DIAN.',
                },
                {
                  paso: '7. Registro y legalización',
                  desc: 'Se ingresa al módulo de facturas, se diligencian los datos y se carga el archivo XML/PDF de soporte.',
                },
                {
                  paso: '8. Verificación contable',
                  desc: 'El área administrativa y el contador revisan que los valores coincidan y no existan duplicados.',
                },
                {
                  paso: '9. Reposición del fondo',
                  desc: 'Se seleccionan los gastos aprobados para generar el reembolso que restablece el fondo a $2.000.000 COP.',
                },
                {
                  paso: '10. Cierre y arqueo mensual',
                  desc: 'Se cuenta el dinero físico, se cotejan los soportes y se suscribe el Acta de Arqueo Formal.',
                },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1">
                  <div className="font-bold text-slate-900 text-xs">{item.paso}</div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MANUAL DE INSTALACIÓN */}
      {activeTab === 'instalar' && (
        <div className="space-y-6">
          {/* PWA 1-Click Install Card */}
          <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider mb-1">
                  <Laptop className="w-4 h-4" />
                  <span>Método Recomendado: Aplicación Web Progresiva (PWA)</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Instalar SomosCaja 360 en este Dispositivo
                </h3>
                <p className="text-xs text-slate-300 max-w-xl mt-1 leading-relaxed">
                  Permite usar SomosCaja 360 como un programa de escritorio en Windows/Mac o aplicación móvil en Android/iOS, con ícono directo en su pantalla y funcionamiento instantáneo.
                </p>
              </div>

              <div className="shrink-0">
                <button
                  onClick={handleInstallClick}
                  className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-lg shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Instalar Aplicación Ahora
                </button>
              </div>
            </div>

            {installStatusMsg && (
              <div className="p-3 bg-sky-950 border border-sky-600 text-sky-200 rounded-lg text-xs animate-in fade-in">
                {installStatusMsg}
              </div>
            )}
          </div>

          {/* Step-by-Step Installation Guides by Platform */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Windows / Mac / Chrome / Edge */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Laptop className="w-4 h-4 text-slate-800" />
                Windows & Mac (Chrome/Edge)
              </div>
              <ol className="list-decimal list-inside space-y-2 text-slate-600 leading-relaxed text-[11px]">
                <li>Abra la plataforma en Google Chrome o Microsoft Edge.</li>
                <li>Mire el extremo derecho de la barra de direcciones URL.</li>
                <li>Haga clic en el icono de <strong>Instalar</strong> (pantalla con flecha).</li>
                <li>Haga clic en <strong>&quot;Instalar&quot;</strong> en la ventana emergente.</li>
                <li>Se creará un acceso directo en su escritorio y menú de inicio.</li>
              </ol>
            </div>

            {/* Android */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                Dispositivos Android
              </div>
              <ol className="list-decimal list-inside space-y-2 text-slate-600 leading-relaxed text-[11px]">
                <li>Abra el enlace en Chrome desde su teléfono o tableta.</li>
                <li>Toque el botón de opciones (tres puntos verticales arriba a la derecha).</li>
                <li>Seleccione <strong>&quot;Agregar a la pantalla principal&quot;</strong> o <strong>&quot;Instalar app&quot;</strong>.</li>
                <li>Confirme el nombre &quot;SomosCaja&quot; y toque <strong>Instalar</strong>.</li>
                <li>La app se añadirá al cajón de aplicaciones de su teléfono.</li>
              </ol>
            </div>

            {/* iPhone / iPad */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-sky-600" />
                iPhone / iPad (Safari)
              </div>
              <ol className="list-decimal list-inside space-y-2 text-slate-600 leading-relaxed text-[11px]">
                <li>Abra la URL de la plataforma en el navegador <strong>Safari</strong>.</li>
                <li>Toque el botón <strong>Compartir</strong> (cuadrado con flecha hacia arriba).</li>
                <li>Desplácese hacia abajo en el menú y toque <strong>&quot;Agregar a inicio&quot;</strong>.</li>
                <li>Toque <strong>&quot;Agregar&quot;</strong> en la esquina superior derecha.</li>
                <li>El icono institucional aparecerá en la pantalla de inicio de su iPhone.</li>
              </ol>
            </div>
          </div>

          {/* Technical Server Installation */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-slate-800" />
                  Instalación en Servidor Local / Red Institucional Somos Uno
                </h3>
                <p className="text-xs text-slate-500">
                  Para desplegar en el servidor físico o nube privada de la corporación
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600 text-xs">
                <strong>Requisitos mínimos:</strong> Node.js v18.0 o superior, npm v9 o pnpm, 2 GB de memoria RAM libre.
              </p>

              {/* Code Blocks with copy */}
              {[
                {
                  titulo: 'Paso 1: Clonar e instalar dependencias',
                  codigo: 'git clone https://github.com/somosuno/somoscaja-360.git\ncd somoscaja-360\nnpm install',
                },
                {
                  titulo: 'Paso 2: Ejecución en desarrollo local',
                  codigo: 'npm run dev',
                },
                {
                  titulo: 'Paso 3: Compilar y desplegar para producción',
                  codigo: 'npm run build\nnpx serve -s dist -l 3000',
                },
                {
                  titulo: 'Paso 4: Servicio persistente con PM2 (Servidor Linux)',
                  codigo: 'npm install -g pm2\npm2 start "npx serve -s dist -l 3000" --name "somoscaja-360"\npm2 save',
                },
              ].map((step, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="font-semibold text-slate-800 text-[11px]">{step.titulo}</div>
                  <div className="relative bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-[11px] overflow-x-auto">
                    <pre>{step.codigo}</pre>
                    <button
                      onClick={() => copyToClipboard(step.codigo, idx)}
                      className="absolute top-2 right-2 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] flex items-center gap-1"
                    >
                      {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedIndex === idx ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MANUAL DE DESINSTALACIÓN */}
      {activeTab === 'desinstalar' && (
        <div className="space-y-6">
          {/* Warning Banner */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 space-y-2">
            <div className="font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Protocolo de Protección Fiscal antes de Desinstalar</span>
            </div>
            <p className="leading-relaxed">
              De conformidad con el artículo 632 del Estatuto Tributario y la Ley 1581 de 2012, la Corporación Social Somos Uno debe <strong>conservar los soportes y registros contables durante mínimo 5 años</strong>. Asegúrese de descargar una copia de seguridad íntegra antes de retirar la aplicación de cualquier equipo.
            </p>
          </div>

          {/* Backup & Factory Reset Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Backup Box */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileJson className="w-4 h-4 text-emerald-600" />
                Paso Previo Obligatorio: Copia de Seguridad
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Descargue un archivo estructurado con todas las solicitudes, facturas, arqueos mensuales, reposiciones y la bitácora de auditoría.
              </p>
              <button
                onClick={handleDownloadFullBackup}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Descargar Copia de Seguridad Completa (.JSON)
              </button>
            </div>

            {/* Clean Data Box */}
            <div className="bg-white p-5 rounded-xl border border-rose-200 space-y-3">
              <div className="font-bold text-rose-900 text-sm flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-rose-600" />
                Purga y Limpieza Segura de Datos Locales
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Elimina los datos almacenados en la memoria caché del navegador de este equipo para dejarlo en su estado original sin rastros de información contable.
              </p>
              <button
                onClick={handlePurgeAllData}
                className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-semibold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Purgar Datos Locales de este Equipo
              </button>
            </div>
          </div>

          {/* Step-by-Step Uninstall Procedures */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Instrucciones de Desinstalación por Sistema Operativo
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900">Desinstalar en Windows 10 / 11</div>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 leading-relaxed text-[11px]">
                  <li>Abra el menú <strong>Inicio</strong> de Windows.</li>
                  <li>Vaya a <strong>Configuración &gt; Aplicaciones &gt; Aplicaciones instaladas</strong>.</li>
                  <li>Busque <strong>&quot;SomosCaja 360&quot;</strong> en la lista.</li>
                  <li>Haga clic en los tres puntos y seleccione <strong>Desinstalar</strong>.</li>
                  <li>Marque la casilla &quot;Borrar también datos de navegación de Chrome/Edge&quot; si desea una remoción total.</li>
                </ol>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900">Desinstalar directamente desde el Navegador (Chrome/Edge)</div>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 leading-relaxed text-[11px]">
                  <li>Abra la ventana de la aplicación SomosCaja 360.</li>
                  <li>Haga clic en el menú de <strong>tres puntos</strong> en la barra superior de la ventana.</li>
                  <li>Haga clic en <strong>&quot;Desinstalar SomosCaja 360...&quot;</strong></li>
                  <li>Haga clic en <strong>&quot;Quitar&quot;</strong> en el diálogo de confirmación.</li>
                </ol>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900">Desinstalar en macOS</div>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 leading-relaxed text-[11px]">
                  <li>Abra <strong>Finder</strong> y vaya a la carpeta <strong>Aplicaciones</strong>.</li>
                  <li>Ubique la carpeta <strong>&quot;Aplicaciones de Chrome&quot;</strong>.</li>
                  <li>Arrastre el ícono de <strong>SomosCaja 360</strong> a la <strong>Papelera</strong>.</li>
                  <li>Vacíe la papelera para completar la desinstalación.</li>
                </ol>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900">Desinstalar en Servidores (PM2 / Docker)</div>
                <div className="bg-slate-900 text-slate-200 p-2.5 rounded font-mono text-[10px] space-y-1">
                  <div># Detener servicio PM2</div>
                  <div className="text-sky-300">pm2 stop somoscaja-360 &amp;&amp; pm2 delete somoscaja-360</div>
                  <div className="pt-1"># O si usó Docker</div>
                  <div className="text-sky-300">docker compose down --volumes</div>
                  <div className="pt-1"># Eliminar archivos del proyecto</div>
                  <div className="text-sky-300">rm -rf dist node_modules</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
