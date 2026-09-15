package com.erp.prms.controller;

import com.erp.prms.dto.request.RequisitionApproveRequest;
import com.erp.prms.dto.response.RequisitionResponse;
import com.erp.prms.service.approval.ApprovalWorkflowService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/approvals")
public class ApprovalController {

    private final ApprovalWorkflowService service;

    public ApprovalController(ApprovalWorkflowService service) {
        this.service = service;
    }

    @GetMapping("/pending")
    public List<RequisitionResponse> listPending() {
        return service.listPending();
    }

    @PostMapping("/requisitions/{requisitionId}")
    public RequisitionResponse decide(
            @PathVariable Long requisitionId,
            @Valid @RequestBody RequisitionApproveRequest request,
            Authentication authentication) {
        String username = (authentication != null && authentication.getName() != null) ? authentication.getName() : "admin";
        return service.decide(requisitionId, username, request);
    }
}
