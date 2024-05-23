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
// const extensions = 'https://www.baidu.com'
//
/*
* 如果扩展程序操作指定了在用户点击当前标签页时显示的弹出式窗口，则不会发送 action.onClicked 事件
* */
chrome.action.onClicked.addListener(async (tab) => {
    console.log("This is a background script!")
    draw();
    console.log(tab.url.startsWith('https://www.baidu.com'))
    if (tab.url.startsWith('https://www.baidu.com')) {
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
        }else {
            await chrome.scripting.removeCSS({
                files: ["index.css"],
                target: { tabId: tab.id,allFrames : true, },
            });
        }

    }
});
