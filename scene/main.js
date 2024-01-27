import { COLORS, TOTAL_SOUND_LAUGHS } from "../constants.js";
const laughs = ["JI", "JA", "LOL"];
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

function addLaughText(scene, x, y, text_laugh, color = "black") {
  const laughText = scene.add.text(x, y, text_laugh, {
    fontSize: random(12, 32),
    color,
    fontFamily: "gamefont",
  });
  return laughText;
}

function laughUp(scene, x, y, text_laugh) {
  const laughText = addLaughText(scene, x, y, text_laugh);
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

function shotLaugh(scene, from, text_laugh, dist = 200) {
  const laugh_shot = addLaughText(scene, from.x, from.y, text_laugh, "red");
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
        duration: 300,
      },
      {
        x: from.x + vel.x,
        y: from.y + vel.y,
        scale: 0.1,
        alpha: 0,
        ease: "sineInOut",
        duration: 300,
      },
    ],
    onComplete: () => {
      laugh_shot.destroy();
    },
  });
  return laugh_shot;
}

class Personaje extends Phaser.GameObjects.Container {
  laughlevel = random(-50, 0);
  busy = { thickle: false, laughing: false, laugh_text: false };
  is = "Personaje";
  constructor(scene, x, y, _color = 0xff6699) {
    super(scene, x, y, []);

    scene.add.existing(this);

    this.sprite = scene.add.container(0, 0, [
      scene.add.circle(0, 0, 80, _color).setScale(0.6, 1),
      scene.add.image(0, -20, "face1").setScale(0.5),
    ]);
    this.sprite.face = this.sprite.list[1];

    this.add([this.sprite]);
    this.setSize(80, 80);
    this.setInteractive();
    this.scene.input.setDraggable(this);

    this.on("pointerdown", (pointer) => {
      this.laughing(laughClickpower);
      this.thikcle_animation();
      console.log(this.laughlevel);
      this.doShotLaugh();
    });

    /// pick
  }
  doPick(startPointer) {
    let camera = this.scene.cameras.main;

    const onmove = (pointer) => {
      this.x = pointer.x;
      this.y = pointer.y;
      console.log(this.x, pointer);
      window.test = this;
    };
    this.scene.input.on("pointermove", onmove);
    this.scene.input.once("pointerup", () => {
      this.scene.input.off("pointermove", onmove);
    });
  }
  thikcle_animation() {
    if (this.busy.thickle) {
      return;
    }

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
  }
  doLaughText() {
    if (this.busy.laugh_text) {
      return false;
    }
    let timeout =
      this.laughlevel < 20 ? 1000 : this.laughlevel < 50 ? 500 : 300;
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
    this.laughing(intensiti);
    setTimeout(() => {
      this.busy.catched_laugh = false;
    }, 500);
  }
  reduceLaughLevel() {
    this.coeRedLaug = Math.max(0, this.coeRedLaug - 0.0001);
    let redLaugh = Math.min(1, 1 - this.coeRedLaug);

    this.laughlevel -= redLaugh;
  }
  doShotLaugh() {
    if (this.laughlevel > 10 && random(1, 10) > 2) {
      shotLaugh(this.scene, this, getLaughTextByLevel(this.laughlevel));
      this.scene.playAudioSound(this._audio_ids[random(0, 2)]);
      this.laughing_animation();
    }
  }
  updateFace() {
    let t_name = "face1";
    if (this.laughlevel > 20) {
      t_name = "face2";
    }
    if (this.laughlevel > 50) {
      t_name = "face3";
    }
    if (this.laughlevel > 70) {
      t_name = "face4";
    }
    this.sprite.face.setTexture(t_name);
  }
  update() {
    if (this.laughlevel > 0) {
      this.reduceLaughLevel();
      if (this.doLaughText() && this.laughlevel > 90) {
        this.doShotLaugh();
      }
    }
    this.updateFace();
  }
}

export default class Main extends Phaser.Scene {
  laughPercentage = 0;
  level = 1;
  constructor() {
    super("main");
    window.main = this;
  }
  create() {
    this.scene.launch("ui");
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
        if (personaje !== shot.from) {
          personaje.catchLaugh(20);
        }
        return;
      },
      null,
      this
    );
    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });
    this.addPersonaje(this.center.x, this.center.y);
    this.addPersonaje(this.center.x - 100, this.center.y);
    this.addPersonaje(this.center.x - 60, this.center.y + 120);
    this.addPersonaje(this.center.x + 100, this.center.y);
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
    this.colors.random(50);
    const p = new Personaje(this, x, y, this.colors.color);
    (p._audio_ids = [getNewLaughAudio()]),
      getNewLaughAudio(),
      getNewLaughAudio();

    this.groupPersonajes.add(p);

    this.physics.add.collider(p, this.groupPersonajes);
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
    this.level++;
    let total = this.level * 4;
    let camscale = 2 / this.level;
    this.cameras.main.zoomTo(camscale, 300);
    let dist = 130 * this.level;
    for (let i = 0; i < total; i++) {
      let angle = Phaser.Math.Angle.RandomDegrees();
      let vel = this.physics.velocityFromAngle(angle, random(dist-20,dist+20));
      this.addPersonaje(this.center.x + vel.x, this.center.y + vel.y);
    }
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
