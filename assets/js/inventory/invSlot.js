game.InvSlot = {
  init: function({ id, InventoryId }) {
    this.id = id;
    this.InventoryId = InventoryId;
    this.Inventory = null;

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
