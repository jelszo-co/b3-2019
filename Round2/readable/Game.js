// |**********************************|
// Bakonyi Bitfaragó Bajnokság 2019
// Jelszo csapat
// Második forduló
// |**********************************|

"use strict";

const e = React.createElement;

// Adatbekérő űrlap
class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			formRows: "",
			formCols: "",
			minValue: 5,
			maxValue: 15,
			gameStarted: false,
			hardMode: false
		};
	}

	render() {
		const {
			hardMode,
			gameStarted,
			formRows,
			formCols,
			minValue,
			maxValue
		} = this.state;

		// Bekérés gomb megnyomásakor ellenőrzés után Tábla megjelenítése
		const onSubmit = (e) => {
			e.preventDefault();
			if (
				formRows < minValue ||
				formRows > maxValue ||
				formCols < minValue ||
				formCols > maxValue
			) {
				alert(
					`Hopsz! Az értékeknek ${minValue} és ${maxValue} között kell lenniük.`
				);
			} else {
				this.setState({ gameStarted: true });
			}
		};
		const onChange = (e) => {
			this.setState({ [e.target.name]: e.target.value });
		};
		const changeMode = () => {
			this.setState({ hardMode: !this.state.hardMode });
		};
		if (gameStarted) {
			return <Game rows={formRows} cols={formCols} hardMode={hardMode} />;
		} else {
			return (
				<div className="input">
					<h2>Tábla generálása</h2>
					<p>
						Minimum <b>{minValue + "x" + minValue}</b>, maximum{" "}
						<b>{maxValue + "x" + maxValue}</b> négyzet.
					</p>
					<form onSubmit={onSubmit}>
						<input
							type="number"
							name="formRows"
							placeholder="Sorok"
							value={formRows}
							onChange={onChange}
							autoFocus={true}
							required
						/>
						<input
							type="number"
							name="formCols"
							placeholder="Oszlopok"
							value={formCols}
							onChange={onChange}
							required
						/>
						<div className="checkbox-wrapper">
							<div
								className={`checkbox ${hardMode ? "checkbox-hard" : ""}`}
								onClick={changeMode}
							>
								<span
									className={`checkbox__circle ${
										hardMode ? "checkbox__circle-hard" : ""
									}`}
								></span>
							</div>
							<p>
								Mód: <span>{hardMode ? "Nehezített" : "Sima"}</span>
							</p>
						</div>
						<input type="submit" value="Generálás!" />
					</form>
					<hr id="hr" />
					<p id="about">A játékról röviden:</p>
					<p>Adott egy négyzetrácsos tábla. Meg lehet-e oldani, hogy valamelyik mezőjére leteszünk egy huszár figurát, majd a bábu sakk-lépéseinek megfelelően a teljes pályát bejárjuk úgy, hogy minden mezőre pontosan egyszer lépünk?</p>
					<p>A nehezített módban úgynevezett "szenzormezők" vannak véletlenszerűen elhelyezve a pályán. Ilyenkor ha a játékos túl sok időd tölt ezen a területen (5 mp), akkor vége a játéknak.</p>
				</div>
			);
		}
	}
}

