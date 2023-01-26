import Competitor from "./competitor"

export default class MatchUp {
   home: Competitor
   away: Competitor

   constructor(home: Competitor, away: Competitor) {
       this.home = home
       this.away = away
   }

   getSummary() {
       return `\`${this.home.fullName}: ${this.home.getAmericanOdds()} | ${Number(this.home.decimalOdds).toFixed(2)} | ${this.home.getWinProbability()}
${this.away.fullName}: ${this.away.getAmericanOdds()} | ${Number(this.away.decimalOdds).toFixed(2)} | ${this.away.getWinProbability()}\``
   }
}