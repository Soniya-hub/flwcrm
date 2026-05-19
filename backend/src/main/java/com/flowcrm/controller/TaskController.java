package com.flowcrm.controller;

import com.flowcrm.dto.PageResponse;
import com.flowcrm.dto.TaskDto;
import com.flowcrm.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<PageResponse<TaskDto.Response>> getAll(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(taskService.getAll(q, status, priority, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskDto.Response> getById(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getById(id));
    }

    @PostMapping
    public ResponseEntity<TaskDto.Response> create(@Valid @RequestBody TaskDto.Request req) {
        return ResponseEntity.ok(taskService.create(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskDto.Response> update(@PathVariable Long id, @Valid @RequestBody TaskDto.Request req) {
        return ResponseEntity.ok(taskService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        taskService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
