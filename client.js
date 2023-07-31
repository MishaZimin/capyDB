// client.js
function slowScroll(id) {
    $("html, body").animate({
        scrollTop: $(id).offset().top
    }, 500);
}

$(document).on("scroll", function () {
    if ($(window).scrollTop() === 0) {
        $("header").removeClass("fixed");
    } else {
        $("header").addClass("fixed");
    }
});


// function loadPostsFromServer() {
//     $.ajax({
//       url: '/notes',
//       method: 'GET',
//       success: function (response) {
//         var posts = JSON.parse(response);
//         // Обработка полученных данных
//         posts.forEach(function(post) {
//             var dateAndTime = formatTime(post.timestamp);
    
//             var postHTML = `
//             <div class="img" id="${post.id}">
//                 <img src="${post.url}" alt="">
//                 <span class="messageText">${post.messageText}</span>
//                 <div class="like-section">
//                     <button class="like-button${post.likes > 0 ? ' liked' : ''}" onclick="handleLike(this)">&#x2764;</button>
//                     <span class="like-counter">${post.likes}</span>
//                 </div>
//                 <div class="post-bottom">
//                     <span class="post-name">Переслано от ${post.name}</span>
//                     <span class="post-time">${dateAndTime}</span>
//                 </div>
//             </div>
//             `;
    
//             messagesDiv.insertAdjacentHTML('afterbegin', postHTML);
//         });
//       },
//       error: function (error) {
//         console.log('Ошибка при загрузке постов:', error.statusText);
//       },
//     });
//   }
  
//   $(document).ready(function () {
//     loadPostsFromServer();
//   });

function sendTelegramMessage(name, url, message) {
    var telegramBotToken = '6392841364:AAE8PozN2Y6x0zbyjO8ei6KIRm-hUDcGyUo';
    var telegramChatId = '997616670';

    var telegramMessage = '\n' + name + ' ' + '\n' + url + ' ' + '\n' + message + '\n';

    $.ajax({
        url: 'https://api.telegram.org/bot' + telegramBotToken + '/sendMessage',
        method: 'POST',
        data: {
            name: name,
            url: url,
            messageText: message
        },
        success: function (response) {
            console.log('Сообщение отправлено в Telegram');
        },
        error: function (error) {
            console.log('Ошибка при отправке сообщения в Telegram');
        }
    });
}

function handleLike(button) {
    var counter = button.nextElementSibling;
    var count = parseInt(counter.innerText) || 0;

    if (button.classList.contains("liked")) {
        counter.innerText = count - 1;
        button.classList.remove("liked");
        updateLikeCount(button.closest(".img").id, count - 1);

        var postId = button.closest(".img").id;
        var likedPosts = getLikedPostsFromLocalStorage();
        var index = likedPosts.indexOf(postId);
        if (index !== -1) {
            likedPosts.splice(index, 1);
            //saveLikedPostsToLocalStorage(likedPosts);
            
        }
    } else {
        // Увеличиваем значение счетчика на 1 и обновляем его
        counter.innerText = count + 1;
        button.classList.add("liked");
        updateLikeCount(button.closest(".img").id, count + 1); // Обновляем значение счетчика лайков в localStorage

        // Сохраняем информацию о нажатии кнопки лайка в localStorage
        var postId = button.closest(".img").id;
        var likedPosts = getLikedPostsFromLocalStorage();
        likedPosts.push(postId);
        //saveLikedPostsToLocalStorage(likedPosts);
        
    }
    //loadPostsFromServer();
}

function savePostToServer(name, url, messageText, timestamp) {
    var post = {
      name: name,
      url: url,
      messageText: messageText,
      likes: 0,
      timestamp: timestamp,
    };
  
    $.ajax({
      url: 'http://localhost:3000/api/posts', // Замените на точку входа вашего сервера для сохранения постов
      method: 'POST',
      data: post,
      success: function (response) {
        console.log('Пост успешно сохранен в MongoDB');
      },
      error: function (error) {
        console.log('Ошибка при сохранении поста в MongoDB:', error.statusText);
      },
    });
  }


