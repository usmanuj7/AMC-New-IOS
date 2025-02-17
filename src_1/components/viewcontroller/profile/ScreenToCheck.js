import React from 'react';
import {
  ListView,
  View,
  StatusBar,
  Text,
  Image, Alert,
  ImageBackground,
  TextInput, TouchableOpacity, ScrollView, BackHandler, AsyncStorage
} from 'react-native';
import styles from "../../../Style";
import WebServicesManager from '../../managers/webServicesManager/WebServicesManager'
import DropdownAlert from 'react-native-dropdownalert';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Container, Header, Content, Button } from 'native-base';
import constants from '../../../constants/constants';
import Utilities from '../../../utilities/Utilities';
import ProfileModel from '../../Models/ProfileModel';
import Loader from '../../../Loader';
import SplashScreen from 'react-native-splash-screen';
import DailyLogsModel from '../../Models/DailyLogsModel';
import moment from 'moment';
import SigninDataLogsModel from '../../Models/SigninDataLogsModel';


export default class ScreenToCheck extends React.Component {
  WebServicesManager = new WebServicesManager;
  constructor(props) {
    super(props);
    this.state = {
      isModelVisible: false,
      userEmail: "",
      userPassword: "",
      isLoadingIndicator: false

    }
    // userInfo: '',
  }

