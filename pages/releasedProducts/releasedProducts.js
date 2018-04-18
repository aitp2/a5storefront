// pages/releasedProduts/releasedProducts.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverurl_api: wx.getStorageSync("serverurl-api"),
    serverurl_img: wx.getStorageSync("serverurl-img"),
    'windowHeight': wx.getStorageSync('windowHeight'),
    products: [] 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var user = wx.getStorageSync("wechatUser");
    that.setData({
      user: user
    });
    that.load_mine_products(0);
  },

  load_mine_products: function (page) {
    var that = this;
    wx.request({
      url: that.data.serverurl_api + '/api/wechat-products/mine/' + that.data.user.id + '?page=' + page + '&size=6',
      data: {
      },
      header: { 'content-type': 'application/json' },
      success: function (res) {
        var dataList = that.data.products;
        var pageList = res.data;
        if (!!pageList && pageList.length != 0) {
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

  update_product: function (event) {
    var that = this;
    console.log(event);
    wx.redirectTo({
      url: '../updateProduct/updateProduct?id=' + event.currentTarget.dataset.productid,
    })
  },

  update_goLive: function (event) {
    var that = this;
    console.log(event);
    var product = event.currentTarget.dataset.product;
    var goLive = event.currentTarget.dataset.golive;

    wx.request({
      method: 'PUT',
      url: that.data.serverurl_api + '/api/wechat-products',
      data: {
        'id': product.id,
        'goLive': goLive,
        'wechatUserId': product.wechatUserId,
        'productName': product.productName,
        'productCode': product.productCode,
        'metaDesc': product.metaDesc,
        'originalPrice': product.originalPrice,
        'price': product.price,
        'platformProduct': product.platformProduct
      },
      header: { 'content-type': 'application/json' },
      success: function (res) {
        that.setData({
          products: []
        });
        that.load_mine_products(0);
        var message = "产品已下架";
        if (goLive == 'true') {
          message = "产品已上架";
        }
        wx.showToast({
          title: message,
          icon: 'success',
          duration: 3000
        });
      }
    })
  },

  loadNextPageProducts: function (e) {
    var that = this;
    console.log(e)
    if (parseInt(that.data.currentPage) + 1 < parseInt(that.data.totalPage)) {
      that.load_mine_products(parseInt(that.data.currentPage) + 1);
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