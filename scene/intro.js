import addButton from "../src/addButton.js";
var intro_started = false;
export default class Intro extends Phaser.Scene {
  constructor() {
    super("intro");
  }
  create() {
    this.scene.launch("ui");
    this.fondo = this.add
      .image(0, 0, "home")
      .setOrigin(0)
      .setDisplaySize(this.scale.width, this.scale.height);

    this.createLogoAnim();
    this.showMenu();
    if (!intro_started) {
      intro_started = true;
      let intro = this.sound.add("intro-logo")
      intro.setVolume(0.25);
      setTimeout(() => {
        intro.play();
      }, 600);
    }
  }
  createLogoAnim() {
    const div = document.createElement("div");
    div.classList.add("logo-intro");
    let w = 408,
      h = 356;
    const styles = {
      position: "fixed",
      top: "20px",
      left: `calc(50% - ${w / 2}px)`,
      zIndex: 99999,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    };
    for (let key in styles) {
      div.style[key] = styles[key];
    }
    div.innerHTML = `<img src='assets/mouth-anim.png' width="${w}px"/>`;
    document.body.append(div);

    this.fondo.on("destroy", () => {
      div.remove();
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

    container.list.forEach((element, i) => {
      element.setScale(0);
      element.setAlpha(0);
      this.tweens.add({
        targets: element,
        duration: 300,
        scale: 1,
        alpha: 1,
        ease: "bounce.out",
        easeParams: [3, 2],
        delay: 100 * i,
        onComplete: () => {
          this.sound.add("pop").play();
        },
      });
    });
  }
  showInfo() {
    this.scene.stop();
    this.scene.start("instructions");
  }
  showCredits() {
    this.scene.stop();
    this.scene.start("team");
  }

  goToGame() {
    this.scene.stop();
    this.scene.start("main");
  }
}
