export enum Direction {
  LEFT = "left",
  UP = "up",
  RIGHT = "right",
  DOWN = "down"
}

export const arrowKeys: Record<number | string, Direction> = {
  37: Direction.LEFT,
  38: Direction.UP,
  39: Direction.RIGHT,
  40: Direction.DOWN
};

export const disallowedDirections = {
  [Direction.LEFT]: Direction.RIGHT,
  [Direction.RIGHT]: Direction.LEFT,
  [Direction.UP]: Direction.DOWN,
  [Direction.DOWN]: Direction.UP
};

export const HORIZONTAL_CELLS_NUMBER = 10;
export const VERTICAL_CELLS_NUMBER = 10;

export const SNAKE_START_POSITION = [
  [4, 4],
  [5, 4],
  [6, 4]
];
