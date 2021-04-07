var subsidizeSys =
{
    operateAddress: '',
    operateID: 'subsidizePanel',
    html: `<div id="subsidizePanel"  style="position:absolute;z-index:8;top:calc(10% - 1px);width:24em; left:calc(50% - 12em);height:auto;border:solid 1px red;text-align:center;background:rgba(104, 48, 8, 0.85);color:#83ffff;overflow-y: scroll;max-height: calc(90%);  ">
        <table style="width:100%;">
            <tr>
                <th>剩余资助</th>
                <th>现有资助</th>
            </tr>
            <tr>
                <td id="moneyOfSumSubsidizing" >未知</td>
                <td id="moneyOfSumSubsidized">0</td>
            </tr>
        </table>
        <div style="
        margin-bottom: 0.25em;
        margin-top: 0.25em;border:1px solid gray;">

            <label>
                --↓↓↓输入1打头的比特币地址↓↓↓--
            </label>
            <input id="bitcoinSubsidizeAddressInput" type="text" style="width:calc(90% - 10px);margin-bottom:0.25em;background:rgba(127, 255, 127, 0.6);" />
        </div>
        <div style="
        margin-bottom: 0.25em;
        margin-top: 0.25em;border:1px solid gray;">

            <label onclick="alert('弹出二维码');">
                --↓↓↓对以下信息进行签名↓↓↓--
            </label> 
            <input  id="msgNeedToSign" type="text" style="width:calc(90% - 10px);margin-bottom:0.25em;background:rgba(127, 255, 127, 0.6);" readonly />
        </div>
        <div style="
        margin-bottom: 0.25em;
        margin-top: 0.25em;border:1px solid gray;">

            <label onclick="alert('弹出扫描二维码');">
                --↓↓↓输入签名↓↓↓--
            </label>
            <textarea id="signatureInputTextArea" style="width:calc(90% - 10px);margin-bottom:0.25em;background:rgba(127, 255, 127, 0.6);height:4em;overflow:hidden;">1111111111111111111111</textarea>

        </div> 

        <table style="width:100%">
            <tr>
                <td style="width:50%">
                    <div style="background: yellowgreen; width:90%;margin-left:5%;" onclick="subsidizeSys.subsidize(50000)" >
                        资助500
                    </div>
                </td>
                <td style="width: 50%">
                    <div style="background: yellowgreen; width:90%;margin-left:5%;"  onclick="subsidizeSys.subsidize(100000)" >
                        资助1000
                    </div>
                </td>
            </tr>
            <tr>
                <td style="width:50%">
                    <div style="background: yellowgreen; width:90%;margin-left:5%;" onclick="subsidizeSys.subsidize(200000)" >
                        资助2000
                    </div>
                </td>
                <td style="width: 50%">
                    <div style="background: yellowgreen; width:90%;margin-left:5%;" onclick="subsidizeSys.subsidize(500000)">
                        资助5000
                    </div>
                </td>
            </tr> 
        </table>
         <div style="background: yellowgreen;
        margin-bottom: 0.25em;
        margin-top: 0.25em;" onclick="subsidizeSys.signOnline();">
            线上私钥签名
        </div>
        <div style="background: yellowgreen;
        margin-bottom: 0.25em;
        margin-top: 0.25em;" onclick="subsidizeSys.add();">
            取消
        </div>
    </div>`,
    add: function () {
        var that = subsidizeSys;
        if (document.getElementById(that.operateID) == null) {
            // var obj = new DOMParser().parseFromString(that.html, 'text/html');
            var frag = document.createRange().createContextualFragment(that.html);
            frag.id = that.operateID;

            document.body.appendChild(frag);
            that.updateMoney();
            that.updateSignInfomation();
            that.updateMoneyOfSumSubsidized();
            that.updateMoneyOfSumSubsidizing();
        }
        else {
            document.getElementById(that.operateID).remove();
        }
    },
    updateMoneyOfSumSubsidizing: function () {
        var that = subsidizeSys;
        if (that.operateAddress != '')
            if (document.getElementById('moneyOfSumSubsidizing') != null) {
                document.getElementById('moneyOfSumSubsidizing').innerText = (that.LeftMoneyInDB[that.operateAddress] / 100).toFixed(2);
            }
    },
    updateMoneyOfSumSubsidized: function () {
        var that = subsidizeSys;
        if (document.getElementById('moneyOfSumSubsidized') != null) {
            document.getElementById('moneyOfSumSubsidized').innerText = (that.SupportMoney / 100).toFixed(2);
        }
    },
    updateMoney: function () {
        document.getElementById('msgNeedToSign').value = JSON.parse(sessionStorage['session']).Key;
    },
    subsidize: function (subsidizeValue) {
        var bitcoinAddress = document.getElementById('bitcoinSubsidizeAddressInput').value;
        if (yrqCheckAddress(bitcoinAddress)) {
            document.getElementById('bitcoinSubsidizeAddressInput').style.background = 'rgba(127, 255, 127, 0.6)';

            var signature = document.getElementById('signatureInputTextArea').value;
            var signMsg = JSON.parse(sessionStorage['session']).Key;
            document.getElementById('msgNeedToSign').value = signMsg;
            if (yrqVerify(bitcoinAddress, signature, signMsg)) {
                document.getElementById('signatureInputTextArea').style.background = 'rgba(127, 255, 127, 0.6)';
                objMain.ws.send(JSON.stringify({ c: 'GetSubsidize', signature: signature, address: bitcoinAddress, value: subsidizeValue }));
                subsidizeSys.operateAddress = bitcoinAddress;
                subsidizeSys.signInfoMatiion = [signature, bitcoinAddress];
            }
            else {
                document.getElementById('signatureInputTextArea').style.background = 'rgba(255, 127, 127, 0.9)';
            }
            //var signature=
            //            if (yrqVerify(bitcoinAddress

        }
        else {
            document.getElementById('bitcoinSubsidizeAddressInput').style.background = 'rgba(255, 127, 127, 0.9)';
        }
    },
    signOnline: function () {
        subsidizeSys.add();
        subsidizeSys.add2();
    },
    operateID2: 'subsidizePanelPromptPrivateKey',
    html2: ` <div id="subsidizePanelPromptPrivateKey" style="position: absolute;
        z-index: 8;
        top: calc(10% - 1px);
        width: 24em;
        left: calc(50% - 12em);
        height: auto;
        border: solid 1px red;
        text-align: center;
        background: rgba(104, 48, 8, 0.85);
        color: #83ffff;
        overflow: hidden;
        max-height: calc(90%);
">
        <div style="
        margin-bottom: 0.25em;
        margin-top: 0.25em;border:1px solid gray;">

            <label>
                --↓↓↓输入您珍贵的私钥↓↓↓--
            </label>
          
            
 <textarea id="subsidizePanelPromptPrivateKeyValue" style="width:calc(90% - 10px);margin-bottom:0.25em;background:rgba(127, 255, 127, 0.6);height:4em;overflow:hidden;" onchange="subsidizeSys.privateKeyChanged();"></textarea>
 
       
        <div style="background: yellowgreen;
        margin-bottom: 0.25em;
        margin-top: 0.25em;" onclick="subsidizeSys.sign();">
            签名
        </div>
        <div style="background: yellowgreen;
        margin-bottom: 0.25em;
        margin-top: 0.25em;" onclick="subsidizeSys.getPrivateKey();">
            获取私钥
        </div>
        <div style="background: yellowgreen;
        margin-bottom: 0.25em;
        margin-top: 0.25em;" onclick="subsidizeSys.add2();">
            取消
        </div>
    </div>`,
    add2: function () {
        var that = subsidizeSys;
        if (document.getElementById(that.operateID2) == null) {
            // var obj = new DOMParser().parseFromString(that.html, 'text/html');
            var frag = document.createRange().createContextualFragment(that.html2);
            frag.id = that.operateID2;

            document.body.appendChild(frag);
            //that.updateMoney();
        }
        else {
            document.getElementById(that.operateID2).remove();
        }
    },
    privateKeyChanged: function () {

        var privateKey = document.getElementById('subsidizePanelPromptPrivateKeyValue').value;
        if (yrqCheckPrivateKey(privateKey)) {
            document.getElementById('subsidizePanelPromptPrivateKeyValue').style.background = 'rgba(127, 255, 127, 0.6)';
        }
        else {
            document.getElementById('subsidizePanelPromptPrivateKeyValue').style.background = 'rgba(255, 127, 127, 0.6)';
        }
    },
    sign: function () {
        var that = subsidizeSys;
        var privateKey = document.getElementById('subsidizePanelPromptPrivateKeyValue').value;
        if (yrqCheckPrivateKey(privateKey)) {

            //document.getElementById('subsidizePanelPromptPrivateKeyValue').style.background = 'rgba(127, 255, 127, 0.6)';
            var signMsg = JSON.parse(sessionStorage['session']).Key;

            that.signInfoMatiion = yrqSign(privateKey, signMsg)
            that.add2();
            that.add();
        }
        else {
            document.getElementById('subsidizePanelPromptPrivateKeyValue').style.background = 'rgba(255, 127, 127, 0.6)';
        }
    },
    signInfoMatiion: null,
    LeftMoneyInDB: {},
    updateSignInfomation: function () {
        var that = subsidizeSys;
        if (that.signInfoMatiion != null) {
            if (document.getElementById('bitcoinSubsidizeAddressInput') != null) {
                document.getElementById('bitcoinSubsidizeAddressInput').value = that.signInfoMatiion[1];
            }
            if (document.getElementById('signatureInputTextArea') != null) {
                document.getElementById('signatureInputTextArea').value = that.signInfoMatiion[0];
            }
        }
    },
    SupportMoney: 0,
    getPrivateKey: function () {
        document.getElementById('subsidizePanelPromptPrivateKeyValue').value = yrqGetRandomPrivateKey();
    }
}
    ;
