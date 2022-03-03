import './dash.css'
import './server.css'

var api_url = localStorage.getItem('api_url');
var token = localStorage.getItem('token');
var server_guild = getUrlParameter('server');

console.log(server_guild);

var console_element = document.getElementById('console');

function getUrlParameter(name) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(name);
};

function newMessage(text, color){
    var div = document.createElement('div');
    div.className = 'console-message';
    console_element.appendChild(div);

    var prefix = document.createElement('span');
    prefix.className = 'console-prefix';
    prefix.innerHTML = '';
    div.appendChild(prefix);

    var message = document.createElement('span');
    message.innerHTML = text;
    switch (color) {
        case 'default':
            
            break;
        
        case 'WARN':
            message.classList.add('text-yellow-500');
            break;
        
        case 'ERRO':
            message.classList.add('text-red-500');
            break;
    
        default:
            break;
    }

    if(message.innerHTML.includes('[MCSS]')){
        message.classList.add('text-green-600');
    }
    div.appendChild(message);

    console_element.scrollTop = console_element.scrollHeight + console_element.clientHeight;
}

function loadError(){
    // var message = ['-----[ Error ]-----', 'Because of the limitations of the MCSS API there is no way to view console. However you can still run commands using the input below.', 'For updates you can join the MCSS discord <a href="https://www.mcserversoft.com/discord">here</a>']

    // for(var i=0; i<message.length; i++){
    //     newMessage(message[i], 'error');
    // }
}

loadError();

document.getElementById('console_input').addEventListener('keydown', function(e){
    if(e.key == 'Enter'){
        var command = this.value;
        if(command == ''){
            return;
        }
        if(document.getElementById('chat_check').checked){
            command = 'say ' + command;
        }

        $.ajax({
            url: api_url + '/api/server/execute/command',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            data: JSON.stringify({
                Guid: server_guild,
                Command: command
            }),
            dataType: 'JSON'
        });
        this.value = '';
        console.log(command);

        // if(command.startsWith('say ')){
        //     newMessage('[Server] ' + command.substring(4), 'default');
        // }else{
        //     newMessage(command, command.substring(10, 14));
        // }
    }
});

// $.ajax({
//     url: api_url + '/api/server',
//     type: 'GET',
//     headers: {
//         'Authorization': 'Bearer ' + token
//     },
//     data: {
//         Guid: server_guild,
//         Action: 'Start'
//     },
//     body: JSON.stringify({
//         Guid: server_guild,
//         Action: 'Start'
//     }),
//     dataType: 'JSON',
//     success: function(data){
//         console.log(data);
//     }
// });

function removeAllColorClasses(){
    var controls = document.getElementById('controls');
    controls.classList.remove('border-pink-700');
    controls.classList.remove('border-green-700');
    controls.classList.remove('border-yellow-700');
}

function updateStatus(){
    $.ajax({
        url: api_url + '/api/servers',
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function(data){
            for(var i=0; i<data.length; i++){
                if(data[i].Guid == server_guild){
                    var controls = document.getElementById('controls');
                    removeAllColorClasses();
                    switch (data[i].Status){
                        case 0:
                            controls.classList.add('border-pink-700');
                            break;
                        
                        case 1:
                            controls.classList.add('border-green-700');
                            break;
    
                        case 3:
                            controls.classList.add('border-yellow-700');
                        default:
                            break;
                    }
                    console.log(data[i].Status);
                }
            }
        }
    });
}

var currentConsole = [];

function updateConsole(){
    $.ajax({
        url: api_url + '/api/server/console',
        type: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        data: JSON.stringify({
            Guid: server_guild,
            AmmountOfLines: 50,
            Reversed: false
        }),
        dataType: 'JSON',
        success: function(data){
            console.log(data);
            for(var i=0; i<data.length; i++){
                if(currentConsole.includes(data[i])){
                    continue;
                }
                currentConsole.push(data[i]);
                newMessage(data[i], data[i].substring(10, 14));
            }
        }
    });
}

function performServerAction(action){
    $.ajax({
        url: api_url + '/api/server/execute/action',
        type: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        data: JSON.stringify({
            Guid: server_guild,
            Action: action
        }),
        dataType: 'JSON',
        success: function(data){
            updateStatus();
        }
    });
}

setInterval(updateStatus, 1000);

setInterval(updateConsole, 1000);

document.getElementById('server_start_btn').addEventListener('click', function(){
    performServerAction('1');
});

document.getElementById('server_stop_btn').addEventListener('click', function(){
    performServerAction('2');
});

document.getElementById('server_restart_btn').addEventListener('click', function(){
    performServerAction('3');
});

document.getElementById('server_kill_btn').addEventListener('click', function(){
    performServerAction('4');
});

document.getElementById('logout').addEventListener('click', function () {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
});