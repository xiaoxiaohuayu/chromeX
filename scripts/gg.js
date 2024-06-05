
let selectedText = '';
// 单击事件
document.addEventListener('click', function(event) {
    // 处理单击事件
    // console.log('处理单击事件', chrome.runtime.getURL('page/extension_page.html'))
});

// 双击事件
document.addEventListener('dblclick', function(event) {
    // 处理双击事件
    console.log('处理双击事件', event)
});
const selectionchangeCallBack = function (){
    // 获取选中的文本内容
    selectedText = window.getSelection().toString();
    // 如果有文本被选中
    if (selectedText.length > 0) {
        console.log('选中的文本:', selectedText);
    }
}
// 监听选区变化事件
document.addEventListener('selectionchange', _.throttle(selectionchangeCallBack,1000));


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log(message); // 后台脚本发送的消息
    const  {menuItemId} = message || {}
    if(menuItemId === "collection"){
        const uuid = window.crypto?.randomUUID()
        let data = {
            uuid,
            key:uuid,
            text:selectedText
        }
        chrome.runtime.sendMessage({ action: 'saveText', data}, function(response) {
            console.log(response.message);
        });
    }
    sendResponse({message:'开始保存'})
});

// 鼠标滚轮事件
document.addEventListener('wheel', function(event) {
    // 获取滚轮滚动方向
    let deltaY = event.deltaY;
    // 处理滚轮滚动
});
// 右键菜单事件
// document.addEventListener('contextmenu', function(event) {
//     event.preventDefault(); // 阻止默认右键菜单
// });