  async checkNotif(dailyLogsModelDataSource, attendance_id, profileData, prevDate, appLevel) {

    var staffData = { staffid: JSON.parse(profileData)._staffid };
    this.WebServicesManager.postApiCallAttendence({ dataToInsert: staffData, apiEndPoint: "get_unread_notifications" },
      (statusCode, response) => { 
        if (Utilities.checkAPICallStatus(statusCode)) {
          if(response.response!==undefined)
          constants.noificationCount = response.response.notifications.length;
  

        }
      })

    if (dailyLogsModelDataSource.length > 0) {
      if (dailyLogsModelDataSource.find(k => k._is_manual == "0" && k._status == "101") === undefined) {
      
     if (attendance_id === "undefined" || attendance_id === null) {
          var Leave = { staffid: JSON.parse(profileData)._staffid, clock_date: moment(new Date()).format('YYYY-MM-DD') };
          this.WebServicesManager.postApiDailyAttendence({ dataToInsert: Leave, apiEndPoint: "get_daily_attendance_log" },
            (statusCode, response) => { 
              
              if (Utilities.checkAPICallStatus(statusCode)) {
                var Leave = { staffid: JSON.parse(profileData)._staffid, clock_date: moment(new Date()).format('YYYY-MM-DD') };
                this.WebServicesManager.postApiDailyAttendence({ dataToInsert: Leave, apiEndPoint: "get_dated_lastAttendance" },
                  (statusCode, response) => { 
                    
                    if (Utilities.checkAPICallStatus(statusCode)) {
            var attendance_data = SigninDataLogsModel.parseSigninDataLogsModelFromJSON(response.attendance);
                        if(attendance_data!==undefined)
                        {
                          
                      if (attendance_data.length === 0) {
                        this.setState({ isLoadingIndicator: false })
                        this.props.navigation.navigate("DashboardScreen");
                      }
                      else {
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
                        
                        
                        else {
                          constants.attendance_id = response.attendance_data[0].attendance_id;
                          if (appLevel !== null) {
                            this.setState({ isLoadingIndicator: false })
                            if (appLevel === "BreakScreen")
                              this.props.navigation.navigate("BreakScreen");
                            if (appLevel === "DashboardScreen")
                              this.props.navigation.navigate("DashboardScreen");
                            else if (appLevel === "EndDutyScreen")
                              this.props.navigation.navigate("EndDutyScreen");
                          }
                          else {
                            this.setState({ isLoadingIndicator: false })
                            this.props.navigation.navigate("DashboardScreen");

                          }
                        }

                      }
                    }
                    else
                    {
                      this.setState({ isLoadingIndicator: false })
                      this.props.navigation.navigate("DashboardScreen");
                    }
                    }
                    else if (statusCode === 400) {
                      this.setState({ isLoadingIndicator: false })
                      this.dropDownAlertRef.alertWithType('info', 'Alert', "Unable to connect with internet");

                    }
                  });
              }
              else if (statusCode === 400) {
                this.setState({ isLoadingIndicator: false })
                this.dropDownAlertRef.alertWithType('info', 'Alert', "Unable to connect with internet");

              }

            });
        }
        else {

          var Leave = { staffid: JSON.parse(profileData)._staffid, clock_date: moment(new Date()).format('YYYY-MM-DD') };
          this.WebServicesManager.postApiDailyAttendence({ dataToInsert: Leave, apiEndPoint: "get_daily_attendance_log" },
            (statusCode, response) => { 
              if (Utilities.checkAPICallStatus(statusCode)) {
                if (response.attendance_data.length === 0) {
                  this.setState({ isLoadingIndicator: false })
                  this.props.navigation.navigate("DashboardScreen");
                }
                else {
                  if (response.attendance_data.find(k => k.is_manual == 2 && k.status == 101) !== undefined) {
                    constants.attendance_id = response.attendance_data[0].attendance_id;
                    this.setState({ isLoadingIndicator: false });

                    this.props.navigation.navigate("AlreadyLoggedScreen", { attendanceData: response.attendance_data });
                  }
                   else  if (response.attendance_data.length===1) {
                    constants.attendance_id = response.attendance_data[0].attendance_id;
                    this.setState({ isLoadingIndicator: false });
                    this.props.navigation.navigate("BreakScreen");                  }
                  else {
                    constants.attendance_id = response.attendance_data[0].attendance_id;
                    if (appLevel !== null) {
                      this.setState({ isLoadingIndicator: false })
                      if (appLevel === "BreakScreen")
                        this.props.navigation.navigate("BreakScreen");
                      if (appLevel === "DashboardScreen")
                        this.props.navigation.navigate("DashboardScreen");
                      else if (appLevel === "EndDutyScreen")
                        this.props.navigation.navigate("EndDutyScreen");
                    }
                    else {
                      this.setState({ isLoadingIndicator: false })
                      this.props.navigation.navigate("DashboardScreen");

                    }
                  }

                }
              }
              else if (statusCode === 400) {
                this.setState({ isLoadingIndicator: false })
                this.dropDownAlertRef.alertWithType('info', 'Alert', "Unable to connect with internet");

              }
              else if (statusCode === 400) {
                this.setState({ isLoadingIndicator: false })
                this.dropDownAlertRef.alertWithType('info', 'Alert', "Unable to connect with internet");

              }
            });
        }
      }
      else {
        if (attendance_id === "undefined" || attendance_id === null) {
          var Leave = { staffid: JSON.parse(profileData)._staffid, clock_date: moment(new Date()).format('YYYY-MM-DD') };
          this.WebServicesManager.postApiDailyAttendence({ dataToInsert: Leave, apiEndPoint: "get_daily_attendance_log" },
            (statusCode, response) => { 
              if (Utilities.checkAPICallStatus(statusCode)) {
                var Leave = { staffid: JSON.parse(profileData)._staffid, clock_date: moment(new Date()).format('YYYY-MM-DD') };
                this.WebServicesManager.postApiDailyAttendence({ dataToInsert: Leave, apiEndPoint: "get_daily_attendance_log" },
                  (statusCode, response) => { 
                    if (Utilities.checkAPICallStatus(statusCode)) {

                      if (response.attendance_data.length === 0) {
                        this.setState({ isLoadingIndicator: false })
                        this.props.navigation.navigate("DashboardScreen");
                      }
                      else {
                        if (response.attendance_data.find(k => k.is_manual == 2 && k.status == 101) !== undefined) {
                          constants.attendance_id = response.attendance_data[0].attendance_id;
                          this.setState({ isLoadingIndicator: false });

                          this.props.navigation.navigate("AlreadyLoggedScreen", { attendanceData: response.attendance_data });
                        }
                        else {
                          constants.attendance_id = response.attendance_data[0].attendance_id;
                          if (appLevel !== null) {
                            this.setState({ isLoadingIndicator: false })
                            if (appLevel === "BreakScreen")
                              this.props.navigation.navigate("BreakScreen");
                            if (appLevel === "DashboardScreen")
                              this.props.navigation.navigate("DashboardScreen");
                            else if (appLevel === "EndDutyScreen")
                              this.props.navigation.navigate("EndDutyScreen");
                          }
                          else {
                            this.setState({ isLoadingIndicator: false })
                            this.props.navigation.navigate("DashboardScreen");

                          }
                        }

                      }
                    }
                    else if (statusCode === 400) {
                      this.setState({ isLoadingIndicator: false })
                      this.dropDownAlertRef.alertWithType('info', 'Alert', "Unable to connect with internet");

                    }
                  });
              }
              else if (statusCode === 400) {
                this.setState({ isLoadingIndicator: false })
                this.dropDownAlertRef.alertWithType('info', 'Alert', "Unable to connect with internet");

              }

            });
        }
        else {

          var Leave = { staffid: JSON.parse(profileData)._staffid, clock_date: moment(new Date()).format('YYYY-MM-DD') };
          this.WebServicesManager.postApiDailyAttendence({ dataToInsert: Leave, apiEndPoint: "get_daily_attendance_log" },
            (statusCode, response) => { 
              if (Utilities.checkAPICallStatus(statusCode)) {
                if (response.attendance_data.length === 0) {
                  this.setState({ isLoadingIndicator: false })
                  this.props.navigation.navigate("DashboardScreen");
                }
                else {
                  if (response.attendance_data.find(k => k.is_manual == 2 && k.status == 101) !== undefined) {
                    constants.attendance_id = response.attendance_data[0].attendance_id;
                    this.setState({ isLoadingIndicator: false });

                    this.props.navigation.navigate("AlreadyLoggedScreen", { attendanceData: response.attendance_data });
                  }
                  else {
                    constants.attendance_id = response.attendance_data[0].attendance_id;
                    if (appLevel !== null) {
                      this.setState({ isLoadingIndicator: false })
                      if (appLevel === "BreakScreen")
                        this.props.navigation.navigate("BreakScreen");
                      if (appLevel === "DashboardScreen")
                        this.props.navigation.navigate("DashboardScreen");
                      else if (appLevel === "EndDutyScreen")
                        this.props.navigation.navigate("EndDutyScreen");
                    }
                    else {
                      this.setState({ isLoadingIndicator: false })
                      this.props.navigation.navigate("DashboardScreen");

                    }
                  }

                }
              }
              else if (statusCode === 400) {
                this.setState({ isLoadingIndicator: false })
                this.dropDownAlertRef.alertWithType('info', 'Alert', "Unable to connect with internet");

              }
              else if (statusCode === 400) {
                this.setState({ isLoadingIndicator: false })
                this.dropDownAlertRef.alertWithType('info', 'Alert', "Unable to connect with internet");

              }
            });
        }
      }

    }
    else {
        
      if (attendance_id === "undefined" || attendance_id === null) {
        var Leave = { staffid: JSON.parse(profileData)._staffid, clock_date: moment(new Date()).format('YYYY-MM-DD') };
        this.WebServicesManager.postApiDailyAttendence({ dataToInsert: Leave, apiEndPoint: "get_daily_attendance_log" },
          (statusCode, response) => { 
            if (Utilities.checkAPICallStatus(statusCode)) {
              var Leave = { staffid: JSON.parse(profileData)._staffid, clock_date: moment(new Date()).format('YYYY-MM-DD') };
              this.WebServicesManager.postApiDailyAttendence({ dataToInsert: Leave, apiEndPoint: "get_daily_attendance_log" },
                (statusCode, response) => { 
                  if (Utilities.checkAPICallStatus(statusCode)) {

                    if (response.attendance_data.length === 0) {
                      this.setState({ isLoadingIndicator: false })
                      this.props.navigation.navigate("DashboardScreen");
                    }
                    else {
                      Utilities.saveToStorage("todayTime", "");
                      var dataToPush = [];
                      var dailyLogsModelDataSource = SigninDataLogsModel.parseSigninDataLogsModelFromJSON(response.attendance_data);
                      dailyLogsModelDataSource.forEach(element => {
                        if (element._title === "Start Duty") {
                          var attendanceData = {
                            title: "StartDuty", date: element._clock_date, staffid: element._staffid, clock_in: element._clock_time.split(" ")[1]
                          };
                          dataToPush.push(attendanceData);
                          Utilities.saveToStorage("startDutyTimeToday", attendanceData);
                          Utilities.saveToStorage("lastEntry", attendanceData);
                          appLevel = "BreakScreen";

                        }
                        if (element._title === "End Duty") {
                          var attendanceData = {
                            title: "EndDuty", staffid: element._staffid, attendance_id: "",
                            clock_out: element._clock_time.split(" ")[1],
                            date: element._clock_date
                          };
                          Utilities.saveToStorage("startEndDutyToday", attendanceData);
                          dataToPush.push(attendanceData);
                          appLevel = "BreakScreen";
                          Utilities.saveToStorage("lastEntry", attendanceData);
                        }
                        if (element._title === "Start Break") {
                          var attendanceData = {
                            title: "StartBreak", staffid: element._staffid, attendance_id: "",
                            status: "101", swipe_time: element._clock_time.split(" ")[1], clock_date: element._clock_date
                          };

                          dataToPush.push(attendanceData);
                          Utilities.saveToStorage("startBreakTimeToday", attendanceData);
                          appLevel = "EndDutyScreen";
                          Utilities.saveToStorage("lastEntry", attendanceData);
                        }
                        if (element._title === "End Break") {

                          var attendanceData = {
                            title: "EndBreak", staffid: element._staffid, attendance_id: "",
                            status: "101", swipe_time: element._clock_time.split(" ")[1], clock_date: element._clock_date
                          };
                          Utilities.saveToStorage("EndBreakTimeToday", attendanceData);
                          dataToPush.push(attendanceData);
                          appLevel = "BreakScreen";
                          Utilities.saveToStorage("lastEntry", attendanceData);
                        }

                      });
                        
                      Utilities.saveToStorage("todayTime", dataToPush);
                      if (response.attendance_data.find(k => k.is_manual == 2 && k.status == 101) !== undefined) {
                        constants.attendance_id = response.attendance_data[0].attendance_id;
                        this.setState({ isLoadingIndicator: false });

                        this.props.navigation.navigate("AlreadyLoggedScreen", { attendanceData: response.attendance_data });
                      }
                      else {
                        constants.attendance_id = response.attendance_data[0].attendance_id;
                        if (appLevel !== null) {
                          this.setState({ isLoadingIndicator: false })
                          if (appLevel === "BreakScreen")
                            this.props.navigation.navigate("BreakScreen");
                          if (appLevel === "DashboardScreen")
                            this.props.navigation.navigate("DashboardScreen");
                          else if (appLevel === "EndDutyScreen")
                            this.props.navigation.navigate("EndDutyScreen");
                        }
                        else {
                          this.setState({ isLoadingIndicator: false })
                          this.props.navigation.navigate("DashboardScreen");

                        }
                      }

                    }
                  }
                  else if (statusCode === 400) {
                    this.setState({ isLoadingIndicator: false })
                    this.dropDownAlertRef.alertWithType('info', 'Alert', "Unable to connect with internet");

                  }
                });
            }
            else if (statusCode === 400) {
              this.setState({ isLoadingIndicator: false })
              this.dropDownAlertRef.alertWithType('info', 'Alert', "Unable to connect with internet");

            }

          });
      }
      else {

        var Leave = { staffid: JSON.parse(profileData)._staffid, clock_date: moment(new Date()).format('YYYY-MM-DD') };
        this.WebServicesManager.postApiDailyAttendence({ dataToInsert: Leave, apiEndPoint: "get_daily_attendance_log" },
          (statusCode, response) => { 
            if (Utilities.checkAPICallStatus(statusCode)) {
              if (response.attendance_data.length === 0) {
                this.setState({ isLoadingIndicator: false })
                this.props.navigation.navigate("DashboardScreen");
              }
              else {
                if (response.attendance_data.find(k => k.is_manual == 2 && k.status == 101) !== undefined) {
                  constants.attendance_id = response.attendance_data[0].attendance_id;
                  this.setState({ isLoadingIndicator: false });

                  this.props.navigation.navigate("AlreadyLoggedScreen", { attendanceData: response.attendance_data });
                }
                else {
                  constants.attendance_id = response.attendance_data[0].attendance_id;
                  if (appLevel !== null) {
                    this.setState({ isLoadingIndicator: false })
                    if (appLevel === "BreakScreen")
                      this.props.navigation.navigate("BreakScreen");
                    if (appLevel === "DashboardScreen")
                      this.props.navigation.navigate("DashboardScreen");
                    else if (appLevel === "EndDutyScreen")
                      this.props.navigation.navigate("EndDutyScreen");
                  }
                  else {
                    this.setState({ isLoadingIndicator: false })
                    this.props.navigation.navigate("DashboardScreen");

                  }
                }

              }
            }
            else if (statusCode === 400) {
              this.setState({ isLoadingIndicator: false })
              this.dropDownAlertRef.alertWithType('info', 'Alert', "Unable to connect with internet");

            }
            else if (statusCode === 400) {
              this.setState({ isLoadingIndicator: false })
              this.dropDownAlertRef.alertWithType('info', 'Alert', "Unable to connect with internet");

            }
          });
      }
    }


  }

