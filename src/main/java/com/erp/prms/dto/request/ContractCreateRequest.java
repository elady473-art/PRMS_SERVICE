package com.erp.prms.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor
public class ContractCreateRequest {
    @NotNull private Long vendorId;
    @NotNull private Long purchaseOrderId;
    @NotNull @DecimalMin(value = "0.01") private BigDecimal contractValue;
    @NotNull private LocalDate startDate;
    @NotNull private LocalDate endDate;
    @NotBlank private String termsAndConditions;
}
