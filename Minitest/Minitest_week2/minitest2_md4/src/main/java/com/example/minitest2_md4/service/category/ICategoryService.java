package com.example.minitest2_md4.service.category;

import com.example.minitest2_md4.model.Category;
import com.example.minitest2_md4.service.IGeneralService;


import java.util.List;
public interface ICategoryService extends IGeneralService<Category> {
    List<Category> findAll();
}
