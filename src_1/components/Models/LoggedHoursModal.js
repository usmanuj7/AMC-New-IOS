import Model from "react-native-models";

export default class LoggedHoursModal extends Model {
    // className used instead name because babel replaces him at run-time.
    static get className() {
        return "LoggedHoursModal";
    }

    constructor(json) {
        super({
            worked: "String",
            break: "String",
            total: "String",
            week_start: "String",
            week_end: "String"
        });

            this._worked= json.worked;
            this._break= json. break ;
            this._total= json.total  ;
            this._week_start= json.week_start ;
            this._week_end= json.week_end  ;
           
    }
    static parsesLoggedHoursModalFromJSON(json) {
        let itemFromJson = new LoggedHoursModal(json);
        return itemFromJson;
    }
}
