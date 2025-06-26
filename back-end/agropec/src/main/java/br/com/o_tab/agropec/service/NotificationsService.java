package br.com.o_tab.agropec.service;

import br.com.o_tab.agropec.model.Notification;
import br.com.o_tab.agropec.model.NotificationMessage;
import lombok.AllArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;

@Service
@AllArgsConstructor
public class NotificationsService {

    private SimpMessagingTemplate messagingTemplate;

    public Notification createNotification (NotificationMessage message){
        return new Notification("ATUALIZAÇÃO: " + HtmlUtils.htmlEscape(message.getMessage()) + "!");
    }

    public void newNotificatoin(String modification) throws InterruptedException {

        NotificationMessage message = new NotificationMessage("NOTIFICAÇÃO: " + modification);
        Notification notification = createNotification(message);

        messagingTemplate.convertAndSend("/topic/greetings", notification);
    }
}
