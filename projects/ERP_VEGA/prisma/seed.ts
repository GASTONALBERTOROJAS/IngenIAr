import { PrismaClient } from '@prisma/client';
import pkg from 'bcryptjs';
const { hash } = pkg;

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  const adminPassword = await hash('Admin1234!', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@nordex-online.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@nordex-online.com',
      password_hash: adminPassword,
      role: 'admin',
      preferred_language: 'es',
      is_active: true,
    },
  });

  console.log('Created admin user:', admin.email);

  const steelSupplier = await prisma.supplier.upsert({
    where: { supplier_id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      supplier_id: '00000000-0000-0000-0000-000000000001',
      name: 'ArcelorMittal',
      category: 'steel',
      country: 'Germany',
      contact_email: 'steel@arcelormittal.com',
      payment_terms: 'Net 60',
      is_active: true,
    },
  });

  console.log('Created steel supplier:', steelSupplier.name);

  const flangeSupplier = await prisma.supplier.upsert({
    where: { supplier_id: '00000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      supplier_id: '00000000-0000-0000-0000-000000000002',
      name: 'Vulcan International',
      category: 'flanges',
      country: 'Spain',
      contact_email: 'flanges@vulcan.com',
      payment_terms: 'Net 45',
      is_active: true,
    },
  });

  console.log('Created flange supplier:', flangeSupplier.name);

  const towerModel = await prisma.towerModel.upsert({
    where: { tower_model_id: '00000000-0000-0000-0000-000000000003' },
    update: {},
    create: {
      tower_model_id: '00000000-0000-0000-0000-000000000003',
      platform: 'V150-4.2',
      hub_height: 105,
      sections_qty: 4,
      base_steel_tons: 285.5,
      is_active: true,
    },
  });

  console.log('Created tower model:', towerModel.platform);

  const contract = await prisma.contract.upsert({
    where: { contract_id: '00000000-0000-0000-0000-000000000004' },
    update: {},
    create: {
      contract_id: '00000000-0000-0000-0000-000000000004',
      supplier_id: steelSupplier.supplier_id,
      category: 'steel',
      total_tons: 5000,
      consumed_tons: 0,
      base_price_per_ton: 850,
      currency: 'EUR',
      valid_from: new Date('2026-01-01'),
      valid_to: new Date('2026-12-31'),
      status: 'active',
      is_active: true,
    },
  });

  console.log('Created steel contract:', contract.contract_id);

  const flangeContract = await prisma.contract.upsert({
    where: { contract_id: '00000000-0000-0000-0000-000000000005' },
    update: {},
    create: {
      contract_id: '00000000-0000-0000-0000-000000000005',
      supplier_id: flangeSupplier.supplier_id,
      category: 'flanges',
      total_tons: 1500,
      consumed_tons: 0,
      base_price_per_ton: 1200,
      currency: 'EUR',
      valid_from: new Date('2026-01-01'),
      valid_to: new Date('2026-12-31'),
      status: 'active',
      is_active: true,
    },
  });

  console.log('Created flange contract:', flangeContract.contract_id);

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });