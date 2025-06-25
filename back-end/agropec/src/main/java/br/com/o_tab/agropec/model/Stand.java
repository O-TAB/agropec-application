package br.com.o_tab.agropec.model;

/*
* Classe responsável por representar as informações contidas nos estandes
* presentes na Agropec.
* Cada estande vai conter informações como:
* Nome, descrição, descrição do card, imagem,
* point(local no qual o estande será representado no mapa principal e icone).
*/

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity (name = "tab_estandes")
@Getter @Setter
public class Stand {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String descriptionCard;

    @Column(nullable = false)
    private String img;

    @OneToOne(cascade = CascadeType.MERGE)
    private Point point;

}