var debtInfoSys =
{ 
    operateID: 'debtPanel',
    html: `<div id="subsidizePanel"  style="position:absolute;z-index:8;top:calc(10% - 1px);width:24em; left:calc(50% - 12em);height:auto;border:solid 1px red;text-align:center;background:rgba(104, 48, 8, 0.85);color:#83ffff;overflow-y: scroll;max-height: calc(90%);  ">
        <table style="width:100%;">
            <tr>
                <th>剩余资助</th>
                <th>现有资助</th>
            </tr>
            <tr>
                <td id="moneyOfSumSubsidizing" >未知</td>
                <td id="moneyOfSumSubsidized">0</td>
            </tr>
        </table>
        <div style="
        margin-bottom: 0.25em;
        margin-top: 0.25em;border:1px solid gray;">

            <label>
                --↓↓↓输入1打头的比特币地址↓↓↓--
            </label>
            <input id="bitcoinSubsidizeAddressInput" type="text" style="width:calc(90% - 10px);margin-bottom:0.25em;background:rgba(127, 255, 127, 0.6);" />
        </div>
        <div style="
        margin-bottom: 0.25em;
        margin-top: 0.25em;border:1px solid gray;">

            <label onclick="alert('弹出二维码');">
                --↓↓↓对以下信息进行签名↓↓↓--
            </label> 
            <input  id="msgNeedToSign" type="text" style="width:calc(90% - 10px);margin-bottom:0.25em;background:rgba(127, 255, 127, 0.6);" readonly />
        </div>
        <div style="
        margin-bottom: 0.25em;
        margin-top: 0.25em;border:1px solid gray;">

            <label onclick="alert('弹出扫描二维码');">
                --↓↓↓输入签名↓↓↓--
            </label>
            <textarea id="signatureInputTextArea" style="width:calc(90% - 10px);margin-bottom:0.25em;background:rgba(127, 255, 127, 0.6);height:4em;overflow:hidden;">1111111111111111111111</textarea>

        </div> 

        <table style="width:100%">
            <tr>
                <td style="width:50%">
                    <div style="background: yellowgreen; width:90%;margin-left:5%;" onclick="subsidizeSys.subsidize(50000)" >
                        资助500
                    </div>
                </td>
                <td style="width: 50%">
                    <div style="background: yellowgreen; width:90%;margin-left:5%;"  onclick="subsidizeSys.subsidize(100000)" >
                        资助1000
                    </div>
                </td>
            </tr>
            <tr>
                <td style="width:50%">
                    <div style="background: yellowgreen; width:90%;margin-left:5%;" onclick="subsidizeSys.subsidize(200000)" >
                        资助2000
                    </div>
                </td>
                <td style="width: 50%">
                    <div style="background: yellowgreen; width:90%;margin-left:5%;" onclick="subsidizeSys.subsidize(500000)">
                        资助5000
                    </div>
                </td>
            </tr> 
        </table>
         <div style="background: yellowgreen;
        margin-bottom: 0.25em;
        margin-top: 0.25em;" onclick="subsidizeSys.signOnline();">
            线上私钥签名
        </div>
        <div style="background: yellowgreen;
        margin-bottom: 0.25em;
        margin-top: 0.25em;" onclick="subsidizeSys.add();">
            取消
        </div>
    </div>`,
    add: function () {
        var that = subsidizeSys;
        if (document.getElementById(that.operateID) == null) {
            // var obj = new DOMParser().parseFromString(that.html, 'text/html');
            var frag = document.createRange().createContextualFragment(that.html);
            frag.id = that.operateID;

            document.body.appendChild(frag);
            that.updateMoney();
            that.updateSignInfomation();
            that.updateMoneyOfSumSubsidized();
            that.updateMoneyOfSumSubsidizing();
        }
        else {
            document.getElementById(that.operateID).remove();
        }
    },
};