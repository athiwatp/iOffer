import React, {AppRegistry, Component, Image, Linking, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'

class App extends React.Component {
  constructor() {
    super()
    this.baseURL = 'http://ioffer.space:2000/'
    this.data = [ ]
    this.query = ''
  }

  render() {
    let appStyle = {
      paddingTop: 30
    }
    let inputStyle = {
      height: 50,
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
      fontWeight: 800
    }
    let itemStyle = {
      borderWidth: 1,
      borderColor: 'lightgray',
      padding: 4
    }
    if (React.Platform.OS == 'ios') {
      inputStyle.height = 30
    }
    let items = [ ]
    for (let r of this.data) {
      let img = { uri: this.baseURL + r.photos[0] }
      let url = this.baseURL + 'detail/' + r._id
      items.push(
        (
        <View style={itemStyle} key={r._id}>
          <TouchableOpacity onPress={this.openLink.bind(this, url)}>
            <Image style={{width:24, height:24}}
            source={img} />
            <Text style='nameStyle'>{r.name}</Text>
            <Text>{r.description}</Text>
          </TouchableOpacity>
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
    let url = this.baseURL + 'search-result/'
    fetch(url + query)
    .then( r => r.json() )
    .then( d => {
        this.data = d
        this.setState({})
      }
    )
  }

  openLink(url) {
    Linking.openURL(url)
  }
}

AppRegistry.registerComponent
('SampleApp', () => App)
