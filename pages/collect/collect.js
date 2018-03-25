// pages/releasedProduts/releasedProducts.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverurl_api: wx.getStorageSync("serverurl-api"),
    'windowHeight': wx.getStorageSync('windowHeight'),
    products: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;  
    that.load_mine_collect(0);
  },


  load_mine_collect:function(page){
    var that=this;
    wx.request({
      url: that.data.serverurl_api + '/api/collect-lists/mine/' + wx.getStorageSync("wechatUser").id + '?page=' + page + '&size=12',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        var dataList = that.data.products;
        var pageList = res.data.collectProducts;
        if (!!pageList && pageList.length != 0) {
          for (var i = 0; i < pageList.length; i++) {
            dataList.push(pageList[i]);
          }
        }
        var currentPage = 0;   //res.header.currentPage
        var totalPage = 1;  //res.header.totalPage
        that.setData({
          products: dataList,
          'currentPage': currentPage,
          'totalPage': totalPage
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

  loadNextPageProducts: function (e) {
    var that = this;
    console.log(e)
    if (parseInt(that.data.currentPage) + 1 < parseInt(that.data.totalPage)) {
      that.load_mine_collect(parseInt(that.data.currentPage) + 1);
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