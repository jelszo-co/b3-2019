"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var e = React.createElement;

var CubeComponent = function (_React$Component) {
	_inherits(CubeComponent, _React$Component);

	function CubeComponent(props) {
		_classCallCheck(this, CubeComponent);

		var _this = _possibleConstructorReturn(this, (CubeComponent.__proto__ || Object.getPrototypeOf(CubeComponent)).call(this, props));

		_this.state = {};
		return _this;
	}

	_createClass(CubeComponent, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"div",
				{
					className: "cube",
					onClick: this.props.startCube ? null : this.props.clickCube
				},
				React.createElement(
					"span",
					{
						className: "" + (this.props.startCube ? "cube-x" : ""),
						onClick: this.props.startCube ? this.props.toggleStart : null
					},
					this.props.text
				)
			);
		}
	}]);

	return CubeComponent;
}(React.Component);

var Game = function (_React$Component2) {
	_inherits(Game, _React$Component2);

	function Game(props) {
		_classCallCheck(this, Game);

		var _this2 = _possibleConstructorReturn(this, (Game.__proto__ || Object.getPrototypeOf(Game)).call(this, props));

		_this2.state = {
			gameStarted: false,
			formRows: "",
			formCols: "",
			minValue: 5,
			maxValue: 15,
			startCube: true
		};
		return _this2;
	}

	_createClass(Game, [{
		key: "render",
		value: function render() {
			var _this3 = this;

			var _state = this.state,
			    gameStarted = _state.gameStarted,
			    formRows = _state.formRows,
			    formCols = _state.formCols,
			    minValue = _state.minValue,
			    maxValue = _state.maxValue;
			var startCube = this.state.startCube;

			var onSubmit = function onSubmit(e) {
				e.preventDefault();
				if (formRows < minValue || formRows > maxValue || formCols < minValue || formCols > maxValue) {
					alert("Hopsz! Az \xE9rt\xE9keknek " + minValue + " \xE9s " + maxValue + " k\xF6z\xF6tt kell lenni\xFCk.");
				} else {
					_this3.setState({ gameStarted: true });
				}
				console.log("submitted");
			};

			var onChange = function onChange(e) {
				_this3.setState(_defineProperty({}, e.target.name, e.target.value));
			};
			var clickCube = function clickCube(table, row, col) {
				for (var i = 0; i < formRows; i++) {
					for (var j = 0; j < formCols; j++) {
						if (i !== row && j !== col) {
							table[i][j].text = "";
						}
					}
				}
				console.log(row + ";" + col);
			};
			if (gameStarted) {
				var table = [];
				for (var i = 0; i < formRows; i++) {
					table[i] = [];
					for (var j = 0; j < formCols; j++) {
						table[i][j] = {
							row: i,
							col: j,
							text: "x"
						};
					}
				}
				console.log(table);
				return React.createElement(
					"div",
					{ className: "game-container" },
					table.map(function (row) {
						return React.createElement(
							"div",
							{ className: "row" },
							row.map(function (cube) {
								return React.createElement(CubeComponent, {
									key: cube.row * formCols + cube.col,
									text: cube.text,
									startCube: startCube,
									clickCube: clickCube.bind(_this3, table, cube.row, cube.col),
									toggleStart: function toggleStart() {
										return _this3.setState({ startCube: false });
									}
								});
							})
						);
					})
				);
			} else {
				return React.createElement(
					"div",
					{ className: "input" },
					React.createElement(
						"h2",
						null,
						"T\xE1bla gener\xE1l\xE1sa"
					),
					React.createElement(
						"p",
						null,
						"Minimum ",
						React.createElement(
							"b",
							null,
							minValue + "x" + minValue
						),
						", maximum",
						" ",
						React.createElement(
							"b",
							null,
							maxValue + "x" + maxValue
						),
						" n\xE9gyzet"
					),
					React.createElement(
						"form",
						{ onSubmit: onSubmit },
						React.createElement("input", {
							type: "number",
							name: "formRows",
							placeholder: "Sorok",
							value: formRows,
							onChange: onChange,
							autoFocus: true,
							required: true
						}),
						React.createElement("input", {
							type: "number",
							name: "formCols",
							placeholder: "Oszlopok",
							value: formCols,
							onChange: onChange,
							required: true
						}),
						React.createElement("input", { type: "submit", value: "Gener\xE1l\xE1s!" })
					)
				);
			}
		}
	}]);

	return Game;
}(React.Component);

var domContainer = document.querySelector("#game");
ReactDOM.render(e(Game), domContainer);