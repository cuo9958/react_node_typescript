const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const MysqlConnection = require('../db/mysql');

const Gather = MysqlConnection.define(
    't_gather',
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
        rules_name: {
            type: Sequelize.STRING,
            defaultValue: '',
            comment: '权限名称集合'
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
    getCount(limit = 1, title = '') {
        let config = {
            limit: 20,
            offset: (limit - 1) * 20,
            order: [['id', 'desc']]
        };
        if (title) {
            config.where = {
                title: {
                    [Op.like]: '%' + title + '%'
                }
            };
        }
        return Gather.findAndCountAll(config);
    },
    getAll() {
        let config = {
            order: [['id', 'desc']],
            where: {
                status: 1
            }
        };

        return Gather.findAll(config);
    },
    get(id) {
        return Gather.findOne({
            where: {
                id
            }
        });
    },
    change(id, status) {
        return Gather.update(
            { status },
            {
                where: {
                    id
                }
            }
        );
    },
    update(model, id) {
        return Gather.update(model, {
            where: {
                id
            }
        });
    }
};
