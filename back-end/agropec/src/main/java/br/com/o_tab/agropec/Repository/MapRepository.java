package br.com.o_tab.agropec.repository;

import br.com.o_tab.agropec.model.Map;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MapRepository extends JpaRepository<Map, String> {
    public Optional<Map> findById(String id);
}
