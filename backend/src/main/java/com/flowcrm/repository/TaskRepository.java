package com.flowcrm.repository;

import com.flowcrm.entity.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TaskRepository extends JpaRepository<Task, Long> {

    Page<Task> findByStatus(Task.Status status, Pageable pageable);

    Page<Task> findByPriority(Task.Priority priority, Pageable pageable);

    Page<Task> findByStatusAndPriority(Task.Status status, Task.Priority priority, Pageable pageable);

    @Query("SELECT t FROM Task t WHERE " +
           "LOWER(t.title) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(t.description) LIKE LOWER(CONCAT('%', :q, '%'))")
    Page<Task> search(@Param("q") String query, Pageable pageable);

    @Query("SELECT t FROM Task t WHERE t.status = :status AND (" +
           "LOWER(t.title) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(t.description) LIKE LOWER(CONCAT('%', :q, '%')))")
    Page<Task> searchByStatus(@Param("q") String query, @Param("status") Task.Status status, Pageable pageable);
}
