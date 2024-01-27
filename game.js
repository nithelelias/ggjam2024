import { COLORS } from "./constants.js";
import Main from "./scene/main.js";
import Preloader from "./scene/preload.js";
import UIScene from "./scene/ui.js";
let parent = document.querySelector("#gameWrapper");
parent.style.backgroundColor = COLORS.secundary;
const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: COLORS.primary,
  parent: parent,

  scale: {
    mode: Phaser.Scale.FIT,
  },
  physics: {
    default: "arcade",
  },
  scene: [Preloader, UIScene, Main],
};

const game = new Phaser.Game(config);
