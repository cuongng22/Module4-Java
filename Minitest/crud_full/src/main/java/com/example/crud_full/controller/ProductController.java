package com.example.crud_full.controller;

import com.example.crud_full.model.Product;
import com.example.crud_full.model.ProductForm;
import com.example.crud_full.service.product.IProductService;
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

    @Value("C:/Users/Admin/Documents/image/")
     String uploadPath;

    @GetMapping
    public ResponseEntity<Page<Product>> showList(@RequestParam(name = "q") Optional<String> q, @PageableDefault(value = 5)Pageable pageable) {
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
        MultipartFile image = productForm.getImage();
        String fileName = image.getOriginalFilename();
        long currentTimeMillis = System.currentTimeMillis();
        fileName = currentTimeMillis + fileName;
        try {
            FileCopyUtils.copy(image.getBytes(), new File(uploadPath + fileName));
        } catch (IOException e) {
            e.printStackTrace();
        }
        Product product = new Product(productForm.getName(), productForm.getPrice(), productForm.getQuantity(),
                productForm.getDescription(), fileName, productForm.getCategory());
        return new ResponseEntity<>(this.productService.save(product), HttpStatus.CREATED);
    }

    @PostMapping("/edit/{id}")
    public ResponseEntity<Product> updateProduct(@ModelAttribute ProductForm productForm, @PathVariable Long id) {
        Optional<Product> productOptional = this.productService.findById(id);
        if (!productOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        MultipartFile multipartFile = productForm.getImage();
        String image;
        if (multipartFile.getSize() == 0) {
            image = productOptional.get().getImage();
        } else {
            String fileName = multipartFile.getOriginalFilename();
            long currentTime = System.currentTimeMillis();
            fileName = currentTime + fileName;
            image = fileName;
            try {
                FileCopyUtils.copy(productForm.getImage().getBytes(), new File(uploadPath + fileName));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        Product newProduct = new Product(id, productForm.getName(), productForm.getPrice(), productForm.getQuantity(),
                productForm.getDescription(), image, productForm.getCategory());
        return new ResponseEntity<>(this.productService.save(newProduct), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Product> deleteProduct(@PathVariable Long id) {
        Optional<Product> product = productService.findById(id);
        if (!product.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        productService.remove(id);
        return new ResponseEntity<>(product.get(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> findOne(@PathVariable Long id) {
        return new ResponseEntity<>(productService.findById(id).get(), HttpStatus.OK);
    }
 }
