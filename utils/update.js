export const getUpdateManger = () => {
  plus.runtime.getProperty(plus.runtime.appid, function (widgetInfo) {
    uni.downloadFile({
      url: `https://s.snmi.cn/utils/mapp?version=${widgetInfo.version}&name=${widgetInfo.name}&versionCode=${widgetInfo.versionCode}&appid=${plus.runtime.appid}`,
      sslVerify: false,
      success: downloadResult => {
        uni.showLoading({
          title: "更新中...",
        });
        if (downloadResult.statusCode === 200) {
          uni.hideLoading();
          uni.saveFile({
            tempFilePath: downloadResult.tempFilePath,
            success: res => {
              let savedFilePath = res.savedFilePath;
              console.log("保存路径", savedFilePath);
              // #ifdef APP-PLUS
              plus.runtime.install(
                savedFilePath, {
                  force: true,
                },
                function () {
                  console.log("导入成功---");
                  plus.runtime.restart();
                },
                function (e) {
                  console.log("导入失败");
                }
              );
              // #endif
            },
          });
          uni.hideLoading();
        }
      },
      complete: () => {
        uni.hideLoading();
      },
      fail: err => console.log("下载错误"),
    });
  });
};

export const getUserInfo = () => {
  return new Promise((resolve, reject) => {
    // #ifdef APP-PLUS
    uni.onNativeEventReceive((event, data) => {
      if (event === "getUserInfo") {
        if (typeof data === "object") {
          resolve(data);
        } else {
          resolve(new Error("缺少参数"));
        }
      }
    });
    // #endif
  });
};

function S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
export const Guid = () => {
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
}

function guid() {
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
}
export const getInfoFromCenter = (
  appId,
  isOwnTest = false,
  random = "",
  clear = false
) => {
  if (clear) {
    clearStorage(appId);
  }
  return {
    appId,
    channelId: guid(),
    devicedId: guid(),
    userId: guid(),
    hostVersion: "1.0.0",
    packageName: "",
  };
  // return new Promise((resolve, reject) => {
  //     // 开发环境 模拟数据
  //     // 单独打包 模拟数据
  //     if (isOwnTest) {
  //       uni.getStorage({
  //           key: appId + "_userInfo",
  //           success: res => {
  //               resolve(JSON.parse(res.data));
  //           },
  //           fail: () => {
  //               const userInfo = {
  //                   appId,
  //                   channelId: guid(),
  //                   devicedId: guid(),
  //                   userId: guid(),
  //                   hostVersion: "1.0.0",
  //                   packageName: "",
  //               };
  //               uni.setStorage({
  //                   key: appId + "_userInfo",
  //                   data: JSON.stringify(userInfo),
  //               });
  //               resolve(userInfo);
  //           },
  //       });
  //   }
  //   // 接入中台
  //   if (!isOwnTest) {
  //       uni.sendNativeEvent("getInfoFromCenter", {}, ret => {
  //           ret.appId = appId;
  //           resolve(ret);
  //       });
  //   }
  // });
};
export const clearStorage = appId => {
  uni.clearStorage(appId + "_userInfo");
};

