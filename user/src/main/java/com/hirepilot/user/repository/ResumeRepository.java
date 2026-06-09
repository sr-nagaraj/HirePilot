package com.hirepilot.user.repository;

import com.hirepilot.user.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResumeRepository
        extends JpaRepository<Resume, Long> {

    List<Resume> findByUserId(Long userId);
}