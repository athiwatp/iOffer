import React, {AppRegistry, Component, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'

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
      items.push(<Text>{r.name}</Text>)
    }
    return (
      <View>
        <Text>
        Welcome to React Native, the easiest way to write application for iOS and Android.
        {items}
        </Text>
      </View>
    )
  }
}

AppRegistry.registerComponent
('SampleApp', () => App)
