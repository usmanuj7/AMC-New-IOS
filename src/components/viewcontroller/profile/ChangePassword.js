import React from 'react';
import {
    ListView,
    View,
    StatusBar,
    Text,
    Image, Alert,
    ImageBackground,
    TextInput, TouchableOpacity, ScrollView, BackHandler, AsyncStorage
} from 'react-native';
import styles from "../../../Style";
import WebServicesManager from '../../managers/webServicesManager/WebServicesManager'
import DropdownAlert from 'react-native-dropdownalert';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import constants from '../../../constants/constants';
import Utilities from '../../../utilities/Utilities';
import ProfileModel from '../../Models/ProfileModel';
import Loader from '../../../Loader';
import HeaderView from '../Header/Header';
import { Container, Body, Title, Center, Content, Footer, FooterTab, Button, Right, Left } from 'native-base';
import SigninDataLogsModel from '../../Models/SigninDataLogsModel';
import moment from 'moment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default class ChangePassword extends React.Component {
    WebServicesManager = new WebServicesManager;
    constructor(props) {
        super(props);

        this.state = {
            isModelVisible: false,
            userEmail: "",
            userPassword: "",
            new_password: '',
            new_password_confirmed: '',
            isLoadingIndicator: false,
            profileDataSurce: '',
            noificationCount: 0

        }
        // userInfo: '',
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = () => {
        this.props.navigation.goBack();
        return true;
    }
    async componentWillMount() {
        const profile = await AsyncStorage.getItem('profileData');
        if (profile !== null) {
            var profileData = JSON.parse(profile);
            this.setState({ profileDataSurce: profileData });
        }
    }

    pressNotification() {
        constants.noificationCount = 0;
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

    changePassword() {
        if (Utilities.isValidString(this.state.userPassword)) {
            if (Utilities.isValidString(this.state.new_password)) {
                if (this.state.new_password === this.state.new_password_confirmed) {
                    var changePassParams = {
                        staffid: this.state.profileDataSurce._staffid, current_password: this.state.userPassword,
                        new_password: this.state.new_password, new_password_confirmed: this.state.new_password_confirmed,
                    };
                    this.WebServicesManager.postApiChangePassword({ dataToInsert: changePassParams, apiEndPoint: "change_password" },
                        (statusCode, response) => {
                            if (Utilities.checkAPICallStatus(statusCode)) {

                                if (response.responseCode === 0) {
                                    this.dropDownAlertRef.alertWithType('info', 'Alert', response.description);
                                }
                                else {
                                    this.dropDownAlertRef.alertWithType('info', 'Success', "Your password is changed successfully ");
                                    setTimeout(() => { this.props.navigation.goBack() }, 3000);
                                }
                            }
                            else if (statusCode === 400) {
                                this.dropDownAlertRef.alertWithType('info', 'Alert', "Please check your internet connection");

                            }
                        });
                }
                else {
                    this.dropDownAlertRef.alertWithType('info', 'Alert', "New password and confirm password do not match");
                }
            }
            else {
                this.dropDownAlertRef.alertWithType('info', 'Alert', "Please provide new password");
            }
        }
        else {
            this.dropDownAlertRef.alertWithType('info', 'Alert', "Please provide current password");
        }


    }
    menuItemPressed() {
        this.props.navigation.goBack();
    }

    render() {

        return (
            <Container style={{ flex: 1 }}>
            
                <Loader loading={this.state.isLoadingIndicator}></Loader>
                <HeaderView callFrom={"ChangePass"} name={this.state.profileDataSurce._firstname + " " + this.state.profileDataSurce._lastname} context={this} notificationCount={this.state.noificationCount} />
                <StatusBar barStyle="light-content" hidden={false} backgroundColor={constants.colorPurpleLight595278} translucent={false} />
                <DropdownAlert infoColor={constants.coloBrownFFF5DA} titleStyle={{ color: constants.colorGrey838383, fontWeight: 'bold', }}
                    messageStyle={{ color: constants.colorGrey838383, fontWeight: 'bold', fontSize: 12 }} imageStyle={{
                        padding: 8,
                        tintColor: constants.colorGrey838383,
                        alignSelf: 'center',
                    }}
                    ref={ref => this.dropDownAlertRef = ref} />
                    <ImageBackground source={require('../../../ImageAssets/background.png')}
                style={{ flex: 1 }}>
                        <KeyboardAwareScrollView
            resetScrollToCoords={{ x: 0, y: 0 }}
            contentContainerStyle={styles.container}
            scrollEnabled={true}>
                  <ScrollView contentContainerStyle={{flex:1}} >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={styles.transparentInputBox}>
                        <TextInput
                            secureTextEntry={true}
                            style={styles.inputNotCenterAligned}
                            placeholder="Password"
                            onChangeText={(searchString) => { this.setState({ userPassword: searchString }) }}
                            underlineColorAndroid="transparent"
                        />
                    </View>
                    <View style={styles.transparentInputBox}>
                        <TextInput
                            secureTextEntry={true}
                            style={styles.inputNotCenterAligned}
                            placeholder="New Password"
                            onChangeText={(searchString) => { this.setState({ new_password: searchString }) }}
                            underlineColorAndroid="transparent"
                        />
                    </View>
                    <View style={styles.transparentInputBox}>
                        <TextInput
                            secureTextEntry={true}
                            style={styles.inputNotCenterAligned}
                            placeholder="Confirm Password"
                            onChangeText={(searchString) => { this.setState({ new_password_confirmed: searchString }) }}
                            underlineColorAndroid="transparent"
                        />
                    </View>
                    <Button onPress={() => { this.changePassword() }} block style={{ margin: 18, borderRadius: 7, backgroundColor: constants.coloBlue2f2756, height: 40 }}>
                        <Text style={styles.buttonTextSmall}>
                            Update
</Text>
                    </Button>

                </View>
                </ScrollView>
                </KeyboardAwareScrollView>
                <Footer style={{ backgroundColor: constants.colorPurpleLight595278 }}>
                    <Button onPress={() => this.goToFirstTab()} style={styles.footerButtonInactive} vertical>
                        <Image source={require('../../../ImageAssets/home.png')} style={{ width: 20, height: 20 }} />
                        <Text style={{ color: 'white', fontSize: 10, }}>Home</Text>
                    </Button>
                    <Button onPress={() => this.props.navigation.navigate("LeaveScreen")} vertical style={styles.footerButtonInactive} >

                        <Image source={require('../../../ImageAssets/leave.png')} style={{ width: 20, height: 20 }} />
                        <Text style={{ color: 'white', fontSize: 10, }}>Leave</Text>
                    </Button>
                    <Button onPress={() => this.props.navigation.navigate("CalanderScreen")} vertical style={styles.footerButtonInactive}>
                        <Image source={require('../../../ImageAssets/logs.png')} style={{ width: 20, height: 20 }} />
                        <Text style={{ color: 'white', fontSize: 10, }}>Logs</Text>
                    </Button>
                    <Button onPress={() => this.props.navigation.navigate("ReportScreen")} vertical style={styles.footerButtonActive}>
                        <Image source={require('../../../ImageAssets/profile.png')} style={{ width: 20, height: 20 }} />
                        <Text style={{ color: 'white', fontSize: 10, }}>Profile</Text>
                    </Button>
                </Footer>
               
                </ImageBackground>
                </Container>
        );
    }
}