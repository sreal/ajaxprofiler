/*
Ajax Profile
Author: sre 2012
 
Drop in script to profile the ajax page life cycle
 
Base: http://msdn.microsoft.com/en-us/library/bb386417.aspx
*/

var AjaxProfiler = (function () {

    var instantiated;
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

        // all wrapper
        var _wrapper = document.createElement('div');
        _wrapper.id = "ajaxprofiler_wrapper";
        _wrapper.style.cssText = "width:100%; background:#EEE; margin: 2px;";

        _wrapper.appendChild(_visible_wrapper);
        _wrapper.appendChild(_toggle);
        _wrapper.appendChild(_clear);

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
            var prm = Sys.WebForms.PageRequestManager.getInstance();
            if (!prm.get_isInAsyncPostBack()) {
                prm.add_initializeRequest(InitializeRequest);
                prm.add_beginRequest(BeginRequest);
                prm.add_pageLoading(PageLoading);
                prm.add_pageLoaded(PageLoaded);
                prm.add_endRequest(EndRequest);
            }
            $get('ClientEvents').innerHTML += "APP:: Application init [" + new Date().getTime() + "]. <br/>";
        }
        function ApplicationLoad(sender, args) {
            $get('ClientEvents').innerHTML += "APP:: Application load [" + new Date().getTime() + "]. ";
            $get('ClientEvents').innerHTML += "(isPartialLoad = " + args.get_isPartialLoad() + ")<br/>";
        }
        function ApplicationUnload(sender) {
            alert('APP:: Application unload.');
        }
        function ApplicationDisposing(sender) {
            $get('ClientEvents').innerHTML += "APP:: Application disposing [" + new Date().getTime() + "]. <br/>";

        }
        // Application event handlers for page developers.
        function pageLoad() {
            $get('ClientEvents').innerHTML += "PAGE:: Load [" + new Date().getTime() + "].<br/>";
        }

        function pageUnload() {
            alert('Page:: Page unload.');
        }

        // PageRequestManager event handlers.
        function InitializeRequest(sender, args) {
            $get('ClientEvents').innerHTML += "<hr/>";
            $get('ClientEvents').innerHTML += "PRM:: Initializing async request [" + new Date().getTime() + "].<br/>";
        }
        function BeginRequest(sender, args) {
            $get('ClientEvents').innerHTML += "PRM:: Begin processing async request [" + new Date().getTime() + "].<br/>";
        }
        function PageLoading(sender, args) {
            $get('ClientEvents').innerHTML += "PRM:: Loading results of async request [" + new Date().getTime() + "].<br/>";
            var updatedPanels = printArray("PanelsUpdating", args.get_panelsUpdating());
            var deletedPanels = printArray("PanelsDeleting", args.get_panelsDeleting());

            var message = "-->" + updatedPanels + "<br/>-->" + deletedPanels + "<br/>";

            document.getElementById("ClientEvents").innerHTML += message;
        }
        function PageLoaded(sender, args) {
            $get('ClientEvents').innerHTML += "PRM:: Finished loading results of async request [" + new Date().getTime() + "].<br/>";
            var updatedPanels = printArray("PanelsUpdated", args.get_panelsUpdated());
            var createdPanels = printArray("PaneslCreated", args.get_panelsCreated());

            var message = "-->" + updatedPanels + "<br/>-->" + createdPanels + "<br/>";

            document.getElementById("ClientEvents").innerHTML += message;
        }
        function EndRequest(sender, args) {
            $get('ClientEvents').innerHTML += "PRM:: End of async request [" + new Date().getTime() + "].<br/>";
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

    return {
        clear: function () {
            return clear();
        },
        getInstance: function () {

            if (!instantiated) {
                instantiated = initHtml();
                instantiated = initEvents();
            }
            return instantiated;
        }
    };
})();


window.onload = function () {
    var ajaxprofiler = AjaxProfiler.getInstance(); 
}


