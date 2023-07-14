function slowScroll(id) {
    $("html, body").animate({
        scrollTop: $(id).offset().top
    }, 500);
}

$(document).on("scroll", function () {
    if ($(window).scrollTop() === 0) {
        $("header").removeClass("fixed");
    } else {
        $("header").attr("class", "fixed");
    }
});

function savePostToLocalStorage(name, url, messageText) {
    var posts = JSON.parse(localStorage.getItem('posts')) || [];
    var post = {
        name: name,
        url: url,
        messageText: messageText
    };
    posts.push(post);
    localStorage.setItem('posts', JSON.stringify(posts));
}

function loadPostsFromLocalStorage() {
    var posts = JSON.parse(localStorage.getItem('posts')) || [];
    var messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = '';
    posts.forEach(function(post) {
        var postDiv = document.createElement('div');
        postDiv.classList.add('img');
        var img = document.createElement('img');
        img.title = post.name;
        img.src = post.url;
        img.alt = '';
        var span = document.createElement('span');
        span.innerText = post.messageText;
        postDiv.appendChild(img);
        postDiv.appendChild(span);
        messagesDiv.prepend(postDiv);
    });
}

function sendTelegramMessage(name, url, message) {
    var telegramBotToken = '6392841364:AAE8PozN2Y6x0zbyjO8ei6KIRm-hUDcGyUo';
    var telegramChatId = '997616670';
    var telegramMessage = '\n' + name + ' ' + '\n' + url + ' ' + '\n' + message + '\n';
    $.ajax({
        url: 'https://api.telegram.org/bot' + telegramBotToken + '/sendMessage',
        method: 'POST',
        data: {
        chat_id: telegramChatId,
        text: telegramMessage
        },
        success: function (response) {
        console.log('Сообщение отправлено в Telegram');
        },
        error: function (error) {
        console.log('Ошибка при отправке сообщения в Telegram');
        }
    });
}

function clearLocalStorage() {
    localStorage.removeItem('posts');
}

$('#mess_send').click(function () {
    var name = $('#name').val();
    var url = $('#url').val();
    var message = $('#messege').val();

    sendTelegramMessage(name, url, message);

    $('#name').val('');
    $('#url').val('');
    $('#messege').val('');
});

const ws = new WebSocket('ws://localhost:8080');

ws.onmessage = function(event) {
    const messageData = JSON.parse(event.data);
    const message = messageData.text;

    let name, url, messageText;

    // Проверяем наличие поля reply_to_message в сообщении
    if (messageData.reply_to_message) {
        const replyMessage = messageData.reply_to_message;
        const replyText = replyMessage.text;
        const regex = /([^ \n]+) \n([^ \n]+) \n([^]+)/;
        [, name, url, messageText] = replyText.match(regex);
    } else {
        const regex = /([^ \n]+) \n([^ \n]+) \n([^]+)/;
        [, name, url, messageText] = message.match(regex);
    }

    const messagesDiv = document.getElementById('messages');
    messagesDiv.insertAdjacentHTML('afterbegin', 
    `
    <div class="img">
        <img title="${name}" src="${url}" alt="">
        <span>${messageText}</span>
    </div>
    `);

    savePostToLocalStorage(name, url, messageText);
};
  
window.onload = function() {
    loadPostsFromLocalStorage();
    //clearLocalStorage();
};
  