package br.com.o_tab.agropec.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    private String content;
    private Instant createdAt;
    private Instant expiresAt;
}
