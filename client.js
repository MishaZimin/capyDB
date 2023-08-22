// client.js
const ws = new WebSocket("wss://mud-accessible-factory.glitch.me/");

// const serverAddress = "ws://localhost:3000";
// const ws = new WebSocket(serverAddress);

function slowScroll(id) {
  $("html, body").animate(
    {
      scrollTop: $(id).offset().top,
    },
    500
  );
}

$(document).on("scroll", function () {
  if ($(window).scrollTop() === 0) {
    $("header").removeClass("fixed");
  } else {
    $("header").addClass("fixed");
  }
});

function sendTelegramMessage(name, url, message) {
  var telegramBotToken = "6392841364:AAE8PozN2Y6x0zbyjO8ei6KIRm-hUDcGyUo";
  var telegramChatId = "997616670";

  var telegramMessage =
    "\n" + name + " " + "\n" + url + " " + "\n" + message + "\n";

  $.ajax({
    url: "https://api.telegram.org/bot" + telegramBotToken + "/sendMessage",
    method: "POST",
    data: {
      chat_id: telegramChatId,
      text: telegramMessage,
    },
    success: function (response) {
      console.log("Сообщение отправлено в Telegram");
    },
    error: function (error) {
      console.log("Ошибка при отправке сообщения в Telegram");
    },
  });
}

function handleLike(button, postId) {
  if (true) {
    var likeCounter = button.nextElementSibling;
    var currentLikes = parseInt(likeCounter.textContent);
    likeCounter.textContent = currentLikes + 1;

    ws.send(JSON.stringify({ action: "like", postId: postId, type: "add" }));

    // } else {
    //   ws.send(JSON.stringify({ action: "like", postId: postId, type: "add" }));
  }
  // location.reload();
}

function scrollToBottom(postId) {
  var commentsDiv = document.getElementById(`comments-${postId}`);
  commentsDiv.scrollTop = commentsDiv.scrollHeight;
}

function toggleComments(postId) {
  var commentsDiv = document.getElementById(`comments-${postId}`);
  var commentAddDiv = document.getElementById(`add-comment-${postId}`);
  // var commentContainer = document.getElementById(`comment-container-${postId}`);

  // if (!commentContainer) {
  //   commentContainer = document.createElement("div");
  //   commentContainer.setAttribute("id", `comment-container-${postId}`);
  //   commentsDiv.appendChild(commentContainer);
  // }

  if (
    commentsDiv.style.display === "none" &&
    commentAddDiv.style.display === "none"
  ) {
    commentsDiv.style.display = "block";
    commentAddDiv.style.display = "block";
    // Здесь добавьте функциональность, которая должна выполняться всегда при нажатии
  } else {
    commentsDiv.style.display = "none";
    commentAddDiv.style.display = "none";
  }
}

function isCommentValid(comment) {
  var banWords = ["fuck"];

  for (var i = 0; i < banWords.length; i++) {
    if (comment.indexOf(banWords[i]) !== -1) {
      return false;
    }
  }
  return true;
}

// Функция добавления комментария
function addComment(postId) {
  var commentInput = document.getElementById(`comment-input-${postId}`);
  var commentText = commentInput.value.trim();

  if (!commentText) {
    alert("Введите комментарий");
    return;
  }

  if (!isCommentValid(commentText)) {
    alert("Комментарий содержит недопустимые слова");
    return;
  }

  if (commentText.length > 200) {
    alert("Комментарий слишком длинный, максимальная длина - 200 символов");
    return;
  }

  var words = commentText.split(" ");
  var isInvalidWordLength = words.some(function (word) {
    return word.length > 18;
  });

  if (isInvalidWordLength) {
    alert("какое-то слово в комменте длинне 18 символов");
    return;
  }

  var avatarUrls = getAvatarUrl();

  var randomIndex = Math.floor(Math.random() * avatarUrls.length);
  var randomAvatarUrl = avatarUrls[randomIndex];

  var commentId = Date.now().toString();
  var commentName = "@capybara";

  var comment = {
    id: commentId,
    name: getLS("username"),
    likes: 0,
    text: commentText,
    avatar: getLS("url"),
    timestamp: Math.floor(Date.now() / 1000),
  };

  ws.send(JSON.stringify({ action: "add_comment", postId, comment }));

  commentInput.value = "";
}

