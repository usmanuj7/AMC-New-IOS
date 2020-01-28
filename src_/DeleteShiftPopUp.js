import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  ActivityIndicator,
  Text,
  TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import * as Progress from 'react-native-progress';
import constants from './constants/constants';
import { Container, Header, Content, Button } from 'native-base';
import styles from './Style';

class DeleteShiftPopUp extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      loading: props.loading,
      timerId: null,
      autoHiding: false,
    };
  }

  static propTypes = {
    loading: PropTypes.object.isRequired,
    context: PropTypes.object.isRequired,
    eventTitle: PropTypes.object.isRequired,
    checkDutyDate: PropTypes.object.isRequired,

  };


  render() {


    var blnLoading = this.props.loading;
    if(this.props.checkDutyDate!=="")
{    

    return (
      <Modal
        transparent={true}
        animationType={'none'}
        visible={blnLoading}>
        <View style={{
          borderRadius: 30, flex: 1, alignItems: 'center', justifyContent: 'center',
          backgroundColor: constants.colorPurpleLight595278, marginTop: 150, marginBottom: 150, marginRight: 30, marginLeft: 30
        }}>
            <Text style={{ color: 'white', fontSize: 20, textAlign: 'center' }}>{this.props.eventTitle}</Text>
            <View style={{flexDirection:'row'}}>
            <Button onPress={() => this.props.context.hideLoading()} block style={{flex:1, margin: 18, borderRadius: 7, backgroundColor: constants.colorRed9d0000, height: 40 }}>
              <Text style={styles.buttonTextSmall}>
                Close
                </Text>
            </Button>
            <Button onPress={() => this.props.context.checkDuty(this.props.checkDutyDate)} block style={{flex:1, margin: 18, borderRadius: 7, backgroundColor: constants.colorRed9d0000, height: 40 }}>
              <Text style={styles.buttonTextSmall}>
                Check Duty
                </Text>
            </Button>
            </View>
           
        </View>
      </Modal>
    )
      }
    else
    return (
      <Modal
        transparent={true}
        animationType={'none'}
        visible={blnLoading}>
        <View style={{
          borderRadius: 30, flex: 1, alignItems: 'center', justifyContent: 'center',
          backgroundColor: constants.colorPurpleLight595278, marginTop: 150, marginBottom: 150, marginRight: 30, marginLeft: 30
        }}>
          <View>
            <Text style={{ color: 'white', fontSize: 20, textAlign: 'center' }}>{this.props.eventTitle}</Text>
            <Button onPress={() => this.props.context.hideLoading()} block style={{ margin: 18, borderRadius: 7, backgroundColor: constants.colorRed9d0000, height: 40 }}>
              <Text style={styles.buttonTextSmall}>
                Close
                </Text>
            </Button>
           
          </View>
        </View>
      </Modal>
    )
  }
}


export default DeleteShiftPopUp;
