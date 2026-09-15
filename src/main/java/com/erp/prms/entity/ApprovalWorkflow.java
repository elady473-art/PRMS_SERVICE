package com.erp.prms.entity;

import com.erp.prms.entity.base.BaseEntity;
import com.erp.prms.entity.enums.PRStatus;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter @Setter @NoArgsConstructor
@Entity @Table(name = "approval_workflows")
public class ApprovalWorkflow extends BaseEntity {
    @Column(nullable = false, length = 150) private String workflowName;
    @Column(nullable = false, length = 100) private String departmentCode;
    @Column(nullable = false) private int currentStageOrder;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 30) private PRStatus status = PRStatus.DRAFT;
    @OneToMany(mappedBy = "approvalWorkflow", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ApprovalStage> stages = new ArrayList<>();
}
