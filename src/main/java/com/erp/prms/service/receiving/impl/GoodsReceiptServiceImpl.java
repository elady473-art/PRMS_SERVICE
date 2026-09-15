package com.erp.prms.service.receiving.impl;

import com.erp.prms.dto.request.GoodsReceiptRequest;
import com.erp.prms.dto.response.GoodsReceiptResponse;
import com.erp.prms.entity.GoodsReceiptNote;
import com.erp.prms.entity.enums.POStatus;
import com.erp.prms.exception.ResourceNotFoundException;
import com.erp.prms.repository.GoodsReceiptNoteRepository;
import com.erp.prms.repository.PurchaseOrderRepository;
import com.erp.prms.service.receiving.GoodsReceiptService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class GoodsReceiptServiceImpl implements GoodsReceiptService {

    private final GoodsReceiptNoteRepository receipts;
    private final PurchaseOrderRepository orders;

    public GoodsReceiptServiceImpl(GoodsReceiptNoteRepository receipts, PurchaseOrderRepository orders) {
        this.receipts = receipts;
        this.orders = orders;
    }

    @Override
    public GoodsReceiptResponse record(GoodsReceiptRequest request) {
        var purchaseOrder = orders.findById(request.getPurchaseOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Purchase order not found: " + request.getPurchaseOrderId()));

        GoodsReceiptNote note = new GoodsReceiptNote();
        note.setReceiptNumber("GRN-%06d".formatted(receipts.count() + 1));
        note.setPurchaseOrder(purchaseOrder);
        note.setReceiptDate(request.getReceiptDate());
        note.setReceivedByEmployeeId(request.getReceivedByEmployeeId());
        note.setReceiptDetails(request.getReceiptDetails());
        note.setInspectionNotes(request.getInspectionNotes());
        note.setAccepted(request.getAccepted());

        if (request.getAccepted()) {
            purchaseOrder.setStatus(POStatus.PARTIALLY_RECEIVED);
        }

        return toResponse(receipts.save(note));
    }

    @Override
    @Transactional(readOnly = true)
    public GoodsReceiptResponse getById(Long id) {
        return toResponse(receipts.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Goods receipt not found: " + id)));
    }

    @Override
    @Transactional(readOnly = true)
    public List<GoodsReceiptResponse> listAll() {
        return receipts.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(this::toResponse)
                .toList();
    }

    private GoodsReceiptResponse toResponse(GoodsReceiptNote note) {
        GoodsReceiptResponse r = new GoodsReceiptResponse();
        r.setId(note.getId());
        r.setReceiptNumber(note.getReceiptNumber());
        r.setPurchaseOrderId(note.getPurchaseOrder().getId());
        r.setPurchaseOrderNumber(note.getPurchaseOrder().getPurchaseOrderNumber());
        r.setVendorName(note.getPurchaseOrder().getVendor().getName());
        r.setReceiptDate(note.getReceiptDate());
        r.setReceivedByEmployeeId(note.getReceivedByEmployeeId());
        r.setReceiptDetails(note.getReceiptDetails());
        r.setInspectionNotes(note.getInspectionNotes());
        r.setAccepted(note.isAccepted());
        r.setCreatedAt(note.getCreatedAt());
        return r;
    }
}
