import React from 'react';
import {
    ListView,
    View,
    StatusBar,
    Text,
    FlatList,
    StyleSheet,
    Image, Alert,
    ImageBackground, Modal,
    TextInput, TouchableOpacity, ScrollView, AsyncStorage, BackHandler
} from 'react-native';
import { Container, Body, Title, Center, Content, Footer, FooterTab, Button, Right, Left } from 'native-base';
import styles from "../../../Style";
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import WebServicesManager from '../../managers/webServicesManager/WebServicesManager';;
import EntypoIcons from 'react-native-vector-icons/Entypo';
import HeaderView from '../Header/Header'
import moment from 'moment';
import { FloatingAction } from "react-native-floating-action";
import Utilities from '../../../utilities/Utilities';
import constants from '../../../constants/constants';
import LeaveModel from '../../Models/LeaveModel'
import DailyLogsModel from '../../Models/DailyLogsModel';
import PropTypes from 'prop-types';
import Loader from '../../../Loader';
import AttendanceModel from '../../Models/AttendanceModel';
import DeleteShiftPopUp from '../../../DeleteShiftPopUp';
import SigninDataLogsModel from '../../Models/SigninDataLogsModel';
import DropdownAlert from 'react-native-dropdownalert';
import LoggedHoursModal from '../../Models/LoggedHoursModal';
import DateTimePicker from "react-native-modal-datetime-picker";
import NetInfo from "@react-native-community/netinfo";