function updateLikeCount(postId, count) {
    var postToUpdate = findPostById(postId);
  
    if (postToUpdate) {
      postToUpdate.likes = count;
      $.ajax({
        url: `http://localhost:3000/api/posts/${postId}`, // Замените на точку входа вашего сервера для обновления поста
        method: 'PUT',
        data: postToUpdate,
        success: function (response) {
          console.log('Количество лайков поста успешно обновлено');
        },
        error: function (error) {
          console.log('Ошибка при обновлении количества лайков поста:', error.statusText);
        },
      });
    }
  }

function findPostById(posts, postId) {
    return posts.find(function(post) {
      return post.id === postId;
    });
}

function getPostsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('posts')) || [];
}

function savePostsToLocalStorage(posts) {
    localStorage.setItem('posts', JSON.stringify(posts));
}

function getLikedPostsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('likedPosts')) || [];
}

function saveLikedPostsToLocalStorage(likedPosts) {
    localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
}

function getPostsFromServer() {
    // Загрузка постов из MongoDB
    $.ajax({
        url: 'http://localhost:3000/api/posts',
        method: 'GET',
        success: function (response) {
            var posts = response;
            // Обработка полученных данных
            var messagesDiv = document.getElementById('messages');
            messagesDiv.innerHTML = '';
    
            posts.forEach(function (post) {
                var dateAndTime = formatTime(post.timestamp);
    
                var postHTML = `
                <div class="img" id="${post._id}">
                    <img class="post-img" src="${post.url}" alt="">
                    <span class="messageText">${post.messageText}</span>
                    <div class="like-section">
                        <button class="like-button${post.likes > 0 ? ' liked' : ''}" onclick="handleLike(this)">&#x2764;</button>
                        <span class="like-counter">${post.likes}</span>
                    </div>
                    <div class="post-bottom">
                        <span class="post-name">от: <b>${post.name}</b></span>
                        <span class="post-time">${dateAndTime}</span>
                    </div>
        
                    <div class="comments">              
                        <button class="collapse-button" onclick="toggleComments('${post._id}')">Комментарии</button><br>
                        <div class="comment-list" id="comments-${post._id}">
                            <!-- здесь будут комментарии -->
                        </div>
                        <div class="add-comment">
                            <input type="text" id="comment-input-${post._id}" placeholder="Ваш комментарий">
                            
                            <button onclick="clearComments('${post._id}')">             
                                &#10006;              
                            </button>
        
                            <button onclick="addComment('${post._id}')">
                                &#10095; 
                            </button>
                        </div>
                    </div>
                </div>
                `;
    
                messagesDiv.insertAdjacentHTML('afterbegin', postHTML);
            });
        },
        error: function (error) {
            console.log('Ошибка при загрузке постов из MongoDB:', error.statusText);
        },
    });
}

// Загрузка постов из MongoDB при загрузке страницы
$(document).ready(function () {
    loadPostsFromServer();
});

