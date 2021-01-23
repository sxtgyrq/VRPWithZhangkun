var dialogSys =
{
    showFriendsList: function () {

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

        //看情况打开!
        this.showFriendsList();
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
       // dialog.CustomTag=data.
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

            var h1 = document.createElement('h1');
            h1.id = 'panelTitleDialogTo';
            h1.className = 'dialogPanelTitleName';
            h1.style.paddingLeft = '2em';
            h1.innerText = data.playerName;

            header.appendChild(btn);
            header.appendChild(h1);

            dialogPanel1.appendChild(header);
        }

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
                textarea.className = 'dialogChat_textareaStyle';
                textarea.maxLength = '120';
                li2.append(textarea);
                ul.append(li2);
            }

            {
                var li3 = document.createElement('li');
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
                li3.append(a);
                ul.appendChild(li3);
            }
        }

        dialog.appendChild(dialogPanel1);
        document.body.appendChild(dialog);
    }
};