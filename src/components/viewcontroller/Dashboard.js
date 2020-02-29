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
import { Container, Body, Title, Center, Content, Footer, FooterTab, Button, Right, Left } from 'native-base';
import DateTimePicker from "react-native-modal-datetime-picker";
import styles from "../../Style";
import WebServicesManager from '../managers/webServicesManager/WebServicesManager';;
import constants from '../../constants/constants';
import HeaderView from './Header/Header'
import moment from 'moment';
import Utilities from '../../utilities/Utilities';
import ProfileModel from '../Models/ProfileModel';
import Loader from '../../Loader';
import DailyLogsModel from '../Models/DailyLogsModel';
import NetInfo from "@react-native-community/netinfo";
import DropdownAlert from 'react-native-dropdownalert';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';



export default class Dashboard extends React.Component {
  WebServicesManager = new WebServicesManager;
  constructor(props) {
    super(props);


    this.state = {
      isDateTimePickerVisible: false,
      checkedDate: '',
      profileDataSurce: '',
      isLoadingIndicator: false,
      missedClockOut: '',
      notificationView: <View></View>,
      noificationCount: 0,
      connectionCount:0
    }
  }
  //   this.state = {
  //     isDateTimePickerVisible:false,
  //     checkedDate:'',
  //     profileDataSurce:'',
  //     isLoadingIndicator:false,
  //     missedClockOut:'',
  //     notificationView:<View></View>

