# Roadmap
+ Basic movement
+ Corgi cube
/ Fixtures
  - Controls in sidebar
  - Player movement
  - Tie sprites closer to data (can add and remove in game.draw)
      - game.draw.add({ modelName: 'Player', id });
      - Results in data along with sprite
      - game.draw.remove({ modelName: 'Player', id });
  - Sprites also update with object attributes (coordinates)
- Inventory for players and fixtures
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
- Camera has notion of edge (for rotating controls)
- ActionAnimationSequencer
  - Dictates when certain controls can be used
  - Ensures that actions are shown in the proper order

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
