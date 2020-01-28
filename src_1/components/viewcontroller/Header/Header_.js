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
    TextInput, TouchableOpacity, ScrollView, AsyncStorage, BackHandler, Button,Platform
} from 'react-native';
import { Header, Badge } from 'react-native-elements';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types';
import IconBadge from 'react-native-icon-badge';
import constants from '../../../constants/constants';
import Utilities from '../../../utilities/Utilities';

class HeaderView extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            count: 0,
            appStatus:''
        }
        // this.handlePress = this.handlePress.bind(this)
    }
    componentWillMount() {
        this.setState({appStatus:constants.appStatus})
    }
    componentWillUnmount() {
      }
      

    // static propTypes = {
    //     callFrom: PropTypes.string.isRequired,
    //     name: PropTypes.string.isRequired
    // };

    toggleStatus()
    {
         
        if(constants.appStatus==="Online")
        {
            constants.appStatus="Offline";
            this.setState({appStatus:constants.appStatus})
        }
        else if(constants.appStatus==="Offline")
        {
            constants.appStatus="Online";
            this.setState({appStatus:constants.appStatus})
            Utilities.sendLocalStorageToServer();

        }
    }
    render() {
        
        if(this.props.name!=="undefined undefined")
        var headerText = 'Welcome ' + this.props.name;
        if (this.props.callFrom === "Success") {
            return (
                <View style={{ flexDirection: 'row',height:60, backgroundColor: '#595278',paddingTop:Platform.OS === 'ios' ? 60 : 5 }}>
                    <View style={{flexDirection:'row', alignItems: 'center', justifyContent: 'center',marginLeft:6}}>
                        <TouchableOpacity onPress= {() => this.props.context.menuItemPressed()} style={{flexDirection:'column',
                       }}>
                           <Image  source={require('../../../ImageAssets/backbtn.png')} >
          </Image>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1.3, alignContent: 'center', justifyContent: 'center', alignItems: 'center', }}>
                        <Text style={{ color: '#fff', }}>Back To Dashboard</Text>
                    </View>
                    <View style={{ flex: 0.2, flexDirection: 'row', justifyContent: 'flex-end', marginRight: 10, marginTop: 10 }}>
                        <TouchableOpacity onPress={() => this.props.context.pressNotification()}>
                    
                        </TouchableOpacity>

                    </View>
                </View>
               
            )
        }
       else if (this.props.callFrom === "ChangePass") {
            return (
                <View style={{ flexDirection: 'row', backgroundColor: '#595278',alignItems: 'center',height:50 ,paddingTop: Platform.OS === 'ios' ? 60 : 5,}}>
                        <TouchableOpacity onPress= {() => this.props.context.menuItemPressed()} style={{paddingLeft:10,paddingRight:20}}>
                        <Image  source={require('../../../ImageAssets/backbtn.png')} >
          </Image>
                        </TouchableOpacity>
                    
                    <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center', }}>
                        <Text style={{ color: '#fff', }}>Change Password</Text>
                    </View>
                   
                </View>
                
            )
        }
        else
        {
            if(this.props.notificationCount>0)
            {
                 
            }

            return (

                <View style={{ flexDirection: 'row', backgroundColor: '#595278' ,paddingTop:Platform.OS === 'ios' ? 60 : 5}}>
                    <View style={{ flex: 1.3, alignContent: 'center', justifyContent: 'center', alignItems: 'center', }}>
                        <Text style={{ color: '#fff', }}>{headerText}</Text>
                    </View>
                    <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'flex-end',marginRight:20 }}>
                
                    </View>
                    <View style={{ flex: 0.2, flexDirection: 'row', justifyContent: 'flex-end', marginRight: 10, marginTop: 10 }}>
                        <TouchableOpacity onPress={() => this.props.context.pressNotification()}>
                            <IconBadge
                                MainElement={
                                    <AntDesignIcons name="bells" style={{ width: 50, height: 50, marginTop: 10 }} color='#fff' size={24} />
                                }
                                BadgeElement={
                                    <Text style={{ color: '#FFFFFF' }}>{this.props.notificationCount}</Text>
                                }
                                IconBadgeStyle={
                                    {
                                        position: 'absolute',
                                        top: 1,
                                        right: 15,
                                        width: 20,
                                        height: 20,
                                        borderRadius: 15,

                                        backgroundColor: '#FF0000'
                                    }
                                }
                                Hidden={this.props.notificationCount == 0?true:false}
                            /></TouchableOpacity>

                    </View>
                
                </View>

            )
                            }
    }
}

export default HeaderView;
