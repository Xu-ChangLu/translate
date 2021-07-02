<template>
	<view class="content">
		<view class="result">
			<view class="result-item" v-for="(item,index) in resultList" :key="index">
				<view class="result-form" @click="fnResultClick(item)">
					<view class="">
						{{item.src}}
					</view>
					<text class="" style="margin-top: 20rpx;" selectable="true">
						{{item.dst}}
					</text>
				</view>
				<view class="" @click="fnEnshrineClick(item,index)">
					<u-image v-if="item.status== 0" width="40rpx" height="40rpx" src="../../static/star-1.png"
						mode="aspectFit"></u-image>
					<u-image v-else width="40rpx" height="40rpx" src="../../static/star-2.png" mode="aspectFit">
					</u-image>
				</view>
			</view>

		</view>
		<view class="nodata" v-if="resultList.length <= 0">
			<u-image width="300rpx" height="300rpx" src="../../static/star-3.png" mode="aspectFit"></u-image>
			<view class="nodata-text">
				暂无数据
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				resultList: []
			}
		},
		onLoad(options) {
			var val = uni.getStorageSync('translate-history')
			console.log(val)
			let data = val == '' ? [] : val;
			if (data.length > 0) {
				data.forEach(item=>{
					if(item.status){
						this.resultList.push(item)
					}
				})
			}

		},
		methods: {
			fnResultClick(item) {
				console.log(item.src)
			},
			fnRemoveHistory() {


			},
			fnEnshrineClick(item, index) {
				// console.log(item.status)
				let data = uni.getStorageSync('translate-history');
				data.forEach(val => {
					if (val.src == item.src) {
						val.status = false
					}
				})
				console.log(data)
				uni.setStorageSync('translate-history', data);
				// var val = uni.getStorageSync('translate-history')
				// console.log(val)
				// let data = val == '' ? [] : val;
				let a = [];
				if (data.length > 0) {
					data.forEach(item=>{
						if(item.status){
							a.push(item);
						}
					})
				}
				this.resultList = a;
				// console.log(item, index)
				// this.resultList[index].status = !this.resultList[index].status
				// // uni.setStorageSync('translate-history', this.resultList);
				// var history = uni.getStorageSync('translate-history', this.resultList);
				// // history.forEach(value=>{
				// // 	if(item.src == value.src){
				// // 		value.status = false
				// // 		console.log(item,value,'asdsbkdfsjvdfhb')
				// // 	}
				// // })

				// for (let i = 0; i < history.length; i++) {
				// 	if (history[i].src == item.src) {
				// 		history[i].status = false;
				// 		break
				// 	}
				// }

				// console.log(history, "-----------")
				// let data = []
				// this.resultList.forEach(item => {
				// 	if (item.status == 1) {
				// 		data.push(item)

				// 	}
				// })


				// uni.setStorageSync('translate-history', history);
				// uni.setStorageSync('translate-favorite', data);
				// this.resultList = uni.getStorageSync('translate-favorite')
				// // var favorite = uni.getStorageSync('translate-favorite');
				// // console.log(favorite)
			},
		}
	}
</script>

<style scoped lang="scss">
	.content {
		padding: 30rpx;
		padding-top: 5rpx;
	}

	.result {
		// padding: 0 30rpx;
		border-top: 1rpx solid #f1f1f1;

		&-item {
			display: flex;
			justify-content: space-between;
			margin: 30rpx 0;
			border-bottom: 1rpx solid #f1f1f1;
			padding: 0 0 30rpx 0;
		}

		&-form {
			// width: 500rpx;
		}

		&-header {
			display: flex;
			justify-content: space-between;
		}

	}

	.nodata {
		position: fixed;
		top: 25%;
		left: 50%;
		transform: translateX(-50%);

		&-text {
			text-align: center;
			margin-top: 40rpx;
			font-size: 42rpx;
		}
	}
</style>
