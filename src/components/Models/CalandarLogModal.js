import Model from "react-native-models";

export default class CalandarLogModal extends Model {
    // className used instead name because babel replaces him at run-time.
    static get className() {
        return "CalandarLogModal";
    }

    constructor(json) {
        super({
            eventid: "Integer",
            title: "String",
            description: "String",
            userid: "Integer",
            holiday_type: "Integer",
            leaverequest_id: "Integer",
            division: "String",
            start: "DateTime",
            end: "DateTime",
            public: "Integer",
            color: "String",
            status: "Integer",
            isstartnotified: "Integer",
            staffname: "DateTime",
          

        });

            this._eventid= json.eventid;
            this._title= json.title  ;
            this._description= json.description  ;
            this._userid= json.userid ;
            this._holiday_type= json.holiday_type  ;
            this._leaverequest_id= json.leaverequest_id  ;
            this._division= json.division  ;
            this._start= json.start  ;
            this._end= json.end  ;
            this._public= json.public  ;
            this._color= json.color  ;
            this._status= json.status  ;
            this._isstartnotified= json.isstartnotified  ;
            this._staffname= json.staffname  ;
           
    }
    static parseCalandarLogModal(json) {
        var attendenceList = [];
        for(var jsonItem in json.events) {
                let itemFromJson = new CalandarLogModal(json.events[jsonItem]);
                attendenceList.push(itemFromJson);
            
           
        }
        return attendenceList;
    }
}
