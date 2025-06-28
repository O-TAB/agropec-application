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
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class MapService {

    private MapRepository mapRepository;
    private PointRepository pointRepository;
    private NotificationsService notificationsService;

    public ResponseEntity<?> uploadMap(String name, MultipartFile archive) throws IOException, InterruptedException {
        try {
            String svgContent = new String(archive.getBytes(), StandardCharsets.UTF_8);

            Map newMap = new Map();
            newMap.setName(name);
            newMap.setSvg(svgContent);

            Map savedMap = mapRepository.save(newMap);

            notificationsService.newNotificatoin("Um novo mapa foi adicionado!");
            return ResponseEntity.status(HttpStatus.CREATED).body(savedMap);
        }catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }


    public ResponseEntity<?> getAllMaps(){
        try {
            List<Map> allMaps = mapRepository.findAll();

            if(allMaps.isEmpty()){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nenhum mapa cadastrado.");
            }

            return ResponseEntity.ok(allMaps);
        } catch (Exception e) {
            System.err.println("Erro ao buscar mapas: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erro interno do servidor ao buscar mapas: " + e.getMessage());
        }
    }


    public ResponseEntity<?> getMapById(String id){
        try {
            Optional<Map> foundMap = mapRepository.findById(id);

            if (foundMap.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(foundMap);
        }catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }


    @Transactional
    public ResponseEntity<?> addPoint(String mapId, Point point){
        Optional<Map> foundMap = mapRepository.findById(mapId);

        if (foundMap.isEmpty()){
            return ResponseEntity.badRequest().body("Nenhum mapa cadastrado para o ID informado.");
        }
        return foundMap.map(map -> {
            point.setMap(map);
            Point savedPoint = pointRepository.save(point);

            try {
                notificationsService.newNotificatoin("Um novo ponto para " + point.getName() + " foi adicionado!");
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(savedPoint);
        }).orElse(ResponseEntity.notFound().build());
    }

    public ResponseEntity<?> getAllPoints(String mapId){
        List<Point> foundPoints = pointRepository.findAllByMapId(mapId);

        if(foundPoints.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nenhum ponto cadastrado");
        }
        return ResponseEntity.ok(foundPoints);
    }


    @Transactional
    public ResponseEntity<?> updatePoint(String mapId, Point point, long pointId) {
        Optional<Map> foundMap = mapRepository.findById(mapId);
        Optional<Point> foundPoint = pointRepository.findById(pointId);

        if (foundMap.isEmpty()) {
            return ResponseEntity.badRequest().body("Nenhum mapa cadastrado para o ID informado.");
        } else if (foundPoint.isEmpty()) {
            return ResponseEntity.badRequest().body("Nenhum ponto cadastrado para o ID informado.");
        }

        Map existingMap = foundMap.get();

        Point pointToUpdate = foundPoint.get();

        if (point.getTypePoint() != null){
            pointToUpdate.setTypePoint(point.getTypePoint());
        }

        pointToUpdate.setName(point.getName());
        pointToUpdate.setY(point.getY());
        pointToUpdate.setX(point.getX());
        pointToUpdate.setMap(existingMap);

        try {
            notificationsService.newNotificatoin("O ponto de " + point.getName() + " foi atualizado!");
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }

        return ResponseEntity.ok(pointToUpdate);
    }


    public ResponseEntity<?> deletePoint(String mapId, long pointId){
        try {
            Optional<Map> foundMap = mapRepository.findById(mapId);
            Optional<Point> pointToDelete = pointRepository.findById(pointId);

            if (foundMap.isEmpty()) {
                return ResponseEntity.badRequest().body("Nenhum mapa cadastrado para o ID informado.");
            } else if (pointToDelete.isEmpty()) {
                return ResponseEntity.badRequest().body("Nenhum mapa cadastrado para o ID informado.");
            }

            return foundMap.map(map -> {
                pointRepository.delete(pointToDelete.get());
                refreshPointList(foundMap.get());
                try {
                    notificationsService.newNotificatoin("O ponto de " + pointToDelete.get().getName() + " foi deletado!");
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
                return ResponseEntity.ok().body("Mapa deletado com sucesso!");
            }).orElse(ResponseEntity.notFound().build());
        }catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }


    private void refreshPointList(Map map){
        List<Point> updatedPointList = pointRepository.findAllByMapId(map.getId());
        map.setPoints(updatedPointList);
    }
}
