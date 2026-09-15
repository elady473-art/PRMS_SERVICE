package com.erp.prms.controller;

import com.erp.prms.dto.request.GoodsReceiptRequest;
import com.erp.prms.dto.response.GoodsReceiptResponse;
import com.erp.prms.service.receiving.GoodsReceiptService;
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
@RequestMapping("/api/v1/goods-receipts")
public class GoodsReceiptController {

    private final GoodsReceiptService service;

    public GoodsReceiptController(GoodsReceiptService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<GoodsReceiptResponse> record(@Valid @RequestBody GoodsReceiptRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.record(request));
    }

    @GetMapping("/{id}")
    public GoodsReceiptResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping
    public List<GoodsReceiptResponse> list() {
        return service.listAll();
    }
}
