package br.com.o_tab.agropec.service;

import br.com.o_tab.agropec.model.Map;
import br.com.o_tab.agropec.model.Point;
import br.com.o_tab.agropec.model.Stand;
import br.com.o_tab.agropec.repository.MapRepository;
import br.com.o_tab.agropec.repository.PointRepository;
import br.com.o_tab.agropec.repository.StandRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class StandService {

    private StandRepository standRepository;
    private MapRepository mapRepository;
    private NotificationsService notificationsService;
    private PointRepository pointRepository;

    @Transactional
    public ResponseEntity<?> cadastrateStand(Stand stand, String mapId) throws InterruptedException {
       if(standRepository.existsByName(stand.getName())){
           return ResponseEntity.badRequest().body("Já há um estande registrado com o mesmo nome, tente outro nome.");
       }

       Optional<Map> optionalMap = mapRepository.findById(mapId);
       if(optionalMap.isEmpty()){
           return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nenhum mapa encontrado para o ID informado.");
       }
       Map map = optionalMap.get();

       if(stand.getPoint() != null){
           Point point = stand.getPoint();
           point.setMap(map);
           stand.setPoint(point);
           standRepository.save(stand);
           notificationsService.newNotification("Um novo estande de nome" + stand.getName() + "foi adicionado!");

           return ResponseEntity.status(HttpStatus.CREATED).body("Estande cadastrado com sucesso!");
       } else {
           return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Os dados do ponto do estande não foram devidamente informados.");
       }
    }

    public ResponseEntity<?> getAllStands(){
        try {
            List<Stand> allStands = standRepository.findAll();

            if (allStands.isEmpty()) {
                return ResponseEntity.noContent().build();
            }

            return ResponseEntity.ok(allStands);
        }catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    public ResponseEntity<?> getStandById(long standId){
        try {
            Optional<Stand> foundStand = standRepository.findById(standId);

            if (foundStand.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nenhum estande encontrado com o nome informado.");
            }

            return ResponseEntity.ok(foundStand.get());
        }catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @Transactional
    public ResponseEntity<?> updateStand(long id, Stand stand) throws InterruptedException {
        try {
            Optional<Stand> foundStand = standRepository.findById(id);

            if (foundStand.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nenhum estande cadastrado com o nome informado.");
            }

            Stand standToUpdate = foundStand.get();
            standToUpdate.setName(stand.getName());
            standToUpdate.setDescription(stand.getDescription());
            standToUpdate.setDescriptionCard(stand.getDescriptionCard());
            standToUpdate.setImg(stand.getImg());

            if(stand.getPoint() != null && stand.getPoint().getId() != 0){
                Optional<Point> pointOpt = pointRepository.findById(stand.getPoint().getId());
                if (pointOpt.isPresent()) {
                    Point pointToUpdate = pointOpt.get();
                    // Atualize os campos do ponto conforme necessário
                    pointToUpdate.setX(stand.getPoint().getX());
                    pointToUpdate.setY(stand.getPoint().getY());
                    pointToUpdate.setTypePoint(stand.getPoint().getTypePoint());
                    pointToUpdate.setMap(pointToUpdate.getMap()); // mantém o mesmo mapa ou atualize se necessário

                    pointRepository.save(pointToUpdate);
                    standToUpdate.setPoint(pointToUpdate);
                }
            }

            Stand updatedStand = standRepository.save(standToUpdate);

            notificationsService.newNotification("O Estande " + standToUpdate.getName() + " foi atualizado!");
            return ResponseEntity.ok(updatedStand);
        }catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @Transactional
    public ResponseEntity<?> deleteStandById(long standId) throws InterruptedException {
        try {
            Optional<Stand> foundStand = standRepository.findById(standId);

            if (foundStand.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nenhum estande cadastrado para o nome informado.");
            }

            Stand standToDelete = foundStand.get();
            standRepository.deleteById(standToDelete.getId());

            notificationsService.newNotification("O Estande " + standToDelete.getName() + " foi deletado!");
            return ResponseEntity.ok().body("Estande deletado com sucesso");
        }catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

}
