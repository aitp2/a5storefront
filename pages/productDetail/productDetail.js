// pages/productDetail/productDetail.js
Page({

  onShareAppMessage: function () {
    return {
      title: '产品分享',
      desc: '',
      path: '/page/productDetail?id=123'
    }
  },

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["产品列表", "留言信息"],
    activeIndex: 0,
    sliderOffset: 1    
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var serverurl = wx.getStorageSync("serverurl"); 
    var openId = wx.getStorageSync("openId");
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
          serverurl: serverurl,
        })
      },
      fail: function (res) {
        console.log('error:' + res);
      }
    }),
    wx.request({
      method: "POST",
      url: serverurl + '/checkCollector',
      data: {
        'openId': openId,
        'collectOpenId': options.pOpenid
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        var data = res.data;
        that.setData({
          checkCollect: data
        })
      }
    })

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
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

  addCollect: function (e) {
    var that = this;
    var openId = wx.getStorageSync("openId");
    var productOpenId = e.detail.value.productOpenId;
    var serverurl = wx.getStorageSync("serverurl");
    wx.showModal({
      title: '提示',
      content: '您确定关注卖家吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            method: "POST",
            url: serverurl + '/addCollector',
            data: {
              'openId': openId,
              'collectOpenId': productOpenId
            },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
              that.setData({
                checkCollect: true
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  removeCollect: function (e) {
    var that = this;
    var openId = wx.getStorageSync("openId");
    var productOpenId = e.detail.value.productOpenId;
    var serverurl = wx.getStorageSync("serverurl");
    wx.showModal({
      title: '提示',
      content: '您确定取消卖家关注吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            method: "POST",
            url: serverurl + '/removeCollector',
            data: {
              'openId': openId,
              'collectOpenId': productOpenId
            },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
              that.setData({
                checkCollect: false
              })
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