// pages/releasedProduts/releasedProducts.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverurl_api: wx.getStorageSync("serverurl-api")    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var user = wx.getStorageSync("wechatUser");
    wx.request({
      url: that.data.serverurl_api + '/api/wechat-products/user/' + user.id,
      data: {        
      },
      header: { 'content-type': 'application/json' },
      success: function (res) {
        var datas = res.data;
        that.setData({
          products: datas          
        })
      },
      fail: function (res) {
        console.log('error:' + res);
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})