package com.example.crud_full.service.category;

import com.example.crud_full.model.Category;
import com.example.crud_full.service.IGeneralService;

import java.util.List;

public interface ICategoryService extends IGeneralService<Category> {
    void deleteCategory(Long id);
    List<Category> find();
}
