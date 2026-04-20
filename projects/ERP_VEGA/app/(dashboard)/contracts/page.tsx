'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Modal } from '@/components/ui/modal';
import { Plus, AlertTriangle, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface ContractCondition {
  condition_id: string;
  condition_type: string;
  description: string;
  price_impact: number;
  impact_type: string;
}

interface Contract {
  contract_id: string;
  supplier: { supplier_id: string; name: string };
  category: string;
  total_tons: number;
  consumed_tons: number;
  base_price_per_ton: number;
  currency: string;
  valid_from: string;
  valid_to: string;
  status: string;
  conditions: ContractCondition[];
}

interface Supplier {
  supplier_id: string;
  name: string;
  category: string;
}

const STATUS_CONFIG: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'neutral' }> = {
  active:    { label: 'Activo',   variant: 'success' },
  exhausted: { label: 'Agotado', variant: 'danger' },
  expired:   { label: 'Expirado', variant: 'neutral' },
};

const createSchema = z.object({
  supplier_id:       z.string().uuid('Selecciona un proveedor'),
  category:          z.enum(['steel', 'flanges']),
  total_tons:        z.coerce.number().positive('Debe ser positivo'),
  base_price_per_ton:z.coerce.number().positive('Debe ser positivo'),
  currency:          z.string().default('EUR'),
  valid_from:        z.string().min(1, 'Requerido'),
  valid_to:          z.string().min(1, 'Requerido'),
});
type CreateForm = z.infer<typeof createSchema>;

