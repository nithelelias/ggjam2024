export const CURSOR = {
  current: null,
  setPointer: function () {
    if (!this.current) {
      return;
    }
    this.current.setTexture("cursor_pointer");
  },
  setDefault: function () {
    if (!this.current) {
      return;
    }
    this.current.setTexture("cursor_default");
  },
  setGrab: function () {
    if (!this.current) {
      return;
    }
    this.current.setTexture("cursor_grab");
  },
  setPress: function () {
    if (!this.current) {
      return;
    }
    this.current.setTexture("cursor_press");
  },
};
export default function customCursor(scene) {
  let image = scene.add
    .image(0, 0, "cursor_default")
    .setDisplaySize(48 * 0.71, 48);
  image.setScrollFactor(0);
  image.setDepth(1000);
  CURSOR.current = image;
  scene.input.on("pointermove", (pointer) => {
    image.x = pointer.x;
    image.y = pointer.y;
  });
  scene.input.on("pointerdown", (pointer,e) => {
    console.log(e)
  });
}
