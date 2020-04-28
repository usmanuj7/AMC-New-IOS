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
    this.Login = this.Login.bind(this);
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
  async checkNotif(dailyLogsModelDataSource, prevDate, profileData) {
    console.log(` check notify ${JSON.stringify(JSON.stringify(profileData))}`);
    debugger;

    var staffData = {staffid: profileData._staffid};
    this.WebServicesManager.postApiCallAttendence(
      {dataToInsert: staffData, apiEndPoint: 'get_unread_notifications'},
      (statusCode, response) => {
        if (Utilities.checkAPICallStatus(statusCode)) {
          constants.noificationCount = response.response.notifications.length;
        }
      },
    );
    console.log(
      `dailyLogsModelDataSource is ${dailyLogsModelDataSource.length} ${dailyLogsModelDataSource} `,
    );
    debugger;
    if (
      dailyLogsModelDataSource.length > 0 ||
      dailyLogsModelDataSource == undefined
    ) {
      debugger;

      if (
        dailyLogsModelDataSource.find(
          k => k._is_manual == '2' && k._status == '101',
        ) === undefined
      ) {
        const notificationsArrayData = await AsyncStorage.getItem(
          'notifications',
        );
        var notificationsArray = [];
        if (notificationsArrayData !== null) {
          notificationsArray = JSON.parse(notificationsArrayData);
          if (
            !notificationsArray.includes(
              dailyLogsModelDataSource[0]._clock_date,
            )
          )
            notificationsArray.push(dailyLogsModelDataSource[0]._clock_date);
        } else {
          if (
            !notificationsArray.includes(
              dailyLogsModelDataSource[0]._clock_date,
            )
          )
            notificationsArray.push(dailyLogsModelDataSource[0]._clock_date);
        }
        var staffData = {staffid: profileData._staffid};
        this.WebServicesManager.postApiCallAttendence(
          {dataToInsert: staffData, apiEndPoint: 'get_staff_weekends'},
          (statusCode, response) => {
            if (Utilities.checkAPICallStatus(statusCode)) {
              if (this.state.dailyLogsModelDataSource.length > 0) {
                var weekDayName = moment(
                  this.state.dailyLogsModelDataSource[0]._clock_date,
                ).format('dddd');
                var days = Utilities.getWeekDays(response.weekends_defined);
                if (!days.includes(weekDayName)) {
                }
              } else {
              }
            }
          },
        );

        AsyncStorage.setItem(
          'notifications',
          JSON.stringify(notificationsArray),
        );
        AsyncStorage.setItem('appLevel', 'DashboardScreen').then(value => {
          this.setState({isLoadingIndicator: false});
          debugger;
          if (
            profileData._attendaceModel !== undefined &&
            profileData._attendaceModel.length > 0
          ) {
            if (profileData._attendaceModel[0]._title === 'Start Break') {
              debugger;
              AsyncStorage.setItem('appLevel', 'EndDutyScreen').then(value => {
                this.setState({isLoadingIndicator: false});
                constants.attendance_id =
                  profileData._attendaceModel[0]._attendance_id;
                this.props.navigation.navigate('EndDutyScreen');
              });
            } else if (profileData._attendaceModel[0]._title === 'Start Duty') {
              debugger;
              AsyncStorage.setItem('appLevel', 'BreakScreen').then(value => {
                this.setState({isLoadingIndicator: false});
                constants.attendance_id =
                  profileData._attendaceModel[0]._attendance_id;
                this.props.navigation.navigate('BreakScreen');
              });
            } else if (profileData._attendaceModel[0]._title === 'End Break') {
              AsyncStorage.setItem('appLevel', 'BreakScreen').then(value => {
                this.setState({isLoadingIndicator: false});
                constants.attendance_id =
                  profileData._attendaceModel[0]._attendance_id;
                this.props.navigation.navigate('BreakScreen');
              });
            } else if (profileData._attendaceModel[0]._title === 'End Duty') {
             
              debugger;
              Utilities.saveToStorage('lastEntry', profileData._attendaceModel[0]);
              AsyncStorage.setItem('appLevel', 'AlreadyLoggedScreen').then(
                value => {
                  this.setState({isLoadingIndicator: false});
                  constants.attendance_id =
                    profileData._attendaceModel[0]._attendance_id;
                  this.props.navigation.navigate('AlreadyLoggedScreen');
                },
              );
            }
          } else {
            AsyncStorage.setItem('appLevel', 'DashboardScreen').then(value => {
              this.setState({isLoadingIndicator: false});
              this.props.navigation.navigate('DashboardScreen');
            });
          }
        });
      } else {

        debugger
        if (
          profileData._attendaceModel !== undefined &&
          profileData._attendaceModel.length > 0
        ) {
          if (profileData._attendaceModel[0]._title === 'Start Break') {
            AsyncStorage.setItem('appLevel', 'EndDutyScreen').then(value => {
              this.setState({isLoadingIndicator: false});
              constants.attendance_id =
                profileData._attendaceModel[0]._attendance_id;
              this.props.navigation.navigate('EndDutyScreen');
            });
          } else if (profileData._attendaceModel[0]._title === 'Start Duty') {
            AsyncStorage.setItem('appLevel', 'BreakScreen').then(value => {
              this.setState({isLoadingIndicator: false});
              constants.attendance_id =
                profileData._attendaceModel[0]._attendance_id;
              this.props.navigation.navigate('BreakScreen');
            });
          } else if (profileData._attendaceModel[0]._title === 'End Break') {
            AsyncStorage.setItem('appLevel', 'BreakScreen').then(value => {
              this.setState({isLoadingIndicator: false});
              constants.attendance_id =
                profileData._attendaceModel[0]._attendance_id;
              this.props.navigation.navigate('BreakScreen');
            });
          } else if (profileData._attendaceModel[0]._title === 'End Duty') {
            console.log(
              `mo data is ${JSON.stringify(profileData._attendaceModel[0])}`,
            );
            AsyncStorage.setItem(
              'appLevelCheckIs',
              profileData._attendaceModel[0]._title,
            );
            debugger;
            AsyncStorage.setItem('appLevel', 'AlreadyLoggedScreen').then(
              value => {
                this.setState({isLoadingIndicator: false});
                constants.attendance_id =
                  profileData._attendaceModel[0]._attendance_id;
                this.props.navigation.navigate('AlreadyLoggedScreen');
              },
            );
          }
        } else {
          AsyncStorage.setItem('appLevel', 'DashboardScreen').then(value => {
            this.setState({isLoadingIndicator: false});
            this.props.navigation.navigate('DashboardScreen');
          });
        }
      }
    } else {
      const notificationsArrayData = await AsyncStorage.getItem(
        'notifications',
      );
      var notificationsArray = [];
      if (
        notificationsArrayData !== null &&
        notificationsArrayData !== undefined
      ) {
        notificationsArray = JSON.parse(notificationsArrayData);
        if (!notificationsArray.includes(prevDate)) {
          notificationsArray.push(prevDate);
        }
      } else {
        notificationsArray.push(prevDate);
      }
      debugger;
      var staffData = {staffid: profileData._staffid};
      this.WebServicesManager.postApiCallAttendence(
        {dataToInsert: staffData, apiEndPoint: 'get_staff_weekends'},
        (statusCode, response) => {
          if (Utilities.checkAPICallStatus(statusCode)) {
            if (this.state.dailyLogsModelDataSource.length > 0) {
              var weekDayName = moment(
                this.state.dailyLogsModelDataSource[0]._clock_date,
              ).format('dddd');
              var days = Utilities.getWeekDays(response.weekends_defined);
              if (!days.includes(weekDayName)) {
              }
            } else {
            }
          }
        },
      );
      AsyncStorage.setItem('notifications', JSON.stringify(notificationsArray));

      if (
        profileData._attendaceModel !== undefined &&
        profileData._attendaceModel.length > 0
      ) {
        if (profileData._attendaceModel[0]._title === 'Start Break') {
          AsyncStorage.setItem('appLevel', 'EndDutyScreen').then(value => {
            this.setState({isLoadingIndicator: false});
            constants.attendance_id =
              profileData._attendaceModel[0]._attendance_id;
            this.props.navigation.navigate('EndDutyScreen');
          });
        } else if (profileData._attendaceModel[0]._title === 'Start Duty') {
          AsyncStorage.setItem('appLevel', 'BreakScreen').then(value => {
            this.setState({isLoadingIndicator: false});
            constants.attendance_id =
              profileData._attendaceModel[0]._attendance_id;
            this.props.navigation.navigate('BreakScreen');
          });
        } else if (profileData._attendaceModel[0]._title === 'End Break') {
          AsyncStorage.setItem('appLevel', 'BreakScreen').then(value => {
            this.setState({isLoadingIndicator: false});
            constants.attendance_id =
              profileData._attendaceModel[0]._attendance_id;
            this.props.navigation.navigate('BreakScreen');
          });
        } else if (profileData._attendaceModel[0]._title === 'End Duty') {
          console.log(
            `mo data is ${JSON.stringify(profileData._attendaceModel[0])}`,
          );
          AsyncStorage.setItem(
            'appLevelCheckIs',
            profileData._attendaceModel[0]._title,
          );
          debugger;
          AsyncStorage.setItem('appLevel', 'AlreadyLoggedScreen').then(
            value => {
              this.setState({isLoadingIndicator: false});
              constants.attendance_id =
                profileData._attendaceModel[0]._attendance_id;
              this.props.navigation.navigate('AlreadyLoggedScreen');
            },
          );
        }
      } else {
        AsyncStorage.setItem('appLevel', 'DashboardScreen').then(value => {
          this.setState({isLoadingIndicator: false});
          this.props.navigation.navigate('DashboardScreen');
        });
      }
    }
  }

  async componentWillMount() {
    console.log('sign in components will mount');

    SplashScreen.hide();
    var date = new Date();
    this.setState({isLoadingIndicator: true});
    var prevDate = date.setDate(date.getDate() - 1);
    this.setState({isLoadingIndicator: false});
    const profileData = await AsyncStorage.getItem('profileData');
    if (profileData !== null) {
      this.setState({isLoadingIndicator: false});
      var profile = JSON.parse(profileData);
      constants.profileData = profile;
    } else this.setState({isLoadingIndicator: false});
  }
  async Login() {
    // const _token = await AsyncStorage.getItem('token')
    // if(_token == null){
    //   const x = Date.now();
    //   this.state.token = x;
    //   AsyncStorage.setItem("token",`${x}`)

    // }
    // else{
    //   this.state.token = _token
    // }

    const x = Date.now();
    this.state.token = x;
    AsyncStorage.setItem('token', `${x}`);

    // Utilities.saveToStorage("todayTime", "");
    if (Utilities.ValidateEmail(this.state.userEmail)) {
      this.setState({isLoadingIndicator: false});
      var profile = {
        Email: this.state.userEmail,
        Password: this.state.userPassword,
        Token: `${x}`,
      };

      console.log(`profiel to be inserted ${JSON.stringify(profile)}`);

      this.WebServicesManager.postApiCall(
        {dataToInsert: profile, apiEndPoint: 'login'},
        (statusCode, response) => {
          if (Utilities.checkAPICallStatus(statusCode)) {
            if (
              response.responseCode !== 204 &&
              response.responseCode !== 404
            ) {
              debugger;
              var profileData = ProfileModel.parseProfileModelFromJSON(
                response.user,
              );
              AsyncStorage.setItem(
                'profileData',
                JSON.stringify(profileData),
              ).then(value => {
                this.setState({isLoadingIndicator: false});
                this.dropDownAlertRef.alertWithType(
                  'success',
                  'Success',
                  'You have successfully logged in',
                );
                AsyncStorage.setItem('loginDone', `${x}`);
                var date = new Date();
                this.WebServicesManager.postGetData(
                  {dataToInsert: '', apiEndPoint: 'get_all_leave_types'},
                  (statusCode, response) => {
                    if (Utilities.checkAPICallStatus(statusCode)) {
                      var leaveTypeData = LeaveTypeModel.parseLeaveTypeModelFromJSON(
                        response.leave_types,
                      );
                      Utilities.saveToStorage(
                        'leaveTypeData',
                        JSON.stringify(leaveTypeData),
                      );

                      var Leave = {staffid: profileData._staffid};
                      this.WebServicesManager.postApiLeaveHistory(
                        {dataToInsert: Leave, apiEndPoint: 'get_leave_data'},
                        (statusCode, response) => {
                          if (Utilities.checkAPICallStatus(statusCode)) {
                            var leaveModel = LeaveModel.parseLeaveModelFromJSON(
                              response.timesheets,
                            );
                            Utilities.saveToStorage(
                              'leaveHistoryData',
                              JSON.stringify(leaveModel),
                            );
                          } else if (statusCode === 400) {
                            this.dropDownAlertRef.alertWithType(
                              'info',
                              'Alert',
                              'Please check your internet connection',
                            );
                          }
                        },
                      );
                    } else if (statusCode === 400) {
                      this.dropDownAlertRef.alertWithType(
                        'info',
                        'Alert',
                        'Please check your internet connection',
                      );
                    }
                  },
                );
                var prevDate = date.setDate(date.getDate() - 1);
                var Leave = {
                  staffid: profileData._staffid,
                  clock_date: moment(prevDate).format('YYYY-MM-DD'),
                };
                this.WebServicesManager.postApiDailyAttendence(
                  {
                    dataToInsert: Leave,
                    apiEndPoint: 'get_daily_attendance_log',
                  },
                  (statusCode, response) => {
                    debugger;
                    if (Utilities.checkAPICallStatus(statusCode)) {
                      var dailyLogsModelDataSource = DailyLogsModel.parseDailyLogsModelFromJSON(
                        response.attendance_data,
                      );
                      console.log(
                        `attandance log ${JSON.stringify(
                          dailyLogsModelDataSource,
                        )} `,
                      );
                      console.log(`profile ${JSON.stringify(profileData)} `);
                      debugger;
                      this.checkNotif(
                        dailyLogsModelDataSource,
                        moment(prevDate).format('YYYY-MM-DD'),
                        profileData,
                      );
                      this.setState({
                        dailyLogsModelDataSource: dailyLogsModelDataSource,
                      });
                    } else if (statusCode === 400) {
                      this.dropDownAlertRef1.alertWithType(
                        'info',
                        'Alert',
                        'Please check your internet connection',
                      );
                    }
                  },
                );
              });
            } else if (response.responseCode === 404) {
              this.setState({isLoadingIndicator: false});
              this.dropDownAlertRef1.alertWithType(
                'info',
                'Error',
                'Unable to conenct to internet',
              );
            } else {
              this.setState({isLoadingIndicator: false});
              this.dropDownAlertRef1.alertWithType(
                'info',
                'Error',
                response.description,
              );
            }
          } else if (statusCode === 400) {
            this.dropDownAlertRef1.alertWithType(
              'info',
              'Alert',
              'Please check your internet connection',
            );
          }
        },
      );
    } else
      this.dropDownAlertRef1.alertWithType(
        'info',
        'Error',
        'Please enter valid Email',
      );
  }
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
