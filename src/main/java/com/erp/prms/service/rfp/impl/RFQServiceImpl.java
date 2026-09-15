package com.erp.prms.service.rfp.impl;

import com.erp.prms.dto.request.RFQCreateRequest;
import com.erp.prms.dto.response.RFQResponse;
import com.erp.prms.entity.RFQ;
import com.erp.prms.exception.ResourceNotFoundException;
import com.erp.prms.repository.PurchaseRequisitionRepository;
import com.erp.prms.repository.RFQRepository;
import com.erp.prms.service.rfp.RFQService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class RFQServiceImpl implements RFQService {

    private final RFQRepository rfqs;
    private final PurchaseRequisitionRepository requisitions;

    public RFQServiceImpl(RFQRepository rfqs, PurchaseRequisitionRepository requisitions) {
        this.rfqs = rfqs;
        this.requisitions = requisitions;
    }

    @Override
    public RFQResponse create(RFQCreateRequest request) {
        var requisition = requisitions.findById(request.getPurchaseRequisitionId())
                .orElseThrow(() -> new ResourceNotFoundException("Requisition not found: " + request.getPurchaseRequisitionId()));

        RFQ rfq = new RFQ();
        rfq.setRfqNumber("RFQ-%06d".formatted(rfqs.count() + 1));
        rfq.setPurchaseRequisition(requisition);
        rfq.setTitle(request.getTitle());
        rfq.setItemDetails(request.getItemDetails());
        rfq.setSubmissionDeadline(request.getSubmissionDeadline());
        rfq.setActive(true);

        return toResponse(rfqs.save(rfq));
    }

    @Override
    @Transactional(readOnly = true)
    public RFQResponse getById(Long id) {
        return toResponse(rfqs.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RFQ not found: " + id)));
    }

    @Override
    @Transactional(readOnly = true)
    public List<RFQResponse> listAll() {
        return rfqs.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(this::toResponse)
                .toList();
    }

    private RFQResponse toResponse(RFQ rfq) {
        RFQResponse r = new RFQResponse();
        r.setId(rfq.getId());
        r.setRfqNumber(rfq.getRfqNumber());
        r.setTitle(rfq.getTitle());
        r.setItemDetails(rfq.getItemDetails());
        r.setSubmissionDeadline(rfq.getSubmissionDeadline());
        r.setActive(rfq.isActive());
        if (rfq.getPurchaseRequisition() != null) {
            r.setPurchaseRequisitionId(rfq.getPurchaseRequisition().getId());
            r.setRequisitionNumber(rfq.getPurchaseRequisition().getRequisitionNumber());
        }
        r.setCreatedAt(rfq.getCreatedAt());
        return r;
    }
}
