package com.flowcrm.repository;

import com.flowcrm.entity.Lead;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LeadRepository extends JpaRepository<Lead, Long> {

    Page<Lead> findByStatus(Lead.Status status, Pageable pageable);

    @Query("SELECT l FROM Lead l WHERE " +
           "LOWER(l.name) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(l.email) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(l.company) LIKE LOWER(CONCAT('%', :q, '%'))")
    Page<Lead> search(@Param("q") String query, Pageable pageable);

    @Query("SELECT l FROM Lead l WHERE l.status = :status AND (" +
           "LOWER(l.name) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(l.email) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(l.company) LIKE LOWER(CONCAT('%', :q, '%')))")
    Page<Lead> searchByStatus(@Param("q") String query, @Param("status") Lead.Status status, Pageable pageable);
}
