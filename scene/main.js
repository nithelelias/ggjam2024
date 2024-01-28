import { COLORS, TOTAL_SOUND_LAUGHS } from "../constants.js";
const laughs = ["JI", "JA", "LOL"];
const emojisLaughs = ["😝", "😂", "🤣"];
let temp_id_ite = 0;
let laughClickpower = 1;

function random(min, max) {
  return Phaser.Math.Between(min, max);
}
function getNewLaughAudio() {
  temp_id_ite++;
  if (temp_id_ite > TOTAL_SOUND_LAUGHS) {
    temp_id_ite = 1;
  }
  return "laugh" + temp_id_ite;
}
function getBadWord() {
  if (random(1, 20) === 15) {
    return "sniff*";
  }
  return "buah";
}
function getLaughTextByLevel(level) {
  if (level < 20) {
    return laughs[0];
  }
  if (random(1, 20) === 15) {
    return "coff*";
  }
  if (level < 50) {
    return laughs[1];
  }
  if (random(1, 20) === 15) {
    return laughs[1];
  }
  return laughs[2];
}

function addLaughText(scene, x, y, text_laugh, color = "black", fontSize = 32) {
  const laughText = scene.add.text(x, y, text_laugh, {
    fontSize,
    color,
    fontFamily: "gamefont",
  });
  laughText.setDepth(1000);
  return laughText;
}

function laughUp(scene, x, y, text_laugh, color = "black", fontSize = 18) {
  const laughText = addLaughText(scene, x, y, text_laugh, color, fontSize);
  laughText.setAlpha(0.3);

  scene.tweens.chain({
    targets: laughText,
    tweens: [
      {
        y: y - random(80, 120),
        x: x + random(-30, 30),
        alpha: 1,
        ease: "quint.out",
        duration: random(300, 500),
        hold: 100,
      },
      {
        y: y - 200,
        x: x + random(-20, 20),
        alpha: 0,
        ease: "sine.inout",
        duration: random(300, 500),
      },
    ],
    onComplete: () => {
      laughText.destroy();
    },
  });
}

function shotLaugh(
  scene,
  from,
  text_laugh,
  dist = 200,
  color,
  fontSize,
  max_duration = 600
) {
  const laugh_shot = addLaughText(
    scene,
    from.x,
    from.y,
    text_laugh,
    color,
    fontSize
  );
  laugh_shot.is = "laugh_shot";
  laugh_shot.from = from;
  laugh_shot.intensiti = Phaser.Math.Clamp(
    1,
    parseInt(from.laughlevel / 10),
    10
  );
  scene.addToShotGroup(laugh_shot);
  let angle = Phaser.Math.Angle.RandomDegrees();
  let vel = scene.physics.velocityFromAngle(angle, dist);

  scene.tweens.chain({
    targets: laugh_shot,
    tweens: [
      {
        x: from.x + vel.x * 0.98,
        y: from.y + vel.y * 0.98,
        ease: "quintIn",
        duration: max_duration * 0.6,
      },
      {
        x: from.x + vel.x,
        y: from.y + vel.y,
        scale: 0.1,
        alpha: 0,
        ease: "sineInOut",
        duration: max_duration * 0.4,
      },
    ],
    onComplete: () => {
      laugh_shot.destroy();
    },
  });
  return laugh_shot;
}

