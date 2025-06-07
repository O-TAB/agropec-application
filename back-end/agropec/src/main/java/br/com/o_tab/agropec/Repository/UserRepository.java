package br.com.o_tab.agropec.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import br.com.o_tab.agropec.Models.Users;

public interface UserRepository extends JpaRepository<Users, String>{

    Users findByUsername(String username);
    Users findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    
}
