import * as _ from "lodash";
import {
  Direction,
  SNAKE_START_POSITION,
  VERTICAL_CELLS_NUMBER,
  HORIZONTAL_CELLS_NUMBER
} from "./constants";

type Cell = {
  coords: number[];
  selected: boolean;
  food: boolean;
};
export type Board = Array<Cell[]>;
export type Snake = number[][];
export type BoardViewModel = {
  board: Board | null;
};

interface Observer {
  drawBoard: (data: BoardViewModel) => void;
}

type Rule = () => boolean;

const validate = (rules: Rule[]) => {
  return rules.some((rule) => rule());
};

const rule = (val: boolean) => _.constant(val);

export class Model {
  private snake: Snake;
  private food: number[];
  private observers: Observer[];

  constructor() {
    this.snake = SNAKE_START_POSITION;
    this.food = this.generateFood();
    this.observers = [];
  }

  private generateBoard(): Board {
    return _.range(VERTICAL_CELLS_NUMBER).map((i, y) =>
      _.range(HORIZONTAL_CELLS_NUMBER).map((j, x) => {
        return {
          coords: [x, y],
          selected: false,
          food: false
        };
      })
    );
  }

  private generateFood(): number[] {
    let food = [_.random(0, 9), _.random(0, 9)];
    const foodWithinSnake = _.chain(this.getSnake())
      .filter((c) => _.isEqual(c, food))
      .size()
      .gt(0)
      .value();

    if (foodWithinSnake) {
      return this.generateFood();
    }

    return food;
  }

  private mergeBoard(snake: Snake) {
    const boardDraft = this.generateBoard();

    snake.forEach(([y, x]) => {
      boardDraft[y][x].selected = true;
    });

    boardDraft[this.food[0]][this.food[1]].food = true;

    return boardDraft;
  }

  private isSnakeBitItsTale(snake: Snake) {
    return _.chain(snake)
      .tail()
      .some((s) => _.isEqual(s, _.head(snake)))
      .value();
  }

  private isSnakeTouchedBorder(snake: Snake) {
    return _.chain(snake)
      .head()
      .some((s) => s < 0 || s === VERTICAL_CELLS_NUMBER)
      .value();
  }

  private isGameOver(snake: Snake) {
    return validate([
      rule(this.isSnakeBitItsTale(snake)),
      rule(this.isSnakeTouchedBorder(snake))
    ]);
  }

  getBoard() {
    const snake = this.getSnake();

    return this.mergeBoard(snake);
  }

  getSnake() {
    return this.snake;
  }

  private setSnake(snake: Snake) {
    this.snake = snake;
  }

  move(direction: Direction) {
    const snake = this.getSnake();
    let snakeHead = [...snake[0]];
    let updatedSnake;

    switch (direction) {
      case Direction.LEFT:
        snakeHead = [snakeHead[0], snakeHead[1] - 1];
        break;
      case Direction.UP:
        snakeHead = [snakeHead[0] - 1, snakeHead[1]];
        break;
      case Direction.RIGHT:
        snakeHead = [snakeHead[0], snakeHead[1] + 1];
        break;
      case Direction.DOWN:
        snakeHead = [snakeHead[0] + 1, snakeHead[1]];
        break;

      default:
        break;
    }

    if (_.isEqual(snakeHead, this.food)) {
      updatedSnake = [this.food, ...snake];
      this.food = this.generateFood();
    } else {
      updatedSnake = snake.map((_, idx) => {
        if (idx === 0) {
          return snakeHead;
        }

        return [...snake[idx - 1]];
      });
    }

    if (this.isGameOver(updatedSnake)) {
      console.log("game over");
      this.notify({
        board: null
      });

      this.setSnake(SNAKE_START_POSITION);
      throw new Error("Game over");
    }

    const board = this.mergeBoard(updatedSnake);

    this.setSnake(updatedSnake);
    this.notify({ board });
  }

  subsribe(observer: Observer) {
    this.observers.push(observer);
  }

  private notify(data: BoardViewModel) {
    this.observers.forEach((o) => {
      o.drawBoard(data);
    });
  }
}
