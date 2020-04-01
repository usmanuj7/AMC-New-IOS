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
  BackHandler,
  AsyncStorage,
} from 'react-native';
import styles from '../../../Style';
import WebServicesManager from '../../managers/webServicesManager/WebServicesManager';
import DropdownAlert from 'react-native-dropdownalert';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Container, Header, Content, Button} from 'native-base';
import constants from '../../../constants/constants';
import Utilities from '../../../utilities/Utilities';
import ProfileModel from '../../Models/ProfileModel';
import Loader from '../../../Loader';
import SplashScreen from 'react-native-splash-screen';
import DailyLogsModel from '../../Models/DailyLogsModel';
import moment from 'moment';
import SigninDataLogsModel from '../../Models/SigninDataLogsModel';

export default class ScreenToCheck extends React.Component {
  WebServicesManager = new WebServicesManager();
  constructor(props) {
    super(props);
    this.state = {
      isModelVisible: false,
      userEmail: '',
      userPassword: '',
      isLoadingIndicator: false,
    };
    // userInfo: '',
  }

  async checkNotif(
    dailyLogsModelDataSource,
    attendance_id,
    profileData,
    prevDate,
    appLevel,
  ) {

    // uncomment for only online mode
    Utilities.sendLocalStorageToServer();
    var staffData = {staffid: JSON.parse(profileData)._staffid};
    console.log(`staff Data ${staffData}`);
    this.WebServicesManager.postApiCallAttendence(
      {dataToInsert: staffData, apiEndPoint: 'get_unread_notifications'},
      (statusCode, response) => {
        console.log(`check notify ${response.response.notifications.length}`);
      
        if (Utilities.checkAPICallStatus(statusCode)) {
          console.log(`length is ${response.response.notifications.length}`)
          
          if (response.response !== undefined)
            constants.noificationCount = response.response.notifications.length;
            console.log(`notifivat count is ${constants.noificationCount}`)
          
        }
        else{
          console.log(statusCode)
         
        }
      },
    );

    if (dailyLogsModelDataSource.length > 0) {
     
      if (
        dailyLogsModelDataSource.find(
          k => k._is_manual == '0' && k._status == '101',
        ) === undefined
      ) {
        if (attendance_id === 'undefined' || attendance_id === null) {
          console.log(' inner if called');
          var Leave = {
            staffid: JSON.parse(profileData)._staffid,
            clock_date: moment(new Date()).format('YYYY-MM-DD'),
          };
          this.WebServicesManager.postApiDailyAttendence(
            {dataToInsert: Leave, apiEndPoint: 'get_daily_attendance_log'},
            (statusCode, response) => {
              if (Utilities.checkAPICallStatus(statusCode)) {
                var Leave = {
                  staffid: JSON.parse(profileData)._staffid,
                  clock_date: moment(new Date()).format('YYYY-MM-DD'),
                };
                this.WebServicesManager.postApiDailyAttendence(
                  {
                    dataToInsert: Leave,
                    apiEndPoint: 'get_dated_lastAttendance',
                  },
                  (statusCode, response) => {
                    if (Utilities.checkAPICallStatus(statusCode)) {
                      var attendance_data = SigninDataLogsModel.parseSigninDataLogsModelFromJSON(
                        response.attendance,
                      );
                      if (attendance_data !== undefined) {
                        if (attendance_data.length === 0) {
                          this.setState({isLoadingIndicator: false});
                          this.props.navigation.navigate('DashboardScreen');
                        } else {
                          if (attendance_data[0]._title === 'Start Break') {
                            AsyncStorage.setItem(
                              'appLevel',
                              'EndDutyScreen',
                            ).then(value => {
                              this.setState({isLoadingIndicator: false});
                              constants.attendance_id =
                                attendance_data[0]._attendance_id;
                              this.props.navigation.navigate('EndDutyScreen');
                            });
                          } else if (
                            attendance_data[0]._title === 'Start Duty'
                          ) {
                            AsyncStorage.setItem(
                              'appLevel',
                              'BreakScreen',
                            ).then(value => {
                              this.setState({isLoadingIndicator: false});
                              constants.attendance_id =
                                attendance_data[0]._attendance_id;
                              this.props.navigation.navigate('BreakScreen');
                            });
                          } else if (
                            attendance_data[0]._title === 'End Break'
                          ) {
                            AsyncStorage.setItem(
                              'appLevel',
                              'BreakScreen',
                            ).then(value => {
                              this.setState({isLoadingIndicator: false});
                              constants.attendance_id =
                                attendance_data[0]._attendance_id;
                              this.props.navigation.navigate('BreakScreen');
                            });
                          } else if (attendance_data[0]._title === 'End Duty') {
                            AsyncStorage.setItem(
                              'appLevel',
                              'AlreadyLoggedScreen',
                            ).then(value => {
                              this.setState({isLoadingIndicator: false});
                              constants.attendance_id =
                                attendance_data[0]._attendance_id;
                              this.props.navigation.navigate(
                                'AlreadyLoggedScreen',
                              );
                            });
                          } else {
                            constants.attendance_id =
                              response.attendance_data[0].attendance_id;
                            if (appLevel !== null) {
                              this.setState({isLoadingIndicator: false});
                              if (appLevel === 'BreakScreen')
                                this.props.navigation.navigate('BreakScreen');
                              if (appLevel === 'DashboardScreen')
                                this.props.navigation.navigate(
                                  'DashboardScreen',
                                );
                              else if (appLevel === 'EndDutyScreen')
                                this.props.navigation.navigate('EndDutyScreen');
                            } else {
                              this.setState({isLoadingIndicator: false});
                              this.props.navigation.navigate('DashboardScreen');
                            }
                          }
                        }
                      } else {
                        this.setState({isLoadingIndicator: false});
                        this.props.navigation.navigate('DashboardScreen');
                      }
                    } else if (statusCode === 400) {
                      this.setState({isLoadingIndicator: false});
                      this.dropDownAlertRef.alertWithType(
                        'info',
                        'Alert',
                        'Unable to connect with internet',
                      );
                    }
                  },
                );
              } else if (statusCode === 400) {
                this.setState({isLoadingIndicator: false});
                this.dropDownAlertRef.alertWithType(
                  'info',
                  'Alert',
                  'Unable to connect with internet',
                );
              }
            },
          );
        } else {
          var Leave = {
            staffid: JSON.parse(profileData)._staffid,
            clock_date: moment(new Date()).format('YYYY-MM-DD'),
          };
          try {
            this.WebServicesManager.postApiDailyAttendence(
              {dataToInsert: Leave, apiEndPoint: 'get_daily_attendance_log'},
              (statusCode, response) => {
                console.log(`inner else called ${Leave}`);
                if (Utilities.checkAPICallStatus(statusCode)) {
                  if (response.attendance_data.length === 0) {
                    this.setState({isLoadingIndicator: false});
                    this.props.navigation.navigate('DashboardScreen');
                  } else {
                    if (
                      response.attendance_data.find(
                        k => k.is_manual == 2 && k.status == 101,
                      ) !== undefined
                    ) {
                      constants.attendance_id =
                        response.attendance_data[0].attendance_id;
                      this.setState({isLoadingIndicator: false});

                      this.props.navigation.navigate('AlreadyLoggedScreen', {
                        attendanceData: response.attendance_data,
                      });
                    } else if (response.attendance_data.length === 1) {
                      constants.attendance_id =
                        response.attendance_data[0].attendance_id;
                      this.setState({isLoadingIndicator: false});
                      this.props.navigation.navigate('BreakScreen');
                    } else {
                      constants.attendance_id =
                        response.attendance_data[0].attendance_id;
                      if (appLevel !== null) {
                        this.setState({isLoadingIndicator: false});
                        if (appLevel === 'BreakScreen')
                          this.props.navigation.navigate('BreakScreen');
                        if (appLevel === 'DashboardScreen')
                          this.props.navigation.navigate('DashboardScreen');
                        else if (appLevel === 'EndDutyScreen')
                          this.props.navigation.navigate('EndDutyScreen');
                      } else {
                        this.setState({isLoadingIndicator: false});
                        this.props.navigation.navigate('DashboardScreen');
                      }
                    }
                  }
                } else if (statusCode === 400) {
                  this.setState({isLoadingIndicator: false});
                  this.dropDownAlertRef.alertWithType(
                    'info',
                    'Alert',
                    'Unable to connect with internet',
                  );
                } else if (statusCode === 400) {
                  this.setState({isLoadingIndicator: false});
                  this.dropDownAlertRef.alertWithType(
                    'info',
                    'Alert',
                    'Unable to connect with internet',
                  );
                }
              },
            );
          } catch (e) {
            console.log(`my custom error log${e}`);
          }
        }
      } else {
        if (attendance_id === 'undefined' || attendance_id === null) {
          var Leave = {
            staffid: JSON.parse(profileData)._staffid,
            clock_date: moment(new Date()).format('YYYY-MM-DD'),
          };
          this.WebServicesManager.postApiDailyAttendence(
            {dataToInsert: Leave, apiEndPoint: 'get_daily_attendance_log'},
            (statusCode, response) => {
              if (Utilities.checkAPICallStatus(statusCode)) {
                var Leave = {
                  staffid: JSON.parse(profileData)._staffid,
                  clock_date: moment(new Date()).format('YYYY-MM-DD'),
                };
                this.WebServicesManager.postApiDailyAttendence(
                  {
                    dataToInsert: Leave,
                    apiEndPoint: 'get_daily_attendance_log',
                  },
                  (statusCode, response) => {
                    if (Utilities.checkAPICallStatus(statusCode)) {
                      if (response.attendance_data.length === 0) {
                        this.setState({isLoadingIndicator: false});
                        this.props.navigation.navigate('DashboardScreen');
                      } else {
                        if (
                          response.attendance_data.find(
                            k => k.is_manual == 2 && k.status == 101,
                          ) !== undefined
                        ) {
                          constants.attendance_id =
                            response.attendance_data[0].attendance_id;
                          this.setState({isLoadingIndicator: false});

                          this.props.navigation.navigate(
                            'AlreadyLoggedScreen',
                            {attendanceData: response.attendance_data},
                          );
                        } else {
                          constants.attendance_id =
                            response.attendance_data[0].attendance_id;
                          if (appLevel !== null) {
                            this.setState({isLoadingIndicator: false});
                            if (appLevel === 'BreakScreen')
                              this.props.navigation.navigate('BreakScreen');
                            if (appLevel === 'DashboardScreen')
                              this.props.navigation.navigate('DashboardScreen');
                            else if (appLevel === 'EndDutyScreen')
                              this.props.navigation.navigate('EndDutyScreen');
                          } else {
                            this.setState({isLoadingIndicator: false});
                            this.props.navigation.navigate('DashboardScreen');
                          }
                        }
                      }
                    } else if (statusCode === 400) {
                      this.setState({isLoadingIndicator: false});
                      this.dropDownAlertRef.alertWithType(
                        'info',
                        'Alert',
                        'Unable to connect with internet',
                      );
                    }
                  },
                );
              } else if (statusCode === 400) {
                this.setState({isLoadingIndicator: false});
                this.dropDownAlertRef.alertWithType(
                  'info',
                  'Alert',
                  'Unable to connect with internet',
                );
              }
            },
          );
        } else {
          var Leave = {
            staffid: JSON.parse(profileData)._staffid,
            clock_date: moment(new Date()).format('YYYY-MM-DD'),
          };
          this.WebServicesManager.postApiDailyAttendence(
            {dataToInsert: Leave, apiEndPoint: 'get_daily_attendance_log'},
            (statusCode, response) => {
              if (Utilities.checkAPICallStatus(statusCode)) {
                if (response.attendance_data.length === 0) {
                  this.setState({isLoadingIndicator: false});
                  this.props.navigation.navigate('DashboardScreen');
                } else {
                  if (
                    response.attendance_data.find(
                      k => k.is_manual == 2 && k.status == 101,
                    ) !== undefined
                  ) {
                    constants.attendance_id =
                      response.attendance_data[0].attendance_id;
                    this.setState({isLoadingIndicator: false});

                    this.props.navigation.navigate('AlreadyLoggedScreen', {
                      attendanceData: response.attendance_data,
                    });
                  } else {
                    constants.attendance_id =
                      response.attendance_data[0].attendance_id;
                    if (appLevel !== null) {
                      this.setState({isLoadingIndicator: false});
                      if (appLevel === 'BreakScreen')
                        this.props.navigation.navigate('BreakScreen');
                      if (appLevel === 'DashboardScreen')
                        this.props.navigation.navigate('DashboardScreen');
                      else if (appLevel === 'EndDutyScreen')
                        this.props.navigation.navigate('EndDutyScreen');
                    } else {
                      this.setState({isLoadingIndicator: false});
                      this.props.navigation.navigate('DashboardScreen');
                    }
                  }
                }
              } else if (statusCode === 400) {
                this.setState({isLoadingIndicator: false});
                this.dropDownAlertRef.alertWithType(
                  'info',
                  'Alert',
                  'Unable to connect with internet',
                );
              } else if (statusCode === 400) {
                this.setState({isLoadingIndicator: false});
                this.dropDownAlertRef.alertWithType(
                  'info',
                  'Alert',
                  'Unable to connect with internet',
                );
              }
            },
          );
        }
      }
    } else {
      

      if (attendance_id === 'undefined' || attendance_id === null) {

      
        var Leave = {
          staffid: JSON.parse(profileData)._staffid,
          clock_date: moment(new Date()).format('YYYY-MM-DD'),
        };
        this.WebServicesManager.postApiDailyAttendence(
          {dataToInsert: Leave, apiEndPoint: 'get_daily_attendance_log'},
          (statusCode, response) => {
            if (Utilities.checkAPICallStatus(statusCode)) {
              var Leave = {
                staffid: JSON.parse(profileData)._staffid,
                clock_date: moment(new Date()).format('YYYY-MM-DD'),
              };
              this.WebServicesManager.postApiDailyAttendence(
                {dataToInsert: Leave, apiEndPoint: 'get_daily_attendance_log'},
                (statusCode, response) => {
                  if (Utilities.checkAPICallStatus(statusCode)) {
                    if (response.attendance_data.length === 0) {
                      this.setState({isLoadingIndicator: false});
                      this.props.navigation.navigate('DashboardScreen');
                    } else {
                      Utilities.saveToStorage('todayTime', '');
                      var dataToPush = [];
                      var dailyLogsModelDataSource = SigninDataLogsModel.parseSigninDataLogsModelFromJSON(
                        response.attendance_data,
                      );
                      dailyLogsModelDataSource.forEach(element => {
                        if (element._title === 'Start Duty') {
                          var attendanceData = {
                            title: 'StartDuty',
                            date: element._clock_date,
                            staffid: element._staffid,
                            clock_in: element._clock_time.split(' ')[1],
                          };
                          dataToPush.push(attendanceData);
                          Utilities.saveToStorage(
                            'startDutyTimeToday',
                            attendanceData,
                          );
                          Utilities.saveToStorage('lastEntry', attendanceData);
                          appLevel = 'BreakScreen';
                        }
                        if (element._title === 'End Duty') {
                          var attendanceData = {
                            title: 'EndDuty',
                            staffid: element._staffid,
                            attendance_id: '',
                            clock_out: element._clock_time.split(' ')[1],
                            date: element._clock_date,
                          };
                          Utilities.saveToStorage(
                            'startEndDutyToday',
                            attendanceData,
                          );
                          dataToPush.push(attendanceData);
                          appLevel = 'BreakScreen';
                          Utilities.saveToStorage('lastEntry', attendanceData);
                        }
                        if (element._title === 'Start Break') {
                          var attendanceData = {
                            title: 'StartBreak',
                            staffid: element._staffid,
                            attendance_id: '',
                            status: '101',
                            swipe_time: element._clock_time.split(' ')[1],
                            clock_date: element._clock_date,
                          };

                          dataToPush.push(attendanceData);
                          Utilities.saveToStorage(
                            'startBreakTimeToday',
                            attendanceData,
                          );
                          appLevel = 'EndDutyScreen';
                          Utilities.saveToStorage('lastEntry', attendanceData);
                        }
                        if (element._title === 'End Break') {
                          var attendanceData = {
                            title: 'EndBreak',
                            staffid: element._staffid,
                            attendance_id: '',
                            status: '101',
                            swipe_time: element._clock_time.split(' ')[1],
                            clock_date: element._clock_date,
                          };
                          Utilities.saveToStorage(
                            'EndBreakTimeToday',
                            attendanceData,
                          );
                          dataToPush.push(attendanceData);
                          appLevel = 'BreakScreen';
                          Utilities.saveToStorage('lastEntry', attendanceData);
                        }
                      });

                      Utilities.saveToStorage('todayTime', dataToPush);
                      if (
                        response.attendance_data.find(
                          k => k.is_manual == 2 && k.status == 101,
                        ) !== undefined
                      ) {
                        constants.attendance_id =
                          response.attendance_data[0].attendance_id;
                        this.setState({isLoadingIndicator: false});

                        this.props.navigation.navigate('AlreadyLoggedScreen', {
                          attendanceData: response.attendance_data,
                        });
                      } else {
                        constants.attendance_id =
                          response.attendance_data[0].attendance_id;
                        if (appLevel !== null) {
                          this.setState({isLoadingIndicator: false});
                          if (appLevel === 'BreakScreen')
                            this.props.navigation.navigate('BreakScreen');
                          if (appLevel === 'DashboardScreen')
                            this.props.navigation.navigate('DashboardScreen');
                          else if (appLevel === 'EndDutyScreen')
                            this.props.navigation.navigate('EndDutyScreen');
                        } else {
                          this.setState({isLoadingIndicator: false});
                          this.props.navigation.navigate('DashboardScreen');
                        }
                      }
                    }
                  } else if (statusCode === 400) {
                    this.setState({isLoadingIndicator: false});
                    this.dropDownAlertRef.alertWithType(
                      'info',
                      'Alert',
                      'Unable to connect with internet',
                    );
                  }
                },
              );
            } else if (statusCode === 400) {
              this.setState({isLoadingIndicator: false});
              this.dropDownAlertRef.alertWithType(
                'info',
                'Alert',
                'Unable to connect with internet',
              );
            }
          },
        );
      } else {

        debugger
        
        var Leave = {
          staffid: JSON.parse(profileData)._staffid,
          clock_date: moment(new Date()).format('YYYY-MM-DD'),
        };
       
        console.log(`body is ${JSON.stringify(Leave.clock_date)}  ${JSON.stringify(Leave.staffid)}`)
  
        this.WebServicesManager.postApiDailyAttendence(
          {dataToInsert: Leave, apiEndPoint: 'get_daily_attendance_log'},
          (statusCode, response) => {

           
            if (Utilities.checkAPICallStatus(statusCode)) {
              console.log(`data is ${JSON.stringify(response.attendance_data)}`)
           
              if (response.attendance_data.length === 0) {
               
                this.setState({isLoadingIndicator: false});
                this.props.navigation.navigate('DashboardScreen');
              } else {
                if (
                  response.attendance_data.find(
                    k => k.is_manual == 2 && k.status == 101,
                  ) !== undefined
                ) {
          
                  constants.attendance_id =
                    response.attendance_data[0].attendance_id;
                  this.setState({isLoadingIndicator: false});

                  this.props.navigation.navigate('AlreadyLoggedScreen', {
                    attendanceData: response.attendance_data,
                  });
                } else {
                  constants.attendance_id =
                    response.attendance_data[0].attendance_id;
                    console.log(`app level ${appLevel}`)
              
                  if (appLevel !== null) {
                    this.setState({isLoadingIndicator: false});
                    if (appLevel === 'BreakScreen')
                      this.props.navigation.navigate('BreakScreen');
                    if (appLevel === 'DashboardScreen')
                      this.props.navigation.navigate('DashboardScreen');
                    else if (appLevel === 'EndDutyScreen')
                      this.props.navigation.navigate('EndDutyScreen');
                  } else {
                    this.setState({isLoadingIndicator: false});
                    this.props.navigation.navigate('DashboardScreen');
                  }
                }
              }
            } else if (statusCode === 400) {
              this.setState({isLoadingIndicator: false});
              this.dropDownAlertRef.alertWithType(
                'info',
                'Alert',
                'Unable to connect with internet',
              );
            } else if (statusCode === 400) {
              this.setState({isLoadingIndicator: false});
              this.dropDownAlertRef.alertWithType(
                'info',
                'Alert',
                'Unable to connect with internet',
              );
            }
          },
        );
      }
    }
  }
//   async componentWillMount(){
    
//  await Utilities.sendLocalStorageToServer();

// }

