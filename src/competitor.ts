var Fraction = require('fractional').Fraction
import { toDecimal, toVulgar } from 'vulgar-fractions';

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
      // Create a new fraction with the new keyword:
      let fractionalOdds = new Fraction(this.decimalOdds - 1)
      return toVulgar(this.decimalOdds - 1)
   }

   public getWinProbability() {
      return `${(100/this.decimalOdds).toFixed(1)}%`
   }
}