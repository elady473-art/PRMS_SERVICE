package com.erp.prms.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.erp.prms.dto.request.VendorCreateRequest;
import com.erp.prms.dto.response.VendorResponse;
import com.erp.prms.service.vendor.VendorService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/vendors")
@Tag(name = "Vendors", description = "Vendor Management API - Real Database Operations")
@SecurityRequirement(name = "bearerAuth")
public class VendorController {

    private final VendorService service;

    public VendorController(VendorService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<VendorResponse> create(
            @Valid @RequestBody VendorCreateRequest request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.create(request));
    }

    @GetMapping("/{id}")
    public VendorResponse get(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping
    public List<VendorResponse> list() {
        return service.listActive();
    }
}