function loadPostsFromServer() {
    $.ajax({
      url: 'http://localhost:3000/api/posts', // Измените на соответствующий URL вашего сервера
      method: 'GET',
      success: function (response) {
        var posts = response; // Полученные данные из MongoDB
        // Обработка полученных данных
        var messagesDiv = document.getElementById('messages');
        messagesDiv.innerHTML = '';
  
        posts.forEach(function (post) {
          var dateAndTime = formatTime(post.timestamp);
  
          var postHTML = `
          <div class="img" id="${post._id}">
              <img class="post-img" src="${post.url}" alt="">
              <span class="messageText">${post.messageText}</span>
              <div class="like-section">
                  <button class="like-button${post.likes > 0 ? ' liked' : ''}" onclick="handleLike(this)">&#x2764;</button>
                  <span class="like-counter">${post.likes}</span>
              </div>
              <div class="post-bottom">
                  <span class="post-name">от: <b>${post.name}</b></span>
                  <span class="post-time">${dateAndTime}</span>
              </div>
  
              <div class="comments">              
                  <button class="collapse-button" onclick="toggleComments('${post._id}')">Комментарии</button><br>
                  <div class="comment-list" id="comments-${post._id}">
                      <!-- здесь будут комментарии -->
                  </div>
                  <div class="add-comment">
                      <input type="text" id="comment-input-${post._id}" placeholder="Ваш комментарий">
                      
                      <button onclick="clearComments('${post._id}')">             
                          &#10006;              
                      </button>
  
                      <button onclick="addComment('${post._id}')">
                          &#10095; 
                      </button>
                  </div>
              </div>
          </div>
          `;
  
          messagesDiv.insertAdjacentHTML('afterbegin', postHTML);
        });
      },
      error: function (error) {
        console.log('Ошибка при загрузке постов:', error.statusText);
      },
    });
}
  

// function loadPostsFromServer() {
//     var posts = getPostsFromLocalStorage();

//     posts.sort(function(a, b) {
//         return a.likes - b.likes;
//     });

//     var messagesDiv = document.getElementById('messages');
//     messagesDiv.innerHTML = '';

//     posts.forEach(function(post) {
//         var dateAndTime = formatTime(post.timestamp);

//         var postHTML = `
//         <div class="img" id="${post.id}">
//             <img class="post-img" src="${post.url}" alt="">
//             <span class="messageText">${post.messageText}</span>
//             <div class="like-section">
//                 <button class="like-button${post.likes > 0 ? ' liked' : ''}" onclick="handleLike(this)">&#x2764;</button>
//                 <span class="like-counter">${post.likes}</span>
//             </div>
//             <div class="post-bottom">
//                 <span class="post-name">от: <b>${post.name}</b></span>
//                 <span class="post-time">${dateAndTime}</span>
//             </div>

//             <div class="comments">              
//                 <button class="collapse-button" onclick="toggleComments(${post.id})">Комментарии</button><br>
//                 <div class="comment-list" id="comments-${post.id}">
//                     <!-- здесь будут комментарии -->
//                 </div>
//                 <div class="add-comment">
//                     <input type="text-comment" id="comment-input-${post.id}" placeholder="Ваш комментарий">
                    
//                     <button onclick="clearComments(${post.id})">             
//                         &#10006;              
//                     </button>

//                     <button onclick="addComment(${post.id})">
                        
//                         &#10095; 
//                     </button>
//                 </div>
//             </div>
//         </div>
//         `;

//         messagesDiv.insertAdjacentHTML('afterbegin', postHTML);
        
//         //loadCommentsFromLocalStorage(post.id); // Загружаем комментарии для данного поста
//     });
// }

function clearComments(postId) {
    var commentsDiv = document.getElementById(`comments-${postId}`);
    commentsDiv.innerHTML = ''; // Очищаем отображение комментариев

    // Удаляем комментарии из локального хранилища
    saveCommentsToLocalStorage(postId, []);
}

function toggleComments(postId) {
    var commentsDiv = document.getElementById(`comments-${postId}`);
    var addCommentDiv = document.querySelector(`#comments-${postId} .add-comment`);
    var commentListContent = document.getElementById(`comment-list-content-${postId}`);

    if (!commentListContent) {
        // Если элемент comment-list-content не существует, создаем его и вставляем внутрь контейнера comments
        commentListContent = document.createElement('div');
        commentListContent.setAttribute('id', `comment-list-content-${postId}`);
        commentsDiv.appendChild(commentListContent);
    }

    if (commentsDiv.style.display === 'none' || commentsDiv.style.display === '') {
        // Комментарии еще не отображены, загружаем и показываем
        commentListContent.innerHTML = ''; // Сначала очистим содержимое, чтобы избежать дублирования комментариев при повторных кликах
        loadCommentsFromLocalStorage(postId, commentListContent); // Передаем commentListContent в качестве второго аргумента

        //commentsDiv.style.display = 'block';
    } else {
        // Комментарии уже отображены, скрываем их
        commentsDiv.style.display = 'none';
    }

    
}



