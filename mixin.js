let base = "";
// #ifdef H5
base = "/cssnmi";
// #endif
// #ifdef APP-PLUS
base = "https://campaign.snmi.cn/cssnmi";
// #endif
import {
  getInfoFromCenter
} from './utils/update.js'
const mixin = {
  data() {
    return {
      token: "",
      uuid: "",
      channel: "com.smsf.recordtrancharacter1",
      select: 1,
      user_name: "请登录",
    }
  },
  onLoad() {
    // #ifdef APP-PLUS
    this.query();
    // #endif
    // #ifdef APP-PLUS
    this.getUUID();
    // this.getToken(); //token
    this._getToken(); //支付token
    // #endif
    let user = getInfoFromCenter({
      appId: plus.runtime.appid,
    })
    // uni.showModal({
    //   title: '提示',
    //   content: user.devicedId,
    //   success: function (res) {
    //     if (res.confirm) {
    //       console.log('用户点击确定');
    //       uni.setClipboardData({
    //         data: user.devicedId,
    //         success: function () {
    //           console.log('success');
    //         }
    //       });
    //     } else if (res.cancel) {
    //       console.log('用户点击取消');
    //     }
    //   }
    // });
  },
  mounted() {



  },
  methods: {
    // 随机用户名
    randomUserName() {
      let name = Guid().split("-").join("").substring(0, 8);
      uni.getStorage({
        key: "user_name",
        success: (res) => {
          this.user_name = res.data;
        },
        fail: () => {
          uni.setStorage({
            key: "user_name",
            data: name,
          });
          this.user_name = name;
        },
      });
    },
    updateData() {
      setTimeout(() => {
        uni.removeStorageSync("order_key");
      }, 200);
    },
    query() {
      // #ifdef APP-PLUS
      uni.onNativeEventReceive(async (event, data) => {
        if (event === "queryOrder") {
          let id = uni.getStorageSync("order_key");
          if (id.length === 0) {
            return;
          }
          if (data == 0) {
            this.updateData();
            this.randomUserName()
            uni.showToast({
              title: "支付成功",
              icon: "success",
              mask: true,
            });
            // management(["支付成功"]);
			let user = '游客用户-' + Math.random().toString(36).substr(2)
			uni.setStorageSync('user_info', {"userName":user,"userHeadImg":"http:\/\/cdnp.h5120.com\/Upload\/502e82e5-395d-47fc-afdd-64b0f977f9ed.png","userIsVip":true});
          } else {
            uni.showToast({
              title: "支付失败",
              icon: "success",
              mask: true,
            });
          }
        }

      });
      // #endif
    },
    async _getToken() {
      try {


        let token = uni.getStorageSync("token");
        // uni.showToast({
        //   title: token,
        //   icon: "none"
        // })
        if (token.length === 0) {
          let user = await getInfoFromCenter({
            appId: plus.runtime.appid,
          });
          uni.request({
            url: "https://cs.snmi.cn/user/deviceRegist",
            method: "POST",
            data: {
              pkgname: 'com.h5huangdaxian',
              deviceId: user.devicedId,
              appVersion: "1.0.0",
            },
            sslVerify: false,
            success: res => {
              if (res.data.Code === 200) {
                uni.setStorage({
                  key: "token",
                  data: res.data.Token,
                  success: result => {
                    // uni.showToast({
                    //   title: "用户注册成功",
                    //   icon: "success",
                    //   mask: true,
                    // });
                  },
                });
              } else {
                uni.showToast({
                  title: "用户注册失败",
                  icon: "none",
                  mask: true,
                });
              }
            },
            fail: error => {},
          });
        }
      } catch (error) {
        uni.showToast({
          title: error + 'token',
          icon: "none"
        })
      }
    },
    pay(payMode) {
      try {
        const channel = this.channel;
        uni.request({
          url: base + "/pay/getprices",
          method: "POST",
          data: {
            channel: channel,
            appVersion: "1.0.0",
            pkgname: channel,
          },
          sslVerify: false,
          success: async res => {
            console.log(payMode);

            
            const goods = res.data["Detail"][this.select];
            // 宿主app内
            // 下单 支付宝
            let token = uni.getStorageSync("token");
            if (payMode === 0) {
              console.log(payMode)
              // management(["下单", "支付宝"]);
              let data = {
                token: token,
                goodsName: goods.goodsName,
                goodsId: goods.goodsId,
                pkgname: 'cn.snmi.pay',
                tradetype: "h5",
                money: goods["priceNow"],
              }
				console.log(data)
              uni.request({
                // #ifdef APP-PLUS
                url: base + "/pay/aliwapvippay",
                // #endif
                method: "POST",

                data: data,
                sslVerify: false,
                success: res => {
                  // 支付宝 测试打印
                  console.log(res);
                  // uni.showToast({
                  //   title: JSON.stringify(res),
                  //   icon:'none',
                  //   duration:10000
                  // })

                  if (res.data.Code === 200) {
                    let orderID = res.data["TradeNo"];
                    uni.setStorage({
                      key: "order_key",
                      data: orderID,
                    });
                    let url =
                      "https://pay.snmi.cn/alipay.html?orderid=" +
                      orderID;
					console.log(url,orderID)
                    uni.sendNativeEvent(
                      "getPayByH5", {
                        url,
                        from: "ali",
                        orderID: orderID
                      },
                      ret => {}
                    );
                  }
                },
                fail: e => {
                  uni.showToast({
                    title: "",
                    icon: "请求支付失败",
                    mask: true,
                  });
                },
              });
            }
            // 微信
            if (payMode === 1) {
              // management(["下单", "微信"]);

              uni.request({
                url: base + "/pay/wxvippay",
                method: "POST",
                data: {
                  token: token,
                  goodsName: goods.goodsName,
                  goodsId: goods.goodsId,
                  pkgname: "com.smsf.watermarkcamera",

                  money: goods["priceNow"],
                  tradetype: "h5",
                },
                sslVerify: false,
                success: res => {
                  // 创建订单成功
                  console.log(res);
                  // uni.showToast({
                  //   title: JSON.stringify(res),
                  //   icon: 'none',
                  //   duration:10000
                  // })
                  if (res.data.Code === 200) {
                    let orderID = res.data["TradeNo"];
                    uni.setStorage({
                      key: "order_key",
                      data: orderID,
                    });
                    let {
                      mweb_url
                    } = JSON.parse(
                      res.data.Detail
                    );
                    let url =
                      mweb_url +
                      "&redirect_url=https%3A%2F%2Fsnmi.cn%2Forder%3Forderid%3D" +
                      orderID;

                    uni.sendNativeEvent(
                      "getPayByH5", {
                        url,
                        from: "wx",
                        orderID: orderID
                      },
                      ret => {}
                    );
                  }
                },
                fail: e => {
                  console.log(e);
                },
              });
            }
          },
          fail: e => {
            console.log(e, "请求失败");
          },
        });
      } catch (error) {
        uni.showToast({
          title: error + '',
          icon: 'none'
        })
      }
    },
    // 初始化本地token
    // getToken() {
    //   uni.getStorage({
    //     key: "access_token",
    //     success: (res) => {
    //       console.log(res.data);
    //       if (new Date().getMonth() !== res.data.month) {
    //         this.requestToken();
    //         return;
    //       }
    //       this.token = res.data.token
    //     },
    //     fail: () => {
    //       this.requestToken();
    //     },
    //   });
    // },
    // 请求token
    requestToken() {
      uni.request({
        url: "https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=5x3KtNf2LoK1n3rYot3xctEQ&client_secret=yp87zda3eQCkaZyYLc3R9UlTwPS30L5O",
        success: (res) => {
          console.log(res.data);
          uni.setStorage({
            key: "access_token",
            data: {
              token: res.data.access_token,
              month: new Date().getMonth(),
            },
            success: function () {
              console.log("success");
            },
          });
          this.token = res.data.access_token
        },
      });
    },
    // 获取uuid
    getUUID() {
      uni.getStorage({
        key: "uuid",
        success: ({
          data
        }) => {

          this.uuid = data;
        },
        fail: () => {
          plus.device.getInfo({
            success: (res) => {
              let uuid = res.uuid.split(",")[0];

              uni.setStorage({
                key: "uuid",
                data: uuid,
                success: function () {
                  console.log("success");
                },
              });
              this.uuid = uuid;
            },
          });
        },
      });
    },
  }
}

export default mixin;