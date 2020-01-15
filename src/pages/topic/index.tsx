import React from 'react';
import './index.less';
import { Input, Pagination, Button, Dialog, Form, Message, Notification } from 'element-react';
import request from '../../services/request';

interface IForm {
    [index: string]: any;
    title: string;
    img: string;
    id?: number;
}
interface IState {
    list: any[];
    count: number;
    search: string;
    title: string;
    isHide: boolean;
    form: IForm;
}

export default class extends React.Component<iReactRoute, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            list: [],
            count: 0,
            search: '',
            title: '',
            isHide: false,
            form: {
                title: '',
                img: ''
            }
        };
    }

    render() {
        return (
            <div id="topic">
                <div className="search-box">
                    <Input className="input_s" value={this.state.title} onChange={value => this.handleChange(value)} placeholder="请输入名称" />
                    <Button type="primary" icon="search" onClick={this.handleClick}>
                        搜索
                    </Button>
                    <Button type="success" icon="plus" onClick={this.showBox}>
                        添加
                    </Button>
                </div>
                <div className="topic_list">
                    {this.state.list.map(item => (
                        <div className="topic_item" key={item.id} onClick={() => this.open(item)}>
                            <div className="topic_logo">
                                <img src={item.img || '/images/project.png'} alt="" />
                            </div>
                            <p>{item.title}</p>
                        </div>
                    ))}
                    {this.state.list.length === 0 && <div className="empty">暂无数据</div>}
                </div>
                <div className="foot">
                    <Pagination onCurrentChange={this.onCurrentChange} pageSize={20} layout="prev, pager, next" total={this.state.count} small={true} />
                </div>
                <Dialog title="添加/修改项目" size="tiny" visible={this.state.isHide} onCancel={() => this.setState({ isHide: false })}>
                    <Dialog.Body>
                        <Form model={this.state.form}>
                            <Form.Item label="项目名称" labelWidth="70">
                                <Input value={this.state.form.title} onChange={value => this.onChange('title', value)} placeholder="名称"></Input>
                            </Form.Item>
                            <Form.Item label="项目图片" labelWidth="70">
                                <Input value={this.state.form.img} onChange={value => this.onChange('img', value)} placeholder="图片url"></Input>
                            </Form.Item>
                        </Form>
                    </Dialog.Body>
                    <Dialog.Footer>
                        {!!this.state.form.id && (
                            <Button type="danger" onClick={() => this.delTopic()}>
                                删 除
                            </Button>
                        )}
                        <Button onClick={() => this.setState({ isHide: false })}>取 消</Button>
                        <Button type="primary" onClick={() => this.saveTopic()}>
                            保 存
                        </Button>
                    </Dialog.Footer>
                </Dialog>
            </div>
        );
    }

    componentDidMount() {
        this.getList(1);
    }

    pageIndex = 1;
    async getList(pageIndex?: number) {
        if (pageIndex) this.pageIndex = pageIndex;
        try {
            const data = await request.get('/topic/list', {
                pageIndex: this.pageIndex,
                title: this.state.title
            });
            this.setState({
                count: data.count,
                list: data.rows
            });
        } catch (error) {
            console.log(error);
        }
    }
    handleChange(title: any) {
        this.setState({ title });
    }
    onChange(key: string, val: any) {
        const form = this.state.form;
        form[key] = val;
        this.setState({ form });
    }
    showBox = () => {
        this.setState({
            isHide: true,
            form: {
                title: '',
                img: '',
                id: 0
            }
        });
    };
    handleClick = () => {
        this.getList(1);
    };
    onCurrentChange = (pageIndex: number) => {
        this.getList(pageIndex);
    };
    async delTopic() {
        if (!this.state.form.id) return;
        try {
            await request.post('/topic/del', { id: this.state.form.id });
            this.setState({
                isHide: false,
                form: {
                    title: '',
                    img: '',
                    id: 0
                }
            });
            this.getList();
            Message.success('删除成功');
        } catch (error) {
            console.log(error);
            Notification.error({
                title: error.message
            });
        }
    }
    open(item: IForm) {
        this.setState({
            isHide: true,
            form: {
                title: item.title,
                img: item.img,
                id: item.id
            }
        });
    }
    async saveTopic() {
        try {
            await request.post('/topic/save', this.state.form);
            this.setState({ isHide: false });
            this.getList();
        } catch (error) {
            console.log(error);
            Notification.error({
                title: error.message
            });
        }
    }
    goDetail(username: string) {}
    goOpen(username: string, status: number) {}
}
