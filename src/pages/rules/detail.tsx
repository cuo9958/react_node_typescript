import React from 'react';
import { Form, Input, AutoComplete, Button, Message } from 'element-react';
import request from '../../services/request';
import utils from '../../services/utils';

interface IModel {
    [index: string]: any;
    id: number;
    title: string;
    sort_name: string;
    topic_name: string;
    topic_id: number;
}
interface IState {
    model: IModel;
    value: string;
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
                id: 0,
                title: '',
                sort_name: '',
                topic_name: '',
                topic_id: 0
            },
            value: ''
        };
        this.params = utils.parseParams(this.props.location.search).query as IParams;
    }
    params: IParams = { id: 0 };
    render() {
        return (
            <div id="rule_detail">
                <Form className="box" model={this.state.model} labelWidth="80">
                    <Form.Item label="权限名称">
                        <Input className="input_s" value={this.state.model.title} onChange={this.onChange.bind(this, 'title')} placeholder="请输入中文名"></Input>
                    </Form.Item>
                    <Form.Item label="权限规则">
                        <Input
                            className="input_s"
                            value={this.state.model.sort_name}
                            onChange={this.onChange.bind(this, 'sort_name')}
                            placeholder="请输入校验名：英文+数字"
                        ></Input>
                    </Form.Item>
                    <Form.Item label="搜索项目">
                        <AutoComplete
                            placeholder="请搜索"
                            value={this.state.value}
                            fetchSuggestions={this.querySearchAsync.bind(this)}
                            onSelect={this.handleSelect.bind(this)}
                        ></AutoComplete>
                    </Form.Item>
                    <Form.Item label="所属项目">
                        {this.state.model.topic_name}
                        {this.state.model.topic_id > 0 && (
                            <Button className="clear" size="mini" onClick={this.save} type="success">
                                清除选择
                            </Button>
                        )}
                    </Form.Item>
                    <Form.Item label="">
                        <Button onClick={this.save} type="primary">
                            保存
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }

    componentDidMount() {
        if (this.params.id) this.getDetail();
    }

    async getDetail() {
        try {
            const data = await request.get('/rules/detail', { id: this.params.id });
            this.setState({
                model: {
                    id: data.id,
                    title: data.title,
                    sort_name: data.sort_name,
                    topic_name: data.topic_name,
                    topic_id: data.topic_id
                }
            });
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
    async querySearchAsync(e: any, cb: any) {
        if (!e) return cb([]);
        try {
            const list: any[] = await request.get('/topic/search', { title: e });
            const labes: any[] = [];
            list.forEach(item => {
                labes.push({
                    value: item.title,
                    id: item.id,
                    title: item.title
                });
            });
            cb && cb(labes);
        } catch (error) {
            console.log(error);
        }
    }
    handleSelect(e: any) {
        const model = this.state.model;
        model.topic_id = e.id * 1;
        model.topic_name = e.title;
        this.setState({ model });
    }
    save = async () => {
        console.log(this.state.model);
        try {
            await request.post('/rules/detail', this.state.model);
            Message.success('保存成功');
        } catch (error) {
            console.log(error);
            Message.error(error.message);
        }
    };
}
