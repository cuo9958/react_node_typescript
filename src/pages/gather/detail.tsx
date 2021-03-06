import React from 'react';
import { Input, Icon, Button, Message } from 'element-react';
import request from '../../services/request';
import Utils from '../../services/utils';
import './index.less';

interface IModel {
    [index: string]: any;
    title: string;
    rules: number[];
    rules_name: string[];
}
interface IState {
    model: IModel;
    rules: any;
    topics: any[];
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
    id: number;
}

export default class extends React.Component<iReactRoute, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            model: {
                title: '',
                rules: [],
                rules_name: []
            },
            rules: {},
            topics: []
        };

        this.params = Utils.parseParams(this.props.location.search).query as IParams;
    }

    params: IParams;

    render() {
        return (
            <div id="gather_detail">
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
                    <Input className="input_s" value={this.state.model.title} onChange={this.onChange.bind(this, 'title')} placeholder="请输入"></Input>
                    <Button onClick={this.save} type="primary">
                        保存
                    </Button>
                    <Button onClick={this.clear} type="primary">
                        清空
                    </Button>
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
        if (!this.params.id) return;
        try {
            const data = await request.get('/gather/detail', { id: this.params.id });
            const rules = data.rules.split(',');

            this.setState({
                model: {
                    title: data.title,
                    rules: rules,
                    rules_name: data.rules_name.split(',')
                }
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

    onChange(key: string, value: any) {
        const model = this.state.model;
        model[key] = value;
        this.setState({
            model
        });
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

    save = async () => {
        console.log(this.state.model);
        try {
            await request.post('/gather/detail', {
                id: this.params.id,
                title: this.state.model.title,
                rules: this.state.model.rules.join(','),
                rules_name: this.state.model.rules_name.join(',')
            });
            Message.success('保存成功');
        } catch (error) {
            console.log(error);
            Message.error(error.message);
        }
    };

    clear = () => {
        this.setState({
            model: {
                title: this.state.model.title,
                rules: [],
                rules_name: []
            }
        });
    };
}
