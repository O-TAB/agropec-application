package br.com.o_tab.agropec.repository;

import br.com.o_tab.agropec.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    public Optional<Notification> findByContent(String content);
}
