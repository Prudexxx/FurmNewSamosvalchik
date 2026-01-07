 // Настройки Telegram
  const TELEGRAM_BOT_TOKEN = '7592808345:AAFAD_tU-gIlmAjIFkwGFIIe5nMJsmuHABc';
  const TELEGRAM_CHAT_ID = '-1002766897941';
  // URL Google Apps Script
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxh-_S-AH7_Z1m4giXUy1rjPDKq4dNdxTwY0hUyjCnZijuhG5gJSL7No-hXV5IYqG4UrA/exec';

  // Глобальная функция для управления полем даты
  window.updateDateField = function() {
    const selectedOption = document.querySelector('input[name="delivery_type"]:checked').value;
    const dateInput = document.getElementById('delivery_date');
    
    if (selectedOption === 'date') {
      dateInput.style.display = 'block';
      dateInput.required = true;
    } else {
      dateInput.style.display = 'none';
      dateInput.required = false;
    }
  };
  
  document.addEventListener('DOMContentLoaded', function() {
    // Установка сегодняшней даты по умолчанию
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayFormatted = `${yyyy}-${mm}-${dd}`;
    
    document.getElementById('delivery_date').value = todayFormatted;
    
    // Управление видимостью поля даты
    const dateOptions = document.querySelectorAll('input[name="delivery_type"]');
    
    // Инициализация
    updateDateField();
    
    // Добавляем обработчики на радиокнопки
    dateOptions.forEach(option => {
      option.addEventListener('change', updateDateField);
    });
  });

  // Функция для отправки в Telegram с использованием Axios
  async function sendToTelegram(dataObject) {
    try {
      console.log('Начинаем отправку в Telegram...');
      
      // Формируем текст сообщения для Telegram
      const selectedOption = document.querySelector('input[name="delivery_type"]:checked').value;
      let deliveryDateText = '';
      
      if (selectedOption === 'date') {
        const date = new Date(dataObject.delivery_date);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        deliveryDateText = `${day}.${month}.${year}`;
      } else if (selectedOption === 'call') {
        deliveryDateText = 'По звонку';
      } else if (selectedOption === 'ready') {
        deliveryDateText = 'По готовности';
      }
      
      const message = `📦 НОВАЯ ЗАЯВКА 📦

📌 Материал: ${dataObject.material || 'Не указано'}
📅 Дата доставки: ${deliveryDateText}
📊 Объём: ${dataObject.volume || 'Не указано'}
🔢 Количество: ${dataObject.quantity || 'Не указано'}
💰 Цена: ${dataObject.price || 'Не указано'}
📍 Район: ${dataObject.district || 'Не указано'}
🏠 Адрес и имя: ${dataObject.address_name || 'Не указано'}
📱 Телефон: ${dataObject.phone || 'Не указано'}
👤 Менеджер: ${dataObject.manager_name || 'Не указано'}
🔍 Источник: ${dataObject.source || 'Не указано'}
📝 Комментарий: ${dataObject.comment || 'Нет'}
🚚 Перевозчик: ${dataObject.carrier || 'Не указано'}
💵 Комиссия: ${dataObject.commission || 'Не указано'}
⏰ Время заявки: ${new Date().toLocaleString('ru-RU')}`;

      console.log('Сообщение для Telegram:', message);
      
      // Используем Axios для отправки
      const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
      
      console.log('URL Telegram:', telegramUrl);
      
      const response = await axios.post(telegramUrl, {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      });
      
      console.log('✅ Telegram отправлен:', response.data);
      
      if (response.data.ok) {
        return true;
      } else {
        throw new Error(response.data.description || 'Telegram error');
      }
      
    } catch (error) {
      console.error('❌ Ошибка отправки в Telegram:', error);
      
      // Пробуем альтернативный метод через Image для обхода CORS
      try {
        console.log('Пробуем альтернативный метод отправки...');
        
        const shortMessage = `Новая заявка! Тел: ${dataObject.phone || 'Нет'}, Адрес: ${dataObject.address_name || 'Нет'}`;
        const img = new Image();
        img.src = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodeURIComponent(shortMessage)}`;
        
        console.log('Альтернативный метод запущен');
        return true;
      } catch (fallbackError) {
        console.error('Альтернативный метод тоже не сработал:', fallbackError);
        // Все равно продолжаем отправку в Google Sheets
        return false;
      }
    }
  }

  // Функция для отправки данных в Google Sheets
  async function sendToGoogleSheets(dataObject) {
    try {
      // Получаем текущую дату и время
      const now = new Date();
      const timestamp = now.toLocaleString('ru-RU');
      
      // Определяем текст для даты доставки
      const selectedOption = document.querySelector('input[name="delivery_type"]:checked').value;
      let deliveryDateText = '';
      
      if (selectedOption === 'date') {
        deliveryDateText = dataObject.delivery_date;
      } else if (selectedOption === 'call') {
        deliveryDateText = 'По звонку';
      } else if (selectedOption === 'ready') {
        deliveryDateText = 'По готовности';
      }
      
      // Формируем данные для отправки
      const payload = {
        timestamp: timestamp,
        material: dataObject.material || '',
        delivery_date: deliveryDateText,
        volume: dataObject.volume || '',
        quantity: dataObject.quantity || '',
        price: dataObject.price || '',
        district: dataObject.district || '',
        address_name: dataObject.address_name || '',
        phone: dataObject.phone || '',
        comment: dataObject.comment || '',
        carrier: dataObject.carrier || '',
        commission: dataObject.commission || '',
         manager_name: dataObject.manager_name || '',
        source: dataObject.source || '',
      };
      
      console.log('Отправляем в Google Sheets:', payload);
      
      // Создаем URL с параметрами
      const params = new URLSearchParams(payload);
      const urlWithParams = `${GOOGLE_SCRIPT_URL}?${params.toString()}`;
      
      // Отправляем запрос
      await fetch(urlWithParams, {
        method: 'GET',
        mode: 'no-cors'
      });
      
      console.log('✅ Данные отправлены в Google Sheets');
      return true;
      
    } catch (error) {
      console.error('❌ Ошибка при отправке в Google Sheets:', error);
      throw error;
    }
  }

  // Обработчик отправки формы
  document.getElementById('transportForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Показываем индикатор загрузки
    document.getElementById('loading').style.display = 'block';
    document.getElementById('successMessage').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'none';
    
    // Собираем данные из формы
    const formData = new FormData(e.target);
    const dataObject = {};
    formData.forEach((value, key) => {
      dataObject[key] = value;
    });
    
    console.log('Собранные данные:', dataObject);
    
    try {
      // Параллельно отправляем в Telegram и Google Sheets
      const telegramPromise = sendToTelegram(dataObject);
      const sheetsPromise = sendToGoogleSheets(dataObject);
      
      // Ждем завершения обоих запросов
      const [telegramResult, sheetsResult] = await Promise.allSettled([
        telegramPromise,
        sheetsPromise
      ]);
      
      console.log('Результаты отправки:', {
        telegram: telegramResult.status,
        sheets: sheetsResult.status
      });
      
      // Проверяем результаты
      let hasError = false;
      let errorMessage = '';
      
      if (telegramResult.status === 'rejected') {
        console.warn('⚠️ Telegram не отправился, но продолжаем...');
      }
      
      if (sheetsResult.status === 'rejected') {
        hasError = true;
        errorMessage = 'Ошибка отправки в Google Sheets';
      }
      
      if (hasError) {
        throw new Error(errorMessage);
      }
      
      // Показываем сообщение об успехе
      document.getElementById('loading').style.display = 'none';
      document.getElementById('successMessage').style.display = 'block';
      
      // Сбрасываем форму
      e.target.reset();
      
      // Сброс даты на сегодняшнюю
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      document.getElementById('delivery_date').value = `${yyyy}-${mm}-${dd}`;
      
      // Сброс радиокнопок
      document.querySelector('input[name="delivery_type"][value="date"]').checked = true;
      
      // Обновляем поле даты
      if (typeof window.updateDateField === 'function') {
        window.updateDateField();
      }
      
      // Скрываем сообщение об успехе через 5 секунд
      setTimeout(() => {
        document.getElementById('successMessage').style.display = 'none';
      }, 5000);
      
    } catch (error) {
      // Показываем сообщение об ошибке
      document.getElementById('loading').style.display = 'none';
      document.getElementById('errorMessage').style.display = 'block';
      document.getElementById('errorMessage').textContent = error.message || 'Ошибка при отправке данных. Попробуйте еще раз.';
      console.error('❌ Общая ошибка отправки:', error);
      
      // Скрываем сообщение об ошибке через 5 секунд
      setTimeout(() => {
        document.getElementById('errorMessage').style.display = 'none';
      }, 5000);
    }
  });
