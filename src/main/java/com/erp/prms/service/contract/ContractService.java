package com.erp.prms.service.contract;

import com.erp.prms.dto.request.ContractCreateRequest;
import com.erp.prms.dto.response.ContractResponse;

import java.util.List;

public interface ContractService {
    ContractResponse create(ContractCreateRequest request);
    ContractResponse getById(Long id);
    List<ContractResponse> listAll();
    List<ContractResponse> listActive();
}
