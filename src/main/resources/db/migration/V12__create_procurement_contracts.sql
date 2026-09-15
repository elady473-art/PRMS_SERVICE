-- Create procurement_contracts table
CREATE TABLE procurement_contracts (
    id BIGSERIAL PRIMARY KEY,
    contract_number VARCHAR(50) UNIQUE NOT NULL,
    vendor_id BIGINT NOT NULL,
    contract_title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_value DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'ACTIVE',
    payment_terms VARCHAR(50),
    renewal_terms TEXT,
    termination_clause TEXT,
    signed_by_vendor VARCHAR(100),
    signed_by_company VARCHAR(100),
    signed_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100)
);

-- Create indexes for procurement contracts
CREATE INDEX idx_procurement_contracts_contract_number ON procurement_contracts(contract_number);
CREATE INDEX idx_procurement_contracts_vendor_id ON procurement_contracts(vendor_id);
CREATE INDEX idx_procurement_contracts_status ON procurement_contracts(status);
CREATE INDEX idx_procurement_contracts_end_date ON procurement_contracts(end_date);