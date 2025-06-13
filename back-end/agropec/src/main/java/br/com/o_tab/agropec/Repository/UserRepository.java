package br.com.o_tab.agropec.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import br.com.o_tab.agropec.model.Users;

public interface UserRepository extends JpaRepository<Users, String>{

    Users findByUsername(String username);
    Users findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    
}
