package br.com.o_tab.agropec.dto;

import br.com.o_tab.agropec.model.TypeStand;

public record PointDTO(long id, TypeStand typeStand, double x, double y) {
}
