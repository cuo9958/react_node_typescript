import { factory } from '@dal/fe_user_sdk/dist/react';

const sdk = factory({
    baseUrl: '',
    apiUrl: 'http://fe.corp.daling.com:18064/api_user',
    loginUrl: 'http://fe.corp.daling.com:18064/#/login'
});

export default sdk;
