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

/*********************************************
* E D I T  V E N U E  R E C O R D   S C R E E N 
************************************************/
class EditVenueRecordScreen extends React.Component {
  static navigationOptions = {
    title: 'Add a venue',
 headerRight: <LoginButton style={
          {
            margin: 10,
            padding: 10,
            height: 30,
            width: 80,
            borderColor:'black',
            }
          }
          publishPermissions={["publish_actions"]}
            onLoginFinished={
              (error, result) => {
                if (error) {
                  alert("Login failed with error: " + result.error);
                } else if (result.isCancelled) {
                  alert("Login was cancelled");
                } else {
                  AccessToken.getCurrentAccessToken().then(
                  (data) => {
                    //alert(data.accessToken.toString())
                    AsyncStorage.setItem('userToken', data.accessToken.toString());
                    this.props.navigation.navigate('App');
                  }
                )
              }
            }
          }
          onLogoutFinished={() => alert("User logged out")}
        />    
  };
  _handleSubmit = () => {
        const self = this.props.navigation.state.params.self;

    const payload = {
      name: this.state.name,
      address: this.state.address,
      city: this.state.city,
      state: this.state.state,
    }
    const id = self.substring(8);
    fetch(`https://diyeventapp.appspot.com/venues/${id}`, {
      method: 'PATCH',
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
      this.props.navigation.navigate('Home');
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
    const self = this.props.navigation.state.params.self;
    const title = this.props.navigation.state.params.title;    
    const date = this.props.navigation.state.params.date;
    const genre = this.props.navigation.state.params.genre;
    const city = this.props.navigation.state.params.city;
    const state = this.props.navigation.state.params.state;
    const description = this.props.navigation.state.params.description;
    const all_ages = this.props.navigation.state.params.all_ages;
    return (
        <View style={{
          flex: 1,
          paddingTop: 50,
          flexDirection: 'column',
   
        }}>
          <TextInput style={{width: 400}}
            placeholder={title}
            onChangeText={(value) => this.setState({title: value})}
            value={this.state.title}
          />
          <TextInput style={{width: 400}}
            placeholder={date}
            onChangeText={(value) => this.setState({date: value})}
            value={this.state.date}
          />
          <TextInput style={{width: 400}}
            placeholder={city}
            onChangeText={(value) => this.setState({city: value})}
            value={this.state.city}
          />
          <TextInput style={{width: 400}}
            placeholder={state}
            onChangeText={(value) => this.setState({state: value})} 
            value={this.state.state}
          />
          <TextInput style={{width: 400}}
            placeholder={genre}
            onChangeText={(value) => this.setState({genre: value})} 
            value={this.state.genre}
          />
          <TextInput style={{width: 400}}
            placeholder={description}
            onChangeText={(value) => this.setState({description: value})} 
            value={this.state.description}
          />
          <TextInput style={{width: 400}}
            placeholder={all_ages}
            onChangeText={(value) => this.setState({all_ages: value})} 
            value={this.state.all_ages}
          />
          <View>
            <TouchableNativeFeedback
              onPress={this._handleSubmit}
              background={TouchableNativeFeedback.SelectableBackground()}>
              <View style={styles.buttonView}>
                <Text style={styles.buttonText}>Submit Update Venue + </Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>
    );
  }
}

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

module.exports = EditVenueRecordScreen;
