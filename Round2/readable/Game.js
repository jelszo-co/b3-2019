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
			gameStarted: false
		};
	}

	render() {
		const { gameStarted, formRows, formCols, minValue, maxValue } = this.state;
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
		if (gameStarted) {
			return <Game rows={formRows} cols={formCols} />;
		} else {
			return (
				<div className="input">
					<h2>Tábla generálása</h2>
					<p>
						Minimum <b>{minValue + "x" + minValue}</b>, maximum{" "}
						<b>{maxValue + "x" + maxValue}</b> négyzet
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
		this.state = {
			table: [],
			startCube: true
		};
	}
	UNSAFE_componentWillMount() {
		let initTable = [];
		for (let i = 0; i < this.props.rows; i++) {
			initTable[i] = [];
			for (let j = 0; j < this.props.cols; j++) {
				initTable[i][j] = {
					row: i,
					col: j,
					text: "x"
				};
			}
		}
		this.setState({ table: initTable });
	}
	render() {
		const { startCube, table } = this.state;
		const { rows, cols } = this.props;

		const toggleStart = (row, col) => {
			console.log("startCube clicked:" + row + ":" + col);
			let newTable = this.state.table;
			for (let i = 0; i < rows; i++) {
				for (let j = 0; j < cols; j++) {
					if (i !== row || j !== col) {
						newTable[i][j].text = "";
					}
					if (i === row && j === col) {
						newTable[i][j].text = "1";
					}
				}
			}

			this.setState({ table: newTable });
			console.log(newTable);
			console.log(this.state.table);
		};
		const clickCube = (row, col) => {
			console.log(`GameCube clicked: ${row};${col}`);
		};
		return (
			<div className="game-container">
				{table.map((row) => {
					return (
						<div className="row">
							{row.map((cube) => {
								return (
									<CubeComponent
										key={cube.row * rows + cube.col}
										text={cube.text}
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
		);
	}
}

class CubeComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<div
				className={`cube`}
				onClick={this.props.startCube ? null : this.props.clickCube}
			>
				<span
					className={`${this.props.startCube ? "cube-x" : "cube-num"}`}
					onClick={this.props.startCube ? this.props.toggleStart : null}
				>
					{this.props.text}
				</span>
			</div>
		);
	}
}

const domContainer = document.querySelector("#app");
ReactDOM.render(e(App), domContainer);
