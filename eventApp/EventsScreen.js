


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
* E V E N T S  S C R E E N 
********************************************/
class EventsScreen extends React.Component {
  static navigationOptions = {
    title: 'Find events',
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
  constructor(props){
    super(props);
    this.state ={ isLoading: true}
  }
  componentDidMount() {
    return fetch('https://diyeventapp.appspot.com/events/',{
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
          dataSource: responseJson.events,
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
    return(<View style={{height: 1, width: 1, backgroundColor: 'black'}}/>)
  }
  render() {
    if(this.state.isLoading) {
      return(
        <View style={{flex: 1}}>
          <ActivityIndicator/>
        </View>
      );
    } 
      const { navigate } = this.props.navigation;

    return( 
      <View style={{flex: 1, flexDirection: 'column'}}>
      <View>
       <FlatList vertical={true}
        data={this.state.dataSource}
        ItemSeparatorComponent={this.space}
        renderItem={({item, separators}) => (
          <TouchableHighlight
            onPress={() => navigate('EventRecord', {id: item.id})}
            onShowUnderlay={separators.highlight}
            onHideUnderlay={separators.unhighlight}>
            <View style={{backgroundColor: '#B9E397', padding: 20}}>
              <Text style={
                {fontSize: 23, fontWeight: 'bold', color: '#224C00'}
                }>{item.title}</Text>
              <Text style={{
                textAlign:'right', 
                color: '#224C00', 
                borderColor: '#3E7213'
              }}>{item.venue}, {item.city}, {item.state}</Text>
            </View>
          </TouchableHighlight>
        )}
        keyExtractor={(item, index) => item.self}
      />
      </View>
      <View style={{
        flex: 1, 
        padding: 0,
        justifyContent:'flex-end',
        alignItems: 'center',
      }}>
        <TouchableNativeFeedback
          onPress={() => this.props.navigation.navigate('AddEvent')}
          background={TouchableNativeFeedback.SelectableBackground()}>
          <View style={styles.buttonView}>
            <Text style={styles.buttonText}>Add an Event +</Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    </View>

    );
  }
}


module.exports = EventsScreen;


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