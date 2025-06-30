package br.com.o_tab.agropec.dto;

import java.time.Instant;

public record NotificationDTO(String content, Instant createdAt, Instant expiresAt) {
}
