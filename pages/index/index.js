//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    serverurl_api: wx.getStorageSync("serverurl-api"),
    'windowHeight': wx.getStorageSync('windowHeight'),
    products:[]    
  },

  onLoad: function () {
    var that = this;
    that.loadProductList(0);
    wx.login({
      success: res => {
        var code = res.code;
        if (res.code) {
          wx.getUserInfo({
            success: function (e) {
              app.globalData.userInfo = e.userInfo,
                wx.request({
                  method: "PUT",
                  url: that.data.serverurl_api + '/api/wechat-users/code/' + code,
                  data: {
                  },
                  success: function (res) {
                    wx.setStorageSync("openId", res.data.openId);
                    wx.setStorageSync("wechatUser", res.data);
                    that.loadCollectList()
                  }
                })
              that.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
              })
            }
          })
        }
      }
    })
  },

  loadProductList:function(page){
    var that = this;
    wx.request({
      method: "GET",
      url: that.data.serverurl_api + '/api/wechat-products?page=' + page + '&size=6',
      data: {
        "sort": "collectTimes,desc"
      },
      header: { 'content-type': 'application/json' },
      success: function (res) {        
        var dataList = that.data.products;
        var pageList = res.data;
        if (!!pageList && pageList.length!=0){
          for (var i = 0; i < pageList.length; i++) {
            dataList.push(pageList[i]);
          } 
        }           

        that.setData({
          products: dataList,
          'currentPage': res.header.currentpage,
          'totalPage': res.header.totalpage
        })

        if (parseInt(that.data.currentPage) + 1 == parseInt(that.data.totalPage) || parseInt(that.data.totalPage) == 0) {
          wx.showToast({
            title: '已经没有更多了',
            icon: 'success',
            duration: 1000
          });
        }   
      },
      fail: function (res) {
        console.log('error:' + res);
      }
    })
  },

  loadCollectList: function () {
    var serverurl_api = wx.getStorageSync("serverurl-api");
    wx.request({
      method: "GET",
      url: serverurl_api + '/api/collect-lists/mine/' + wx.getStorageSync("wechatUser").id,
      data: {

      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        wx.setStorageSync("collectList", res.data);
      },
      fail: function (res) {
        console.log('error:' + res);
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.setData({
      products: []
    });
    that.loadProductList(0);
    var serverurl = wx.getStorageSync("serverurl");
    var serverurl_api = wx.getStorageSync("serverurl-api");
    wx.login({
      success: res => {
        var code = res.code;
        if (res.code) {
          wx.getUserInfo({
            success: function (e) {
              app.globalData.userInfo = e.userInfo,
                wx.request({
                  method: "PUT",
                  url: serverurl_api + '/api/wechat-users/code/' + code,
                  data: {
                  },
                  success: function (res) {
                    wx.setStorageSync("openId", res.data.openId);
                  }
                })
              that.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
              })
            }
          })
        }
      }
    })
  },

  loadNextPageProducts:function(e){
    var that=this;
    console.log(e)
    if (parseInt(that.data.currentPage)+1 < parseInt(that.data.totalPage)){
      that.loadProductList(parseInt(that.data.currentPage) + 1);
    }    
  }

})
