package com.erp.prms.service.invoice.impl;

import com.erp.prms.dto.request.InvoiceRequest;
import com.erp.prms.dto.response.InvoiceResponse;
import com.erp.prms.entity.Invoice;
import com.erp.prms.exception.ResourceNotFoundException;
import com.erp.prms.repository.InvoiceRepository;
import com.erp.prms.repository.PurchaseOrderRepository;
import com.erp.prms.repository.VendorRepository;
import com.erp.prms.service.invoice.InvoiceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import java.util.List;

@Service
@Transactional
public class InvoiceServiceImpl implements InvoiceService {

    private static final Logger log = LoggerFactory.getLogger(InvoiceServiceImpl.class);

    private final InvoiceRepository invoices;
    private final PurchaseOrderRepository purchaseOrders;
    private final VendorRepository vendors;
    private final RestClient fmsClient;

    public InvoiceServiceImpl(
            InvoiceRepository invoices,
            PurchaseOrderRepository purchaseOrders,
            VendorRepository vendors,
            RestClient.Builder builder,
            @Value("${integration.fms.base-url:http://localhost:8082}") String fmsBaseUrl) {
        this.invoices = invoices;
        this.purchaseOrders = purchaseOrders;
        this.vendors = vendors;
        this.fmsClient = builder.baseUrl(fmsBaseUrl).build();
    }

    @Override
    public InvoiceResponse submit(InvoiceRequest request) {
        var po = purchaseOrders.findById(request.getPurchaseOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Purchase order not found: " + request.getPurchaseOrderId()));
        var vendor = vendors.findById(request.getVendorId())
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found: " + request.getVendorId()));

        Invoice invoice = new Invoice();
        invoice.setInvoiceNumber(request.getInvoiceNumber());
        invoice.setPurchaseOrder(po);
        invoice.setVendor(vendor);
        invoice.setInvoiceAmount(request.getInvoiceAmount());
        invoice.setInvoiceDate(request.getInvoiceDate());
        invoice.setDueDate(request.getDueDate());
        invoice.setItemDetails(request.getItemDetails());
        invoice.setProcessingStatus("PENDING");

        Invoice saved = invoices.save(invoice);

        try {
            fmsClient.post()
                    .uri("/api/invoices/receive")
                    .body(request)
                    .retrieve()
                    .toBodilessEntity();
            saved.setProcessingStatus("SUBMITTED_TO_FMS");
        } catch (Exception e) {
            log.warn("FMS invoice forwarding failed ({}). Invoice saved locally with PENDING status.", e.getMessage());
        }

        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public InvoiceResponse getById(Long id) {
        return toResponse(invoices.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found: " + id)));
    }

    @Override
    @Transactional(readOnly = true)
    public List<InvoiceResponse> listAll() {
        return invoices.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(this::toResponse)
                .toList();
    }

    private InvoiceResponse toResponse(Invoice inv) {
        InvoiceResponse r = new InvoiceResponse();
        r.setId(inv.getId());
        r.setInvoiceNumber(inv.getInvoiceNumber());
        r.setPurchaseOrderId(inv.getPurchaseOrder().getId());
        r.setPurchaseOrderNumber(inv.getPurchaseOrder().getPurchaseOrderNumber());
        r.setVendorId(inv.getVendor().getId());
        r.setVendorName(inv.getVendor().getName());
        r.setInvoiceAmount(inv.getInvoiceAmount());
        r.setInvoiceDate(inv.getInvoiceDate());
        r.setDueDate(inv.getDueDate());
        r.setProcessingStatus(inv.getProcessingStatus());
        r.setItemDetails(inv.getItemDetails());
        r.setFinanceReference(inv.getFinanceReference());
        r.setCreatedAt(inv.getCreatedAt());
        return r;
    }
}
