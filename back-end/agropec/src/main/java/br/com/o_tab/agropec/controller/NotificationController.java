package br.com.o_tab.agropec.controller;

import br.com.o_tab.agropec.service.NotificationsService;
import feign.Response;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@AllArgsConstructor
@RestController
@RequestMapping("/notifications")
public class NotificationController {

    NotificationsService notificationsService;

    @GetMapping
    public ResponseEntity<?> getNotifications(){
        return notificationsService.getNotifications();
    }
}