class Personaje extends Phaser.GameObjects.Container {
  laughlevel = 0;
  busy = { thickle: false, laughing: false, laugh_text: false };
  isNegative = false;
  is = "Personaje";
  constructor(scene, x, y) {
    super(scene, x, y, []);

    scene.add.existing(this);

    this.sprite = scene.add.container(0, 0, [
      scene.add.rectangle(0, 0, 80, 100, 0x0055ba).setAlpha(0.01),
      scene.add.image(0, 40, "foots").setScale(0.5),
      scene.add.image(0, 0, "body-" + random(1, 4)),
      scene.add.image(0, -10, "face1").setScale(0.4),
    ]);
    this.sprite.bordercircle = this.sprite.list[0];
    this.sprite.body = this.sprite.list[2];
    this.sprite.face = this.sprite.list[3];
    let rate = 80 / this.sprite.body.width;
    this.sprite.body.setScale(rate, rate);
    /* this.sprite.body.fxShadow = this.sprite.body.preFX.addShadow(
      0,
      0,
      0.016,
      16,
      0x333333,
      30
    ); */
    this.setDepth(this.y + 50);
    this.add([this.sprite]);
    this.setSize(this.sprite.body.displayWidth, this.sprite.body.displayHeight);
  }
  setAsInteractive() {
    this.setInteractive({ cursor: `url("assets/cur_point.png"), grab` });
    this.scene.input.setDraggable(this);
    this.on("pointerdown", (pointer) => {
      if (this.isNegative) {
        laughUp(this.scene, this.x, this.y, "No", "red");
        return;
      }
      this.setScale(1.05);
      this.setDepth(5000);
      this.scene.input.once("pointerup", () => {
        this.setScale(1);
        this.setDepth(this.y + 50);
      });
      //this.scene.input.setDefaultCursor(`url("assets/cur_grab.png"), grab`);
      this.scene.input.manager.setCursor({
        cursor: 'url("assets/cur_grab.png"), grab',
      });
      this.doThickle();
    });
  }
  doThickle() {
    /* console.log(this.laughlevel); */
    if (!this.thikcle_animation()) {
      return;
    }
    this.laughing(laughClickpower);
    this.doShotLaugh();
  }
  setAsNegative() {
    this.isNegative = true;
    //this.sprite.bordercircle.setAlpha(1);
    this.laughlevel = -50;
    this.setScale(1.5);
    this.sprite.body.setTexture("body-sad");
    setTimeout(() => {
      let rate = 80 / this.sprite.body.width;
      this.sprite.body.setScale(rate, rate);
    }, 10);
  }

  thikcle_animation() {
    if (this.busy.thickle) {
      return false;
    }
    laughUp(this.scene, this.x, this.y, "thickle", "0x333333", 12);
    this.busy.thickle = true;
    let vel = 2;
    this.scene.tweens.chain({
      targets: this.sprite,
      tweens: [
        {
          x: -vel,
          duration: 60,
        },

        {
          x: vel,
          duration: 60,
        },
        {
          x: 0,
          duration: 60,
        },
      ],
      onComplete: () => {
        this.busy.thickle = false;
      },
    });
    return true;
  }
  doLaughText() {
    if (this.busy.laugh_text) {
      return false;
    }
    let timeout = this.laughlevel < 70 ? 1000 : 500;
    this.busy.laugh_text = true;
    let textLaugh = getLaughTextByLevel(this.laughlevel);
    laughUp(this.scene, this.x, this.y, textLaugh);

    setTimeout(() => {
      this.busy.laugh_text = false;
    }, timeout);
    return true;
  }

  laughing_animation() {
    if (this.busy.laughing) {
      return;
    }

    this.busy.laughing = true;
    let vel = 5 * (this.laughlevel / 50);
    this.scene.add.tween({
      targets: this.sprite,
      y: -vel,
      duration: 60,
      yoyo: true,
      onComplete: () => {
        this.busy.laughing = false;
      },
    });
  }
  laughing(_laughpower) {
    this.coeRedLaug = 1;
    if (this.laughlevel < 100) {
      this.laughlevel += _laughpower;
    }
  }
  catchLaugh(intensiti = 1) {
    if (this.busy.catched_laugh) {
      return;
    }
    this.busy.catched_laugh = true;
    if (this.isNegative) {
      this.laughing(intensiti / 10);
    } else {
      this.laughing(intensiti);
    }

    setTimeout(() => {
      this.busy.catched_laugh = false;
    }, random(100, 500));
  }
  catchNegative(intensiti) {
    this.laughlevel -= intensiti;
  }
  reduceLaughLevel() {
    this.coeRedLaug = Math.max(0, this.coeRedLaug - 0.0001);
    let redLaugh = Math.min(1, 1 - this.coeRedLaug);
    this.laughlevel -= redLaugh;
    if (this.laughlevel < -50) {
      this.laughlevel = -50;
    }
  }
  doShotLaugh() {
    if (this.laughlevel > 10 && random(1, 10) > 2) {
      shotLaugh(
        this.scene,
        this,
        getLaughTextByLevel(this.laughlevel),
        200,
        "#1889DF",
        16
      );
      this.scene.playAudioSound(this._audio_ids[random(0, 2)]);
      this.laughing_animation();
    }
  }
  doShotNegative() {
    if (this.laughlevel > 20) {
      //  return;
    }
    if (this.busy.shotting_negative) {
      return;
    }
    this.busy.shotting_negative = true;
    let shottext = shotLaugh(
      this.scene,
      this,
      getBadWord(),
      200,
      "#fc6769",
      24,
      2000
    );
    shottext.is_negative = true;
    setTimeout(() => {
      this.busy.shotting_negative = false;
    }, random(1, 6) * 200);
  }
  updateFace() {
    let t_name = "sad3";
    if (this.laughlevel > -30) {
      t_name = "sad2";
    }

    if (this.laughlevel > -10) {
      t_name = "sad1";
    }

    if (this.laughlevel > 0) {
      t_name = "happy1";
    }

    if (this.laughlevel > 40) {
      t_name = "happy2";
    }
    if (this.laughlevel > 80) {
      t_name = "happy3";
    }

    this.sprite.face.setTexture(t_name);
    if (this.isNegative) {
      if (this.laughlevel > 80) {
        this.sprite.body.setTexture("body");
      } else {
        this.sprite.body.setTexture("body-sad");
      }
    }
  }
  update() {
    if (this.laughlevel > 0) {
      this.reduceLaughLevel();
      if (this.doLaughText() && this.laughlevel > 90) {
        this.doShotLaugh();
      }
    }
    if (this.isNegative) {
      this.doShotNegative();
    }
    this.updateFace();

    if (this.laughlevel < -50) {
      this.laughlevel = -50;
    }
    if (this.laughlevel > 100) {
      this.laughlevel = 100;
    }
  }
}

