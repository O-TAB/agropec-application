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

    @PostMapping
    public ResponseEntity<?> CadastrateStand(@RequestBody Stand stand){
        return standService.cadastrateStand(stand);
    }

    @GetMapping
    public ResponseEntity<List<Stand>> GetAllStands(){
        return standService.getAllStands();
    }

    @PutMapping
    public ResponseEntity<?> UpdateStand(@PathVariable String name, @RequestBody Stand stand){
        return standService.updateStand(stand);
    }

}
