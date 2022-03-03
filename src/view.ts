import { BoardViewModel } from "./model";
import { StartGameCallback } from "./controller";

export class View {
  boardElement: HTMLElement | null;
  gameOptionsForm: HTMLElement | null;
  banner: HTMLElement | null;

  constructor() {
    this.boardElement = document.getElementById("board");
    this.gameOptionsForm = <HTMLFormElement>(
      document.getElementById("game-options")
    );
    this.banner = document.getElementById("banner");
  }

  initListeners(callback: StartGameCallback): void {
    this.gameOptionsForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!this.gameOptionsForm) return;

      const data = new FormData(<HTMLFormElement>this.gameOptionsForm);
      const speed = data.get("speed") || 500;
      callback({ speed });
    });
  }

  drawBoard(data: BoardViewModel) {
    const { board } = data;
    if (!this.boardElement) return;

    if (board) {
      this.banner?.classList.remove("banner--visible");
      this.boardElement.classList.remove("board--hide");
      this.boardElement.innerHTML = "";

      board.forEach((r) => {
        const row = document.createElement("div");
        row.classList.add("row");

        r.forEach((c) => {
          const cell = document.createElement("div");
          cell.classList.add("cell");

          if (c.selected) {
            cell.classList.add("snake");
          }

          if (c.food) {
            cell.classList.add("food");
          }

          cell.classList.add("cell");
          row.appendChild(cell);
        });

        this.boardElement?.appendChild(row);
      });
    } else {
      this.boardElement.classList.add("board--hide");
      this.banner?.classList.add("banner--visible");
    }
  }
}
