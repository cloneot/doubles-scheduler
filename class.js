const Sex = {
	MALE: 0,
	FEMALE: 1,
};

class Player {
	constructor(
		id,
		name,
		sex,
		rating,
		validTimeStart = 1,
		validTimeEnd = 100,
		gameCnt = 0,
		team
	) {
		this.id = id;
		this.name = name;
		this.sex = sex;
		this.rating = rating;
		this.validTimeStart = validTimeStart;
		this.validTimeEnd = validTimeEnd;
		this.gameCnt = gameCnt;
		this.team = team;
	}

	clone() {
		return new Player(
			this.id,
			this.name,
			this.sex,
			this.rating,
			this.validTimeStart,
			this.validTimeEnd,
			this.gameCnt,
			this.team
		);
	}

	isValidTime(time) {
		return this.validTimeStart <= time && time <= this.validTimeEnd;
	}
}

class Match {
	constructor(p1, p2, p3, p4) {
		// type: Number
		this.group1 = [p1, p2];
		this.group2 = [p3, p4];
	}

	clone() {
		return new Match(
			this.group1[0],
			this.group1[1],
			this.group2[0],
			this.group2[1]
		);
	}
}

class State {
	constructor(courtNumber, timeNumber, players, matches = null) {
		this.courtNumber = courtNumber;
		this.timeNumber = timeNumber;
		this.players = players.map((p) => p.clone());

		if (matches !== null) {
			this.matches = matches.map((x) => x.map((match) => match.clone()));
			return;
		}
		// console.group("state constructor:");

		const team1 = [];
		const team2 = [];
		for (const player of this.players) {
			// console.info(player);
			for (let i = 0; i < player.gameCnt; ++i) {
				if (player.team == 1) {
					team1.push(player.id);
				} else if (player.team == 2) {
					team2.push(player.id);
				}
			}
		}
		shuffle(team1);
		shuffle(team2);

		this.matches = [];
		for (let i = 0; i < this.timeNumber; ++i) {
			this.matches.push([]);
			for (let j = 0; j < this.courtNumber; ++j) {
				this.matches[i].push(
					new Match(
						team1[2 * (i * courtNumber + j)],
						team1[2 * (i * courtNumber + j) + 1],
						team2[2 * (i * courtNumber + j)],
						team2[2 * (i * courtNumber + j) + 1]
					)
				);
			}
		}
		// console.info(this.matches);

		// console.groupEnd();
	}

	clone() {
		return new State(
			this.courtNumber,
			this.timeNumber,
			this.players,
			this.matches
		);
	}
}
