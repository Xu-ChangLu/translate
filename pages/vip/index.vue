<template>
	<view class="content">
		<view class="user" @click="fnUserClick()">
			<view class="user-img">
				<u-image width="120rpx" height="120rpx" :src="user_info.userHeadImg" shape="circle" mode="aspectFit"></u-image>
			</view>
			<view class="">
				<view class="user-name">
					{{user_info.userName?user_info.userName:'未登录'}}
				</view>
				<view class="">
					{{user_info.userIsVip?'超级会员':'您当前不是超级会员'}}
				</view>
			</view>
		</view>

		<view class="price">
			<view class="price-item" @click="currentPrice = 0" :class="currentPrice == 0?'price-check':''">
				<image class="price-img" src="../../static/vip-price-icon-1.png" mode=""></image>
				<view class="price-month" style="margin-top: 30rpx;">
					超级会员
				</view>
				<view class="price-current">
					￥29.9
				</view>
				<view class="price-before">
					￥99
				</view>
			</view>
			<view class="price-item" @click="currentPrice = 1" :class="currentPrice == 1?'price-check':''">
				<view class="price-month">
					12个月
				</view>
				<view class="price-current" style="margin-bottom: 20rpx;">
					￥19.9
				</view>
				<view class="price-before">
					￥69
				</view>
				<view class="price-day">
					0.06元/天
				</view>
			</view>
			<view class="price-item" @click="currentPrice = 2" :class="currentPrice == 2?'price-check':''">
				<view class="price-month">
					6个月
				</view>
				<view class="price-current" style="margin-bottom: 20rpx;">
					￥9.9
				</view>
				<view class="price-before">
					￥29
				</view>
				<view class="price-day">
					0.018元/天
				</view>
			</view>
		</view>
		<view class="privilege">
			<view class="privilege-title">
				会员特权
			</view>
			<view class="privilege-item" v-for="(item,index) in privilege" :key="index">
				<view class="privilege-img">
					<u-image width="100rpx" height="100rpx" :src="item.src"></u-image>
				</view>
				<view class="privilege-text">
					{{item.text}}
				</view>
			</view>
		</view>
		<u-radio-group v-model="radioValue">
			<view class="paystyle">
				<view class="paystyle-item">
					<view class="paystyle-left">
						<u-image width="60rpx" height="60rpx" src="../../static/icon-wechat.png"></u-image>
						<view class="paystyle-text">微信支付</view>
					</view>
					<view class="paystyle-radio">
						<u-radio active-color="red" name="1"></u-radio>
					</view>
				</view>
				<view class="paystyle-center"></view>
				<view class="paystyle-item">
					<view class="paystyle-left">
						<u-image width="60rpx" height="60rpx" src="../../static/icon-zhifubao.png"></u-image>
						<view class="paystyle-text">支付宝支付</view>
					</view>
					<view class="paystyle-radio">
						<u-radio active-color="red" name="0"></u-radio>
					</view>
				</view>
			</view>
		</u-radio-group>
		<view class="btn" @click="fnSubmit()">
			立即开通
		</view>
		<view class="promise">
			支付即表示你同意
			<text class="promise-text"
				@click="open(`https://campaign.snmi.cn/treaty/user/index.html?subject=${subject}`)">《VIP会员服务协议》</text>和
			<text class="promise-text"
				@click="open(`https://campaign.snmi.cn/treaty/privacy/index.html?subject=${subject}`,)">《隐私政策》</text>
		</view>
		<view class="activity" v-show="backbutton">
			<view class="activity-shade" @click="fnBlackButton()"></view>
			<view class="activity-back" @click="fnBlackButton()">
				<u-image width="70rpx" height="70rpx" src="../../static/icon-close-button.png"></u-image>
			</view>
			<view class="activity-content">
				<view class="activity-bg-top">
					<view class="activity-bg-title">
						专属福利
					</view>
					<view class="activity-bg-text">
						原价29元 再降10元
					</view>
					<view class="activity-bg-price">
						仅需
						<view style="font-size: 42rpx;margin: 0 20rpx;">19</view>
						元
					</view>
				</view>
				<view class="activity-bg-bottom">
					<view class="activity-bg-timestamp">
						<u-count-down :timestamp="timestamp" @change="fnCountDownChange" bg-color="#e30e32" color="#fff"
							:separator-size="42" separator-color="#fff" :font-size="55"></u-count-down>
					</view>
					<u-radio-group v-model="radioValue">
						<view class="activity-bg-btn">
							<view class="activity-bg-item">
								<u-image width="40rpx" height="40rpx" src="../../static/icon-wechat.png"></u-image>
								<view class="activity-bg-btntext">微信支付</view>
								<u-radio active-color="#dfb87c" name="1"></u-radio>
							</view>
							<view class="activity-bg-item">
								<u-image width="40rpx" height="40rpx" src="../../static/icon-zhifubao.png"></u-image>
								<view class="activity-bg-btntext">支付宝支付</view>
								<u-radio active-color="#dfb87c" name="0"></u-radio>
							</view>
						</view>
					</u-radio-group>

					<view class="activity-bg-sub" @click="fnSubmit()">
						立即开通
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				user_info: {
					
				},
				radioValue: '0',
				// radioValue2: '0',
				currentPrice: 0,
				timestamp: 3600,
				currentTime: 0,
				back: 0,
				privilege: [{
						src: '../../static/privilege-icon-1.png',
						text: '解锁所有翻译功能'
					},
					{
						src: '../../static/privilege-icon-2.png',
						text: '无限语音翻译次数'
					},
					{
						src: '../../static/privilege-icon-2.png',
						text: '无限拍照翻译次数'
					},
					{
						src: '../../static/privilege-icon-2.png',
						text: '无限同声传译次数'
					},
					{
						src: '../../static/privilege-icon-3.png',
						text: '纯净无广告'
					},
				],
				backbutton: false,
				
			}
		},
		watch: {

		},
		onLoad() {
			
			// uni.removeStorageSync('time_key') //一小时定时器清除
		},
		onShow() {
			let user_info = uni.getStorageSync('user_info')
			this.user_info = user_info == '' ? {} : user_info
			console.log('is userinfo', this.user_info)
			// let user = '游客用户-' + Math.random().toString(36).substr(2)
			// this.user_info.userName = user
			// console.log(user)
		},
		onBackPress(options) {
			if (options.from === 'backbutton') {
				if (!this.backbutton && this.back == 0) {
					this.backbutton = true;
					const value = uni.getStorageSync('time_key');
					if (!value) {
						let time = new Date().getTime();
						uni.setStorageSync('time_key', time);
						
					} else {
						let currentTime = new Date().getTime();
						let curtime = parseInt(3600 - (currentTime - value) / 1000);
						if (curtime <= 0) {
							return false
						}
						this.timestamp = curtime;
						console.log(curtime, '时间戳')
					}
					return true
				} else {
					return false
				}
			}
		},
		mounted() {
			try {
				uni.onNativeEventReceive((event, data) => {
					// uni.showToast({
					// 	title: '接收到宿主App消息 event：' + event + " data: " + JSON.stringify(data),
					// 	icon: 'none',
					// 	duration: 10000
					// })
					// uni.setStorageSync('user_info', data);
					let user = '游客用户-' + Math.random().toString(36).substr(2)
					uni.setStorageSync('user_info', {"userName":user,"userHeadImg":"http:\/\/cdnp.h5120.com\/Upload\/502e82e5-395d-47fc-afdd-64b0f977f9ed.png","userIsVip":data.userIsVip});
					
				});
			} catch (e) {
				console.log('this Android return User info', e)
			}
		},
		methods: {
			open(val) {
				uni.navigateTo({
					url: "../web/web?url=" + val
				});
			},
			fnCountDownChange(e) {
				this.currentTime = e
			},
			fnBlackButton() {
				this.back = this.back + 1
				console.log(this.back)
				this.backbutton = false
			},
			fnUserClick() {
				console.log(111)
				if (JSON.stringify(this.user_info) == '{}') {
					this.login()
					console.log(222)
					return
				}
				
				
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
			fnSubmit() {
				// console.log(typeof(this.radioValue * 1))
				this.pay(this.radioValue * 1)
				
				
				// if (JSON.stringify(this.user_info) == '{}') {
				// 	this.login()
				// 	return
				// }
				//调用支付接口

				
				
				
				//支付成功后  时间一年
				// var date = new Date();
				// date.setFullYear(date.getFullYear()+1);
				// date.setDate(date.getDate()-1);
				
				// console.log(this.dateFormat(date))
				// let a = Math.random().toString(36).substr(2);


				// console.log(a)
				
			},
			// dateFormat(dateData) {
			//var date = new Date(dateData)
			//var y = date.getFullYear()
			//var m = date.getMonth() + 1
			//m = m < 10 ? ('0' + m) : m
			//var d = date.getDate()
			//d = d < 10 ? ('0' + d) : d
			//const time = y + '-' + m + '-' + d
			//return time
			//},
		}
	}