function formatTime(timestamp) {
  function addLeadingZero(number) {
    return number < 10 ? "0" + number : number;
  }

  var date = new Date(timestamp * 1000);
  var hours = date.getHours();
  var minutes = addLeadingZero(date.getMinutes());
  var day = addLeadingZero(date.getDate());
  var month = addLeadingZero(date.getMonth() + 1);

  var formattedDateAndTime = hours + ":" + minutes + " " + day + "/" + month;

  return formattedDateAndTime;
}

function clearLocalStorage() {
  localStorage.removeItem("posts");
  localStorage.removeItem("likedPosts");
}

$("#mess_send").click(function () {
  var name = $("#name").val();
  var url = $("#url").val();
  var message = $("#messege").val();

  //console.log(name, url, message);

  url = url.trim();

  if (name.length === 0) {
    alert("напиши имя");
    return;
  }
  if (url.length < 10) {
    if (url.slice(0, 8) != "https://") {
      alert("нужен url!");
      return;
    }
  }
  if (message.length === 0) {
    alert("натыкай что-нибудь в тексте поста");
    return;
  }

  sendTelegramMessage(name, url, message);
  // console.log(name, "|", url.slice(0, 5), "|", message);

  $("#name").val("");
  $("#url").val("");
  $("#messege").val("");
});

$("#registration").click(function () {
  var username = $("#username").val();
  var password = $("#password").val();
  var mail = $("#mail").val();
  var url = $("#url").val();

  //console.log(username, password, mail);

  password = password.trim();
  url = url.trim();
  mail = mail.trim();

  if (username.length === 0) {
    alert("напиши имя");
    return;
  }
  if (password.length === 0) {
    alert("нужен пароль");
    return;
  }

  if (url.length < 10) {
    if (url.slice(0, 8) != "https://") {
      alert("нужен url!");
      return;
    }
  }

  // Создайте объект данных для отправки на сервер
  var userData = {
    username: username,
    password: password,
    mail: mail,
    url: url,
  };

  ws.send(JSON.stringify({ action: "registration", userData }));

  //sendTelegramMessage(username, password, mail);
  // console.log(username, "|", password.slice(0, 5), "|", mail);

  $("#username").val("");
  $("#password").val("");
  $("#mail").val("");
  $("#url").val("");
});

$("#sign_in").click(function () {
  var username = $("#username-sign-in").val();
  var password = $("#password-sign-in").val();

  password = password.trim();

  if (username.length === 0) {
    alert("напиши имя");
    return;
  }

  // Создайте объект данных для отправки на сервер
  var signIn = {
    username: username,
    password: password,
  };

  ws.send(JSON.stringify({ action: "sign_in", signIn }));

  //sendTelegramMessage(username, password, mail);
  // console.log(username, "|", password.slice(0, 5), "|", mail);

  $("#username-sign-in").val("");
  $("#password-sign-in").val("");

  // location.reload();
});

$("#exit").click(function () {
  // var loggedIn = localStorage.getItem("loggedIn");
  // var username = localStorage.getItem("username");
  // console.log(loggedIn, username);
  localStorage.setItem("loggedIn", "false");
  localStorage.setItem("username", "none");
  localStorage.setItem(
    "url",
    "https://avatars.mds.yandex.net/i?id=cde779dc1051c473acd14df966bc038f9a42fccf-8076535-images-thumbs&n=13"
  );
  // console.log(loggedIn, username);

  location.reload();
  // console.log("успешный выход из аккаунта");
});

// let isWebSocketOpen = false;

