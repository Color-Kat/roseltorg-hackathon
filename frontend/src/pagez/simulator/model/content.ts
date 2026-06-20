import { SceneNode, SpriteSlot } from "./types";

/**
 * Граф сцен ассессмента. Текст намеренно лаконичный — день проходится за ~2
 * минуты, а вес смещён на технические задачи (расчёты, нормы), а не на болтовню.
 * Каждый узел — «пассаж»: фон, реплики со сценой, выбор с эффектами и нормами.
 */

const krotovStern: SpriteSlot[] = [{ pose: "krotov", pos: "center" }];
const krotovTask: SpriteSlot[] = [{ pose: "krotov_task", pos: "center" }];
const krotovAngry: SpriteSlot[] = [{ pose: "krotov_angry", pos: "left" }, { pose: "tolik_panic", pos: "right", dim: true }];
const tolikRelaxed: SpriteSlot[] = [{ pose: "tolik", pos: "center" }];
const eduardScene: SpriteSlot[] = [{ pose: "eduard", pos: "center" }];
const empty: SpriteSlot[] = [];

const NODES: SceneNode[] = [
    // ========================= ДЕНЬ 0 — АНКЕТА =========================
    {
        id: "d0_welcome",
        bg: "office",
        lines: [
            { speaker: "narrator", text: "Управление автомобильных дорог региона. Ваш первый день контрактным управляющим.", stage: empty },
            { speaker: "alla", text: "Я Алла, отдел персонала. Заполним анкету — и к начальнику. Отвечайте честно, это часть оценки." },
        ],
        choices: [{ text: "Заполнить анкету", goto: "d0_anketa" }],
    },
    { id: "d0_anketa", kind: "anketa", bg: "office" },
    {
        id: "d0_after",
        bg: "office",
        lines: [
            { speaker: "alla", text: "Принято. Геннадий Семёнович с утра не в духе — на тон не реагируйте.", stage: empty },
        ],
        choices: [{ text: "В отдел", goto: "d1_start" }],
    },

    // ========================= ДЕНЬ 1 — ДЖУНИОР =========================
    {
        id: "d1_start",
        bg: "office",
        lines: [
            { speaker: "narrator", text: "— ДЕНЬ 1 —", stage: empty },
            { speaker: "narrator", text: "Не успели сесть — из кабинета вылетает начальник и орёт на коллегу через весь отдел.", stage: krotovAngry },
            { speaker: "krotov", text: "Анатолий! Где обоснование по котельной? Третий день жду! Ты работаешь или мебель?", stage: krotovAngry },
        ],
        choices: [
            { text: "Вступиться: «Он был на больничном.»", goto: "d1_brief", tone: "good", effects: [{ stat: "soft", delta: 6 }, { stat: "integrity", delta: 3 }, { stat: "stress", delta: 5 }, { achievement: "standUp" }] },
            { text: "Промолчать, разбирать стол.", goto: "d1_brief", tone: "neutral", effects: [{ stat: "stress", delta: 6 }] },
            { text: "Поддакнуть: «Да, дисциплина хромает.»", goto: "d1_brief", tone: "bad", effects: [{ stat: "soft", delta: -4 }, { stat: "integrity", delta: -4 }, { achievement: "nodded" }] },
        ],
    },
    {
        id: "d1_brief",
        bg: "office",
        lines: [
            { speaker: "krotov", text: "Ты новенький. Так: закупаем асфальтоукладчик. К концу дня — черновик извещения. Сам. Напортачишь — переделаешь.", stage: krotovTask },
        ],
        choices: [{ text: "За работу", goto: "d1_okpd2" }],
    },
    {
        id: "d1_okpd2",
        bg: "office",
        lines: [{ speaker: "player", text: "Сначала код ОКПД2. Предмет — поставка техники, не работы.", stage: empty }],
        choices: [
            { text: "28.92.2 — Машины для дорожного строительства", goto: "d1_calc", tone: "good", cite: { law: "44-ФЗ", ref: "ст. 23", note: "ИКЗ и код ОКПД2/КТРУ." }, effects: [{ stat: "knowledge", delta: 8 }, { stat: "application", delta: 6 }] },
            { text: "42.11.2 — Строительство автомобильных дорог", goto: "d1_calc", tone: "bad", effects: [{ stat: "knowledge", delta: -6 }, { stat: "application", delta: -4 }] },
            { text: "45.20 — Ремонт и содержание дорог", goto: "d1_calc", tone: "bad", effects: [{ stat: "knowledge", delta: -6 }, { stat: "application", delta: -4 }] },
        ],
    },
    { id: "d1_calc", kind: "calc", payload: "nmck", bg: "office", goto: "d1_smoke" },
    {
        id: "d1_smoke",
        bg: "office",
        lines: [
            { speaker: "tolik", text: "Новенький! Пойдём подымим, пять минут. И цену не считай — возьми прошлогоднее обоснование, никто не лезет.", stage: tolikRelaxed },
        ],
        choices: [
            { text: "«Дочитаю и пересчитаю — за год цены ушли.»", goto: "d1_document", tone: "good", effects: [{ stat: "integrity", delta: 6 }, { stat: "soft", delta: 2 }, { achievement: "noSmoke" }] },
            { text: "«Перекур — да, но цену посчитаю сам.»", goto: "d1_document", tone: "neutral", effects: [{ stat: "stress", delta: -3 }, { stat: "integrity", delta: 2 }] },
            { text: "«Прошлогоднее? Удобно. Пошли.»", goto: "d1_document", tone: "bad", effects: [{ stat: "integrity", delta: -10 }, { flag: "compliance" }, { achievement: "shortcut" }] },
        ],
    },
    { id: "d1_document", kind: "document", payload: "machines", bg: "office", goto: "d1_pressure" },
    {
        id: "d1_pressure",
        bg: "office",
        lines: [
            { speaker: "krotov", text: "Это что — «или эквивалент»? Заказчику конкретная марка нужна. Убирай.", stage: krotovTask },
            { speaker: "player", text: "Он давит. На верное решение — проверяет, прогнусь ли.", },
        ],
        choices: [
            { text: "«Без „эквивалента“ нельзя — ст. 33. Жалоба в ФАС, и закупку отменят.»", goto: "d1_gate", tone: "good", cite: { law: "44-ФЗ", ref: "ст. 33 ч. 1 п. 1", note: "Товарный знак — только со словами «или эквивалент»." }, effects: [{ stat: "knowledge", delta: 8 }, { stat: "integrity", delta: 8 }, { stat: "trust", delta: 8 }, { achievement: "standsGround" }] },
            { text: "«Как скажете. Уберу.»", goto: "d1_gate", tone: "bad", effects: [{ stat: "knowledge", delta: -8 }, { stat: "integrity", delta: -10 }, { flag: "compliance" }, { achievement: "bent" }] },
        ],
    },
    { id: "d1_gate", kind: "dayResult", payload: "1", bg: "office" },

    // ========================= ДЕНЬ 2 — МИДЛ =========================
    {
        id: "d2_start",
        bg: "office",
        lines: [
            { speaker: "narrator", text: "— ДЕНЬ 2 —", stage: empty },
            { speaker: "krotov", text: "Выжил вчера — сегодня ведёшь закупку асфальтобетонной смеси сам. Цена, обеспечение, ТЗ, поставка.", stage: krotovStern },
        ],
        choices: [{ text: "Приступить", goto: "d2_calc_ob" }],
    },
    { id: "d2_calc_ob", kind: "calc", payload: "obespechenie", bg: "office", goto: "d2_tz" },
    {
        id: "d2_tz",
        bg: "office",
        lines: [{ speaker: "player", text: "Материалы в ТЗ. Что указать по происхождению?", stage: empty }],
        choices: [
            { text: "Приоритет товарам РФ и ЕАЭС; импорт — с ограничениями", goto: "d2_drobl", tone: "good", cite: { law: "44-ФЗ", ref: "ст. 14", note: "Национальный режим: приоритет товарам из РФ/ЕАЭС." }, effects: [{ stat: "knowledge", delta: 8 }] },
            { text: "Что подешевле, происхождение неважно", goto: "d2_drobl", tone: "bad", effects: [{ stat: "knowledge", delta: -6 }] },
            { text: "Только импорт — он качественнее", goto: "d2_drobl", tone: "bad", effects: [{ stat: "knowledge", delta: -6 }] },
        ],
    },
    {
        id: "d2_drobl",
        bg: "office",
        lines: [
            { speaker: "tolik", text: "Контракт жирный. Давай раздробим на пять по 600 тысяч — и у единственного, без конкурса. Быстрее.", stage: tolikRelaxed },
        ],
        choices: [
            { text: "«Нет. Искусственное дробление — обход конкурса, ФАС видит насквозь.»", goto: "d2_calc_terms", tone: "good", cite: { law: "44-ФЗ", ref: "ст. 24, ст. 93", note: "Дробление ради ухода от конкурса недопустимо." }, effects: [{ stat: "knowledge", delta: 6 }, { stat: "integrity", delta: 8 }] },
            { text: "«Дробим, так быстрее.»", goto: "d2_calc_terms", tone: "bad", effects: [{ stat: "integrity", delta: -10 }, { flag: "compliance" }] },
        ],
    },
    { id: "d2_calc_terms", kind: "calc", payload: "terms", bg: "office", goto: "d2_document" },
    { id: "d2_document", kind: "document", payload: "asphalt", bg: "office", goto: "d2_eduard" },
    {
        id: "d2_eduard",
        bg: "office",
        lines: [
            { speaker: "narrator", text: "Заглядывает куратор от руководства. Прикрывает дверь.", stage: eduardScene },
            { speaker: "eduard", text: "По-дружески. Уберём слой основания, марку — подешевле. Экономия восемь миллионов, часть — на премии отделу. Регион спасибо скажет.", stage: eduardScene },
        ],
        choices: [
            { text: "«Это занижение существенных условий. По сути — взятка. Нет.»", goto: "d2_gate", tone: "good", cite: { law: "УК РФ", ref: "ст. 290–291", note: "Взятка; занижение объёмов — нарушение контракта." }, effects: [{ stat: "knowledge", delta: 6 }, { stat: "integrity", delta: 14 }, { stat: "trust", delta: -4 }, { achievement: "incorruptible" }] },
            { text: "«Подумаю до завтра.»", goto: "d2_gate", tone: "neutral", effects: [{ stat: "integrity", delta: -4 }, { stat: "application", delta: -4 }] },
            { text: "«Если просто оптимизация — оформлю.»", goto: "d2_gate", tone: "bad", effects: [{ stat: "integrity", delta: -16 }, { flag: "compliance" }, { flag: "eduardDeal" }, { achievement: "deal" }] },
        ],
    },
    { id: "d2_gate", kind: "dayResult", payload: "2", bg: "office" },

    // ========================= ДЕНЬ 3 — СЕНЬОР =========================
    {
        id: "d3_start",
        bg: "office",
        lines: [
            { speaker: "narrator", text: "— ДЕНЬ 3 —", stage: empty },
            { speaker: "krotov", text: "Бюджет выделили — освой без приключений. Объект на контроле. Я на совещании, разруливай сам.", stage: krotovStern },
        ],
        choices: [{ text: "К делу", goto: "d3_fas" }],
    },
    {
        id: "d3_fas",
        bg: "office",
        lines: [{ speaker: "narrator", text: "Жалоба в ФАС: участник заявляет, что ТЗ ограничивало конкуренцию. Заседание завтра.", stage: empty }],
        choices: [
            { text: "Готовлю позицию: обоснованность требований, «или эквивалент», ст. 33 и практика", goto: "d3_calc_anti", tone: "good", cite: { law: "44-ФЗ; 135-ФЗ", ref: "ст. 33; ст. 17", note: "Описание объекта и запрет ограничения конкуренции." }, effects: [{ stat: "knowledge", delta: 8 }, { stat: "application", delta: 6 }] },
            { text: "Игнорирую — авось пронесёт", goto: "d3_calc_anti", tone: "bad", effects: [{ stat: "application", delta: -6 }, { stat: "stress", delta: 5 }] },
            { text: "Правлю документацию задним числом", goto: "d3_calc_anti", tone: "bad", effects: [{ stat: "integrity", delta: -10 }, { flag: "compliance" }] },
        ],
    },
    { id: "d3_calc_anti", kind: "calc", payload: "antidemping", bg: "office", goto: "d3_rastorzhenie" },
    {
        id: "d3_rastorzhenie",
        bg: "office",
        lines: [{ speaker: "narrator", text: "Подрядчик сорвал срок укладки на 30 дней. Объект стоит.", stage: empty }],
        choices: [
            { text: "Односторонний отказ по ст. 95, фиксирую нарушение, начисляю неустойку", goto: "d3_calc_penalty", tone: "good", cite: { law: "44-ФЗ", ref: "ст. 95", note: "Односторонний отказ заказчика от контракта." }, effects: [{ stat: "knowledge", delta: 6 }, { stat: "application", delta: 6 }] },
            { text: "По-тихому продлить срок без оснований", goto: "d3_calc_penalty", tone: "bad", effects: [{ stat: "integrity", delta: -8 }, { flag: "compliance" }] },
            { text: "Подождать — вдруг доделают", goto: "d3_calc_penalty", tone: "neutral", effects: [{ stat: "application", delta: -5 }, { stat: "stress", delta: 3 }] },
        ],
    },
    { id: "d3_calc_penalty", kind: "calc", payload: "penalty", bg: "office", goto: "d3_rnp" },
    {
        id: "d3_rnp",
        bg: "office",
        lines: [{ speaker: "narrator", text: "После расторжения — направить сведения о подрядчике в РНП?", stage: empty }],
        choices: [
            { text: "Да — основания есть, это обязанность заказчика", goto: "d3_delivery", tone: "good", cite: { law: "44-ФЗ", ref: "ст. 104", note: "Реестр недобросовестных поставщиков." }, effects: [{ stat: "knowledge", delta: 6 }, { stat: "integrity", delta: 6 }] },
            { text: "Нет — жалко, может, исправятся", goto: "d3_delivery", tone: "neutral", effects: [{ stat: "application", delta: -5 }] },
        ],
    },
    {
        id: "d3_delivery",
        bg: "office",
        lines: [
            { speaker: "narrator", text: "Новый поставщик завозит 5 тонн смеси — марка ниже заявленной, асфальт низкой пробы. Сроки горят.", stage: empty },
            { speaker: "narrator", text: "Без стука входит куратор, за ним — представитель администрации.", stage: eduardScene },
        ],
        goto: "d3_official",
    },
    {
        id: "d3_official",
        bg: "office",
        lines: [
            { speaker: "eduard", text: "Дорога нужна была вчера. Асфальт нормальный, клади четыре сантиметра — по регламенту так и положено, заодно сэкономим. Я согласую.", stage: eduardScene },
            { speaker: "player", text: "Стоп. Просили другую марку. И по проекту верхний слой — не менее 5 см, а он говорит 4. Это занижение объёма.", },
        ],
        choices: [
            { text: "Согласиться — уложить 4 см, сроки важнее", goto: "d3_theft", tone: "bad", effects: [{ stat: "integrity", delta: -20 }, { flag: "asphalt:1" }, { achievement: "theft" }] },
            { text: "Принять смесь, но уложить по проекту — 5 см, оформив претензию по качеству", goto: "d3_correct", tone: "good", cite: { law: "44-ФЗ; проект/ГОСТ", ref: "ст. 94, ст. 95", note: "Толщина слоя — существенное условие; занижение недопустимо." }, effects: [{ stat: "knowledge", delta: 8 }, { stat: "integrity", delta: 12 }, { stat: "application", delta: 8 }, { flag: "asphalt:2" }, { achievement: "centimeter" }] },
            { text: "Отказаться принимать, ждать качественный — пусть сроки горят", goto: "d3_refuse", tone: "neutral", cite: { law: "44-ФЗ", ref: "ст. 94", note: "Мотивированный отказ от приёмки несоответствующего товара." }, effects: [{ stat: "integrity", delta: 6 }, { stat: "application", delta: -8 }, { stat: "stress", delta: 8 }, { flag: "asphalt:3" }, { achievement: "centimeter" }] },
        ],
    },
    {
        id: "d3_theft",
        bg: "office",
        lines: [
            { speaker: "narrator", text: "Каток прошёл по тонкому слою. Через неделю — лабораторный контроль кернов. Толщина не бьётся с проектом.", stage: krotovAngry },
            { speaker: "krotov", text: "Ты понимаешь, что подписал? Это уже не выговор. Это статья.", stage: krotovAngry },
        ],
        goto: "d3_gate",
    },
    {
        id: "d3_correct",
        bg: "office",
        lines: [
            { speaker: "narrator", text: "Вы оформляете претензию по качеству и настаиваете на укладке строго по проекту. Возразить по закону нечего.", stage: krotovStern },
            { speaker: "krotov", text: "За тридцать лет таких по пальцам. И сантиметр поймал, и не повёлся.", stage: krotovStern },
        ],
        goto: "d3_gate",
    },
    {
        id: "d3_refuse",
        bg: "office",
        lines: [
            { speaker: "narrator", text: "Мотивированный отказ от приёмки. Формально чисто — но объект встал, сезон сорван.", stage: krotovStern },
            { speaker: "krotov", text: "По закону не подкопаешься. Но дорога нужна была людям сейчас.", stage: krotovStern },
        ],
        goto: "d3_gate",
    },
    { id: "d3_gate", kind: "dayResult", payload: "3", bg: "office" },

    { id: "final", kind: "final", bg: "office" },
];

export const SCENE_LIST = NODES;
export const SCENES: Record<string, SceneNode> = Object.fromEntries(NODES.map((n) => [n.id, n]));
export const START_NODE = "d0_welcome";

/** Стартовые узлы для запуска ассессмента с конкретного дня (демо). */
export const DAY_START: Record<number, string> = { 1: "d1_start", 2: "d2_start", 3: "d3_start" };
