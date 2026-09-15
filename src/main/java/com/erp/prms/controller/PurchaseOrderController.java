package com.erp.prms.controller;

import com.erp.prms.dto.request.PurchaseOrderCreateRequest;
import com.erp.prms.dto.response.PurchaseOrderResponse;
import com.erp.prms.service.procurement.ProcurementService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/purchase-orders")
public class PurchaseOrderController {

    private final ProcurementService service;

    public PurchaseOrderController(ProcurementService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<PurchaseOrderResponse> create(@Valid @RequestBody PurchaseOrderCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createPurchaseOrder(request));
    }

    @GetMapping("/{id}")
    public PurchaseOrderResponse getById(@PathVariable Long id) {
        return service.getPurchaseOrder(id);
    }

    @GetMapping
    public List<PurchaseOrderResponse> list() {
        return service.listAll();
    }
}
