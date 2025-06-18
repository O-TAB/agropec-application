package br.com.o_tab.agropec.dto;

import br.com.o_tab.agropec.model.UserRole;

public record RegisterDTO (
         String username,
         String email,
         String password,
         UserRole role
        
) {}
