-- Create purchase_requisitions table
CREATE TABLE purchase_requisitions (
    id BIGSERIAL PRIMARY KEY,
    requisition_number VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    department VARCHAR(100),
    requested_by VARCHAR(100) NOT NULL,
    request_date DATE NOT NULL,
    required_date DATE,
    priority VARCHAR(50) DEFAULT 'NORMAL',
    status VARCHAR(50) DEFAULT 'DRAFT',
    total_amount DECIMAL(15, 2),
    currency VARCHAR(10) DEFAULT 'USD',
    budget_code VARCHAR(100),
    justification TEXT,
    approval_workflow_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100)
);

-- Create indexes for purchase requisitions
CREATE INDEX idx_purchase_requisitions_requisition_number ON purchase_requisitions(requisition_number);
CREATE INDEX idx_purchase_requisitions_status ON purchase_requisitions(status);
CREATE INDEX idx_purchase_requisitions_requested_by ON purchase_requisitions(requested_by);
CREATE INDEX idx_purchase_requisitions_request_date ON purchase_requisitions(request_date);