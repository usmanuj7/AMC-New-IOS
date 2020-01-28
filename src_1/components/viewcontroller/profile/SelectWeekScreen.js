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
import PropTypes from 'prop-types';
import { extendMoment } from 'moment-range';
import Utilities from '../../../utilities/Utilities';
import constants from '../../../constants/constants';
import HoursHistoryModal from '../../Models/HoursHistoryModal';
import SigninDataLogsModel from '../../Models/SigninDataLogsModel';

export default class SelectWeekScreen extends React.Component {
    WebServicesManager = new WebServicesManager;
    constructor(props) {
        super(props);

        this.state={
            weekList: [],
            calendarDataSource:[],
            selectedHours: '',
            weekToCheckIndex:'',
            indexOfCurrentWeek:1,
            profileDataSurce: '',
            noificationCount:0

        }
        // userInfo: '',
    }
    async componentWillMount() {
        
        const profile = await AsyncStorage.getItem('profileData');
        if (profile !== null) {
            var profileData = JSON.parse(profile);
        this.setState({ profileDataSurce: profileData });
        }
    }
  
      
      handleBackButton = () => {
            this.props.navigation.goBack();
            return true;
          }
    static propTypes = {
        context: PropTypes.object.isRequired
    };
    componentDidMount()
    {
        
        var weeknumber =moment(new Date(), "MM-DD-YYYY").week();;
        var year = moment(new Date(), "MM-DD-YYYY").year();;
        var weekToCheckIndex="Week"+weeknumber+","+year;
        this.setState({weekToCheckIndex:weekToCheckIndex});
        var year = 2018;
        var weekArray=[];
       
        month = 5 // August (0 indexed)
        startDate = moment([year, month])
        
        // // Get the first and last day of the month
        firstDay = moment(startDate).startOf('month')
        endDay = moment(startDate).endOf('month')
    
        //console.log("firstDay : ", firstDay.format("dddd, MMMM Do YYYY, h:mm:ss a"));
        //console.log("endDay : ", endDay.format("dddd, MMMM Do YYYY, h:mm:ss a"));
        // // Create a range for the month we can iterate through
        var momentRange = require('moment-range');
        momentRange.extendMoment(moment);
        momentRange = moment.range(firstDay, endDay);
        //console.log("monthRange : ", monthRange);
        // // Get all the weeks during the current month
        weeks = []
        for (let mday of momentRange.by('days')) {
            // console.log("mday", mday.week());
            if (weeks.indexOf(mday.week()) === -1) {
                weeks.push(mday.week());
            }
        }
    
        //console.log("weeks : ", weeks);
    
        // // Create a range for each week
        calendar = []
        for (let index = 0; index < weeks.length; index++) {
            var weeknumber = weeks[index];
    
    
            firstWeekDay = moment(firstDay).week(weeknumber).day(0);
            if (firstWeekDay.isBefore(firstDay)) {
                firstWeekDay = firstDay;
            }
    
            lastWeekDay = moment(endDay).week(weeknumber).day(6);
            if (lastWeekDay.isAfter(endDay)) {
                lastWeekDay = endDay;
            }
    
            console.log("\n week number: " + index, firstWeekDay.format("DD-MM-YYYY"), lastWeekDay.format("DD-MM-YYYY"));

            // document.write("<br>week number: " + index + " day: "+ firstWeekDay.format("DD-MM-YYYY")+" to "+ lastWeekDay.format("DD-MM-YYYY"))
            weekRange = moment.range(firstWeekDay, lastWeekDay)
            calendar.push(weekRange)
        }
        
       for (let index = 0; index <  51; index++) {
        var weekToPushInArray="Week" +(index+1) ;
       
        weekArray.push(weekToPushInArray)
           
       }
        this.setState({ calendarDataSource: weekArray})

        }
    _handleselectedHours = (index) => { this.setState({ selectedHours: index }); }
    _renderItem(item) {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.state.params.context.updateWeek(item.item)||this.props.navigation.goBack()}
                style={this.state.selectedHours === item.index ?
                    styles.selected : styles.rowFront}>
                <Text style={{fontSize:16}}>{item.item} </Text>
            </TouchableOpacity>
        );
    }
    pressNotification(){
        constants.noificationCount=0;
    this.props.navigation.navigate("NotificationScreen");
    }
     
  getItemLayout = (data, index) => (
    { length: 10, offset: 100 * index, index }
  )
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
                    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'white', opacity: 0.5, marginBottom: 50, marginTop: 30, marginLeft: 20, marginRight: 20, borderRadius: 5,}}>
                        <View style={{flex:0.6}}>
                            <FlatList
                                data={this.state.calendarDataSource}
                                extraData={this.state}
                                ref={(e) => this.data1 = e}
                                keyExtractor={(item, index) => item.key}
                               
                                renderItem={this._renderItem.bind(this)}
                            //  onScrollToIndexFailed={()=>{}}
                            />
                        </View>
{/* 
                        <View style={{flex:0.2}}>
                            <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                <Button onPress={() => this.handleStartBreak()} block style={{ flexDirection: 'row', flex: 1, marginRight: 5, marginLeft: 20, borderRadius: 7, backgroundColor: constants.coloBlue2f2756, height: 45 }}>
                                    
                                    <Text style={styles.buttonTextSmall}>
                                        Start Week
                             </Text>
                                </Button>
                                <Button onPress={() => this.handleEndDuty()} block style={{ flexDirection: 'row', flex: 1, marginRight: 20, borderRadius: 7, backgroundColor: constants.coloBlue2f2756, height: 45 }}>
                                    
                                    <Text style={styles.buttonTextSmall}>

                                        End Week
                             </Text>
                                </Button>
                            </View>
                        </View> */}
                  

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
        )
    }
}
