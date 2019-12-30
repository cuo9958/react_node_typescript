const axios = require('axios');
const querystring = require('querystring');

module.exports = {
    post: async function(url, data) {
        const res_data = await axios(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: querystring.stringify(data)
        });
        if (res_data.status !== 200) {
            throw new Error('登录失败');
        }
        return res_data.data;
    }
};
