package com.codegym.controller;

import com.codegym.model.Product;
import com.codegym.model.ProductForm;
import com.codegym.service.product.IProductService;
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
@RequestMapping("/products")
@CrossOrigin("*")
public class ProductController {
    @Autowired
    private IProductService productService;

    @Value("${file-upload}")
    private String uploadPath;

    @GetMapping
    public ResponseEntity<Page<Product>> findAll(@RequestParam(name = "q")Optional<String> q, @PageableDefault(value = 5)Pageable pageable) {
        Page<Product> products;
        if (!q.isPresent()) {
            products = productService.findAll(pageable);
        } else {
            products = productService.findByNameContaining(q.get(), pageable);
        }
        if (products.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@ModelAttribute ProductForm productForm) {
        MultipartFile multipartFile = productForm.getImage();
        String image = multipartFile.getOriginalFilename();
        image = System.currentTimeMillis() + image;
        try {
            FileCopyUtils.copy(multipartFile.getBytes(), new File(uploadPath + image));
        } catch (IOException e) {
            e.printStackTrace();
        }

        Product product = new Product(productForm.getName(), productForm.getPrice(), productForm.getQuantity(), productForm.getDescription(), image, productForm.getCategory());
        productService.save(product);
        return new ResponseEntity<>(product, HttpStatus.CREATED);
    }

    @PostMapping("/edit/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @ModelAttribute ProductForm productForm) {
        Optional<Product> product = productService.findById(id);
        if (!product.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        String image;
        MultipartFile multipartFile = productForm.getImage();
            if (multipartFile.getSize()== 0) {
                image = product.get().getImage();
            } else {
                image = System.currentTimeMillis() + multipartFile.getOriginalFilename();
            }
        try {
            FileCopyUtils.copy(multipartFile.getBytes(), new File(uploadPath + image));
        } catch (IOException e) {
            e.printStackTrace();
        }
        Product newProduct = new Product(id,productForm.getName(), productForm.getPrice(), productForm.getQuantity(), productForm.getDescription(), image, productForm.getCategory());
        productService.save(newProduct);
        return new ResponseEntity<>(newProduct, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Product> delete(@PathVariable Long id) {
        Optional<Product> product = productService.findById(id);
        if (!product.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        productService.remove(id);
        return new ResponseEntity<>(product.get(),HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> detail(@PathVariable Long id) {
        Product product = productService.findById(id).get();
        return new ResponseEntity<>(product, HttpStatus.OK);
    }
}
