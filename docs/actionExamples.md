# Attack

## move

### payload
```js
{
  type: 'move',
  content: {
    toTile: {
      x: 5,
      y: 6,
    }
    fromTile: {
      x:4,
      y:6,
    }
  }
}
```

### response
```js
{
  actionId: 1,
}
```

## createUser

### payload
```js
{
  type: 'createUser',
  content: {
    name: 'gnew',
    password: 'h45h3dp455w0rd',
  },
  newRecords: {
    Inventory: {
      1: Inventory,
    },
    Player: {
      1: Player,
    },
    Item: {
      1: Item,
    },
    User: {
      1: User,
    },
  },
}
```

### response
```js
{
  actionId: 1,
}
```

## attack

### payload
```js
{
  type: 'attack',
  content: {
    targetEntity: {
      modelName: 'Fixture',
      id: 1
    },
  },
  recordsToCreate: [
    {
      modelName: 'Item',
      data: Item,
    },
    {
      modelName: 'Item',
      data: Item,
    },
  ]
  },
}
```

### response
```js
{
  actionId: 1,
  newRecords: [
    {
      modelName: 'Item',
      data: Item,
    },
    {
      modelName: 'Item',
      data: Item,
    },
  ],
}
```
