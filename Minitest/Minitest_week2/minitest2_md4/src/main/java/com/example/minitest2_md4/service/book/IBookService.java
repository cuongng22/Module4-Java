package com.example.minitest2_md4.service.book;

import com.example.minitest2_md4.model.Book;
import com.example.minitest2_md4.service.IGeneralService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IBookService extends IGeneralService<Book> {
    Page<Book> findByNameContaining(String name, Pageable pageable);

    Page<Book> findByCategory(Long id, Pageable pageable);
}
