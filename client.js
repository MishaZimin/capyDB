// client.js
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

window.onload = function () {
  let preloader = document.getElementById("preloader");
  preloader.classList.add("hide-preloader");
  setInterval(function () {
    preloader.classList.add("preloader-hidden");
  }, 990);
};

$(document).ready(function () {
  $("#preloader").fadeOut(2000);
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

function handleLike(button) {
  var counter = button.nextElementSibling;
  var count = parseInt(counter.innerText) || 0;

  if (button.classList.contains("liked")) {
    counter.innerText = count - 1;
    button.classList.remove("liked");
    updateLikeCount(button.closest(".post").id, count - 1);

    var postId = button.closest(".post").id;
    var likedPosts = getLikedPostsFromLocalStorage();
    var index = likedPosts.indexOf(postId);
    if (index !== -1) {
      likedPosts.splice(index, 1);
      saveLikedPostsToLocalStorage(likedPosts);
    }
  } else {
    // Увеличиваем значение счетчика на 1 и обновляем его
    counter.innerText = count + 1;
    button.classList.add("liked");
    updateLikeCount(button.closest(".post").id, count + 1); // Обновляем значение счетчика лайков в localStorage

    // Сохраняем информацию о нажатии кнопки лайка в localStorage
    var postId = button.closest(".post").id;
    var likedPosts = getLikedPostsFromLocalStorage();
    likedPosts.push(postId);
    saveLikedPostsToLocalStorage(likedPosts);
  }
  loadPostsFromLocalStorage();
}

function savePostToLocalStorage(name, url, messageText, timestamp) {
  var posts = getPostsFromLocalStorage();

  var post = {
    id: Date.now().toString(),
    name: name,
    url: url,
    messageText: messageText,
    likes: 0,
    timestamp: timestamp,
  };

  posts.push(post);
  savePostsToLocalStorage(posts);
}

function updateLikeCount(postId, count) {
  var posts = getPostsFromLocalStorage();
  var postToUpdate = findPostById(posts, postId);

  if (postToUpdate) {
    postToUpdate.likes = count;
    savePostsToLocalStorage(posts);
  }
}

function findPostById(posts, postId) {
  return posts.find(function (post) {
    return post.id === postId;
  });
}

function getPostsFromLocalStorage() {
  return JSON.parse(localStorage.getItem("posts")) || [];
}

function savePostsToLocalStorage(posts) {
  localStorage.setItem("posts", JSON.stringify(posts));
}

function getLikedPostsFromLocalStorage() {
  return JSON.parse(localStorage.getItem("likedPosts")) || [];
}

function saveLikedPostsToLocalStorage(likedPosts) {
  localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
}

function loadPostsFromLocalStorage() {
  var posts = getPostsFromLocalStorage();

  // posts.sort(function(a, b) {
  //     return a.likes - b.likes;
  // }); // sort by likes count

  var messagesDiv = document.getElementById("messages");
  messagesDiv.innerHTML = "";

  posts.forEach(function (post) {
    var dateAndTime = formatTime(post.timestamp);
    var comments = getCommentsFromLocalStorage(post.id);

    var postHTML = `    
      <div class="post" id="${post.id}">
          <img class="post-img" src="${post.url}" alt="">
          <span class="messageText">${post.messageText}</span>
          <div class="like-section">
              <button class="like-button${
                post.likes > 0 ? " liked" : ""
              }" onclick="handleLike(this)">&#x2764;</button>
              <span class="like-counter">${post.likes}</span>
          </div>
          <div class="post-bottom">
              <span class="post-name">от: <b>${post.name}</b></span>
              <span class="post-time">${dateAndTime}</span>
          </div>

          <div class="comments">              
              <button class="collapse-button" onclick="toggleComments(${
                post.id
              })">
                  <b>Комментарии</b>  ${comments.length} 
              </button>
              <div class="comment-list" id="comments-${post.id}">
                  <div class="comment-container">
                      <!-- здесь будут комментарии -->
                  </div>
                  <div class="add-comment">
                      <input type="text-comment" id="comment-input-${
                        post.id
                      }" placeholder="комментарий">
                      
                      <button onclick="clearComments(${post.id})">             
                          &#10006;              
                      </button>

                      <button onclick="addComment(${
                        post.id
                      })">                      
                          &#10095; 
                      </button>
                  </div>
              </div>
              
          </div>
      </div>
      `;

    messagesDiv.insertAdjacentHTML("afterbegin", postHTML);
    var commentsDiv = document.getElementById(`comments-${post.id}`);
    commentsDiv.style.display = "none";
    //loadCommentsFromLocalStorage(post.id); // Загружаем комментарии для данного поста
  });
}

function scrollToBottom(postId) {
  var commentsDiv = document.getElementById(`comments-${postId}`);
  commentsDiv.scrollTop = commentsDiv.scrollHeight;
}

function clearComments(postId) {
  var commentsDiv = document.getElementById(`comments-${postId}`);
  commentsDiv.innerHTML = "";

  saveCommentsToLocalStorage(postId, []);
  //loadPostsFromLocalStorage(postId)
  loadCommentsFromLocalStorage(postId);
  commentsDiv.style.display = "none";
}

function toggleComments(postId) {
  var commentsDiv = document.getElementById(`comments-${postId}`);
  var commentContainer = document.getElementById(`comment-container-${postId}`);

  if (!commentContainer) {
    commentContainer = document.createElement("div");
    commentContainer.setAttribute("id", `comment-container-${postId}`);
    commentsDiv.appendChild(commentContainer);
  }

  if (
    commentsDiv.style.display === "none" ||
    commentsDiv.style.display === ""
  ) {
    commentContainer.innerHTML = "";
    loadCommentsFromLocalStorage(postId, commentContainer);
  } else {
    commentsDiv.style.display = "none";
  }
}

function isCommentValid(comment) {
  var banWords = ["бля", "хуй", "сук", "еба", "ебу", "пизд"];

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
    alert("введите коммент");
    return;
  }

  if (!isCommentValid(commentText)) {
    alert("пошел нахуй уебан");
    return;
  }

  if (commentText.length > 200) {
    alert("коммент слишком длинный, максимальная длина - 200 символов");
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

  var randomIndex = Math.floor(Math.random() * avatarUrls.length);
  var randomAvatarUrl = avatarUrls[randomIndex];

  var comments = getCommentsFromLocalStorage(postId);
  var commentId = Date.now().toString();
  var commentName = "@capybara";

  var comment = {
    id: commentId,
    name: commentName + commentId,
    likes: 0,
    text: commentText,
    avatar: randomAvatarUrl,
    timestamp: Math.floor(Date.now() / 1000),
  };

  comments.push(comment);
  saveCommentsToLocalStorage(postId, comments);

  commentInput.value = "";
  loadPostsFromLocalStorage(postId);
  loadCommentsFromLocalStorage(postId);
}

function getAvatarImage(avatarUrl) {
  return `<img src="${avatarUrl}" alt="Avatar">`;
}

function formatTime(timestamp) {
  var date = new Date(timestamp * 1000);
  var hours = date.getHours();
  var minutes = addLeadingZero(date.getMinutes());
  var day = addLeadingZero(date.getDate());
  var month = addLeadingZero(date.getMonth() + 1);

  var formattedDateAndTime = hours + ":" + minutes + " " + day + "/" + month;

  return formattedDateAndTime;
}

function addLeadingZero(number) {
  return number < 10 ? "0" + number : number;
}

function clearLocalStorage() {
  localStorage.removeItem("posts");
  localStorage.removeItem("likedPosts");
}

function getCommentsFromLocalStorage(postId) {
  var commentsKey = `comments_${postId}`;
  return JSON.parse(localStorage.getItem(commentsKey)) || [];
}

function saveCommentsToLocalStorage(postId, comments) {
  var commentsKey = `comments_${postId}`;
  localStorage.setItem(commentsKey, JSON.stringify(comments));
}

function loadCommentsFromLocalStorage(postId) {
  var comments = getCommentsFromLocalStorage(postId);
  var commentsDiv = document.getElementById(`comments-${postId}`);
  var addCommentDiv = document.querySelector(
    `#comments-${postId} .add-comment`
  );

  commentsDiv.innerHTML = "";

  comments.forEach(function (comment) {
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
    commentsDiv.insertAdjacentHTML("beforeend", commentHTML);
  });

  var addCommentHTML = `
      <div class="add-comment" id="comment-${postId}">
          <input type="text-comment" id="comment-input-${postId}" placeholder="комментарий">
          
          <button onclick="clearComments(${postId})">             
              &#10006;              
          </button>

          <button onclick="addComment(${postId})">                      
              &#10095; 
          </button>
      </div>
  `;

  commentsDiv.insertAdjacentHTML("afterbegin", addCommentHTML);

  commentsDiv.style.display = "block";
}

function getCommentCount(postId) {
  var comments = getCommentsFromLocalStorage(postId);
  return comments.length;
}

$("#mess_send").click(function () {
  var name = $("#name").val();
  var url = $("#url").val();
  var message = $("#messege").val();

  console.log(name, url, message);

  url = url.trim();

  if (name.length === 0) {
    alert("заполни Имя");
  }

  if (url.length < 10) {
    if (url.slice(0, 8) != "https://") {
      alert("нужен url!");
      return;
    }
  }

  if (message.length === 0) {
    alert("натыкай что-нибудь в тексте поста");
  }

  sendTelegramMessage(name, url, message);
  console.log(name, "|", url.slice(0, 5), "|", message);
  $("#name").val("");
  $("#url").val("");
  $("#messege").val("");
});

const ws = new WebSocket("wss://mud-accessible-factory.glitch.me/");

// const serverAddress = "ws://localhost:8080";
// const ws = new WebSocket(serverAddress);

ws.onopen = function () {
  console.log("WebSocket соединение установлено");
  ws.send("get_posts"); // Отправляем запрос на получение постов
};

ws.onmessage = function (event) {
  const postsdb = JSON.parse(event.data);

  console.log("Получены данные из сервера (ws.onmessage postsdb):", postsdb);
  let posts = [];

  try {
    postsdb.forEach(function (post) {
      const message = post.text;

      let name, url, messageText;

      const regex = /([^]+) \n([^ \n]+) \n([^]+)/;

      if (post.reply_to_message) {
        const replyMessage = post.reply_to_message;
        const replyText = replyMessage.text;

        [, name, url, messageText] = replyText.match(regex);
      } else {
        const matchResult = message.match(regex);
        if (matchResult) {
          [, name, url, messageText] = matchResult;
        }
      }

      var post = {
        id: post.date,
        name: name,
        url: url,
        messageText: messageText,
        likes: 0,
        timestamp: post.date,
      };

      posts.push(post);
    });
    console.log("Получены данные posts:", posts);
    loadPostsFromDB(posts);
  } catch (error) {
    console.error(
      "Ошибка при получении сообщения из tg (нужно обновить страницу хз че это):",
      error
    );
  }
};

function loadPostsFromDB(posts) {
  var messagesDiv = document.getElementById("messages");
  messagesDiv.innerHTML = "";

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
              }" onclick="handleLike(this)">&#x2764;</button>
              <span class="like-counter">${post.likes}</span>
          </div>
          <div class="post-bottom">
              <span class="post-name">от: <b>${post.name}</b></span>
              <span class="post-time">${dateAndTime}</span>
          </div>

          <div class="comments">              
              <button class="collapse-button" onclick="toggleComments(${
                post.id
              })">
                  <b>Комментарии</b>
              </button>
              <div class="comment-list" id="comments-${post.id}">
                  <div class="comment-container">
                      <!-- здесь будут комментарии -->
                  </div>
                  <div class="add-comment">
                      <input type="text-comment" id="comment-input-${
                        post.id
                      }" placeholder="комментарий">
                      
                      <button onclick="clearComments(${post.id})">             
                          &#10006;              
                      </button>

                      <button onclick="addComment(${
                        post.id
                      })">                      
                          &#10095; 
                      </button>
                  </div>
              </div>
              
          </div>
      </div>
      `;
    messagesDiv.insertAdjacentHTML("afterbegin", postHTML);
    var commentsDiv = document.getElementById(`comments-${post.id}`);
    commentsDiv.style.display = "none";
  });
}

// window.onload = function() {
//     // loadPostsFromLocalStorage();
//     // clearLocalStorage();
// }

window.onload = function () {
  document.body.classList.add("loaded_hiding");
  window.setTimeout(function () {
    document.body.classList.add("loaded");
    document.body.classList.remove("loaded_hiding");
  }, 500);
};

// const socket = new WebSocket('ws://localhost:8080');

// socket.addEventListener('open', async (event) => {
//   console.log('WebSocket соединение установлено');
//   socket.send('get_posts'); // Отправляем запрос на получение постов
// });

// socket.addEventListener('message', async (event) => {
//   const posts = JSON.parse(event.data);
// //   console.log('Получены данные из сервера (socket):', posts);
// //     console.log(posts);
//   // Обновите интерфейс вашего сайта для отображения полученных постов
// //   loadPostsFromDB(posts);
// });
