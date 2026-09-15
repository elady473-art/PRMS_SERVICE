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

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter @Setter @NoArgsConstructor
@Entity @Table(name = "rfqs")
public class RFQ extends BaseEntity {
    @Column(nullable = false, unique = true, length = 50) private String rfqNumber;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "requisition_id", nullable = false) private PurchaseRequisition purchaseRequisition;
    @Column(nullable = false, length = 250) private String title;
    @Column(nullable = false, columnDefinition = "TEXT") private String itemDetails;
    @Column(nullable = false) private LocalDate submissionDeadline;
    @Column(nullable = false) private boolean active = true;
    @OneToMany(mappedBy = "rfq", cascade = CascadeType.ALL, orphanRemoval = true) private List<Quotation> quotations = new ArrayList<>();
}
