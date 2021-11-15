# Краткое описание
Скрипт для автоматизации уведомления дня рождения из ESPO CRM


# Предварительные настройки в EspoCRM
### Для реализации этой задачи, необходимо:
* добавить для контакта, дополнительное поле birthday
* создать отчет (фильтровать согласно своим задачам, Пример: дни рождения завтра, дни рождения в следующем месяце)
* создать API key

#### Добавить для контакта, дополнительное поле birthday
Поле создается в админке:
Administration > Entity Manager > Contact > Fields

Добавить поле:
birthday с типом Date

#### Cоздать отчет
Отчет создается из меню Reports

Источники:
https://www.espocrm.com/blog/birthday-notifications-in-espocrm/
https://www.espocrm.com/blog/report-showing-contacts-that-have-birthday/


В моем примере:
##### Дни рождения - завтра
Поля:
Account, Title, Name, Birthday

Filters:
```
datetime\date(datetime\addDays(datetime\now(),1))
```
AND
```
datetime\month(datetime\addDays(datetime\now(), 1))
```

##### Дни рождения - следующий месяц
Поля:
Account, Title, Name, Birthday

Filters:
```
datetime\month(datetime\addMonths(datetime\now(), 1))
```

#### Cоздать API ключ
для доступа из внешней программы, необходимо сгенерировать API ключ через админку

Administration > API Users

Назначить для API пользователя соответствующие права, чтобы были доступны все необходимые данные.


# Как установить

Клонируйте
```
git clone https://github.com/iSmartyPRO/espocrm-birthday-notification.git
```
Перейти в папку скрипта и установить зависимости
```
cd espocrm-birthday-notification
npm install
```

Скопируйте и файл настроек и отредактируйте его своими данными
```
cd config
copy indes.sample.js index.js
```

Запустите его, желательно через pm2
```
pm2 start index.js --name "EspoCRM DoB Notifier"
```