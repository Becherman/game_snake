import { toNumber } from "lodash";
import { Model } from "./model";
import { View } from "./view";
import { arrowKeys, disallowedDirections, Direction } from "./constants";

type GameOptions = {
  speed: number | string | FormDataEntryValue;
};

export type StartGameCallback = (options: GameOptions) => void;

export class Controller {
  private model: Model;
  private view: View;
  private timerId: NodeJS.Timeout | undefined;
  private direction: Direction;

  constructor(model: any, view: any) {
    this.model = model;
    this.view = view;
    this.timerId = undefined;
    this.direction = Direction.UP;
  }

  private arrowKeysListener(event: KeyboardEvent) {
    console.log(this);
    const direction = arrowKeys[event.keyCode];

    if (disallowedDirections[this.direction] === direction) {
      return;
    }

    this.direction = direction;
  }

  private initArrowListeners() {
    document.addEventListener("keydown", this.arrowKeysListener.bind(this));
  }

  private initTimer(speed: number) {
    this.timerId = setInterval(
      (self: Controller) => {
        try {
          self.model.move(self.direction);
        } catch (error) {
          this.stopGame();
        }
      },
      speed,
      this
    );
  }

  private startGame(options: GameOptions): void {
    const speed = toNumber(options.speed);

    this.view.drawBoard({ board: this.model.getBoard() });
    this.initArrowListeners();
    this.initTimer(speed);
  }

  private stopGame() {
    this.direction = Direction.UP;
    if (this.timerId) {
      clearInterval(this.timerId);
    }
    document.removeEventListener("keydown", this.arrowKeysListener);
  }

  init() {
    this.view.drawBoard({ board: null });
    this.view.initListeners(this.startGame.bind(this));
  }
}
