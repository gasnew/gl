game.Inventory.InvSlot = {
  init: function(id) {
    this.id = id;

    this.type = 'InvSlot';
  },

  getContent: function() {
    return this.item;
  },
  setContent: function(item) {
    this.item = item;
  },
  empty: function() {
    return this.getContent() == null;
  },
};

