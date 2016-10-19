import Relay from 'react-relay'

export defaut class CheckHidingSpotForTreasureMutation extends Relay.Mutation {
  static fragments = {
    game: () => Relay.QL`
      fragment on Game {
        id,
        turnsRemaining,
      }
    `,
    hidingSpot: () => Relay.QL`
      fragment on HidingSpot {
        id,
      }
    `,
  }

  getMutation() {
    return Relay.QL`mutation{checkHidiingSpotForTreasure}`
  }

  getCollisionKey() {
    return `check_${this.props.game.id}`
  }

  getFatQuery() {
    return Relay.QL`
      fragment on CheckHidiingSpotForTreasurePayload @relay(pattern: true) {
        hidingSpot {
          isChecked,
          hasTreasure,
        },
        game {
          turnsRemaining,
        },
      }
    `
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        hidingSpot: this.props.hidingSpot.id,
        game: this.props.game.id,
      }
    }]
  }

  getVariables() {
    return {
      id: this.props.hidingSpot.id,
    }
  }

  getOptimisticResponse() {
    return {
      game: {
        turnsRemaining: this.props.game.turnsRemaining - 1,
      },
      hidingSpot: {
        id: this.props.hidingSpot.id,
        isChecked: true,
      }
    }
  }
}
