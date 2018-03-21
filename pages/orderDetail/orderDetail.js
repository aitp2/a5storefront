// pages/orderDetail/orderDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverurl_api: wx.getStorageSync("serverurl-api"),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    var that = this;
    that.load_orderDetail(options.orderId);
  },

  load_orderDetail:function(orderId){
    var that = this;
    if(!!orderId){
      wx.request({
        method: "GET",
        url: that.data.serverurl_api + '/api/wechat-orders/' + orderId,
        data: {
        },
        header: { 'content-type': 'application/json' },
        success: function (res) {
          console.log(res);
          var data=res.data;                   
          that.setData({
            order_detail: data
          })
        },
        fail: function (res) {
          console.log('error:' + res);
        }
      });
    }
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