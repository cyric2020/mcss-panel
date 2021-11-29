// import { createApp } from 'vue'
// import App from './App.vue'

// createApp(App).mount('#app')

import './main.css'

var api_url = localStorage.getItem('api_url');

if (api_url == null) {
    requestUrl();
}else{
    startLogin();
}

function requestUrl() {
    var div = document.getElementById('request_url');
    div.style.display = 'block';
    document.getElementById('request_url_btn').addEventListener('click', function () {
        var url = document.getElementById('request_url_input').value;
        var url_regex = /^(http|https):\/\/[^ "]+$/;
        if(!url_regex.test(url)){
            alert('Invalid url');
            document.getElementById('request_url_input').value = '';
            return;
        }
        if (url.length > 0){
            localStorage.setItem('api_url', url);
            api_url = url;
            div.style.display = 'none';
            startLogin();
        }
    });
}

function startLogin() {
    var div = document.getElementById('login');
    div.style.display = 'block';
    document.getElementById('login_btn').addEventListener('click', login);
}

function login(){
    var username = document.getElementById('login_username').value;
    var password = document.getElementById('login_password').value;
    $.ajax({
        url: api_url + '/api/token',
        type: 'POST',
        data: {
            username: username,
            password: password
        },
        success: function (data) {
            localStorage.setItem('token', data.access_token);
            window.location.href = 'dashboard.html';
        }
    });
}