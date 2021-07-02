<template>
	<view class="content">
		<view class="status_bar" :style="'width: 100%;height:'+statusHeight+'px'">
			<!-- 这里是状态栏 -->
		</view>

		<view>
			<view class="header">
				<u-row gutter="0" justify="between">
					<u-col span="3">
						<u-image width="140rpx" height="40rpx" src="../../static/logo.png"></u-image>
					</u-col>
					<u-col span="7">
						<u-row gutter="0" justify="conter">
							<u-col span="5">
								<view class="text-center" style="text-align: right;" @click="fnLanguageShow('form')">
									{{languageCurrent.form.label}}
									<u-icon name="arrow-down-fill" style="margin-left: 10rpx;" size="21"></u-icon>
								</view>
							</u-col>
							<u-col span="2">
								<u-image width="30rpx" height="15rpx" style="margin:0 0 30rpx 15rpx;"
									src="../../static/arrows.png"></u-image>
							</u-col>
							<u-col span="5">
								<view class="text-center" @click="fnLanguageShow('to')">
									{{languageCurrent.to.label}}
									<u-icon name="arrow-down-fill" style="margin-left: 10rpx;" size="21"></u-icon>
								</view>
							</u-col>
						</u-row>
					</u-col>
					<u-col span="2" @click="fnUserInfo()">
						<!-- <view class="text-center">
							头像

						</view> -->
						<u-icon name="setting-fill" size="42" style="margin:10rpx 0 0 50rpx;"></u-icon>
						<!-- <u-image width="50rpx" height="50rpx" :src="user_info.userHeadImg" shape="circle"
							mode="aspectFit"></u-image> -->
					</u-col>
				</u-row>
			</view>
			<u-select v-model="languageShow" :list="languageList" @confirm="confirm"></u-select>
			<view class="textarea">
				<view class="textarea-input">
					<u-input v-model="form.q" :focus="false" type="textarea" :maxlength="1000" :auto-height="false" />
				</view>
			</view>

			<u-grid :col="3" :border="false">
				<u-grid-item @click="voice()">
					<!-- 	<view class="vvip">
						<u-image width="60rpx" height="30rpx" src="../../static/translate-icon-vip.png"></u-image>
					</view> -->
					<u-image width="100rpx" height="100rpx" src="../../static/translate-icon-1.png"></u-image>
					<view class="text-center" style="text-align: center;">语音翻译</view>
				</u-grid-item>
				<u-grid-item @click="photograph()">
					<!-- <view class="vvip">
						<u-image width="60rpx" height="30rpx" src="../../static/translate-icon-vip.png"></u-image>
					</view> -->
					<u-image width="100rpx" height="100rpx" src="../../static/translate-icon-2.png"></u-image>
					<view class="text-center" style="text-align: center;">拍照翻译</view>
				</u-grid-item>
				<u-grid-item @click="fnFavoriteClick()">
					<!-- <view class="vvip">
						<u-image width="60rpx" height="30rpx" src="../../static/translate-icon-vip.png"></u-image>
					</view> -->
					<u-image width="100rpx" height="100rpx" src="../../static/translate-icon-3.png"></u-image>
					<view class="text-center" style="text-align: center;">收藏列表</view>
				</u-grid-item>
			</u-grid>


			<!-- <view class="banner">
				<u-image width="700rpx" mode="aspectFit" height="200rpx" src="../../static/banner-1.png"></u-image>
			</view> -->

			<view class="result">
				<view class="result-header">
					<view class="" style="font-size: 32rpx;font-weight: 700;">
						历史记录
					</view>
					<view class="" @click="fnRemoveHistory()">
						<u-image width="40rpx" mode="aspectFit" height="60rpx" src="../../static/icon-rubbish.png">
						</u-image>
					</view>
				</view>
				<view class="result-nodata" v-if="resultList5 <= 0">
					暂无数据
				</view>
				<view class="result-item" v-for="(item,index) in resultList5" :key="index">
					<view class="result-form" @click="fnResultClick(item)">
						{{item.src}}
					</view>
					<view class="" style="padding: 30rpx 0;" @click="fnEnshrineClick(item,index)">
						<u-image v-if="!item.status" width="40rpx" height="40rpx" src="../../static/star-1.png"
							mode="aspectFit"></u-image>
						<u-image v-else width="40rpx" height="40rpx" src="../../static/star-2.png" mode="aspectFit">
						</u-image>
					</view>
				</view>
			</view>


			<view v-show="isBotton" class="botton" :style="`bottom:${keyboardHeight - 50 + 50}px`">
				<view class="botton-item" @click="fnEmptyClick()">
					清除
				</view>
				<view class="botton-item" @click="fnTranslateClick()">
					翻译
				</view>
			</view>
			<view class="vip" v-show="vipShow">
				<view class="vip-contnent">
					<view class="vip-bg">
						您尚未开通会员，开通会员后解锁 全部高级翻译功能,畅想更多特权。
					</view>
					<view class="vip-btn" @click="fnVipClick()">
						<view class="vip-tbtn">
							开通会员
						</view>
					</view>
				</view>
				<view class="vip-close" @click="vipShow = false">
					<u-image width="100%" height="80rpx" src="../../static/icon-close-button.png" mode="aspectFit">
					</u-image>
				</view>
			</view>
		</view>
		<u-popup v-model="voiceShow" mode="center">
			<view class="popup">
				<view class="">
					正在录音
				</view>
				<view class="popup-img">
					<u-image width="100%" height="200rpx" src="../../static/record.gif"></u-image>
				</view>
				<view class="popup-button popup-center">
					<view class="popup-close" @click="fnVoiceClick()">
						说完了
					</view>
				</view>
			</view>
		</u-popup>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import md5 from 'js-md5'
	import language from '../../config/language.js'
	const recorderManager = uni.getRecorderManager();
	const innerAudioContext = uni.createInnerAudioContext();
	innerAudioContext.autoplay = true;

	export default {
		data() {
			return {
				load: true,
				vipShow: false,
				textareaValue: '',
				isBotton: false,
				resultList: [],
				resultList5: [],
				statusHeight: 0,
				keyboardHeight: 0,
				languageShow: false,
				voiceShow: false,
				form: {
					q: '', // 翻译文本
					from: 'en', // 翻译源语言 
					to: 'zh', // 翻译目标语言 
					appid: '20210622000869152',
					salt: '1234567'
				},
				currentLanguage: '',
				languageCurrent: {
					form: {
						value: 'zh',
						label: '中文'
					},
					to: {
						value: 'en',
						label: '英文'
					}
				},
				languageList: [],
				speech: '',
				len: '',
				setTimte: '',
				ishow: 0,
				user_info: {
					// userIsVip:true
				},
				token: ''
			}
		},
		onShow() {
			this.statusHeight = plus.navigator.getStatusbarHeight();
			this.languageList = language;
			let user_info = uni.getStorageSync('user_info');
			this.user_info = user_info == '' ? {} : user_info;
			let user = '游客用户-' + Math.random().toString(36).substr(2);
			this.user_info.userName = user;
			this.user_info.userIsVip = true;
		
			let value = uni.getStorageSync('translate-history');
			this.resultList = value;
			let data = [];
			if(this.resultList.length >= 5){
				for (var i = 0; i < 5; i++) {
					data.push(this.resultList[this.resultList.length - i - 1]);
				}
				this.resultList5 = data;
			}else if(this.resultList.length == 0){
				this.resultList5 = [];
			}else if(this.resultList.length <= 5) {
				this.resultList5 = this.resultList.reverse();
			}
			
			this.tokens()
		},
		onLoad(options) {
			var _this = this
			// 结束录音
			recorderManager.onStop((res) => {
				// 临时文件路径 -> res.tempFilePath
				// 获取文件大小
				_this.getFileInfo.apply(_this, [res.tempFilePath])
				// 转base64
				_this.base64.apply(_this, [res.tempFilePath])
				setTimeout(() => {
					let dev_pid = 1537;
					if (this.form.from.from == 'zh') {
						dev_pid = 1537
					} else if (this.form.from.from == 'en') {
						dev_pid = 1737
					}
					let data = {
						format: 'amr',
						rate: 8000,
						dev_pid,
						channel: 1,
						token: _this.access_token,
						cuid: 'blile',
						len: _this.len,
						speech: _this.speech,
						lan: 'ct',
					}
					// dev_pid
					// 1537	普通话(纯中文识别)	输入法模型	有标点	支持自定义词库
					// 1737	英语	英语模型	无标点	不支持自定义词库
					uni.request({
						method: 'POST',
						url: 'http://vop.baidu.com/server_api',
						header: {
							'Content-Type': 'application/json'
						},
						data: JSON.stringify(data),
						success(res) {
							if (res.statusCode == 200) {
								console.log(res)
								console.log(`语音识别结果为：${res.data.result.join('')}`)
								_this.fnTextClick(res.data.result.join(''))
							}
						},
						file(err) {
							console.log(err, "-----http://vop.baidu.com/server_api----")
						}
					})
				}, 300)
			});
		},
		mounted() {
			let _this = this;
			//监听键盘高度 -> 当前键盘高度
			uni.onKeyboardHeightChange(res => {
				_this.keyboardHeight = res.height
				if (res.height <= 0) _this.isBotton = false
				else _this.isBotton = true
			})
			//监听用户当前网络状态
			uni.onNetworkStatusChange(function(res) {
				if (res.networkType == 'none') {
					uni.showToast({
						title: '当前网络链接失败请重试',
						icon: 'none'
					})
				}
			});

			try {
				uni.sendNativeEvent("voicePermission", {}, (ret) => {

				})
				uni.onNativeEventReceive((event, data) => {
					// uni.showToast({
					// 	title: '接收到宿主App消息 event：' + event + " data: " + JSON.stringify(data),
					// 	icon: 'none',
					// 	duration: 10000
					// })
					uni.setStorageSync('user_info', data);
				});
			} catch (e) {
				console.log('this Android return User info', e)
			}


		},
		methods: {
			fnLogin() {
				console.log('判断是否登录&&是否是vip')
				uni.showTabBar({
					title: this.user_info,
					icon: 'none'
				})
				this.vipShow = true
			},
			fnUserInfo() {
				uni.navigateTo({
					url: '../my/index'
				})
			},
			fnBackClick() {
				uni.navigateBack({
					delta: 1
				})
			},
			confirm(e) {
				this.languageCurrent[this.currentLanguage] = e[0]
			},
			fnLanguageShow(val) {
				this.languageShow = true
				this.currentLanguage = val
			},
			fnEmptyClick() {
				// 用户点击清除按钮
				this.form.q = '';
			},
			fnTranslateClick() {
				// 点击翻译文本
				this.form.salt = Math.floor(Math.random() * 10000);
				this.form.sign = md5(this.form.appid + this.form.q + this.form.salt + 'NdXfFpsbeirxPEaOmC8S');
				this.form.from = this.languageCurrent.form.value;
				this.form.to = this.languageCurrent.to.value;
				let _this = this
				uni.request({
					url: 'https://fanyi-api.baidu.com/api/trans/vip/translate',
					data: this.form,
					success(res) {
						console.log(res)
						if (res.statusCode == 200) {
							let item = res.data.trans_result[0];

							item.to = res.data.to;
							item.status = false;

							/// ----if
							// _this.resultList.push(item)

							// var is = true
							// _this.resultList.forEach(val => {
							// 	if (item.src == val.src) {
							// 		is = false;
							// 		item = val;
							// 		console.log(item, "------------------------->>ASdasd")
							// 	}
							// })
							// if (is) {
							// 	try {

							// 		let data = [..._this.resultList, item]
							// 		// console.log(data, "----------------as")
							// 		uni.setStorageSync('translate-history', data);

							// 	} catch (e) {
							// 		console.log(e)
							// 		uni.showToast({
							// 			title: e,
							// 			icon: 'none'
							// 		})
							// 	}
							// }

							let data = [..._this.resultList, item]
							// console.log(data, "----------------as")
							uni.setStorageSync('translate-history', data);
							_this.fnEmptyClick()
							/// ----end
							let q = `?src=${item.src}&dst=${item.dst}&status=${item.status}&to=${item.to}`;
							uni.navigateTo({
								url: '../result/index' + q
							})
							console.log(q, "-----------------------------------------", data)

						}
					}
				})
			},
			base64(tempFilePath) {
				// 本地文件路径转64
				let _this = this
				const path = plus.io.convertLocalFileSystemURL(tempFilePath)
				const fileReader = new plus.io.FileReader()
				fileReader.readAsDataURL(path)
				fileReader.onloadend = (res) => {
					_this.speech = res.target.result.split(",")[1];
				}
			},
			getFileInfo(tempFilePath) {
				// 获取文件大小
				let _this = this
				uni.getFileInfo({
					filePath: tempFilePath,
					success: (res) => {
						_this.len = res.size;
					}
				})
			},
			tokens() {
				// 获取access_token
				let _this = this;
				uni.request({
					url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=LrVpENLGeR5i8x83MvcxpIkG&client_secret=wKrm49l3IO7AGD2LGjUHTKNDfFfmQze5&',
					success(res) {
						_this.access_token = res.data.access_token;
					}
				})
			},
			fnResultClick(item) {
				this.fnTextClick(item.src)
			},
			photograph() {
				console.log(this.user_info.userIsVip)
				if (JSON.stringify(this.user_info) == '{}') {
					this.fnLogin()
				} else if (this.user_info.userIsVip) {
					let q = `?from=${this.languageCurrent.form.value}&to=${this.languageCurrent.to.value}`
					uni.navigateTo({
						url: '../photograph/index' + q
					})
				} else {
					this.fnLogin()
				}
			},
			fnTextClick(history = '') {
				this.form.q = history;
				this.fnTranslateClick()
			},
			confirm(e) {
				// 选择语言方向
				this.languageCurrent[this.currentLanguage] = e[0];
			},
			fnLanguageShow(val) {
				// 点击语言方向
				this.languageShow = true;
				this.currentLanguage = val;
			},
			voice() {
				if (JSON.stringify(this.user_info) == '{}') {
					this.fnLogin()
					return
				}
				if (this.languageCurrent.form.value !== 'zh' && this.languageCurrent.form.value !== 'en') {
					this.$refs.uToast.show({
						title: '语音翻译仅支持中英文',
						type: 'error',
					})
					return
				}
				if (this.user_info.userIsVip) {
					this.voiceShow = true;
					this.setTimte = setTimeout(() => {
						console.log(6666)
						this.fnVoiceClick()
						this.$refs.uToast.show({
							title: '语音翻译最长60秒',
							type: 'error',
						})
					}, 60000) // 60000  ->  60s
					recorderManager.start({
						format: 'amr'
					});
				} else {
					this.fnLogin()
				}
			},
			fnVoiceClick() {
				// 录音结束
				this.voiceShow = false;
				recorderManager.stop();
				clearTimeout(this.setTimte)
			},
			fnEnshrineClick(item, index) {
				this.resultList.forEach(val => {
					if (val == item) {
						val.status = !val.status
					}
				})

				uni.setStorageSync('translate-history', this.resultList);
			},
			fnRemoveHistory() {
				let data = [];
				console.log(this.resultList, "------------")
				this.resultList.filter(item => {
					if (item.status) {
						console.log(item.status)
						data.push(item)
					}
					// if (item.status !=='true') {
					// 	data.push(item)
					// }
				});

				// this.resultList = data

				uni.setStorageSync('translate-history', data);

				this.resultList = uni.getStorageSync('translate-history');
				// if (data.length >= 5) {
				// 	this.resultList5 = data.splice(-5);
				// } else {
				// 	this.resultList5 = data;
				// }
				let val = []
				if(this.resultList.length >= 5){
					for (var i = 0; i < 5; i++) {
						val.push(this.resultList[this.resultList.length - i - 1])
					}
					this.resultList5 = data
				}else if(this.resultList.length == 0){
					this.resultList5 = []
				}else if(this.resultList.length <= 5) {
					this.resultList5 = this.resultList.reverse()
				}

			},
			fnFavoriteClick() {
				uni.navigateTo({
					url: '../favorite/index'
				})
			},
			fnVipClick() {
				this.vipShow = false;
				uni.navigateTo({
					url: '../vip/index'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.load {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		z-index: 9999;
	}

	.content {
		padding: 30rpx;
	}

	.text {
		width: 100rpx;
		height: 50rpx;
	}

	.text-center {
		margin: 0 auto;
		width: 100%;
		height: 50rpx;
		line-height: 50rpx;
		font-size: 32rpx;
	}

	.textarea {
		background-color: #ebebeb;
		width: 100%;
		margin: 40rpx 0;
		height: 350rpx;
		padding: 10rpx 20rpx;

		&-input {
			overflow: hidden;
		}
	}

	.banner {}

	.result {
		padding: 30rpx;

		&-item {
			display: flex;
			justify-content: space-between;
			// margin: 30rpx 0;
		}

		&-form {
			width: 100%;
			padding: 30rpx 0;
		}

		&-header {
			display: flex;
			justify-content: space-between;
			line-height: 60rpx;
		}

		&-nodata {
			text-align: center;
			color: #C0C0C0;
			margin-top: 80rpx;
		}

	}

	.popup {
		padding: 30rpx;
		width: 600rpx;
		height: 450rpx;
		text-align: center;
		font-size: 32rpx;

		&-button {
			display: flex;
			justify-content: space-between;
		}

		&-center {
			justify-content: center;
		}

		&-close {
			width: 200rpx;
			height: 70rpx;
			line-height: 70rpx;
			border-radius: 30rpx;
			border: 1rpx solid #67c2d0;
		}

		&-img {
			padding: 0 30rpx;
			height: 200rpx;
			margin: 30rpx 0;
		}
	}

	.botton {
		position: fixed;
		width: 100%;
		// height: 80rpx;
		line-height: 80rpx;
		background-color: #ebebeb;
		display: flex;
		justify-content: space-between;
		margin-left: -30rpx;
		padding: 0 30rpx;

		&-item {
			font-size: 42rpx;
			// background-color: #4CD964;
			padding: 10rpx 50rpx;
		}
	}

	.vip {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.4);
		z-index: 999;

		&-bg {
			width: 100%;
			height: 400rpx;
			background-image: url(../../static/bg-vip-popup.png);
			background-size: 650rpx 400rpx;
			z-index: 999;
			color: #FFFFFF;
			text-align: center;
			font-size: 36rpx;
			padding: 42rpx;
			padding-top: 200rpx;
		}

		&-contnent {
			position: absolute;
			left: 50%;
			top: 25%;
			width: 650rpx;
			transform: translateX(-50%);
		}

		&-btn {
			width: 100%;
			height: 240rpx;

			margin-top: 0;
			background-color: #FFFFFF;
			padding-top: 50rpx;
		}

		&-tbtn {
			background-image: url(../../static/bg-vip-botton.png);
			background-size: 550rpx 125rpx;
			padding: 35rpx;
			text-align: center;
			line-height: 55rpx;
			font-size: 36rpx;
			color: #FBD879;
			margin: 0 50rpx;
		}

		&-close {
			position: absolute;
			left: 50%;
			bottom: 25%;
			width: 700rpx;
			height: 50rpx;
			transform: translateX(-50%);
		}
	}

	.vvip {
		position: absolute;
		top: 10%;
		right: 23%;
		z-index: 99;
	}
</style>
