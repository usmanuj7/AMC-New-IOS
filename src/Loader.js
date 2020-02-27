import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  ActivityIndicator
} from 'react-native';
import PropTypes from 'prop-types';
import TimerMixin from 'react-timer-mixin';

class Loader extends React.Component {


  constructor(props) {
      super(props);
      this.state={
          loading: props.loading,
          timerId: null,
          autoHiding: false,
      };
  }

  static propTypes = {
      loading: PropTypes.object.isRequired,
  };

  hideLoading = () => {

    if (this.state.timerId) {
      clearTimeout(this.state.timerId)
    }

    this.setState({loading: false,
                   autoHiding: true,
                 timerId: null});


  }

  registerForLoadingHide = () => {

    if (this.state.timerId == null) {
      //clearTimeout(this.state.timerId)
      var ti = setTimeout(() => {this.hideLoading()}, 80000);
      this.setState({ timerId: ti});
    }
  }

  render() {


    var blnLoading = this.props.loading;

    if (blnLoading == true) {

      if (this.state.autoHiding == true && this.state.loading == false) {
        blnLoading = this.state.loading
      }
      else{
          this.registerForLoadingHide();
      }

    }

    return (
      <Modal
        transparent={true}
        animationType={'none'}
        visible={blnLoading}
        onRequestClose={() => {console.log('close modal')}}>
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator
              animating={blnLoading} />
          </View>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
    zIndex:10,
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  }
});

export default Loader;
