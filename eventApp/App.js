/**
 * Event Application made for CS 496 PSU 
 * https://github.com/facebook/react-native
 * @flow
 * 
 */

import React, { Component } from 'react';

import {
  AppRegistry,
  Platform,
  StyleSheet,
  Text,
  Button,
  View,
  OnPress,
  ActivityIndicator,
  AsyncStorage,
  FlatList,
  StatusBar,
  TextInput,
} from 'react-native';

import {
  StackNavigator,
  SwitchNavigator,
} from 'react-navigation';


const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  GraphRequest,
  GraphRequestManager,
  AccessToken
} = FBSDK;


class HomeScreen extends React.Component {
  render() {
    return (
    <View style={styles.container}>
      <Text style={styles.body}>
         Select from the below view  To experience this app
        You can either look at and add venues by navigating to 
         the Venue screen  Or Explire events or add an event by
         navigating to the events screen
      </Text>
        <View>
          <Button
            onPress={() => this.props.navigation.navigate('Venues')}
            title="Venues"
            color="#2E4172"
            accessibilityLabel="Navigate to Venue Screen"
          />
          <Button
            onPress={() => this.props.navigation.navigate('Events')}
            title="Events"
            color="#2E4172"
            accessibilityLabel="Navigate to Event Screen"
          />
          <Button
            onPress={() => this.props.navigation.navigate('Profile')}
            title="Profile"
            color="#2E4172"
            accessibilityLabel="Navigate to your profile"
          />
          <Button title="Actually, sign me out :)" onPress={this._signOutAsync} />
        </View>
    </View>
    );
  }

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
}

class VenuesScreen extends React.Component {
  render() {
    return (
      <View>
         <Text>
          Explore our list of DIY venues or add one! 
        </Text>
        <View>
          <TextInput
            style={{height: 40}}
            placeholder="Venue Name"
            onChangeText={(text) => this.setState({text})}
          />        
          <TextInput
            style={{height: 40}}
            placeholder="City"
            onChangeText={(text) => this.setState({text})}
          />
          <TextInput
            style={{height: 40}}
            placeholder="State"
            onChangeText={(text) => this.setState({text})}
          />
          <TextInput
            style={{height: 40}}
            placeholder="Tags"
            onChangeText={(text) => this.setState({text})}
          />
          <Button title="Add Event to List"  />
        </View>
        <View>
        <FlatList
          data={[{key: 'a'}, {key: 'b'}]}
          renderItem={({item}) => <Text>{item.key}</Text>}
        />
      </View>
      </View>
    );
  }
}

class EventsScreen extends React.Component {
  render() {
    return (
      <View>
        <Text>
          Find an event that suits your style
        </Text>

        <FlatList
          data={[{key: 'a'}, {key: 'b'}]}
          renderItem={({item}) => <Text>{item.key}</Text>}
        />
      </View>
    );
  }
}

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

class SignInScreen extends React.Component {
  static navigationOptions = {
    title: 'Please sign in',
  };
  render() {
    return (
      <View style={styles.container}>
        <Button title="Sign in!" onPress={this._signInAsync} />
        <LoginButton
          publishPermissions={["publish_actions"]}
          onLoginFinished={
            (error, result) => {
              if (error) {
                alert("Login failed with error: " + result.error);
              } else if (result.isCancelled) {
                alert("Login was cancelled");
              } else {
                alert("Login was successful with permissions: " + result.grantedPermissions);
              }
            }
          }
          onLogoutFinished={() => alert("User logged out")}
        />    
      </View>

    );
  }

  _signInAsync = async () => {
    await AsyncStorage.setItem('userToken', 'abc');
    this.props.navigation.navigate('App');
  };
}


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
    fontSize: 20,
    textAlign: 'left',
    color: '#D6DBE8',
    margin: 20,
  },
  buttons: {
    margin: 100,
    padding: 100,
    width: 100,
  },
  instructions: {
    textAlign: 'center',
    fontSize: 20,
    color: '#333333',
    marginBottom: 5,
  },
  navigation: {
    flex: 1,
  }
});



