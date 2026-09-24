package com.erp.prms.service.vendor.impl;

import com.erp.prms.dto.request.VendorCreateRequest;
import com.erp.prms.dto.response.VendorResponse;
import com.erp.prms.entity.Vendor;
import com.erp.prms.exception.ResourceNotFoundException;
import com.erp.prms.mapper.VendorMapper;
import com.erp.prms.repository.VendorRepository;
import com.erp.prms.service.vendor.VendorService;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class VendorServiceImpl implements VendorService {

    private final VendorRepository repository;
    private final VendorMapper mapper;

    public VendorServiceImpl(VendorRepository repository, VendorMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public VendorResponse create(VendorCreateRequest request) {
        Vendor vendor = mapper.toEntity(request);
        vendor.setVendorCode("VND-%06d".formatted(repository.count() + 1));
        return mapper.toResponse(repository.save(vendor));
    }

    @Override
    public VendorResponse getById(Long id) {
        return mapper.toResponse(repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found: " + id)));
    }

    @Override
    public List<VendorResponse> listActive() {
        return repository.findByBlacklistedFalseOrderByNameAsc().stream()
                .map(mapper::toResponse)
                .toList();
    }
}