ws.onopen = function () {
  console.log("WebSocket соединение установлено");
  // // isWebSocketOpen = true;

  // // Проверьте, вошел ли пользователь, используя информацию из localStorage

  console.log(localStorage.getItem("loggedIn"));
  console.log(localStorage.getItem("username"));
  console.log(localStorage.getItem("url"));

  // if (loggedIn === "true" && username) {
  //   // Если пользователь успешно вошел, установите имя пользователя где-то на странице
  //   // Например, в каком-то элементе с id "user-profile"

  //   document.getElementById("user-profile").textContent = username;
  //   ws.send(JSON.stringify({ action: "get_posts" }));

  //   //location.reload();
  // }

  if (checkLocalStorage()) {
    document.getElementById("user-profile").textContent = getLS("username");
    ws.send(JSON.stringify({ action: "get_posts" }));
  }
  // Отправляем запрос на получение постов
};

ws.onmessage = function (event) {
  // if (!isWebSocketOpen) {
  //   // Если соединение не установлено, игнорируем сообщения
  //   return;
  // }

  if (event.data[0] === "[") {
    const postsdb = JSON.parse(event.data);

    //console.log("Получены данные из сервера (ws.onmessage postsdb):", postsdb);

    try {
      console.log("Получены данные из базы данных:", postsdb);
      loadPostsFromDB(postsdb);
    } catch (error) {
      console.error("Ошибка при получении данных из базы данных:", error);
    }
  } else {
    console.log(event.data);

    const data = JSON.parse(event.data);
    if (data.action === "successful_login") {
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("username", data.username);
      localStorage.setItem("url", data.url);

      var loggedIn = localStorage.getItem("loggedIn");
      var username = localStorage.getItem("username");
      var url = localStorage.getItem("url");
      console.log(loggedIn, username, url);
      location.reload();
      ws.send(JSON.stringify({ action: "get_posts" }));
    } else if (data.action === "password_incorrect") {
      alert("неверный пароль");
      return;
    } else if (data.action === "login_incorrect") {
      alert("пользователя с таким именем нет");
      return;
    }
  }
};

function loadPostsFromDB(posts) {
  var messagesDiv = document.getElementById("messages");
  messagesDiv.innerHTML = "";

  var loader = document.getElementById("loader");
  loader.style.display = "block"; // Показать лоадер

  posts.forEach(function (post) {
    var dateAndTime = formatTime(post.timestamp);
    // Создайте HTML-код для отображения каждого поста и добавьте его в messagesDiv
    var postHTML = `    
      <div class="post" id="${post.id}">
          <img class="post-img" src="${post.url}" alt="">
          <span class="messageText">${post.messageText}</span>
          <div class="like-section">
              <button class="like-button${
                post.likes > 0 ? " liked" : ""
              }" onclick="handleLike(this, ${post.id})">&#x2764;</button>
              <span class="like-counter">${post.likes}</span>
          </div>
          <div class="post-bottom">
              <span class="post-name">от: <b>${post.name}</b></span>
              <span class="post-time">${dateAndTime}</span>
          </div>

          <div class="comments">              
              <button class="collapse-button active" onclick="toggleComments(${
                post.id
              })">
                  <b>Комментарии</b> ${post.comments.length}
              </button>
              <div class="comment-list" id="comments-${post.id}">
               
                  <div class="comment-container">
                      <!-- здесь будут комментарии -->
                  </div>                 
              </div>
              <div class="add-comment" id="add-comment-${post.id}">
                  <input type="text-comment" id="comment-input-${
                    post.id
                  }" placeholder="Комментарий">
                  
                  <button onclick="addComment(${
                    post.id
                  })">                      
                      &#10095; 
                  </button>
             
              </div>
          </div>
      </div>
      `;

    messagesDiv.insertAdjacentHTML("afterbegin", postHTML);

    var commentsDiv = document.getElementById(`comments-${post.id}`);
    var commentAddDiv = document.getElementById(`add-comment-${post.id}`);
    var commentContainer = commentsDiv.querySelector(".comment-container");

    post.comments.forEach(function (comment) {
      var commentHTML = `
                  <div class="comment" id="comment-${comment.id}">
                      <div class="avatar">
                          <img src="${comment.avatar}" alt="Avatar">
                      </div>
                      <span class="comment-text">
                          <p class="comment-name">${comment.name}</p>
                          ${comment.text}
                      </span>
                      <span class="comment-right">
                          <p class="comment-time">
                              ${formatTime(comment.timestamp)}
                          </p>
                      </span>
                  </div>
              `;

      commentContainer.insertAdjacentHTML("afterbegin", commentHTML);
    });

    commentsDiv.style.display = "none";
    commentAddDiv.style.display = "none";
  });

  loader.style.display = "none";
}

