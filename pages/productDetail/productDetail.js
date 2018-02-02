// pages/productDetail/productDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var serverurl = wx.getStorageSync("serverurl"); 
    wx.request({
      method: "POST",
      url: serverurl + '/getProduct',
      data: {
        'productCode': options.productCode
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        var datas = res.data;
        that.setData({
          product: datas,
          serverurl: serverurl
        })
      },
      fail: function (res) {
        console.log('error:' + res);
      }
    })
  },

  buyProduct : function(e){
    var openId = wx.getStorageSync("openId");
    var productCode = e.detail.value.code;
    var serverurl = wx.getStorageSync("serverurl");
    wx.showModal({
      title: '提示',
      content: '您确定购买该产品吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: serverurl + '/placeOrder',
            data : {
              'productCode': productCode,
              'userOpenId': openId
            },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success : function(res){
              setTimeout(function () {
                wx.navigateTo({
                  url: '../orders/orders',
                })
              }, 1000)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
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