import Model from "react-native-models";

export default class SigninDataLogsModel extends Model {
    // className used instead name because babel replaces him at run-time.
    static get className() {
        return "SigninDataLogsModel";
    }

    constructor(json, length, title) {
        super({
            staff_clocktime_id: "Integer",
            staffid: "Integer",
            attendance_id: "Integer",
            clock_time: "DateTime",
            clock_date: "DateTime",
            added_date: "DateTime",
            is_manual: "Integer",
            status: "Integer",
            totalEntries: 'Integer',
            title: 'String'


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
    static parseSigninDataLogsModelFromJSON(json) {
        var title = "End Break";
        var dailyLogsList = [];
        if (json !== undefined) {
            if (json.length > 0) {
                for (var jsonItem in json) {
                    if (json[jsonItem].is_manual === "2" && json[jsonItem].status === "1") {
                        title = "Start Duty";
                    }
                    else if (json[jsonItem].is_manual === "2" && json[jsonItem].status === "101") {
                        title = "End Duty";
                    }
                    else if (json[jsonItem].is_manual !== "2" && json[jsonItem].status === "1") {
                        title = "End Break";
                    }
                    else if (json[jsonItem].is_manual !== "2" && json[jsonItem].status === "101") {
                        title = "Start Break";
                    }
                    let itemFromJson = new SigninDataLogsModel(json[jsonItem], json.length, title);
                    dailyLogsList.push(itemFromJson);
                }
            }
            return dailyLogsList;
        }
    }
}
