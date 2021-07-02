<template>
	<view class="list">
		<!-- <view class="user">
			<view class="user-info" @click="fnUserInfoClick()">
				<u-image width="120rpx" height="120rpx" :src="user_info.userHeadImg" mode="aspectFit"></u-image>
				<view class="user-name">
					{{user_info.userName?user_info.userName:'未登录'}}
				</view>
				<view class="user-right">
				</view>
			</view>
			<view class="user-banner">
				<u-image width="690rpx" height="140rpx" src="../../static/banner-1.png" mode=""></u-image>
			</view>
		</view> -->

		<view class="aaa"></view>


		<view class="list_box" @click="open(1)">
			<view>
				<text class="list-title">隐私政策</text>
			</view>
			<view class="right" src="./right.png"></view>
		</view>
		<view class="list_box" @click="open(2)">
			<view>
				<text class="list-title">用户协议</text>
			</view>
			<view class="right" src="./right.png"></view>
		</view>
		<view class="list_box" @click="open(3)">
			<view>
				<text class="list-title">联系客服</text>
			</view>
			<view class="right" src="./right.png"></view>
		</view>
		<view class="" v-show="show">
			<view class="code-show" @click="show = false">

			</view>
			<view class="code-img">
				<save-file :url="qrUrl" @hide="hidePhoto"></save-file>
			</view>
		</view>
		<view class="btn" v-if="JSON.stringify(user_info) !== '{}'" @click="fnRemoveUserClick">
			退出登录
		</view>
	</view>
</template>
<script>
	import savefile from '../../components/savefile/saveFile.vue'
	export default {
		data() {
			return {
				user_info: {},
				user: [],
				show: false,
				appInfo: {},
				subject: '上海顷呈信息技术有限公司',
				qrUrl: require('../../static/code-img.jpg'),
			};
		},
		components: {
			'saveFile':savefile
		},
		onLoad: function(e) {
			// #ifdef APP-PLUS
			plus.runtime.getProperty(plus.runtime.appid, widgetInfo => {
				this.appInfo = JSON.stringify(widgetInfo);
				// this.appInfo = widgetInfo;
			});
			// #endif
		},
		onShow() {
			let user_info = uni.getStorageSync('user_info')
			this.user_info = user_info == '' ? {} : user_info
			// console.log('is userinfo', this.user_info)
			// let user = '游客用户-' + Math.random().toString(36).substr(2)
			// this.user_info.userName = user
			// console.log(user)
		},
		mounted() {
			try {
				uni.onNativeEventReceive((event, data) => {
					// uni.showToast({
					// 	title: '接收到宿主App消息 event：' + event + " data: " + JSON.stringify(data),
					// 	icon: 'none',
					// 	duration: 10000
					// })

					let user = '游客用户-' + Math.random().toString(36).substr(2)
					uni.setStorageSync('user_info', {
						"userName": user,
						"userHeadImg": "http:\/\/cdnp.h5120.com\/Upload\/502e82e5-395d-47fc-afdd-64b0f977f9ed.png",
						"userIsVip": data.userIsVip
					});

				});
			} catch (e) {
				console.log('this Android return User info', e)
			}
		},
		methods: {
			hidePhoto() {
				this.show = false;
			},
			fnUserInfoClick() {
				if (JSON.stringify(this.user_info) == '{}') {
					this.login()
					return
				}
			},
			fnRemoveUserClick() {
				this.user_info = {}
				uni.removeStorageSync('user_info');
			},
			login() {
				try {
					uni.sendNativeEvent("getUserUniLogin", {}, (ret) => {
						// uni.showToast({
						// 	title: JSON.stringify(ret),
						// 	icon: "none",
						// 	duration: 10000,
						// });
					});
				} catch (e) {
					console.log('this Android API login', e)
				}
			},
			open(type) {
				if (type === 1) {
					uni.navigateTo({
						url: "../web/web?url=" +
							`https://campaign.snmi.cn/treaty/privacy/index.html?subject=${this.subject}`,
					});
				}
				if (type === 2) {
					uni.navigateTo({
						url: "../web/web?url=" +
							`https://campaign.snmi.cn/treaty/user/index.html?subject=${this.subject}`,
					});
				}
				if (type === 3) {
					console.log(3)
					this.show = true;
					return
					this.show = true;
					uni.showModal({
						title: "提示",
						content: "客服微信:snmi001",
						cancelText: "复制",
						success: res => {
							if (res.confirm) {
								console.log("用户点击确定");
							} else if (res.cancel) {
								uni.setClipboardData({
									data: "snmi001",
									success: () => {
										uni.showToast({
											title: "复制成功",
											duration: 1000,
										});
									},
								});
							}
						},
					});
				}
			},
			editInfo: function() {
				uni.navigateTo({
					url: "/pages/user-info/index",
				});
			},
			toAnalyze: function() {
				uni.navigateTo({
					url: "/pages/width-analyze/index",
				});
			},
			toWeightRecord: function() {
				uni.navigateTo({
					url: "/pages/width-record/index",
				});
			},
		},
		// onBackPress() {
		// 	// #ifdef APP-PLUS
		// 	uni.sendNativeEvent(
		// 		"exitapp", {
		// 			appId: plus.runtime.appid
		// 		},
		// 		ret => {}
		// 	);
		// 	plus.runtime.quit();
		// 	// #endif
		// 	return true;
		// },
	}
