package com.erp.prms.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor
public class InventoryCheckResponse {
    private boolean available;
    private String itemCode;
    private BigDecimal requestedQuantity;
    private BigDecimal availableQuantity;
    private String warehouseCode;
    private String reason;
}