export default class Main extends Phaser.Scene {
  laughPercentage = 0;
  level = 0;
  constructor() {
    super({
      key: "main",
      physics: {
        arcade: {
          debug: false,
          gravity: { y: 0 },
        },
        matter: {
          gravity: { y: 2.5 },
        },
      },
    });
    window.main = this;
  }
  create() {
    const ui = this.scene.get("ui");
    ui.startMain();
    this.level = 0;
    this.initAudios();
    this.cameras.main.setZoom(2);
    this.center = {
      x: this.scale.width / 2,
      y: this.scale.height / 2,
    };

    this.colors = new Phaser.Display.Color();

    this.groupPersonajes = this.physics.add.group({
      runChildUpdate: true,
    });
    this.laugShotsGroup = this.physics.add.group();

    this.physics.add.overlap(
      this.groupPersonajes,
      this.laugShotsGroup,
      (personaje, shot, e) => {
        if (personaje === shot.from) {
          return;
        }
        if (shot.is_negative) {
          personaje.catchNegative(10);
          shot.destroy();
          return;
        }
        personaje.catchLaugh(25);

        return;
      },
      null,
      this
    );
    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
      if (gameObject.doThickle) {
        gameObject.doThickle();
      }
    });
    this.nextLevel();
  }
  initAudios() {
    for (let i = 1; i <= TOTAL_SOUND_LAUGHS; i++) {
      this.sound.add("laugh" + i);
    }
  }
  doLaughSound() {
    if (this.busyLaughin) {
      return;
    }

    let laughing = this.groupPersonajes.children.entries.filter(
      (p) => p.laughlevel > 20
    );

    if (laughing.length < 1) {
      return;
    }
    let p = laughing[random(0, laughing.length - 1)];
    p.laughing_animation();
    let idAudio = p._audio_ids[random(0, 2)];
    this.busyLaughin = true;

    let audio = this.sound.get(idAudio);
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
        this.busyLaughin = false;
      },
    });
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
  addToShotGroup(laughText) {
    this.laugShotsGroup.add(laughText);
  }
  addPersonaje(x, y) {
    const p = new Personaje(this, x, y);
    (p._audio_ids = [getNewLaughAudio()]),
      getNewLaughAudio(),
      getNewLaughAudio();

    this.groupPersonajes.add(p);

    this.physics.add.collider(p, this.groupPersonajes);
    return p;
  }
  calcLaughPercentage() {
    let laughlevel = 0;
    let total = 0;
    this.groupPersonajes.children.entries.forEach((p) => {
      laughlevel += p.laughlevel;
      total++;
    });
    this.laughPercentage = laughlevel / total;
  }

  nextLevel() {
    if (this.level === 5) {
      return;
    }
    this.level++;
    if (this.level === 4) {
      this.level = 5;
      this.winScreen();
      return;
    }
    let total = this.level * 4;

    let camscale = 2 - this.level * 0.5;
    this.cameras.main.zoomTo(camscale, 300);
    let dist = { 1: 150, 2: 400, 3: 700 }[this.level];
    {
      let angle = 0;
      let gap_ang = 360 / total;
      for (let i = 0; i < total; i++) {
        angle += gap_ang;
        let vel = this.physics.velocityFromAngle(
          angle,
          random(dist - 20, dist + 20)
        );
        this.addPersonaje(
          this.center.x + vel.x,
          this.center.y + vel.y
        ).setAsInteractive();
      }
    }

    if (this.level === 1) {
      this.addPersonaje(this.center.x, this.center.y).setAsNegative();
    }
    if (this.level === 2) {
      let dist = 240;
      this.addPersonaje(this.center.x, this.center.y + dist).setAsNegative();
      this.addPersonaje(this.center.x, this.center.y - dist).setAsNegative();
      this.addPersonaje(this.center.x + dist, this.center.y).setAsNegative();
      this.addPersonaje(this.center.x - dist, this.center.y).setAsNegative();
    }
    if (this.level === 3) {
      let dist = 500;
      let total_bad = 8;
      let angle = 0;
      for (let i = 0; i < total_bad; i++) {
        let vel = this.physics.velocityFromAngle(angle, dist);
        this.addPersonaje(this.center.x + vel.x, this.center.y + vel.y)
          .setScale(1.5)
          .setAsNegative();
        angle += 45;
      }
    }

    /* let totalBad = total / 4;
    for (let i = 0; i < totalBad; i++) {
      let p = newCreated.splice(random(0, newCreated.length - 1), 1)[0];
      if (p) {
        p.setAsNegative();
      }
    } */
  }
  winScreen() {
    this.cameras.main.zoomTo(1, 300);
    const goToCenter = () => {
      let promise = [];

      this.groupPersonajes.children.entries.forEach((_el) => {
        _el.isNegative = false;
        promise.push(
          new Promise((resolve) => {
            this.tweens.add({
              targets: _el,
              x: this.center.x,
              y: this.center.y,
              delay: random(100, 500),
              //alpha: 0.3,
              ease: "sine.inout",
              duration: random(300, 600),
              onComplete: () => {
                resolve();
              },
            });
          })
        );
      });
      return Promise.all(promise);
    };
    const explode = () => {
      let promise = [];
      let dist = this.center.x * 0.8;
      this.groupPersonajes.children.entries.forEach((_el) => {
        promise.push(
          new Promise((resolve) => {
            let angle = Phaser.Math.Angle.RandomDegrees();
            let vel = this.physics.velocityFromAngle(
              angle,
              dist * (random(3, 10) / 10)
            );
            this.tweens.add({
              targets: _el,
              x: this.center.x + vel.x,
              y: this.center.y + vel.y,
              delay: random(100, 300),
              //alpha: 0.3,
              ease: "sine.inout",
              duration: random(300, 600),
              onComplete: () => {
                resolve();
              },
            });
          })
        );
      });
      return Promise.all(promise);
    };
    goToCenter().then(() => {
      //  this.cameras.main.zoomTo(1, 600);
      explode();
      this.particleEnd();
    });
  }
  particleEnd() {
    this.matter.world.setBounds(0, 0, this.scale.width, this.scale.height);
    let radius = 82;
    for (let i = 0; i < 128; i++) {
      setTimeout(
        (_idx) => {
          const particle = this.matter.add.image(
            Phaser.Math.Between(0, this.scale.width),
            0,
            "par" + random(1, 3),
            null,
            { shape: { type: "circle", radius }, ignorePointer: true }
          );

          particle.setScale(random(3, 14) / 10);
          particle.setFriction(0.005);
          particle.setBounce(0.9);
          particle.setMass(random(1, 2));
        },
        60 * i,
        i
      );
    }
    const ui = this.scene.get("ui");
    ui.finalScreen();
    setTimeout(() => {
      this.scene.pause();
    }, 10000);
  }

  update() {
    this.calcLaughPercentage();
    /*  if (this.laughPercentage > 5) {
      this.doLaughSound();
    } */
    if (this.laughPercentage > 100) {
      this.nextLevel();
    }
  }
}
