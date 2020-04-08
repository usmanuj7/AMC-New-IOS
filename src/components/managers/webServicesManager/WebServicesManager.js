'use strict';
import React, {Component} from 'react';
import Utilities from '../../../utilities/Utilities';
import constants from '../../../constants/constants';
import {Image} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const config = {
  issuer: 'https://demo.identityserver.io',
  clientId: 'native.code',
  redirectUrl: 'io.identityserver.demo:/oauthredirect',
  additionalParameters: {},
  scopes: ['openid', 'profile', 'email', 'offline_access'],

  // serviceConfiguration: {
  //   authorizationEndpoint: 'https://demo.identityserver.io/connect/authorize',
  //   tokenEndpoint: 'https://demo.identityserver.io/connect/token',
  //   revocationEndpoint: 'https://demo.identityserver.io/connect/revoke'
  // }
};
export default class WebServicesManager extends React.Component {
  baseUrl =
    'http://198.72.96.174/~timeattendance/v1/mobile/attendance/endpoint/';
  constructor(props) {
    super(props);
  }

  callPostMethod(apiURL, params, callback) {
    NetInfo.fetch().then(state => {
      if (state.isConnected === true) {
        var formdata = new FormData();
        formdata.append('email', params.dataToInsert.Email);
        formdata.append('password', params.dataToInsert.Password);
        formdata.append('DeviceToken', params.dataToInsert.Token);
        // formdata.append('DeviceType', 'android');
        formdata.append('DeviceType', 'mobile');
        formdata.append('DeviceName', 'iphone');

        var request = {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formdata,
        };
        fetch(apiURL + params.apiEndPoint, request)
          .then(response => response.json())
          .then(responseJson => {
            let statusCode = 200;
            callback(statusCode, responseJson);
          })
          .catch(error => {});
      } else {
        let statusCode = 400;
        callback(statusCode, '');
      }
    });
  }

  callPostMethodForgotPass(apiURL, params, callback) {
    NetInfo.fetch().then(state => {
      if (state.isConnected === true) {
        var formdata = new FormData();
        formdata.append('email', params.dataToInsert.Email);

        var request = {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formdata,
        };
        fetch(apiURL + params.apiEndPoint, request)
          .then(response => response.json())
          .then(responseJson => {
            let statusCode = 200;
            callback(statusCode, responseJson);
          })
          .catch(error => {});
      } else {
        let statusCode = 400;
        callback(statusCode, '');
      }
    });
  }
  callPostMethodStartDuty(apiURL, params, callback) {
    NetInfo.fetch().then(state => {
      if (state.isConnected === true) {
        var formdata = new FormData();
        formdata.append('staffid', params.dataToInsert.staffid);
        formdata.append('date', params.dataToInsert.date);
        formdata.append('clock_in', params.dataToInsert.clock_in);
        formdata.append('clock_out', params.dataToInsert.clock_out);
        formdata.append('comments', 'No comments');

        var request = {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formdata,
        };
        fetch(apiURL + params.apiEndPoint, request)
          .then(response => response.json())
          .then(responseJson => {
            let statusCode = 200;
            callback(statusCode, responseJson);
          })
          .catch(error => {});
      } else {
        let statusCode = 400;
        callback(statusCode, '');
      }
    });
  }
  callPostMethodattendence(apiURL, params, callback) {
    NetInfo.fetch().then(state => {
      if (state.isConnected === true) {
        var formdata = new FormData();
        formdata.append('staffid', params.dataToInsert.staffid);

        var request = {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formdata,
        };
        fetch(apiURL + params.apiEndPoint, request)
          .then(response => response.json())
          .then(responseJson => {
            let statusCode = 200;
            callback(statusCode, responseJson);
          })
          .catch(error => {});
      } else {
        let statusCode = 400;
        callback(statusCode, '');
      }
    });
  }

