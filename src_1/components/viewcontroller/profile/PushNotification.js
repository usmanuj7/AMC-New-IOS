import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import OneSignal from 'react-native-onesignal';



export default class PushNotification extends Component {
  constructor(props) {
    super(props);
    this.state={
      contents:'',
    }

    OneSignal.init('ec1b645b-69ea-4742-b04c-5e77bcdb4360');
    OneSignal.addEventListener("received", this.onReceived);
    OneSignal.addEventListener("opened", this.onOpened);
    OneSignal.addEventListener("ids", this.onIds);
    OneSignal.configure();

  }

  onReceived = notification => {
    console.log("Notification received: ", notification);
  };

  onOpened = openResult => {
    console.log("Message: ", openResult.notification.payload.body);
    console.log("Data: ", openResult.notification.payload.additionalData);
    console.log("isActive: ", openResult.notification.isAppInFocus);
    console.log("openResult: ", openResult);
  };

  onIds = device => {
    console.log("Device info: ", device);
    this.setState({ device });
  };

  sendNotification(data) {
   
    let headers = {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: "Basic 'ZjM1ZjM4YWItNDA0Mi00Y2UyLWE3MDEtNjQ2OWNjNjEzNDA4'"
    };

    let endpoint = "https://onesignal.com/api/v1/notifications";

    let params = {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        app_id: "ec1b645b-69ea-4742-b04c-5e77bcdb4360",
        included_segments: ["All"],
        contents: { en: data }
      })
    };
    // fetch(endpoint, params).then(res => console.log(res));
    fetch(endpoint, params).then((response) => response.json())
    .then((responseJson) => {
        let statusCode = 200;
        callback(statusCode, responseJson);

    })
          .catch((error) => {
          
              

        });
  };

  //   componentDidMount() {  
  //     this.sendNotification('Greeting from Chat App');
  //  }
  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={()=>this.sendNotification('Greeting from Chat App')} >
          <Text style={styles.welcome}>Notification</Text>

        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
