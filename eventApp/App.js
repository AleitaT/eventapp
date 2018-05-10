/**
 * Event Application made for CS 496 PSU 
 * https://github.com/facebook/react-native
 * @flow
 * 
 */

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

var EditVenueRecordScreen = require('./EditVenueRecordScreen.js');
var VenuesScreen = require('./VenuesScreen.js');
var VenueRecordScreen = require('./VenueRecordScreen.js');
var AddVenueScreen = require('./AddVenueScreen.js');
var EventsScreen = require('./EventsScreen.js');
var EventRecordScreen = require('./EventRecordScreen.js');
var EditEventRecordScreen = require('./EditEventRecordScreen.js');
var AddEventScreen = require('./AddEventScreen.js');
var AssignVenueToEventScreen = require('./AssignVenueToEventScreen.js');

/*******************************************
* AUTH LOADING SCREEN 
********************************************/
class AuthLoadingScreen extends React.Component {
  constructor() {
    super();
    this._bootstrapAsync();
  }
  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userToken ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

/*******************************************
* SIGN IN SCREEN 
********************************************/
class SignInScreen extends React.Component {
  static navigationOptions = {
    title: 'Sign in to begin',
  };
  render() {
    return (
      <View style={styles.container}>
        <LoginButton
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
          onLogoutFinished={() => 
          this.props.navigation.navigate('SignIn') }
        />    
      </View>

    );
  }
}


/*******************************************
* HOME SCREEN 
********************************************/
class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Find your zone',
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
  render() {
    return (

      <View style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        backgroundColor: '#7887AB'
      }}>
        <Text style={styles.body}>
           Select from the below view  To experience this app
          You can either look at and add venues by navigating to 
          the Venue screen  Or Explire events or add an event by
         navigating to the events screen
        </Text>
        <View style={{
          flex:1,
          flexDirection: 'column',
             alignItems: 'center',
          justifyContent: 'space-evenly',
        }}>

          <TouchableNativeFeedback
            onPress={() => this.props.navigation.navigate('Venues')}
            background={TouchableNativeFeedback.SelectableBackground()}>
            <View style={styles.buttonView}>

            <Text style={styles.buttonText}>Venues</Text>
          </View>
          </TouchableNativeFeedback>

          <TouchableNativeFeedback
            onPress={() => this.props.navigation.navigate('Events')}
            background={TouchableNativeFeedback.SelectableBackground()}>
           <View style={styles.buttonView}>
            <Text style={styles.buttonText}>Events</Text>
          </View>
          </TouchableNativeFeedback>

          <TouchableNativeFeedback
            onPress={() => this.props.navigation.navigate('Events')}
            background={TouchableNativeFeedback.SelectableBackground()}>
            <View style={styles.buttonView}>
            <Text style={styles.buttonText}>Events</Text>
          </View>
          </TouchableNativeFeedback>
          </View>
          <View>
        </View>
      </View>
    );
  }
}





/*******************************************
* P R O F I L E
********************************************/
class ProfileScreen extends React.Component {
  render() {
    return (
      <View>
        <Text>
          testing
        </Text>
      </View>
    );
  }
}

/*******************************************
* N A V I G A T I O N
********************************************/
const RootStack = StackNavigator({
  Home: {
    screen: HomeScreen,
  },
  Venues: {
    screen: VenuesScreen,
  },
  Events: {
    screen: EventsScreen,
  },
  Profile: {
    screen: ProfileScreen,
  },
  AddVenueScreen: {
    screen: AddVenueScreen,
  },  
  VenueRecord: {
    screen: VenueRecordScreen,
  }, 
  EventRecord: {
    screen: EventRecordScreen,
  },
  AddEvent: {
    screen: AddEventScreen,
  },
  EditVenueRecord: {
    screen: EditVenueRecordScreen,
  },
  EditEventRecord: {
    screen: EditEventRecordScreen,
  },
  AssignVenueToEvent: {
    screen: AssignVenueToEventScreen,
  },
});
const AuthStack = StackNavigator({ SignIn: SignInScreen });
export default SwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: RootStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
);

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

