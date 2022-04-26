function getCategory1() {
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/categories`,
        success : function (data) {
            let content = `<option disabled >Choose Category</option>`
            for (let i =0; i< data.length; i++ ) {
                content += `<option value="${data[i].id}">${data[i].name}</option>`
            }
            $(`#select_category`).html(content);
        }
    })
}
function getCategory2() {
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/categories`,
        success : function (data) {
            let content = `<option disabled >Choose Category</option>`
            for (let i =0; i< data.length; i++ ) {
                content += `<option value="${data[i].id}">${data[i].name}</option>`
            }
            $(`#select_category2`).html(content);
        }
    })
}
function showAll(page) {
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/products?page=${page}`,
        success: function (data) {
            let array = data.content;
            let content = '';
            for (let i = 0; i < array.length; i++) {
                content += `<tr>
                    <td>${(i+1)+5*page}</td>
                    <td>${array[i].name}</td>
                    <td>${array[i].price}</td>
                    <td>${array[i].quantity}</td>
                    <td>${array[i].description}</td>
                    <td><img src="http://localhost:8080/image/${array[i].image}" width="100" height="100"></td>
                    <td>${array[i].category.name}</td>
                    <td><button data-bs-toggle="modal" data-bs-target="#staticBackdrop2" onclick="showEditForm(${array[i].id})" class="btn btn-warning" type="button"><i class="fa fa-edit"></i></button></td>
                    <td><button data-bs-toggle="modal" data-bs-target="#staticBackdrop1" onclick="showFormDelete(${array[i].id})" class="btn btn-danger" type="button"><i class="fa fa-trash"></button></td>
                </tr>`
            }
            document.getElementById("showList").innerHTML = content;
            document.getElementById("displayPage").innerHTML =
                `<button class="btn btn-primary" id="first" onclick="showAll(0)" style="margin-right: 10px"><i class="fa-solid fa-backward-fast"></i></button><button class="btn btn-primary" id="backup" onclick="showAll(${data.pageable.pageNumber}-1)"><i class="fa-solid fa-backward-step"></i></button>
    <span>Trang </span><span>${data.pageable.pageNumber + 1} / ${data.totalPages}</span>
    <button class="btn btn-primary" id="next" onclick="showAll(${data.pageable.pageNumber}+1)"><i class="fa-solid fa-forward-step"></i></button>
<button class="btn btn-primary" id="last" onclick="showAll(${data.totalPages}-1)"><i class="fa-solid fa-forward-fast"></i></button>`
            if (data.pageable.pageNumber === 0) {
                document.getElementById("backup").hidden = true
                document.getElementById("first").hidden = true
            }
            //điều kiện bỏ nút next
            if (data.pageable.pageNumber + 1 === data.totalPages) {
                document.getElementById("next").hidden = true
                document.getElementById("last").hidden = true
            }
        }
    })
}

function showCreateForm() {
    let footer = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" data-bs-dismiss="modal" class="btn btn-primary" onclick="createProduct()">Save</button>`
    $(`#staticBackdropLabel`).html("Create Product");
    $(`#create_edit`).html(footer);
    $(`#name`).val(null);
    $(`#price`).val(null);
    $(`#quantity`).val(null);
    $(`#description`).val(null);
    $(`#image`).val(null);
    getCategory1()
}

function createProduct() {
    let name = $(`#name`).val();
    let price = $(`#price`).val();
    let quantity = $(`#quantity`).val();
    let description = $(`#description`).val();
    let image = $(`#image`);
    let category = $(`#select_category`).val();
    let productForm = new FormData();
    productForm.append('name',name);
    productForm.append('price', price);
    productForm.append('quantity', quantity);
    productForm.append('description', description);
    productForm.append('image',image.prop('files')[0]);
    productForm.append('category', category);
    $.ajax({
        type: 'POST',
        url : 'http://localhost:8080/products',
        enctype: 'multipart/form-data',
        data: productForm,
        processData: false,
        contentType: false,
        success : function () {
            showAll(0);
        }
    })
}

