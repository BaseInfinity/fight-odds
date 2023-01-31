var Fraction = require('fractional').Fraction

export default class Competitor {
   fullName: string
   decimalOdds: number

   constructor(fullName: string, decimalOdds: number) {
      this.fullName = fullName
      this.decimalOdds = decimalOdds
   }

   public getAmericanOdds() {
      if (this.decimalOdds < 2) {
         return `-${(100/(this.decimalOdds - 1)).toFixed(0)}`
      } else {
         return `+${((this.decimalOdds - 1) * 100).toFixed(0)}`
      }
   }

   public getBritishOdds() {
      let fractionalOdds = new Fraction(this.decimalOdds - 1)

      if (fractionalOdds.denominator === 1) {
         return `${fractionalOdds}/1`
      } else {
         return `${fractionalOdds.numerator}/${fractionalOdds.denominator}`
      }
   }

   public getWinProbability() {
      return `${(100/this.decimalOdds).toFixed(1)}%`
   }

   public getReturnWinnings(wagerAmount: number) {
      return `$${((wagerAmount * this.decimalOdds) - wagerAmount).toFixed(2)}`
   }

   public simpleJson() {
      return {
         fullName: this.fullName,
         winProbability: this.getWinProbability(),
         americanOdds: this.getAmericanOdds(),
         decimalOdds: this.decimalOdds,
         britishOdds: this.getBritishOdds(),
         simpleWin: this.getReturnWinnings(100),
      }
   }
}