package com.erp.prms.validator;

import com.erp.prms.dto.response.BudgetCheckResponse;
import com.erp.prms.exception.BudgetExceededException;
import com.erp.prms.service.integration.FinanceIntegrationService;
import java.math.BigDecimal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResourceAccessException;

@Component
public class BudgetValidator {

    private static final Logger log = LoggerFactory.getLogger(BudgetValidator.class);

    private final FinanceIntegrationService financeIntegrationService;

    public BudgetValidator(FinanceIntegrationService financeIntegrationService) {
        this.financeIntegrationService = financeIntegrationService;
    }

    public void validate(String departmentCode, BigDecimal amount) {
        try {
            BudgetCheckResponse result = financeIntegrationService.checkBudget(departmentCode, amount);
            if (result != null && !result.isApproved()) {
                throw new BudgetExceededException(result.getReason());
            }
        } catch (BudgetExceededException e) {
            throw e;
        } catch (ResourceAccessException e) {
            log.warn("FMS budget check unavailable ({}). Proceeding without budget validation.", e.getMessage());
        } catch (Exception e) {
            log.warn("Budget validation skipped due to FMS error: {}", e.getMessage());
        }
    }
}
