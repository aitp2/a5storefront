// pages/updateProduct/updateProduct.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    files: [],
    serverurl_api: wx.getStorageSync("serverurl-api"),
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

  name: function (e) {
    var that = this;
    that.setData({
      name: e.detail.value
    })
  },
  description: function (e) {
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
  platformProduct: function (e) {
    var that = this;
    that.setData({
      platformProduct: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({
      productId:options.id
    });

    wx.request({
      method: "GET",
      url: that.data.serverurl_api + '/api/wechat-products/' + that.data.productId,
      data: {
      },
      header: { 'content-type': 'application/json' },
      success: function (res) {
        var datas = res.data;        
        that.setData({
          product: datas
        })
      },
      fail: function (res) {
        console.log('error:' + res);
      }
    });

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

  uploadProduct: function (e) {
    var that = this;
    var wechatUserId = wx.getStorageSync("wechatUser").id;
    var serverurl = wx.getStorageSync("serverurl");
    var serverurl_api = wx.getStorageSync("serverurl-api");

    var name = that.data.name;
    if(!!!name){
      name = that.data.product.productName;
    }
    var description = that.data.description;
    if (!!!description){
      description = that.data.product.metaDesc
    }
    var originalPrice = that.data.originalPrice;
    if (!!!originalPrice) {
      originalPrice = that.data.product.originalPrice
    }
    var price = that.data.price;
    if (!!!price) {
      price = that.data.product.price
    }
    var platformProduct = that.data.platformProduct;
    if (!!!platformProduct) {
      platformProduct = that.data.product.platformProduct
    }

    wx.request({
      method: 'PUT',
      url: serverurl_api + '/api/wechat-products',
      data: {
        'id': that.data.productId,
        'goLive': that.data.product.goLive,  
        'wechatUserId': wechatUserId,
        'productName': name,
        'productCode': name,
        'metaDesc': description,
        'originalPrice': originalPrice,
        'price': price,
        'platformProduct': platformProduct
      },
      header: { 'content-type': 'application/json' },
      success: function (res) {
        wx.showToast({
          title: '宝贝更新成功',
          image: '../images/success.png',
          duration: 1000
        })

        wx.redirectTo({
          url: '../releasedProducts/releasedProducts',
        })

        // that.data.files.forEach(function (value, index, array) {
        //   that.uploadProductImages(res.data.id, value);
        //   if (index + 1 == array.length) {

        //   }
        // })

      }
    })
  },
  uploadProductImages: function (productId, image) {
    var serverurl_api = wx.getStorageSync("serverurl-api");
    wx.uploadFile({
      url: serverurl_api + '/api/wechat-product-images/upload',
      filePath: image,
      name: 'file',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      formData: {
        "productId": productId
      },
      success: function (res) {
        console.log(res.data);
      },
      fail: function (res) {
        console.log(res);
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