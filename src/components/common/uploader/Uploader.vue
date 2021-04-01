<template>
  <div v-if="viewType === 1" class="van-uploader__wrapper">
    <div class="uploader-title img-uploader__upload">
      <div class="title">
        <slot name="title">图片</slot>
      </div>
      <div :class="`img-uploader-icon line-block ${fileList.length < maxCount && !disabled ? '' : 'upload-disabled1'}`">
        <span class="icon icon-img">&#xe60c;</span>
        <input :fit="imageFit"
               ref="input"
               type="file"
               :accept="acceptType"
               :width="previewSize"
               :height="previewSize"
               :lazyLoad="lazyLoad"
               :disabled="fileList.length >= maxCount ? true : disabled"
               @change="onChange($event)"
               class="van-uploader__input" />
      </div>
    </div>

    <div v-if="previewImage" class="preview-img-box clearfloat">
      <div class="van-uploader__preview preview-img lf line-block"
           v-for="(item, index) in fileList" :key="index">
        <div @click="previewEvent(index)"
             class="van-image van-uploader__preview-image"
             :style="previewSizeStyle">
          <img :src="item.content || item.url"
               :fit="imageFit"
               :lazyLoad="lazyLoad"
               class="van-image__img preview-cell" style="object-fit: cover;"/>
        </div>
        <div class="van-uploader__preview-delete img-preview-delete" @click="onDelete(item, index)">
          <span class="icon van-uploader__preview-delete-icon">&#xe614;</span>
        </div>
      </div>
    </div>
    <!-- 预览 -->
    <div v-transfer-dom>
      <previewer v-if="viewLoaded" :list="previewImgLst" ref="previewer" :options="options"></previewer>
    </div>
  </div>

  <div v-else-if="viewType === 2" class="van-uploader__wrapper">

    <div class="uploader-title file-uploader__upload">
      <div class="title">
        <slot name="title">附件</slot>
      </div>
    </div>

    <div v-if="previewImage" class="preview-file-box clearfloat" :class="`${fileList.length < maxCount && !disabled ? '' : 'ban-add-file'}`">
      <div class="van-uploader__preview preview-file"
           v-for="(item, index) in fileList" :key="index">
        <div class="van-uploader__preview-file preview-cell clearfloat">
          <div class="lf line-block preview-file-icon">
            <span v-if="(item.content && item.content.indexOf('data:image') === 0) || (item.url && item.type.indexOf('image') === 0)"
                  class="icon icon-doc_img">&#xe600;</span>
            <span v-else class="icon icon-doc">&#xe62c;</span>
          </div>
          <div class="lf file-name">
            <p v-if="(item.content && item.content.indexOf('data:image') === 0) || (item.url && item.type.indexOf('image') === 0)"
               class="text-box">
              <span class="text">{{item.file.name}}</span>
              <span class="btn pre-btn"
                    @click="onPreviewImg(item)">预览</span>
            </p>
            <p v-else class="text-box doc-text-box">
              <span class="text">{{item.file.name}}</span>
              <span v-if="fileList.length >= maxCount || disabled"
                    class="btn pre-btn"
                    @click="onPreviewFile(item)">预览</span>
            </p>
            <p v-if="item.file.size" class="num">{{Math.floor((item.file.size / 1024)*100) / 100}}KB</p><!-- 处理结果不会四舍五入 -->
          </div>

        </div>
        <div class="van-uploader__preview-delete disabled2-icon" @click="onDelete(item, index)">
          <span class="icon van-uploader__preview-delete-icon">&#xe614;</span>
        </div>
      </div>
    </div>

    <div :class="`van-uploader__upload ${fileList.length < maxCount && !disabled ? '' : 'upload-disabled2'}`">
      <span class="icon van-uploader__upload-icon">&#xe641;</span>
      <input :fit="imageFit"
             ref="input"
             type="file"
             :accept="acceptType"
             :width="previewSize"
             :height="previewSize"
             :lazyLoad="lazyLoad"
             :disabled="fileList.length >= maxCount ? true : disabled"
             @change="onChange($event)"
             class="van-uploader__input" />
    </div>

    <!-- 预览 -->
    <div v-transfer-dom>
      <previewer v-if="viewLoaded" :list="previewImgLst" ref="previewer" :options="options2"></previewer>
    </div>
  </div>
