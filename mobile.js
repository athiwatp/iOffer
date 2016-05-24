import React from 'react-native'

class App extends React.Component {
  constructor() {
    super()
    this.data = [ ]
    fetch('http://ioffer.space:2000/search-result/หนังสือ')
    .then( r => r.json() )
    .then( d => {
        this.data = d
        this.setState({})
      }
    )
  }

  render() {
    let items = [ ]
    for (let r of this.data) {
      items.push(<React.Text>{r.name}</React.Text>)
    }
    return (
      <React.View>
        <React.Text>
        Welcome to React Native, the easiest way to write application for iOS and Android.
        {items}
        </React.Text>
      </React.View>
    )
  }
}

React.AppRegistry.registerComponent
('SampleApp', () => App)
