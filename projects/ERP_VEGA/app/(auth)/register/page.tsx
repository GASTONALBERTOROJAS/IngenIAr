import Link from 'next/link';
import { ShieldOff } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F7FA', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '600', color: '#135091', marginBottom: '8px' }}>VEGA</h1>
          <p style={{ color: '#64748B' }}>Enterprise Resource Planning</p>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E0E4EB', borderRadius: '12px', padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: '#FEE2E2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldOff style={{ width: '24px', height: '24px', color: '#B91C1C' }} />
            </div>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '500', color: '#2C2C2C', marginBottom: '8px' }}>
            Acceso restringido
          </h2>
          <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '24px', lineHeight: '1.6' }}>
            El registro de nuevos usuarios está gestionado por el administrador del sistema.
            Contacta con tu administrador para obtener acceso.
          </p>
          <Link
            href="/login"
            style={{
              display: 'inline-block',
              padding: '10px 24px',
              backgroundColor: '#135091',
              color: '#FFFFFF',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              textDecoration: 'none',
            }}
          >
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
