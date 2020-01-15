import React from 'react';
import { Button, Message, Checkbox } from 'element-react';
import request from '../../services/request';
import Utils from '../../services/utils';
import './index.less';

interface IModel {
    [index: string]: any;
    rules: string;
    rules_name: string;
}
interface IState {
    model: IModel;
    rules: any;
    gathers: any[];
    info: IInfo;
}

interface IInfo {
    username?: string;
    nickname?: string;
    headimg?: string;
    mail?: string;
    mobile?: string;
    status?: number;
}

interface IParams {
    [index: string]: any;
    username: string;
}

export default class extends React.Component<iReactRoute, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            model: {
                rules: '',
                rules_name: ''
            },
            info: {},
            rules: {},
            gathers: []
        };

        this.params = Utils.parseParams(this.props.location.search).query as IParams;
    }

    params: IParams;

    render() {
        return (
            <div id="user_detail">
                <div className="rules">
                    {this.state.gathers.map((item: any, index: number) => (
                        <div className="rule_item" key={index}>
                            <div className="rule_name">
                                项目:{item.title}
                                <Checkbox className="rule_check" checked={this.check(item.rules_name)} onChange={e => this.onChange(e, item)} />
                            </div>
                            <div className="rule_list">{item.rules_name}</div>
                        </div>
                    ))}
                </div>

                <div className="footer">
                    <div className="info">
                        <img src={this.state.info.headimg} alt="" />
                        <span>{this.state.info.nickname}</span>
                        <span>{this.state.info.mail}</span>
                        <span>{this.state.info.mobile}</span>
                    </div>
                    <div className="save">
                        <Button.Group>
                            <Button onClick={this.save} type="primary">
                                保存
                            </Button>
                            <Button onClick={this.clear} type="success">
                                清空
                            </Button>
                        </Button.Group>
                    </div>
                    <div className="rules">
                        {this.state.model.rules_name.split(',').map((item, index) => (
                            <div className="item" key={index}>
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.getAll();
        this.getDetail();
    }
    async getDetail() {
        if (!this.params.username) return;
        try {
            const data = await request.get('/user/detail', { username: this.params.username });
            const rules = data.rules;
            const rules_name = data.ruleTxts || '';
            this.setState({
                model: {
                    rules: rules,
                    rules_name: rules_name
                },
                info: data
            });
        } catch (error) {
            console.log(error);
        }
    }
    async getAll() {
        try {
            const gathers: any[] = await request.get('/gather/all');
            this.setState({ gathers });
        } catch (error) {
            console.log(error);
        }
    }

    check(rules: string) {
        return this.state.model.rules_name.includes(rules);
    }

    onChange(v: boolean, item: any) {
        const model = this.state.model;
        if (v) {
            model.rules += ',' + item.rules;
            model.rules_name += ',' + item.rules_name;
        } else {
            model.rules = model.rules.replace(',' + item.rules, '');
            model.rules_name = model.rules_name.replace(',' + item.rules_name, '');
        }
        this.setState({ model });
    }

    clear = () => {
        this.setState({
            model: {
                rules: '',
                rules_name: ''
            }
        });
    };
    save = async () => {
        try {
            const rules = Array.from(new Set(this.state.model.rules.split(','))).filter(item => item !== '');
            const rules_name = Array.from(new Set(this.state.model.rules_name.split(','))).filter(item => item !== '');
            await request.post('/user/detail', {
                username: this.params.username,
                rules: rules.join(','),
                rules_name: rules_name.join(',')
            });
            Message.success('保存成功');
        } catch (error) {
            console.log(error);
            Message.error(error.message);
        }
    };
}
