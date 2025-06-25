package br.com.o_tab.agropec.service;

import br.com.o_tab.agropec.model.Map;
import br.com.o_tab.agropec.model.Point;
import br.com.o_tab.agropec.model.Stand;
import br.com.o_tab.agropec.repository.MapRepository;
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
    private MapService mapService;

    public ResponseEntity<?> cadastrateStand(Stand stand, String mapId){
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
           // Força criação de novo Point se ID for 0 ou nulo
           if(point.getId() == null || point.getId() == 0) {
               point.setId(null); // Remove ID para forçar nova entidade
           }
           point.setMap(map);
           stand.setPoint(point);
           standRepository.save(stand);

           return ResponseEntity.status(HttpStatus.CREATED).body("Estande cadastrado com sucesso!");
       } else {
           return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Os dados do ponto do estande não foram devidamente informados.");
       }
    }

    public ResponseEntity<List<Stand>> getAllStands(){
        List<Stand> allStands = standRepository.findAll();

        if(allStands.isEmpty()){
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(allStands);
    }

    public ResponseEntity<?> getStandByName(String name){
        Optional<Stand> foundStand = standRepository.findByName(name);

        if(foundStand.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nenhum estande encontrado com o nome informado.");
        }

        return ResponseEntity.ok(foundStand.get());
    }

    public ResponseEntity<?> updateStand(String name, Stand stand){
        Optional<Stand> foundStand = standRepository.findByName(name);

        if(foundStand.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nenhum estande cadastrado com o nome informado.");
        }

        Stand standToUpdate = foundStand.get();
        standToUpdate.setName(stand.getName());
        standToUpdate.setDescription(stand.getDescription());
        standToUpdate.setDescriptionCard(stand.getDescriptionCard());
        standToUpdate.setPoint(stand.getPoint());
        standToUpdate.setImg(stand.getImg());
        Stand updatedStand = standRepository.save(standToUpdate);

        return ResponseEntity.ok(updatedStand);

    }

    @Transactional
    public ResponseEntity<?> deleteStandByName(String name){
        Optional<Stand> foundStand = standRepository.findByName(name);

        if(foundStand.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nenhum estande cadastrado para o nome informado.");
        }

        Stand standToDelete = foundStand.get();
        standRepository.deleteById(standToDelete.getId());

        return ResponseEntity.ok().body("Estande deletado com sucesso");
    }

}
