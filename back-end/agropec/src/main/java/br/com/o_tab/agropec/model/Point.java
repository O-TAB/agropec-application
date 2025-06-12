package br.com.o_tab.agropec.model;

/*
Objeto referente aos pontos que serão apresentados no mapa, mostrando onde ficam os
estandes da feira.
*/

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class Point {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long id;

    @Column(name = "Type of stand", nullable = false)
    TypeStand typeStand;

    @Column(name = "Coordenate x", nullable = false)
    double x;

    @Column(name = "Coordenate y", nullable = false)
    double y;
}
