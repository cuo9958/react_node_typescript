import React from 'react';
import { Input, Button, Pagination, Dialog, Message } from 'element-react';
import request from '../../services/request';
import sdk from '../../services/sdk';
import './index.less';

interface IForm {
    title: string;
}

interface IState {
    count: number;
    form: IForm;
    showDel: boolean;
    list: any[];
}

export default class extends React.Component<iReactRoute, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            count: 0,
            list: [],
            showDel: false,
            form: {
                title: ''
            }
        };
    }

    render() {
        return (
            <div id="rule_list">
                <div className="search-box">
                    <Input className="input_s" value={this.state.form.title} onChange={value => this.handleChange(value)} placeholder="请输入名称" />
                    <Button type="primary" icon="search" onClick={this.handleClick}>
                        搜索
                    </Button>
                    <Button type="primary" icon="plus" onClick={this.addClick}>
                        新增
                    </Button>
                </div>
                <div className="rules_box">
                    {this.state.list.map((item: any, index: number) => (
                        <div key={index} className="item">
                            <div className="title">
                                <small>{item.topic_name}</small>
                                <div className="line"></div>
                                {item.title}
                                <br />
                                {item.sort_name}
                            </div>
                            <Button.Group>
                                <Button type="success" icon="edit" size="mini" onClick={() => this.edit(item.id)}>
                                    编辑
                                </Button>
                                <Button type="danger" icon="delete" size="mini" onClick={() => this.sureDel(item.id)}>
                                    删除
                                </Button>
                            </Button.Group>
                        </div>
                    ))}
                </div>
                <div className="foot">
                    <Pagination onCurrentChange={this.onCurrentChange} pageSize={20} layout="prev, pager, next" total={this.state.count} small={true} />
                </div>
                <Dialog visible={this.state.showDel} title="提示" onCancel={() => this.setState({ showDel: false })}>
                    <Dialog.Body>是否删除？</Dialog.Body>
                    <Dialog.Footer>
                        <Button onClick={() => this.setState({ showDel: false })}>取消</Button>
                        <Button type="danger" icon="delete" onClick={() => this.del()}>
                            删除
                        </Button>
                    </Dialog.Footer>
                </Dialog>
            </div>
        );
    }

    componentDidMount() {
        this.getList(1);
    }
    pageIndex: number = 1;
    async getList(pageIndex?: number) {
        if (pageIndex) this.pageIndex = pageIndex;
        try {
            const data = await request.get('/rules', {
                pageIndex: this.pageIndex,
                title: this.state.form.title
            });
            this.setState({
                count: data.count,
                list: data.rows
            });
        } catch (error) {
            console.log(error);
        }
    }
    onCurrentChange = (pageIndex: number) => {
        this.getList(pageIndex);
    };
    handleChange = (v: any) => {
        this.setState({
            form: {
                title: v
            }
        });
    };

    handleClick = () => {
        this.getList(1);
    };

    addClick = () => {
        // if (sdk.check('app_task_rules_edt')) {
            this.props.history.push('/rules/detail');
        // }
    };
    edit(id: number) {
        this.props.history.push('/rules/detail?id=' + id);
    }
    del_id = 0;
    sureDel(id: number) {
        this.del_id = id;
        this.setState({ showDel: true });
    }
    async del() {
        if (!this.del_id) return;
        try {
            await request.post('/rules/del', { id: this.del_id });
            Message.success('已删除');
            this.setState({ showDel: false });
            this.getList();
        } catch (error) {
            Message.error(error.message);
            console.log(error);
        }
    }
}
