export default class Formatter {
    public static getColumnWidths(data: string | any[]) {
        const columnWidths = [];
        const keys = Object.keys(data[0]);
        for (let i = 0; i < keys.length; i++) {
            let maxLength = 0;
            for (let j = 0; j < data.length; j++) {
                let cell = data[j][keys[i]];

                maxLength = Math.max(maxLength, cell.length);
            }
            columnWidths.push(maxLength + 1);
        }
        return columnWidths;

    }

    public static createRow(data: { [x: string]: any; fullName?: string; winProbability?: string; americanOdds?: string; decimalOdds?: number; britishOdds?: string; simpleWin?: string; }, columnWidths: string | any[], keys: string | any[]) {
        let row = "";
        for (let i = 0; i < keys.length - 1; i++) {
            let cell = data[keys[i]];

            row += "".padStart(columnWidths[i] - cell.length, " ") + cell + " |";
        }

        let cell = data[keys[keys.length - 1]];
        row += "".padStart(columnWidths[columnWidths.length - 1] - cell.length, " ") + cell;

        return row;
    }
}