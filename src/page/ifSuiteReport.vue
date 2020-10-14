<template>
	<div class="fillcontain">
	</div>
</template>
<script>
import headTop from "../components/headTop";
import {checkDb } from "@/api/getData";
export default {
  data() {
    return {
	  suiteId: this.$route.query.suiteId,
      suiteLogNo: this.$route.query.suiteLogNo,  
	}
  },
  components: {

  },
  mounted() {
    
  },
  methods: {

  }
}
</script>

<style lang="less">
@import "../style/mixin";

</style>
