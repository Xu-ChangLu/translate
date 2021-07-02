<template>
	<view class="content">
		<view class="textarea">
			{{value.src}}
		</view>
		<view class="dst">
			<view class="dst-text">
				<text class="" selectable="true">
					{{value.dst}}
				</text>
				<view class="dst-btn">
					<view class="dst-bitem" @click="fnVoiceClick()">
						<u-image width="50rpx" height="50rpx" src="../../static/icon-voice-botton.png" mode="aspectFit">
						</u-image>
						<audio :action="audioAction" ></audio>
					</view>
					<view class="dst-bitem" @click="fnCopyClick()" style="margin-left: 30rpx;">
						<u-image width="50rpx" height="50rpx" src="../../static/icon-copy-botton.png" mode="aspectFit">
						</u-image>
					</view>
				</view>
			</view>
			<!-- <view class="" style="padding: 30rpx 0;" @click="fnEnshrineClick()">
				<u-image v-if="value.status" width="40rpx" height="40rpx" src="../../static/star-1.png"
					mode="aspectFit"></u-image>
				<u-image v-else width="40rpx" height="40rpx" src="../../static/star-2.png" mode="aspectFit">
				</u-image>
			</view> -->
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import voice from '../../js_sdk/QuShe-baiduYY/QS-baiduyy/QS-baiduyy.js'
	export default {
		data() {
			return {
				audioAction: {
					method: 'pause'
				},
				value: {
					status:true
				},
				access_token: '',
			}
		},
		onLoad(options) {
			this.value = {
				src:options.src,
				dst:options.dst,
				status:options.status,
				to:options.to
			}
			if(this.value.status == 'true'){
				this.value.status = !this.value.status;
			}
		},
		methods: {
			fnEnshrineClick(){
				let val = uni.getStorageSync('translate-history');
				val.forEach(item=>{
					if(item.src == this.value.src){
						item.status = !item.status;
						this.value.status = !this.value.status;
					}
				})
				uni.setStorageSync('translate-history',val);
			},
			// 汉字转为Unicode字符码表示
			toUnicode(s) {
				return s.replace(/([\u4E00-\u9FA5]|[\uFE30-\uFFA0])/g, function() {
					return "\\u" + RegExp["$1"].charCodeAt(0).toString(16);
				});
			},
			fnVoiceClick() {
				if(this.value.to == 'zh' || this.value.to == 'en'){
					voice(this.value.dst);
					return
				}
				this.$refs.uToast.show({
					title: '仅支持中英文',
					type: 'error',
				})
				
				/*
					tex	必填	合成的文本，使用UTF-8编码。不超过60个汉字或者字母数字。文本在百度服务器内转换为GBK后，长度必须小于120字节
				
				*/
				// let q = this.toUnicode('点击语音')
				// let data = {
				// 	tex: '点击语音', //合成的文本
				// 	tok: this.access_token, //token
				// 	cuid: '1236788900', //用户唯一标识
				// 	ctp: 1, //客户端类型选择，web端填写固定值1

				// 	ie:"UTF-8",
				// 	lan: 'zh', //固定值zh。语言选择,目前只有中英文混合模式，填写固定值zh
				// 	spd: 5, //语速，取值0-15，默认为5中语速
				// 	pit: 5, //音调，取值0-15，默认为5中语调


				// 	vol: 9, // 音量，取值0-15，默认为5中音量（取值为0时为音量最小值，并非为无声）
				// 	per: 0, // 基础音库 度小宇=1，度小美=0，度逍遥（基础）=3，度丫丫=4


				// 	aue: 3 //3为mp3格式(默认)； 4为pcm-16k；5为pcm-8k；6为wav（内容同pcm-16k）; 注意aue=4或者6是语音识别要求的格式，但是音频内容不是语音识别要求的自然人发音，所以识别效果会受影响。
				// }
				// console.log({
				// 	data
				// })
			},
			toUnicode(s) {
				return s.replace(/([\u4E00-\u9FA5]|[\uFE30-\uFFA0])/g, function() {
					return "\\u" + RegExp["$1"].charCodeAt(0).toString(16);
				});
			},
			fnCopyClick() {
				uni.setClipboardData({
					data: this.value.dst,
					success: function(res) {
						uni.showToast({
							title: '复制成功',
						})
					},
					fail(err) {
						console.log(err);
					}
				})
				console.log('点击复制内容为：', this.value.dst);
			}
		}
	}
</script>

<style scoped lang="scss">
	.content {
		padding: 0 30rpx;
	}

	.header {
		height: 60rpx;
	}

	.back {
		font-size: 42rpx;
		line-height: 60rpx;
		margin-left: 30rpx;
	}

	.textarea {
		background-color: #ebebeb;
		width: 100%;
		margin: 40rpx 0;
		padding: 40rpx;

	}

	.text-center {
		// text-align: center;
		margin: 0 auto;
		width: 100%;
	}

	.dst {
		display: flex;
		justify-content: space-between;

		&-text {
			width: 80%;
		}

		&-btn {
			display: flex;
			// justify-content: center;
		}

		&-bitem {
			height: 60rpx;
			width: 60rpx;
			// background-color: pink;
			margin: 0 5rpx;
			margin-top: 15rpx;
		}
	}
</style>
