import { TOTAL_SOUND_LAUGHS } from "../constants.js";
import addButton from "../src/addButton.js";
import mobileCheck from "../src/isMobile.js";
import { Personaje } from "./main.js";

export default class Instructions extends Phaser.Scene {
  constructor() {
    super({
      key: "instructions",
      physics: {
        default: "arcade",
        arcade: {
          debug: false,
          gravity: { y: 0 },
        },
      },
    });
  }
  create() {
    window.instructions = this;
    const isMobile = mobileCheck();
    const btn = addButton(
      this,
      48,
      48,
      "",
      ["btn_return", "btn_return"],
      () => {
        this.scene.stop();
        this.scene.start("intro");
      }
    );
    this.center = {
      x: this.scale.width / 2,
      y: this.scale.height / 2,
    };

    this.add
      .image(-20, this.scale.height - 90, "curved-line")
      .setOrigin(0, 1)
      .setAngle(8);

    let title = this.add
      .text(this.center.x, 120, ["¿Tu Misión?"], {
        fontFamily: "gamefont2",
        fontSize: 64,
        lineSpacing: 70,
        color: "#9747FF",
        margin: "center",
      })
      .setOrigin(0.5);

    this.add
      .text(
        this.center.x,
        200,
        ["Contagiar de risa a los personajes que no se encuentran alegres"],
        {
          fontFamily: "gamefont2",
          fontSize: 28,
          lineSpacing: 34,
          color: "#000000",
          margin: "center",
        }
      )
      .setOrigin(0.5);

    this.helpText = this.add
      .text(
        this.center.x,
        this.center.y,
        ["Puedes arrastrar algunos personajes"],
        {
          fontFamily: "gamefont2",
          fontSize: 32,
          lineSpacing: 34,
          color: "#1570D7",
          align: "center",
        }
      )
      .setOrigin(0.5);
    this.helpText.state = 1;
    this.helpText.update = () => {
      if (this.helpText.state === 5) {
        this.helpText.setText(`Lo lograste con el poder de las risas`);
        return;
      }
      if (this.helpText.state === 4) {
        this.helpText.setText(
          `El Gruñon solo se alegrara con las risas de los demas`
        );
        return;
      }
      if (this.helpText.state === 3) {
        this.helpText.setText([
          `Ahora empezara a reirse y contagiara a los mas cercanos`,
          "acercate al gruñon",
        ]);
        return;
      }
      if (this.helpText.state === 2) {
        this.helpText.setText([
          `Ahora dale muchos ${isMobile ? "TAP" : "CLICK"} para que `,
          "se alegre",
        ]);
        return;
      }
    };
    this.helpText.next = () => {
      this.helpText.state++;
      let once = true;
      this.tweens.add({
        targets: this.helpText,
        scale: 0,
        alpha: 0,
        yoyo: true,
        ease: "sine.inout",
        duration: 500,
        onYoyo: () => {
          if (!once) {
            return;
          }
          once = false;
          this.helpText.update();
        },
        onComplete: () => {},
      });
    };

    this.personajesTest();
  }

  personajesTest() {
    this.initAudios();
    let center = { x: this.scale.width / 2, y: this.scale.height / 2 };
    let bottom = this.scale.height * 0.7;
    let gap = 200;
    let p1 = new Personaje(this, center.x - gap, bottom);
    p1._audio_ids = ["laugh1", "laugh2", "laugh3"];
    let p2 = new Personaje(this, center.x + gap, bottom);
    p2._audio_ids = ["laugh4", "laugh5", "laugh6"];
    p2.setHappyLevel(20);
    p1.setAsNegative();
    p2.setAsInteractive();
    window.pjs = [p1, p2];
    this.laugShotsGroup = this.physics.add.group();
    let groupPersonajes = this.physics.add.group({ runChildUpdate: true });
    groupPersonajes.add(p1);
    groupPersonajes.add(p2);
    this.physics.add.overlap(
      groupPersonajes,
      this.laugShotsGroup,
      (personaje, shot, e) => {
        if (personaje === shot.from) {
          return;
        }
        if (shot.is_negative) {
          personaje.catchNegative(2);
          shot.destroy();
          return;
        }
        personaje.catchLaugh(40);
        if (this.helpText.state === 3) {
          this.helpText.next();
        }

        if (personaje.happyLevel > 90 && this.helpText.state === 4) {
          this.helpText.next();
        }

        return;
      },
      null,
      this
    );
    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      if (this.helpText.state === 1) {
        this.helpText.next();
      }
      gameObject.x = dragX;
      gameObject.y = dragY;
      if (gameObject.doThickle) {
        gameObject.doThickle();
      }
    });
    let timeEvent = this.time.addEvent({
      delay: 60,
      callback: () => {
        if (this.helpText.state === 2 && p2.happyLevel > 10) {
          this.helpText.next();
          timeEvent.destroy();
        }
      },
      repeat: -1,
    });
  }
  addToShotGroup(laughText) {
    this.laugShotsGroup.add(laughText);
  }
  initAudios() {
    for (let i = 1; i <= TOTAL_SOUND_LAUGHS; i++) {
      this.sound.add("laugh" + i);
    }
  }
  playAudioSound(idAudio) {
    let audio = this.sound.get(idAudio);
    if (audio.isPlaying) {
      return;
    }
    audio.setVolume(1);
    audio.play();
    let duration = audio.duration * 1000;

    this.tweens.add({
      targets: audio,
      volume: 0,
      delay: duration * 0.8,
      duration: duration * 0.2,
      hold: 300,
      onComplete: () => {
        audio.stop();
      },
    });
  }
}
