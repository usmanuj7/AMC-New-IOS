import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import SigninScreen from "./src/components/viewcontroller/profile/Signin";
import ForgotPasswordScreen from "./src/components/viewcontroller/profile/ForgotPassword";
import DashboardScreen from "./src/components/viewcontroller/Dashboard";
import SplashScreen from 'react-native-splash-screen';
import Success from './src/components/viewcontroller/profile/Success';
import Break from './src/components/viewcontroller/profile/Break';
import EndDuty from './src/components/viewcontroller/profile/EndDuty';
import LeaveScreen from './src/components/viewcontroller/profile/LeaveScreen';
import LeaveHistory from './src/components/viewcontroller/profile/LeaveHistory';
import CalanderScreen from './src/components/viewcontroller/profile/CalanderScreen';
import LogData from './src/components/viewcontroller/profile/LogData';
import ChangePassword from './src/components/viewcontroller/profile/ChangePassword';
import ActionTimePick from './src/components/viewcontroller/profile/actionTimePick';
import ReportScreen from './src/components/viewcontroller/profile/ReportScreen';
import SelectWeekScreen from './src/components/viewcontroller/profile/SelectWeekScreen';
import SelectMonthScreen from './src/components/viewcontroller/profile/SelectMonthScreen';
import NotificationScreen from './src/components/viewcontroller/profile/NotificationScreen';
import ClearNotification from './src/components/viewcontroller/profile/ClearNotification';
import LeaveRecorded from './src/components/viewcontroller/profile/LeaveRecorded';
import MonthScreen from './src/components/viewcontroller/profile/MonthScreen';
import ScreenToCheck from './src/components/viewcontroller/profile/ScreenToCheck';
import AlreadyLoggedScreen from './src/components/viewcontroller/profile/AlreadyLoggedScreen';



SplashScreen.hide();
console.disableYellowBox = true;
const App = createStackNavigator({

      SuccessScreen: {screen:Success, navigationOptions: {header:null}},
      ScreenToCheck: { screen: ScreenToCheck, navigationOptions: { header: null, } },
      SigninScreen: { screen: SigninScreen, navigationOptions: { header: null, } },
      ForgotPasswordScreen: { screen: ForgotPasswordScreen, navigationOptions: { header: null, } },
      DashboardScreen: { screen: DashboardScreen, navigationOptions: { header: null, } },
      SuccessScreen: {screen:Success, navigationOptions: {header:null}},
      BreakScreen: {screen:Break, navigationOptions:{header:null}},
      EndDutyScreen:{screen:EndDuty, navigationOptions:{header:null}},
      LeaveScreen: {screen:LeaveScreen, navigationOptions:{header:null}},
      LeaveHistoryScreen: {screen:LeaveHistory, navigationOptions:{header:null}},
      CalanderScreen: {screen:CalanderScreen, navigationOptions:{header:null}},
      LogDataScreen: {screen:LogData, navigationOptions : {header: null}},
      ChangePassword: {screen:ChangePassword, navigationOptions : {header: null}},
      ActionTimePick: {screen:ActionTimePick, navigationOptions : {header: null}},
      ReportScreen: {screen:ReportScreen, navigationOptions : {header: null}},
      SelectWeekScreen: {screen:SelectWeekScreen, navigationOptions : {header: null}},
      SelectMonthScreen: {screen:SelectMonthScreen, navigationOptions : {header: null}},
      MonthScreen: {screen:MonthScreen, navigationOptions : {header: null}},
      LeaveRecorded: {screen:LeaveRecorded, navigationOptions : {header: null}},
      ClearNotification: {screen:ClearNotification, navigationOptions : {header: null}},
      NotificationScreen: {screen:NotificationScreen, navigationOptions : {header: null}},
            AlreadyLoggedScreen: {screen:AlreadyLoggedScreen, navigationOptions : {header: null}}

   
   
});
export default createAppContainer(App);
