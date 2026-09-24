package com.erp.prms.integration.mms;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Map;

@FeignClient(name = "mms", url = "${services.mms.url:http://localhost:8082}")
public interface MmsClient {

    @GetMapping("/api/inventory/items/{itemId}")
    Map<String, Object> getInventoryItem(@PathVariable("itemId") Long itemId);
}
