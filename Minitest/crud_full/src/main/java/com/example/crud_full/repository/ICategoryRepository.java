package com.example.crud_full.repository;

import com.example.crud_full.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

@Repository
@Transactional
public interface ICategoryRepository extends JpaRepository<Category, Long> {
    @Modifying
    @Query(value = "call deleteCategory(?1)", nativeQuery = true)
    void deleteCategory(Long id);
}