  //   }
  //   // userInfo: '',
  // }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    this.focusListener.remove();
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this._handleConnectivityChange

    );
  }
  _handleConnectivityChange = (isConnected) => {

    if (isConnected == true) {
        (isConnected,this,this.state.connectionCount);
       this.setState({connectionCount:1});
       //Utilities.sendLocalStorageToServer();
    }
    else {
      this.setState({ connection_Status: "Offline" });
      this.setState({connectionCount:0});

    }
  };

  toggleLoader(status)
  {
    // this.setState({isLoadingIndicator:status})

  }

  componentDidMount() {
    Utilities.connectionCount=0;
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    const { navigation } = this.props;
    this.focusListener =  navigation.addListener ('didFocus', () => {
      this.setState({ noificationCount: constants.noificationCount });
    });

    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this._handleConnectivityChange

    );

    NetInfo.isConnected.fetch().done((isConnected) => {

      if (isConnected == true) {
        this.setState({ connection_Status: "Online" })
        Utilities.sendLocalStorageToServer();
      }
      else {
        this.setState({ connection_Status: "Offline" })
      }

    });
  }
  handleBackButton = () => {
    Alert.alert(
      'Exit App',
      'Exiting the application?', [{
        text: 'Cancel',
        onPress: console.log('Cancel Pressed'),
        style: 'cancel'
      }, {
        text: 'OK',
        onPress: BackHandler.exitApp()
      },], {
      cancelable: false
    }
    )
    return true;
  }
  async checkNotif(dailyLogsModelDataSource, prevDate) {
    if (dailyLogsModelDataSource.length > 0) {
      if (dailyLogsModelDataSource.find(k => k._is_manual == "2" && k._status == "101") === undefined) {
        this.setState({
          notificationView: <TouchableOpacity onPress={() => this.pressNotificationFromNotification(prevDate)} style={{ backgroundColor: 'red', height: 30, marginBottom: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }} >
            <Text style={{ color: 'white' }}>You have missed to clockout on </Text>
            <Text style={{ color: 'white' }}>{prevDate} </Text>
          </TouchableOpacity>,
          missedClockOut: dailyLogsModelDataSource[0]._clock_date
        })
      }
      else {
        this.setState({
          notificationView: <View ></View>,
        })
      }
    }
    else {
      this.setState({
        notificationView: <TouchableOpacity onPress={() => this.pressNotificationFromNotification(prevDate)} style={{ backgroundColor: 'red', height: 30, marginBottom: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }} >
          <Text style={{ color: 'white' }}>You have missed to clockin on </Text>
          <Text style={{ color: 'white' }}>{prevDate} </Text>
        </TouchableOpacity>
      })
    }
  }
  async componentWillMount() {
    console.log("dashboard components will mount")

    this.setState({ isLoadingIndicator: true, noificationCount: constants.noificationCount });
    var date = new Date();
    var prevDate = date.setDate(date.getDate() - 1);
    var appLevel = await AsyncStorage.getItem('appLevel');

    this.setState({ checkedDate: new Date() })
    const profile = await AsyncStorage.getItem('profileData');

    const attendance_id = await AsyncStorage.getItem('attendance_id');
    if (profile !== null) {
      var profileData = JSON.parse(profile);
      this.setState({ profileDataSurce: profileData });
      var Leave = { staffid: this.state.profileDataSurce._staffid, clock_date: moment(prevDate).format('YYYY-MM-DD') };
      this.WebServicesManager.postApiDailyAttendence({ dataToInsert: Leave, apiEndPoint: "get_daily_attendance_log" },
        (statusCode, response) => {
          if (Utilities.checkAPICallStatus(statusCode)) {
            var dailyLogsModelDataSource = DailyLogsModel.parseDailyLogsModelFromJSON(response.attendance_data);
            this.checkNotif(dailyLogsModelDataSource, moment(prevDate).format('YYYY-MM-DD'));
            this.setState({ dailyLogsModelDataSource: dailyLogsModelDataSource });
          }
          else if (statusCode === 400) {
            this.setState({ isLoadingIndicator: false });
            // this.dropDownAlertRef.alertWithType('info', 'Alert', "Please check your internet connection");

          }
        });

      var Leave = { staffid: this.state.profileDataSurce._staffid, clock_date: moment(new Date()).format('YYYY-MM-DD') };
      this.WebServicesManager.postApiDailyAttendence({ dataToInsert: Leave, apiEndPoint: "get_daily_attendance_log" },
        (statusCode, response) => {
          if (Utilities.checkAPICallStatus(statusCode)) {

            if (response.attendance_data.length > 0) {
              if (response.attendance_data.find(k => k.is_manual == 2 && k.status == 101) !== undefined) {
                this.setState({ isLoadingIndicator: false });
                this.props.navigation.navigate("AlreadyLoggedScreen", { attendanceData: response.attendance_data });
              }
              console.log(`app level ${appLevel}`)
              debugger
              if (appLevel !== null) {
                this.setState({ isLoadingIndicator: false })
                if (appLevel === "BreakScreen")
                  this.props.navigation.navigate("BreakScreen");
                if (appLevel === "DashboardScreen")
                  {
                    this.props.navigation.navigate("DashboardScreen");
                    this.getOfflineStorageData();
                  }
                  
                else if (appLevel === "EndDutyScreen")
                  this.props.navigation.navigate("EndDutyScreen");
              }
              else {
                this.setState({ isLoadingIndicator: false })

              }
            }
            else {
              debugger
              this.getOfflineStorageData();
              this.setState({ isLoadingIndicator: false })

            }
          }
          else if (statusCode === 400) {
            this.setState({ isLoadingIndicator: false });
            // this.dropDownAlertRef.alertWithType('info', 'Alert', "Please check your internet connection");
          }
        })



    }
  }

  
  async getOfflineStorageData() {
  
    var today = moment(new Date());
    // var offlineApplevel = await AsyncStorage.getItem("attendanceData");

    var lastEntry = await AsyncStorage.getItem('lastEntry');
    var todayTimeDataArray = await AsyncStorage.getItem('todayTime');
    var todayAttemArray = JSON.parse(todayTimeDataArray);

    console.log('offline storage called');
    console.log(`last entry is  ${lastEntry}`);
debugger
    if (lastEntry !== null) {
      console.log('in if loop');
      var lastEntryData = JSON.parse(lastEntry);
      console.log(`today ${JSON.stringify(today)}`);
      console.log(`last entery is ${JSON.stringify(lastEntryData)}`);
      // debugger
      // clock_date
      if( (today.diff(lastEntryData.date, 'days') !== 0 || (today.diff(lastEntryData.clock_date, 'days') !== 0)) ){
        var lastEntry = await AsyncStorage.setItem('lastEntry', '');
        this.props.navigation.navigate('DashboardScreen');
      } else {
        if (lastEntryData.title === 'StartDuty') {
          let check = false;
          if(todayAttemArray !== null){
            for (let index = 0; index < todayAttemArray.length; index++) {
              if (todayAttemArray[index].title === 'EndDuty') {
                check = true;
              }
            }
          }

          if (check) {
            this.props.navigation.navigate('AlreadyLoggedScreen');
          } else {
            this.props.navigation.navigate('BreakScreen');
          }
        } else if (lastEntryData.title === 'StartBreak') {
          this.props.navigation.navigate('EndDutyScreen');
        } else if (lastEntryData.title === 'EndDuty') {
          this.props.navigation.navigate('AlreadyLoggedScreen');
        } else if (lastEntryData.title === 'EndBreak') {
          this.props.navigation.navigate('BreakScreen');
        } else {
          this.props.navigation.navigate('DashboardScreen');
        }
      }
    } else {

      var check = await AsyncStorage.getItem('appLevelCheckIs');
      // debugger
         if(check == "End Duty"){
          //  debugger
           this.props.navigation.navigate("AlreadyLoggedScreen");
         }else{
          //  debugger
           this.props.navigation.navigate("DashboardScreen");
         }
      // this.props.navigation.navigate('DashboardScreen');
    }
  }


  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked = date => {
    this.setState({ checkedDate: date });
    this.hideDateTimePicker();
  };

  async startDuty() {
    
    const todayTimePrevArray = await AsyncStorage.getItem('todayTime');
    var date = '';
    var today = moment(new Date());
  
    if (this.state.checkedDate !== "")
      date = moment(this.state.checkedDate).format('YYYY-MM-DD');

    if (Utilities.isValidString(date)) {
      this.setState({ isLoadingIndicator: true });
      var profile = {
        date: date, staffid: this.state.profileDataSurce._staffid, clock_in: new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds()
      };
       
      this.WebServicesManager.postApiCallStartDuty({ dataToInsert: profile, apiEndPoint: "add_clock_in" },
        (statusCode, response) => {
          if (Utilities.checkAPICallStatus(response.responseCode)) {
             
            var attendanceData = {
              title: "StartDuty", date: date, staffid: this.state.profileDataSurce._staffid, clock_in: new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds()
            };
            var dataToPush = [];
            dataToPush.push(attendanceData);
            if (todayTimePrevArray !== null && todayTimePrevArray!=="") {
              var todayTimePrevArrayPArsed=JSON.parse(todayTimePrevArray)
              if(todayTimePrevArrayPArsed!=="")
              { 
                if (today.diff(moment(todayTimePrevArrayPArsed[0].date), 'days') !== 0) {

                  Utilities.saveToStorage("todayTime", "");
                SearchesToSave = JSON.parse(todayTimePrevArray)
                SearchesToSave.push(attendanceData);
                Utilities.saveToStorage("todayTime", SearchesToSave);
                }
                   else {
                    SearchesToSave = JSON.parse(todayTimePrevArray)
                    SearchesToSave.push(attendanceData);
                    Utilities.saveToStorage("todayTime", SearchesToSave);;
                  }
              }
          
                else {
                  Utilities.saveToStorage("todayTime", dataToPush);
                }
              }
              else {
                Utilities.saveToStorage("todayTime", dataToPush);
              }
            var attendanceData = {
              title: "StartDuty", date: date, staffid: this.state.profileDataSurce._staffid, clock_in: new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds()
            };
            Utilities.saveToStorage("lastEntry", attendanceData);
            Utilities.saveToStorage("startDutyTimeToday", attendanceData).then((value) => {
            AsyncStorage.setItem('appLevel', "BreakScreen").then((value) => {
              this.setState({ isLoadingIndicator: false });
              this.props.navigation.navigate("SuccessScreen");
            })
          })
            if (response.response.attendance_id !== undefined) {
              AsyncStorage.setItem('attendance_id', "" + response.response.attendance_id).then((value) => {
                this.setState({ isLoadingIndicator: false });
                constants.attendance_id = response.response.attendance_id;
                constants.profileData = this.state.profileDataSurce;
                this.props.navigation.navigate("SuccessScreen");
              })
            }
            else {
              this.setState({ isLoadingIndicator: false });
              this.props.navigation.navigate("SuccessScreen");
            }
          }
          else if (statusCode === 400) {
            var SearchesToSave = [];
            var attendanceData = {
              title: "StartDuty", date: date, staffid: this.state.profileDataSurce._staffid, clock_in: new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds()
            };
            this.setofflineData(attendanceData);
            // this.dropDownAlertRef.alertWithType('info', 'Alert', "Please check your internet connection");

          }
          else if (response.responseCode === 403) {
            this.setState({ isLoadingIndicator: false });
            this.dropDownAlertRef.alertWithType('info', 'Alert', "No two consecutive in allowed");

          }
        });
    }
  }


  async setofflineData(attendanceData) {

    AsyncStorage.setItem('lastNetworkStatus', `offline`);

    // debugger
    var dataToPush = [];
    var today = moment(new Date());
    dataToPush.push(attendanceData);
    const attendanceDataPrevArray = await AsyncStorage.getItem('attendanceData');
    const todayTimePrevArray = await AsyncStorage.getItem('todayTime');
     
    if (attendanceDataPrevArray !== null && JSON.parse(attendanceDataPrevArray)!==""    ) {
      SearchesToSave = JSON.parse(attendanceDataPrevArray)
      SearchesToSave.push(attendanceData);
      Utilities.saveToStorage("attendanceData", SearchesToSave);
      
    }
    else {
      Utilities.saveToStorage("attendanceData", dataToPush);
    }
       if (todayTimePrevArray !== null && JSON.parse(todayTimePrevArray)!=="") {
    var todayTimePrevArrayPArsed=JSON.parse(todayTimePrevArray)
    if(todayTimePrevArrayPArsed!=="")
    { 
      if (today.diff(moment(todayTimePrevArrayPArsed[0].date), 'days') !== 0) {
        Utilities.saveToStorage("todayTime", "");
      SearchesToSave = JSON.parse(todayTimePrevArray)
      SearchesToSave.push(attendanceData);
      Utilities.saveToStorage("todayTime", SearchesToSave);
      }
         else {
          SearchesToSave = JSON.parse(todayTimePrevArray)
          SearchesToSave.push(attendanceData);
          Utilities.saveToStorage("todayTime", SearchesToSave);;
        }
    }
      // else
      // {
      //   if (attendanceDataPrevArray !== null) {
      //     SearchesToSave = JSON.parse(attendanceDataPrevArray)
      //     SearchesToSave.push(attendanceData);
      //     Utilities.saveToStorage("todayTime", SearchesToSave);
    
          
      //   }
      //   else {
      //     Utilities.saveToStorage("todayTime", dataToPush);
      //   }
     
      // }
      else {
        Utilities.saveToStorage("todayTime", dataToPush);
      }
    }
    else {
      Utilities.saveToStorage("todayTime", dataToPush);
    }

    Utilities.saveToStorage("lastEntry", attendanceData);
    Utilities.saveToStorage("startDutyTimeToday", attendanceData).then((value) => {
      this.setState({ isLoadingIndicator: false });
      this.props.navigation.navigate("SuccessScreen");
    })

  }
  pressNotificationFromNotification(prevDate) {
    this.setState({
      notificationView: <View ></View>,
    })
    this.props.navigation.navigate("LogDataScreen", { selectedDate: prevDate })
  }
  pressNotification() {
    constants.noificationCount = 0;
    this.props.navigation.navigate("NotificationScreen");

  }

  render() {

    if (this.state.checkedDate !== "") {
      var date = moment(this.state.checkedDate).format('dddd') + ', ' + moment().format("MMM DD, YYYY");
    }

    return (

      <Container>

        <StatusBar barStyle="light-content" hidden={false} backgroundColor={constants.colorPurpleLight595278} translucent={false} />
        <HeaderView name={this.state.profileDataSurce._firstname + " " + this.state.profileDataSurce._lastname} context={this} notificationCount={this.state.noificationCount} />
        <DropdownAlert infoColor={constants.coloBrownFFF5DA} titleStyle={{ color: constants.colorGrey838383, fontWeight: 'bold', }}
          messageStyle={{ color: constants.colorGrey838383, fontWeight: 'bold', fontSize: 12 }} imageStyle={{
            padding: 8,
            tintColor: constants.colorGrey838383,
            alignSelf: 'center',
          }}
          ref={ref => this.dropDownAlertRef = ref} />
        <ImageBackground source={require('../../ImageAssets/background.png')}
          style={[styles.mainImageBackground, { justifyContent: 'center' }]}>


          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View style={styles.transparentInputBox}>
              <DateTimePicker
                isVisible={this.state.isDateTimePickerVisible}
                onConfirm={this.handleDatePicked.bind(this)}
                onCancel={this.hideDateTimePicker}
              />
              <Loader loading={this.state.isLoadingIndicator}></Loader>
              <TouchableOpacity style={{ flex: 1 }}>

                <TextInput
                  style={styles.input}
                  pointerEvents="none"
                  editable={false}
                  value={date}
                  placeholder={date}
                  // onFocus={()=>{this.setState({isDateTimePickerVisible:true})}}
                  underlineColorAndroid="transparent"
                />
              </TouchableOpacity>
            </View>
            <Button onPress={() => this.startDuty()} block style={{ margin: 18, borderRadius: 7, backgroundColor: constants.colorRed9d0000, height: 40 }}>
              <MaterialCommunityIcons name="clock-start" style={{ marginRight: 10 }} color='white' size={24} />
              <Text style={styles.buttonTextSmall}>
                Start Duty
              </Text>
            </Button>

          </View>

          {/* {this.state.notificationView} */}

          <Footer style={{ backgroundColor: constants.colorPurpleLight595278 }}>
            <Button onPress={() => this.props.navigation.navigate("DashboardScreen")} style={styles.footerButtonActive} vertical>
              {/* <Icon name="home" style={{paddingTop:20}} color='white' size={24}/> */}
              <Image source={require('../../ImageAssets/home.png')} style={{ width: 20, height: 20 }} />
              <Text style={{ color: 'white', fontSize: 10, }}>Home</Text>
            </Button>
            <Button onPress={() => this.props.navigation.navigate("LeaveScreen")} vertical style={styles.footerButtonInactive} >

              {/* <Icon name="home"  color='white' size={24}/> */}
              <Image source={require('../../ImageAssets/leave.png')} style={{ width: 20, height: 20 }} />
              <Text style={{ color: 'white', fontSize: 10, }}>Leave</Text>
            </Button>
            <Button onPress={() => this.props.navigation.navigate("CalanderScreen")} vertical style={styles.footerButtonInactive} >
              {/* <Icon active name="navigate" color='white' size={24}/> */}
              <Image source={require('../../ImageAssets/logs.png')} style={{ width: 20, height: 20 }} />
              <Text style={{ color: 'white', fontSize: 10, }}>Logs</Text>
            </Button>
            <Button onPress={() => this.props.navigation.navigate("ReportScreen")} vertical style={styles.footerButtonInactive} >
              {/* <Icon name="profile"  color='white' size={24}/> */}
              <Image source={require('../../ImageAssets/profile.png')} style={{ width: 20, height: 20 }} />
              <Text style={{ color: 'white', fontSize: 10, }}>Profile</Text>
            </Button>
          </Footer>
        </ImageBackground>
      </Container>

    );
  }
}
