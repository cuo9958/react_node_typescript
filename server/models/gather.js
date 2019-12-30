const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const MysqlConnection = require('../db/mysql');

const Gather = MysqlConnection.define(
    't_rules',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: Sequelize.STRING(50),
            defaultValue: '',
            comment: '集合名称'
        },
        rules: {
            type: Sequelize.STRING,
            defaultValue: '',
            comment: '权限集合'
        },
        status: {
            type: Sequelize.TINYINT,
            defaultValue: 0,
            comment: '状态;0:失效;1:使用'
        }
    },
    { freezeTableName: true }
);

//强制初始化数据库
// Gather.sync({ force: true });

module.exports = {
    insert(model) {
        return Gather.create(model);
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
        return Gather.findAndCountAll(config);
    },
    get(username) {
        return Gather.findOne({
            where: {
                username
            }
        });
    },
    update(model, username) {
        return Gather.update(model, {
            where: {
                username
            }
        });
    }
};
