"use strict";

const e = React.createElement;

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
				</div>
			);
		}
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
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
		let sensorRow = Math.floor(Math.random() * props.rows);
		let sensorCol = Math.floor(Math.random() * props.cols);

		for (let i = 0; i < props.rows; i++) {
			for (let j = 0; j < props.cols; j++) {
				if (
					initTable[i][j].row === sensorRow &&
					initTable[i][j].col === sensorCol
				) {
					initTable[i][j].isSensorCenter = true;
					initTable[i][j].isSensorArea = true;
				}
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
			bonus
		} = this.state;
		const { hardMode, rows, cols } = this.props;

		const toggleStart = (row, col) => {
			console.log("startCube clicked:" + row + ":" + col);
			this.setState({ startCubePos: { ...this.state.startCubePos, row, col } });
			let newTable = this.state.table;
			for (let i = 0; i < rows; i++) {
				for (let j = 0; j < cols; j++) {
					if (i !== row || j !== col) {
						newTable[i][j].text = "";
					}
					if (i === row && j === col) {
						newTable[i][j].text = "1";
						newTable[i][j].occup = true;
					}
					if (
						// horzontal steps
						(i === row + 1 && j === col + 2) ||
						(i === row - 1 && j === col + 2) ||
						(i === row + 1 && j === col - 2) ||
						(i === row - 1 && j === col - 2) ||
						// vertical steps
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
			this.setState({
				table: newTable,
				startCube: false,
				clock: { ...this.state.clock, passing: true }
			});
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
		};
		const clickCube = (row, col) => {
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
					if (
						// horzontal steps
						(i === row + 1 && j === col + 2) ||
						(i === row - 1 && j === col + 2) ||
						(i === row + 1 && j === col - 2) ||
						(i === row - 1 && j === col - 2) ||
						// vertical steps
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
			if (eventCount === 0) {
				let freeCubeCount = 0;
				for (let i = 0; i < rows; i++) {
					for (let j = 0; j < cols; j++) {
						if (newTable[i][j].occup === false) {
							freeCubeCount++;
						}
					}
				}
				if (freeCubeCount === 0) {
					this.setState({ result: "Nyertél!" });
					for (let i = 0; i < rows; i++) {
						for (let j = 0; j < cols; j++) {
							if (
								// horzontal steps
								(i === row + 1 && j === col + 2) ||
								(i === row - 1 && j === col + 2) ||
								(i === row + 1 && j === col - 2) ||
								(i === row - 1 && j === col - 2) ||
								// vertical steps
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
					console.log("fucked.");
				}
				this.setState({ clock: { ...this.state.clock, passing: false } });
			}
		};
		return (
			<div className="game">
				<div className="game-container">
					{table.map((row) => {
						return (
							<div className="row">
								{row.map((cube) => {
									return (
										<CubeComponent
											key={cube.row * rows + cube.col}
											id={cube.row * rows + cube.col}
											text={cube.text}
											avail={cube.avail}
											startCube={startCube}
											clickCube={clickCube.bind(this, cube.row, cube.col)}
											toggleStart={toggleStart.bind(this, cube.row, cube.col)}
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
			</div>
		);
	}
}

class CubeComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const { id, text, avail, startCube, toggleStart, clickCube } = this.props;
		return (
			<div
				id={id}
				className={`cube ${avail ? "cube-avail" : ""}`}
				onClick={startCube ? toggleStart : avail ? clickCube : null}
			>
				<span className={`${startCube ? "cube-x" : "cube-num"}`}>{text}</span>
			</div>
		);
	}
}

const domContainer = document.querySelector("#app");
ReactDOM.render(e(App), domContainer);
