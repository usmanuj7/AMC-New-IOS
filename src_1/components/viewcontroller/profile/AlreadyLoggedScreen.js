import React, { Component } from 'react'
import {
  ListView,
  View,
  StatusBar,
  Text,
  Image, Alert,
  ImageBackground, BackHandler,
  TextInput, TouchableOpacity, ScrollView, AsyncStorage
} from 'react-native';
import { Container, Body, Title, Center, Content, Footer, FooterTab, Button, Right, Left } from 'native-base';
import styles from "../../../Style";
import WebServicesManager from '../../managers/webServicesManager/WebServicesManager';
import constants from '../../../constants/constants';
import HeaderView from '../Header/Header'
import moment from 'moment';
import PropTypes from 'prop-types';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import HoursHistoryModal from '../../Models/HoursHistoryModal';
import Utilities from '../../../utilities/Utilities';
import LoggedHoursModal from '../../Models/LoggedHoursModal';
import { withNavigation } from 'react-navigation';
import NetInfo from "@react-native-community/netinfo";
import Loader from '../../../Loader';


export default class AlreadyLoggedScreen extends Component {
  WebServicesManager = new WebServicesManager;

  constructor(props) {
    super(props);
    this.handleBackButton = this.handleBackButton.bind(this);

    this.state = {
      timeWorked: '',
      profileDataSurce: '',
      noificationCount: 0,
      isLoadingIndicator: false,
      connectionCount: 0,
      startDutyTime: "",
      endDutyTime: "",
      totalHoursWorked: "",
      successImage: require('../../../ImageAssets/startduty.gif')
    }
    // userInfo: '',
  }
  menuItemPressed() {
    this.props.navigation.navigate("BreakScreen");
  }
  componentDidUpdate(prevProps) {
    if (prevProps.isFocused !== this.props.isFocused) {

    }
  }

