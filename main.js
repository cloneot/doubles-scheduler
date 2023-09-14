const impoConst = 15 ** 4;
const sexDiffConst = 5 ** 4;

function calcPerformance(rating1, rating2) {
	if (rating1 > rating2) {
		const tmp = rating1;
		rating1 = rating2;
		rating2 = tmp;
	}
	return rating1 + rating2;
	// return rating1*1.2 + rating2*0.8;
}

function f(state) {
	const matchCnt = state.timeNumber * state.courtNumber;

	// 기본 cost = sum { (퍼포먼스 차)^4 }
	let perfDiffPenalty = 0;
	for (let i = 0; i < state.timeNumber; ++i) {
		for (let j = 0; j < state.courtNumber; ++j) {
			const performance1 = calcPerformance(
				...state.matches[i][j].group1.map(
					(id) => state.players[id].rating
				)
			);
			const performance2 = calcPerformance(
				...state.matches[i][j].group2.map(
					(id) => state.players[id].rating
				)
			);
			// console.log(performance1, performance2);
			const diff = performance1 - performance2;
			perfDiffPenalty += diff ** 4;
		}
	}

	// 같은 시간대에 여러 게임 -> 불가능
	let impoCnt = 0;
	for (const x of state.matches) {
		for (let i = 0; i < state.courtNumber; ++i) {
			if (x[i].group1[0] === x[i].group1[1]) impoCnt += 1;
			if (x[i].group2[0] === x[i].group2[1]) impoCnt += 1;
			for (let j = i + 1; j < state.courtNumber; ++j) {
				for (const p of x[i].group1) {
					for (const q of x[j].group1) {
						if (p !== q) continue;
						impoCnt += 1;
					}
				}
				for (const p of x[i].group2) {
					for (const q of x[j].group2) {
						if (p !== q) continue;
						impoCnt += 1;
					}
				}
			}
		}
	}

	// 선수가 없는 시간에 잡힌 게임 -> 불가능
	for (let time = 0; time < state.timeNumber; ++time) {
		for (const x of state.matches[time]) {
			for (const p of [...x.group1, ...x.group2]) {
				if (!state.players[p].isValidTime(time + 1)) {
					impoCnt += 1;
				}
			}
		}
	}

	// 게임 종류 다름 -> 페널티
	let sexDiffCnt = 0;
	for (const x of state.matches) {
		for (const match of x) {
			if (
				match.group1.reduce(
					(acc, idx) => acc + state.players[idx].sex,
					0
				) !==
				match.group2.reduce(
					(acc, idx) => acc + state.players[idx].sex,
					0
				)
			) {
				sexDiffCnt += 1;
			}
		}
	}

	const cost =
		perfDiffPenalty +
		impoCnt * impoConst * matchCnt +
		sexDiffCnt * sexDiffConst;
	return cost;
}

function mutate(state) {
	const time1 = Math.floor(Math.random() * state.timeNumber);
	const time2 = Math.floor(Math.random() * state.timeNumber);
	const court1 = Math.floor(Math.random() * state.courtNumber);
	const court2 = Math.floor(Math.random() * state.courtNumber);
	const seat1 = Math.floor(Math.random() * 2);
	const seat2 = Math.floor(Math.random() * 2);

	if (Math.random() < 0.5) {
		const tmp = state.matches[time1][court1].group1[seat1];
		state.matches[time1][court1].group1[seat1] =
			state.matches[time2][court2].group1[seat2];
		state.matches[time2][court2].group1[seat2] = tmp;
	} else {
		const tmp = state.matches[time1][court1].group2[seat1];
		state.matches[time1][court1].group2[seat1] =
			state.matches[time2][court2].group2[seat2];
		state.matches[time2][court2].group2[seat2] = tmp;
	}
}

function main(input) {
	// parse input
	const [courtNumber, timeNumber, players] = parseInput(input);

	// validate input
	const team1GameCnt = players.reduce(
		(acc, cur) => acc + (cur.team === 1) * cur.gameCnt,
		0
	);
	const team2GameCnt = players.reduce(
		(acc, cur) => acc + (cur.team === 2) * cur.gameCnt,
		0
	);
	if (team1GameCnt !== team2GameCnt) {
		alert(
			`${team1GameCnt}(team1 game count) != ${team2GameCnt}(team2 game count)`
		);
		return;
	}
	if (team1GameCnt + team2GameCnt !== courtNumber * timeNumber * 4) {
		alert(
			`${team1GameCnt + team2GameCnt}(team1+team2 game count) != ${
				courtNumber * timeNumber * 4
			}(total seat number)`
		);
		return;
	}

	// generate initial state
	let initState = new State(courtNumber, timeNumber, players);
	// console.log(initState);

	// dlas
	let bestState = initState.clone();
	let bestCost = f(bestState);
	// console.group("dlas start");
	for (let i = 0; i < 256; ++i) {
		const [state, cost] = dlas(f, mutate, initState, 5000);
		notifyProgress(i + 1, 256);
		if (cost < bestCost) {
			bestCost = cost;
			bestState = state.clone();
		}
	}
	// console.groupEnd();

	// save best solution
	// console.log(`best cost: ${bestCost}`);
	// console.log(`average cost: ${bestCost / (courtNumber * timeNumber)}`);
	showState(bestState);
	addDownloadBtn(bestState);
}
