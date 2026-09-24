-- Create approval_workflows table
CREATE TABLE approval_workflows (
    id BIGSERIAL PRIMARY KEY,
    workflow_name VARCHAR(255) NOT NULL,
    description TEXT,
    entity_type VARCHAR(100) NOT NULL,
    entity_id BIGINT NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    current_stage_id BIGINT,
    initiated_by VARCHAR(100) NOT NULL,
    initiated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    outcome VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100)
);

-- Create indexes for approval workflows
CREATE INDEX idx_approval_workflows_entity_type_entity_id ON approval_workflows(entity_type, entity_id);
CREATE INDEX idx_approval_workflows_status ON approval_workflows(status);
CREATE INDEX idx_approval_workflows_initiated_by ON approval_workflows(initiated_by);