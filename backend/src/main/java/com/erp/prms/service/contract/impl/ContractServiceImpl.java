package com.erp.prms.service.contract.impl;

import com.erp.prms.dto.request.ContractCreateRequest;
import com.erp.prms.dto.response.ContractResponse;
import com.erp.prms.entity.ProcurementContract;
import com.erp.prms.exception.ResourceNotFoundException;
import com.erp.prms.repository.ProcurementContractRepository;
import com.erp.prms.repository.PurchaseOrderRepository;
import com.erp.prms.repository.VendorRepository;
import com.erp.prms.service.contract.ContractService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ContractServiceImpl implements ContractService {

    private final ProcurementContractRepository contracts;
    private final VendorRepository vendors;
    private final PurchaseOrderRepository purchaseOrders;

    public ContractServiceImpl(
            ProcurementContractRepository contracts,
            VendorRepository vendors,
            PurchaseOrderRepository purchaseOrders) {
        this.contracts = contracts;
        this.vendors = vendors;
        this.purchaseOrders = purchaseOrders;
    }

    @Override
    public ContractResponse create(ContractCreateRequest request) {
        var vendor = vendors.findById(request.getVendorId())
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found: " + request.getVendorId()));
        var po = purchaseOrders.findById(request.getPurchaseOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Purchase order not found: " + request.getPurchaseOrderId()));

        ProcurementContract contract = new ProcurementContract();
        contract.setContractNumber("CT-%06d".formatted(contracts.count() + 1));
        contract.setVendor(vendor);
        contract.setPurchaseOrder(po);
        contract.setContractValue(request.getContractValue());
        contract.setStartDate(request.getStartDate());
        contract.setEndDate(request.getEndDate());
        contract.setTermsAndConditions(request.getTermsAndConditions());
        contract.setActive(true);

        return toResponse(contracts.save(contract));
    }

    @Override
    @Transactional(readOnly = true)
    public ContractResponse getById(Long id) {
        return toResponse(contracts.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found: " + id)));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContractResponse> listAll() {
        return contracts.findAllByOrderByStartDateDesc().stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContractResponse> listActive() {
        return contracts.findByActiveTrueOrderByStartDateDesc().stream()
                .map(this::toResponse)
                .toList();
    }

    private ContractResponse toResponse(ProcurementContract c) {
        ContractResponse r = new ContractResponse();
        r.setId(c.getId());
        r.setContractNumber(c.getContractNumber());
        r.setVendorId(c.getVendor().getId());
        r.setVendorName(c.getVendor().getName());
        if (c.getPurchaseOrder() != null) {
            r.setPurchaseOrderId(c.getPurchaseOrder().getId());
            r.setPurchaseOrderNumber(c.getPurchaseOrder().getPurchaseOrderNumber());
        }
        r.setContractValue(c.getContractValue());
        r.setStartDate(c.getStartDate());
        r.setEndDate(c.getEndDate());
        r.setTermsAndConditions(c.getTermsAndConditions());
        r.setActive(c.isActive());
        r.setCreatedAt(c.getCreatedAt());
        return r;
    }
}
