package com.erp.prms.dto.request;

import com.erp.prms.entity.enums.PaymentTerms;
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
public class PurchaseOrderCreateRequest {
    @NotNull private Long purchaseRequisitionId;
    @NotNull private Long vendorId;
    @NotBlank private String itemDetails;
    @NotNull @DecimalMin(value = "0.01") private BigDecimal totalAmount;
    @NotNull private PaymentTerms paymentTerms;
    @NotNull private LocalDate expectedDeliveryDate;
    private LocalDate expiryDate;
}
