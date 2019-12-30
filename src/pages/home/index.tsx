import React from 'react';
import './index.less';
import { Table, Input, Pagination, Button } from 'element-react';
import request from '../../services/request';
import utils from '../../services/utils';

interface IState {
    list: any[];
    count: number;
    search: string;
    username: string;
}

export default class extends React.Component<iReactRoute, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            list: [],
            count: 0,
            search: '',
            username: ''
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
            prop: 'rules'
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
            width: 180,
            render: (row: any) => {
                return (
                    <Button.Group>
                        <Button onClick={() => this.goDetail(row.username)} type="primary" size="small">
                            编辑
                        </Button>
                        <Button onClick={() => this.goOpen(row.username, 1)} type="success" size="small">
                            启用
                        </Button>
                        <Button onClick={() => this.goOpen(row.username, 0)} type="danger" size="small">
                            禁用
                        </Button>
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
                </div>
                <Table style={{ width: '100%' }} columns={this.columns} data={this.state.list} border={true} />
                <div className="foot">
                    <Pagination onCurrentChange={this.onCurrentChange} pageSize={20} layout="prev, pager, next" total={this.state.count} small={true} />
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.getList(1);
    }

    pageIndex = 1;
    async getList(pageIndex: number) {
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
    onCurrentChange = (pageIndex: number) => {
        this.getList(pageIndex);
    };
    goDetail(username: string) {}
    goOpen(username: string, status: number) {}
}
