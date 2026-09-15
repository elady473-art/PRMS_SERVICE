package com.erp.prms.controller;

import jakarta.persistence.EntityManager;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/audit-logs")
@Transactional(readOnly = true)
public class AuditController {

    private final EntityManager em;

    public AuditController(EntityManager em) {
        this.em = em;
    }

    @GetMapping
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> list(
            @RequestParam(required = false) String entity,
            @RequestParam(defaultValue = "100") int limit) {

        Instant cutoff = Instant.now().minus(30, ChronoUnit.DAYS);
        List<Map<String, Object>> logs = new ArrayList<>();

        String sql = """
                SELECT 'PURCHASE_REQUEST' AS entity_type,
                       requisition_number  AS ref_id,
                       requester_employee_id AS actor,
                       created_at          AS ts
                FROM   purchase_requisitions
                WHERE  created_at >= :cutoff
                UNION ALL
                SELECT 'VENDOR', vendor_code, 'system', created_at
                FROM   vendors
                WHERE  created_at >= :cutoff
                UNION ALL
                SELECT 'RFQ', rfq_number, 'system', created_at
                FROM   rfqs
                WHERE  created_at >= :cutoff
                UNION ALL
                SELECT 'PURCHASE_ORDER', purchase_order_number, 'system', created_at
                FROM   purchase_orders
                WHERE  created_at >= :cutoff
                UNION ALL
                SELECT 'INVOICE', invoice_number, 'system', created_at
                FROM   invoices
                WHERE  created_at >= :cutoff
                ORDER  BY ts DESC
                LIMIT  :lim
                """;

        try {
            List<Object[]> rows = em.createNativeQuery(sql)
                    .setParameter("cutoff", cutoff)
                    .setParameter("lim", limit)
                    .getResultList();

            for (Object[] row : rows) {
                Map<String, Object> entry = new LinkedHashMap<>();
                entry.put("entity",     safe(row, 0));
                entry.put("entityName", safe(row, 1));
                entry.put("actor",      safe(row, 2));
                entry.put("action",     "CREATE");
                entry.put("timestamp",  safe(row, 3));
                if (entity == null || entity.equalsIgnoreCase(safe(row, 0))) {
                    logs.add(entry);
                }
            }
        } catch (Exception ignored) {
        }

        return logs;
    }

    private static String safe(Object[] row, int i) {
        return (row != null && i < row.length && row[i] != null) ? row[i].toString() : "";
    }
}
