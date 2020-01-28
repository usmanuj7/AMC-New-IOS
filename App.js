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
import YearScreen from './src/components/viewcontroller/profile/YearScreen';
import SelectYearScreen from './src/components/viewcontroller/profile/SelectYearScreen';

SplashScreen.hide();
console.disableYellowBox = true;
const App = createStackNavigator({

   ScreenToCheck: { screen: ScreenToCheck, navigationOptions: { header: null,gesturesEnabled: false } },
   SigninScreen: { screen: SigninScreen, navigationOptions: { header: null,gesturesEnabled: false } },
   ForgotPasswordScreen: { screen: ForgotPasswordScreen, navigationOptions: { header: null,gesturesEnabled: false } },
   DashboardScreen: { screen: DashboardScreen, navigationOptions: { header: null,gesturesEnabled: false } },
   SuccessScreen: {screen:Success, navigationOptions: {header: null,gesturesEnabled: false}},
   BreakScreen: {screen:Break, navigationOptions:{header: null,gesturesEnabled: false}},
   EndDutyScreen:{screen:EndDuty, navigationOptions:{header: null,gesturesEnabled: false}},
   LeaveScreen: {screen:LeaveScreen, navigationOptions:{header: null,gesturesEnabled: false}},
   LeaveHistoryScreen: {screen:LeaveHistory, navigationOptions:{header: null,gesturesEnabled: false}},
   CalanderScreen: {screen:CalanderScreen, navigationOptions:{header: null,gesturesEnabled: false}},
   LogDataScreen: {screen:LogData, navigationOptions : {header: null,gesturesEnabled: false}},
   ChangePassword: {screen:ChangePassword, navigationOptions : {header: null,gesturesEnabled: false}},
   ActionTimePick: {screen:ActionTimePick, navigationOptions : {header: null,gesturesEnabled: false}},
   ReportScreen: {screen:ReportScreen, navigationOptions : {header: null,gesturesEnabled: false}},
   SelectWeekScreen: {screen:SelectWeekScreen, navigationOptions : {header: null,gesturesEnabled: false}},
   SelectMonthScreen: {screen:SelectMonthScreen, navigationOptions : {header: null,gesturesEnabled: false}},
   MonthScreen: {screen:MonthScreen, navigationOptions : {header: null,gesturesEnabled: false}},
   YearScreen: {screen:YearScreen, navigationOptions : {header: null,gesturesEnabled: false}},
   LeaveRecorded: {screen:LeaveRecorded, navigationOptions : {header: null,gesturesEnabled: false}},
   ClearNotification: {screen:ClearNotification, navigationOptions : {header: null,gesturesEnabled: false}},
   NotificationScreen: {screen:NotificationScreen, navigationOptions : {header: null,gesturesEnabled: false}},
   AlreadyLoggedScreen: {screen:AlreadyLoggedScreen, navigationOptions : {header: null,gesturesEnabled: false}},
   SelectYearScreen: {screen:SelectYearScreen, navigationOptions : {header: null,gesturesEnabled: false}},
   
   
   
});
export default createAppContainer(App);
