// pages/upload/upload.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    files: []
  },

  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },

  name:function(e){
      var that=this;
      that.setData({
        name: e.detail.value
      })
  },
  description:function(e){
    var that = this;
    that.setData({
      description: e.detail.value
    })
  },
  originalPrice: function (e) {
    var that = this;
    that.setData({
      originalPrice: e.detail.value
    })
  },
  price: function (e) {
    var that = this;
    that.setData({
      price: e.detail.value
    })
  },
  platformKeeping: function (e) {
    var that = this;
    that.setData({
      platformKeeping: e.detail.value
    })
  },
  image : function(e){
    var that = this;
    that.setData({
      image: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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

  uploadFormImg:function(){
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          image: tempFilePaths[0]
        })
      },
    })
  },

  uploadProduct:function(e){
    var that = this;
    var openId = wx.getStorageSync("openId");
    var serverurl = wx.getStorageSync("serverurl");
    var image = that.data.image;
    var name = that.data.name;
    var description = that.data.description;
    var originalPrice = that.data.originalPrice;
    var price = that.data.price;
    var platformKeeping = that.data.platformKeeping ? that.data.platformKeeping : true;
    wx.uploadFile({
      url: serverurl + '/upload/picture',
      filePath: image,
      name: 'file',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      formData:{
      },
      success: function(res){
        console.log(res.data);
      },
      fail:function(res){
        console.log(res);
      }
    })
    wx.request({
      method: 'POST',
      url: serverurl + '/releaseProduct',
      data: {
        'image': image,
        'name':name,
        'description': description,
        'originalPrice':originalPrice,
        'price':price,
        'platformKeeping': platformKeeping,
        'openId': openId
      },
      header:{'content-type':'application/x-www-form-urlencoded'},
      success:function(res){
        wx.showToast({
          title: '宝贝发布成功',
          image: '../images/success.png',
          duration: 1000
        })
        setTimeout(function(){
          that.setData({
            'image': '',
            'name': '',
            'description': '',
            'originalPrice': '',
            'price': '',
            'platformKeeping': '',
          })
          var page = getCurrentPages().pop();
          if (page == undefined || page == null) {
            return;
          }
          page.onLoad();
        }, 1000)
      }
    })
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