// Функция добавления комментария
function addComment(postId) {
    var commentInput = document.getElementById(`comment-input-${postId}`);
    var commentText = commentInput.value.trim();
    if (!commentText) {
        alert('Пожалуйста, введите комментарий.');
        return;
    }

    var avatarUrls = [
        'https://avatars.mds.yandex.net/i?id=cde779dc1051c473acd14df966bc038f9a42fccf-8076535-images-thumbs&n=13',
        'https://avatars.mds.yandex.net/i?id=e59519547ca3227798a2638fe587cbb80951a970-9181363-images-thumbs&n=13',
        'https://avatars.mds.yandex.net/i?id=c3774dd0d3b48ce898170876d05252adb2f92b33-8901029-images-thumbs&n=13',
        'https://avatars.mds.yandex.net/i?id=263c28e8d8eceea70895c904f880e212b64928c2-8294270-images-thumbs&n=13',
        'https://avatars.mds.yandex.net/i?id=78d4ed45fafe9f6cedb2934f0fcc938cd1d52a20-9050759-images-thumbs&n=13',
        'https://avatars.mds.yandex.net/i?id=22efaaa843cb7bb474908ebac7158661425bca3e-9065974-images-thumbs&n=13',
        'https://avatars.mds.yandex.net/i?id=8d20c0d271e9053a2ca62b412c4a8dc56cc6515f-5246350-images-thumbs&n=13',
        'https://avatars.mds.yandex.net/i?id=446edff486f12589defc380337cedb73969b09d3-9589172-images-thumbs&n=13',
        'https://avatars.mds.yandex.net/i?id=4048803598b8161035afd54a2222509fa398a7c9-8427413-images-thumbs&n=13',
        'https://avatars.mds.yandex.net/i?id=edae7179de7094050a8f791949a7c6856aadc8e7-9699538-images-thumbs&n=13',
        'https://sun6-20.userapi.com/impg/9TVl43WVejRnppg5eb-S0bCTL8abyPj-tWViJg/GgzmsahT_bM.jpg?size=558x604&quality=95&sign=0911bcee0b8f82685f837704c2227973&c_uniq_tag=nl3FCr16LgGtkNuigLKeGi119Uyv-LvY_pV4-OMTATI&type=album',
        'https://sun9-51.userapi.com/impg/6-gx5sCHOiqah-KhkQHwGRKjrDsuIysVmQWIxw/lorjq2XvtAg.jpg?size=1000x1000&quality=95&sign=4e45e8ba7e24444239cb399edef3b132&type=album',
        'https://sun9-52.userapi.com/impg/640lEsuO26RwdILDdjUgWghaVIjTBk1gSQGTSg/2bbZ0N-oKC0.jpg?size=807x634&quality=95&sign=81ba3178a69695c1f6e1035022df0e8d&c_uniq_tag=66T-ZYI_R5pzaJjWaNlNnNYxnjcUf7mo81BbBOIaavk&type=album',
        'https://sun9-22.userapi.com/impg/GMWUpnWKiYDp39EZLriVq9tCw8hfA5HdeKgrVg/hXE6XEaQHyE.jpg?size=807x511&quality=95&sign=e8d9a1010bb515b53b9a2dad07fa7dab&c_uniq_tag=-NGf9hGC23FDbZarXxvHqu_qh_gLFDCIr_EczTeCvOo&type=album',
        'https://avatars.mds.yandex.net/i?id=766f85e0244cca60524f0d952422acee862b383f-8564741-images-thumbs&n=13',
        'https://avatars.mds.yandex.net/i?id=444d3714437929a22d186b8a702e1967cc7b6e70-9101109-images-thumbs&n=13',
        'https://avatars.mds.yandex.net/i?id=c8bc077579879db179364499f6bef2bd398176aa-9182438-images-thumbs&n=13',
        'https://avatars.mds.yandex.net/i?id=08013bbb6ae10bcd9d96d61e307922cbf78da35e-9148257-images-thumbs&n=13',
        'https://avatars.mds.yandex.net/i?id=c390dedd62eb9bbf23b7159c3992134781ba5a32-4810024-images-thumbs&ref=rim&n=33&w=176&h=206',
        'https://avatars.mds.yandex.net/i?id=6cb0327bc51493453930f62b3c641c5434060ef0-8438571-images-thumbs&ref=rim&n=33&w=164&h=206',
        'https://avatars.mds.yandex.net/i?id=ac76d928c8d906448464f6951514df21475653e7-9152516-images-thumbs&n=13',
        'https://avatars.mds.yandex.net/i?id=8eac33c1cabd16c1dd54fc848187149f41372189-9700546-images-thumbs&n=13',
    ];

    var randomIndex = Math.floor(Math.random() * avatarUrls.length);
    var randomAvatarUrl = avatarUrls[randomIndex];

    var comments = getCommentsFromLocalStorage(postId);
    var commentId = Date.now().toString(); // Уникальный id для комментария

    var comment = {
        id: commentId,
        text: commentText,
        avatar: randomAvatarUrl,
      };
    
      $.ajax({
        url: `http://localhost:3000/api/posts/${postId}/comments`, // Замените на точку входа вашего сервера для добавления комментариев
        method: 'POST',
        data: comment,
        success: function (response) {
          console.log('Комментарий успешно добавлен в MongoDB');
        },
        error: function (error) {
          console.log('Ошибка при добавлении комментария в MongoDB:', error.statusText);
        },
      });
}

