
(function ($) {
    $.fn.freeze = function (options) {

        options = $.extend({
            width: 400,
            height: 200,
            cols: 1,
            rows: 1
        }, options || {});

        $(this).filter("table").each(function () {

            var _topLeftWrapper, _colHeaderWrapper, _rowHeaderWrapper;
            var _headerHeight = 0;
            var _headerWidth = 0;

            if ($(this).width() < options.width && $(this).height() < options.height)
                return;
            if ($(this).attr("freeze"))
                return;
            $(this).find("tr:lt(" + options.rows + ")").each(function () {
                _headerHeight = _headerHeight + $(this).height();
            });
            //alert(_headerHeight);

            $(this).find("tr:eq(0)").find("th,td").slice(0, options.cols).each(function () {
                if ($(this).css("display") != "none")
                    _headerWidth = _headerWidth + $(this).outerWidth();
            });

            _headerHeight = _headerHeight;
            _headerWidth = _headerWidth;

            _topLeftWrapper = $("<div></div>")
                            .css({
                                position: "relative",
                                float: "left",
                                zIndex: "0",
                                overflow: "hidden"
                            });

            var _tabCorner = $(this).clone()
                                    .removeAttr("id")
                                    .appendTo(_topLeftWrapper);
            _tabCorner.find(".charttd").empty();

            //$(_tabCorner).find("tr:gt(" + (options.rows - 1) + ")").remove();
            //$(_tabCorner).find("tr:gt(" + (options.rows - 1) + ").chart").remove();
            _colHeaderWrapper = $("<div></div>")
                                    .css({
                                        position: "relative",
                                        zIndex: "0",
                                        overflow: "hidden"
                                    });

            _rowHeaderWrapper = $("<div></div>")
                                    .css({
                                        position: "relative",
                                        zIndex: "0",
                                        overflow: "hidden",
                                        float: "left"
                                    });

            var _tabRowHeader = $(this).clone()
                                   .removeAttr("id")
                                   .appendTo(_rowHeaderWrapper);
            _tabRowHeader.find(".charttd").empty();

            var _tableWrapper = $("<div></div")
                .css({
                    position: "relative",
                    overflow: "auto"
                });

            var _newTable = $(this).clone();
            $(_newTable).attr("freeze", true);

            $(_tableWrapper).append(_newTable);

            var _outerWrapper = $("<div></div>")
                                    .append(_topLeftWrapper)
                                    .append(_colHeaderWrapper)
                                    .append(_rowHeaderWrapper)
                                    .append(_tableWrapper);

            $(this).replaceWith(_outerWrapper);


            $(_topLeftWrapper).css({
                width: _headerWidth + "px",
                height: _headerHeight + "px"
            }).addClass("topLeftWrapper");

            $("tr", _tabCorner).each(function (rowIndex) {
                // $(this).css("height", $(_newTable).find("tr:eq(" + rowIndex + ")").height() + "px");
                $("th,td", this).each(function (cellIndex) {
                    //var width = $("tr", _newTable).eq(rowIndex).find("th,td").eq(cellIndex).width();
                    //$(this).css("width", width + "px");
                });
            });


            $(_colHeaderWrapper).css({
                width: (options.width - _headerWidth) + "px",
                height: _headerHeight + "px"
            }).addClass("colHeaderWrapper");

            var _tabColHeader = $(_tabCorner).clone()
                .css({
                    marginLeft: (-_headerWidth) + "px",
                    //width: $(_newTable).width() + "px"
                    width: "auto"
                })
                .appendTo(_colHeaderWrapper);
            _tabColHeader.find(".charttd").empty();
            //重新计算宽度
            var _colHeaderWidth = 0;
            $(_tabColHeader).find("tr:eq(0)").find("th,td").slice(0, options.cols).each(function () {
                if ($(this).is(":visible"))
                    _colHeaderWidth = _colHeaderWidth + $(this).outerWidth();
            });
            _tabColHeader.css("marginLeft", (-_colHeaderWidth) + "px");


            $(_colHeaderWrapper).css("width", (options.width - _colHeaderWidth - 16) + "px");
            /**/

            $("tr", _tabCorner).each(function (rowIndex) {
                //$(this).find("th,td").slice(options.cols).remove();
            });
            //$(_tabCorner).css("width", _headerWidth + "px");
            $(_tabCorner).css("width", "auto");

            $(_tabRowHeader).find("tr").each(function (rowIndex) {
                //$(this).find("td,th").slice(options.cols).remove();
                $("td,th", this).each(function (cellIndex) {
                    //$(this).css("width", $("tr", _newTable).eq(rowIndex).find("td,th").eq(cellIndex).outerWidth() + "px");
                });
            });

            $(_rowHeaderWrapper).css({
                height: $(_newTable).width() <= options.width ? (options.height - _headerHeight) + "px" : (options.height - _headerHeight - 16) + "px",
                width: _headerWidth + "px"
            }).addClass("rowHeaderWrapper");

            $(_tabRowHeader).css({
                //width: _headerWidth + "px",
                width: "auto",
                marginTop: (-_headerHeight) + "px"
            });

            $(_tableWrapper).css({
                width: (options.width - _colHeaderWidth) + "px",
                height: (options.height - _headerHeight) + "px"
            }).scroll(function () {
                var _colHeaderWidth = 0;
                $(_tabColHeader).find("tr:eq(0)").find("th,td").slice(0, options.cols).each(function () {
                    if ($(this).css("display") != "none")
                        _colHeaderWidth = _colHeaderWidth + $(this).outerWidth();
                });
                $(_tabColHeader).css("marginLeft", (-$(this).scrollLeft() - _colHeaderWidth) + "px");
                $(_tabRowHeader).css("marginTop", (-$(this).scrollTop() - _headerHeight) + "px");
            });

            $(_newTable).css({
                marginLeft: (-_colHeaderWidth) + "px",
                marginTop: -_headerHeight + "px"
            });

            $(_newTable).find("tr:eq(0)").find("td,th").each(function (index) {
                //$(this).css("width", $(_tabColHeader).find("tr:eq(0)").find("td,th").eq(index).outerWidth() + "px");
            });

            $("tr", _newTable).each(function (index) {
                var _headerRowHeight = $("tr", _tabRowHeader).eq(index).height();
                var _tableRowHeight = $(this).height();
                if (_headerRowHeight > _tableRowHeight)
                    $(this).css("height", _headerRowHeight + "px");
                //else
                //    $("tr", _tabRowHeader).eq(index).css("height", _tableRowHeight + "px");
            });


        });

    };
})(jQuery);

