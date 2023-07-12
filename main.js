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
  // Получаем текущий список постов из localStorage
  var posts = JSON.parse(localStorage.getItem('posts')) || [];

  // Создаем объект с данными поста
  var post = {
    name: name,
    url: url,
    messageText: messageText
  };

  // Добавляем новый пост в список
  posts.push(post);

  // Сохраняем обновленный список постов в localStorage
  localStorage.setItem('posts', JSON.stringify(posts));
}

function loadPostsFromLocalStorage() {
  var posts = JSON.parse(localStorage.getItem('posts')) || [];

  var messagesDiv = document.getElementById('messages');
  messagesDiv.innerHTML = ''; // Очищаем содержимое перед загрузкой постов

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

    messagesDiv.appendChild(postDiv);
  });
}

// Функция для отправки сообщения в Telegram
function sendTelegramMessage(name, url, message) {
  var telegramBotToken = '6392841364:AAE8PozN2Y6x0zbyjO8ei6KIRm-hUDcGyUo';
  var telegramChatId = '997616670';
  var telegramMessage = '\n' + name + '\n' + url + '\n' + message + '\n';

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

$('#mess_send').click(function () {
  var name = $('#name').val();
  var url = $('#url').val();
  var message = $('#messege').val();

  sendTelegramMessage(name, url, message);
  

  $('#name').val('');
  $('#url').val('');
  $('#messege').val('');
});

// Создаем WebSocket соединение
const ws = new WebSocket('ws://localhost:8080');

// Обработка входящих сообщений от WebSocket
ws.onmessage = function(event) {
  const messageData = JSON.parse(event.data);
  const text = messageData.text;
  const regex = /([^ \n]+) \n([^ \n]+) \n([^]+)/;
  const [, name, url, messageText] = text.match(regex);

  // Добавляем полученное сообщение в элемент с id "messages"
  const messagesDiv = document.getElementById('messages');
  messagesDiv.innerHTML += `<div class="img">
      <img title="${name}" src="${url}" alt="">
      <span>${messageText}</span>
  </div>`;

  // Сохраняем сообщение в localStorage
  savePostToLocalStorage(name, url, messageText);
};

// При загрузке страницы загружаем посты из localStorage
window.onload = function() {
  loadPostsFromLocalStorage();
};
