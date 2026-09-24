package com.erp.prms.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor
public class GoodsReceiptRequest {
    @NotNull private Long purchaseOrderId;
    @NotNull private LocalDate receiptDate;
    @NotBlank private String receivedByEmployeeId;
    @NotBlank private String receiptDetails;
    private String inspectionNotes;
    @NotNull private Boolean accepted;
}
