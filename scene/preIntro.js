export default class PreIntro extends Phaser.Scene {
  constructor() {
    super("preintro");
  }
  create() {
    this.add
      .text(0, this.scale.height, "cargando", {
        fontFamily: "gamefont",
      })
      .setOrigin(0, 1);
    this.add
      .text(100, 0, "el juego", {
        fontFamily: "gamefont2",
      })
      .setOrigin(0, 1);

    setTimeout(() => {
      this.scene.stop();
      this.scene.start("intro");
    }, 500);
  }
}
