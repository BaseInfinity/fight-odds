import Competitor from "./competitor"
import Formatter from "./formatter"

export default class MatchUp {
   home: Competitor
   away: Competitor

   constructor(home: Competitor, away: Competitor) {
       this.home = home
       this.away = away
   }

   getSummary() {
      const data = [
         this.home.simpleJson(),
         this.away.simpleJson(),
      ];

      const columnWidths = Formatter.getColumnWidths(data);
      const keys = Object.keys(data[0]);

      return `\`\`\`
${Formatter.createRow(data[0], columnWidths, keys)}
${Formatter.createRow(data[1], columnWidths, keys)}
\`\`\``
   }
}
