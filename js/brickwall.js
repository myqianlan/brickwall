/**
 *
 * @authors myqianlan (linquantan@gmail.com)
 * @date    2015年2月5日16:02:10
 * @version $Id$
 */
/*
 * 1. 获取图片数据，保存图片原始宽高
 * 2. 将保存的数据中的高统一为一个定值，获得其相应的宽
 * 3. 获取容器宽度，设定一个子容器，依次叠加数据，如果宽大于容器宽度，保存。继续下一轮
 * 4. 获取每一个子容器里面内容的宽度，按照父容器宽度比例出高度。然后再次调整每个img的宽度数据；
 * 5. 将数据应用到图片
 */
// resize时 0.5px 误差处理，原因：esize会出现元素宽度表现为带小数的，但是此刻JS获取到的是round过后的整数
;
(function($, window, document, undefined) {
    "use strict";
    var BrickWall = function(ele, opt) {
        this.$el = ele;
        this.defaults = {
            brickMargin: 5,
            rowBaseHeight: 150,
            data: []
        };
        this.options = $.extend({}, this.defaults, opt);
        this.imgData = [];
        this.rowDivs = [];
    }
    BrickWall.prototype = {
        init: function() {
            this.$el.html("");
            var start_time = new Date().getTime();
            this._getImgInfo(this.$el.find("img"));
            this._adjustImgFirst();
            this._addToRow();
            this._adjustImgSecond();
            this._applyDataToImg();
            var diff = new Date().getTime() - start_time;
            console.log(this.imgData);
            console.info("耗时"+diff+"ms");
        },
        _getImgInfo: function($element) {
            var that = this;
            // 1. 获取图片数据，不污染原始数据
            $.extend(true, this.imgData, this.options.data);
            

        },
        _adjustImgFirst: function() {
            var that = this;
            // 2. 将保存的数据中的高统一为一个定值，获得其相应的宽
            $.each(that.imgData, function(index, val) {
                that.imgData[index].width = Math.floor(that.imgData[index].width * (that.options.rowBaseHeight / that.imgData[index].height));
                that.imgData[index].height = that.options.rowBaseHeight;
            });
            
        },
        _addToRow: function() {
            // 3. 获取容器宽度，设定一个子容器，依次叠加数据，如果宽大于容器宽度，保存。继续下一轮
            var that = this;
            var rowImgWidth = 0;
            var rowImgArr = [];
            var margin = that.options.brickMargin * 2;
            for (var i = 0, length = that.imgData.length; i < length; i++) {
                if ((rowImgWidth + that.imgData[i].width + margin) <= that.$el.width()-0.5) {
                    rowImgWidth += that.imgData[i].width + margin;
                    rowImgArr.push(i);

                } else {
                    this.rowDivs.push(rowImgArr);
                    rowImgArr = [];
                    rowImgWidth = that.imgData[i].width + margin;
                    rowImgArr.push(i);
                };
            };
            this.rowDivs.push(rowImgArr);
            
        },
        _adjustImgSecond: function() {
            var that = this;
            var margin = that.options.brickMargin * 2;
            // 4. 获取每一个子容器里面内容的宽度，按照父容器宽度比例出高度。然后再次调整每个img的宽度数据；
            $.each(that.rowDivs, function(index, val) {
                var totle = 0;
                for (var i = val.length - 1; i >= 0; i--) {
                    totle += that.imgData[val[i]].width;

                };
                for (var j = val.length - 1; j >= 0; j--) {
                    that.imgData[val[j]].height = Math.floor((that.$el.width()-0.5 - margin * val.length) / totle * that.imgData[val[j]].height);
                    that.imgData[val[j]].width = Math.floor((that.$el.width()-0.5 - margin * val.length) / totle * that.imgData[val[j]].width);
                };
                var totleEnd = 0;
                for (var m = val.length - 1; m >= 0; m--) {
                    totleEnd += that.imgData[val[m]].width;

                };
                if (val.length) {
                 that.imgData[val[val.length - 1]].width += (that.$el.width()-0.5 - margin * val.length) - totleEnd;   
                };
            });
            
        },
        _applyDataToImg: function() {
            var that = this;       
            // 5.将数据应用到图片
            var $imgTmpl = $("<img />");
                $imgTmpl.addClass("brick-item");
                $imgTmpl.css({
                    "float": "left",
                    "margin": that.options.brickMargin + "px"
                });
            $.each(that.imgData, function(index, val) {
                var $img = $imgTmpl.clone(); 
                 $img.attr({
                     width: that.imgData[index].width,
                     height: that.imgData[index].height,
                     src: that.imgData[index].src
                 });
                 that.$el.append($img);
            });
            that.$el.append("<div style='clear:both;'></div>");

        }
    }

    $.fn.brickwall = function(options) {
        var brickwall = new BrickWall(this, options || {});
        return brickwall.init();
    }
})(jQuery, window, document);