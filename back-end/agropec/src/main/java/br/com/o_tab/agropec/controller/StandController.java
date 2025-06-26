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
    public ResponseEntity<List<Stand>> getAllStands(){
        return standService.getAllStands();
    }

    @GetMapping("/{name}")
    public ResponseEntity<?> getStandByName(@PathVariable String name){
        return standService.getStandByName(name);
    }

    @PutMapping("/{name}")
    public ResponseEntity<?> updateStand(@PathVariable long id, @RequestBody Stand stand) throws InterruptedException {
        return standService.updateStand(id, stand);
    }

    @DeleteMapping("/{name}")
    public ResponseEntity<?> deleteStandByName(@PathVariable String name) throws InterruptedException {
        return standService.deleteStandByName(name);
    }

}
