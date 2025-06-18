package br.com.o_tab.agropec.dto;

import br.com.o_tab.agropec.model.UserRole;

public record LoginResponseDTO (
    String token,
    String username,
    String email,
    UserRole role
) {}
