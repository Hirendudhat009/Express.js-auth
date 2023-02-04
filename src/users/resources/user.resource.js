import moment from "moment";

export default class UserResource {
    constructor(data) {
        this.userId = data.id;
        this.email = data.email;
        this.fullname = data.fullname;
        this.joinedAt = moment(data.createdAt).valueOf() / 1000;
    }
}