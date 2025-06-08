package br.com.o_tab.agropec.model;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;



@Entity
@Getter @Setter
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(unique = true, length = 100, nullable = false)
    private String username;
    @Column(unique = true, length = 100, nullable = false)
    private String email;
    @Column(length = 100, nullable = false)
    private String password;

    @OneToMany(mappedBy = "user")
    private List<UserShowroom> userShowrooms;

}
