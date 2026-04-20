'use client';

import { Header } from '@/components/layout/header';
import { CheckSquare, AtSign, Filter, Bell, History } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const statusItems = [
  { label: 'Pendiente',   variant: 'neutral' as const,  description: 'Tarea sin iniciar' },
  { label: 'En progreso', variant: 'warning' as const,  description: 'Tarea en curso' },
  { label: 'Completado',  variant: 'success' as const,  description: 'Tarea resuelta' },
  { label: 'Escalado',    variant: 'danger' as const,   description: 'Requiere atención de dirección' },
];

const features = [
  {
    icon: AtSign,
    title: 'Generación por @menciones',
    description: 'Al escribir @usuario en los comentarios del Sourcing Board se crea una tarea automática asignada a ese usuario.',
  },
  {
    icon: Filter,
    title: 'Bandeja personal',
    description: 'Cada usuario ve solo sus tareas pendientes, filtradas por estado y proyecto.',
  },
  {
    icon: Bell,
    title: 'Bloqueo de aprobación',
    description: 'Un proyecto con aprobación condicional no puede pasar a "Aprobado" si tiene tareas pendientes o en progreso.',
  },
  {
    icon: History,
    title: 'Nota de resolución',
    description: 'Al completar o escalar una tarea se registra una nota de resolución para el historial del proyecto.',
  },
];

export default function TasksPage() {
  return (
    <>
      <Header title="Tareas" />
      <div className="p-6">
        {/* Hero */}
        <div
          style={{
            backgroundColor: '#FFFFFF', border: '1px solid #E0E4EB',
            borderRadius: '12px', padding: '32px', textAlign: 'center',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '56px', height: '56px', borderRadius: '50%',
              backgroundColor: '#E8F0FB', marginBottom: '16px',
            }}
          >
            <CheckSquare style={{ width: '28px', height: '28px', color: '#135091' }} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '500', color: '#2C2C2C', marginBottom: '8px' }}>
            Gestión de tareas
          </h2>
          <p style={{ fontSize: '14px', color: '#64748B', maxWidth: '480px', margin: '0 auto', lineHeight: '1.6' }}>
            Las tareas se generan automáticamente desde el Sourcing Board via @menciones.
            Cada usuario gestiona su propia bandeja de tareas pendientes.
          </p>
          <div
            style={{
              display: 'inline-flex', marginTop: '16px', padding: '4px 12px',
              backgroundColor: '#FEF3C7', color: '#C45A00',
              borderRadius: '20px', fontSize: '12px', fontWeight: '500',
            }}
          >
            Fase 8 — Pendiente de implementación
          </div>
        </div>

        {/* Status legend */}
        <div
          style={{
            backgroundColor: '#FFFFFF', border: '1px solid #E0E4EB',
            borderRadius: '12px', padding: '20px', marginBottom: '24px',
          }}
        >
          <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#2C2C2C', marginBottom: '14px' }}>
            Estados de tarea
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            {statusItems.map((s) => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Badge variant={s.variant}>{s.label}</Badge>
                <span style={{ fontSize: '13px', color: '#64748B' }}>{s.description}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                style={{
                  backgroundColor: '#FFFFFF', border: '1px solid #E0E4EB',
                  borderRadius: '10px', padding: '20px',
                }}
              >
                <div
                  style={{
                    width: '36px', height: '36px', borderRadius: '8px',
                    backgroundColor: '#E8F0FB', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', marginBottom: '12px',
                  }}
                >
                  <Icon style={{ width: '18px', height: '18px', color: '#135091' }} />
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: '500', color: '#2C2C2C', marginBottom: '6px' }}>
                  {f.title}
                </h4>
                <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.5' }}>
                  {f.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
