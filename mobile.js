import React, {AppRegistry, Component, Image, Linking, ListView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Dimensions from 'Dimensions'

class App extends Component {

constructor() {
	super()
	this.baseURL = 'http://ioffer.space:2000/'
	this.data = [ ]
	this.query = ''
}

render() {
	let {height, width} = Dimensions.get('window');
	
	let appStyle = {
		padding: 10,
		paddingTop: 30,
		backgroundColor: '#eee'
	}
	let logoStyle = {
		fontSize: 32,
		textAlign: 'center'
	}
	let inputStyle = {
		height: 50,
		borderWidth: 1,
		borderColor: 'lightgray',
		paddingTop: 2,
		paddingLeft: 4
	}
	let buttonStyle = {
		borderWidth: 1,
		borderColor: 'darkgray',
		borderRadius: 4,
		marginTop: 10,
		marginBottom: 10,
		padding: 8,
		backgroundColor: 'lightblue'
	}
	let buttonTextStyle = {
		textAlign: 'center'
	}
	let nameStyle = {
		fontWeight: 'bold'
	}
	let itemStyle = {
		backgroundColor: 'white',
		borderRadius: 8,
		padding: 4,
		margin: 4,
		// height: 200
	}
	let imageStyle = {
		width: 48,
		height: 48
	}
	let detailStyle = {
		left: 60,
		top: 0,
		position:'absolute',
		width: 280,
		height: 48,
		overflow: 'hidden'
	}
	let resultStyle = {
		height: height - 180
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
				<TouchableOpacity onPress={this.open.bind(this, url)}>
				<Image style={imageStyle}
					source={img} />
				<View style={detailStyle}>
					<Text style={nameStyle}>{r.name}</Text>
					<Text>{r.description}</Text>
				</View>
				</TouchableOpacity>
			</View>
			)
		)
	}
	return (
		<View style={appStyle}>
			<Text style={logoStyle}>iOffer.space</Text>
			<TextInput style={inputStyle} autoFocus
				placeholder="Keyword: Book, Car, ..."
				onChangeText={this.typing.bind(this)}
				onSubmitEditing={this.search.bind(this)}></TextInput>
			<TouchableOpacity style={buttonStyle}
				onPress={this.search.bind(this)}>
				<Text style={buttonTextStyle}>Search</Text>
			</TouchableOpacity>
			
			<ScrollView style={resultStyle}>
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

open(url) {
	Linking.openURL(url)
}

}

AppRegistry.registerComponent
('SampleApp', () => App)

