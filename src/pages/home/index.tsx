import React from 'react';
import './index.less';
import { Table, Input, Pagination, Button, Dialog, Form, Message } from 'element-react';
import request from '../../services/request';
import utils from '../../services/utils';

interface IForm {
    [index: string]: string;
    username: string;
    nickname: string;
}
interface IState {
    list: any[];
    count: number;
    search: string;
    username: string;
    isHide: boolean;
    form: IForm;
    showSection: boolean;
    sectionName: string;
}

export default class extends React.Component<iReactRoute, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            list: [],
            count: 0,
            search: '',
            username: '',
            isHide: false,
            form: {
                username: '',
                nickname: ''
            },
            showSection: false,
            sectionName: ''
        };
    }

    columns = [
        {
            label: '用户名',
            prop: 'nickname',
            align: 'center',
            width: 100
        },
        {
            label: '头像',
            prop: 'headimg',
            width: 100,
            render: (row: any) => {
                return <img className="avatar" src={row.headimg} alt="" />;
            }
        },
        {
            label: '权限列表',
            prop: 'ruleTxts'
        },
        {
            label: '分组',
            prop: 'section',
            width: 100
        },
        {
            label: '状态',
            prop: 'status',
            width: 100,
            render: (row: any) => {
                if (row.status === 0) return '禁止';
                if (row.status === 1) return '使用中';
                return '';
            }
        },
        {
            label: '创建时间',
            prop: 'createdAt',
            width: 200,
            render: (row: any) => {
                return (
                    <div>
                        <div>{utils.DateFormartString(row.createdAt)}</div>
                    </div>
                );
            }
        },
        {
            label: '操作',
            width: 220,
            render: (row: any) => {
                return (
                    <Button.Group>
                        <Button onClick={() => this.goDetail(row.username)} type="primary" size="small">
                            集合
                        </Button>
                        <Button onClick={() => this.goRules(row.username)} type="warning" size="small">
                            权限
                        </Button>
                        <Button onClick={() => this.openSection(row)} type="info" size="small">
                            部门
                        </Button>
                        {row.status === 0 && (
                            <Button onClick={() => this.goOpen(row.username, 1)} type="success" size="small">
                                启用
                            </Button>
                        )}
                        {row.status === 1 && (
                            <Button onClick={() => this.goOpen(row.username, 0)} type="danger" size="small">
                                禁用
                            </Button>
                        )}
                    </Button.Group>
                );
            }
        }
    ];
    render() {
        return (
            <div id="users">
                <div className="search-box">
                    <Input className="input_s" value={this.state.username} onChange={value => this.handleChange(value)} placeholder="请输入用户名" />
                    <Button type="primary" icon="search" onClick={this.handleClick}>
                        搜索
                    </Button>
                    <Button type="success" icon="plus" onClick={this.openAdd}>
                        添加新人
                    </Button>
                </div>
                <Table style={{ width: '100%' }} columns={this.columns} data={this.state.list} border={true} />
                <div className="foot">
                    <Pagination onCurrentChange={this.onCurrentChange} pageSize={20} layout="prev, pager, next" total={this.state.count} small={true} />
                </div>
                <Dialog title="添加新的用户" size="tiny" visible={this.state.isHide} onCancel={() => this.setState({ isHide: false })}>
                    <Dialog.Body>
                        <Form model={this.state.form}>
                            <Form.Item label="登录名" labelWidth="70">
                                <Input value={this.state.form.username} onChange={(value: any) => this.onChange('username', value)} placeholder="登录的用户名"></Input>
                            </Form.Item>
                            <Form.Item label="姓名" labelWidth="70">
                                <Input value={this.state.form.nickname} onChange={(value: any) => this.onChange('nickname', value)} placeholder="昵称"></Input>
                            </Form.Item>
                        </Form>
                    </Dialog.Body>
                    <Dialog.Footer>
                        <Button onClick={() => this.setState({ isHide: false })}>取 消</Button>
                        <Button type="primary" onClick={() => this.addUser()}>
                            保 存
                        </Button>
                    </Dialog.Footer>
                </Dialog>
                <Dialog title="修改部门" size="tiny" visible={this.state.showSection} onCancel={() => this.setState({ showSection: false })}>
                    <Dialog.Body>
                        <Input value={this.state.sectionName} onChange={(value: any) => this.changeInput(value)} placeholder="登录的用户名"></Input>
                    </Dialog.Body>
                    <Dialog.Footer>
                        <Button onClick={() => this.setState({ showSection: false })}>取 消</Button>
                        <Button type="primary" onClick={() => this.changeSection()}>
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
            const data = await request.get('/user/list', {
                pageIndex: this.pageIndex,
                username: this.state.username
            });
            this.setState({
                count: data.count,
                list: data.rows
            });
        } catch (error) {
            console.log(error);
        }
    }
    handleChange(username: any) {
        this.setState({ username });
    }
    handleClick = () => {
        this.getList(1);
    };
    username = '';
    openSection(data: any) {
        this.username = data.username;
        this.setState({ showSection: true, sectionName: data.section });
    }
    changeInput(v: string) {
        this.setState({ sectionName: v });
    }
    async changeSection() {
        try {
            await request.post('/user/section', { section: this.state.sectionName, username: this.username });
            this.setState({ showSection: false, sectionName: '' });
            this.username = '';
            this.getList();
        } catch (error) {
            console.log(error);
            Message.error(error.message);
        }
    }
    onChange(key: string, v: string) {
        const form = this.state.form;
        form[key] = v;
        this.setState({ form });
    }
    onCurrentChange = (pageIndex: number) => {
        this.getList(pageIndex);
    };
    goDetail(username: string) {
        this.props.history.push('/users/detail?username=' + username);
    }
    goRules(username: string) {
        this.props.history.push('/users/rules?username=' + username);
    }
    async goOpen(username: string, status: number) {
        try {
            await request.post('/user/change', { username, status });
            this.getList();
        } catch (error) {
            console.log(error);
        }
    }
    openAdd = () => {
        this.setState({ isHide: true });
    };
    async addUser() {
        if (!this.state.form.nickname || !this.state.form.username) return;
        try {
            await request.post('/user/add', this.state.form);
            this.setState({ isHide: false, form: { username: '', nickname: '' } });
            this.getList();
        } catch (error) {
            console.log(error);
            Message.error(error.message);
        }
    }
}
