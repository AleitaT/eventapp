
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
* A D D  A N  E V E N T  S C R E E N 
********************************************/
class AddEventScreen extends React.Component {
  static navigationOptions = {
    title: 'Add an Event',
  };
  _handleSubmit = () => {
    const payload = {
      title: this.state.title,
      venue: this.state.venue,
      date: this.state.date,
      city: this.state.city,
      state: this.state.state
    }
    fetch('https://diyeventapp.appspot.com/events/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: "Bearer AIzaSyAX2ADuOPwwoFZRSj5rW4TfWF7tIFcosIc",
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: payload.title,
        date: payload.date,
        city: payload.city,
        state: payload.state,
        genre: payload.genre,
        description: payload.description,
        all_ages: payload.all_ages
      })
    })
    .then((response) => response.text())
    .then((responseText) => {
      console.log("response", responseText);
      this.props.navigation.navigate('Events');
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
            placeholder="Event Title"
            onChangeText={(value) => this.setState({title: value})}
            value={this.state.title}
          />
          <TextInput style={{width: 400}}
            placeholder="genre"
            onChangeText={(value) => this.setState({genre: value})}
            value={this.state.genre}
          />
          <TextInput style={{width: 400}}
            placeholder="Date format 11/11/2011"
            onChangeText={(value) => this.setState({date: value})}
            value={this.state.date}
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
          <TextInput style={{width: 400}}
            placeholder="Description"
            onChangeText={(value) => this.setState({description: value})} 
            value={this.state.description}
          />
          <TextInput style={{width: 400}}
            placeholder="true = all ages, false = over 21"
            onChangeText={(value) => this.setState({all_ages: value})} 
            value={this.state.all_ages}
          />
          <View>
            <TouchableNativeFeedback
              onPress={this._handleSubmit}
              background={TouchableNativeFeedback.SelectableBackground()}>
              <View style={styles.buttonView}>
                <Text style={styles.buttonText}>Submit Event + </Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>
    );
  }
}

module.exports = AddEventScreen;


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