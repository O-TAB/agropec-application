package br.com.o_tab.agropec.model;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;


@Entity
public class Showroom {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    // outros campos...

    
    
}
