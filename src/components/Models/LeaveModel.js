import Model from "react-native-models";

export default class LeaveModel extends Model {
    // className used instead name because babel replaces him at run-time.
    static get className() {
        return "LeaveModel";
    }

    constructor(json) {
        super({
            leaverequest_id: "Integer",
            staffid: "Integer",
            leave_type: "Integer",
            leave_from_date: "DateTime",
            leave_to_date: "DateTime",
            duration_from: "Integer",
            duration_to :  "Integer",
            session_from : "Integer",
            session_to : "Integer",
            notify_to : "Integer",
            applied_date : "DateTime",
            approve_date : "DateTime",
            comments : "String",
            contact_address : "String",
            status : "Integer",
            approved_by : "Integer",
            modified_date : "DateTime",
            leave_count : "Number",
            balance_leave : "Number",
            created_by : "Number",
            created_from : "Integer",
            shift_id : "Integer",
            is_requested : "Integer",
            staffname : "String",
            name : "String",

        });

        this._leaverequest_id = json.leaverequest_id ;
        this._staffid =json.staffid ;
        this._leave_type =json.leave_type ;
        this._leave_from_date =json.leave_from_date ;
        this._leave_to_date =json.leave_to_date;
        this._duration_from =json.duration_from;
        this._duration_to  =json.duration_to;
        this._session_from  =json.session_from  ;
        this._session_to  =json.session_to  ;
        this._notify_to  =json.notify_to  ;
        this._applied_date  =json.applied_date  ;
        this._approve_date  =json.approve_date  ;
        this._comments  =json.comments  ;
        this._contact_address  =json.contact_address  ;
        this._status  =json.status  ;
        this._approved_by  =json.approved_by  ;
        this._modified_date  =json.modified_date  ;
        this._leave_count  =json.leave_count ;
        this._balance_leave  =json.balance_leave  ;
        this._created_by  =json.created_by  ;
        this._created_from  =json.created_from  ;
        this._shift_id  =json.shift_id  ;
        this._is_requested  =json.is_requested  ;
        this._staffname  =json.staffname  ;
        this._ame  =json.ame  ;
    }
    static parseLeaveModelFromJSON(json) {
        var leaveHistoryList = [];
        for(var jsonItem in json) {
            let itemFromJson = new LeaveModel(json[jsonItem]);
            leaveHistoryList.push(itemFromJson);
        }
        return leaveHistoryList;
    }
}
