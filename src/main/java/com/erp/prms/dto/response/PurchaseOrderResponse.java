package com.erp.prms.dto.response;

import com.erp.prms.entity.enums.POStatus;
import com.erp.prms.entity.enums.PaymentTerms;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor
public class PurchaseOrderResponse {
    private Long id;
    private String purchaseOrderNumber;
    private Long purchaseRequisitionId;
    private Long vendorId;
    private String vendorName;
    private String itemDetails;
    private BigDecimal totalAmount;
    private PaymentTerms paymentTerms;
    private POStatus status;
    private LocalDate orderDate;
    private LocalDate expectedDeliveryDate;
    private LocalDate expiryDate;
    private Instant createdAt;
}
