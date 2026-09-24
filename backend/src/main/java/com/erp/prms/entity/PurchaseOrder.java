package com.erp.prms.entity;

import com.erp.prms.entity.base.BaseEntity;
import com.erp.prms.entity.enums.POStatus;
import com.erp.prms.entity.enums.PaymentTerms;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter @Setter @NoArgsConstructor
@Entity @Table(name = "purchase_orders")
public class PurchaseOrder extends BaseEntity {
    @Column(nullable = false, unique = true, length = 50) private String purchaseOrderNumber;
    @OneToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "requisition_id", nullable = false, unique = true) private PurchaseRequisition purchaseRequisition;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "vendor_id", nullable = false) private Vendor vendor;
    @Column(nullable = false, columnDefinition = "TEXT") private String itemDetails;
    @Column(nullable = false, precision = 19, scale = 2) private BigDecimal totalAmount;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private PaymentTerms paymentTerms;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 30) private POStatus status = POStatus.DRAFT;
    @Column(nullable = false) private LocalDate orderDate;
    private LocalDate expectedDeliveryDate;
    private LocalDate expiryDate;
    @OneToMany(mappedBy = "purchaseOrder") private List<GoodsReceiptNote> goodsReceiptNotes = new ArrayList<>();
    @OneToMany(mappedBy = "purchaseOrder") private List<Invoice> invoices = new ArrayList<>();
}
