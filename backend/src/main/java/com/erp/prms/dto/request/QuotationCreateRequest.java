package com.erp.prms.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor
public class QuotationCreateRequest {
    @NotNull private Long rfqId;
    @NotNull private Long vendorId;
    @NotNull private LocalDate quotationDate;
    @NotNull private LocalDate validUntil;
    @NotNull @DecimalMin("0.01") private BigDecimal totalAmount;
}
