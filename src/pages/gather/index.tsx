import React from 'react';
import { Table, Input, Pagination, Button } from 'element-react';
import request from '../../services/request';
import Utils from '../../services/utils';
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
    columns = [
        {
            label: 'id',
            prop: 'id',
            align: 'center',
            width: 90
        },
        {
            label: '名称',
            prop: 'title',
            width: 140
        },
        {
            label: '权限列表',
            prop: 'rules_name'
        },
        {
            label: '状态',
            prop: 'status',
            width: 90,
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
                        <div>{Utils.DateFormartString(row.createdAt)}</div>
                    </div>
                );
            }
        },
        {
            label: '操作',
            width: 130,
            render: (row: any) => {
                return (
                    <Button.Group>
                        <Button onClick={() => this.edit(row.id)} type="primary" size="small">
                            编辑
                        </Button>
                        {row.status === 0 && (
                            <Button onClick={() => this.goOpen(row.id, 1)} type="success" size="small">
                                启用
                            </Button>
                        )}
                        {row.status === 1 && (
                            <Button onClick={() => this.goOpen(row.id, 0)} type="danger" size="small">
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
            <div id="gather_list">
                <div className="search-box">
                    <Input className="input_s" value={this.state.form.title} onChange={value => this.handleChange(value)} placeholder="请输入名称" />
                    <Button type="primary" icon="search" onClick={this.handleClick}>
                        搜索
                    </Button>
                    <Button type="primary" icon="plus" onClick={this.addClick}>
                        新增
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
        this.getList();
    }
    pageIndex: number = 1;
    async getList(pageIndex?: number) {
        if (pageIndex) this.pageIndex = pageIndex;
        try {
            const data = await request.get('/gather', {
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

    addClick = () => {
        this.props.history.push('/gather/detail');
    };
    edit(id: number) {
        this.props.history.push('/gather/detail?id=' + id);
    }

    handleChange(v: any) {
        this.setState({
            form: { title: v }
        });
    }

    handleClick = () => {
        this.getList(1);
    };

    async goOpen(id: number, status: number) {
        try {
            await request.post('/gather/change', { id, status });
            this.getList();
        } catch (error) {
            console.log(error);
        }
    }

    onCurrentChange = (pageIndex: number) => {
        this.getList(pageIndex);
    };
}
