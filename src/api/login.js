
// 引入 公有的.request.js  它导出的是 instance

import instance from '@/utils/request.js';
// 下面是请求的方法


function toLogin(params) {
    // 经常写成, 没有return.导致出错.  函数,一般都要return. 没有, 就是没有地外抛值
    return instance({

        url: "/login",
        method: "post",
        params
        //解构赋值
    })
}
export { toLogin }