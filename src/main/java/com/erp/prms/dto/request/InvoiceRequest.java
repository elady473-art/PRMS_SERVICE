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
public class InvoiceRequest {
    @NotBlank private String invoiceNumber;
    @NotNull private Long purchaseOrderId;
    @NotNull private Long vendorId;
    @NotNull @DecimalMin(value = "0.01") private BigDecimal invoiceAmount;
    @NotNull private LocalDate invoiceDate;
    @NotNull private LocalDate dueDate;
    private String itemDetails;
}
