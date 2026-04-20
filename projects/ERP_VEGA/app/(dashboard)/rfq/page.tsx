'use client';

import { Header } from '@/components/layout/header';
import { Mail, Send, FileSpreadsheet, BarChart2, Trophy } from 'lucide-react';

const steps = [
  {
    icon: Send,
    title: 'Seleccionar torreros',
    description: 'Elige los fabricantes de torre para el proyecto y genera el Excel de cotización con la DM precargada.',
  },
  {
    icon: Mail,
    title: 'Envío automático',
    description: 'Se envía un correo con Resend a cada torrero con el Excel adjunto, nombre de proyecto y plazo de 5 días.',
  },
  {
    icon: FileSpreadsheet,
    title: 'Carga de respuesta',
    description: 'Sube el Excel de cotización de cada torrero. Los datos se parsean y precargan automáticamente.',
  },
  {
    icon: BarChart2,
    title: 'Comparativa de ofertas',
    description: 'Tabla con todos los torreros cotizados, precios y condiciones para facilitar la decisión.',
  },
  {
    icon: Trophy,
    title: 'Selección del ganador',
    description: 'Selecciona el torrero ganador por grupo de torres. Se crea la asignación en el proyecto.',
  },
];

export default function RFQPage() {
  return (
    <>
      <Header title="RFQ — Gestión de torreros" />
      <div className="p-6">
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
            <Mail style={{ width: '28px', height: '28px', color: '#135091' }} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '500', color: '#2C2C2C', marginBottom: '8px' }}>
            Módulo RFQ
          </h2>
          <p style={{ fontSize: '14px', color: '#64748B', maxWidth: '480px', margin: '0 auto', lineHeight: '1.6' }}>
            Gestiona el proceso completo de solicitud de cotización a torreros:
            desde el envío del Excel hasta la selección del ganador.
          </p>
          <div
            style={{
              display: 'inline-flex', marginTop: '16px', padding: '4px 12px',
              backgroundColor: '#FEF3C7', color: '#C45A00',
              borderRadius: '20px', fontSize: '12px', fontWeight: '500',
            }}
          >
            Fase 7 — Pendiente de implementación
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                style={{
                  backgroundColor: '#FFFFFF', border: '1px solid #E0E4EB',
                  borderRadius: '10px', padding: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <div
                    style={{
                      width: '36px', height: '36px', borderRadius: '8px',
                      backgroundColor: '#E8F0FB', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}
                  >
                    <Icon style={{ width: '18px', height: '18px', color: '#135091' }} />
                  </div>
                  <div
                    style={{
                      width: '22px', height: '22px', borderRadius: '50%',
                      backgroundColor: '#135091', color: '#FFFFFF',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', fontWeight: '600', flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </div>
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: '500', color: '#2C2C2C', marginBottom: '6px' }}>
                  {step.title}
                </h4>
                <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.5' }}>
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
