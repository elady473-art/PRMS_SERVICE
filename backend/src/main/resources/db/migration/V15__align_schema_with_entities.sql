-- V15: Align schema with JPA entity mappings
-- Adds/renames columns so Hibernate ddl-auto:update finds a consistent baseline.
-- Uses IF EXISTS / IF NOT EXISTS guards so this is safe to re-run.

-- ── purchase_orders ──────────────────────────────────────────────────────────
-- Entity uses purchase_order_number; DDL has po_number
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name='purchase_orders' AND column_name='purchase_order_number') THEN
    ALTER TABLE purchase_orders ADD COLUMN purchase_order_number VARCHAR(50);
    UPDATE purchase_orders SET purchase_order_number = po_number WHERE purchase_order_number IS NULL;
    ALTER TABLE purchase_orders ALTER COLUMN purchase_order_number SET NOT NULL;
    CREATE UNIQUE INDEX IF NOT EXISTS idx_po_purchase_order_number ON purchase_orders(purchase_order_number);
  END IF;
END $$;

-- Entity uses item_details; add if missing
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name='purchase_orders' AND column_name='item_details') THEN
    ALTER TABLE purchase_orders ADD COLUMN item_details TEXT;
  END IF;
END $$;

-- Entity uses payment_terms (enum stored as varchar)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name='purchase_orders' AND column_name='payment_terms') THEN
    ALTER TABLE purchase_orders ADD COLUMN payment_terms VARCHAR(20);
  END IF;
END $$;

-- Entity uses order_date
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name='purchase_orders' AND column_name='order_date') THEN
    ALTER TABLE purchase_orders ADD COLUMN order_date DATE;
    UPDATE purchase_orders SET order_date = COALESCE(issue_date, CURRENT_DATE) WHERE order_date IS NULL;
  END IF;
END $$;

-- Entity uses expected_delivery_date
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name='purchase_orders' AND column_name='expected_delivery_date') THEN
    ALTER TABLE purchase_orders ADD COLUMN expected_delivery_date DATE;
    UPDATE purchase_orders SET expected_delivery_date = delivery_date WHERE expected_delivery_date IS NULL;
  END IF;
END $$;

-- Entity uses expiry_date
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name='purchase_orders' AND column_name='expiry_date') THEN
    ALTER TABLE purchase_orders ADD COLUMN expiry_date DATE;
  END IF;
END $$;

-- Entity uses version for optimistic locking
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name='purchase_orders' AND column_name='version') THEN
    ALTER TABLE purchase_orders ADD COLUMN version BIGINT DEFAULT 0;
  END IF;
END $$;

-- quotation_id may not exist as NOT NULL if some rows lack it; make nullable for now
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name='purchase_orders' AND column_name='quotation_id' AND is_nullable='NO') THEN
    ALTER TABLE purchase_orders ALTER COLUMN quotation_id DROP NOT NULL;
  END IF;
END $$;

-- ── goods_receipt_notes ───────────────────────────────────────────────────────
-- Entity uses receipt_number; DDL has grn_number
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name='goods_receipt_notes' AND column_name='receipt_number') THEN
    ALTER TABLE goods_receipt_notes ADD COLUMN receipt_number VARCHAR(50);
    UPDATE goods_receipt_notes SET receipt_number = grn_number WHERE receipt_number IS NULL;
    CREATE UNIQUE INDEX IF NOT EXISTS idx_grn_receipt_number ON goods_receipt_notes(receipt_number);
  END IF;
END $$;

-- Entity uses purchase_order_id; DDL has po_id
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name='goods_receipt_notes' AND column_name='purchase_order_id') THEN
    ALTER TABLE goods_receipt_notes ADD COLUMN purchase_order_id BIGINT;
    UPDATE goods_receipt_notes SET purchase_order_id = po_id WHERE purchase_order_id IS NULL;
  END IF;
END $$;

-- Entity uses received_by_employee_id; DDL has received_by
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name='goods_receipt_notes' AND column_name='received_by_employee_id') THEN
    ALTER TABLE goods_receipt_notes ADD COLUMN received_by_employee_id VARCHAR(100);
    UPDATE goods_receipt_notes SET received_by_employee_id = received_by WHERE received_by_employee_id IS NULL;
  END IF;
END $$;

-- Entity uses receipt_details
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name='goods_receipt_notes' AND column_name='receipt_details') THEN
    ALTER TABLE goods_receipt_notes ADD COLUMN receipt_details TEXT;
    UPDATE goods_receipt_notes SET receipt_details = COALESCE(notes, '') WHERE receipt_details IS NULL;
  END IF;
END $$;

-- Entity uses accepted (boolean)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name='goods_receipt_notes' AND column_name='accepted') THEN
    ALTER TABLE goods_receipt_notes ADD COLUMN accepted BOOLEAN NOT NULL DEFAULT FALSE;
  END IF;
END $$;

-- Add version for optimistic locking
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name='goods_receipt_notes' AND column_name='version') THEN
    ALTER TABLE goods_receipt_notes ADD COLUMN version BIGINT DEFAULT 0;
  END IF;
