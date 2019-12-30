const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const MysqlConnection = require('../db/mysql');

const User = MysqlConnection.define(
    't_user',
    {
        username: {
            type: Sequelize.STRING(50),
            primaryKey: true,
            comment: '登录名称'
        },
        nickname: {
            type: Sequelize.STRING(50),
            defaultValue: '',
            comment: '用户昵称'
        },
        headimg: {
            type: Sequelize.STRING(200),
            defaultValue: '',
            comment: '头像'
        },
        mail: {
            type: Sequelize.STRING(100),
            defaultValue: '',
            comment: '邮箱'
        },
        mobile: {
            type: Sequelize.STRING(100),
            defaultValue: '',
            comment: '邮箱'
        },
        rules: {
            type: Sequelize.STRING,
            defaultValue: '',
            comment: '权限集合'
        },
        ruleTxts: {
            type: Sequelize.TEXT,
            defaultValue: '',
            comment: '权限文字集合'
        },
        status: {
            type: Sequelize.TINYINT,
            defaultValue: 0,
            comment: '状态;0:失效;1:使用'
        }
    },
    {
        freezeTableName: true,
        indexes: [
            {
                unique: false,
                fields: ['username']
            }
        ]
    }
);

//强制初始化数据库
// User.sync({ force: true });

module.exports = {
    /**
     * 插入或者更新内容
     * @param model 内容
     */
    insert(model) {
        return User.upsert(model);
    },
    getCount(limit = 1, name = '') {
        let config = {
            limit: 20,
            offset: (limit - 1) * 20,
            order: [['createdAt', 'desc']]
        };
        if (name) {
            config.where = {
                [Op.or]: {
                    username: {
                        [Op.like]: '%' + name + '%'
                    },
                    nickname: {
                        [Op.like]: '%' + name + '%'
                    }
                }
            };
        }
        return User.findAndCountAll(config);
    },
    get(username) {
        return User.findOne({
            where: {
                username
            }
        });
    },
    update(model, username) {
        return User.update(model, {
            where: {
                username
            }
        });
    }
};
