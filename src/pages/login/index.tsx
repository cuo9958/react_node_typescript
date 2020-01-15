import React from 'react';
import './index.less';
import { Input, Button, Message } from 'element-react';
import request from '../../services/request';
import { inject } from 'mobx-react';
import FG from 'fingerprintjs2';
import utils from '../../services/utils';

interface iState {
    form: iForm;
}

interface iForm {
    username: string;
    password: string;
    uuid?: string;
}
interface IParams {
    cb?: string;
    uuid?: string;
}

interface iProps extends iReactRoute {
    login(data: any): void;
}

@inject((models: any) => ({
    login: models.user.login
}))
export default class extends React.Component<iProps, iState> {
    constructor(props: any) {
        super(props);
        this.state = {
            form: {
                username: '',
                password: ''
            }
        };
        this.params = utils.parseParams(this.props.location.search).query as IParams;
    }
    params: IParams;

    render() {
        return (
            <div id="login">
                <img src="/images/login_bg.jpg" className="login_bg" alt="" />
                <div className="login_container">
                    <div className="logo">
                        FUC<span>管理系统v1.0</span>
                    </div>
                    <div className="form">
                        <div className="item">
                            <Input
                                value={this.state.form.username}
                                onChange={value => this.handleChange('username', value)}
                                prepend={<i className="fa fa-user"></i>}
                                placeholder="请输入用户名"
                            />
                        </div>
                        <div className="item">
                            <Input
                                value={this.state.form.password}
                                onChange={value => this.handleChange('password', value)}
                                type="password"
                                prepend={<i className="fa fa-key"></i>}
                                placeholder="请输入密码"
                            />
                        </div>
                        <div className="item">
                            <Button type="primary" onClick={() => this.rules()}>
                                登 录<i className="fa fa-sign-in"></i>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    componentDidMount() {
        this.getfg();
    }
    uuid: string = '';
    async getfg() {
        let uuid = localStorage.getItem('uuid');
        if (!uuid) {
            const data = await FG.getPromise();
            const values = data.map(function(c: any) {
                return c.value;
            });
            uuid = FG.x64hash128(values.join(''), 31);
        }
        this.uuid = uuid || '';
    }
    // 监听input输入框中值的变化，并更新状态
    handleChange = (key: string, value: any) => {
        const newForm = {
            ...this.state.form,
            [key]: value
        };
        this.setState({
            form: newForm
        });
    };

    rules() {
        const form = this.state.form;
        if (form.username === '') {
            Message({
                message: '请输入用户名',
                type: 'warning'
            });
            return;
        }
        if (form.password === '') {
            Message({
                message: '请输入密码',
                type: 'warning'
            });
            return;
        }
        this.login();
    }

    async login() {
        const form = this.state.form;
        if (this.params.uuid && this.params.uuid.length > 5) {
            form.uuid = this.params.uuid;
        } else {
            form.uuid = this.uuid;
        }

        try {
            const data = await request.post('/user/login', form);
            await this.props.login(data);
            if (this.params.cb) {
                window.location.href = this.params.cb;
            } else {
                this.props.history.push('/');
            }
        } catch (e) {
            console.log(e.message);
            Message.error(e.message);
        }
    }
}
