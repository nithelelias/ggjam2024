import { TOTAL_SOUND_LAUGHS } from "../constants.js";
import preloadProgress from "../src/preloadProgress.js";

export default class Preloader extends Phaser.Scene {
  preload() {
    preloadProgress(this);
    //////// FUENTES --->
    this.load.script("webfont", "/webfont.js");
    let element = document.createElement("style");
    document.head.appendChild(element);
    element.sheet.insertRule(
      `@font-face { font-family: "gamefont"; src: url("assets/gamefont.ttf") format("truetype"); }
      `,
      0
    );
    element.sheet.insertRule(
      `@font-face { font-family: "gamefont2"; src: url("assets/gamefont-2.ttf") format("truetype"); }
      `,
      0
    );

    //////// FUENTES ---|
    //////// audios --->
    for (let i = 1; i <= TOTAL_SOUND_LAUGHS; i++) {
      this.load.audio("laugh" + i, "assets/laugh" + i + ".mp3");
    }

    //////// audios ---|

    this.load.image("happy1", "assets/happy1.png");
    this.load.image("happy2", "assets/happy2.png");
    this.load.image("happy3", "assets/happy3.png");
    this.load.image("sad1", "assets/sad1.png");
    this.load.image("sad2", "assets/sad2.png");
    this.load.image("sad3", "assets/sad3.png");
    this.load.image("uiboard", "assets/uiboard.png");

    this.load.image("body", "assets/body.png");
    this.load.image("body-sad", "assets/body-sad.png");
    this.load.image("par1", "assets/par-1.png");
    this.load.image("par2", "assets/par-2.png");
    this.load.image("par3", "assets/par-3.png");
    ///////////

    this.load.image("home", "assets/home.png");
    this.load.image("logo", "assets/logo.png");
    this.load.image("btn_play", "assets/btn_play.png");
    this.load.image("btn_play_press", "assets/btn_play_press.png");
    this.load.image("btn_info", "assets/btn_info.png");
    this.load.image("btn_info_press", "assets/btn_info_press.png");
    this.load.image("btn_credits", "assets/btn_credits.png");
    this.load.image("btn_credits_press", "assets/btn_credits_press.png");
  }
  waitForWebFont() {
    return new Promise((resolve) => {
      if (window.WebFont) {
        window.WebFont.load({
          custom: {
            families: ["gamefont", "gamefont2"],
          },
          active: resolve,
        });
      } else {
        console.warn("not found webfont");
        resolve();
      }
    });
  }
  create() {
    this.waitForWebFont().then(() => {
      this.scene.start("intro");
    });
  }
}
