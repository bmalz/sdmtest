<html lang="en">
<pdm_wsp preview=no>
<HEAD>
<SCRIPT LANGUAGE="JavaScript">
<!--
    // WARNING: This htmpl file should be in the
    //          NX_ROOT/bopcfg/www/htmpl/web/analyst directory.
    //          This is because the pdm_cgireport.exe must be able to find it
    //          If you move move it them you must define NX_CGIREPORT_TMPL 
    //          with the new location.
    // This form is initially loaded and the onload method submits a query to the 
    //      report CGI executable and then queries for the completion of the report 
    //      repeatedly until completion after a preset timeout interval, connecting 
    //      directly to the CGI application each time and thereby not passing 
    //      through the webengine.  As such, the  server variables won't be 
    //      correctly embedded the second time around (meaning that as defined 
    //      bopsid will evaluate to NaN after the initial load and rpt_top will 
    //      have to be referenced in order to retrive the server variables.
    var bopsid      = ("$args.KEEP.bopsid"-0);
	if(typeof window.parent.rpt_top == "undefined") {
    	window.parent.rpt_top=new Object();
	}
	var rpt_top=window.parent.rpt_top;
    if(!isNaN(bopsid)) { // true the first time around
        // Define variables used in report_globals.js to initialize rpt_top
	    rpt_top.caisd   = "$CAisd";
	    var rptTmpl     = "$args.KEEP.report_template";
	    var rptId       = "$args.KEEP.reportid";
	    var rptArg1     = "$args.KEEP.arg1";
	    var rptWwwRoot  = "$args.KEEP.webroot";
	    var rptCgiScrpt = "$args.KEEP.cgireport_script";
		rpt_top.window_manager = "$CAisd/scripts/window_manager.js";
		rpt_top.report_includes = "$CAisd/scripts/report_includes.js";
		if(window.name == "cai_main") {
			rpt_top.report_js="$CAisd/scripts/report.js";
        	rpt_top.js=new Array (  "$CAisd/scripts/browser.js",
	                                "$CAisd/scripts/window_manager.js",
	                                "$CAisd/scripts/msgtext.js",
	                                "$CAisd/scripts/popup.js",
	                                "$CAisd/scripts/ahdmenus.js",
	                                "$CAisd/scripts/imgbutton.js");
        	rpt_top.style= new Array(   "$CAisd/css/castyles.css",
				                        "$CAisd/css/styles_ahd.css",
				                        "$CAisd/css/menu.css",
				                        "$CAisd/css/menubar.css",
				                        "$CAisd/css/imgbutton.css");
        	rpt_top.print_style= new Array("$CAisd/css/print.css");
		}
	}
-->
</SCRIPT>
<SCRIPT LANGUAGE="JavaScript">
<!--
	document.writeln('<SCRIPT LANGUAGE="JavaScript" SRC="'+rpt_top.window_manager+'"></SCRIPT'+'>');
	document.writeln('<SCRIPT LANGUAGE="JavaScript" SRC="'+rpt_top.report_includes+'"></SCRIPT'+'>');
-->
</SCRIPT>
<SCRIPT LANGUAGE="JavaScript">
<!--
	document.writeln('<SCRIPT LANGUAGE="JavaScript" SRC="'+rpt_top.report_js+'"></SCRIPT'+'>'); // first time around, rpt_top is not defined until after report_includes.js has be fully included (this is why this needs to be in a script definition section that follows the one that includes that script
-->
</SCRIPT>
<SCRIPT LANGUAGE="JavaScript">
<!--
    report_load_includes(document); // this method is defined in the dynamically loaded "rpt_top.report_js" above and is not valid until that include is completed.
-->
</SCRIPT>
<PDM_INCLUDE FILE=std_head.htmpl busy=no>
<SCRIPT LANGUAGE="JavaScript">
<!--
    activateActionKeys();
    refresh_window_list();
    setWindowTitle("CAisd report - "+rpt_top.report_template);
// -->
</SCRIPT>
</HEAD>
<BODY class=report onUnload="on_unload();" onLoad="on_load();">
<BR>
<SPAN class=report>
<CENTER>
<SCRIPT language="JavaScript">
<!--
    var message="PDM_MESSAGE";
    if(message.length!= 11) document.write(message);
// -->
</SCRIPT>
</CENTER>
</SPAN>
<SCRIPT language="JavaScript">
<!--
    if("PDM_DISPLAY_CANCEL_LINK" == "TRUE") 
    {
        display_cancel_link();
    }
// -->
</SCRIPT>
<FORM METHOD=POST ACTION="PDM_CGIREPORT_SCRIPT" NAME="frmstart">
    <INPUT TYPE=hidden NAME=CGIREPORT_SCRIPT VALUE="">
    <INPUT TYPE=hidden NAME=USERID VALUE="">
    <INPUT TYPE=hidden NAME=REPORT_TEMPLATE VALUE="">
    <INPUT TYPE=hidden NAME=REPORT_ID VALUE="">
    <INPUT TYPE=hidden NAME=arg1 VALUE="">
    <INPUT TYPE=hidden NAME=BOPSID VALUE="">
</FORM>
<FORM METHOD=POST ACTION="PDM_CGIREPORT_SCRIPT" NAME="frmcontinue">
    <INPUT TYPE=hidden NAME=GET VALUE="">
    <INPUT TYPE=hidden NAME=REPORT_ID VALUE="">
</FORM>
<FORM METHOD=POST ACTION="PDM_CGIREPORT_SCRIPT" NAME="frmcancel">
    <INPUT TYPE=hidden NAME=CANCEL VALUE="">
</FORM>
</BODY>
</HTML>

<!-- 
@(#)\$Id: reports.htmpl.tpl,v 1.4 2006/11/29 02:29:52 jenji01 Exp $
-->

