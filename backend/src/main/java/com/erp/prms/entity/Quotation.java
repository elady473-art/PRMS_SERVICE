package com.erp.prms.entity;

import com.erp.prms.entity.base.BaseEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter @Setter @NoArgsConstructor
@Entity @Table(name = "quotations")
public class Quotation extends BaseEntity {
    @Column(nullable = false, unique = true, length = 50) private String quotationNumber;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "rfq_id", nullable = false) private RFQ rfq;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "vendor_id", nullable = false) private Vendor vendor;
    @Column(nullable = false) private LocalDate quotationDate;
    @Column(nullable = false) private LocalDate validUntil;
    @Column(nullable = false, precision = 19, scale = 2) private BigDecimal totalAmount;
    @Column(nullable = false) private boolean selected;
    @OneToMany(mappedBy = "quotation", cascade = CascadeType.ALL, orphanRemoval = true) private List<QuotationItem> items = new ArrayList<>();
}
