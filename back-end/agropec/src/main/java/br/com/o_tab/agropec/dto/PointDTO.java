package br.com.o_tab.agropec.dto;

import br.com.o_tab.agropec.model.TypePoint;

public record PointDTO(long id, TypePoint typePoint, double x, double y) {
}
