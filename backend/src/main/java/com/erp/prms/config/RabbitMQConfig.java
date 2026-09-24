package com.erp.prms.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String ERP_EXCHANGE = "erp.events";
    public static final String PRMS_QUEUE = "prms.events";
    public static final String ROUTING_KEY_PATTERN = "fms.#"; // Example: Listen to fms events

    @Bean
    public Queue prmsQueue() {
        return new Queue(PRMS_QUEUE, true);
    }

    @Bean
    public TopicExchange erpExchange() {
        return new TopicExchange(ERP_EXCHANGE);
    }

    @Bean
    public Binding binding(Queue prmsQueue, TopicExchange erpExchange) {
        return BindingBuilder.bind(prmsQueue)
                .to(erpExchange)
                .with(ROUTING_KEY_PATTERN);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory, MessageConverter converter) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(converter);
        return template;
    }
}
