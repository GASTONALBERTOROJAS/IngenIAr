'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/header';
import { useSession } from 'next-auth/react';

interface DashboardKPIs {
  projectsByStatus: Record<string, number>;
  activeContracts: { steel: number; flanges: number };
  availableTons: { steel: number; flanges: number };
}

const PROJECT_STATUS_LABELS: Record<string, { es: string; en: string }> = {
  draft:          { es: 'Borrador',              en: 'Draft' },
  rfq_sent:       { es: 'RFQ enviado',           en: 'RFQ Sent' },
  sourcing_board: { es: 'Sourcing Board',        en: 'Sourcing Board' },
  cond_approved:  { es: 'Aprov. condicional',    en: 'Cond. Approved' },
  approved:       { es: 'Aprobado',              en: 'Approved' },
  blocked:        { es: 'Bloqueado',             en: 'Blocked' },
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const lang = (session?.user?.preferred_language as 'es' | 'en') ?? 'es';

  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then((r) => r.json())
      .then((data) => setKpis(data))
      .catch(() => setKpis(null))
      .finally(() => setLoading(false));
  }, []);

  const t = {
    title:          lang === 'en' ? 'Dashboard' : 'Panel',
    welcome:        lang === 'en' ? 'Welcome to VEGA ERP' : 'Bienvenido a VEGA ERP',
    subtitle:       lang === 'en' ? 'Nordex Steel Towers' : 'Nordex Steel Towers',
    projectStatus:  lang === 'en' ? 'Projects by Status' : 'Proyectos por estado',
    activeContracts:lang === 'en' ? 'Active Contracts' : 'Contratos activos',
    availableTons:  lang === 'en' ? 'Available Tons' : 'Toneladas disponibles',
    steel:          lang === 'en' ? 'Steel' : 'Acero',
    flanges:        lang === 'en' ? 'Flanges' : 'Bridas',
    loading:        lang === 'en' ? 'Loading...' : 'Cargando...',
  };

  return (
    <>
      <Header title={t.title} />
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '500', color: '#2C2C2C', marginBottom: '4px' }}>
            {t.welcome}
          </h2>
          <p style={{ color: '#64748B', fontSize: '14px' }}>{t.subtitle}</p>
        </div>

        {loading ? (
          <p style={{ color: '#64748B', fontSize: '14px' }}>{t.loading}</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {/* Projects by status */}
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E0E4EB', borderRadius: '12px', padding: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '500', color: '#2C2C2C', marginBottom: '16px' }}>
                {t.projectStatus}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Object.entries(PROJECT_STATUS_LABELS).map(([status, labels]) => (
                  <div key={status} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', color: '#64748B' }}>
                      {lang === 'en' ? labels.en : labels.es}
                    </span>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: kpis?.projectsByStatus[status] ? '#135091' : '#64748B',
                    }}>
                      {kpis?.projectsByStatus[status] ?? 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Active contracts */}
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E0E4EB', borderRadius: '12px', padding: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '500', color: '#2C2C2C', marginBottom: '16px' }}>
                {t.activeContracts}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#64748B' }}>{t.steel}</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#135091' }}>
                    {kpis?.activeContracts.steel ?? 0}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#64748B' }}>{t.flanges}</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#135091' }}>
                    {kpis?.activeContracts.flanges ?? 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Available tons */}
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E0E4EB', borderRadius: '12px', padding: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '500', color: '#2C2C2C', marginBottom: '16px' }}>
                {t.availableTons}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#64748B' }}>{t.steel}</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#1A7A44' }}>
                    {kpis ? `${kpis.availableTons.steel.toLocaleString('es-ES')} t` : '—'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#64748B' }}>{t.flanges}</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#1A7A44' }}>
                    {kpis ? `${kpis.availableTons.flanges.toLocaleString('es-ES')} t` : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
