import { CardColorVariant } from "views/Home/Home.styles"

export const getCardBackgroundColor = (temp: number): CardColorVariant => {
    if (temp <= 15) return 'background-blue'
    else if (temp >= 35) return 'background-red'
    else return 'background-yellow'
}