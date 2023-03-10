import Competitor from "./competitor"

const { EmbedBuilder } = require('discord.js');

export default class MatchUp {
	home: Competitor
	away: Competitor

	constructor(home: Competitor, away: Competitor) {
		this.home = home
		this.away = away
	}

	getSummary() {
		const exampleEmbed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle(`${this.home.fullName} Vs. ${this.away.fullName} π₯`)
			.addFields(
				{ name: `${this.home.fullName}`, value: ` ` },
				{ name: 'Win %', value: `${this.home.getWinProbability()}`, inline: true },
				{ name: 'Bet $100', value: `${this.home.getReturnWinnings(100)}`, inline: true },
				{ name: 'O/U', value: `N/A`, inline: true },
				{ name: 'πΊπΈ', value: `${this.home.getAmericanOdds()}`, inline: true },
				{ name: 'πͺπΊ', value: `${Number(this.home.decimalOdds).toFixed(2)}`, inline: true },
				{ name: 'π¬π§', value: `${this.home.getBritishOdds()}`, inline: true },
				{ name: '\u200b', value: '\u200b', inline: false },
				{ name: `${this.away.fullName}`, value: ` ` },
				{ name: 'Win %', value: `${this.away.getWinProbability()}`, inline: true },
				{ name: 'Bet $100', value: `${this.away.getReturnWinnings(100)}`, inline: true },
				{ name: 'O/U', value: `N/A`, inline: true },
				{ name: 'πΊπΈ', value: `${this.away.getAmericanOdds()}`, inline: true },
				{ name: 'πͺπΊ', value: `${Number(this.away.decimalOdds).toFixed(2)}`, inline: true },
				{ name: 'π¬π§', value: `${this.away.getBritishOdds()}`, inline: true },
			)

		return exampleEmbed
	}
}
