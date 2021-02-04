var showAConfig =
    {
        boundry: { width: 0.006, color: 0x33cbfd },
        biandianzhan: {
            l110kv: { radius: 0.8, color: 0xffff00 },
            l220kv: { radius: 0.8, color: 0x3333FF }
        },
        //boundryWidth: 0.006,
        //boundryColor: 0xe780e7
        peiBian: { color: 0x000000, opacity: 0.9 },
    };
//color="#33cbfd"
var getNameAndColorOfLine = function (v) {
    switch (v) {
        case '03-110KV璧靛簞鍙10KV鍙ゅ煄绾':
            {
                { return ['green', '古城线', '赵庄变'] };
            }; break;
        case '03-110kV骞垮満鍙10kV鐪佽皟3鍙风嚎':
            {
                { return ['green', '省调3号线', '广场变'] };
            }; break;
        case '03-110kV涓滃ぇ绔10kV鑲茶嫳绾814':
            {
                { return ['green', '育英线814', '东大站'] };
            }; break;
        case '03-110kV涓滃ぇ绔10kV鎷辨瀬绾818':
            {
                { return ['green', '拱极线818', '东大站'] };
            }; break;

        case '03-110kV涓滃ぇ绔10kV鍩庡欑嚎819':
            {
                { return ['green', '城墙线819', '东大站'] };
            }; break;
        case '03-110kV鍩庡寳鍙10kV瑗胯矾绾827':
            {
                { return ['green', '西路线827', '城北变'] };
            }; break;
        case '03-110kV涓滃ぇ绔10kV宸ヤ細绾817':
            {
                { return ['green', '公会线817', '东大站'] };
            }; break;
        case '03-110kV涓滃ぇ绔10kV涓滃崄绾834':
            {
                { return ['green', '东十线834', '东大站'] };
            }; break;
        case '03-110kV涓滃ぇ绔10kV鍐涘畼绾835':
            {
                { return ['green', '军官线835', '东大站'] };
            }; break;
        case '03-110kV涓滃ぇ绔10kV鐩涗笘绾836':
            {
                { return ['green', '盛世线836', '东大站'] };
            }; break;
        case '03-110kV涓滃ぇ绔10kV涓夋ˉ2鍙风嚎837':
            {
                { return ['green', '三桥2号线837', '东大站'] };
            }; break;
        case '03-110kV涓滈儕绔10kV灏忎笢闂ㄧ嚎849':
            {
                { return ['green', '小东门线849', '东郊站'] };
            }; break;
        case '03-110kV涓滈儕绔10kV娑ф渤绾843':
            {
                { return ['green', '涧河线843', '东郊站'] };
            }; break;
        case '03-220kV瑙ｆ斁鍙10kV寰风ゥ绾857':
            {
                { return ['green', '德祥线857', '解放变'] };
            }; break;
        case '03-110kV鍩庡寳鍙10kV鏂板紑1鍙风嚎819':
            {
                { return ['green', '新开1#线819', '城北变'] };
            }; break;
        case '03-220kV瑙ｆ斁鍙10kV钀ヨタ绾862':
            {
                { return ['green', '营西线862', '解放变'] };
            }; break;
        case '03-110kV鍩庡寳鍙10kV鍖楁柊绾824':
            {
                { return ['green', '北新线824', '城北变'] };
            }; break;
        case '03-220kV瑙ｆ斁鍙10kV寤洪搧绾863':
            {
                { return ['green', '建铁线863', '解放变'] };
            }; break;
        case '03-220kV瑙ｆ斁鍙10kV瀵岃儨1鍙风嚎864':
            {
                { return ['green', '富盛1号线864', '解放变'] };
            }; break;
        case '03-220kV瑙ｆ斁鍙10kV鏁﹀寲鍧婄嚎867':
            {
                { return ['green', '敦化坊线867', '解放变'] };
            }; break;
        case '03-110kV鍩庡寳鍙10kV鏅嬩笢1鍙风嚎808':
            {
                { return ['green', '晋东1号线808', '城北变'] };
            }; break;
        case '03-220kV瑙ｆ斁鍙10kV瑗挎锭娌崇嚎877':
            {
                { return ['green', '西涧河线877', '解放变'] };
            }; break;
        case '03-220kV瑙ｆ斁鍙10kV涓囧紑2鍙风嚎855':
            {
                { return ['green', '万开2号线855', '解放变'] };
            }; break;
        case '03-110kV鍩庡寳鍙10kV鍖楀紑绾809':
            {
                { return ['green', '北开线809', '城北线'] };
            }; break;
        case '03-220kV瑙ｆ斁鍙10kV瀵岃儨2鍙风嚎868':
            {
                { return ['green', '富盛2号线', '解放变'] };
            }; break;
        case '03-110kV鍩庡寳鍙10kV妫鏋楃嚎812':
            {
                { return ['green', '森林线812', '城北变'] };
            }; break;
        case '03-110kV鍩庡寳鍙10kV鑳屽湭娲炵嚎835':
            {
                { return ['green', '背圪洞线835', '城北变'] };
            }; break;
        case '03-110kV鍩庡寳鍙10kV涓滈儕绾814':
            {
                { return ['green', '东郊线814', '城北变'] };
            }; break;
        case '03-110kV鍩庡寳鍙10kV涓滆仈绾825':
            {
                { return ['green', '东联线825', '城北变'] };
            }; break;
        case '03-110kV鍩庡寳鍙10kV涓滆矾绾815':
            {
                { return ['green', '东路线815', '城北变'] };
            }; break;
        case '03-110kV鍩庡寳鍙10kV鍖楃幆绾817':
            {
                { return ['green', '北环线817', '城北变'] };
            }; break;
        case '03-110kV鍩庡寳鍙10kV鏂板煄绾837':
            {
                { return ['green', '新城线837', '城北变'] };
            }; break;
        case '03-110kV鍩庡寳鍙10kV鏂板紑2鍙风嚎831':
            {
                { return ['green', '新开2号线831', '城北变'] };
            }; break;
        case '03-110kV鍩庡寳鍙10kV鑳滃埄绾818':
            {
                { return ['green', '胜利线818', '城北变'] };
            }; break;
        case '03-110kV鏌虫邯鍙10kV榫欐江鍖楃嚎744':
            {
                { return ['green', '龙潭北线744', '柳溪变'] };
            }; break;
        case '03-110kV鏌虫邯鍙10kV涓囧紑1鍙风嚎711':
            {
                { return ['green', '万开1号线711', '柳溪变'] };
            }; break;
        case '03-110kV鏌虫邯鍙10kV鍒氬牥绾722':
            {
                { return ['green', '刚堰线722', '柳溪变'] };
            }; break;
        case '03-110kV鏌虫邯鍙10kV闈掑勾瀹2鍙风嚎731':
            {
                { return ['green', '青年宫2号线731', '柳溪变'] };
            }; break;
        case '03-110kV鍩庤タ绔10kV閲戝垰绾983':
            {
                { return ['green', '金刚线983', '城西站'] };
            }; break;
        case '03-110kV鏌虫邯鍙10kV妗冧笢绾719':
            {
                { return ['green', '桃东线719', '柳溪变'] };
            }; break;
        case '03-110kV鏌虫邯鍙10kV鏌冲紑1鍙风嚎714':
            {
                { return ['green', '柳开1号线714', '柳溪变'] };
            }; break;
        case '03-110kV鏌虫邯鍙10kV鏌冲紑2鍙风嚎732':
            {
                { return ['green', '柳开2号线732', '柳溪变'] };
            }; break;
        case '03-110kV鏌虫邯鍙10kV涓囧紑3鍙风嚎723':
            {
                { return ['green', '万开3号线723', '柳溪变'] };
            }; break;
        case '03-110kV鏌虫邯鍙10kV涓囧紑4鍙风嚎737':
            {
                { return ['green', '万开4号线737', '柳溪变'] };
            }; break;
        case '03-110kV鏌虫邯鍙10kV鏂板寳鍙ｇ嚎721':
            {
                { return ['green', '新北口线721', '柳溪变'] };
            }; break;
        case '03-110kV璁镐笢鍙10kV澶鍫＄嚎513':
            {
                { return ['green', '太堡线513', '许东变'] };
            }; break;
        case '03-110kV鏉忚姳宀绔10kV涓滃煄绾':
            {
                { return ['green', '东城线', '杏花岭站'] };
            }; break;
        case '03-110kV鏉忚姳宀绔10kV骞蹭紤绾':
            {
                { return ['green', '干休线', '杏花岭站'] };
            }; break;
        case '03-110kV鏉忚姳宀绔10kV鏁欏満绾':
            {
                { return ['green', '教场线', '杏花岭站'] };
            }; break;
        case '03-110kV鏉忚姳宀绔10kV榛勮皟绾':
            {
                { return ['green', '黄调线', '杏花岭站'] };
            }; break;
        case '03-110kV鏉忚姳宀绔10kV涓夊欑嚎':
            {
                { return ['green', '三强线', '杏花岭站'] };
            }; break;
        case '03-110kV鏉忚姳宀绔10kV鐪佽皟2鍙风嚎':
            {
                { return ['green', '省调2号线', '杏花岭站'] };
            }; break;
        case '03-110kV鏉忚姳宀绔10kV鏂版皯绾':
            {
                { return ['green', '新民线', '杏花岭站'] };
            }; break;
        case '03-110kV閾滈敚婀惧彉10kV绮捐惀绾517':
            {
                { return ['green', '精营线517', '铜锣湾变'] };
            }; break;
        case '03-110kV閾滈敚婀惧彉10kV涓婇┈绾525':
            {
                { return ['green', '上马线525', '铜锣湾变'] };
            }; break;
        case '03-110kV閾滈敚婀惧彉10kV閾滀笂2绾537':
            {
                { return ['green', '铜上2线537', '铜锣湾变'] };
            }; break;
        case '03-110kV鍩庤タ绔10kV鍧濋櫟绾987':
            {
                { return ['green', '坝陵线987', '城西站'] };
            }; break;
        case '03-110kV鍩庤タ绔10kV鍩庡潑绾989':
            {
                { return ['green', '城坊线989', '城西站'] };
            }; break;
        case '03-110kV鍩庤タ绔10kV闈掑勾瀹1鍙风嚎998':
            {
                { return ['green', '青年宫1号线998', '城西站'] };
            }; break;
        case '03-110kV鍩庡寳鍙10kV鍖楁満绾829':
            {
                { return ['green', '北机线829', '城北变'] };
            }; break;
        case '03-220kV瑙ｆ斁鍙10kV鍩庡寳绾871':
            {
                {
                    return ['green', '城北线871', '解放变'];
                };
            }; break;
        case '03-110kV鍩庡寳鍙10kV鍚嶉兘1#绾836':
            {
                { return ['green', '名都1#线836', '城北变'] };
            }; break;
        case '03-110KV璧靛簞绔10KV杩庡紑绾':
            {
                { return ['green', '迎开线', '赵庄站'] };
            }; break;
        case '03-110KV璧靛簞绔10KV鍗楀浐绾垮囩敤':
            {
                { return ['green', '南固线备用', '赵庄站'] };
            }; break;
        case '03-110KV璧靛簞绔10KV澶у悓绾':
            {
                { return ['green', '大同线', '赵庄站'] };
            }; break;
        case '03-110KV璧靛簞鍙10KV娓呮咕绾垮囩敤':
            {
                { return ['green', '清湾站备用', '赵庄站'] };
            }; break;
        case '03-110KV璧靛簞绔10KV榫欏悍绾':
            {
                { return ['green', '龙康线', '赵庄站'] };
            }; break;
        case '03-110KV璧靛簞鍙10KV涓夊崈娓＄嚎':
            {
                { return ['green', '三千渡线', '赵庄站'] };
            }; break;
        case '03-110KV璧靛簞鍙10KV浣虫1':
            {
                { return ['green', '佳欣1', '赵庄站'] };
            }; break;
        case '2018骞存柟妗':
            {
                { return ['green', '2018', '方案'] };
            }; break;
        case '2019骞存柟妗':
            {
                { return ['green', '2019', '方案'] };
            }; break;
        default: { return ['white', '']; }
    }
}

