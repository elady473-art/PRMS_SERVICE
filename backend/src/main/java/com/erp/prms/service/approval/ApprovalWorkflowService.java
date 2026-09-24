package com.erp.prms.service.approval;

import com.erp.prms.dto.request.RequisitionApproveRequest;
import com.erp.prms.dto.response.RequisitionResponse;

import java.util.List;

public interface ApprovalWorkflowService {
    RequisitionResponse decide(Long requisitionId, String approverEmployeeId, RequisitionApproveRequest request);
    List<RequisitionResponse> listPending();
}
