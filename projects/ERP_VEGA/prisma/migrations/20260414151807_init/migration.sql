-- CreateEnum
CREATE TYPE "SupplierCategory" AS ENUM ('steel', 'flanges', 'internals', 'tower_maker', 'logistics');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'purchasing_steel', 'purchasing_flanges', 'internals', 'logistics', 'conversion', 'direction', 'finance');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('draft', 'rfq_sent', 'sourcing_board', 'cond_approved', 'approved', 'blocked');

-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('active', 'exhausted', 'expired');

-- CreateEnum
CREATE TYPE "Incoterm" AS ENUM ('EXW', 'DAP', 'DDP');

-- CreateEnum
CREATE TYPE "SteelLineType" AS ENUM ('contract', 'others_model', 'spot');

-- CreateEnum
CREATE TYPE "FlangesLineType" AS ENUM ('contract', 'spot');

-- CreateEnum
CREATE TYPE "DirectItemType" AS ENUM ('anchor_cage', 'bolts', 'mv_cable', 'damper');

-- CreateEnum
CREATE TYPE "RfqStatus" AS ENUM ('sent', 'received', 'reviewed', 'selected', 'rejected');

-- CreateEnum
CREATE TYPE "SourcingOutcome" AS ENUM ('rejected', 'conditionally_approved', 'approved');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('pending', 'in_progress', 'done', 'escalated');

-- CreateEnum
CREATE TYPE "ChangeStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('es', 'en');

-- CreateTable
CREATE TABLE "Supplier" (
    "supplier_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "SupplierCategory" NOT NULL,
    "country" TEXT NOT NULL,
    "contact_email" TEXT NOT NULL,
    "payment_terms" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("supplier_id")
);

-- CreateTable
CREATE TABLE "TowerModel" (
    "tower_model_id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "hub_height" DECIMAL(65,30) NOT NULL,
    "sections_qty" INTEGER NOT NULL,
    "base_steel_tons" DECIMAL(65,30) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TowerModel_pkey" PRIMARY KEY ("tower_model_id")
);