  callPostMethodChangePassword(apiURL, params, callback) {
    NetInfo.fetch().then(state => {
      if (state.isConnected === true) {
        var formdata = new FormData();
        formdata.append('staffid', params.dataToInsert.staffid);
        formdata.append(
          'current_password',
          params.dataToInsert.current_password,
        );
        formdata.append('new_password', params.dataToInsert.new_password);
        formdata.append(
          'new_password_confirmed',
          params.dataToInsert.new_password_confirmed,
        );

        var request = {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formdata,
        };
        fetch(apiURL + params.apiEndPoint, request)
          .then(response => response.json())
          .then(responseJson => {
            let statusCode = 200;
            callback(statusCode, responseJson);
          })
          .catch(error => {});
      } else {
        let statusCode = 400;
        callback(statusCode, '');
      }
    });
  }

  callPostMethodStartBreak(apiURL, params, callback) {
    NetInfo.fetch().then(state => {
      if (state.isConnected === true) {
        var formdata = new FormData();
        formdata.append('staffid', params.dataToInsert.staffid);
        formdata.append('attendance_id', params.dataToInsert.attendance_id);
        formdata.append('status', params.dataToInsert.status);
        formdata.append('swipe_time', params.dataToInsert.swipe_time);
        formdata.append('clock_date', params.dataToInsert.clock_date);

        var request = {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formdata,
        };
        fetch(apiURL + params.apiEndPoint, request)
          .then(response => response.json())
          .then(responseJson => {
            let statusCode = 200;
            callback(statusCode, responseJson);
          })
          .catch(error => {
            //
          });
      } else {
        let statusCode = 400;
        callback(statusCode, '');
      }
    });
  }

