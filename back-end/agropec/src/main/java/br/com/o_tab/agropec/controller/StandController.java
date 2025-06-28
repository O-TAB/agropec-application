package br.com.o_tab.agropec.controller;

import br.com.o_tab.agropec.model.Stand;
import br.com.o_tab.agropec.service.StandService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("stands")
@AllArgsConstructor
public class StandController {

    StandService standService;


    @PostMapping("/{mapId}")
    public ResponseEntity<?> cadastrateStand(@PathVariable String mapId, @RequestBody Stand stand) throws InterruptedException {
        return standService.cadastrateStand(stand, mapId);
    }

    @GetMapping
    public ResponseEntity<?> getAllStands(){
        return standService.getAllStands();
    }

    @GetMapping("/{standId}")
    public ResponseEntity<?> getStandById(@PathVariable long standId){
        return standService.getStandById(standId);
    }

    @PutMapping("/{standId}")
    public ResponseEntity<?> updateStand(@PathVariable long standId, @RequestBody Stand stand) throws InterruptedException {
        return standService.updateStand(standId, stand);
    }

    @DeleteMapping("/{standId}")
    public ResponseEntity<?> deleteStandById(@PathVariable long standId) throws InterruptedException {
        return standService.deleteStandById(standId);
    }

}