// Játéktábla
class Game extends React.Component {
	constructor(props) {
		super(props);

		// Megjelenéskor adott méretű (úrlapról kapott adatok) kétdimenziós tömb generálása
		let initTable = [];
		for (let i = 0; i < props.rows; i++) {
			initTable[i] = [];
			for (let j = 0; j < props.cols; j++) {
				initTable[i][j] = {
					row: i,
					col: j,
					avail: false,
					occup: false,
					text: "x"
				};
			}
		}
		if (props.hardMode === true) {
			// Nehezített mód esetén 6db véletlenszerű szenzorpozíció generálása
			let sensorRow = Math.floor(Math.random() * props.rows);
			let sensorCol = Math.floor(Math.random() * props.cols);
			let sensorRow2 = Math.floor(Math.random() * props.rows);
			let sensorCol2 = Math.floor(Math.random() * props.cols);
			let sensorRow3 = Math.floor(Math.random() * props.rows);
			let sensorCol3 = Math.floor(Math.random() * props.cols);

			// Függvény szenzormezők generálására
			const genSensors = (i, j, dim, isCross) => {
				initTable[i][j].isSensorCenter = true;
				initTable[i][j].isSensorArea = true;
				let interval, smallInterval;
				let dimSmall = dim - 2;
				let medianDim = Math.floor(dim / 2);
				smallInterval =
					(dimSmall - (dimSmall % 2)) / 2 - (dimSmall - (dimSmall % 2));
				interval = (dim - (dim % 2)) / 2 - (dim - (dim % 2));

				if (isCross === true) {
					for (let ii = 0; ii < dim; ii++) {
						for (let jj = 0; jj < dim; jj++) {
							if (i + ii + interval >= 0 && i + ii + interval < props.rows) {
								if (j + jj + interval >= 0 && j + jj + interval < props.cols) {
									if (
										(ii === 0 && jj === medianDim) ||
										(ii === medianDim && jj === 0) ||
										(ii === medianDim && jj === dim - 1) ||
										(ii === dim - 1 && jj === medianDim)
									) {
										initTable[i + ii + interval][
											j + jj + interval
										].isSensorArea = true;
									}
								}
							}
						}
					}

					for (let ii = 0; ii < dimSmall; ii++) {
						for (let jj = 0; jj < dimSmall; jj++) {
							if (
								i + ii + smallInterval >= 0 &&
								i + ii + smallInterval < props.rows
							) {
								if (
									j + jj + smallInterval >= 0 &&
									j + jj + smallInterval < props.cols
								) {
									initTable[i + ii + smallInterval][
										j + jj + smallInterval
									].isSensorArea = true;
								}
							}
						}
					}
				} else {
					for (let ii = 0; ii < dim; ii++) {
						for (let jj = 0; jj < dim; jj++) {
							if (i + ii + interval >= 0 && i + ii + interval < props.rows) {
								if (j + jj + interval >= 0 && j + jj + interval < props.cols) {
									initTable[i + ii + interval][
										j + jj + interval
									].isSensorArea = true;
								}
							}
						}
					}
				}
			};
			// Tábla méretétől függően szenzormezők generálása
			if (props.rows >= 13 || props.cols >= 13) {
				genSensors(sensorRow, sensorCol, 7, false);
				genSensors(sensorRow2, sensorCol2, 7, true);
				genSensors(sensorRow3, sensorCol3, 5, true);
			} else if (props.rows >= 11 || props.cols >= 11) {
				genSensors(sensorRow, sensorCol, 7, true);
				genSensors(sensorRow2, sensorCol2, 5, false);
			} else if (props.rows >= 9 || props.cols >= 9) {
				genSensors(sensorRow, sensorCol, 5, true);
				genSensors(sensorRow2, sensorCol2, 3, false);
			} else if (props.rows >= 7 || props.cols >= 7) {
				genSensors(sensorRow, sensorCol, 3, false);
				genSensors(sensorRow2, sensorCol2, 3, false);
			} else if (props.rows >= 6 || props.cols >= 6) {
				genSensors(sensorRow, sensorCol, 5, true);
			} else if (props.rows >= 5 || props.cols >= 5) {
				genSensors(sensorRow, sensorCol, 3, true);
			}
		}
		this.state = {
			table: initTable,
			currentStep: 2,
			startCube: true,
			startCubePos: {
				row: 0,
				col: 0
			},
			clock: {
				passing: false,
				s: 0,
				m: 0,
				sDisp: "00",
				mDisp: "00"
			},
			result: ""
		};
	}

