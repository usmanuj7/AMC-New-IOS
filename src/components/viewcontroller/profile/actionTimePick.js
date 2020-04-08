import React from 'react';
import {
  ListView,
  View,
  StatusBar,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Alert,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  ScrollView,
  AsyncStorage,
  BackHandler,
} from 'react-native';
import {
  Container,
  Body,
  Title,
  Center,
  Content,
  Footer,
  FooterTab,
  Button,
  Right,
  Left,
} from 'native-base';
import styles from '../../../Style';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import WebServicesManager from '../../managers/webServicesManager/WebServicesManager';
import HeaderView from '../Header/Header';
import TimePicker from 'react-native-24h-timepicker';
import PropTypes from 'prop-types';
import moment from 'moment';
import Utilities from '../../../utilities/Utilities';
import constants from '../../../constants/constants';
import LeaveModel from '../../Models/LeaveModel';
import DailyLogsModel from '../../Models/DailyLogsModel';
import DropdownAlert from 'react-native-dropdownalert';

const hours = [
  {key: 'MARIA', title: '00'},
  {key: 'MARIA', title: '01'},
  {key: 'MARIA', title: '02'},
  {key: 'MARIA', title: '03'},
  {key: 'MARIA', title: '04'},
  {key: 'MARIA', title: '05'},
  {key: 'MARIA', title: '06'},
  {key: 'MARIA', title: '07'},
  {key: 'MARIA', title: '08'},
  {key: 'MARIA', title: '09'},
  {key: 'MARIA', title: '10'},
  {key: 'MARIA', title: '11'},
  {key: 'MARIA', title: '12'},
  {key: 'MARIA', title: '13'},
  {key: 'MARIA', title: '14'},
  {key: 'MARIA', title: '15'},
  {key: 'MARIA', title: '16'},
  {key: 'MARIA', title: '17'},
  {key: 'MARIA', title: '18'},
  {key: 'MARIA', title: '19'},
  {key: 'MARIA', title: '20'},
  {key: 'MARIA', title: '21'},
  {key: 'MARIA', title: '22'},
  {key: 'MARIA', title: '23'},
];
const minutes = [
  {key: 'MARIA', title: '00'},
  {key: 'MARIA', title: '01'},
  {key: 'MARIA', title: '02'},
  {key: 'MARIA', title: '03'},
  {key: 'MARIA', title: '04'},
  {key: 'MARIA', title: '05'},
  {key: 'MARIA', title: '06'},
  {key: 'MARIA', title: '07'},
  {key: 'MARIA', title: '08'},
  {key: 'MARIA', title: '09'},
  {key: 'MARIA', title: '10'},
  {key: 'MARIA', title: '11'},
  {key: 'MARIA', title: '12'},
  {key: 'MARIA', title: '13'},
  {key: 'MARIA', title: '14'},
  {key: 'MARIA', title: '15'},
  {key: 'MARIA', title: '16'},
  {key: 'MARIA', title: '17'},
  {key: 'MARIA', title: '18'},
  {key: 'MARIA', title: '19'},
  {key: 'MARIA', title: '20'},
  {key: 'MARIA', title: '21'},
  {key: 'MARIA', title: '22'},
  {key: 'MARIA', title: '23'},
  {key: 'MARIA', title: '24'},
  {key: 'MARIA', title: '25'},
  {key: 'MARIA', title: '26'},
  {key: 'MARIA', title: '27'},
  {key: 'MARIA', title: '28'},
  {key: 'MARIA', title: '29'},
  {key: 'MARIA', title: '30'},
  {key: 'MARIA', title: '31'},
  {key: 'MARIA', title: '32'},
  {key: 'MARIA', title: '33'},
  {key: 'MARIA', title: '34'},
  {key: 'MARIA', title: '35'},
  {key: 'MARIA', title: '36'},
  {key: 'MARIA', title: '37'},
  {key: 'MARIA', title: '38'},
  {key: 'MARIA', title: '39'},
  {key: 'MARIA', title: '40'},
  {key: 'MARIA', title: '41'},
  {key: 'MARIA', title: '42'},
  {key: 'MARIA', title: '43'},
  {key: 'MARIA', title: '44'},
  {key: 'MARIA', title: '45'},
  {key: 'MARIA', title: '46'},
  {key: 'MARIA', title: '47'},
  {key: 'MARIA', title: '48'},
  {key: 'MARIA', title: '49'},
  {key: 'MARIA', title: '50'},
  {key: 'MARIA', title: '51'},
  {key: 'MARIA', title: '52'},
  {key: 'MARIA', title: '53'},
  {key: 'MARIA', title: '54'},
  {key: 'MARIA', title: '55'},
  {key: 'MARIA', title: '56'},
  {key: 'MARIA', title: '57'},
  {key: 'MARIA', title: '58'},
  {key: 'MARIA', title: '59'},
];
const colon = [
  {key: 'MARIA', title: ':'},
  {key: 'MARIA', title: ':'},
  {key: 'MARIA', title: ':'},
  {key: 'MARIA', title: ':'},
  {key: 'MARIA', title: ':'},
  {key: 'MARIA', title: ':'},
  {key: 'MARIA', title: ':'},
  {key: 'MARIA', title: ':'},
  {key: 'MARIA', title: ':'},
  {key: 'MARIA', title: ':'},
  {key: 'MARIA', title: ':'},
  {key: 'MARIA', title: ':'},
  {key: 'MARIA', title: ':'},
  {key: 'MARIA', title: ':'},
  {key: 'MARIA', title: ':'},
  {key: 'MARIA', title: ':'},
  {key: 'MARIA', title: ':'},
  {key: 'MARIA', title: ':'},
  {key: 'MARIA', title: ':'},
  {key: 'MARIA', title: ':'},
  {key: 'MARIA', title: ':'},
  {key: 'MARIA', title: ':'},
  {key: 'MARIA', title: ':'},
  {key: 'MARIA', title: ':'},
];
export default class ActionTimePick extends React.Component {
  WebServicesManager = new WebServicesManager();
  constructor(props) {
    super(props);

    this.state = {
      profileDataSurce: [],
      dailyLogsModelDataSource: '',
      minutes: '',
      indexofSelectedHours: '',
      indexofSelectedMinutes: '',
      selectedHours: '',
      selectedMinutes: '',
      attendance_id: '',
      clocktimeToCheck: '',
      noificationCount: 0,
    };
    // userInfo: '',
  }
  static propTypes = {
    context: PropTypes.object.isRequired,
    selectedItem: PropTypes.object.isRequired,
    fullData: PropTypes.array.isRequired,
  };
  async componentWillMount() {

    const profile = await AsyncStorage.getItem('profileData');
    var profileData = JSON.parse(profile);
    this.setState({profileDataSurce: profileData});


    this.setState({
      clocktimeToCheck: this.props.navigation.state.params.selectedItem
        ._clock_time,
    });
    this.setState({
      indexofSelectedHours: this.props.navigation.state.params.selectedItem._clock_time
        .split(' ')[1]
        .split(':')[0],
    });
    this.setState({
      indexofSelectedMinutes: this.props.navigation.state.params.selectedItem._clock_time
        .split(' ')[1]
        .split(':')[1],
    });

    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    var Leave = {
      staffid: this.props.navigation.state.params.selectedItem._staffid,
      clock_date: moment(
        this.props.navigation.state.params.selectedItem._clock_date,
      ).format('YYYY-MM-DD'),
    };
    this.WebServicesManager.postApiDailyAttendence(
      {dataToInsert: Leave, apiEndPoint: 'get_daily_attendance_log'},
      (statusCode, response) => {
        if (Utilities.checkAPICallStatus(statusCode)) {
          if (response.attendance_data.length >= 0) {
            this.setState({
              attendance_id: response.attendance_data[0].attendance_id,
            });
          } else if (statusCode === 400) {
            this.dropDownAlertRef.alertWithType(
              'info',
              'Alert',
              'Please check your internet connection',
            );
          }
        }
      },
    );
  }

