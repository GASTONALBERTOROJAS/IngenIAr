'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Globe, User, ChevronDown } from 'lucide-react';

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  const { data: session, update } = useSession();
  const userName = session?.user?.name || 'User';
  const userRole = session?.user?.role || '';
  const lang = (session?.user?.preferred_language as 'es' | 'en') ?? 'es';
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [saving, setSaving] = useState(false);

  const roleLabels: Record<string, string> = {
    admin: lang === 'en' ? 'Administrator' : 'Administrador',
    purchasing_steel: lang === 'en' ? 'Steel Purchasing' : 'Compras Acero',
    purchasing_flanges: lang === 'en' ? 'Flanges Purchasing' : 'Compras Bridas',
    internals: 'Internos',
    logistics: lang === 'en' ? 'Logistics' : 'Logística',
    conversion: lang === 'en' ? 'Conversion' : 'Conversión',
    direction: lang === 'en' ? 'Direction' : 'Dirección',
    finance: lang === 'en' ? 'Finance' : 'Financiero',
  };

  const handleLanguageChange = async (newLang: 'es' | 'en') => {
    if (newLang === lang || saving) return;
    setSaving(true);
    setShowLangMenu(false);

    // Persist in cookie so next-intl picks it up on next request
    document.cookie = `locale=${newLang}; path=/; max-age=31536000; SameSite=Lax`;

    // Persist in DB via users API
    try {
      await fetch('/api/users/language', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferred_language: newLang }),
      });
      // Refresh the NextAuth session so preferred_language is updated client-side
      await update({ preferred_language: newLang });
    } catch {
      // Non-critical: cookie already set, page will use new locale on reload
    } finally {
      setSaving(false);
    }
  };

  return (
    <header
      style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E0E4EB',
        padding: '0 24px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}
    >
      <div>
        {title && (
          <h1 style={{ fontSize: '20px', fontWeight: '500', color: '#2C2C2C', margin: 0 }}>
            {title}
          </h1>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Language selector */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowLangMenu((v) => !v)}
            disabled={saving}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              backgroundColor: 'transparent',
              border: '1px solid #E0E4EB',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              color: '#64748B',
            }}
          >
            <Globe style={{ width: '15px', height: '15px' }} />
            {lang.toUpperCase()}
            <ChevronDown style={{ width: '13px', height: '13px' }} />
          </button>

          {showLangMenu && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                right: 0,
                backgroundColor: '#FFFFFF',
                border: '1px solid #E0E4EB',
                borderRadius: '8px',
                overflow: 'hidden',
                zIndex: 50,
                minWidth: '120px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
            >
              {(['es', 'en'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => handleLanguageChange(l)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '10px 14px',
                    border: 'none',
                    backgroundColor: lang === l ? '#E8F0FB' : '#FFFFFF',
                    color: lang === l ? '#135091' : '#2C2C2C',
                    cursor: 'pointer',
                    fontSize: '13px',
                    textAlign: 'left',
                    fontWeight: lang === l ? '500' : '400',
                  }}
                >
                  {l === 'es' ? 'Español' : 'English'}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#135091',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <User style={{ width: '16px', height: '16px', color: '#FFFFFF' }} />
          </div>
          <div style={{ display: 'none' }} className="sm-block">
            <p style={{ fontSize: '14px', fontWeight: '500', color: '#2C2C2C', margin: 0, lineHeight: 1.2 }}>
              {userName}
            </p>
            <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
              {roleLabels[userRole] || userRole}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