  async componentDidMount() {
   
    try {
      //for checking that last screen was screen to check
      AsyncStorage.setItem('isScreenToCheck', 'yes');

      SplashScreen.hide();
      var date = new Date();

      var prevDate = date.setDate(date.getDate() - 1);
      var appLevel = await AsyncStorage.getItem('appLevel');

      this.setState({isLoadingIndicator: true});
      const profileData = await AsyncStorage.getItem('profileData');

      const attendance_id = await AsyncStorage.getItem('attendance_id');
      if (profileData !== null) {
        var profile = JSON.parse(profileData);
        constants.profileData = profile;

        var Leave = {
          staffid: JSON.parse(profileData)._staffid,
          clock_date: moment(prevDate).format('YYYY-MM-DD'),
        };
        
   var loginStatus = await AsyncStorage.getItem('loginDone');
   var networkStatus = await AsyncStorage.getItem('lastNetworkStatus');


   // comment for only online
   if(loginStatus !== null && networkStatus !==null && networkStatus !=="online"){
    debugger
     Utilities.sendLocalStorageToServer();
     this.setState({isLoadingIndicator: false});
     this.getOfflineStorageData()
   }
else{
      
        this.WebServicesManager.postApiDailyAttendence(
          {dataToInsert: Leave, apiEndPoint: 'get_daily_attendance_log'},
          (statusCode, response) => {
            if (Utilities.checkAPICallStatus(statusCode)) {
              console.log('Online');

              var dailyLogsModelDataSource = DailyLogsModel.parseDailyLogsModelFromJSON(
                response.attendance_data,
              );
              console.log(
                `attandance ${JSON.stringify(dailyLogsModelDataSource)}`,
              );

      

              if (dailyLogsModelDataSource.length > 0) {
                // here i updated the code
                // const startDutyTimeToday = dailyLogsModelDataSource[0]._clock_time.split(
                //   ' ',
                // )[1];
                // const startDutyTimeToday = dailyLogsModelDataSource[0]
                var attendanceData11 = {
                  title: 'StartDuty',
                  date: dailyLogsModelDataSource[0]._clock_date,
                  staffid: dailyLogsModelDataSource[0]._staffid,
                  clock_in: dailyLogsModelDataSource[0]._clock_time.split(' ')[1],
                };
                
                
                console.log(
                  `Utilities save startDutyTimeToday ${JSON.stringify(attendanceData11)}
                  `,
                );
        
                // Utilities.saveToStorage(
                //   'startDutyTimeToday',
                //   attendanceData11,
                // );
              }
              console.log(
                `all daily logs ${JSON.stringify(dailyLogsModelDataSource[0])}\n attandance ${attendance_id} \n profile data ${profileData} \n prev data ${prevDate} \n app level ${appLevel} `,
              );
             
       
                this.checkNotif(
                  dailyLogsModelDataSource,
                  attendance_id,
                  profileData,
                  moment(prevDate).format('YYYY-MM-DD'),
                  appLevel,
                );
            
     
              this.setState({
                dailyLogsModelDataSource: dailyLogsModelDataSource,
              });
              } else if (statusCode === 400) {
              this.setState({isLoadingIndicator: false});
              // comment for only online mode
              this.getOfflineStorageData();
              // this.dropDownAlertRef.alertWithType('info', 'Alert', "Unable to connect with internet");
            }
          },
        );

     }
      } else {
        this.setState({isLoadingIndicator: false});
        this.props.navigation.navigate('SigninScreen');
      }
    } catch (e) {
      console.log(`my custom error error ${e}`);
    }
  }

