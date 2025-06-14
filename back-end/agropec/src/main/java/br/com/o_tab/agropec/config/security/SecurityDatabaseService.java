package br.com.o_tab.agropec.config.security;

import java.util.HashSet;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import br.com.o_tab.agropec.model.Users;
import br.com.o_tab.agropec.repository.UserRepository;

@Service
public class SecurityDatabaseService implements UserDetailsService {

    @Autowired
    UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Users userEntity = userRepository.findByEmail(email);

        if (userEntity == null) {
            throw new UsernameNotFoundException("Usuário não encontrado com o email: " + email);
        }

        UserDetails user = org.springframework.security.core.userdetails.User
                .withUsername(userEntity.getEmail())
                .password(userEntity.getPassword())
                .authorities(getAuthorities(userEntity))
                .build();

        return user;
    }

    // é um metodo auxilixar para saber quais papeis o usuário tem
    private Set<GrantedAuthority> getAuthorities(Users userEntity) {
        Set<GrantedAuthority> authorities = new HashSet<>();
        if (userEntity.getRole() != null) {
            authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + userEntity.getRole()));
        }
        return authorities;
    }
}