var getColorByStation = function (stationName) {
    switch (stationName) {
        case '赵庄变':
            {
                return 'red';
            }; break;
        case '赵庄站':
            {
                return 'red';
            }; break;
        case '铜锣湾变':
            {
                return 0xFF8000;
            }; break;
        case '杏花岭站':
            {
                return 0x00A600;
            }; break;
        case '杏花岭变':
            {
                return 0x00A600;
            }; break;
        case '城北变':
            {
                return 0xBBFFBB;
            }; break;
        case '城北站':
            {
                return 0xBBFFBB;
            }; break;
        case '城北线':
            {
                return 0xBBFFBB;
            }; break;
        case '广场变':
            {
                return 0x8F4586;
            }; break;
        case '东大站':
            {
                return 0x5A5AAD;
            }; break;
        case '东大变':
            {
                return 0x5A5AAD;
            }; break;
        case '柳溪变':
            {
                return 0xD1E9E9;
            }; break;
        case '柳溪变电站':
            {
                return 0xD1E9E9;
            }; break;
        case '城西站':
            {
                return 0xD9B3B3;
            }; break;
        case '城西变':
            {
                return 0xD9B3B3;
            }; break;
        case '解放变':
            {
                return 0x009393;
            }; break;
        case '东郊站':
            {
                return 0x930000;
            }; break;
        case '许东变':
            {
                return 0x110000;
            }; break;
        default:
            {
                console.log('未设置', stationName);
                return "white";
            }
    };

};

