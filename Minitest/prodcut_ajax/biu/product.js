function showList(page) {
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/products?page=${page}`,
        success : function (data) {
            let content = '';
            let array = data.content;
            for (let i = 0; i < array.length; i++) {
                content += `<tr>
                    <td>${i+1}</td>
                    <td>${array[i].name}</td>
                    <td>${array[i].price}</td>
                    <td>${array[i].quantity}</td>
                    <td>${array[i].description}</td>
                    <td><img src="http://localhost:8080/image/${array[i].image}" width="100" height="100"/></td>
                    <td>${array[i].category?.name}</td>
                    <td><button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#edit_modal" onclick="showEditForm(${array[i].id})"><i class="fa fa-edit"></button></td>
                    <td><button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#delete_modal"onclick="showFormDelete(${array[i].id})"><i class="fa fa-trash"></button></td>
                </tr>`
            }
            $(`#showlist`).html(content)
        }
    })
}
function getCategory() {
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/categories`,
        success : function (data) {
            let content = `<option disabled>Choose Category</option>`;
            for (let i = 0; i < data.length; i++) {
                content += `<option value="${data[i].id}">${data[i].name}</option>`
            }
            $(`#category_select`).html(content);
            $(`#category_select1`).html(content);
        }
    })
}

function showCreateForm() {
    getCategory();
}

function createProduct() {
    let name =  $(`#name`).val();
    let price =  $(`#price`).val();
    let quantity =  $(`#quantity`).val();
    let description =  $(`#description`).val();
    let image =  $(`#image`);
    let category =  $(`#category_select`).val();
    let productForm = new FormData();
    productForm.append('name', name);
    productForm.append('price', price);
    productForm.append('quantity', quantity);
    productForm.append('description', description);
    productForm.append('image',image.prop('files')[0]);
    productForm.append('category', category);
    $.ajax({
        type:'POST',
        url:`http://localhost:8080/products`,
        data: productForm,
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        success : function () {
            showList(0);
        }
    })
}

 function  showEditForm(id){
     let footer = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="editProduct(${id})">Save </button>`
     $(`#edit_btn`).html(footer);
     $.ajax({
         type: 'GET',
         url: `http://localhost:8080/products/${id}`,
         success : function (data) {
             let img = `<img src="http://localhost:8080/image/${data.image}" width="100" height="100" alt=""/>`
             $(`#name1`).val(data.name);
             $(`#price1`).val(data.price);
             $(`#quantity1`).val(data.quantity);
             $(`#description1`).val(data.description);
             $(`#showimg`).html(img);
             $(`#image1`).val(data.image);
         }
     })
getCategory()
}

function editProduct(id) {
    let name =  $(`#name1`).val();
    let price =  $(`#price1`).val();
    let quantity =  $(`#quantity1`).val();
    let description =  $(`#description1`).val();
    let image =  $(`#image1`);
    let category =  $(`#category_select1`).val();
    let productForm = new FormData();
    productForm.append('name', name);
    productForm.append('price', price);
    productForm.append('quantity', quantity);
    productForm.append('description', description);
    productForm.append('image',image.prop('files')[0]);
    productForm.append('category', category);
    $.ajax({
        type:'POST',
        url:`http://localhost:8080/products/edit/${id}`,
        data: productForm,
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        success : function () {
            showList(0);
        }
    })
}

function showFormDelete(id) {
    let footer = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="deleteProduct(${id})">Delete</button>`
    $(`#delete_btn`).html(footer);
}

function deleteProduct(id) {
    $.ajax({
        type: 'DELETE',
        url: `http://localhost:8080/products/${id}`,
        success : function () {
            showList(0)
        }
    })
}

showList(0)