// Mock Phaser
global.Phaser = {
  Game: class Game {},
  Scale: { CENTER_BOTH: 0 },
  Scene: class Scene {},
  Events: { EventEmitter: class EventEmitter {} }
};