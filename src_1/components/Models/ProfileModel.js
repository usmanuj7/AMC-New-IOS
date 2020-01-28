import Model from "react-native-models";
import SigninDataLogsModel from "./SigninDataLogsModel";
export default class ProfileModel extends Model {
    // className used instead name because babel replaces him at run-time.
    static get className() {
        return "ProfileModel";
    }

    constructor(json) {
        super({
            staffid: "Integer",
            email: "String",
            code: "String",
            employee_code: "Boolean",
            firstname: "String",
            middlename: "String",
            lastname: "String",
            gender: "String",
            nationality: "String",
            place_of_birth: "String",
            civil_status: "String",
            religion: "String",
            linemanager: "Integer",
            special_approval_from: "Integer",
            joined_date: "DateTime",
            dob: "DateTime",
            emergency_contact: "Number",
            weekends: "String",
            available_leave: "Number",
            visa_sponsoring_company: "Integer",
            other_visa_sponsoring_company: "String",
            department: "Integer",
            line_manager_approval: "Integer",
            company_division: "Integer",
            jobtitle: "String",
            visatitle: "String",
            facebook: "String",
            linkedin: "String",
            phonenumber: "String",
            mobile_number: "String",
            h_mobile_number: "String",
            h_phonenumber : "String",
            skype: "String",
            password: "String",
            datecreated: "Number",
            profile_image: "String",
            last_ip: "Number",
            last_login: "Number",
            last_password_change: "Number",
            new_pass_key: "String",
            new_pass_key_requested: "String",
            admin: "Integer",
            super_admin: "Integer",
            role: "Integer",
            active: "Integer",
            default_language: "String",
            direction: "String",
            media_path_slug: "String",
            is_not_staff: "Integer",
            is_line_manager: "Integer",
            can_approval_status: "Integer",
            h_in_occupation_card_number: "String",
            passport_number: "Integer",
            p_issue_date: "DateTime",
            p_expiry_date: "DateTime",
            p_country: "Integer",
            p_issued_place: "String",
            lc_number_work: "String",
            lc_issue_date: "DateTime",
            lc_expiry_date: "DateTime",
            lc_personal_number: "String",
            visa_issue_date: "DateTime",
            visa_expiry_date: "DateTime",
            eid_issue_date: "DateTime",
            eid_expiry_date: "DateTime",
            address_current: "String",
            passport_address: "String",
            address_home: "String",
            insurance_provider: "String",
            ec_name: "String",
            ec_mobile: "String",
            ec_phonenumber: "String",
            ec_relation_to_staff: "String",
            ec_email: "String",
            ech_name: "String",
            ech_relation_to_staff: "String",
            ech_mobile: "String",
            ech_telephone: "String",
            ech_email: "String",
            h_in_category: "String",
            h_in_card_number: "String",
            h_in_occupation: "Integer",
            hourly_rate: "Number",
            email_signature: "String",
            warehouse_id: "String",
            device_type: "String",
            device_name:"String",
            device_token: "String",
            token : "String",
            email_address_p: "String",
            email_address_w: "String",
            employee_status: "Integer",
            ac_last_working_date: "DateTime",
            of_last_working_date: "DateTime",
            work_location: "String",
            probation_period: "String",
            post_probation_increase: "Number",
            work_days: "Number",
            work_hour: "Number",
            air_ticket: "Number",
            basic_salary_pr: "Number",
            housing_allowance_pr: "Number",
            transportation_allowance_pr: "Number",
            car_allowance_pr: "Number",
            car_lift_allowance_pr: "Number",
            mobile_allowance_pr: "Number",
            other_allowance_pr: "Number",
            total_package_pr : "Number",
            commission_pr: "Number",
            basic_salary_po: "Number",
            housing_allowance_po: "Number",
            transportation_allowance_po: "Number",
            car_allowance_po: "Number",
            car_lift_allowance_po: "Number",
            mobile_allowance_po: "Number",
            other_allowance_po: "Number",
            total_package_po: "Number",
            commission_po: "Number",
            t_issue_date: "DateTime",
            v_file_number: "Integer",
            v_issue_date: "DateTime",
            v_expiry_date: "DateTime",
            v_issued_place: "DateTime",
            v_sec_amount: "Number",
            lc_number_p: "String",
            t_id_number: "Integer",
            t_expiry_date: "DateTime",
            eid_number: "Boolean",
            uniform_type: "String",
            oc_expiry_date: "DateTime",
            d_license_number: "String",
            d_license_type: "String",
            d_issued_date: "DateTime",
            d_expiry_date: "DateTime",
            ica_issue_date: "DateTime",
            network_in_patient: "String",
            network_out_patient: "String",
            m_start_date: "DateTime",
            m_expiry_date: "DateTime",
            oc_application_number: "String",
            oc_issue_date: "DateTime",
            ica_u_size: "String",
            ica_u_quantity: "Integer",
            ica_u_remarks: "String",
            car_reg_issue_date: "DateTime",
            car_model: "String",
            car_plate_number: "String",
            car_colour: "String",
            car_remarks: "String",
            fc_date_issued: "DateTime",
            fc_card_type: "String",
            fc_card_number: "String",
            fc_expiry_date: "DateTime",
            it_date_issued: "DateTime",
            it_item: "String",
            it_assets_quantity: "String",
            it_assets_remarks: "String",
            bank_name: "String",
            account_number: "String",
            iban: "String",
            profile_image_url: "String",
            attendanceModel:"[]"

        });

            this._staffid= json.staffid;
            this._email= json.email  ;
            this._code= json.code  ;
            this._employee_code= json.employee_code ;
            this._firstname= json.firstname  ;
            this._middlename= json.middlename  ;
            this._lastname= json.lastname  ;
            this._gender= json.gender  ;
            this._nationality= json.nationality  ;
            this._place_of_birth= json.place_of_birth  ;
            this._civil_status= json.civil_status  ;
            this._religion= json.religion  ;
            this._linemanager= json.linemanager  ;
            this._special_approval_from= json.special_approval_from  ;
            this._joined_date= json.joined_date ;
            this._dob= json.dob  ;
            this._emergency_contact= json.emergency_contact ;
            this._weekends= json.weekends  ;
            this._available_leave= json.available_leave ;
            this._visa_sponsoring_company= json.visa_sponsoring_company  ;
            this._other_visa_sponsoring_company= json.other_visa_sponsoring_company  ;
            this._department= json.department  ;
            this._line_manager_approval= json.line_manager_approval  ;
            this._company_division= json.company_division  ;
            this._jobtitle= json.jobtitle  ;
            this._visatitle= json.visatitle  ;
            this._facebook= json.facebook  ;
            this._linkedin= json.linkedin  ;
            this._phonenumber= json.phonenumber  ;
            this._mobile_number= json.mobile_number  ;
            this._h_mobile_number= json.h_mobile_number  ;
            this._h_phonenumber = json.h_phonenumber  ;
            this._skype= json.skype  ;
            this._password= json.password  ;
            this._datecreated= json.datecreated ;
            this._profile_image= json.profile_image  ;
            this._last_ip= json.last_ip ;
            this._last_login= json.last_login;
            this._last_password_change= json.last_password_change ;
            this._new_pass_key= json.new_pass_key  ;
            this._new_pass_key_requested= json.new_pass_key_requested ;
            this._admin= json.admin  ;
            this._super_admin= json.super_admin  ;
            this._role= json.role  ;
            this._active= json.active ;
            this._default_language= json.default_language  ;
            this._direction= json.direction  ;
            this._media_path_slug= json.media_path_slug  ;
            this._is_not_staff= json.is_not_staff  ;
            this._is_line_manager= json.is_line_manager  ;
            this._can_approval_status= json.can_approval_status  ;
            this._h_in_occupation_card_number= json.h_in_occupation_card_number  ;
            this._passport_number= json.passport_number  ;
            this._p_issue_date= json.p_issue_date  ;
            this._p_expiry_date= json.p_expiry_date  ;
            this._p_country= json.v  ;
            this._vp_issued_place= json.vp_issued_place  ;
            this._lc_number_work= json.lc_number_work  ;
            this._lc_issue_date= json.lc_issue_date  ;
            this._lc_expiry_date= json.lc_expiry_date  ;
            this._lc_personal_number= json.lc_personal_number  ;
            this._visa_issue_date= json.visa_issue_date  ;
            this._visa_expiry_date= json.visa_expiry_date  ;
            this._eid_issue_date= json.eid_issue_date  ;
            this._id_expiry_date= json.id_expiry_date  ;
            this._address_current= json.address_current  ;
            this._passport_address=json.passport_address  ;
            this._address_home=json.address_home  ;
            this._insurance_provider=json.insurance_provider  ;
            this._ec_name=json.ec_name  ;
            this._ec_mobile=json.ec_mobile  ;
            this._vec_phonenumber=json.vec_phonenumber  ;
            this._ec_relation_to_staff=json.ec_relation_to_staff  ;
            this._ec_email=json.ec_email  ;
            this._ech_name=json.ech_name  ;
            this._ech_relation_to_staff=json.ech_relation_to_staff  ;
            this._ech_mobile=json.ech_mobile  ;
            this._ech_telephone=json.ech_telephone  ;
            this._ech_email=json.ech_email  ;
            this._h_in_category=json.h_in_category  ;
            this._h_in_card_number=json.h_in_card_number  ;
            this._h_in_occupation=json.h_in_occupation  ;
            this._hourly_rate=json.hourly_rate ;
            this._email_signature=json.email_signature  ;
            this._warehouse_id=json.warehouse_id  ;
            this._device_type=json.device_type  ;
            this._device_name=json.device_name ;
            this._device_token=json.device_token  ;
            this._token =json.device_token  ;
            this._email_address_p=json.email_address_p  ;
            this._email_address_w=json.email_address_w  ;
            this._employee_status=json.employee_status  ;
            this._ac_last_working_date=json.ac_last_working_date  ;
            this._of_last_working_date=json.of_last_working_date  ;
            this._work_location=json.work_location  ;
            this._probation_period=json.probation_period  ;
            this._post_probation_increase=json.post_probation_increase   ;
            this._work_days=json.work_days   ;
            this._work_hour=json.work_hour   ;
            this._air_ticket=json.air_ticket   ;
            this._basic_salary_pr=json.basic_salary_pr   ;
            this._housing_allowance_pr=json.housing_allowance_pr   ;
            this._transportation_allowance_pr=json.transportation_allowance_pr   ;
            this._car_allowance_pr=json.car_allowance_pr   ;
            this._car_lift_allowance_pr=json.car_lift_allowance_pr   ;
            this._mobile_allowance_pr=json.mobile_allowance_pr   ;
            this._other_allowance_pr=json.other_allowance_pr   ;
            this._total_package_pr =json.total_package_pr   ;
            this._commission_pr=json.commission_pr   ;
            this._basic_salary_po=json.basic_salary_po   ;
            this._housing_allowance_po=json.housing_allowance_po   ;
            this._transportation_allowance_po=json.transportation_allowance_po   ;
            this._car_allowance_po=json.car_allowance_po   ;
            this._car_lift_allowance_po=json.car_lift_allowance_po   ;
            this._mobile_allowance_po=json.mobile_allowance_po   ;
            this._other_allowance_po=json.other_allowance_po   ;
            this._total_package_po=json.total_package_po   ;
            this._commission_po=json.commission_po   ;
            this._t_issue_date=json.t_issue_date  ;
            this._v_file_number=json.v_file_number  ;
            this._v_issue_date=json.v_issue_date  ;
            this._v_expiry_date=json.v_expiry_date  ;
            this._v_issued_place=json.v_issued_place  ;
            this._v_sec_amount=json.v_sec_amount   ;
            this._lc_number_p=json.lc_number_p  ;
            this._t_id_number=json.t_id_number  ;
            this._t_expiry_date=json.t_expiry_date  ;
            this._eid_number=json.eid_number ;
            this._uniform_type=json.uniform_type  ;
            this._oc_expiry_date=json.oc_expiry_date  ;
            this._d_license_number=json.d_license_number  ;
            this._vd_license_type=json.vd_license_type  ;
            this._d_issued_date=json.d_issued_date  ;
            this._d_expiry_date=json.d_expiry_date  ;
            this._ica_issue_date=json.ica_issue_date  ;
            this._network_in_patient=json.network_in_patient  ;
            this._network_out_patient=json.network_out_patient  ;
            this._m_start_date=json.m_start_date  ;
            this._m_expiry_date=json.m_expiry_date  ;
            this._oc_application_number=json.oc_application_number  ;
            this._oc_issue_date=json.oc_issue_date  ;
            this._ica_u_size=json.ica_u_size  ;
            this._ica_u_quantity=json.ica_u_quantity  ;
            this._ica_u_remarks=json.ica_u_remarks  ;
            this._vcar_reg_issue_date=json.vcar_reg_issue_date  ;
            this._car_model=json.car_model  ;
            this._car_plate_number=json.car_plate_number  ;
            this._car_colour=json.car_colour  ;
            this._car_remarks=json.car_remarks  ;
            this._fc_date_issued=json.fc_date_issued  ;
            this._fc_card_type=json.fc_card_type  ;
            this._fc_card_number=json.fc_card_number  ;
            this._fc_expiry_date=json.fc_expiry_date  ;
            this._it_date_issued=json.it_date_issued  ;
            this._it_item=json.it_item  ;
            this._it_assets_quantity=json.it_assets_quantity  ;
            this._it_assets_remarks=json.it_assets_remarks  ;
            this._bank_name=json.bank_name  ;
            this._account_number=json.account_number  ;
            this._iban=json.iban  ;
            this._profile_image_url=json.profile_image_url  ;
            this._attendaceModel= SigninDataLogsModel.parseSigninDataLogsModelFromJSON(json.attendace)
    }
    static parseProfileModelFromJSON(json) {
        let itemFromJson = new ProfileModel(json);
        return itemFromJson;
    }
}
