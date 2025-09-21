# PingTower

PingTower is a web application designed to monitor the status and response time of your services. It provides a user-friendly interface to add services, view their current status (up or down), and analyze historical performance data through response time charts.

---

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/ilija58/PingTower.git
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```

## Project Structure

The project follows a standard React application structure:

```
/
├── public/         # Static assets
├── src/            # Source code
│   ├── assets/     # Images, styles
│   ├── components/ # Reusable components
│   ├── hooks/      # Custom React hooks
│   ├── pages/      # Page components
│   ├── providers/  # Context providers
│   ├── services/   # API services
│   ├── store/      # Zustand stores
│   ├── widgets/    # Complex components (widgets)
│   ├── App.tsx     # Main app component
│   ├── main.tsx    # Entry point
│   └── routes.ts   # Routing configuration
├── .gitignore
├── package.json
└── README.md
```

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser (the port may vary).

### `npm run prod`

Builds the app for production to the `dist` folder.

### `npm run preview`

Serves the production build locally for preview.

### `npm run lint`

Lints the project files using ESLint.

### `npm run format`

Checks the formatting of the project files using Prettier.

### `npm run format:fix`

Fixes the formatting of the project files using Prettier.

## Features

- **User Authentication**: Secure login to manage your list of services.
- **Service Management**: Easily add, view, and manage your services.
- **Status Monitoring**: Real-time status checks for each service.
- **Performance Charts**: Visualize the response time history for each service with interactive charts.

## Tech Stack

- **Frontend**: React, TypeScript
- **Bundler**: Vite
- **Routing**: React Router
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Charting**: Chart.js
- **Styling**: SCSS Modules

---

# PingTower (Русский)

PingTower — это веб-приложение, предназначенное для мониторинга состояния и времени отклика ваших сервисов. Оно предоставляет удобный интерфейс для добавления сервисов, просмотра их текущего статуса (активен или нет) и анализа исторических данных о производительности с помощью графиков времени отклика.

---

## Начало работы

Чтобы запустить локальную копию проекта, выполните следующие простые шаги.

### Требования

- Node.js (v18 или выше)
- npm

### Установка

1.  Клонируйте репозиторий
    ```sh
    git clone https://github.com/ilija58/PingTower.git
    ```
2.  Установите NPM пакеты
    ```sh
    npm install
    ```

## Структура проекта

Проект имеет стандартную структуру для React-приложений:

```
/
├── public/         # Статические ассеты
├── src/            # Исходный код
│   ├── assets/     # Изображения, стили
│   ├── components/ # Переиспользуемые компоненты
│   ├── hooks/      # Кастомные хуки React
│   ├── pages/      # Компоненты страниц
│   ├── providers/  # Провайдеры контекста
│   ├── services/   # Сервисы для работы с API
│   ├── store/      # Хранилища Zustand
│   ├── widgets/    # Сложные компоненты (виджеты)
│   ├── App.tsx     # Основной компонент приложения
│   ├── main.tsx    # Точка входа
│   └── routes.ts   # Конфигурация роутинга
├── .gitignore
├── package.json
└── README.md
```

## Доступные скрипты

В директории проекта вы можете выполнить:

### `npm run dev`

Запускает приложение в режиме разработки.
Откройте [http://localhost:3000](http://localhost:3000), чтобы просмотреть его в браузере (порт может отличаться).

### `npm run prod`

Собирает приложение для продакшена в папку `dist`.

### `npm run preview`

Запускает локальный сервер для предпросмотра продакшн сборки.

### `npm run lint`

Проверяет файлы проекта с помощью ESLint.

### `npm run format`

Проверяет форматирование файлов проекта с помощью Prettier.

### `npm run format:fix`

Исправляет форматирование файлов проекта с помощью Prettier.

## Функционал

- **Аутентификация пользователей**: Безопасный вход в систему для управления вашим списком сервисов.
- **Управление сервисами**: Легко добавляйте, просматривайте и управляйте своими сервисами.
- **Мониторинг состояния**: Проверка состояния каждого сервиса в режиме реального времени.
- **Графики производительности**: Визуализируйте историю времени отклика для каждого сервиса с помощью интерактивных графиков.

## Стек технологий

- **Фронтенд**: React, TypeScript
- **Сборщик**: Vite
- **Роутинг**: React Router
- **Управление состоянием**: Zustand
- **HTTP-клиент**: Axios
- **Графики**: Chart.js
- **Стилизация**: SCSS Modules
