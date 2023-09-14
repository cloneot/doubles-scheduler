function shuffle(arr) {
	for (let i = arr.length - 1; i > 0; --i) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
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

function showState(state) {
	// print to div#result
	const result = document.getElementById("result");
	result.innerHTML = "";
	for (let time = 0; time < state.timeNumber; ++time) {
		const timeDiv = document.createElement("div");
		timeDiv.classList.add("time");
		timeDiv.innerHTML = `time: ${time}`;
		result.appendChild(timeDiv);
		for (const match of state.matches[time]) {
			const matchDiv = document.createElement("div");
			matchDiv.classList.add("match");
			matchDiv.innerHTML = `${state.players[match.group1[0]].name} ${
				state.players[match.group1[1]].name
			} ${calcPerformance(
				state.players[match.group1[0]].rating,
				state.players[match.group1[1]].rating
			)} vs ${state.players[match.group2[0]].name} ${
				state.players[match.group2[1]].name
			} ${calcPerformance(
				state.players[match.group2[0]].rating,
				state.players[match.group2[1]].rating
			)}`;
			result.appendChild(matchDiv);
		}
	}
}

function addDownloadBtn(state) {
	const table = new Array(1 + 2 * state.timeNumber)
		.fill(null)
		.map(() => new Array(1 + 2 * state.courtNumber).fill(""));

	for (let i = 0; i < state.courtNumber; ++i) {
		table[0][1 + 2 * i] = `court ${i + 1}`;
	}
	for (let i = 0; i < state.timeNumber; ++i) {
		table[1 + 2 * i][0] = `time ${i + 1}`;
		for (let j = 0; j < state.courtNumber; ++j) {
			const match = state.matches[i][j];
			table[1 + 2 * i][1 + 2 * j] = `${
				state.players[match.group1[0]].name
			}`;
			table[1 + 2 * i + 1][1 + 2 * j] = `${
				state.players[match.group1[1]].name
			}`;
			table[1 + 2 * i][1 + 2 * j + 1] = `${
				state.players[match.group2[0]].name
			}`;
			table[1 + 2 * i + 1][1 + 2 * j + 1] = `${
				state.players[match.group2[1]].name
			}`;
		}
	}

	const content = "\uFEFF" + table.map((row) => row.join(",")).join("\n");
	let blob = new Blob([content], { type: "text/csv;charset=utf-8" });

	const a = document.createElement("a");
	a.href = URL.createObjectURL(blob);
	a.download = "schedule.csv";
	a.innerHTML = "download";

	const container = document.querySelector("#download-container");
	container.replaceChildren([]);
	container.appendChild(a);
}

function notifyProgress(progress, total) {
	const progressDiv = document.querySelector("#progress");
	progressDiv.innerHTML = `progress: ${progress} / ${total}`;
}
