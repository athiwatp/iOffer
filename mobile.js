import React from 'react-native'

class App extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <React.View>
        <React.Text>
        Welcome to React Native, the easiest way to write application for iOS and Android.
        </React.Text>
      </React.View>
    )
  }
}

React.AppRegistry.registerComponent
('SampleApp', () => App)
