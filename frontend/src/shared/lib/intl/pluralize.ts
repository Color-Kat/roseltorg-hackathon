/**
 * Declension of words depending on number using Intl.PluralRules
 */

type PluralForms = {
    one: string;      // 1 день
    few: string;      // 2-4 дня
    many: string;     // 5+ дней
    other?: string;   // для других языков
};

const pluralRulesRu = new Intl.PluralRules('ru-RU');

export function pluralize(count: number, forms: PluralForms): string {
    const rule = pluralRulesRu.select(count);

    // For russian Intl.PluralRules returns: one, few, many, other
    switch (rule) {
        case 'one':
            return forms.one;
        case 'few':
            return forms.few;
        case 'many':
            return forms.many;
        case 'other':
            return forms.other ?? forms.many;
        default:
            return forms.many;
    }
}

/**
 * Declension of the word "день"
 */
export function pluralizeDays(count: number): string {
    return pluralize(count, {
        one : 'день',
        few : 'дня',
        many: 'дней',
    });
}

/**
 * Declension of the word "день"
 */
export function pluralizeScans(count: number): string {
    return pluralize(count, {
        one : 'скан',
        few : 'скана',
        many: 'сканов',
    });
}
