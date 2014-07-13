var Logger = window.Logger || {};

Logger.SlideMenu = function(container, trigger) {
	this.ANIMATION_SPEED = 350;
	this.MENU_WIDTH	= 250;

	this._container = container;

	var me = this;
	$(document).on("click", function () {
		if (me._container.is(":visible"))
			me.hide();
	});

	trigger.on("click", function() {
		me.show();
	});
};

Logger.SlideMenu.build = function(container, trigger) {
	return new Logger.SlideMenu(container, trigger);
};

Logger.SlideMenu.prototype.show = function() {
	var me = this;
	if (me._container.is(":visible"))
		return;

	setTimeout(function() {
		me._container.show().transition({ x: me.MENU_WIDTH }, me.ANIMATION_SPEED, "ease");
	}, 5);
};

Logger.SlideMenu.prototype.hide = function() {
	var me = this;
	this._container.transition({ x: this.MENU_WIDTH*-1 }, this.ANIMATION_SPEED, "ease", function() {
		me._container.hide();
	});
};