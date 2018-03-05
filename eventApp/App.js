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
const {LoginButton, GraphRequest, GraphRequestManager, AccessToken} = FBSDK;


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

/*******************************************
* HOME SCREEN 
********************************************/
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
            accessibilityLabel="Navigate to Venue Screen"/>
          <Button
            onPress={() => this.props.navigation.navigate('Events')}
            title="Events"
            color="#2E4172"
            accessibilityLabel="Navigate to Event Screen"/>
          <Button
            onPress={() => this.props.navigation.navigate('Profile')}
            title="Profile"
            color="#2E4172"
            accessibilityLabel="Navigate to your profile"/>
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

/*******************************************
* VENUES SCREEN 
********************************************/
class VenuesScreen extends React.Component {
  constructor(props){
    super(props);
    this.state ={ isLoading: true}
  }
  componentDidMount() {
    return fetch('https://diyeventapp.appspot.com/venues',{
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    }) 
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false, 
          dataSource: responseJson.venues,
        }, function(){
          console.log(response);
        });
      }).catch((error) => {
        console.error(error);
    });
  }
  render() {
    if(this.state.isLoading) {
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      );
    } 
    return(
      <View style={{flex: 1, paddingTop:20}}>
        <FlatList
          data={this.state.dataSource}
          renderItem={({item}) => <Text>{item.title}, {item.releaseYear}</Text>}
          keyExtractor={(item, index) => index}
        />
      </View>
    );
  }
}

/*******************************************
* V E N U E S   S C R E E N 
********************************************/
class AddVenueScreen extends React.Component {
  handleSubmit = () => {
    const value = this._form.getValue(); 
    console.log('value: ', value);  
    fetch('https://diyeventapp.appspot.com/venue/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: value.name,
        address: value.address,
        city: value.city,
        state: value.state,
        tags: value.tags,
      }),
    });
  }
  constructor(props) {
    super(props);
    this.state = {text: ''};
  }
  render() {
    return (
      <View style={styles.container}>
        <View>
          <TextInput style={styles.input}
            placeholder="Venue Name"
            onChangeText={(text) => this.setState({text})}
            value={this.state.text}
          />
          <TextInput style={styles.input}
            placeholder="Address"
            onChangeText={(text) => this.setState({text})}
            value={this.state.text}
          />
          <TextInput style={styles.input}
            placeholder="City"
            onChangeText={(text) => this.setState({text})}
            value={this.state.text}
          />
          <TextInput style={styles.input}
            placeholder="State"
            onChangeText={(text) => this.setState({text})}
            value={this.state.text}
          />
          <Button
          title="Add Venue"
          onPress={() => this.props.handleSubmit}
          />
        </View>
      </View>
    );
  }
}

/*******************************************
* E V E N T S  S C R E E N 
********************************************/
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
  }
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
  },
  input: {
    height: 40, 
    borderColor: 'gray', 
    borderWidth: 1
  }
});