function loadCommentsFromServer(postId) {
    $.ajax({
      url: `http://localhost:3000/api/posts/${postId}/comments`, // Замените на точку входа вашего сервера для получения комментариев для поста
      method: 'GET',
      success: function (response) {
        var comments = response;
        // Остальной код для отображения комментариев
        // ...
      },
      error: function (error) {
        console.log('Ошибка при загрузке комментариев из MongoDB:', error.statusText);
      },
    });
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
  
    var formattedDateAndTime = day + '/' + month + ' ' + hours + ':' + minutes;
  
    return formattedDateAndTime;
}

function addLeadingZero(number) {
    return number < 10 ? '0' + number : number;
}

function clearLocalStorage() {
    localStorage.removeItem('posts');
    localStorage.removeItem('likedPosts');
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
    var addCommentDiv = document.querySelector(`#comments-${postId} .add-comment`);
    
    commentsDiv.innerHTML = '';

    comments.forEach(function(comment) {
        var commentHTML = `
            <div class="comment" id="comment-${comment.id}">
                <div class="avatar">
                    <img src="${comment.avatar}" alt="Avatar">
                </div>
                <span>${comment.text}</span>
            </div>
        `;
        commentsDiv.insertAdjacentHTML('beforeend', commentHTML);
    });

    // Показываем контейнер для комментариев
    commentsDiv.style.display = 'block';
}

function getCommentCount(postId) {
    var comments = getCommentsFromLocalStorage(postId);
    return comments.length;
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

    const regex = /([^]+) \n([^ \n]+) \n([^]+)/;

    if (messageData.reply_to_message) {
        const replyMessage = messageData.reply_to_message;
        const replyText = replyMessage.text;       
        
        [, name, url, messageText] = replyText.match(regex);
    } else {
        const matchResult = message.match(regex);
        if (matchResult) {
        [, name, url, messageText] = matchResult;
    }}

    //savePostToLocalStorage(name, url, messageText, messageData.date);
    loadPostsFromServer();
};

window.onload = function() {
    loadPostsFromServer();
    //clearLocalStorage();
}