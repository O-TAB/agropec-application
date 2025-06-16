package br.com.o_tab.agropec.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.ZonedDateTime;

@Entity(name = "tab_events")
@Getter @Setter
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String descriptionCard;

    @Column(nullable = false)
    private String img;

    @Column(nullable = false)
    private ZonedDateTime date;

    @ManyToOne(cascade = CascadeType.ALL)
    private Point point;
}
