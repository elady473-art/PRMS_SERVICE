-- Additional indexes for performance optimization

-- Indexes for frequently queried date fields
CREATE INDEX idx_purchase_requisitions_required_date ON purchase_requisitions(required_date);
CREATE INDEX idx_rfqs_issue_date ON rfqs(issue_date);
CREATE INDEX idx_quotations_valid_until ON quotations(valid_until);
CREATE INDEX idx_purchase_orders_delivery_date ON purchase_orders(delivery_date);
CREATE INDEX idx_invoices_invoice_date ON invoices(invoice_date);

-- Composite indexes for common query patterns
CREATE INDEX idx_requisitions_by_status_date ON purchase_requisitions(status, request_date);
CREATE INDEX idx_rfqs_by_status_closing_date ON rfqs(status, closing_date);
CREATE INDEX idx_quotations_by_rfq_status ON quotations(rfq_id, status);
CREATE INDEX idx_purchase_orders_by_vendor_status ON purchase_orders(vendor_id, status);
CREATE INDEX idx_invoices_by_status_due_date ON invoices(status, due_date);

-- Indexes for text search fields
CREATE INDEX idx_vendors_name ON vendors(name);
CREATE INDEX idx_purchase_requisitions_title ON purchase_requisitions(title);
CREATE INDEX idx_rfqs_title ON rfqs(title);