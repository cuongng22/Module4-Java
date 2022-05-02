function showCategory() {
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/categories`,
        success : function (data) {
            let content = '';
            for (let i = 0; i < data.length; i++) {
                content += `<tr>
                    <td>${i+1}</td>
                    <td><a onclick="showBookByCategory(0, ${data[i].id})" href="book.html" >${data[i].name}</a></td>
                    <td>${data[i].description}</td>
                </tr>`
            }
            $(`#showCategory`).html(content);
        }
    })
}

 showCategory()