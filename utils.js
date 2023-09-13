function shuffle(arr) {
	arr.sort((a, b) => Math.random() - 0.5);
}

function string2Sex(str) {
	if (str === "남") return Sex.MALE;
	if (str === "여") return Sex.FEMALE;
	throw new Error(`tried invalid type conversion (string -> sex): ${str}`);
}

function parseValidTime(validTimeStartStr, validTimeEndStr, timeNumber) {
	let validTimeStart = parseInt(validTimeStartStr) ?? 1;
	let validTimeEnd = parseInt(validTimeEndStr) ?? -1;
	if (validTimeStart < 0) validTimeStart = timeNumber + 1 + validTimeStart;
	if (validTimeEnd < 0) validTimeEnd = timeNumber + 1 + validTimeEnd;
	return [validTimeStart, validTimeEnd];
}

function parseInput(input) {
	const lines = input.split("\n");
	const [courtNumberStr, timeNumberStr] = lines[1].split(",");

	const courtNumber = parseInt(courtNumberStr);
	const timeNumber = parseInt(timeNumberStr);
	const players = [];
	const team1 = [];
	const team2 = [];

	let id = 0;
	for (let i = 4; i < lines.length; ++i) {
		const [
			teamStr,
			gameCntStr,
			validTimeStartStr,
			validTimeEndStr,
			name,
			sexStr,
			ratingStr,
		] = lines[i].split(",");

		if (!teamStr) continue; // 대진표에 포함되지 않음

		const team = parseInt(teamStr);
		const gameCnt = parseInt(gameCntStr) ?? -1;
		const [validTimeStart, validTimeEnd] = parseValidTime(
			validTimeStartStr,
			validTimeEndStr,
			timeNumber
		);
		const sex = string2Sex(sexStr);
		const rating = parseInt(ratingStr);

		const player = new Player(
			id++,
			name,
			sex,
			rating,
			validTimeStart,
			validTimeEnd,
			gameCnt,
			team
		);

		players.push(player);
		if (team === 1) {
			team1.push(players.length - 1);
		} else if (team === 2) {
			team2.push(players.length - 1);
		}
	}

	return [courtNumber, timeNumber, players];
}

function logState(state) {
	console.group("log state");
	for (let time = 0; time < state.timeNumber; ++time) {
		console.log("time: " + time);
		for (const match of state.matches[time]) {
			console.log(
				state.players[match.group1[0]].name +
					" " +
					state.players[match.group1[1]].name +
					" " +
					calcPerformance(state.players[match.group1[0]].rating,
						state.players[match.group1[1]].rating) +
					" vs " +
					state.players[match.group2[0]].name +
					" " +
					state.players[match.group2[1]].name +
					" " +
					calcPerformance(state.players[match.group2[0]].rating,
						state.players[match.group2[1]].rating)
			);
		}
	}
	console.groupEnd();
}
