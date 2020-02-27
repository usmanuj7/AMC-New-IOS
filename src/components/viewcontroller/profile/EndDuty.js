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
import moment from 'moment';
import styles from "../../../Style";
import WebServicesManager from '../../managers/webServicesManager/WebServicesManager';
import constants from '../../../constants/constants';
import HeaderView from '../Header/Header'
import AttendanceModel from '../../Models/AttendanceModel';
import Utilities from '../../../utilities/Utilities';
import Loader from '../../../Loader';
import NetInfo from "@react-native-community/netinfo";

// import { H } from 'jest-haste-map';
import DropdownAlert from 'react-native-dropdownalert';
import DailyLogsModel from '../../Models/DailyLogsModel';

export default class EndDuty extends React.Component {
  WebServicesManager = new WebServicesManager;
  constructor(props) {
    super(props);
    this.handleBreakEnd = this.handleBreakEnd.bind(this);
    this.state = {
      profileDataSurce: '',
      attendenceModel: '',
      checkedDate: '',
      isLoadingIndicator: false,
      noificationCount: 0,
      connectionCount:0,
      startDutyTime:''


    }

  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    this.focusListener.remove();
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this._handleConnectivityChange

    );

  }
  componentDidMount() {
    Utilities.connectionCount=0;
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {

      this.setState({ noificationCount: constants.noificationCount });

    });
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this._handleConnectivityChange

    );

    NetInfo.isConnected.fetch().done((isConnected) => {

      if (isConnected == true) {
        this.setState({ connection_Status: "Online" })
      }
      else {
        this.setState({ connection_Status: "Offline" })
      }

    });
  }
  _handleConnectivityChange = (isConnected) => {

    if (isConnected == true) {
      if(this.state.connectionCount==1)
      {
        Utilities.sendLocalStorageToServer();
      }
       this.setState({connectionCount:1});
       
    }
    else {
      this.setState({ connection_Status: "Offline" });
      this.setState({connectionCount:1});

    }
  };
  handleBackButton = () => {
     this.props.navigation.goBack();
    return true;
  }
  async  componentWillMount()
  {
    
    var startDutyTimeToday = await AsyncStorage.getItem('startDutyTimeToday');
    
    if(startDutyTimeToday!==null)
    
    this.setState({startDutyTime:JSON.parse(startDutyTimeToday).clock_in});

      this.setState({checkedDate:new Date()})
      const profile = await AsyncStorage.getItem('profileData');
  
      if (profile !== null) {
        var profileData = JSON.parse(profile);
         this.setState({profileDataSurce:profileData});
         var Leave = { staffid:profileData._staffid, clock_date: moment(new Date()).format('YYYY-MM-DD') };
         this.WebServicesManager.postApiDailyAttendence({ dataToInsert: Leave, apiEndPoint: "get_daily_attendance_log" },
           (statusCode, response) => {
             if (Utilities.checkAPICallStatus(statusCode)) {
               this.setState({startDutyTime:response.attendance_data[0].clock_time.split(" ")[1]});
             }
           })
       }
      else
      {
        var profileData= constants.profileData;
        this.setState({profileDataSurce:profileData});
      }
      
  }
  toggleLoader(status)
  {
    // this.setState({isLoadingIndicator:status})

  }
  async handleBreakEnd() {
    
    const todayTimePrevArray = await AsyncStorage.getItem('todayTime');
    var today = moment(new Date());
    this.setState({ isLoadingIndicator: true })

    var Leave = { staffid: this.state.profileDataSurce._staffid, clock_date: moment(new Date()).format('YYYY-MM-DD') };
    this.WebServicesManager.postApiDailyAttendence({ dataToInsert: Leave, apiEndPoint: "get_daily_attendance_log" },
      (statusCode, response) => {
        if (Utilities.checkAPICallStatus(statusCode)) {

          var dailyLogsModelDataSource = DailyLogsModel.parseDailyLogsModelFromJSON(response.attendance_data);
          if (dailyLogsModelDataSource.length > 0) {

    var attendence = {
      staffid: this.state.profileDataSurce._staffid,attendance_id:dailyLogsModelDataSource[0]._attendance_id,
      status: "101", swipe_time: new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(), clock_date:
        moment(new Date()).format("YYYY-MM-DD")
    };
    this.WebServicesManager.postMethodStartBreak({ dataToInsert: attendence, apiEndPoint: "add_break_end" },
      (statusCode, response) => {
        if (Utilities.checkAPICallStatus(response.responseCode)) {
          AsyncStorage.setItem('appLevel', "BreakScreen").then((value) => {
             
            var attendanceData = {
              title: "EndBreak", staffid: this.state.profileDataSurce._staffid, attendance_id: "",
              status: "101", swipe_time: new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(), clock_date:
                moment(new Date()).format("YYYY-MM-DD")
            };
            this.setofflineData(attendanceData);
            Utilities.saveToStorage("lastEntry", attendanceData);
            Utilities.saveToStorage("EndBreakTimeToday", attendanceData);

            this.setState({ isLoadingIndicator: false })
            this.props.navigation.navigate("BreakScreen");
          })
        }
        else if (statusCode === 400) {
          var attendence = {
            title: "EndBreak", staffid: this.state.profileDataSurce._staffid, attendance_id: "",
            status: "101", swipe_time: new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(), clock_date:
              moment(new Date()).format("YYYY-MM-DD")
          };
          this.setofflineData(attendence);

          // this.dropDownAlertRef.alertWithType('info', 'Alert', "Please check your internet connection");

        }
        else if (response.responseCode === 403) {
          this.setState({ isLoadingIndicator: false });
          this.dropDownAlertRef.alertWithType('info', 'Alert', "No two consecutive in allowed");

        }
        else if (response.responseCode === 204 || response.responseCode === 404) {
          this.setState({ isLoadingIndicator: false });
          this.dropDownAlertRef.alertWithType('info', 'Alert', "Please mark attendance first");
          setTimeout(() => { this.props.navigation.navigate("DashboardScreen") }, 3000);

        }
      });
  }
        }
        else if (statusCode === 400) {
          var attendence = {
            title: "EndBreak", staffid: this.state.profileDataSurce._staffid, attendance_id: "",
            status: "101", swipe_time: new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(), clock_date:
              moment(new Date()).format("YYYY-MM-DD")
          };
          this.setofflineData(attendence);

          // this.dropDownAlertRef.alertWithType('info', 'Alert', "Please check your internet connection");

        }
      })
      
  }


  async setofflineData(attendanceData) {
    AsyncStorage.setItem('lastNetworkStatus', `offline`);
     
    var dataToPush = [];
    dataToPush.push(attendanceData);
    var today = moment(new Date());
    const attendanceDataPrevArray = await AsyncStorage.getItem('attendanceData');
    const todayTimePrevArray = await AsyncStorage.getItem('todayTime');

    if (attendanceDataPrevArray !== null) {
      SearchesToSave = JSON.parse(attendanceDataPrevArray)
      SearchesToSave.push(attendanceData);
      console.log(`first if ${JSON.stringify(SearchesToSave)}`)

      Utilities.saveToStorage("attendanceData", SearchesToSave);

    }
    else {
      Utilities.saveToStorage("attendanceData", attendanceData);
    }
    if (todayTimePrevArray !== null && todayTimePrevArray!=="") {
      var todayTimePrevArrayPArsed=JSON.parse(todayTimePrevArray)
      if(todayTimePrevArrayPArsed!=="")
      { 
  
        if (today.diff(moment(todayTimePrevArrayPArsed[0].date), 'days') !== 0) {
          Utilities.saveToStorage("todayTime", "");
        SearchesToSave = JSON.parse(todayTimePrevArray)
        SearchesToSave.push(attendanceData);
        Utilities.saveToStorage("todayTime", SearchesToSave).then((value)=>{
          Utilities.saveToStorage("lastEntry", attendanceData);
          Utilities.saveToStorage("EndBreakTimeToday", attendanceData);
          this.setState({ isLoadingIndicator: false });
          this.props.navigation.navigate("BreakScreen");
        });
        }
        else
        {
          SearchesToSave = JSON.parse(todayTimePrevArray)
        SearchesToSave.push(attendanceData);
        Utilities.saveToStorage("todayTime", SearchesToSave).then((value)=>{
          Utilities.saveToStorage("lastEntry", attendanceData);
     
          Utilities.saveToStorage("EndBreakTimeToday", attendanceData);
          this.setState({ isLoadingIndicator: false });
          this.props.navigation.navigate("BreakScreen");
        });
        }
      }
        else {
            Utilities.saveToStorage("todayTime", dataToPush);
          }
      
      
      }
    else {
      Utilities.saveToStorage("todayTime", dataToPush);
    }
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
        <Loader loading={this.state.isLoadingIndicator}></Loader>
        <DropdownAlert infoColor={constants.coloBrownFFF5DA} titleStyle={{ color: constants.colorGrey838383, fontWeight: 'bold', }}
          messageStyle={{ color: constants.colorGrey838383, fontWeight: 'bold', fontSize: 12 }} imageStyle={{
            padding: 8,
            tintColor: constants.colorGrey838383,
            alignSelf: 'center',
          }}
          ref={ref => this.dropDownAlertRef = ref} />
        <ImageBackground source={require('../../../ImageAssets/background.png')}
          style={[styles.mainImageBackground, { justifyContent: 'center' }]}>

<View style={{ alignItems: 'flex-end', justifyContent: 'flex-end', marginRight: 20, paddingTop: 20, flexDirection: 'row' }}>
                <Text style={styles.HeaderTextTitleSemiBold}>Start Duty :</Text>
                <Text style={styles.HeaderTextTitleSemiBold}>{this.state.startDutyTime}</Text>
              </View>

          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View style={styles.transparentInputBox}>
              <TextInput
                style={styles.input}
                placeholder={date}
                value={date}
                editable={false}
                onChangeText={(searchString) => { this.setState({ searchString }) }}
                underlineColorAndroid="transparent"
              />
            </View>
            <Button onPress={() => this.handleBreakEnd()} block style={{ margin: 18, borderRadius: 7, backgroundColor: constants.coloBlue2f2756, height: 45 }}>
              <Image source={require('../../../ImageAssets/cup.png')} style={{ width: 20, height: 20, padding: 5, marginRight: 20 }} />
              <Text style={styles.buttonTextSmall}>
                End Break
                             </Text>
            </Button>

          </View>


          <Footer style={{ backgroundColor: constants.colorPurpleLight595278 }}>

            <Button  style={styles.footerButtonActive} vertical>
              {/* <Icon name="home" style={{paddingTop:20}} color='white' size={24}/> */}
              <Image source={require('../../../ImageAssets/home.png')} style={{ width: 20, height: 20 }} />
              <Text style={{ color: 'white', fontSize: 10, }}>Home</Text>
            </Button>
            <Button onPress={() => this.props.navigation.navigate("LeaveScreen")} vertical style={styles.footerButtonInactive} >

              {/* <Icon name="home"  color='white' size={24}/> */}
              <Image source={require('../../../ImageAssets/leave.png')} style={{ width: 20, height: 20 }} />
              <Text style={{ color: 'white', fontSize: 10, }}>Leave</Text>
            </Button>
            <Button onPress={() => this.props.navigation.navigate("CalanderScreen")} vertical style={styles.footerButtonInactive} >
              {/* <Icon active name="navigate" color='white' size={24}/> */}
              <Image source={require('../../../ImageAssets/logs.png')} style={{ width: 20, height: 20 }} />
              <Text style={{ color: 'white', fontSize: 10, }}>Logs</Text>
            </Button>
            <Button onPress={() => this.props.navigation.navigate("ReportScreen")} vertical style={styles.footerButtonInactive} >
              {/* <Icon name="profile"  color='white' size={24}/> */}
              <Image source={require('../../../ImageAssets/profile.png')} style={{ width: 20, height: 20 }} />
              <Text style={{ color: 'white', fontSize: 10, }}>Profile</Text>
            </Button>

          </Footer>
        </ImageBackground>
      </Container>

    );
  }
}
