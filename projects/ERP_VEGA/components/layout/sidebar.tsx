'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  Building2,
  FileText,
  FolderKanban,
  ClipboardList,
  Mail,
  CheckSquare,
  BarChart3,
  Users,
  LogOut,
} from 'lucide-react';

const menuItems = [
  { key: 'dashboard',     href: '/dashboard',      icon: LayoutDashboard, labelEs: 'Panel',          labelEn: 'Dashboard' },
  { key: 'suppliers',     href: '/suppliers',      icon: Building2,       labelEs: 'Proveedores',    labelEn: 'Suppliers' },
  { key: 'contracts',     href: '/contracts',      icon: FileText,        labelEs: 'Contratos',      labelEn: 'Contracts' },
  { key: 'projects',      href: '/projects',       icon: FolderKanban,    labelEs: 'Proyectos',      labelEn: 'Projects' },
  { key: 'sourcing-board',href: '/sourcing-board', icon: ClipboardList,   labelEs: 'Sourcing Board', labelEn: 'Sourcing Board' },
  { key: 'rfq',           href: '/rfq',            icon: Mail,            labelEs: 'RFQ',            labelEn: 'RFQ' },
  { key: 'tasks',         href: '/tasks',          icon: CheckSquare,     labelEs: 'Tareas',         labelEn: 'Tasks' },
  { key: 'reports',       href: '/reports',        icon: BarChart3,       labelEs: 'Reportes',       labelEn: 'Reports' },
  { key: 'users',         href: '/users',          icon: Users,           labelEs: 'Usuarios',       labelEn: 'Users',   adminOnly: true },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const lang = (session?.user?.preferred_language as 'es' | 'en') ?? 'es';
  const role = session?.user?.role;

  const visibleItems = menuItems.filter(
    (item) => !item.adminOnly || role === 'admin'
  );

  return (
    <aside style={{ width: '256px', backgroundColor: '#0D3A6B', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      {/* Logo */}
      <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#FFFFFF', letterSpacing: '0.05em' }}>VEGA</h1>
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>Nordex Steel Towers</p>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
        {visibleItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;
          const label = lang === 'en' ? item.labelEn : item.labelEs;

          return (
            <Link
              key={item.key}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.65)',
                textDecoration: 'none',
                borderRadius: '8px',
                marginBottom: '2px',
                fontSize: '14px',
                backgroundColor: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                transition: 'background-color 0.15s, color 0.15s',
              }}
            >
              <Icon style={{ width: '16px', height: '16px', flexShrink: 0 }} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 12px',
            backgroundColor: 'transparent',
            color: 'rgba(255,255,255,0.65)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          <LogOut style={{ width: '16px', height: '16px', flexShrink: 0 }} />
          {lang === 'en' ? 'Sign out' : 'Cerrar sesión'}
        </button>
      </div>
    </aside>
  );
}
