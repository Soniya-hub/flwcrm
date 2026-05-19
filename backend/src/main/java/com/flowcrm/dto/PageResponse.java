package com.flowcrm.dto;

import lombok.Data;
import org.springframework.data.domain.Page;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

@Data
public class PageResponse<T> {
    private List<T> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private boolean last;

    public static <E, T> PageResponse<T> of(Page<E> p, Function<E, T> mapper) {
        PageResponse<T> r = new PageResponse<>();
        r.setContent(p.getContent().stream().map(mapper).collect(Collectors.toList()));
        r.setPage(p.getNumber());
        r.setSize(p.getSize());
        r.setTotalElements(p.getTotalElements());
        r.setTotalPages(p.getTotalPages());
        r.setLast(p.isLast());
        return r;
    }
}
