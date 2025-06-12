package br.com.o_tab.agropec.repository;

import br.com.o_tab.agropec.model.Point;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PointRepository extends JpaRepository<Point, Long> {
}
