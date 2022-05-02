package com.example.minitest2_md4.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String author;

    private double price;

    private String avatar;

    @ManyToOne
    private Category category;

    public Book(String name, String author, double price, String avatar, Category category) {
        this.name = name;
        this.author = author;
        this.price = price;
        this.avatar = avatar;
        this.category = category;
    }
}
