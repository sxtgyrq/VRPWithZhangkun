var dialogSys =
{
    showFriendsList: function () {

        while (document.getElementById('msgDialog') != null) {
            document.getElementById('msgDialog').remove();
        }
        if (document.getElementById('friendsList') != null) {
            document.getElementById('friendsList').remove();
        } else {
            var friendsList = document.createElement('friendsList');

            friendsList.id = 'friendsList';
            friendsList.style.position = 'absolute';
            friendsList.style.zIndex = '11';
            friendsList.style.top = '5px';
            friendsList.style.left = '5px';
            friendsList.style.width = '12em';
            friendsList.style.height = 'calc(100% - 65px)';
            friendsList.style.border = 'solid 1px red';
            friendsList.style.textAlign = 'center';
            friendsList.style.background = 'rgba(104, 48, 8, 0.85)';
            friendsList.style.color = '#83ffff';


            for (var key in objMain.othersBasePoint) {
                var divItem = document.createElement('div');
                divItem.style.marginBottom = '0.25em';
                divItem.style.marginTop = '0.25em';
                divItem.innerText = objMain.othersBasePoint[key].playerName;


                divItem.CustomTag = objMain.othersBasePoint[key];
                divItem.indexKey = key;
                divItem.id = 'contact_' + key;
                if (this.msgs[key] != undefined) {
                    if (this.msgs[key].read.length > this.msgs[key].readLength) {
                        divItem.classList.add('friendMsg');
                    }
                }
                var that = this;
                divItem.onclick = function () {
                    //   alert(this.CustomTag);
                    that.showDialog(this.CustomTag);
                }

                friendsList.appendChild(divItem);
                //  console.log(key, objMain.othersBasePoint[key])
            }
            document.body.appendChild(friendsList);
        }
    },
    show: function () {
        var count = 0;
        var selectKey = '';
        for (var item in this.msgs) {
            if (this.msgs[item].read.length > this.msgs[item].readLength) {
                count++;
                if (this.msgs[item].read[0].Key == objMain.indexKey) {
                    selectKey = this.msgs[item].read[0].To;
                }
                else {
                    selectKey = this.msgs[item].read[0].Key;
                }
            }
        }
        if (count == 0) {
            //看情况打开!
            if (document.getElementById('msgDialog') != null) {
                //  this.showFriendsList();
                alert('这种情况没有编写');
            }
            if (document.getElementById('friendsList') != null) {
                this.showFriendsList();
            }
            else {
                this.showFriendsList();
            }
        }
        else if (count == 1) {
            if (selectKey != '')
                if (objMain.othersBasePoint[selectKey] != undefined) {

                    this.showDialog(objMain.othersBasePoint[selectKey]);
                }
            //alert(selectData.notRead[0].Key);
            //if (objMain.othersBasePoint[selectData.notRead[0].Key] != undefined) {

            //    this.showDialog(objMain.othersBasePoint[selectData.notRead[0].Key]);
            //}
            //else {
            //    this.showFriendsList();

        }
        else if (count > 1) {
            this.showFriendsList();
        }
    },
    showDialog: function (data) {

        if (document.getElementById('friendsList') != null) {
            document.getElementById('friendsList').remove();
        }
        while (document.getElementById('msgDialog') != null) {
            document.getElementById('msgDialog').remove();
        }

        var dialog = document.createElement('div');
        dialog.id = 'msgDialog';
        dialog.indexKey = data.indexKey;
        //  dialog.classList.add
        dialog.classList.add('dialog');
        dialog.classList.add('show');

        var dialogPanel1 = document.createElement('div');
        dialogPanel1.className = 'dialogPanel1';

        {
            var header = document.createElement('header');
            header.id = 'panelHeader-5';
            header.className = 'dialogPanelheader';

            var btn = document.createElement('button');
            btn.id = 'panelLeftButtonGoBack';
            btn.className = 'dialogPanelLeftButton';

            var span = document.createElement('span');
            span.className = 'dialogBtn_text';
            span.innerText = '返回';
            btn.appendChild(span);
            btn.onclick = function () {
                while (document.getElementById('msgDialog') != null) {
                    document.getElementById('msgDialog').remove();
                }
            };

            var h1 = document.createElement('h1');
            h1.id = 'panelTitleDialogTo';
            h1.className = 'dialogPanelTitleName';
            h1.style.paddingLeft = '2em';
            h1.innerText = data.playerName;

            header.appendChild(btn);
            header.appendChild(h1);

            dialogPanel1.appendChild(header);
        }

        //for (var i = 0; i < this.msgs[data.indexKey].read.length; i++) {
        //    this.msgs[data.indexKey].read.push(this.msgs[data.indexKey].notRead[i]);
        //}
        // this.msgs[data.indexKey].notRead = [];
        {
            var panelBodyShowMsg = document.createElement('div');
            panelBodyShowMsg.className = 'dialogPanel_body';
            panelBodyShowMsg.id = 'panelBodyShowMsg';
            dialogPanel1.appendChild(panelBodyShowMsg);
        }

        {
            var panelFooter = document.createElement('footer');
            panelFooter.className = 'dialogChat_toolbar_footer';

            var ul = document.createElement('ul');
            {
                var li1 = document.createElement('li');
                li1.classList.add('dialogSession');
                li1.classList.add('left');
                var a = document.createElement('a');
                a.style.marginTop = '5px';
                var span = document.createElement('span');
                span.style.display = 'block';
                span.style.bottom = '4px';
                span.style.width = '100%';
                span.style.fontSize = '28px';
                span.innerText = '✚';
                a.appendChild(span);
                li1.append(a);
                ul.appendChild(li1);
            }
            {
                var li2 = document.createElement('li');
                li2.classList.add('dialogSession');
                li2.classList.add('input');

                var textarea = document.createElement('textarea');
                textarea.id = 'dialogChatInput';
                textarea.className = 'dialogChat_textareaStyle';
                textarea.maxLength = '120';
                li2.append(textarea);
                ul.append(li2);
            }

            {
                var li3 = document.createElement('li');
                li3.CustomTag = data;
                li3.classList.add('dialogSession');
                li3.classList.add('right');

                var a = document.createElement('a');
                a.style.marginTop = '5px';

                var span = document.createElement('span');
                span.style.display = 'block';
                span.style.bottom = '4px';
                span.style.width = '100%';
                span.style.fontSize = '28px';
                span.innerText = '发送';
                a.appendChild(span);
                li3.appendChild(a);
                li3.Tag = data;
                li3.onclick = function () {
                    document.getElementById('dialogChatInput');
                    if (document.getElementById('dialogChatInput').value == '') {
                        alert('不要发送空信息！');
                    }
                    else {
                        var msg = document.getElementById('dialogChatInput').value;
                        //  alert(msg);
                        document.getElementById('dialogChatInput').value = '';
                        var obj = { 'c': 'Msg', 'MsgPass': msg, 'to': this.Tag.indexKey };

                        objMain.ws.send(JSON.stringify(obj));
                        //console.log('obj', obj);
                        //console.log('obj', this.Tag);
                    }
                }
                ul.appendChild(li3);
            }

            panelFooter.appendChild(ul);
            dialogPanel1.appendChild(panelFooter);
        }

        dialog.appendChild(dialogPanel1);
        console.log('tag', data);
        dialog.indexKey = data.indexKey;
        document.body.appendChild(dialog);


        if (this.msgs[data.indexKey] != undefined)
            for (var i = 0; i < this.msgs[data.indexKey].read.length; i++) {
                if (this.msgs[data.indexKey].read[i].Key == objMain.indexKey) {
                    this.addMsgOfSelf(this.msgs[data.indexKey].read[i]);
                }
                else if (this.msgs[data.indexKey].read[i].To == objMain.indexKey) {
                    this.addMsgOfBuddy(this.msgs[data.indexKey].read[i]);
                }
            }
        //for (var i = 0; i < this.msgs[data.indexKey].read.length; i++) {

        //}
    },
    dealWithMsg: function (msg) {
        console.log('msg', msg);
        if (objMain.indexKey == msg.Key) {
            if (this.msgs[msg.To] == undefined) {
                this.msgs[msg.To] = { 'read': [], 'readLength': 0 };
            }
            this.msgs[msg.To].read.push(msg);
        }
        else if (objMain.indexKey == msg.To) {

            if (this.msgs[msg.Key] == undefined) {
                this.msgs[msg.Key] = { 'read': [], 'readLength': 0 };
            }
            this.msgs[msg.Key].read.push(msg);
        }
        this.iconAlart();
        this.updatePanel();
    },
    msgs: {},
    addMsgOfSelf: function (msg) {
        var selfMsgDiv = document.createElement('div');
        selfMsgDiv.classList.add('dialogChat_content_group');
        selfMsgDiv.classList.add('self');

        var p1 = document.createElement('p');
        p1.classList.add('dialogChat_nick');
        var a = document.createElement('a');
        a.innerText = objMain.displayName;
        p1.appendChild(a);

        var p2 = document.createElement('p');
        p2.classList.add('chat_content');
        p2.innerText = msg.Msg;

        //  a.innerText = objMain.basePoint.;
        selfMsgDiv.appendChild(p1);
        selfMsgDiv.appendChild(p2);

        var panelBodyShowMsg = document.getElementById('panelBodyShowMsg');
        panelBodyShowMsg.appendChild(selfMsgDiv);
    },
    addMsgOfBuddy: function (msg) {
        var buddyMsgDiv = document.createElement('div');
        buddyMsgDiv.classList.add('dialogChat_content_group');
        buddyMsgDiv.classList.add('buddy');

        var p1 = document.createElement('p');
        p1.classList.add('dialogChat_nick');
        var a = document.createElement('a');
        a.innerText = objMain.displayName;
        p1.appendChild(a);

        var p2 = document.createElement('p');
        p2.classList.add('chat_content');
        p2.innerText = msg.Msg;

        //  a.innerText = objMain.basePoint.;
        buddyMsgDiv.appendChild(p1);
        buddyMsgDiv.appendChild(p2);

        var panelBodyShowMsg = document.getElementById('panelBodyShowMsg');
        panelBodyShowMsg.appendChild(buddyMsgDiv);

        panelBodyShowMsg.scrollTo(0, panelBodyShowMsg.scrollHeight);
        // var panelBodyShowMsg = document.getElementById('panelBodyShowMsg')
    },
    iconAlart: function () {
        if (document.getElementById('msgDialog') != null) { }
        else if (document.getElementById('friendsList') != null) { }
        else {
            if (document.getElementById('msgToNotify').classList.contains('msg')) {

            }
            else {
                document.getElementById('msgToNotify').classList.add('msg');
            }
        }
    },
    updatePanel: function () {
        if (document.getElementById('msgDialog') != null) {
            var keyOperate = document.getElementById('msgDialog').indexKey;
            var panelBodyShowMsg = document.getElementById('panelBodyShowMsg');
            if (this.msgs[keyOperate] != undefined)
                for (var i = panelBodyShowMsg.children.length; i < this.msgs[keyOperate].read.length; i++) {
                    if (this.msgs[keyOperate].read[i].Key == objMain.indexKey) {
                        this.addMsgOfSelf(this.msgs[keyOperate].read[i]);
                    }
                    else if (this.msgs[keyOperate].read[i].To == objMain.indexKey) {
                        this.addMsgOfBuddy(this.msgs[keyOperate].read[i]);
                    }
                    this.msgs[keyOperate].readLength = panelBodyShowMsg.children.length;
                }
        }
        else if (document.getElementById('') != null) { }
        else { }
    }
};