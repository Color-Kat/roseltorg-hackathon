"""Заполнение БД тестовыми результатами ассессмента для демонстрации
кабинета работодателя. Запуск: `.venv/bin/python seed_assessments.py`.

По умолчанию очищает таблицу assessment_results и вставляет набор разнообразных
кандидатов (разные грейды, сильные/слабые стороны, комплаенс-риски).
"""

import asyncio

from sqlalchemy import delete

from app.database import async_session_maker, create_all
from app.models.assessment import AssessmentResult


def cite(law, ref, note):
    return {"law": law, "ref": ref, "note": note}


# — переиспользуемые решения по дням (для карты решений в отчёте) —
def d1_good():
    return [
        {"day": 1, "question": "Реакция на разнос коллеги", "choice": "Вступиться за коллегу",
         "tone": "good", "cite": None},
        {"day": 1, "question": "Код закупки", "choice": "28.92.2 — Машины для дорожного строительства",
         "tone": "good", "cite": cite("44-ФЗ", "ст. 23", "ИКЗ и код ОКПД2/КТРУ.")},
        {"day": 1, "question": "Перекур и обоснование цены", "choice": "Дочитаю и пересчитаю — цены ушли",
         "tone": "good", "cite": None},
        {"day": 1, "question": "Давление убрать «или эквивалент»", "choice": "Без «эквивалента» нельзя — ст. 33",
         "tone": "good", "cite": cite("44-ФЗ", "ст. 33 ч. 1 п. 1", "Товарный знак — только со словами «или эквивалент».")},
    ]


def d1_mixed():
    return [
        {"day": 1, "question": "Реакция на разнос коллеги", "choice": "Промолчать", "tone": "neutral", "cite": None},
        {"day": 1, "question": "Код закупки", "choice": "42.11.2 — Строительство дорог", "tone": "bad", "cite": None},
        {"day": 1, "question": "Перекур и обоснование цены", "choice": "Прошлогоднее? Удобно. Пошли",
         "tone": "bad", "cite": None},
        {"day": 1, "question": "Давление убрать «или эквивалент»", "choice": "Без «эквивалента» нельзя — ст. 33",
         "tone": "good", "cite": cite("44-ФЗ", "ст. 33 ч. 1 п. 1", "Указание марки только с «или эквивалент».")},
    ]


def d2_good():
    return [
        {"day": 2, "question": "Материалы в ТЗ", "choice": "Приоритет товарам РФ и ЕАЭС",
         "tone": "good", "cite": cite("44-ФЗ", "ст. 14", "Национальный режим.")},
        {"day": 2, "question": "Дробление контракта", "choice": "Нет. Искусственное дробление — нарушение",
         "tone": "good", "cite": cite("44-ФЗ", "ст. 24, ст. 93", "Уход от конкурса недопустим.")},
        {"day": 2, "question": "Оптимизация сметы (Эдуард)", "choice": "Это занижение существенных условий. Нет",
         "tone": "good", "cite": cite("УК РФ", "ст. 290–291", "Взятка; занижение объёмов.")},
    ]


def d2_bad():
    return [
        {"day": 2, "question": "Материалы в ТЗ", "choice": "Что подешевле", "tone": "bad", "cite": None},
        {"day": 2, "question": "Дробление контракта", "choice": "Дробим, так быстрее", "tone": "bad", "cite": None},
        {"day": 2, "question": "Оптимизация сметы (Эдуард)", "choice": "Если просто оптимизация — оформлю",
         "tone": "bad", "cite": None},
    ]


def d3_senior():
    return [
        {"day": 3, "question": "Жалоба в ФАС", "choice": "Готовлю позицию со ссылкой на ст. 33",
         "tone": "good", "cite": cite("44-ФЗ; 135-ФЗ", "ст. 33; ст. 17", "Запрет ограничения конкуренции.")},
        {"day": 3, "question": "Срыв срока подрядчиком", "choice": "Односторонний отказ по ст. 95",
         "tone": "good", "cite": cite("44-ФЗ", "ст. 95", "Односторонний отказ заказчика.")},
        {"day": 3, "question": "Асфальтовая дилемма", "choice": "Уложить по проекту 5 см, оформить претензию",
         "tone": "good", "cite": cite("44-ФЗ", "ст. 94, 95", "Толщина слоя — существенное условие.")},
    ]


def d3_theft():
    return [
        {"day": 3, "question": "Жалоба в ФАС", "choice": "Правлю документацию задним числом", "tone": "bad", "cite": None},
        {"day": 3, "question": "Асфальтовая дилемма", "choice": "Согласиться уложить 4 см",
         "tone": "bad", "cite": cite("44-ФЗ", "ст. 94", "Занижение объёма — хищение.")},
    ]


def ach(aid, title, tone, desc):
    return {"id": aid, "title": title, "tone": tone, "desc": desc}


