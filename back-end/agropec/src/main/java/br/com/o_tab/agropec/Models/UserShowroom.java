package br.com.o_tab.agropec.Models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class UserShowroom {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    private Users user;

    @ManyToOne
    private Showroom showroom;

    @Column(nullable = false)
    private String role; // papel do usuário nesse showroom
    
}
