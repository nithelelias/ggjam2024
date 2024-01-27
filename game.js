
import Intro from "./scene/intro.js";
import Main from "./scene/main.js";
import Preloader from "./scene/preload.js";
import UIScene from "./scene/ui.js";
let parent = document.querySelector("#gameWrapper");
const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  transparent: true,
  parent: parent,

  scale: {
    mode: Phaser.Scale.FIT,
  },
  physics: {
    default: "arcade",
    matter: {
      debug: true,
      gravity: { y: 0.5 },
    },
  },
  scene: [Preloader, Intro, UIScene, Main],
};

const game = new Phaser.Game(config);
