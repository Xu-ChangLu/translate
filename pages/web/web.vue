<template>
    <view class="none">
        <web-view :src="url"></web-view>
    </view>
</template>

<script>
export default {
    data() {
        return { 
			url: "" ,
			};
    },
    methods: {},
    onLoad(o) {
		console.log(o)
        this.url = o.url;
    },
};
</script>
<style lang="scss" scoped>
.none {
    font-size: 32rpx;
}
</style>
