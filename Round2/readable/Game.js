"use strict";

const e = React.createElement;

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
					className={`${this.props.startCube ? "cube-x" : ""}`}
					onClick={this.props.startCube ? this.props.toggleStart : null}
				>
					{this.props.text}
				</span>
			</div>
		);
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			gameStarted: false,
			formRows: "",
			formCols: "",
			minValue: 5,
			maxValue: 15,
			startCube: true
		};
	}

	render() {
		const { gameStarted, formRows, formCols, minValue, maxValue } = this.state;
		const { startCube } = this.state;
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
			console.log("submitted");
		};

		const onChange = (e) => {
			this.setState({ [e.target.name]: e.target.value });
		};
		const clickCube = (table, row, col) => {
			for (let i = 0; i < formRows; i++) {
				for (let j = 0; j < formCols; j++) {
					if (i !== row && j !== col) {
						table[i][j].text = "";
					}
				}
			}
			console.log(`${row};${col}`);
		};
		if (gameStarted) {
			let table = [];
			for (let i = 0; i < formRows; i++) {
				table[i] = [];
				for (let j = 0; j < formCols; j++) {
					table[i][j] = {
						row: i,
						col: j,
						text: "x"
					};
				}
			}
			console.log(table);
			return (
				<div className="game-container">
					{table.map((row) => {
						return (
							<div className="row">
								{row.map((cube) => {
									return (
										<CubeComponent
											key={cube.row * formCols + cube.col}
											text={cube.text}
											startCube={startCube}
											clickCube={clickCube.bind(
												this,
												table,
												cube.row,
												cube.col
											)}
											toggleStart={() => this.setState({ startCube: false })}
										/>
									);
								})}
							</div>
						);
					})}
				</div>
			);
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

const domContainer = document.querySelector("#game");
ReactDOM.render(e(Game), domContainer);
