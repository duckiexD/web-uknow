# CHANGELOG.md

## [1.0.1] - 2026-06-10

### Fixed
- Исправлена ошибка API при добавлении отзыва без имени (возвращался 500 вместо 400)
- Добавлена валидация обязательных полей в POST /api/comments

### Changed
- Улучшена обработка ошибок в API отзывов

### Verified
- Локальные проверки: `make check`
- CI: GitHub Actions passed
- Ручное тестирование: curl запросы

## [1.0.0] - 2026-06-08

### Added
- Первый релиз футбольной секции «Высота»
- Backend на Flask с REST API
- Frontend (6 страниц)
- Docker контейнеризация
- BAT-скрипты для Windows
- Makefile для Linux/Mac