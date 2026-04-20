'use client';

import { Header } from '@/components/layout/header';
import { ClipboardList, CheckCircle2, XCircle, GitBranch, MessageSquare, FileDown } from 'lucide-react';

const features = [
  {
    icon: ClipboardList,
    title: 'Vista consolidada de costes',
    description: 'Todos los costes agrupados por área (acero, bridas, internos, logística, conversión) y por grupo de torres.',
  },
  {
    icon: MessageSquare,
    title: 'Comentarios con @menciones',
    description: 'Los comentarios con @usuario generan tareas automáticas asignadas a ese usuario.',
  },
  {
    icon: CheckCircle2,
    title: 'Flujo de aprobación',
    description: 'Aprobación total, condicional o rechazo. Aprobación total bloquea el proyecto e inicia la trazabilidad.',
  },
  {
    icon: XCircle,
    title: 'Rechazo y nueva ronda',
    description: 'Un rechazo crea un nuevo SourcingBoard versión +1 y reinicia el proceso de RFQ.',
  },
  {
    icon: GitBranch,
    title: 'Snapshot en aprobación',
    description: 'Al aprobar, se guarda un snapshot JSON inmutable con todos los costes del momento.',
  },
  {
    icon: FileDown,
    title: 'Exportación Excel / PDF',
    description: 'Descarga el Sourcing Board en formato Excel o PDF para presentaciones a dirección.',
  },
];

const outcomes = [
  { label: 'Rechazado', color: '#B91C1C', bg: '#FEE2E2', description: 'Nueva ronda de RFQ. Versión +1.' },
  { label: 'Aprobación condicional', color: '#C45A00', bg: '#FEF3C7', description: 'Se lanzan pedidos con condiciones. Se crean tareas.' },
  { label: 'Aprobado', color: '#1A7A44', bg: '#D1FAE5', description: 'Proyecto bloqueado. Snapshot guardado.' },
];

export default function SourcingBoardPage() {
  return (
    <>
      <Header title="Sourcing Board" />
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
            <ClipboardList style={{ width: '28px', height: '28px', color: '#135091' }} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '500', color: '#2C2C2C', marginBottom: '8px' }}>
            Sourcing Board
          </h2>
          <p style={{ fontSize: '14px', color: '#64748B', maxWidth: '520px', margin: '0 auto', lineHeight: '1.6' }}>
            Vista consolidada de todos los costes del proyecto para presentación a Dirección.
            Permite aprobar, aprobar con condiciones o rechazar el Sourcing Board.
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

        {/* Outcomes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
          {outcomes.map((o) => (
            <div
              key={o.label}
              style={{
                backgroundColor: o.bg, borderRadius: '10px',
                padding: '16px', border: `1px solid ${o.color}22`,
              }}
            >
              <p style={{ fontSize: '13px', fontWeight: '600', color: o.color, marginBottom: '4px' }}>
                {o.label}
              </p>
              <p style={{ fontSize: '12px', color: '#475569', lineHeight: '1.5' }}>
                {o.description}
              </p>
            </div>
          ))}
        </div>

        {/* Features */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
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
