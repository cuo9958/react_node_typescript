import AuthService from './auth';

module.exports = {
    /**
     * 调用ldap的登录服务
     * @param username 用户名
     * @param pwd 密码
     */
    login(username, pwd) {
        return AuthService.login(username, pwd);
    }
};
