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
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;

import java.time.Instant;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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

    public void sendNotification(Notification notification) {
        try {
            notificationRepository.save(notification);
            NotificationDTO notificationDTO = new NotificationDTO(notification.getContent());
            messagingTemplate.convertAndSend("/topic/updates", notificationDTO);
        } catch (Exception e) {
            System.err.println("Falha ao enviar a notificação: " + e.getMessage());
        }
    }


    public void newNotification(String modification) throws InterruptedException {
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
    public ResponseEntity<?> getNotifications() {
        try {
            List<Notification> allNotifications = notificationRepository.findAll();

            allNotifications.removeIf(notification -> {
                Instant expirationTime = notification.getExpiresAt();
                boolean isExpired = expirationTime.isBefore(Instant.now());
                if (isExpired) {
                    notificationRepository.delete(notification);
                }
                return isExpired;
            });

            if (allNotifications.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Não há notificações ativas");
            }

            List<NotificationDTO> activeNotificationsDTO = allNotifications.stream()
                    .map(notification -> new NotificationDTO(notification.getContent()))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(activeNotificationsDTO);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }


    @Scheduled(fixedRate = 60000)
    @Transactional
    public void checkUpcomingEvents() {
        System.out.println("--- Iniciando verificação de eventos futuros ---");

        ZonedDateTime now = ZonedDateTime.now();
        ZonedDateTime twoHoursFromNow = now.plusHours(2);
        List<Event> allEvents = eventRepository.findAll();

        System.out.println("Verificando eventos entre: " + now + " e " + twoHoursFromNow);

        for (Event event : allEvents) {
            ZonedDateTime eventDateTime = event.getDate();

            System.out.println("Analisando evento: " + event.getName() + " com data: " + eventDateTime);

            if (eventDateTime.isAfter(now) && eventDateTime.isBefore(twoHoursFromNow)) {

                String rawMessage = "O evento \"" + event.getName() + "\" está prestes a começar!";
                String finalNotificationContent = "ATUALIZAÇÃO: " + HtmlUtils.htmlEscape(rawMessage) + "!";

                if (notificationRepository.findByContent(finalNotificationContent).isEmpty()) {
                    System.out.println("✅ Criando notificação para o evento: " + event.getName());

                    Notification notification = new Notification(
                            finalNotificationContent,
                            Instant.now(),
                            Instant.now().plus(2, ChronoUnit.HOURS)
                    );
                    sendNotification(notification);
                } else {
                    System.out.println("❌ Notificação para o evento '" + event.getName() + "' já existe. Pulando.");
                }
            }
        }
        System.out.println("--- Verificação de eventos finalizada ---");
    }
}
