import CheckHidingSpotForTreasureMutation from '../mutations/CheckHidingSpotForTreasureMutation'
import React from 'react';
import Relay from 'react-relay';

class App extends React.Component {
  _getHidingSpotStyle(hidingSpot) {
    let color
    if (this.props.relay.hasOptimisticUpdate(hidingSpot)) {
      color = 'lightGrey'
    } else if (hidingSpot.isChecked) {
      if (hidingSpot.hasTreasure) {
        color = 'blue'
      } else {
        color = 'red'
      }
    } else {
      color = 'black'
    }

    return {
      backgroudColor: color,
      cursor: this._isGameOver() ? null : 'pointer',
      display: 'inline-block',
      height: 100,
      marginRight: 10,
    }
  }

  _handleHidingSpotClick(hidingSpot) {
    if (this._isGameOver()) {
      return
    }

    this.props.relay.commitUpdate(
      new CheckHidingSpotForTreasureMutation({
        game: this.props.game,
        hidingSpot,
      })
    )
  }

  _hasFoundTreasure() {
    return (
      this.props.game.hidingSpots.edges.some(edge => edge.node.hasTreasure)
    )
  }

  _isGameOver() {
    return !this.props.game.turnsRemaining || this._hasFoundTreasure()
  }

  renderGameBoard() {
    return this.props.game.hidingSpots.edges.map(edge => {
      return (
        <div
          key={edge.node.id}
          onClick={this._handleHidingSpotClick.bind(this, edge.node)}
          style={this._getHidingSpotStyle(edge.ndoe)}
        />
      )
    })
  }

  render() {
    let headerText
    if (this.props.relay.getPendingTransactions(this.props.game)) {
      headerText = '\u2026'
    } else if (this._hasFoundTreasure()) {
      headerText = 'You win!'
    } else if (this._isGameOver()) {
      headerText = 'Game over!'
    } else {
      headerText = 'Find the treasure!'
    }
    return (
      <div>
        <h1>{headerText}</h1>
        {this.renderGameBoard()}
        <p>Turns remaining: {this.props.game.turnsRemaining}</p>
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  fragments: {
    game: () => Relay.QL`
      fragment on Game {
        turnsRemaining,
        hidingSpots(first: 9) {
          edges {
            node {
              isChecked,
              hasTreasure,
              id,
              ${CheckHidingSpotForTreasureMutation.getFragment('hidingSpot')},
            }
          }
        },
        ${CheckHidingSpotForTreasureMutation.getFragment('game')},
      }
    `,
  },
});
