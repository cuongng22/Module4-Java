package com.example.minitest2_md4.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BookForm {
    private Long id;

    private String name;

    private String author;

    private double price;

    private MultipartFile avatar;

    private Category category;

    public BookForm(String name, String author, double price, MultipartFile avatar, Category category) {
        this.name = name;
        this.author = author;
        this.price = price;
        this.avatar = avatar;
        this.category = category;
    }
}
