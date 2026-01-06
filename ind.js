
  // Ваши переменные с токеном и ID чата
  // const TELEGRAM_BOT_TOKEN = '7592808345:AAFAD_tU-gIlmAjIFkwGFIIe5nMJsmuHABc';
  // const TELEGRAM_CHAT_ID = '-1002766897941';

    const TELEGRAM_BOT_TOKEN = '7749887573:AAGAsaFD44-OcKNWOybvz4ceIG1qgps5pE8';
  const TELEGRAM_CHAT_ID = '421332431';

  document.getElementById('transportForm').addEventListener('submit', function(e){
    e.preventDefault();

    // Собираем данные из формы
    const formData = new FormData(e.target);
    const dataObject = {};
    formData.forEach((value, key) => {
      dataObject[key] = value;
    });

    // Формируем сообщение
    const message = `
Материал: ${dataObject.material}
Дата: ${dataObject.date}
Объём: ${dataObject.volume}
Количество: ${dataObject.quantity}
Цена: ${dataObject.price}
Район: ${dataObject.district}
Адрес и имя: ${dataObject.address_name}
Телефон: ${dataObject.phone}
Комментарий: ${dataObject.comment}
mened: ${dataObject.mened}
reklama: ${dataObject.reklama}
Перевозчик: ${dataObject.carrier}
Комиссия: ${dataObject.commission}
    `;

    // Отправка сообщения в Telegram
    axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message
    })
    .then(response => {
      alert('Данные успешно отправлены!');
      e.target.reset();
    })
    .catch(error => {
      alert('Произошла ошибка при отправке.');
      console.error(error);
    });
  });
