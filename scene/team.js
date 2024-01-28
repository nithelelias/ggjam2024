import addButton from "../src/addButton.js";

export default class Team extends Phaser.Scene {
  constructor() {
    super("team");
  }
  create() {
    const btn = addButton(
      this,
      48,
      48,
      "",
      ["btn_return", "btn_return"],
      () => {
        this.scene.stop();
        this.scene.start("intro");
      }
    );
    this.add
      .image(this.scale.width / 2, this.scale.height - 60, "curved-line")
      .setOrigin(0.5, 1);

    let bottom = this.scale.height * 0.4;
    let centerX = this.scale.width / 2;
    let gap = 350;
    this.addTeamMenberContainer(
      centerX - gap,
      bottom,
      1,
      "pic_developer",
      "Nithel Elias",
      "Desarrollador"
    );
    this.addTeamMenberContainer(
      centerX,
      bottom,
      2,
      "pic_leader",
      "Andrea Vargas",
      "Lider equipo"
    );
    this.addTeamMenberContainer(
      centerX + gap,
      bottom,
      3,
      "pic_designer",
      "Laura Gallego",
      "Diseñadora"
    );
  }
  addTeamMenberContainer(x, y, colorId, pic, name, role) {
    let container = this.add.container(x, y, [
      this.add.circle(0, 0, 90, 0xd9d9d9).setOrigin(0.5),

      this.add
        .text(0, 160, name, {
          fontFamily: "gamefont",
          fontSize: 30,
          color: { 1: "#9747FF", 2: "#F229B8", 3: "#1889DF" }[colorId],
        })
        .setOrigin(0.5),
      this.add
        .text(0, 210, role, {
          fontFamily: "gamefont2",
          fontSize: 30,
          color: "black",
        })
        .setOrigin(0.5),
    ]);

    {
      let picImg = this.add.image(0, 0, pic).setOrigin(0.5);
      let rate = 200 / picImg.width;
      picImg.setScale(rate, rate);
      container.add(picImg);
    }
    container.setAlpha(0);
    container.setScale(0);
    this.tweens.add({
      targets: container,
      duration: 300,
      scale: 1,
      alpha: 1,
      ease: "bounce.out",
      easeParams: [3, 2],
      delay: 100 * colorId,
      onComplete: () => {
        this.sound.add("pop").play();
      },
    });
  }
}
