import React from 'react';
import { Alert, AsyncStorage, Platform, Dimensions } from 'react-native';
import WebServicesManager from "../components/managers/webServicesManager/WebServicesManager";
import constants from '../constants/constants';
import moment from 'moment';
import NetInfo from "@react-native-community/netinfo";
import DailyLogsModel from '../components/Models/DailyLogsModel';
import SigninDataLogsModel from '../components/Models/SigninDataLogsModel';


export default class Utilities extends React.Component {
  WebServicesManager = new WebServicesManager;

  constructor(props) {
    this.doStuff = this.doStuff.bind(this)
    that = this;
    super(props);
    this.state = {
      connectionCount: 0
    }
  }
  static connectionCount = 0;
  static that = this;
  static async saveKeyInUserDefaults(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.log("Error saving data" + error);
    }
  }
  static checkAPICallStatus(statusCode) {
    if (statusCode == 200)
      return true;
    else
      return false;
  }

  static showAlertMessage(type, header, message) {
    this.dropDownAlertRef.alertWithType(type, header, message);
  }

  static checkAPICallStatusString(statusCode) {
    if (statusCode === true)
      return true;
    else
      return false;
  }
  static getErrorString(errorJSON) {
    var strError = errorJSON;

    return strError;
  }
  static getMessageString(errorJSON) {
    var strError = errorJSON;
    return strError;
  }

  static isRunningOniOS() {
    var blnResult = false;
    blnResult = Platform.OS === 'ios' ? true : false
    return blnResult;
  }

  static isRunningOniPhoneXSeries() {
    let d = Dimensions.get('window');
    const { height, width } = d;

    return (
      // This has to be iOS duh
      Platform.OS === 'ios' &&

      // Accounting for the height in either orientation
      (height === 812 || width === 812)
    );
  }
  static ValidateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(String.prototype.trim.call(mail))) {
      return (true)
    }
    return (false)
  }

  static ValidatePassword(password) {
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,16}$/.test(String.prototype.trim.call(password))) {
      return (true)
    }
    return (false)
  }
  static async saveKey(key, value1) {
    AsyncStorage.setItem(key, JSON.stringify(value1)).then((value) => {
    });
  }
  static async saveToStorage(key, value) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value)).then((value) => {

      });;
    } catch (error) {
     
    }
  }

  static async setDatLocalStorage()
  {
    const profileData = await AsyncStorage.getItem('profileData');
    var Leave = { staffid: JSON.parse(profileData)._staffid, clock_date: moment(new Date()).format('YYYY-MM-DD') };
    WebServicesManager.callPostMethodAttendanceOffline({ dataToInsert: Leave, apiEndPoint: "get_daily_attendance_log" },
      (statusCode, response) => {
    var dataToPush = [];
    var dailyLogsModelDataSource = SigninDataLogsModel.parseSigninDataLogsModelFromJSON(response.attendance_data);
    dailyLogsModelDataSource.forEach(element => {
      if (element._title === "Start Duty") {
        var attendanceData = {
          title: "StartDuty", date: element._clock_date, staffid: element._staffid, clock_in: element._clock_time.split(" ")[1]
        };
        dataToPush.push(attendanceData);
        Utilities.saveToStorage("startDutyTimeToday", attendanceData);
        
      }
      if (element._title === "End Duty") {
        var attendanceData = {
          title: "EndDuty", staffid: element._staffid, attendance_id:"",
          clock_out: element._clock_time.split(" ")[1],
          date: element._clock_date
        };
        Utilities.saveToStorage("startEndDutyToday", attendanceData);
        dataToPush.push(attendanceData);
      }
      if (element._title === "Start Break") {
        var attendanceData = {
          title: "StartBreak", staffid: element._staffid, attendance_id:"",
          status: "101", swipe_time: element._clock_time.split(" ")[1], clock_date:element._clock_date
        };
      
        dataToPush.push(attendanceData);
        Utilities.saveToStorage("startBreakTimeToday", attendanceData);
      }
      if (element._title === "End Break") {
       
        var attendanceData = {
          title: "EndBreak", staffid: element._staffid, attendance_id:"",
          status: "101", swipe_time: element._clock_time.split(" ")[1], clock_date:element._clock_date
        };
        Utilities.saveToStorage("EndBreakTimeToday", attendanceData);
        dataToPush.push(attendanceData);
      }

    });
    Utilities.saveToStorage("todayTime", dataToPush);
    Utilities.saveToStorage("lastEntry", dataToPush[dataToPush.length - 1]);
    if(dataToPush[dataToPush.length - 1].title==="StartDuty")
    {
      AsyncStorage.setItem('appLevel', "BreakScreen");
    }
    else if(dataToPush[dataToPush.length - 1].title==="EndDuty")
    {
      AsyncStorage.setItem('appLevel', "AlreadyLoggedScreen");
    }
    else if(dataToPush[dataToPush.length - 1].title==="EndBreak")
    {
      AsyncStorage.setItem('appLevel', "BreakScreen");
    }
    else if(dataToPush[dataToPush.length - 1].title==="StartBreak")
    {
      AsyncStorage.setItem('appLevel', "EndDutyScreen");
    }
    this.connectionCount = 0;
  
})
}

  static async sendLocalStorageToServer() {
    
    const todayTimeDataArray = await AsyncStorage.getItem('todayTime');
    const profileData = await AsyncStorage.getItem('profileData');

    NetInfo.fetch().then(state => {
      if (state.isConnected === true) {

        var count = this.connectionCount;
        this.connectionCount = 1;
        if (count == 0) {
          this.doStuff( count);
        }
        var Leave = { staffid: JSON.parse(profileData)._staffid, clock_date: moment(new Date()).format('YYYY-MM-DD') };
        WebServicesManager.callPostMethodAttendanceOffline({ dataToInsert: Leave, apiEndPoint: "get_daily_attendance_log" },
          (statusCode, response) => {

            if (response.attendance_data.length === 0) {
              var leaveData = {
                attendance_json: todayTimeDataArray
              };
              WebServicesManager.postApiCallDutyStatic({ dataToInsert: leaveData, apiEndPoint: "InsertLog" },
                (statusCode, response) => {

                  if (Utilities.checkAPICallStatus(response.responseCode)) {
                    this.connectionCount = 0;

                  }
                  else if (statusCode === 400) {
                    this.connectionCount = 0;

 

                  }
                  else if (response.responseCode === 401) {
                    this.connectionCount = 0;

 

                  }
                });
            }

            else if(todayTimeDataArray!==null  && JSON.parse(todayTimeDataArray).length>0)
            {
              var todayTimeDataArrayTemp=JSON.parse(todayTimeDataArray);
              var dailyLogsModelDataSource = SigninDataLogsModel.parseSigninDataLogsModelFromJSON(response.attendance_data);
              // dailyLogsModelDataSource.forEach(element => {
              //   if (element._title === "Start Duty") {
              //     if(todayTimeDataArrayTemp[0].title=="StartDuty")
              //     todayTimeDataArrayTemp.splice(0,1);                  
              //   }
              //   if (element._title === "End Duty") {
              //     if(todayTimeDataArrayTemp[0].title=="EndDuty")
              //     todayTimeDataArrayTemp.splice(0,1);   
              //   }
              //   if (element._title === "Start Break") {
              //     if(todayTimeDataArrayTemp[0].title=="StartBreak")
              //     todayTimeDataArrayTemp.splice(0,1);   
              //   }
              //   if (element._title === "End Break") {
              //     if(todayTimeDataArrayTemp[0].title=="EndBreak")
              //     todayTimeDataArrayTemp.splice(0,1);   
              //   }

              // });
              // for (let index = 0; index < response.attendance_data.length; index++) {
              //    
              //   const element = response.attendance_data[index];
              //   for (let indexInternal = 0; index < todayTimeDataArrayTemp.length; indexInternal++) {
              //     const elementIntenal = todayTimeDataArrayTemp[indexInternal];
              //     if(elementIntenal.staffid==element.staffid && elementIntenal.clock_time==element.clock_time&&
              //       elementIntenal.clock_date==element.clock_date  )
              //       {
              //         todayTimeDataArrayTemp.splice(0,indexInternal);
              //       }
                  
              //   }
                
              // }
              // todayTimeDataArrayTemp = todayTimeDataArrayTemp.filter((thing, index, self) =>
              //   index === self.findIndex((t) => (
              //     t.clock_date == thing.clock_date && t.swipe_time == thing.swipe_time && t.clock_out == thing.clock_out
              //   ))
              // )

              if(todayTimeDataArrayTemp.length>0)
              {
                var leaveData = {
                  attendance_json: JSON.stringify(todayTimeDataArrayTemp)
                };
                var deleteShiftParams = {attendance_id:dailyLogsModelDataSource[0]._attendance_id };

                WebServicesManager.postMethodDeleteShiftOffline({ dataToInsert: deleteShiftParams, apiEndPoint: "delete_shift" },
                (statusCode, response1) => {
  
                  if (Utilities.checkAPICallStatus(response1.responseCode)) {
                    WebServicesManager.postApiCallDutyStatic({ dataToInsert: leaveData, apiEndPoint: "InsertLog" },
                (statusCode, response1) => {
  
                  if (Utilities.checkAPICallStatus(response1.responseCode)) {
                    this.connectionCount = 0;
                    this.setDatLocalStorage()
  
                  }
                  else if (statusCode === 400) {
                    this.connectionCount = 0;
  
  
                  }
                  else if (response.responseCode === 401) {
                    this.connectionCount = 0;
  
  
                  }
                });
  
                  }
                  else if (statusCode === 400) {
                    this.connectionCount = 0;
    
                  }
                  else if (response.responseCode === 401) {
                    this.connectionCount = 0;
  
  
                  }
                });
              }

               
              
             
            }
            else {
              var dataToPush = [];
              var dailyLogsModelDataSource = SigninDataLogsModel.parseSigninDataLogsModelFromJSON(response.attendance_data);
               
              dailyLogsModelDataSource.forEach(element => {
                if (element._title === "Start Duty") {
                  var attendanceData = {
                    title: "StartDuty", date: element._clock_date, staffid: element._staffid, clock_in: element._clock_time.split(" ")[1]
                  };
                  dataToPush.push(attendanceData);
                  Utilities.saveToStorage("startDutyTimeToday", attendanceData);
                  
                }
                if (element._title === "End Duty") {
                  var attendanceData = {
                    title: "EndDuty", staffid: element._staffid, attendance_id:"",
                    clock_out: element._clock_time.split(" ")[1],
                    date: element._clock_date
                  };
                  Utilities.saveToStorage("startEndDutyToday", attendanceData);
                  dataToPush.push(attendanceData);
                }
                if (element._title === "Start Break") {
                  var attendanceData = {
                    title: "StartBreak", staffid: element._staffid, attendance_id:"",
                    status: "101", swipe_time: element._clock_time.split(" ")[1], clock_date:element._clock_date
                  };
                
                  dataToPush.push(attendanceData);
                  Utilities.saveToStorage("startBreakTimeToday", attendanceData);
                }
                if (element._title === "End Break") {
                 
                  var attendanceData = {
                    title: "EndBreak", staffid: element._staffid, attendance_id:"",
                    status: "101", swipe_time: element._clock_time.split(" ")[1], clock_date:element._clock_date
                  };
                  Utilities.saveToStorage("EndBreakTimeToday", attendanceData);
                  dataToPush.push(attendanceData);
                }

              });
              Utilities.saveToStorage("todayTime", dataToPush);
              Utilities.saveToStorage("lastEntry", dataToPush[dataToPush.length - 1]);
              if(dataToPush[dataToPush.length - 1].title==="StartDuty")
              {
                AsyncStorage.setItem('appLevel', "BreakScreen");
              }
              else if(dataToPush[dataToPush.length - 1].title==="EndDuty")
              {
                AsyncStorage.setItem('appLevel', "AlreadyLoggedScreen");
              }
              else if(dataToPush[dataToPush.length - 1].title==="EndBreak")
              {
                AsyncStorage.setItem('appLevel', "BreakScreen");
              }
              else if(dataToPush[dataToPush.length - 1].title==="StartBreak")
              {
                AsyncStorage.setItem('appLevel', "EndDutyScreen");
              }
              this.connectionCount = 0;
            }
          })
      }
      else {
      }
    })

  }

  static async doStuff( connectionCount) {

    const attendanceDataPrevArray = await AsyncStorage.getItem('attendanceData');
    const appliedLeaveDataArray = await AsyncStorage.getItem('appliedLeave');
    const todayTimeDataArray = await AsyncStorage.getItem('todayTime');
    const profileData = await AsyncStorage.getItem('profileData');

    if (attendanceDataPrevArray !== null && attendanceDataPrevArray !== "") {
      SearchesToSave = JSON.parse(attendanceDataPrevArray)
      var leaveData = {
        attendance_json: attendanceDataPrevArray
      };
      const abc = await AsyncStorage.setItem('attendanceData', "");
      WebServicesManager.postApiCallDutyStatic({ dataToInsert: leaveData, apiEndPoint: "InsertLog" },
        (statusCode, response) => {
          if (Utilities.checkAPICallStatus(response.responseCode)) {
            this.connectionCount = 0;
            AsyncStorage.setItem('attendanceData', "");

          }
          else if (statusCode === 400) {

          }
          else if (response.responseCode === 401) {
            AsyncStorage.setItem('attendanceData', "");

          }
        });
    }
    if (appliedLeaveDataArray !== null && appliedLeaveDataArray !== "") {

      SearchesToSave = JSON.parse(appliedLeaveDataArray)
      var leaveData = {
        attendance_json: appliedLeaveDataArray
      };
      AsyncStorage.setItem('appliedLeave', "");
      WebServicesManager.postApiLeaveSubmitStatic({ dataToInsert: leaveData, apiEndPoint: "InsertLeaveLog" },
        (statusCode, response) => {
          if (Utilities.checkAPICallStatus(response.responseCode)) {
            context.toggleLoader(false);
            this.connectionCount = 0;
            AsyncStorage.setItem('appliedLeave', "");

          }
          else if (statusCode === 400) {
            context.toggleLoader(false);
            this.connectionCount = 0;
            AsyncStorage.setItem('appliedLeave', "");
          }
          else if (response.responseCode === 401) {
            context.toggleLoader(false);
            this.connectionCount = 0;
            AsyncStorage.setItem('appliedLeave', "");

          }
        });
    }



  }
  static ValidateCellNo(cell) {
    if (/^(\d{1,3}[-]?)?\d{7}$/.test(cell)) {
      return (true)
    }
    return (false)
  }
  static ValidateFaxNo(cell) {
    if (cell !== "") {
      if (/^(\d{1,3}[-]?)?\d{7}$/.test(cell)) {
        return (true)
      }
      return (false)
    }
    else {
      return (true)
    }
  }

  static checkNull(value) {
    return (value == null || value == "null") ? "" : value
  }

  static getWeekDays(value) {
    var weekDays = [];
    if (value.Sunday !== undefined) {
      weekDays.push("Sunday");
    }
    if (value.Monday !== undefined) {
      weekDays.push("Monday");
    }
    if (value.Tuesday !== undefined) {
      weekDays.push("Tuesday");
    }
    if (value.Wednesday !== undefined) {
      weekDays.push("Wednesday");
    }
    if (value.Thursday !== undefined) {
      weekDays.push("Thursday");
    }
    if (value.Friday !== undefined) {
      weekDays.push("Friday");
    }
    if (value.Saturday !== undefined) {
      weekDays.push("Saturday");
    }

    return weekDays;
  }

  static isValidCNIC(strValue) {
    if (/^3([\d]{4})-[(\D\s)]?[\d]{7}-[(\D\s)]?[\d]{1}$/.test(strValue)) {
      return (true)
    }
    return (false)
  }
  static isValidString(strValue) {
    var blnResult = false;
    if (strValue != undefined) {
      if (typeof (strValue) === 'string') {
        if (strValue.trim() != "") {
          blnResult = true;
        }
      }
    }
    return blnResult;
  }

  static removeTimesNewRomanFont(strValue) {
    if (strValue != undefined) {
      //"<span style="font-size:12pt;line-height:107%;font-family:'Times New Roman', serif;">Rough endoplasmic reticulum</span>"
      strValue = strValue.replace("font-family:'Times New Roman', serif", "");
      strValue = strValue.replace("font-family:", "");
      strValue = strValue.replace("line-height:", "");

      var str = "";

      while (str != strValue) {
        str = strValue.replace("font-family:", "");

        if (str == strValue) {
          break;
        }
        else {
          strValue = str.replace("font-family:", "");;
        }
      }

      strValue = str;

    }
    return strValue
  }

  static showAlert(title, msg) {
    setTimeout(() => {
      Alert.alert(
        title,
        msg,
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false }
      )
    }, 100);

  };

  static jsCoreDateCreator(dateString) {
    // dateString *HAS* to be in this format "YYYY-MM-DD HH:MM:SS"
    //let dateParam = dateString.split(/[\s-]/)
    //dateParam[1] = (parseInt(dateParam[1], 10) - 1).toString()
    return new Date(...dateString)
  }
  static getCreditCardType(accountNumber) {

    //start without knowing the credit card type
    var result = "unknown";

    //first check for MasterCard
    if (/^5[1-5]/.test(accountNumber)) {
      result = "mastercard";
    }

    //then check for Visa
    else if (/^4/.test(accountNumber)) {
      result = "visa";
    }

    //then check for AmEx
    else if (/^3[47]\d{13,14}$/.test(accountNumber)) {
      result = "american express";
    }

    return result;
  }

  static getParsedDate(dateString) {
    var date = String(dateString).split(' ');
    var days = String(date[0]).split('-');
    return [parseInt(days[0]), Utilities.getMonthNumber(days[1]), parseInt(days[2]), 0, 0, 0];
  }

  static getMonthNumber(monthString) {
    var month = 1;
    monthString = monthString.toLowerCase()
    if (monthString == 'jan') {
      month = 1;
    }
    else if (monthString == 'feb') {
      month = 2;
    }
    else if (monthString == 'mar') {
      month = 3;
    }
    else if (monthString == 'apr') {
      month = 4;
    }
    else if (monthString == 'may') {
      month = 5;
    }
    else if (monthString == 'jun') {
      month = 6;
    }
    else if (monthString == 'jul') {
      month = 7;
    }
    else if (monthString == 'aug') {
      month = 8;
    }
    else if (monthString == 'sep') {
      month = 9;
    }
    else if (monthString == 'oct') {
      month = 10;
    }
    else if (monthString == 'nov') {
      month = 11;
    }
    else if (monthString == 'dec') {
      month = 12;
    }

    return month;
  }
}
