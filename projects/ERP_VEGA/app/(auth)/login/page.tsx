'use client';

import { signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';

const translations = {
  es: {
    title: 'VEGA',
    subtitle: 'Enterprise Resource Planning',
    loginTitle: 'Iniciar Sesión',
    loginSubtitle: 'Ingresa tus credenciales',
    email: 'Email',
    password: 'Contraseña',
    submit: 'Iniciar Sesión',
    loading: 'Cargando...',
    error: 'Credenciales inválidas',
    selectLanguage: 'Seleccionar idioma',
    spanish: 'Español',
    english: 'English',
  },
  en: {
    title: 'VEGA',
    subtitle: 'Enterprise Resource Planning',
    loginTitle: 'Sign In',
    loginSubtitle: 'Enter your credentials',
    email: 'Email',
    password: 'Password',
    submit: 'Sign In',
    loading: 'Loading...',
    error: 'Invalid credentials',
    selectLanguage: 'Select language',
    spanish: 'Español',
    english: 'English',
  },
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('es');
  const [showLangMenu, setShowLangMenu] = useState(false);

  useEffect(() => {
    const savedLang = document.cookie.includes('locale=es') ? 'es' : 
                      document.cookie.includes('locale=en') ? 'en' : 'es';
    setLanguage(savedLang);
  }, []);

  const t = translations[language as keyof typeof translations];

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    document.cookie = `locale=${lang}; path=/; max-age=31536000`;
    setShowLangMenu(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(t.error);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F7FA', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '0', right: '0' }}>
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E0E4EB',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              <Globe className="w-4 h-4" />
              {language === 'es' ? 'ES' : 'EN'}
            </button>
            {showLangMenu && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: '0',
                marginTop: '4px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E0E4EB',
                borderRadius: '8px',
                overflow: 'hidden',
                zIndex: 10,
              }}>
                <button
                  onClick={() => handleLanguageChange('es')}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '10px 16px',
                    border: 'none',
                    backgroundColor: language === 'es' ? '#E8F0FB' : '#FFFFFF',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '14px',
                  }}
                >
                  {t.spanish}
                </button>
                <button
                  onClick={() => handleLanguageChange('en')}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '10px 16px',
                    border: 'none',
                    backgroundColor: language === 'en' ? '#E8F0FB' : '#FFFFFF',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '14px',
                  }}
                >
                  {t.english}
                </button>
              </div>
            )}
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '600', color: '#135091', marginBottom: '8px' }}>{t.title}</h1>
          <p style={{ color: '#64748B' }}>{t.subtitle}</p>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E0E4EB', borderRadius: '12px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '500', marginBottom: '8px' }}>{t.loginTitle}</h2>
          <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '24px' }}>{t.loginSubtitle}</p>

          {error && (
            <div style={{ padding: '12px', backgroundColor: '#FEE2E2', color: '#B91C1C', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '6px', color: '#2C2C2C' }}>{t.email}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #E0E4EB', borderRadius: '8px', fontSize: '14px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '6px', color: '#2C2C2C' }}>{t.password}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #E0E4EB', borderRadius: '8px', fontSize: '14px' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '10px 16px',
                backgroundColor: '#135091',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? t.loading : t.submit}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}