package com.erp.prms.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor
public class RFQResponse {
    private Long id;
    private String rfqNumber;
    private String title;
    private String itemDetails;
    private LocalDate submissionDeadline;
    private boolean active;
    private Long purchaseRequisitionId;
    private String requisitionNumber;
    private Instant createdAt;
}