  pressNotification() {
    constants.noificationCount = 0;
    this.props.navigation.navigate("NotificationScreen");
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    this.focusListener.remove();
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this._handleConnectivityChange

    );
  }
  toggleLoader(status) {
    // this.setState({isLoadingIndicator:status})

  }
  handleBackButton = () => {
    BackHandler.exitApp();
    return true;
  }
  _handleConnectivityChange = (isConnected) => {

    if (isConnected == true) {
      if (this.state.connectionCount == 1)
        Utilities.sendLocalStorageToServer();
      this.setState({ connectionCount: 1 });
    }
    else {
      this.setState({ connection_Status: "Offline" });
      this.setState({ connectionCount: 1 });
    }
  };

  async componentDidMount() {
    const profile = await AsyncStorage.getItem('profileData');
    var totalHoursWork = await AsyncStorage.getItem('totalHoursWorked');
    this.setState({ totalHoursWorked: totalHoursWork })
    Utilities.connectionCount = 0;
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

    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      this.setState({ noificationCount: constants.noificationCount });
      if (profile !== null) {
        var profileData = JSON.parse(profile);
        this.setState({ profileDataSurce: profileData });
        var Leave = { staffid: profileData._staffid, clock_date: moment(new Date()).format('YYYY-MM-DD') };
        this.WebServicesManager.postApiDailyAttendence({ dataToInsert: Leave, apiEndPoint: "get_daily_attendance_log" },
          (statusCode, response) => {
            if (Utilities.checkAPICallStatus(statusCode)) {
              var startDutyTime=moment(response.attendance_data[0].clock_time).format("HH:mm:ss")
              this.setState({ startDutyTime:startDutyTime });
            }
          })

        var Leave = { staffid: profileData._staffid, clock_date: moment(new Date()).format('YYYY-MM-DD') };
        this.WebServicesManager.postApiDailyAttendence({ dataToInsert: Leave, apiEndPoint: "get_dated_lastAttendance" },
          (statusCode, response) => {
            if (Utilities.checkAPICallStatus(statusCode)) {
               
               var endDutyTime=moment(response.attendance[0].clock_time).format("HH:mm:ss")
              this.setState({ endDutyTime:endDutyTime });
            }
          })
      }
      var totalHoursWorked = this.state.totalHoursWorked;
      if (totalHoursWorked !== "" && totalHoursWork !== null) {
        var totalWorkarray = JSON.parse(JSON.parse(totalHoursWorked));
        var attendenceModel = LoggedHoursModal.parsesLoggedHoursModalFromJSON(totalWorkarray);
        this.setState({ hoursDataModel: attendenceModel });
        var workedHours = attendenceModel._worked;
        var duration = moment.duration(workedHours, 'seconds');
        var formatted = moment.utc(workedHours * 1000).format('HH:mm:ss');
         
        this.setState({ timeWorked: formatted });
        // this.getOfflineData();
      }
      else {
        this.setState({ noificationCount: constants.noificationCount });
        var attendence = { staffid:  profileData._staffid, month_year: moment(new Date()).format('YYYY-MM-DD') };

        this.WebServicesManager.postApiHoursHistoryMonth({ dataToInsert: attendence, apiEndPoint: "get_hours_history_wm" },
          (statusCode, response) => {

            if (Utilities.checkAPICallStatus(statusCode)) {
              var attendenceModel = LoggedHoursModal.parsesLoggedHoursModalFromJSON(response.hours_history);
              this.setState({ hoursDataModel: attendenceModel });
               
              this.setState({ timeWorked: attendenceModel._worked });

            }
            else {
              this.getOfflineData();
            }
          });
      }



    });
  }
  async  getOfflineData() {
  
    var startDutyTimeToday = await AsyncStorage.getItem('startDutyTimeToday');
    var EndBreakTimeToday = await AsyncStorage.getItem('EndBreakTimeToday');
    var startBreakTimeToday = await AsyncStorage.getItem('startBreakTimeToday');
    var startEndDutyToday = await AsyncStorage.getItem('startEndDutyToday');

    var startDutyTime;
    var EndBreakTime;
    var startBreakTime;
    var startEndDuty;

    var totalTime = "00:00";
    var totalBreakTime = "00:00";
    if (startDutyTimeToday !== null) {
      startDutyTimeToday = JSON.parse(startDutyTimeToday);
      startDutyTime = startDutyTimeToday.swipe_time;
      if (startDutyTimeToday.swipe_time === undefined) {
        startDutyTime = startDutyTimeToday.clock_in;
        var startDutyTime=moment(startDutyTimeToday.date+" "+startDutyTimeToday.clock_in).format("HH:mm:ss")
        this.setState({startDutyTime:startDutyTime});
      }
    }

    if (EndBreakTimeToday !== null) {
      EndBreakTimeToday = JSON.parse(EndBreakTimeToday);
      EndBreakTime = EndBreakTimeToday.swipe_time;
      if (EndBreakTimeToday.swipe_time === undefined) {
        startBreakTime = EndBreakTimeToday.clock_out
      }
    }
    if (startBreakTimeToday !== null) {
      startBreakTimeToday = JSON.parse(startBreakTimeToday);
      startBreakTime = startBreakTimeToday.swipe_time
      if (startBreakTimeToday.swipe_time === undefined) {
        startBreakTime = startBreakTimeToday.clock_out
      }
    }
    if (startEndDutyToday !== null) {
      startEndDutyToday = JSON.parse(startEndDutyToday);
      startEndDuty = startEndDutyToday.clock_out;
      var endDutyTime=moment(startEndDutyToday.date+" "+startEndDutyToday.clock_out).format("HH:mm:ss")
      this.setState({ endDutyTime:  endDutyTime});
    }

    if (EndBreakTime !== undefined && startBreakTime !== undefined) {
      totalBreakTime = moment.utc(moment(EndBreakTime, "HH:mm:ss").diff(moment(startBreakTime, "HH:mm:ss"))).format("HH:mm:ss")
    }
    if (startDutyTime !== undefined && startEndDuty !== undefined) {
      totalTime = moment.utc(moment(startEndDuty, "HH:mm:ss").diff(moment(startDutyTime, "HH:mm:ss"))).format("HH:mm:ss")
      totalTime = moment.utc(moment(totalTime, "HH:mm:ss").diff(moment(totalBreakTime, "HH:mm:ss"))).format("HH:mm:ss")
       
      this.setState({ timeWorked: totalTime });
    }
  }
  handleBackButton = () => {
    BackHandler.exitApp();
    return true;
  }
  async  componentWillMount() {
    var context = this;
    setTimeout(function () {
      context.setState({ successImage: require('../../../ImageAssets/startdutypng.png') })
    }, 5000)



    var startDutyTimeToday = await AsyncStorage.getItem('startDutyTimeToday');
    if (startDutyTimeToday !== null)
    {
      var startDutyTime=moment(JSON.parse(endDutyTimeToday).date+" "+JSON.parse(startDutyTimeToday).clock_in).format("HH:mm:ss")
      this.setState({ startDutyTime: startDutyTime });
    }
    var endDutyTimeToday = await AsyncStorage.getItem('startEndDutyToday');
    if (endDutyTimeToday !== null)
     
    var endDutyTime=moment(JSON.parse(endDutyTimeToday).date+" "+JSON.parse(endDutyTimeToday).clock_out).format("HH:mm:ss")
      this.setState({ endDutyTime:  endDutyTime});
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

    const profile = await AsyncStorage.getItem('profileData');
    if (profile !== null) {
      var profileData = JSON.parse(profile);
      this.setState({ profileDataSurce: profileData });
      var Leave = { staffid: profileData._staffid, clock_date: moment(new Date()).format('YYYY-MM-DD') };
      this.WebServicesManager.postApiDailyAttendence({ dataToInsert: Leave, apiEndPoint: "get_daily_attendance_log" },
        (statusCode, response) => {
          if (Utilities.checkAPICallStatus(statusCode)) {
            var startDutyTime=moment(response.attendance_data[0].clock_time).format("HH:mm:ss")
            this.setState({ startDutyTime: startDutyTime});
          }
        })
      var Leave = { staffid: profileData._staffid, clock_date: moment(new Date()).format('YYYY-MM-DD') };
      this.WebServicesManager.postApiDailyAttendence({ dataToInsert: Leave, apiEndPoint: "get_dated_lastAttendance" },
        (statusCode, response) => {
          if (Utilities.checkAPICallStatus(statusCode)) {
            
            var endDutyTime=moment(response.attendance[0].clock_time).format("HH:mm:ss")
            this.setState({ endDutyTime:endDutyTime});
          }
        })
    }
    // var attendence = { staffid:this.state.profileDataSurce._staffid, month_year:moment(new Date()).format('YYYY-MM-DD') };
    // this.WebServicesManager.postApiHoursHistoryMonth({ dataToInsert: attendence, apiEndPoint: "get_hours_history_wm" },
    //     (statusCode, response) => {
    //         if (Utilities.checkAPICallStatus(statusCode)) {
    //             var attendenceModel = LoggedHoursModal.parsesLoggedHoursModalFromJSON(response.hours_history);
    //             this.setState({ hoursDataModel: attendenceModel });
    // this.setState({timeWorked:attendenceModel._worked});

    //         }
    //     });


  }

  render() {
    if(this.state.timeWorked=="Invalid Date")
    {
        
    }
    return (
      <Container>
        <StatusBar barStyle="light-content" hidden={false} backgroundColor={constants.colorPurpleLight595278} translucent={false} />
        <HeaderView name={this.state.profileDataSurce._firstname + " " + this.state.profileDataSurce._lastname} context={this} notificationCount={this.state.noificationCount} />
        <Loader loading={this.state.isLoadingIndicator}></Loader>

        <ImageBackground source={require('../../../ImageAssets/background.png')}
          style={[styles.mainImageBackground, { justifyContent: 'center' }]}>
          <View style={{ flex: 1, flexDirection: 'row' }}>


            <View style={{ flex: 1 }}>
            </View>
            <View style={{ flex: 1, flexDirection: 'column' }}>
              <View style={{ marginRight: 10, paddingTop: 20, flexDirection: 'row' }}>
                <Text style={styles.HeaderTextTitleSemiBold}>Start Duty :</Text>
                <Text style={styles.HeaderTextTitleSemiBold}>{this.state.startDutyTime}</Text>
              </View>
              <View style={{ marginRight: 10, paddingTop: 5, flexDirection: 'row' }}>
                <Text style={styles.HeaderTextTitleSemiBold}>End Duty :</Text>
                <Text style={styles.HeaderTextTitleSemiBold}>{this.state.endDutyTime}</Text>
              </View>
            </View>
          </View>
          <View style={{
            flex: 9, alignItems: 'center', justifyContent: 'center', borderColor: '', backgroundColor: 'white', opacity: 0.7,
            marginBottom: 100, marginTop: 50, marginLeft: 40, marginRight: 40
          }}>
            <View style={{ marginBottom: 50, alignItems: 'center', marginTop: 30, justifyContent: 'center' }}>
              <Image source={this.state.successImage} style={{ alignItems: 'center', height: 90, width: 90 }} />

              <Text style={{ color: 'black', textAlign: 'center', marginTop: 20, fontSize: 18, fontWeight: 'bold' }} >Todays Record</Text>
              <View style={{ height: 1, borderTopWidth: 2, borderTopColor: 'black', marginRight: 50, marginLeft: 50 }}></View>
            </View>
            <View>

            </View>
            <View style={{ marginBottom: 20 }}>
              <Text style={{ textAlign: 'center', color: 'black' }}>You have worked for:{"\n"}
                {this.state.timeWorked}</Text>
            </View>

          </View>
          <Footer style={{ backgroundColor: constants.colorPurpleLight595278 }}>

            <Button style={styles.footerButtonActive} vertical>
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
    )
  }
}
