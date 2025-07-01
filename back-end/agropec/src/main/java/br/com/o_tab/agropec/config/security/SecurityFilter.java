package br.com.o_tab.agropec.config.security;

import br.com.o_tab.agropec.repository.UserRepository;
import br.com.o_tab.agropec.service.TokenService;


import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    TokenService tokenService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    SecurityDatabaseService securityDatabaseService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        var token = this.recoverToken(request);
        if(token != null && !token.isEmpty()) {
            var username = tokenService.validateToken(token);
            
            // Só tenta autenticar se o username não estiver vazio
            if(username != null && !username.isEmpty()) {
                try {
                    UserDetails user = securityDatabaseService.loadUserByUsername(username);
                    var authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                } catch (Exception e) {
                    // Log do erro mas não interrompe o fluxo
                    System.err.println("Erro ao autenticar usuário: " + e.getMessage());
                }
            }
        }
        filterChain.doFilter(request, response);
    }

    private String recoverToken(HttpServletRequest request) {
        var authHeader = request.getHeader("Authorization");
        if(authHeader == null || authHeader.isEmpty()) return null;
        return authHeader.replace("Bearer ", "");
    }
}
