/*
Ajax Profile
Author: sre 2012
 
Drop in script to profile the ajax page life cycle
 
Base: http://msdn.microsoft.com/en-us/library/bb386417.aspx
*/

var AjaxProfiler = (function () {

    var instantiated;
    var timingMode;

    function clear() {
        $get('ClientEvents').innerHTML = "";
    }

    function initHtml() {
        var _body = document.getElementsByTagName('body')[0];

        // content div
        var _div = document.createElement('div');
        _div.id = "ClientEvents";

        // visible wrapper to be toggled
        var _visible_wrapper = document.createElement('div');
        _visible_wrapper.id = "ajaxprofiler_visible_wrapper";
        _visible_wrapper.appendChild(_div);

        // clear button
        var _clear = document.createElement('input');
        _clear.onclick = function () {
            AjaxProfiler.clear();
        };
        _clear.type = "button";
        _clear.value = "clear";

        // toggle button
        var _toggle = document.createElement('input');
        _toggle.onclick = function () {
            $('#ajaxprofiler_visible_wrapper').toggle();
        };
        _toggle.type = "button";
        _toggle.value = "toggle";

        // timing button
        var _timing = document.createElement('input');
        _timing.onclick = function () {
            AjaxProfiler.toggleTimingMode();
        };
        _timing.type = "button";
        _timing.value = "timing";



        // all wrapper
        var _wrapper = document.createElement('div');
        _wrapper.id = "ajaxprofiler_wrapper";
        _wrapper.style.cssText = "width:100%; background:#EEE; margin: 2px;";

        _wrapper.appendChild(_visible_wrapper);
        _wrapper.appendChild(_toggle);
        _wrapper.appendChild(_clear);
        _wrapper.appendChild(_timing);

        document.body.insertBefore(_wrapper, document.body.firstChild);
    }

    function initEvents() {
        // Hook up Application event handlers.
        var app = Sys.Application;
        app.add_load(ApplicationLoad);
        app.add_init(ApplicationInit);
        app.add_disposing(ApplicationDisposing);
        app.add_unload(ApplicationUnload);

        // Application event handlers for component developers.
        function ApplicationInit(sender) {
            var PageRequestManager = Sys.WebForms.PageRequestManager.getInstance();
            if (!PageRequestManager.get_isInAsyncPostBack()) {
                PageRequestManager.add_initializeRequest(InitializeRequest);
                PageRequestManager.add_beginRequest(BeginRequest);
                PageRequestManager.add_pageLoading(PageLoading);
                PageRequestManager.add_pageLoaded(PageLoaded);
                PageRequestManager.add_endRequest(EndRequest);
            }
            LogItem("Application", "Application init");
        }
        function ApplicationLoad(sender, args) {
            LogItem("Application", "Application load");
            LogItem("Application", "(isPartialLoad = " + args.get_isPartialLoad() + ")");

        }
        function ApplicationUnload(sender) {
            LogItem("Application", "Application unload");
        }
        function ApplicationDisposing(sender) {
            LogItem("Application", "Application disposing");

        }

        // Application event handlers for page developers.
        function pageLoad() {
            LogItem("Page", "Page Load");
        }
        function pageUnload() {
            LogItem("Page", "Page unload");
        }


        var _gap;
        // PageRequestManager event handlers.
        function InitializeRequest(sender, args) {
            $get('ClientEvents').innerHTML += "<hr/>";
            LogItem("PageRequestManager", "Initializing async request");
            _gap = StartLog();
        }

        function BeginRequest(sender, args) {
            EndLog(_gap, "Init-Begin");
            LogItem("PageRequestManager", "Begin processing async request");
            _gap = StartLog();
        }

        function PageLoading(sender, args) {
            EndLog(_gap, "Begin-Loading");
            LogItem("PageRequestManager", "Loading results of async request");

            var updatingPanels = args.get_panelsUpdating();
            var deletedPanels = args.get_panelsDeleting();
            LogItem("PageRequestManager", printArray("PanelsUpdating", updatingPanels));
            LogItem("PageRequestManager", printArray("PanelsDeleting", deletedPanels));

            _gap = StartLog();
        }

        function PageLoaded(sender, args) {
            EndLog(_gap, "Loading-Loaded");
            LogItem("PageRequestManager", "Finished loading results of async request");

            var updatedPanels = args.get_panelsUpdated();
            var createdPanels = args.get_panelsCreated();
            LogItem("PageRequestManager", printArray("PanelsUpdated", updatedPanels));
            LogItem("PageRequestManager", printArray("PaneslCreated", createdPanels));

            _gap = StartLog();
        }
        function EndRequest(sender, args) {
            LogItem("PageRequestManager", "End of async request");

        }

        function printArray(name, arr) {
            var panels = name + '=' + arr.length;
            if (arr.length > 0) {
                panels += "(";
                for (var i = 0; i < arr.length; i++) {
                    panels += arr[i].id + ',';
                }
                panels = panels.substring(0, panels.length - 1);
                panels += ")";
            }
            return panels;
        }
    }

    function toggleTimingMode() {
        timingMode *= -1;
        LogItem("Log", "Timing Mode " + ((timingMode > 0) ? "Detailed" : "Lite"), true);
    }

    function LogItem(actor, message, force) {
        if (timingMode > 0 || force) {
            var now = new Date();
            var nowStr = now.getHours() + "-" + now.getMinutes() + "-" + now.getSeconds() + "-" + now.getMilliseconds();
            $get('ClientEvents').innerHTML += "<div>" +
            "<div style='width:100px;display:inline;'>" + nowStr + " : </div>" +
            "<div style='width:100px;display:inline;'>" + actor + " : </div>" +
            "<div style='width:100px;display:inline;'>" + message + " </div>" +
            "</div>";
        }
    }
    function StartLog() {
        return new Date();
    }
    function EndLog(pre, message) {
        var ms = Math.abs(new Date() - pre)
        $get('ClientEvents').innerHTML += "<div>" +
            "<div style='width:100px;display:inline;'>" + ms + "ms :  </div>" +
            "<div style='width:100px;display:inline;'>" + message +
            "</div>"; ;
    }


    return {
        toggleTimingMode: function () {
            return toggleTimingMode();
        },
        clear: function () {
            return clear();
        },
        getInstance: function () {

            if (!instantiated) {
                timingMode = 1;
                instantiated = initHtml();
                instantiated = initEvents();
            }
            return instantiated;
        }
    };
})();

window.onload = function () {
    //var ajaxprofiler = AjaxProfiler.getInstance(); 
}