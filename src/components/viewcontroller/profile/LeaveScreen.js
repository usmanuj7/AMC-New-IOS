import React from 'react';
import {
    ListView,
    View,
    StatusBar,
    Text,
    StyleSheet,
    Image, Alert, KeyboardAvoidingView,
    ImageBackground, Platform,
    TextInput, TouchableOpacity, ScrollView, AsyncStorage, BackHandler
} from 'react-native';
import { Container, Body, Title, Center, Content, Footer, FooterTab, Button, Right, Left } from 'native-base';
import DateTimePicker from "react-native-modal-datetime-picker";
import styles from "../../../Style";
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import WebServicesManager from '../../managers/webServicesManager/WebServicesManager';;
import HeaderView from '../Header/Header'
import moment from 'moment';
import Utilities from '../../../utilities/Utilities';
import constants from '../../../constants/constants';
import RNPickerSelect from 'react-native-picker-select';
import LeaveTypeModel from '../../Models/LeaveTypeModel';
import Loader from '../../../Loader';
import DropdownAlert from 'react-native-dropdownalert';
import LeaveModel from '../../Models/LeaveModel';
import SigninDataLogsModel from '../../Models/SigninDataLogsModel';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


export default class LeaveScreen extends React.Component {
    WebServicesManager = new WebServicesManager;
    constructor(props) {
        super(props);

        this.state = {
            documentTypeData: [],
            leaveTypeId: '',
            leaveTypeLabel: '',
            leaveTypeDataSource: [],
            comments: '',
            profileDataSurce: '',
            isLoadingIndicator: false,
            isStartDateTimePickerVisible: false,
            isEndDateTimePickerVisible: false,
            checkedStartDate: '',
            checkedEndDate: '',
            noificationCount: 0
        }
        // userInfo: '',
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

    // getappliedLeave() {

    //     var Leave = { staffid: this.state.profileDataSurce._staffid, clock_date: moment(new Date()).format('YYYY-MM-DD') };
    //     this.WebServicesManager.postApiDailyAttendence({ dataToInsert: Leave, apiEndPoint: "get_daily_attendance_log" },
    //         (statusCode, response) => {
    //             if (Utilities.checkAPICallStatus(statusCode)) {
    //                 if (response.attendance_data.length === 0) {
    //                     this.setState({ isLoadingIndicator: false })
    //                     AsyncStorage.setItem('appLevel', "AlreadyLoggedScreen").then((value) => {
    //                         this.props.navigation.navigate("DashboardScreen");
    //                     })
    //                 }

    //                 else {
    //                     if (response.attendance_data.find(k => k.is_manual == 2 && k.status == 101) !== undefined) {
    //                         this.setState({ isLoadingIndicator: false });
    //                         AsyncStorage.setItem('appLevel', "AlreadyLoggedScreen").then((value) => {
    //                             this.props.navigation.navigate("AlreadyLoggedScreen", { appliedLeave: response.attendance_data });

    //                         })
    //                     }
    //                     else {
    //                         constants.attendance_id = response.attendance_data[0].attendance_id;
    //                         this.setState({ isLoadingIndicator: false })
    //                         AsyncStorage.setItem('appLevel', "AlreadyLoggedScreen").then((value) => {

    //                             this.props.navigation.navigate("DashboardScreen");
    //                         })
    //                     }

    //                 }
    //             }
    //             else if (statusCode === 400) {
    //                 this.dropDownAlertRef1.alertWithType('info', 'Alert', "Please check your internet connection");

    //             }

    //         })

    // }
    async componentWillMount() {


        this.setState({ isLoadingIndicator: false, checkedStartDate: new Date(), checkedEndDate: new Date() });
        const profile = await AsyncStorage.getItem('profileData');
        if (profile !== null) {
            var profileData = JSON.parse(profile);
            this.setState({ profileDataSurce: profileData });
            // this.getappliedLeave();
            this.WebServicesManager.postGetData({ dataToInsert: "", apiEndPoint: "get_all_leave_types" },
                (statusCode, response) => {
                    if (Utilities.checkAPICallStatus(statusCode)) {
                        var leaveTypeData = LeaveTypeModel.parseLeaveTypeModelFromJSON(response.leave_types);
                        this.setState({ leaveTypeDataSource: leaveTypeData });
                        var Leave = { staffid: this.state.profileDataSurce._staffid };
                        this.WebServicesManager.postApiLeaveHistory({ dataToInsert: Leave, apiEndPoint: "get_leave_data" },
                            (statusCode, response) => {
                                if (Utilities.checkAPICallStatus(statusCode)) {
                                    this.setState({ isLoadingIndicator: false });
                                    var leaveModel = LeaveModel.parseLeaveModelFromJSON(response.timesheets);
                                    this.setState({ LeaveModelData: leaveModel });

                                }
                                else if (statusCode === 400) {

                                    this.getLeaveHistoryOffline();
                                }
                            });

                    }
                    else if (statusCode === 400) {
                        this.getLeaveDataOffline()
                    }
                });
        }
    }

    async getLeaveDataOffline() {
        const profile = await AsyncStorage.getItem('leaveTypeData');
        var leaveTypeData = JSON.parse(profile);
        var leaveTypeData = JSON.parse(leaveTypeData);
        this.setState({ leaveTypeDataSource: leaveTypeData });

        const leave = await AsyncStorage.getItem('leaveHistoryData');
        var leaveModel = JSON.parse(leave);
        var leaveModel = JSON.parse(leaveModel);
        this.setState({ LeaveModelData: leaveModel });
    }
    async getLeaveHistoryOffline() {
        const profile = await AsyncStorage.getItem('leaveTypeData');
        var leaveTypeData = JSON.parse(profile);
        var leaveTypeData = JSON.parse(leaveTypeData);
        this.setState({ leaveTypeDataSource: leaveTypeData });

        const leave = await AsyncStorage.getItem('leaveHistoryData');
        var leaveModel = JSON.parse(leave);
        var leaveModel = JSON.parse(leaveModel);
        this.setState({ LeaveModelData: leaveModel });
    }

    applyLeave() {
         
        if (Utilities.isValidString(this.state.leaveTypeLabel)) {
            if (Utilities.isValidString(this.state.checkedStartDate)) {
                if (Utilities.isValidString(this.state.checkedEndDate)) {
                    var leaveCount = 0;
                    this.state.LeaveModelData.map((indexData) => {
                        if (indexData._leave_count !== null)
                            leaveCount = leaveCount + parseInt(indexData._leave_count);
                        // do something with the item
                    })
                    if (this.state.leaveTypeId === '1' || this.state.leaveTypeId === '2' || this.state.leaveTypeId === '3') {

                        this.setState({ isLoadingIndicator: true });
                        var leaveData = {
                            staffID: this.state.profileDataSurce._staffid, leave_type: this.state.leaveTypeId
                            , leave_from_date: this.state.checkedStartDate, leave_to_date: this.state.checkedEndDate, comments: this.state.comments
                        };
                        this.WebServicesManager.postMethodApplyLeave({ dataToInsert: leaveData, apiEndPoint: "apply_leave" },
                            (statusCode, response) => {
                                if (Utilities.checkAPICallStatus(response.responseCode)) {
                                    if (response.response !== undefined && response.response.status === "false_leave_exceeded") {
                                        this.setState({ isLoadingIndicator: false });
                                        this.dropDownAlertRef.alertWithType('info', 'Info', response.response.err_mesg);

                                    }
                                    else {
                                        this.setState({ isLoadingIndicator: false });
                                        this.setState({ leaveTypeLabel: '', checkedStartDate: '', checkedEndDate: '', comments: '' });
                                        this.dropDownAlertRef.alertWithType('info', 'Success', "You have successfully logged your leave");

                                    }
                                }
                                else if (statusCode === 400) {
                                    this.setState({ isLoadingIndicator: false });
                                    var leaveData = {
                                        staffID: this.state.profileDataSurce._staffid, leave_type: this.state.leaveTypeId
                                        , leave_from_date: this.state.checkedStartDate, leave_to_date: this.state.checkedEndDate, comments: this.state.comments
                                    };
                                    this.setofflineDataLeave(leaveData);

                                }
                                else if (response.responseCode === 403) {
                                    this.setState({ isLoadingIndicator: false });
                                    this.dropDownAlertRef.alertWithType('info', 'Alert', response.response.err_mesg);

                                }
                                else if (response.responseCode === 204 || response.responseCode === 404) {
                                    this.setState({ isLoadingIndicator: false });
                                    this.dropDownAlertRef.alertWithType('info', 'Alert', response.response.err_mesg);
                                    // setTimeout(() => { this.props.navigation.navigate("DashboardScreen") }, 3000);

                                }
                            });


                    }
                    else {
                        this.setState({ isLoadingIndicator: true });
                        var leaveData = {
                            staffID: this.state.profileDataSurce._staffid, leave_type: this.state.leaveTypeId
                            , leave_from_date: this.state.checkedStartDate, leave_to_date: this.state.checkedEndDate, comments: this.state.comments
                        };
                        this.WebServicesManager.postMethodApplyLeave({ dataToInsert: leaveData, apiEndPoint: "apply_leave" },
                            (statusCode, response) => {
                                if (Utilities.checkAPICallStatus(response.responseCode)) {
                                    if (response.response !== undefined && response.response.status === "false_leave_exceeded") {
                                        this.setState({ isLoadingIndicator: false });
                                        this.dropDownAlertRef.alertWithType('info', 'Info', response.response.err_mesg);

                                    }
                                    else {
                                        this.setState({ isLoadingIndicator: false });
                                        this.setState({ leaveTypeLabel: '', checkedStartDate: '', checkedEndDate: '', comments: '' });
                                        this.dropDownAlertRef.alertWithType('info', 'Success', "You have successfully logged your leave");

                                    }
                                }
                                else if (statusCode === 400) {
                                    this.setState({ isLoadingIndicator: false });
                                    var leaveData = {
                                        staffID: this.state.profileDataSurce._staffid, leave_type: this.state.leaveTypeId
                                        , leave_from_date: this.state.checkedStartDate, leave_to_date: this.state.checkedEndDate, comments: this.state.comments
                                    };
                                    this.setofflineDataLeave(leaveData);

                                }
                                else if (response.responseCode === 403) {
                                    this.setState({ isLoadingIndicator: false });
                                    this.dropDownAlertRef.alertWithType('info', 'Alert', response.response.err_mesg);

                                }
                                else if (response.responseCode === 204 || response.responseCode === 404) {
                                    this.setState({ isLoadingIndicator: false });
                                    this.dropDownAlertRef.alertWithType('info', 'Alert', response.response.err_mesg);
                                    // setTimeout(() => { this.props.navigation.navigate("DashboardScreen") }, 3000);

                                }
                            });
                    }
                }
                else {
                    this.dropDownAlertRef.alertWithType('info', 'Alert', "Please provide leave end date");
                }
            }
            else {
                this.dropDownAlertRef.alertWithType('info', 'Alert', "Please provide leave start date");
            }
        }
        else {
            this.dropDownAlertRef.alertWithType('info', 'Alert', "Please select leave type");
        }


    }

    async setofflineDataLeave(appliedLeave) {
        var dataToPush = [];
        dataToPush.push(appliedLeave);
        const appliedLeavePrevArray = await AsyncStorage.getItem('appliedLeave');
        if (appliedLeavePrevArray !== null) {
            SearchesToSave = JSON.parse(appliedLeavePrevArray)
            SearchesToSave.push(appliedLeave);
            Utilities.saveToStorage("appliedLeave", SearchesToSave);

            this.setState({ isLoadingIndicator: false });
            this.setState({ leaveTypeLabel: '', checkedStartDate: '', checkedEndDate: '', comments: '' });
            this.dropDownAlertRef.alertWithType('info', 'Success', "Leave request applied on offline mode");

        }
        else {
            Utilities.saveToStorage("appliedLeave", dataToPush);
            this.setState({ isLoadingIndicator: false });
            this.setState({ leaveTypeLabel: '', checkedStartDate: '', checkedEndDate: '', comments: '' });
            this.dropDownAlertRef.alertWithType('info', 'Success', "You have successfully logged your leave");
        }
        this.setState({ leaveTypeLabel: '', checkedStartDate: '', checkedEndDate: '', comments: '' });
    }
    hideStartDateTimePicker = () => {
        this.setState({ isStartDateTimePickerVisible: false });
    };

    hideEndDateTimePicker = () => {
        this.setState({ isEndDateTimePickerVisible: false });
    };

    handleStartDatePicked = date => {
        this.setState({ checkedStartDate: moment(date).format("YYYY-MM-DD") });
        this.hideStartDateTimePicker();
    };
    handleEndDatePicked = date => {
        this.setState({ checkedEndDate: moment(date).format("YYYY-MM-DD") });
        this.hideEndDateTimePicker();
    };

    setLeaveTypeId(value) {
        if (value !== null) {
            this.setState({
                leaveTypeId: this.state.leaveTypeDataSource.find(x => x.value === value)
                    ._id,
                leaveTypeLabel: this.state.leaveTypeDataSource.find(
                    x => x.value === value
                ).label
            });
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
            var check = await AsyncStorage.getItem('appLevelCheckIs');
      debugger
         if(check == "End Duty"){
           debugger
           this.props.navigation.navigate("AlreadyLoggedScreen");
         }else{
           debugger
           this.props.navigation.navigate("DashboardScreen");
         }
            // this.props.navigation.navigate("DashboardScreen");

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

                        this.dropDownAlertRef.alertWithType('info', 'Alert', "Please check your internet connection");
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
                    // this.dropDownAlertRef.alertWithType('info', 'Alert', "Please check your internet connection");
                }
            });
    }


    render() {
        if (this.state.checkedStartDate !== "") {
            var startDate = moment(this.state.checkedStartDate).format('dddd') + ', ' + moment().format("MMM DD, YYYY");
        }
        return (
            <Container style={{ flex: 1 }}>
                <StatusBar barStyle="light-content" hidden={false} backgroundColor={constants.colorPurpleLight595278} translucent={false} />
                <HeaderView name={this.state.profileDataSurce._firstname + " " + this.state.profileDataSurce._lastname} context={this} notificationCount={this.state.noificationCount} />
                <Loader loading={this.state.isLoadingIndicator}></Loader>
                <DropdownAlert  infoColor={constants.coloBrownFFF5DA} titleStyle={{ color: constants.colorGrey838383, fontWeight: 'bold', }}
                                messageStyle={{ color: constants.colorGrey838383, fontWeight: 'bold', fontSize: 12 }} imageStyle={{
                                    padding: 8,
                                    tintColor: constants.colorGrey838383,
                                    alignSelf: 'center',
                                }}
                                ref={ref => this.dropDownAlertRef = ref} />
                <ImageBackground source={require('../../../ImageAssets/background.png')}
                    style={[styles.mainImageBackground]}>
                    <KeyboardAwareScrollView
                        resetScrollToCoords={{ x: 0, y: 0 }}
                        contentContainerStyle={styles.container}
                        scrollEnabled={true}
                    >
                        <ScrollView >
                          
                            <View style={{ flex: 0.2, paddingTop: 10, marginRight: 20 }}>
                                <View style={{ alignItems: 'flex-end',marginRight:20 }}>
                                    <Button medium onPress={() => this.props.navigation.navigate("LeaveHistoryScreen")}
                                        style={{ width: 150, justifyContent: 'center', borderRadius: 10, backgroundColor: constants.colorPurpleDark302757 }}>
                                        <Text style={{ color: 'white', fontSize: 14, paddingBottom: 5, paddingTop: 5 }}>Old Leaves</Text>
                                        <AntDesignIcons name="caretright" size={14} color={'white'} style={{ marginLeft: 15 }} />
                                    </Button>
                                </View>
                                <RNPickerSelect
                                    placeholderTextColor={constants.colorGrey8383831}
                                    items={this.state.leaveTypeDataSource}
                                    onValueChange={(value) => { this.setLeaveTypeId(value) }}
                                    style={{
                                        ...pickerSelectStyles,
                                        iconContainer: {
                                            top: 18,
                                            right: 35,
                                        },
                                    }}
                                    value={this.state.leaveTypeLabel}
                                    useNativeAndroidPickerStyle={false}
                                    textInputProps={{ underlineColor: 'yellow' }}
                                // Icon={() => {
                                //     return <AntDesignIcons name="caretdown" size={16} color={constants.colorSignupButtonf88d08} />;
                                // }}
                                />
                                <View style={styles.transparentInputBox}>
                                    <DateTimePicker
                                        isVisible={this.state.isStartDateTimePickerVisible}
                                        onConfirm={this.handleStartDatePicked.bind(this)}
                                        onCancel={this.hideStartDateTimePicker}
                                    />
                                    <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.setState({ isStartDateTimePickerVisible: true }) }}>

                                        <TextInput
                                            style={styles.LeaveInput}
                                            pointerEvents="none"
                                            editable={false}
                                            value={this.state.checkedStartDate}
                                            placeholder="Leave From"
                                            underlineColorAndroid="transparent"
                                        />
                                    </TouchableOpacity>
                                </View>


                                <View style={styles.transparentInputBox}>
                                    <DateTimePicker
                                        isVisible={this.state.isEndDateTimePickerVisible}
                                        onConfirm={this.handleEndDatePicked.bind(this)}
                                        onCancel={this.hideEndDateTimePicker}
                                    />
                                    <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.setState({ isEndDateTimePickerVisible: true }) }}>

                                        <TextInput
                                            style={styles.LeaveInput}
                                            pointerEvents="none"
                                            editable={false}
                                            value={this.state.checkedEndDate}
                                            placeholder="Leave To"
                                            underlineColorAndroid="transparent"
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.transparentInputBoxTextArea}>

                                    <TextInput

                                        // multiline={true}
                                        numberOfLines={10}
                                        style={styles.inputNotCenterAligned}
                                        placeholder="Details"
                                        value={this.state.comments}
                                        onChangeText={(searchString) => { this.setState({ comments: searchString }) }}
                                        underlineColorAndroid="transparent"
                                    />
                                </View>


                            </View>

