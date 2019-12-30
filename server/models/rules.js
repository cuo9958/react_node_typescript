const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const MysqlConnection = require('../db/mysql');

const Rules = MysqlConnection.define(
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
            comment: '规则名称'
        },
        topic_id: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            comment: '专项id'
        },
        sort_name: {
            type: Sequelize.STRING(50),
            defaultValue: '',
            comment: '关键名称'
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
// Rules.sync({ force: true });

module.exports = {
    insert(model) {
        return Rules.create(model);
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
        return Rules.findAndCountAll(config);
    },
    get(username) {
        return Rules.findOne({
            where: {
                username
            }
        });
    },
    update(model, username) {
        return Rules.update(model, {
            where: {
                username
            }
        });
    }
};
