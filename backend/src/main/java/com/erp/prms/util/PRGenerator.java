package com.erp.prms.util;

import org.springframework.stereotype.Component;
import java.time.Year;
import java.util.concurrent.atomic.AtomicLong;

@Component
public class PRGenerator {
    private final AtomicLong sequence = new AtomicLong();
    public String next() { return "PR-%d-%04d".formatted(Year.now().getValue(), sequence.incrementAndGet()); }
}
