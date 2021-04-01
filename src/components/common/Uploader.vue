<template>

  <div v-if="viewType === 1" class="uploader-field uploader-field1">
    <div class="title-box">
      <div class="title" ref="imgTitleHeightDom"><slot name="title">图片</slot></div>
    </div>
    <van-uploader :class="`uploader-box ${fileLst.length > 0? 'had-uploader-box':'no-uploader-box'} ${disabled ? 'view-img-box':''}`"
                  :style="titleHeightStyle"
                  v-model="fileLst"
                  :accept="acceptType"
                  :name="name"
                  :preview-size="previewSize"
                  :preview-image="previewImage"
                  :preview-full-image="previewFullImage"
                  :preview-options="previewOptions"
                  :multiple="multiple"
                  :deletable="deletable"
                  :show-upload="showUpload"
                  :lazy-load="lazyLoad"
                  :after-read="afterReadEvent"
                  :before-delete="beforeDeleteEvent"
                  :max-size="maxSize"
                  :max-count="maxCount"
                  :result-type="resultType"
                  :upload-text="uploadText"
                  :image-fit="imageFit"
                  :upload-icon="uploadIcon"
                  :before-read="beforeReadEvent"
                  @delete="deleteEvent"
                  @oversize="oversizeEvent"
    >
      <div slot="default" class="icon-box">
        <span v-if="!disabled" :class="`icon icon-img ${fileLst.length >= maxCount ? 'no-uploader' : ''}`">&#xe60c;</span>
      </div>
    </van-uploader>
  </div>

  <div v-else-if="viewType === 2" class="uploader-field uploader-field2">
    <div class="title-box file-title-box">
      <div class="title" ref="imgTitleHeightDom"><slot name="title">附件</slot></div>
    </div>
    <van-uploader :class="`uploader-box ${fileLst.length > 0? 'had-uploader-box':'no-uploader-box'}`"
                  :style="titleHeightStyle"
                  v-model="fileLst"
                  :accept="acceptType"
                  :name="name"
                  :preview-size="previewSize"
                  :preview-image="previewImage"
                  :preview-full-image="previewFullImage"
                  :preview-options="previewOptions"
                  :multiple="multiple"
                  :disabled="disabled"
                  :deletable="deletable"
                  :show-upload="showUpload"
                  :lazy-load="lazyLoad"
                  :after-read="afterReadEvent"
                  :before-delete="beforeDeleteEvent"
                  :max-size="maxSize"
                  :max-count="maxCount"
                  :result-type="resultType"
                  :upload-text="uploadText"
                  :image-fit="imageFit"
                  :upload-icon="uploadIcon"
                  :before-read="beforeReadEvent"
                  @delete="deleteEvent">
      <template #preview-cover="{ file }">
        <div class="preview-cover clearfloat van-uploader__preview-file">
          <div class="lf line-block preview-file-icon">
            <span v-if="file.type.indexOf('image') === 0"
                  class="icon icon-doc_img">&#xe600;</span>
            <span v-else class="icon icon-doc">&#xe62c;</span>
          </div>
          <div class="lf file-name">
            <div v-if="file.type.indexOf('image') === 0"
                 class="text-box">
              <span class="text">{{ file.name }}</span>
              <span class="btn pre-btn">预览</span>
            </div>
            <div v-else class="text-box">
              <span class="text">{{file.name}}</span>
              <span v-if="disabled"
                    class="btn pre-btn"
                    @click="onPreviewFile(file)">
                预览
              </span>
            </div>
            <div class="block">
              <span v-if="file.size" class="num">{{Math.floor(file.size / 1024)}}KB</span>
              <a v-if="disabled && file.type.indexOf('image') !== 0"
                 class="btn download-btn"
                 :href="file.url"
                 :download="file.name">
                下载
              </a>
            </div><!-- 处理结果不会四舍五入 -->
          </div>
        </div>
      </template>
      <template icon="plus" type="primary">
        <span class="icon van-uploader__upload-icon">&#xe641;</span>
      </template>
    </van-uploader>
  </div>
