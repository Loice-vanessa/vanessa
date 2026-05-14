package com.auca.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.auca.backend.model.User;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {
    Op findByEmail(String email);
    
}
