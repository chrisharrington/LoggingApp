var Logger = window.Logger || {};

Logger.SlideMenu = function(container) {
	this.HEADER_HEIGHT = 60;
	this.ANIMATION_SPEED = 350;

	this._container = container;

	var me = this;
	$(document).on("click", function () {
		if (me._container.is(":visible"))
			me.hide();
	});
};

Logger.SlideMenu.build = function(container) {
	return new Logger.SlideMenu(container);
};

Logger.SlideMenu.prototype.show = function() {
	var me = this;
	if (me._container.is(":visible"))
		return;

	setTimeout(function() {
		var contentContainer = $(".content-container");
		me._container.show().css({
			top: "-" + (me._container.outerHeight() - me.HEADER_HEIGHT + 10) + "px",
			left: (contentContainer.outerWidth() + contentContainer.position().left - me._container.outerWidth()) + "px"
		}).transition({ y: me._container.outerHeight() + 10 }, me.ANIMATION_SPEED, "ease");
	}, 5);
};

Logger.SlideMenu.prototype.hide = function() {
	var me = this;
	this._container.transition({ y: 0 }, this.ANIMATION_SPEED, "ease", function() {
		me._container.hide();
	});
};