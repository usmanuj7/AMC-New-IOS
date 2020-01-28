import React, { Component } from 'react'
import {
    ListView,
    View,
    StatusBar,
    Text,
    Image, Alert,
    ImageBackground,
    TextInput, TouchableOpacity, ScrollView, AsyncStorage, BackHandler
} from 'react-native';
import { Container, Body, Title, Center, Content, Footer, FooterTab, Button, Right, Left } from 'native-base';
import styles from "../../../Style";
import WebServicesManager from '../../managers/webServicesManager/WebServicesManager';
import constants from '../../../constants/constants';
import HeaderView from '../Header/Header'
import moment from 'moment';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';

var tmeout;

export default class Success extends Component {
    WebServicesManager = new WebServicesManager;
    constructor(props) {
        super(props);

        this.state={
          successImage: require('../../../ImageAssets/startduty.gif')

        }
        // userInfo: '',
    }
    menuItemPressed()
    {
       
      if (this.timerHandle) {                  // ***
        // Yes, clear it                     // ***
        clearTimeout(this.timerHandle);      // ***
        this.timerHandle = 0;                // ***
    }
        this.props.navigation.navigate("BreakScreen");
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        
      }
      componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        this.timerHandle =  setTimeout(() => {
          this.props.navigation.navigate("BreakScreen")}, 10000);
      }
      handleBackButton = () => {
        if (this.timerHandle) {                  // ***
          // Yes, clear it                     // ***
          clearTimeout(this.timerHandle);      // ***
          this.timerHandle = 0;                // ***
      }
        this.props.navigation.navigate("BreakScreen");
        return true;
      }
      async componentWillMount()
      {
        var context = this;
        setTimeout(function(){
          context.setState({successImage: require('../../../ImageAssets/startdutypng.png')})}, 2000)
      }
    render() {
        return (
            <Container>
               <StatusBar barStyle = "light-content" hidden = {false} backgroundColor =  {constants.colorPurpleLight595278} translucent = {false}/>
                <HeaderView callFrom={"Success"} context={this}/>
                <ImageBackground source={require('../../../ImageAssets/background.png')}
                    style={[styles.mainImageBackground, { justifyContent: 'center' }]}>

                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderColor:'',backgroundColor: 'white',opacity:0.7 ,marginBottom: 100, marginTop: 80, marginLeft: 40, marginRight: 40 }}>
                    <View style={{ marginBottom: 50, alignItems: 'center',marginTop:30,justifyContent:'center' }}>
                    <Image source={this.state.successImage} style={{ alignItems: 'center', height: 90, width: 90 }} />
                            <Text style={{ color:'black', textAlign: 'center', marginTop:20,fontSize:18,fontWeight:'bold'}} >Thank You</Text>
                            <View style={{height:1,borderTopWidth:2,borderTopColor:'black',marginRight:50,marginLeft:50}}></View>
                        </View>
                        <View>

                        </View>
                        <View style={{marginBottom:20}}>
                            <Text style={{textAlign:'center', color:'black'}}>Start duty recorded on:{"\n"} 
                            {moment(new Date()).format('dddd') +', '+moment().format("MMM DD, YYYY")}{"\n"}
                            {new Date().getHours() +':'+new Date().getMinutes()}</Text>
                        </View>

                    </View>
                    <Footer style={{ backgroundColor:constants.colorPurpleLight595278 }}>
             
              <Button style={styles.footerButtonActive} vertical>
                {/* <Icon name="home" style={{paddingTop:20}} color='white' size={24}/> */}
                <Image source={require('../../../ImageAssets/home.png')} style={{ width: 20, height: 20 }} />
                <Text style={{ color: 'white', fontSize: 10, }}>Home</Text>
              </Button>
              <Button onPress={()=>this.props.navigation.navigate("LeaveScreen")} vertical style={styles.footerButtonInactive} >

                {/* <Icon name="home"  color='white' size={24}/> */}
                <Image source={require('../../../ImageAssets/leave.png')} style={{ width: 20, height: 20 }} />
                <Text style={{ color: 'white', fontSize: 10, }}>Leave</Text>
              </Button>
              <Button onPress={()=>this.props.navigation.navigate("CalanderScreen")}  vertical style={styles.footerButtonInactive} >
                {/* <Icon active name="navigate" color='white' size={24}/> */}
                <Image source={require('../../../ImageAssets/logs.png')} style={{ width: 20, height: 20 }} />
                <Text style={{ color: 'white', fontSize: 10, }}>Logs</Text>
              </Button>
              <Button onPress={()=>this.props.navigation.navigate("ReportScreen")} vertical style={styles.footerButtonInactive} >
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