</template>
<script>
  import { Uploader, Toast } from 'vant'
  export default {
    name: 'uploader',
    directives: {
    },
    components: {
      [Uploader.name]: Uploader,
      [Toast.name]: Toast
    },
    props: {
      viewType: {
        type: Number,
        default: 1
      }, // 页面的显示类型,1-图片，2-附件
      disabled: Boolean,
      lazyLoad: Boolean,
      uploadText: String,
      afterRead: Function,
      beforeRead: Function,
      beforeDelete: Function,
      previewSize: [Number, String],
      previewOptions: Object,
      name: {
        type: [Number, String],
        default: ''
      },
      accept: {
        type: String,
        default: ''
      },
      value: {
        type: Array,
        default: function _default() {
          return [];
        }
      },
      maxSize: {
        type: [Number, String],
        default: Number.MAX_VALUE
      },
      maxCount: {
        type: [Number, String],
        default: Number.MAX_VALUE
      },
      multiple: {
        type: Boolean,
        default: false
      },
      deletable: {
        type: Boolean,
        default: true
      },
      showUpload: {
        type: Boolean,
        default: true
      },
      previewImage: {
        type: Boolean,
        default: true
      },
      previewFullImage: {
        type: Boolean,
        default: true
      },
      imageFit: {
        type: String,
        default: 'cover'
      },
      resultType: {
        type: String,
        default: 'dataUrl'
      },
      uploadIcon: {
        type: String,
        default: 'photograph'
      }
    },
    data () {
      return {
        titleHeightStyle: null, // 图片 title 的宽度
        acceptType: '', // 上传附件类型
        fileLst: this.value
      }
    },
    created () {
      this.fileLst = this.value
      this.countImgTitleHeight(); // 计算 图片 title 的宽度
      this.setFileAcceptType(); // 设置附件的类型
    },
    methods: {
      // 点击预览文件
      onPreviewFile(file) {
        this.$emit('click-preview-file', file)
      },
      // 计算 图片 title 的宽度
      countImgTitleHeight () {
        setTimeout(() => {
          let h = this.$refs.imgTitleHeightDom.offsetHeight;
          let gap = this.fileLst.length > 0 ? 10 : 0;  // + 10 整个 uploader-box 类 要距离 title 10px
          this.titleHeightStyle={'padding-top': h + gap + 'px'};
        });
      },
      // 设置附件的类型
      setFileAcceptType () {
        if (this.viewType ===1 && !this.accept) {
          this.acceptType = 'image/*'
        } else if (this.viewType ===2 && !this.accept) {
          this.acceptType = 'image/*,.doc,.docx,.xlsx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        }
      },
      // 文件读取完成后的回调函数
      afterReadEvent (e) {
        this.$emit('input', this.fileLst);
        this.$emit('on-change'); // 图片改变
        if (this.afterRead) {
          this.afterRead(e);
        }
      },
      deleteEvent (e) {
        this.$emit('input', this.fileLst);
        this.$emit('on-change'); // 图片改变
        this.$emit("delete", e)
      },
      oversizeEvent(file) {
        console.log(file);
        Toast('文件大小不能超过'+ this.QD.uploadSize + 'M');
      },
      // 文件读取前的回调函数，返回 false 可终止文件读取，支持返回 Promise
      beforeReadEvent() {
        if (this.beforeRead) {
          this.beforeRead();
        } else {
          return true
        }
      },
      // 文件删除前的回调函数，返回 false 可终止文件读取，支持返回 Promise
      beforeDeleteEvent (e) {
        if (this.beforeDelete) {
          this.beforeDelete(e);
        } else {
          return true
        }
      }
    }
  }
</script>
<style lang="less">
  .uploader-field1 .van-uploader__wrapper{
    display: block;
    .van-uploader__preview{
      position: relative;
      display: inline-block;
      margin: 4px 12px 8px 0;
    }
    .van-uploader__input-wrapper{
      position: absolute;
      top: 0;
      right: 0;
      padding: 10px 0;
      word-break: break-all;
    }
    .van-uploader__input{
      right: 0;
      top: 8px;
      width: 28px;
      height: 24px;
      display: inline-block;
      left: auto;
    }
    .van-uploader__file{
      display: block;
      overflow: hidden;
    }
  }
  .uploader-field1 .view-img-box .van-uploader__preview-delete,
  .uploader-field1 .view-img-box .van-uploader__input {
    display: none;
  }
  .uploader-field2 .van-uploader__wrapper{
    display: block;
    opacity: 1;
    .van-uploader__preview{
      position: relative;
      margin: 0;
      padding: 4px 0 8px 0;
    }
    .van-uploader__preview:last-child{
      margin-bottom: 15px;
    }
    .van-uploader__preview-cover{
      position: relative;
    }
    .van-uploader__preview-image{
      width: 100%;
      height: auto;
    }
    .van-image__img, .van-image__error, .van-image__loading {
      display: none;
    }
    .van-uploader__file{
      width: 100%;
      height: auto;
      display: block;
      background-color: transparent;
    }
    .van-uploader__file-name,
    .van-uploader__file-icon {
      display: none;
    }
    .van-uploader__input-wrapper{
      display: flex;
      width: 60px;
      height: 60px;
      margin: 4px 0;
      -webkit-box-align: center;
      -webkit-align-items: center;
      align-items: center;
      -webkit-box-pack: center;
      -webkit-justify-content: center;
      justify-content: center;
      background-color: #f7f8fa;
    }
    .van-uploader__upload-icon {
      fill: #666666;
      font-size: 36px;
    }
  }
  .uploader-field2 .van-uploader__wrapper--disabled.van-uploader__wrapper{
    /* 隐藏上传按钮 */
    .van-uploader__input-wrapper{
      display: none;
    }
    .van-uploader__preview-delete{
      display: none;
    }
  }
</style>
<style scoped lang="less">
  @font-face {
    font-family: 'iconloader';  /* project id 2215290 */
    src: url('//at.alicdn.com/t/font_2215290_pvzc5cj1qiq.eot');
    src: url('//at.alicdn.com/t/font_2215290_pvzc5cj1qiq.eot?#iefix') format('embedded-opentype'),
    url('//at.alicdn.com/t/font_2215290_pvzc5cj1qiq.woff2') format('woff2'),
    url('//at.alicdn.com/t/font_2215290_pvzc5cj1qiq.woff') format('woff'),
    url('//at.alicdn.com/t/font_2215290_pvzc5cj1qiq.ttf') format('truetype'),
    url('//at.alicdn.com/t/font_2215290_pvzc5cj1qiq.svg#iconloader') format('svg');
  }
  .icon{
    font-family: 'iconloader';
    font-size: 40px;
    color: #dfdfe1;
  }
  .block{
    position: relative;
  }
  .lf{
    float: left;
  }
  .line-block{
    display: inline-block;
  }
  .uploader-field{
    position: relative;
    padding: 0 15px;
    line-height: normal;
  }
  .title-box{
    position: absolute;
    top: 0;
    left: 15px;
    right: 45px;
    word-break: break-all;
    .title{
      display: inline-block;
      padding: 10px 0;
      font-size: 16px;
      color: #333333;
    }
  }
  .file-title-box{
    right: 15px;
  }
  .uploader-box{
    width: 100%;
    padding: 36px 0 10px 0;
    .icon-box{
      position: absolute;
      right: 0;
      top: 8px;
    }
    .icon-img{
      display: inline-block;
      font-size: 24px;
      color: #333333;
      padding: 0 0 0 4px;
      z-index: 5;
    }
  }
  .had-uploader-box{
    padding: 46px 0 10px 0;
  }
  .no-uploader-box{
    padding: 36px 0 0 0;
  }
  .no-uploader{
    display: none;
  }
  .van-uploader__preview-file{
    display: flex;
  }
  .file-name{
    display: inline-block;
    flex: 1;
    padding: 0 0 6px 6px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    .text-box{
      position: relative;
      font-size: 16px;
      padding: 0 56px 0 0;
      color: #333333;
    }
    .text{
      display: inline-block;
      width: 100%;
      padding: 0 0 2px 0;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .num{
      font-size: 12px;
      color: #aeaeae;
    }
    .pre-btn{
      display: inline-block;
      position: absolute;
      top: 0;
      right: 20px;
      color: #989898;
      font-size: 12px;
      padding: 2px 6px;
      border: 1px solid #efefef;
      border-radius: 10px;
      z-index: 10;
    }
    .download-btn{
      display: inline-block;
      position: relative;
      margin-left: 20px;
      color: #989898;
      font-size: 12px;
      padding: 2px 6px;
      border: 1px solid #efefef;
      border-radius: 10px;
      z-index: 10;
    }
  }
  .icon-doc_img{
    color: #fddc96;
  }
</style>

