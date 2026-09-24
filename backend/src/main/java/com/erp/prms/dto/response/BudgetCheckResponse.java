package com.erp.prms.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor
public class BudgetCheckResponse {
    private boolean approved;
    private String budgetCode;
    private BigDecimal availableAmount;
    private BigDecimal requestedAmount;
    private String reason;
}
