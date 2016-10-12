class Game {}
class HidingSpot {}

const game = new Game()
game.id = '1'

const hidingSpots = []
const treasureIndex = Math.floor(Math.random() * 9)

for (let i = 0; i < 9; i++) {
  const hidingSpot = new HidingSpot()
  hidingSpot.id = `${i}`
  hidingSpot.isChecked = false
  hidingSpot.hasTreasure = (i === treasureIndex)
  hidingSpots.push(hidingSpot)
}

let turnsRemaining = 3

const getGame = () => game
const getHidingSpots = () => hidingSpots
const getTurnsRemaining = () => turnsRemaining
const getHidingSpot = (id) => hidingSpots.find(hs => hs.id === id)
const checkHidingSpotForTreasure = (id) => {
  if (hidingSpots.some(hs => hs.hasTreasure && hs.isChecked)) {
    return
  }
  turnsRemaining--
  const hidingSpot = getHidingSpot(id)
  hidingSpot.isChecked = true
}

export {
  Game,
  HidingSpot,
  getGame,
  getHidingSpots,
  getTurnsRemaining,
  getHidingSpot,
  checkHidingSpotForTreasure,
}
