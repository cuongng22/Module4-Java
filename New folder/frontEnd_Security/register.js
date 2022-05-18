function register() {
    let username = $(`#createUser`).val();
    let password = $(`#createPassword`).val();
    let passwordConfirm = $(`#confirmPassword`).val();
    let signUpForm = {
        username : username,
        passwordForm : {
            password: password,
            confirmPassword: passwordConfirm
        }
    }
    $.ajax({
        type : 'POST',
        url : `http://localhost:8080/register`,
        data : JSON.stringify(signUpForm),
        headers : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json',
        },
        success : function () {
            document.getElementById("mess_register").innerText = "dang ki thanh cong";
        },
        error : function () {
            document.getElementById("mess_register").innerText = "tai khoan da ton tai hoac mk ko giong nhau"
        }
    })
}