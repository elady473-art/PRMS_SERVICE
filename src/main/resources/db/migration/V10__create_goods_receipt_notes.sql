-- Create goods_receipt_notes table
CREATE TABLE goods_receipt_notes (
    id BIGSERIAL PRIMARY KEY,
    grn_number VARCHAR(50) UNIQUE NOT NULL,
    po_id BIGINT NOT NULL,
    received_by VARCHAR(100) NOT NULL,
    receipt_date DATE NOT NULL,
    delivery_note_number VARCHAR(100),
    carrier_name VARCHAR(100),
    vehicle_number VARCHAR(50),
    status VARCHAR(50) DEFAULT 'RECEIVED',
    inspection_status VARCHAR(50),
    inspection_notes TEXT,
    total_quantity DECIMAL(12, 3),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100)
);

-- Create indexes for goods receipt notes
CREATE INDEX idx_grn_grn_number ON goods_receipt_notes(grn_number);
CREATE INDEX idx_grn_po_id ON goods_receipt_notes(po_id);
CREATE INDEX idx_grn_receipt_date ON goods_receipt_notes(receipt_date);