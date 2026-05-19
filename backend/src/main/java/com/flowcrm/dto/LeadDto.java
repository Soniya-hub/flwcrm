package com.flowcrm.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDateTime;

public class LeadDto {

    @Data
    public static class Request {
        @NotBlank private String name;
        @NotBlank @Email private String email;
        private String phone;
        @NotBlank private String company;
        private String notes;
        private String status;
        private Long assignedToId;
    }

    @Data
    public static class Response {
        private Long id;
        private String name;
        private String email;
        private String phone;
        private String company;
        private String notes;
        private String status;
        private String assignedToName;
        private Long assignedToId;
        private LocalDateTime createdAt;
    }
}
