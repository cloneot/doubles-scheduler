function incMod(x, mod) {
	x += 1;
	return x === mod ? 0 : x;
}

let LEN = 5;
function dlas(f, mutate, initial, maxIdleIters = Number.MAX_SAFE_INTEGER) {
	let S = [initial.clone(), initial.clone(), initial.clone()];
	let curF = f(S[0]);
	let curPos = 0;
	let minPos = 0;

	let fitness = new Array(LEN).fill(curF);
	let minF = curF;
	let k = 0;

	for (let idleIters = 0; idleIters < maxIdleIters; idleIters += 1) {
		// console.log(minF);
		let prvF = curF;

		let newPos = incMod(curPos, 3);
		if (newPos === minPos) newPos = incMod(newPos, 3);

		S[newPos] = S[curPos].clone();
		mutate(S[newPos]);
		newF = f(S[newPos]);
		if (newF < minF) {
			idleIters = 0;
			minPos = newPos;
			minF = newF;
		}
		if (newF === curF || newF < Math.max(...fitness)) {
			curPos = newPos;
			curF = newF;
		}

		if (curF > fitness[k] || (curF < fitness[k] && curF < prvF)) {
			fitness[k] = curF;
		}
		k = incMod(k, LEN);
	}
	return [S[minPos], minF];
}
