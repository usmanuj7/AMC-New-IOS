import React from 'react';
import {
  ListView,
  View,
  StatusBar,
  Text,
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
import NetInfo from '@react-native-community/netinfo';
import styles from '../../../Style';
import WebServicesManager from '../../managers/webServicesManager/WebServicesManager';
import DropdownAlert from 'react-native-dropdownalert';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import constants from '../../../constants/constants';
import HeaderView from '../Header/Header';
import Utilities from '../../../utilities/Utilities';
import AttendanceModel from '../../Models/AttendanceModel';
import moment from 'moment';
import Loader from '../../../Loader';
import DailyLogsModel from '../../Models/DailyLogsModel';

export default class Break extends React.Component {
  WebServicesManager = new WebServicesManager();
  constructor(props) {
    super(props);

    this.state = {
      profileDataSurce: '',
      attendenceModel: [],
      checkedDate: '',
      isLoadingIndicator: false,
      noificationCount: 0,
      connectionCount: 0,
      startDutyTime: '',
    };
    // userInfo: '',
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    this.focusListener.remove();
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this._handleConnectivityChange,
    );
  }
  componentDidMount() {
    Utilities.connectionCount = 0;
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      this.setState({noificationCount: constants.noificationCount});
      this.componentWillMount();
    });
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this._handleConnectivityChange,
    );

    NetInfo.isConnected.fetch().done(isConnected => {
      if (isConnected == true) {
        this.setState({connection_Status: 'Online'});
      } else {
        this.setState({connection_Status: 'Offline'});
      }
    });
  }
  toggleLoader(status) {
    // this.setState({isLoadingIndicator:status})
  }
  _handleConnectivityChange = isConnected => {
    if (isConnected == true) {
      if (this.state.connectionCount == 1) Utilities.sendLocalStorageToServer();
      this.setState({connectionCount: 1});
    } else {
      this.setState({connection_Status: 'Offline'});
      this.setState({connectionCount: 1});
    }
  };
  handleBackButton = () => {
    BackHandler.exitApp();
    return true;
  };
  async componentWillMount() {
    var startDutyTimeToday = await AsyncStorage.getItem('startDutyTimeToday');

    console.log(`start duty checking ${startDutyTimeToday}`)
    if (startDutyTimeToday !== null){
      var abc = JSON.parse(startDutyTimeToday).clock_in;
      console.log(`start duty abc ${abc}`)

    
      // var startDutyTime=moment(JSON.parse(startDutyTimeToday).date+" "+JSON.parse(startDutyTimeToday).clock_in).format("HH:mm:ss")
   if(abc !== undefined ){
    console.log(`if called ${abc}`)

    var d = abc;
    var n = parseInt(d.split(':')[0]);
    if (n < 10) n = '0' + n;
    var m = parseInt(d.split(':')[1]);
    if (m < 10) m = '0' + m;
    var p = parseInt(d.split(':')[2]);
    if (p < 10) p = '0' + p;
    this.setState({startDutyTime: n + ':' + m + ':' + p});
   }
  else{
    console.log(`else called ${abc}`)
  }
  }

    // var startDutyTime=moment("06-17-2015T14:24:36").format("HH:mm:ss")
    console.log(`start duty checking after set state${startDutyTimeToday}`)
    this.setState({checkedDate: new Date()});
    const profile = await AsyncStorage.getItem('profileData');

    if (profile !== null) {
      var profileData = JSON.parse(profile);
      this.setState({profileDataSurce: profileData});
      var Leave = {
        staffid: profileData._staffid,
        clock_date: moment(new Date()).format('YYYY-MM-DD'),
      };
      this.WebServicesManager.postApiDailyAttendence(
        {dataToInsert: Leave, apiEndPoint: 'get_daily_attendance_log'},
        (statusCode, response) => {
          if (Utilities.checkAPICallStatus(statusCode)) {
            var startDutyTime = moment(
              response.attendance_data[0].clock_time,
            ).format('HH:mm:ss');

            this.setState({startDutyTime: startDutyTime});
          }
        },
      );
    } else {
      var profileData = constants.profileData;
      this.setState({profileDataSurce: profileData});
    }
  }

  async handleStartBreak() {
    console.log("start breat above loading true")
   this.setState({isLoadingIndicator: true});
    const todayTimePrevArray = await AsyncStorage.getItem('todayTime');
    var today = moment(new Date());

    var Leave = {
      staffid: this.state.profileDataSurce._staffid,
      clock_date: moment(new Date()).format('YYYY-MM-DD'),
    };
    this.WebServicesManager.postApiDailyAttendence(
      {dataToInsert: Leave, apiEndPoint: 'get_daily_attendance_log'},
      (statusCode, response) => {
        if (Utilities.checkAPICallStatus(statusCode)) {
          var dailyLogsModelDataSource = DailyLogsModel.parseDailyLogsModelFromJSON(
            response.attendance_data,
          );
          if (dailyLogsModelDataSource.length > 0) {
            var attendence = {
              title: 'StartBreak',
              staffid: this.state.profileDataSurce._staffid,
              attendance_id: dailyLogsModelDataSource[0]._attendance_id,
              status: '101',
              swipe_time:
                new Date().getHours() +
                ':' +
                new Date().getMinutes() +
                ':' +
                new Date().getSeconds(),
              clock_date: moment(new Date()).format('YYYY-MM-DD'),
            };
            this.WebServicesManager.postMethodStartBreak(
              {dataToInsert: attendence, apiEndPoint: 'add_break_start'},
              (statusCode, response) => {
                if (Utilities.checkAPICallStatus(response.responseCode)) {
                  var attendanceData = {
                    title: 'StartBreak',
                    staffid: this.state.profileDataSurce._staffid,
                    attendance_id: '',
                    status: '101',
                    swipe_time:
                      new Date().getHours() +
                      ':' +
                      new Date().getMinutes() +
                      ':' +
                      new Date().getSeconds(),
                    clock_date: moment(new Date()).format('YYYY-MM-DD'),
                  };
                  this.setofflineData(attendanceData);

                  Utilities.saveToStorage('lastEntry', attendanceData);
                  Utilities.saveToStorage(
                    'startBreakTimeToday',
                    attendanceData,
                  ).then(value => {
                    AsyncStorage.setItem('appLevel', 'EndDutyScreen').then(
                      value => {
                        this.setState({isLoadingIndicator: false});
                        this.props.navigation.navigate('EndDutyScreen');
                      },
                    );
                  });
                } else if (statusCode === 400) {
                  var attendence = {
                    title: 'StartBreak',
                    staffid: this.state.profileDataSurce._staffid,
                    attendance_id: '',
                    status: '101',
                    swipe_time:
                      new Date().getHours() +
                      ':' +
                      new Date().getMinutes() +
                      ':' +
                      new Date().getSeconds(),
                    clock_date: moment(new Date()).format('YYYY-MM-DD'),
                  };
                  this.setofflineData(attendence);
                  // this.dropDownAlertRef.alertWithType('info', 'Alert', "Please check your internet connection");
                } else if (response.responseCode === 403) {
                  this.setState({isLoadingIndicator: false});
                  this.dropDownAlertRef.alertWithType(
                    'info',
                    'Alert',
                    'No two consecutive in allowed',
                  );
                } else if (
                  response.responseCode === 204 ||
                  response.responseCode === 404
                ) {
                  this.setState({isLoadingIndicator: false});
                  this.dropDownAlertRef.alertWithType(
                    'info',
                    'Alert',
                    'Please mark attendance first',
                  );
                  setTimeout(() => {
                    this.props.navigation.navigate('DashboardScreen');
                  }, 3000);
                }
              },
            );
          }
        } else if (statusCode === 400) {
          console.log('offline start break called');
          var attendence = {
            title: 'StartBreak',
            staffid: this.state.profileDataSurce._staffid,
            attendance_id: '',
            status: '101',
            swipe_time:
              new Date().getHours() +
              ':' +
              new Date().getMinutes() +
              ':' +
              new Date().getSeconds(),
            clock_date: moment(new Date()).format('YYYY-MM-DD'),
          };
          this.setofflineData(attendence);
          // this.dropDownAlertRef.alertWithType('info', 'Alert', "Please check your internet connection");
        }
      },
    );
  }



  async handleEndDuty() {
    this.setState({isLoadingIndicator: true});
    const todayTimePrevArray = await AsyncStorage.getItem('todayTime');
    var today = moment(new Date());

    var Leave = {
      staffid: this.state.profileDataSurce._staffid,
      clock_date: moment(new Date()).format('YYYY-MM-DD'),
    };

    this.WebServicesManager.postApiDailyAttendence(
      {dataToInsert: Leave, apiEndPoint: 'get_daily_attendance_log'},
      (statusCode, response) => {
        if (Utilities.checkAPICallStatus(statusCode)) {
          var dailyLogsModelDataSource = DailyLogsModel.parseDailyLogsModelFromJSON(
            response.attendance_data,
          );
          if (dailyLogsModelDataSource.length > 0) {
            var attendence = {
              staffid: this.state.profileDataSurce._staffid,
              attendance_id: dailyLogsModelDataSource[0]._attendance_id,
              clock_out:
                new Date().getHours() +
                ':' +
                new Date().getMinutes() +
                ':' +
                new Date().getSeconds(),
              date_times: moment(new Date()).format('YYYY-MM-DD'),
            };

            this.WebServicesManager.postMethodEndDuty(
              {dataToInsert: attendence, apiEndPoint: 'add_clock_out'},
              (statusCode, response) => {
                if (Utilities.checkAPICallStatus(response.responseCode)) {
                  var attendanceData = {
                    title: 'EndDuty',
                    staffid: this.state.profileDataSurce._staffid,
                    attendance_id: '',
                    clock_out:
                      new Date().getHours() +
                      ':' +
                      new Date().getMinutes() +
                      ':' +
                      new Date().getSeconds(),
                    date: moment(new Date()).format('YYYY-MM-DD'),
                  };
                  this.setofflineDataEndDuty(attendanceData);
                  var totalHours = response.response.total_hours;
                  Utilities.saveToStorage(
                    'totalHoursWorked',
                    JSON.stringify(totalHours),
                  );
                  Utilities.saveToStorage('startEndDutyToday', attendanceData);
                  Utilities.saveToStorage('lastEntry', attendanceData);
                  var Leave = {
                    staffid: this.state.profileDataSurce._staffid,
                    clock_date: moment(new Date()).format('YYYY-MM-DD'),
                  };
                  this.WebServicesManager.postApiDailyAttendence(
                    {
                      dataToInsert: Leave,
                      apiEndPoint: 'get_daily_attendance_log',
                    },
                    (statusCode, response) => {
                      AsyncStorage.setItem(
                        'appLevel',
                        'AlreadyLoggedScreen',
                      ).then(value => {
                        this.setState({isLoadingIndicator: false});
                        this.props.navigation.navigate('AlreadyLoggedScreen', {
                          attendanceData: response.attendance_data,
                        });
                      });
                    },
                  );
                } else if (statusCode === 400) {
                  var attendence = {
                    title: 'EndDuty',
                    staffid: this.state.profileDataSurce._staffid,
                    attendance_id: '',
                    clock_out:
                      new Date().getHours() +
                      ':' +
                      new Date().getMinutes() +
                      ':' +
                      new Date().getSeconds(),
                    date: moment(new Date()).format('YYYY-MM-DD'),
                  };
                  this.setofflineDataEndDuty(attendence);

                  // this.dropDownAlertRef.alertWithType('info', 'Alert', "Please check your internet connection");
                } else if (response.responseCode === 403) {
                  this.setState({isLoadingIndicator: false});
                  this.dropDownAlertRef.alertWithType(
                    'info',
                    'Alert',
                    'No two consecutive in allowed',
                  );
                } else if (
                  response.responseCode === 204 ||
                  response.responseCode === 404
                ) {
                  this.setState({isLoadingIndicator: false});
                  this.dropDownAlertRef.alertWithType(
                    'info',
                    'Alert',
                    'Please mark attendance first',
                  );
                  setTimeout(() => {
                    this.props.navigation.navigate('DashboardScreen');
                  }, 3000);
                }
              },
            );
          }
        } else if (statusCode === 400) {
          var attendence = {
            title: 'EndDuty',
            staffid: this.state.profileDataSurce._staffid,
            attendance_id: '',
            clock_out:
              new Date().getHours() +
              ':' +
              new Date().getMinutes() +
              ':' +
              new Date().getSeconds(),
            date: moment(new Date()).format('YYYY-MM-DD'),
          };
          this.setofflineDataEndDuty(attendence);

          // this.dropDownAlertRef.alertWithType('info', 'Alert', "Please check your internet connection");
        }
      },
    );
  }
  pressNotification() {
    constants.noificationCount = 0;
    this.props.navigation.navigate('NotificationScreen');
  }
  async setofflineData(attendanceData) {
    var today = moment(new Date());
    var dataToPush = [];
    dataToPush.push(attendanceData);
    const attendanceDataPrevArray = await AsyncStorage.getItem(
      'attendanceData',
    );
    const todayTimePrevArray = await AsyncStorage.getItem('todayTime');
    if (attendanceDataPrevArray !== null) {
      // this.setState({isLoadingIndicator: false});     // updated
      SearchesToSave = JSON.parse(attendanceDataPrevArray);
      console.log(`not null previous array ${JSON.stringify(SearchesToSave)}`)
     var bb=[];
     bb.push(attendanceData)
      // SearchesToSave.push(attendanceData);

     await Utilities.saveToStorage('attendanceData', bb);

    } else {
      Utilities.saveToStorage('attendanceData', dataToPush);
    }
console.log(`after first iff dta ${todayTimePrevArray}`)
    if (todayTimePrevArray !== null && todayTimePrevArray !== '') {
      console.log("inner iffi fififififi")
      var todayTimePrevArrayPArsed = JSON.parse(todayTimePrevArray);
      if (todayTimePrevArrayPArsed !== '') {
        if (
          today.diff(moment(todayTimePrevArrayPArsed[0].date), 'days') !== 0
        ) {
          Utilities.saveToStorage('todayTime', '');
          SearchesToSave = JSON.parse(todayTimePrevArray);
          SearchesToSave.push(attendanceData);
          Utilities.saveToStorage('todayTime', SearchesToSave).then(value => {
            Utilities.saveToStorage('lastEntry', attendanceData);
            Utilities.saveToStorage('startBreakTimeToday', attendanceData);
            this.setState({isLoadingIndicator: false});     // updated
            this.props.navigation.navigate('EndDutyScreen');
          });
        } else {
          SearchesToSave = JSON.parse(todayTimePrevArray);
          SearchesToSave.push(attendanceData);
          Utilities.saveToStorage('todayTime', SearchesToSave).then(value => {
            Utilities.saveToStorage('lastEntry', attendanceData);
            Utilities.saveToStorage('startBreakTimeToday', attendanceData);
            this.setState({isLoadingIndicator: false});     // updated
            this.props.navigation.navigate('EndDutyScreen');
          });
        }
      } else {
        Utilities.saveToStorage('todayTime', dataToPush);
      }
    } else {
      console.log("inner second else calleds")
      Utilities.saveToStorage('todayTime', dataToPush);
    }
    this.setState({isLoadingIndicator: false});
  }

  async setofflineDataEndDuty(attendanceData) {
    console.log( `end duty offline called`)
    var today = moment(new Date());
    var dataToPush = [];
    dataToPush.push(attendanceData);
    const attendanceDataPrevArray = await AsyncStorage.getItem(
      'attendanceData',
    );
    const todayTimePrevArray = await AsyncStorage.getItem('todayTime');

    if (attendanceDataPrevArray !== null) {

      var SearchesToSave = JSON.parse(attendanceDataPrevArray);
     
      var SearchesToSaveArr = []
      // SearchesToSave.push(attendanceData);
      SearchesToSaveArr.push(SearchesToSave)
      SearchesToSaveArr.push(attendanceData)
      console.log( `offline end duty called ${JSON.stringify(SearchesToSaveArr)}`)
      Utilities.saveToStorage('attendanceData', SearchesToSaveArr);
    } else {
      Utilities.saveToStorage('attendanceData', dataToPush);
    }
    if (todayTimePrevArray !== null && todayTimePrevArray !== '') {
      var todayTimePrevArrayPArsed = JSON.parse(todayTimePrevArray);
      if (todayTimePrevArrayPArsed !== '') {
        if (
          today.diff(moment(todayTimePrevArrayPArsed[0].date), 'days') !== 0
        ) {
          Utilities.saveToStorage('todayTime', '');
          SearchesToSave = JSON.parse(todayTimePrevArray);
          SearchesToSave.push(attendanceData);
          Utilities.saveToStorage('todayTime', SearchesToSave);
        } else {
          SearchesToSave = JSON.parse(todayTimePrevArray);
          SearchesToSave.push(attendanceData);
          Utilities.saveToStorage('todayTime', SearchesToSave);
        }
      } else {
        Utilities.saveToStorage('todayTime', dataToPush);
      }
    } else {
      Utilities.saveToStorage('todayTime', dataToPush);
    }
    Utilities.saveToStorage('lastEntry', attendanceData);
    Utilities.saveToStorage('startEndDutyToday', attendanceData).then(value => {
      this.setState({isLoadingIndicator: false});
      this.props.navigation.navigate('AlreadyLoggedScreen');
    });
  }
  render() {
    if (this.state.checkedDate !== '') {
      var date =
        moment(this.state.checkedDate).format('dddd') +
        ', ' +
        moment().format('MMM DD, YYYY');
    }

    return (
      <Container>
        <StatusBar
          barStyle="light-content"
          hidden={false}
          backgroundColor={constants.colorPurpleLight595278}
          translucent={false}
        />
        <Loader loading={this.state.isLoadingIndicator}></Loader>
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
        <ImageBackground
          source={require('../../../ImageAssets/background.png')}
          style={[styles.mainImageBackground, {justifyContent: 'center'}]}>
          <View
            style={{
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              marginRight: 20,
              paddingTop: 20,
              flexDirection: 'row',
            }}>
            <Text style={styles.HeaderTextTitleSemiBold}>Start Duty :</Text>
            <Text style={styles.HeaderTextTitleSemiBold}>
              {this.state.startDutyTime}
            </Text>
          </View>
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <View style={styles.transparentInputBox}>
              <TextInput
                value={date}
                style={styles.input}
                editable={false}
                placeholder={date}
                onChangeText={searchString => {
                  this.setState({searchString});
                }}
                underlineColorAndroid="transparent"
              />
            </View>
            <View style={{flexDirection: 'row', marginTop: 20}}>
              <Button
                onPress={() => this.handleStartBreak()}
                block
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  marginRight: 5,
                  marginLeft: 20,
                  borderRadius: 7,
                  backgroundColor: constants.coloBlue2f2756,
                  height: 45,
                }}>
                <Image
                  source={require('../../../ImageAssets/cup.png')}
                  style={{width: 20, height: 20, padding: 5, margin: 10}}
                />
                <Text style={styles.buttonTextSmall}>Start Break</Text>
              </Button>
              <Button
                onPress={() => this.handleEndDuty()}
                block
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  marginRight: 20,
                  borderRadius: 7,
                  backgroundColor: constants.colorRed9d0000,
                  height: 45,
                }}>
                <Image
                  source={require('../../../ImageAssets/end.png')}
                  style={{width: 20, height: 20, marginRight: 10}}
                />
                <Text style={styles.buttonTextSmall}>End Duty</Text>
              </Button>
            </View>
          </View>

          <Footer style={{backgroundColor: constants.colorPurpleLight595278}}>
            <Button style={styles.footerButtonActive} vertical>
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
              onPress={() => this.props.navigation.navigate('ReportScreen')}
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
