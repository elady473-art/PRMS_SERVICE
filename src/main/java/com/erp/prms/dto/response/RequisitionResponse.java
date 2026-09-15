package com.erp.prms.dto.response;

import com.erp.prms.entity.enums.PRStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor
public class RequisitionResponse {
    private Long id;
    private String requisitionNumber;
    private String requesterEmployeeId;
    private String departmentCode;
    private String purpose;
    private String itemDetails;
    private BigDecimal estimatedAmount;
    private PRStatus status;
    private LocalDate requiredByDate;
    private Long approvalWorkflowId;
    private Instant createdAt;
}
