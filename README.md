# 🎮 Игра Guss

Добро пожаловать в игру **Guss** — многопользовательское приложение, где вы можете соревноваться в скорости кликов в реальном времени! Сервер и клиент общаются через WebSocket (Socket.io), а все игровые события происходят мгновенно.

###Репозиторий фронтенд [https://github.com/katunins/guss-game-frontend](https://github.com/katunins/guss-game-frontend)

###Репозиторий бэкенд [https://github.com/katunins/guss-game-backend](https://github.com/katunins/guss-game-backend)

---

## 🚀 Быстрый старт

### 1. 📦 Запуск базы данных
В бэкенд проекте /guss-game-backend выполните:
```bash
docker-compose up -d
```

### 2. 🛠️ Запуск backend сервера
```bash
npm i # (возможно потребуется флаг --legacy-peer-deps)
npm run typeorm:run (запустим миграции)
npm run start:dev
```
> ⚙️ Порт бэкенда задаётся через переменные окружения (см. package.json -> scripts)

### 3. 💻 Запуск frontend
В новом терминале:
```bash
npm i
npm run dev
```

---

## 👥 Тестирование игры (2 игрока)

### 4. Откройте [http://localhost:3000](http://localhost:3000) в первом браузере

### 5. Вход под админом
- **Логин:** `Никита`
- **Пароль:** любой

### 6. Создайте раунд
- Нажмите "Добавить раунд"
- Откроется страница раунда, начнётся отсчёт до старта
- **Скопируйте ссылку** на раунд

### 7. Откройте второй браузер (или режим инкогнито)

### 8. Вход под игроком 2
- **Логин:** `player 2`
- **Пароль:** `12345`

### 9. Перейдите по ссылке раунда
- Вставьте скопированную ссылку во втором браузере

### 10. Кликайте до конца раунда!
- Побеждает тот, кто накликает больше всех 👑

---

## ⏱️ Настройка таймеров
- Тайминги раунда настраиваются в `.env` в папке `backend`
- После изменения `.env` **перезапустите backend**

---

## 🔗 Технологии
- **Frontend:** React, Socket.io-client
- **Backend:** NestJS, Socket.io
- **База данных:** (см. docker-compose)

---

> ⚡ Соединение сервер-клиент во время игры осуществляется по WebSocket (Socket.io)

---

Удачной игры! Если возникнут вопросы — смотрите комментарии в коде или обратитесь к разработчику. 