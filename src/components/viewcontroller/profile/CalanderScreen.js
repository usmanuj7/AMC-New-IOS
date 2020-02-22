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
import HeaderView from '../Header/Header'
import moment from 'moment';
import Utilities from '../../../utilities/Utilities';
import constants from '../../../constants/constants';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import CalandarLogModal from '../../Models/CalandarLogModal';
import SigninDataLogsModel from '../../Models/SigninDataLogsModel';
import LoggedHoursModal from '../../Models/LoggedHoursModal';
import DropdownAlert from 'react-native-dropdownalert';
import DeleteShiftPopUp from '../../../DeleteShiftPopUp';
import Loader from '../../../Loader';
import NetInfo from "@react-native-community/netinfo";



export default class CalanderScreen extends React.Component {
    WebServicesManager = new WebServicesManager;
    constructor(props) {
        super(props);

        this.state = {
            markedDates: '',
            profileDataSurce: '',
            DISABLED_DAYS: [],
            selectedDate: '',
            noificationCount: 0,
            calendarData: '',
            isLoadingIndicator: false,
            eventTitle: '',
            isLoadingIndicatorLoader:false,
            checkDutyDate:""
        }
        // userInfo: '',
    }
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
        //   Utilities.sendLocalStorageToServer();
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
    async componentWillMount() {
        this.setState({ selectedDate: moment(new Date()).format('YYYY-MM-DD'),isLoadingIndicatorLoader:true })
        const profile = await AsyncStorage.getItem('profileData');
        if (profile !== null) {
            var profileData = JSON.parse(profile);
            this.setState({ profileDataSurce: profileData });
            var staffData = { staffid: this.state.profileDataSurce._staffid };
            
            this.WebServicesManager.postApiCallAttendence({ dataToInsert: staffData, apiEndPoint: "get_staff_weekends" },
                (statusCode, response) => {
                    if (Utilities.checkAPICallStatus(statusCode)) {
                        var days = Utilities.getWeekDays(response.weekends_defined);

                        this.setState({ markedDates: this.getDaysInMonth(moment().month(), moment().year(), days) })
                        this.WebServicesManager.postApiCallAttendence({ dataToInsert: staffData, apiEndPoint: "get_calendar_log_data" },
                            (statusCode, response) => {
                                if (Utilities.checkAPICallStatus(statusCode)) {
                                 
                                    const obj = {};
                                    var calendarData = CalandarLogModal.parseCalandarLogModal(response.leave_types);
                                    var allDates = [];
                                    this.setState({ calendarData: calendarData });
                                    calendarData.forEach(element => {
                                        var firstDate = moment(element._start);
                                        var tocheckDate = moment(element._end);
                                        var totalDifferenceInDays = tocheckDate.diff(firstDate, 'days');
                                        if (totalDifferenceInDays >= 1) {
                                            obj[moment(element._start).format("YYYY-MM-DD")] = { selected: true, marked: true, selectedColor: element._color };
                                           var nextDay=element._start;
                                            for (let index = 0; index < totalDifferenceInDays; index++) {
                                                var nextDay = moment(moment(nextDay).format("YYYY-MM-DD")).add(1, 'day');
                                                obj[moment(nextDay).format("YYYY-MM-DD")] = { selected: true, marked: true, selectedColor: element._color };
                                            }
                                        }
                                        else
                                            obj[moment(element._start).format("YYYY-MM-DD")] = { selected: true, marked: true, selectedColor: element._color };

                                    });
                                    const vacation = { key: 'vacation', color: 'red', selectedDotColor: 'blue' };
                                    const workout = { key: 'workout', color: 'yellow' };
                                    for (var prop in obj) {

                                        if (prop in this.state.markedDates)
                                            obj[prop] = { dots: [vacation, workout], selected: true };
                                    }
                                    let merged = { ...this.state.markedDates, ...obj };
                                    this.setState({ markedDates: merged });
                                    this.setState({ isLoadingIndicatorLoader:false })

                                }
                                else if (statusCode === 400) {
                                    this.setState({ isLoadingIndicatorLoader:false })
                                    this.dropDownAlertRef.alertWithType('info', 'Alert', "Please check your internet connection");

                                }
                            });
                    }
                    else if (statusCode === 400) {
                        this.setState({ isLoadingIndicatorLoader:false })
                        this.dropDownAlertRef.alertWithType('info', 'Alert', "Please check your internet connection");

                    }
                });
        }
    }

