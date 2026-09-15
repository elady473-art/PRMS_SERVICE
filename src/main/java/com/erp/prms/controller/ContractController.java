package com.erp.prms.controller;

import com.erp.prms.dto.request.ContractCreateRequest;
import com.erp.prms.dto.response.ContractResponse;
import com.erp.prms.service.contract.ContractService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/contracts")
public class ContractController {

    private final ContractService service;

    public ContractController(ContractService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ContractResponse> create(@Valid @RequestBody ContractCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @GetMapping("/{id}")
    public ContractResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping
    public List<ContractResponse> list(@RequestParam(required = false, defaultValue = "false") boolean activeOnly) {
        return activeOnly ? service.listActive() : service.listAll();
    }
}
