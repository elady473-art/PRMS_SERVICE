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

@Getter @Setter @NoArgsConstructor
@Entity @Table(name = "quotation_items")
public class QuotationItem extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "quotation_id", nullable = false) private Quotation quotation;
    @Column(nullable = false, length = 500) private String description;
    @Column(nullable = false, precision = 19, scale = 3) private BigDecimal quantity;
    @Column(nullable = false, length = 30) private String unitOfMeasure;
    @Column(nullable = false, precision = 19, scale = 2) private BigDecimal unitPrice;
    @Column(nullable = false, precision = 19, scale = 2) private BigDecimal lineTotal;
}
