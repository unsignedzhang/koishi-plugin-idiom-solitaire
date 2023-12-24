"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.excludeString = exports.extractTextBetweenMarkers = exports.getTextBetweenMarkers = exports.apply = exports.Config = exports.usage = exports.name = void 0;
const koishi_1 = require("koishi");
exports.name = 'idiom-solitaire';
exports.usage = `

发送 [成语接龙 四字成语] 或直接发 [成语接龙] 来开始游戏

注意不要用 一个顶俩 或者 为所欲为 哦~

`;
exports.Config = koishi_1.Schema.object({});
let globalIdiom; //定义全局变量：当前正在接龙的成语
function apply(ctx, config) {
    ctx.command('成语接龙 <message:string>', '发送 成语接龙 开始游戏，后面可以带一个成语来指定以什么开始').alias('/成语接龙').action(async (_, message) => {
        console.log("获取到信息" + message);
        if (message == undefined) { //未指定成语，机器人随机获取一个成语来开始
            const data = await ctx.http.get("https://www.cyjl123.com/");
            var match_lyrics = getTextBetweenMarkers(data, '最近查询的成语接龙', '最近搜索记录');
            if (!match_lyrics?.length)
                return `接口异常，请联系开发者`;
            console.log(match_lyrics);
            var para_lyrics;
            para_lyrics = extractTextBetweenMarkers(match_lyrics, '<span class="block">', '</span>');
            console.log(para_lyrics);
            globalIdiom = getRandomElement(para_lyrics);
            return "成语接龙开始咯，我先来：" + globalIdiom;
        }
        else {
            var idiom = excludeString(message, ' ');
            if (idiom.length !== 4)
                return "请发送[成语接龙 四字成语]或直接发[成语接龙]来开始游戏"; //消息不是四字，提示
            else {
                if (idiom == "为所欲为") {
                    globalIdiom = "为所欲为";
                    return "为所欲为";
                }
                if (idiom == "一个顶俩") {
                    globalIdiom = undefined;
                    return "你杀死了比赛。。";
                }
                const data = await ctx.http.get("https://www.cyjl123.com/api/web/search?keyword=" + idiom);
                if (data.result.redirect) {
                    const data = await ctx.http.get("https://www.cyjl123.com/api/web/detail?word=" + idiom);
                    if (!data.result.candidate.length)
                        return `该成语无可接成语`;
                    const randomIndex = Math.floor(Math.random() * data.result.candidate.length);
                    globalIdiom = data.result.candidate[randomIndex].word;
                    return globalIdiom;
                }
                else
                    return '该成语不存在或无可接成语';
            }
        }
    });
    ctx.middleware(async (session, next) => {
        console.log("获取到信息:" + session.content);
        var idiom = excludeString(excludeString(session.content, '<at id="' + session.selfId + '"/>'), ' ');
        if (idiom.length !== 4)
            return next(); //消息不是四字，不处理
        if (globalIdiom !== undefined) {
            if (isFourChineseCharsWithFirstChar(idiom, globalIdiom[3])) {
                if (idiom == "为所欲为") {
                    globalIdiom = "为所欲为";
                    return "为所欲为";
                }
                if (idiom == "一个顶俩")
                    return "你杀死了比赛。。";
                const data = await ctx.http.get("https://www.cyjl123.com/api/web/search?keyword=" + idiom);
                if (data.result.redirect) {
                    const data = await ctx.http.get("https://www.cyjl123.com/api/web/detail?word=" + idiom);
                    if (!data.result.candidate.length)
                        return `该成语无可接成语`;
                    const randomIndex = Math.floor(Math.random() * data.result.candidate.length);
                    globalIdiom = data.result.candidate[randomIndex].word;
                    return globalIdiom;
                }
                else
                    return '该成语不存在或无可接成语';
            }
            else
                return "当前接龙最后一个字是：" + globalIdiom[3] + ",你接的不对哦";
        }
        else {
            if (idiom == "为所欲为") {
                globalIdiom = "为所欲为";
                return "为所欲为";
            }
            if (idiom == "一个顶俩")
                return "你杀死了比赛。。";
            const data = await ctx.http.get("https://www.cyjl123.com/api/web/search?keyword=" + idiom);
            if (data.result.redirect) {
                const data = await ctx.http.get("https://www.cyjl123.com/api/web/detail?word=" + idiom);
                if (!data.result.candidate.length)
                    return `该成语无可接成语`;
                const randomIndex = Math.floor(Math.random() * data.result.candidate.length);
                globalIdiom = data.result.candidate[randomIndex].word;
                return globalIdiom;
            }
            else
                return '该成语不存在或无可接成语';
        }
    });
}
exports.apply = apply;
function getTextBetweenMarkers(str, marker1, marker2) {
    const index1 = str.indexOf(marker1);
    if (index1 === -1) {
        return null; // 如果找不到第一个标记，返回 null  
    }
    const index2 = str.indexOf(marker2, index1 + marker1.length);
    if (index2 === -1) {
        return null; // 如果找不到第二个标记，返回 null  
    }
    return str.slice(index1 + marker1.length, index2); // 返回两个标记之间的子字符串  
}
exports.getTextBetweenMarkers = getTextBetweenMarkers;
function extractTextBetweenMarkers(str, marker1, marker2) {
    const regex = new RegExp(`${marker1}([\\s\\S]*?)${marker2}`, 'g');
    const matches = str.match(regex);
    return matches ? matches.map(match => match.replace(marker1, '').replace(marker2, '')) : [];
}
exports.extractTextBetweenMarkers = extractTextBetweenMarkers;
function excludeString(mainStr, excludeStr) {
    return mainStr.replace(new RegExp(excludeStr, 'g'), '');
}
exports.excludeString = excludeString;
function getRandomElement(arr) {
    if (arr.length === 0) {
        return '';
    }
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}
function isFourChineseCharsWithFirstChar(text, specifiedChar) {
    // 检查指定字符是否为中文字符  
    const isSpecifiedCharChinese = /[\u4e00-\u9fa5]/.test(specifiedChar);
    if (!isSpecifiedCharChinese) {
        return false;
    }
    // 检查字符串长度是否为4  
    if (text.length !== 4) {
        return false;
    }
    // 检查第1个字符是否与指定字符相同  
    if (text[0] !== specifiedChar) {
        return false;
    }
    // 检查其余字符是否都是中文字符  
    for (let i = 1; i < 4; i++) {
        const charCode = text.charCodeAt(i);
        if (charCode < 0x4e00 || charCode > 0x9fa5) {
            return false;
        }
    }
    // 所有条件都满足，返回 true  
    return true;
}
