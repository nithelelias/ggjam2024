export default function addButton(
  scene,
  x,
  y,
  label,
  [img_idle, img_press],
  onClick = () => null
) {
  let btn = scene.add.image(0, 0, img_idle);
  btn.setInteractive({ cursor: `url("assets/cur_point.png"), grab` });

  btn.on("pointerdown", () => {
    btn.setTexture(img_press);
    btn.setScale(0.98);
    btn.once("pointerup", onClick);
    scene.input.once("pointerup", () => {
      btn.setTexture(img_idle);
      btn.setScale(1);
    });
  });
  let container = scene.add.container(x, y, [
    btn,
    scene.add
      .text(0, 82, label, {
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
