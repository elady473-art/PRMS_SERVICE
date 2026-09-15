package com.erp.prms.repository;

import com.erp.prms.entity.ApprovalWorkflow;
import com.erp.prms.entity.enums.PRStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApprovalWorkflowRepository extends JpaRepository<ApprovalWorkflow, Long> {
    List<ApprovalWorkflow> findByDepartmentCodeAndStatus(String departmentCode, PRStatus status);
}
