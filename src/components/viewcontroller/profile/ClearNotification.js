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
import WebServicesManager from '../../managers/webServicesManager/WebServicesManager';;
import SigninDataLogsModel from '../../Models/SigninDataLogsModel';
import HeaderView from '../Header/Header'
import moment from 'moment';
import Utilities from '../../../utilities/Utilities';
import constants from '../../../constants/constants';

const data = [
    { "key": "1", "title": "You have missed to clock out on", "subtitle": "Thursday, 13 March 2019", "id": 1, "view": "yes" },
    { "key": "2", "title": "You have missed to clock out on", "subtitle": "Thursday, 13 March 2019", "id": 2, "view": "yes" },
    { "key": "3", "title": "You have missed to clock out on", "subtitle": "Thursday, 13 March 2019", "id": 3, "view": "no" },
];
export default class ClearNotification extends React.Component {
    WebServicesManager = new WebServicesManager;
    constructor(props) {
        super(props);
        this._renderItem = this._renderItem.bind(this);
        this.state={
            notificationDataSource: [],
            profileDataSurce: '',
            noificationCount:0,
            Weekdays:null
        }

    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = () => {
        this.props.navigation.goBack();
        return true;
    }

    async componentWillMount() {

        // const notificationDataSource = await AsyncStorage.getItem('notifications');
        // this.setState({ notificationDataSource: JSON.parse(notificationDataSource) });
        const profile = await AsyncStorage.getItem('profileData');
        if (profile !== null) {
            var profileData = JSON.parse(profile);
            this.setState({ profileDataSurce: profileData });

            var staffData = { staffid: profileData._staffid };
      this.WebServicesManager.postApiCallAttendence({ dataToInsert: staffData, apiEndPoint: "get_staff_weekends" },
        (statusCode, response) => {
          if (Utilities.checkAPICallStatus(statusCode)) {
            var days = Utilities.getWeekDays(response.weekends_defined);
            this.setState({ Weekdays: days });

          }
        })

        var staffData = { staffid: profileData._staffid };
      this.WebServicesManager.postApiCallAttendence({ dataToInsert: staffData, apiEndPoint: "get_unread_notifications" },
        (statusCode, response) => {
          if (Utilities.checkAPICallStatus(statusCode)) {
            this.setState({notificationDataSource:response.response.notifications})

          }
        })
        var staffData = { staffid: profileData._staffid };
      this.WebServicesManager.postApiCallAttendence({ dataToInsert: staffData, apiEndPoint: "set_notifications_read_mobile" },
        (statusCode, response) => {
          if (Utilities.checkAPICallStatus(statusCode)) {

          }
        })

        }

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
        constants.noificationCount=0;
    this.props.navigation.navigate("NotificationScreen");
    }
    clearAll() {
        AsyncStorage.setItem('notifications', '');
        this.setState({ notificationDataSource: [] })
    }
    clearAll()
    {
        AsyncStorage.setItem('notifications', '');
        this.setState({notificationDataSource:[]})
    }
    render() {
        return (

            <Container>
               <StatusBar barStyle = "light-content" hidden = {false} backgroundColor =  {constants.colorPurpleLight595278} translucent = {false}/>
               <HeaderView name={this.state.profileDataSurce._firstname+" "+ this.state.profileDataSurce._lastname} context={this} notificationCount={this.state.noificationCount}/>

                <ImageBackground source={require('../../../ImageAssets/background.png')}
                    style={styles.mainImageBackground}>
                    {/* <View style={{ flex: 0.2, alignItems: 'flex-end', marginTop: 10, marginRight: 20 }}>
                        <Button medium onPress={() => this.clearAll()}
                            style={{ width: 150, justifyContent: 'center', borderRadius: 10, backgroundColor: constants.colorPurpleDark302757 }}>
                            <Text style={{ color: 'white', fontSize: 16, paddingBottom: 5, paddingTop: 5 }}>Clear All</Text>
                            <AntDesignIcons name="caretright" size={14} color={'white'} style={{ marginLeft: 15 }} />
                        </Button>
                    </View> */}
                    <View style={{ flex: 1.5, justifyContent: "center",backgroundColor: 'white', opacity: 0.5, marginBottom: 50, marginLeft: 20, marginRight: 20, borderRadius: 5, }}>
                        <View style={{}}>
                          { 
                           this.state.notificationDataSource.length > 0 ?
                          <FlatList
                                data={this.state.notificationDataSource}
                                renderItem={this._renderItem}
                                extraData={this.state}
                            />
                          :<Text style={{alignSelf:"center"}}> No data available </Text>
                          }
                        </View>

                    </View>

                    <Footer style={{ backgroundColor:constants.colorPurpleLight595278 }}>
                         
                           <Button onPress={() => this.goToFirstTab()} style={styles.footerButtonInactive} vertical>
                                <Image source={require('../../../ImageAssets/home.png')} style={{ width: 20, height: 20 }} />
                                <Text style={{ color: 'white', fontSize: 10, }}>Home</Text>
                            </Button>
                            <Button onPress={() => this.props.navigation.navigate("LeaveScreen")} vertical style={styles.footerButtonInactive} >

                                <Image source={require('../../../ImageAssets/leave.png')} style={{ width: 20, height: 20 }} />
                                <Text style={{ color: 'white', fontSize: 10, }}>Leave</Text>
                            </Button>
                            <Button onPress={() => this.props.navigation.navigate("CalanderScreen")} vertical style={styles.footerButtonInactive}>
                                <Image source={require('../../../ImageAssets/logs.png')} style={{ width: 20, height: 20 }} />
                                <Text style={{ color: 'white', fontSize: 10, }}>Logs</Text>
                            </Button>
                            <Button onPress={() => this.props.navigation.navigate("ReportScreen")} vertical style={styles.footerButtonInactive}>
                                <Image source={require('../../../ImageAssets/profile.png')} style={{ width: 20, height: 20 }} />
                                <Text style={{ color: 'white', fontSize: 10, }}>Profile</Text>
                            </Button>
                         
                    </Footer>
                </ImageBackground>




            </Container>
       
       )
    }
}
