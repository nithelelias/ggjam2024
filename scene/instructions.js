import addButton from "../src/addButton.js";

export default class Instructions extends Phaser.Scene {
  constructor() {
    super("instructions");
  }
  create() {
    const btn = addButton(this, 48, 48, "", ["btn_return", "btn_return"], () => {
      this.scene.stop();
      this.scene.start("intro");
    });

    this.add
      .image(this.scale.width / 2, this.scale.height - 60, "curved-line")
      .setOrigin(0.5, 1);

      this.add.text(this.scale.width/2,this.scale.height*.5, ["Propaga la risa"], {
        fontFamily: "gamefont2",
        fontSize: 32,
        color: "black",
      }).setOrigin(.5)
  }
}
