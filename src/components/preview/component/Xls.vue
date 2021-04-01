<!-- 在线预览 demo -->
<template>
  <div class="preview-xls" ref="tableeau"></div>
</template>
<script>
  import XLSX from "xlsx"
  export default {
    name: 'previewXls',
    components: {
    },
    props: {
      fileInfo: { // 文件信息
        type: Object,
        default: null
      }
    },
    data () {
      return {
        tableData: [],
        workbook: {} // pdf 共页数
      }
    },
    created () {
      this.readWorkbookFromRemoteFile();
    },
    methods: {
      // xls
      readWorkbookFromRemoteFile() {
        var xhr = new XMLHttpRequest();
        xhr.open("get", this.fileInfo.url, true);
        xhr.responseType = "arraybuffer";
        let _this = this;
        xhr.onload = function (e) {
          if (xhr.status === 200) {
            var data = new Uint8Array(xhr.response);
            var workbook = XLSX.read(data, { type: "array" });
            console.log(workbook);

            _this.workbook = workbook;
            _this.getTable(workbook.SheetNames[0]);
          }
        };
        xhr.send();
      },
      getTable(sheetName) {
        let worksheet = this.workbook.Sheets[sheetName];
        this.tableData = XLSX.utils.sheet_to_html(worksheet);
        // console.log('tableData=', this.tableData);
        this.$refs.tableeau.innerHTML = this.tableData
      }
    }
  }
</script>
<style lang="less">
  .preview-xls table{
    border-top: 1px solid #c8c8cd;
    border-right: 1px solid #c8c8cd;
    td{
      border-left: 1px solid #c8c8cd;
      border-bottom: 1px solid #c8c8cd;
    }
  }
</style>
