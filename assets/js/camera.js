game.camera = {
  init: function() {
    this.targetRotation = 0;
    this.targetEdge = 0;
    this.rotation = this.targetRotation;

    this.rotationGroup = new TWEEN.Group();
  },

  rotateLeft: function() {
    this.targetEdge = (this.targetEdge + 3) % 4;
    this.targetRotation -= Math.PI / 2;
    this.rotationGroup.removeAll();
    new TWEEN.Tween(this, this.rotationGroup)
      .to({ rotation: this.targetRotation })
      .easing(TWEEN.Easing.Quintic.Out)
      .start();
  },

  rotateRight: function() {
    this.targetEdge = (this.targetEdge + 1) % 4;
    this.targetRotation += Math.PI / 2;
    this.rotationGroup.removeAll();
    new TWEEN.Tween(this, this.rotationGroup)
      .to({ rotation: this.targetRotation })
      .easing(TWEEN.Easing.Quintic.Out)
      .start();
  },

  update: function() {
    this.rotationGroup.update();
  },
};
