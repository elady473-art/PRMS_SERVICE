package com.erp.prms.service.events;

import com.erp.prms.config.RabbitMQConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProcurementEventPublisher {
    private final RabbitTemplate rabbitTemplate;

    public void publish(Object event) {
        rabbitTemplate.convertAndSend(
            RabbitMQConfig.ERP_EXCHANGE,
            "procurement.event",
            event
        );
    }

    public void publish(String eventType, String aggregateId) {
        var event = new java.util.HashMap<String, Object>();
        event.put("eventType", eventType);
        event.put("aggregateId", aggregateId);

        rabbitTemplate.convertAndSend(
            RabbitMQConfig.ERP_EXCHANGE,
            "procurement.event",
            event
        );
    }
}