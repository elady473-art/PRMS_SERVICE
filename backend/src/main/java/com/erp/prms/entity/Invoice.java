package com.erp.prms.entity;

import com.erp.prms.entity.base.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor
@Entity @Table(name = "invoices")
public class Invoice extends BaseEntity {
    @Column(nullable = false, unique = true, length = 100) private String invoiceNumber;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "purchase_order_id", nullable = false) private PurchaseOrder purchaseOrder;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "vendor_id", nullable = false) private Vendor vendor;
    @Column(nullable = false, precision = 19, scale = 2) private BigDecimal invoiceAmount;
    @Column(nullable = false) private LocalDate invoiceDate;
    @Column(nullable = false) private LocalDate dueDate;
    @Column(nullable = false, length = 30) private String processingStatus = "PENDING";
    @Column(length = 100) private String financeReference;
    @Column(columnDefinition = "TEXT") private String itemDetails;
}
