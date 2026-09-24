package com.erp.prms.service.integration;

import com.erp.prms.dto.request.InvoiceRequest;
import com.erp.prms.dto.response.BudgetCheckResponse;
import com.erp.prms.entity.Invoice;
import com.erp.prms.exception.ResourceNotFoundException;
import com.erp.prms.repository.InvoiceRepository;
import com.erp.prms.repository.PurchaseOrderRepository;
import com.erp.prms.repository.VendorRepository;
import java.math.BigDecimal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

@Service
public class FinanceIntegrationService {

    private final RestClient restClient;
    private final InvoiceRepository invoiceRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final VendorRepository vendorRepository;

    public FinanceIntegrationService(
            RestClient.Builder builder,
            @Value("${integration.fms.base-url:http://localhost:8082}") String baseUrl,
            InvoiceRepository invoiceRepository,
            PurchaseOrderRepository purchaseOrderRepository,
            VendorRepository vendorRepository
    ) {
        this.restClient = builder.baseUrl(baseUrl).build();
        this.invoiceRepository = invoiceRepository;
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.vendorRepository = vendorRepository;
    }

    public BudgetCheckResponse checkBudget(String departmentCode, BigDecimal amount) {
        BudgetCheckResponse result = restClient.get()
                .uri(uri -> uri.path("/api/budgets/check")
                        .queryParam("departmentCode", departmentCode)
                        .queryParam("amount", amount)
                        .build())
                .retrieve()
                .body(BudgetCheckResponse.class);
        return result == null ? denied(departmentCode, amount) : result;
    }

    @Transactional
    public Invoice submitInvoice(InvoiceRequest request) {
        Invoice invoice = new Invoice();
        invoice.setInvoiceNumber(request.getInvoiceNumber());
        invoice.setPurchaseOrder(purchaseOrderRepository.findById(request.getPurchaseOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Purchase order not found")));
        invoice.setVendor(vendorRepository.findById(request.getVendorId())
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found")));
        invoice.setInvoiceAmount(request.getInvoiceAmount());
        invoice.setInvoiceDate(request.getInvoiceDate());
        invoice.setDueDate(request.getDueDate());
        invoice.setItemDetails(request.getItemDetails());
        return invoiceRepository.save(invoice);
    }

    private BudgetCheckResponse denied(String code, BigDecimal amount) {
        BudgetCheckResponse result = new BudgetCheckResponse();
        result.setBudgetCode(code);
        result.setRequestedAmount(amount);
        result.setApproved(false);
        result.setReason("FMS returned no budget result");
        return result;
    }
}
