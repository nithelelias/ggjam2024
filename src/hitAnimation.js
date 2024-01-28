export default function hitAnimationFn(target) {
  const white = Phaser.Display.Color.ValueToColor(0xffffff);
  var busy = false,
    promise = Promise.resolve();

  const tintAnimation = (fromColor, toColor) => {
    return new Promise((onResolve) => {
      if (!target.scene) {
        onResolve();
        return;
      }
      target.scene.tweens.addCounter({
        from: 0,
        to: 100,
        duration: 200,
        ease: "Sine.easeInOut",
        yoyo: true,
        repeat: 1,
        onUpdate: function (tween) {
          const value = tween.getValue();

          const colorObject = Phaser.Display.Color.Interpolate.ColorWithColor(
            fromColor,
            toColor,
            100,
            value
          );
          const color = Phaser.Display.Color.GetColor(
            colorObject.r,
            colorObject.g,
            colorObject.b
          );
          target.setTintFill(color);
        },
        onComplete: () => {
          target.clearTint();
          onResolve();
        },
      });
    });
  };
  const shakeAnimation = (vel) => {
    return new Promise((onComplete) => {
      if (!target.scene) {
        onComplete();
        return;
      }
      //   target.scene.cameras.main.shake(300,.02); -- too noisy
      target.scene.tweens.add({
        targets: target,
        duration: 50,
        x: target.x + vel.x,
        y: target.y + vel.y,
        yoyo: true,
        repeat: 3,
        ease: "Bounce.easeInOut",
        onComplete,
      });
    });
  };
  const play = (vel, secondColor = 0xff0000) => {
    if (busy) {
      return promise;
    }
    busy = true;
    let temptint = target.tintBottomLeft;
    let tinted = target.isTinted;

    promise = Promise.all([
      tintAnimation(white, Phaser.Display.Color.ValueToColor(secondColor)),
      shakeAnimation(vel),
    ]).then(() => {
      target.clearTint();
      if (tinted) {
        target.alpha = 1;
        target.setTint(temptint);
      }
      busy = false;
    });

    return promise;
  };

  return play;
}
