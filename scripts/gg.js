
// const el = document.querySelector('#lg')
// const sortable = new Sortable(el)
console.log('gg')

// 单击事件
document.addEventListener('click', function(event) {
    // 处理单击事件
    console.log('处理单击事件', chrome.runtime.getURL('./page/extension_page.html'))
    window.open(chrome.runtime.getURL('./page/extension_page.html'))
});

// 双击事件
document.addEventListener('dblclick', function(event) {
    // 处理双击事件
    console.log('处理双击事件', event)
});
// 监听选区变化事件
document.addEventListener('selectionchange', function() {
    // 获取选中的文本内容
    var selectedText = window.getSelection().toString();

    // 如果有文本被选中
    if (selectedText.length > 0) {
        console.log('选中的文本:', selectedText);
        // 在这里可以执行您需要的操作,如显示工具提示、复制文本等
    }
});
// 鼠标移动事件
// document.addEventListener('mousemove', function(event) {
//     // 获取鼠标当前位置
//     let x = event.clientX;
//     let y = event.clientY;
//     console.log('获取鼠标当前位置', x,y)
// });
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
