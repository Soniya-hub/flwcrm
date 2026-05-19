package com.flowcrm.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class TaskDto {

    @Data
    public static class Request {
        @NotBlank private String title;
        private String description;
        private String priority;
        private String status;
        @NotNull private LocalDate dueDate;
        private Long assignedToId;
    }

    @Data
    public static class Response {
        private Long id;
        private String title;
        private String description;
        private String priority;
        private String status;
        private LocalDate dueDate;
        private String assignedToName;
        private Long assignedToId;
        private LocalDateTime createdAt;
    }
}
