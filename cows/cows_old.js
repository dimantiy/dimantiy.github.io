// # Game functions

function game() {
	// Generate number
	var prp = new Proposer();
	print({ "Input": prp.getNumber() });
	var slv = new Solver();
	var steps = 0;
	// Game cycle
	while (!slv.isEnd()) {
		var hyp = slv.tryNext(prp);
		hyp.Step = ++steps;
		print(hyp);
	}
	// Game over
	print({ "Output": slv.getResult(), "Steps": steps });
};



function Proposer() {
	this.init();
};

Proposer.prototype.init = function () {
	this._number = this._getRandom();
};

Proposer.prototype.getNumber = function () {
	return this._number;
};

Proposer.prototype.check = function (num) {
	return {
		Number: num,
		Bulls: getBulls(this._number, num),
		Cows: getCows(this._number, num)
	};
};

Proposer.prototype._getRandom = function () { 
	var arr = [];
	for (var i = 1; i <= 9; i++) {
		arr.push({
			Number: i,
			Weight: Math.random()
		});
	}
	arr.sort(sortWeight);
	var num = arr[0].Number * 1000 + arr[1].Number * 100 + arr[2].Number * 10 + arr[3].Number;
	return num;
};

function Solver() {
	this.init();
};

Solver.prototype.init = function () {
	this._all = this._getAll();
	this._result = 0;
	this._hypo = [];
};

Solver.prototype._getAll = function () {
	var all = [];
	for (var a = 1; a <= 9; a++) {
		for (var b = 1; b <= 9; b++) {
			if (a === b) continue;
			for (var c = 1; c <= 9; c++) {
				if (a === c || b === c) continue;
				for (var d = 1; d <= 9; d++) {
					if (a === d || b === d || c === d) continue;
					all.push({
						Number: a * 1000 + b * 100 + c * 10 + d,
						Weight: Math.random()
					});
				}
			}
		}
	}
	all.sort(sortWeight);
	return all;
};

Solver.prototype.isEnd = function () {
	return this._all.length === 0 || this._result !== 0;
};

Solver.prototype.tryNext = function (prp) {
	var hyp = null;
	
	while (this._all.length) {
		var num = this._all.pop().Number;
		if (this._hypo.length === 0) {
			hyp = prp.check(num);
		} else {
			for (var i = 0; i < this._hypo.length; i++) {
				var h = this._hypo[i];
				if (getBulls(num, h.Number) !== h.Bulls) break;
				if (getCows(num, h.Number) !== h.Cows) break;
				if (i === this._hypo.length - 1) {
					hyp = prp.check(num);
				}
			}
		}
		if (hyp) break;
	}
	
	if (hyp) {
		this._hypo.push(hyp);
		if (hyp.Bulls === 4) {
			this._result = hyp.Number;
		}
	}
	return hyp;
};

Solver.prototype.getResult = function () {
	return this._result;
};

// # Helper functions

function getBulls(a, b) {
	a = a.toString();
	b = b.toString();
	var bulls = 0;
	for (var i = 0; i < a.length; i++) {
		if (b.indexOf(a[i]) === i) {
			bulls++;
		}
	}
	return bulls;
};

function getCows(a, b) {
	a = a.toString();
	b = b.toString();
	var cows = 0;
	for (var i = 0; i < a.length; i++) {
		var ind = b.indexOf(a[i]);
		if (ind >= 0 && ind !== i) {
			cows++;
		}
	}
	return cows;
};

function sortWeight(a, b) {
	return a.Weight - b.Weight;
};

function print(obj) {
	console.log(JSON.stringify(obj));
};


// # Main code

//game();