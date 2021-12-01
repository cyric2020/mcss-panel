import './dash.css'

var api_url = localStorage.getItem('api_url');
var token = localStorage.getItem('token');

if(api_url.endsWith('/')){
    api_url = api_url.substring(0, api_url.length - 1);
}

$.ajax({
    url: api_url + '/api/servers',
    type: 'GET',
    headers: {
        'Authorization': 'Bearer ' + token
    },
    success: function(data){createServers(data);}
});

function createServers(data){
    var serverContainer = document.getElementById('servers');
    console.log(data);
    for(var i=0; i<data.length; i++){
        var name = data[i].Name;
        var status = data[i].Status;

        var server = document.createElement('div');
        server.className = 'server';
        server.id = data[i].Guid;
        server.addEventListener('click', function(){
            window.location.href = 'server.html?server=' + this.id;
        });
        serverContainer.appendChild(server);

        var server_icon = document.createElement('div');
        server_icon.className = 'server-icon';
        server_icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 13H5c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2zM7 19c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM19 3H5c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM7 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>'
        server.appendChild(server_icon);

        var server_info = document.createElement('div');
        server_info.className = 'server-info';
        server.appendChild(server_info);

        var server_name_container = document.createElement('div');
        server_name_container.className = 'server-name-container';
        server_info.appendChild(server_name_container);

        var server_name = document.createElement('span');
        server_name.className = 'server-name';
        server_name.innerHTML = name;
        server_name_container.appendChild(server_name);

        var server_status = document.createElement('span');
        server_status.classList.add('server-indicator');
        switch (status) {
            case 0:
                server_status.classList.add('bg-red-600');
                break;

            case 1:
                server_status.classList.add('bg-green-600');
                break;
        
            default:
                server_status.classList.add('bg-gray-500');
                break;
        }
        server_info.appendChild(server_status);

        console.log(name, status);
    }
}

function openDiscordPopup(){
    document.getElementById('discord_popup').style.display = 'block';
}

document.getElementById('mcss_discord').addEventListener('click', function () {
    openDiscordPopup();
});

document.getElementById('discord_popup_close').addEventListener('click', function () {
    document.getElementById('discord_popup').style.display = 'none';
});

document.getElementById('discord_popup_confirm').addEventListener('click', function () {
    document.getElementById('discord_popup').style.display = 'none';
    window.open('https://www.mcserversoft.com/discord', '_blank');
});

document.getElementById('logout').addEventListener('click', function () {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
});