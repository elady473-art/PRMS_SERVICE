-- Create approval_stages table
CREATE TABLE approval_stages (
    id BIGSERIAL PRIMARY KEY,
    workflow_id BIGINT NOT NULL,
    stage_number INTEGER NOT NULL,
    stage_name VARCHAR(255) NOT NULL,
    approver_role VARCHAR(100) NOT NULL,
    approver_user_id VARCHAR(100),
    status VARCHAR(50) DEFAULT 'PENDING',
    action VARCHAR(50),
    comments TEXT,
    approved_at TIMESTAMP,
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    CONSTRAINT fk_approval_stages_workflow FOREIGN KEY (workflow_id) REFERENCES approval_workflows(id) ON DELETE CASCADE
);

-- Create indexes for approval stages
CREATE INDEX idx_approval_stages_workflow_id ON approval_stages(workflow_id);
CREATE INDEX idx_approval_stages_status ON approval_stages(status);
CREATE INDEX idx_approval_stages_approver_role ON approval_stages(approver_role);