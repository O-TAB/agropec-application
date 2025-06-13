
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
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        
        Users userEntity = userRepository.findByUsername(username);

        if (userEntity == null) {
            throw new UsernameNotFoundException("Usuário não encontrado");
        }

        UserDetails user = org.springframework.security.core.userdetails.User
                .withUsername(userEntity.getUsername())
                .password(userEntity.getPassword())
                .authorities(getAuthorities(userEntity))
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(false)
                .build();

        return user;
        
    }

    // é um metodo auxilixar para saber quais papeis o usuário tem
    private Set<GrantedAuthority> getAuthorities(Users userEntity) {
        Set<GrantedAuthority> authorities = new HashSet<>();
        // Example: assuming Users has a getRoles() method returning a collection of roles
        if (userEntity.getRole() != null) {
            for (String role : userEntity.getRole().split(",")) {
            authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(role.trim()));
            }
        }
        return authorities;
    }

    

}