  callPostMethodApplyLeave(apiURL, params, callback) {
    NetInfo.fetch().then(state => {
      if (state.isConnected === true) {
        var formdata = new FormData();
        formdata.append('staffid', params.dataToInsert.staffID);
        formdata.append('leave_type', params.dataToInsert.leave_type);
        formdata.append('leave_from_date', params.dataToInsert.leave_from_date);
        formdata.append('leave_to_date', params.dataToInsert.leave_to_date);
        formdata.append('comments', params.dataToInsert.comments);

        var request = {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formdata,
        };
        fetch(apiURL + params.apiEndPoint, request)
          .then(response => response.json())
          .then(responseJson => {
            let statusCode = 200;
            callback(statusCode, responseJson);
          })
          .catch(error => {});
      } else {
        let statusCode = 400;
        callback(statusCode, '');
      }
    });
  }
  callPostMethodLeaveHistory(apiURL, params, callback) {
    NetInfo.fetch().then(state => {
      if (state.isConnected === true) {
        var formdata = new FormData();
        formdata.append('staffid', params.dataToInsert.staffid);

        var request = {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formdata,
        };
        fetch(apiURL + params.apiEndPoint, request)
          .then(response => response.json())
          .then(responseJson => {
            let statusCode = 200;
            callback(statusCode, responseJson);
          })
          .catch(error => {});
      } else {
        let statusCode = 400;
        callback(statusCode, '');
      }
    });
  }
  callPostMethodDeleteLeave(apiURL, params, callback) {
    NetInfo.fetch().then(state => {
      if (state.isConnected === true) {
        var formdata = new FormData();
        formdata.append('staffid', params.dataToInsert.staffid);
        formdata.append(
          'leave_request_id',
          params.dataToInsert.leave_request_id,
        );

        var request = {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formdata,
        };
        fetch(apiURL + params.apiEndPoint, request)
          .then(response => response.json())
          .then(responseJson => {
            let statusCode = 200;
            callback(statusCode, responseJson);
          })
          .catch(error => {});
      } else {
        let statusCode = 400;
        callback(statusCode, '');
      }
    });
  }
  callPostMethodEndDuty(apiURL, params, callback) {
    NetInfo.fetch().then(state => {
      if (state.isConnected === true) {
        var formdata = new FormData();
        formdata.append('staffid', params.dataToInsert.staffid);
        formdata.append('attendance_id', params.dataToInsert.attendance_id);
        formdata.append('clock_out', params.dataToInsert.clock_out);
        formdata.append('date', params.dataToInsert.date_times);

        var request = {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formdata,
        };
        fetch(apiURL + params.apiEndPoint, request)
          .then(response => response.json())
          .then(responseJson => {
            let statusCode = 200;
            callback(statusCode, responseJson);
          })
          .catch(error => {});
      } else {
        let statusCode = 400;
        callback(statusCode, '');
      }
    });
  }
  callPostMethodUpdateTime(apiURL, params, callback) {
    NetInfo.fetch().then(state => {
      if (state.isConnected === true) {
        var formdata = new FormData();
        formdata.append(
          'staff_clocktime_id',
          params.dataToInsert.staff_clocktime_id,
        );
        formdata.append('time', params.dataToInsert.time);
        formdata.append('clock_date', params.dataToInsert.clock_date);

        var request = {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formdata,
        };
        fetch(apiURL + params.apiEndPoint, request)
          .then(response => response.json())
          .then(responseJson => {
            let statusCode = 200;
            callback(statusCode, responseJson);
          })
          .catch(error => {});
      } else {
        let statusCode = 400;
        callback(statusCode, '');
      }
    });
  }
  callPostMethodEndDuty(apiURL, params, callback) {
    NetInfo.fetch().then(state => {
      if (state.isConnected === true) {
        var formdata = new FormData();
        formdata.append('staffid', params.dataToInsert.staffid);
        formdata.append('attendance_id', params.dataToInsert.attendance_id);
        formdata.append('clock_out', params.dataToInsert.clock_out);
        formdata.append('date', params.dataToInsert.date_times);

        var request = {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formdata,
        };
        fetch(apiURL + params.apiEndPoint, request)
          .then(response => response.json())
          .then(responseJson => {
            let statusCode = 200;
            callback(statusCode, responseJson);
          })
          .catch(error => {});
      } else {
        let statusCode = 400;
        callback(statusCode, '');
      }
    });
  }
  callPostMethodAttendance(apiURL, params, callback) {
    NetInfo.fetch().then(state => {
      if (state.isConnected === true) {
        var formdata = new FormData();
        formdata.append('staffid', params.dataToInsert.staffid);
        formdata.append('clock_date', params.dataToInsert.clock_date);

        var request = {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formdata,
        };
        fetch(apiURL + params.apiEndPoint, request)
          .then(response => response.json())
          .then(responseJson => {
            let statusCode = 200;
            callback(statusCode, responseJson);
          })
          .catch(error => {});
      } else {
        let statusCode = 400;
        callback(statusCode, '');
      }
    });
  }
  callPostMethodSetNotify(apiURL, params, callback) {
    NetInfo.fetch().then(state => {
      if (state.isConnected === true) {
        var formdata = new FormData();
        formdata.append('staffid', params.dataToInsert.staffid);
        formdata.append('missed_in', params.dataToInsert.missed_in);
        formdata.append('missed_out', params.dataToInsert.missed_out);
        formdata.append('announcement', params.dataToInsert.announcement);

        var request = {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formdata,
        };
        fetch(apiURL + params.apiEndPoint, request)
          .then(response => response.json())
          .then(responseJson => {
            let statusCode = 200;
            callback(statusCode, responseJson);
          })
          .catch(error => {});
      } else {
        let statusCode = 400;
        callback(statusCode, '');
      }
    });
  }
  callPostMethodAttendanceBarChart(apiURL, params, callback) {
    NetInfo.fetch().then(state => {
      if (state.isConnected === true) {
        var formdata = new FormData();
        formdata.append('staffid', params.dataToInsert.staffid);
        formdata.append('week_start_date', params.dataToInsert.week_start_date);
        formdata.append('week_end_date', params.dataToInsert.week_end_date);

        var request = {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formdata,
        };
        fetch(apiURL + params.apiEndPoint, request)
          .then(response => response.json())
          .then(responseJson => {
            let statusCode = 200;
            callback(statusCode, params.weeknumber, responseJson);
          })
          .catch(error => {});
      } else {
        let statusCode = 400;
        callback(statusCode, '');
      }
    });
  }
  callPostMethodDeleteShift(apiURL, params, callback) {
    NetInfo.fetch().then(state => {
      if (state.isConnected === true) {
        var formdata = new FormData();
        formdata.append('attendance_id', params.dataToInsert.attendance_id);

        var request = {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formdata,
        };
        fetch(apiURL + params.apiEndPoint, request)
          .then(response => response.json())
          .then(responseJson => {
            let statusCode = 200;
            callback(statusCode, responseJson);
          })
          .catch(error => {});
      } else {
        let statusCode = 400;
        callback(statusCode, '');
      }
    });
  }
  callPostMethodDeleteBreak(apiURL, params, callback) {
    NetInfo.fetch().then(state => {
      if (state.isConnected === true) {
        var formdata = new FormData();
        formdata.append('attendance_id', params.dataToInsert.attendance_id);
        formdata.append('staffid', params.dataToInsert.staffid);

        var request = {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formdata,
        };
        fetch(apiURL + params.apiEndPoint, request)
          .then(response => response.json())
          .then(responseJson => {
            let statusCode = 200;
            callback(statusCode, responseJson);
          })
          .catch(error => {});
      } else {
        let statusCode = 400;
        callback(statusCode, '');
      }
    });
  }
  callPostMethodHourHistory(apiURL, params, callback) {
    NetInfo.fetch().then(state => {
      if (state.isConnected === true) {
        var formdata = new FormData();
        formdata.append('staffid', params.dataToInsert.staffid);
        formdata.append('week_number', params.dataToInsert.week_number);
        formdata.append('month_year', params.dataToInsert.month_year);

        var request = {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formdata,
        };
        fetch(apiURL + params.apiEndPoint, request)
          .then(response => response.json())
          .then(responseJson => {
            let statusCode = 200;
            callback(statusCode, responseJson);
          })
          .catch(error => {});
      } else {
        let statusCode = 400;
        callback(statusCode, '');
      }
    });
  }
  callPostMethodHourHistoryMonth(apiURL, params, callback) {
    NetInfo.fetch().then(state => {
      if (state.isConnected === true) {
        var formdata = new FormData();
        formdata.append('staffid', params.dataToInsert.staffid);
        formdata.append('month_year', params.dataToInsert.month_year);

        var request = {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formdata,
        };
        fetch(apiURL + params.apiEndPoint, request)
          .then(response => response.json())
          .then(responseJson => {
            let statusCode = 200;
            callback(statusCode, responseJson);
          })
          .catch(error => {});
      } else {
        let statusCode = 400;
        callback(statusCode, '');
      }
    });
  }
  callPostMethodHourHistoryYear(apiURL, params, callback) {
    NetInfo.fetch().then(state => {
      if (state.isConnected === true) {
        var formdata = new FormData();
        formdata.append('staffid', params.dataToInsert.staffid);
        // formdata.append('month_year', params.dataToInsert.month_year);
        formdata.append('year', params.dataToInsert.year);

        var request = {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formdata,
        };
        fetch(apiURL + params.apiEndPoint, request)
          .then(response => response.json())
          .then(responseJson => {
            let statusCode = 200;
            callback(statusCode, responseJson);
          })
          .catch(error => {});
      } else {
        let statusCode = 400;
        callback(statusCode, '');
      }
    });
  }
  callPostMethodEndDuty(apiURL, params, callback) {
    NetInfo.fetch().then(state => {
      if (state.isConnected === true) {
        var formdata = new FormData();
        formdata.append('staffid', params.dataToInsert.staffid);
        formdata.append('attendance_id', params.dataToInsert.attendance_id);
        formdata.append('clock_out', params.dataToInsert.clock_out);
        formdata.append('date', params.dataToInsert.date_times);

        var request = {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formdata,
        };
        fetch(apiURL + params.apiEndPoint, request)
          .then(response => response.json())
          .then(responseJson => {
            let statusCode = 200;
            callback(statusCode, responseJson);
          })
          .catch(error => {});
      } else {
        let statusCode = 400;
        callback(statusCode, '');
      }
    });
  }
  callPostMethodAttendance(apiURL, params, callback) {
    NetInfo.fetch().then(state => {
      if (state.isConnected === true) {
        var formdata = new FormData();
        formdata.append('staffid', params.dataToInsert.staffid);
        formdata.append('clock_date', params.dataToInsert.clock_date);

        var request = {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formdata,
        };
        fetch(apiURL + params.apiEndPoint, request)
          .then(response => response.json())
          .then(responseJson => {
            let statusCode = 200;
            callback(statusCode, responseJson);
          })
          .catch(error => {});
      } else {
        let statusCode = 400;
        callback(statusCode, '');
      }
    });
  }
  callPostMethodHourHistory(apiURL, params, callback) {
    NetInfo.fetch().then(state => {
      if (state.isConnected === true) {
        var formdata = new FormData();
        formdata.append('staffid', params.dataToInsert.staffid);
        formdata.append('week_number', params.dataToInsert.week_number);
        formdata.append('month_year', params.dataToInsert.month_year);

        var request = {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formdata,
        };
        fetch(apiURL + params.apiEndPoint, request)
          .then(response => response.json())
          .then(responseJson => {
            let statusCode = 200;
            callback(statusCode, responseJson);
          })
          .catch(error => {});
      } else {
        let statusCode = 400;
        callback(statusCode, '');
      }
    });
  }
  callPostMethodGetData(apiURL, params, callback) {
    NetInfo.fetch().then(state => {
      if (state.isConnected === true) {
        fetch(apiURL + params.apiEndPoint, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          // body: params.dataToInsert
        })
          .then(response => response.json())
          .then(responseJson => {
            let statusCode = 200;
            callback(statusCode, responseJson);
          })
          .catch(error => {});
      } else {
        let statusCode = 400;
        callback(statusCode, '');
      }
    });
  }
  callPostMethodDailyLogData(apiURL, params, callback) {
    NetInfo.fetch().then(state => {
      if (state.isConnected === true) {
        fetch(apiURL + params.apiEndPoint, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          // body: params.dataToInsert
        })
          .then(response => response.json())
          .then(responseJson => {
            let statusCode = 200;
            callback(statusCode, responseJson);
          })
          .catch(error => {});
      } else {
        let statusCode = 400;
        callback(statusCode, '');
      }
    });
  }

  postApiCall(params, callback) {
    return this.callPostMethod(this.baseUrl, params, callback);
  }
  postApiCallStartDuty(params, callback) {
    return this.callPostMethodStartDuty(this.baseUrl, params, callback);
  }
  postApiCallForgotPass(params, callback) {
    return this.callPostMethodForgotPass(this.baseUrl, params, callback);
  }
  postApiCallAttendence(params, callback) {
    return this.callPostMethodattendence(this.baseUrl, params, callback);
  }
  postMethodStartBreak(params, callback) {
    return this.callPostMethodStartBreak(this.baseUrl, params, callback);
  }
  postMethodApplyLeave(params, callback) {
    return this.callPostMethodApplyLeave(this.baseUrl, params, callback);
  }

  postMethodEndDuty(params, callback) {
    return this.callPostMethodEndDuty(this.baseUrl, params, callback);
  }
  postMethodUpdateTime(params, callback) {
    return this.callPostMethodUpdateTime(this.baseUrl, params, callback);
  }
  postApiLeaveHistory(params, callback) {
    return this.callPostMethodLeaveHistory(this.baseUrl, params, callback);
  }
  postApiDeleteLeave(params, callback) {
    return this.callPostMethodDeleteLeave(this.baseUrl, params, callback);
  }
  postApiLeaveHistory(params, callback) {
    return this.callPostMethodLeaveHistory(this.baseUrl, params, callback);
  }
  postGetData(params, callback) {
    return this.callPostMethodGetData(this.baseUrl, params, callback);
  }
  postApiDailyAttendence(params, callback) {
    return this.callPostMethodAttendance(this.baseUrl, params, callback);
  }
  postApiSetNotify(params, callback) {
    return this.callPostMethodSetNotify(this.baseUrl, params, callback);
  }
  postApiDailyAttendenceBarChart(params, callback) {
    return this.callPostMethodAttendanceBarChart(
      this.baseUrl,
      params,
      callback,
    );
  }
  postApiDeleteShift(params, callback) {
    return this.callPostMethodDeleteShift(this.baseUrl, params, callback);
  }
  postApiDeleteBreak(params, callback) {
    return this.callPostMethodDeleteBreak(this.baseUrl, params, callback);
  }
  postApiHoursHistory(params, callback) {
    return this.callPostMethodHourHistory(this.baseUrl, params, callback);
  }
  postApiHoursHistoryMonth(params, callback) {
    return this.callPostMethodHourHistoryMonth(this.baseUrl, params, callback);
  }
  postApiHoursHistoryYear(params, callback) {
    return this.callPostMethodHourHistoryYear(this.baseUrl, params, callback);
  }
  postApiDailyLogData(params, callback) {
    return this.callPostMethodDailyLogData(this.baseUrl, params, callback);
  }
  postApiChangePassword(params, callback) {
    return this.callPostMethodChangePassword(this.baseUrl, params, callback);
  }
  static postApiCallDutyStatic(params, callback) {
    var formdata = new FormData();
    formdata.append('attendance_json', params.dataToInsert.attendance_json);

    var request = {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formdata,
    };
    fetch(
      'http://198.72.96.174/~timeattendance/v1/mobile/attendance/endpoint/' +
        params.apiEndPoint,
      request,
    )
      .then(response => response.json())
      .then(responseJson => {
        let statusCode = 200;
        callback(statusCode, responseJson);
      })
      .catch(error => {
        let statusCode = 400;
        callback(statusCode, responseJson);
      });
  }
  static callPostMethodAttendanceOffline(params, callback) {
    var formdata = new FormData();
    formdata.append('staffid', params.dataToInsert.staffid);
    formdata.append('clock_date', params.dataToInsert.clock_date);

    var request = {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formdata,
    };
    fetch(
      'http://198.72.96.174/~timeattendance/v1/mobile/attendance/endpoint/' +
        params.apiEndPoint,
      request,
    )
      .then(response => response.json())
      .then(responseJson => {
        let statusCode = 200;
        callback(statusCode, responseJson);
      })
      .catch(error => {
        let statusCode = 400;
        callback(statusCode, responseJson);
      });
  }
  static postMethodDeleteShiftOffline(params, callback) {
    NetInfo.fetch().then(state => {
      if (state.isConnected === true) {
        var formdata = new FormData();
        formdata.append('attendance_id', params.dataToInsert.attendance_id);

        var request = {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formdata,
        };
        fetch(
          'http://198.72.96.174/~timeattendance/v1/mobile/attendance/endpoint/' +
            params.apiEndPoint,
          request,
        )
          .then(response => response.json())
          .then(responseJson => {
            let statusCode = 200;
            callback(statusCode, responseJson);
          })
          .catch(error => {});
      } else {
        let statusCode = 400;
        callback(statusCode, '');
      }
    });
  }
  static postApiLeaveSubmitStatic(params, callback) {
    var formdata = new FormData();
    formdata.append('leave_json', params.dataToInsert.attendance_json);

    var request = {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formdata,
    };
    fetch(
      'http://198.72.96.174/~timeattendance/v1/mobile/attendance/endpoint/' +
        params.apiEndPoint,
      request,
    )
      .then(response => response.json())
      .then(responseJson => {
        let statusCode = 200;
        callback(statusCode, responseJson);
      })
      .catch(error => {
        let statusCode = 400;
        callback(statusCode, responseJson);
      });
  }
}
