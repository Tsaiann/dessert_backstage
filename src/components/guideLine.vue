<template>
  <div class="guide_line row horizontal space_between">
    <p>{{ pageName }}</p>
    <div data-space-right="1rem">
      <el-button type="info" plain size="small">變更密碼</el-button>
      <el-button type="info" plain size="small">登出</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'GuideLine',
  props: {
    msg: String
  },
  setup(props) {
    const pageName = props.msg

    return {
      pageName
    }
  }
}
</script>
