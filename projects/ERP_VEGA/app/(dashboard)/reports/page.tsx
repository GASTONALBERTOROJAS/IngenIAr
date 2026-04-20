'use client';

import { Header } from '@/components/layout/header';
import { BarChart3, FileSpreadsheet, FileText, TrendingUp, Package, Building2 } from 'lucide-react';

const reports = [
  {
    icon: TrendingUp,
    title: 'Coste total por proyecto',
    description: 'Desglose completo por área: acero, bridas, internos, logística y conversión. Exportable a Excel y PDF.',
    tag: 'Proyectos',
    tagColor: '#135091',
    tagBg: '#E8F0FB',
  },
  {
    icon: Package,
    title: 'Consumo de contratos',
    description: 'Evolución del consumo de toneladas por contrato en un período. Identifica contratos próximos al agotamiento.',
    tag: 'Contratos',
    tagColor: '#1A7A44',
    tagBg: '#D1FAE5',
  },
  {
    icon: Building2,
    title: 'Costes por proveedor',
    description: 'Resumen del volumen de negocio y costes asignados a cada proveedor, agrupado por categoría.',
    tag: 'Proveedores',
    tagColor: '#C45A00',
    tagBg: '#FEF3C7',
  },
];

const exportFormats = [
  {
    icon: FileSpreadsheet,
    label: 'Excel (.xlsx)',
    description: 'Tablas con datos completos para análisis en Excel. Generado con exceljs.',
    color: '#1A7A44',
    bg: '#D1FAE5',
  },
  {
    icon: FileText,
    label: 'PDF',
    description: 'Documento formateado listo para imprimir o adjuntar a email. Generado con pdfkit / puppeteer.',
    color: '#B91C1C',
    bg: '#FEE2E2',
  },
];

export default function ReportsPage() {
  return (
    <>
      <Header title="Reportes" />
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
            <BarChart3 style={{ width: '28px', height: '28px', color: '#135091' }} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '500', color: '#2C2C2C', marginBottom: '8px' }}>
            Reportes financieros
          </h2>
          <p style={{ fontSize: '14px', color: '#64748B', maxWidth: '480px', margin: '0 auto', lineHeight: '1.6' }}>
            Vista de solo lectura con costes consolidados por proyecto, contrato y proveedor.
            Exclusivo para los roles Financiero y Dirección.
          </p>
          <div
            style={{
              display: 'inline-flex', marginTop: '16px', padding: '4px 12px',
              backgroundColor: '#FEF3C7', color: '#C45A00',
              borderRadius: '20px', fontSize: '12px', fontWeight: '500',
            }}
          >
            Fase 10 — Pendiente de implementación
          </div>
        </div>

        {/* Reports list */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {reports.map((r, i) => {
            const Icon = r.icon;
            return (
              <div
                key={i}
                style={{
                  backgroundColor: '#FFFFFF', border: '1px solid #E0E4EB',
                  borderRadius: '10px', padding: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div
                    style={{
                      width: '36px', height: '36px', borderRadius: '8px',
                      backgroundColor: '#E8F0FB', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Icon style={{ width: '18px', height: '18px', color: '#135091' }} />
                  </div>
                  <span
                    style={{
                      padding: '2px 8px', borderRadius: '20px',
                      fontSize: '11px', fontWeight: '500',
                      color: r.tagColor, backgroundColor: r.tagBg,
                    }}
                  >
                    {r.tag}
                  </span>
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: '500', color: '#2C2C2C', marginBottom: '6px' }}>
                  {r.title}
                </h4>
                <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.5' }}>
                  {r.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Export formats */}
        <div
          style={{
            backgroundColor: '#FFFFFF', border: '1px solid #E0E4EB',
            borderRadius: '12px', padding: '20px',
          }}
        >
          <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#2C2C2C', marginBottom: '14px' }}>
            Formatos de exportación
          </h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {exportFormats.map((ef) => {
              const Icon = ef.icon;
              return (
                <div
                  key={ef.label}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 16px', border: '1px solid #E0E4EB',
                    borderRadius: '8px', flex: 1, minWidth: '200px',
                  }}
                >
                  <div
                    style={{
                      width: '32px', height: '32px', borderRadius: '6px',
                      backgroundColor: ef.bg, display: 'flex',
                      alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}
                  >
                    <Icon style={{ width: '16px', height: '16px', color: ef.color }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: '500', color: '#2C2C2C', margin: 0 }}>
                      {ef.label}
                    </p>
                    <p style={{ fontSize: '12px', color: '#64748B', margin: 0, lineHeight: '1.4' }}>
                      {ef.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