</template>
<script>
  import { Previewer, TransferDom } from 'vux'
  var _utils2 = require("./utils2");
  var _utils = require("./utils");
  export default {
    name: 'uploader',
    directives: {
      TransferDom
    },
    components: {
      Previewer
    },
    props: {
      viewType: {
        type: Number,
        default: 1
      }, // 页面的显示类型,1-图片，2-附件
      disabled: {
        type: Boolean,
        default: false
      },
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
        viewLoaded: false,
        fileList: this.value,
        acceptType: '', // 上传附件类型
        previewImgLst: [], // 预览大的图片数组
        previewSizeStyle: null, // 图片的尺寸大小
        addSizeStyle: null, // 上传按钮的尺寸大小
        options: {
          getThumbBoundsFn (index) {
            let thumbnail = document.querySelectorAll('.van-uploader__preview.preview-img')[index];
            // get window scroll Y
            let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
            // optionally get horizontal scroll
            // get position of element relative to viewport
            let rect = thumbnail.getBoundingClientRect()
            // w = width
            return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
            // Good guide on how to get element coordinates:
            // http://javascript.info/tutorial/coordinates
          }
        },
        options2: {
          getThumbBoundsFn (index) {
            let thumbnail = document.querySelectorAll('.van-uploader__preview.preview-file')[index];
            let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
            let rect = thumbnail.getBoundingClientRect();
            return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
          }
        }
      }
    },
    created () {
      this.setFileAcceptType(); // 设置附件的类型
      this.setSizeStyle(); // 设置附件尺寸大小
    },
    methods: {
      // 设置附件的类型
      setFileAcceptType () {
        if (this.viewType ===1 && !this.accept) {
          this.acceptType = 'image/*'
        } else if (this.viewType ===2 && !this.accept) {
          this.acceptType = 'image/*,.doc,.docx,.xlsx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        }
      },
      // 点击预览大图
      previewEvent (index) {
        this.viewLoaded = false;
        let imgNum = 0; // img 数
        let fileNum = 0; // file 数
        let preImgIndex = -1; // 预览图片的位置
        this.previewImgLst = [];
        // 拿到预览的图片
        for (let i=0; i<this.fileList.length; i++) {
          let item = this.fileList[i];
          if (item.content && item.content.indexOf('data:image') === 0) {
            if (index >= i) {
              imgNum ++;
            }
            this.previewImgLst.push({src: item.content})
          } else if (item.url) {
            if (index >= i) {
              imgNum ++;
            }
            this.previewImgLst.push({src: item.url});
          } else {
            if (index >= i) {
              fileNum ++;
            }
          }
        }
        if (imgNum === index + 1) { // 图片数和点击的位置一样
          preImgIndex = index;
        } else if (fileNum + imgNum === index + 1){ // file 数+ 图片数 = 点击的位置
          preImgIndex = index - fileNum;
        }
        this.viewLoaded = true;
        this.$nextTick(() => {
          this.$refs.previewer.show(preImgIndex);
        });
      },
      // 点击放大附件中的图片
      onPreviewImg (item) {
        this.viewLoaded = false;
        this.previewImgLst = [];
        if (item.content && item.content.indexOf('data:image') === 0) {
          this.previewImgLst.push({src: item.content})
        } else if (item.url) {
          this.previewImgLst.push({src: item.url});
        }
        this.viewLoaded = true;
        this.$nextTick(() => {
          this.$refs.previewer.show(0);
        });
      },
      // 点击预览文件
      onPreviewFile(item) {
        this.$emit('click-preview-file', item)
      },
      setSizeStyle () {
        if (this.previewSize) {
          this.previewSizeStyle = {width: this.previewSize+'px', 'height': this.previewSize+'px'};
          this.addSizeStyle = {width: this.previewSize+'px', 'height': this.previewSize+'px'}
        }
      },
      onDelete (file, index) {
        var _this4 = this;

        if (this.beforeDelete) {
          var response = this.beforeDelete(file, this.getDetail(index));

          if (!response) {
            return;
          }

          if ((0, _utils.isPromise)(response)) {
            response.then(function () {
              _this4.deleteFile(file, index);
            }).catch(_utils.noop);
            return;
          }
        }

        this.deleteFile(file, index);
      },
      deleteFile (file, index) {
        var fileList = this.fileList.slice(0);
        fileList.splice(index, 1);
        this.fileList.splice(index, 1);
        this.$emit('input', fileList);
        this.$emit('delete', file, this.getDetail(index));
      },
      getDetail (index) {
        if (index === void 0) {
          index = this.fileList.length;
        }
        return {
          name: this.name,
          index: index
        };
      },
      resetInput() {
        /* istanbul ignore else */
        if (this.$refs.input) {
          this.$refs.input.value = '';
        }
      },
      onChange(event) {
        var _this = this;

        var files = event.target.files;

        if (this.disabled || !files.length) {
          return;
        }

        files = files.length === 1 ? files[0] : [].slice.call(files);

        if (this.beforeRead) {
          var response = this.beforeRead(files, this.getDetail());

          if (!response) {
            this.resetInput();
            return;
          }

          if ((0, _utils.isPromise)(response)) {
            response.then(function (data) {
              if (data) {
                _this.readFile(data);
              } else {
                _this.readFile(files);
              }
            }).catch(this.resetInput);
            return;
          }
        }

        this.readFile(files);
      },
      readFile (files) {
        var _this2 = this;

        var oversize = (0, _utils2.isOversize)(files, this.maxSize);

        if (Array.isArray(files)) {
          var maxCount = this.maxCount - this.fileList.length;

          if (files.length > maxCount) {
            files = files.slice(0, maxCount);
            this.fileList = files;
          }

          Promise.all(files.map(function (file) {
            return (0, _utils2.readFile)(file, _this2.resultType);
          })).then(function (contents) {
            var fileList = files.map(function (file, index) {
              var result = {
                file: file,
                status: '',
                message: ''
              };

              if (contents[index]) {
                result.content = contents[index];
              }

              return result;
            });

            _this2.onAfterRead(fileList, oversize);
          });
        } else {
          (0, _utils2.readFile)(files, this.resultType).then(function (content) {
            var result = {
              file: files,
              status: '',
              message: ''
            };

            if (content) {
              result.content = content;
            }

            _this2.onAfterRead(result, oversize);
          });
        }
      },
      onAfterRead (files, oversize) {
        var _this3 = this;

        this.resetInput();
        var validFiles = files;

        if (oversize) {
          var oversizeFiles = files;

          if (Array.isArray(files)) {
            oversizeFiles = [];
            validFiles = [];
            files.forEach(function (item) {
              if (item.file) {
                if (item.file.size > _this3.maxSize) {
                  oversizeFiles.push(item);
                } else {
                  validFiles.push(item);
                }
              }
            });
          } else {
            validFiles = null;
          }

          this.$emit('oversize', oversizeFiles, this.getDetail()); // 文件大小超过限制时触发
        }

        var isValidFiles = Array.isArray(validFiles) ? Boolean(validFiles.length) : Boolean(validFiles);

        this.fileList.push(validFiles);

        if (isValidFiles) {
          this.$emit('input', this.fileList); // [].concat(this.fileList, (0, _utils2.toArray)(validFiles))
          if (this.afterRead) {
            this.afterRead(validFiles, this.getDetail());
          }
        }
      }
    }
  }
