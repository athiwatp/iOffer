import React, {AppRegistry, Component, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'

class App extends React.Component {
  constructor() {
    super()
    this.data = [ ]
  }

  render() {
    let appStyle = {
      paddingTop: 30
    }
    let inputStyle = {
      height: 30,
      borderWidth: 1,
      borderColor: 'lightgray'
    }
    let buttonStyle = {
      borderWidth: 1,
      borderColor: 'darkgray',
      borderRadius: 4,
      margin: 10,
      padding: 8,
      backgroundColor: 'lightblue'
    }
    let buttonTextStyle = {
      textAlign: 'center' 
    }
    let items = [ ]
    for (let r of this.data) {
      items.push(<Text>{r.name}</Text>)
    }
    return (
      <View style={appStyle}>
        <TextInput style={inputStyle}></TextInput>
        <TouchableOpacity style={buttonStyle}
          onPress={this.search.bind(this)}>
          <Text style={buttonTextStyle}
                 >Search</Text>         
        </TouchableOpacity>
        <Text>
        Welcome to React Native, the easiest way to write application for iOS and Android.
        {items}
        </Text>
      </View>
    )
  }
  
  search() {
    let query = 'หนังสือ'
    let url = 'http://ioffer.space:2000/search-result/'
    fetch(url + query)
    .then( r => r.json() )
    .then( d => {
        this.data = d
        this.setState({})
      }
    )
  }
}

AppRegistry.registerComponent
('SampleApp', () => App)
