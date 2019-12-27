import React from "react";
import "./index.less";
import Utils from "../../services/utils";
import { Dropdown, Button } from "element-react";
import url_configs from "../../routes/config";
import { inject } from "mobx-react";

function Menus(item: any, onSelect: any, active: string) {
    if (item.hide) return;
    return (
        <li key={item.name} className={"menu_item" + (active === item.name ? " active" : "")} onClick={() => onSelect(item.path)}>
            {item.icon && <i className={item.icon}></i>}
            {item.title}
        </li>
    );
}

interface iState {
    active: string;
    layout: boolean;
}

interface iProps extends iReactRoute {
    nickname: string;
    check(): void;
}

@inject((models: any) => ({
    nickname: models.user.nickname,
    check: models.user.check
}))
export default class extends React.Component<iProps, iState> {
    constructor(props: any) {
        super(props);
        const curr = Utils.checkUrl(props.location.pathname);
        this.state = {
            active: curr.name,
            layout: !curr.hideLayout
        };
    }
    render() {
        if (!this.state.layout) return this.props.children;
        return (
            <div>
                <div id="sider">
                    <div id="logo">后台系统 v1.0</div>
                    <div id="menus">
                        <ul className="menu_bg">{url_configs.map((item, index) => Menus(item, this.onSelect, this.state.active))}</ul>
                    </div>
                </div>
                <div id="main">
                    <div className="top_menus flex-right">
                        {this.props.nickname && (
                            <Dropdown
                                trigger="click"
                                onCommand={this.onCommand}
                                menu={
                                    <Dropdown.Menu>
                                        <Dropdown.Item command="/user_center">个人中心</Dropdown.Item>
                                        <Dropdown.Item command="/login" divided>
                                            注销
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                }
                            >
                                <span className="el-dropdown-link">
                                    {this.props.nickname}
                                    <i className="el-icon-caret-bottom el-icon--right"></i>
                                </span>
                            </Dropdown>
                        )}
                        {!this.props.nickname && (
                            <Button type="primary" size="mini" onClick={() => this.onCommand("/login")}>
                                登录
                            </Button>
                        )}
                    </div>
                    <div className="height40"></div>
                    <div className="continer">{this.props.children}</div>
                </div>
            </div>
        );
    }
    componentDidMount() {
        this.props.check();
    }
    componentWillReceiveProps(pp: any) {
        const curr = Utils.checkUrl(pp.location.pathname);
        this.props.check();
        this.setState({
            active: curr.name,
            layout: !curr.hideLayout
        });
    }
    onSelect = (index: string) => {
        this.props.history.push(index);
    };

    onCommand = (command: string) => {
        this.props.history.push(command);
    };
}
