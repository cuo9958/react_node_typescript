import React from 'react';
import './index.less';
import { Input, Button, Message } from 'element-react';
import request from '../../services/request';
import { inject } from 'mobx-react';

interface iState {
    form: iForm;
}

interface iForm {
    username: string;
    password: string;
}

@inject((models: any) => ({
    login: models.user.login
}))
export default class extends React.Component<any, iState, iReactRoute> {
    constructor(props: any) {
        super(props);
        this.state = {
            form: {
                username: '',
                password: ''
            }
        };
    }
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
        try {
            const data = await request.post('/user/login', form);
            await this.props.login(data);
            this.props.history.push('/');
        } catch (e) {
            console.log(e.message);
            Message.error(e.message);
        }
    }
}
