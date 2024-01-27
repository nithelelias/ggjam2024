import { COLORS } from "../constants.js";

export default class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: "ui" });
  }

  create() {
    this.caption = this.add.text(100, 100, ["caption"], {
      color: COLORS.text,
      fontSize: 24,
    });
  }
  update() {
    const main = this.scene.get("main");
    this.caption.setText(`
    LAUGH LEVEL: ${main.laughPercentage}
    POINTER: ${main.input.mousePointer.x} ${main.input.mousePointer.y}
        `);
  }
}
