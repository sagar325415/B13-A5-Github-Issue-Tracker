const signBtn = document.getElementById('sign-btn');

signBtn.addEventListener('click', function () {

    const inputUser = document.getElementById('userName').value.trim();
    const inputPass = document.getElementById('password').value.trim();

    const username = "admin";
    const password = "admin123";

    if (inputUser === username && inputPass === password) {
        window.location.assign('./home.html');
    }
    else {
        alert("Invalid credential");
    }

});