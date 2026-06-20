import { SceneNode, SpriteSlot } from "./types";

/**
 * Граф сцен ассессмента. Каждый узел — «пассаж»: фон, реплики со сценой
 * (кто на сцене и в каком настроении), выбор игрока с эффектами и ссылками
 * на нормы. Сюжет нелинейный: ключевые решения меняют характеристики, флаги
 * и итоговый грейд.
 */

// — частые композиции сцены, чтобы не дублировать —
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
        onEnter: [{ stat: "stress", delta: 0 }],
        lines: [
            { speaker: "narrator", text: "Тесная переговорка управления автомобильных дорог. Напротив — женщина лет сорока, перекладывает бумаги.", stage: empty },
            { speaker: "alla", text: "Проходите, присаживайтесь. Я Алла, отдел персонала. Договор и формальности — потом. Сейчас быстро заполним анкету, и я отведу вас к Геннадию Семёновичу." },
            { speaker: "alla", text: "Отвечайте честно — это уже часть оценки." },
        ],
        choices: [{ text: "Заполнить анкету", goto: "d0_anketa" }],
    },
    { id: "d0_anketa", kind: "anketa", bg: "office" },
    {
        id: "d0_after",
        bg: "office",
        lines: [
            { speaker: "alla", text: "Принято. Пойдёмте.", stage: empty },
            { speaker: "alla", text: "И сразу: Геннадий Семёнович с утра не в духе. На тон не реагируйте — он так со всеми." },
        ],
        choices: [{ text: "В отдел", goto: "d1_start" }],
    },

    // ========================= ДЕНЬ 1 — ДЖУНИОР =========================
    {
        id: "d1_start",
        bg: "office",
        lines: [
            { speaker: "narrator", text: "— ДЕНЬ ПЕРВЫЙ —", stage: empty },
            { speaker: "narrator", text: "Открытый офис. Гул принтеров. У окна курит мужчина в расстёгнутой рубашке и, завидев вас, расплывается в улыбке.", stage: tolikRelaxed },
        ],
        goto: "d1_tolikIntro",
    },
    {
        id: "d1_tolikIntro",
        bg: "office",
        lines: [
            { speaker: "tolik", text: "О, новенький! Толик. Слушай, ты это — не закапывайся сразу в бумажки, тут своя кухня, втянешься. Хочешь, на пальцах покажу, как у нас всё делается?", stage: tolikRelaxed },
        ],
        choices: [
            { text: "«Спасибо, я разберусь по регламенту.»", goto: "d1_razns", tone: "good", effects: [{ stat: "integrity", delta: 5 }, { stat: "soft", delta: 2 }, { achievement: "byTheBook" }] },
            { text: "«Давай, подскажи, что тут к чему.»", goto: "d1_razns", tone: "neutral", effects: [{ stat: "integrity", delta: -4 }, { stat: "soft", delta: 2 }] },
        ],
    },
    {
        id: "d1_razns",
        bg: "office",
        lines: [
            { speaker: "narrator", text: "Не успели сесть — из кабинета вылетает начальник. Грузный, красный, орёт на Толика через весь отдел.", stage: krotovAngry },
            { speaker: "krotov", text: "Анатолий! Я третий день жду обоснование по школьной котельной. Где оно? Ты тут работаешь или мебель?", stage: krotovAngry },
            { speaker: "narrator", text: "Толик втянул голову. В отделе тишина, все уткнулись в мониторы. Вы тоже новичок — но он рядом." },
        ],
        choices: [
            { text: "Вступиться: «Он, кажется, был на больничном — не успел.»", goto: "d1_brief", tone: "good", effects: [{ stat: "integrity", delta: 6 }, { stat: "soft", delta: 8 }, { stat: "stress", delta: 6 }, { stat: "trust", delta: -4 }, { achievement: "standUp" }] },
            { text: "Промолчать, сделать вид, что разбираете стол.", goto: "d1_brief", tone: "neutral", effects: [{ stat: "stress", delta: 8 }, { stat: "soft", delta: -3 }] },
            { text: "Поддакнуть: «Да, с дисциплиной беда…»", goto: "d1_brief", tone: "bad", effects: [{ stat: "integrity", delta: -6 }, { stat: "soft", delta: -4 }, { stat: "trust", delta: 4 }, { achievement: "nodded" }] },
        ],
    },
    {
        id: "d1_brief",
        bg: "office",
        lines: [
            { speaker: "narrator", text: "Начальник переводит взгляд на вас, выдыхает.", stage: krotovTask },
            { speaker: "krotov", text: "Ты новенький. Геннадий Семёнович. Держи: надо закупить асфальтоукладчики для дорожных работ. К концу дня жду черновик извещения. Сам, без нянек. Напортачишь — сам и переделаешь.", stage: krotovTask },
            { speaker: "player", text: "(Без паники. Сначала код закупки, потом нужные статьи, потом вычитать черновик. По порядку.)" },
        ],
        choices: [{ text: "Взяться за код ОКПД2", goto: "d1_okpd2" }],
    },
    {
        id: "d1_okpd2",
        bg: "office",
        lines: [{ speaker: "narrator", text: "Открываете справочник. Под «асфальтоукладчики» нужно подобрать ОКПД2 — коды похожие, легко промахнуться.", stage: empty }],
        choices: [
            { text: "28.92.2 — Машины для дорожного строительства", goto: "d1_findArticle", tone: "good", effects: [{ stat: "knowledge", delta: 6 }, { stat: "application", delta: 8 }] },
            { text: "42.11.2 — Строительство автомобильных дорог", goto: "d1_okpd2wrong", tone: "neutral", effects: [{ stat: "application", delta: -5 }, { stat: "stress", delta: 3 }] },
            { text: "45.20 — Содержание и ремонт дорог", goto: "d1_okpd2wrong", tone: "neutral", effects: [{ stat: "application", delta: -5 }, { stat: "stress", delta: 3 }] },
        ],
    },
    {
        id: "d1_okpd2wrong",
        bg: "office",
        lines: [
            { speaker: "narrator", text: "Стоп. Строительство и содержание — это работы, а нам нужна поставка техники. С неверным кодом закупку неправильно классифицируют.", stage: empty },
        ],
        choices: [
            { text: "Выбрать заново: 28.92.2 — Машины для дорожного строительства", goto: "d1_findArticle", cite: { law: "44-ФЗ", ref: "ст. 23", note: "Идентификационный код закупки, КТРУ/ОКПД2." }, effects: [{ stat: "knowledge", delta: 4 }, { stat: "application", delta: 4 }] },
        ],
    },
    {
        id: "d1_findArticle",
        bg: "office",
        lines: [
            { speaker: "narrator", text: "Подсаживается Толик, вполголоса.", stage: tolikRelaxed },
            { speaker: "tolik", text: "Слушай, по-быстрому, пока Семёныч не видит. Описание объекта закупки — это какая статья? Из головы вылетело.", stage: tolikRelaxed },
        ],
        choices: [
            { text: "Статья 33 — правила описания объекта закупки", goto: "d1_smoke", tone: "good", cite: { law: "44-ФЗ", ref: "ст. 33", note: "Описание объекта закупки, в т.ч. «или эквивалент»." }, effects: [{ stat: "knowledge", delta: 8 }] },
            { text: "Статья 22 — обоснование НМЦК", goto: "d1_findArticleWrong", tone: "neutral", effects: [{ stat: "knowledge", delta: -5 }] },
            { text: "Статья 31 — требования к участникам", goto: "d1_findArticleWrong", tone: "neutral", effects: [{ stat: "knowledge", delta: -5 }] },
        ],
    },
    {
        id: "d1_findArticleWrong",
        bg: "office",
        lines: [
            { speaker: "tolik", text: "Да ладно, сам гляну.", stage: tolikRelaxed },
            { speaker: "narrator", text: "Но вы понимаете, что промахнулись: описание объекта — это статья 33." },
        ],
        choices: [{ text: "Дальше", goto: "d1_smoke", cite: { law: "44-ФЗ", ref: "ст. 33", note: "Описание объекта закупки." } }],
    },
    {
        id: "d1_smoke",
        bg: "office",
        lines: [
            { speaker: "tolik", text: "Ну что, пойдём подымим? Пять минут, бумажки не убегут.", stage: tolikRelaxed },
        ],
        choices: [
            { text: "«Не, сначала добью черновик.»", goto: "d1_phone1", tone: "good", effects: [{ stat: "trust", delta: 5 }, { stat: "soft", delta: 3 }, { achievement: "noSmoke" }] },
            { text: "«А, давай, разомнусь.»", goto: "d1_smokeOffer", tone: "bad", effects: [{ stat: "trust", delta: -6 }, { stat: "stress", delta: -3 }, { achievement: "smokeBreak" }] },
        ],
    },
    {
        id: "d1_smokeOffer",
        bg: "office",
        lines: [
            { speaker: "narrator", text: "На лестнице Толик понижает голос.", stage: tolikRelaxed },
            { speaker: "tolik", text: "Слушай, по-дружески. С обоснованием цены не парься. Возьми цифры с прошлогодней закупки, подбей — и готово. Никто туда не лезет.", stage: tolikRelaxed },
        ],
        choices: [
            { text: "«Нет, пересчитаю. Цены за год уехали — потом не объяснишься.»", goto: "d1_phone1", tone: "good", effects: [{ stat: "integrity", delta: 5 }, { stat: "knowledge", delta: 2 }] },
            { text: "«А, логично. Чего время терять.»", goto: "d1_phone1", tone: "bad", effects: [{ stat: "integrity", delta: -10 }, { flag: "compliance" }, { achievement: "shortcut" }] },
        ],
    },
    {
        id: "d1_phone1",
        bg: "office",
        lines: [{ speaker: "narrator", text: "Телефон. На экране — «Бухгалтерия».", stage: empty }],
        choices: [
            { text: "Ответить — рабочий звонок", goto: "d1_phone2", tone: "good", effects: [{ stat: "application", delta: 5 }] },
            { text: "Сбросить, не до того", goto: "d1_phone2", tone: "neutral", effects: [{ stat: "application", delta: -5 }] },
        ],
    },
    {
        id: "d1_phone2",
        bg: "office",
        lines: [
            { speaker: "narrator", text: "Снова звонок. «Тётя Люся».", stage: empty },
            { speaker: "narrator", text: "«Алло, племяш! У Васьки своя фирма, дорогами занимается. Ты ж в закупках — пристрой его на этот ремонт, а? Свои люди, чего чужим отдавать.»" },
        ],
        choices: [
            { text: "«Не могу — это конфликт интересов, придётся заявлять самоотвод.»", goto: "d1_phone3", tone: "good", cite: { law: "44-ФЗ", ref: "ст. 31 ч. 9", note: "Личная заинтересованность — основание для отстранения." }, effects: [{ stat: "integrity", delta: 10 }, { stat: "knowledge", delta: 4 }, { achievement: "noConflict" }] },
            { text: "«Ладно, посмотрю, что можно сделать.»", goto: "d1_phone3", tone: "bad", effects: [{ stat: "integrity", delta: -12 }, { flag: "compliance" }, { achievement: "nepotism" }] },
        ],
    },
    {
        id: "d1_phone3",
        bg: "office",
        lines: [{ speaker: "narrator", text: "Опять звонок, номер незнакомый: «…ваш автомобиль, продлите гарантию на специальных условиях…»", stage: empty }],
        choices: [
            { text: "Сбросить", goto: "d1_draftIntro", tone: "good", effects: [{ stat: "soft", delta: 2 }] },
            { text: "Дослушать на всякий случай", goto: "d1_draftIntro", tone: "neutral", effects: [{ stat: "application", delta: -5 }, { stat: "stress", delta: 2 }] },
        ],
    },
    {
        id: "d1_draftIntro",
        bg: "office",
        lines: [
            { speaker: "narrator", text: "Вечереет. Система собрала черновик извещения. Геннадий Семёнович кивает на стул.", stage: krotovTask },
            { speaker: "krotov", text: "Садись. Вот черновик. Пройдись глазами и ткни, где накосячено. Только не наугад — я слежу.", stage: krotovTask },
        ],
        choices: [{ text: "Открыть черновик", goto: "d1_document" }],
    },
    { id: "d1_document", kind: "document", payload: "machines", bg: "office", goto: "d1_krotovPressure" },
    {
        id: "d1_krotovPressure",
        bg: "office",
        lines: [
            { speaker: "narrator", text: "Начальник тычет пальцем в строку про «или эквивалент» и багровеет.", stage: krotovTask },
            { speaker: "krotov", text: "А это что? «Или эквивалент»? Заказчику конкретная марка нужна была, а ты самодеятельность развёл. Убирай.", stage: krotovTask },
            { speaker: "player", text: "(Он давит. На верное решение. Прогнусь?)" },
        ],
        choices: [
            { text: "«Без „эквивалента“ нельзя — статья 33. Первая жалоба в ФАС, и закупку отменят, а нам предписание.»", goto: "d1_gate", tone: "good", cite: { law: "44-ФЗ", ref: "ст. 33 ч. 1 п. 1", note: "Указание товарного знака — только со словами «или эквивалент»." }, effects: [{ stat: "knowledge", delta: 8 }, { stat: "integrity", delta: 8 }, { stat: "trust", delta: 10 }, { stat: "stress", delta: -4 }, { achievement: "standsGround" }] },
            { text: "«А… да, как скажете. Уберу.»", goto: "d1_gate", tone: "bad", effects: [{ stat: "knowledge", delta: -8 }, { stat: "integrity", delta: -12 }, { stat: "trust", delta: 3 }, { flag: "compliance" }, { achievement: "bent" }] },
        ],
    },
    { id: "d1_gate", kind: "dayResult", payload: "1", bg: "office" },

    // ========================= ДЕНЬ 2 — МИДЛ =========================
    {
        id: "d2_start",
        bg: "office",
        lines: [
            { speaker: "narrator", text: "— ДЕНЬ ВТОРОЙ —", stage: empty },
            { speaker: "narrator", text: "Утро. Геннадий Семёнович ставит перед вами папку потолще.", stage: krotovStern },
            { speaker: "krotov", text: "Раз вчера выжил — сегодня ведёшь закупку сам, от и до. Закупаем асфальтобетонную смесь. Обоснуешь цену, соберёшь ТЗ, разрулишь поставку. Подключусь, только если поплывёшь.", stage: krotovStern },
        ],
        choices: [{ text: "Обосновать НМЦК", goto: "d2_nmck" }],
    },
    {
        id: "d2_nmck",
        bg: "office",
        lines: [
            { speaker: "narrator", text: "На столе три коммерческих предложения на одну и ту же смесь: 5,2 млн · 4,8 млн · 5,0 млн.", stage: empty },
            { speaker: "player", text: "(Как обосновать начальную цену методом сопоставимых рыночных цен?)" },
        ],
        choices: [
            { text: "Среднее арифметическое: (5,2 + 4,8 + 5,0) / 3 = 5,0 млн", goto: "d2_tz", tone: "good", cite: { law: "44-ФЗ", ref: "ст. 22 ч. 6", note: "Метод сопоставимых рыночных цен — приоритетный." }, effects: [{ stat: "knowledge", delta: 6 }, { stat: "application", delta: 8 }] },
            { text: "Взять минимальную — 4,8 млн, бюджету дешевле", goto: "d2_nmckWrong", tone: "neutral", effects: [{ stat: "application", delta: -5 }] },
            { text: "Взять максимальную — 5,2 млн, с запасом", goto: "d2_nmckWrong", tone: "neutral", effects: [{ stat: "application", delta: -5 }, { stat: "stress", delta: 3 }] },
        ],
    },
    {
        id: "d2_nmckWrong",
        bg: "office",
        lines: [{ speaker: "narrator", text: "Не так. При методе сопоставимых рыночных цен НМЦК — это среднее по полученным предложениям, а не «удобная» цифра. Иначе обоснование развалится при проверке.", stage: empty }],
        choices: [{ text: "Пересчитать среднее: 5,0 млн", goto: "d2_tz", cite: { law: "44-ФЗ", ref: "ст. 22 ч. 6", note: "Среднее по сопоставимым предложениям." }, effects: [{ stat: "knowledge", delta: 4 }, { stat: "application", delta: 4 }] }],
    },
    {
        id: "d2_tz",
        bg: "office",
        lines: [{ speaker: "player", text: "(Теперь материалы в техзадании. Что указать по происхождению?)", stage: empty }],
        choices: [
            { text: "Приоритет российским материалам; импорт — если нет аналога", goto: "d2_advice", tone: "good", cite: { law: "44-ФЗ", ref: "ст. 14", note: "Национальный режим: приоритет товарам из РФ и ЕАЭС." }, effects: [{ stat: "knowledge", delta: 6 }] },
            { text: "Самые дешёвые, происхождение неважно", goto: "d2_tzWrong", tone: "neutral", effects: [{ stat: "knowledge", delta: -5 }] },
            { text: "Только импортные — считаются качественнее", goto: "d2_tzWrong", tone: "neutral", effects: [{ stat: "knowledge", delta: -5 }] },
        ],
    },
    {
        id: "d2_tzWrong",
        bg: "office",
        lines: [{ speaker: "narrator", text: "Мимо. Действует национальный режим: товарам из РФ и ЕАЭС — приоритет, иностранным — ограничения и условия допуска. «Что подешевле» или «только импорт» — нарушение.", stage: empty }],
        choices: [{ text: "Исправить: приоритет российским материалам", goto: "d2_advice", cite: { law: "44-ФЗ", ref: "ст. 14", note: "Национальный режим при закупках." }, effects: [{ stat: "knowledge", delta: 4 }] }],
    },
    {
        id: "d2_advice",
        bg: "office",
        lines: [
            { speaker: "narrator", text: "Подсаживается Толик, заговорщицки.", stage: tolikRelaxed },
            { speaker: "tolik", text: "Слушай, контракт жирный. Давай раздробим на пять мелких, до шестисот тысяч каждый — и закупим у единственного, без конкурса. В разы быстрее, я и подрядчика подскажу, нашего.", stage: tolikRelaxed },
        ],
        choices: [
            { text: "«Нет. Искусственное дробление в обход конкурса — прямое нарушение. ФАС видит насквозь.»", goto: "d2_postavshik", tone: "good", cite: { law: "44-ФЗ", ref: "ст. 24, ст. 93", note: "Дробление закупки для ухода от конкурентных процедур недопустимо." }, effects: [{ stat: "knowledge", delta: 5 }, { stat: "integrity", delta: 8 }] },
            { text: "«А что, дело. Дробим.»", goto: "d2_postavshik", tone: "bad", effects: [{ stat: "integrity", delta: -10 }, { flag: "compliance" }] },
        ],
    },
    {
        id: "d2_postavshik",
        bg: "office",
        lines: [
            { speaker: "narrator", text: "Звонок с объекта. Поставщик «СтройГарант» завёз смесь — но марка ниже заявленной в ТЗ. Бумаги при этом оформлены красиво. На приёмке ждут вашего решения.", stage: empty },
        ],
        choices: [
            { text: "Не принимать — несоответствие ТЗ, оформить мотивированный отказ от приёмки", goto: "d2_eduard", tone: "good", cite: { law: "44-ФЗ", ref: "ст. 94", note: "Приёмка по условиям контракта; несоответствие — основание для отказа." }, effects: [{ stat: "application", delta: 6 }, { stat: "integrity", delta: 6 }] },
            { text: "Принять, чтобы не сорвать сроки", goto: "d2_eduard", tone: "bad", effects: [{ stat: "integrity", delta: -8 }, { flag: "compliance" }] },
            { text: "Принять, но устно попросить «исправиться»", goto: "d2_eduard", tone: "neutral", effects: [{ stat: "application", delta: -5 }] },
        ],
    },
    {
        id: "d2_eduard",
        bg: "office",
        lines: [
            { speaker: "narrator", text: "В кабинет заглядывает Эдуард Рустамович — куратор от руководства. Мягкий, в дорогом пиджаке. Прикрывает дверь.", stage: eduardScene },
            { speaker: "eduard", text: "По-дружески. Смету можно оптимизировать. Уберём один слой основания, марку смеси возьмём попроще — на глаз никто не отличит. Экономия миллионов восемь. Часть пойдёт на премии отделу, и тебя не обидим. Регион только спасибо скажет.", stage: eduardScene },
        ],
        choices: [
            { text: "«Это занижение существенных условий и нарушение проекта. По сути — взятка. Я не пойду на это.»", goto: "d2_document", tone: "good", cite: { law: "УК РФ", ref: "ст. 290–291", note: "Получение/дача взятки; занижение объёмов — нарушение условий контракта." }, effects: [{ stat: "knowledge", delta: 6 }, { stat: "integrity", delta: 14 }, { stat: "trust", delta: -6 }, { achievement: "incorruptible" }] },
            { text: "«Можно я подумаю до завтра?»", goto: "d2_document", tone: "neutral", effects: [{ stat: "application", delta: -5 }, { stat: "integrity", delta: -4 }] },
            { text: "«Ну… если это просто оптимизация — оформлю.»", goto: "d2_document", tone: "bad", effects: [{ stat: "integrity", delta: -16 }, { flag: "compliance" }, { flag: "eduardDeal" }, { stat: "trust", delta: 4 }, { achievement: "deal" }] },
        ],
    },
    {
        id: "d2_documentIntro",
        bg: "office",
        lines: [{ speaker: "narrator", text: "Конец дня. Система сформировала извещение для отправки в ЕИС.", stage: empty }],
        goto: "d2_document",
    },
    { id: "d2_document", kind: "document", payload: "asphalt", bg: "office", goto: "d2_gate" },
    { id: "d2_gate", kind: "dayResult", payload: "2", bg: "office" },

    // ========================= ДЕНЬ 3 — СЕНЬОР =========================
    {
        id: "d3_start",
        bg: "office",
        lines: [
            { speaker: "narrator", text: "— ДЕНЬ ТРЕТИЙ —", stage: empty },
            { speaker: "narrator", text: "Геннадий Семёнович встречает вас мрачнее тучи.", stage: krotovStern },
            { speaker: "krotov", text: "Бюджет выделили — теперь его надо освоить без приключений. Объект на контроле. Проследи, чтобы всё легло по проекту. Я на совещании, разруливай сам.", stage: krotovStern },
        ],
        choices: [{ text: "К делу", goto: "d3_zhaloba" }],
    },
    {
        id: "d3_zhaloba",
        bg: "office",
        lines: [{ speaker: "narrator", text: "С утра — жалоба в ФАС: проигравший участник заявляет, что ваше ТЗ ограничивало конкуренцию. Заседание завтра. Как действуете?", stage: empty }],
        choices: [
            { text: "Готовлю позицию: обоснованность требований, наличие «или эквивалент», ссылки на ст. 33 и практику", goto: "d3_rastorzhenie", tone: "good", cite: { law: "44-ФЗ", ref: "ст. 33; 135-ФЗ ст. 17", note: "Описание объекта и запрет ограничения конкуренции." }, effects: [{ stat: "knowledge", delta: 8 }, { stat: "application", delta: 6 }] },
            { text: "Игнорирую — авось рассмотрят и так", goto: "d3_rastorzhenie", tone: "neutral", effects: [{ stat: "application", delta: -6 }, { stat: "stress", delta: 5 }] },
            { text: "По-быстрому правлю документацию задним числом", goto: "d3_rastorzhenie", tone: "bad", effects: [{ stat: "integrity", delta: -10 }, { flag: "compliance" }] },
        ],
    },
    {
        id: "d3_rastorzhenie",
        bg: "office",
        lines: [{ speaker: "narrator", text: "Параллельно — подрядчик сорвал срок укладки на 30 дней, объект стоит. Решение?", stage: empty }],
        choices: [
            { text: "Одностороннее расторжение по ст. 95, фиксирую нарушение, начисляю неустойку", goto: "d3_rnp", tone: "good", cite: { law: "44-ФЗ", ref: "ст. 95", note: "Односторонний отказ заказчика от исполнения контракта." }, effects: [{ stat: "knowledge", delta: 6 }, { stat: "application", delta: 6 }] },
            { text: "Договориться по-тихому и продлить срок без оснований", goto: "d3_rnp", tone: "bad", effects: [{ stat: "integrity", delta: -8 }, { flag: "compliance" }] },
            { text: "Подождать ещё — вдруг доделают", goto: "d3_rnp", tone: "neutral", effects: [{ stat: "application", delta: -5 }, { stat: "stress", delta: 3 }] },
        ],
    },
    {
        id: "d3_rnp",
        bg: "office",
        lines: [{ speaker: "narrator", text: "После расторжения. Направить сведения о подрядчике в реестр недобросовестных поставщиков (РНП)?", stage: empty }],
        choices: [
            { text: "Да — основания есть, это обязанность заказчика, защитит других", goto: "d3_delivery", tone: "good", cite: { law: "44-ФЗ", ref: "ст. 104", note: "Ведение реестра недобросовестных поставщиков." }, effects: [{ stat: "knowledge", delta: 6 }, { stat: "integrity", delta: 8 }] },
            { text: "Нет — жалко, может, исправятся", goto: "d3_delivery", tone: "neutral", effects: [{ stat: "application", delta: -5 }] },
        ],
    },
    {
        id: "d3_delivery",
        bg: "office",
        lines: [
            { speaker: "narrator", text: "Новый поставщик завозит 5 тонн смеси — и сразу видно: марка ниже заявленной, асфальт низкой пробы. В отделе паника: дорога на контроле, сроки горят.", stage: empty },
            { speaker: "narrator", text: "В кабинет, не постучав, входит Эдуард Рустамович. За ним — представитель администрации района.", stage: eduardScene },
        ],
        goto: "d3_official",
    },
    {
        id: "d3_official",
        bg: "office",
        lines: [
            { speaker: "eduard", text: "Слушай, дорога нужна была ещё вчера. Асфальт нормальный, чего ты. По регламенту его и положено класть тонким слоем — четыре сантиметра. Заодно сэкономим. Клади этот, я всё согласую.", stage: eduardScene },
            { speaker: "player", text: "(Стоп. Просили другую марку. И толщина… по проекту верхний слой — не менее 5 см, а он говорит 4. Это не экономия. Это занижение объёма работ.)" },
        ],
        choices: [
            { text: "Согласиться: уложить 4 см, как говорит Эдуард — сроки важнее", goto: "d3_theft", tone: "bad", effects: [{ stat: "integrity", delta: -20 }, { flag: "asphalt:1" }, { achievement: "theft" }] },
            { text: "Принять смесь, но уложить по регламенту — 5 см, оформив претензию по качеству", goto: "d3_correct", tone: "good", cite: { law: "ГОСТ / проект", ref: "44-ФЗ ст. 94, 95", note: "Толщина слоя — существенное условие; занижение недопустимо." }, effects: [{ stat: "knowledge", delta: 8 }, { stat: "integrity", delta: 12 }, { stat: "application", delta: 8 }, { flag: "asphalt:2" }, { achievement: "centimeter" }] },
            { text: "Отказаться принимать этот асфальт, ждать качественный — пусть сроки горят", goto: "d3_refuse", tone: "neutral", cite: { law: "44-ФЗ", ref: "ст. 94", note: "Мотивированный отказ от приёмки несоответствующего товара." }, effects: [{ stat: "integrity", delta: 6 }, { stat: "application", delta: -8 }, { stat: "stress", delta: 8 }, { flag: "asphalt:3" }, { achievement: "centimeter" }] },
        ],
    },
    {
        id: "d3_theft",
        bg: "office",
        lines: [
            { speaker: "narrator", text: "Каток прошёл по тонкому слою. Через неделю — внеплановая проверка с лабораторным контролем кернов. Толщина не бьётся с проектом. Это не «оптимизация» — это хищение бюджетных средств.", stage: krotovAngry },
            { speaker: "krotov", text: "Ты понимаешь, что подписал? Это уже не выговор. Это статья.", stage: krotovAngry },
        ],
        goto: "d3_gate",
    },
    {
        id: "d3_correct",
        bg: "office",
        lines: [
            { speaker: "narrator", text: "Вы оформляете претензию по качеству, фиксируете несоответствие марки и настаиваете на укладке строго по проекту — 5 см. Эдуард мрачнеет, но возразить по закону нечего.", stage: eduardScene },
            { speaker: "krotov", text: "Знаешь… за тридцать лет таких, как ты, по пальцам. И сантиметр поймал, и на Эдуарда не повёлся.", stage: krotovStern },
        ],
        goto: "d3_gate",
    },
    {
        id: "d3_refuse",
        bg: "office",
        lines: [
            { speaker: "narrator", text: "Вы оформляете мотивированный отказ от приёмки. Формально — чисто, нарушения нет. Но объект встал, а сроки сорваны: район остался без дороги к началу сезона.", stage: krotovStern },
            { speaker: "krotov", text: "По закону — не подкопаешься. Но дорога нужна была людям сейчас. Стержень есть, гибкости не хватило.", stage: krotovStern },
        ],
        goto: "d3_gate",
    },
    { id: "d3_gate", kind: "dayResult", payload: "3", bg: "office" },

    // финальный отчёт
    { id: "final", kind: "final", bg: "office" },
];

export const SCENES: Record<string, SceneNode> = Object.fromEntries(NODES.map((n) => [n.id, n]));

export const START_NODE = "d0_welcome";