  componentDidCatch(error) {
    console.log(`my custom componentDidCatch error ${error} `);
  }
  async getOfflineStorageData() {
  
    var today = moment(new Date());
    // var date = new Date();
    // var prevDate = date.setDate(date.getDate() + 1);
    // var today =  moment(prevDate);
    // var offlineApplevel = await AsyncStorage.getItem("attendanceData");

    var lastEntry = await AsyncStorage.getItem('lastEntry');
    var todayTimeDataArray = await AsyncStorage.getItem('todayTime');
    var todayAttemArray = JSON.parse(todayTimeDataArray);

    console.log('offline storage called');
    console.log(`last entry is  ${lastEntry}`);

    if (lastEntry !== null) {
      console.log('in if loop');
      var lastEntryData = JSON.parse(lastEntry);
      console.log(`today ${JSON.stringify(today)}`);
      console.log(`last entery is ${JSON.stringify(lastEntryData)}`);
    
      // clock_date
      if( (today.diff(lastEntryData.date, 'days') !== 0 || (today.diff(lastEntryData.clock_date, 'days') !== 0)) ){
        var lastEntry = await AsyncStorage.setItem('lastEntry', '');
        this.props.navigation.navigate('DashboardScreen');
      } else {
        if (lastEntryData.title === 'StartDuty') {
          let check = false;
          if(todayAttemArray !== null){
            for (let index = 0; index < todayAttemArray.length; index++) {
              if (todayAttemArray[index].title === 'EndDuty') {
                check = true;
              }
            }
          }

          if (check) {
            this.props.navigation.navigate('AlreadyLoggedScreen');
          } else {
            this.props.navigation.navigate('BreakScreen');
          }
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

      var check = await AsyncStorage.getItem('appLevelCheckIs');
      
         if(check == "End Duty"){
       
           this.props.navigation.navigate("AlreadyLoggedScreen");
         }else{
        
           this.props.navigation.navigate("DashboardScreen");
         }
      // this.props.navigation.navigate('DashboardScreen');
    }
  }

  render() {
    return (
      <ImageBackground
        source={require('../../../ImageAssets/background.png')}
        style={styles.mainImageBackground}>
        <Loader loading={this.state.isLoadingIndicator}></Loader>
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
      </ImageBackground>
    );
  }
}
