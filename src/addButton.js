export default function addButton(
  scene,
  x,
  y,
  label,
  [img_idle, img_press],
  onClick = () => null
) {
  let btn = scene.add.image(0, 0, img_idle).setOrigin(0);
  btn.setInteractive({ cursor: `url("assets/cur_point.png"), grab` });
  let popsound = scene.sound.add("pop");
  btn.on("pointerdown", () => {
    btn.setTexture(img_press);
    btn.setScale(0.98);
    btn.once("pointerup", () => {
      popsound.play();
      onClick();
    });
    scene.input.once("pointerup", () => {
      btn.setTexture(img_idle);
      btn.setScale(1);
    });
  });
  let container = scene.add.container(x - btn.width / 2, y, [
    btn,
    scene.add
      .text(btn.width / 2, btn.height + 4, label, {
        fontFamily: "gamefont",
        fontSize: 24,
        color: "#000000",
      })
      .setOrigin(0.5),
  ]);
  container.bg = container.list[0];
  container.text = container.list[1];
  return container;
}
