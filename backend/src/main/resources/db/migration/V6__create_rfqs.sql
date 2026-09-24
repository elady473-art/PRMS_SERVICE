-- Create rfqs table
CREATE TABLE rfqs (
    id BIGSERIAL PRIMARY KEY,
    rfq_number VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    requisition_id BIGINT NOT NULL,
    issued_by VARCHAR(100) NOT NULL,
    issue_date DATE NOT NULL,
    closing_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'DRAFT',
    delivery_terms TEXT,
    payment_terms VARCHAR(50),
    shipping_address TEXT,
    billing_address TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100)
);

-- Create indexes for RFQs
CREATE INDEX idx_rfqs_rfq_number ON rfqs(rfq_number);
CREATE INDEX idx_rfqs_requisition_id ON rfqs(requisition_id);
CREATE INDEX idx_rfqs_status ON rfqs(status);
CREATE INDEX idx_rfqs_closing_date ON rfqs(closing_date);