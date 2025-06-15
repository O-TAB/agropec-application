package br.com.o_tab.agropec.dto;

public record LoginResponseDTO (
    String token,
    String username,
    String email,
    String role
) {}
