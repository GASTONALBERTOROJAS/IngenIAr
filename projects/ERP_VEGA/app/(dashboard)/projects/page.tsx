'use client';

import { useState, useEffect } from 'react';
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
import { Plus, Lock, Eye, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface TowerGroup {
  group_id: string;
  tower_model: { platform: string };
  quantity: number;
}

interface Project {
  project_id: string;
  project_code: string;
  project_name: string;
  project_country: string;
  status: string;
  is_locked: boolean;
  creator: { name: string };
  tower_groups: TowerGroup[];
}

const STATUS_CONFIG: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'neutral' }> = {
  draft:          { label: 'Borrador',           variant: 'neutral' },
  rfq_sent:       { label: 'RFQ enviado',        variant: 'default' },
  sourcing_board: { label: 'Sourcing Board',     variant: 'warning' },
  cond_approved:  { label: 'Aprov. condicional', variant: 'warning' },
  approved:       { label: 'Aprobado',           variant: 'success' },
  blocked:        { label: 'Bloqueado',          variant: 'danger' },
};

const statusOptions = Object.entries(STATUS_CONFIG).map(([value, { label }]) => ({ value, label }));

const createSchema = z.object({
  project_code:    z.string().min(1, 'Requerido'),
  project_name:    z.string().min(2, 'Mínimo 2 caracteres'),
  project_country: z.string().min(2, 'Requerido'),
  exchange_rate:   z.coerce.number().positive('Debe ser positivo').optional(),
});
type CreateForm = z.infer<typeof createSchema>;

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiError, setApiError] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateForm>({
    resolver: zodResolver(createSchema),
  });

  const loadProjects = () => {
    setLoading(true);
    fetch('/api/projects')
      .then((r) => r.json())
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadProjects(); }, []);

  const filtered = projects.filter((p) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      p.project_code.toLowerCase().includes(q) ||
      p.project_name.toLowerCase().includes(q) ||
      p.project_country.toLowerCase().includes(q);
    const matchesStatus = !statusFilter || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const onSubmit = async (data: CreateForm) => {
    setSaving(true);
    setApiError('');
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        setApiError(err.error || 'Error al crear el proyecto');
        return;
      }
      reset();
      setIsModalOpen(false);
      loadProjects();
    } catch {
      setApiError('Error de conexión');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Header title="Proyectos" />
      <div className="p-6">

        {/* Toolbar */}
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Buscar por código, nombre o país..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              options={[{ value: '', label: 'Todos los estados' }, ...statusOptions]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-52"
            />
            <Button onClick={() => { reset(); setApiError(''); setIsModalOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo proyecto
            </Button>
          </div>
        </Card>

        {/* Table */}
        <Card padding="none">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>País</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Grupos de torres</TableHead>
                <TableHead>Creado por</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableEmpty colSpan={7} message="Cargando proyectos..." />
              ) : filtered.length === 0 ? (
                <TableEmpty colSpan={7} message="No se encontraron proyectos" />
              ) : (
                filtered.map((project) => {
                  const status = STATUS_CONFIG[project.status] ?? { label: project.status, variant: 'neutral' as const };
                  return (
                    <TableRow key={project.project_id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {project.is_locked && (
                            <span title="Proyecto bloqueado">
                              <Lock className="w-3.5 h-3.5 text-text-muted" />
                            </span>
                          )}
                          <span className="font-mono font-medium text-text-primary">
                            {project.project_code}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{project.project_name}</TableCell>
                      <TableCell className="text-text-muted">{project.project_country}</TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <span
                          style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: '28px', height: '28px', borderRadius: '50%',
                            backgroundColor: '#E8F0FB', color: '#135091',
                            fontSize: '13px', fontWeight: '600',
                          }}
                        >
                          {project.tower_groups.length}
                        </span>
                      </TableCell>
                      <TableCell className="text-text-muted text-sm">
                        {project.creator?.name ?? '—'}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4 mr-1.5" />
                            Ver detalle
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Create project modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nuevo proyecto"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit(onSubmit)} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {saving ? 'Guardando...' : 'Crear proyecto'}
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

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Código de proyecto"
              placeholder="Ej: NST-2026-001"
              error={errors.project_code?.message}
              {...register('project_code')}
            />
            <Input
              label="Nombre"
              placeholder="Ej: Nordex Cádiz I"
              error={errors.project_name?.message}
              {...register('project_name')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="País"
              placeholder="Ej: Spain"
              error={errors.project_country?.message}
              {...register('project_country')}
            />
            <Input
              label="Tipo de cambio (opcional)"
              type="number"
              step="0.0001"
              placeholder="Ej: 1.08"
              error={errors.exchange_rate?.message}
              {...register('exchange_rate')}
            />
          </div>

          <p className="text-xs text-text-muted">
            Los grupos de torres se añaden desde el detalle del proyecto una vez creado.
          </p>
        </div>
      </Modal>
    </>
  );
}
