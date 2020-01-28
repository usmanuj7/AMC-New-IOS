import Model from "react-native-models";

export default class AttendanceModel extends Model {
    // className used instead name because babel replaces him at run-time.
    static get className() {
        return "AttendanceModel";
    }

    constructor(json) {
        super({
            attendance_id: "Integer",
            clock_date: "String",
            clock_in: "String",
            clock_out: "Boolean",
            comments: "String",
            device_type_id: "String",
            duration_minutes: "String",
            line_manager_approval: "String",
            name: "String",
            staffid: "String",
            staffname: "String",
            status: "String",
            work_status: "String",
           

        });

            this._attendance_id= json.attendance_id;
            this._clock_date= json.clock_date  ;
            this._clock_in= json.clock_in  ;
            this._clock_out= json.clock_out ;
            this._comments= json.comments  ;
            this._device_type_id= json.device_type_id  ;
            this._duration_minutes= json.duration_minutes  ;
            this._line_manager_approval= json.line_manager_approval  ;
            this._name= json.name  ;
            this._staffid= json.staffid  ;
            this._staffname= json.staffname  ;
            this._status= json.status  ;
            this._work_status= json.work_status  ;
           
    }
    static parseAttendanceModelFromJSON(json) {
        var attendenceList = [];
        for(var jsonItem in json) {
            let itemFromJson = new AttendanceModel(json[jsonItem]);
            attendenceList.push(itemFromJson);
        }
        return attendenceList;
    }
}