const fmt = (n: number) => n.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
const fmtDate = (d: string) => new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiError, setApiError] = useState('');

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<CreateForm>({
    resolver: zodResolver(createSchema),
    defaultValues: { currency: 'EUR', category: 'steel' },
  });
  const selectedCategory = watch('category');

  const loadContracts = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (categoryFilter) params.set('category', categoryFilter);
    if (statusFilter) params.set('status', statusFilter);
    fetch(`/api/contracts?${params}`)
      .then((r) => r.json())
      .then((data) => setContracts(Array.isArray(data) ? data : []))
      .catch(() => setContracts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadContracts(); }, [categoryFilter, statusFilter]);

  useEffect(() => {
    fetch('/api/suppliers?category=steel')
      .then((r) => r.json())
      .then((data) => {
        fetch('/api/suppliers?category=flanges')
          .then((r2) => r2.json())
          .then((data2) => setSuppliers([
            ...(Array.isArray(data) ? data : []),
            ...(Array.isArray(data2) ? data2 : []),
          ]));
      });
  }, []);

  const filtered = contracts.filter((c) => {
    const q = searchTerm.toLowerCase();
    return c.supplier.name.toLowerCase().includes(q);
  });

  const supplierOptions = suppliers
    .filter((s) => !selectedCategory || s.category === selectedCategory)
    .map((s) => ({ value: s.supplier_id, label: s.name }));

  const onSubmit = async (data: CreateForm) => {
    setSaving(true);
    setApiError('');
    try {
      const res = await fetch('/api/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          valid_from: new Date(data.valid_from).toISOString(),
          valid_to: new Date(data.valid_to).toISOString(),
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        setApiError(err.error || 'Error al crear el contrato');
        return;
      }
      reset();
      setIsModalOpen(false);
      loadContracts();
    } catch {
      setApiError('Error de conexión');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Header title="Contratos" />
      <div className="p-6">

        {/* Toolbar */}
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Buscar por proveedor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              options={[
                { value: '', label: 'Todas las categorías' },
                { value: 'steel', label: 'Acero' },
                { value: 'flanges', label: 'Bridas' },
              ]}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full md:w-44"
            />
            <Select
              options={[
                { value: '', label: 'Todos los estados' },
                { value: 'active', label: 'Activo' },
                { value: 'exhausted', label: 'Agotado' },
                { value: 'expired', label: 'Expirado' },
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-44"
            />
            <Button onClick={() => { reset(); setApiError(''); setIsModalOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo contrato
            </Button>
          </div>
        </Card>

        {/* Contract cards */}
        {loading ? (
          <Card>
            <p className="text-center text-text-muted py-8">Cargando contratos...</p>
          </Card>
        ) : filtered.length === 0 ? (
          <Card>
            <p className="text-center text-text-muted py-8">No se encontraron contratos</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filtered.map((contract) => {
              const available = Number(contract.total_tons) - Number(contract.consumed_tons);
              const pct = Number(contract.total_tons) > 0
                ? Number(contract.consumed_tons) / Number(contract.total_tons)
                : 0;
              const nearCapacity = pct >= 0.8 && contract.status === 'active';
              const statusCfg = STATUS_CONFIG[contract.status] ?? { label: contract.status, variant: 'neutral' as const };

              return (
                <Card key={contract.contract_id}>
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="font-medium text-text-primary" style={{ fontSize: '15px' }}>
                          {contract.supplier.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={contract.category === 'steel' ? 'default' : 'success'}>
                            {contract.category === 'steel' ? 'Acero' : 'Bridas'}
                          </Badge>
                          <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
                          {nearCapacity && (
                            <div
                              style={{
                                display: 'inline-flex', alignItems: 'center', gap: '4px',
                                padding: '2px 8px', backgroundColor: '#FEF3C7',
                                color: '#C45A00', borderRadius: '20px', fontSize: '11px', fontWeight: '500',
                              }}
                            >
                              <AlertTriangle style={{ width: '11px', height: '11px' }} />
                              80% capacidad
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p style={{ fontSize: '18px', fontWeight: '600', color: '#135091' }}>
                        {fmt(Number(contract.base_price_per_ton))} {contract.currency}/t
                      </p>
                      <p className="text-xs text-text-muted mt-0.5">Precio base por tonelada</p>
                    </div>
                  </div>

                  {/* Progress */}
                  <ProgressBar
                    value={Number(contract.consumed_tons)}
                    max={Number(contract.total_tons)}
                    label={`${fmt(Number(contract.consumed_tons))} / ${fmt(Number(contract.total_tons))} t`}
                  />

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-3">
                    <div style={{ fontSize: '13px', color: '#64748B' }}>
                      Disponible:{' '}
                      <span style={{ fontWeight: '600', color: available > 0 ? '#1A7A44' : '#B91C1C' }}>
                        {fmt(available)} t
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                      {fmtDate(contract.valid_from)} — {fmtDate(contract.valid_to)}
                    </div>
                  </div>

                  {/* Conditions */}
                  {contract.conditions.length > 0 && (
                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
                      <p style={{ fontSize: '12px', fontWeight: '500', color: '#64748B', marginBottom: '6px' }}>
                        Condiciones ({contract.conditions.length})
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {contract.conditions.map((cond) => (
                          <span
                            key={cond.condition_id}
                            style={{
                              padding: '3px 10px', backgroundColor: '#F8FAFC',
                              border: '1px solid #E0E4EB', borderRadius: '6px',
                              fontSize: '12px', color: '#475569',
                            }}
                            title={cond.description}
                          >
                            {cond.condition_type}{' '}
                            <span style={{ color: Number(cond.price_impact) >= 0 ? '#1A7A44' : '#B91C1C', fontWeight: '500' }}>
                              {Number(cond.price_impact) >= 0 ? '+' : ''}
                              {Number(cond.price_impact)}
                              {cond.impact_type === 'percentage' ? '%' : ' €'}
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Create contract modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nuevo contrato"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit(onSubmit)} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {saving ? 'Guardando...' : 'Crear contrato'}
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

          <Select
            label="Categoría"
            options={[
              { value: 'steel', label: 'Acero' },
              { value: 'flanges', label: 'Bridas' },
            ]}
            error={errors.category?.message}
            {...register('category')}
          />

          <Select
            label="Proveedor"
            options={[{ value: '', label: 'Selecciona un proveedor...' }, ...supplierOptions]}
            error={errors.supplier_id?.message}
            {...register('supplier_id')}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Toneladas totales"
              type="number"
              step="0.01"
              placeholder="Ej: 5000"
              error={errors.total_tons?.message}
              {...register('total_tons')}
            />
            <Input
              label="Precio base (€/t)"
              type="number"
              step="0.01"
              placeholder="Ej: 850"
              error={errors.base_price_per_ton?.message}
              {...register('base_price_per_ton')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Válido desde"
              type="date"
              error={errors.valid_from?.message}
              {...register('valid_from')}
            />
            <Input
              label="Válido hasta"
              type="date"
              error={errors.valid_to?.message}
              {...register('valid_to')}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
