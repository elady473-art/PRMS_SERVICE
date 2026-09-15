package com.erp.prms.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor
public class QuotationResponse {
    private Long id;
    private String quotationNumber;
    private Long rfqId;
    private String rfqNumber;
    private Long vendorId;
    private String vendorName;
    private LocalDate quotationDate;
    private LocalDate validUntil;
    private BigDecimal totalAmount;
    private boolean selected;
    private Instant createdAt;
}
