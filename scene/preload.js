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
      '@font-face { font-family: "gamefont"; src: url("assets/gamefont.otf") format("opentype"); }',
      0
    );
    //////// FUENTES ---|
    //////// audios --->
    for (let i = 1; i <= TOTAL_SOUND_LAUGHS; i++) {
      this.load.audio("laugh" + i, "assets/laugh" + i + ".mp3");
    }

    //////// audios ---|

    this.load.image("face1", "assets/face1.png");
    this.load.image("face2", "assets/face2.png");
    this.load.image("face3", "assets/face3.png");
    this.load.image("face4", "assets/face4.png");
  }
  waitForWebFont() {
    return new Promise((resolve) => {
      if (window.WebFont) {
        window.WebFont.load({
          custom: {
            families: ["gamefont"],
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
      this.scene.start("main");
    });
  }
}
