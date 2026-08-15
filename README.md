# Stellar Burgers

Проект yandex курса "React-разработчик".

## Команды запуска

```bash
npm start # запуск приложения в режиме разработки
npm test # запуск инструмента для тестирования в интерактивном режиме отслеживания изменений
npm run build # сборка приложения для продакшена в папку build
```

## Структура проекта

```
public                      # Публичные статические файлы
├── favicon.ico             # Иконка сайта
├── index.html              # Главный HTML файл
├── manifest.json           # PWA манифест
├── robots.txt              # Для поисковых роботов
├── images                  # Изображения
│   └── icons/              # Иконки
│        └── logo.svg       # Логотип
├── fonts                   # Шрифты (опционально)
│
src/
│── api                     # API-клиенты и запросы
├── client.ts               # Базовый HTTP-клиент
├── endpoints               # Эндпоинты по сущностям
│   ├── auth.ts
│   ├── burgers.ts
│   ├── orders.ts
│   └── users.ts
├── interceptors.ts         # Перехватчики запросов
│
├── app                     # Ядро приложения                    
│   └── App.tsx             # Конфигурация маршрутов
│       ├── providers 
│       ├── routes 
│       └── store 
│
├── hooks/                  # Кастомные React хуки
│   └── useModal.tsx
│
├── pages                   # Компоненты-страницы 
│   ├── login
│   │   ├── login.tsx
│   │   └── style.module.scc
│   ├── register
│   │   ├── register.tsx
│   │   └── style.module.scc
│   └── not-found
│       ├── not-found.tsx
│       └── style.module.scc
│
├── components              # Переиспользуемые UI-компоненты
│   ├── constructor
│   │   ├── constructor.tsx
│   │   ├── constructor.module.css
│   │   ├── types.ts
│   │   └── components
│   │       ├── BurgerPreview.tsx
│   │       └── IngredientList.tsx
│   │
│   ├── ui                  # Базовые компоненты
│   │   ├── Button
│   │   ├── Input
│   │   └── Card
│   │
│   └── shared/             # Общие компоненты
│       ├── Header
│       ├── Footer
│       └── Layout
│
├── services                # API-логика, отделённая от UI
│   └── constructor
│       ├── actions.ts
│       ├── reducers.ts
│       ├── types.ts
│       └── selectors.ts
│
├── utils                   # Утилиты
│   ├── auth-cookies.ts
│   │   └── constants
│   │       ├── routes.ts
│   │       └── images.ts   
│   ├── assets/             # Импортируемые ресурсы
│   │   ├── styles/         # Глобальные стили
│   │   │   ├── globals.css
│   │   │   ├── variables.css
│   │   │   └── mixins.css
│   └── types/              # Глобальные типы
│       ├── index.ts
│       ├── api.ts
│       └── common.ts
│
└── index.tsx               # Точка входа               
```