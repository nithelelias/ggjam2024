import Instructions from "./scene/instructions.js";
import Intro from "./scene/intro.js";
import Main from "./scene/main.js";
import PreIntro from "./scene/preIntro.js";
import Preloader from "./scene/preload.js";
import Team from "./scene/team.js";
import UIScene from "./scene/ui.js";
let parent = document.querySelector("#gameWrapper");

const config = {
  type: Phaser.AUTO,
  /* width: window.innerWidth,
  height: window.innerHeight, */
  width: Math.max(1320, window.innerWidth),
  height: Math.max(720, window.innerHeight),
  transparent: true,
  parent: parent,

  scale: {
    mode: Phaser.Scale.FIT,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  scene: [Preloader, PreIntro, Intro, UIScene, Main, Instructions, Team],
};

const game = new Phaser.Game(config);
