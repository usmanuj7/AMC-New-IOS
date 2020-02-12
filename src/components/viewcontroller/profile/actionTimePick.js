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
  };
  componentWillMount() {
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

  async Save() {
    var context = this;
    var date = this.props.navigation.state.params.selectedItem._clock_date;
    // debugger

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
    var todayTimeDataArray = await AsyncStorage.getItem('todayTime');

    this.WebServicesManager.postMethodUpdateTime(
      {dataToInsert: profile, apiEndPoint: 'update_time'},
      (statusCode, response) => {
        if (Utilities.checkAPICallStatus(statusCode)) {
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
            debugger
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
              this.props.navigation.navigate('CalanderScreen');
            }, 3000);
          } else {
            debugger
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
                this.props.navigation.navigate('CalanderScreen');
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
                this.props.navigation.navigate('CalanderScreen');
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
                this.props.navigation.navigate('CalanderScreen');
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
                this.props.navigation.navigate('CalanderScreen');
              }, 3000);
            }
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
                onPress={() => this.Save()}
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
              onPress={() => this.props.navigation.navigate('DashboardScreen')}
              style={styles.footerButtonActive}
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
