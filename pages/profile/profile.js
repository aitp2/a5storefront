// pages/profile/profile.js
const app = getApp()
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
    var openId = wx.getStorageSync("openId");
    var serverurl = wx.getStorageSync("serverurl");
    wx.request({
      method: 'GET',
      url: serverurl + '/getUserInfo',
      data:{
        'openId': openId
      },
      header: { 'content-type': 'application/json' },
      success: function(res){
        var data = res.data;
        that.setData({
          user : data
        })
      },
      fail : function(res){
        console.log('error:' + res);
      }
    }),
    
    this.setData({
      userInfo: app.globalData.userInfo,
      openId: wx.getStorageSync("openId")
    })
  },

  saveUserInfo : function(e){
    var that = this;
    var openId = wx.getStorageSync("openId");
    var serverurl = wx.getStorageSync("serverurl");
    var name = e.detail.value.name;
    var mobileNum = e.detail.value.mobileNum;
    var project = e.detail.value.project;
    var seat = e.detail.value.seat;
    var wechatCode = e.detail.value.wechatCode;
    wx.request({
      method : 'GET',
      url: serverurl + '/updateUserInfo',
      data: {
        'openId': openId,
        'name' : name,
        'mobileNum' : mobileNum,
        'project':project,
        'seat':seat,
        'wechatCode': wechatCode
      },
      header: { 'content-type': 'application/json' },
      success:function(res){
        wx.switchTab({
          url: "../account/account",
        })
      },
      fail : function(res){
        console.log('error :' + res)
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