package com.example.crud_full.repository;

import com.example.crud_full.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface IProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByNameContaining(String name, Pageable pageable);

    @Query(value = "select * from product where category_id = ?1", nativeQuery = true)
    Page<Product> findByCategory(Long id, Pageable pageable);

}
