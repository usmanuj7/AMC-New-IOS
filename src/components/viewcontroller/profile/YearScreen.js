'use strict';
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
import EntypoIcons from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/Entypo';
import WebServicesManager from '../../managers/webServicesManager/WebServicesManager';
import HeaderView from '../Header/Header';
import TimePicker from 'react-native-24h-timepicker';
import moment from 'moment';
import PropTypes from 'prop-types';
import Utilities from '../../../utilities/Utilities';
import constants from '../../../constants/constants';
import LeaveModel from '../../Models/LeaveModel';
// import { PieChart } from 'react-native-svg-charts';
import HoursHistoryModal from '../../Models/HoursHistoryModal';
import LeaveTypeModel from '../../Models/LeaveTypeModel';
import Loader from '../../../Loader';
import SigninDataLogsModel from '../../Models/SigninDataLogsModel';
import DropdownAlert from 'react-native-dropdownalert';
import PieChart from './pieChart';

const data = [
  {
    key: 'MARIA',
    date: '11/12/2019',
    title: 'Logged Hours',
    id: 1,
    hours: '332',
  },
  {
    key: 'MARTIN',
    date: '11/12/2019',
    title: 'Working Hours',
    id: 2,
    hours: '332',
  },
  {
    key: 'OLIVIA',
    date: '11/12/2019',
    title: 'Break Hours',
    id: 3,
    hours: '332',
  },
];

