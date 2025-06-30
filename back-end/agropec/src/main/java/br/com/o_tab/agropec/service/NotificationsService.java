package br.com.o_tab.agropec.service;

import br.com.o_tab.agropec.dto.NotificationDTO;
import br.com.o_tab.agropec.model.Event;
import br.com.o_tab.agropec.model.Notification;
import br.com.o_tab.agropec.model.NotificationMessage;
import br.com.o_tab.agropec.repository.EventRepository;
import br.com.o_tab.agropec.repository.NotificationRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;

import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class NotificationsService {

    private SimpMessagingTemplate messagingTemplate;
    private NotificationRepository notificationRepository;
    private EventRepository eventRepository;

    public Notification createNotification (NotificationMessage message){
        String content = "ATUALIZAÇÃO: " + HtmlUtils.htmlEscape(message.getMessage()) + "!";
        Instant now = Instant.now();
        Instant expiresAt = now.plus(2, ChronoUnit.HOURS);

        return new Notification(content, now, expiresAt);
    }

    public void newNotificatoin(String modification) throws InterruptedException {
        try {

            NotificationMessage message = new NotificationMessage(modification);
            Notification notification = createNotification(message);
            notificationRepository.save(notification);

            NotificationDTO notificationDTO = new NotificationDTO(notification.getContent());
            messagingTemplate.convertAndSend("/topic/updates", notificationDTO);
        } catch (Exception e) {
            System.err.println("Falha ao enviar a notificação: " + e.getMessage());
        }
    }


    @Transactional
    public ResponseEntity<?> getNotifications(){
        try {
            List<Notification> allNotifications = notificationRepository.findAll();
            List<Event> allEvents = eventRepository.findAll();
            List<NotificationDTO> activeNotifications = new ArrayList<>();

            if(allNotifications.isEmpty()){
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Não há notificações ativas");
            }

            for(Notification notification : allNotifications){
                Instant expirationTime = notification.getExpiresAt();
                if(expirationTime.isBefore(Instant.now()) || expirationTime.equals(Instant.now())){
                    notificationRepository.delete(notification);
                } else {
                    activeNotifications.add(new NotificationDTO(notification.getContent()));
                }
            }

            for(Event event : allEvents){
                ZonedDateTime dateTime = event.getDate();
                if(dateTime.equals(ZonedDateTime.now()) || dateTime.isAfter(dateTime.minus(2, ChronoUnit.HOURS))){
                    newNotificatoin("O evento \"" + event.getName() + "\" está prestes a começar!");
                    activeNotifications.add(new NotificationDTO("O evento \"" + event.getName() + "\" está prestes a começar!"));
                }
            }

            return ResponseEntity.ok(activeNotifications);

        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
