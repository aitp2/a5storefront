// pages/productDetail/productDetail.js
const app = getApp()
Page({

  /**
 * 页面的初始数据
 */
  data: {
    serverurl_api: wx.getStorageSync("serverurl-api"),
    productList:[],
    tabs: ["产品详情", "留言信息"],
    activeIndex: 0,
    sliderOffset: 1,
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    disabledBuy: false
  },

  load_message_list: function () {
    var that = this;
    wx.request({
      method: "GET",
      url: that.data.serverurl_api + '/api/messages/product/' + that.data.productId,
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
  },
  
  load_relatGoodsList: function (page,wechatUserId){
    if (!!wechatUserId){
      var that = this;
      wx.request({
        method: "GET",
        url: that.data.serverurl_api + '/api/wechat-products/user/' + wechatUserId + '?page=' + page + '&size=6',
        data: {
        },
        header: { 'content-type': 'application/json' },
        success: function (res) {
          var dataList = that.data.productList;
          var pageList = res.data;
          if (!!pageList && pageList.length != 0) {
            for (var i = 0; i < pageList.length; i++) {
              dataList.push(pageList[i]);
            }
          }     
          that.setData({
            productList: dataList,
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
      });
    }
  },

  loadNextPageProducts: function (e) {
    var that = this;
    console.log(e)
    if (parseInt(that.data.currentPage) + 1 < parseInt(that.data.totalPage)) {
      that.load_relatGoodsList(parseInt(that.data.currentPage) + 1, that.data.wechatUserId);
    }
  },

  message_content: function (e) {
    var that = this;
    that.setData({
      messageContent: e.detail.value
    })
  },
  reply_question: function (event) {
    var that = this;
    console.log(event);
    that.setData({
      "curentQuestionId": event.currentTarget.dataset.questionid
    })
  },
  reply_answer: function (event) {
    var that = this;
    console.log(event);
    that.setData({
      "curentQuestionId": event.currentTarget.dataset.questionid
    })
  },
  submitMessageForm: function (e) {
    var that = this;
    var postData = {
      'content': that.data.messageContent,
      'userId': that.data.wechatUserId,
      'icon': that.data.userInfo.avatarUrl,
      'relateTo': that.data.productId
    };
    if (!!that.data.curentQuestionId) {
      postData = {
        'content': that.data.messageContent,
        'userId': that.data.wechatUserId,
        'icon': that.data.userInfo.avatarUrl,
        'questionId': that.data.curentQuestionId
      };
    }
    wx.request({
      method: 'POST',
      url: that.data.serverurl_api + '/api/messages',
      data: postData,
      header: { 'content-type': 'application/json' },
      success: function (res) {
        that.setData({
          'curentQuestionId': '',
          'messageContent':''
        });
        wx.showToast({
          title: '留言成功',
          image: '../../images/success.png',
          duration: 1000
        });
        that.load_message_list();
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      "productId": options.productId,
      "wechatUserId": wx.getStorageSync("wechatUser").id,
      "salerId": options.wechatUserId,
       userInfo: app.globalData.userInfo
    });
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
      url: that.data.serverurl_api + '/api/wechat-products/' + that.data.productId,
      data: {
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        var datas = res.data;
        that.load_relatGoodsList(0,datas.wechatUserId);
        that.setData({
          product: datas,
          'wechatUserId': datas.wechatUserId
        })
      },
      fail: function (res) {
        console.log('error:' + res);
      }
    });

    that.load_message_list();    

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - res.windowWidth /2) / 2,
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
    var that = this;

    var productCode = e.detail.value.code;
    var serverurl_api = wx.getStorageSync("serverurl-api");
    wx.showModal({
      title: '提示',
      content: '您确定购买该产品吗？',
      success: function (res) {
        that.setData({
          disabledBuy:true
        });
        if (res.confirm) {
          wx.request({
            method: "POST",
            url: serverurl_api + '/api/wechat-orders',
            data: {
              'orderAmount': that.data.product.price,
              'customerId': wx.getStorageSync("wechatUser").id,
              'salerId': that.data.salerId,
              "wechatOrderItems": [{
                "quantity": 1,
                "price": that.data.product.price,
                "retailPrice": that.data.product.originalPrice,
                "productId": that.data.product.id,
                "productName": that.data.product.productName
              }]
            },
            header: { 'content-type': 'application/json' },
            success: function (res) {  
              wx.navigateTo({
                url: '../orderDetail/orderDetail?orderId=' + res.data.id
              })            
              // setTimeout(function () {                 
              // }, 1000)
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
    return {
      title: '产品分享',
      desc: '',
      path: '/page/productDetail?id=123'
    }
  }
})