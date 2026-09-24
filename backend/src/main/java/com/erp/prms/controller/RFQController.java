package com.erp.prms.controller;

import com.erp.prms.dto.request.RFQCreateRequest;
import com.erp.prms.dto.response.RFQResponse;
import com.erp.prms.entity.RFQ;
import com.erp.prms.service.rfp.RFQService;
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
@RequestMapping("/api/v1/rfqs")
public class RFQController {

    private final RFQService service;

    public RFQController(RFQService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<RFQResponse> create(@Valid @RequestBody RFQCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @GetMapping("/{id}")
    public RFQResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping
    public List<RFQResponse> list() {
        return service.listAll();
    }
}
