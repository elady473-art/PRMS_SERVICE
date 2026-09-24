package com.erp.prms.entity;

import com.erp.prms.entity.base.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor
@Entity @Table(name = "procurement_contracts")
public class ProcurementContract extends BaseEntity {
    @Column(nullable = false, unique = true, length = 50) private String contractNumber;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "vendor_id", nullable = false) private Vendor vendor;
    @OneToOne(fetch = FetchType.LAZY) @JoinColumn(name = "purchase_order_id", unique = true) private PurchaseOrder purchaseOrder;
    @Column(nullable = false, precision = 19, scale = 2) private BigDecimal contractValue;
    @Column(nullable = false) private LocalDate startDate;
    @Column(nullable = false) private LocalDate endDate;
    @Column(nullable = false, columnDefinition = "TEXT") private String termsAndConditions;
    @Column(nullable = false) private boolean active = true;
}
