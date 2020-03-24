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
import EntypoIcons from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/Entypo';
import WebServicesManager from '../../managers/webServicesManager/WebServicesManager';;
import HeaderView from '../Header/Header';
import DropdownAlert from 'react-native-dropdownalert';
import TimePicker from "react-native-24h-timepicker";
import moment from 'moment';
import PropTypes from 'prop-types';
import Utilities from '../../../utilities/Utilities';
import constants from '../../../constants/constants';
import LeaveModel from '../../Models/LeaveModel';
import HoursHistoryModal from '../../Models/HoursHistoryModal';
import LeaveTypeModel from '../../Models/LeaveTypeModel';
import SigninDataLogsModel from '../../Models/SigninDataLogsModel';
import PieChart from './pieChart'
import ReportsBarChart from './ReportsBarChart';
import HoursHistoryModalUpdated from '../../Models/HoursHistoryModalUpdated';
import moment1a from 'moment-duration-format';
import Loader from '../../../Loader';
// const data = [
//     { "key": "MARIA", "date": "11/12/2019", "title": "Logged Hours", "id": 1, "hours": "332" },
//     { "key": "MARTIN", "date": "11/12/2019", "title": "Working Hours", "id": 2, "hours": "332" },
//     { "key": "OLIVIA", "date": "11/12/2019", "title": "Break Hours", "id": 3, "hours": "332" },
// ];
var lastClicked = 0;
export default class ReportScreen extends React.Component {
  WebServicesManager = new WebServicesManager;
  constructor(props) {
    super(props);
    // this.makeBarData=this.makeBarData.bind(this);
    this.state = {
      time: "",
      month: "",
      monthDate: '',
      profileDataSurce: '',
      changeView: <View></View>,
      hoursDataModel: '',
      weekToCheck: '',
      totalWorkedMinutes: 0,
      totalBreakMinutes: 0,
      totalMinutes: 0,
      noificationCount: 0,
      total: 0,
      breakHrs: [],
      workedHrs: [],
      totalHrs: [],
      arrayToSend: [],
      BarDataSource: [],
      labelArray: [],
      chartYear: [],
      weeknumber: 0,
      isLoadingIndicatorLoader: false
    }
    // userInfo: '',
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    this.focusListener.remove();

  }
  async componentDidMount() {
    const profile = await AsyncStorage.getItem('profileData');

    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {

      var Months = moment(new Date()).format("MMMM YYYY");
      this.setState({
        month: Months, monthDate: new Date()
      })
      var weeknumber = 0;

      if (this.state.weeknumber === 0)
        var weeknumber = moment(moment(new Date()), "MMDDYYYY").isoWeek()
      else
        weeknumber = this.state.weeknumber;
      var weekToCheck = "Week " + weeknumber;
      this.setState({ isLoadingIndicator: true });
      if (profile !== null) {
        var profileData = JSON.parse(profile);
        this.setState({ weekToCheck: weekToCheck, profileDataSurce: profileData });
        this.setState({ arrayToSend: [], BarDataSource: [] });
        this.updateData(weekToCheck);
        this.WebServicesManager.postGetData({ dataToInsert: "", apiEndPoint: "get_all_leave_types" },
          (statusCode, response) => {
            if (Utilities.checkAPICallStatus(statusCode)) {
              var leaveTypeData = LeaveTypeModel.parseLeaveTypeModelFromJSON(response.leave_types);
              this.setState({ leaveTypeDataSource: leaveTypeData });
              var Leave = { staffid: this.state.profileDataSurce._staffid };
              this.WebServicesManager.postApiLeaveHistory({ dataToInsert: Leave, apiEndPoint: "get_leave_data" },
                (statusCode, response) => {
                  if (Utilities.checkAPICallStatus(statusCode)) {
                    this.setState({ isLoadingIndicator: false });
                    var leaveModel = LeaveModel.parseLeaveModelFromJSON(response.timesheets);
                    this.setState({ LeaveModelData: leaveModel });

                  }
                });

            }
          });

      }

    });
  }

  handleBackButton = () => {
    this.props.navigation.goBack();
    return true;
  }
  updateData(week) {

    var prevWeekNo = parseInt(parseInt(week.split("Week")[1]));
    this.setState({ isLoadingIndicatorLoader: true, weeknumber: prevWeekNo });

    var monday = moment().day("Monday").week(prevWeekNo).format('YYYY-MM-DD');
    var tuesday = moment().day("Tuesday").week(prevWeekNo).format('YYYY-MM-DD');
    var wednesday = moment().day("Wednesday").week(prevWeekNo).format('YYYY-MM-DD');
    var thursday = moment().day("Thursday").week(prevWeekNo).format('YYYY-MM-DD');
    var friday = moment().day("Friday").week(prevWeekNo).format('YYYY-MM-DD');
    var saturday = moment().day("Saturday").week(prevWeekNo).format('YYYY-MM-DD');
    var sunday = moment().day("Sunday").week(prevWeekNo).format('YYYY-MM-DD');
    var Leave = {
      staffid: this.state.profileDataSurce._staffid,
      week_start_date: sunday,
      week_end_date: saturday,
    };
    this.WebServicesManager.postApiDailyAttendenceBarChart({ dataToInsert: Leave, apiEndPoint: "bar_chart_data", prevWeekNo },
      (statusCode, weeknumber, response) => {
        if (Utilities.checkAPICallStatus(statusCode)) {

          var attendenceModel = HoursHistoryModalUpdated.parseHoursHistoryModalUpdatedFromJSON(response.hours_history_weekly);
          this.setState({ hoursDataModel: attendenceModel });
        }
      })
    var prevWeekNo = parseInt(parseInt(week.split("Week")[1]));
    var prevWeek = "Week " + parseInt(parseInt(week.split("Week")[1]));
    this.setState({ weekToCheck: prevWeek })
    var monthDate = moment().day("Saturday").week(week.split("Week")[1]);
    this.setState({ arrayToSend: [], BarDataSource: [] });
    this.makeBarData(week.split("Week")[1]);
    var date = moment(this.state.month.split(" ")[1]).add(week.split("Week")[1], 'weeks');
    var weeknumber = moment(moment(monthDate), "MMDDYYYY").isoWeek() - 1
    var firstFeb2014 = moment(monthDate); //saturday
    var day = firstFeb2014.day(); //6 = saturday
    var nthOfMoth = Math.ceil(firstFeb2014.date() / 7); //1
    var monthNumber = moment(monthDate).format('M');
    var monthYear = (moment(new Date())).format('YYYY-MM')


    // var attendence = { staffid:this.state.profileDataSurce._staffid, week_number:prevWeekNo, clock_date:monthYear };
    // this.WebServicesManager.postApiHoursHistory({ dataToInsert: attendence, apiEndPoint: "get_hours_history" },
    //     (statusCode, response) => {
    //         if (Utilities.checkAPICallStatus(statusCode)) {
    //             var attendenceModel = HoursHistoryModal.parseHoursHistoryModalFromJSON(response.hours_history);
    //             var totalWorkedMinutes=attendenceModel._worked.split(":")[0]*3600+attendenceModel._worked.split(":")[1]*60+parseInt(attendenceModel._worked.split(":")[2]);
    //             var totalBreakMinutes=attendenceModel._break.split(":")[0]*3600+attendenceModel._break.split(":")[1]*60+parseInt(attendenceModel._break.split(":")[2]);
    //             var totalMinutes=attendenceModel._total.split(":")[0]*3600+attendenceModel._total.split(":")[1]*60+parseInt(attendenceModel._total.split(":")[2]);
    //             this.setState({totalWorkedMinutes:totalWorkedMinutes,totalBreakMinutes:totalBreakMinutes,totalMinutes:totalMinutes,
    //                 hoursDataModel: attendenceModel, total : totalWorkedMinutes+totalBreakMinutes+totalMinutes });
    //             this.setState({ hoursDataModel: attendenceModel });

    //         }
    //     });
  }
  updateWeek(week) {
    // debugger
    var prevWeekNo = parseInt(parseInt(week.split("Week")[1]));
    this.setState({ weeknumber: prevWeekNo });


  }
  // async getOfflineStorageData() {
  //   debugger
  //   var today = moment(new Date());
  //   var offlineApplevel = await AsyncStorage.getItem("attendanceData");
  //   var lastEntry = await AsyncStorage.getItem("lastEntry");
  //   console.log(`last enteruy ${lastEntry}`)
  
  //   if (lastEntry !== null) {
  //     var lastEntryData = JSON.parse(lastEntry);
  //     if (today.diff(lastEntryData.date_times, 'days') !== 0) {
  //       var lastEntry = await AsyncStorage.setItem("lastEntry", "");
  //       this.props.navigation.navigate("DashboardScreen");
  //     }
  //     else {
  //       if (lastEntryData.title === "StartDuty") {
  //         this.props.navigation.navigate("BreakScreen");
  //       }
  //       else if (lastEntryData.title === "StartBreak") {
  //         this.props.navigation.navigate("EndDutyScreen");
  //       }
  //       else if (lastEntryData.title === "EndDuty") {
  //         this.props.navigation.navigate("AlreadyLoggedScreen");
  //       }
  //       else if (lastEntryData.title === "EndBreak") {
  //         this.props.navigation.navigate("BreakScreen");
  //       }
  //       else {
  //         this.props.navigation.navigate("DashboardScreen");

  //       }

  //     }

  //   }
  //   else {
  //     this.props.navigation.navigate("DashboardScreen");

  //   }
  // }


  async goToFirstTab() {
     
    var appLevel = await AsyncStorage.getItem('appLevel');
    var attendence = { staffid: this.state.profileDataSurce._staffid, clock_date: moment(new Date()).format('YYYY-MM-DD') };
    this.WebServicesManager.postApiDailyAttendence({ dataToInsert: attendence, apiEndPoint: "get_dated_lastAttendance" },
        (statusCode, response) => {

            if (Utilities.checkAPICallStatus(statusCode)) {
                if (response.attendance !== undefined) {
                    var attendance_data = SigninDataLogsModel.parseSigninDataLogsModelFromJSON(response.attendance);
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
async getOfflineStorageData() {
     
    var today = moment(new Date());
    console.log(`today plus  ${today}`)
    var offlineApplevel = await AsyncStorage.getItem("attendanceData");
    var lastEntry = await AsyncStorage.getItem("lastEntry");

    var todayTimeDataArray = await AsyncStorage.getItem('todayTime');
    console.log(`time array is ${JSON.stringify(todayTimeDataArray)}`)
var todayAttemArray = JSON.parse(todayTimeDataArray);
// debugger
    if (lastEntry !== null) {
      var lastEntryData = JSON.parse(lastEntry);
    //   if (today.diff(lastEntryData.date, 'days') !== 0) {
  if( (today.diff(lastEntryData.date, 'days') !== 0 || (today.diff(lastEntryData.clock_date, 'days') !== 0)) ){

        var lastEntry = await AsyncStorage.setItem("lastEntry", "");
        this.props.navigation.navigate("DashboardScreen");
      }
      else {
        let check = false;
        if(todayAttemArray !== null){
            for (let index = 0; index < todayAttemArray.length; index++) {
              if (todayAttemArray[index].title === 'EndDuty') {
                check = true;
              }
            }
          }
          
          console.log(`last one is ${lastEntryData.title}`)
        //   debugger
        if (lastEntryData.title === "StartDuty") {

            if (check) {
                this.props.navigation.navigate('AlreadyLoggedScreen');
              } else {
                this.props.navigation.navigate('BreakScreen');
              }
        //   this.props.navigation.navigate("BreakScreen");
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
        var check = await AsyncStorage.getItem('appLevelCheckIs');
//   debugger
     if(check == "End Duty"){
    //    debugger
       this.props.navigation.navigate("AlreadyLoggedScreen");
     }else{
    //    debugger
       this.props.navigation.navigate("DashboardScreen");
     }
    //   this.props.navigation.navigate("DashboardScreen");

    }
  }



  async componentWillMount() {
    var Months = moment(new Date()).format("MMMM YYYY");
    this.setState({
      month: Months, monthDate: new Date()
    })
    var weeknumber = moment(moment(new Date()), "MMDDYYYY").isoWeek()
    var weekToCheck = "Week " + weeknumber;
    this.setState({ isLoadingIndicator: true });
    const profile = await AsyncStorage.getItem('profileData');
    if (profile !== null) {
      var profileData = JSON.parse(profile);
      this.setState({ weekToCheck: weekToCheck, profileDataSurce: profileData });
      // this.updateData(weekToCheck);
      this.WebServicesManager.postGetData({ dataToInsert: "", apiEndPoint: "get_all_leave_types" },
        (statusCode, response) => {
          if (Utilities.checkAPICallStatus(statusCode)) {
            var leaveTypeData = LeaveTypeModel.parseLeaveTypeModelFromJSON(response.leave_types);
            this.setState({ leaveTypeDataSource: leaveTypeData });
            var Leave = { staffid: this.state.profileDataSurce._staffid };
            this.WebServicesManager.postApiLeaveHistory({ dataToInsert: Leave, apiEndPoint: "get_leave_data" },
              (statusCode, response) => {
                if (Utilities.checkAPICallStatus(statusCode)) {
                  this.setState({ isLoadingIndicator: false });
                  var leaveModel = LeaveModel.parseLeaveModelFromJSON(response.timesheets);
                  this.setState({ LeaveModelData: leaveModel });

                }
              });

          }
        });

    }
  }

  makeBarData(weeknumber) {
    this.setState({ arrayToSend: [], BarDataSource: [] });
    var year = new Date().getFullYear();
    var monday = moment().day("Monday").week(weeknumber).format('YYYY-MM-DD');
    var tuesday = moment().day("Tuesday").week(weeknumber).format('YYYY-MM-DD');
    var wednesday = moment().day("Wednesday").week(weeknumber).format('YYYY-MM-DD');
    var thursday = moment().day("Thursday").week(weeknumber).format('YYYY-MM-DD');
    var friday = moment().day("Friday").week(weeknumber).format('YYYY-MM-DD');
    var saturday = moment().day("Saturday").week(weeknumber).format('YYYY-MM-DD');
    var sunday = moment().day("Sunday").week(weeknumber).format('YYYY-MM-DD');
    var Leave = {
      staffid: this.state.profileDataSurce._staffid,
      week_start_date: sunday,
      week_end_date: saturday,
    };

    this.WebServicesManager.postApiDailyAttendenceBarChart({ dataToInsert: Leave, apiEndPoint: "bar_chart_data", weeknumber },
      (statusCode, weeknumber, response) => {
        if (Utilities.checkAPICallStatus(statusCode)) {


          var chartYear = moment().day("thursday").week(weeknumber).format('MMM') + "-" + year;
          var labelArray = [sunday.split("-")[2], monday.split("-")[2], tuesday.split("-")[2], wednesday.split("-")[2], thursday.split("-")[2], friday.split("-")[2], saturday.split("-")[2]]

          var saturdayhrs = response.hours_history_weekly[saturday]
          var sundayhrs = response.hours_history_weekly[sunday]
          var mondayhrs = response.hours_history_weekly[monday]
          var tuesdayhrs = response.hours_history_weekly[tuesday]
          var wednesdayhrs = response.hours_history_weekly[wednesday]
          var thursdayhrs = response.hours_history_weekly[thursday]
          var fridayhrs = response.hours_history_weekly[friday]


          var arrayTopush = [];

          var inHrsBreak = sundayhrs.break.split(":")[0];
          var minBreak = sundayhrs.break.split(":")[1];
          var resBreak = parseFloat(minBreak) / 100
          var temp = parseFloat(resBreak.toFixed(2))
          var res1Break = parseFloat(inHrsBreak) + temp
          arrayTopush.push(parseFloat(res1Break));

          var inHrs = sundayhrs.worked.split(":")[0];
          var min = sundayhrs.worked.split(":")[1];
          var res = parseFloat(min) / 100
          var temp = parseFloat(res.toFixed(2))
          var res1 = parseFloat(inHrs) + temp
          // arrayTopush.push(parseFloat(inHrs));
          arrayTopush.push(res1);

          // arrayTopush.push(parseInt(sundayhrs.total.split(":")[0]))
          var arrayToSend = this.state.arrayToSend;
          arrayToSend.push(arrayTopush);
          this.setState({ arrayToSend: arrayToSend });



          var arrayTopush = [];
          // var inHrs = mondayhrs.break.split(":")[0];
          // arrayTopush.push(parseFloat(inHrs));

          var inHrsBreak = mondayhrs.break.split(":")[0];
          var minBreak = mondayhrs.break.split(":")[1];
          var resBreak = parseFloat(minBreak) / 100
          var temp = parseFloat(resBreak.toFixed(2))
          var res1Break = parseFloat(inHrsBreak) + temp
          arrayTopush.push(parseFloat(res1Break));

          var inHrs = mondayhrs.worked.split(":")[0];
          var min = mondayhrs.worked.split(":")[1];
          var res =  parseFloat(min) / 100
          var temp = parseFloat(res.toFixed(2))
          var res1 = parseFloat(inHrs) + temp
          arrayTopush.push(res1);
          // arrayTopush.push(parseFloat(inHrs));
          var arrayToSend = this.state.arrayToSend;
          arrayToSend.push(arrayTopush);
          this.setState({ arrayToSend: arrayToSend });

          var arrayTopush = [];

          // var inHrs = tuesdayhrs.break.split(":")[0];
          // arrayTopush.push(parseFloat(inHrs));

          var inHrsBreak = tuesdayhrs.break.split(":")[0];
          var minBreak = tuesdayhrs.break.split(":")[1];
          var resBreak = parseFloat(minBreak) / 100
          var temp = parseFloat(resBreak.toFixed(2))
          var res1Break = parseFloat(inHrsBreak) + temp
          arrayTopush.push(parseFloat(res1Break));

          var inHrs = tuesdayhrs.worked.split(":")[0];
          var min = tuesdayhrs.worked.split(":")[1];
          var res = parseFloat(min) / 100
          var temp = parseFloat(res.toFixed(2))
          var res1 = parseFloat(inHrs) + temp
          arrayTopush.push(res1);
          // arrayTopush.push(parseFloat(inHrs));
          var arrayToSend = this.state.arrayToSend;
          arrayToSend.push(arrayTopush);
          this.setState({ arrayToSend: arrayToSend });

          var arrayTopush = [];
          // var inHrs = wednesdayhrs.break.split(":")[0];
          // arrayTopush.push(parseFloat(inHrs));

          var inHrsBreak = wednesdayhrs.break.split(":")[0];
          var minBreak = wednesdayhrs.break.split(":")[1];
          var resBreak = parseFloat(minBreak) / 100
          var temp = parseFloat(resBreak.toFixed(2))
          var res1Break = parseFloat(inHrsBreak) + temp
          arrayTopush.push(parseFloat(res1Break));

          var inHrs = wednesdayhrs.worked.split(":")[0];
          var min = wednesdayhrs.worked.split(":")[1];
          var res = parseFloat(min) / 100
          var res1 = parseFloat(inHrs) + res
          arrayTopush.push(res1);
          // arrayTopush.push(parseFloat(inHrs));
          var arrayToSend = this.state.arrayToSend;
          arrayToSend.push(arrayTopush);
          this.setState({ arrayToSend: arrayToSend });

          var arrayTopush = [];
          // var inHrs = thursdayhrs.break.split(":")[0];
          // arrayTopush.push(parseFloat(inHrs));

          var inHrsBreak = thursdayhrs.break.split(":")[0];
          var minBreak = thursdayhrs.break.split(":")[1];
          var resBreak = parseFloat(minBreak) / 100
          var temp = parseFloat(resBreak.toFixed(2))
          var res1Break = parseFloat(inHrsBreak) + temp
          arrayTopush.push(parseFloat(res1Break));

          var inHrs = thursdayhrs.worked.split(":")[0];
          var min = thursdayhrs.worked.split(":")[1];
          var res = parseFloat(min) / 100
          var temp = parseFloat(res.toFixed(2))
          var res1 = parseFloat(inHrs) + temp
          arrayTopush.push(res1);
          // arrayTopush.push(parseFloat(inHrs));
          var arrayToSend = this.state.arrayToSend;
          arrayToSend.push(arrayTopush);
          this.setState({ arrayToSend: arrayToSend });

          var arrayTopush = [];
          // var inHrs = fridayhrs.break.split(":")[0];
          // arrayTopush.push(parseFloat(inHrs));


          var inHrsBreak = fridayhrs.break.split(":")[0];
          var minBreak = fridayhrs.break.split(":")[1];
          var resBreak = parseFloat(minBreak) / 100
          var temp = parseFloat(resBreak.toFixed(2))
          var res1Break = parseFloat(inHrsBreak) + temp
          arrayTopush.push(parseFloat(res1Break));

          var inHrs = fridayhrs.worked.split(":")[0];
          var min = fridayhrs.worked.split(":")[1];
          var res = parseFloat(min) / 100
          var temp = parseFloat(res.toFixed(2))
          var res1 = parseFloat(inHrs) + temp
          arrayTopush.push(res1);
          // arrayTopush.push(parseFloat(inHrs));
          var arrayToSend = this.state.arrayToSend;
          arrayToSend.push(arrayTopush);
          this.setState({ arrayToSend: arrayToSend });

          var arrayTopush = [];
          // var inHrs = saturdayhrs.break.split(":")[0];
          // arrayTopush.push(parseFloat(inHrs));

          var inHrsBreak = saturdayhrs.break.split(":")[0];
          var minBreak = saturdayhrs.break.split(":")[1];
          var resBreak = parseFloat(minBreak) / 100
          var temp = parseFloat(resBreak.toFixed(2))
          var res1Break = parseFloat(inHrsBreak) + temp
          arrayTopush.push(parseFloat(res1Break));

          var inHrs = saturdayhrs.worked.split(":")[0];
          var min = saturdayhrs.worked.split(":")[1];
          var res = parseFloat(min) / 100
          var temp = parseFloat(res.toFixed(2))
          var res1 = parseFloat(inHrs) + temp
          arrayTopush.push(res1);
          // arrayTopush.push(parseFloat(inHrs));
          var arrayToSend = this.state.arrayToSend;
          arrayToSend.push(arrayTopush);
          this.setState({ arrayToSend: arrayToSend });

          this.setState({ isLoadingIndicatorLoader: false })
          this.setState({ arrayToSend: arrayToSend }, () => {
            this.setState({ BarDataSource: arrayToSend, labelArray: labelArray, chartYear: chartYear });

          });

        }
        else{
          console.log("no internet connection")
          this.setState({ isLoadingIndicatorLoader: false })
          this.dropDownAlertRef1.alertWithType('info', 'Alert', "Please check your internet connection");
        }
      }

    )

    // this.WebServicesManager.postApiDailyAttendence({ dataToInsert: Leave, apiEndPoint: "get_hours_history" },
    //     (statusCode, response) => {
    //         if (Utilities.checkAPICallStatus(statusCode)) {

    //           var breakHrs=response.hours_history.break;
    //           var workedHrs=response.hours_history.worked;
    //           var totalHrs=response.hours_history.total;

    //           var arrayTopush=[];
    //           arrayTopush.push(parseInt(breakHrs.split(":")[0]))
    //           arrayTopush.push(parseInt(workedHrs.split(":")[0]))
    //           arrayTopush.push(parseInt(totalHrs.split(":")[0]))

    //           var arrayToSend=this.state.arrayToSend;
    //           arrayToSend.push(arrayTopush);
    //           this.setState({arrayToSend:arrayToSend});

    //           var Leave = {
    //             staffid: this.state.profileDataSurce._staffid,
    //             clock_date: tuesday
    //         };
    //         this.WebServicesManager.postApiDailyAttendence({ dataToInsert: Leave, apiEndPoint: "get_hours_history" },
    //             (statusCode, response) => {
    //                 if (Utilities.checkAPICallStatus(statusCode)) {

    //                   var breakHrs=response.hours_history.break;
    //                   var workedHrs=response.hours_history.worked;
    //                   var totalHrs=response.hours_history.total;

    //                   var arrayTopush=[];
    //                   arrayTopush.push(parseInt(breakHrs.split(":")[0]))
    //                   arrayTopush.push(parseInt(workedHrs.split(":")[0]))
    //                   arrayTopush.push(parseInt(totalHrs.split(":")[0]))

    //                   var arrayToSend=this.state.arrayToSend;
    //                   arrayToSend.push(arrayTopush);
    //                   this.setState({arrayToSend:arrayToSend});
    //                   var Leave = {
    //                     staffid: this.state.profileDataSurce._staffid,
    //                     clock_date: wednesday
    //                 };
    //                 this.WebServicesManager.postApiDailyAttendence({ dataToInsert: Leave, apiEndPoint: "get_hours_history" },
    //                     (statusCode, response) => {
    //                         if (Utilities.checkAPICallStatus(statusCode)) {

    //                           var breakHrs=response.hours_history.break;
    //                           var workedHrs=response.hours_history.worked;
    //                           var totalHrs=response.hours_history.total;

    //                           var arrayTopush=[];
    //                           arrayTopush.push(parseInt(breakHrs.split(":")[0]))
    //                           arrayTopush.push(parseInt(workedHrs.split(":")[0]))
    //                           arrayTopush.push(parseInt(totalHrs.split(":")[0]))

    //                           var arrayToSend=this.state.arrayToSend;
    //                           arrayToSend.push(arrayTopush);
    //                           this.setState({arrayToSend:arrayToSend});
    //                           var Leave = {
    //                             staffid: this.state.profileDataSurce._staffid,
    //                             clock_date: thursday
    //                         };
    //                         this.WebServicesManager.postApiDailyAttendence({ dataToInsert: Leave, apiEndPoint: "get_hours_history" },
    //                             (statusCode, response) => {
    //                                 if (Utilities.checkAPICallStatus(statusCode)) {

    //                                   var breakHrs=response.hours_history.break;
    //                                   var workedHrs=response.hours_history.worked;
    //                                   var totalHrs=response.hours_history.total;

    //                                   var arrayTopush=[];
    //                                   arrayTopush.push(parseInt(breakHrs.split(":")[0]))
    //                                   arrayTopush.push(parseInt(workedHrs.split(":")[0]))
    //                                   arrayTopush.push(parseInt(totalHrs.split(":")[0]))

    //                                   var arrayToSend=this.state.arrayToSend;
    //                                   arrayToSend.push(arrayTopush);
    //                                   this.setState({arrayToSend:arrayToSend});
    //                                   var Leave = {
    //                                     staffid: this.state.profileDataSurce._staffid,
    //                                     clock_date: friday
    //                                 };
    //                                 this.WebServicesManager.postApiDailyAttendence({ dataToInsert: Leave, apiEndPoint: "get_hours_history" },
    //                                     (statusCode, response) => {
    //                                         if (Utilities.checkAPICallStatus(statusCode)) {

    //                                           var breakHrs=response.hours_history.break;
    //                                           var workedHrs=response.hours_history.worked;
    //                                           var totalHrs=response.hours_history.total;

    //                                           var arrayTopush=[];
    //                                           arrayTopush.push(parseInt(breakHrs.split(":")[0]))
    //                                           arrayTopush.push(parseInt(workedHrs.split(":")[0]))
    //                                           arrayTopush.push(parseInt(totalHrs.split(":")[0]))

    //                                           var arrayToSend=this.state.arrayToSend;
    //                                           arrayToSend.push(arrayTopush);
    //                                           this.setState({arrayToSend:arrayToSend});
    //                                           var Leave = {
    //                                             staffid: this.state.profileDataSurce._staffid,
    //                                             clock_date: saturday
    //                                         };
    //                                         this.WebServicesManager.postApiDailyAttendence({ dataToInsert: Leave, apiEndPoint: "get_hours_history" },
    //                                             (statusCode, response) => {
    //                                                 if (Utilities.checkAPICallStatus(statusCode)) {

    //                                                   var breakHrs=response.hours_history.break;
    //                                                   var workedHrs=response.hours_history.worked;
    //                                                   var totalHrs=response.hours_history.total;

    //                                                   var arrayTopush=[];
    //                                                   arrayTopush.push(parseInt(breakHrs.split(":")[0]))
    //                                                   arrayTopush.push(parseInt(workedHrs.split(":")[0]))
    //                                                   arrayTopush.push(parseInt(totalHrs.split(":")[0]))

    //                                                   var arrayToSend=this.state.arrayToSend;
    //                                                   arrayToSend.push(arrayTopush);
    //                                                   this.setState({arrayToSend:arrayToSend});
    //                                                   var Leave = {
    //                                                     staffid: this.state.profileDataSurce._staffid,
    //                                                     clock_date: sunday
    //                                                 };
    //                                                 this.WebServicesManager.postApiDailyAttendence({ dataToInsert: Leave, apiEndPoint: "get_hours_history" },
    //                                                     (statusCode, response) => {
    //                                                         if (Utilities.checkAPICallStatus(statusCode)) {

    //                                                           var breakHrs=response.hours_history.break;
    //                                                           var workedHrs=response.hours_history.worked;
    //                                                           var totalHrs=response.hours_history.total;

    //                                                           var arrayTopush=[];
    //                                                           arrayTopush.push(parseInt(breakHrs.split(":")[0]))
    //                                                           arrayTopush.push(parseInt(workedHrs.split(":")[0]))
    //                                                           arrayTopush.push(parseInt(totalHrs.split(":")[0]))

    //                                                           var arrayToSend=this.state.arrayToSend;
    //                                                           arrayToSend.push(arrayTopush);
    //                                                           this.setState({arrayToSend:arrayToSend});
    //                                                           this.setState({BarDataSource:arrayToSend , labelArray:labelArray,chartYear:chartYear});
    //                                                         }
    //                                                       })
    //                                                 }
    //                                               })
    //                                         }
    //                                       })
    //                                 }
    //                               })
    //                         }
    //                       })
    //                 }
    //               })
    //         }
    //       })
  }
  // componentDidMount() {
  //     this.setState({
  //         changeView: <View>
  //             <Text style={{ color: 'white' }} >{this.state.month}</Text>
  //         </View>
  //     })
  // }
  Next() {
    var timeNow = (new Date()).getTime();
    if (timeNow > (lastClicked + 500)) {
      if (parseInt(this.state.weekToCheck.split("Week")[1]) < 52) {

        this.setState({ isLoadingIndicatorLoader: true })
        this.setState({ arrayToSend: [], BarDataSource: [], labelArray: [], chartYear: "" });
        var nextWeek = "Week " + parseInt(parseInt(this.state.weekToCheck.split("Week")[1]) + 1);
        this.updateData(nextWeek)
        this.setState({ weeknumber: parseInt(parseInt(this.state.weekToCheck.split("Week")[1]) + 1), weekToCheck: nextWeek });
      }
    }
    else {
      // Alert.alert('Please wait at least 5 seconds between clicks!');
    }

    lastClicked = timeNow;
    // var nextDate= moment(this.state.monthDate).add(1, 'M');
    // var nextMonth = moment(this.state.monthDate).add(1, "month").format("MMMM YYYY");


  }
  Prev() {
    var timeNow = (new Date()).getTime();
    if (timeNow > (lastClicked + 500)) {
    // var nextDate= moment(this.state.monthDate).subtract(1, 'M');
    // var prevMonth = moment(this.state.monthDate).subtract(1, "month").format("MMMM YYYY");
    if (parseInt(this.state.weekToCheck.split("Week")[1]) > 1) {

      this.setState({ isLoadingIndicatorLoader: true })
      this.setState({ arrayToSend: [], BarDataSource: [], labelArray: [], chartYear: "" });
      var prevWeek = "Week " + parseInt(parseInt(this.state.weekToCheck.split("Week")[1]) - 1);
      this.updateData(prevWeek)
      this.setState({ weeknumber: parseInt(parseInt(this.state.weekToCheck.split("Week")[1]) + 1), weekToCheck: prevWeek })
      // this.setState({monthDate: nextDate})
    }
  }
  lastClicked = timeNow;

  }
  pressNotification() {
    constants.noificationCount = 0;
    this.props.navigation.navigate("NotificationScreen");
  }
  render() {

    const chartsData = [parseInt(this.state.totalWorkedMinutes), parseInt(this.state.totalBreakMinutes), parseInt(this.state.totalMinutes), parseInt(this.state.total)]

    const randomColor = () => ('#' + ((Math.random() * 0xffffff) << 0).toString(16) + '000000').slice(0, 7)
    const total = this.state.total
    // this.setState({total: total})
    // const label = () => ('#' + ((Math.floor() * 0xffffff) << 0).toString(16) + '000000').slice(0, 7)
    const data = [
      this.state.totalWorkedMinutes / total,
      this.state.totalBreakMinutes / total,
      this.state.totalMinutes / total
      // {
      //     key: 4,
      //     amount: 95,
      //     svg: { fill: '#d966ff' }
      // },
      // {
      //     key: 5,
      //     amount: 35,
      //     svg: { fill: '#ecb3ff' }
      // }
    ]


    // const Labels = ({ slices, height, width }) => {
    //     return slices.map((slice, index) => {
    //         const { labelCentroid, pieCentroid, data } = slice;
    //         return (
    //             <Text1
    //                 key={index}
    //                 x={pieCentroid[0]}
    //                 y={pieCentroid[1]}
    //                 fill={'white'}
    //                 textAnchor={'middle'}
    //                 alignmentBaseline={'middle'}
    //                 fontSize={24}
    //                 stroke={'black'}
    //                 strokeWidth={0.2}
    //             >
    //                 {data.amount+"%"}
    //             </Text1>
    //         )
    //     })
    // }
    return (

      <Container>
        <StatusBar barStyle="light-content" hidden={false} backgroundColor={constants.colorPurpleLight595278} translucent={false} />
        <HeaderView name={this.state.profileDataSurce._firstname + " " + this.state.profileDataSurce._lastname} context={this} notificationCount={this.state.noificationCount} />
        <Loader loading={this.state.isLoadingIndicatorLoader}></Loader>

        <DropdownAlert infoColor={constants.coloBrownFFF5DA} titleStyle={{ color: constants.colorWhitefcfcfc, fontWeight: 'bold', }}
        messageStyle={{ color: constants.colorWhitefcfcfc, fontWeight: 'bold', fontSize: 12 }} imageStyle={{
          padding: 8,
          tintColor: constants.colorWhitefcfcfc,
          alignSelf: 'center',
        }}
        ref={ref => this.dropDownAlertRef1 = ref} />
        <ImageBackground source={require('../../../ImageAssets/background.png')}
          style={[styles.mainImageBackground]}>
          <View style={{ backgroundColor: '#595278', flexDirection: 'row' }}>
            <Button style={{ flex: 1, justifyContent: 'center', backgroundColor: constants.colorPurpleDark302757, }}>
              <Text style={{ color: constants.colorWhitefcfcfc }}>By Week</Text>
            </Button>
            <Button onPress={() => this.props.navigation.navigate("MonthScreen")} style={{ flex: 1, justifyContent: 'center', backgroundColor: constants.colorPurpleLight595278, opacity: 1, }}>
              <Text style={{ color: constants.colorWhitefcfcfc }}>By Month</Text>
            </Button>
            <Button onPress={() => this.props.navigation.navigate("YearScreen")} style={{ flex: 1, justifyContent: 'center', backgroundColor: constants.colorPurpleLight595278, opacity: 0.4, }}>
              <Text style={{ color: constants.colorWhitefcfcfc }}>By Year</Text>
            </Button>
          </View>
          <View style={{ flexDirection: 'row', backgroundColor: '#595278', justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => this.Prev()}>
              <Icons name="chevron-small-left" style={{ padding: 10 }} color={constants.colorWhitefcfcfc} size={24} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate("SelectWeekScreen", { context: this })}>
              <Text style={{ color: 'white' }} >{this.state.weekToCheck}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.Next()}>
              <Icons name="chevron-small-right" style={{ padding: 10 }} color={constants.colorWhitefcfcfc} size={24} />
            </TouchableOpacity>
          </View>
          <ScrollView style={{ flex: 1, backgroundColor: 'white', opacity: 0.5, marginBottom: 30, marginTop: 10, marginLeft: 20, marginRight: 20, borderRadius: 5, }}>
            <View style={{ flex: 1, justifyContent: 'center', }}>
              <TouchableOpacity
                style={styles.rowFront2}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }}>
                      <Text style={styles.HeaderTextTitleSemiBold}>Logged Hours</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={styles.HeaderTextTitleSemiBold}>{this.state.hoursDataModel._total} </Text>
                    </View>
                  </View>

                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.rowFront2}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center', }}>
                      <Text style={styles.HeaderTextTitleSemiBold}>Working Hours</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={styles.HeaderTextTitleSemiBold}>{this.state.hoursDataModel._worked} </Text>
                    </View>
                  </View>

                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.rowFront2}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }}>
                      <Text style={styles.HeaderTextTitleSemiBold}>Break Hours</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={styles.HeaderTextTitleSemiBold}>{this.state.hoursDataModel._break} </Text>
                    </View>
                  </View>

                </View>
              </TouchableOpacity>
            </View>

            <ReportsBarChart data={this.state.BarDataSource} labelArray={this.state.labelArray} chartYear={this.state.chartYear} />

            {/* <PieChart
            style={{ height: 200 }}
            valueAccessor={({ item }) => item.amount}
            data={data}
            spacing={0}
            outerRadius={'95%'}
        >
            <Labels/>
        </PieChart> */}


            <View>
              <Button onPress={() => this.props.navigation.navigate("ChangePassword")} block style={{ margin: 18, borderRadius: 7, backgroundColor: constants.coloBlue2f2756, height: 40 }}>
                <EntypoIcons name="ios-lock" style={{ padding: 10 }} color={constants.coloBlue2f2756} size={24} />
                <Text style={styles.buttonTextSmall}>
                  Change Password
                                </Text>
              </Button>
            </View>
          </ScrollView>
          {/* <View>
                            <Button onPress={() => this.props.navigation.navigate("ChangePassword")} block style={{ margin: 18, borderRadius: 7, backgroundColor: constants.coloBlue2f2756, height: 40 }}>
                                <EntypoIcons name="ios-lock" style={{ padding: 10 }} color={constants.coloBlue2f2756} size={24} />
                                <Text style={styles.buttonText}>
                                    Change Password
                                </Text>
                            </Button>
                        </View> */}

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
            <Button onPress={() => this.props.navigation.navigate("ReportScreen")} vertical style={styles.footerButtonActive}>
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