  async componentWillMount() {
    SplashScreen.hide();
    var date = new Date();

    var prevDate = date.setDate(date.getDate() - 1);
    var appLevel = await AsyncStorage.getItem('appLevel');
    this.setState({ isLoadingIndicator: true })
    const profileData = await AsyncStorage.getItem('profileData');

    const attendance_id = await AsyncStorage.getItem('attendance_id');
    if (profileData !== null) {
      var profile = JSON.parse(profileData);
      constants.profileData = profile;

      var Leave = { staffid: JSON.parse(profileData)._staffid, clock_date: moment(prevDate).format('YYYY-MM-DD') };
      this.WebServicesManager.postApiDailyAttendence({ dataToInsert: Leave, apiEndPoint: "get_daily_attendance_log" },
        (statusCode, response) => { 
          if (Utilities.checkAPICallStatus(statusCode)) {
            var dailyLogsModelDataSource = DailyLogsModel.parseDailyLogsModelFromJSON(response.attendance_data);
            if(dailyLogsModelDataSource.length>0)
            {
              Utilities.saveToStorage("startDutyTimeToday", dailyLogsModelDataSource[0]._clock_time.split(",")[1]);
            }
            this.checkNotif(dailyLogsModelDataSource, attendance_id, profileData, moment(prevDate).format('YYYY-MM-DD'), appLevel);
            this.setState({ dailyLogsModelDataSource: dailyLogsModelDataSource });


          }
          else if (statusCode === 400) {
            this.setState({ isLoadingIndicator: false });
            this.getOfflineStorageData();
            // this.dropDownAlertRef.alertWithType('info', 'Alert', "Unable to connect with internet");

          }
        });

    }
    else {
      this.setState({ isLoadingIndicator: false });
      this.props.navigation.navigate("SigninScreen");
    }

  }

  async getOfflineStorageData() {
    var today = moment(new Date());
    var offlineApplevel = await AsyncStorage.getItem("attendanceData");
    var lastEntry = await AsyncStorage.getItem("lastEntry");

    if (lastEntry !== null) {
      var lastEntryData = JSON.parse(lastEntry);
      if (today.diff(lastEntryData.date_times, 'days') !== 0) {
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

  render() {

    return (
      <ImageBackground source={require('../../../ImageAssets/background.png')}
        style={styles.mainImageBackground}>
        <Loader loading={this.state.isLoadingIndicator}></Loader>
        <DropdownAlert infoColor={constants.coloBrownFFF5DA} titleStyle={{ color: constants.colorGrey838383, fontWeight: 'bold', }}
          messageStyle={{ color: constants.colorGrey838383, fontWeight: 'bold', fontSize: 12 }} imageStyle={{
            padding: 8,
            tintColor: constants.colorGrey838383,
            alignSelf: 'center',
          }}
          ref={ref => this.dropDownAlertRef = ref} />

      </ImageBackground>


    );
  }
}
