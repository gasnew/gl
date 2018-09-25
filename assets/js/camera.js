game.camera = {
  init: function() {
    this.targetRotation = -0.145888 / 1.5 * Math.PI / 4;
    this.rotation = this.targetRotation;

    this.rotationGroup = new TWEEN.Group();

    game.keys.actions.rotateLeft.subscribe(() => {
      this.rotationGroup.removeAll();
      this.targetRotation -= Math.PI / 2;
      new TWEEN.Tween(this, this.rotationGroup)
        .to({ rotation: this.targetRotation })
        .easing(TWEEN.Easing.Quintic.Out)
        .start();
    });
    game.keys.actions.rotateRight.subscribe(() => {
      this.rotationGroup.removeAll();
      this.targetRotation += Math.PI / 2;
      new TWEEN.Tween(this, this.rotationGroup)
        .to({ rotation: this.targetRotation })
        .easing(TWEEN.Easing.Quintic.Out)
        .start();
    });
  },

  update: function() {
    this.rotationGroup.update();
  },
};
