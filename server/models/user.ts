import Sequelize, { Model } from "sequelize";
import { MysqlConnection } from "../db/mysql";

const Op = Sequelize.Op;

class User extends Model {}

User.init(
    {
        username: {
            type: Sequelize.STRING(50),
            primaryKey: true,
            comment: "登录名称"
        },
        nickname: {
            type: Sequelize.STRING(50),
            defaultValue: "",
            comment: "用户昵称"
        },
        headimg: {
            type: Sequelize.STRING(200),
            defaultValue: "",
            comment: "头像"
        },
        rules: {
            type: Sequelize.STRING,
            defaultValue: "",
            comment: "权限集合"
        },
        status: {
            type: Sequelize.TINYINT,
            defaultValue: 0,
            comment: "状态;0:失效;1:使用"
        }
    },
    {
        sequelize: MysqlConnection,
        modelName: "t_user",
        freezeTableName: true,
        indexes: [
            {
                unique: false,
                fields: ["username"]
            }
        ]
    }
);

//强制初始化数据库
// User.sync({ force: true });

interface IUser {
    username: string;
}
export function insert(model: IUser) {
    return User.create(model);
}

interface IConfig {
    limit: number;
    offset: number;
    order: any[];
    where?: any;
}
export function getCount(limit = 1, name = "") {
    let config: IConfig = {
        limit: 20,
        offset: (limit - 1) * 20,
        order: [["createdAt", "desc"]]
    };
    if (name) {
        config.where = {
            [Op.or]: {
                username: {
                    [Op.like]: "%" + name + "%"
                },
                nickname: {
                    [Op.like]: "%" + name + "%"
                }
            }
        };
    }
    return User.findAndCountAll(config);
}

export function get(username: string) {
    return User.findOne({
        where: {
            username
        }
    });
}

export function update(model: IUser, username: string) {
    return User.update(model, {
        where: {
            username
        }
    });
}
