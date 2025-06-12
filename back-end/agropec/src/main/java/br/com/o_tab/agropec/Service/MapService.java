package br.com.o_tab.agropec.service;

import br.com.o_tab.agropec.model.Map;
import br.com.o_tab.agropec.model.Point;
import br.com.o_tab.agropec.repository.MapRepository;
import br.com.o_tab.agropec.repository.PointRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

@Service
@AllArgsConstructor
public class MapService {

    private MapRepository mapRepository;
    private PointRepository pointRepository;

    public ResponseEntity<?> uploadMap(String name, MultipartFile archive) throws IOException {
        String svgContent = new String(archive.getBytes(), StandardCharsets.UTF_8);

        Map newMap = new Map();
        newMap.setName(name);
        newMap.setSvg(svgContent);

        Map savedMap = mapRepository.save(newMap);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedMap);
    }

    public ResponseEntity<?> getMapById(String id){
        Optional<Map> foundMap = mapRepository.findById(id);

        if(foundMap.isEmpty()){
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(foundMap);
    }

    @Transactional
    public ResponseEntity<?> addPoint(String mapId, Point point){
        Optional<Map> foundMap = mapRepository.findById(mapId);

        if (foundMap.isEmpty()){
            return ResponseEntity.badRequest().body("Nenhum mapa cadastrado com esse ID");
        }
        return foundMap.map(map -> {
            point.setMap(map);
            Point savedPoint = pointRepository.save(point);

            return ResponseEntity.status(HttpStatus.CREATED).body(savedPoint);
        }).orElse(ResponseEntity.notFound().build());
    }
/*
    public ResponseEntity<?> updatePoint(){

    }

    public ResponseEntity<?> deletePoint(){

    }

 */
}