</script>
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
  .lf{
    float: left;
  }
  .line-block{
    display: inline-block;
  }
  .van-uploader__wrapper {
    position: relative;
  }
  .van-uploader__preview {
    position: relative;
    margin: 4px 12px 8px 0;
    cursor: pointer;
  }
  .preview-file-box,
  .preview-img-box{
    padding: 10px 15px;
  }
  .preview-file{
    margin: 0;
    padding: 4px 0 8px 0;
  }
  .van-uploader__preview-file{
    display: flex;
  }
  .van-uploader__preview-image{
    display: block;
    overflow: hidden;
    width: 80px;
    height: 80px;
  }
  .van-uploader__preview-delete{
    position: absolute;
    top: 2px;
    right: 0;
    width: 18px;
    height: 18px;
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 0 0 0 18px;
  }
  .preview-img .van-uploader__preview-delete{
    top: 0;
  }
  .van-image__img,
  .van-image__error, .van-image__loading {
    display: block;
    width: 100%;
    height: 100%;
  }
  .van-uploader__preview-delete-icon {
    position: absolute;
    top: -4px;
    right: -4px;
    fill: #ffffff;
    font-size: 22px;
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
  }
  .file-name{
    display: inline-block;
    flex: 1;
    padding: 2px 0 6px 6px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    .text-box{
      position: relative;
      font-size: 16px;
      padding: 0 56px 0 0;
      color: #333333;
    }
    .text-box.doc-text-box{
      padding: 0 20px 0 0;
    }
    .text{
      display: inline-block;
      width: 100%;
      padding: 0 0 4px 0;
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
  }
  .ban-add-file {
    .text-box.doc-text-box{
      padding: 0 56px 0 0;
    }
    .disabled2-icon{
      display: none;
    }
  }
  .van-uploader__upload{
    display: flex;
    position: relative;
    box-sizing: border-box;
    width: 60px;
    height: 60px;
    margin: 4px 15px;
    background-color: #f7f8fa;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
}
.van-uploader__input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: pointer;
  opacity: 0;
}
  .van-uploader__upload-icon {
    fill: #666666;
    font-size: 36px;
  }
  .upload-disabled2{
    display: none;
  }
  .uploader-title{
    position: relative;
    padding: 10px 15px;
    word-break: break-all;
    .title{
      display: inline-block;
    }
  }
  .img-uploader__upload .title{
    padding-right: 30px;
  }

  .img-uploader-icon{
    position: absolute;
    right: 15px;
    .icon-img{
      font-size: 24px;
      color: #333333;
      padding: 0 0 0 4px;
    }
  }
  .upload-disabled1{
    display: none
  }
  /* 附件 的样式 */
  .preview-file-icon{
    width: 40px;
    height: 40px;
  }
  .icon-doc_img{
    color: #fddc96;
  }
</style>
