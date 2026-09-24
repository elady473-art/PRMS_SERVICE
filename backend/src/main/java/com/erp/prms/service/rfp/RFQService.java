package com.erp.prms.service.rfp;

import com.erp.prms.dto.request.RFQCreateRequest;
import com.erp.prms.dto.response.RFQResponse;

import java.util.List;

public interface RFQService {
    RFQResponse create(RFQCreateRequest request);
    RFQResponse getById(Long id);
    List<RFQResponse> listAll();
}
