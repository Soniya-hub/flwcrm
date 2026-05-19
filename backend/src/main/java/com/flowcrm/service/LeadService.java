package com.flowcrm.service;

import com.flowcrm.dto.LeadDto;
import com.flowcrm.dto.PageResponse;
import com.flowcrm.entity.Lead;
import com.flowcrm.entity.User;
import com.flowcrm.exception.ResourceNotFoundException;
import com.flowcrm.repository.LeadRepository;
import com.flowcrm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LeadService {

    private final LeadRepository leadRepository;
    private final UserRepository userRepository;

    public PageResponse<LeadDto.Response> getAll(String q, String status, Pageable pageable) {
        Page<Lead> page;
        boolean hasQuery = q != null && !q.isBlank();
        boolean hasStatus = status != null && !status.isBlank();

        if (hasQuery && hasStatus) {
            page = leadRepository.searchByStatus(q, Lead.Status.valueOf(status), pageable);
        } else if (hasQuery) {
            page = leadRepository.search(q, pageable);
        } else if (hasStatus) {
            page = leadRepository.findByStatus(Lead.Status.valueOf(status), pageable);
        } else {
            page = leadRepository.findAll(pageable);
        }
        return PageResponse.of(page, this::toResponse);
    }

    public LeadDto.Response getById(Long id) {
        return toResponse(leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with id: " + id)));
    }

    public LeadDto.Response create(LeadDto.Request req) {
        return toResponse(leadRepository.save(toEntity(req, new Lead())));
    }

    public LeadDto.Response update(Long id, LeadDto.Request req) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with id: " + id));
        return toResponse(leadRepository.save(toEntity(req, lead)));
    }

    public void delete(Long id) {
        if (!leadRepository.existsById(id)) throw new ResourceNotFoundException("Lead not found with id: " + id);
        leadRepository.deleteById(id);
    }

    private Lead toEntity(LeadDto.Request req, Lead lead) {
        lead.setName(req.getName());
        lead.setEmail(req.getEmail());
        lead.setPhone(req.getPhone());
        lead.setCompany(req.getCompany());
        lead.setNotes(req.getNotes());
        if (req.getStatus() != null) lead.setStatus(Lead.Status.valueOf(req.getStatus()));
        if (req.getAssignedToId() != null) {
            User user = userRepository.findById(req.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            lead.setAssignedTo(user);
        }
        return lead;
    }

    private LeadDto.Response toResponse(Lead lead) {
        LeadDto.Response r = new LeadDto.Response();
        r.setId(lead.getId());
        r.setName(lead.getName());
        r.setEmail(lead.getEmail());
        r.setPhone(lead.getPhone());
        r.setCompany(lead.getCompany());
        r.setNotes(lead.getNotes());
        r.setStatus(lead.getStatus().name());
        r.setCreatedAt(lead.getCreatedAt());
        if (lead.getAssignedTo() != null) {
            r.setAssignedToId(lead.getAssignedTo().getId());
            r.setAssignedToName(lead.getAssignedTo().getName());
        }
        return r;
    }
}
