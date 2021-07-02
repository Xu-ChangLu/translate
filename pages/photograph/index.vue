<template>
	<view class="content" catchtouchmove="true">
		<u-image width="100%" @click="fnShadeClick()" :height="screenHeight - statusHeight + 'px'" :src="imgSrc"
			mode=""></u-image>
		<view class="shade" v-if="shade" @click="fnShadeClick()"></view>
		<view class="" v-if="shade">
			<view v-for="(item,index) in res.data.content" :key="index">
				<view class="position-item"
					:style="`position: fixed;left:${item.rect[0]}rpx;top:${item.rect[1]-statusHeight}rpx;`">
					{{item.dst}}
				</view>
			</view>
		</view>

	</view>
</template>
<script>
	// import res from './data.js'
	export default {
		data() {
			return {
				imgSrc: '',
				screenHeight: 0,
				statusHeight: 0,
				swiperheight: 0,
				access_token: '',
				res: {
					data: {
						content: [{
							src: '',
							rect: ['0', '0', '0', '0']
						}]
					}
				},
				shade: false,
				sendDate: {
					from: '',
					to: ''
				}
			}
		},
		onShow() {

		},
		onLoad(options) {
			this.sendDate.from = options.from || 'zh';
			this.sendDate.to = options.to || 'en';
			this.tokens();
			this.fnUpLoadClick();
			this.screenHeight = uni.getSystemInfoSync().screenHeight;
			this.statusHeight = plus.navigator.getStatusbarHeight();
			uni.getSystemInfo({
				success: (res) => {
					let height = res.windowHeight - uni.upx2px(100) //获取系统信息，可使用窗口的高度
					this.swiperheight = height;
				}
			});
			// this.res = res
			// this.res.data.content.forEach(item => {
			// 	item.rect = item.rect.split(' ')
			// })
			// console.log(this.res)
		},
		methods: {
			fnShadeClick() {
				this.shade = !this.shade
				console.log(11111)
			},
			tokens() {
				let _this = this;
				// 获取access_token
				uni.request({
					url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=LrVpENLGeR5i8x83MvcxpIkG&client_secret=wKrm49l3IO7AGD2LGjUHTKNDfFfmQze5&',
					success(res) {
						_this.access_token = res.data.access_token
					}
				})
			},
			fnUpLoadClick() {
				let _this = this
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					success: function(res) {
						var filePaths = res.tempFilePaths;
						_this.imgSrc = res.tempFilePaths[0];
						console.log(_this.imgSrc)
						// var sendDate = {
						// 	from: 'zh',
						// 	to: 'en'
						// };
						let imgs = filePaths.map((value, index) => {
							return {
								name: "image",
								uri: value
							}
						});
						uni.uploadFile({
							url: `https://aip.baidubce.com/file/2.0/mt/pictrans/v1?access_token=${_this.access_token}`, // 后端api接口
							filePath: filePaths[0],
							files: imgs, // uni.chooseImage函数调用后获取的本地文件路劲
							name: 'file', //后端通过'file'获取上传的文件对象
							formData: _this.sendDate,
							header: {
								"Content-Type": "multipart/form-data",
							},
							success: (res) => {
								if (res.statusCode == 200) {
									let data = `${res.data}`
									console.log(data)
									let result = JSON.parse(data)
									result.data.content.forEach(item => {
										item.src = unescape(item.src.replace(/\\u/g, '%u'))
									})
									// let form = unescape(result.data.content[0].src.replace(/\\u/g, '%u'));
									// let to = result.data.content[0].dst
									console.log(result)
									_this.res = result
									_this.res.data.content.forEach(item => {
										console.log(item.rect)
										item.rect = item.rect.split(' ')

									})
									_this.fnShadeClick()
									// console.log(`图片上的文字是${form},图片上翻译的结果是${to}`)
								} else {
									console.log(res, "------error-------")
								}
							},
							fail: (err) => {
								console.log(err,
									"------https://aip.baidubce.com/file/2.0/mt/pictrans/v1------"
								)
							}
						})
					},
					fail(err) {
						console.log(err)
						uni.navigateBack({
							delta: 1
						})
					}
				});
			}
		}
	}
</script>

<style>
	.content {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		z-index: 98;
		background-color: rgba(0, 0, 0, 0.4);
	}

	.shade {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		background-color: rgba(0, 0, 0, 0.2);
		/* z-index: 999; */
		z-index: 99;
		height: 3000rpx;
	}



	.position-item {
		background-color: #FFFFFF;
		/* width: 100%; */
		/* height: 40rpx; */

	}
</style>
