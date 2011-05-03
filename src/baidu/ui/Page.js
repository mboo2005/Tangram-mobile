/**
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import baidu.ui.createUI;
///import baidu.dom.insertHTML;
///import baidu.dom.setStyles;
///import baidu.dom._styleFilter.px;
///import baidu.fx.slide;
///import baidu.ajax.get;
///import baidu.event.turn;

/**
 * 视图页
 * @class Page类
 * @param {Object}              options       选项
 * @returns {Page}                        Page类
 */
baidu.ui.Page = baidu.ui.createUI( function(options) {

}).extend({
    uiType: 'page',
    
    /**
     * 初始化页面
     * @private
     */
    _init: function() {
        var me = this;
        me._updatePage();
        me.on(window, 'turn', '_onTurn');
        me.dispatchEvent('init');
    },
    
    /**
     * 更新页面
     * @private
     */
    _updatePage: function() {
        baidu.dom.setStyles(this.element, {
            width: window.innerWidth,
            height: window.innerHeight,
            position: 'absolute'
        });
    },
    
    /**
     * 翻转事件
     * @param {object} e event对象
     * @private
     */
    _onTurn: function(e) {
        var me = this;
        me._updatePage();
        me.fire('turn', e);
    },
    
    /**
     * 加载页面
     * @param {HTMLElement} page 当前页dom对象
     */
    loadPage: function(page) {
        var me = this;

        if(me.pageUrl && !me.loaded) {
            me.dispatchEvent('loadpage');
            baidu.ajax.get(me.pageUrl, function(xhr, responseText) {
                baidu.dom.insertHTML(me.element, 'beforeend', responseText);
                me.loaded = true;
                me.slide(page, 'left');
                me.dispatchEvent('loadend');
            })
        } else {
            me.slide(page, 'left');
        }
    },
    
    /**
     * 滑动页面
     * @param {HTMLElement} page 当前页面dom对象
     * @param {String} direction 滑动方向
     */
    slide: function(page, direction){
        var me = this;
        
        if(baidu.ui.Page._moving){
            return;
        }
        
        baidu.ui.Page._moving = true;
        me.element.style.display = 'block'

        baidu.fx.slide(page, {
            out: true,
            direction: direction,
            onfinish: function() {
                page.style.display = 'none';
                baidu.ui.Page._moving = false;
            }
        });

        baidu.fx.slide(me.element, {
            direction: direction
        });
    }
});
