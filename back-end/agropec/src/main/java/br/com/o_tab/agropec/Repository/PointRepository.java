package br.com.o_tab.agropec.repository;

import br.com.o_tab.agropec.model.Point;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PointRepository extends JpaRepository<Point, Long> {
    public List<Point> findAllByMapId(String mapId);
}
