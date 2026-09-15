package com.erp.prms.controller;

import com.erp.prms.dto.request.QuotationCreateRequest;
import com.erp.prms.dto.response.QuotationResponse;
import com.erp.prms.entity.Quotation;
import com.erp.prms.exception.ResourceNotFoundException;
import com.erp.prms.repository.QuotationRepository;
import com.erp.prms.repository.RFQRepository;
import com.erp.prms.repository.VendorRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/quotations")
@Transactional
public class QuotationController {

    private final QuotationRepository quotations;
    private final RFQRepository rfqs;
    private final VendorRepository vendors;

    public QuotationController(QuotationRepository quotations, RFQRepository rfqs, VendorRepository vendors) {
        this.quotations = quotations;
        this.rfqs = rfqs;
        this.vendors = vendors;
    }

    @PostMapping
    public ResponseEntity<QuotationResponse> create(@Valid @RequestBody QuotationCreateRequest req) {
        var rfq = rfqs.findById(req.getRfqId())
                .orElseThrow(() -> new ResourceNotFoundException("RFQ not found: " + req.getRfqId()));
        var vendor = vendors.findById(req.getVendorId())
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found: " + req.getVendorId()));

        Quotation q = new Quotation();
        q.setQuotationNumber("Q-%06d".formatted(quotations.count() + 1));
        q.setRfq(rfq);
        q.setVendor(vendor);
        q.setQuotationDate(req.getQuotationDate());
        q.setValidUntil(req.getValidUntil());
        q.setTotalAmount(req.getTotalAmount());
        q.setSelected(false);

        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(quotations.save(q)));
    }

    @GetMapping("/{id}")
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public QuotationResponse getById(@PathVariable Long id) {
        return toResponse(quotations.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quotation not found: " + id)));
    }

    @GetMapping
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<QuotationResponse> list(@RequestParam(required = false) Long rfqId) {
        List<Quotation> result = rfqId != null
                ? quotations.findByRfqIdOrderByTotalAmountAsc(rfqId)
                : quotations.findAll();
        return result.stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(this::toResponse)
                .toList();
    }

    @PostMapping("/{id}/select")
    public QuotationResponse select(@PathVariable Long id) {
        var q = quotations.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quotation not found: " + id));
        quotations.findByRfqIdOrderByTotalAmountAsc(q.getRfq().getId())
                .forEach(other -> other.setSelected(false));
        q.setSelected(true);
        return toResponse(quotations.save(q));
    }

    private QuotationResponse toResponse(Quotation q) {
        QuotationResponse r = new QuotationResponse();
        r.setId(q.getId());
        r.setQuotationNumber(q.getQuotationNumber());
        r.setRfqId(q.getRfq().getId());
        r.setRfqNumber(q.getRfq().getRfqNumber());
        r.setVendorId(q.getVendor().getId());
        r.setVendorName(q.getVendor().getName());
        r.setQuotationDate(q.getQuotationDate());
        r.setValidUntil(q.getValidUntil());
        r.setTotalAmount(q.getTotalAmount());
        r.setSelected(q.isSelected());
        r.setCreatedAt(q.getCreatedAt());
        return r;
    }
}
