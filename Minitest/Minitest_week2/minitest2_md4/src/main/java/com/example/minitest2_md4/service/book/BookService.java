package com.example.minitest2_md4.service.book;

import com.example.minitest2_md4.model.Book;
import com.example.minitest2_md4.repository.IBookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;
@Service
public class BookService implements IBookService{
    @Autowired
    private IBookRepository bookRepository;

    @Override
    public Page<Book> findAll(Pageable pageable) {
        return bookRepository.findAll(pageable);
    }

    @Override
    public Optional<Book> findById(Long id) {
        return bookRepository.findById(id);
    }

    @Override
    public Book save(Book book) {
        return bookRepository.save(book);
    }

    @Override
    public void remove(Long id) {
        bookRepository.deleteById(id);
    }

    @Override
    public Page<Book> findByNameContaining(String name, Pageable pageable) {
        return bookRepository.findByNameContaining(name, pageable);
    }

    @Override
    public Page<Book> findByCategory(Long id, Pageable pageable) {
        return bookRepository.findByCategory(id, pageable);
    }
}