window.onload = function () {
  document.body.classList.add("loaded_hiding");
  window.setTimeout(function () {
    document.body.classList.add("loaded");
    document.body.classList.remove("loaded_hiding");
  }, 500);

  // if (!isWebSocketOpen) {
  //   // Если соединение не установлено, игнорируем сообщения
  //   return;
  // }
};

function checkLocalStorage() {
  // Проверьте, вошел ли пользователь, используя информацию из localStorage
  var loggedIn = localStorage.getItem("loggedIn");
  var username = localStorage.getItem("username");
  var url = localStorage.getItem("url");

  // console.log(localStorage.getItem("loggedIn"));
  // console.log(localStorage.getItem("username"));
  // console.log(localStorage.getItem("url"));

  return loggedIn === "true" && username && url;
}

function getLS(object) {
  return localStorage.getItem(object);
}

function getAvatarUrl() {
  var avatarUrls = [
    "https://avatars.mds.yandex.net/i?id=cde779dc1051c473acd14df966bc038f9a42fccf-8076535-images-thumbs&n=13",
    "https://avatars.mds.yandex.net/i?id=e59519547ca3227798a2638fe587cbb80951a970-9181363-images-thumbs&n=13",
    "https://avatars.mds.yandex.net/i?id=c3774dd0d3b48ce898170876d05252adb2f92b33-8901029-images-thumbs&n=13",
    "https://avatars.mds.yandex.net/i?id=263c28e8d8eceea70895c904f880e212b64928c2-8294270-images-thumbs&n=13",
    "https://avatars.mds.yandex.net/i?id=78d4ed45fafe9f6cedb2934f0fcc938cd1d52a20-9050759-images-thumbs&n=13",
    "https://avatars.mds.yandex.net/i?id=22efaaa843cb7bb474908ebac7158661425bca3e-9065974-images-thumbs&n=13",
    "https://avatars.mds.yandex.net/i?id=8d20c0d271e9053a2ca62b412c4a8dc56cc6515f-5246350-images-thumbs&n=13",
    "https://avatars.mds.yandex.net/i?id=446edff486f12589defc380337cedb73969b09d3-9589172-images-thumbs&n=13",
    "https://avatars.mds.yandex.net/i?id=4048803598b8161035afd54a2222509fa398a7c9-8427413-images-thumbs&n=13",
    "https://avatars.mds.yandex.net/i?id=edae7179de7094050a8f791949a7c6856aadc8e7-9699538-images-thumbs&n=13",
    "https://avatars.mds.yandex.net/i?id=766f85e0244cca60524f0d952422acee862b383f-8564741-images-thumbs&n=13",
    "https://avatars.mds.yandex.net/i?id=444d3714437929a22d186b8a702e1967cc7b6e70-9101109-images-thumbs&n=13",
    "https://avatars.mds.yandex.net/i?id=c8bc077579879db179364499f6bef2bd398176aa-9182438-images-thumbs&n=13",
    "https://avatars.mds.yandex.net/i?id=08013bbb6ae10bcd9d96d61e307922cbf78da35e-9148257-images-thumbs&n=13",
    "https://avatars.mds.yandex.net/i?id=c390dedd62eb9bbf23b7159c3992134781ba5a32-4810024-images-thumbs&ref=rim&n=33&w=176&h=206",
    "https://avatars.mds.yandex.net/i?id=6cb0327bc51493453930f62b3c641c5434060ef0-8438571-images-thumbs&ref=rim&n=33&w=164&h=206",
    "https://avatars.mds.yandex.net/i?id=ac76d928c8d906448464f6951514df21475653e7-9152516-images-thumbs&n=13",
    "https://avatars.mds.yandex.net/i?id=8eac33c1cabd16c1dd54fc848187149f41372189-9700546-images-thumbs&n=13",
  ];

  return avatarUrls;
}
