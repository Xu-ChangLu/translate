<template>
	<view class="content">
		<view class="title">
			立即登录，探索更多内容
		</view>
		<view class="input">
			<view class="input-item">
				<u-input v-model="user.phone" placeholder="输入手机号" type="text" />
			</view>
			<view class="input-item ">
				<u-input v-model="user.code" placeholder="请输入验证码" type="text" />
				<view class="input-code">
					<span v-show="show" @click="getCode">获取验证码</span>
					<span v-show="!show">{{count}} s</span>
				</view>
			</view>

		</view>

		<view class="text">
			未注册手机号验证后自动登录
		</view>
		<view class="btn" @click="fnLonginClick()">
			立即登录
		</view>


		<view class="divider">
			<u-divider>其他登录方式</u-divider>
			<view class="divider-icon">
				<u-image width="60rpx" height="60rpx" src="../../static/icon-wechat.png"></u-image>
			</view>
			<view class="" style="text-align: center; color: #C0C0C0;">
				微信登录
			</view>
		</view>


		<view class="promise">
			登录即同意
			<text>《$服务商服务条款名称$》</text>和
			<text>《用户协议》</text>、
			<text>《隐私政策》</text>并授权本应用获取手机号
		</view>



	</view>
</template>

<script>
	export default {
		data() {
			return {
				user: {
					phone: '',
					code: '',
				},
				timely: "获取验证码",
				show: true,
				count: '',
				timer: null,
			}
		},
		onLoad() {

		},
		methods: {
			getCode() {
				const TIME_COUNT = 60;
				if (!this.timer) {
					this.count = TIME_COUNT;
					this.show = false;
					this.timer = setInterval(() => {
						if (this.count > 0 && this.count <= TIME_COUNT) {
							this.count--;
						} else {
							this.show = true;
							clearInterval(this.timer);
							this.timer = null;
						}
					}, 1000)
				}
			},
			fnLonginClick() {
				

			},
		}
	}
</script>

<style scoped lang="scss">
	.content {
		padding: 30rpx;
	}

	.title {
		text-align: center;
		font-size: 36rpx;
		margin-top: 30rpx;
	}

	.input {
		padding: 30rpx 100rpx;
		margin-top: 100rpx;

		&-item {
			display: flex;
			justify-content: space-between;
			margin: 30rpx 0 50rpx 0;
			padding: 20rpx 0 20rpx 0;
			width: 550rpx;
			border-bottom: 1rpx solid #f1f1f1;
		}

		&-code {
			width: 200rpx;
			line-height: 60rpx;
			margin-bottom: 12rpx;
			text-align: center;
			color: #4952a2;
			padding: 5rpx 25rpx;
			border: 1rpx solid #4952a2;
			border-radius: 50rpx;
		}
	}

	.text {
		margin-top: 100rpx;
		text-align: center;
		color: #C0C0C0;
	}

	.btn {
		padding: 30rpx 0rpx;
		margin: 40rpx 100rpx 0 100rpx;
		background-color: #4952a2;
		text-align: center;
		color: #FFFFFF;
		border-radius: 60rpx;
		font-weight: 700;
		font-size: 32rpx;
	}

	.divider {
		margin-top: 120rpx;
		position: relative;

		&-icon {
			margin: 40rpx 0 20rpx 315rpx;

			// position: absolute;
			// top: 0;
			// left: 50%;
			// transform: translateX(-50%);
		}
	}

	.promise {
		margin-top: 160rpx;
		font-size: 21rpx;
		color: #C0C0C0;
		text-align: center;

		text {
			color: #D3B393;
		}
	}
</style>