<View style={{margin:20}}>
<Button onPress={() => this.applyLeave()} block style={{marginRight:20, borderRadius: 7, backgroundColor: constants.colorRed9d0000, height: 40 }}>
                                <Text style={styles.buttonTextSmall}>
                                    Submit
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
                        <Button onPress={() => this.props.navigation.navigate("LeaveScreen")} vertical style={styles.footerButtonActive} >

                            <Image source={require('../../../ImageAssets/leave.png')} style={{ width: 20, height: 20 }} />
                            <Text style={{ color: 'white', fontSize: 10, }}>Leave</Text>
                        </Button>
                        <Button onPress={() => this.props.navigation.navigate("CalanderScreen")} vertical style={styles.footerButtonInactive}>
                            <Image source={require('../../../ImageAssets/logs.png')} style={{ width: 20, height: 20 }} />
                            <Text style={{ color: 'white', fontSize: 10, }}>Logs</Text>
                        </Button>
                        <Button onPress={() => this.props.navigation.navigate("ReportScreen")} vertical style={styles.footerButtonInactive}>
                            <Image source={require('../../../ImageAssets/profile.png')} style={{ width: 20, height: 20 }} />
                            <Text style={{ color: 'white', fontSize: 10, }}>Profile</Text>
                        </Button>
                    </Footer>

                </ImageBackground>

            </Container>

        );
    }
}
const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        backgroundColor: 'transparent',
        borderWidth: 1,
        marginRight: 20,
        marginLeft: 20,
        opacity: 0.8,
        borderColor: 'grey',
        borderRadius: 7,
        height: 45,
        fontSize: 14,
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderRadius: 8,
        color: 'black',
        paddingRight: 30,
        marginTop: 20,
    },
    inputAndroid: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        backgroundColor: 'transparent',
        borderWidth: 1,
        marginRight: 20,
        marginLeft: 20,
        marginTop: 20,
        opacity: 0.8,
        borderColor: 'grey',
        borderRadius: 7,
        height: 45,
        fontSize: 14,
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderRadius: 8,
        color: 'black',
        paddingRight: 30,

    },
});