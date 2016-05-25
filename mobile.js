import React, {AppRegistry, Component, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'

class App extends React.Component {
  constructor() {
    super()
    this.data = [ ]
    this.query = ''
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
    let nameStyle = {
      fontWeight:'bold'
    }
    let itemStyle = {
      borderWidth: 1,
      borderColor: 'lightgray',
      padding: 4
    }
    let items = [ ]
    for (let r of this.data) {
      let img = { uri: 'http://ioffer.space:2000/' + r.photos[0] }
      items.push(
        ( 
        <View style={itemStyle}>
          <Image style={{width:24, height:24}}
          source={img} />
          <Text style='nameStyle'>{r.name}</Text>
          <Text>{r.description}</Text>
        </View>
        )
      )
    }
    return (
      <View style={appStyle}>
        <TextInput style={inputStyle} 
          onChangeText={this.typing.bind(this)}></TextInput>
        <TouchableOpacity style={buttonStyle}
          onPress={this.search.bind(this)}>
          <Text style={buttonTextStyle}
                 >Search</Text>         
        </TouchableOpacity>
        <Text>
        Welcome to React Native, the easiest way to write application for iOS and Android.
        </Text>
        <ScrollView>
        {items}
        </ScrollView>
      </View>
    )
  }
  
  typing(x) {
    this.query = x
  }
  
  search() {
    let query = this.query
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
