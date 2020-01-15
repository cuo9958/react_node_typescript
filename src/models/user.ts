import { observable, action } from 'mobx';
import { Message } from 'element-react';
import sdk from '../services/sdk';

interface iUser {
    username: string;
    nickname: string;
    token: string;
    headimg: string;
    uid: string;
}

class User {
    @observable nickname = '';
    @observable headimg = '';
    constructor() {
        const model = sdk.info();
        this.nickname = model.nickname;
        this.headimg = model.headimg;
    }

    @action login = (db: iUser) => {
        sdk.login();
    };

    @action check = async () => {
        sdk.auth(
            () => {
                Message.warning('退出登录');
                this.nickname = '';
                this.headimg = '';
            },
            (model: any) => {
                this.nickname = model.nickname;
                this.headimg = model.headimg;
            }
        );
    };
}
export default new User();
