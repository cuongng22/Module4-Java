
function getCategory() {
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/categories`,
        success : function (data) {
            let content = `<option disabled>Choose Category</option>`;
            for (let i = 0; i < data.length; i++) {
                content += `<option value="${data[i].id}">${data[i].name}</option>`
            }
            $(`#select_category`).html(content);
            $(`#select_category123`).html(content);
        }
    })
}
//----------------------------------------------------------------------------------------------
function showList(page) {
    $.ajax({
        type : 'GET',
        url : `http://localhost:8080/books?page=${page}`,
        success : function (data) {
            let books = data.content;
            let content = '';
            for (let i = 0; i < books.length; i++) {
                content += `<tr>
                    <td>${i + 1 + 4 * page}</td>
                    <td>${books[i].name}</td>
                    <td>${books[i].author}</td>
                    <td>${books[i].price}</td>
                    <td><img src="http://localhost:8080/image/${books[i].avatar}" width="100" height="100"></td>
                    <td>${books[i].category?.name}</td>
                    <td><button onclick="showEditForm(${books[i].id})"  data-bs-toggle="modal" data-bs-target="#edit_modal" class="btn btn-warning"><i class="fa fa-edit"></i></button></td>
                    <td><button onclick="showDeleteForm(${books[i].id})" data-bs-toggle="modal" data-bs-target="#exampleModal" class="btn btn-danger"><i class="fa fa-trash" ></i></button></td>
                </tr>`
            }
            $(`#showList`).html(content);
            let iconPage = `<button id="first" onclick="showList(0)"><i class="fa-solid fa-backward-fast"></i></button> 
                <button  id="backup" onclick="showList(${data.pageable.pageNumber} - 1)"><i class ="fa-solid fa-backward-step"></i></button>
                      <span> Trang </span> <span>${data.pageable.pageNumber +1 }/ ${data.totalPages}</span>
                      <button id="next" onclick="showList(${data.pageable.pageNumber}+1)" ><i class="fa-solid fa-forward-step"></i></button>
                        <button id="last" onclick="showList(${data.totalPages} -1)"><i class="fa-solid fa-forward-fast"></i></button>`
            $(`#iconPage`).html(iconPage);
            if (data.pageable.pageNumber === 0) {
                document.getElementById("backup").hidden = true
                document.getElementById("first").hidden = true

            }

            if (data.totalPages ===0 ) {
                document.getElementById("backup").hidden = true
                document.getElementById("first").hidden = true
                document.getElementById("next").hidden = true
                document.getElementById("last").hidden = true
            }

            if (data.pageable.pageNumber + 1 === data.totalPages) {
                document.getElementById("next").hidden = true
                document.getElementById("last").hidden = true
            }
        }
    })
}

function findByName(page) {
    let q = $(`#q`).val();
    $.ajax({
        type : 'GET',
        url : `http://localhost:8080/books?q=${q}&page=${page}`,
        success : function (data) {
            let books = data.content;
            let content = '';
            for (let i = 0; i < books.length; i++) {
                content += `<tr>
                    <td>${i + 1 + 5 * page}</td>
                    <td>${books[i].name}</td>
                    <td>${books[i].author}</td>
                    <td>${books[i].price}</td>
                    <td><img src="http://localhost:8080/image/${books[i].avatar}" width="100" height="100"></td>
                    <td>${books[i].category?.name}</td>
                    <td><button onclick="showEditForm(${books[i].id})"  data-bs-toggle="modal" data-bs-target="#edit_modal" class="btn btn-warning"><i class="fa fa-edit"></i></button></td>
                    <td><button onclick="showDeleteForm(${books[i].id})" data-bs-toggle="modal" data-bs-target="#exampleModal" class="btn btn-danger"><i class="fa fa-trash" ></i></button></td>
                </tr>`
            }
            $(`#showList`).html(content);
            let iconPage = `<button id="first" onclick="findByName(0)"><i class="fa-solid fa-backward-fast"></i></button> 
                <button  id="backup" onclick="findByName(${data.pageable.pageNumber} - 1)"><i class ="fa-solid fa-backward-step"></i></button>
                      <span> Trang </span> <span>${data.pageable.pageNumber +1 }/ ${data.totalPages}</span>
                      <button id="next" onclick="findByName(${data.pageable.pageNumber}+1)" ><i class="fa-solid fa-forward-step"></i></button>
                        <button id="last" onclick="findByName(${data.totalPages} -1)"><i class="fa-solid fa-forward-fast"></i></button>`
            $(`#iconPage`).html(iconPage);
            if (data.pageable.pageNumber === 0) {
                document.getElementById("backup").hidden = true
                document.getElementById("first").hidden = true

            }

            if (data.pageable.pageNumber + 1 === data.totalPages) {
                document.getElementById("next").hidden = true
                document.getElementById("last").hidden = true
            }
        }
    })
}



