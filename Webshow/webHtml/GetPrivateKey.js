var loginThroughWeChat = function () {
    {
        var rmCode = (Date.now() + '').substr(0, 13);
        window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9fac508864b57f57&redirect_uri=https%3A%2F%2Fwww.nyrq123.com%2Fyanzheng%2Findex.html&response_type=code&scope=snsapi_base&state=taiyuan' + rmCode + '#wechat_redirect';
    }

}