export const getManageInfo = data => {
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV === "development") {
      // #ifdef APP-PLUS
      let detail = getApp().globalData.appInfo;
      let appInfo = {
        version: detail.version,
        name: detail.unAppName,
        versionCode: detail.versionCode,
      };
      let info = {
        ...data,
        ...appInfo,
      };
      resolve(info);
      // #endif
      // #ifdef H5
      let detail = getApp().globalData.appInfo;
      let appInfo = {
        version: detail.version,
        name: detail.unAppName,
        versionCode: detail.versionCode,
      };
      let info = {
        ...data,
        ...appInfo,
      };
      resolve(info);
      // #endif
    } else {
      let detail = getApp().globalData.appInfo;
      let appInfo = {
        version: detail.version,
        name: detail.unAppName,
        versionCode: detail.versionCode,
      };
      let info = {
        ...data,
        ...appInfo,
      };
      resolve(info);
    }
    if (data === {}) {
      reject("缺少参数");
    }
  });
};
export const getData = data => {
  return new Promise(async (resolve, reject) => {
    let res = await getInfoFromCenter(data.appId);
    let r = await getManageInfo(res);
    let info = {
      method: data.method,
      devicedId: r.devicedId,
      userId: r.userId,
      packageName: r.packageName,
      carrier: {
        channelId: r.channelId,
        hostVersion: r.hostVersion,
      },
      miniprogram: {
        appId: r.appId,
        name: r.name,
        version: r.version,
      },
      other: data.other || [],
      channelName: "随记",
    };
    resolve(info);
  });
};
export const setManageInfo = data => {
  // #ifdef APP-PLUS
  data.appId = plus.runtime.appid;
  // #endif
  getData(data)
    .then(res => {
      // console.log(res);
      uni.request({
        // #ifdef APP-PLUS
        url: "https://l.h5120.com/te/tk/miniprogram",
        // #endif
        // #ifdef H5
        url: "/te/tk/miniprogram",
        // #endif
        data: {
          ...res,
        },
        sslVerify: false,
        success: res => {
          console.log("请求成功", res);
        },
        fail: err => {
          console.log(err);
        },
      });
    })
    .catch(err => {
      console.log(err);
    });
};
// 判断是否登录
export const judgeLogin = (appId, is = true) => {
  return new Promise((resolve, reject) => {
    // 开发环境
    if (process.env.NODE_ENV === "development") {
      getInfoFromCenter(appId).then(res => {
        if (res.userId === "") {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    }
    if (process.env.NODE_ENV === "production") {
      uni.sendNativeEvent("getInfoFromCenter", {}, ret => {
        if (ret.userId !== "") {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    }
  });
};
// 获取userid
export const getUserId = async (isOwnTest = false) => {
  let res = await getInfoFromCenter(getApp().globalData.appId, isOwnTest);
  return await {
    userId: res.userId,
    channelId: res.channelId
  };
};

// 返回 uni程序信息
export const getMiniProgramInfo = () => {
  return new Promise((r, j) => {
    plus.runtime.getProperty(plus.runtime.appid, function (widgetInfo) {
      r({
        appId: plus.runtime.appid,
        name: widgetInfo.name,
        version: widgetInfo.version,
        versionCode: widgetInfo.versionCode,
      });
    });
  });
};

// 打点
export const management = async method => {
  // 获取宿主信息
  try {
    let {
      devicedId,
      channelId,
      userId,
      hostVersion,
      packageName
    } =
    await getInfoFromCenter();

    let uniAppInfo = await getMiniProgramInfo();
    console.log(method);
    let obj = await {
      devicedId: devicedId, // 设备id
      method: method ? method[0] : "", // 打点名
      userId: userId, // 用户id
      miniprogram: {
        ...uniAppInfo
      }, // 小程序信息
      other: method[1] ? [...method].splice(1) : [], // 携带信息
      channelName: "", // 渠道名
      carrier: {
        channelId: channelId ? channelId : "M9", // 宿主版本
        hostVersion: hostVersion ? hostVersion : plus.runtime.version, // 宿主版本信息
      },
      packageName: packageName ? packageName : "", // 宿主包名
    };
    /* let obj = await {
        devicedId: devicedId, // 设备id
        method: method ? method[0] : "", // 打点名
        userId: userId, // 用户id
        miniprogram: { ...uniAppInfo }, // 小程序信息
        other: method[1] ? [...method].splice(1) : [], // 携带信息
        channelName: "", // 渠道名
        carrier: {
            channelId: channelId ? channelId : "M9", // 宿主版本
            hostVersion: hostVersion ? hostVersion : plus.runtime.version, // 宿主版本信息
        },
        packageName: packageName ? packageName : "", // 宿主包名
    }; */
    uni.request({
      url: "https://l.h5120.com/te/tk/miniprogram",
      data: await obj,
      sslVerify: false,
      success: res => {
        console.log("请求成功", obj);
      },
      fail: err => {
        console.log(err);
      },
    });
  } catch (e) {
    uni.showToast({
      title: e,
      icon: "success",
      mask: true,
    });
    //TODO handle the exception
  }
};