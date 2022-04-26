package com.example.crud_full.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductForm {
    private Long id;

    private String name;

    private double price;

    private int quantity;

    private String description;

    private MultipartFile image;

    private Category category;

    public ProductForm(String name, double price, int quantity, String description, MultipartFile image, Category category) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.description = description;
        this.image = image;
        this.category = category;
    }
}
