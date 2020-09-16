// 带了js的就说明是static/js/listen.js中的值

const script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.setAttribute('src', chrome.extension.getURL('static/js/listen.js'));
document.documentElement.appendChild(script);

chrome.runtime.onMessage.addListener((msg, sender, res) => {
  /**
   * target { string } 判断message的方向 有content background
   * type { string } 目前是定值 只有copyWrite
   * status { boolean } 开启or关闭copy
   * copyTarget { string } 复制路径
   * defaultData { string } 默认值
   */
  let { target, type, status, copyTarget, defaultData } = msg;
  if (target === 'content' && type === 'copyWrite') {
    // 如果status是true 说明开启拷贝
    postMessage(msg);
    res({ success: true });
  }
});
