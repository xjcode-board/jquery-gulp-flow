function loading() {
  index = toast.show({
    type: 'loading',
    shade: true
  })
}

function hideLoading() {
  toast.hide(index);
}

function sortCard(a, b) {
  return a.FItemId - b.FItemId;
}

function showToast(content) {
  toast.show({
    type: 'text',
    content: content
  })
}

function errorToast() {
  showToast("网络异常，请稍后重试")
}

function format(i) {
  return (i / 100).toFixed(0);
}

function getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
  var r = window.location.search.substr(1).match(reg); //匹配目标参数
  if (r != null)
    return unescape(r[2]);
  return ''; //返回参数值
}