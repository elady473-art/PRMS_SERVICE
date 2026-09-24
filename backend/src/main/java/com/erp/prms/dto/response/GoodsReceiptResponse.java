package com.erp.prms.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor
public class GoodsReceiptResponse {
    private Long id;
    private String receiptNumber;
    private Long purchaseOrderId;
    private String purchaseOrderNumber;
    private String vendorName;
    private LocalDate receiptDate;
    private String receivedByEmployeeId;
    private String receiptDetails;
    private String inspectionNotes;
    private boolean accepted;
    private Instant createdAt;
}
