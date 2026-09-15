package com.erp.prms.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public void notifyUsers(Map<String, Object> event) {
        log.info("Pushing notification via WebSocket: {}", event);
        messagingTemplate.convertAndSend("/topic/notifications", event);
    }
}