    onMonthChange = (date) => {
        this.setState({ selectedDate: date })
        var staffData = { staffid: this.state.profileDataSurce._staffid };
        this.WebServicesManager.postApiCallAttendence({ dataToInsert: staffData, apiEndPoint: "get_staff_weekends" },
            (statusCode, response) => {
                if (Utilities.checkAPICallStatus(statusCode)) {
                    var days = Utilities.getWeekDays(response.weekends_defined);
                    this.setState({ markedDates: this.getDaysInMonth(date.month - 1, date.year, days) })
                    this.WebServicesManager.postApiCallAttendence({ dataToInsert: staffData, apiEndPoint: "get_calendar_log_data" },
                        (statusCode, response) => {
                            const obj = {};
                            if (Utilities.checkAPICallStatus(statusCode)) {
                                var calendarData = CalandarLogModal.parseCalandarLogModal(response.leave_types);
                                var allDates = [];
                                calendarData.forEach(element => {
                                    var firstDate = moment(element._start);
                                    var tocheckDate = moment(element._end);
                                    var totalDifferenceInDays = tocheckDate.diff(firstDate, 'days');
                                    if (totalDifferenceInDays >= 1) {
                                        obj[moment(element._start).format("YYYY-MM-DD")] = { selected: true, marked: true, selectedColor: element._color };
                                        for (let index = 0; index < totalDifferenceInDays; index++) {
                                            var nextDay = moment(moment(element._start).format("YYYY-MM-DD")).add(1, 'day');
                                            obj[moment(nextDay).format("YYYY-MM-DD")] = { selected: true, marked: true, selectedColor: element._color };
                                        }
                                    }
                                    else
                                        obj[moment(element._start).format("YYYY-MM-DD")] = { selected: true, marked: true, selectedColor: element._color };

                                });
                                const vacation = { key: 'vacation', color: 'red' };
                                const workout = { key: 'workout', color: 'yellow' };
                                for (var prop in obj) {

                                    if (prop in this.state.markedDates)
                                        obj[prop] = { dots: [vacation, workout], selected: true, activeOpacity: 0 }
                                }
                                let merged = { ...this.state.markedDates, ...obj };
                                this.setState({ markedDates: merged });

                            }
                            else if (statusCode === 400) {
                                this.dropDownAlertRef.alertWithType('info', 'Alert', "Please check your internet connection");

                            }
                        });
                }
                else if (statusCode === 400) {
                    this.dropDownAlertRef.alertWithType('info', 'Alert', "Please check your internet connection");

                }
            });
    }
    hideLoading = () => {
        
        this.setState({ isLoadingIndicator: false, checkDutyDate:""});

    }
    checkDuty = (startDutyDate) => {
        this.setState({ isLoadingIndicator: false, checkDutyDate:""});
        this.props.navigation.navigate("LogDataScreen", { selectedDate: moment(startDutyDate).format("YYYY-MM-DD") })

    }
    handleDayPressed(day) {
         
        if( this.state.calendarData!=="")
        {
            var arrWithallDates = [];
            var newArr = this.state.calendarData.slice();
            newArr.forEach(element => {
                var firstDate = moment(element._start);
                var tocheckDate = moment(element._end);
                var totalDifferenceInDays = tocheckDate.diff(firstDate, 'days');
                if (totalDifferenceInDays >= 1) {
                    arrWithallDates.push(element);
                    for (let index = 0; index <= totalDifferenceInDays; index++) {
                        if (index == 0) {
                            arrWithallDates.push(element);
                        }
                        else {
                            var nextDay = moment(moment(element._start).format("YYYY-MM-DD")).add(1, 'day');
                            var ob = {
                                _eventid: element._eventid, _title: element._title, _description: element._description,
                                _userid: element._userid, _start: moment(nextDay).format("YYYY-MM-DD"),_public:element._public
                            }
                            arrWithallDates.push(ob);
                        }
    
                    }
                }
                else
                    arrWithallDates.push(element);
    
            });
    
            if (arrWithallDates.find(k => moment(k._start).format("YYYY-MM-DD") == day.dateString) !== undefined) {
                var event = arrWithallDates.find(k => moment(k._start).format("YYYY-MM-DD") == day.dateString);
                if(event._public==="1")
                {
                    this.setState({ isLoadingIndicator: true, eventTitle: event._title ,checkDutyDate:event._start});
                }
                else
                {
                    this.setState({ isLoadingIndicator: true, eventTitle: event._title ,checkDutyDate:event._start});
                }
            }
            else {
                var staffData = { staffid: this.state.profileDataSurce._staffid };
                this.WebServicesManager.postApiCallAttendence({ dataToInsert: staffData, apiEndPoint: "get_staff_weekends" },
                    (statusCode, response) => {
                        if (Utilities.checkAPICallStatus(statusCode)) {
                            var days = Utilities.getWeekDays(response.weekends_defined);
                            var checkedDay = moment(day).format("YYYY-MM-DD");
                            const date = moment(day).format('dddd');
                            if (days.find(k => k == date) !== undefined) {
                                this.props.navigation.navigate("LogDataScreen", { selectedDate: moment(day.dateString).format("YYYY-MM-DD") })
                            }
                            else {
                                this.props.navigation.navigate("LogDataScreen", { selectedDate: moment(day.dateString).format("YYYY-MM-DD") })
                            }
                        }
                    });
            }
        }
        else
        {
            this.props.navigation.navigate("LogDataScreen", { selectedDate: moment(day.dateString).format("YYYY-MM-DD") })
        }
    }

