package com.flowcrm.controller;

import com.flowcrm.dto.LeadDto;
import com.flowcrm.dto.PageResponse;
import com.flowcrm.service.LeadService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/leads")
@RequiredArgsConstructor
public class LeadController {

    private final LeadService leadService;

    @GetMapping
    public ResponseEntity<PageResponse<LeadDto.Response>> getAll(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(leadService.getAll(q, status, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeadDto.Response> getById(@PathVariable Long id) {
        return ResponseEntity.ok(leadService.getById(id));
    }

    @PostMapping
    public ResponseEntity<LeadDto.Response> create(@Valid @RequestBody LeadDto.Request req) {
        return ResponseEntity.ok(leadService.create(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LeadDto.Response> update(@PathVariable Long id, @Valid @RequestBody LeadDto.Request req) {
        return ResponseEntity.ok(leadService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        leadService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
