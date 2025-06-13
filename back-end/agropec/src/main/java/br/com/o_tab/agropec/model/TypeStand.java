package br.com.o_tab.agropec.model;

/*
Enum referente ao tipo de estande que derá representado no icone do mapa.
 */

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum TypeStand {

    RESTAURANTE("Restaurante", "src/main/resources/icons/restauranteIcon.png"),
    ESPACOSHOW("Espaço de Shows", "src/main/resources/icons/showIcon.png"),
    ESPACOPALESTRA("Espaço de Palestras", "src/main/resources/icons/palestraIcon.png");

    private final String typeName;
    private final String pathIcon;
}