//----------------------------------------------------------------------------------------------------------
function showCreateForm() {
   $(`#name`).val(null);
   $(`#author`).val(null);
   $(`#price`).val(null);
   $(`#image`).val(null);
    getCategory()
}

function createBook() {
    let name = $(`#name`).val();
    let author = $(`#author`).val();
    let price = $(`#price`).val();
    let image = $(`#image`)
    let category = $(`#select_category`).val();
    let bookForm = new FormData();
    bookForm.append('name', name);
    bookForm.append('author', author);
    bookForm.append('price', price);
    bookForm.append('avatar', image.prop('files')[0]);
    bookForm.append('category', category);
    $.ajax({
        type : 'POST',
        url : `http://localhost:8080/books`,
        data : bookForm,
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        success : function () {
            showList(0)
        }
    })
}
//--------------------------------------------------------------------------
function showEditForm(id) {
    let footer = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="editBook(${id})">Save </button>`
    $(`#edit_footer`).html(footer);
    $.ajax({
        type : 'GET',
        url : `http://localhost:8080/books/${id}`,
        success : function (data) {
            let img = `<img src="http://localhost:8080/image/${data.avatar}" width="100" height="100">`
            $(`#name1`).val(data.name);
            $(`#author1`).val(data.author);
            $(`#price1`).val(data.price);
            $(`#showImg`).html(img);
        }
    })
    getCategory()
}

function editBook(id) {
    let name = $(`#name1`).val();
    let author = $(`#author1`).val();
    let price = $(`#price1`).val();
    let image = $(`#image1`);
    let category = $(`#select_category123`).val();
    let file = new File([""], "filename.jpg");
    let bookForm = new FormData();
    bookForm.append('name', name);
    bookForm.append('author', author);
    bookForm.append('price', price);
    if (image.prop('files')[0] === undefined) {
        bookForm.append('avatar', file)
    }else {
        bookForm.append('avatar', image.prop('files')[0]);
    }
    bookForm.append('category', category);
    $.ajax({
        type : 'POST',
        url : `http://localhost:8080/books/edit/${id}`,
        data : bookForm,
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        success : function () {
            showList(0)
        }
    })
}
//------------------------------------------------------------------------------------------
function showDeleteForm(id) {
    let footer = ` <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-danger" data-bs-dismiss="modal" onclick="deleteBook(${id})">Delete</button>`
    $(`#delete_footer`).html(footer);
}

function deleteBook(id){
    $.ajax({
        type : 'DELETE',
        url : `http://localhost:8080/books/${id}`,
        success : function () {
            showList(0)
        }
    })
}
function showBookByCategory(page, id) {
    $.ajax({
        type : 'GET',
        url : `http://localhost:8080/books/category/${id}?page=${page}`,
        success : function (data) {
            let books = data.content;
            let content = '';
            for (let i = 0; i < books.length; i++) {
                content += `<tr>
                    <td>${i + 1 + 4 * page}</td>
                    <td>${books[i].name}</td>
                    <td>${books[i].author}</td>
                    <td>${books[i].price}</td>
                    <td><img src="http://localhost:8080/image/${books[i].avatar}" width="100" height="100"></td>
                    <td>${books[i].category?.name}</td>
                    <td><button onclick="showEditForm(${books[i].id})"  data-bs-toggle="modal" data-bs-target="#edit_modal" class="btn btn-warning"><i class="fa fa-edit"></i></button></td>
                    <td><button onclick="showDeleteForm(${books[i].id})" data-bs-toggle="modal" data-bs-target="#exampleModal" class="btn btn-danger"><i class="fa fa-trash" ></i></button></td>
                </tr>`
            }
            $(`#showList`).html(content);
            let iconPage = `<button id="first1" onclick="showList(0)"><i class="fa-solid fa-backward-fast"></i></button>
                <button  id="backup1" onclick="showList(${data.pageable.pageNumber} - 1)"><i class ="fa-solid fa-backward-step"></i></button>
                      <span> Trang </span> <span>${data.pageable.pageNumber +1 }/ ${data.totalPages}</span>
                      <button id="next1" onclick="showList(${data.pageable.pageNumber}+1)" ><i class="fa-solid fa-forward-step"></i></button>
                        <button id="last1" onclick="showList(${data.totalPages} -1)"><i class="fa-solid fa-forward-fast"></i></button>`
            $(`#iconPage`).html(iconPage);
            if (data.pageable.pageNumber === 0) {
                document.getElementById("backup1").hidden = true
                document.getElementById("first1").hidden = true

            }

            if (data.totalPages ===0 ) {
                document.getElementById("backup1").hidden = true
                document.getElementById("first1").hidden = true
                document.getElementById("next1").hidden = true
                document.getElementById("last1").hidden = true
            }

            if (data.pageable.pageNumber + 1 === data.totalPages) {
                document.getElementById("next1").hidden = true
                document.getElementById("last1").hidden = true
            }
        }
    })
}
showList(0)