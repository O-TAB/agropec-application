package br.com.o_tab.agropec.repository;

import br.com.o_tab.agropec.model.Stand;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StandRepository extends JpaRepository <Stand, String> {
    public boolean existsByName(String name);
    public Optional<Stand> findByName(String name);
    public void deleteById(long id);
}