    getDaysInMonth(month, year, days) {
        var pivot = moment().month(month).year(year).startOf('month')
        const end = moment().month(month).year(year).endOf('month')

        var dates = {}
        var disabled = { selected: true, selectedColor: 'red' }
        while (pivot.isBefore(end)) {
            days.forEach((day) => {
                dates[pivot.day(day).format("YYYY-MM-DD")] = disabled
            })
            pivot.add(7, 'days')
        }

        return dates
    }
    pressNotification() {
        constants.noificationCount = 0;
        this.props.navigation.navigate("NotificationScreen");
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
        var offlineApplevel = await AsyncStorage.getItem("attendanceData");
        var lastEntry = await AsyncStorage.getItem("lastEntry");

        var todayTimeDataArray = await AsyncStorage.getItem('todayTime');
        console.log(`time array is ${JSON.stringify(todayTimeDataArray)}`)
    var todayAttemArray = JSON.parse(todayTimeDataArray);
    // debugger
        if (lastEntry !== null) {
          var lastEntryData = JSON.parse(lastEntry);
          if (today.diff(lastEntryData.date_times, 'days') !== 0) {
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
    render() {

        calendarEvents = JSON.parse(JSON.stringify(this.state.markedDates))
        var currentDate = moment().format("YYYY-MM-DD");
        
        return (

            <Container>
                <StatusBar barStyle="light-content" hidden={false} backgroundColor={constants.colorPurpleLight595278} translucent={false} />
                <HeaderView name={this.state.profileDataSurce._firstname + " " + this.state.profileDataSurce._lastname} context={this} notificationCount={this.state.noificationCount} />
                <DeleteShiftPopUp loading={this.state.isLoadingIndicator} context={this} checkDutyDate={this.state.checkDutyDate} eventTitle={this.state.eventTitle}></DeleteShiftPopUp>
                <DropdownAlert infoColor={constants.coloBrownFFF5DA} titleStyle={{ color: constants.colorGrey838383, fontWeight: 'bold', }}
                    messageStyle={{ color: constants.colorGrey838383, fontWeight: 'bold', fontSize: 12 }} imageStyle={{
                        padding: 8,
                        tintColor: constants.colorGrey838383,
                        alignSelf: 'center',
                    }}
                    ref={ref => this.dropDownAlertRef = ref} />
                     <Loader loading={this.state.isLoadingIndicatorLoader}></Loader>
                <ImageBackground source={require('../../../ImageAssets/background.png')}
                    style={[styles.mainImageBackground]}>
                    <ScrollView style={{ flex: 1, alignContent: 'center', backgroundColor: 'transparent' }}>
                        <Text style={{ marginTop: 20, marginLeft: 20, fontSize: 14, color: 'black', fontWeight: '700' }}>Pick a date</Text>
                        <View style={{ borderBottomWidth: 2, borderBottomColor: constants.colorlightf2f2f2, height: 5, margin: 20 }}></View>
                        <Calendar
                            markingType={'multi-dot'}
                            // Initially visible month. Default = Date()
                            current={this.state.selectedDate}
                            // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                            minDate={'2012-05-10'}
                            // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                            // maxDate={'2020-02-22'}
                            maxDate={currentDate.toString()}
                            onMonthChange={date => this.onMonthChange(date)}
                            // Handler which gets executed on day press. Default = undefined
                            onDayPress={(day) => {
                                this.handleDayPressed(day)

                            }}
                            // Handler which gets executed on day long press. Default = undefined
                            markedDates={this.state.markedDates}
                            // Handler which gets executed when press arrow icon left. It receive a callback can go back month
                            onPressArrowLeft={substractMonth => substractMonth()}
                            // Handler which gets executed when press arrow icon left. It receive a callback can go next month
                            onPressArrowRight={addMonth => addMonth()}
                        />
                    </ScrollView>
                    <Footer style={{ backgroundColor: constants.colorPurpleLight595278 }}>
                        <Button onPress={() => this.goToFirstTab()} style={styles.footerButtonInactive} vertical>
                            <Image source={require('../../../ImageAssets/home.png')} style={{ width: 20, height: 20 }} />
                            <Text style={{ color: 'white', fontSize: 10, }}>Home</Text>
                        </Button>
                        <Button onPress={() => this.props.navigation.navigate("LeaveScreen")} vertical style={styles.footerButtonInactive} >

                            <Image source={require('../../../ImageAssets/leave.png')} style={{ width: 20, height: 20 }} />
                            <Text style={{ color: 'white', fontSize: 10, }}>Leave</Text>
                        </Button>
                        <Button onPress={() => this.props.navigation.navigate("CalanderScreen")} vertical style={styles.footerButtonActive}>
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

        );
    }
}
