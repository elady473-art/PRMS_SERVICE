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

import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor
@Entity @Table(name = "goods_receipt_notes")
public class GoodsReceiptNote extends BaseEntity {
    @Column(nullable = false, unique = true, length = 50) private String receiptNumber;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "purchase_order_id", nullable = false) private PurchaseOrder purchaseOrder;
    @Column(nullable = false) private LocalDate receiptDate;
    @Column(nullable = false, length = 100) private String receivedByEmployeeId;
    @Column(nullable = false, columnDefinition = "TEXT") private String receiptDetails;
    @Column(length = 1000) private String inspectionNotes;
    @Column(nullable = false) private boolean accepted;
}
