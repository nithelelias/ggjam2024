export default function addButton(
  scene,
  x,
  y,
  label,
  [img_idle, img_press],
  onClick = () => null
) {
  let popsound = scene.sound.add("pop");
  let btn = scene.add.image(0, 0, img_idle);
  let size = [btn.displayWidth * 1.2, btn.displayHeight * 1.2];
  let container = scene.add.container(x, y, [
    scene.add.rectangle(0, 0, size[0], size[1], 0xffffff, 0),
    btn,
    scene.add.text(0, size[1]*.6, label, {
      fontFamily: "gamefont",
      fontSize: 24,
      color: "#000000",
    }).setOrigin(.5),
  ]);
  container.bg = container.list[1];
  container.text = container.list[2];
  container.setSize(size[0], size[1]);

  container.setInteractive({ cursor: `url("assets/cur_point.png"), grab` });

  container.on("pointerdown", () => {
    btn.setTexture(img_press);
    btn.setScale(0.98);
    container.once("pointerup", () => {
      popsound.play();
      onClick();
    });
    scene.input.once("pointerup", () => {
      btn.setTexture(img_idle);
      btn.setScale(1);
    });
  });
  return container;
}
