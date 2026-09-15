package com.erp.prms.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor
public class InvoiceResponse {
    private Long id;
    private String invoiceNumber;
    private Long purchaseOrderId;
    private String purchaseOrderNumber;
    private Long vendorId;
    private String vendorName;
    private BigDecimal invoiceAmount;
    private LocalDate invoiceDate;
    private LocalDate dueDate;
    private String processingStatus;
    private String itemDetails;
    private String financeReference;
    private Instant createdAt;
}
