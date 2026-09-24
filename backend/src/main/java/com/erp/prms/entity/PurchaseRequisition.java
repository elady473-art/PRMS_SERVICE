package com.erp.prms.entity;

import com.erp.prms.entity.base.BaseEntity;
import com.erp.prms.entity.enums.PRStatus;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Entity @Table(name = "purchase_requisitions")
public class PurchaseRequisition extends BaseEntity {
    @Column(nullable = false, unique = true, length = 50) private String requisitionNumber;
    @Column(nullable = false, length = 100) private String requesterEmployeeId;
    @Column(nullable = false, length = 100) private String departmentCode;
    @Column(nullable = false, length = 500) private String purpose;
    @Column(nullable = false, columnDefinition = "TEXT") private String itemDetails;
    @Column(nullable = false, precision = 19, scale = 2) private BigDecimal estimatedAmount;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 30) private PRStatus status = PRStatus.DRAFT;
    private LocalDate requiredByDate;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "approval_workflow_id") private ApprovalWorkflow approvalWorkflow;
    @OneToOne(mappedBy = "purchaseRequisition", fetch = FetchType.LAZY) private PurchaseOrder purchaseOrder;
}
