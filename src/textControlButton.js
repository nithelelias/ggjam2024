export default function textControlButton(scene, x, y, text_string, onclick) {
  const fontSize = 24;

  let text = scene.add
    .text(0, 0, text_string, {
      fontSize,
    })
    .setOrigin(0.5);
  let container = scene.add.container(x, y, [
    scene.add.rectangle(0, 0, text.width + 8, text.height + 8, 0xfff0f0, 0.18),
    text,
  ]);
  container.setSize(text.width, text.height);
  container.setInteractive();
  container.on("pointerdown", () => {
    onclick();
  });
  container.text = text;
  return container;
}
