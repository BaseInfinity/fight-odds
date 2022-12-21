import Competitor from "./competitor"

export default class MatchUp {
    home: Competitor
    away: Competitor

    constructor(home: Competitor, away: Competitor) {
        this.home = home
        this.away = away
    }

    getSummary() {
        return `\`${this.home.fullName} (${this.home.getAmericanOdds()}) (${this.home.getWinProbability()}) Vs. ${this.away.fullName} (${this.away.getAmericanOdds()}) (${this.away.getWinProbability()})\``
    }
}