CANDIDATES = [
    {
        "candidate_name": "Анна Северова",
        "grade": "senior", "grade_label": "Сеньор", "avg": 88, "compliance": 0,
        "stats": {"trust": 82, "knowledge": 92, "application": 86, "integrity": 90, "soft": 70, "stress": 18},
        "decisions": d1_good() + d2_good() + d3_senior(),
        "achievements": [
            ach("standsGround", "Держит позицию", "good", "Защитила верное решение под давлением."),
            ach("incorruptible", "Неподкупный", "good", "Отказала куратору и назвала норму."),
            ach("sharpEye", "Острый глаз", "good", "Нашла все нарушения в документе."),
            ach("centimeter", "Поймал сантиметр", "good", "Распознала занижение толщины слоя."),
        ],
        "profile": {"edu": "Юридическое", "exp": "Более 3 лет", "cert": "Да", "record": "Нет", "gender": "Женский", "age": "34"},
    },
    {
        "candidate_name": "Дмитрий Кораблёв",
        "grade": "middle", "grade_label": "Мидл", "avg": 71, "compliance": 1,
        "stats": {"trust": 64, "knowledge": 74, "application": 70, "integrity": 58, "soft": 60, "stress": 30},
        "decisions": d1_good() + d2_good(),
        "achievements": [
            ach("noConflict", "Без своих людей", "good", "Заявил самоотвод при конфликте интересов."),
            ach("smokeBreak", "У нас тут работают, а не курят", "bad", "Ушёл на перекур в дедлайн."),
        ],
        "profile": {"edu": "Экономическое / в сфере закупок", "exp": "1–3 года", "cert": "Да", "record": "Нет", "gender": "Мужской", "age": "29"},
    },
    {
        "candidate_name": "Марина Власова",
        "grade": "senior", "grade_label": "Сеньор", "avg": 76, "compliance": 2,
        "stats": {"trust": 55, "knowledge": 90, "application": 82, "integrity": 44, "soft": 52, "stress": 26},
        "decisions": d1_good() + d2_bad() + d3_senior(),
        "achievements": [
            ach("sharpEye", "Острый глаз", "good", "Безупречно вычитала извещение."),
            ach("deal", "Понимающий человек", "bad", "Согласилась на «оптимизацию» сметы."),
        ],
        "profile": {"edu": "Юридическое", "exp": "Более 3 лет", "cert": "Да", "record": "Нет", "gender": "Женский", "age": "41"},
    },
    {
        "candidate_name": "Игорь Пастухов",
        "grade": "junior", "grade_label": "Джуниор", "avg": 58, "compliance": 1,
        "stats": {"trust": 50, "knowledge": 56, "application": 54, "integrity": 60, "soft": 66, "stress": 38},
        "decisions": d1_mixed(),
        "achievements": [
            ach("standUp", "Командный игрок", "good", "Вступился за коллегу под огнём."),
            ach("shortcut", "Взял прошлогоднее", "bad", "Согласился подделать обоснование цены."),
        ],
        "profile": {"edu": "Техническое", "exp": "До 1 года", "cert": "Нет", "record": "Нет", "gender": "Мужской", "age": "24"},
    },
    {
        "candidate_name": "Екатерина Лунёва",
        "grade": "middle", "grade_label": "Мидл", "avg": 67, "compliance": 0,
        "stats": {"trust": 70, "knowledge": 60, "application": 64, "integrity": 78, "soft": 84, "stress": 22},
        "decisions": d1_good() + d2_good(),
        "achievements": [
            ach("byTheBook", "По регламенту", "good", "Работает по закону, а не по понятиям."),
            ach("noSmoke", "Сначала дело", "good", "Не бросила задачу ради перекура."),
        ],
        "profile": {"edu": "Экономическое / в сфере закупок", "exp": "1–3 года", "cert": "Нет", "record": "Нет", "gender": "Женский", "age": "31"},
    },
    {
        "candidate_name": "Олег Тимофеев",
        "grade": "none", "grade_label": "Не подтверждён", "avg": 34, "compliance": 3,
        "stats": {"trust": 28, "knowledge": 38, "application": 36, "integrity": 24, "soft": 40, "stress": 55},
        "decisions": d1_mixed() + d3_theft(),
        "achievements": [
            ach("nodded", "Поддакнул начальству", "bad", "Согласился с разносом коллеги."),
            ach("nepotism", "Свои люди", "bad", "Пообещал «пристроить» родственника."),
            ach("theft", "Уложил тоньше", "bad", "Согласился на занижение слоя — хищение."),
        ],
        "profile": {"edu": "Иное / среднее", "exp": "Нет опыта", "cert": "Нет", "record": "Да", "gender": "Мужской", "age": "27"},
    },
]


async def main():
    await create_all()
    async with async_session_maker() as session:
        # чистим прежние записи, чтобы повторный запуск давал известный набор
        await session.execute(delete(AssessmentResult))
        for c in CANDIDATES:
            session.add(AssessmentResult(**c))
        await session.commit()
    print(f"Засеяно кандидатов: {len(CANDIDATES)}")


if __name__ == "__main__":
    asyncio.run(main())
