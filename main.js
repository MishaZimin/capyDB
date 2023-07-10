// Функция отправки данных в Telegram
function sendTelegramMessage(name, url, message) {
    // Замените <TOKEN> на токен вашего бота
    var telegramBotToken = '6392841364:AAE8PozN2Y6x0zbyjO8ei6KIRm-hUDcGyUo';
    // Замените <CHAT_ID> на ваш Chat ID
    var telegramChatId = '997616670';
  
    // Формирование сообщения для отправки
    var telegramMessage = 'Новое сообщение!\n\nИмя: ' + name + '\nurl: ' + url + '\nСообщение: ' + message;
  
    // Отправка сообщения через AJAX запрос
    $.ajax({
      url: 'https://api.telegram.org/bot6392841364:AAE8PozN2Y6x0zbyjO8ei6KIRm-hUDcGyUo/sendMessage',
      method: 'POST',
      data: {
        chat_id: telegramChatId,
        text: telegramMessage
      },
      success: function(response) {
        console.log('Сообщение отправлено в Telegram');
        // Здесь вы можете добавить код для обработки успешной отправки сообщения
      },
      error: function(error) {
        console.log('Ошибка при отправке сообщения в Telegram');
        // Здесь вы можете добавить код для обработки ошибки отправки сообщения
      }
    });
  }
  
  // Обработчик события клика на кнопку "Отправить"
  $('#mess_send').click(function() {
    // Получение данных из полей формы
    var name = $('#name').val();
    var url = $('#url').val();
    var message = $('#messege').val();
  
    // Отправка сообщения в Telegram
    sendTelegramMessage(name, url, message);
  
    // Очистка полей формы
    $('#name').val('');
    $('#url').val('');
    $('#messege').val('');
  });
  