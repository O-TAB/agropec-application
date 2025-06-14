package br.com.o_tab.agropec.controller;

import br.com.o_tab.agropec.model.Point;
import br.com.o_tab.agropec.service.MapService;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/map")
@AllArgsConstructor
public class MapController {

    private MapService mapService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadMap(@RequestParam("name") String name, @RequestParam("archive") MultipartFile Archive)
    throws IOException {
        return mapService.uploadMap(name, Archive);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMapById(@PathVariable String id){
        return mapService.getMapById(id);
    }

    @PostMapping("/{mapId}/point")
    public ResponseEntity<?> addPoint(@PathVariable String mapId, @RequestBody Point point){
        return mapService.addPoint(mapId, point);
    }

    @PostMapping("/{mapId}/point/{pointId}")
    public ResponseEntity<?> updatePoint(@PathVariable String mapId, @RequestBody Point point, @PathVariable long pointId){
        return mapService.updatePoint(mapId, point, pointId);
    }

    @DeleteMapping("/{mapId}/point/{pointId}")
    public ResponseEntity<?> deletePoint(@PathVariable String mapId, @PathVariable long pointId){
        return mapService.deletePoint(mapId, pointId);
    }

}
