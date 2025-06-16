package br.com.o_tab.agropec.model;

/*
Objeto referente aos pontos que serão apresentados no mapa, mostrando onde ficam os
estandes da feira.
*/

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity(name = "tab_points")
@Getter @Setter
public class Point {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "Point type", nullable = false)
    private TypePoint typePoint;

    @Column(name = "Coordenate x", nullable = false)
    private double x;

    @Column(name = "Coordenate y", nullable = false)
    private double y;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "map_id")
    @JsonIgnore
    private Map map;
}
