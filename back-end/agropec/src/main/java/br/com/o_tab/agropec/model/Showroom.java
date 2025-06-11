package br.com.o_tab.agropec.model;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class Showroom {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    // outros campos...

}
