package com.erp.prms.validator;

import com.erp.prms.entity.Vendor;
import com.erp.prms.exception.VendorBlacklistedException;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;

@Component
public class ProcurementPolicyValidator {
    public void validateVendor(Vendor vendor) { if (vendor.isBlacklisted()) throw new VendorBlacklistedException("Vendor is blacklisted: " + vendor.getVendorCode()); }
    public void validateAmount(BigDecimal amount) { if (amount == null || amount.signum() <= 0) throw new IllegalArgumentException("Procurement amount must be positive"); }
}
