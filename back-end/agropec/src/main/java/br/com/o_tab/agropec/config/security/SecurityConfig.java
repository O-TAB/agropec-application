package br.com.o_tab.agropec.config.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;



@Configuration
@EnableWebSecurity
public class SecurityConfig{

    
    @Autowired
    SecurityFilter securityFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .cors(cors -> {})
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(HttpMethod.POST, "/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/auth/register").hasRole("SUPERADMIN")
                        .requestMatchers(HttpMethod.POST, "/stands/{mapId}").hasAnyRole("SUPERADMIN", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/stands/{mapId}").hasAnyRole("SUPERADMIN", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/stands/{mapId}").hasAnyRole("SUPERADMIN", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/map").hasAnyRole("SUPERADMIN", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/map/{mapId}/point").hasAnyRole("SUPERADMIN", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/map/{mapId}/point/{pointId}").hasAnyRole("SUPERADMIN", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "map/{mapId}/point/{pointId}").hasAnyRole("SUPERADMIN", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/event/{mapId}").hasAnyRole("SUPERADMIN", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/event/{name}").hasAnyRole("SUPERADMIN", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/event/{name}").hasAnyRole("SUPERADMIN", "ADMIN")

                        .anyRequest().permitAll())

                        
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();

    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

}
