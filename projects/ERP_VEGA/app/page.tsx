export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F7FA' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', fontWeight: '700', color: '#135091', marginBottom: '16px' }}>VEGA ERP</h1>
        <p style={{ fontSize: '18px', color: '#64748B', marginBottom: '32px' }}>Enterprise Resource Planning for Nordex Steel Towers</p>
        <a 
          href="/login" 
          style={{ 
            display: 'inline-block', 
            padding: '12px 32px', 
            backgroundColor: '#135091', 
            color: '#FFFFFF', 
            borderRadius: '8px', 
            textDecoration: 'none',
            fontWeight: '500'
          }}
        >
          Sign In
        </a>
      </div>
    </div>
  );
}