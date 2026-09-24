-- Create quotations table
CREATE TABLE quotations (
    id BIGSERIAL PRIMARY KEY,
    quotation_number VARCHAR(50) UNIQUE NOT NULL,
    rfq_id BIGINT NOT NULL,
    vendor_id BIGINT NOT NULL,
    submitted_by VARCHAR(100) NOT NULL,
    submission_date DATE NOT NULL,
    valid_until DATE,
    status VARCHAR(50) DEFAULT 'SUBMITTED',
    total_amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    delivery_time VARCHAR(100),
    payment_terms VARCHAR(50),
    warranty_period VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100)
);

-- Create indexes for quotations
CREATE INDEX idx_quotations_quotation_number ON quotations(quotation_number);
CREATE INDEX idx_quotations_rfq_id ON quotations(rfq_id);
CREATE INDEX idx_quotations_vendor_id ON quotations(vendor_id);
CREATE INDEX idx_quotations_status ON quotations(status);