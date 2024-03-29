import { COLORS, TOTAL_SOUND_LAUGHS } from "../constants.js";
import hitAnimationFn from "../src/hitAnimation.js";
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
  let durations = {
    1: random(300, 500),
    2: random(300, 500),
  };
  scene.tweens.chain({
    targets: laughText,
    tweens: [
      {
        y: y - random(80, 120),
        x: x + random(-30, 30),
        alpha: 1,
        ease: "quint.out",

        duration: durations[1],

        hold: 100,
      },
      {
        y: y - 200,
        x: x + random(-20, 20),
        alpha: 0,
        ease: "sine.inout",

        duration: durations[2],
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
    parseInt(from.happyLevel / 10),
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

export class Personaje extends Phaser.GameObjects.Container {
  happyLevel = 0;
  coeRedLaug = 1;
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
    this.sprite.foots = this.sprite.list[1];
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

    this.hitAnimation = hitAnimationFn(this.sprite.body);
    this.setHappyLevel(0);
  }
  setHappyLevel(level) {
    this.happyLevel = level;
  }
  setAsInteractive() {
    this.setInteractive({ cursor: `url("assets/cur_point.png"), grab` });
    this.scene.input.setDraggable(this);
    let grabsound = this.scene.sound.add("grab");
    let dropsound = this.scene.sound.add("drop");
    let pressed = false,
      dragging = false;
    let lastTimeout = 0;
    //this.on("dragstart",);
    const onrealDragStart = () => {
      dragging = true;
      this.sprite.foots.setTexture("foots2").setScale(0.32);
      this.scene.tweens.add({
        targets: this,
        y: "-=16",
        duration: 60,
      });
    };
    this.on("dragend", () => {
      if (dragging) {
        this.scene.tweens.add({
          targets: this,
          y: "+=16",
          duration: 60,
          onComplete: () => {
            this.sprite.foots.setTexture("foots").setScale(0.5);
          },
        });
      }
    });
    this.on("pointerdown", (pointer) => {
      if (this.isNegative) {
        laughUp(this.scene, this.x, this.y, "No", "red");
        return;
      }
      pressed = true;
      dragging = false;
      grabsound.play();
      clearTimeout(lastTimeout);
      lastTimeout = setTimeout(() => {
        if (pressed) {
          onrealDragStart();
        }
      }, 300);

      this.setScale(1.05);
      this.setDepth(5000);
      this.scene.input.once("pointerup", () => {
        pressed = false;
        this.setScale(1);
        this.setDepth(this.y + 50);
        if (dragging) {
          dropsound.play();
        }
      });
      //this.scene.input.setDefaultCursor(`url("assets/cur_grab.png"), grab`);
      this.scene.input.manager.setCursor({
        cursor: 'url("assets/cur_grab.png"), grab',
      });
      this.doThickle();
    });
    return this;
  }
  doThickle() {
    if (!this.thikcle_animation()) {
      return false;
    }
    this.laughing(laughClickpower);
    this.doShotLaugh();
    return true;
  }
  setAsNegative() {
    this.isNegative = true;
    //this.sprite.bordercircle.setAlpha(1);
    this.setHappyLevel(-50);
    this.setScale(1.5);

    this.sprite.body.setTexture("body-sad");
    setTimeout(() => {
      let rate = 80 / this.sprite.body.width;
      this.sprite.body.setScale(rate, rate);
      this.sprite.face.y = 4;
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
    let timeout = this.happyLevel < 70 ? 1000 : 500;
    this.busy.laugh_text = true;
    let textLaugh = getLaughTextByLevel(this.happyLevel);
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
    let vel = 5 * (this.happyLevel / 50);
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
  laughing(_laughpower = 1) {
    this.coeRedLaug = 1;

    if (this.happyLevel < 100) {
      this.happyLevel += _laughpower;
    }
  }
  catchLaugh(intensiti = 1) {
    if (this.busy.catched_laugh) {
      return false;
    }
    this.busy.catched_laugh = true;
    if (this.isNegative) {
      this.laughing(intensiti / 10);
      if (this.happyLevel < 80) {
        this.hitAnimation({ x: 2, y: 0 }, 0x1889df);
      }
    } else {
      this.laughing(intensiti);
    }

    setTimeout(() => {
      this.busy.catched_laugh = false;
    }, random(100, 500));
    return true;
  }
  catchNegative(intensiti = 1) {
    this.happyLevel -= intensiti;
    this.hitAnimation({ x: 4, y: 0 }, 0xfc6769);
  }
  reduceHappyLevel() {
    this.coeRedLaug = Math.max(0, this.coeRedLaug - 0.0001);
    let redLaugh = Math.min(1, 1 - this.coeRedLaug);

    this.happyLevel -= redLaugh;
  }
  doShotLaugh() {
    if (this.happyLevel > 10 && random(1, 10) > 2) {
      shotLaugh(
        this.scene,
        this,
        getLaughTextByLevel(this.happyLevel),
        200,
        "#1889DF",
        16
      );
      this.scene.playAudioSound(this._audio_ids[random(0, 2)]);
      this.laughing_animation();
    }
  }
  doShotNegative() {
    if (this.happyLevel > 80) {
      return;
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
    if (this.happyLevel > -30) {
      t_name = "sad2";
    }

    if (this.happyLevel > -10) {
      t_name = "sad1";
    }

    if (this.happyLevel > 0) {
      t_name = "happy1";
    }

    if (this.happyLevel > 40) {
      t_name = "happy2";
    }
    if (this.happyLevel > 80) {
      t_name = "happy3";
    }

    this.sprite.face.setTexture(t_name);
    if (this.isNegative) {
      if (this.happyLevel > 80) {
        this.sprite.body.setTexture("body");
      } else {
        this.sprite.body.setTexture("body-sad");
      }
    }
  }
  limitHappyLevel() {
    if (this.isNegative && this.happyLevel < -50) {
      this.happyLevel = -50;
    }
    if (!this.isNegative && this.happyLevel < 0) {
      this.happyLevel = 0;
    }

    if (this.happyLevel > 100) {
      this.happyLevel = 100;
    }
  }
  update() {
    if (this.happyLevel > 0) {
      this.reduceHappyLevel();
      if (this.doLaughText() && this.happyLevel > 90) {
        this.doShotLaugh();
      }
    }
    if (this.isNegative) {
      this.doShotNegative();
    }
    this.updateFace();
    this.limitHappyLevel();
  }
}

export default class Main extends Phaser.Scene {
  laughPercentage = 0;
  level = 0;
  score = 0;
  gameEnd = false;
  waitingTolose = {
    time: 0,
    start: false,
  };
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
    this.gameEnd = false;
    this.score = 0;
    this.waitingTolose.time = 0;
    this.waitingTolose.start = false;
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
      collideWorldBounds: true,
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
          personaje.catchNegative(8);
          shot.destroy();
          this.score -= 2;
          return;
        }
        if (personaje.catchLaugh(25)) {
          this.score += 7;
        }

        return;
      },
      null,
      this
    );
    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      let bounds = this.physics.world.bounds;
      if (dragX <= bounds.left || dragX >= bounds.right) {
        return;
      }
      if (dragY <= bounds.top || dragY >= bounds.bottom) {
        return;
      }
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
    this.sound.add("whoo");
    this.sound.add("zoom-in");
  }
  doLaughSound() {
    if (this.busyLaughin) {
      return;
    }

    let laughing = this.groupPersonajes.children.entries.filter(
      (p) => p.happyLevel > 20
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
    p._audio_ids = [getNewLaughAudio(), getNewLaughAudio(), getNewLaughAudio()];

    this.groupPersonajes.add(p);

    return p;
  }
  calcLaughPercentage() {
    let total_happy = 0;
    let total = 0;
    this.groupPersonajes.children.entries.forEach((p) => {
      total_happy += p.happyLevel;
      total++;
    });
    this.laughPercentage = total_happy / total;
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
    this.sound.get("whoo").play();
    this.sound.get("zoom-in").play();
    let camscale = { 1: 1.5, 2: .7, 3: .4 }[this.level]//2 - this.level * 0.5;
    this.cameras.main.zoomTo(camscale, 300);
    let dist = { 1: 150, 2: 360, 3: 700 }[this.level];
    {
      let angle = 0;
      let gap_ang = 360 / total;
      for (let i = 0; i < total; i++) {
        angle += gap_ang;
        let vel = this.physics.velocityFromAngle(
          angle,
          random(dist - 20, dist + 20)
        );
        let p = this.addPersonaje(
          this.center.x + vel.x,
          this.center.y + vel.y
        ).setAsInteractive();
        p.setHappyLevel(30);
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
    let wor_dist = dist * 2;
    this.physics.world.setBounds(
      this.center.x - wor_dist,
      this.center.y - wor_dist,
      wor_dist * 2,
      wor_dist * 2
    );
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
  }

  winScreen() {
    this.gameEnd = true;
    this.cameras.main.zoomTo(1, 300);

    const ui = this.scene.get("ui");
    ui.finalScreen(true);
    setTimeout(() => {
      this.scene.pause();
    }, 10000);
  }
  validateIfLoseAfter3s() {
    if (this.laughPercentage < -9) {
      if (this.waitingTolose.start) {
        let seconds = Date.now() - this.waitingTolose.time;

        if (seconds >= 3000) {
          this.doLose();
        }
      } else {
        this.waitingTolose.start = true;
        this.waitingTolose.time = Date.now();
      }
    } else {
      this.waitingTolose.start = false;
      this.waitingTolose.time = 0;
    }
  }
  doLose() {
    this.gameEnd = true;
    this.cameras.main.zoomTo(1, 300);

    const ui = this.scene.get("ui");
    ui.finalScreen(false);
  }
  update() {
    if (this.gameEnd || this.level === 0) {
      return;
    }
    this.calcLaughPercentage();
    /*  if (this.laughPercentage > 5) {
      this.doLaughSound();
    } */
    if (this.laughPercentage > 100) {
      this.nextLevel();
    }
    this.validateIfLoseAfter3s();
  }
}
