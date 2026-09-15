package com.erp.prms.messaging.consumer;

import com.erp.prms.config.RabbitMQConfig;
import com.erp.prms.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class PrmsEventConsumer {

    private final NotificationService notificationService;

    @RabbitListener(queues = RabbitMQConfig.PRMS_QUEUE)
    public void consumeEvent(Map<String, Object> event) {
        log.info("Received event from {}: {}", RabbitMQConfig.PRMS_QUEUE, event);
        notificationService.notifyUsers(event);
    }
}
