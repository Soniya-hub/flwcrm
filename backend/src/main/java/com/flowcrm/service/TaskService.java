package com.flowcrm.service;

import com.flowcrm.dto.PageResponse;
import com.flowcrm.dto.TaskDto;
import com.flowcrm.entity.Task;
import com.flowcrm.entity.User;
import com.flowcrm.exception.ResourceNotFoundException;
import com.flowcrm.repository.TaskRepository;
import com.flowcrm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public PageResponse<TaskDto.Response> getAll(String q, String status, String priority, Pageable pageable) {
        Page<Task> page;
        boolean hasQuery = q != null && !q.isBlank();
        boolean hasStatus = status != null && !status.isBlank();
        boolean hasPriority = priority != null && !priority.isBlank();

        if (hasQuery && hasStatus) {
            page = taskRepository.searchByStatus(q, Task.Status.valueOf(status), pageable);
        } else if (hasQuery) {
            page = taskRepository.search(q, pageable);
        } else if (hasStatus && hasPriority) {
            page = taskRepository.findByStatusAndPriority(
                Task.Status.valueOf(status), Task.Priority.valueOf(priority), pageable);
        } else if (hasStatus) {
            page = taskRepository.findByStatus(Task.Status.valueOf(status), pageable);
        } else if (hasPriority) {
            page = taskRepository.findByPriority(Task.Priority.valueOf(priority), pageable);
        } else {
            page = taskRepository.findAll(pageable);
        }
        return PageResponse.of(page, this::toResponse);
    }

    public TaskDto.Response getById(Long id) {
        return toResponse(taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id)));
    }

    public TaskDto.Response create(TaskDto.Request req) {
        return toResponse(taskRepository.save(toEntity(req, new Task())));
    }

    public TaskDto.Response update(Long id, TaskDto.Request req) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        return toResponse(taskRepository.save(toEntity(req, task)));
    }

    public void delete(Long id) {
        if (!taskRepository.existsById(id)) throw new ResourceNotFoundException("Task not found with id: " + id);
        taskRepository.deleteById(id);
    }

    private Task toEntity(TaskDto.Request req, Task task) {
        task.setTitle(req.getTitle());
        task.setDescription(req.getDescription());
        task.setDueDate(req.getDueDate());
        if (req.getPriority() != null) task.setPriority(Task.Priority.valueOf(req.getPriority()));
        if (req.getStatus() != null) task.setStatus(Task.Status.valueOf(req.getStatus()));
        if (req.getAssignedToId() != null) {
            User user = userRepository.findById(req.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            task.setAssignedTo(user);
        }
        return task;
    }

    private TaskDto.Response toResponse(Task task) {
        TaskDto.Response r = new TaskDto.Response();
        r.setId(task.getId());
        r.setTitle(task.getTitle());
        r.setDescription(task.getDescription());
        r.setPriority(task.getPriority().name());
        r.setStatus(task.getStatus().name());
        r.setDueDate(task.getDueDate());
        r.setCreatedAt(task.getCreatedAt());
        if (task.getAssignedTo() != null) {
            r.setAssignedToId(task.getAssignedTo().getId());
            r.setAssignedToName(task.getAssignedTo().getName());
        }
        return r;
    }
}
