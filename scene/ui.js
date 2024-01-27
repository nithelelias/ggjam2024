import { COLORS } from "../constants.js";
import textControlButton from "../src/textControlButton.js";

export default class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: "ui" });
  }

  create() {
    /*   this.caption = this.add.text(100, 100, ["caption"], {
      color: COLORS.text,
      fontSize: 24,
    }); */
    this.createProgressLevel();
    this.volumeControl();
    this.createLevelBoard();
    this.createTimeBoard();
    this.scene.bringToTop();
    window.ui = this;
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
    this.timeText = this.add
      .text(80, 170, template, {
        fontFamily: "gamefont",
        color: "white",
        fontSize: 32,
      })
      .setOrigin(0.5);
    this.timeText.update = (level) => {
      let diff = Date.now() - startTime;
      let seconds = parseInt(diff / 1000);
      let minutes = parseInt(seconds / 60);
      this.timeText.setText(
        template
          .replace("M", minutes.toString().padStart(2, "0"))
          .replace("S", seconds.toString().padStart(2, "0"))
      );
      if (level === 2) {
        bg.setTexture("uiboard-2");
      } else if (level === 3) {
        bg.setTexture("uiboard-3");
      }
    };
    this.timeText.update();
  }
  volumeControl() {
    let getVolumeIcon = (v) => (v ? `🔇` : `🔈`);
    let control = textControlButton(
      this,
      this.scale.width - 32,
      20,
      getVolumeIcon(this.sound.mute),
      () => {
        this.sound.mute = !this.sound.mute;

        control.text.setText(getVolumeIcon(!this.sound.mute));
        return;
      }
    );
  }
  createProgressLevel() {
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
  finalScreen() {
    let title = this.add
      .text(this.scale.width / 2, this.scale.height / 2, ["SMILE"], {
        fontFamily: "gamefont",
        fontSize: 512,
        color: "black",
      })
      .setOrigin(0.5)
      .setDepth(100)
      .setAlpha(0)
      .setScale(0.1)
      .setScrollFactor(0);
    this.tweens.add({
      targets: title,
      alpha: 1,
      scale: 1,
      duration: 600,
      ease: "bounceOut",
    });
  }
  update() {
    const main = this.scene.get("main");
    this.updateProgressLevel(main.laughPercentage);
    this.levelText.update(main.level);
    this.timeText.update(main.level);
  }
}