function showEditForm(id) {
    let footer = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" data-bs-dismiss="modal" class="btn btn-primary" onclick="editProduct(${id})">Save</button>`
    $(`#staticBackdropLabel2`).html("Edit Product");
    $(`#create_edit2`).html(footer);
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/products/${id}`,
        success : function (data) {
            $(`#name2`).val(data.name);
            $(`#price2`).val(data.price);
            $(`#quantity2`).val(data.quantity);
            $(`#description2`).val(data.description);
            $(`#img`).html(`<img src="http://localhost:8080/image/${data.image}" width="100" height="100">`);
            $(`#image2`).val(data.image);
        }
    })
    getCategory2();
}
function editProduct(id) {
    let name = $(`#name2`).val();
    let price = $(`#price2`).val();
    let quantity = $(`#quantity2`).val();
    let description = $(`#description2`).val();
    let image = $(`#image2`);
    let category = $(`#select_category2`).val();
    let productForm = new FormData();
    productForm.append('name', name);
    productForm.append('price', price);
    productForm.append('quantity', quantity);
    productForm.append('description', description);
    productForm.append('image', image.prop('files')[0]);
    productForm.append('category', category);
    $.ajax({
        type: 'POST',
        url: `http://localhost:8080/products/edit/${id}`,
        enctype: 'multipart/form-data',
        data: productForm,
        processData: false,
        contentType: false,
        success: function () {
            showAll(0);
        }
    })
}

function showFormDelete(id) {
    let footer =` <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="deleteProduct(${id})">Sure</button>`
    $(`#delete_form`).html(footer);
}
function deleteProduct(id) {
    $.ajax({
        type: "DELETE",
        url: `http://localhost:8080/products/${id}`,
        success: function () {
            showAll(0)
        }
    })
}

function findProductByName(page) {
    let q = $(`#q`).val();
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/products?q=${q}&page=${page}`,
        success: function (data) {
            let array = data.content;
            let content = '';
            for (let i = 0; i < array.length; i++) {
                content += `<tr>
                    <td>${(i+1)+5*page}</td>
                    <td>${array[i].name}</td>
                    <td>${array[i].price}</td>
                    <td>${array[i].quantity}</td>
                    <td>${array[i].description}</td>
                    <td><img src="http://localhost:8080/image/${array[i].image}" width="100" height="100"></td>
                    <td>${array[i].category.name}</td>
                    <td><button data-bs-toggle="modal" data-bs-target="#staticBackdrop2" onclick="showEditForm(${array[i].id})" class="btn btn-warning" type="button"><i class="fa fa-edit"></i></button></td>
                    <td><button data-bs-toggle="modal" data-bs-target="#staticBackdrop1" onclick="showFormDelete(${array[i].id})" class="btn btn-danger" type="button"><i class="fa fa-trash"></button></td>
                </tr>`
            }
            document.getElementById("showList").innerHTML = content;
            document.getElementById("displayPage").innerHTML =
                `<button class="btn btn-primary" id="first" onclick="showAll(0)" style="margin-right: 10px"><i class="fa-solid fa-backward-fast"></i></button><button class="btn btn-primary" id="backup" onclick="showAll(${data.pageable.pageNumber}-1)"><i class="fa-solid fa-backward-step"></i></button>
    <span>Trang </span><span>${data.pageable.pageNumber + 1} / ${data.totalPages}</span>
    <button class="btn btn-primary" id="next" onclick="showAll(${data.pageable.pageNumber}+1)"><i class="fa-solid fa-forward-step"></i></button>
<button class="btn btn-primary" id="last" onclick="showAll(${data.totalPages}-1)"><i class="fa-solid fa-forward-fast"></i></button>`
            if (data.pageable.pageNumber === 0) {
                document.getElementById("backup").hidden = true
                document.getElementById("first").hidden = true
            }
            //điều kiện bỏ nút next
            if (data.pageable.pageNumber + 1 === data.totalPages) {
                document.getElementById("next").hidden = true
                document.getElementById("last").hidden = true
            }
        }
    })
}
showAll(0);





