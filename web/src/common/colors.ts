
export enum COLORS {
    BanakuHeaderBackground = "#6A2C70",
    BanakuHeaderColor = "#f8f8f8",
    KitchenHeaderBackground = "#FFC47E",
    KitchenHeaderColor = "#f8f8f8",
    PizzaHeaderBackground = "#B83B5E",
    PizzaHeaderColor = "#f8f8f8",
    SallaHeaderBackground = "#F08A5D",
    SallaHeaderColor = "#f8f8f8",
}

export const generateCssVariables = () => {
    let cssVariables = '';
    for (const key in COLORS) {
        if (Object.prototype.hasOwnProperty.call(COLORS, key)) {
            cssVariables += `--${key.toLowerCase()}: ${COLORS[key as keyof typeof COLORS]};\n`;
        }
    }
    return cssVariables;
};
