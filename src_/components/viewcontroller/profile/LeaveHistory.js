import React from 'react';
import {
  ListView,
  View,
  StatusBar,
  Text,
  FlatList,
  StyleSheet,
  Image, Alert,
  ImageBackground,Keyboard,
  TextInput, TouchableOpacity, ScrollView, AsyncStorage, BackHandler
} from 'react-native';
import { Container, Body, Title, Center, Content, Footer, FooterTab, Button, Right, Left } from 'native-base';
import styles from "../../../Style";
import WebServicesManager from '../../managers/webServicesManager/WebServicesManager';;
import HeaderView from '../Header/Header'
import moment from 'moment';
import Utilities from '../../../utilities/Utilities';
import constants from '../../../constants/constants';
import LeaveModel from '../../Models/LeaveModel'
import SigninDataLogsModel from '../../Models/SigninDataLogsModel';
import LeaveDetailModal from '../../../LeaveDetailModal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DropdownAlert from 'react-native-dropdownalert';



export default class LeaveHistory extends React.Component {
  WebServicesManager = new WebServicesManager;
  constructor(props) {
    super(props);

    this.state = {
      profileDataSurce: [],
      LeaveModelData: '',
      text: '',
      noificationCount: 0,
      leaveType: '',
      leave_from_date: '',
      leave_to_date: '',
      applied_date: '',
      comments: '',
      status: '',
      leaveCount: '',
      isLoadingIndicator: false
    }
    // userInfo: '',
  }
  async  componentWillMount() {
    const profile = await AsyncStorage.getItem('profileData');

    if (profile !== null) {
      var profileData = JSON.parse(profile);
      this.setState({ profileDataSurce: profileData });
      var Leave = { staffid: this.state.profileDataSurce._staffid };

      this.WebServicesManager.postApiLeaveHistory({ dataToInsert: Leave, apiEndPoint: "get_leave_data" },
        (statusCode, response) => {
          if (Utilities.checkAPICallStatus(statusCode)) {
            var leaveModel = LeaveModel.parseLeaveModelFromJSON(response.timesheets);
            this.setState({ LeaveModelData: leaveModel });

          }
          else if (statusCode === 400) {
            this.dropDownAlertRef.alertWithType('info', 'Alert', "Please check your internet connection");

          }
        });

    }
  }
  hideLoading = () => {

    this.setState({ isLoadingIndicator: false, checkDutyDate: "" });

  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    this.focusListener.remove();

  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {

      this.setState({ noificationCount: constants.noificationCount });

    });
  }


  handleBackButton = () => {
    this.props.navigation.goBack();
    return true;
  }

  handleRowOnPress = (item) => {
   this.setState({
     isLoadingIndicator:true, leaveType:item._leave_type,leaveCount:item._leave_count,
     status:item._status,comments:item._comments,applied_date:item._applied_date,leave_to_date:item._leave_to_date,
     leave_from_date:item._leave_from_date

   })
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
  deleteLeave(item)
  {
    debugger
    var Leave = { staffid: this.state.profileDataSurce._staffid,leave_request_id: item._leaverequest_id};

    this.WebServicesManager.postApiDeleteLeave({ dataToInsert: Leave, apiEndPoint: "delete_leave_request" },
      (statusCode, response) => {
        if (Utilities.checkAPICallStatus(statusCode)) {
          
          this.dropDownAlertRef.alertWithType('info', 'Alert', "Leave is deleted successfully");
         setTimeout(() => { this.props.navigation.goBack() }, 3000);
        }
        else if (statusCode === 400) {
          this.dropDownAlertRef.alertWithType('info', 'Alert', "Please check your internet connection");

        }
      });
  }
  _renderItem = ({ item, index }) => {
    var date = item._leave_from_date;
    var dateToXheck=moment(date);
    var today= new moment();
    if(item._status==4 && today<dateToXheck)
    {if (index % 2 == 0) {
      return (
        <TouchableOpacity onPress={() => this.handleRowOnPress(item)}
          style={styles.rowFront}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center', borderRightWidth: 1, }}>

              <Text style={styles.HeaderTextTitleSemiBold}>{date}</Text>
            </View>
            <View style={{ flex: 2.2, alignItems: 'center', justifyContent: 'center', borderRightWidth: 1, }}>
              <Text style={styles.HeaderTextTitleSemiBold}>{item._leave_type}</Text>
            </View>
            <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={styles.HeaderTextTitleSemiBold}>{item._comments}</Text>
            </View>
            <TouchableOpacity  style={{ flex: 1, alignItems: 'center', justifyContent: 'center',}} onPress={() => this.deleteLeave(item)}>
                        <AntDesign name="delete" size={16} color={constants.colorRedFD3232} />
                    </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    }
    else {
      return (
        <TouchableOpacity onPress={() => this.handleRowOnPress(item)}
          style={styles.rowFront2}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center', borderRightWidth: 1, }}>

              <Text style={styles.HeaderTextTitleSemiBold}>{date}</Text>
            </View>
            <View style={{ flex: 2.2, alignItems: 'center', justifyContent: 'center', borderRightWidth: 1, }}>
              <Text style={styles.HeaderTextTitleSemiBold}>{item._leave_type}</Text>
            </View>
            <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={styles.HeaderTextTitleSemiBold}>{item._comments}</Text>
            </View>
            <TouchableOpacity  style={{ flex: 1, alignItems: 'center', justifyContent: 'center',}} onPress={() => this.deleteLeave(item)}>
                        <AntDesign name="delete" size={16} color={constants.colorRedFD3232} />
                    </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    }
  }
  else
  {
    if (index % 2 == 0) {
      return (
        <TouchableOpacity onPress={() => this.handleRowOnPress(item)}
          style={styles.rowFront}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center', borderRightWidth: 1, }}>

              <Text style={styles.HeaderTextTitleSemiBold}>{date}</Text>
            </View>
            <View style={{ flex: 2.2, alignItems: 'center', justifyContent: 'center', borderRightWidth: 1, }}>
              <Text style={styles.HeaderTextTitleSemiBold}>{item._leave_type}</Text>
            </View>
            <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={styles.HeaderTextTitleSemiBold}>{item._comments}</Text>
            </View>
            <TouchableOpacity style={{ flex: 1 }} >
                        {/* <AntDesign name="delete" size={16} color={constants.colorRedFD3232} /> */}
                    </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    }
    else {
      return (
        <TouchableOpacity onPress={() => this.handleRowOnPress(item)}
          style={styles.rowFront2}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center', borderRightWidth: 1, }}>

              <Text style={styles.HeaderTextTitleSemiBold}>{date}</Text>
            </View>
            <View style={{ flex: 2.2, alignItems: 'center', justifyContent: 'center', borderRightWidth: 1, }}>
              <Text style={styles.HeaderTextTitleSemiBold}>{item._leave_type}</Text>
            </View>
            <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={styles.HeaderTextTitleSemiBold}>{item._comments}</Text>
            </View>
            <TouchableOpacity style={{ flex: 1 }} >
                        {/* <AntDesign name="delete" size={16} color={constants.colorRedFD3232} /> */}
                    </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    }
  }
  
  }
  pressNotification() {
    constants.noificationCount = 0;
    this.props.navigation.navigate("NotificationScreen");
  }

  render() {

    return (

      <Container>
        <StatusBar barStyle="light-content" hidden={false} backgroundColor={constants.colorPurpleLight595278} translucent={false} />
        <HeaderView name={this.state.profileDataSurce._firstname + " " + this.state.profileDataSurce._lastname} context={this} notificationCount={this.state.noificationCount} />
        <DropdownAlert  infoColor={constants.coloBrownFFF5DA} titleStyle={{ color: constants.colorGrey838383, fontWeight: 'bold', }}
                                messageStyle={{ color: constants.colorGrey838383, fontWeight: 'bold', fontSize: 12 }} imageStyle={{
                                    padding: 8,
                                    tintColor: constants.colorGrey838383,
                                    alignSelf: 'center',
                                }}
                                ref={ref => this.dropDownAlertRef = ref} />
        <LeaveDetailModal loading={this.state.isLoadingIndicator} context={this}
          leaveType={this.state.leaveType} leaveCount={this.state.leaveCount}
          status={this.state.status} comments={this.state.comments}
          applied_date={this.state.applied_date} leave_to_date={this.state.leave_to_date}
          leave_from_date={this.state.leave_from_date}
        ></LeaveDetailModal>

        <ImageBackground source={require('../../../ImageAssets/background.png')}
          style={[styles.mainImageBackground]}>
          <View style={{
            flex: 1, justifyContent: 'center', opacity: 0.7, marginBottom: 30, marginTop: 10, marginLeft: 20, marginRight: 20,
            borderRadius: 8, borderWidth: 1, borderColor: constants.colorGrey838383, overflow: 'hidden',
          }}>
            <FlatList
              data={this.state.LeaveModelData}
              renderItem={this._renderItem}
            />
          </View>
          <Footer style={{ backgroundColor: constants.colorPurpleLight595278 }}>

            <Button onPress={() => this.goToFirstTab()} style={styles.footerButtonInactive} vertical>
              {/* <Icon name="home" style={{paddingTop:20}} color='white' size={24}/> */}
              <Image source={require('../../../ImageAssets/home.png')} style={{ width: 20, height: 20 }} />
              <Text style={{ color: 'white', fontSize: 10, }}>Home</Text>
            </Button>
            <Button onPress={() => this.props.navigation.navigate("LeaveScreen")} vertical style={styles.footerButtonActive} >

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
