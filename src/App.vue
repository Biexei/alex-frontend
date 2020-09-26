<template>
    <div id="app" class="fillcontain">
		    <router-view :key="$route.name + ($route.params.suiteId || '')"></router-view>
    </div>
</template>

<script>
    export default {
    	
    }
</script>

<style lang="less">
	@import './style/common';
</style>
