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
import SigninDataLogsModel from '../../Models/SigninDataLogsModel';


export default class SelectMonthScreen extends React.Component {
    WebServicesManager = new WebServicesManager;
    constructor(props) {
        super(props);

        this.state={
            month: [],
            calendarDataSource:[],
            selectedMonth:'',
            profileDataSurce:''

        }

    }
    handleBackButton = () => {
        this.props.navigation.goBack();
        return true;
      }
      componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        this.focusListener.remove();
    
      }
      componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('didFocus', () => {
        
          this.setState({ noificationCount:constants.noificationCount});
    
        });
      }
  async  componentWillMount() {
        const profile = await AsyncStorage.getItem('profileData');
        if (profile !== null) {
          var profileData=JSON.parse(profile);
         this.setState({profileDataSurce:profileData});
        }
        var Months = moment.months();
        this.state.month.push(Months);

        var monthList = [];
        for (var j=0; j<2; j++){

        var year= 2019+j;
        for (var i = 0; i < 12; i++) {
                        monthList[i] = (this.state.month[0][i]  +" " +    year         );
            
        }
        this.setState({selectedMonth:monthList})
    }
    }
    
    _renderItem(item) {
       
        return (
            <View>
                <TouchableOpacity onPress={() => this.props.navigation.state.params.context.updateData(item.item)||this.props.navigation.goBack()}
                style={styles.rowFront}>
                    <Text style={{ fontSize: 16 }}>{item.item} </Text>
                </TouchableOpacity>
            </View>
        );
    }


    pressNotification(){
        constants.noificationCount=0;
    this.props.navigation.navigate("NotificationScreen");
    }
    async getOfflineStorageData() {
       
      var today = moment(new Date());
      var offlineApplevel = await AsyncStorage.getItem("attendanceData");
      var lastEntry = await AsyncStorage.getItem("lastEntry");
      if (lastEntry !== null) {
        var lastEntryData = JSON.parse(lastEntry);
        // if (today.diff(lastEntryData.date, 'days') !== 0) {
      if( (today.diff(lastEntryData.date, 'days') !== 0 || (today.diff(lastEntryData.clock_date, 'days') !== 0)) ){

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
                  if(response.attendance!==undefined)
                  {
                 var attendance_data=SigninDataLogsModel.parseSigninDataLogsModelFromJSON(response.attendance);
                 if (attendance_data.length > 0) {
                  if (attendance_data[0]._title === "Start Break") {
                    AsyncStorage.setItem('appLevel', "EndDutyScreen").then((value) => {
                      this.setState({isLoadingIndicator:false});
                      constants.attendance_id=attendance_data[0]._attendance_id;
                      this.props.navigation.navigate("EndDutyScreen");
                    })
                  }
                 else if (attendance_data[0]._title === "Start Duty") {
                    AsyncStorage.setItem('appLevel', "BreakScreen").then((value) => {
                      this.setState({isLoadingIndicator:false});
                      constants.attendance_id=attendance_data[0]._attendance_id;
                      this.props.navigation.navigate("BreakScreen");
                    })
                  }
                 else if (attendance_data[0]._title === "End Break") {
                    AsyncStorage.setItem('appLevel', "BreakScreen").then((value) => {
                      this.setState({isLoadingIndicator:false});
                      constants.attendance_id=attendance_data[0]._attendance_id;
                      this.props.navigation.navigate("BreakScreen");
                    })
                  }
                 else if (attendance_data[0]._title === "End Duty") {
                    AsyncStorage.setItem('appLevel', "AlreadyLoggedScreen").then((value) => {
                      this.setState({isLoadingIndicator:false});
                      constants.attendance_id=attendance_data[0]._attendance_id;
                      this.props.navigation.navigate("AlreadyLoggedScreen");
                    })
                  }
                }
                else{
                  AsyncStorage.setItem('appLevel', "DashboardScreen").then((value) => { 
                    this.setState({isLoadingIndicator:false})  
                    this.props.navigation.navigate("DashboardScreen");
                  }) 
                }            
              }
              
             
              else if(statusCode===400)
              {
              }
              else{
                AsyncStorage.setItem('appLevel', "DashboardScreen").then((value) => { 
                  this.setState({isLoadingIndicator:false})  
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
        return (
            <Container>
                <StatusBar barStyle = "light-content" hidden = {false} backgroundColor =  {constants.colorPurpleLight595278} translucent = {false}/>
                <HeaderView name={this.state.profileDataSurce._firstname+" "+ this.state.profileDataSurce._lastname} context={this} notificationCount={this.state.noificationCount}/>

                <ImageBackground source={require('../../../ImageAssets/background.png')}
                    style={[styles.mainImageBackground]}>
                    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'white', opacity: 0.5, marginBottom: 50, marginTop: 30, marginLeft: 20, marginRight: 20, borderRadius: 5, }}>
                        <FlatList
                            data={this.state.selectedMonth}
                            extraData={this.state}
                            ref={(e) => this.month = e}
                            renderItem={this._renderItem.bind(this)}
                        />
                    </View>
                    <Footer style={{ backgroundColor:constants.colorPurpleLight595278 }}>
                         
                           <Button onPress={() => this.goToFirstTab()} style={styles.footerButtonInactive} vertical>
                                {/* <Icon name="home" style={{paddingTop:20}} color='white' size={24}/> */}
                                <Image source={require('../../../ImageAssets/home.png')} style={{ width: 20, height: 20 }} />
                                <Text style={{ color: 'white', fontSize: 10, }}>Home</Text>
                            </Button>
                            <Button onPress={() => this.props.navigation.navigate("LeaveHistory")} vertical style={styles.footerButtonInactive} >

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