export default class YearScreen extends React.Component {
  WebServicesManager = new WebServicesManager();
  constructor(props) {
    super(props);

    this.state = {
      time: '',
      month: '',
      profileDataSurce: '',
      changeView: <View></View>,
      hoursDataModel: '',
      monthDate: '',
      isLoadingIndicator: false,
      totalWorkedMinutes: 0,
      totalBreakMinutes: 0,
      totalMinutes: 0,
      noificationCount: 0,
      total: 0,
    };
    // userInfo: '',
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
  updateData(monthdate) {
    this.setState({isLoadingIndicator: true});

    var startDate = monthdate + '- 11';
    var month_year = monthdate + '- 11';
    this.setState({month: monthdate, monthDate: startDate});
    // var attendence = {
    //   staffid: this.state.profileDataSurce._staffid,
    //   month_year: month_year,
    //   year: monthdate + '',
    // };
    var attendence = {
      staffid: this.state.profileDataSurce._staffid,
      year: monthdate + '',
    };

    console.log(`attandance is ==> ${JSON.stringify(attendence)}`)
    // debugger
    this.WebServicesManager.postApiHoursHistoryYear(
      // {dataToInsert: attendence, apiEndPoint: 'get_hours_history_wm'},
      {dataToInsert: attendence, apiEndPoint: 'get_hours_history_wm_report'},

      (statusCode, response) => {
        console.log(`status code ${statusCode}`)
        if (Utilities.checkAPICallStatus(statusCode)) {
          var attendenceModel = HoursHistoryModal.parseHoursHistoryModalFromJSON(
            response.hours_history,
          );
          console.log(`response is ==> ${JSON.stringify(attendenceModel)}`)


          var totalWorkedMinutes =
            attendenceModel._worked.split(':')[0] * 3600 +
            attendenceModel._worked.split(':')[1] * 60 +
            parseInt(attendenceModel._worked.split(':')[2]);
          var totalBreakMinutes =
            attendenceModel._break.split(':')[0] * 3600 +
            attendenceModel._break.split(':')[1] * 60 +
            parseInt(attendenceModel._break.split(':')[2]);
          var totalMinutes =
            attendenceModel._total.split(':')[0] * 3600 +
            attendenceModel._total.split(':')[1] * 60 +
            parseInt(attendenceModel._total.split(':')[2]);
          this.setState({
            totalWorkedMinutes: totalWorkedMinutes,
            totalBreakMinutes: totalBreakMinutes,
            totalMinutes: totalMinutes,
            hoursDataModel: attendenceModel,
            total: totalWorkedMinutes + totalBreakMinutes + totalMinutes,
          });
          this.setState({isLoadingIndicator: false});
        } else if (statusCode === 400) {
            this.setState({isLoadingIndicator: false});
          this.dropDownAlertRef.alertWithType(
            'info',
            'Alert',
            'Please check your internet connection',
          );
        }
      },
    );
  }

  async componentWillMount() {
    var Months = moment(this.state.checkedDate).format('YYYY');
    this.setState({
      month: Months,
      monthDate: new Date(),
    });

    this.setState({isLoadingIndicator: true});
    const profile = await AsyncStorage.getItem('profileData');
    if (profile !== null) {
      var profileData = JSON.parse(profile);
      this.setState({profileDataSurce: profileData});
      this.updateData(moment(new Date()).format('YYYY'));

      this.WebServicesManager.postGetData(
        {dataToInsert: '', apiEndPoint: 'get_all_leave_types'},
        (statusCode, response) => {
          if (Utilities.checkAPICallStatus(statusCode)) {
            var leaveTypeData = LeaveTypeModel.parseLeaveTypeModelFromJSON(
              response.leave_types,
            );
            this.setState({leaveTypeDataSource: leaveTypeData});
            var Leave = {staffid: this.state.profileDataSurce._staffid};
            this.WebServicesManager.postApiLeaveHistory(
              {dataToInsert: Leave, apiEndPoint: 'get_leave_data'},
              (statusCode, response) => {
                if (Utilities.checkAPICallStatus(statusCode)) {
                  this.setState({isLoadingIndicator: false});
                  var leaveModel = LeaveModel.parseLeaveModelFromJSON(
                    response.timesheets,
                  );
                  this.setState({LeaveModelData: leaveModel});
                } else if (statusCode === 400) {
                    this.setState({isLoadingIndicator: false});
                  this.dropDownAlertRef.alertWithType(
                    'info',
                    'Alert',
                    'Please check your internet connection',
                  );
                }
              },
            );
          } else if (statusCode === 400) {
            this.setState({isLoadingIndicator: false});
            this.dropDownAlertRef.alertWithType(
              'info',
              'Alert',
              'Please check your internet connection',
            );
          }
        },
      );
    }
  }
  async getOfflineStorageData() {
    var today = moment(new Date());
    var offlineApplevel = await AsyncStorage.getItem('attendanceData');
    var lastEntry = await AsyncStorage.getItem('lastEntry');
    if (lastEntry !== null) {
      var lastEntryData = JSON.parse(lastEntry);
      if (today.diff(lastEntryData.date_times, 'days') !== 0) {
        var lastEntry = await AsyncStorage.setItem('lastEntry', '');
        this.props.navigation.navigate('DashboardScreen');
      } else {
        if (lastEntryData.title === 'StartDuty') {
          this.props.navigation.navigate('BreakScreen');
        } else if (lastEntryData.title === 'StartBreak') {
          this.props.navigation.navigate('EndDutyScreen');
        } else if (lastEntryData.title === 'EndDuty') {
          this.props.navigation.navigate('AlreadyLoggedScreen');
        } else if (lastEntryData.title === 'EndBreak') {
          this.props.navigation.navigate('BreakScreen');
        } else {
          this.props.navigation.navigate('DashboardScreen');
        }
      }
    } else {
      this.props.navigation.navigate('DashboardScreen');
    }
  }

  async goToFirstTab() {
    var appLevel = await AsyncStorage.getItem('appLevel');
    var attendence = {
      staffid: this.state.profileDataSurce._staffid,
      clock_date: moment(new Date()).format('YYYY-MM-DD'),
    };
    this.WebServicesManager.postApiDailyAttendence(
      {dataToInsert: attendence, apiEndPoint: 'get_dated_lastAttendance'},
      (statusCode, response) => {
        if (Utilities.checkAPICallStatus(statusCode)) {
          if (response.attendance !== undefined) {
            var attendance_data = SigninDataLogsModel.parseSigninDataLogsModelFromJSON(
              response.attendance,
            );
            if (attendance_data.length > 0) {
              if (attendance_data[0]._title === 'Start Break') {
                AsyncStorage.setItem('appLevel', 'EndDutyScreen').then(
                  value => {
                    this.setState({isLoadingIndicator: false});
                    constants.attendance_id = attendance_data[0]._attendance_id;
                    this.props.navigation.navigate('EndDutyScreen');
                  },
                );
              } else if (attendance_data[0]._title === 'Start Duty') {
                AsyncStorage.setItem('appLevel', 'BreakScreen').then(value => {
                  this.setState({isLoadingIndicator: false});
                  constants.attendance_id = attendance_data[0]._attendance_id;
                  this.props.navigation.navigate('BreakScreen');
                });
              } else if (attendance_data[0]._title === 'End Break') {
                AsyncStorage.setItem('appLevel', 'BreakScreen').then(value => {
                  this.setState({isLoadingIndicator: false});
                  constants.attendance_id = attendance_data[0]._attendance_id;
                  this.props.navigation.navigate('BreakScreen');
                });
              } else if (attendance_data[0]._title === 'End Duty') {
                AsyncStorage.setItem('appLevel', 'AlreadyLoggedScreen').then(
                  value => {
                    this.setState({isLoadingIndicator: false});
                    constants.attendance_id = attendance_data[0]._attendance_id;
                    this.props.navigation.navigate('AlreadyLoggedScreen');
                  },
                );
              }
            } else {
              AsyncStorage.setItem('appLevel', 'DashboardScreen').then(
                value => {
                  this.setState({isLoadingIndicator: false});
                  this.props.navigation.navigate('DashboardScreen');
                },
              );
            }
          } else if (statusCode === 400) {
          } else {
            AsyncStorage.setItem('appLevel', 'DashboardScreen').then(value => {
              this.setState({isLoadingIndicator: false});
              this.props.navigation.navigate('DashboardScreen');
            });
          }
        } else if (statusCode === 400) {
          this.getOfflineStorageData();
        }
      },
    );
  }

  Next() {
    var nextDate = moment(this.state.monthDate, 'YYYY-MM-DD hh:mm:ss').add(
      1,
      'y',
    );
    var nextMonth = moment(this.state.monthDate, 'YYYY-MM-DD hh:mm:ss')
      .add(1, 'y')
      .format('YYYY');
    this.setState({month: nextMonth, monthDate: nextDate});
    this.updateData(nextMonth);
  }

  Prev() {
    var prevDate = moment(this.state.monthDate, 'YYYY-MM-DD hh:mm:ss').subtract(
      1,
      'y',
    );
    var prevMonth = moment(this.state.monthDate, 'YYYY-MM-DD hh:mm:ss')
      .subtract(1, 'y')
      .format('YYYY');
    this.setState({month: prevMonth, monthDate: prevDate});
    this.updateData(prevMonth);
  }
  pressNotification() {
    constants.noificationCount = 0;
    this.props.navigation.navigate('NotificationScreen');
  }
  render() {
    const chartsData = [
      parseInt(this.state.totalWorkedMinutes),
      parseInt(this.state.totalBreakMinutes),
      parseInt(this.state.totalMinutes),
    ];

    const randomColor = () =>
      ('#' + ((Math.random() * 0xffffff) << 0).toString(16) + '000000').slice(
        0,
        7,
      );

    const total = this.state.total;
    const data = [
      {
        key: 1,
        amount: this.state.totalWorkedMinutes / total,
        svg: {fill: '#600080'},
      },
      {
        key: 2,
        amount: this.state.totalBreakMinutes / total,
        svg: {fill: '#9900cc'},
      },
      {
        key: 3,
        amount: this.state.totalMinutes / total,
        svg: {fill: '#c61aff'},
      },
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
    ];
    // const pieData = chartsData
    //     .filter((value) => value > 0)
    //     .map((value, index) => ({
    //         value,
    //         svg: {
    //             fill: randomColor(),
    //             onPress: () => console.log('press', index),
    //         },
    //         key: `pie-${index}`,
    //     }))
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
        <Loader loading={this.state.isLoadingIndicator}></Loader>

        <DropdownAlert
          infoColor={constants.coloBrownFFF5DA}
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
          ref={ref => (this.dropDownAlertRef = ref)}
        />
        <ImageBackground
          source={require('../../../ImageAssets/background.png')}
          style={[styles.mainImageBackground]}>
          <View style={{backgroundColor: '#595278', flexDirection: 'row'}}>
            <Button
              onPress={() => this.props.navigation.navigate('ReportScreen')}
              style={{
                flex: 1,
                justifyContent: 'center',
                backgroundColor: constants.colorPurpleLight595278,
              }}>
              <Text style={{color: constants.colorWhitefcfcfc}}>By Week</Text>
            </Button>
            <Button
              onPress={() => this.props.navigation.navigate('MonthScreen')}
              style={{
                flex: 1,
                justifyContent: 'center',
                backgroundColor: constants.colorPurpleLight595278,
                opacity: 0.4,
              }}>
              <Text style={{color: constants.colorWhitefcfcfc}}>By Month</Text>
            </Button>
            <Button
              onPress={() => this.props.navigation.navigate('YearScreen')}
              style={{
                flex: 1,
                justifyContent: 'center',
                backgroundColor: constants.colorPurpleDark302757,
                opacity: 0.4,
              }}>
              <Text style={{color: constants.colorWhitefcfcfc}}>By Year</Text>
            </Button>
          </View>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#595278',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity onPress={() => this.Prev()}>
              <Icons
                name="chevron-small-left"
                style={{padding: 10}}
                color={constants.colorWhitefcfcfc}
                size={24}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('SelectYearScreen', {
                  context: this,
                })
              }>
              <Text style={{color: 'white'}}>{this.state.month}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.Next()}>
              <Icons
                name="chevron-small-right"
                style={{padding: 10}}
                color={constants.colorWhitefcfcfc}
                size={24}
              />
            </TouchableOpacity>
          </View>
          <ScrollView
            style={{
              flex: 1,
              backgroundColor: 'white',
              opacity: 0.5,
              marginBottom: 30,
              marginTop: 10,
              marginLeft: 20,
              marginRight: 20,
              borderRadius: 5,
            }}>
            <View style={{flex: 1, justifyContent: 'center'}}>
              <TouchableOpacity style={styles.rowFront}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                    }}>
                    <View
                      style={{
                        flex: 1,
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                      }}>
                      <Text style={styles.HeaderTextTitleSemiBold}>
                        Logged Hours
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 0.4,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text style={styles.HeaderTextTitleSemiBold}>
                        {this.state.hoursDataModel._total}{' '}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rowFront2}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                    }}>
                    <View
                      style={{
                        flex: 1,
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                      }}>
                      <Text style={styles.HeaderTextTitleSemiBold}>
                        Working Hours
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 0.4,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text style={styles.HeaderTextTitleSemiBold}>
                        {this.state.hoursDataModel._worked}{' '}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rowFront}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                    }}>
                    <View
                      style={{
                        flex: 1,
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                      }}>
                      <Text style={styles.HeaderTextTitleSemiBold}>
                        Break Hours
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 0.4,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text style={styles.HeaderTextTitleSemiBold}>
                        {this.state.hoursDataModel._break}{' '}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            <PieChart data={data} />
            {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <PieChart style={{ width: 130, height: 120 }} data={pieData} />

                        </View> */}
            <View>
              <Button
                onPress={() => this.props.navigation.navigate('ChangePassword')}
                block
                style={{
                  margin: 18,
                  borderRadius: 7,
                  backgroundColor: constants.coloBlue2f2756,
                  height: 40,
                }}>
                <EntypoIcons
                  name="ios-lock"
                  style={{padding: 10}}
                  color={constants.coloBlue2f2756}
                  size={24}
                />
                <Text style={styles.buttonTextSmall}>Change Password</Text>
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

          <Footer style={{backgroundColor: constants.colorPurpleLight595278}}>
            <Button
              onPress={() => this.goToFirstTab()}
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
              onPress={() => this.props.navigation.navigate('ReportScreen')}
              vertical
              style={styles.footerButtonActive}>
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
