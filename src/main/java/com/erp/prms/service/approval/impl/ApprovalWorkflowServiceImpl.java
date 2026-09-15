package com.erp.prms.service.approval.impl;

import com.erp.prms.dto.request.RequisitionApproveRequest;
import com.erp.prms.dto.response.RequisitionResponse;
import com.erp.prms.entity.ApprovalStage;
import com.erp.prms.entity.ApprovalWorkflow;
import com.erp.prms.entity.PurchaseRequisition;
import com.erp.prms.entity.enums.PRStatus;
import com.erp.prms.exception.ApprovalWorkflowException;
import com.erp.prms.exception.ResourceNotFoundException;
import com.erp.prms.mapper.PurchaseRequisitionMapper;
import com.erp.prms.repository.PurchaseRequisitionRepository;
import com.erp.prms.service.approval.ApprovalWorkflowService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@Transactional
public class ApprovalWorkflowServiceImpl implements ApprovalWorkflowService {

    private final PurchaseRequisitionRepository requisitions;
    private final PurchaseRequisitionMapper mapper;

    public ApprovalWorkflowServiceImpl(
            PurchaseRequisitionRepository requisitions,
            PurchaseRequisitionMapper mapper) {
        this.requisitions = requisitions;
        this.mapper = mapper;
    }

    @Override
    public RequisitionResponse decide(
            Long requisitionId,
            String approverEmployeeId,
            RequisitionApproveRequest request) {
        var requisition = requisitions.findById(requisitionId)
                .orElseThrow(() -> new ResourceNotFoundException("Requisition not found: " + requisitionId));
        
        // Simple approval logic - just change the status
        switch (request.getAction()) {
            case REJECT -> requisition.setStatus(PRStatus.REJECTED);
            case RETURN -> requisition.setStatus(PRStatus.DRAFT);
            case APPROVE -> requisition.setStatus(PRStatus.APPROVED);
        }

        PurchaseRequisition saved = requisitions.save(requisition);
        return mapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RequisitionResponse> listPending() {
        return requisitions.findByStatusOrderByCreatedAtAsc(PRStatus.PENDING_APPROVAL).stream()
                .map(mapper::toResponse)
                .toList();
    }
}
