let currentUser = JSON.parse(localStorage.getItem("currentUser")) ;
function checkLogin() {
    let btn = `<button type="button" onclick="logOut()">đăng xuất</button>`
    let loginNow = `<a href="login.html">Đăng nhập</a>`
    if (currentUser.token != null) {
        document.getElementById("logOut").innerHTML = btn
    } else {
        document.getElementById("loginNow").innerHTML = loginNow
    }
}
function showList(page) {
    $.ajax({
        type : 'GET',
        url: `http://localhost:8080/products?page=${page}`,
        headers : {
            "Authorization" : 'Bearer ' + currentUser.token
        },
        success : function (data) {
            let array  = data.content;
            let content = '';
            for (let i = 0; i < array.length; i++) {
                content += `<tr>
                    <td>${i+1}</td>
                    <td>${array[i].name}</td>
                    <td>${array[i].price}</td>
                    <td>${array[i].quantity}</td>
                    <td>${array[i].description}</td>
                    <td><img src="http://localhost:8080/image/${array[i].image}" width="100" height="100" alt=""></td>
                    <td>${array[i].category?.name}</td>
                        </tr>`
            }
            document.getElementById("showList").innerHTML = content;
        }
    })
}
function logOut() {
    window.localStorage.clear();
    location.href = 'login.html';
}
showList(0)
checkLogin()