document.getElementById('clear').onclick= function (){
    console.log(chrome,'clear')
    chrome.storage.local.clear(function() {
        console.log('All values are removed');
    });
}
async function fetchStorageData() {
    const items = await chrome.storage.local.get(null);
    console.log('All items in chrome.storage.local:');
    console.log(items);
    for (let itemsKey in items){
        console.log(itemsKey)
        //创建li
        let li = document.createElement('li');
        //创建文本节点
        let text = document.createTextNode(items[itemsKey]);
        console.log(li)
        //添加文本节点到li
        li.appendChild(text);
        //添加li到ul
        document.getElementById('list').appendChild(li);
    }
}
fetchStorageData()
/*  clock */
const hours = document.querySelector('.hours');
const minutes = document.querySelector('.minutes');
const seconds = document.querySelector('.seconds');

/*  rate slider */

clock = () => {
    let today = new Date();
    let h = (today.getHours() % 12) + today.getMinutes() / 59; // 22 % 12 = 10pm
    let m = today.getMinutes(); // 0 - 59
    let s = today.getSeconds(); // 0 - 59

    h *= 30; // 12 * 30 = 360deg
    m *= 6;
    s *= 6; // 60 * 6 = 360deg

    rotation(hours, h);
    rotation(minutes, m);
    rotation(seconds, s);

    // call every second
    setTimeout(clock, 500);
}

rotation = (target, val) => {
    target.style.transform =  `rotate(${val}deg)`;
}

window.onload = clock();



