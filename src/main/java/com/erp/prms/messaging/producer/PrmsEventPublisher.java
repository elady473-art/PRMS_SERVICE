package com.erp.prms.messaging.producer;

import com.erp.prms.config.RabbitMQConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class PrmsEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    public void publishEvent(String routingKey, Map<String, Object> event) {
        log.info("Publishing event with routing key [{}]: {}", routingKey, event);
        rabbitTemplate.convertAndSend(RabbitMQConfig.ERP_EXCHANGE, routingKey, event);
    }
}
