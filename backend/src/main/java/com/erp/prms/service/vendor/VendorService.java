package com.erp.prms.service.vendor;

import com.erp.prms.dto.request.VendorCreateRequest;
import com.erp.prms.dto.response.VendorResponse;
import java.util.List;

public interface VendorService {

    /** Registers a vendor. */
    VendorResponse create(VendorCreateRequest request);

    /** Retrieves a vendor. */
    VendorResponse getById(Long id);

    /** Lists non-blacklisted vendors. */
    List<VendorResponse> listActive();
}
