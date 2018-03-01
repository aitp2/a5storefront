//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    
  },
  
  onLoad: function () {
    var that = this;
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
                url: serverurl_api + '/api/wechat-users/code/'+code,
                  data: { 
                  },
                  success: function (res) {
                    wx.setStorageSync("openId", res.data.openId);
                    wx.setStorageSync("wechatUser", res.data)
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
    wx.request({
      method : "GET",
      url: serverurl_api + '/api/wechat-products',
      data:{ 

      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success:function(res){
        var datas = res.data;
        that.setData({
          products : datas,  
          serverurl: serverurl  
        })
      },
      fail:function(res){
        console.log('error:' + res);
      } 
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var serverurl = wx.getStorageSync("serverurl");
    var serverurl_api = wx.getStorageSync("serverurl-api");
    wx.login({
      success: res => {
        var code = res.code;
        console.log(res);
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
    wx.request({
      method: "GET",
      url: serverurl_api + '/api/wechat-products',
      data: {

      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        var datas = res.data;
        that.setData({
          products: datas,
          serverurl: serverurl
        })
      },
      fail: function (res) {
        console.log('error:' + res);
      }
    })
  },
})
  