	render() {
		const {
			startCube,
			startCubePos,
			currentStep,
			table,
			clock,
			result,
			bonus,
			sensorWarn,
			sensorRemain
		} = this.state;
		const { rows, cols } = this.props;

		// Kezdő pozíció megválasztása után lefutó függvény
		const toggleStart = (row, col, isSensor) => {
			console.log("startCube clicked:" + row + ":" + col);
			this.setState({ startCubePos: { ...this.state.startCubePos, row, col } });
			let newTable = this.state.table;
			for (let i = 0; i < rows; i++) {
				for (let j = 0; j < cols; j++) {
					if (i !== row || j !== col) {
						if (newTable[i][j].isSensorCenter !== true) {
							newTable[i][j].text = "";
						}
					}
					if (i === row && j === col) {
						newTable[i][j].text = "1";
						newTable[i][j].occup = true;
					}
					if (
						// Lehetséges lépések mutatása, pozícióhoz képest relatívan
						// Horizontal steps
						(i === row + 1 && j === col + 2) ||
						(i === row - 1 && j === col + 2) ||
						(i === row + 1 && j === col - 2) ||
						(i === row - 1 && j === col - 2) ||
						// Vertical steps
						(i === row + 2 && j === col + 1) ||
						(i === row - 2 && j === col + 1) ||
						(i === row + 2 && j === col - 1) ||
						(i === row - 2 && j === col - 1)
					) {
						if (newTable[i][j].occup === false) {
							newTable[i][j].avail = true;
						}
					}
				}
			}
			// Játék és óra indítása
			this.setState({
				table: newTable,
				startCube: false,
				clock: { ...this.state.clock, passing: true }
			});
			// Óra frisítése másodpercenként
			setInterval(() => {
				if (this.state.clock.passing === true) {
					if (this.state.clock.s === 59) {
						if (this.state.clock.m < 9) {
							this.setState({
								clock: {
									...this.state.clock,
									m: this.state.clock.m + 1,
									mDisp: `0${this.state.clock.m + 1}`,
									s: 0,
									sDisp: "00"
								}
							});
						} else {
							this.setState({
								clock: {
									...this.state.clock,
									m: this.state.clock.m + 1,
									mDisp: `${this.state.clock.m + 1}`,
									s: 0,
									sDisp: "00"
								}
							});
						}
					} else {
						if (this.state.clock.s < 9) {
							this.setState({
								clock: {
									...this.state.clock,
									s: this.state.clock.s + 1,
									sDisp: `0${this.state.clock.s + 1}`
								}
							});
						} else {
							this.setState({
								clock: {
									...this.state.clock,
									s: this.state.clock.s + 1,
									sDisp: `${this.state.clock.s + 1}`
								}
							});
						}
					}
				}
			}, 1000);
			// Ha a játékos szenzormezőről indul, azonnal induljon el a számláló
			if (isSensor === true) {
				this.setState({
					sensorWarn: "Vigyázz, szenzormező! Hátralévő idő: "
				});
				if (!this.state.sensorRemain) {
					this.setState({ sensorRemain: 5 });
					var warnInterval = setInterval(() => {
						if (this.state.sensorWarn !== "") {
							if (this.state.sensorRemain < 1) {
								for (let i = 0; i < rows; i++) {
									for (let j = 0; j < cols; j++) {
										newTable[i][j].avail = false;
									}
								}
								this.setState({
									sensorRemain: 0,
									result: "Vesztettél.",
									clock: { ...this.state.clock, passing: false }
								});
								clearInterval(warnInterval);
							} else {
								this.setState({ sensorRemain: this.state.sensorRemain - 1 });
							}
						} else {
							clearInterval(warnInterval);
						}
					}, 1000);
				}
			} else {
				this.setState({ sensorWarn: "", sensorRemain: null });
			}
		};

		// Lehetséges kockára kattintáskor lefutó függvény
		const clickCube = (row, col, isSensor) => {
			let newTable = this.state.table;
			let eventCount;
			eventCount = 0;
			console.log(`GameCube clicked: ${row};${col}`);
			for (let i = 0; i < rows; i++) {
				for (let j = 0; j < cols; j++) {
					newTable[i][j].avail = false;
				}
			}
			for (let i = 0; i < rows; i++) {
				for (let j = 0; j < cols; j++) {
					if (i === row && j === col) {
						newTable[i][j].occup = true;
						this.setState({ currentStep: currentStep + 1 });
						newTable[i][j].text = currentStep;
					}
					// Ha a játékos semerre sem tud lépni, ez a ha függvény érzékeli
					if (
						// Horizontal steps
						(i === row + 1 && j === col + 2) ||
						(i === row - 1 && j === col + 2) ||
						(i === row + 1 && j === col - 2) ||
						(i === row - 1 && j === col - 2) ||
						// Vertical steps
						(i === row + 2 && j === col + 1) ||
						(i === row - 2 && j === col + 1) ||
						(i === row + 2 && j === col - 1) ||
						(i === row - 2 && j === col - 1)
					) {
						if (newTable[i][j].occup === false) {
							newTable[i][j].avail = true;
							eventCount++;
						}
					}
				}
			}
			// Ha szenzormező, induljon el a visszaszámlálás
			if (isSensor === true) {
				this.setState({
					sensorWarn: "Vigyázz, szenzormező! Hátralévő idő: "
				});
				if (!this.state.sensorRemain) {
					this.setState({ sensorRemain: 5 });
					var warnInterval = setInterval(() => {
						if (this.state.sensorWarn !== "") {
							if (this.state.sensorRemain < 1) {
								for (let i = 0; i < rows; i++) {
									for (let j = 0; j < cols; j++) {
										newTable[i][j].avail = false;
									}
								}
								this.setState({
									sensorRemain: 0,
									result: "Vesztettél.",
									clock: { ...this.state.clock, passing: false }
								});
								clearInterval(warnInterval);
							} else {
								this.setState({ sensorRemain: this.state.sensorRemain - 1 });
							}
						} else {
							clearInterval(warnInterval);
						}
					}, 1000);
				}
			} else {
				this.setState({ sensorWarn: "", sensorRemain: null });
			}
			// Ha a játékos beszorult, jelenjen meg az üzenet
			if (eventCount === 0) {
				let freeCubeCount = 0;
				for (let i = 0; i < rows; i++) {
					for (let j = 0; j < cols; j++) {
						if (newTable[i][j].occup === false) {
							freeCubeCount++;
						}
					}
				}
				// Ha semerre sem lehet lépni, de szabad kocka sincs, a játékos nyert
				if (freeCubeCount === 0) {
					this.setState({ sensorWarn: "", sensorRemain: null, result: "Nyertél!" });
					// Ha a kezdő kocka a lehetséges lépések között van, a játékos körútvonalat talált
					for (let i = 0; i < rows; i++) {
						for (let j = 0; j < cols; j++) {
							if (
								// Horizontal steps
								(i === row + 1 && j === col + 2) ||
								(i === row - 1 && j === col + 2) ||
								(i === row + 1 && j === col - 2) ||
								(i === row - 1 && j === col - 2) ||
								// Vertical steps
								(i === row + 2 && j === col + 1) ||
								(i === row - 2 && j === col + 1) ||
								(i === row + 2 && j === col - 1) ||
								(i === row - 2 && j === col - 1)
							) {
								if (
									newTable[i][j].row === startCubePos.row &&
									newTable[i][j].col === startCubePos.col
								) {
									this.setState({ bonus: true });
								}
							}
						}
					}
				} else {
					this.setState({ result: "Vesztettél." });
				}
				this.setState({ clock: { ...this.state.clock, passing: false } });
			}
		};
		const startNewGame = () => {
			window.location.reload()
		}
		return ( <div>
			<div className="game">
				<div className="game-container">
					{table.map((row) => {
						return (
							<div className="row">
								{row.map((cube) => {
									return (
										// A kétdimenziós tömb minden elemére jelenítsen meg egy kocka komponenst
										<CubeComponent
											key={cube.row * rows + cube.col}
											id={cube.row * rows + cube.col}
											cube={cube}
											startCube={startCube}
											// A "this" azért lett bindelve a függvényhez, mert nélküle a react semmilyen bindet nem érzékel
											clickCube={clickCube.bind(
												this,
												cube.row,
												cube.col,
												cube.isSensorArea
											)}
											toggleStart={toggleStart.bind(
												this,
												cube.row,
												cube.col,
												cube.isSensorArea
											)}
										/>
									);
								})}
							</div>
						);
					})}
				</div>
				<p id="clock">
					{clock.mDisp}:{clock.sDisp}
				</p>
				<p id="result-text">{result}</p>
				<p id="bonus-text">{bonus ? "Bónusz: Körútvonalat találtál!" : ""}</p>
				<p id="sensor-text">
					{sensorWarn}
					{sensorRemain}
					{sensorWarn ? "mp" : ""}
				</p>
				
			</div> 
			<div> <button onClick={startNewGame} id="refresh-button">Új játék</button> </div> 
			</div>
				
		);
	}
}

// A kocka komponens
class CubeComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const { id, startCube, toggleStart, clickCube } = this.props;

		const { text, avail, isSensorArea, isSensorCenter } = this.props.cube;
		return (
			<div
				id={id}
				className={`cube ${isSensorArea ? "cube-sensor" : ""} ${
					avail ? "cube-avail" : ""
				} `}
				onClick={startCube ? toggleStart : avail ? clickCube : null}
			>
				<span
					className={`cube-content ${startCube ? "cube-x" : "cube-num"} ${text >= 100 ? "cube-hundred" : ""} ${
						isSensorCenter ? "cube-sensor-center" : ""
					}`}
				>
					{text}
				</span>
			</div>
		);
	}
}

const domContainer = document.querySelector("#app");
ReactDOM.render(e(App), domContainer);
