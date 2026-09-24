package com.erp.prms.util;

import org.springframework.stereotype.Component;
import java.time.Year;
import java.util.concurrent.atomic.AtomicLong;

@Component
public class POGenerator {
    private final AtomicLong sequence = new AtomicLong();
    public String next() { return "PO-%d-%04d".formatted(Year.now().getValue(), sequence.incrementAndGet()); }
}
