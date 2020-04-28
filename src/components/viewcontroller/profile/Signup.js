import React from 'react';
import {
  SafeAreaView,
  View,
  StatusBar,
  Text,
  Image,
  Alert,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  AsyncStorage,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import styles from '../../../Style';
import WebServicesManager from '../../managers/webServicesManager/WebServicesManager';
import DropdownAlert from 'react-native-dropdownalert';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Container, Header, Content, Button} from 'native-base';
import constants from '../../../constants/constants';
import Utilities from '../../../utilities/Utilities';
import ProfileModel from '../../Models/ProfileModel';
import Loader from '../../../Loader';
import SplashScreen from 'react-native-splash-screen';
import DailyLogsModel from '../../Models/DailyLogsModel';
import moment from 'moment';
import Dashboard from '../Dashboard';
import LeaveTypeModel from '../../Models/LeaveTypeModel';
import LeaveModel from '../../Models/LeaveModel';

export default class SigupScreen extends React.Component {
  WebServicesManager = new WebServicesManager();
  constructor(props) {
    super(props);
    this.state = {
      isModelVisible: false,
      userFirstName:"",
      userLastName:"",
      userEmail: '',
      userPassword: '123',
      userConfirmPassword:"",
      isLoadingIndicator: false,
      token: null,
     
    };
    // userInfo: '',
  }
 errorMsg = ""

  validateFields = ()=>{
    if(this.state.userFirstName.trim()!== null && this.state.userFirstName.trim() !==""){
      if(this.state.userLastName.trim()!== null && this.state.userLastName.trim() !==""){
        if (Utilities.ValidateEmail(this.state.userEmail)) {
          if(this.state.userPassword.trim()!== null && this.state.userPassword.trim() !==""){

            if(this.state.userConfirmPassword.trim()!== null && this.state.userConfirmPassword.trim() !==""){
              if(this.state.userPassword === this.state.userConfirmPassword){
                this.errorMsg = ""
                return true
              }
              else{
                this.errorMsg = "Password does Match"
                return false
              }
            }
            else{
              this.errorMsg = "Please enter Confirm Password"
              return false
            }
          }
          else{
            this.errorMsg = "Please enter Password"
            return false
          }
        }
        else{
          this.errorMsg = "Please enter Valid Email"
          return false
        }
      
      }
      else{
        this.errorMsg = "Please enter Last name"
        return false
      }
    }
    else{
      this.errorMsg = "Please enter First name"
      return false
    }
  
  }

signup = ()=>{
  this.setState({isLoadingIndicator:true })
 let check = this.validateFields()

 if(check){
  var profile = {
    First_name: this.state.userFirstName,
    Last_name: this.state.userLastName,
    Email: this.state.userEmail,
    Password: this.state.userPassword,
    confirm_Password: this.state.userConfirmPassword,
  };
  console.log(JSON.stringify(profile))

  this.WebServicesManager.postApiCallSignUp(
    {dataToInsert: profile, apiEndPoint: 'new_user_reg'},
    (statusCode, response) => {
      if (Utilities.checkAPICallStatus(statusCode)) {
        if (Utilities.checkAPICallStatus(response.responseCode)) {
         this.setState({isLoadingIndicator:false })
          this.dropDownAlertRef.alertWithType(
            'info',
            'sucess',
            response.description,
          );
          setTimeout(() => {
            this.props.navigation.navigate("SigninScreen")
          }, 2000);
        }
        else{
  this.setState({isLoadingIndicator:false })
          this.dropDownAlertRef1.alertWithType(
            'info',
            'Error',
            response.description,
          );
        }
      }
      else{
  this.setState({isLoadingIndicator:false })
        this.dropDownAlertRef1.alertWithType(
          'info',
          'Error',
          'Please check your internet connection',
        );
      }
    })
 }
 else{
  this.setState({isLoadingIndicator:false })
  this.dropDownAlertRef1.alertWithType(
    'info',
    'Error',
    this.errorMsg,
  );
 }


}


