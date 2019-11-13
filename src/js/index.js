$(function() {
  $(".pay-btn").on("click", goBuy);
  $(".footer").on("click", function() {
    $('html,body').animate({
      scrollTop: 0
    }, 1000);
  })
  initData();

  function goBuy() {
    var amount = $(this).attr('amount');
    var FItemId = $(this).attr('itemId');
    var IsAllow = $(this).attr('isAllow');
    if (IsAllow == 'false') {
      var text = '您已达到购买上限！';
      showToast(text);
      return;
    }
    if (!FItemId) {
      return;
    }
    var json = {
      "price": amount,
      "FItemId": FItemId
    };
    sessionStorage.setItem('item', JSON.stringify(json));
    window.location.href = 'https://t-h5.lepass.cn/lepos/lepos_activity/mall/order.html?merchant_id=' + merchant_id + '&app_version=' + app_version + "&comeFrom=" + comeFrom + "&session_id=" + session_id + "&user_name=" + user_name;
  }

  function initData() {
    loading();
    $.ajax({
      url: domain + 'merweb/activity/query_goods_detail.do?good_types=46,35,11&sessionid=' + session_id + '&merchant_id=' + merchant_id + '&username =' + user_name,
      dataType: 'json',
      success: function(res) {
        if (res.result == 0) {
          var list = res.list,
            len = list.length,
            htmls = [];
          if (len == 0) {
            return;
          }
          for (var i = 0; i < len; i++) {
            $(".current-price").eq(i).text(list[i].FAmount / 100);
            $(".original-price").eq(i).find("del").text("原价:" + list[i].FBeforeAmount / 100);
            $(".pay-btn").eq(i).attr({
              "amount": list[i].FAmount / 100,
              "itemId": list[i].FItemId,
              "isAllow": list[i].IsAllow
            });
            if (list[i].IsAllow == false) {
              $(".pay-btn").eq(i).addClass("no");
            }
          }
        } else {
          showToast(res.errorMsg);
        }
        hideLoading()
      },
      error: function() {
        hideLoading()
        showToast('网络异常，请稍后重试');
      }
    });
  }
})