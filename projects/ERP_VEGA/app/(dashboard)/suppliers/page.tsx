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
import { Plus, Edit2, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface Supplier {
  supplier_id: string;
  name: string;
  category: string;
  country: string;
  contact_email: string;
  payment_terms: string | null;
  is_active: boolean;
}

const CATEGORY_CONFIG: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'neutral' | 'danger' }> = {
  steel:       { label: 'Acero',      variant: 'default' },
  flanges:     { label: 'Bridas',     variant: 'success' },
  internals:   { label: 'Internos',   variant: 'warning' },
  tower_maker: { label: 'Torrero',    variant: 'neutral' },
  logistics:   { label: 'Logística',  variant: 'neutral' },
};

const categoryOptions = Object.entries(CATEGORY_CONFIG).map(([value, { label }]) => ({ value, label }));

const supplierSchema = z.object({
  name:          z.string().min(2, 'Mínimo 2 caracteres'),
  category:      z.enum(['steel', 'flanges', 'internals', 'tower_maker', 'logistics']),
  country:       z.string().min(2, 'Requerido'),
  contact_email: z.string().email('Email inválido'),
  payment_terms: z.string().optional(),
});
type SupplierForm = z.infer<typeof supplierSchema>;

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [apiError, setApiError] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SupplierForm>({
    resolver: zodResolver(supplierSchema),
  });

  const loadSuppliers = () => {
    setLoading(true);
    fetch('/api/suppliers')
      .then((r) => r.json())
      .then((data) => setSuppliers(Array.isArray(data) ? data : []))
      .catch(() => setSuppliers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadSuppliers(); }, []);

  const filtered = suppliers.filter((s) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = s.name.toLowerCase().includes(q) || s.contact_email.toLowerCase().includes(q);
    const matchesCategory = !categoryFilter || s.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const openCreate = () => {
    setEditingSupplier(null);
    reset({});
    setApiError('');
    setIsModalOpen(true);
  };

  const openEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    reset({
      name: supplier.name,
      category: supplier.category as SupplierForm['category'],
      country: supplier.country,
      contact_email: supplier.contact_email,
      payment_terms: supplier.payment_terms ?? '',
    });
    setApiError('');
    setIsModalOpen(true);
  };

  const handleToggleActive = async (supplier: Supplier) => {
    await fetch(`/api/suppliers/${supplier.supplier_id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !supplier.is_active }),
    }).catch(() => null);
    loadSuppliers();
  };

  const onSubmit = async (data: SupplierForm) => {
    setSaving(true);
    setApiError('');
    try {
      const url = editingSupplier ? `/api/suppliers/${editingSupplier.supplier_id}` : '/api/suppliers';
      const method = editingSupplier ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        setApiError(err.error || 'Error al guardar');
        return;
      }
      setIsModalOpen(false);
      loadSuppliers();
    } catch {
      setApiError('Error de conexión');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Header title="Proveedores" />
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
              options={[{ value: '', label: 'Todas las categorías' }, ...categoryOptions]}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full md:w-48"
            />
            <Button onClick={openCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo proveedor
            </Button>
          </div>
        </Card>

        {/* Table */}
        <Card padding="none">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>País</TableHead>
                <TableHead>Email de contacto</TableHead>
                <TableHead>Cond. de pago</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableEmpty colSpan={7} message="Cargando proveedores..." />
              ) : filtered.length === 0 ? (
                <TableEmpty colSpan={7} message="No se encontraron proveedores" />
              ) : (
                filtered.map((supplier) => {
                  const cat = CATEGORY_CONFIG[supplier.category];
                  return (
                    <TableRow key={supplier.supplier_id}>
                      <TableCell className="font-medium">{supplier.name}</TableCell>
                      <TableCell>
                        <Badge variant={cat?.variant ?? 'neutral'}>
                          {cat?.label ?? supplier.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-text-muted">{supplier.country}</TableCell>
                      <TableCell className="text-text-muted">{supplier.contact_email}</TableCell>
                      <TableCell className="text-text-muted">
                        {supplier.payment_terms ?? <span style={{ color: '#CBD5E1' }}>—</span>}
                      </TableCell>
                      <TableCell>
                        <Badge variant={supplier.is_active ? 'success' : 'neutral'}>
                          {supplier.is_active ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleToggleActive(supplier)}
                            title={supplier.is_active ? 'Desactivar' : 'Activar'}
                            style={{
                              padding: '6px', borderRadius: '6px', border: 'none',
                              backgroundColor: 'transparent', cursor: 'pointer',
                              color: supplier.is_active ? '#C45A00' : '#1A7A44',
                            }}
                          >
                            {supplier.is_active
                              ? <ToggleRight className="w-5 h-5" />
                              : <ToggleLeft className="w-5 h-5" />}
                          </button>
                          <button
                            onClick={() => openEdit(supplier)}
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
                  );
                })
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Create / Edit modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSupplier ? 'Editar proveedor' : 'Nuevo proveedor'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit(onSubmit)} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {saving ? 'Guardando...' : 'Guardar'}
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
            label="Nombre"
            placeholder="Ej: ArcelorMittal"
            error={errors.name?.message}
            {...register('name')}
          />

          <Select
            label="Categoría"
            options={categoryOptions}
            error={errors.category?.message}
            {...register('category')}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="País"
              placeholder="Ej: Germany"
              error={errors.country?.message}
              {...register('country')}
            />
            <Input
              label="Email de contacto"
              type="email"
              placeholder="contact@supplier.com"
              error={errors.contact_email?.message}
              {...register('contact_email')}
            />
          </div>

          <Input
            label="Condiciones de pago (opcional)"
            placeholder="Ej: Net 60"
            {...register('payment_terms')}
          />
        </div>
      </Modal>
    </>
  );
}
