const hotList = document.querySelector("#hotsearch-content-wrapper");
if(hotList){
    const hotText = [];
    // 循环获取hotList中的li标签中的span 文本
    const spans = hotList.querySelectorAll("li span");
    spans.forEach(span => {
        console.log(span.innerText);
        hotText.push(span.innerText);
    });
    // 创建div元素 将 hotText中的文本添加到div元素中 最后将div元素添加到body中
    let divText = document.getElementById('hotText');
    if(!divText){
        divText = document.createElement("div");
    }
    divText.innerText = hotText.join("-");
    divText.id = "hotText";
    divText.style.position = "fixed";
    divText.style.top = "0";
    divText.style.right = "0";
    divText.style.zIndex = '999'
    document.body.appendChild(divText);
}
