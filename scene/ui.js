import addButton from "../src/addButton.js";
import checkLandScape from "../src/checkLandScape.js";

export default class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: "ui" });
  }

  create() {
    /*   this.caption = this.add.text(100, 100, ["caption"], {
      color: COLORS.text,
      fontSize: 24,
    }); */
    this.input.setDefaultCursor(`url("assets/cur_hand.png"), grab`);
    window.ui = this;
    checkLandScape(this.game, () => {
      setTimeout(() => {
        window.scrollTo(0, -100);
      }, 100);
    });
  }
  startMain() {
    this.createProgressLevel();
    this.volumeControl();
    this.createLevelBoard();
    this.createTimeBoard();
    this.scene.bringToTop();
  }
  createLevelBoard() {
    let bg = this.add.image(0, 20, "uiboard").setOrigin(0).setScale(0.8);
    this.levelText = this.add
      .text(80, 64, "NIVEL: 1", {
        fontFamily: "gamefont",
        color: "white",
        fontSize: 32,
      })
      .setOrigin(0.5);
    this.levelText.update = (level) => {
      this.levelText.setText(`NIVEL ${level}`);
      if (level === 2) {
        bg.setTexture("uiboard-2");
      } else if (level === 3) {
        bg.setTexture("uiboard-3");
      }
    };
  }
  createTimeBoard() {
    let template = `⏱️ M:S`;
    let startTime = Date.now();
    let bg = this.add.image(0, 120, "uiboard").setOrigin(0).setScale(0.8);
    let active = true;
    this.timeText = this.add
      .text(80, 170, template, {
        fontFamily: "gamefont",
        color: "white",
        fontSize: 32,
      })
      .setOrigin(0.5);
    this.timeText.stop = () => {
      active = false;
    };
    this.timeText.update = (level) => {
      if (!active) {
        return;
      }
      let diff = Date.now() - startTime;
      let seconds = parseInt(diff / 1000);
      let minutes = parseInt(seconds / 60);
      this.timeText.setText(
        template
          .replace("M", minutes.toString().padStart(2, "0"))
          .replace("S", (seconds % 60).toString().padStart(2, "0"))
      );
      if (level === 2) {
        bg.setTexture("uiboard-2");
      } else if (level === 3) {
        bg.setTexture("uiboard-3");
      }
    };
    this.timeText.update();
    bg.setDepth(1000);
    this.timeText.setDepth(1001);
  }
  volumeControl() {
    const btn = addButton(
      this,
      this.scale.width - 48,
      48,
      "on",
      ["btn_volume", "btn_volume"],
      () => {
        if (!this.sound.mute) {
          btn.bg.setTint(0xd1d1d1);
        } else {
          btn.bg.clearTint();
        }
        btn.text.setText(!this.sound.mute ? "off" : "on");
        this.sound.mute = !this.sound.mute;
      }
    );
    btn.text.y = btn.bg.displayHeight;
  }
  createProgressLevel() {
    this.add
      .rectangle(0, this.scale.height, this.scale.width, 32, 0xf1cc30, 0.4)
      .setOrigin(0, 1);
    this.progress = this.add
      .rectangle(0, this.scale.height, 32, 32, 0xf1cc30)
      .setOrigin(0, 1);
  }
  updateProgressLevel(percentage) {
    if (!this.progress) {
      return;
    }
    let w = this.scale.width * (Math.max(1, percentage) / 100);
    this.progress.setDisplaySize(w, 32);
  }
  finalScreen(win = true) {
    this.timeText.stop();
    const graphics = this.add.graphics();

    graphics.fillStyle(win ? 0xfecd01 : 0x1570d7, 0.7);

    //  Using an object to define a different radius per corner
    graphics.fillRoundedRect(0, 0, this.scale.width, this.scale.height);
    let bg = this.add.image(0, 0, "final-modal").setOrigin(0.5);

    let logo = this.add.image(0, 0, "logo").setScale(0.6).setOrigin(0.5, 1);

    const title = this.add
      .text(
        0,
        logo.y + logo.displayHeight / 4 + 8,
        win ? "Felicidades" : "¿estas Triste?",
        {
          fontFamily: "gamefont",
          fontSize: 64,
          color: "#FF6669",
        }
      )
      .setOrigin(0.5, 0);

    const prah = this.add
      .text(
        0,
        title.y + title.height + 8,
        win
          ? "¡Contagiaste a todos de  risa!"
          : "¡Seguro que para la proxima lo logras!",
        {
          fontFamily: "gamefont2",
          fontSize: 32,
          color: "black",
        }
      )
      .setOrigin(0.5, 0);
    const btn = addButton(
      this,
      bg.displayWidth / 2 - 48,
      -bg.displayHeight / 2 + 48,
      "",
      ["btn_close", "btn_close"],
      () => {
        window.location.reload();
      }
    );
    let container = this.add.container(
      this.scale.width / 2,
      this.scale.height / 2,
      [bg, logo, title, prah, btn]
    );
    this.tweens.add({
      targets: container,
      alpha: 1,
      scale: 1,
      duration: 600,
      ease: "bounceOut",
    });
  }
  update() {
    const main = this.scene.get("main");

    if (!main.scene.isActive()) {
      return;
    }
    this.updateProgressLevel(main.laughPercentage);
    this.levelText.update(main.level);
    this.timeText.update(main.level);
  }
}
