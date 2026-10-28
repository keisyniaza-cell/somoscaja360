import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PHVAItem } from '../../types';
import { 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Target, 
  ArrowRight,
  ShieldCheck,
  Award
} from 'lucide-react';

export const PHVAModule: React.FC = () => {
  const { phvaItems, actualizarPHVA } = useApp();
  const [activeStage, setActiveStage] = useState<'ALL' | 'P' | 'H' | 'V' | 'A'>('ALL');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editEvidencia, setEditEvidencia] = useState('');

  const cumplidas = phvaItems.filter(i => i.estado === 'cumplido').length;
  const progresoGeneral = Math.round((cumplidas / phvaItems.length) * 100);

  const filteredItems = activeStage === 'ALL' 
    ? phvaItems 
    : phvaItems.filter(i => i.etapa === activeStage);

  const stagesMeta = [
    {
      code: 'P',
      name: 'Planear',
      desc: 'Fondo $2M, límite $300k, asignación y políticas',
      color: 'border-sky-500 bg-sky-50 text-sky-800',
    },
    {
      code: 'H',
      name: 'Hacer',
      desc: 'Solicitudes, aprobaciones, compras y facturación',
      color: 'border-emerald-500 bg-emerald-50 text-emerald-800',
    },
    {
      code: 'V',
      name: 'Verificar',
      desc: 'Revisión DIAN, cotejo documental y arqueo mensual',
      color: 'border-amber-500 bg-amber-50 text-amber-800',
    },
    {
      code: 'A',
      name: 'Actuar',
      desc: 'Acciones correctivas, mejoras y actualización',
      color: 'border-purple-500 bg-purple-50 text-purple-800',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <span>Paso 6 del Documento</span>
            <span>·</span>
            <span>Mejora Continua y Sistema de Gestión</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Control de Procesos con el Ciclo PHVA
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Estructuración metódica (Planear, Hacer, Verificar, Actuar) para garantizar que los recursos de la Corporación Social Somos Uno se administren con transparencia y calidad.
          </p>
        </div>

        <div className="text-right bg-slate-50 p-3 rounded-lg border border-slate-200 shrink-0">
          <div className="text-[11px] text-slate-500">Madurez del Proceso</div>
          <div className="text-lg font-bold font-mono text-emerald-700 tabular-nums">
            {progresoGeneral}% Cumplido
          </div>
        </div>
      </div>

      {/* PHVA Stage Cards Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {stagesMeta.map((s) => {
          const itemsInStage = phvaItems.filter(i => i.etapa === s.code);
          const doneInStage = itemsInStage.filter(i => i.estado === 'cumplido').length;
          const isSelected = activeStage === s.code;

          return (
            <div
              key={s.code}
              onClick={() => setActiveStage(isSelected ? 'ALL' : (s.code as any))}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected ? 'ring-2 ring-slate-900 bg-white' : 'bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-base font-mono">{s.code} – {s.name}</span>
                <span className="text-xs font-mono font-semibold text-slate-500">
                  {doneInStage}/{itemsInStage.length}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {s.desc}
              </p>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
                <div
                  className="bg-slate-900 h-full"
                  style={{ width: `${itemsInStage.length ? (doneInStage / itemsInStage.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Matrix */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-900">
            Matriz de Actividades y Evidencias de Control
          </h2>
          <div className="text-xs text-slate-500">
            Mostrando: <strong className="text-slate-800">{activeStage === 'ALL' ? 'Todas las Etapas' : `Etapa ${activeStage}`}</strong>
          </div>
        </div>

        <div className="space-y-3">
          {filteredItems.map((item) => {
            const isEditing = editingId === item.id;

            return (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-800 font-mono">
                        ETAPA {item.etapa}
                      </span>
                      <span className="font-mono text-slate-500">{item.id}</span>
                      <span>·</span>
                      <span className="text-slate-600 font-medium">Resp: {item.responsable}</span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">
                      {item.titulo}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.descripcion}
                    </p>

                    <div className="text-xs text-slate-500 pt-1">
                      <strong className="text-slate-700">Evidencia verificable: </strong>
                      <span>{item.evidencia}</span>
                    </div>
                  </div>

                  {/* Status & Change Action */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0 gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                    <div className="text-[11px] font-semibold uppercase">
                      {item.estado === 'cumplido' && <span className="text-emerald-700">✓ Cumplido</span>}
                      {item.estado === 'en_progreso' && <span className="text-amber-700">En Progreso</span>}
                      {item.estado === 'pendiente' && <span className="text-slate-500">Pendiente</span>}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <select
                        value={item.estado}
                        onChange={(e) => actualizarPHVA(item.id, e.target.value as any)}
                        className="text-xs px-2 py-1 rounded border border-slate-200 bg-slate-50 hover:bg-white focus:outline-hidden"
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="en_progreso">En Progreso</option>
                        <option value="cumplido">Cumplido</option>
                      </select>

                      <button
                        onClick={() => {
                          setEditingId(isEditing ? null : item.id);
                          setEditEvidencia(item.evidencia);
                        }}
                        className="text-[11px] font-medium text-slate-600 hover:text-slate-900 underline px-1"
                      >
                        {isEditing ? 'Cancelar' : 'Editar Evidencia'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Inline Evidence Editor */}
                {isEditing && (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2 pt-2 animate-in fade-in">
                    <label className="block text-[11px] font-semibold text-slate-700">
                      Actualizar soporte o radicado de evidencia:
                    </label>
                    <input
                      type="text"
                      value={editEvidencia}
                      onChange={(e) => setEditEvidencia(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          actualizarPHVA(item.id, item.estado, editEvidencia);
                          setEditingId(null);
                        }}
                        className="px-3 py-1 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded"
                      >
                        Guardar Evidencia
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
