-- Create purchase_orders table
CREATE TABLE purchase_orders (
    id BIGSERIAL PRIMARY KEY,
    po_number VARCHAR(50) UNIQUE NOT NULL,
    requisition_id BIGINT NOT NULL,
    quotation_id BIGINT NOT NULL,
    vendor_id BIGINT NOT NULL,
    issued_by VARCHAR(100) NOT NULL,
    issue_date DATE NOT NULL,
    delivery_date DATE,
    status VARCHAR(50) DEFAULT 'ISSUED',
    total_amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    payment_terms VARCHAR(50),
    shipping_address TEXT,
    billing_address TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100)
);

-- Create indexes for purchase orders
CREATE INDEX idx_purchase_orders_po_number ON purchase_orders(po_number);
CREATE INDEX idx_purchase_orders_requisition_id ON purchase_orders(requisition_id);
CREATE INDEX idx_purchase_orders_vendor_id ON purchase_orders(vendor_id);
CREATE INDEX idx_purchase_orders_status ON purchase_orders(status);