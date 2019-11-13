/**
 * [弹出层小工具 剥离出常用的loading和toast]
 * @method  toast.open({OPTIONS})
 * @param  {[WINDOW]} win [description]
 * @return {[OBJECT]} OPTIONS   [{type:'text/loading',content:'文字'}]
 */
! function(win) {
  "use strict";
  var defaultConf = {
      type: 'text',
      content: '',
      shade: false,
      delay: 2
    },
    util = {
      extend: function(a) {
        var b = JSON.parse(JSON.stringify(
          defaultConf))
        for (var c in a) b[c] = a[c];
        return b
      },
      timer: {}
    },
    index = 0,
    parent = function(config) {
      var self = this;
      self.config = util.extend(config);
      self.view()
    };
  var link = document.createElement('link');
  link.id = "toast-m"
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = "https://pic1.leshuazf.com/css/toast-m.css";
  if (document.querySelectorAll('#toast-m').length === 0) {
    document.head.appendChild(link)
  }
  parent.prototype.view = function() {
    var self = this,
      conf = self.config,
      contain = document.createElement('div'),
      html = '';
    this.id = contain.id = 'am-toast-container' + index;
    contain.style = "width:100%;height:100%;";
    if (conf.type === 'loading') {
      if (!conf.content) {
        if (conf.shade) {
          html = '<div class="am-loading-mask"><div class="am-black-loading"></div></div>'
        } else {
          html = '<div class="am-loading-no-mask"><div class="am-loading-wrap"><div class="am-loading"></div></div></div>'
        }
      } else {
        html = '<div class="am-loading-no-mask"><div class="am-toast" role="alert" aria-live="assertive"><div class="am-toast-text"><div class="am-loading-indicator white"><div class="am-loading-item"></div><div class="am-loading-item"></div><div class="am-loading-item"></div></div>' + conf.content + '</div></div></div>'
      }
    } else {
      //默认是text
      html = '<div class="am-toast text a-fadein"><div class="am-toast-text">' + conf.content + '</div></div>'
    }
    contain.innerHTML = html;
    document.body.appendChild(contain);
    self.index = index++;
    self.action(conf)
  }

  parent.prototype.action = function(conf) {
    var self = this;
    if (conf.type === 'text') {
      util.timer[self.index] = setTimeout(function() {
        toast.hide(self.index)
      }, 1e3 * conf.delay)
    }
  }

  win.toast = {
    v: '1.0',
    index: index,
    show: function(conf) {
      var doc = document.querySelectorAll('#am-toast-container' + (index - 1))[0]
      if (doc) {
        if (util.timer[index - 1]) {
          return false
        }
        doc.innerHTML = '';
        document.body.removeChild(doc);
        clearTimeout(util.timer[index]);
        delete util.timer[index];
      }
      var load = new parent(conf || {});
      return load.index;
    },
    hide: function(index) {
      var doc = document.querySelectorAll('#am-toast-container' + index)[0]
      doc.innerHTML = '';
      document.body.removeChild(doc);
      clearTimeout(util.timer[index]);
      delete util.timer[index];
    }
  }
}(window)