package com.auca.backend.repository;

public interface UserRepo extends JpaRepository<User, Long> {
    User findByEmail(String email);
    
}
