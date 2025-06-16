package br.com.o_tab.agropec.model;

/*
Enum referente ao tipo de estande que derá representado no icone do mapa.
 */

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum TypePoint {

    RESTAURANTE("Restaurante", "restaurante.png"),
    ESPACOSHOW("Espaço de Shows", "shows.png"),
    ESPACOPALESTRA("Espaço de Palestras", "palestras.png"),
    BANHEIROS("Banheiros", "banheiro.png"),
    ESPACORACKATON("Espaço dos Rackatons", "rackatons.png"),
    EMPRESA("Estande de esposição de uma empresa", "empresas.png"),
    EMERGENCIA("Posto de atendimento médico", "emergencia.png"),
    PARQUEDIVERSAO("Parque de diversões", "parque.png");

    private final String typeName;
    private final String pathIcon;
}