  render() {
    return (
      <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={{flex:1}}
    >
      <ImageBackground
        style={{height: '100%'}}
        source={require('../../../ImageAssets/background.png')}
        style={styles.mainImageBackgroundSignin}>
        <ScrollView style={{flex: 1}}>
          <StatusBar
            barStyle="light-content"
            hidden={false}
            backgroundColor={constants.colorPurpleLight595278}
            translucent={false}
          />
          <Loader loading={this.state.isLoadingIndicator}></Loader>
   

          <SafeAreaView>
            
          <View style={{ flexDirection:"row", alignItems:"center", 
          justifyContent:"space-between", paddingLeft:10, paddingRight:30}}>
          <TouchableOpacity onPress={()=>{
              this.props.navigation.goBack()
          }}>
          <Icon
              // style={styles.searchIcon}
              name="chevron-left"
              size={24 }
              color="#000"
            />
          </TouchableOpacity>
          <Text style={{fontSize:20, lineHeight:24, fontWeight:"bold", alignSelf:"center"}}> Register</Text>
          {/* <View></View> */}
          </View>
          </SafeAreaView>
          <DropdownAlert
            infoColor={constants.colorGreen}
            titleStyle={{color: constants.colorWhitefcfcfc, fontWeight: 'bold'}}
            messageStyle={{
              color: constants.colorWhitefcfcfc,
              fontWeight: 'bold',
              fontSize: 12,
            }}
            imageStyle={{
              padding: 8,
              tintColor: constants.colorWhitefcfcfc,
              alignSelf: 'center',
            }}
            ref={ref => (this.dropDownAlertRef = ref)}
          />
          <DropdownAlert
            infoColor={constants.coloBrownFFF5DA}
            titleStyle={{color: constants.colorWhite, fontWeight: 'bold'}}
            messageStyle={{
              color: constants.colorWhite,
              fontWeight: 'bold',
              fontSize: 12,
            }}
            imageStyle={{
              padding: 8,
              tintColor: constants.colorWhite,
              alignSelf: 'center',
            }}
            ref={ref => (this.dropDownAlertRef1 = ref)}
          />
          <View style={styles.signupUpperHeader}>
            <Image
              source={require('../../../ImageAssets/amc.png')}
              style={{height: 80, width: 50}}
            />
          </View>
          <View style={styles.SignupTransparentInputBox}>
            <Icon
              style={styles.searchIcon}
              name="user"
              size={24}
              color="#000"
            />
            <TextInput
              style={styles.inputNotCenterAligned}
              placeholder="First Name"
              onChangeText={searchString => {
                this.setState({userFirstName: searchString});
              }}
              underlineColorAndroid="transparent"
            />
          </View>

          <View style={styles.SignupTransparentInputBox}>
            <Icon
              style={styles.searchIcon}
              name="user"
              size={24}
              color="#000"
            />
            <TextInput
              style={styles.inputNotCenterAligned}
              placeholder="Last Name"
              onChangeText={searchString => {
                this.setState({userLastName: searchString});
              }}
              underlineColorAndroid="transparent"
            />
          </View>

          <View style={styles.SignupTransparentInputBox}>
            <Icon
              style={styles.searchIcon}
              name="envelope"
              size={20}
              color="#000"
            />
            <TextInput
              style={styles.inputNotCenterAligned}
              placeholder="E-mail"
              onChangeText={searchString => {
                this.setState({userEmail: searchString});
              }}
              underlineColorAndroid="transparent"
            />
          </View>
          <View style={styles.SignupTransparentInputBox}>
            <Ionicons
              style={styles.searchIcon}
              name="md-lock"
              size={24}
              color="#000"
            />
            <TextInput
              style={styles.inputNotCenterAligned}
              placeholder="Password"
              secureTextEntry={true}
              onSubmitEditing={() => {
                // this.Login();
              }}
              onChangeText={searchString => {
                this.setState({userPassword: searchString});
              }}
              underlineColorAndroid="transparent"
            />
          </View>

          <View style={styles.SignupTransparentInputBox}>
            <Ionicons
              style={styles.searchIcon}
              name="md-lock"
              size={24}
              color="#000"
            />
            <TextInput
              style={styles.inputNotCenterAligned}
              placeholder=" Confirm Password"
              secureTextEntry={true}
              onSubmitEditing={() => {
                // this.Login();
              }}
              onChangeText={searchString => {
                this.setState({userConfirmPassword: searchString});
              }}
              underlineColorAndroid="transparent"
            />
          </View>
          <Button
            onPress={() =>{ 
              // this.Login()
              Keyboard.dismiss
              this.signup()
            }}
            block
            style={{
              marginHorizontal: 75,
              marginVertical:25,
              borderRadius: 7,
              backgroundColor: constants.colorRed9d0000,
              height: 40,
            }}>
            <Text style={styles.buttonTextSmall}>Sign Up</Text>
          </Button>
        </ScrollView>
      </ImageBackground>
     </KeyboardAvoidingView>
    );
  }
}
