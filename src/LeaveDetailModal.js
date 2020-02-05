import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Modal,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import * as Progress from 'react-native-progress';
import constants from './constants/constants';
import {Container, Header, Content, Button, Textarea} from 'native-base';
import styles from './Style';

class LeaveDetailModal extends React.Component {
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
    leaveType: PropTypes.object.isRequired,
    leaveCount: PropTypes.object.isRequired,
    status: PropTypes.object.isRequired,
    comments: PropTypes.object.isRequired,
    applied_date: PropTypes.object.isRequired,
    leave_to_date: PropTypes.object.isRequired,
    leave_from_date: PropTypes.object.isRequired,
  };

  render() {
    var blnLoading = this.props.loading;
    var status="";
    if(this.props.status==1){
      status="Rejected";
    }
   else if(this.props.status==2){
      status="Cancelled";
    }
   else if(this.props.status==3){
      status="First Approval Done";
    }
   else if(this.props.status==4){
      status="Request Pending";
    }
   else if(this.props.status==5){
      status="Approved";
    }
    return (

      <Modal transparent={true} animationType={'none'} visible={blnLoading}>
        <View
          style={{
            borderRadius: 30,
            // flex: 1,
            zIndex:6,
            height:"60%",
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: constants.colorPurpleLight595278,
            marginTop: 200,
            marginBottom: 100,
            marginRight: 30,
            marginLeft: 30,
          }}>
          <View style={{flexDirection: 'column'}}>
            <View style={{flexDirection: 'row' }}>
            <Text style={{color: "white",}} >Leave Type : </Text>
            <Text style={{color: "white",}} > {this.props.leaveType} </Text>
            </View>
             
            <View style={{flexDirection: 'row',paddingTop:10}}>
            <Text style={styles.leaveHistoryTextHeader}>No Of Days : </Text>
            <Text style={styles.leaveHistoryTextHeader}> {parseInt(this.props.leaveCount)} </Text>
            </View>
            <View style={{flexDirection: 'row',paddingTop:10}}>
            <Text style={styles.leaveHistoryTextHeader}>Leave From : </Text>
            <Text style={styles.leaveHistoryTextHeader}> {this.props.leave_from_date} </Text>
            </View>
            <View style={{flexDirection: 'row',paddingTop:10}}>
            <Text style={styles.leaveHistoryTextHeader}>Leave To : </Text>
            <Text style={styles.leaveHistoryTextHeader}> {this.props.leave_to_date} </Text>
            </View>
            <View style={{flexDirection: 'row',paddingTop:10}}>
            <Text style={styles.leaveHistoryTextHeader}>Status : </Text>
            <Text style={styles.leaveHistoryTextHeader}> {status} </Text>
            </View>
            <View style={{flexDirection: 'row',paddingTop:10}}>
            <Text style={styles.leaveHistoryTextHeader}>Comment : </Text>
            <Textarea disabled={true} style={[styles.leaveHistoryTextHeader,{paddingTop:-5}]}> {this.props.comments.substr(0, 25)} </Textarea>
            </View>
              
          </View>
          <View style={{flexDirection: 'row'}}>
            <Button
              onPress={() => this.props.context.hideLoading()}
              block
              style={{
                flex: 1,
                margin: 18,
                borderRadius: 7,
                backgroundColor: constants.colorRed9d0000,
                height: 40,
              }}>
              <Text style={styles.buttonTextSmall}>Close</Text>
            </Button>
          </View>
        </View>
      </Modal>
    );
  }
}

export default LeaveDetailModal;
