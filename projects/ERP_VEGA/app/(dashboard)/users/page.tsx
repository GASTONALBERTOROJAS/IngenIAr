'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Header } from '@/components/layout/header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import {
  Table, TableHeader, TableBody,
  TableRow, TableHead, TableCell, TableEmpty,
} from '@/components/ui/table';
import { Plus, Edit2, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface User {
  user_id: string;
  name: string;
  email: string;
  role: string;
  preferred_language: string;
  is_active: boolean;
}

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrador',
  purchasing_steel: 'Compras Acero',
  purchasing_flanges: 'Compras Bridas',
  internals: 'Internos',
  logistics: 'Logística',
  conversion: 'Conversión',
  direction: 'Dirección',
  finance: 'Financiero',
};

const ROLE_VARIANTS: Record<string, 'default' | 'success' | 'warning' | 'neutral' | 'danger'> = {
  admin: 'danger',
  purchasing_steel: 'default',
  purchasing_flanges: 'default',
  internals: 'warning',
  logistics: 'warning',
  conversion: 'default',
  direction: 'success',
  finance: 'neutral',
};

const roleOptions = Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label }));

const createUserSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  role: z.enum(['admin', 'purchasing_steel', 'purchasing_flanges', 'internals', 'logistics', 'conversion', 'direction', 'finance']),
  preferred_language: z.enum(['es', 'en']).default('es'),
});

type CreateUserForm = z.infer<typeof createUserSchema>;

export default function UsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiError, setApiError] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { preferred_language: 'es' },
  });

  const loadUsers = () => {
    setLoading(true);
    fetch('/api/users')
      .then((r) => r.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadUsers(); }, []);

  const filteredUsers = users.filter((u) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchesRole = !roleFilter || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleToggleActive = async (user: User) => {
    try {
      await fetch(`/api/users/${user.user_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !user.is_active }),
      });
      loadUsers();
    } catch { /* silent */ }
  };

  const onSubmit = async (data: CreateUserForm) => {
    setSaving(true);
    setApiError('');
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        setApiError(err.error || 'Error al crear usuario');
        return;
      }
      reset();
      setIsModalOpen(false);
      loadUsers();
    } catch {
      setApiError('Error de conexión');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Header title="Usuarios" />
      <div className="p-6">

        {/* Toolbar */}
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              options={[{ value: '', label: 'Todos los roles' }, ...roleOptions]}
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full md:w-52"
            />
            <Button onClick={() => { reset(); setApiError(''); setIsModalOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo usuario
            </Button>
          </div>
        </Card>

        {/* Table */}
        <Card padding="none">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Idioma</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableEmpty colSpan={6} message="Cargando usuarios..." />
              ) : filteredUsers.length === 0 ? (
                <TableEmpty colSpan={6} message="No se encontraron usuarios" />
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.user_id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          style={{
                            width: '32px', height: '32px', borderRadius: '50%',
                            backgroundColor: '#E8F0FB', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            fontSize: '13px', fontWeight: '600', color: '#135091',
                            flexShrink: 0,
                          }}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-text-primary">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-text-muted">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={ROLE_VARIANTS[user.role] ?? 'neutral'}>
                        {ROLE_LABELS[user.role] ?? user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span
                        style={{
                          display: 'inline-block', padding: '2px 8px',
                          backgroundColor: '#F1F5F9', borderRadius: '4px',
                          fontSize: '12px', color: '#475569', fontWeight: '500',
                        }}
                      >
                        {user.preferred_language === 'es' ? 'ES' : 'EN'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.is_active ? 'success' : 'neutral'}>
                        {user.is_active ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleToggleActive(user)}
                          title={user.is_active ? 'Desactivar' : 'Activar'}
                          style={{
                            padding: '6px', borderRadius: '6px', border: 'none',
                            backgroundColor: 'transparent', cursor: 'pointer',
                            color: user.is_active ? '#C45A00' : '#1A7A44',
                          }}
                        >
                          {user.is_active
                            ? <ToggleRight className="w-5 h-5" />
                            : <ToggleLeft className="w-5 h-5" />}
                        </button>
                        <button
                          title="Editar"
                          style={{
                            padding: '6px', borderRadius: '6px', border: 'none',
                            backgroundColor: 'transparent', cursor: 'pointer', color: '#64748B',
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Create user modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nuevo usuario"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit(onSubmit)} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {saving ? 'Guardando...' : 'Crear usuario'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {apiError && (
            <div style={{
              padding: '10px 14px', backgroundColor: '#FEE2E2',
              color: '#B91C1C', borderRadius: '8px', fontSize: '14px',
            }}>
              {apiError}
            </div>
          )}

          <Input
            label="Nombre completo"
            placeholder="Ej: María García"
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Email"
            type="email"
            placeholder="email@nordex-online.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Contraseña"
            type="password"
            placeholder="Mínimo 8 caracteres"
            error={errors.password?.message}
            {...register('password')}
          />

          <Select
            label="Rol"
            options={roleOptions}
            error={errors.role?.message}
            {...register('role')}
          />

          <Select
            label="Idioma preferido"
            options={[
              { value: 'es', label: 'Español' },
              { value: 'en', label: 'English' },
            ]}
            {...register('preferred_language')}
          />
        </div>
      </Modal>
    </>
  );
}
