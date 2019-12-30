/**
 * 鉴权相关
 */
const LRU = require('lru-cache');
const config = require('config');
const Redis = require('../db/redis')();

const request = require('./request');
const generate = require('nanoid/non-secure/generate');
const UserModel = require('../models/user');

const CONF = config.get('ldap');

function getGuid() {
    return generate('123456789abcdefghijklmnpqrstuvwxyz', 12);
}

const caches = new LRU({
    maxAge: 864000000,
    updateAgeOnGet: true
});

module.exports = {
    /**
     * 校验用户是否登录
     * @param {*} username
     * @param {*} uid
     * @param {*} token
     */
    async auth(username, uid, token) {
        if (!username || !uid || !token) return false;
        const cache_data = await this.info(uid);
        return cache_data.token === token;
    },
    /**
     * 登录，检查是否存在，存入数据库,本机设置缓存
     * @param {*} username
     * @param {*} password
     */
    async login(username, password) {
        const data = await request.post(CONF.login, {
            username: username,
            password: password,
            project: CONF.name,
            expire: 86400
        });
        if (data.status !== 0) throw new Error(data.message);
        const model = {
            mail: data.mail,
            mobile: data.mobile,
            username,
            nickname: data.displayname,
            headimg: data.userphoto
        };
        await UserModel.insert(model);
        const modelData = await UserModel.get(username);
        if (!modelData) throw new Error('用户不存在');
        model.uid = getGuid();
        model.token = data.token;
        model.rules = modelData.rules;
        caches.set(model.uid, model);
        console.log(model)
        //100天
        Redis.set('fe_user_center_' + model.uid, JSON.stringify(model), 'EX', 8640000);
        return model;
    },
    /**
     * 获取用户信息
     * @param {*} uid
     */
    async info(uid) {
        if (!uid) throw new Error('用户不存在');
        if (caches.has(uid)) return caches.get(uid);
        console.log('fe_user_center_' + uid)
        const data = await Redis.get('fe_user_center_' + uid);
        if (!data) throw new Error('用户不存在');
        const model = JSON.parse(data);
        caches.set(uid, model);
        return model;
    },
    /**
     * 删除对应的缓存
     * @param {*} uid
     */
    delCache(uid) {
        caches.del(uid);
    }
};
