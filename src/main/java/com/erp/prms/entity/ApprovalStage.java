package com.erp.prms.entity;

import com.erp.prms.entity.base.BaseEntity;
import com.erp.prms.entity.enums.ApprovalAction;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter @Setter @NoArgsConstructor
@Entity @Table(name = "approval_stages")
public class ApprovalStage extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "approval_workflow_id", nullable = false)
    private ApprovalWorkflow approvalWorkflow;
    @Column(nullable = false) private int stageOrder;
    @Column(nullable = false, length = 100) private String approverEmployeeId;
    @Enumerated(EnumType.STRING) @Column(length = 20) private ApprovalAction action;
    private Instant actionedAt;
    @Column(length = 1000) private String comments;
}
