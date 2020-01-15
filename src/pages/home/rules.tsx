import React from 'react';
import { Icon, Button, Message } from 'element-react';
import request from '../../services/request';
import Utils from '../../services/utils';
import './index.less';

interface IModel {
    [index: string]: any;
    rules: number[];
    rules_name: string[];
}
interface IState {
    model: IModel;
    rules: any;
    topics: any[];
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

interface IRule {
    item: any;
    onClick(): void;
    rules: number[];
}

function Rule(props: IRule) {
    const { item, onClick, rules } = props;
    const isAt = rules.includes(item.sort_name);
    return (
        <div className="rule" onClick={() => onClick()}>
            {item.title} {isAt && <Icon name="check"></Icon>}
            {!isAt && <Icon name="close"></Icon>}
        </div>
    );
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
                rules: [],
                rules_name: []
            },
            info: {},
            rules: {},
            topics: []
        };

        this.params = Utils.parseParams(this.props.location.search).query as IParams;
    }

    params: IParams;

    render() {
        return (
            <div id="user_rules">
                <div className="rules">
                    {this.state.topics.map((item: any, index: number) => (
                        <div className="rule_item" key={index}>
                            <div className="rule_name">项目:{item.title}</div>
                            <div className="rule_list">
                                {this.state.rules[item.id].map((rule: any, jdex: number) => (
                                    <Rule key={jdex} item={rule} onClick={() => this.onClick(rule)} rules={this.state.model.rules} />
                                ))}
                            </div>
                        </div>
                    ))}
                    {!!this.state.rules.other && this.state.rules['other'].length > 0 && (
                        <div className="rule_item">
                            <div className="rule_name">其他权限</div>
                            <div className="rule_list">
                                {this.state.rules['other'].map((rule: any, jdex: number) => (
                                    <Rule key={jdex} item={rule} onClick={() => this.onClick(rule)} rules={this.state.model.rules} />
                                ))}
                            </div>
                        </div>
                    )}
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
                        {this.state.model.rules_name.map((item, index) => (
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
            const rules = data.rules.split(',');
            const rules_name = data.ruleTxts ? data.ruleTxts.split(',') : [];
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
            const topic_list: any[] = await request.get('/topic/all');
            let list: any[] = await request.get('/rules/all');
            const rules: any = {};
            const topics: any[] = [];
            topic_list.forEach(item => {
                rules[item.id] = list.filter(ru => ru.topic_id === item.id);
                if (rules[item.id].length > 0) {
                    topics.push(item);
                }
            });
            const other = list.filter(ru => ru.topic_id === 0);
            rules['other'] = other;
            this.setState({ rules, topics });
        } catch (error) {
            console.log(error);
        }
    }

    onClick(rule: any) {
        if (!this.state.model.rules.includes(rule.sort_name)) {
            const rules = this.state.model.rules;
            const rules_name = this.state.model.rules_name;
            rules.push(rule.sort_name);
            rules_name.push(rule.title);
            this.setState({
                model: {
                    rules,
                    rules_name,
                    title: this.state.model.title
                }
            });
        } else {
            const rules = this.state.model.rules.filter(item => item !== rule.sort_name);
            const rules_name = this.state.model.rules_name.filter(item => item !== rule.title);
            this.setState({
                model: {
                    rules,
                    rules_name,
                    title: this.state.model.title
                }
            });
        }
    }

    clear = () => {
        this.setState({
            model: {
                rules: [],
                rules_name: []
            }
        });
    };

    save = async () => {
        console.log(this.state.model);
        try {
            await request.post('/user/detail', {
                username: this.params.username,
                rules: this.state.model.rules.join(','),
                rules_name: this.state.model.rules_name.join(',')
            });
            Message.success('保存成功');
        } catch (error) {
            console.log(error);
            Message.error(error.message);
        }
    };
}
