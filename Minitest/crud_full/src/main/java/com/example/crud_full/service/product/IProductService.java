package com.example.crud_full.service.product;

import com.example.crud_full.model.Product;
import com.example.crud_full.service.IGeneralService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IProductService extends IGeneralService<Product> {
    Page<Product> findByNameContaining(String name, Pageable pageable);
    Page<Product> findByCategory(Long id, Pageable pageable);
}
