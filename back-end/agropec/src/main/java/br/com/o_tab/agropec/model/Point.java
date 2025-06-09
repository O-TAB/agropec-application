package br.com.o_tab.agropec.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Embeddable
@Getter @Setter
public class Point {
    TypeStand typeStand;
    String cordenate;
}