-- CreateTable
CREATE TABLE "User" (
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "preferred_language" "Language" NOT NULL DEFAULT 'es',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "InternalsCatalog" (
    "internal_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "applies_to_models" TEXT[],
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InternalsCatalog_pkey" PRIMARY KEY ("internal_id")
);

-- CreateTable
CREATE TABLE "InternalsMatrix" (
    "matrix_id" TEXT NOT NULL,
    "internal_id" TEXT NOT NULL,
    "supplier_id" TEXT NOT NULL,
    "tower_model_id" TEXT NOT NULL,
    "incoterm" "Incoterm" NOT NULL,
    "base_price" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "sharewallet_pct" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "sharewallet_used" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InternalsMatrix_pkey" PRIMARY KEY ("matrix_id")
);

-- CreateTable
CREATE TABLE "Contract" (
    "contract_id" TEXT NOT NULL,
    "supplier_id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "total_tons" DECIMAL(65,30) NOT NULL,
    "consumed_tons" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "base_price_per_ton" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "valid_from" TIMESTAMP(3) NOT NULL,
    "valid_to" TIMESTAMP(3) NOT NULL,
    "status" "ContractStatus" NOT NULL DEFAULT 'active',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("contract_id")
);

-- CreateTable
CREATE TABLE "ContractCondition" (
    "condition_id" TEXT NOT NULL,
    "contract_id" TEXT NOT NULL,
    "condition_type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price_impact" DECIMAL(65,30) NOT NULL,
    "impact_type" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContractCondition_pkey" PRIMARY KEY ("condition_id")
);

-- CreateTable
CREATE TABLE "Project" (
    "project_id" TEXT NOT NULL,
    "project_code" TEXT NOT NULL,
    "project_name" TEXT NOT NULL,
    "project_country" TEXT NOT NULL,
    "exchange_rate" DECIMAL(65,30),
    "status" "ProjectStatus" NOT NULL DEFAULT 'draft',
    "is_locked" BOOLEAN NOT NULL DEFAULT false,
    "approved_by" TEXT,
    "approved_at" TIMESTAMP(3),
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("project_id")
);

-- CreateTable
CREATE TABLE "ProjectTowerGroup" (
    "group_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "tower_model_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "steel_tons_override" DECIMAL(65,30),
    "fabrication_schedule" JSONB,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectTowerGroup_pkey" PRIMARY KEY ("group_id")
);

-- CreateTable
CREATE TABLE "ProjectTowerGroupMaker" (
    "assignment_id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "supplier_id" TEXT NOT NULL,
    "quantity_assigned" INTEGER NOT NULL,
    "rfq_id" TEXT,
    "payment_terms" TEXT,
    "storage_conditions" TEXT,
    "conversion_price_per_unit" DECIMAL(65,30),
    "total_conversion_cost" DECIMAL(65,30),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectTowerGroupMaker_pkey" PRIMARY KEY ("assignment_id")
);

-- CreateTable
CREATE TABLE "ProjectSteelCost" (
    "cost_id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "contract_id" TEXT,
    "line_type" "SteelLineType" NOT NULL,
    "tons_assigned" DECIMAL(65,30) NOT NULL,
    "base_price_per_ton" DECIMAL(65,30) NOT NULL,
    "conditions_impact" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "final_price_per_ton" DECIMAL(65,30) NOT NULL,
    "total_cost" DECIMAL(65,30) NOT NULL,
    "spot_justification" TEXT,
    "spot_attachment_url" TEXT,
    "others_description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectSteelCost_pkey" PRIMARY KEY ("cost_id")
);

-- CreateTable
CREATE TABLE "ProjectFlangesCost" (
    "cost_id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "contract_id" TEXT,
    "line_type" "FlangesLineType" NOT NULL,
    "base_price" DECIMAL(65,30) NOT NULL,
    "final_price" DECIMAL(65,30) NOT NULL,
    "total_cost" DECIMAL(65,30) NOT NULL,
    "justification" TEXT NOT NULL,
    "attachment_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectFlangesCost_pkey" PRIMARY KEY ("cost_id")
);

-- CreateTable
CREATE TABLE "ProjectInternalsCost" (
    "cost_id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "matrix_id" TEXT NOT NULL,
    "incoterm" "Incoterm" NOT NULL,
    "logistics_cost" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "logistics_auto_blocked" BOOLEAN NOT NULL DEFAULT false,
    "manual_override" BOOLEAN NOT NULL DEFAULT false,
    "override_justification" TEXT,
    "unit_price" DECIMAL(65,30) NOT NULL,
    "total_cost" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectInternalsCost_pkey" PRIMARY KEY ("cost_id")
);

-- CreateTable
CREATE TABLE "ProjectLogisticsCost" (
    "cost_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "supplier_id" TEXT NOT NULL,
    "pre_run" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "ports_operation" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "main_run" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "co2_tax" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "bunker_hedging" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "demurrage" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "vessel_discharge" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "final_run" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "assembly" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "disassembly" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "return_costs" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "qty_return_containers" INTEGER NOT NULL DEFAULT 0,
    "cost_per_container" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "currency_main_run" TEXT NOT NULL DEFAULT 'EUR',
    "total_per_tower" DECIMAL(65,30) NOT NULL,
    "project_total" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectLogisticsCost_pkey" PRIMARY KEY ("cost_id")
);

-- CreateTable
CREATE TABLE "ProjectDirectCost" (
    "cost_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "item_type" "DirectItemType" NOT NULL,
    "supplier_id" TEXT NOT NULL,
    "unit_price" DECIMAL(65,30) NOT NULL,
    "total_cost" DECIMAL(65,30) NOT NULL,
    "included_in_sourcing_board" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectDirectCost_pkey" PRIMARY KEY ("cost_id")
);

-- CreateTable
CREATE TABLE "RfqRequest" (
    "rfq_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "supplier_id" TEXT NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deadline" TIMESTAMP(3) NOT NULL,
    "status" "RfqStatus" NOT NULL DEFAULT 'sent',
    "response_file_url" TEXT,
    "conversion_price" DECIMAL(65,30),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RfqRequest_pkey" PRIMARY KEY ("rfq_id")
);

-- CreateTable
CREATE TABLE "SourcingBoard" (
    "sb_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "held_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "outcome" "SourcingOutcome",
    "conditions_text" TEXT,
    "general_comments" TEXT,
    "approved_by" TEXT,
    "snapshot_json" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SourcingBoard_pkey" PRIMARY KEY ("sb_id")
);

-- CreateTable
CREATE TABLE "Task" (
    "task_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "sb_id" TEXT,
    "assigned_to" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'pending',
    "resolution_note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("task_id")
);

-- CreateTable
CREATE TABLE "ChangeRequest" (
    "cr_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "requested_by" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "field_name" TEXT NOT NULL,
    "current_value" TEXT NOT NULL,
    "proposed_value" TEXT NOT NULL,
    "justification" TEXT NOT NULL,
    "status" "ChangeStatus" NOT NULL DEFAULT 'pending',
    "approved_by" TEXT,
    "approved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChangeRequest_pkey" PRIMARY KEY ("cr_id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "log_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "cr_id" TEXT,
    "changed_by" TEXT NOT NULL,
    "table_name" TEXT NOT NULL,
    "record_id" TEXT NOT NULL,
    "field_name" TEXT NOT NULL,
    "old_value" TEXT NOT NULL,
    "new_value" TEXT NOT NULL,
    "changed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT NOT NULL,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("log_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "InternalsMatrix_internal_id_supplier_id_tower_model_id_inco_key" ON "InternalsMatrix"("internal_id", "supplier_id", "tower_model_id", "incoterm");

-- CreateIndex
CREATE UNIQUE INDEX "Project_project_code_key" ON "Project"("project_code");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectLogisticsCost_project_id_key" ON "ProjectLogisticsCost"("project_id");

-- AddForeignKey
ALTER TABLE "InternalsMatrix" ADD CONSTRAINT "InternalsMatrix_internal_id_fkey" FOREIGN KEY ("internal_id") REFERENCES "InternalsCatalog"("internal_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternalsMatrix" ADD CONSTRAINT "InternalsMatrix_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "Supplier"("supplier_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternalsMatrix" ADD CONSTRAINT "InternalsMatrix_tower_model_id_fkey" FOREIGN KEY ("tower_model_id") REFERENCES "TowerModel"("tower_model_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "Supplier"("supplier_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractCondition" ADD CONSTRAINT "ContractCondition_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "Contract"("contract_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTowerGroup" ADD CONSTRAINT "ProjectTowerGroup_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("project_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTowerGroup" ADD CONSTRAINT "ProjectTowerGroup_tower_model_id_fkey" FOREIGN KEY ("tower_model_id") REFERENCES "TowerModel"("tower_model_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTowerGroupMaker" ADD CONSTRAINT "ProjectTowerGroupMaker_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "ProjectTowerGroup"("group_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTowerGroupMaker" ADD CONSTRAINT "ProjectTowerGroupMaker_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "Supplier"("supplier_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTowerGroupMaker" ADD CONSTRAINT "ProjectTowerGroupMaker_rfq_id_fkey" FOREIGN KEY ("rfq_id") REFERENCES "RfqRequest"("rfq_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectSteelCost" ADD CONSTRAINT "ProjectSteelCost_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "ProjectTowerGroup"("group_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectSteelCost" ADD CONSTRAINT "ProjectSteelCost_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "Contract"("contract_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectFlangesCost" ADD CONSTRAINT "ProjectFlangesCost_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "ProjectTowerGroup"("group_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectFlangesCost" ADD CONSTRAINT "ProjectFlangesCost_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "Contract"("contract_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectInternalsCost" ADD CONSTRAINT "ProjectInternalsCost_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "ProjectTowerGroup"("group_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectInternalsCost" ADD CONSTRAINT "ProjectInternalsCost_matrix_id_fkey" FOREIGN KEY ("matrix_id") REFERENCES "InternalsMatrix"("matrix_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectLogisticsCost" ADD CONSTRAINT "ProjectLogisticsCost_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("project_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectLogisticsCost" ADD CONSTRAINT "ProjectLogisticsCost_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "Supplier"("supplier_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectDirectCost" ADD CONSTRAINT "ProjectDirectCost_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("project_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectDirectCost" ADD CONSTRAINT "ProjectDirectCost_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "Supplier"("supplier_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RfqRequest" ADD CONSTRAINT "RfqRequest_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("project_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RfqRequest" ADD CONSTRAINT "RfqRequest_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "Supplier"("supplier_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SourcingBoard" ADD CONSTRAINT "SourcingBoard_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("project_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SourcingBoard" ADD CONSTRAINT "SourcingBoard_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("project_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_sb_id_fkey" FOREIGN KEY ("sb_id") REFERENCES "SourcingBoard"("sb_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChangeRequest" ADD CONSTRAINT "ChangeRequest_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("project_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChangeRequest" ADD CONSTRAINT "ChangeRequest_requested_by_fkey" FOREIGN KEY ("requested_by") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChangeRequest" ADD CONSTRAINT "ChangeRequest_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("project_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_cr_id_fkey" FOREIGN KEY ("cr_id") REFERENCES "ChangeRequest"("cr_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_changed_by_fkey" FOREIGN KEY ("changed_by") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
