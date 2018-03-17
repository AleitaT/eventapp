


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
    title: 'View or Edit Venue',
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
    const uri = `https://diyeventapp.appspot.com/venues/${encodeURIComponent(record)}`;
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
          name: responseJson.name,
          address: responseJson.address,
          all_ages: responseJson.all_ages,
          city: responseJson.city,
          state: responseJson.state,
          description: responseJson.description,
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
 	const uri = 'https://diyeventapp.appspot.com/venues/' + record;
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
     	alert("Venue deleted");
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
      <Text>
        {this.state.name}
      </Text>
      <Text>
        {this.state.address}
      </Text>
      <Text>
        {this.state.name}
      </Text>
      <Text>
      {this.state.city}
      </Text>
        <TouchableNativeFeedback
          onPress={() => navigate('EditVenueRecord', {
            self: this.state.self,
            name: this.state.name, 
            address: this.state.address,
            state: this.state.state,
            city: this.state.city, 
            all_ages: this.state.all_ages,
            description: this.state.description
          })}
          background={TouchableNativeFeedback.SelectableBackground()}>
          <View>
            <Text style={styles.buttonText}>Edit Event</Text>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback
          onPress={this._handleDelete}
          background={TouchableNativeFeedback.SelectableBackground()}>
          <View>
            <Text style={styles.buttonText}>Delete Event</Text>
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
