import { Deffered } from "./deferred.js";

function ProgressBar(
  scene,
  x,
  y,
  width = 100,
  height = 30,
  settings = { color: 0xffffff, backgroundColor: 0x111111 }
) {
  settings = Object.assign(
    { color: 0xffffff, backgroundColor: 0x111111 },
    settings
  );

  let backgroundBar = scene.add
    .image(0, 0, "rect")
    .setOrigin(0, 0.5)
    .setDisplaySize(width, height)
    .setTintFill(settings.backgroundColor);

  let barBorder = scene.add
    .image(-2, 0, "rect")
    .setOrigin(0, 0.5)
    .setTintFill(0x111111)
    .setDisplaySize(width + 4, height + 4);

  let bar = scene.add
    .image(0, 0, "rect")
    .setOrigin(0, 0.5)
    .setTintFill(settings.color);

  const container = scene.add.container(x, y, [backgroundBar, barBorder, bar]);

  this.width = width;
  this.height = height;

  this.setValue = (p) => {
    bar.setDisplaySize(width * (p / 100), height);
  };

  this.getContainer = () => container;
  this.destroy = () => {
    bar.destroy();
    backgroundBar.destroy();
    barBorder.destroy();
    container.destroy();
  };

  this.setValue(0);
}

function addLogo(scene, x, y) {
  if (scene.textures.list.hasOwnProperty("logo")) {
    let ratio = 300 / scene.textures.get("logo").source[0].width;

    return scene.add.image(x, y, "logo").setScale(ratio);
    //setDisplaySize(300, 304)
  }
}
export default function preloadProgress(scene) {
  var deferred = new Deffered();
  const center = {
    x: scene.scale.width / 2,
    y: scene.scale.height / 2,
  };
  var logo = null;
  var percentText = scene.make.text({
    x: center.x,
    y: scene.scale.height - 32,
    text: "0%",
    style: {
      font: "18px monospace",
      fill: "#ffffff",
    },
  });
  percentText.setOrigin(0.5, 0.5);
  var progressBar = new ProgressBar(
    scene,
    0,
    scene.scale.height,
    scene.scale.width,
    32,
    { color: 0xed15ae }
  );

  scene.load.on("progress", function (value) {
    percentText.setText(parseInt(value * 100) + "%");
    progressBar.setValue(value * 100);
    if (!logo) {
      logo = addLogo(scene, center.x, center.y);
    }
  });

  scene.load.on("complete", function () {
    progressBar.destroy();
    percentText.destroy();
    if (logo) {
      logo.destroy();
    }
    deferred.resolve();
  });
  return deferred.promise;
}
