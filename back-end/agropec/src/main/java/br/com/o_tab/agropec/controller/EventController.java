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


    @GetMapping("/{name}")
    public ResponseEntity<?> getEventByName(@PathVariable String name){
        return eventService.getEventByName(name);
    }


    @PutMapping("/{name}")
    public ResponseEntity<?> updateEvent(@PathVariable long id, @RequestBody Event event) throws InterruptedException {
        return eventService.updateEvent(event, id);
    }


    @DeleteMapping("/{name}")
    public ResponseEntity<?> deleteEventByName(@PathVariable String name) throws InterruptedException {
        return eventService.deleteEventByName(name);
    }

}
