import Model from "react-native-models";

export default class HoursHistoryModalUpdated extends Model {
    // className used instead name because babel replaces him at run-time.
    static get className() {
        return "HoursHistoryModalUpdated";
    }

    constructor(json) {
        super({
            worked: "String",
            break: "String",
            total: "String",
            week_start: "String",
            week_end: "String"
        });

            this._worked= json.weekly_work_hours;
            this._break= json. weekly_break_hours  ;
            this._total= json.weekly_total_hours ;
            this._week_start= json.week_start ;
            this._week_end= json.week_end  ;
           
    }
    static parseHoursHistoryModalUpdatedFromJSON(json) {
        let itemFromJson = new HoursHistoryModalUpdated(json);
        return itemFromJson;
    }
}
