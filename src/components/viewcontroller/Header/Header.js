import React from 'react';
import {
  ListView,
  View,
  StatusBar,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Alert,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  ScrollView,
  AsyncStorage,
  BackHandler,
  Button,
  Platform,
} from 'react-native';
import {Header, Badge} from 'react-native-elements';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import PropTypes from 'prop-types';
import IconBadge from 'react-native-icon-badge';
import constants from '../../../constants/constants';
import Utilities from '../../../utilities/Utilities';

class HeaderView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      appStatus: '',
    };
    // this.handlePress = this.handlePress.bind(this)
  }
  componentWillMount() {
    this.setState({appStatus: constants.appStatus});
  }
  componentWillUnmount() {}

  static propTypes = {
    callFrom: PropTypes.object.isRequired,
    name: PropTypes.object.isRequired,
    notificationCount: 0,
  };

  toggleStatus() {
    if (constants.appStatus === 'Online') {
      constants.appStatus = 'Offline';
      this.setState({appStatus: constants.appStatus});
    } else if (constants.appStatus === 'Offline') {
      constants.appStatus = 'Online';
      this.setState({appStatus: constants.appStatus});
      Utilities.sendLocalStorageToServer();
    }
  }
  render() {
    if (this.props.name !== 'undefined undefined')
      var headerText = this.props.name;
    if (this.props.callFrom === 'Success') {
      return (
        <View
          style={{
            paddingLeft: 10,
            flexDirection: 'row',
            backgroundColor: '#595278',
            paddingTop: Platform.OS === 'ios' ? 60 : 5,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            onPress={() => this.props.context.menuItemPressed()}
            style={{
              flexDirection: 'row',
              paddingBottom: 10,
              alignContent: 'center',
              justifyContent: 'center',
              
            }}>
            <Image source={require('../../../ImageAssets/back1.png')} resizeMode ={"contain"}style={{width:80, height:40}}></Image>
          </TouchableOpacity>

          <View
            style={{
              flex: 1.3,
              alignContent: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: '#fff'}}>Back To Dashboard</Text>
          </View>
          <View
            style={{
              flex: 0.2,
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginRight: 10,
            }}>
            <TouchableOpacity
              onPress={() => this.props.context.pressNotification()}>
              {/* <IconBadge
                            MainElement={
                                // <View  style={{
                                //     backgroundColor: '#489EFE',
                                //     width: 50,
                                //     height: 50,
                                //     margin: 6
                                // }} />
                                <AntDesignIcons name="bells" style={{width: 50,height: 50,marginTop:10}} color='#fff' size={24}/>
                            }
                            BadgeElement={
                                <Text style={{ color: '#FFFFFF' }}>{this.state.BadgeCount}</Text>
                            }
                            IconBadgeStyle={
                                {
                                    position:'absolute',
                                    top:1,
                                    right:15,
                                    width:20,
                                    height:20,
                                    borderRadius:15,
                                   
                                    backgroundColor: '#FF0000'
                                }
                            }
                            
                            Hidden={this.state.BadgeCount == 0}
                        /> */}
            </TouchableOpacity>
          </View>
        </View>
        //     <Header
        //      leftComponent={{margin: 20, icon: 'angle-left', color: '#fff',type: 'font-awesome', onPress: () => this.props.context.menuItemPressed(),}}
        //     centerComponent={{ text: 'Back To Dashboard', style: { color: '#fff', } }}
        //     rightComponent={{ icon: 'bell', color: '#fff',type: 'font-awesome',onPress: () => this.props.context.pressNotification() }}
        //     backgroundColor={'#595278'}
        //     containerStyle={{height:50,paddingTop:-10,paddingLeft:20}}
        //     rightContainerStyle={{alignItems:'center'}}

        // />
      );
    } else if (this.props.callFrom === 'ChangePass') {
      return (
        <View
          style={{
            paddingLeft: 10,
            flexDirection: 'row',
            backgroundColor: '#595278',
            paddingTop: Platform.OS === 'ios' ? 60 : 5,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            onPress={() => this.props.context.menuItemPressed()}
            style={{
              flexDirection: 'row',
              // paddingLeft: 10,
              flex: 1,
              alignContent: 'center',
              justifyContent: 'center',
            }}>
            <Image source={require('../../../ImageAssets/back1.png')} resizeMode ={"contain"}style={{width:80, height:40}}></Image>
          </TouchableOpacity>

          <View
            style={{
              flex: 5,
              marginLeft: 60,
              alignContent: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{color: '#fff'}}>Change Password</Text>
          </View>
        </View>
      );
    } else {
      if (this.props.notificationCount > 0) {
      }

      return (
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#595278',
            paddingTop: Platform.OS === 'ios' ? 60 : 5,
          }}>
          <View
            style={{
              flex: 8,
              alignContent: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: '#fff', width:"100%"}}>
            <Text> WELCOME:</Text>
          <Text style={{fontWeight: "bold", fontSize:15, }}> {headerText}</Text>
            </Text>
          </View>

          <View
            style={{
              flex: 2.2,
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginRight: 10,
              marginTop: 10,
            }}>
            <TouchableOpacity
              onPress={() => this.props.context.pressNotification()}>
              <IconBadge
                MainElement={
                  // <View  style={{
                  //     backgroundColor: '#489EFE',
                  //     width: 50,
                  //     height: 50,
                  //     margin: 6
                  // }} />
                  <AntDesignIcons
                    name="bells"
                    style={{width: 50, height: 50, marginTop: 10}}
                    color="#fff"
                    size={24}
                  />
                }
                BadgeElement={
                  <Text style={{color: '#FFFFFF'}}>
                    {this.props.notificationCount}
                  </Text>
                }
                IconBadgeStyle={{
                  position: 'absolute',
                  top: 1,
                  right: 15,
                  width: 20,
                  height: 20,
                  borderRadius: 15,

                  backgroundColor: '#FF0000',
                }}
                Hidden={this.props.notificationCount == 0 ? true : false}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }
}

export default HeaderView;
