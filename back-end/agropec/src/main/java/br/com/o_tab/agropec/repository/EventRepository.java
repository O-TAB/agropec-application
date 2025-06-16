package br.com.o_tab.agropec.repository;

import br.com.o_tab.agropec.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, Long> {
    public Optional<Event> findByName(String name);
}
