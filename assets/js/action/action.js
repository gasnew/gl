game.Action = {
  init: function({ id, type, PlayerId }) {
    this.id = id;
    this.type = type;
    this.PlayerId = PlayerId;
    this.content = {};
  },
};
