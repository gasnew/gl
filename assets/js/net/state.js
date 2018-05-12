game.Net.State = {
  getServerState: function() {
    return new Promise(async (resolve, reject) => {
      var state = {};
      var index = {
        'Tile': {},
        'Player': {},
        'Item': {},
        'InvSlot': {},
      };

      var chunk = await this.getChunk(index);
      state.chunk = chunk;

      var player = await this.getPlayer(index);
      var players = await this.getPlayers(index);

      state.entities = {
        mainPlayer: player,
        players: players,
      };
      console.log(index);

      resolve(state);
    });
  },

  getChunk: async function(index) {
    var response = await game.Net.get('chunks/main');
    var height = response.height;
    var width = response.width;
    var chunk = Object.create(game.Chunk);

    var tiles = Array(height);
    for (var r = 0; r < height; r++) {
      tiles[r] = Array(width);
      for (var c = 0; c < width; c++) {
        tiles[r][c] = this.makeTile(index, response.Tiles, c, r);
      }
    }

    chunk.init(tiles);

    return chunk;
  },

  makeTile: function(index, data, x, y) {
    var tileData = data.find(t => t.x === x && t.y === y);

    var tile = Object.create(game.Tile);
    tile.init(tileData.id, x, y);
    index['Tile'][tile.id] = tile;

    if (tileData.Item)
      tile.setItem(this.makeItem(index, tileData.Item));

    return tile;
  },

  getPlayer: async function(index) {
    var response = await game.Net.get('players/main');
    var name = response.name;
    var x = response.x;
    var y = response.y;
    var player = Object.create(game.entities.Player);

    player.init(name, x, y, null, await this.getInventory(index));
    player.turn = this.parseTurn(index, await game.Net.getTurn());
    player.fastForward();

    index['Player'][player.id] = player;

    return player;
  },

  parseTurn: function(index, turnJSON) {
    var turn = [];
    for (var actionJSON of turnJSON) {
      var content = actionJSON.content;
      var action = null;
      if (actionJSON.type == 'move') {
        action = Object.create(game.Action.MoveRequest);
        action.init({
          fromTile: index['Tile'][content.fromTile.id],
          toTile: index['Tile'][content.toTile.id],
        });
      } else if (actionJSON.type == 'transfer') {
        var from = content.fromContainer;
        var to = content.toContainer;
        action = Object.create(game.Action.TransferRequest);
        console.log(from);
        action.init({
          fromContainer: index[from.type][from.id] = from,
          toContainer: index[to.type][to.id] = to,
          item: index['Item'][content.item.id] = content.item,
        });
      }

      turn.push(action);
    }

    return turn;
  },

  getPlayers: function(index) {
    return new Promise(async (resolve, reject) => {
      var response = await game.Net.get('players/all');
      resolve(response.map(p => {
        var name = p.name;
        var x = p.x;
        var y = p.y;
        var player = Object.create(game.entities.Player);

        player.init(name, x, y, null);
        index['Player'][player.id] = player;

        //TODO add tile to init when tile in server
        return player;
      }));
    });
  },

  getInventory: async function(index) {
    var response = await game.Net.get('inventories/main');
    var rows = response.rows;
    var cols = response.cols;
    var slots = new Array(rows);

    for (var r = 0; r < rows; r++) {
      slots[r] = Array(cols);
      for (var c = 0; c < cols; c++) {
        slots[r][c] = this.makeSlot(index, response.InvSlots, r, c);
      }
    }

    var inv = Object.create(game.Inventory);
    inv.init(rows, cols, slots);

    return inv;
  },

  makeSlot: function(index, data, r, c) {
    var slotData = data.find(s => s.row === r && s.col === c);

    var slot = Object.create(game.Inventory.InvSlot);
    slot.init(slotData.id);
    index['InvSlot'][slot.id] = slot;
    if (slotData.Item)
      slot.setContent(this.makeItem(index, slotData.Item));

    return slot;
  },

  makeItem: function(index, data) {
    var item = Object.create(game.hud.Item);
    item.init({
      id: data.id,
      type: data.type
    });

    index['Item'][item.id] = item;

    return item;
  }
};
