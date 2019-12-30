const Sequelize = require('sequelize');
const MysqlConnection = require('../db/mysql');
const Op = Sequelize.Op;

const Topic = MysqlConnection.define(
    't_topic',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: Sequelize.STRING(50),
            defaultValue: '',
            comment: '项目名称'
        },
        img: {
            type: Sequelize.STRING,
            defaultValue: '',
            comment: '项目图片'
        },
        status: {
            type: Sequelize.TINYINT,
            defaultValue: 0,
            comment: '状态;0:失效;1:使用'
        }
    },
    {
        freezeTableName: true
    }
);

//强制初始化数据库
// Topic.sync({ force: true });

module.exports = {
    insert(model) {
        return Topic.create(model);
    },
    getCount(limit = 1, title = '') {
        let config = {
            limit: 20,
            offset: (limit - 1) * 20,
            order: [['createdAt', 'desc']]
        };
        if (title) {
            config.where = {
                title: {
                    [Op.like]: '%' + title + '%'
                }
            };
        }
        return Topic.findAndCountAll(config);
    },
    get(id) {
        return Topic.findOne({
            where: {
                id
            }
        });
    },
    update(model, id) {
        return Topic.update(model, {
            where: {
                id
            }
        });
    },
    del(id) {
        return Topic.findOne({ where: { id } }).then(res => res.destroy());
    }
};
