package br.com.o_tab.agropec.service;

import br.com.o_tab.agropec.model.Event;
import br.com.o_tab.agropec.model.Map;
import br.com.o_tab.agropec.model.Point;
import br.com.o_tab.agropec.repository.EventRepository;
import br.com.o_tab.agropec.repository.MapRepository;
import br.com.o_tab.agropec.repository.PointRepository;
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
    private NotificationsService notificationsService;
    private PointRepository pointRepository;

    public ResponseEntity<?> cadastrateEvent(Event event, String mapId) throws InterruptedException {
        Optional<Map> foundMap = mapRepository.findById(mapId);
        if(foundMap.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nenhum mapa encontrado para o ID informado.");
        }
        Map map = foundMap.get();

        if(event.getPoint() != null){
            event.getPoint().setMap(map);
            eventRepository.save(event);

            notificationsService.newNotification("O evento " + event.getName() + " foi adicionado!");
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

    public ResponseEntity<?> getEventById(long eventId){
        Optional<Event> foundEvent = eventRepository.findById(eventId);
        if(foundEvent.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nenhum evento cadastrado para o nome informado");
        } else {
            return ResponseEntity.ok(foundEvent.get());
        }
    }

    public ResponseEntity<?> updateEvent(Event event, long eventId) throws InterruptedException {
        try{
            Optional<Event> foundEvent = eventRepository.findById(eventId);
            if(foundEvent.isEmpty()){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nenhum evento cadastrado para o nome informado.");
            }

            Event eventToUpdate = foundEvent.get();
            eventToUpdate.setName(event.getName());
            eventToUpdate.setDescription(event.getDescription());
            eventToUpdate.setDescriptionCard(event.getDescriptionCard());
            eventToUpdate.setImg(event.getImg());
            eventToUpdate.setDate(event.getDate());

             if(event.getPoint() != null && event.getPoint().getId() != 0){
                Optional<Point> pointOpt = pointRepository.findById(event.getPoint().getId());
                if (pointOpt.isPresent()) {
                    Point pointToUpdate = pointOpt.get();
                    pointToUpdate.setX(event.getPoint().getX());
                    pointToUpdate.setY(event.getPoint().getY());
                    pointToUpdate.setTypePoint(event.getPoint().getTypePoint());
                    pointToUpdate.setMap(pointToUpdate.getMap());

                    pointRepository.save(pointToUpdate);
                    eventToUpdate.setPoint(pointToUpdate);
                }
            }

            Event updatedEvent = eventRepository.save(eventToUpdate);

            notificationsService.newNotification("O evento " + eventToUpdate.getName() + " foi atualizado!");
            return ResponseEntity.ok(updatedEvent);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }


    public ResponseEntity<?> deleteEventById(long eventId) throws InterruptedException {
        Optional<Event> foundEvent = eventRepository.findById(eventId);
        if(foundEvent.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nenhum evento cadastrado para o nome informado.");
        }

        Event eventToDelete = foundEvent.get();
        eventRepository.deleteById(eventToDelete.getId());

        notificationsService.newNotification("O evento " + eventToDelete.getName() + " foi deletado!");
        return ResponseEntity.ok().body("Evento deletado com sucesso!");
    }
}
