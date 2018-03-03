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
  View
} from 'react-native';

const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  GraphRequest,
  GraphRequestManager,
  AccessToken
} = FBSDK;

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Event App!
        </Text>
        <Text style={styles.instructions}>
          Let's get started! 
          Sign in with your facebook or google account.
        </Text>
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
  instructions: {
    textAlign: 'center',
    fontSize: 20,
    color: '#333333',
    marginBottom: 5,
  },
});



