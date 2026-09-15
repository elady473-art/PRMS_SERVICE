package com.erp.prms.dto.request;

import com.erp.prms.entity.enums.ApprovalAction;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public class RequisitionApproveRequest {
    @NotNull private ApprovalAction action;
    @Size(max = 1000) private String comments;
}
