import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
dayjs.extend(customParseFormat);

export default class Person {
    constructor(fname, lname, email, sex, mobile_no, birthdate, address) {
        this.fname = fname;
        this.lname = lname;
        this.email = email;
        this.setMobileNo(mobile_no);
        this.setAddress(address);
        this.setBirthDate(birthdate);
        this.setSex(sex);
    }
    setMobileNo(number) {
        this.mobile_no = number.replace('-', '');
    }
    setBirthDate(date) {
        date = dayjs(date, "DD/MM/YYYY");
        this.birthdate = `${date.date()} ${date.format('MMM')} ${date.year()}`;
    }
    setAddress(address) {
        if (typeof address === 'string')
            this.address = address.replace('\\n', '\n')
                                .replace('\\r', '\r');
    }
    setSex(sex) {
        switch (sex?.toUpperCase?.()) {
            case 'M':
                this.sex = 'Male';
                break;
            case 'F':
                this.sex = 'Female';
                break;
            case 'O':
                this.sex = 'Other';
                break;
            default:
                this.sex = (sex == null || sex == '') ? '' : '';
        }
    }
}