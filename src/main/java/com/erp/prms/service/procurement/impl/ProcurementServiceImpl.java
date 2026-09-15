package com.erp.prms.service.procurement.impl;

import com.erp.prms.dto.request.PurchaseOrderCreateRequest;
import com.erp.prms.dto.response.PurchaseOrderResponse;
import com.erp.prms.entity.PurchaseOrder;
import com.erp.prms.entity.enums.PRStatus;
import com.erp.prms.exception.ResourceNotFoundException;
import com.erp.prms.mapper.PurchaseOrderMapper;
import com.erp.prms.repository.PurchaseOrderRepository;
import com.erp.prms.repository.PurchaseRequisitionRepository;
import com.erp.prms.repository.VendorRepository;
import com.erp.prms.service.events.ProcurementEventPublisher;
import com.erp.prms.service.procurement.ProcurementService;
import com.erp.prms.util.POGenerator;
import com.erp.prms.validator.ProcurementPolicyValidator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class ProcurementServiceImpl implements ProcurementService {

    private final PurchaseOrderRepository po;
    private final PurchaseRequisitionRepository pr;
    private final VendorRepository vendors;
    private final PurchaseOrderMapper mapper;
    private final POGenerator generator;
    private final ProcurementPolicyValidator policy;
    private final ProcurementEventPublisher events;

    public ProcurementServiceImpl(
            PurchaseOrderRepository po,
            PurchaseRequisitionRepository pr,
            VendorRepository vendors,
            PurchaseOrderMapper mapper,
            POGenerator generator,
            ProcurementPolicyValidator policy,
            ProcurementEventPublisher events) {
        this.po = po;
        this.pr = pr;
        this.vendors = vendors;
        this.mapper = mapper;
        this.generator = generator;
        this.policy = policy;
        this.events = events;
    }

    @Override
    public PurchaseOrderResponse createPurchaseOrder(PurchaseOrderCreateRequest request) {
        var requisition = pr.findById(request.getPurchaseRequisitionId())
                .orElseThrow(() -> new ResourceNotFoundException("Requisition not found: " + request.getPurchaseRequisitionId()));

        // Allow generating POs for active/approved requisitions
        if (requisition.getStatus() == PRStatus.REJECTED) {
            throw new IllegalStateException("Cannot create PO for rejected requisition");
        }

        var vendor = vendors.findById(request.getVendorId())
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found: " + request.getVendorId()));

        policy.validateVendor(vendor);
        policy.validateAmount(request.getTotalAmount());

        PurchaseOrder entity = mapper.toEntity(request);
        entity.setPurchaseOrderNumber(generator.next());
        entity.setPurchaseRequisition(requisition);
        entity.setVendor(vendor);
        entity.setOrderDate(LocalDate.now());

        PurchaseOrder saved = po.save(entity);
        requisition.setStatus(PRStatus.PO_CREATED);
        events.publish("PURCHASE_ORDER_CREATED", saved.getId().toString());

        return mapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public PurchaseOrderResponse getPurchaseOrder(Long id) {
        return mapper.toResponse(po.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase order not found: " + id)));
    }

    @Override
    @Transactional(readOnly = true)
    public List<PurchaseOrderResponse> listAll() {
        return po.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(mapper::toResponse)
                .toList();
    }
}
