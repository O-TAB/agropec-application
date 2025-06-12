package br.com.o_tab.agropec.service;

import br.com.o_tab.agropec.model.Stand;
import br.com.o_tab.agropec.repository.StandRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class StandService {

    StandRepository standRepository;

    public ResponseEntity<?> cadastrateStand(Stand stand){
       if(standRepository.existsByName(stand.getName())){
           return ResponseEntity.badRequest().body("Já há um estande registrado com o mesmo nome, tente outro nome.");
       } else {
           standRepository.save(stand);

           return ResponseEntity.status(HttpStatus.CREATED).body("Estande cadastrado com sucesso!");
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
        Stand foundStand = standRepository.findByName(name);

        if(foundStand == null){
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(foundStand);
    }

    public ResponseEntity<?> updateStand(String name, Stand stand){
        Stand standToUpdate = standRepository.findByName(name);

        if(standToUpdate == null){
            return ResponseEntity.notFound().build();
        }

        standToUpdate.setName(stand.getName());
        standToUpdate.setDescription(stand.getDescription());
        standToUpdate.setDescriptionCard(stand.getDescriptionCard());
        standToUpdate.setPoint(stand.getPoint());
        standToUpdate.setImg(stand.getImg());

        Stand updatedStand = standRepository.save(standToUpdate);

        return ResponseEntity.ok(updatedStand);

    }

    public ResponseEntity<?> deleteStandByName(String name){
        Stand standToDelete = standRepository.findByName(name);

        if(standToDelete == null){
            return ResponseEntity.notFound().build();
        }

        standRepository.deleteById(standToDelete.getId());

        return ResponseEntity.ok().body("Estande deletado com sucesso");
    }

}
