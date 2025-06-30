package br.com.o_tab.agropec.service;

import br.com.o_tab.agropec.dto.NotificationDTO;
import br.com.o_tab.agropec.model.Notification;
import br.com.o_tab.agropec.model.NotificationMessage;
import br.com.o_tab.agropec.repository.NotificationRepository;
import lombok.AllArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
@AllArgsConstructor
public class NotificationsService {

    private SimpMessagingTemplate messagingTemplate;
    private NotificationRepository notificationRepository;

    public Notification createNotification (NotificationMessage message){
        String content = "ATUALIZAÇÃO: " + HtmlUtils.htmlEscape(message.getMessage()) + "!";
        Instant now = Instant.now();
        Instant expiresAt = now.plus(2, ChronoUnit.HOURS);

        return new Notification(content, now, expiresAt);
    }

    public void newNotificatoin(String modification) throws InterruptedException {
        try {

            NotificationMessage message = new NotificationMessage("NOTIFICAÇÃO: " + modification);
            Notification notification = createNotification(message);
            notificationRepository.save(notification);

            NotificationDTO notificationDTO = new NotificationDTO(notification.getContent());
            messagingTemplate.convertAndSend("/topic/updates", notificationDTO);
        } catch (Exception e) {
            System.err.println("Falha ao enviar a notificação: " + e.getMessage());
        }
    }
}
