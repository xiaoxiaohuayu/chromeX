const targetPageUrl = 'https://www.baidu.com'
const offscreenCanvas = new OffscreenCanvas(16, 16);
const ctx = offscreenCanvas.getContext('2d');
// 设置初始颜色
let color = 'rgb(255, 0, 0)';
// 定义颜色循环
const colors = ['rgb(255, 0, 0)', 'rgb(255, 128, 0)', 'rgb(255, 255, 0)', 'rgb(0, 255, 0)', 'rgb(0, 0, 255)', 'rgb(128, 0, 128)'];
let colorIndex = 0;
// 绘制函数
function draw() {
    // 清空画布
    ctx.clearRect(0, 0, 16, 16);
    // 绘制霓虹灯效果
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 16, 16);
    // 更新颜色
    colorIndex = (colorIndex + 1) % colors.length;
    color = colors[colorIndex];
    const imageData = ctx.getImageData(0, 0, 16, 16);
    console.log(imageData)
    chrome.action.setIcon({imageData: imageData}, () => { /* ... */ });

}
let tabId = null;
let tempString = ''

chrome.windows.onFocusChanged.addListener((windowId) => {
    // getRegisteredScripts()
    // tabid
    // chrome.tabs.query({},(tab)=>{
    //     tab.map((e)=>{
    //         console.log('tabid',tab,e.url)
    //
    //         if(e.active && e.url && e.url.startsWith(targetPageUrl)){
    //             tabId = e.id
    //         }
    //     })
    // })
});
/**
 * 右击菜单
 * */
chrome.contextMenus.create({
    id: "collection",
    title: "添加到小记",
    contexts: ["all"]
});
chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === "collection") {
        // 处理菜单项点击事件
        console.log("菜单项被点击了",tempString);
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            console.log(tabs)
            chrome.tabs.sendMessage(
                tabs[0].id,
                {menuItemId:info.menuItemId },
                function(response) {
                console.log(response);
            });
        });
    }
});
async function fetchStorageData() {
    const items = await chrome.storage.local.get(null);
    console.log('All items in chrome.storage.local:');
    console.log(items);
}
/**
 * 监听消息
 * */
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log('监听到消息')
    if (message.action === 'saveText') {
        console.log('消息内容',message)
        const {key:keys,text} = message.data || {}
        const storage = {}
        storage[keys] = text
        chrome.storage.local.set(storage).then(() => {
            sendResponse({message:'我已经存进去了'})
        });
        fetchStorageData()
    }
    return true; // 保证异步回调能够被调用
});
chrome.storage.local.get(null, function(data) {
    console.log('Local 存储数据:', data);
});
chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
        text: "🐒",
    });
    chrome.action.setBadgeBackgroundColor(
        {color: '#ffffff'},  // Green
        () => { /* ... */ },
    );
    // 开始动画
    // setInterval(()=>{
    //     draw();
    // },1000)
});
/**
* 注册
* */
const registerScripts = () =>{
    console.log('开始注册css-js')
    chrome.scripting.registerContentScripts(
        [
            {
                allFrames: true,
                id:'hao-script',
                css:['index.css'],
                // js: ['bg.js','./scripts/Sortable.js','./scripts/gg.js'],
                runAt:"document_idle",// https://developer.chrome.com/docs/extensions/reference/api/extensionTypes?hl=zh-cn#type-RunAt
                matches: ["https://*.baidu.com/*"]
            }
        ],
        (registerResult)=>{
            console.log(registerResult)
        }
    )
}
/**
* 获取注册的脚本
* */
const getRegisteredScripts = () =>{
    chrome.scripting.getRegisteredContentScripts(
        {},
        (getReg)=>{
            console.log('获取注册的脚本成功',getReg)
        }
    )
}
/**
 * 移除注入的脚本
 * */
const removeScripts = () =>{
    chrome.scripting.unregisterContentScripts(
        {
            css:['index.css'],
            allFrames: true,
            runAt:"document_start"
        },
        (remove)=>{
            console.log('移除脚本成功',remove)
        }
    )
}
registerScripts()

/**
* 如果扩展程序操作指定了在用户点击当前标签页时显示的弹出式窗口，则不会发送 action.onClicked 事件
* */
chrome.action.onClicked.addListener(async (tab) => {
    // draw();
    return;
    if (tab.url.startsWith(targetPageUrl)) {
        const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
        const nextState = prevState === '🐒' ? '👌🏻' : '🐒'
        await chrome.action.setBadgeText({
            tabId: tab.id,
            text: nextState,
        });
        if(nextState ==='👌🏻'){
            await chrome.scripting.insertCSS({
                files: ["index.css"],
                target: { tabId: tab.id,allFrames : true, },
            });
            await chrome.scripting
                .executeScript({
                    target : {tabId : tab.id,allFrames : true,},
                    files : [ "bg.js" ],
                })
                .then(() => {
                    console.log("js 注入成功")
                    setTimeout(()=>{
                        console.log('开始删除css')
                        removeScripts()
                    })
                });
        }else {
            await chrome.scripting.removeCSS({
                files: ["index.css"],
                target: { tabId: tab.id,allFrames : true, },
            });
        }

    }
});