var getShowByStation = function (stationName) {
    switch (stationName) {
        case '铜锣湾变':
            {
                return true;
            }; break;
        case '杏花岭站':
            {
                return true;
            }; break;
        case '杏花岭变':
            {
                return true;
            }; break;
        case '城北变':
            {
                return true;
            }; break;
        case '城北站':
            {
                return true;
            }; break;
        case '城北线':
            {
                return true;
            }; break;

        case '东大站':
            {
                return true;
            }; break;
        case '东大变':
            {
                return true;
            }; break;
        case '柳溪变':
            {
                return true;
            }; break;
        case '柳溪变电站':
            {
                return true;
            }; break;
        case '城西站':
            {
                return true;
            }; break;
        case '城西变':
            {
                return true;
            }; break;
        case '解放变':
            {
                return true;
            }; break;
        default:
            {
                console.log('未设置', stationName);
                return false;
            }
    };

};

var getIndexByStation = function (stationName) {
    switch (stationName) {
        case '铜锣湾变':
            {
                return 3;
            }; break;
        case '杏花岭站':
        case '杏花岭变':
            {
                return 6;
            }; break;
        case '城北变':
        case '城北站':
        case '城北线':
            {
                return 0;
            }; break;

        case '东大站':
        case '东大变':
            {
                return 5;
            }; break;
        case '柳溪变':
        case '柳溪变电站':
            {
                return 2;
            }; break;
        case '城西站':
        case '城西变':
            {
                return 4;
            }; break;
        case '解放变':
            {
                return 1;
            }; break;
        default:
            {
                console.log('未设置序号', stationName);
                throw (stationName);
            }
    };

};

var getXianShunByName = function (name) {
    var chineseToNum = function (c) {
        var val = 0;
        for (var i = 0; i < c.length; i++) {
            if (val == 0)
                val = c.charCodeAt(i);
            else
                val += val * c.charCodeAt(i) + c.charCodeAt(i);
        }
        return val;
    }
    return chineseToNum(name) % 59;
}



