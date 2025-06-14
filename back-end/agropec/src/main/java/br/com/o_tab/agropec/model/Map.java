package br.com.o_tab.agropec.model;

/*
Classe reposnsável por representar o objeto mapa
 */

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;


@Entity(name = "tab_maps")
@Getter @Setter
public class Map {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String name;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String svg;

    @OneToMany(mappedBy = "map", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Point> points = new ArrayList<>();

    public void removePoint(Point point){
        this.points.remove(point);
    }
}
