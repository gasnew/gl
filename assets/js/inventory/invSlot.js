game.InvSlot = {
  init: function({ id, InventoryId }) {
    this.id = id;
    this.inventoryId = InventoryId;

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