  async saveToStorage(attendanceData) {
    await Utilities.saveToStorage('lastEntry', attendanceData);
    await Utilities.saveToStorage('startDutyTimeToday', attendanceData);
    setTimeout(() => {
      this.props.navigation.navigate('CalanderScreen');
    }, 3000);
  }
  getTimeData(title){

    var _date = this.props.navigation.state.params.selectedItem._clock_date;
    
    console.log(`date is   ${JSON.stringify(moment(_date).format("YYYY-MM-DD"))}`)

    debugger
    let temp ;
    data.map((x)=>{ x._title===title ? temp = x: null})
    console.log(`refined data is  ${JSON.stringify(temp)}`)
    const x = temp._clock_time.split(" ")
    const fullTime = x[1]
    console.log(`full time is ${JSON.stringify(fullTime)}`)

    const y = fullTime.split(":")
    const hours = parseInt(y[0]) 
    console.log(`hours are  ${JSON.stringify(hours)}`)
    const minutes = parseInt(y[1]) 
    console.log(`minutes are  ${JSON.stringify(minutes)}`)

    const time = {
      hour: hours,
      min : minutes,
    }
    // return time;
  }

currentDayChecks(){
  const selectedHours = parseInt(this.state.indexofSelectedHours)
    console.log(`selected minutes are  ${JSON.stringify(selectedHours)}`)

    const selectedMinutes = parseInt(this.state.indexofSelectedMinutes)
    console.log(`selected minutes are  ${JSON.stringify(selectedMinutes)}`)
    // this.props.navigation.state.params.selectedDate

    var today = new Date();
    var hour = parseInt(today.getHours())  ;
    var min = parseInt(today.getMinutes()) ;

    if(selectedHours<hour){
      this.Save();

    }
    else if(selectedHours===hour){
      if(selectedMinutes<min){
      this.Save();
      }
      else{
        this.dropDownAlertRef1.alertWithType(
          'info',
          'Alert',
          'Please select valid time',
        );
      }
      
  
    }else{
      this.dropDownAlertRef1.alertWithType(
        'info',
        'Alert',
        'Please select valid time',
      );
    }
}

