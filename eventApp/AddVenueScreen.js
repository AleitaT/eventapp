import React, { 
  Component 
} from 'react';
import {
  AppRegistry,
  Platform,
  StyleSheet,
  Text,
  Button,
  View,
  OnPress,
  ActivityIndicator,
ItemSeparatorComponent,
  AsyncStorage,
  FlatList,
  StatusBar,
TouchableHighlight,
TouchableNativeFeedback,
  TextInput,
TouchableOpacity,
} from 'react-native';

import {
  StackNavigator,
  SwitchNavigator,
} from 'react-navigation';

const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  AccessToken
} = FBSDK;

/*******************************************
* A D D  A  V E N U E  S C R E E N 
********************************************/
class AddVenueScreen extends React.Component {
  static navigationOptions = {
    title: 'Add a venue',
  };
  _handleSubmit = () => {
    const payload = {
      name: this.state.name,
      address: this.state.address,
      city: this.state.city,
      state: this.state.state,
    }
    fetch('https://diyeventapp.appspot.com/venues/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: "Bearer AIzaSyAX2ADuOPwwoFZRSj5rW4TfWF7tIFcosIc",
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: payload.name,
        address: payload.address,
        city: payload.city,
        state: payload.state,
      })
    })
    .then((response) => response.text())
    .then((responseText) => {
      this.props.navigation.navigate('Venues');
    })
    .catch((error) => {
      console.error(error);
    });
  }
  constructor(props) {
    super(props);
    this.state = {text: ''};
  }
  render() {
    return (
        <View style={{
          flex: 2,
          paddingTop: 50,
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          textColor: 'white',
        }}>
          <TextInput style={{width: 400}}
            placeholder="Venue Name"
            onChangeText={(value) => this.setState({name: value})}
            value={this.state.name}
          />
          <TextInput style={{width: 400}}
            placeholder="Address"
            onChangeText={(value) => this.setState({address: value})}
            value={this.state.address}
          />
          <TextInput style={{width: 400}}
            placeholder="City"
            onChangeText={(value) => this.setState({city: value})}
            value={this.state.city}
          />
          <TextInput style={{width: 400}}
            placeholder="State"
            onChangeText={(value) => this.setState({state: value})} 
            value={this.state.state}
          />
          <View>
            <TouchableNativeFeedback
              onPress={this._handleSubmit}
              background={TouchableNativeFeedback.SelectableBackground()}>
              <View style={styles.buttonView}>
                <Text style={styles.buttonText}>Submit Venue + </Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>
    );
  }
}
module.exports = AddVenueScreen;


/*******************************************
* S T Y L E S 
********************************************/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#7887AB',
  },
  welcome: {
    fontSize: 50,
    textAlign: 'center',
    color: '#D6DBE8',
    margin: 10,
  },  
  body: {
    flex:1,
    fontSize: 20,
    textAlign: 'left',
    color: '#D6DBE8',
    margin: 20,
  },
  wideButton: {
    width: 400,
    height: 300,
    borderWidth:1,
    flex:1,
    borderColor:'black',
  },
  buttonView: {
    width: 400, 
    height: 80,
    alignItems: 'center',
    backgroundColor: '#2E4172',
    borderColor: 'white' 
  },
  instructions: {
    textAlign: 'center',
    fontSize: 20,
    color: '#333333',
    marginBottom: 5,
  },
  navigation: {
    flex: 1,
  },
  input: {
    height: 40, 
    borderColor: 'gray', 
    borderWidth: 1
  },
  buttonText: {
    margin: 30, 
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
    textAlignVertical: 'center',
    fontWeight: 'bold',         
  }
});