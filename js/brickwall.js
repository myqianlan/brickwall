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

;
(function($, window, document, undefined) {
    "use strict";
    var BrickWall = function(ele, opt) {
        this.$el = ele;
        this.defaults = {
            brickMargin: 5,
            rowBaseHeight: 150
        };
        this.options = $.extend({}, this.defaults, opt);
        this.imgData = {
            width: [],
            height: []
        };
        this.rowDivs = [];
    }
    BrickWall.prototype = {
        init: function() {
            this._getImgInfo(this.$el.find("img"));
            this._adjustImgFirst();
            this._addToRow();
            this._adjustImgSecond();
            this._applyDataToImg();
        },
        _getImgInfo: function($element) {
            var that = this;
            // 1. 获取图片数据，保存图片原始宽高
            $.each($element, function(index, val) {
                that.imgData.width[index] = $(val).width();
                that.imgData.height[index] = $(val).height();
            });

        },
        _adjustImgFirst: function() {
            var that = this;
            // 2. 将保存的数据中的高统一为一个定值，获得其相应的宽
            $.each(that.imgData.height, function(index, val) {

                that.imgData.width[index] = Math.floor(that.imgData.width[index] * (that.options.rowBaseHeight / that.imgData.height[index]));
                that.imgData.height[index] = that.options.rowBaseHeight;
            });
        },
        _addToRow: function() {
            // 3. 获取容器宽度，设定一个子容器，依次叠加数据，如果宽大于容器宽度，保存。继续下一轮
            var that = this;
            var rowImgWidth = 0;
            var rowImgArr = [];
            var margin = that.options.brickMargin * 2;
            for (var i = 0, length = that.imgData.width.length; i < length; i++) {

                if ((rowImgWidth + that.imgData.width[i] + margin) <= that.$el.width()) {
                    rowImgWidth += that.imgData.width[i] + margin;
                    rowImgArr.push(i);

                } else {
                    this.rowDivs.push(rowImgArr);
                    rowImgArr = [];
                    rowImgWidth = that.imgData.width[i] + margin;
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
                    totle += that.imgData.width[val[i]];

                };
                for (var j = val.length - 1; j >= 0; j--) {
                    that.imgData.height[val[j]] = Math.floor((that.$el.width() - margin * val.length) / totle * that.imgData.height[val[j]]);
                    that.imgData.width[val[j]] = Math.floor((that.$el.width() - margin * val.length) / totle * that.imgData.width[val[j]]);
                };
                var totleEnd = 0;
                for (var m = val.length - 1; m >= 0; m--) {
                    totleEnd += that.imgData.width[val[m]];

                };
                that.imgData.width[val[val.length - 1]] += (that.$el.width() - margin * val.length) - totleEnd;
            });
        },
        _applyDataToImg: function() {
            var that = this;
            // 5.将数据应用到图片
            that.$el.find(".brick-item").css({
                "float": "left",
                "margin": that.options.brickMargin + "px"
            });
            that.$el.append("<div style='clear:both;'></div>");
            $.each(this.$el.find("img"), function(index, val) {
                $(val).css({
                    width: that.imgData.width[index],
                    height: that.imgData.height[index]
                })
            });
        },
        _update: function(opt) {
            this.options = $.extend({}, this.defaults, opt);
            console.info("message");
        }
    }

    $.fn.brickwall = function(options) {
        var brickwall = new BrickWall(this, options || {});
        return brickwall.init();
    }
})(jQuery, window, document);