</script>

<style scoped lang="scss">
	.content {
		padding: 30rpx;
		padding-top: 60rpx;
	}

	.user {
		display: flex;
		padding: 50rpx 30rpx;
		// background-color: #cfaf8f;
		background-image: linear-gradient(to right, #D3B393, #9D7D5D);
		color: #FFFFFF;
		border-top-left-radius: 30rpx;
		border-top-right-radius: 30rpx;

		&-img {
			width: 150rpx;
		}

		&-name {
			margin-bottom: 20rpx;
			font-size: 42rpx;
		}
	}

	.price {
		position: relative;
		display: flex;
		justify-content: center;
		margin-top: 40rpx;
		text-align: center;

		&-item {
			height: 260rpx;
			width: 100%;
			margin: 0 20rpx;
			border-radius: 30rpx;
			padding: 30rpx;
			border: 1rpx solid #e5e5e5;
			// box-shadow: 4rpx 6rpx 2rpx #8c8c8c ;
		}

		&-img {
			position: absolute;
			top: 0;
			left: 20rpx;
			width: 140rpx;
			height: 40rpx;
		}

		&-month {
			margin: 20rpx 0;
			font-size: 28rpx;
		}

		&-current {
			font-size: 42rpx;
			color: #ffaa00;
			margin-bottom: 20rpx;
			font-weight: 700;
		}

		&-before {
			font-size: 20rpx;
			text-decoration: line-through;
		}

		&-day {
			font-size: 20rpx;
			color: red;
			margin-top: 10rpx;
		}

		&-check {
			background-color: #f8ede1;
			opacity: .9;
		}
	}

	.privilege {
		margin-top: 30rpx;

		&-title {
			text-align: center;
			font-size: 45rpx;
			font-weight: 700;
		}

		&-item {
			display: flex;
			padding: 30rpx 20rpx;
			background-color: #f7f7f7;
			border-radius: 15rpx;
			margin: 20rpx 0;
		}

		&-img {
			width: 100rpx;
			height: 100rpx;
		}

		&-text {
			line-height: 100rpx;
			margin-left: 30rpx;
		}
	}

	.paystyle {
		margin: 10rpx;
		margin-bottom: 40rpx;

		&-item {
			display: flex;
		}

		&-left {
			display: flex;
		}

		&-text {
			line-height: 60rpx;
			margin-left: 30rpx;
			width: 300rpx;
		}

		&-radio {
			margin-left: 200rpx;
			margin-top: 10rpx;
		}

		&-center {
			width: 100%;
			background-color: #e3e3e3;
			height: 1rpx;
			margin: 30rpx 0;
		}
	}

	.btn {
		padding: 20rpx 30rpx;
		background-color: #44403c;
		text-align: center;
		margin: 0 100rpx;
		color: #FFFFFF;
		font-weight: 700;
		border-radius: 30rpx;
	}

	.promise {
		margin-top: 40rpx;
		text-align: center;
		color: #C0C0C0;

		&-text {
			color: #D3B393;
		}
	}

	.activity {

		overflow: hidden;

		&-shade {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100vh;
			background-color: rgba(0, 0, 0, 0.3);
		}

		&-back {
			position: fixed;
			top: 10%;
			right: 10%;
		}

		&-content {
			position: fixed;
			top: 20%;
			left: 50%;
			transform: translateX(-50%);
			width: 500rpx;
			// height: 800rpx;
		}

		&-bg {
			&-top {
				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				height: 300rpx;
				background-image: url(../../static/bg-activity-2.png);
				background-size: 105% 300rpx;
				z-index: 99;
			}

			&-bottom {
				position: fixed;
				top: 270rpx;
				left: 0;
				width: 100%;
				height: 400rpx;
				background-image: url(../../static/bg-activity-1.png);
				background-size: 100% 400rpx;
			}

			&-title {
				font-size: 36rpx;
				z-index: 999;
				text-align: center;
				color: #FEC945;
				margin-top: 100rpx;
			}

			&-text {
				text-align: center;
				color: #FFFFFF;
				margin: 10rpx 0;
				margin-bottom: 30rpx;
				font-size: 32rpx;
			}

			&-price {
				color: #FFFFFF;
				font-size: 32rpx;
				display: flex;
				height: 30rpx;
				line-height: 30rpx;
				justify-content: center;
			}

			&-timestamp {
				text-align: center;
				margin-top: 100rpx;
			}

			&-btn {
				display: flex;
				padding: 40rpx 20rpx;
			}

			&-btntext {
				color: #FFFFFF;
				margin: 4rpx 6rpx;
				width: 140rpx;
				text-align: center;
			}

			&-item {
				display: flex;
				justify-content: center;
			}

			&-sub {
				background-color: #ffe0a1;
				padding: 20rpx;
				margin: 10rpx 100rpx;
				font-weight: 700;
				font-size: 32rpx;
				color: #da362c;
				text-align: center;
				border-radius: 50rpx;
			}
		}
	}
</style>
