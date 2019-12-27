import Err404 from '../pages/404/index';
import Home from '../pages/home/index';
import UserDetail from '../pages/home/detail';
import Topic from '../pages/topic/index';
import Gather from '../pages/gather/index';
import GatherDetail from '../pages/gather/detail';
import Rules from '../pages/rules/index';
import RulesDetail from '../pages/rules/detail';

import Login from '../pages/login/index';

export default [
    {
        /**
         * 页面名,菜单命中
         */
        name: 'users',
        /**
         * 显示名称
         */
        title: '用户列表',
        /**
         * icon图标
         */
        icon: 'fa fa-dashboard',
        /**
         * url路径
         */
        path: '/',
        /**
         * 页面组件
         */
        page: Home,
        /**
         * 是否强制匹配
         */
        exact: true,
        /**
         * 是否隐藏外层视图
         */
        hideLayout: false,
        /**
         * 是否不在菜单展示
         */
        hide: false
    },
    //用户详情
    { name: 'users', title: '任务详情', hide: true, path: '/users/detail', page: UserDetail, exact: true },
    //项目
    { name: 'topic', title: '项目管理', icon: 'fa fa-thermometer', path: '/topic', page: Topic, exact: true },
    //集合
    { name: 'gather', title: '集合管理', icon: 'fa fa-weibo', path: '/gather', page: Gather, exact: true },
    //集合详情
    { name: 'gather', title: '集合详情', hide: true, path: '/gather/detail', page: GatherDetail, exact: true },
    //权限
    { name: 'rules', title: '权限管理', icon: 'fa fa-book', path: '/rules', page: Rules, exact: true },
    //权限详情
    { name: 'rules', title: '权限详情', hide: true, path: '/rules/detail', page: RulesDetail, exact: true },

    { name: 'login', title: '登录', hideLayout: true, hide: true, path: '/login', page: Login, exact: true },
    { name: '404', path: '*', page: Err404, exact: true, hide: true }
];
