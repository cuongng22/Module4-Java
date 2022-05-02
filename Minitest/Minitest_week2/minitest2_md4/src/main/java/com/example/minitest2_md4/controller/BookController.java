package com.example.minitest2_md4.controller;

import com.example.minitest2_md4.model.Book;
import com.example.minitest2_md4.model.BookForm;
import com.example.minitest2_md4.service.book.IBookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Optional;

@RestController
@RequestMapping("/books")
@CrossOrigin("*")
public class BookController {
    @Autowired
    private IBookService bookService;

    @Value("${file-upload}")
    private String uploadPath;

    @GetMapping
    public ResponseEntity<Page<Book>> showList(@RequestParam(name = "q")Optional<String> q, @PageableDefault(value = 4)Pageable pageable) {
        Page<Book> books;
        if (!q.isPresent()) {
            books = bookService.findAll(pageable);
        } else {
            books = bookService.findByNameContaining(q.get(), pageable);
        }
        return new ResponseEntity<>(books, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> findOne(@PathVariable Long id) {
        Optional<Book> book  = bookService.findById(id);
        if (!book.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(book.get(), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Book> createBook(@ModelAttribute BookForm bookForm) throws IOException {
        MultipartFile multipartFile = bookForm.getAvatar();
        String image = multipartFile.getOriginalFilename();
        try {
            FileCopyUtils.copy(multipartFile.getBytes(), new File(uploadPath+image));
        } catch (IOException e) {
            e.printStackTrace();
        }
        Book book = new Book(bookForm.getName(), bookForm.getAuthor(), bookForm.getPrice(), image, bookForm.getCategory());
        bookService.save(book);
        return new ResponseEntity<>(book, HttpStatus.CREATED);
    }

    @PostMapping("/edit/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @ModelAttribute BookForm bookForm) {
        Optional<Book> book = bookService.findById(id);
            if (!book.isPresent()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        MultipartFile multipartFile = bookForm.getAvatar();
        String image;
        image = multipartFile.getOriginalFilename();
        try {
                FileCopyUtils.copy(multipartFile.getBytes(), new File(uploadPath + image));
            } catch (IOException e) {
                e.printStackTrace();
            }
            Book newBook = new Book(id, bookForm.getName(), bookForm.getAuthor(), bookForm.getPrice(), image, bookForm.getCategory());
        if (newBook.getAvatar().equals("filename.jpg"))    {
            newBook.setAvatar(book.get().getAvatar());
        }
        bookService.save(newBook);
            return new ResponseEntity<>(newBook, HttpStatus.OK);
        }

    @DeleteMapping("/{id}")
    public ResponseEntity<Book> deleteBook(@PathVariable Long id) {
        Optional<Book> book = bookService.findById(id);
        if (!book.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        bookService.remove(id);
        return new ResponseEntity<>(book.get(), HttpStatus.OK);
    }

    @GetMapping("/category/{id}")
    public ResponseEntity<Page<Book>> findByCategory(@PathVariable Long id, @PageableDefault(value = 4) Pageable pageable) {
        Page<Book> books = bookService.findByCategory(id, pageable);
        return new ResponseEntity<>(books, HttpStatus.OK);
    }
}
