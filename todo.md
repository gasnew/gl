# Roadmap
+ Basic movement
+ Corgi cube
+ Fixtures
  + Controls in sidebar
  + Player movement
  + Tie sprites closer to data (can add and remove in game.draw)
      + game.draw.add({ modelName: 'Player', id });
      + Results in data along with sprite
      + game.draw.remove({ modelName: 'Player', id });
  + Sprites also update with object attributes (coordinates)
- Punch mode
  - Hold F to activate
  - Punchable tiles highlighted
  - Can punch a bush to make berries drop
- Inventory for players
  - Action tooltip ('Punch' and 'Pick up')
  - Hold Q to open backpack (probs just a black rectangle)
  - Backpack open automatically if holding an item
  - Disable F and Q controls when holding an item
- Add phase schedule
  - Replenish bushes
  - Limit moves
- Eating!
- Level editing & file loading
- Playtest!
- Add effects
- Add roads
- Multiple chunks
- Elevation
- Plan out first week for noobs and first week for masters
- Playtest!
- Attacking (trees and such)
- Conditioned sheep
  - Action cost

# Features
- ActionAnimationSequencer
  - Dictates when certain controls can be used
  - Ensures that actions are shown in the proper order
- Hold Q to backpack
  - Things get packed in there lol
  - Like throw them out to drop them on the ground lol
  - Lol, like little tooltips tell you what action you're about to perform, haha

# Mechanic introductions
- Start on path, possibly lit one way and uphill that way
  - Learn to walk
  - See the moon juice quantity go down and lanterns pass juice down road
- Encounter bush(es)
  - Learn to punch
  - Berries pop off of bush
  - Eating berries can heal
- Encounter zombie
  - Punch zombie
  - Get more moon juice!!
  - Learn that punching white things gives you moon juice
- Encounter home base
  - Get hooksword (learn about equipping)
  - See that homebase keeps you safe (but needs to be powered; fixed daily cost?)