END $$;

-- ── invoices ──────────────────────────────────────────────────────────────────
-- Entity uses purchase_order_id; DDL has po_id
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name='invoices' AND column_name='purchase_order_id') THEN
    ALTER TABLE invoices ADD COLUMN purchase_order_id BIGINT;
    UPDATE invoices SET purchase_order_id = po_id WHERE purchase_order_id IS NULL;
  END IF;
END $$;

-- Entity uses invoice_amount; DDL has total_amount
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name='invoices' AND column_name='invoice_amount') THEN
    ALTER TABLE invoices ADD COLUMN invoice_amount DECIMAL(19,2);
    UPDATE invoices SET invoice_amount = total_amount WHERE invoice_amount IS NULL;
  END IF;
END $$;

-- Entity uses processing_status; DDL has status
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name='invoices' AND column_name='processing_status') THEN
    ALTER TABLE invoices ADD COLUMN processing_status VARCHAR(30) DEFAULT 'PENDING';
  END IF;
END $$;

-- Entity uses finance_reference
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name='invoices' AND column_name='finance_reference') THEN
    ALTER TABLE invoices ADD COLUMN finance_reference VARCHAR(100);
  END IF;
END $$;

-- Entity uses item_details
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name='invoices' AND column_name='item_details') THEN
    ALTER TABLE invoices ADD COLUMN item_details TEXT;
  END IF;
END $$;

-- Add version for optimistic locking
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name='invoices' AND column_name='version') THEN
    ALTER TABLE invoices ADD COLUMN version BIGINT DEFAULT 0;
  END IF;
END $$;

-- ── procurement_contracts ─────────────────────────────────────────────────────
-- Entity uses contract_value; DDL has total_value
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name='procurement_contracts' AND column_name='contract_value') THEN
    ALTER TABLE procurement_contracts ADD COLUMN contract_value DECIMAL(19,2);
    UPDATE procurement_contracts SET contract_value = total_value WHERE contract_value IS NULL;
  END IF;
END $$;

-- Entity uses terms_and_conditions; DDL has renewal_terms/termination_clause
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name='procurement_contracts' AND column_name='terms_and_conditions') THEN
    ALTER TABLE procurement_contracts ADD COLUMN terms_and_conditions TEXT;
    UPDATE procurement_contracts SET terms_and_conditions = COALESCE(description, '') WHERE terms_and_conditions IS NULL;
  END IF;
END $$;

-- Entity uses active (boolean); DDL has status varchar
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name='procurement_contracts' AND column_name='active') THEN
    ALTER TABLE procurement_contracts ADD COLUMN active BOOLEAN NOT NULL DEFAULT TRUE;
    UPDATE procurement_contracts SET active = (status = 'ACTIVE') WHERE active IS NULL;
  END IF;
END $$;

-- Entity has purchase_order_id FK
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name='procurement_contracts' AND column_name='purchase_order_id') THEN
    ALTER TABLE procurement_contracts ADD COLUMN purchase_order_id BIGINT;
  END IF;
END $$;

-- Add version for optimistic locking
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name='procurement_contracts' AND column_name='version') THEN
    ALTER TABLE procurement_contracts ADD COLUMN version BIGINT DEFAULT 0;
  END IF;
END $$;

-- ── vendors ───────────────────────────────────────────────────────────────────
-- Entity uses blacklisted (boolean); DDL may not have it
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name='vendors' AND column_name='blacklisted') THEN
    ALTER TABLE vendors ADD COLUMN blacklisted BOOLEAN NOT NULL DEFAULT FALSE;
    UPDATE vendors SET blacklisted = (status = 'BLACKLISTED') WHERE blacklisted IS FALSE;
  END IF;
END $$;

-- Entity uses performance_score
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name='vendors' AND column_name='performance_score') THEN
    ALTER TABLE vendors ADD COLUMN performance_score DECIMAL(3,1);
  END IF;
END $$;

-- Entity uses tax_identification_number; DDL has tax_id
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name='vendors' AND column_name='tax_identification_number') THEN
    ALTER TABLE vendors ADD COLUMN tax_identification_number VARCHAR(50);
    UPDATE vendors SET tax_identification_number = tax_id WHERE tax_identification_number IS NULL;
  END IF;
END $$;

-- Entity uses vendor_type as enum (INDIVIDUAL,CORPORATE,GOVERNMENT); update existing
-- (already exists as varchar, just ensure values are compatible)

-- Add version for optimistic locking to all entity tables
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name='vendors' AND column_name='version') THEN
    ALTER TABLE vendors ADD COLUMN version BIGINT DEFAULT 0;
  END IF;
END $$;

-- ── purchase_requisitions ─────────────────────────────────────────────────────
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name='purchase_requisitions' AND column_name='version') THEN
    ALTER TABLE purchase_requisitions ADD COLUMN version BIGINT DEFAULT 0;
  END IF;
END $$;
