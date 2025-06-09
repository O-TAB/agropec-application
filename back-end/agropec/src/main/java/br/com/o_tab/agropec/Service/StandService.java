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
       if(!standRepository.existsByName(stand.getName())){
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

    public ResponseEntity<?> updateStand(Stand stand){
        Stand standToUpdate = standRepository.findByName(stand.getName());

        standToUpdate.setName(stand.getName());
        standToUpdate.setDescription(stand.getDescription());
        standToUpdate.setDescriptionCard(stand.getDescriptionCard());
        standToUpdate.setPoint(stand.getPoint());
        standToUpdate.setImg(stand.getImg());

        return ResponseEntity.ok().body("Estande atualizado com sucesso!");

    }

}