  checkSave(){
 
    console.log(`date is ${this.props.navigation.state.params.selectedDate}`)
    var selectedDate = this.props.navigation.state.params.selectedDate
    var today = moment(new Date());
    console.log(`date is ${today}`)
     if (today.diff(selectedDate, 'days') !== 0) {
       debugger
       console.log("iff called")
       this.Save();
      
     }
     else{
      console.log("else called")
      this.currentDayChecks();
     }
  }

  async Save() {
    var context = this;
    var _date = this.props.navigation.state.params.selectedItem._clock_date;
    moment(_date)
    var cc = this.props.navigation.state.params.context;
    // debugger
    cc.startDutyInterval = 0;
    cc.endBreakInterval= 0;

    var profile = {
      staff_clocktime_id: this.props.navigation.state.params.selectedItem
        ._staff_clocktime_id,
      time:
        this.state.indexofSelectedHours +
        ':' +
        this.state.indexofSelectedMinutes +
        ':' +
        '00',
      clock_date: this.props.navigation.state.params.selectedItem._clock_date,
    };


    console.log(`${JSON.stringify(profile)}`)
    // debugger
    var todayTimeDataArray = await AsyncStorage.getItem('todayTime');

    this.WebServicesManager.postMethodUpdateTime(
      {dataToInsert: profile, apiEndPoint: 'update_time'},
      (statusCode, response) => {
        console.log(`status code is ${statusCode} description ${response.description}`)
        if (Utilities.checkAPICallStatus(statusCode)) {
          if (Utilities.checkAPICallStatus(response.responseCode)) {
          this.setState({isLoadingIndicator: false});
          this.dropDownAlertRef.alertWithType(
            'info',
            'Alert',
            'Record is updated successfully',
          );

          var todayTimeDataArrayTemp = todayTimeDataArray;
          var todayAttemArray = JSON.parse(todayTimeDataArrayTemp);
          var profileTemp = profile;
          var selectedItemTemp =
            context.props.navigation.state.params.selectedItem;

          console.log(
            `today attem array ${JSON.stringify(todayTimeDataArrayTemp)}`,
          );

          if (todayAttemArray !== null) {
            // debugger
            for (let index = 0; index < todayAttemArray.length; index++) {
              if (todayAttemArray[index].title === 'StartDuty') {
                if (
                  todayAttemArray.hasOwnProperty(index) &&
                  todayAttemArray[index].title ===
                    selectedItemTemp._title.replace(/\s+/g, '') &&
                  todayAttemArray[index].date === selectedItemTemp._clock_date
                ) {
                  todayAttemArray[index].clock_in = profileTemp.time;

                  var attendanceData = {
                    title: 'StartDuty',
                    date: this.props.navigation.state.params.selectedItem
                      ._clock_date,
                    staffid: this.props.navigation.state.params.selectedItem
                      ._staffid,
                    clock_in:
                      this.state.indexofSelectedHours +
                      ':' +
                      this.state.indexofSelectedMinutes +
                      ':' +
                      '00',
                  };
                  Utilities.saveToStorage('lastEntry', attendanceData);
                  Utilities.saveToStorage('startDutyTimeToday', attendanceData);
                }
              }
              if (todayAttemArray[index].title === 'StartBreak') {
                if (
                  todayAttemArray.hasOwnProperty(index) &&
                  todayAttemArray[index].title ===
                    selectedItemTemp._title.replace(/\s+/g, '') &&
                  todayAttemArray[index].clock_date ===
                    selectedItemTemp._clock_date
                ) {
                  todayAttemArray[index].swipe_time = profileTemp.time;
                }
              }
              if (todayAttemArray[index].title === 'EndBreak') {
                if (
                  todayAttemArray.hasOwnProperty(index) &&
                  todayAttemArray[index].title ===
                    selectedItemTemp._title.replace(/\s+/g, '') &&
                  todayAttemArray[index].clock_date ===
                    selectedItemTemp._clock_date
                ) {
                  todayAttemArray[index].swipe_time = profileTemp.time;
                }
              }
              if (todayAttemArray[index].title === 'EndDuty') {
                if (
                  todayAttemArray.hasOwnProperty(index) &&
                  todayAttemArray[index].title ===
                    selectedItemTemp._title.replace(/\s+/g, '') &&
                  todayAttemArray[index].date === selectedItemTemp._clock_date
                ) {
                  todayAttemArray[index].clock_out = profileTemp.time;
                  var attendanceData1 = {
                    title: 'EndDuty',
                    date: this.props.navigation.state.params.selectedItem
                      ._clock_date,
                    staffid: this.props.navigation.state.params.selectedItem
                      ._staffid,
                    clock_out:
                      this.state.indexofSelectedHours +
                      ':' +
                      this.state.indexofSelectedMinutes +
                      ':' +
                      '00',
                  };
                  console.log(
                    `attandance data is  ${JSON.stringify(attendanceData1)}`,
                  );
                  // debugger;
                   Utilities.saveToStorage("lastEntry", attendanceData1);
                  Utilities.saveToStorage('startEndDutyToday', attendanceData1);
                }
              }
            }
            Utilities.saveToStorage('todayTime', todayAttemArray);
            setTimeout(() => {
              // this.props.navigation.navigate('CalanderScreen'); 
              
              this.props.navigation.navigate('LogDataScreen',{selectedDate:moment(_date).format("YYYY-MM-DD")}); 
              cc.componentDidMount()

            }, 3000);
          } else {
            // debugger
            if (
              selectedItemTemp._title === 'Start Duty' &&
              moment(new Date()).format('YYYY-MM-DD') ===
                selectedItemTemp._clock_date
            ) {
              var attendanceData = {
                title: 'StartDuty',
                date: this.props.navigation.state.params.selectedItem
                  ._clock_date,
                staffid: this.props.navigation.state.params.selectedItem
                  ._staffid,
                clock_in:
                  this.state.indexofSelectedHours +
                  ':' +
                  this.state.indexofSelectedMinutes +
                  ':' +
                  '00',
              };
              Utilities.saveToStorage('lastEntry', attendanceData);
              Utilities.saveToStorage('startDutyTimeToday', attendanceData);
              Utilities.saveToStorage('todayTime', todayAttemArray);
              setTimeout(() => {
                // this.props.navigation.navigate('CalanderScreen');
               
                this.props.navigation.navigate('LogDataScreen',{selectedDate:moment(_date).format("YYYY-MM-DD")});
                cc.componentDidMount()

              }, 3000);
            }

            if (
              selectedItemTemp._title === 'End Duty' &&
              moment(new Date()).format('YYYY-MM-DD') ===
                selectedItemTemp._clock_date
            ) {
              var attendanceData = {
                title: 'EndDuty',
                date: this.props.navigation.state.params.selectedItem
                  ._clock_date,
                staffid: this.props.navigation.state.params.selectedItem
                  ._staffid,
                clock_out:
                  this.state.indexofSelectedHours +
                  ':' +
                  this.state.indexofSelectedMinutes +
                  ':' +
                  '00',
              };
              Utilities.saveToStorage('lastEntry', attendanceData);
              Utilities.saveToStorage('startEndDutyToday', attendanceData);
              Utilities.saveToStorage('todayTime', todayAttemArray);
              setTimeout(() => {
                // this.props.navigation.navigate('CalanderScreen');
               
                this.props.navigation.navigate('LogDataScreen',{selectedDate:moment(_date).format("YYYY-MM-DD")});
                cc.componentDidMount()
              }, 3000);
            }

            if (
              selectedItemTemp._title === 'Start Break' &&
              moment(new Date()).format('YYYY-MM-DD') ===
                selectedItemTemp._clock_date
            ) {
              var attendanceData = {
                title: 'StartBreak',
                clock_date: this.props.navigation.state.params.selectedItem
                  ._clock_date,
                status: 101,
                staffid: this.props.navigation.state.params.selectedItem
                  ._staffid,
                swipe_time:
                  this.state.indexofSelectedHours +
                  ':' +
                  this.state.indexofSelectedMinutes +
                  ':' +
                  '00',
              };
              Utilities.saveToStorage('todayTime', attendanceData);
              setTimeout(() => {
                // this.props.navigation.navigate('CalanderScreen');
               
                this.props.navigation.navigate('LogDataScreen',{selectedDate:moment(_date).format("YYYY-MM-DD")});
                cc.componentDidMount()
              }, 3000);
            }
            if (
              selectedItemTemp._title === 'End Break' &&
              moment(new Date()).format('YYYY-MM-DD') ===
                selectedItemTemp._clock_date
            ) {
              var attendanceData = {
                title: 'EndBreak',
                clock_date: this.props.navigation.state.params.selectedItem
                  ._clock_date,
                status: 101,
                staffid: this.props.navigation.state.params.selectedItem
                  ._staffid,
                swipe_time:
                  this.state.indexofSelectedHours +
                  ':' +
                  this.state.indexofSelectedMinutes +
                  ':' +
                  '00',
              };
              Utilities.saveToStorage('todayTime', attendanceData);
              setTimeout(() => {
                // this.props.navigation.navigate('CalanderScreen');
             
                this.props.navigation.navigate('LogDataScreen',{selectedDate:moment(_date).format("YYYY-MM-DD")});
                cc.componentDidMount()
              }, 3000);
            }
          }
        }
          else {
            console.log(`else called des ${response.description}`)

            // this.setState({ isLoadingIndicator: false })
            this.dropDownAlertRef1.alertWithType('info', 'Error', response.description);
          }
        } else if (statusCode === 400) {
          this.dropDownAlertRef.alertWithType(
            'info',
            'Alert',
            'Please check your internet connection',
          );
        }
      },
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    this.focusListener.remove();
  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      this.setState({noificationCount: constants.noificationCount});
    });
  }

  handleBackButton = () => {
    this.props.navigation.goBack();
    return true;
  };

  _handleselectedHours = index => {
    this.setState({indexofSelectedHours: index, clocktimeToCheck: ''});
  };
  _handleselectedMinutes = index => {
    this.setState({indexofSelectedMinutes: index});
  };

  renderItem1(item1) {
    if (
      Utilities.isValidString(this.state.clocktimeToCheck) &&
      this.state.clocktimeToCheck.split(' ')[1].split(':')[0] ==
        item1.item.title
    ) {
      return (
        <TouchableOpacity
          onPress={() => this._handleselectedHours(item1.index)}
          style={styles.selected}>
          <View style={{flex: 1, flexDirection: 'column'}}>
            <View style={{alignItems: 'flex-end', justifyContent: 'flex-end'}}>
              <Text style={styles.selectedText}>{item1.item.title}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => this._handleselectedHours(item1.index)}
          style={
            this.state.indexofSelectedHours === item1.index
              ? styles.selected
              : styles.rowFrontforTimePicker
          }>
          <View style={{flex: 1, flexDirection: 'column'}}>
            <View style={{alignItems: 'flex-end', justifyContent: 'flex-end'}}>
              <Text
                style={
                  this.state.indexofSelectedHours === item1.index
                    ? styles.selectedText
                    : styles.unSelectedText
                }>
                {item1.item.title}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  }
  renderItem3(item3) {
    return (
      <View style={styles.rowFrontforTimePicker}>
        <View style={{flex: 1, flexDirection: 'column'}}>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{fontWeight: 'bold'}}>{item3.item.title}</Text>
          </View>
        </View>
      </View>
    );
  }
  renderItem2(item2) {
    if (
      Utilities.isValidString(this.state.clocktimeToCheck) &&
      this.state.clocktimeToCheck.split(' ')[1].split(':')[1] ==
        item2.item.title
    ) {
      return (
        <TouchableOpacity
          onPress={() => this._handleselectedMinutes(item2.index)}
          style={styles.selected}>
          <View style={{flex: 0.5, flexDirection: 'column'}}>
            <View
              style={{alignItems: 'flex-start', justifyContent: 'flex-start'}}>
              <Text style={styles.selectedText}>{item2.item.title}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => this._handleselectedMinutes(item2.index)}
          style={
            this.state.indexofSelectedMinutes === item2.index
              ? styles.selected
              : styles.rowFrontforTimePicker
          }>
          <View style={{flex: 0.5, flexDirection: 'column'}}>
            <Text
              style={
                this.state.indexofSelectedMinutes === item2.index
                  ? styles.selectedText
                  : styles.unSelectedText
              }>
              {item2.item.title}
            </Text>
          </View>
        </TouchableOpacity>
      );
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

  render() {
    return (
      <Container>
        <StatusBar
          barStyle="light-content"
          hidden={false}
          backgroundColor={constants.colorPurpleLight595278}
          translucent={false}
        />
        <HeaderView
          name={
            this.state.profileDataSurce._firstname +
            ' ' +
            this.state.profileDataSurce._lastname
          }
          context={this}
          notificationCount={this.state.noificationCount}
        />
        <DropdownAlert
          infoColor={constants.coloBrownFFF5DA}
          titleStyle={{color: constants.colorGrey838383, fontWeight: 'bold'}}
          messageStyle={{
            color: constants.colorGrey838383,
            fontWeight: 'bold',
            fontSize: 12,
          }}
          imageStyle={{
            padding: 8,
            tintColor: constants.colorGrey838383,
            alignSelf: 'center',
          }}
          ref={ref => (this.dropDownAlertRef = ref)}
        />

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
          ref={ref => (this.dropDownAlertRef1 = ref)}
        />
        <ImageBackground
          source={require('../../../ImageAssets/background.png')}
          style={[styles.mainImageBackground]}>
          <View
            style={{
              flex: 2,
              alignContent: 'center',
              marginTop: 10,
              marginLeft: 20,
              marginRight: 20,
              borderRadius: 5,
            }}>
            <View
              style={{alignItems: 'flex-end', marginRight: 10, marginTop: 10}}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <EntypoIcons name="circle-with-cross" color="Red" size={24} />
              </TouchableOpacity>
            </View>
            <View style={{flex: 0.8, flexDirection: 'row', marginBottom: 10}}>
              <FlatList
                vertical
                showsVerticalScrollIndicator={false}
                extraData={this.state}
                data={hours}
                ref={e => (this.data1 = e)}
                renderItem={this.renderItem1.bind(this)}
              />
              <FlatList
                vertical
                showsVerticalScrollIndicator={false}
                data={colon}
                renderItem={this.renderItem3}
              />
              <FlatList
                vertical
                showsVerticalScrollIndicator={false}
                data={minutes}
                extraData={this.state}
                ref={e => (this.data2 = e)}
                renderItem={this.renderItem2.bind(this)}
              />
            </View>
            <View style={{flex: 0.2, marginBottom: 10}}>
              <Button
                onPress={() => this.checkSave()}
                style={{
                  borderRadius: 7,
                  backgroundColor: constants.colorRed9d0000,
                  height: 40,
                  justifyContent: 'center',
                }}>
                <Text style={{textAlign: 'center', color: 'white'}}>Save</Text>
              </Button>
            </View>
          </View>
          <Footer
            style={{
              position: 'absolute',
              bottom: 0,
            }}>
            <Button
            onPress={() => this.goToFirstTab()}
              // onPress={() => this.props.navigation.navigate('DashboardScreen')}
              style={styles.footerButtonInactive}
              vertical>
              {/* <Icon name="home" style={{paddingTop:20}} color='white' size={24}/> */}
              <Image
                source={require('../../../ImageAssets/home.png')}
                style={{width: 20, height: 20}}
              />
              <Text style={{color: 'white', fontSize: 10}}>Home</Text>
            </Button>
            <Button
              onPress={() => this.props.navigation.navigate('LeaveScreen')}
              vertical
              style={styles.footerButtonInactive}>
              {/* <Icon name="home"  color='white' size={24}/> */}
              <Image
                source={require('../../../ImageAssets/leave.png')}
                style={{width: 20, height: 20}}
              />
              <Text style={{color: 'white', fontSize: 10}}>Leave</Text>
            </Button>
            <Button
              onPress={() => this.props.navigation.navigate('CalanderScreen')}
              vertical
              style={styles.footerButtonInactive}>
              {/* <Icon active name="navigate" color='white' size={24}/> */}
              <Image
                source={require('../../../ImageAssets/logs.png')}
                style={{width: 20, height: 20}}
              />
              <Text style={{color: 'white', fontSize: 10}}>Logs</Text>
            </Button>
            <Button
              onPress={() => this.props.navigation.navigate('ActionTimePick')}
              vertical
              style={styles.footerButtonInactive}>
              {/* <Icon name="profile"  color='white' size={24}/> */}
              <Image
                source={require('../../../ImageAssets/profile.png')}
                style={{width: 20, height: 20}}
              />
              <Text style={{color: 'white', fontSize: 10}}>Profile</Text>
            </Button>
          </Footer>
        </ImageBackground>
      </Container>
    );
  }
}
