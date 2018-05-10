


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



{/* V I E W  A  V E N U E  R E C O R D  S C R E E N */}
class VenueRecordScreen extends React.PureComponent {
 static navigationOptions = {
    title: 'Your Event Details',
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
                  AccessToken.getCurrentAccessToken()
                  .then((data) => {
                    //alert(data.accessToken.toString())
                    AsyncStorage.setItem('userToken', data.accessToken.toString());
                    this.props.navigation.navigate('App');
                  })
              }
            }
          }
          onLogoutFinished={() => alert("User logged out")}
        />    
  };
   state = {
      dataSource: ''
   }
  constructor(props){
    super(props);
    this.state ={ isLoading: true}
  }

  componentDidMount() {
    const record = this.props.navigation.state.params.id;
    const uri = `https://diyeventapp.appspot.com/events/${encodeURIComponent(record)}`;
    fetch(uri,{
      method: 'GET',
      headers: {
        Authorization: "Bearer AIzaSyAX2ADuOPwwoFZRSj5rW4TfWF7tIFcosIc",
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("response json", responseJson);
        this.setState({
          isLoading: false, 
          title: responseJson.title,
          venue: responseJson.venue,
          date: responseJson.date,
          genre: responseJson.genre,
          city: responseJson.city,
          state: responseJson.state,
          self: responseJson.self
        }, function(){
          //console.log(responseJson);
        });
      }).catch((error) => {
        console.error(error);
    });
  }
 _handleDelete = () => {
 	const record = this.props.navigation.state.params.id;
 	const uri = 'https://diyeventapp.appspot.com/events/' + record;
    return fetch(uri, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: "Bearer AIzaSyAX2ADuOPwwoFZRSj5rW4TfWF7tIFcosIc",
        'Content-Type': 'application/json',
      }
    })
    .then((response) => response.text())
    .then((responseText) => {
     	  alert(responseText);
        this.props.navigation.navigate('Home');
    }, function(){

     })
    .catch((error) => {
      console.error(error);
    });  
}
  render() {
      const { navigate } = this.props.navigation;
    return( 
      <View style={{flex: 1, flexDirection: 'column'}}>  
      <Text style={{fontSize :40}}>
        {this.state.title}
      </Text>
      <Text style={{fontSize :20}}>
        {this.state.date}
      </Text>
      <Text style={{fontSize :20}}>
        {this.state.genre}
      </Text>
      <Text style={{fontSize :20}}>
      {this.state.city}
      </Text>      
      <Text style={{fontSize :20}}>
      {this.state.state}
      </Text>      
      <Text style={{fontSize :20}}>
      {this.state.venue}
      </Text>
        <TouchableNativeFeedback
          onPress={() => navigate('EditEventRecord', {
            self: this.state.self,
            title: this.state.title, 
            city: this.state.city,
            state: this.state.state,
            date: this.state.date, 
            genre: this.state.genre,
            venue: this.state.venye
          })}
          background={TouchableNativeFeedback.SelectableBackground()}>
          <View style={styles.buttonView}>
            <Text style={styles.buttonText}>Edit Event</Text>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback
          onPress={this._handleDelete}
          background={TouchableNativeFeedback.SelectableBackground()}>
          <View style={styles.buttonView}>
            <Text style={styles.buttonText}>Delete Event</Text>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback
          onPress={() => navigate('AssignVenueToEvent', { id: this.state.self})}
          background={TouchableNativeFeedback.SelectableBackground()}>
          <View style={styles.buttonView}>
            <Text style={styles.buttonText}>Assign Venue</Text>
          </View>
        </TouchableNativeFeedback>
    </View>

    );
  }
}



module.exports = VenueRecordScreen;


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
