package br.com.o_tab.agropec.controller;

import br.com.o_tab.agropec.model.Event;
import br.com.o_tab.agropec.service.EventService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("event")
@AllArgsConstructor
public class EventController {

    private EventService eventService;

    @PostMapping("/{mapId}")
    public ResponseEntity<?> cadastrateEvent(@PathVariable String mapId, @RequestBody Event event) throws InterruptedException {
        return eventService.cadastrateEvent(event, mapId);
    }


    @GetMapping
    public ResponseEntity<?> getAllEvents(){
        return  eventService.getAllEvents();
    }


    @GetMapping("/{eventId}")
    public ResponseEntity<?> getEventByName(@PathVariable long eventId){
        return eventService.getEventById(eventId);
    }


    @PutMapping("/{eventId}")
    public ResponseEntity<?> updateEvent(@PathVariable long eventId, @RequestBody Event event) throws InterruptedException {
        return eventService.updateEvent(event, eventId);
    }


    @DeleteMapping("/{eventId}")
    public ResponseEntity<?> deleteEventByName(@PathVariable long eventId) throws InterruptedException {
        return eventService.deleteEventById(eventId);
    }

}
