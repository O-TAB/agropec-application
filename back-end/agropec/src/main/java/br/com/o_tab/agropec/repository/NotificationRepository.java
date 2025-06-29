package br.com.o_tab.agropec.repository;

import br.com.o_tab.agropec.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
}
