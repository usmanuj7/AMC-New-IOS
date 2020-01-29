import Model from 'react-native-models';

export default class DailyLogsModel extends Model {
  // className used instead name because babel replaces him at run-time.
  static get className() {
    return 'DailyLogsModel';
  }

  constructor(json, length, title) {
    super({
      staff_clocktime_id: 'Integer',
      staffid: 'Integer',
      attendance_id: 'Integer',
      clock_time: 'DateTime',
      clock_date: 'DateTime',
      added_date: 'DateTime',
      is_manual: 'Integer',
      status: 'Integer',
      totalEntries: 'Integer',
      title: 'String',
    });

    this._staff_clocktime_id = json.staff_clocktime_id;
    this._staffid = json.staffid;
    this._attendance_id = json.attendance_id;
    this._clock_time = json.clock_time;
    this._clock_date = json.clock_date;
    this._added_date = json.added_date;
    this._is_manual = json.is_manual;
    this._status = json.status;
    this._totalEntries = length;
    this._title = title;
  }

  static parseDailyLogsModelFromJSON(json) {
    var title = 'End Break';
    var dailyLogsList = [];
    if (json.length > 0) {
      for (var jsonItem in json) {
        if (json[jsonItem].is_manual === '2' && json[jsonItem].status === '1') {
          title = 'Start Duty';
        } else if (
          json[jsonItem].is_manual === '2' &&
          json[jsonItem].status === '101'
        ) {
          title = 'End Duty';
        } else if (
          json[jsonItem].is_manual !== '2' &&
          json[jsonItem].status === '1'
        ) {
          title = 'End Break';
        } else if (
          json[jsonItem].is_manual !== '2' &&
          json[jsonItem].status === '101'
        ) {
          title = 'Start Break';
        }
        let itemFromJson = new DailyLogsModel(
          json[jsonItem],
          json.length,
          title,
        );
        dailyLogsList.push(itemFromJson);
      }

      if (
        dailyLogsList.find(k => k._is_manual == '2' && k._status == '101') ===
        undefined
      ) {
        itemFromJson = new DailyLogsModel(
          {
            added_date: json[0].added_date,
            attendance_id: json[0].attendance_id,
            clock_date: json[0].clock_date,
            clock_time: json[0].clock_time,
            is_manual: '',
            staff_clocktime_id: json[0].staff_clocktime_id,
            staffid: json[0].staffid,
            status: '0',
          },
          json.length,
          'End Duty',
        );
        dailyLogsList.push(itemFromJson);
      }
    }
    return dailyLogsList;
  }
}
