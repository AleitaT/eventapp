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
          onLogoutFinished={() => alert("User logged out")}
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
          justifyContent: 'space-evenly',
        }}>
          <Button style={styles.wideButton}
            onPress={() => this.props.navigation.navigate('Venues')}
            title="Venues"
            color="#2E4172"
            accessibilityLabel="Navigate to Venue Screen"/>
          <Button style={styles.wideButton}          
            onPress={() => this.props.navigation.navigate('Events')}
            title="Events"
            color="#2E4172"
            accessibilityLabel="Navigate to Event Screen"/>
          <Button style={styles.wideButton}
            onPress={() => this.props.navigation.navigate('Profile')}
            title="Profile"
            color="#2E4172"
            accessibilityLabel="Navigate to your profile"/>
          </View>
          <View>
        </View>
      </View>
    );
  }
}

/*******************************************
* VENUES SCREEN 
********************************************/
class VenuesScreen extends React.PureComponent {
  static navigationOptions = {
    title: 'Find a venue',
  };
  constructor(props){
    super(props);
    this.state ={ isLoading: true}
  }
  componentDidMount() {
    return fetch('https://diyeventapp.appspot.com/venues',{
      method: 'GET',
      headers: {
        Authorization: "Bearer AIzaSyAX2ADuOPwwoFZRSj5rW4TfWF7tIFcosIc",
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('parsed json', responseJson);
        this.setState({
          isLoading: false, 
          dataSource: responseJson.venues,
        }, function(){
          //console.log(response);
        });
      }).catch((error) => {
        console.error(error);
    });
  }
  _onPress = () => {
    this.props.onPressItem(this.props.id);
  };
  space(){
    return(<View style={{height: 50, width: 2, backgroundColor: 'black'}}/>)
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
      <View style={{flex: 10, paddingTop:20, flexDirection: 'column'}}>
      <View style={{flex:9}}>
       <FlatList vertical={true}
        data={this.state.dataSource}
        ItemSeparatorComponent={this.space}
        renderItem={({item, separators}) => (
          <TouchableHighlight
            onPress={() => this._onPress(item)}
            onShowUnderlay={separators.highlight}
            onHideUnderlay={separators.unhighlight}>
            <View style={{backgroundColor: '#B9E397', padding: 10, margin: 10}}>
              <Text style={
                {fontSize: 23, fontWeight: 'bold', color: '#224C00'}
                }>{item.name}</Text>
              <Text style={
                {textAlign:'right', color: '#224C00', borderColor: '#3E7213'}
                }>{item.city}, {item.state}</Text>
            </View>
          </TouchableHighlight>
        )}
      />
      </View>
      <View style={{flex:1, backgroundColor: '#2E4172'}}>
        <Button style={{}}
          onPress={() => this.props.navigation.navigate('AddVenueScreen')}
          color="#2E4172"
          title="Add a Venue"
          accessibilityLabel="Navigate to your profile"/> 
      </View>
    </View>

    );
  }
}



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
          paddingTop: 100,
          flexDirection: 'column',
          justifyContent: 'space-around',
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
          <View style={
            {flex:1, width: 400, height: 200}}>
            <Button style={{width:400}}
            onPress={this._handleSubmit}
            color="#2E4172"
            title="Submit"
            accessibilityLabel="Add a venue entry"/> 
          </View>
        </View>
    );
  }
}

/*******************************************
* E V E N T S  S C R E E N 
********************************************/
class EventsScreen extends React.Component {
  static navigationOptions = {
    title: 'Find an event',
  };
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

