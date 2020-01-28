import React from 'react';
import {
  ListView,
  View,
  StatusBar,
  Text,
  Image, Alert,
  ImageBackground,
  TextInput, TouchableOpacity, ScrollView, AsyncStorage, BackHandler
} from 'react-native';
import styles from "../../../Style";
import WebServicesManager from '../../managers/webServicesManager/WebServicesManager'
import DropdownAlert from 'react-native-dropdownalert';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Container, Header, Content, Button } from 'native-base';
import constants from '../../../constants/constants';
import Utilities from '../../../utilities/Utilities';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default class ForgotPassword extends React.Component {
  WebServicesManager = new WebServicesManager;
  constructor(props) {
    super(props);

    this.state = {
      userEmail: "",
    }
  }
  async  Reset() {
    if (Utilities.ValidateEmail(this.state.userEmail)) {

      var profile = { Email: this.state.userEmail };
      this.WebServicesManager.postApiCallForgotPass({ dataToInsert: profile, apiEndPoint: "forgot_password" },
        (statusCode, response) => {

          if (Utilities.checkAPICallStatus(statusCode)) {
            if (response.responseCode !== 403) {
              this.dropDownAlertRef.alertWithType('info', 'Success', "Check your email for further instructions resetting your password");
              setTimeout(() => { this.props.navigation.goBack() }, 3000);

            }
            this.setState({ isLoadingIndicator: false })
            this.dropDownAlertRef.alertWithType('info', 'Error', response.description);
          }
        });
    }
    else
      this.dropDownAlertRef.alertWithType('info', 'Error', "Please enter valid Email");
  }

  pressNotification() {
    constants.noificationCount = 0;
    this.props.navigation.navigate("NotificationScreen");
  }
  render() {

    return (
      <Container style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" hidden={false} backgroundColor={constants.colorPurpleLight595278} translucent={false} />
        <DropdownAlert infoColor={constants.coloBrownFFF5DA} titleStyle={{ color: constants.colorGrey838383, fontWeight: 'bold', }}
          messageStyle={{ color: constants.colorGrey838383, fontWeight: 'bold', fontSize: 12 }} imageStyle={{
            padding: 8,
            tintColor: constants.colorGrey838383,
            alignSelf: 'center',
          }}
          ref={ref => this.dropDownAlertRef = ref} />
        <ImageBackground source={require('../../../ImageAssets/background.png')}
          style={[styles.mainImageBackground]}>
          <KeyboardAwareScrollView
            resetScrollToCoords={{ x: 0, y: 0 }}
            contentContainerStyle={styles.container}
            scrollEnabled={true}>
            <ScrollView >
              <View style={styles.upperHeader}>
                {/* <Image source={require('../../../ImageAssets/logoSmall.png')} >
          </Image> */}

                <Image source={require('../../../ImageAssets/amc.png')} style={{ height: 80, width: 50 }} />
                <Text style={{ marginTop: 20, fontSize: 16, fontWeight: '400' }}>
                  To get password enter email here
      </Text>
              </View>
              <View style={[styles.transparentInputBox, { marginTop: 30 }]}>
                <Icon style={styles.searchIcon} name="user" size={24} color="#000" />
                <TextInput
                  style={styles.inputNotCenterAligned}
                  placeholder="E-mail"
                  onChangeText={(searchString) => { this.setState({ userEmail: searchString }) }}
                  underlineColorAndroid="transparent"
                />
              </View>
              <Button onPress={() => this.Reset()} block style={{ margin: 18, borderRadius: 7, backgroundColor: constants.colorRed9d0000, height: 40 }}>
                <Text style={styles.buttonTextSmall}>
                  Reset
  </Text>
              </Button>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Text style={styles.underline}>Back to login  </Text>

              </TouchableOpacity>
            </ScrollView>
          </KeyboardAwareScrollView>
        </ImageBackground>
      </Container>
    );
  }
}
