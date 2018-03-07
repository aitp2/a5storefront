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
    serverurl_api: wx.getStorageSync("serverurl-api"),
    tabs: ["产品列表", "留言信息"],
    activeIndex: 0,
    sliderOffset: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      "productId": options.productId,
      "wechatUserId": options.wechatUserId
    })
    var serverurl = wx.getStorageSync("serverurl");
    var serverurl_api = wx.getStorageSync("serverurl-api");
    var openId = wx.getStorageSync("openId");
    var collectList = wx.getStorageSync("collectList");
    if (collectList) {
      if (collectList.collectProducts) {
        var collectProducts = collectList.collectProducts;
        for (var index = 0; index < collectProducts.length; index++) {
          var product = collectProducts[index];
          if (options.productId == product.id) {
            that.setData({
              "checkCollect": true
            });
            break;
          }
        }
      }
    }
    wx.request({
      method: "GET",
      url: serverurl_api + '/api/wechat-products/' + options.productId,
      data: {
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        var datas = res.data;
        that.setData({
          product: datas
        })
      },
      fail: function (res) {
        console.log('error:' + res);
      }
    }),
      wx.request({
        method: "GET",
        url: serverurl_api + '/api/wechat-products/',
        data: {
        },
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: function (res) {
          var datas = res.data;
          that.setData({
            productList: datas
          })
        },
        fail: function (res) {
          console.log('error:' + res);
        }
      }),
    
    
    wx.request({
        method: "GET",
        url: serverurl_api + '/api/messages/product/' + options.productId,
        data: {
        },
        header: { 'content-type': 'application/json' },
        success: function (res) {
          var datas = res.data;
          console.log(JSON.stringify(datas));
          that.setData({
            questions: datas
          })
        },
        fail: function (res) {
          console.log('error:' + res);
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
  buyProduct: function (e) {
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
            data: {
              'productCode': productCode,
              'userOpenId': openId
            },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
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
    that.collects(that.data.wechatUserId, that.data.productId, 0);
  },
  collects: function (userId, productId, actionType) {
    var that = this;
    var serverurl_api = wx.getStorageSync("serverurl-api");
    wx.request({
      method: "PUT",
      url: serverurl_api + '/api/collect-lists/' + actionType + "/" + userId + "/" + productId,
      data: {},
      header: { 'content-type': 'application/json' },
      success: function (res) {
        wx.setStorageSync("collectList", res.data);
        that.setData({
          checkCollect: actionType == 0
        })
      },
      fail: function (res) {
        console.log('error:' + res);
      }
    })
  },

  removeCollect: function (e) {
    var that = this;
    that.collects(that.data.wechatUserId, that.data.productId, 1);
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