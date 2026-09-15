-- Add foreign key constraints that were deferred

-- Add foreign key from purchase_requisitions to approval_workflows
ALTER TABLE purchase_requisitions ADD CONSTRAINT fk_purchase_requisitions_approval_workflow 
    FOREIGN KEY (approval_workflow_id) REFERENCES approval_workflows(id);

-- Add foreign key from rfqs to purchase_requisitions
ALTER TABLE rfqs ADD CONSTRAINT fk_rfqs_purchase_requisition 
    FOREIGN KEY (requisition_id) REFERENCES purchase_requisitions(id);

-- Add foreign key from quotations to rfqs
ALTER TABLE quotations ADD CONSTRAINT fk_quotations_rfq 
    FOREIGN KEY (rfq_id) REFERENCES rfqs(id);

-- Add foreign key from quotations to vendors
ALTER TABLE quotations ADD CONSTRAINT fk_quotations_vendor 
    FOREIGN KEY (vendor_id) REFERENCES vendors(id);

-- Add foreign key from purchase_orders to purchase_requisitions
ALTER TABLE purchase_orders ADD CONSTRAINT fk_purchase_orders_purchase_requisition 
    FOREIGN KEY (requisition_id) REFERENCES purchase_requisitions(id);

-- Add foreign key from purchase_orders to quotations
ALTER TABLE purchase_orders ADD CONSTRAINT fk_purchase_orders_quotation 
    FOREIGN KEY (quotation_id) REFERENCES quotations(id);

-- Add foreign key from purchase_orders to vendors
ALTER TABLE purchase_orders ADD CONSTRAINT fk_purchase_orders_vendor 
    FOREIGN KEY (vendor_id) REFERENCES vendors(id);

-- Add foreign key from goods_receipt_notes to purchase_orders
ALTER TABLE goods_receipt_notes ADD CONSTRAINT fk_grn_purchase_order 
    FOREIGN KEY (po_id) REFERENCES purchase_orders(id);

-- Add foreign key from invoices to purchase_orders
ALTER TABLE invoices ADD CONSTRAINT fk_invoices_purchase_order 
    FOREIGN KEY (po_id) REFERENCES purchase_orders(id);

-- Add foreign key from invoices to vendors
ALTER TABLE invoices ADD CONSTRAINT fk_invoices_vendor 
    FOREIGN KEY (vendor_id) REFERENCES vendors(id);

-- Add foreign key from procurement_contracts to vendors
ALTER TABLE procurement_contracts ADD CONSTRAINT fk_procurement_contracts_vendor 
    FOREIGN KEY (vendor_id) REFERENCES vendors(id);

-- Create foreign key indexes for better performance
CREATE INDEX idx_fk_purchase_requisitions_approval_workflow ON purchase_requisitions(approval_workflow_id);
CREATE INDEX idx_fk_rfqs_requisition ON rfqs(requisition_id);
CREATE INDEX idx_fk_quotations_rfq ON quotations(rfq_id);
CREATE INDEX idx_fk_quotations_vendor ON quotations(vendor_id);
CREATE INDEX idx_fk_purchase_orders_requisition ON purchase_orders(requisition_id);
CREATE INDEX idx_fk_purchase_orders_quotation ON purchase_orders(quotation_id);
CREATE INDEX idx_fk_purchase_orders_vendor ON purchase_orders(vendor_id);
CREATE INDEX idx_fk_grn_po ON goods_receipt_notes(po_id);
CREATE INDEX idx_fk_invoices_po ON invoices(po_id);
CREATE INDEX idx_fk_invoices_vendor ON invoices(vendor_id);
CREATE INDEX idx_fk_procurement_contracts_vendor ON procurement_contracts(vendor_id);