import addButton from "../src/addButton.js";
import mobileCheck from "../src/isMobile.js";
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
    this.sound.add("intro-logo").setVolume(0.25);
    this.createLogoAnim();
    this.playIntroSound();
  }
  playIntroSound() {
    if (intro_started) {
      this.showMenu();
      return;
    }

    intro_started = true;
    let introSound = this.sound.get("intro-logo");
    let timeoutid = 0;
    const play = () => {
      this.showMenu();
      timeoutid = setTimeout(() => {
        introSound.play();
      }, 400);
    };

    let startText = this.add
      .text(
        this.scale.width / 2,
        this.scale.height * 0.7,
        [(mobileCheck() ? "tap" : "clic") + " para comenzar"],
        {
          fontFamily: "gamefont",
          fontSize: 48,
          color: "black",
        }
      )
      .setOrigin(0.5);

    let timeoutid2 = setTimeout(() => {
      this.input.setDefaultCursor(`url("assets/cur_point.png"), pointer`);
    }, 100);

    this.input.once("pointerdown", () => {
      this.input.setDefaultCursor(`url("assets/cur_hand.png"), grab`);
      startText.destroy();
      play();
    });
    this.fondo.on("destroy", () => {
      clearTimeout(timeoutid);
      clearTimeout(timeoutid2);
      this.volumeOffIntro();
    });
  }
  volumeOffIntro() {
    return new Promise((resolve) => {
      let introsound = this.sound.get("intro-logo");
      if (!introsound.isPlaying) {
        resolve();
        return;
      }
      this.tweens.add({
        targets: introsound,
        volume: 0,
        duration: 300,
        onComplete: () => {
          introsound.stop();
          resolve();
        },
      });
    });
  }
  createLogoAnim() {
    const div = document.createElement("div");
    div.classList.add("logo-intro");
    let isMobile = mobileCheck();
    let h = Math.min(356, this.scale.height * (isMobile ? 0.3 : 0.5)),
      w = h / 0.87; 
    const styles = {
      position: "fixed",
      top: isMobile ? "0px" : "20px",
      left: `calc(50% - ${w / 2}px)`,
      zIndex: 99999,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    };
    for (let key in styles) {
      div.style[key] = styles[key];
    }
    div.innerHTML = `<img src='assets/mouth-anim.png' height="${h}px"/>`;
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
    this.volumeOffIntro().then(() => {
      this.scene.stop();
      this.scene.start("instructions");
    });
  }
  showCredits() {
    this.volumeOffIntro().then(() => {
      this.scene.stop();
      this.scene.start("team");
    });
  }

  goToGame() {
    this.volumeOffIntro().then(() => {
      this.scene.stop();
      this.scene.start("main");
    });
  }
}
