package com.erp.prms.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor
public class ContractResponse {
    private Long id;
    private String contractNumber;
    private Long vendorId;
    private String vendorName;
    private Long purchaseOrderId;
    private String purchaseOrderNumber;
    private BigDecimal contractValue;
    private LocalDate startDate;
    private LocalDate endDate;
    private String termsAndConditions;
    private boolean active;
    private Instant createdAt;
}
