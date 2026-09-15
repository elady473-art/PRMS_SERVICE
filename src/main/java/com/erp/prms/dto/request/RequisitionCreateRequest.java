package com.erp.prms.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor
public class RequisitionCreateRequest {
    @NotBlank private String requesterEmployeeId;
    @NotBlank private String departmentCode;
    @NotBlank private String purpose;
    @NotBlank private String itemDetails;
    @NotNull @DecimalMin(value = "0.01") private BigDecimal estimatedAmount;
    @NotNull @FutureOrPresent private LocalDate requiredByDate;
}
