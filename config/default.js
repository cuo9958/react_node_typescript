module.exports = {
    homepage: '',
    port: 18620,
    //开发环境数据库
    db: {
        host: '10.14.108.89',
        port: '3306',
        database: 'fe_user_center',
        user: 'fe_user_center',
        password: '5BKDGAtAZef5dZzM',
        connectionLimit: 2
    },
    //开发环境，普通redis配置
    redis: 'redis://10.14.108.89:6379',
    ldap: {
        name: 'subject_test',
        login: 'http://aaa.corp.daling.com/api/checklogin',
        auth: 'http://aaa.corp.daling.com/api/checkauth'
    }
};
