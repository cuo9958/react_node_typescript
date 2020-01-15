const Redis = require('../db/redis')();
const LRU = require('lru-cache');

const caches = new LRU({
    maxAge: 864000000,
    updateAgeOnGet: true
});

module.exports = {
    /**
     * 取回登录信息
     * @param fg 指纹
     */
    async login(uuid) {
        let model = '';
        if (caches.has(uuid)) {
            model = caches.get(uuid);
        } else {
            model = await Redis.get('fe_user_sdk_' + uuid);
            model = JSON.parse(model);
            caches.set(uuid, model);
        }
        return model;
    },
    /**
     * 登录成功，更新用户信息
     * @param {*} model
     */
    update(uuid, model) {
        if (!uuid || !model) return;
        caches.set(uuid, model);
        Redis.set('fe_user_sdk_' + uuid, JSON.stringify(model));
    }
};
