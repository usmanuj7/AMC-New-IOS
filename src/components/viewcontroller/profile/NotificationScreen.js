import React from 'react';
import {
  ListView,
  View,
  StatusBar,
  Text,
  FlatList,
  StyleSheet,
  Image, Alert,
  ImageBackground,
  TextInput, TouchableOpacity, ScrollView, AsyncStorage, BackHandler
} from 'react-native';
import { Container, Body, Title, Center, Content, Footer, FooterTab, Button, Right, Left } from 'native-base';
import styles from "../../../Style";
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import WebServicesManager from '../../managers/webServicesManager/WebServicesManager';
import HeaderView from '../Header/Header'
import moment from 'moment';
import FlipToggle from 'react-native-flip-toggle-button';
import Utilities from '../../../utilities/Utilities';
import constants from '../../../constants/constants';
import SigninDataLogsModel from '../../Models/SigninDataLogsModel';
import ToggleSwitch from 'toggle-switch-react-native'

export default class NotificationScreen extends React.Component {
  WebServicesManager = new WebServicesManager;

  constructor(props) {
    super(props);
    this._renderItem = this._renderItem.bind(this);
    this.state = {
      isSwitch1On: false,
      isSwitch2On: false,
      isSwitch3On: false,
      notificationDataSource: [],
      profileDataSurce: '',
      noificationCount: 0,
      Weekdays: null,
      isOnDefaultToggleSwitchMissedClockOut: false,
      isOnDefaultToggleSwitchMissedClockIn: false,
      isOnDefaultToggleSwitchAnnouncement: false,
      

    };
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    this.focusListener.remove();

  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      var staffData = { staffid: this.state.profileDataSurce._staffid };
      this.WebServicesManager.postApiCallAttendence({ dataToInsert: staffData, apiEndPoint: "get_notify" },
        (statusCode, response) => {
          if (Utilities.checkAPICallStatus(statusCode)) {
            this.setState({ isOnDefaultToggleSwitchMissedClockOut: response.Response.missed_out==0?false:true              ,
              isOnDefaultToggleSwitchMissedClockIn: response.Response.missed_in==0?false:true,
              isOnDefaultToggleSwitchAnnouncement: response.Response.announcement==0?false:true
              ,})

          }
        })

      this.setState({ noificationCount: constants.noificationCount });

    });
  }

  handleBackButton = () => {
    this.props.navigation.goBack();
    return true;
  }
  menuItemPressed() {
    this.props.navigation.goBack();
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    this.props.navigation.goBack();
    return true;
  }
  async componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    const profile = await AsyncStorage.getItem('profileData');
    if (profile !== null) {
      var profileData = JSON.parse(profile);
      this.setState({ profileDataSurce: profileData });
      var staffData = { staffid: profileData._staffid };
      this.WebServicesManager.postApiCallAttendence({ dataToInsert: staffData, apiEndPoint: "get_unread_notifications" },
        (statusCode, response) => {
          if (Utilities.checkAPICallStatus(statusCode)) {
            this.setState({notificationDataSource:response.response.notifications.slice(0, 3)})

          }
        })

    }
    // const notificationDataSource = await AsyncStorage.getItem('notifications');
    // this.setState({ notificationDataSource: JSON.parse(notificationDataSource).slice(0, 3) });




  }
  async getOfflineStorageData() {

    var today = moment(new Date());
    var offlineApplevel = await AsyncStorage.getItem("attendanceData");
    var lastEntry = await AsyncStorage.getItem("lastEntry");
    if (lastEntry !== null) {
      var lastEntryData = JSON.parse(lastEntry);
      // if (today.diff(lastEntryData.date, 'days') !== 0) {
      if( (today.diff(lastEntryData.date, 'days') !== 0 || (today.diff(lastEntryData.clock_date, 'days') !== 0)) ){

        var lastEntry = await AsyncStorage.setItem("lastEntry", "");
        this.props.navigation.navigate("DashboardScreen");
      }
      else {
        if (lastEntryData.title === "StartDuty") {
          this.props.navigation.navigate("BreakScreen");
        }
        else if (lastEntryData.title === "StartBreak") {
          this.props.navigation.navigate("EndDutyScreen");
        }
        else if (lastEntryData.title === "EndDuty") {
          this.props.navigation.navigate("AlreadyLoggedScreen");
        }
        else if (lastEntryData.title === "EndBreak") {
          this.props.navigation.navigate("BreakScreen");
        }
        else {
          this.props.navigation.navigate("DashboardScreen");

        }

      }

    }
    else {
      this.props.navigation.navigate("DashboardScreen");

    }


  }
  async goToFirstTab() {

    var appLevel = await AsyncStorage.getItem('appLevel');
    var attendence = { staffid: this.state.profileDataSurce._staffid, clock_date: moment(new Date()).format('YYYY-MM-DD') };
    this.WebServicesManager.postApiDailyAttendence({ dataToInsert: attendence, apiEndPoint: "get_dated_lastAttendance" },
      (statusCode, response) => {

        if (Utilities.checkAPICallStatus(statusCode)) {
          if (response.attendance !== undefined) {
            var attendance_data = SigninDataLogsModel.parseSigninDataLogsModelFromJSON(response.attendance);
            console.log(`responce after parsing ${JSON.stringify(attendance_data)}`)
            if (attendance_data.length > 0) {
              if (attendance_data[0]._title === "Start Break") {
                AsyncStorage.setItem('appLevel', "EndDutyScreen").then((value) => {
                  this.setState({ isLoadingIndicator: false });
                  constants.attendance_id = attendance_data[0]._attendance_id;
                  this.props.navigation.navigate("EndDutyScreen");
                })
              }
              else if (attendance_data[0]._title === "Start Duty") {
                AsyncStorage.setItem('appLevel', "BreakScreen").then((value) => {
                  this.setState({ isLoadingIndicator: false });
                  constants.attendance_id = attendance_data[0]._attendance_id;
                  this.props.navigation.navigate("BreakScreen");
                })
              }
              else if (attendance_data[0]._title === "End Break") {
                AsyncStorage.setItem('appLevel', "BreakScreen").then((value) => {
                  this.setState({ isLoadingIndicator: false });
                  constants.attendance_id = attendance_data[0]._attendance_id;
                  this.props.navigation.navigate("BreakScreen");
                })
              }
              else if (attendance_data[0]._title === "End Duty") {
                AsyncStorage.setItem('appLevel', "AlreadyLoggedScreen").then((value) => {
                  this.setState({ isLoadingIndicator: false });
                  constants.attendance_id = attendance_data[0]._attendance_id;
                  this.props.navigation.navigate("AlreadyLoggedScreen");
                })
              }
            }
            else {
              AsyncStorage.setItem('appLevel', "DashboardScreen").then((value) => {
                this.setState({ isLoadingIndicator: false })
                this.props.navigation.navigate("DashboardScreen");
              })
            }
          }


          else if (statusCode === 400) {
          }
          else {
            AsyncStorage.setItem('appLevel', "DashboardScreen").then((value) => {
              this.setState({ isLoadingIndicator: false })
              this.props.navigation.navigate("DashboardScreen");
            })
          }
        }
        else if (statusCode === 400) {
          this.getOfflineStorageData();
        }
      });
  }
  _renderItem(item) {
    
    var weekDayName = moment(item.item.date).format('dddd');
    return (
      <TouchableOpacity
        style={styles.rowColFront}>

        <View style={{ flex: 1, justifyContent: 'flex-start' }}>
          <View style={{ flex: 1, alignItems: 'flex-start', }}>
    <Text style={[styles.HeaderTextTitleSemiBold,{height:40}]}>{item.item.description}</Text>
          </View>
          {/* <View style={{ lignItems: 'flex-start', justifyContent: 'center', }}>
            <Text style={styles.HeaderTextTitleSemiBold}>{item.item}</Text>
          </View> */}

        </View>
      </TouchableOpacity>
    );
// if(this.state.Weekdays!==null)

// {
//     if(this.state.Weekdays.length>0)
//     {
//     if (!this.state.Weekdays.includes(weekDayName)) {
//       return (
//         <TouchableOpacity
//           style={styles.rowColFront}>

//           <View style={{ flex: 1, justifyContent: 'flex-start' }}>
//             <View style={{ flex: 1, alignItems: 'flex-start', }}>
//       <Text style={styles.HeaderTextTitleSemiBold}>{item.item.description}</Text>
//             </View>
//             {/* <View style={{ lignItems: 'flex-start', justifyContent: 'center', }}>
//               <Text style={styles.HeaderTextTitleSemiBold}>{item.item}</Text>
//             </View> */}

//           </View>
//         </TouchableOpacity>
//       );
//     }
//   }
//   else
//   {
//     return (
//       <TouchableOpacity
//         style={styles.rowColFront}>

//         <View style={{ flex: 1, justifyContent: 'flex-start' }}>
//           <View style={{ flex: 1, alignItems: 'flex-start', }}>
//             <Text style={styles.HeaderTextTitleSemiBold}>{item.item.description}</Text>
//           </View>
//           {/* <View style={{ lignItems: 'flex-start', justifyContent: 'center', }}>
//             <Text style={styles.HeaderTextTitleSemiBold}>{item.item}</Text>
//           </View> */}

//         </View>
//       </TouchableOpacity>
//     );
//   }
// }
  }
  pressNotification() {
    constants.noificationCount = 0;
    this.props.navigation.navigate("NotificationScreen");
  }
  onToggleMissedClockAnnouncment(isOn) {
     
    var isOnDefaultToggleSwitchMissedClockIn=this.state.isOnDefaultToggleSwitchMissedClockIn;
    var isOnDefaultToggleSwitchMissedClockOut=this.state.isOnDefaultToggleSwitchMissedClockOut;
    var isOnDefaultToggleSwitchMissedAnnouncment=isOn;

    if(isOnDefaultToggleSwitchMissedClockIn===true)
    isOnDefaultToggleSwitchMissedClockIn=1
    else
    isOnDefaultToggleSwitchMissedClockIn=0

    if(isOnDefaultToggleSwitchMissedClockOut===true)
    isOnDefaultToggleSwitchMissedClockOut=1
    else
    isOnDefaultToggleSwitchMissedClockOut=0

    if(isOnDefaultToggleSwitchMissedAnnouncment===true)
    isOnDefaultToggleSwitchMissedAnnouncment=1
    else
    isOnDefaultToggleSwitchMissedAnnouncment=0

    var attendence = { staffid: this.state.profileDataSurce._staffid, missed_in: isOnDefaultToggleSwitchMissedClockIn
      , missed_out: isOnDefaultToggleSwitchMissedClockOut, announcement: isOnDefaultToggleSwitchMissedAnnouncment };
    this.WebServicesManager.postApiSetNotify({ dataToInsert: attendence, apiEndPoint: "set_notify" },
      (statusCode, response) => {
      
      })
  }
  onToggleMissedClockIn(isOn) {
     
    var isOnDefaultToggleSwitchMissedClockIn=isOn;
    var isOnDefaultToggleSwitchMissedClockOut=this.state.isOnDefaultToggleSwitchMissedClockOut;
    var isOnDefaultToggleSwitchMissedAnnouncment=this.state.isOnDefaultToggleSwitchAnnouncement;

    if(isOnDefaultToggleSwitchMissedClockIn===true)
    isOnDefaultToggleSwitchMissedClockIn=1
    else
    isOnDefaultToggleSwitchMissedClockIn=0

    if(isOnDefaultToggleSwitchMissedClockOut===true)
    isOnDefaultToggleSwitchMissedClockOut=1
    else
    isOnDefaultToggleSwitchMissedClockOut=0

    if(isOnDefaultToggleSwitchMissedAnnouncment===true)
    isOnDefaultToggleSwitchMissedAnnouncment=1
    else
    isOnDefaultToggleSwitchMissedAnnouncment=0
    var attendence = { staffid: this.state.profileDataSurce._staffid, missed_in:isOnDefaultToggleSwitchMissedClockIn
      , missed_out: isOnDefaultToggleSwitchMissedClockOut, announcement: isOnDefaultToggleSwitchMissedAnnouncment  };
    this.WebServicesManager.postApiSetNotify({ dataToInsert: attendence, apiEndPoint: "set_notify" },
      (statusCode, response) => {
      
      })
  }
  onToggleMissedClockOut(isOn) {
     
    var isOnDefaultToggleSwitchMissedClockIn=this.state.isOnDefaultToggleSwitchMissedClockIn;
    var isOnDefaultToggleSwitchMissedClockOut=isOn;
    var isOnDefaultToggleSwitchMissedAnnouncment=this.state.isOnDefaultToggleSwitchAnnouncement;

    if(isOnDefaultToggleSwitchMissedClockIn===true)
    isOnDefaultToggleSwitchMissedClockIn=1
    else
    isOnDefaultToggleSwitchMissedClockIn=0

    if(isOnDefaultToggleSwitchMissedClockOut===true)
    isOnDefaultToggleSwitchMissedClockOut=1
    else
    isOnDefaultToggleSwitchMissedClockOut=0

    if(isOnDefaultToggleSwitchMissedAnnouncment===true)
    isOnDefaultToggleSwitchMissedAnnouncment=1
    else
    isOnDefaultToggleSwitchMissedAnnouncment=0
    var attendence = { staffid: this.state.profileDataSurce._staffid, missed_in: isOnDefaultToggleSwitchMissedClockIn
      , missed_out: isOnDefaultToggleSwitchMissedClockOut, announcement:isOnDefaultToggleSwitchMissedAnnouncment  };
    this.WebServicesManager.postApiSetNotify({ dataToInsert: attendence, apiEndPoint: "set_notify" },
      (statusCode, response) => {
      
      })
  }
  render() {
    return (
      <Container>
        <StatusBar barStyle="light-content" hidden={false} backgroundColor={constants.colorPurpleLight595278} translucent={false} />
        <HeaderView name={this.state.profileDataSurce._firstname + " " + this.state.profileDataSurce._lastname} context={this} notificationCount={this.state.noificationCount} />
        <ImageBackground source={require('../../../ImageAssets/background.png')}
          style={[styles.mainImageBackground]}>
          <View style={{ flex: 1, backgroundColor: 'white', opacity: 0.5, marginTop: 30, marginLeft: 20, marginRight: 20, borderRadius: 5, }}>
            <View style={{ flexDirection: 'column' }}>
              <View style={styles.rowFront11}>
                <View style={{ flex: 1 }}>
                  <Text>Missed Clock Out</Text>
                </View>
                <View style={{ justifyContent: 'flex-end', alignContent: 'flex-end', alignItems: 'flex-end', flexDirection: 'row' }}>
                  {/* <TouchableOpacity >
                    <Image source={require('../../../ImageAssets/icon.png')} style={{ width: 35, height: 25, marginRight: 10 }} />
                  </TouchableOpacity> */}
                  <ToggleSwitch
                    isOn={this.state.isOnDefaultToggleSwitchMissedClockOut}
                    onColor="green"
                    offColor="red"
                    label=""
                    labelStyle={{ color: "black", fontWeight: "900" }}
                    size="medium"
                    onToggle={isOnDefaultToggleSwitchMissedClockOut => {
                      this.setState({ isOnDefaultToggleSwitchMissedClockOut });
                      this.onToggleMissedClockOut(isOnDefaultToggleSwitchMissedClockOut);
                    }}
                  />
                </View>
              </View>
              <View style={styles.rowFront11}>
                <View style={{ flex: 1 }}>
                  <Text>Missed Clock In</Text>
                </View>
                <View style={{ justifyContent: 'flex-end', alignContent: 'flex-end', alignItems: 'flex-end', flexDirection: 'row' }}>
                  {/* <TouchableOpacity >
                    <Image source={require('../../../ImageAssets/icon.png')} style={{ width: 35, height: 25, marginRight: 10 }} />
                  </TouchableOpacity> */}
              <ToggleSwitch
                    isOn={this.state.isOnDefaultToggleSwitchMissedClockIn}
                    onColor="green"
                    offColor="red"
                    label=""
                    labelStyle={{ color: "black", fontWeight: "900" }}
                    size="medium"
                    onToggle={isOnDefaultToggleSwitchMissedClockIn => {
                      this.setState({ isOnDefaultToggleSwitchMissedClockIn});
                      this.onToggleMissedClockIn(isOnDefaultToggleSwitchMissedClockIn);
                    }}
                  />
                </View>
              </View>
              <View style={styles.rowFront11}>
                <View style={{ flex: 1 }}>
                  <Text>Announcements</Text>
                </View>
                <View style={{ justifyContent: 'flex-end', alignContent: 'flex-end', alignItems: 'flex-end' }}>
                <ToggleSwitch
                    isOn={this.state.isOnDefaultToggleSwitchAnnouncement}
                    onColor="green"
                    offColor="red"
                    label=""
                    labelStyle={{ color: "black", fontWeight: "900" }}
                    size="medium"
                    onToggle={isOnDefaultToggleSwitchAnnouncement => {
                      this.setState({ isOnDefaultToggleSwitchAnnouncement});
                      this.onToggleMissedClockAnnouncment(isOnDefaultToggleSwitchAnnouncement);
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
          <View style={{ flex: 1.3, justifyContent: 'center', backgroundColor: 'white', opacity: 0.8, marginBottom: 30, marginLeft: 20, marginRight: 20, borderRadius: 5, }}>
        {    
        this.state.notificationDataSource.length >0 ?
        <FlatList
              data={this.state.notificationDataSource}
              renderItem={this._renderItem}
              extraData={this.state}
            />
          :<Text style={{alignSelf:"center", height:"50%"}}> No data available </Text>
          }
            <Button onPress={() => this.props.navigation.navigate("ClearNotification")} block style={{ marginLeft: 10, marginRight: 10, marginBottom: 5, borderRadius: 7, backgroundColor: constants.coloBlue2f2756, height: 40 }}>
              <Text style={styles.buttonTextSmall}>
                View All
                             </Text>
            </Button>
          </View>
          <Footer style={{ backgroundColor: constants.colorPurpleLight595278 }}>

            <Button onPress={() => this.goToFirstTab()} style={styles.footerButtonInactive} vertical>
              {/* <Icon name="home" style={{paddingTop:20}} color='white' size={24}/> */}
              <Image source={require('../../../ImageAssets/home.png')} style={{ width: 20, height: 20 }} />
              <Text style={{ color: 'white', fontSize: 10, }}>Home</Text>
            </Button>
            <Button onPress={() => this.props.navigation.navigate("LeaveScreen")} vertical style={styles.footerButtonInactive} >

              {/* <Icon name="home"  color='white' size={24}/> */}
              <Image source={require('../../../ImageAssets/leave.png')} style={{ width: 20, height: 20 }} />
              <Text style={{ color: 'white', fontSize: 10, }}>Leave</Text>
            </Button>
            <Button onPress={() => this.props.navigation.navigate("CalanderScreen")} vertical style={styles.footerButtonInactive}>
              {/* <Icon active name="navigate" color='white' size={24}/> */}
              <Image source={require('../../../ImageAssets/logs.png')} style={{ width: 20, height: 20 }} />
              <Text style={{ color: 'white', fontSize: 10, }}>Logs</Text>
            </Button>
            <Button onPress={() => this.props.navigation.navigate("ReportScreen")} vertical style={styles.footerButtonInactive}>
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
