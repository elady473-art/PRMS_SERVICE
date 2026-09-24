package com.erp.prms.controller;

import com.erp.prms.dto.request.RequisitionCreateRequest;
import com.erp.prms.dto.response.RequisitionResponse;
import com.erp.prms.service.requisition.RequisitionService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/requisitions")
public class PurchaseRequisitionController {

    private final RequisitionService service;

    public PurchaseRequisitionController(RequisitionService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<RequisitionResponse> create(@Valid @RequestBody RequisitionCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @GetMapping("/{id}")
    public RequisitionResponse get(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping
    public List<RequisitionResponse> list(@RequestParam(required = false) String requesterEmployeeId) {
        if (requesterEmployeeId == null || requesterEmployeeId.isBlank()) {
            return service.findAll();
        }
        return service.findByRequester(requesterEmployeeId);
    }

    @PostMapping("/{id}/submit")
    public RequisitionResponse submit(@PathVariable Long id) {
        return service.submit(id);
    }
}
