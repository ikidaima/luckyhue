# LuckyHue

`LuckyHue` - desktop-приложение на Tauri + React, которое показывает случайное число в заданном диапазоне и автоматически обновляет его через выбранный интервал.

## Что умеет

- Генерирует случайное значение в диапазоне `min..max`.
- Обновляет число по таймеру (настраивается в секундах).
- Меняет цвет числа по кастомным диапазонам значений.
- Позволяет настроить размер шрифта.
- Сохраняет настройки между запусками (через `jotai` + local storage).
- Поддерживает сброс настроек к заводским.

## Технологии

- `Tauri 2`
- `React 19`
- `TypeScript`
- `Vite`
- `MUI`
- `Jotai`

## Требования

Перед запуском убедитесь, что установлены:

- `Node.js` (рекомендуется LTS)
- `pnpm`
- `Rust` (toolchain + `cargo`)
- системные зависимости Tauri для вашей ОС

Официальная инструкция по окружению:
[Tauri prerequisites](https://tauri.app/start/prerequisites/)

## Быстрый старт

```bash
pnpm install
pnpm tauri dev
```

Приложение фронтенда поднимается на `http://localhost:1420`, а Tauri-окно открывается поверх него.

## Скрипты

- `pnpm dev` - запуск только Vite dev-сервера.
- `pnpm build` - сборка frontend (`tsc && vite build`).
- `pnpm preview` - локальный preview собранного frontend.
- `pnpm tauri dev` - запуск desktop-приложения в dev-режиме.
- `pnpm tauri build` - production-сборка приложения.
- `pnpm tauri:build:windows` - сборка Windows-бандла через `cargo-xwin`.

## Структура проекта

```text
.
├─ src/                    # React frontend
│  ├─ components/
│  │  ├─ Content.tsx       # отображение и автообновление числа
│  │  └─ Menu.tsx          # настройки приложения
│  ├─ settings.ts          # атомы и дефолтные настройки
│  └─ utils/               # генерация значения и выбор цвета
├─ src-tauri/              # Rust/Tauri часть
│  ├─ icons/               # иконки приложения
│  └─ tauri.conf.json      # конфигурация Tauri
└─ package.json            # npm-скрипты и зависимости
```

## Поведение настроек

Приложение хранит пользовательские параметры в local storage с префиксом ключей:

- `luckyhue.v1.intervalOfUpdate`
- `luckyhue.v1.fontSize`
- `luckyhue.v1.randomBounds`
- `luckyhue.v1.valueRanges`

Если структура настроек изменится в будущем, увеличьте версию префикса (`v1 -> v2`), чтобы избежать конфликтов старых данных.

## Иконки

Иконки для bundle задаются в `src-tauri/tauri.conf.json`:

- `src-tauri/icons/32x32.png`
- `src-tauri/icons/128x128.png`
- `src-tauri/icons/128x128@2x.png`
- `src-tauri/icons/icon.icns`
- `src-tauri/icons/icon.ico`

Для регенерации набора иконок используйте:

```bash
pnpm tauri icon <path-to-square-png-or-svg>
```

## Лицензия

Пока не указана. При необходимости добавьте `LICENSE` и раздел с условиями использования.
