package com.erp.prms.repository;

import com.erp.prms.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);
    List<Invoice> findByPurchaseOrderIdOrderByInvoiceDateDesc(Long purchaseOrderId);
    List<Invoice> findByProcessingStatus(String processingStatus);
}
