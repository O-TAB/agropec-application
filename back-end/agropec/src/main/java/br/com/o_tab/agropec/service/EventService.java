package br.com.o_tab.agropec.service;

import br.com.o_tab.agropec.model.Event;
import br.com.o_tab.agropec.model.Map;
import br.com.o_tab.agropec.repository.EventRepository;
import br.com.o_tab.agropec.repository.MapRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class EventService {

    private EventRepository eventRepository;
    private MapRepository mapRepository;

    public ResponseEntity<?> cadastrateEvent(Event event, String mapId){
        Optional<Map> foundMap = mapRepository.findById(mapId);
        if(foundMap.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nenhum mapa encontrado para o ID informado.");
        }
        Map map = foundMap.get();

        if(event.getPoint() != null){
            event.getPoint().setMap(map);
            eventRepository.save(event);

            return ResponseEntity.ok().body("Evento cadastrado com sucesso!");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Os dados do ponto do evento não foram devidamente informados");
        }
    }

    public ResponseEntity<?> getAllEvents(){
        try {
            List<Event> foundEvents = eventRepository.findAll();
            if(foundEvents.isEmpty()){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nenhum evento cadastrado.");
            } else {
                return ResponseEntity.ok(foundEvents);
            }
        } catch (Exception e) {
            System.err.println("Erro ao buscar eventos: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erro interno do servidor ao buscar eventos: " + e.getMessage());
        }
    }

    public ResponseEntity<?> getEventByName(String name){
        Optional<Event> foundEvent = eventRepository.findByName(name);
        if(foundEvent.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nenhum evento cadastrado para o nome informado");
        } else {
            return ResponseEntity.ok(foundEvent.get());
        }
    }

    public ResponseEntity<?> updateEvent(Event event, long id){
        Optional<Event> foundEvent = eventRepository.findById(id);
        if(foundEvent.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nenhum evento cadastrado para o nome informado.");
        }

        Event eventToUpdate = foundEvent.get();
        eventToUpdate.setName(event.getName());
        eventToUpdate.setDescription(event.getDescription());
        eventToUpdate.setDescriptionCard(event.getDescriptionCard());
        eventToUpdate.setImg(event.getImg());
        eventToUpdate.setDate(event.getDate());
        eventToUpdate.setPoint(event.getPoint());
        Event updatedEvent = eventRepository.save(eventToUpdate);

        return ResponseEntity.ok(updatedEvent);
    }


    public ResponseEntity<?> deleteEventByName(String name){
        Optional<Event> foundEvent = eventRepository.findByName(name);
        if(foundEvent.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nenhum evento cadastrado para o nome informado.");
        }

        Event eventToDelete = foundEvent.get();
        eventRepository.deleteById(eventToDelete.getId());

        return ResponseEntity.ok().body("Evento deletado com sucesso!");
    }
}
