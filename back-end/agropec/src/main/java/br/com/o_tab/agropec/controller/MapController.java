package br.com.o_tab.agropec.controller;

import br.com.o_tab.agropec.model.Map;
import br.com.o_tab.agropec.model.Point;
import br.com.o_tab.agropec.service.MapService;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("map")
@AllArgsConstructor
public class MapController {

    private MapService mapService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadMap(@RequestParam("name") String name, @RequestParam("archive") MultipartFile Archive)
            throws IOException, InterruptedException {
        return mapService.uploadMap(name, Archive);
    }


    @GetMapping()
    public ResponseEntity<?> getAllMaps(){
        return mapService.getAllMaps();
    }
    @PutMapping("/{mapId}")
        public ResponseEntity<?> updateMap(@PathVariable String mapId, @RequestBody Map mapUpdate) {
        return mapService.updateMap(mapId, mapUpdate);
    }


    @GetMapping("/{id}")
    public ResponseEntity<?> getMapById(@PathVariable String id){
        return mapService.getMapById(id);
    }

    @GetMapping("/{mapId}/point")
    public ResponseEntity<?> getAllPoints(@PathVariable String mapId){
        return mapService.getAllPoints(mapId);
    }

    @PostMapping("/{mapId}/point")
    public ResponseEntity<?> addPoint(@PathVariable String mapId, @RequestBody Point point){
        return mapService.addPoint(mapId, point);
    }

    @PutMapping("/{mapId}/point/{pointId}")
    public ResponseEntity<?> updatePoint(@PathVariable String mapId, @RequestBody Point point, @PathVariable long pointId){
        return mapService.updatePoint(mapId, point, pointId);
    }

    @DeleteMapping("/{mapId}/point/{pointId}")
    public ResponseEntity<?> deletePoint(@PathVariable String mapId, @PathVariable long pointId){
        return mapService.deletePoint(mapId, pointId);
    }

}
