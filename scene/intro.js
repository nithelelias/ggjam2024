function addButton(
  scene,
  x,
  y,
  label,
  [img_idle, img_press],
  onClick = () => null
) {
  let btn = scene.add.image(0, 0, img_idle);
  btn.setInteractive();
  btn.on("pointerdown", () => {
    btn.setTexture(img_press);
    btn.once("pointerup", onClick);
    scene.input.once("pointerup", () => {
      btn.setTexture(img_idle);
    });
  });
  let container = scene.add.container(x, y, [
    btn,
    scene.add
      .text(0, 82, label, {
        fontFamily: "gamefont",
        fontSize: 24,
        color: "#000000",
      })
      .setOrigin(0.5),
  ]);
  return container;
}

export default class Intro extends Phaser.Scene {
  constructor() {
    super("intro");
  }
  create() {
    this.add
      .image(0, 0, "home")
      .setOrigin(0)
      .setDisplaySize(this.scale.width, this.scale.height);

    const logo = this.add
      .image(this.scale.width * 0.5, this.scale.height * 0.4, "logo")
      .setOrigin(0.5)
      .setScale(0.2);

    this.tweens.chain({
      targets: logo,
      tweens: [
        {
          scale: 1,
          ease: "back.InOut",
          angle: -35,
          easeParams: [3, 2],
          duration: 600,
        },
        {
          scale: 1.2,
          angle: -15,
          y: "-=30",
          ease: "sine.inout",
          duration: 300,
        },
        {
          scale: 1,
          angle: -5,
          y: "+=50",
          ease: "sine.inout",
          duration: 300,
        },

        {
          scale: 1,
          angle: -1,
          y: "-=25",
          ease: "sine.inout",
          duration: 300,
        },
        {
          scale: 1,
          angle: 0,
          y: "+=25",
          ease: "sine.inout",
          duration: 300,
        },
        {
          scale: 1,
          angle: 0,
          y: this.scale.height * 0.4,
          ease: "sine.inout",
          duration: 300,
        },
      ],
      onComplete: () => {
        this.showMenu();
      },
    });
  }
  showMenu() {
    let gap = 280;
    let container = this.add.container(
      this.scale.width / 2,
      this.scale.height * 0.7,
      [
        addButton(
          this,
          -gap,
          0,
          "INSTRUCCIONES",
          ["btn_info", "btn_info_press"],

          () => this.showInfo()
        ),
        addButton(this, 0, 0, "JUGAR", ["btn_play", "btn_play_press"], () =>
          this.goToGame()
        ),
        addButton(
          this,
          gap,
          0,
          "EQUIPO",
          ["btn_credits", "btn_credits_press"],
          () => this.showCredits()
        ),
      ]
    );
  }
  showInfo() {}
  showCredits() {}

  goToGame() {
    this.scene.stop();
    this.scene.start("main");
  }
}