</script>

<style scoped lang="scss">
	.list .list_box {
		padding: 30rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.list .list_box .right {
		width: 48rpx;
		height: 48rpx;
		background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAEnElEQVR4Xu3dfWsTQRAG8N2vo5/Holgpiu8Uc0epIlZpLYpUcWctolZE8Q1fPmMZCbbYpk0zm0vszT5P/xMux848v0w2uXiJgX/QHYjQ1bP4QADgCAiAAMA7AF4+JwABgHcAvHxOAAIA7wB4+ZwABADeAfDyOQEIALwD4OVzAhAAeAfAy+cEIADwDoCXzwlAAOAdAC+fE4AAfHWgbduFlNIvX6vu72pdTYCmaT6FEJZijBdSSj/621Y/K3MDoG3bbVVd3m+tql7MOX/30+p+rtQFgLZtt1R1dbSFqnop5/y1n631sareA2ia5nEI4eG4dqrqUs75s49292+VvQewsrJyZnd3d7jpO3tC+y6LyHB/wL/CDvQewLAeCwJVvZpz/lBYP/zhLgAUILiec34Pn2pBA9wAKEBwM+f8rqAH0Ie6AmBFEEK4LSJvoJM1Fu8OQAGCZRF5bewD7GEuARQguCMi27DpGgp3C6AAQSsiYugF5CGuARQgWBGRl5AJTyjaPYACBKsi8oIIDnegCgAFCO6JyBYR/OtANQCsCGKM91NKz4jgbweqAlCA4EFK6SkRVAjAiiCE8EhENtERVDcB9gO1XEAKIayLyAYygmoBFEwCaARVAyCCybOtegBEcDICCABEMB4BDAAiOB4BFAAiOIoADgARVHotYPJ+9/AR/Jyg0o+CSyAQQaUfBROBvQOQe4DR9iBPAgLY04CKgAAOjANEBAQw8nqAhoAAjtkvISEggDEbZhQEBHDCOyYEBAQw4S1z7QgIwPCZSc0ICMAAoOAC0oaIrBtP2YvDCKAgBsskiDHeSCntFJz2VA8lgML2WxCo6kLO+XfhqU/lcAKYou01ISCAKQBY9wQeJgEBzBFACKH3t68jgCkAGF8C7uacn09x+v/6EAIobLcl/BCCm7eDBFAAoLbwh6UTgBGAMXx3/8+QAAwAjOGvicgTw+l6dQgBzOBikOe7jhBAx8vBqupitz+uTALo9oUQ97efI4BjAFhe81V1kHN+1asX9CkWQwAjTbOEH0Ko5j7EBHAAgCX8GOOtlNLbKZ5svXwIAezFYglfVav7QQoCMP4kTYzxSkrpYy+fxh0WBQ/A+Myv9pfJoAFYwg8hLIrItw5Psl4/FBaAJXxVPZ9z/tnrBDsuDhKAMXw33+vrYgAOAMM/zAUKAMM/OitgADD8418oIAAw/PG7hOoBMPyTt4hVA2D4k98fVAuA4U8Ov9ovhTJ8W/hVAmD49vCrA8Dwy8KvCgDDLw+/GgAMf7rwqwDA8KcP3z0Aht8tfNcAGH738N0CYPizCd8lAIY/u/DdAWD4sw3fFQCGP/vw3QBg+PMJ3wUAhj+/8F0AGAwGmzHGtXFt8HAvvvlG2O3sLr4P0DRNCiE0o6Uy/G7hu5gA+yW2bbujqtf2/83wu4fvCsBwsW3bflHVRYY/m/DdARgueDAYnPNyJ+7ZxTS/M7nYA8yvfJ6ZAMANEAABgHcAvHxOAAIA7wB4+ZwABADeAfDyOQEIALwD4OVzAhAAeAfAy+cEIADwDoCXzwlAAOAdAC+fE4AAwDsAXj4nAAGAdwC8/D9mxyeuJrZ1BAAAAABJRU5ErkJggg==");
		background-size: 100% 100%;
	}

	.user {

		&-info {
			display: flex;
			padding: 20rpx 30rpx;
		}

		&-right {
			// float: right;
			// text-align: right;
			// width: 140rpx;

			// font-weight: 300;
			width: 48rpx;
			height: 48rpx;
			margin: 40rpx 0 0 92rpx;
			background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAEnElEQVR4Xu3dfWsTQRAG8N2vo5/Holgpiu8Uc0epIlZpLYpUcWctolZE8Q1fPmMZCbbYpk0zm0vszT5P/xMux848v0w2uXiJgX/QHYjQ1bP4QADgCAiAAMA7AF4+JwABgHcAvHxOAAIA7wB4+ZwABADeAfDyOQEIALwD4OVzAhAAeAfAy+cEIADwDoCXzwlAAOAdAC+fE4AAfHWgbduFlNIvX6vu72pdTYCmaT6FEJZijBdSSj/621Y/K3MDoG3bbVVd3m+tql7MOX/30+p+rtQFgLZtt1R1dbSFqnop5/y1n631sareA2ia5nEI4eG4dqrqUs75s49292+VvQewsrJyZnd3d7jpO3tC+y6LyHB/wL/CDvQewLAeCwJVvZpz/lBYP/zhLgAUILiec34Pn2pBA9wAKEBwM+f8rqAH0Ie6AmBFEEK4LSJvoJM1Fu8OQAGCZRF5bewD7GEuARQguCMi27DpGgp3C6AAQSsiYugF5CGuARQgWBGRl5AJTyjaPYACBKsi8oIIDnegCgAFCO6JyBYR/OtANQCsCGKM91NKz4jgbweqAlCA4EFK6SkRVAjAiiCE8EhENtERVDcB9gO1XEAKIayLyAYygmoBFEwCaARVAyCCybOtegBEcDICCABEMB4BDAAiOB4BFAAiOIoADgARVHotYPJ+9/AR/Jyg0o+CSyAQQaUfBROBvQOQe4DR9iBPAgLY04CKgAAOjANEBAQw8nqAhoAAjtkvISEggDEbZhQEBHDCOyYEBAQw4S1z7QgIwPCZSc0ICMAAoOAC0oaIrBtP2YvDCKAgBsskiDHeSCntFJz2VA8lgML2WxCo6kLO+XfhqU/lcAKYou01ISCAKQBY9wQeJgEBzBFACKH3t68jgCkAGF8C7uacn09x+v/6EAIobLcl/BCCm7eDBFAAoLbwh6UTgBGAMXx3/8+QAAwAjOGvicgTw+l6dQgBzOBikOe7jhBAx8vBqupitz+uTALo9oUQ97efI4BjAFhe81V1kHN+1asX9CkWQwAjTbOEH0Ko5j7EBHAAgCX8GOOtlNLbKZ5svXwIAezFYglfVav7QQoCMP4kTYzxSkrpYy+fxh0WBQ/A+Myv9pfJoAFYwg8hLIrItw5Psl4/FBaAJXxVPZ9z/tnrBDsuDhKAMXw33+vrYgAOAMM/zAUKAMM/OitgADD8418oIAAw/PG7hOoBMPyTt4hVA2D4k98fVAuA4U8Ov9ovhTJ8W/hVAmD49vCrA8Dwy8KvCgDDLw+/GgAMf7rwqwDA8KcP3z0Aht8tfNcAGH738N0CYPizCd8lAIY/u/DdAWD4sw3fFQCGP/vw3QBg+PMJ3wUAhj+/8F0AGAwGmzHGtXFt8HAvvvlG2O3sLr4P0DRNCiE0o6Uy/G7hu5gA+yW2bbujqtf2/83wu4fvCsBwsW3bflHVRYY/m/DdARgueDAYnPNyJ+7ZxTS/M7nYA8yvfJ6ZAMANEAABgHcAvHxOAAIA7wB4+ZwABADeAfDyOQEIALwD4OVzAhAAeAfAy+cEIADwDoCXzwlAAOAdAC+fE4AAwDsAXj4nAAGAdwC8/D9mxyeuJrZ1BAAAAABJRU5ErkJggg==");
			background-size: 100% 100%;
		}

		&-banner {
			margin-left: 30rpx;
		}

		&-name {
			margin-left: 30rpx;
			line-height: 120rpx;
			font-size: 32rpx;
			width: 400rpx;
		}
	}

	.aaa {
		width: 100%;
		height: 15rpx;
		background-color: #e6e6e6;
		margin-top: 30rpx;
	}

	.btn {
		// width: 100%;
		margin: 30rpx 100rpx;
		background-color: #C0C0C0;
		color: #FFFFFF;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 550rpx;
		padding: 30rpx 0;
		text-align: center;
	}

	.code-img {
		position: fixed;
		top: 5%;
		left: 50%;
		transform: translateX(-50%);
		width: 80%;
		height: 1200rpx;
		background-color: #FFFFFF;

	}
	.code-show {
		position: fixed;
		top: 0;
		left: 0;
		// background-color: rgb(0, 0, 0, .3);
		background-color: rgba(0,0,0, .3);
		width: 100%;
		height: 100vh;
	}
</style>
