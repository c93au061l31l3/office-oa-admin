<template>
    <div class="app-container">
      <h3>show</h3>
    </div>
    

</template>

<script>
import api from '@/api/process'
export default {
  name: "process",

  data() {
    return {
      taskId: 0,
      process: { },
      formValues: {},
      processRecordList: [],
      isApprove: false
    };
  },

  created(){
    this.taskId = this.$route.params.taskId;
    let id = this.$route.params.id;
    this.fetchData(id)
  },

  methods: {
    fetchData(id) {
        api.show(id).then(response => {
            console.log(response.data.process)
            this.process = response.data.process
            this.formValues = JSON.parse(this.process.formValues)
            this.processRecordList = response.data.processRecordList
            this.isApprove = response.data.isApprove
      })
    }
  }
}
</script>

