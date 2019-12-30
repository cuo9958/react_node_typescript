import { observable, action } from "mobx";
import request from "../services/request";
import { Message } from "element-react";

interface iUser {
    username: string;
    nickname: string;
    token: string;
    headimg: string;
    uid: string;
}

class User {
    @observable username = "";
    @observable nickname = "";
    @observable token = "";
    @observable headimg = "";
    @observable uid = "";

    constructor() {
        this.username = localStorage.getItem("username") || "";
        this.nickname = localStorage.getItem("nickname") || "";
        this.token = localStorage.getItem("token") || "";
        this.headimg = localStorage.getItem("headimg") || "";
        this.uid = localStorage.getItem("uid") || "";
    }

    @action login = (db: iUser) => {
        this.username = db.username;
        this.nickname = db.nickname;
        this.token = db.token;
        this.headimg = db.headimg;
        this.uid = db.uid;
        localStorage.setItem("uid", db.uid);
        localStorage.setItem("username", db.username);
        localStorage.setItem("token", db.token);
        localStorage.setItem("nickname", db.nickname);
        localStorage.setItem("headimg", db.headimg);
    };

    isLogin = () => {
        return !!this.token;
    };

    @action check = async () => {
        if (!this.token || !this.uid) return;
        try {
            await request.get("/user/auth");
        } catch (error) {
            localStorage.removeItem("username");
            localStorage.removeItem("nickname");
            localStorage.removeItem("token");
            localStorage.removeItem("headimg");
            localStorage.removeItem("uid");
            this.username = "";
            this.nickname = "";
            this.token = "";
            this.headimg = "";
            this.uid = "";
            Message.warning("退出登录");
        }
    };
}
export default new User();
