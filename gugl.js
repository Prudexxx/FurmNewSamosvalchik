// Добавьте этот код в вашу HTML форму для отправки в Google Sheets

function submitToGoogleSheets(dataObject) {
  // URL вашего веб-приложения Apps Script
  const scriptURL = 'https://script.google.com/macros/s/AKfycbxlsenD4rBIllcNl1YvjJQVW-LNWmxZputBlZ60eSokvssdJm-1ho3zQ4wabjkkrWwnyQ/exec';
  
  // Определяем текст для даты доставки
  const selectedOption = document.querySelector('input[name="delivery_option"]:checked').value;
  let deliveryDateText = '';
  
  if (selectedOption === 'date') {
    deliveryDateText = dataObject.date;
  } else if (selectedOption === 'call') {
    deliveryDateText = 'По звонку';
  } else if (selectedOption === 'ready') {
    deliveryDateText = 'По готовности';
  }
  
  // Формируем данные для отправки
  const formData = {
    material: dataObject.material,
    delivery_option: selectedOption,
    date: selectedOption === 'date' ? dataObject.date : '',
    address_name: dataObject.address_name,
    phone: dataObject.phone,
    quantity: dataObject.quantity,
    district: dataObject.district,
    volume: dataObject.volume,
    price: dataObject.price,
    manager_name: dataObject.manager_name,
    source: dataObject.source,
    comment: dataObject.comment,
    carrier: dataObject.carrier,
    commission: dataObject.commission
  };
  
  // Отправляем данные в Google Sheets
  fetch(scriptURL, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
  })
  .then(() => {
    console.log('Данные отправлены в Google Sheets');
  })
  .catch(error => {
    console.error('Ошибка при отправке в Google Sheets:', error);
  });
}

// Обновите обработчик submit формы:
document.getElementById('transportForm').addEventListener('submit', function(e){
  e.preventDefault();

  // Собираем данные из формы
  const formData = new FormData(e.target);
  const dataObject = {};
  formData.forEach((value, key) => {
    dataObject[key] = value;
  });

  // Отправляем в Telegram (ваш существующий код)
  // ...
  
  // Отправляем в Google Sheets
  submitToGoogleSheets(dataObject);
});