export default class LogData extends React.Component {
    WebServicesManager = new WebServicesManager;
    constructor(props) {
        super(props);

        this.state = {
            profileDataSurce: [],
            actions:[],
            checkActionNames:[],
            dailyLogsModelDataSource: '',
            text: '',
            isLoadingIndicator: false,
            isLoading:false,
            deleteShiftItem: '',
            timeWorked: "00:00:00",
            noificationCount: 0,
            isStartDateTimePickerVisible: false,
            isEndDateTimePickerVisible: false,
            isDateTimePickerVisible: false,
            checnkedNameToAdd: '',
           
        }
        // userInfo: '',
    }
    startDutyInterval = 0;
    endBreakInterval= 0;
    static propTypes = {
        context: PropTypes.object.isRequired,

    };
    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };
    checkDatePick= date=>{
 
        console.log(`date is ${this.props.navigation.state.params.selectedDate}`)
        var selectedDate = this.props.navigation.state.params.selectedDate
        var today = moment(new Date());
        console.log(`date is ${today}`)
         if (today.diff(selectedDate, 'days') !== 0) {
           debugger
           console.log("iff called")
           this.handleDatePicked(date);
          
         }
         else{
             debugger
          console.log("else called")
          this.checkCurrentDatePick(date);
         }
      }

    checkCurrentDatePick= date =>{

        var selectedHours = parseInt( moment(date).format('HH')) ;
        
// var selectedHours = parseInt(temp[0]) 
    // selectedHours == "00" ? selectedHours = 0 : null
        console.log(selectedHours)

        var selectedMinutes =  parseInt( moment(date).format('mm')) ;

        console.log(selectedMinutes)
    
        var today = new Date();
        var hour = today.getHours() ;
        console.log(`hour ${hour}`)

        var min = today.getMinutes();
        console.log(`mins ${min}`)

        if(selectedHours<hour){
          this.handleDatePicked(date)
    
        }
        else if(selectedHours===hour){
          if(selectedMinutes<min || selectedMinutes == min){
            this.handleDatePicked(date)
          }
          else{
            this.dropDownAlertRefRed.alertWithType(
              'info',
              'Alert',
              'Please select valid time',
            );
          }
          
      
        }else{
            console.log("outer called")
          this.dropDownAlertRefRed.alertWithType(
            'info',
            'Alert',
            'Please select valid time',
          );
        }
        this.hideDateTimePicker();

      }

    handleDatePicked = date => {
        var today = moment(new Date());

        var tocheckDate = moment(this.props.navigation.state.params.selectedDate);
        var totalDifferenceInDays = today.diff(tocheckDate, 'days');
        if (totalDifferenceInDays > 3 || totalDifferenceInDays<0 ) {
            this.dropDownAlertRefRed.alertWithType('info', 'Alert', "You cannot edit record for this date");
        }
        else {
            var today = moment(new Date());
            var tocheckDate = moment(this.props.navigation.state.params.selectedDate);
            var totalDifferenceInDays = today.diff(tocheckDate, 'days');
            if (totalDifferenceInDays > 3 || totalDifferenceInDays<0) {
                this.dropDownAlertRefRed.alertWithType('info', 'Alert', "You cannot edit record for this date");
            }
            else {
                var time = moment(date).format('HH:mm');
                if (this.state.checnkedNameToAdd === "start_duty") {
                    
                    var profile = {
                        date: this.props.navigation.state.params.selectedDate,
                        staffid: this.state.profileDataSurce._staffid, clock_in: time
                    };
                    this.WebServicesManager.postApiCallStartDuty({ dataToInsert: profile, apiEndPoint: "add_clock_in_log" },
                        (statusCode, response) => {
                            if (Utilities.checkAPICallStatus(response.responseCode)) {
                                var attendanceData = {
                                    title: "StartDuty", date: this.props.navigation.state.params.selectedDate, staffid: this.state.profileDataSurce._staffid, clock_in: time
                                  };
                                  Utilities.saveToStorage("lastEntry", attendanceData);
                                  
                              Utilities.saveToStorage("startDutyTimeToday", attendanceData);
                                this.dropDownAlertRef.alertWithType('info', 'Success', "Start Duty is recorded successfully");
                                this.componentWillMount()
                                // setTimeout(() => { this.props.navigation.goBack(); }, 3000);
                            }
                            else if (statusCode === 400) {
                                this.setState({ isLoadingIndicator: false });
                                this.dropDownAlertRefRed.alertWithType('info', 'Alert', "Please check your internet connection");

                            }
                            else if (response.responseCode === 403) {
                                this.setState({ isLoadingIndicator: false });
                                this.dropDownAlertRefRed.alertWithType('info', 'Alert', "No two consecutive in allowed");

                            }
                            else  {
                                this.setState({ isLoadingIndicator: false });
                                this.dropDownAlertRefRed.alertWithType('info', 'Alert', response.description);
                            }
                        });
                }
                if (this.state.checnkedNameToAdd === "end_duty") {
                    
                    var Leave = {
                        staffid: this.state.profileDataSurce._staffid,
                        clock_date: this.props.navigation.state.params.selectedDate
                    };
                    this.WebServicesManager.postApiDailyAttendence({ dataToInsert: Leave, apiEndPoint: "get_daily_attendance_log" },
                        (statusCode, response) => {
                            if (Utilities.checkAPICallStatus(statusCode)) {
                                if (response.attendance_data.length > 0) {
                                    var attendence = {
                                        staffid: this.state.profileDataSurce._staffid, attendance_id: response.attendance_data[0].attendance_id,
                                        clock_out: time,
                                        date_times: this.props.navigation.state.params.selectedDate
                                    };

                                    this.WebServicesManager.postMethodEndDuty({ dataToInsert: attendence, apiEndPoint: "add_clock_out_log" },
                                        (statusCode, response) => {
                                            if (Utilities.checkAPICallStatus(response.responseCode)) {
                                                this.dropDownAlertRef.alertWithType('info', 'Success', "End Duty is recorded successfully");
                                                this.componentWillMount()
                                                // setTimeout(() => { this.props.navigation.goBack(); }, 3000);

                                            }
                                            // else if (statusCode === 400) {
                                            //     this.setState({ isLoadingIndicator: false });
                                            //     this.dropDownAlertRef.alertWithType('info', 'Alert', "Please check your internet connection");

                                            // }
                                            // else if (response.responseCode === 403) {
                                            //     this.setState({ isLoadingIndicator: false });
                                            //     this.dropDownAlertRef.alertWithType('info', 'Alert', "No two consecutive in allowed");

                                            // }
                                            // else if (response.responseCode === 204 || response.responseCode === 404) {
                                            //     this.setState({ isLoadingIndicator: false });
                                            //     this.dropDownAlertRef.alertWithType('info', 'Alert', "Please mark attendance first");
                                            //     setTimeout(() => { this.props.navigation.navigate("DashboardScreen") }, 3000);

                                            // }
                                            else  {
                                                this.setState({ isLoadingIndicator: false });
                                                this.dropDownAlertRefRed.alertWithType('info', 'Alert', response.description);
                                            }

                                        });
                                }
         
                                else  {
                                  
                                    this.dropDownAlertRefRed.alertWithType('info', 'Alert', "Please mark the attandance first");
                                }
                            }
                            else  {
                                this.setState({ isLoadingIndicator: false });
                                this.dropDownAlertRefRed.alertWithType('info', 'Alert', response.description);
                            }
                        });

                }
                if (this.state.checnkedNameToAdd === "end_break") {
                    var Leave = {
                        staffid: this.state.profileDataSurce._staffid,
                        clock_date: this.props.navigation.state.params.selectedDate
                    };
                    this.WebServicesManager.postApiDailyAttendence({ dataToInsert: Leave, apiEndPoint: "get_daily_attendance_log" },
                        (statusCode, response) => {
                            if (Utilities.checkAPICallStatus(statusCode)) {
                                if (response.attendance_data.length > 0) {

                                    var attendence = {
                                        staffid: this.state.profileDataSurce._staffid, attendance_id: response.attendance_data[0].attendance_id,
                                        clock_out: time,
                                        date_times: this.props.navigation.state.params.selectedDate
                                    };
                                    var attendence = {
                                        staffid: this.state.profileDataSurce._staffid, attendance_id: response.attendance_data[0].attendance_id,
                                        status: "101", swipe_time: time, clock_date: this.props.navigation.state.params.selectedDate
                                    };
                                    this.WebServicesManager.postMethodStartBreak({ dataToInsert: attendence, apiEndPoint: "add_break_end_log" },
                                        (statusCode, response) => {
                                            if (Utilities.checkAPICallStatus(response.responseCode)) {
                                                this.dropDownAlertRef.alertWithType('info', 'Success', "Add break is recorded successfully");
                                                this.componentWillMount()
                                                // setTimeout(() => { this.props.navigation.goBack(); }, 3000);

                                            }
                                            // else if (statusCode === 400) {
                                            //     this.setState({ isLoadingIndicator: false });
                                            //     this.dropDownAlertRef.alertWithType('info', 'Alert', "Please check your internet connection");

                                            // }
                                            // else if (response.responseCode === 403) {
                                            //     this.setState({ isLoadingIndicator: false });
                                            //     this.dropDownAlertRef.alertWithType('info', 'Alert', "No two consecutive in allowed");

                                            // }
                                            // else if (response.responseCode === 204 || response.responseCode === 404) {
                                            //     this.setState({ isLoadingIndicator: false });
                                            //     this.dropDownAlertRef.alertWithType('info', 'Alert', "Please mark attendance first");
                                            //     setTimeout(() => { this.props.navigation.navigate("DashboardScreen") }, 3000);

                                            // }
                                            else  {
                                                this.setState({ isLoadingIndicator: false });
                                                this.dropDownAlertRefRed.alertWithType('info', 'Alert', response.description);
                                            }
                                        });
                                }
                                else  {
                                    this.dropDownAlertRefRed.alertWithType('info', 'Alert', "Please mark the attandance first");

                                }
                               
                            }
                            else  {
                                this.setState({ isLoadingIndicator: false });
                                this.dropDownAlertRefRed.alertWithType('info', 'Alert', response.description);
                            }
                        });

                }
                if (this.state.checnkedNameToAdd === "start_break") {
                    this.setState({
                        isLoading:true
                    })
                    var Leave = {
                        staffid: this.state.profileDataSurce._staffid,
                        clock_date: this.props.navigation.state.params.selectedDate
                    };
                    this.WebServicesManager.postApiDailyAttendence({ dataToInsert: Leave, apiEndPoint: "get_daily_attendance_log" },
                        (statusCode, response) => {
                            if (Utilities.checkAPICallStatus(statusCode)) {
                                if (response.attendance_data.length > 0) {
                                    this.setState({ attendance_id: response.attendance_data[0].attendance_id })
                                    var attendence = {
                                        staffid: this.state.profileDataSurce._staffid, attendance_id: response.attendance_data[0].attendance_id,
                                        status: "101", swipe_time: time, clock_date: this.props.navigation.state.params.selectedDate
                                    };

                                    this.WebServicesManager.postMethodStartBreak({ dataToInsert: attendence, apiEndPoint: "add_break_start_log" },
                                        (statusCode, response) => {
                                            if (Utilities.checkAPICallStatus(response.responseCode)) {
                                                this.dropDownAlertRef.alertWithType('info', 'Success', "Break Start is recorded successfully");
                                                this.componentWillMount()
                                                this.setState({
                                                    isLoading:false
                                                })
                                                // setTimeout(() => { this.props.navigation.goBack(); }, 3000);

                                            }
                                            // else if (statusCode === 400) {
                                            //     this.setState({ isLoadingIndicator: false });
                                            //     this.dropDownAlertRef.alertWithType('info', 'Alert', "Please check your internet connection");

                                            // }
                                            // else if (response.responseCode === 403) {
                                            //     this.setState({ isLoadingIndicator: false });
                                            //     this.dropDownAlertRef.alertWithType('info', 'Alert', "No two consecutive in allowed");

                                            // }
                                            // else if (response.responseCode === 204 || response.responseCode === 404) {
                                            //     this.setState({ isLoadingIndicator: false });
                                            //     this.dropDownAlertRef.alertWithType('info', 'Alert', "Please mark attendance first");
                                            //     setTimeout(() => { this.props.navigation.navigate("DashboardScreen") }, 3000);

                                            // }
                                            else  {
                                                this.setState({ isLoadingIndicator: false });
                                                this.dropDownAlertRefRed.alertWithType('info', 'Alert', response.description);
                                            }

                                        });
                                }
                                else  {
                                    this.dropDownAlertRefRed.alertWithType('info', 'Alert', "Please mark the attandance first");

                                }
                            }
                            else  {
                                this.setState({ isLoadingIndicator: false });
                                this.dropDownAlertRefRed.alertWithType('info', 'Alert', response.description);
                            }
                        });

                }
                this.setState({ checkedDate: date });
            }
        }

        this.hideDateTimePicker();

    };
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
        //     (isConnected,this,this.state.connectionCount);
           this.setState({connectionCount:1});
           this.componentWillMount();
        }
        else {
          this.setState({ connection_Status: "Offline" });
          this.setState({connectionCount:0});
    
        }
      };
    
    componentDidMount() {
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

    handleBackButton = () => {
        this.props.navigation.goBack();
        return true;
    }
    static propTypes = {
        selectedDate: PropTypes.object.isRequired
    };
    hideLoading = () => {
        this.setState({ isLoadingIndicator: false });


    }

    handleEdit(item) {

        console.log(`date is ${this.props.navigation.state.params.selectedDate}`)

        clearInterval(this.startDutyInterval);
        clearInterval(this.endBreakInterval);
        var today = moment(new Date());
        var tocheckDate = moment(item._clock_date);
        var totalDifferenceInDays = today.diff(tocheckDate, 'days');
        
        if (totalDifferenceInDays > 3 || totalDifferenceInDays<0 || totalDifferenceInDays<0 || totalDifferenceInDays<0) {
            this.dropDownAlertRef.alertWithType('info', 'Alert', "You cannot edit record for this date");
        }
        else {
            var _date = this.props.navigation.state.params.selectedDate
            this.props.navigation.navigate('ActionTimePick', { selectedItem: item,  fullData:this.state.dailyLogsModelDataSource ,selectedDate: _date,context: this })
        }
    }

    async  componentWillMount() {
        console.log(`selected date is ${JSON.stringify( this.props.navigation.state.params.selectedDate)}`)
        const profile = await AsyncStorage.getItem('profileData');

        if (profile !== null) {
            var profileData = JSON.parse(profile);
            this.setState({ profileDataSurce: profileData });
            var Leave = { staffid: this.state.profileDataSurce._staffid, clock_date: this.props.navigation.state.params.selectedDate };
            this.WebServicesManager.postApiDailyAttendence({ dataToInsert: Leave, apiEndPoint: "get_daily_attendance_log" },
                (statusCode, response) => {
                    if (Utilities.checkAPICallStatus(statusCode)) {
                          
                        var dailyLogsModelDataSource = DailyLogsModel.parseDailyLogsModelFromJSON(response.attendance_data);
                      
                     
                        this.setState({ dailyLogsModelDataSource: dailyLogsModelDataSource });
                        console.log(`full data ${JSON.stringify(this.state.dailyLogsModelDataSource)}`)
                      console.log(`length is ${JSON.stringify(this.state.dailyLogsModelDataSource.length)}`)
                      let l = this.state.dailyLogsModelDataSource.length
                      var da = this.state.dailyLogsModelDataSource
                      var te =[]
                      var start ;
                      var end;
                      this.state.checkActionNames =[]
                      for (let i =0; i<l ;i++){
                        console.log(da[i]._title)
                          if(da[i]._title==="Start Duty" && da[i]._status !="0"){
                              start = da[i]._title

                              console.log("iff called")
                          }
                         else if(da[i]._title==="End Duty" && da[i]._status !="0"){
                            end  = da[i]._title
                        }
                          else{
                            console.log("else called")

                          }
                      }
                      const actions = [
                        {
                            text: "Start Duty",
                            icon: require("../../../ImageAssets/cup.png"),
                            name: "start_duty",
                            position: 1
                        },
                        {
                            text: "Start Break",
                            icon: require("../../../ImageAssets/cup.png"),
                            name: "start_break",
                            position: 2
                        },
                        {
                            text: "End Break",
                            icon: require("../../../ImageAssets/end.png"),
                            name: "end_break",
                            position: 3
                        },
                        {
                            text: "End Duty",
                            icon: require("../../../ImageAssets/end.png"),
                            name: "end_duty",
                            position: 4
                        }
                    ];
                     
               var tempArr = actions.filter(action => action.text !==start && action.text!==end)
               this.setState({
                   actions:tempArr
               })
               console.log(`refined arr is ${JSON.stringify(tempArr)}`)
            //    debugger
                        var attendence = { staffid: this.state.profileDataSurce._staffid, month_year: moment(this.props.navigation.state.params.selectedDate).format("YYYY-MM-DD") };
                        this.WebServicesManager.postApiHoursHistoryMonth({ dataToInsert: attendence, apiEndPoint: "get_hours_history_wm" },
                            (statusCode, response) => {
                                if (Utilities.checkAPICallStatus(statusCode)) {

                                    var attendenceModel = LoggedHoursModal.parsesLoggedHoursModalFromJSON(response.hours_history);
                                    this.setState({ hoursDataModel: attendenceModel });
                                    var totalWorkeshrs = attendenceModel._worked;
                                    var found = false;
                                    if(totalWorkeshrs==="00:00:00"){
                                    for (var i = 0; i < this.state.dailyLogsModelDataSource.length; i++) {
                                        if (this.state.dailyLogsModelDataSource[i]._title== "Start Duty") {
                                            found = true;
                                            var duration = moment.duration(moment(new Date()).diff(this.state.dailyLogsModelDataSource[i]._clock_time));
                                            totalWorkeshrs=duration._data.hours+":"+duration._data.minutes+":"+duration._data.seconds;
                                            break;
                                        }
                                    }
                                }

                                console.log(`${JSON.stringify(totalWorkeshrs)}`)

                                     this.setState({ timeWorked: totalWorkeshrs });

                                     var today = moment(new Date());
                                     var tocheckDate = moment(this.props.navigation.state.params.selectedDate);
                                     var totalDifferenceInDays = today.diff(tocheckDate, 'days');
                                     console.log(`difference is ${totalDifferenceInDays}`)
                                     if ( totalDifferenceInDays==0 ) {
                                        
                                    var attendence = { staffid: this.state.profileDataSurce._staffid, clock_date: moment(new Date()).format('YYYY-MM-DD') };
                                    this.WebServicesManager.postApiDailyAttendence({ dataToInsert: attendence, apiEndPoint: "get_dated_lastAttendance" },
                                        (statusCode, response) => {
                            
                                            if (Utilities.checkAPICallStatus(statusCode)) {
                                                if (response.attendance !== undefined) {
                                                    var attendance_data = SigninDataLogsModel.parseSigninDataLogsModelFromJSON(response.attendance);
                                                    console.log(`dated attandance is ${JSON.stringify(attendance_data)}`)
                                                    if (attendance_data.length > 0) {
                                                        if (attendance_data[0]._title === "Start Duty") {
                                                            console.log(`clock time ${attendance_data[0]._clock_time}`)
                                                            var duration = moment.duration(moment(new Date()).diff(attendance_data[0]._clock_time));
                                                            totalWorkeshrs=duration._data.hours+":"+duration._data.minutes+":"+duration._data.seconds;
                                                            console.log(`working hours ${totalWorkeshrs}`)
                                                            console.log(`start duty interval ${this.startDutyInterval}`)

                                                        //    debugger
                                                           if(this.startDutyInterval === 0){
                                                            this.startDutyInterval= setInterval( () => {
                                                                // debugger
                                                                var timeWorked =  moment.utc(totalWorkeshrs, "HH:mm:ss").add(1, 'second').format("HH:mm:ss");
                                                                totalWorkeshrs=timeWorked;
                                                                console.log(`in loop working hours ${totalWorkeshrs}`)
                                                                this.setState({
                                                                    timeWorked : timeWorked
                                                                });
                                                              },1200)

                                                           }
                                                           else{
                                                               console.log("interval else called")
                                                           }
                                                   
                                                        }
                                                       else if (attendance_data[0]._title === "End Break") {
                                                         var previousWorkingHours =totalWorkeshrs
                                                            var duration = moment.duration(moment(new Date()).diff(attendance_data[0]._clock_time));
                                                            var temp = moment.duration(duration.add(previousWorkingHours))
                                                            console.log(`temp : ${JSON.stringify(temp)}`)
                                                            // debugger
                                                            totalWorkeshrs=duration._data.hours+":"+duration._data.minutes+":"+duration._data.seconds;
                                                            if(this.endBreakInterval === 0){
                                                                this.endBreakInterval= setInterval( () => {
                                                                    // debugger
                                                                    var timeWorked =  moment.utc(totalWorkeshrs, "HH:mm:ss").add(1, 'second').format("HH:mm:ss");
                                                                    totalWorkeshrs=timeWorked;
                                                                    this.setState({
                                                                        timeWorked : timeWorked
                                                                    });
                                                                  },1200)
                                                            }
                                                            else{
                                                                console.log(`else end break  end brek interval`)
                                                            }
                                                   
                                                        }
                                                    }
                                                }
                                            }
                                        })

                                    
                                     }
                                }
                            });
                        this.setState({ dailyLogsModelDataSource: dailyLogsModelDataSource });


                    }
                    else if (statusCode === 400) {
                        this.dropDownAlertRef.alertWithType('info', 'Alert', "Please check your internet connection");

                    }
                });
        }
    }
    handleAdd(name) {
        { this.setState({ checnkedNameToAdd: name, isDateTimePickerVisible: true }) }
    }

    chechDeleteShift(item) {

        var today = moment(new Date());
        var tocheckDate = moment(item._added_date);
        var totalDifferenceInDays = today.diff(tocheckDate, 'days');
        if (totalDifferenceInDays > 3 || totalDifferenceInDays<0 || totalDifferenceInDays<0) {
            this.dropDownAlertRef.alertWithType('info', 'Alert', "You cannot edit record for this date");
        }
        else {
            this.setState({ isLoadingIndicator: true, deleteShiftItem: item })
        }
    }
    deleteShift() {

        if (this.state.deleteShiftItem._title === "End Break") {
            var deleteShiftParams = { attendance_id: this.state.deleteShiftItem._attendance_id, staffid: this.state.profileDataSurce._staffid };
            this.WebServicesManager.postApiDeleteBreak({ dataToInsert: deleteShiftParams, apiEndPoint: "delete_break" },
                (statusCode, response) => {
                    if (Utilities.checkAPICallStatus(statusCode)) {
                        this.setState({ isLoadingIndicator: false })
                        this.dropDownAlertRef.alertWithType('info', 'Success', "Break is deleted successfully");
                        // this.componentWillMount()
                        setTimeout(() => { this.props.navigation.goBack(); }, 3000);
                    }
                    else if (statusCode === 400) {
                        this.dropDownAlertRef.alertWithType('info', 'Alert', "Please check your internet connection");


                    }
                })
        }

        else {
            var deleteShiftParams = { attendance_id: this.state.deleteShiftItem._attendance_id };
            this.WebServicesManager.postApiDeleteShift({ dataToInsert: deleteShiftParams, apiEndPoint: "delete_shift" },
                (statusCode, response) => {
                    if (Utilities.checkAPICallStatus(statusCode)) {
                        this.setState({ isLoadingIndicator: false });
                        Utilities.saveToStorage("todayTime", "");
                        Utilities.saveToStorage("startDutyTimeToday", "");
                        Utilities.saveToStorage("lastEntry", "");
                        Utilities.saveToStorage("attendanceData", "");
                        // Utilities.saveToStorage("EndBreakTimeToday", "");
                        // Utilities.saveToStorage("startBreakTimeToday", "");
                        // Utilities.saveToStorage("startEndDutyToday", "");

                        this.dropDownAlertRef.alertWithType('info', 'Success', "Shift is deleted successfully");
                        setTimeout(() => { this.props.navigation.goBack(); }, 3000);

                    }
                    else if (statusCode === 400) {
                        this.dropDownAlertRef.alertWithType('info', 'Alert', "Please check your internet connection");

                    }
                });
        }
    }



    _renderItem = ({ item, index }) => {

        if (item._is_manual !== "") {
            if (item._clock_time === null) {
                return (
                    <View
                        style={styles.rowFront3}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderRightWidth: 1, }}>
                                    <Text style={styles.HeaderTextTitleSemiBold}>{item._clock_time}</Text>
                                </View>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={styles.HeaderTextTitleSemiBold}>{item._title} </Text>
                                </View>
                            </View>
                            <View style={{ flex: 0.5, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    {/* <Image source={require('../../../ImageAssets/add.png')} style={{ width: 20, height: 20, }} /> */}
                                </View>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <TouchableOpacity onPress={() => this.handleEdit(item)} >
                                        <Image source={require('../../../ImageAssets/edit.png')} style={{ width: 20, height: 20 }} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    {/* <Image source={require('../../../ImageAssets/delete.png')} style={{ width: 20, height: 20 }} /> */}
                                </View>
                            </View>
                        </View>
                    </View>
                );
            }
            else {
                if (item._title == "End Duty" || item._title == "End Break") {
                    return (
                        <View
                            style={styles.rowFront3}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderRightWidth: 1, }}>
                                        <Text style={styles.HeaderTextTitleSemiBold}>{item._clock_time.split(" ")[1].split(":")[0] + ":" + item._clock_time.split(" ")[1].split(":")[1]}</Text>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={styles.HeaderTextTitleSemiBold}>{item._title} </Text>
                                    </View>
                                </View>
                                <View style={{ flex: 0.5, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        {/* <Image source={require('../../../ImageAssets/add.png')} style={{ width: 20, height: 20, }} /> */}
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        <TouchableOpacity onPress={() => this.handleEdit(item)} >
                                            <Image source={require('../../../ImageAssets/edit.png')} style={{ width: 20, height: 20 }} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        <TouchableOpacity onPress={() => this.chechDeleteShift(item)} >
                                            <Image source={require('../../../ImageAssets/delete.png')} style={{ width: 20, height: 20 }} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        {/* <Image source={require('../../../ImageAssets/delete.png')} style={{ width: 20, height: 20 }} /> */}
                                    </View>
                                </View>
                            </View>
                        </View>
                    );
                }
                else {
                    return (
                        <View
                            style={styles.rowFront3}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderRightWidth: 1, }}>
                                        <Text style={styles.HeaderTextTitleSemiBold}>{item._clock_time.split(" ")[1].split(":")[0] + ":" + item._clock_time.split(" ")[1].split(":")[1]}</Text>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={styles.HeaderTextTitleSemiBold}>{item._title} </Text>
                                    </View>
                                </View>
                                <View style={{ flex: 0.5, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        {/* <Image source={require('../../../ImageAssets/add.png')} style={{ width: 20, height: 20, }} /> */}
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        <TouchableOpacity onPress={() => this.handleEdit(item)} >
                                            <Image source={require('../../../ImageAssets/edit.png')} style={{ width: 20, height: 20 }} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        {/* <Image source={require('../../../ImageAssets/delete.png')} style={{ width: 20, height: 20 }} /> */}
                                    </View>
                                </View>
                            </View>
                        </View>
                    );

                }

            }
        }


    }
    pressNotification() {
        this.setState({ notificationView: <View></View> });
        constants.noificationCount = 0;
        this.props.navigation.navigate("NotificationScreen");
    }
    async getOfflineStorageData() {

        var today = moment(new Date());
        var offlineApplevel = await AsyncStorage.getItem("attendanceData");
        var lastEntry = await AsyncStorage.getItem("lastEntry");
        if (lastEntry !== null) {
            var lastEntryData = JSON.parse(lastEntry);
            if (today.diff(lastEntryData.date, 'days') !== 0) {
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
                        
                       
                      
                        if (attendance_data.length > 0) {
                           
                            // for (let index = 0; index < todayAttemArray.length; index++) {
                            //   if (todayAttemArray[index].title === 'EndDuty') {
                            //     check = true;
                            //   }
                            // }

                            // if (check) {
                            //     this.props.navigation.navigate('AlreadyLoggedScreen');
                            //   } else {
                            //     this.props.navigation.navigate('BreakScreen');
                            //   }
                  
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
    render() {
        // debugger
        const actions = [
            {
                text: "Start Duty",
                icon: require("../../../ImageAssets/cup.png"),
                name: "start_duty",
                position: 1
            },
            {
                text: "Start Break",
                icon: require("../../../ImageAssets/cup.png"),
                name: "start_break",
                position: 2
            },
            {
                text: "End Break",
                icon: require("../../../ImageAssets/end.png"),
                name: "end_break",
                position: 3
            },
            {
                text: "End Duty",
                icon: require("../../../ImageAssets/end.png"),
                name: "end_duty",
                position: 4
            }
        ];
        // let clockInTime = 0
        return (
            <Container>
                <StatusBar barStyle="light-content" hidden={false} backgroundColor={constants.colorPurpleLight595278} translucent={false} />
                <Loader loading={this.state.isLoading}></Loader>
                <HeaderView name={this.state.profileDataSurce._firstname + " " + this.state.profileDataSurce._lastname} context={this} notificationCount={this.state.noificationCount} />
               
                <DropdownAlert infoColor={constants.coloBrownFFF5DA} titleStyle={{ color: constants.colorGrey838383, fontWeight: 'bold', }}
                    messageStyle={{ color: constants.colorGrey838383, fontWeight: 'bold', fontSize: 12 }} imageStyle={{
                        padding: 8,
                        tintColor: constants.colorGrey838383,
                        alignSelf: 'center',
                    }}
                    ref={ref => this.dropDownAlertRef = ref} />
                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this.checkDatePick.bind(this)}
                    onCancel={this.hideDateTimePicker}
                    titleIOS="Please select time"
                    locale="en_GB"
                    mode={"time"}
                />
                <DropdownAlert infoColor={constants.coloBrownFFF5DA} titleStyle={{ color: constants.colorWhitefcfcfc, fontWeight: 'bold', }}
                    messageStyle={{ color: constants.colorWhitefcfcfc, fontWeight: 'bold', fontSize: 12 }} imageStyle={{
                        padding: 8,
                        tintColor: constants.colorWhitefcfcfc,
                        alignSelf: 'center',
                    }}
                    ref={ref => this.dropDownAlertRef1 = ref} />

              <DropdownAlert
                  infoColor={constants.colorRedFD3232}
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
               ref={ref => (this.dropDownAlertRefRed = ref)}
             />
                <Modal
                    transparent
                    animationType={'none'}
                    visible={this.state.isLoadingIndicator}
                    onRequestClose={() => { console.log('close modal') }}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: constants.colorPurpleDark302757, opacity: 0.8 }}>
                        <View>
                            <Text style={styles.buttonText}>YOU ARE DELETING </Text>
                            <Text style={styles.buttonText}>THE WHOLE DUTY SHIFT </Text>
                            <Text style={[styles.buttonText, { marginTop: 20 }]}> Delete this entry?</Text>
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>

                                <TouchableOpacity onPress={() => this.deleteShift()} style={{ flex: 1, backgroundColor: 'white', height: 40, borderRadius: 5, width: 40, justifyContent: 'center', alignItems: 'center', marginRight: 10 }}><Text>Yes</Text></TouchableOpacity>
                                <TouchableOpacity style={{ flex: 1, backgroundColor: 'white', height: 40, borderRadius: 5, width: 40, alignItems: 'center', justifyContent: 'center' }} onPress={() => this.hideLoading()}><Text>No</Text></TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <ImageBackground source={require('../../../ImageAssets/background.png')}
                    style={[styles.mainImageBackground, { backgroundColor: 'white' }]}>
                  
                    <View
                         style={{alignItems: "center", marginRight: 18, marginTop: 10, flexDirection:"row", justifyContent:"space-between"}}>
                                   <Text style={{textAlign:"center",marginLeft: 22, }}>
                          Date: {this.props.navigation.state.params.selectedDate}
                      </Text>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                          <EntypoIcons name="circle-with-cross" color="Red" size={24} />
                         </TouchableOpacity>
                          </View>
                    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'white', opacity: 0.5, marginBottom: 30, marginTop: 5, marginLeft: 20, marginRight: 20, borderRadius: 5, borderTopWidth: 1, borderTopColor: "BLACK", borderLeftWidth: 1, borderLeftColor: "black" }}>
                      
                        <FlatList

                            data={this.state.dailyLogsModelDataSource}
                            renderItem={this._renderItem}

                        />
                        <View style={[styles.transparentInputBox1, { marginBottom: 90, backgroundColor: 'white' }]}>
                            <Text style={{ textAlign: 'center', fontSize: 16, color: constants.coloBlue2f2756 }}>Total Working hours : {this.state.timeWorked}</Text>
                        </View>
                        <FloatingAction
                            actions={actions}
                            onPressItem={(name) => this.handleAdd(name)}

                        />
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

        );
    }
}
