# TechSupport Payroll Frontend

React фронтенд для системы расчета заработной платы операторов технической поддержки.

---

## 🚀 Технологии

- React 18
- TypeScript
- Material-UI (MUI)
- Axios
- React Router

---

## 📦 Установка и запуск

- Клонируйте репозиторий: 
git clone https://github.com/ваш-логин/techsupport-frontend.git
cd techsupport-frontend
- Установите зависимости: npm install
- Запустите приложение: npm start
Откройте в браузере: http://localhost:3000

---

## 📋 Функциональность

- 📊 Просмотр сотрудников и их статистики
- ⚙️ Управление коэффициентами расчета
- 💰 Расчет заработной платы
- 📈 Просмотр истории расчетов
- 👥 Управление сменами операторов

---

## 🎯 Основные страницы
- Главная - дашборд с общей информацией
- Сотрудники - управление операторами
- Коэффициенты - настройка параметров расчета
- Зарплата - расчет и история выплат
- Статистика - показатели работы операторов
- Смены - график работы

---

## 🔌 Настройка API
Приложение настроено на работу с бэкендом по адресу: http://localhost:5259
Для изменения адреса API отредактируйте файл src/services/api.ts:
const API_BASE_URL = 'http://ваш-адрес:порт';

---

## 🗄️ Бэкенд
.NET API: https://github.com/TasFoma/TechSupportPayrollApi


---

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
