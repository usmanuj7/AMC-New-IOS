import Model from "react-native-models";

export default class LeaveTypeModel extends Model {
    // className used instead name because babel replaces him at run-time.
    static get className() {
        return "LeaveTypeModel";
    }

    constructor(json) {
        super({
            id: "Integer",
            is_leave_carried_forward: "Integer",
            is_paid: "Integer",
            leave_short_code: "String",
            leaves_peryear: "String",
            name: "String",
            label: "String",
            value: "String"

        });

        this._id = json.id ;
        this._is_leave_carried_forward=json.is_leave_carried_forward ;
        this._is_paid =json.is_paid ;
        this._leave_short_code =json.leave_short_code ;
        this._leaves_peryear =json.leaves_peryear;
        this._name=json.name;
        this.label =json.name;
        this.value =json.name;
      
    }
    static parseLeaveTypeModelFromJSON(json) {
        var leaveTypeModelList = [];
        for(var jsonItem in json) {
            let itemFromJson = new LeaveTypeModel(json[jsonItem]);
            leaveTypeModelList.push(itemFromJson);
        }
        return leaveTypeModelList;
    }
}
