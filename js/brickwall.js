/**
 *
 * @authors myqianlan (linquantan@gmail.com)
 * @date    2015年2月4日16:57:53
 * @version $Id$
 */
/*
 * 1. 获取图片数据，保存图片原始宽高
 * 2. 将保存的数据中的高统一为一个定值，获得其相应的宽
 * 3. 获取容器宽度，设定一个子容器，依次叠加数据，如果宽大于容器宽度，保存。继续下一轮
 * 4. 获取每一个子容器里面内容的宽度，按照父容器宽度比例出高度。然后再次调整每个img的宽度数据；
 * 5. 将数据应用到图片
 * 6. 渲染到页面
 */


;
(function($, window, document, undefined) {
    "use strict";
    var BrickWall = function(ele, opt) {
        this.$el = ele;
        this.defaults = {
            brickMargin: 10,
            rowBaseHeight: 250,

        };
        console.info(opt);
        this.options = $.extend({}, this.defaults, opt);
        this.imgData = {
            width: [],
            height: []
        };
        this.rowDivs = [];
    }
    BrickWall.prototype = {
        init: function() {

            console.info("--------------------init--------------------------");
            console.log("Hello Brick Wall");
            this._getImgInfo(this.$el.find("img"));
            this._adjustImgFirst(this.imgData);
            this._addToRow();
            this._adjustImgSecond();
            this._applyDataToImg();
            this._render();
            console.info("////////////////////////DATA////////////////////////////");
            console.info(this.imgData);
        },
        _getImgInfo: function($element) {
            var that = this;
            console.info("--------------------getImgInfo--------------------------");
            // 1. 获取图片数据，保存图片原始宽高
            $.each($element, function(index, val) {
                that.imgData.width[index] = $(val).width();
                that.imgData.height[index] = $(val).height();
            });

        },
        _adjustImgFirst: function(data) {
            console.info("--------------------adjustImgFirst--------------------------");
            var that = this;
            // 2. 将保存的数据中的高统一为一个定值，获得其相应的宽
            $.each(data.height, function(index, val) {

                data.width[index] = Math.floor(data.width[index] * (that.options.rowBaseHeight / data.height[index]));
                data.height[index] = that.options.rowBaseHeight;
            });
        },
        _addToRow: function() {
            // 3. 获取容器宽度，设定一个子容器，依次叠加数据，如果宽大于容器宽度，保存。继续下一轮
            console.info("--------------------addToRow--------------------------");
            var that = this;
            var rowImgWidth = 0;
            var rowImgArr = [];

            for (var i = 0, length = that.imgData.width.length; i < length; i++) {

                if ((rowImgWidth + that.imgData.width[i]) <= that.$el.width()) {
                    rowImgWidth = rowImgWidth + that.imgData.width[i];
                    rowImgArr.push(i);

                } else {
                    this.rowDivs.push(rowImgArr);
                    rowImgArr = [];
                    rowImgWidth = that.imgData.width[i];
                    rowImgArr.push(i);
                };
            };
            this.rowDivs.push(rowImgArr);
            console.info(that.$el.width());
            console.info(that.rowDivs);
        },
        _adjustImgSecond: function() {
            var that = this;
            // 4. 获取每一个子容器里面内容的宽度，按照父容器宽度比例出高度。然后再次调整每个img的宽度数据；
            console.info("--------------------adjustImgSecond--------------------------");
            $.each(that.rowDivs, function(index, val) {
                /* iterate through array or object */
                console.info(val);
                var totle = 0;
                for (var i = val.length - 1; i >= 0; i--) {
                    totle = totle + that.imgData.width[val[i]];

                };
                for (var j = val.length - 1; j >= 0; j--) {
                    that.imgData.height[val[j]] = Math.floor(that.$el.width() / totle * that.imgData.height[val[j]]);
                    that.imgData.width[val[j]] = Math.floor(that.$el.width() / totle * that.imgData.width[val[j]]);
                };
            });
        },
        _applyDataToImg: function() {
            var that = this;
            // 5.将数据应用到图片
            console.info("--------------------applyDataToImg--------------------------");
            $.each(this.$el.find("img"), function(index, val) {
                /* iterate through array or object */
                console.info(val);
                $(val).css({
                    width: that.imgData.width[index],
                    height: that.imgData.height[index]
                })
            });
        },
        _render: function() {
            console.info("--------------------render--------------------------");
                this.$el.find(".brick-item").css("float", "left");
                this.$el.append("<div style='clear:both;'></div>");
  
        },
        _update: function(opt) {
            this.options = $.extend({}, this.defaults, opt);
        }
    }

    $.fn.brickwall = function(options) {
        var brickwall = new BrickWall(this, options || {});
        //调用其方法
        return brickwall.init();
    }
})(jQuery, window, document);