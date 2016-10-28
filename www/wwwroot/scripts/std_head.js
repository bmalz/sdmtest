// Copyright (c) 2005 CA.  All rights reserved.
var scrollDivCount = 0;
var scrollDivsClosed = 0;
var postScrollDivOpen = false;
function get_ahdtop(alert_on_error)
{
try {
if ( typeof window.ahdtop == "object" &&
window.ahdtop != null &&
! window.ahdtop.closed &&
typeof window.ahdtop.name == "string" &&
window.ahdtop.name == "AHDtop" )
return window.ahdtop;
}
catch(e) {}
try {
if ( typeof parent.ahdtop == "object" &&
parent.ahdtop != null &&
! parent.ahdtop.closed &&
parent.ahdtop.name == "AHDtop" ) {
window.ahdtop = parent.ahdtop;
return window.ahdtop;
}
}
catch(e) {}
try {
if ( typeof opener.ahdtop == "object" &&
opener.ahdtop != null &&
! opener.ahdtop.closed &&
opener.ahdtop.name == "AHDtop" ) {
window.ahdtop = opener.ahdtop;
return window.ahdtop;
}
}
catch(e) {}
try {
for ( var win = window;
typeof win == "object" && win != null &&
( ! win.closed ) && typeof win.name == "string";
win = win.opener ) {
if ( typeof win.ahdtop == "object" &&
win.ahdtop != null &&
! win.ahdtop.closed &&
typeof win.ahdtop.name == "string" &&
win.ahdtop.name == "AHDtop" ) {
window.ahdtop = win.ahdtop;
return window.ahdtop;
}
while ( ( ! win.closed ) &&
typeof win.name == "string" &&
win.name != "AHDtop" &&
win != win.parent &&
( ! win.parent.closed ) &&
typeof win.parent.name == "string" )
win = win.parent;
if ( ( ! win.closed ) &&
typeof win.name == "string" &&
win.name == "AHDtop" ) {
window.ahdtop = win;
return window.ahdtop;
}
}
}
catch (e) {}
if ( typeof alert_on_error == "boolean" &&
alert_on_error )
alert("Unable to perform requested operation in window " +
window.name + " - ahdtop not found");
window.ahdtop = void(0);
return window.ahdtop;
}
var ahdtop = get_ahdtop();
var _browser;
if ( typeof ahdtop == "object" )
_browser = ahdtop._browser;
function register_window( newframe, name )
{
if ( typeof newframe == "object" && newframe != null &&
typeof ahdtop.AHD_Windows == "object" ) {
var newwin = newframe;
if ( typeof newwin.name == "string" &&
( typeof newwin.ahdframeset != "object" ||
newwin.ahdframeset != ahdtop ) ) {
newwin = newwin.parent;
newwin.ahdtop = ahdtop;
if ( newwin.name.length == 0 ) {
if ( typeof name != "string" || name.length == 0 )
name = get_next_window_name();
newwin.name = name;
}
ahdtop.AHD_Windows[newwin.name] = newwin;
if ( newwin.name != popup_window_name("ahdwlist") &&
newwin.document.title.length > 0 ) {
refresh_window_list();
}
}
else if ( typeof name == "string" && name.length > 0 ) {
ahdtop.AHD_Windows[name] = newwin;
}
}
}
function cancel_actlog(ahdframe)
{
if (typeof ahdframe.propFormName != "string" ||
typeof ahdframe.cfgCgi != "string" ||
typeof ahdframe.cfgSID != "string" ||
typeof ahdframe.cfgFID != "string" ||
typeof ahdframe.propFactory != "string")
return 0;
var pfm = ahdframe.propFormName;
if (pfm != "detail_alg.htmpl" &&
pfm != "detail_chgalg.htmpl" &&
pfm != "detail_issalg.htmpl" &&
pfm != "xfer_esc_cr.htmpl" &&
pfm != "xfer_esc_chg.htmpl" &&
pfm != "xfer_esc_iss.htmpl" &&
pfm != "request_status_change.htmpl" &&
pfm != "order_status_change.htmpl" &&
pfm != "issue_status_change.htmpl" &&
pfm != "nf.htmpl")
return 0;
var url = ahdframe.cfgCgi +
"?SID=" + ahdframe.cfgSID +
"+FID=" + ahdframe.cfgFID +
"+OP=CANCEL+FACTORY=" + ahdframe.propFactory +
"+HTMPL=cancel_empty.htmpl";
ahdtop_load_workframe(url, 0, "ONE_WAY");
if (window.name == "welcomebanner")
ahdframeset.close();
return 1;
}
function cancel_window()
{
if ( typeof sessionEnded == "boolean" && sessionEnded )
return true;
if ( ahdframeset.name == "AHDtop" ) {
if ( ! ahdframeset.gobtn.form_cancelled ) {
ahdframeset.gobtn.form_cancelled = true;
if ( typeof ahdframe.ImgBtnDoCancel != "undefined" )
ahdframe.ImgBtnDoCancel();
}
return true;
}
if (typeof ahdframeset.ahdframe == "undefined")
{
alertmsg("Unable_to_find_ahdframe_window");
return false;
}
ahdframe = ahdframeset.ahdframe;
if ( ! _browser.isIE ) {
if ( typeof ahdtop == "object" && ahdtop != null && ! ahdtop.closed )
ahdtop.lastClosedURL = ahdframe.document.URL;
}
var SID, Cgi;
if ( typeof ahdframe.cfgCgi == "string" &&
typeof ahdframe.cfgSID == "string" )
{
SID = ahdframe.cfgSID;
Cgi = ahdframe.cfgCgi;
}
var cancel_in_progress = false;
if ( typeof ahdframeset.gobtn != "undefined" &&
typeof ahdframeset.gobtn.form_cancelled == "boolean" ) {
if ( ((typeof ahdframe._dtl != "undefined") && ahdframe._dtl.edit)
&& ahdframeset.gobtn.form_cancelled )
return true;
ahdframeset.gobtn.form_cancelled = true;
if ( ahdframeset != ahdtop &&
typeof ahdframe.ImgBtnDoCancel != "undefined" )
{
var actlog = 0;
if ((typeof ahdframe._dtl != "undefined") && ahdframe._dtl.edit)
actlog = cancel_actlog(ahdframe);
if (!actlog)
cancel_in_progress = ahdframe.ImgBtnDoCancel();
else
cancel_in_progress = true;
}
}
if (typeof ahdframe.select_lrel != "undefined" &&
ahdframe.select_lrel == "1" &&
typeof ahdframeset.opener.cancel_lrel == "object" &&
ahdframeset.opener.cancel_lrel != null)
{
ahdframeset.opener.cancel_lrel();
}
var delay = 30000;
if (!cancel_in_progress &&
typeof parent.is_form_loaded == "boolean" &&
!parent.is_form_loaded &&
typeof cfgInitialURL == "string" &&
cfgInitialURL.indexOf("OP=UPDATE") != -1 &&
typeof parent.opener != "undefined" &&
typeof parent.opener.cfgCgi == "string" &&
typeof parent.opener.cfgSID == "string" &&
typeof parent.name == "string")
{
Cgi = window.opener.cfgCgi;
SID = window.opener.cfgSID;
delay = 0;
}
if ((typeof Cgi == "string") &&
(typeof SID == "string" ) &&
(typeof parent.name == "string"))
{
remove_popup_window_name(parent.name);
var url = Cgi + "?SID=" + SID + "+FID=0+REMOVECACHE=" + parent.name;
if ( typeof ahdframe.clearSpigotReq == "boolean" &&
ahdframe.clearSpigotReq ) {
ahdframe.clearSpigotReq = false;
url += "+CLEARSPIGOT=" + ahdframe.cfgFID;
}
ahdtop_load_workframe(url, delay, "ONE_WAY", "is_popup_window_still_up", parent);
}
deregister_window();
if (typeof ahdframe.propFormName == "string" && ahdframe.propFormName == "show_main_detail.htmpl") 
return;
try {
if ( typeof top.opener.autoRefreshWindows == "object" &&
typeof top.opener.autoRefreshWindows[parent.name] == "boolean" &&
top.opener.autoRefreshWindows[parent.name] ) {
var openwin = top.opener;
openwin.autoRefreshWindows[parent.name] = false;
if ( openwin.propFormName1 != "detail" ) {
if ( typeof openwin.doSearch != "undefined" )
openwin.doSearch();
}
else {
if ( openwin.propFormName3 != "edit" ) {
var persid = openwin.argPersistentID;
var colon = persid.indexOf(":");
if ( colon != -1 ) {
var url = openwin.cfgCgi +
"?SID=" + openwin.cfgSID +
"+FID=" + openwin.cfgFID +
"+OP=SHOW_DETAIL" +
"+FACTORY=" + persid.substring(0,colon) +
"+PERSID=" + nx_escape(persid);
if (openwin.is_action_in_progress() || (Number(openwin.ahdframe.currentAction) != ACTN_LOADFORM)) {
openwin.set_action_in_progress(ACTN_FILLFORM);
openwin.location.href = url;
}
}
}
}
}
}
catch(e) {}
return cancel_in_progress;
}
function deregister_window()
{
var non_top = 0;
try {
if ( window == window.parent ||
window.ahdframeset != ahdtop ) {
if ( typeof ahdtop == "object" &&
ahdtop != null &&
! ahdtop.closed ) {
var closing_window = window;
if (typeof window.ahdframeset == "object" &&
window.ahdframeset != null &&
closing_window != window.ahdframeset)
{
non_top = 1;
closing_window = window.ahdframeset;
}
if ( arguments.length > 0 ) {
closing_window = arguments[0];
if ( typeof closing_window != "object" )
return;
}
if ( typeof ahdtop.closing_all_windows == "boolean" &&
! ahdtop.closing_all_windows ) {
var i = 0;
var edit_wins = new Array();
var window_name = new Array();
for ( var registered_name in ahdtop.AHD_Windows )
window_name[i++] = registered_name;
for ( i = 0; i < window_name.length; i++ ) {
var ahdwin = ahdtop.AHD_Windows[window_name[i]];
if ( typeof ahdwin == "object" &&
typeof ahdwin.opener == "object" ) {
if ( ahdwin.opener == closing_window ||
( typeof ahdwin.opener.ahdframeset == "object" &&
ahdwin.opener.ahdframeset == closing_window ) ) {
if ((typeof ahdwin.ahdframe != "undefined") &&
(ahdwin.ahdframe.edit_form == 1) &&
((typeof ahdwin.ahdframe.close_with_opener != "number") ||
(ahdwin.ahdframe.close_with_opener != 1)))
{
edit_wins[edit_wins.length] = ahdwin.cai_main;
continue;
}
delete ahdtop.AHD_Windows[window_name[i]];
deregister_window(ahdwin);
ahdwin.ahdtop = null;
if ( ! ahdwin.closed )
ahdwin.close();
}
}
}
if (edit_wins.length > 0)
{
edit_wins[0].focus();
}
if ( typeof closing_window.name == "string" &&
closing_window.name.length != 0 &&
typeof ahdtop.AHD_Windows == "object" &&
typeof ahdtop.AHD_Windows[closing_window.name] == "object" &&
!non_top) {
delete ahdtop.AHD_Windows[closing_window.name];
refresh_window_list();
}
}
}
}
}
catch(e) {}
}
function all_child_edit_windows_closed(win,caption)
{
var i, msg, ahdwin;
var isEdit = ( caption == "Edit" );
caption = msgtext(caption);
var edit_wins = new Array();
var edit_win_count = 0;
var window_name = new Array();
for ( var registered_name in ahdtop.AHD_Windows )
window_name[window_name.length] = registered_name;
for ( i = window_name.length - 1; i >=0; i-- ) {
ahdwin = ahdtop.AHD_Windows[window_name[i]];
if ( typeof ahdwin == "object" && ahdwin != null &&
typeof ahdwin.opener == "object" && ahdwin.opener != null &&
typeof ahdwin.opener.ahdframeset == "object" && ahdwin.opener.ahdframeset != null &&
win.ahdframeset == ahdwin.opener.ahdframeset ) {
try {
if ( ( typeof ahdwin.ahdframe.close_with_opener != "number" ||
ahdwin.ahdframe.close_with_opener != 1 ) &&
( ( isEdit && ahdwin.ahdframe.edit_form == 1 ) ||
ahdwin.ahdframe.location.search.match(/KEEP.ForLrel/) ||
(typeof ahdwin.ahdframe.select_lrel != "undefined" && 
ahdwin.ahdframe.select_lrel == "1") ) ) {
if ( edit_win_count == 0 )
msg = msgtext("The_following_windows_must_be_closed",caption);
edit_wins[edit_win_count++] = window_name[i];
msg += "\n" + ahdwin.document.title;
}
}
catch(ahdwin) {}
}
}
if ( edit_win_count == 0 )
return true;
msg += "\n" + msgtext("Press_OK_to_close_them",caption);
if ( ! confirm(msg) )
return false;
for ( i = edit_win_count - 1; i >= 0; i-- ) {
ahdwin = ahdtop.AHD_Windows[edit_wins[i]];
try {
if ( ( typeof ahdwin.ahdframe.close_with_opener != "number" ||
ahdwin.ahdframe.close_with_opener != 1 ) &&
( ( isEdit && ahdwin.ahdframe.edit_form == 1 ) ||
ahdwin.ahdframe.location.search.match(/KEEP.ForLrel/) ||
(typeof ahdwin.ahdframe.select_lrel != "undefined" && 
ahdwin.ahdframe.select_lrel == "1") ) ) {
if ( typeof ahdwin.ahdframe.detailCancel != "undefined" )
ahdwin.ahdframe.detailCancel();
else if ( typeof ahdwin.ahdframe.cancel_if_lrel_update == "undefined"||
! ahdwin.ahdframe.cancel_if_lrel_update() ) {
delete ahdtop.AHD_Windows[edit_wins[i]];
deregister_window(ahdwin);
ahdwin.ahdtop = null;
if ( ! ahdwin.closed )
ahdwin.close();
}
}
}
catch(ahdwin) {}
}
return true;
}
function closing_main_window()
{
if(typeof ahdtop == "object" && typeof ahdtop.ticketObj == "object")
ahdtop.ticketObj.closeObject(1);
if ( typeof ahdtop == "object" &&
ahdtop != null && ( ! ahdtop.closed ) &&
typeof ahdtop.AHD_logout_requested != "undefined" &&
!ahdtop.AHD_logout_requested ) {
if ( typeof ahdtop.LoadingPopup == "object" &&
ahdtop.LoadingPopup != null )
{
ahdtop.LoadingPopup.close();
}
try {
if ( typeof ahdtop.contextMenuWindow == "object" &&
ahdtop.contextMenuWindow != null &&
! ahdtop.contextMenuWindow.closed )
ahdtop.contextMenuWindow.close();
ahdtop.contextMenuWindow = void(0);
}
catch(e) {}
if ( !check_log_reader(ahdtop) &&
typeof ahdtop.workframe == "object" &&
typeof cfgCgi == "string" &&
typeof cfgSID == "string" ) {
var url = cfgCgi + "?SID=" + cfgSID + "+FID=0+ENDSESSION=1";
ahdtop.workframe.location.href = url;
if(typeof ahdtop.cfgBOServerLocation == "string" && ahdtop.cfgBOServerLocation != "" 
&& typeof ahdtop.cfgCAISD == "string" && ahdtop.cfgCAISD != ""	)
{
var url=ahdtop.cfgServletURL+ahdtop.cfgCAISD+"/BOServlet?BOPSID="+cfgSID+"&USERID="+ahdtop.cfgUserid+"&LOGOFF=1";
url=resolveWebFormVars(url);
var bofram=ahdtop.boframe;
if(typeof boframe == "object" && boframe != null)
{
boframe.location.href = url;
}
}
var before_time = (new Date()).getTime();
var after_time;
do {
after_time = (new Date()).getTime();
} while (after_time < before_time + 1000);
}
close_all_windows(1);
ahdtop.window.name = "";
ahdtop.ahdtop = void(0);
}
}
function check_log_reader(ahdtop)
{
var i = 0;
var window_name = new Array();
for ( var registered_name in ahdtop.AHD_Windows )
window_name[i++] = registered_name;
for ( i = window_name.length - 1; i >= 0; i-- )
{
var ahdwin = ahdtop.AHD_Windows[window_name[i]];
if ( typeof ahdwin == "object" &&
typeof ahdwin.name == "string" &&
ahdwin.name == popup_window_name("log_reader") )
{
if ( ! ahdtop.cstCloseLogRdr )
{
ahdwin.make_ahdtop();
delete ahdtop.AHD_Windows[window_name[i]];
return true;
}
break;
}
}
return false;
}
function do_close_all_windows(query_string, chgRole)
{
if (typeof query_string != "string")
query_string = "";
if (typeof chgRole != "boolean")
chgRole = false;
var ret;
if (typeof ahdtop.close_edit_window == "object") {
var msg_str;
if (chgRole)
msg_str = msgtext("In_process_of_closing_editing_chgRole"); 
else 
msg_str = msgtext("In_process_of_closing_editing_"); 
ret = confirm(msg_str);
if (ret)
ahdtop.close_edit_window.skipAdd = 1;
else 
return 1;
}
else
ahdtop.close_edit_window = new CloseEditWindow(query_string, 0);
ret = close_all_windows(0, chgRole);
if (ret == 2)
return 2;
if (ret == 1 &&
typeof ahdtop.close_edit_window == "object")
{
ahdtop.close_edit_window.skipAdd = 1;
close_all_windows(1, chgRole);
}
return 0;
}
function logout_all_windows(need_logout)
{
if (typeof ahdtop == "object" && ahdtop != null &&
typeof need_logout == "number" &&
need_logout == 1 &&
typeof ahdtop.cfgBOServerLocation == "string" &&
ahdtop.cfgBOServerLocation != "")
{
ahdtop.check_bo_info(0, 1);
}
logout_all_windows_cb(need_logout);
}
function logout_all_windows_cb(need_logout) {
if(typeof ahdtop == "object" && typeof ahdtop.ticketObj == "object")
ahdtop.ticketObj.closeObject(1);
if ((typeof this.label == "string") &&
(this.label == "Log Out"))
{
if (!confirm(msgtext("Received_logout_action_key_req")))
return;
}
if (typeof ahdframeset.OnBeforeLogout == "function") {
var continueLogout = ahdframeset.OnBeforeLogout(need_logout);
if (!continueLogout) {
return;
}
}
if ( typeof ahdtop == "object" &&
ahdtop != null && ( ! ahdtop.closed ) &&
window.name != "AHDtop" &&
window.name != "AHDlogin" )
ahdtop.logout_all_windows();
else {
var query_string = cfgCgi;
if (!check_log_reader(ahdtop))
query_string += "?SID=" + cfgSID + "+FID=1";
else
need_logout = 0;
if ((typeof need_logout == "undefined") || need_logout) {
query_string += "+OP=LOGOUT";
if ( ahdtop.popupResized ||
ahdtop.toolbarInitalTab != ahdtop.toolbarCurrentTab ) {
var attrs = "";
var vals = "";
if ( ahdtop.cstPopup1[0] != 0 ) {
attrs = "WEB_POPUP1_HEIGHT,WEB_POPUP1_WIDTH";
vals = ahdtop.cstPopup1[0] + "," + ahdtop.cstPopup1[1];
}
if ( ahdtop.cstPopup2[0] != 0 ) {
if ( attrs.length > 0 ) {
attrs += ",";
vals += ",";
}
attrs += "WEB_POPUP2_HEIGHT,WEB_POPUP2_WIDTH";
vals += ahdtop.cstPopup2[0] + "," + ahdtop.cstPopup2[1];
}
if ( ahdtop.cstPopup3[0] != 0 ) {
if ( attrs.length > 0 ) {
attrs += ",";
vals += ",";
}
attrs += "WEB_POPUP3_HEIGHT,WEB_POPUP3_WIDTH";
vals += ahdtop.cstPopup3[0] + "," + ahdtop.cstPopup3[1];
}
if ( ahdtop.cstPopup4[0] != 0 ) {
if ( attrs.length > 0 ) {
attrs += ",";
vals += ",";
}
attrs += "WEB_POPUP4_HEIGHT,WEB_POPUP4_WIDTH";
vals += ahdtop.cstPopup4[0] + "," + ahdtop.cstPopup4[1];
}
if (( ahdtop.toolbarInitialTab != ahdtop.toolbarCurrentTab ) ||
(typeof ahdtop.matchInitialRole == "boolean" &&
!ahdtop.matchInitialRole)) {
if ( attrs.length > 0 ) {
attrs += ",";
vals += ",";
}
attrs += "WEB_TOOLBAR_TAB";
vals += ahdtop.toolbarCurrentTab.toString();
}
if (typeof ahdtop.cfgCurrentRoleID != "undefined")
{
if ( attrs.length > 0 ) {
attrs += ",";
vals += ",";
}
attrs += "WEB_ROLE_ID";
vals += ahdtop.cfgCurrentRoleID;
}
if ( attrs.length > 0 )
query_string += "+PREFS_ATTRS=" + nx_escape(attrs) +
"+PREFS_VALS=" + nx_escape(vals);
}
}
if ( typeof ahdtop != "object" ) {
for ( var currtop = window;
currtop != currtop.parent &&
currtop.name != "AHDtop";
currtop = currtop.parent );
currtop.document.location.replace(query_string);
}
else {
AHD_logout_requested = true;
try {
if ( typeof ahdtop.contextMenuWindow == "object" &&
ahdtop.contextMenuWindow != null &&
! ahdtop.contextMenuWindow.closed )
ahdtop.contextMenuWindow.close();
ahdtop.contextMenuWindow = void(0);
}
catch(e) {}
var ret = do_close_all_windows(query_string);
if (ret)
{
if (ret == 2)
AHD_logout_requested = false;
return;
}
window.name = "AHDlogin";
ahdtop = void(0);
window.document.location.href = query_string;
}
}
}
function CloseEditWindow(query_string, confirm)
{
this.query_string = query_string;
this.skipAdd = 0;
this.confirm = confirm;
this.edit_windows = new Array();
if ( typeof ahdtop == "object" &&
ahdtop != null && ( ! ahdtop.closed ) )
ahdtop.close_edit_window = this;
}
CloseEditWindow.prototype.add_window = function (win)
{
this.edit_windows[this.edit_windows.length] = win;
}
CloseEditWindow.prototype.next_window = function (win_name)
{
var idx = this.edit_windows.length - 1;
if (typeof win_name == "string")
{
this.edit_windows[idx] = 0;
this.edit_windows.length = idx;
window.status = "Window, " + win_name + ", closed.";
idx--;
}
if ( this.edit_windows.length > 0)
{
var edit_win = this.edit_windows[idx];
if ((typeof edit_win.cai_main != "undefined") &&
(typeof edit_win.cai_main.ImgBtnDoCancel != "undefined") &&
edit_win.cai_main.ImgBtnDoCancel())
{
if ( typeof edit_win.gobtn == "object" )
edit_win.gobtn.form_cancelled = true;
}
else
{
edit_win.close();
this.next_window(edit_win.name);
return;
}
window.status = "Close widnow, " + edit_win.name + ".";
}
else
{
window.name = "AHDlogin";
ahdtop = void(0);
setTimeout("window.document.location.replace('" + this.query_string + "')", 100);
}
}
function menubar_close_all_windows()
{
close_all_windows();
}
function close_all_windows(f_force, chgRole)
{
var force =0;
if (typeof f_force == "number")
force = f_force;
var ret_code = 0;
if ( typeof ahdtop == "object" &&
ahdtop != null && ( ! ahdtop.closed ) )
{
if ( window.name != "AHDtop" &&
ahdtop.name == "AHDtop" )
ahdtop.close_all_windows(force);
else
{
ahdtop.closing_all_windows = true;
var i = 0;
var window_name = new Array();
for ( var registered_name in ahdtop.AHD_Windows )
window_name[i++] = registered_name;
for ( i = window_name.length - 1; i >= 0; i-- )
{
var ahdwin = ahdtop.AHD_Windows[window_name[i]];
if ( typeof ahdwin == "object" && ahdwin != null &&
typeof ahdwin.name == "string" &&
typeof ahdwin.closed == "boolean" &&
! ahdwin.closed )
{
if ((typeof ahdtop.close_edit_window == "object") &&
!ahdtop.close_edit_window.skipAdd &&
(typeof ahdwin.cai_main != "undefined") &&
(ahdwin.cai_main.edit_form == 1))
{
ahdtop.close_edit_window.add_window(ahdwin);
continue;
}
if (typeof ahdwin.exclude_from_win_close == "boolean" && ahdwin.exclude_from_win_close) {
continue;
}
if ( ahdwin.name == popup_window_name("log_reader") &&
! ahdtop.cstCloseLogRdr )
continue;
ahdwin.name = "goner";
delete ahdtop.AHD_Windows[window_name[i]];
remove_popup_window_name(window_name[i]);
if ( typeof ahdwin.cai_main == "object" ) {
if ( !force &&
typeof ahdwin.cai_main.ImgBtnDoCancel != "undefined" &&
ahdwin.cai_main.ImgBtnDoCancel() ) {
if ( typeof ahdwin.gobtn == "object" )
ahdwin.gobtn.form_cancelled = true;
continue;
}
ahdwin.cai_main.name = "goner";
}
ahdwin.ahdtop = null;
ahdwin.close();
}
}
if ((typeof ahdtop.close_edit_window == "object") &&
!ahdtop.close_edit_window.skipAdd &&
(ahdtop.close_edit_window.edit_windows.length > 0))
{
var length = ahdtop.close_edit_window.edit_windows.length; 
var ret;
var msg_str;
if (length > 1) {
if (chgRole) 
msg_str = msgtext("%1_windows_is_still_in_edit_mo_chgRole", "" + length); 
else 
msg_str = msgtext("%1_windows_is_still_in_edit_mo", "" + length); 
ret = confirm(msg_str);
}
else {
if (chgRole)
msg_str = msgtext("1_window_is_still_in_edit_mode_chgRole"); 
else 
msg_str = msgtext("1_window_is_still_in_edit_mode"); 
ret = confirm(msg_str);
}
if (ret)
ret_code = 1;
else 
ret_code = 2;
}
ahdtop.closing_all_windows = false;
if (ret_code == 2)
{
if(typeof ahdtop.product=="object" && ahdtop.product!=null && typeof ahdtop.product.show_rpt_logoff!="undefined")
{
ahdtop.product.show_rpt_logoff(false);
} 
for (i = 0; i < ahdtop.close_edit_window.edit_windows.length; i++)
{
var tmp_win = ahdtop.close_edit_window.edit_windows[i];
if ( typeof tmp_win == "object" &&
typeof tmp_win.name == "string" &&
typeof tmp_win.closed == "boolean" &&
! tmp_win.closed )
{
tmp_win.focus();
break;
}
}
ahdtop.close_edit_window = void(0);
}
else
ahdtop.focus();
if ( typeof ahdtop.debugShowWindow == "object" &&
typeof ahdtop.debugShowWindow.closed == "boolean" &&
! ahdtop.debugShowWindow.closed )
ahdtop.debugShowWindow.close();
}
}
return ret_code;
}
function session_timeout(sid, currWin)
{
if ( typeof cfgCgi == "string" ) {
if ( typeof workframe == "object" &&
typeof sid == "string" && sid != "0" ) {
workframe.location.href =
cfgCgi + "?SID=" + sid + "+FID=0+ENDSESSION=1";
if(typeof cfgBOServerLocation == "string" && cfgBOServerLocation != "" 
&& typeof cfgCAISD == "string" && cfgCAISD != ""	)
{
var url=cfgServletURL+cfgCAISD+"/BOServlet?BOPSID="+sid+"&USERID="+cfgUserid+"&LOGOFF=1";
url=resolveWebFormVars(url);
if(typeof boframe == "object" && boframe != null)
{
boframe.location.href = url;
}
}
}
var url = "";
if ( typeof ahdtop != "object" ||
typeof currWin != "object" ||
currWin != ahdtop ) {
url = cfgCgi;
if ( typeof currWin.propFormName == "string" &&
currWin.propFormName == "login.htmpl" &&
typeof currWin.document.login == "object" ) {
var f = currWin.document.login;
var sep = "?";
if ( typeof propPortalSession == "string" &&
propPortalSession.length > 0 ) {
url += sep + "PortalSession=" + propPortalSession;
sep = "+";
}
if ( typeof f.WSPHOST == "object" &&
f.WSPHOST.value.length > 0 )
url += sep + "WSPHOST=" + nx_escape(f.WSPHOST.value);
}
}
AHD_logout_requested = true;
setTimeout("finish_session_timeout('" + url + "');",10);
}
}
function finish_session_timeout(url)
{
var winNames = new Array();
for ( var name in ahdtop.AHD_Windows )
winNames[winNames.length] = name;
for ( var i = winNames.length - 1; i >= 0; i-- ) {
var win = AHD_Windows[winNames[i]];
if ( typeof win == "object" && ! win.closed ) {
win.sessionEnded = true;
win.close();
}
}
window.name = "";
if ( url.length > 0 ) {
window.document.location.replace(url);
}
}
function popup_window_list()
{
var dflt_width = 260;
var dflt_margin = 10;
var w_name = get_popup_window_name("ahdwlist");
var url = ahdtop.usdHTML["wlist"];
var features = "scrollbars=yes" +
",resizable=yes" +
",width=" + dflt_width +
",height=300";
var x_posn = window.screen.availWidth - dflt_width - dflt_margin;
if ( _browser.supportsLayers == true )
features += ",screenX=" + x_posn + ",screenY=" + dflt_margin;
else
features += ",left=" + x_posn + ",top=" + dflt_margin;
if ( ahdtop.propDebugOptions != "" )
features = modifyWindowFeaturesForDebug(features);
var listwin = window.open( url, "", features);
if ( typeof listwin == "object" && listwin != null )
{
listwin.name = w_name;
register_window(listwin);
listwin.opener = ahdtop;
listwin.focus();
}
else
check_popup_blocker(listwin);
}
function refresh_window_list()
{
if ( typeof ahdtop != "object" ||
ahdtop == null || ahdtop.closed ||
typeof ahdtop.AHD_Windows != "object")
return;
var winlist = find_popup_window("ahdwlist");
if ( winlist != null )
winlist.list_windows();
else
cleanup_window_list();
}
function cleanup_window_list()
{
if ( typeof ahdtop == "object" && ahdtop != null && ! ahdtop.closed ){
var i = 0;
var window_name = new Array();
for ( var registered_name in ahdtop.AHD_Windows )
window_name[i++] = registered_name;
for ( i = 0; i < window_name.length; i++ )
{
if ( window_name[i] != popup_window_name("ahdwlist") )
{
if(typeof ahdtop.AHD_Windows[window_name[i]] == "object")
{
try {
var ahdwin = ahdtop.AHD_Windows[window_name[i]];
if ( typeof ahdwin != "object" ||
typeof ahdwin.closed != "boolean" ||
ahdwin.closed )
delete ahdtop.AHD_Windows[window_name[i]];
}
catch(e) {
delete ahdtop.AHD_Windows[window_name[i]];
}
}
}
}
}
}
function show_hist_all() {
var q = cfgCgi+"?SID="+cfgSID+"+FID="+fid_generator()+
"+OP=SEARCH+FACTORY=lr+HTMPL=list_all_lr.htmpl" +
"+KEEP.IsPopUp=1";
var nh = preparePopup(q,"","scrollbars,resizable");
if (typeof nh == "object" && nh != null)
{
nh.focus();
}
}
function show_hist(fac, ref_num, id) {
var wc = "+KEEP.where_clause=cntxt_obj='" + fac + ":" + id + "'";
var extra = "";
if (fac == "nr") {
ref_num = "+KEEP.name=" + nx_escape(ref_num);
extra = "+KEEP.attr_factory=nr";
} else if (fac == "cnt") {
ref_num = "+KEEP.combo_name=" + nx_escape(ref_num);
extra = "+KEEP.attr_factory=cnt";
}
else {
ref_num = "+KEEP.ref_num=" + nx_escape(ref_num);
}
var q = cfgCgi + "?SID=" + cfgSID + "+FID=" + fid_generator() +
"+OP=SEARCH+FACTORY=lr+HTMPL=list_lr.htmpl"+wc+ref_num;
var nh = preparePopup(q, "", "width=800,height=400,scrollbars,resizable");
if (typeof nh == "object" && nh != null)
{
nh.focus();
}
}
function focus_window(window_name)
{
if ( typeof ahdtop == "object" && ahdtop != null && ! ahdtop.closed )
{
var win = ahdtop.AHD_Windows[window_name];
if ( typeof win == "object" &&
typeof win.closed == "boolean" &&
! win.closed )
win.focus();
}
}
function focus_main_window()
{
if ( typeof ahdtop == "object" && ahdtop != null && ! ahdtop.closed )
ahdtop.focus();
}
function copy_vals_for_accumulate(cai_main)
{
if (typeof cai_main.setEditElements == "undefined")
return;
if (typeof est_cost != "undefined")
cai_main.setEditElements("SET.est_cost", est_cost, 1);
if (typeof cost != "undefined")
cai_main.setEditElements("SET.cost", cost, 1);
if (typeof est_total_time != "undefined")
cai_main.setEditElements("SET.est_total_time", est_total_time, 1);
if (typeof actual_total_time != "undefined")
cai_main.setEditElements("SET.actual_total_time", actual_total_time, 1);
}
function switchToDetail( factory, id, reload, GLType, popup_url, bHideMenuAndLogo, sAdditionalUrl, bForceEdit, do_ReloadOnTmpWin, bOptOpeninNewWindow)
{
var bOpeninNewWindow = false;
if ( typeof bOptOpeninNewWindow == "boolean" ){
bOpeninNewWindow = bOptOpeninNewWindow
}
var persid, url, focusCmd, obj_arr;
obj_arr = factory.split(":");
if (obj_arr.length == 2)
{
persid = factory;
factory = obj_arr[0];
id = obj_arr[1];
}
else
persid = factory + ":" + id;
if ( typeof reload != "boolean" )
reload = true;
if ( typeof GLType != "string" )
GLType = "";
var bReloadOnTmpWin = false;
if ( typeof do_ReloadOnTmpWin == "boolean" )
bReloadOnTmpWin = do_ReloadOnTmpWin
var dtlWin = void(0);
if ( typeof ahdtop == "object" &&
ahdtop != null &&
typeof ahdtop.detailForms != "undefined" &&
typeof ahdtop.detailForms[persid] == "object" ) {
var ahdwin = ahdtop.detailForms[persid];
if ( ahdwin == null ||
typeof ahdwin.closed != "boolean" ||
ahdwin.closed ||
typeof ahdwin.name != "string" ) {
ahdwin = null;
if ( GLType == "secondary" ) {
var edit_windows = getEditWindows(persid);
for ( var i = 0; i < edit_windows.length; i++ ) {
var w = edit_windows[i];
if ( typeof w._dtl == "object" &&
! w._dtl.secondary ) {
ahdwin = w.ahdframeset;
ahdwin.top_splash.popupAfterSave = true;
break;
}
}
}
}
if ( ahdwin != null ) {
var cai_main;
if ( ahdwin.ahdframe.name == "frmDTUserNode" &&
ahdwin.ahdframe.parent.name == "cai_main")
{
cai_main = ahdwin.ahdframe.parent;
}
else
{
cai_main = ahdwin.ahdframe;
}
if ( typeof cai_main == "object" &&
cai_main != null ) {
url = cai_main.document.URL;
if (reload && typeof cai_main._dtl != "undefined" &&
cai_main._dtl.edit)
{
if (typeof for_accumulate != "undefined" &&
for_accumulate)
{
copy_vals_for_accumulate(cai_main);
}
if (typeof AlertMsg == "string" &&
AlertMsg != "" &&
AlertMsg != "updateOK" &&
typeof cai_main.AlertMsg != "undefined" &&
typeof cai_main.detailValidate != "undefined")
{
cai_main.AlertMsg = AlertMsg;
cai_main.detailValidate(2);
return true;
}
}
if ( typeof cai_main.propFormName3 == "string" &&
cai_main.propFormName3.toString() != "edit") {
if ( reload ) {
var tabs2reload = cai_main._dtl.tabReloadOnSave;
cai_main._dtl.tabReloadOnSave = void(0);
if ( typeof tabs2reload != "string" ||
tabs2reload.length == 0 ||
typeof cai_main.reloadTabs == "undefined" ||
! cai_main.reloadTabs(tabs2reload,window) ) {
if ( url.indexOf("?") == -1 ||
url.indexOf("OP=CANCEL") != -1 ||
url.indexOf("OP=DELETE") != -1 ||
url.indexOf("OP=UPDATE") != -1 ) {
var fid = ( typeof cai_main == "object" ?
cai_main.cfgFID : cfgFID );
url = cfgCgi +
"?SID=" + cfgSID +
"+FID=" + fid;
if (typeof bForceEdit == "boolean" && bForceEdit)
url += "+OP=UPDATE";
else
url += "+OP=SHOW_DETAIL";
url += "+FACTORY=" + factory +
"+PERSID=" + nx_escape(persid);
}
if (typeof AlertMsg == "string" &&
AlertMsg != "" ) {
formatAlertMsg();
var pat = new RegExp("^" + msgtext("Save_Successful"));
if(AlertMsg.match(pat) != null && propGLType == "secondary")	
alertSecUpd();
if ( url.indexOf("KEEP.AlertMsg=") != -1 )
url = url.replace(/\+KEEP.AlertMsg=[^\+]*/,"");
url += "+KEEP.AlertMsg=" + nx_escape(AlertMsg);
}
if (typeof bForceEdit == "boolean" && bForceEdit){
url = url.replace(/\+OP=SHOW_DETAIL[^\+]*/,"+OP=UPDATE");
}
if(typeof sAdditionalUrl != "undefined" && sAdditionalUrl != "")
{
url += sAdditionalUrl;
}
cai_main.set_action_in_progress(ACTN_FILLFORM);
display_new_page(url, cai_main);
}
}
if ( typeof top.workframe == "undefined" ||
typeof top.workframe.SkipInitialFocus == "undefined"||
"1" != top.workframe.SkipInitialFocus ) {
if ( typeof popup_url == "string" &&
popup_url.indexOf("OP=UPDATE") != -1 &&
typeof cai_main._dtl == "object" &&
! cai_main._dtl.edit )
cai_main.pdm_submit('main_form','UPDATE',
ACTN_LOADFORM);
focusCmd = "if ( typeof window.cai_main == 'object' && typeof window.cai_main.detailFocus1st != 'undefined' ) window.cai_main.detailFocus1st(); else window.focus();";
_browser.isSafari = navigator.userAgent.toLowerCase().indexOf('webkit') > -1;
if(_browser.isSafari) {
window.blur();
if ( typeof window.cai_main == 'object' && typeof window.cai_main.detailFocus1st != 'undefined' )
window.cai_main.detailFocus1st(); 
else	
ahdwin.setTimeout(window.focus, 250);
}
else
ahdwin.setTimeout(focusCmd, 250);
}
return true;
}
if ( typeof dtlWin != "object" )
dtlWin = cai_main;
}
}
}
if ( reload ||
ahdtop.cstReducePopups ) {
var fid = ( typeof dtlWin == "object" ? dtlWin.cfgFID : cfgFID );
url = cfgCgi +
"?SID=" + cfgSID +
"+FID=" + fid;
if (typeof bForceEdit == "boolean" && bForceEdit)
url += "+OP=UPDATE";
else
url += "+OP=SHOW_DETAIL";
url += "+FACTORY=" + factory +
"+PERSID=" + nx_escape(persid);
if (typeof AlertMsg == "string" &&
AlertMsg != "" ) {
formatAlertMsg();
var pat = new RegExp("^" + msgtext("Save_Successful"));
if(AlertMsg.match(pat) != null && propGLType == "secondary")	
alertSecUpd();
url += "+KEEP.AlertMsg=" + nx_escape(AlertMsg);
}
if(typeof sAdditionalUrl != "undefined" && sAdditionalUrl != "")
{
url += sAdditionalUrl;
}
}
if ( typeof dtlWin == "object" ) {
if ( reload ) {
if ( typeof dtlWin.propFormName3 == "string" &&
dtlWin.propFormName3 == "edit" )
{
alertSecondaryUpd( dtlWin, GLType );
if ( typeof sAdditionalUrl != "undefined" && sAdditionalUrl != ""
&& sAdditionalUrl.indexOf("FOR_CAPREASON=") != -1 )
{
dtlWin.loadCaptureReasonValues( dtlWin, GLType, sAdditionalUrl );
}
}
else {
dtlWin.set_action_in_progress(ACTN_FILLFORM)
display_new_page(url, dtlWin);
}
}
if ( typeof top.workframe == "undefined" ||
typeof top.workframe.SkipInitialFocus == "undefined" ||
"1" != top.workframe.SkipInitialFocus ) {
if ( typeof popup_url == "string" &&
popup_url.indexOf("OP=UPDATE") != -1 &&
typeof dtlWin._dtl == "object" &&
! dtlWin._dtl.edit )
dtlWin.pdm_submit('main_form','UPDATE', ACTN_LOADFORM);
focusCmd = "window.focus();";
if ( typeof dtlWin._dtl == "object" )
{
var dtlwin_str = "window." + dtlWin.name;
focusCmd = "if ( typeof " + dtlwin_str + " == 'object' && typeof " + dtlwin_str + ".detailFocus1st != 'undefined' ) " + dtlwin_str + ".detailFocus1st(); else window.focus();";
}
dtlWin.ahdframeset.setTimeout(focusCmd, 500);
}
return true;
}
if ( reload ) {
if ( typeof window.ahdframeset.top_splash == "object" &&
typeof window.ahdframeset.top_splash.popupAfterSave == "boolean" &&
window.ahdframeset.top_splash.popupAfterSave )
ahdtop.popupWithURL(url);
else if ( (GLType == "secondary") && (factory == "prpval"))
{
if ( typeof ahdframeset.opener.parent._dtl.secUpdCnt == "undefined" )
clearAlertMsg( ahdframeset.opener.parent );
ahdframeset.opener.parent.alertSecondaryUpd( ahdframeset.opener.parent, GLType );
}
else
{
if (factory == "macro")
replace_page(url, window);
else
replace_page(url, window, bReloadOnTmpWin);
}
}
else if ( typeof popup_url != "string" ) {
if ( window.ahdframeset.name != "AHDtop" )
window.ahdframeset.close();
else {
if ( typeof ahdframeset.top_splash.returnURL == "string" ) {
url = ahdframeset.top_splash.returnURL;
ahdframeset.top_splash.returnURL = void(0);
}
replace_page(url);
}
}
else {
var features = "directories=no" +
",location=no" +
",menubar=no" +
",status=no";
if(typeof sAdditionalUrl != "undefined" && sAdditionalUrl != "")
popup_url += sAdditionalUrl;
if(typeof bHideMenuAndLogo != "undefined" && bHideMenuAndLogo)
preparePopup(popup_url, "", features, undefined, undefined, 'TOP_SPLASH=no+MENUBAR=no', bOptOpeninNewWindow);
else
{
window.focus();
preparePopup(popup_url, "", features, void(0), void(0), void(0), bOptOpeninNewWindow);
}
return true;
}
return false;
}
function formatAlertMsg(tgtWin)
{
if ( typeof AlertMsg == "string" &&
AlertMsg == "updateOK" ) {
AlertMsg = msgtext("Save_Successful");
if ( typeof ahdtop.saveAckMsgNum == "number" &&
ahdtop.saveAckMsgNum > 0 ) {
if ( typeof ahdtop.saveAckMsgObjectName == "string" && 
ahdtop.saveAckMsgObjectName.length > 0 )
{
ahdtop.saveAckMsgObjectName = ahdtop.saveAckMsgObjectName.replace(/>/gi,'&#062;');
ahdtop.saveAckMsgObjectName = ahdtop.saveAckMsgObjectName.replace(/</gi,'&#060;');
}
AlertMsg += msgtext(ahdtop.saveAckMsgNum,
" " + ahdtop.saveAckMsgFactoryName,
" " + ahdtop.saveAckMsgObjectName );
if( typeof saveAckMsgExtra != "undefined" && saveAckMsgExtra != '' )
{
AlertMsg += "<br/>"+ saveAckMsgExtra;
}
if(typeof reset_update_lrel == "function") reset_update_lrel();
}
if ( typeof tgtWin == "object" && tgtWin != null )
tgtWin.AlertMsg = "";
}
ahdtop.saveAckMsgNum = void(0);
ahdtop.saveAckMsgFactoryName = void(0);
ahdtop.saveAckMsgObjectName = void(0);
}
function alertSecondaryUpd( win, GLType )
{
if ( GLType == "secondary" &&
typeof win._dtl == "object" ) {
var alertmsg = win.document.getElementById("alertmsg");
var alertmsgText = win.document.getElementById("alertmsgText");
if ( alertmsg != null && alertmsgText != null ) {
var msg = alertmsgText.innerHTML;
if ( typeof win._dtl.secUpdCnt != "number" )
win._dtl.secUpdCnt = 1;
else {
msg = msg.replace(msgtext("This_record_has_%1_accepted_up",win._dtl.secUpdCnt),"");
++win._dtl.secUpdCnt;
}
if ( msg.length > 0 )
msg += "<BR>" + msgtext("This_record_has_%1_accepted_up",win._dtl.secUpdCnt);
else
msg = msgtext("This_record_has_%1_accepted_up",win._dtl.secUpdCnt);
alertmsgText.innerHTML = msg;
alertmsg.style.display = "block";
win.adjScrollDivHeight();
if ( ahdtop.cstUsingScreenReader )
win.alert(msg.replace(/\<br\>/g, "\n"));
}
}
}
var bOverrideDisableRightClick = false;
function disable_right_click_handler(e)
{
var mouse_event = 0;
if ( _browser.isIE == true )
{
mouse_event = event.button;
if ( typeof system_doDown == "function" )
system_doDown();
}
else
mouse_event = e.which;
if ( ! bOverrideDisableRightClick &&
(((mouse_event == 1) && (_browser.isMAC))||
mouse_event == 2 ||
mouse_event == 3 ||
mouse_event == 19))
{
var alert_msg = "";
if ( typeof propFormName == "string" )
alert_msg = ahdtop.msgtext_with_pfx("This_form_is_%1\n",propFormName);
if( typeof __menuBar != "undefined" )
alert_msg += ahdtop.msgtext_with_pfx("Use_File_menu_to_print_or_refr");
alert(alert_msg);
return false;
}
if (_browser.isIE)
return true;
else
return false;
}
function CAisdPrint()
{
if (typeof OnBeforePrint == "function")
{
OnBeforePrint();
}
if(typeof window.parent.frames['page']=="object")
window.parent.frames['page'].print();
else
window.setTimeout("ahdframe.print()", 100);
}
function KDRefresh()
{
if(typeof OnBeforeKDRefresh == "function")
{
OnBeforeKDRefresh();
}
}
var rClickMenu = void(0);
function disable_right_click(showMenu, showAboutAndRefresh)
{
_browser.isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;
_browser.isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
if (typeof cfgMOPreviewMode == "number" && cfgMOPreviewMode == 1) {
showMenu = false;
}
if (typeof ContextMenu == "undefined" || ! (_browser.isIE55 || _browser.isFirefox || _browser.isSafari)) {
if (_browser.isIE)
document.onmousedown = disable_right_click_handler;
else
{
document.oncontextmenu = disable_right_click_handler;
document.addEventListener("contextmenu", showRClickMenu, false);
}
}
else {
document.oncontextmenu = showRClickMenu;
if ( typeof showMenu != "boolean" || showMenu ) {
if ( typeof currDocument != "object" )
currDocument = document;
if ( typeof cfgCAISD != "string" ||
typeof cfgUserType != "string" ) {
if ( typeof ahdtop != "object" ||
ahdtop == null || ahdtop.closed )
return;
cfgCAISD = ahdtop.cfgCAISD;
cfgUserType = ahdtop.cfgUserType;
}
if ( ahdtop.propDebugScript ||
! ahdtop.cstUsingScreenReader ) {
rClickMenu = new ContextMenu("rClickMenu");
if ( typeof cfgProductName != "string" )
cfgProductName = "CA Service Desk";
var formName = "";
if ( typeof propFormName == "string" )
formName = " " + propFormName;
if ( typeof showAboutAndRefresh != "boolean" || showAboutAndRefresh )
{
rClickMenu.addItem( msgtext("About_%1...", cfgProductName),
"popup_window('about','help_about.htmpl', 800, 455,'ahdmenu=no,scrollbars=no,resizable=no')");
}
rClickMenu.addItem( msgtext("Print_Form%1...",formName), "CAisdPrint()" );
if ( typeof showAboutAndRefresh != "boolean" || showAboutAndRefresh )
{
rClickMenu.addItem( msgtext("Refresh"), "refreshForm()" );
}
if ( typeof propFormName == "string" )
rClickMenu.addItem( msgtext("Help_on_This_Window..."),
"help_on_form(self.propFormName)" );
rClickMenu.finish();
}
}
}
}
var paste_field;
function showRClickMenu(evt)
{
paste_field = null;
if ( typeof event == "object" )
evt = event;
if (( evt.ctrlKey ) && (!_browser.isMAC))
return true;
if ( typeof ahdtop != "object" || ! ahdtop.mouseoverMenus ) {
var node;
if ( evt.srcElement )
node = evt.srcElement;
else if ( evt.target )
node = evt.target;
if ( typeof node == "object" &&
node != null ) {
if ( node.type == "text" ||
node.type == "textarea" )
paste_field = node;
while ( node != null &&
typeof node.tagName == "string" &&
node.tagName != "BODY" ) {
if ( typeof node.oncontextmenu == "function" )
return false;
node = node.parentNode;
}
}
}
if ( typeof rClickMenu == "object" )
rClickMenu.show(evt,"",0);
return false;
}
function setWindowTitle(title, no_write)
{
if (typeof cfgMOPreviewMode == "number" && cfgMOPreviewMode == 1) {
return;
}
var win;
for (win = self;
win.name != "AHDtop" && typeof win.parent == "object" && typeof win.parent.name == "string" && win != win.parent;
win = win.parent);
var url=window.location.href;
if(url.search("KEEP.IsPopUp=1") != -1 && url.search("FACTORY=KD")!= -1 && (!(url.search("list_architect_KDs.htmpl")!= -1 || url.search("list_architect_KDs_Pref.htmpl")!= -1)))
{
title = window.ahdframe.hdrTitlePopup;
}
if(url.search("list_architect_KDs.htmpl")!= -1 || url.search("list_architect_KDs_Pref.htmpl")!= -1)
{
title = window.ahdframe.hdrTitle;
}
if ( typeof cfgFormTitle != "string" ||
cfgFormTitle.length == 0 ) {
if ( typeof title != "string" )
title = "";
}
else {
if ( typeof title != "string" ||
title.length == 0 )
title = cfgFormTitle;
else if ( window.ahdframeset.name == "AHDtop" )
title = cfgFormTitle + " - " + title;
else
title = title + " - " + cfgFormTitle;
}
title=title.replace(/&#39;/g,"'");
title=title.replace(/\&lt;/g,"<");
title=title.replace(/\&gt;/g,">");
win.document.title=title;
if (typeof no_write == "undefined" || no_write != 1) {
if(title.indexOf("<%") > -1) title.replace(/\<\%/g,"&lt;%");
document.title= title ;
}
}
var show_header,
cfgIsCS,
cfgAllowPopupResize,
timeoutId,
currDocument,
cfgCAISD,
cfgCgi,
cfgCgiReportScript,
cfgSID,
cfgProductName,
cfgProductID,
cstID,
cfgUserType,
cfgGuestUser,
cfgARGISurl,
cfgLdapEnabled,
cfgCIurl,
cfgHTurl,
cfgETRUSTurl,
cfgAnyContact,
cfgSearchStr,
cfgAccessReqMgr,
cfgAccessChgMgr,
cfgAccessIssMgr,
cfgAccessAdmin,
cfgAccessInventory,
cfgAccessRef,
cfgAccessNotify,
cfgAccessSecurity,
cfgAccessAnmt,
cfgAccessCallMgrRef,
cfgAccessCallMgrTpl,
cfgAccessChgMgrTpl,
cfgAccessChgRef,
cfgAccessCi ,
cfgAccessCiComn,
cfgAccessCiRef,
cfgAccessContact,
cfgAccessGroup,
cfgAccessIssMgrTpl,
cfgAccessIssRef,
cfgAccessLoc,
cfgAccessNotRef,
cfgAccessOrg,
cfgAccessPri,
cfgAccessSvcLvl,
cfgAccessSite,
cfgAccessStoredQuery,
cfgAccessSurvey,
cfgAccessTentAdmin,
cfgAccessTimeZone,
cfgAccessWfRef,
cfgAccessWorkshift,
cfgAccessFac_lr,
cfgAccessFac_in,
cfgAccessFac_pr,
cfgAccessFac_cr,
cfgAccessFac_chg,
cfgAccessFac_iss,
cfgAccessFac_all_lr,
cfgAccessFac_cnt,
cfgUserid,
cfgDateFormat,
cfgDateFormatNoTime,
cfgCIEbrUrl,
cfgFaqInstalled,
cfgCIEbrInstalled,
propIframe,
ahdframe = window,
ahdframeset,
form_title;
function std_head_setup(busy,forLrel, notComplete)
{
if (typeof notComplete == "undefined")
notComplete = 0;
propIframe = ( typeof window.frameElement == "object" &&
window.frameElement != null &&
window.frameElement.tagName == "IFRAME" );
var w = window;
ahdframe = null;
while ( typeof w == "object" ) {
if ( ahdframe == null ) {
if ( typeof w.cai_main == "object" )
ahdframe = w.cai_main;
else if ( typeof w.role_main == "object" )
ahdframe = w.role_main;
else if ( typeof w.page == "object" )
ahdframe = w.page;
else if ( typeof w.frmKDs == "object" )
ahdframe = w.frmKDs;
else if ( typeof w.menu_tree_main == "object" )
ahdframe = w.menu_tree_main;
else if ( typeof w.impact_explorer_main == "object" )
ahdframe = w.impact_explorer_main;
else if ( typeof w.frmAdmin == "object" )
ahdframe = w.frmAdmin;
else if ( typeof w.kdlist == "object" )
ahdframe = w.kdlist;
else if ( typeof w.tourframe == "object")
ahdframe = w.tourframe;
else if ( typeof w.frmDTUserNode == "object")
ahdframe = w.frmDTUserNode;
}
if ( w == w.parent ||
typeof w.gobtn == "object" ) {
ahdframeset = w;
if ( ahdframe == null ) {
if ( typeof w.ahdframe == "object" &&
w.ahdframe != null &&
! w.ahdframe.closed )
ahdframe = w.ahdframe;
else
ahdframe = window;
}
break;
}
if ( w != ahdtop )
w = w.parent;
else {
alertmsg("SEVERE_ERROR:_can't_find_USP_f", window.name );
return;
}
}
try
{
if(ahdframe.name != "AHDtop")
{
ahdframe.parent.ahdframe = ahdframe;
ahdframe.parent.ahdframeset = ahdframeset;
}
}
catch(e) {}
ahdframeset.ahdframe = ahdframe;
if ( ahdframeset.name != "AHDtop" &&
typeof ahdframeset.gobtn == "object" &&
typeof ahdframeset.gobtn.form_cancelled == "boolean" &&
ahdframeset.gobtn.form_cancelled ) {
ahdframeset.window.close();
}
if ( busy != "no" )
set_action_in_progress(ACTN_LOADFORM,false);
if ( _browser.isUnix )
document.write("<link rel='stylesheet' type='text/css' href='" +
cfgCAISD + "/css/unix.css'>\n");
if ( typeof ahdtop == "object" && ahdtop != null &&
typeof ahdtop.popup_req_time == "object" ) {
formCheckpoint = new Object();
if ( typeof ahdframeset.gobtn == "object" &&
typeof ahdframeset.gobtn.requestTime == "number" ) {
formCheckpoint["request"] = new Date(ahdframeset.gobtn.requestTime);
ahdframeset.gobtn.requestTime = void(0);
}
else if ( window.name == "cai_main" &&
parent.location.search.match(/POPUP_URLIX=(\d+)/) &&
typeof ahdtop.popup_req_time[RegExp.$1] != "undefined" ) {
formCheckpoint["request"] = new Date(ahdtop.popup_req_time[RegExp.$1]);
ahdtop.popup_req_time[RegExp.$1] = void(0);
}
formCheckpoint["load"] = new Date();
}
if ( typeof form_title != "string" )
form_title = "";
show_header = ( form_title.length > 0 );
cfgIsCS = false;
cfgAllowPopupResize = true;
timeoutId = 0;
currDocument = document;
if ( typeof ahdtop == "object" && ahdtop != null && ! ahdtop.closed ) {
cfgCAISD = ahdtop.cfgCAISD;
cfgCgi = ahdtop.cfgCgi;
cfgCgiReportScript = ahdtop.cfgCgiReportScript;
cfgSID = ahdtop.cfgSID;
cfgProductName = ahdtop.cfgProductName;
cfgProductID = ahdtop.cfgProductID;
cstID = ahdtop.cstID;
cfgUserType = ahdtop.cfgUserType;
cfgGuestUser = ahdtop.cfgGuestUser;
cfgARGISurl = ahdtop.cfgARGISurl;
cfgLdapEnabled = ahdtop.cfgLdapEnabled;
cfgCIurl = ahdtop.cfgCIurl;
cfgHTurl = ahdtop.cfgHTurl;
cfgETRUSTurl = ahdtop.cfgETRUSTurl;
cfgAnyContact = ahdtop.cfgAnyContact;
cfgSearchStr = ahdtop.cfgSearchStr;
cfgAccessReqMgr = ahdtop.cfgAccessReqMgr;
cfgAccessChgMgr = ahdtop.cfgAccessChgMgr;
cfgAccessIssMgr = ahdtop.cfgAccessIssMgr;
cfgAccessAdmin = ahdtop.cfgAccessAdmin;
cfgAccessInventory = ahdtop.cfgAccessInventory;
cfgAccessRef = ahdtop.cfgAccessRef;
cfgAccessNotify = ahdtop.cfgAccessNotify;
cfgAccessSecurity = ahdtop.cfgAccessSecurity;
cfgAccessAnmt=ahdtop.cfgAccessAnmt;
cfgAccessCallMgrRef=ahdtop.cfgAccessCallMgrRef;
cfgAccessCallMgrTpl=ahdtop.cfgAccessCallMgrTpl;
cfgAccessChgMgrTpl=ahdtop.cfgAccessChgMgrTpl;
cfgAccessChgRef=ahdtop.cfgAccessChgRef;
cfgAccessCi=ahdtop.cfgAccessCi;
cfgAccessCiComn=ahdtop.cfgAccessCiComn;
cfgAccessCiRef=ahdtop.cfgAccessCiRef;
cfgAccessContact=ahdtop.cfgAccessContact;
cfgAccessGroup=ahdtop.cfgAccessGroup;
cfgAccessIssMgrTpl=ahdtop.cfgAccessIssMgrTpl;
cfgAccessIssRef=ahdtop.cfgAccessIssRef;
cfgAccessLoc=ahdtop.cfgAccessLoc;
cfgAccessNotRef=ahdtop.cfgAccessNotRef;
cfgAccessOrg=ahdtop.cfgAccessOrg;
cfgAccessPri=ahdtop.cfgAccessPri;
cfgAccessSvcLvl=ahdtop.cfgAccessSvcLvl;
cfgAccessSite=ahdtop.cfgAccessSite;
cfgAccessStoredQuery=ahdtop.cfgAccessStoredQuery;
cfgAccessSurvey=ahdtop.cfgAccessSurvey;
cfgAccessTentAdmin=ahdtop.cfgAccessTentAdmin;
cfgAccessTimeZone=ahdtop.cfgAccessTimeZone;
cfgAccessWfRef=ahdtop.cfgAccessWfRef;
cfgAccessWorkshift=ahdtop.cfgAccessWorkshift;
cfgAccessFac_lr=ahdtop.cfgAccessFac_lr;
cfgAccessFac_in=ahdtop.cfgAccessFac_in;
cfgAccessFac_pr=ahdtop.cfgAccessFac_pr;
cfgAccessFac_cr=ahdtop.cfgAccessFac_cr;
cfgAccessFac_chg=ahdtop.cfgAccessFac_chg;
cfgAccessFac_iss=ahdtop.cfgAccessFac_iss;
cfgAccessFac_all_lr=ahdtop.cfgAccessFac_all_lr;
cfgAccessFac_cnt=ahdtop.cfgAccessFac_cnt;
cfgUserid = ahdtop.cfgUserid;
cfgDateFormat = ahdtop.cfgDateFormat;
cfgDateFormatNoTime = ahdtop.cfgDateFormatNoTime;
cfgCIEbrUrl = ahdtop.cfgCIEbrUrl;
cfgFaqInstalled = ahdtop.cfgFaqInstalled;
cfgCIEbrInstalled = ahdtop.cfgCIEbrInstalled;
}
else {
cfgCAISD = "/CAisd";
cfgCgi = "";
cfgCgiReportScript = "";
cfgSID = "";
cfgProductName = "CA Service Desk";
cfgProductID = "ahd";
cstID = "0";
cfgUserType = "analyst";
cfgGuestUser = "0";
cfgARGISurl = "";
cfgLdapEnabled = "0";
cfgCIurl = "";
cfgHTurl = "";
cfgETRUSTurl = "";
cfgAnyContact = "0";
cfgAccessReqMgr = "1";
cfgAccessChgMgr = "1";
cfgAccessIssMgr = "1";
cfgAccessAdmin = "1";
cfgAccessInventory = "1";
cfgAccessRef = "1";
cfgAccessNotify = "1";
cfgAccessSecurity = "1";
cfgAccessAnmt="1";
cfgAccessCallMgrRef="1";
cfgAccessCallMgrTpl="1";
cfgAccessChgMgrTpl="1";
cfgAccessChgRef="1";
cfgAccessCi="1";
cfgAccessCiComn="1";
cfgAccessCiRef="1";
cfgAccessContact="1";
cfgAccessGroup="1";
cfgAccessIssMgrTpl="1";
cfgAccessIssRef="1";
cfgAccessLoc="1";
cfgAccessNotRef="1";
cfgAccessOrg="1";
cfgAccessPri="1";
cfgAccessSvcLvl="1";
cfgAccessSite="1";
cfgAccessStoredQuery="1";
cfgAccessSurvey="1";
cfgAccessTentAdmin="1";
cfgAccessTimeZone="1";
cfgAccessWfRef="1";
cfgAccessWorkshift="1";
cfgAccessFac_lr="1";
cfgAccessFac_in="1";
cfgAccessFac_pr="1";
cfgAccessFac_cr="1";
cfgAccessFac_chg="1";
cfgAccessFac_iss="1";
cfgAccessFac_all_lr="1";
cfgAccessFac_cnt="1";
cfgUserid = "userid";
cfgDateFormat = "YYYY.MM.DD hh:mm a(am,pm)";
cfgDateFormatNoTime = "YYYY.MM.DD";
cfgCIEbrUrl = "";
cfgFaqInstalled = "0";
cfgCIEbrInstalled = "0";
}
if ( window.name == "workframe" &&
typeof ahdframe == "object" &&
typeof ahdframe.set_action_in_progress != "undefined" &&
typeof ahdframe.propFormName == "string" &&
ahdframe.propFormName != "reports.htmpl" &&
!notComplete )
ahdframe.set_action_in_progress(0);
if ( form_title.length > 0 )
setWindowTitle(gsub(form_title, "<BR>", " "));
if ( typeof window.ahdframeset.refresh_window_list == "function" )
window.ahdframeset.refresh_window_list();
if ( ! _browser.supportsLayers &&
typeof uspKeydownHandler != "undefined" )
{
if (_browser.isMAC)	
{
document.onkeypress = uspKeydownHandler;
}
else
{
document.onkeydown = uspKeydownHandler;
}
document.onkeyup = uspKeyupHandler;
}
if ( forLrel == "1" &&
propFormName1 == "update" &&
propFormName2 == "lrel" &&
typeof window.opener != "object")
{
window.opener = parent.opener;
}
}
var currentAction = 0;
var resumeAction = void(0);
var ACTN_COMPLETE = 0;
var ACTN_SAVE = 1;
var ACTN_CANCEL = 2;
var ACTN_LOADPROP = 3;
var ACTN_FILLFORM = 4;
var ACTN_SEARCH = 5;
var ACTN_AUTOFILL = 6;
var ACTN_LOADFORM = 7;
var ACTN_UPDATE_COUNTS = 8;
var ACTN_CHK_ASSIGNEE = 9;
var ACTN_RUN_ARCPUR = 10;
var ACTN_RUN_FMGRP = 11;
var ACTN_RUN_NOTIF = 12;
var ACTN_CIA_MAINT = 13;
var ACTN_UPLOAD = 14;
var ACTN_BO_LOGOFF = 15;
var ACTN_CONFLICT_ANALYSIS = 16;
var ACTN_UPD_TRANS = 17;
var autofill_field = "";
function curr_form_action()
{
return ahdframe.currentAction;
}
function set_action_in_progress(action,setReqTime)
{
if (ahdframe.currentAction != ACTN_AUTOFILL || 
(typeof _dtl != "undefined" && _dtl.lastKeycode == TAB) ||
typeof __search_filter != "undefined")
set_action_in_progress_intern(action,setReqTime);
else 
{
if (typeof setReqTime == "undefined") 
setReqTime = false;
setTimeout("set_action_in_progress_intern(" + action + "," + setReqTime + ")", 1000);
}
}
function set_action_in_progress_intern(action,setReqTime)
{
var menubar = ahdframeset.menubar;
ahdframe.currentAction = action;
if ( typeof ahdframeset.gobtn == "object" ) {
var busygifLayer = ahdframeset.gobtn.document.getElementById("busygifLayer");
if ( busygifLayer != null ) {
var e1 = null;
if ( ahdframeset != ahdtop ||
ahdtop.propInitialPopup == "1" ){
if ( typeof menubar == "object" &&
typeof menubar.document == "object" )
e1 = menubar.document.getElementById("idMenuCloseWin");
}
var e2 = ahdframeset.gobtn.document.getElementById("gobtnDiv");
if ( action == 0 ) {
busygifLayer.style.display = "none";
if ( e1 != null )
e1.style.display = "block";
if ( e2 != null )
e2.style.display = "block";
if ( typeof ahdframe.resumeAction != "undefined" ) {
if ( typeof ahdframe.resumeAction == "string" ) {
var curr_resume_action = ahdframe.resumeAction;
ahdframe.resumeAction = void(0);
if ( curr_resume_action.length > 0 )
eval(curr_resume_action);
}
}
}
else {
if ( e1 != null )
e1.style.display = "none";
if ( e2 != null )
e2.style.display = "none";
busygifLayer.style.display = "block";
if ( typeof setReqTime == "undefined" || setReqTime )
ahdframeset.gobtn.requestTime = (new Date()).getTime();
}
}
else	{
var hourglassLayer = ahdframeset.ahdframe.document.getElementById("hourglassLayer");
if ( action == 0 ) {
if (hourglassLayer != null)
hourglassLayer.style.display = "none";
if ( typeof ahdframe.resumeAction != "undefined" ) {
if ( typeof ahdframe.resumeAction == "string" ) {
var curr_resume_action = ahdframe.resumeAction;
ahdframe.resumeAction = void(0);
if ( curr_resume_action.length > 0 )
eval(curr_resume_action);
}
}
}
else {
if ( hourglassLayer != null)
hourglassLayer.style.display = "block";
if ( typeof setReqTime == "undefined" || setReqTime )
ahdframeset.gobtn.requestTime = (new Date()).getTime();
}
}
}
}
function is_action_in_progress()
{
if (ahdframe.currentAction == ACTN_COMPLETE)
{
return true;
}
else
{
return false;
}
}
function action_in_progress()
{
if ( ahdframe.currentAction == ACTN_COMPLETE )
return false;
if ( typeof ahdtop != "object" || ahdtop == null || ahdtop.closed )
return false;
if ( typeof ahdtop.AHD_logout_requested != "undefined" &&
ahdtop.AHD_logout_requested )
return false;
switch ( ahdframe.currentAction ) {
case 1:
alertmsg("Save_in_progress_-_please_wait");
return true;
case 2:
alertmsg("Cancel_in_progress_-_please_wa");
return true;
case 3:
if (typeof ahdframe.resumeAction == "undefined" ||
ahdframe.resumeAction.indexOf("detailCancel") == -1)
alertmsg("Currently_adding_property_fiel");
return true;
case 4:
alertmsg("Form_incomplete_-_please_wait");
return true;
case 5:
alertmsg("Search_in_progress_-_please_wa");
return true;
case 6:
alertmsg("Field_completion_in_progress_-");
return true;
case 7:
alertmsg("Page_load_in_progress_-_please");
return true;
case 8:
alertmsg("Update_counts_in_progress_-_pl");
return true;
case 9:
if (typeof ahdframe.resumeAction == "undefined")
alertmsg("Assignee_check_in_progress_-_p");
return true;
case 10:
alertmsg("Issuing_request(s)_to_run_arch");
return true;
case 11:
alertmsg("Processing_request_to_refresh_");
return true;
case 12:
alertmsg("Processing_request_to_refresh_");
return true;
case 13:
alertmsg("Change_Impact_Analyzer_mainten");
return true;
case 14:
alertmsg("Upload_is_in_progress_-_please");
return true;
case 15:
alertmsg("Logout_is_in_progress_-_please");
return true;
case 16:
alertmsg("Conflict_is_in_progress_-_please");
return true;
case 17:
alertmsg("Transition_update_in_progress_-_please_wait");
return true;
default:
alertmsg("Currently_performing_action_%1", ahdframe.currentAction);
return true;
}
}
function getActionKeyWindow(useCurTab)
{
var w = ( typeof ahdframeset == "object" ? ahdframeset : ahdtop );
if ( w == ahdtop &&
typeof w.toolbarTab == "object" ) {
if ((typeof useCurTab != "undefined") &&
useCurTab)
{
var currTabID = ahdtop.toolbarCurrentTab;
if ( typeof currTabID == "number" &&
currTabID >= 0 ) {
var tbar = ahdtop.toolbarTab[currTabID];
if ( typeof tbar == "object" &&
typeof tbar.iframe == "object" )
w = tbar.iframe;
}
}
else
{
var parentWindow = window;
var childWindow = null;
try {
while ( parentWindow != childWindow &&
parentWindow.name != "product" &&
parentWindow.name != "AHDtop" ) {
childWindow = parentWindow;
parentWindow = childWindow.parent;
}
}
catch(e) {}
try {
if ( parentWindow != childWindow &&
parentWindow.name == "product" &&
childWindow != null ) {
var name = childWindow.name;
for ( var i = ahdtop.toolbarTab.length - 1; i >= 0; i-- ) {
if ( name == ahdtop.toolbarTab[i].id ) {
w = childWindow;
break;
}
}
}
}
catch(e) {}
}
}
if ( typeof w.actionKey != "object" ) {
w.actionKey = new Array();
w.actionKey[0] = "";
w.tabLoading = false;
}
return w;
}
function createTabActionKeyArray()
{
var w = getActionKeyWindow();
w.actionKeyTab = new Array();
w.tabLoading = true;
return w.actionKeyTab;
}
function setTabLoadComplete()
{
var w = getActionKeyWindow();
w.tabLoading = false;
}
function checkTabLoadFlag()
{
var w = getActionKeyWindow();
return w.tabLoading;
}
function setTabActionKey(actionKeyTab)
{
var w = getActionKeyWindow();
w.actionKeyTab = actionKeyTab;
}
var BS = 8;
var TAB = 9;
var ENTER = 13;
var SHIFT = 16;
var CTRL = 17;
var ALT = 18;
var ESC = 27;
var PAGE_UP = 33;
var PAGE_DOWN = 34;
var END = 35;
var HOME = 36;
var ARROW_LEFT = 37;
var ARROW_RIGHT = 39;
var ARROW_UP = 38;
var ARROW_DOWN = 40;
var F01 = 112;
var F02 = 113;
var F03 = 114;
var F04 = 115;
var F05 = 116;
var F06 = 117;
var F07 = 118;
var F08 = 119;
var F09 = 120;
var F10 = 121;
var F11 = 122;
var F12 = 123;
var shiftKey = false;
var ctrlKey_saved = false;
var fallbackHotkey = "$";
try { if ( ahdtop.cfgUserType != "analyst" ) fallbackHotkey = ""; }
catch(e) {}
function refresh_handler(key_pressed)
{
if (ahdframeset.name != "AHDtop")
{
var main_frame = ahdframeset.ahdframe;
if (main_frame.name == "page")
{
ahdtop.pb_refresh_urls = new Array();
var menu_frame = main_frame.parent.menu;
if (typeof menu_frame == "object")
ahdtop.pb_refresh_urls["menu"] = menu_frame.location.href;
ahdtop.pb_refresh_urls["page"] = main_frame.location.href;
return true;
}
}
if (_browser.isIE &&
(ahdframeset.name != "AHDtop"))
{
if (ctrlKey_saved && key_pressed == 82 && _browser.systemLanguage != "de")
{
ctrlKey_saved = false;
return false;
}
ctrlKey_saved = window.event.ctrlKey;
if (key_pressed == 116)
{
if (typeof ahdtop == "object")
{
var top_url = ahdframeset.location.href;
var doc_url = ahdframeset.ahdframe.location.href;
var main_frame = ahdframeset.ahdframe;
var fid = ahdtop.fid_generator();
var useParent = 0;
if (main_frame.name != "cai_main")
{
var cm_frame = main_frame;
while (cm_frame != ahdframeset)
{
cm_frame = cm_frame.parent;
if (cm_frame.name == "cai_main")
break;
}
if (cm_frame != ahdframeset)
{
useParent = 1;
doc_url = cm_frame.location.href;
}
}
if (!useParent &&
(typeof main_frame._dtl == "object") &&
!main_frame._dtl.edit &&
(doc_url.indexOf("?") == -1 ||
doc_url.indexOf("OP=CANCEL") != -1 ||
doc_url.indexOf("OP=DELETE") != -1 ||
doc_url.indexOf("OP=UPDATE") != -1))
{
doc_url = cfgCgi +
"?SID=" + cfgSID +
"+FID=" + fid +
"+OP=SHOW_DETAIL" +
"+FACTORY=" + main_frame._dtl.factory +
"+PERSID=" + nx_escape(main_frame._dtl.factory + ":" + main_frame._dtl.id);
}
else
{
var pat = new RegExp("[\\+]{0,1}KEEP.POPUP_NAME[^ \\+$]+", "g");
var temp_str1 = doc_url.replace(pat, "");
var temp_str = temp_str1.replace(/\? *\+/g, "?");
pat = new RegExp("FID[^ \\+$]+", "g");
doc_url = temp_str.replace(pat, "FID=" + fid);
}
ahdtop.lastClosedURL = doc_url;
}
return false;
}
}
return true;
}
var accordionSelected = -1;
var prevKey = -1;
function nestedTabKeyDownHandler( altkey, key_pressed )
{	
if ( ! altkey )
{
altPressed = false;
accordionSelected = -1;
}
else
{
var numkeyPressed = key_pressed - 48;
altPressed = true;
if ( key_pressed == ALT )
{
accordionSelected = -1;
}
if ( numkeyPressed >= 0 && numkeyPressed <= 9 &&
numkeyPressed != prevKey &&
typeof ahdframe == "object" &&
typeof ahdframe._dtl == "object" &&
typeof ahdframe.openAccordion != "undefined" &&
typeof ahdframe.openTab != "undefined" )
{
if ( accordionSelected == -1 ) 
{
ahdframe.openAccordion(numkeyPressed); 
accordionSelected = numkeyPressed;
}
else 
{
ahdframe.openTab(accordionSelected,numkeyPressed);
}
prevKey = numkeyPressed;
return true;
}
}
return false;
}
function uspKeyupHandler (event)
{
prevKey = -1;	
}
function uspKeydownHandler(e)
{
var altKey;
var ctrlKey;
if (typeof ahdframeset.shiftKey == "boolean")
ahdframeset.shiftKey = false;
shiftKey = false;
var key_pressed;
var active_element;
if (_browser.isIE ) {
e = window.event;
altKey = e.altKey;
ctrlKey = e.ctrlKey;
shiftKey = e.shiftKey;
key_pressed = e.keyCode;
active_element = document.activeElement;
}
else {
altKey = e.altKey;
ctrlKey = e.ctrlKey;
shiftKey = e.shiftKey;
key_pressed = e.keyCode;
active_element = e.target;
}
if (ctrlKey && altKey)
return true; 
if (shiftKey != true)
{
if ( nestedTabKeyDownHandler( altKey, key_pressed ) )
return true;
}
if (key_pressed == BS &&
active_element.type != "text" &&
active_element.type != "password" &&
active_element.type != "textarea")
{
return false;
}
var mf = ahdframeset.ahdframe;
if (typeof mf.__menuBar == "object" &&
typeof mf.__menuBar.altKeyAction != "undefined" &&
mf.__menuBar.altKeyAction)
mf.__menuBar.altKeyAction = false;
if (!refresh_handler(key_pressed))
return false;
if (!_browser.isIE &&
altKey &&
key_pressed != ALT &&
key_pressed != SHIFT)
{
var str_key = String.fromCharCode(key_pressed);
if (shiftKey &&
key_pressed == 52)
str_key = fallbackHotkey;
var ret = true;
if (!ctrlKey &&
(key_pressed < F01 || key_pressed > F12))
{
ret = altKeyPressed(str_key, shiftKey);
}
if (ret && window != ahdframeset.ahdframe)
{
ret = ahdframeset.ahdframe.uspKeydownHandler(e);
}
if (ret)
return true;
return false;
}
if (typeof ahdframeset.shiftKey == "boolean")
ahdframeset.shiftKey = shiftKey;
if ( typeof tempKeyDownHandler == "function" ) {
if ( ! tempKeyDownHandler( active_element, key_pressed,
shiftKey, altKey ) ) {
if ( _browser.isIE )
e.returnValue = false;
return false;
}
}
if ( key_pressed == ENTER &&
typeof active_element.type == "string" &&
active_element.type != "select-one" &&
active_element.type != "select-multiple" &&
active_element.type != "textarea" &&
typeof imgBtnDefault == "object" &&
typeof imgBtnDefault.enabled == "boolean" &&
imgBtnDefault.enabled ) {
var len = document.forms.length;
for ( var i = 0; i < document.forms.length; i++ ) {
var f = document.forms[i];
for ( var j = 0; j < f.length; j++ )
if ( f.elements[j] == active_element ) {
if ( ! _browser.supportsLayers &&
typeof imgBtnDefault.obj == "object" )
imgBtnDefault.obj.className = "clsButtonDown";
if ( typeof active_element.onchange == "function" )
active_element.onchange();
if ( _browser.supportsLayers &&
typeof active_element.onblur == "ftest_key.charCodeAt(0unction" )
active_element.onblur();
eval( imgBtnDefault.func );
if ( imgBtnDefault.nohighlight &&
! _browser.supportsLayers &&
typeof imgBtnDefault.obj == "object" )
imgBtnDefault.obj.className = "clsButtonEnabled";
if ( _browser.isIE )
e.returnValue = false;
return false;
}
}
}
else if ( key_pressed == ARROW_RIGHT &&
active_element.tagName == "A" ) {
var node = active_element;
while ( node != null &&
typeof node.tagName == "string" &&
node.tagName != "BODY" ) {
if ( typeof node.oncontextmenu == "function" ) {
var code = node.oncontextmenu.toString().replace(/\n/g," ");
if ( code.match(/rsRowClick.*"(\d+)/) ) {
showRecordMenu("mouseless", RegExp.$1);
return false;
}
else if ( code.match(/\{\s*(.*\.show)\([^,]*,[^,]*,\s*(\d+)/ ) ) {
code = RegExp.$1 + "(\"mouseless\",active_element," + RegExp.$2 + ");";
try { eval(code) } catch(e) {};
return false;
}
break;
}
node = node.parentNode;
}
}
else if ( key_pressed == ESC) {
if (typeof ahdframeset == "object" && ahdframeset != null &&
typeof ahdframeset.ahdframe == "object" && ahdframeset.ahdframe != null &&
typeof ahdframeset.ahdframe.closeMOPreview == "function") {
ahdframeset.ahdframe.closeMOPreview();
}	
else if (typeof mo_preview_win == "object" && mo_preview_win != null &&
typeof mo_preview_win.closeMOPreview == "function") {
mo_preview_win.closeMOPreview();
}
}
return true;
}
var kdHandlerStack = new Array();
var tempKeyDownHandler = null;
function setTempKeyDownHandler(func)
{
if ( typeof func != "function" || func == null ) {
if ( kdHandlerStack.length == 0 ) {
tempKeyDownHandler = null;
}
else {
tempKeyDownHandler = kdHandlerStack[kdHandlerStack.length-1];
delete kdHandlerStack[kdHandlerStack.length-1];
}
}
else {
if ( typeof tempKeyDownHandler == "function" &&
tempKeyDownHandler != null )
kdHandlerStack[kdHandlerStack.length] = tempKeyDownHandler;
tempKeyDownHandler = func;
}
}
var allHotkeys = "ABCEFGHIJKLMNOPQRSTUVWXYZ0123456789<>()$";
try { 
if (typeof parent.accordion_tab_info_array != "undefined" ||
typeof accordion_tab_info_array != "undefined")	
allHotkeys = "ABCEFGHIJKLMNOPQRSTUVWXYZ<>()$";
}
catch(e) {}
var nonLatinFlag = 0;
if ((typeof __messages != "undefined" &&
__messages["non_latin_flag"] == 1) ||
(typeof ahdtop == "object" &&
typeof ahdtop.__messages != "undefined" &&
ahdtop.__messages["non_latin_flag"] == 1))
nonLatinFlag = 1;
function registerActionKey( key, label, func )
{
var next_avail = void(0);
if ( window.name.length > 4 &&
window.name.substring(0,4) == "work" )
return "";
if ( typeof ahdtop == "object" &&
ahdtop != null &&
( ahdtop.cfgUserType != "analyst" ||
ahdtop.cstUsingScreenReader ) )
return "";
if ( key == fallbackHotkey )
return "";
var actKey, my_key = "";
var w = getActionKeyWindow();
var actionKey = ( w.tabLoading ? w.actionKeyTab : w.actionKey );
var uc_label = label.toUpperCase();
var args = new Array();
var idx = 0;
for ( var j = 3; j < arguments.length; j++ )
{
if (arguments[j] == "NEXT_AVAIL")
next_avail = true;
else
args[idx++] = arguments[j];
}
for (idx = args.length - 1; idx >=0 ; idx--)
{
if (typeof args[idx] != "undefined")
{
args.length = idx + 1;
break;
}
}
if ( typeof actionKey == "object" ) {
var in_use = "";
for ( var i = allHotkeys.length-1; i>=0; i-- ) {
var test_key = allHotkeys.substr(i,1);
actKey = w.actionKey[test_key.charCodeAt(0)];
if ( typeof actKey == "object" &&
typeof actKey.win == "object" &&
! actKey.win.closed )
in_use += test_key;
else {
w.actionKey[test_key.charCodeAt(0)] = void(0);
if ( w.tabLoading ) {
actKey = w.actionKeyTab[test_key.charCodeAt(0)];
try
{
if ( typeof actKey == "object" &&
typeof actKey.win == "object" &&
! actKey.win.closed )
in_use += test_key;
else
w.actionKeyTab[test_key.charCodeAt(0)] = void(0);
}
catch (e)
{
w.actionKeyTab[test_key.charCodeAt(0)] = void(0);
}
}
else 
{
if (typeof ahdframe.tab_info_array != "undefined")
{
var tf_arr = ahdframe.tab_info_array;
var tab_info, ak, idx;
for (var idx = 0; idx < tf_arr.length; idx++)
{
tab_info = tf_arr[idx];
if (typeof tab_info.actionKey != "undefined")
{
ak = tab_info.actionKey;
actKey = ak[test_key.charCodeAt(0)];
try 
{
if ( typeof actKey == "object" &&
typeof actKey.win == "object" &&
! actKey.win.closed )
{
in_use += test_key;
break;
}
else
ak[test_key.charCodeAt(0)] = void(0);
}
catch (e)
{
ak[test_key.charCodeAt(0)] = void(0);
}
}	
}
}
}
}
}
my_key = bestKey(key, label, in_use, actionKey, func, args, next_avail);
if ( my_key != " " ) {
if ( typeof window.actKeyOrigUnload == "undefined" ) {
if ( typeof window.onunload == "undefined" )
window.actKeyOrigUnload = null;
else
window.actKeyOrigUnload = window.onunload;
window.onunload = actKeyWinUnload;
}
actKey = new Object;
actionKey[my_key.charCodeAt(0)] = actKey;
actKey.args = new Array;
actKey.label = label;
actKey.win = window;
if ( typeof func == "function" ) {
actKey.func = func;
actKey.activated = false;
actKey.args = args;
}
else {
actKey.func = void(0);
actKey.activated = true;
}
}
}
return my_key;
}
function createNewArray ()
{
var newArray = new Array();
return newArray;
}	
function registerFallbackKey( objID, keepPos )
{
if ( window.name.length > 4 &&
window.name.substring(0,4) == "work" )
return;
if ( typeof ahdtop == "object" &&
ahdtop != null &&
( ahdtop.cfgUserType != "analyst" ||
ahdtop.cstUsingScreenReader ) )
return;
if ( fallbackHotkey == "" )
return;
if (typeof keepPos == "undefined")
keepPos = false;
var w = getActionKeyWindow();
var actkeyObj;
var fallbackArray = w.actionKey[fallbackHotkey];
if ( typeof fallbackArray != "object" ) {
fallbackArray = w.createNewArray();
fallbackArray[0] = 0;
w.actionKey[fallbackHotkey] = fallbackArray;
}
var newArray = null;
for ( var i = 1; i < fallbackArray.length; i++ ) {
actkeyObj = fallbackArray[i];
try {
var keepElement = typeof actkeyObj == "object" &&
typeof actkeyObj.win == "object" &&
(actkeyObj.id != objID || actkeyObj.win != window) &&
! actkeyObj.win.closed;
}
catch(e) {
keepElement = false;
}
if ( keepElement ) {
if ( newArray != null )
newArray[newArray.length] = actkeyObj;
}
else if ( newArray == null ) {
if (keepPos)
{
fallbackArray[i].obj = document.getElementById(objID);
return;
}
else
{
newArray = w.createNewArray();
newArray[0] = ( i < fallbackArray[0] ? i : fallbackArray[0] );
for ( var j = 1; j < i; j++ )
newArray[j] = fallbackArray[j];
}
}
}
if ( newArray != null ) {
fallbackArray = newArray;
w.actionKey[fallbackHotkey] = fallbackArray;
}
actkeyObj = new Object();
actkeyObj.id = objID;
actkeyObj.win = window;
actkeyObj.obj = document.getElementById(objID);
fallbackArray[fallbackArray.length] = actkeyObj;
}
function actKeyWinUnload()
{
var w = getActionKeyWindow();
if ( typeof window.__menuBar == "object" )
window.__menuBar.owningWindow = null;
for ( var i = allHotkeys.length - 1; i >= 0; i-- ) {
var keyCode = allHotkeys.substr(i,1).charCodeAt(0);
actKey = w.actionKey[keyCode];
if ( typeof actKey == "object" &&
actKey.win == window )
w.actionKey[keyCode] = void(0);
else if ( typeof w.actionKeyTab == "object" ) {
actKey = w.actionKeyTab[keyCode];
if ( typeof actKey == "object" &&
actKey.win == window )
w.actionKeyTab[keyCode] = void(0);
}
}
if ( typeof actKeyOrigUnload != "undefined" &&
actKeyOrigUnload != null )
actKeyOrigUnload();
}
function bestKey( key, label, in_use, actionKey, func, args, next_avail )
{
if ( typeof ahdtop == "object" &&
ahdtop != null &&
( ahdtop.cfgUserType != "analyst" ||
ahdtop.cstUsingScreenReader ) )
return "";
var i, actKey, test_key;
var uc_label = label.toUpperCase();
uc_label = uc_label.replace(/&#39;/g,"'");
in_use = in_use.toUpperCase();
var key_suggested = false;
var key_rejected = false;
if ( key.length > 0 ) {
key = key.toUpperCase();
if ( key.substr(0,1) != "!" )
key_suggested = true;
else if ( key.length > 1 ) {
key_rejected = true;
key = key.substr(1,key.length-1);
}
}
if ( key_suggested ) {
for ( var kx = 0; kx < key.length; kx++ ) {
test_key = key.substr(kx,1);
if ( test_key == fallbackHotkey ||
allHotkeys.indexOf(test_key) < 0 )
continue;
if ( uc_label.indexOf(test_key) != -1 ) {
if ( in_use.indexOf(test_key) == -1 )
return test_key;
if ( typeof actionKey == "object" ) {
actKey = actionKey[test_key.charCodeAt(0)];
if ( typeof actKey == "object" &&
typeof actKey.label == "string" &&
actKey.label == label &&
actKey.func == func ) {
if ( typeof args != "object" )
return test_key;
if ( args.length == actKey.args.length ) {
for ( i = 0; i < args.length; i++ )
if ( args[i] != actKey.args[i] )
break;
if ( i == args.length )
return test_key;
}
}
}
}
}
}
if (typeof next_avail != "undefined" &&
next_avail &&
nonLatinFlag)
{
for (i = 0; i < allHotkeys.length; i++)
{
test_key = allHotkeys.substr(i,1);
if (in_use.indexOf(test_key) == -1)
return test_key;
}
return " ";
}
var candidate_key = " ";
for ( var posn = 0; posn < label.length; posn++ ) {
test_key = uc_label.substr(posn,1);
if (test_key == "_") continue;
if ( key_rejected && key.indexOf(test_key) != -1 )
continue;
if (allHotkeys.indexOf(test_key) < 0)
continue;
if ( test_key.match(/\w/) && test_key != fallbackHotkey ) {
if ( in_use.indexOf(test_key) != -1 ) {
if ( typeof actionKey != "object" )
continue;
actKey = actionKey[test_key.toUpperCase().charCodeAt(0)];
if ( typeof actKey != "object" ||
typeof actKey.label != "string" ||
actKey.label != label ||
actKey.func != func )
continue;
if ( typeof args == "object" ) {
if ( args.length != actKey.args.length )
continue;
for ( i = 0; i < args.length; i++ )
if ( args[i] != actKey.args[i] )
break;
if ( i < args.length )
continue;
}
}
if ( test_key == label.substr(posn,1) )
return test_key;
if ( candidate_key == " " )
candidate_key = test_key;
}
}
return candidate_key;
}
function fmtLabelWithActkey( label, actkey )
{
var text = label;
var add_hotkey = 0;
if (nonLatinFlag)
{
var uc_label = label.toUpperCase();
var uc_actkey = actkey.toUpperCase();
if (uc_label.indexOf(uc_actkey) == -1 && uc_actkey != " ")
add_hotkey = 1;
}
if(add_hotkey)
{
text +=" (<U>" +actkey+"</U>)";
}
else
if ( typeof actkey == "string" &&
actkey.length == 1 &&
actkey != " " ) {
var posn = -1;
var actkeyLow = actkey.toLowerCase();
for ( var i = 0; i < label.length; i++ ) {
var c = label.substr(i,1);
if ( c == '<' ) {
var j = label.indexOf('>',i);
if ( j != -1 ) {
i = j + 1;
if ( i >= label.length )
break;
c = label.substr(i,1);
}
}
if ( c == actkey ) {
posn = i;
break;
}
if ( c == actkeyLow && posn == -1 )
posn = i;
}
if ( posn != -1 ) {
if ( posn == 0 )
text = "";
else
text = label.substr(0,posn);
text += "<U>" + label.substr(posn,1) + "</U>";
if ( posn < label.length - 1 )
text += label.substr(posn+1,label.length-posn-1);
}
else if ( actkey == fallbackHotkey ) {
text += " (<u>" + fallbackHotkey + "</u>)";
}
}
return text;
}
function activateActionKeys()
{
if (!_browser.isIE)
return;
if ( typeof ahdtop != "object" ||
ahdtop == null ||
! ( ahdtop.cfgUserType != "analyst" ||
ahdtop.cstUsingScreenReader ) ) {
for ( var i = 0; i < allHotkeys.length; i++ ) {
var key = allHotkeys.substr(i,1);
var text = "<a accesskey=\"" + key + "\" tabindex=-1";
if ( _browser.isIE )
text += " href='javascript:void(0)'" +
" onfocus='altKeyPressed(\"" + key + "\")'></A>";
else
text += " href='Javascript:altKeyPressed(\"" + key + "\")'></A>";
document.writeln(text);
}
}
}
function altKeyPressed(key, shift_key)
{
var mf = ahdframeset.ahdframe;
if (typeof mf.__menuBar == "object" &&
typeof mf.__menuBar.altKeyAction != "undefined" &&
mf.__menuBar.altKeyAction)
{
mf.__menuBar.altKeyAction = false;
mf.focus();
return true;
}
var actionKeys = new Array();
var w = getActionKeyWindow();
if ( typeof w.actionKeyTab == "object" )
actionKeys[actionKeys.length] = w.actionKeyTab;
actionKeys[actionKeys.length] = w.actionKey;
if ( typeof ahdframeset == "object" &&
ahdframeset == ahdtop )
actionKeys[actionKeys.length] = ahdtop.actionKey;
var i;
var sf_key = shiftKey;
if (typeof ahdframeset.shiftKey == "boolean")
sf_key = ahdframeset.shiftKey;
if (!_browser.isIE &&
typeof shift_key == "boolean")
sf_key = shift_key;
if ( sf_key ) {
for ( i = actionKeys.length - 1; i >= 0; i-- )
if ( doHotkeyAction(actionKeys[i], key) )
return false;
}
else {
for ( i = 0; i < actionKeys.length; i++ )
if ( doHotkeyAction(actionKeys[i], key) )
return false;
}
window.status = '';
return true;
}
function doHotkeyAction(actionKey, key)
{
var code = key.toUpperCase().charCodeAt(0);
var actkey = actionKey[code];
if ( typeof actkey == "object"&&
typeof actkey.func == "function" &&
typeof actkey.win == "object" &&
! actkey.win.closed ) {
actkey.win.focus();
var a = actkey.args;
if (actkey.func.toString().match(/function *ImgBtnExecute *\(/) &&
(typeof actkey.win.imgBtnArray == "object" && 
actkey.win.imgBtnArray != null))
{
var btn = actkey.win.imgBtnArray[a[0]];
if (typeof btn == "object" && 
btn != null &&
!btn.enabled)
return false;
} 
switch ( a.length ) {
case 0: actkey.func(); break;
case 1: actkey.func(a[0]); break;
case 2: actkey.func(a[0],a[1]); break;
case 3: actkey.func(a[0],a[1],a[2]); break;
case 4: actkey.func(a[0],a[1],a[2],a[3]); break;
case 5: actkey.func(a[0],a[1],a[2],a[3],a[4]); break;
default: actkey.func(a); break;
}
return true;
}
else if ( key == fallbackHotkey ) {
var fallbackArray = actionKey[fallbackHotkey];
if ( typeof fallbackArray == "object" &&
fallbackArray.length > 1 ) {
var currPosn = fallbackArray[0];
var i = currPosn + 1;
while ( 1 ) {
if ( i >= fallbackArray.length ) {
if ( currPosn == 0 )
break;
i = 1;
}
actkey = fallbackArray[i];
try {
actkey.win.focus();
actkey.obj = actkey.win.document.getElementById(actkey.id);
var no_focus = (actkey.obj.style.display == "none" || 
actkey.obj.tabIndex == -1);	
if ( actkey.obj != null && !no_focus) {
actkey.obj.focus();
fallbackArray[0] = i;
if (!_browser.isIE)
return true;
break;
}
}
catch(e) {}
if ( i == currPosn ) break;
i++;
}
}
}
window.status = '';
return false;
}
function clickOnLink(id)
{
try {
var link = document.getElementById(id);
if ( link != null )
document.location.href = link.href;
}
catch(e) {}
}
function setRadioButton( form, field, index )
{
try {
var e;
if ( arguments.length == 1 )
e = document.getElementById(form);
else {
e = document.forms[form].elements[field];
e = e[index];
}
e.focus();
e.checked = true;
if ( typeof e.onclick == "function" )
e.onclick();
}
catch(e) {}
}
function setCheckbox( form, field, index )
{
try {
var e = document.forms[form].elements[field];
if ( typeof index == "number" )
e = e[index];
e.focus();
e.checked = ! e.checked;
if ( typeof e.onclick == "function" )
e.onclick();
}
catch(e) {}
}
function setFocus(id)
{
var e = document.getElementById(id);
if ( e == null ) {
for ( var i = window.frames.length - 1; i >= 0; i-- ) {
e = window.frames[i].document.getElementById(id);
if ( e != null )
break;
}
}
if ( e != null )
try { e.focus(); }
catch(e) {}
}
function callInFrame( name, script )
{
if ( window.name == name )
eval(script);
else {
for ( var i = window.frames.length - 1; i >= 0; i-- ) {
var f = window.frames[i];
if ( typeof f.callInFrame == "function" )
f.callInFrame(name, script);
}
}
}
function bubbleToMainWindow( active_element, keycode, shiftkey )
{
var f = parent.ahdframe;
if ( typeof f == "object" &&
typeof f.tempKeyDownHandler == "function" )
return ! f.tempKeyDownHandler( active_element, keycode, shiftkey );
return false;
}
function insertTabToFrameLink(frameName)
{
if ( ! ahdtop.cstUsingScreenReader ) {
var link = "<a href=javascript:void(0) " +
" onfocus=\"tabToFrame('" + frameName;
for ( var i = 1; i < arguments.length; i++ )
link += "','" + arguments[i];
link += "')\"></a>";
document.write(link);
}
}
function tabToFrame(frameNames)
{
var i, j, frameList = new Array();
for ( i = 0; i < arguments.length; i++ )
frameList[i] = arguments[i];
frameList[i] = window.name;
for ( var fnum = 0; fnum < frameList.length; fnum++ ) {
var e, f = parent.frames[frameList[fnum]];
if ( typeof f != "object" || f == null )
f = parent.parent.frames[frameList[fnum]];
if ( typeof f != "object" || f == null )
f = window.frames[frameList[fnum]];
if ( typeof f == "object" && f != null ) {
if ( typeof f.initialFocusField == "string" ) {
e = f.document.getElementById(f.initialFocusField);
if ( e != null ) {
e.focus();
return;
}
}
e = f.document.getElementById("rslnk_0_0");
if ( e != null ) {
e.focus();
return;
}
var forms = f.document.forms;
for ( i = 0; i < forms.length; i++ ) {
if ( isHidden(forms[i]) )
continue;
for ( j = 0; j < forms[i].elements.length; j++ ) {
e = forms[i].elements[j];
if ( typeof e == "object" &&
( e.type == "text" ||
e.type == "textarea" ||
e.type == "select-one" ||
e.type == "select-multiple" ) ) {
try { e.focus() }
catch(e) { continue; }
return;
}
}
}
var links = f.document.getElementsByTagName("A");
if ( links != null && links.length > 0 ) {
for ( i = 0; i < links.length; i++ ) {
var link = links[i];
if ( isHidden(link) )
continue;
if ( link.id.length > 0 &&
! link.id.match(/^ctx/) ) {
try { link.focus(); }
catch(e) { continue; }
return;
}
}
}
}
}
}
function isHidden(e)
{
try {
while ( typeof e == "object" &&
e != null ) {
if ( e.style.display == "none" )
return true;
if ( e == e.parentNode )
break;
e = e.parentNode;
}
}
catch(e) {}
return false;
}
var holdingHTMLText = false;
var writingHTMLText = true;
var htmlTextHolder = "";
function holdHTMLText(writeText)
{
htmlTextHolder = "";
holdingHTMLText = true;
writingHTMLText = ( typeof writeText != "boolean" || writeText );
}
function resetHTMLTextHold()
{
htmlTextHolder = "";
holdingHTMLText = false;
writingHTMLText = true;
}
function docWrite(text)
{
if ( writingHTMLText )
document.write(text);
if ( holdingHTMLText )
htmlTextHolder += text;
}
function docWriteln(text)
{
if ( writingHTMLText )
document.writeln(text);
if ( holdingHTMLText )
htmlTextHolder += text + "\n";
}
function popupHTMLText()
{
if ( htmlTextHolder.length > 0 ) {
if ( typeof ahdtop != "object" || ahdtop == null || ahdtop.closed )
ahdtop = self;
ahdtop.htmlTextHolder = htmlTextHolder;
ahdtop.debugShowWindow = ahdtop.window.open(cfgCAISD +
"/html/debug_show.html",
"", "scrollbars,resizable");
if (!check_popup_blocker(ahdtop.debugShowWindow))
return;
ahdtop.debugShowWindow.name = "debug_show";
}
}
var propIndex;
function popupDocumentInfo(type, element)
{
propIndex = { acceptCharset: 0,
all: 0,
attributes: 0,
behaviorUrns: 0,
canHaveHTML: 0,
canHaveChildren: 0,
cells: 0,
children: 0,
childNodes: 0,
className: "class",
clientHeight: 0,
clientLeft: 0,
clientTop: 0,
clientWidth: 0,
contentEditable: 0,
contentWindow: 0,
currentStyle: 0,
document: 0,
encoding: 0,
fileCreatedDate: 0,
fileModifiedDate: 0,
fileUpdatedDate: 0,
fileSize: 0,
filters: 0,
firstChild: 0,
host: 0,
hostname: 0,
htmlFor: "for",
innerHTML: 0,
innerText: 0,
isMultiLine: 0,
isTextEdit: 0,
lastChild: 0,
mimeType: 0,
nameProp: 0,
nextSibling: 0,
nodeName: 0,
nodeType: 0,
offsetHeight: 0,
offsetLeft: 0,
offsetParent: 0,
offsetTop: 0,
offsetWidth: 0,
outerHTML: 0,
outerText: 0,
ownerDocument: 0,
parentElement: 0,
parentNode: 0,
parentTextEdit: 0,
pathname: 0,
port: 0,
previousSibling: 0,
protocol: 0,
protocolLang: 0,
protocolLong: 0,
readyState: 0,
rows: 0,
runtimeStyle: 0,
scopeName: 0,
scrollHeight: 0,
scrollLeft: 0,
scrollTop: 0,
scrollWidth: 0,
sourceIndex: 0,
tagName: 0,
tBodies: 0,
textContent: 0 };
if ( typeof element != "object" )
element = document.body;
if ( typeof type != "string" )
typeEnum = 0;
else if ( type == "tabindex" )
typeEnum = 1;
else if ( type = "all" )
typeEnum = 2;
else
typeEnum = 0;
info = documentInfo(element, typeEnum, "");
ahdtop.htmlTextHolder = info;
ahdtop.debugShowWindow = ahdtop.window.open(cfgCAISD +
"/html/debug_show.html",
"", "scrollbars,resizable");
if (!check_popup_blocker(ahdtop.debugShowWindow))
return;
ahdtop.debugShowWindow.name = "debug_show";
}
function documentInfo(element, typeEnum, indent)
{
var info = "";
var nodeName = element.nodeName;
if ( typeEnum == 2 ) {
nodeName = nodeName.toLowerCase();
if ( nodeName == "#comment" ) {
info += "\n" + indent + "<!-- " + element.nodeValue + " -->";
}
else if ( nodeName == "#text" ) {
info += "\n" + indent + element.nodeValue;
}
else {
if ( nodeName != "tbody" ) {
info += "\n" + indent + "<" + nodeName;
var scriptText = "";
for ( var prop in element ) {
var propData, pvalue;
try {
propData = propIndex[prop];
pvalue = element[prop];
}
catch(e) {};
if ( typeof propData == "string" )
prop = propData;
if ( typeof propData != "number" ) {
if ( typeof pvalue == "string" ) {
if ( pvalue.length > 0 ) {
if ( prop == "text" && nodeName == "script" )
scriptText = pvalue;
else
info += " " + prop + "=\"" + pvalue + "\"";
}
}
else if ( typeof pvalue == "number" ) {
if ( pvalue != 0 )
info += " " + prop + "=" + pvalue;
}
else if ( typeof pvalue == "boolean" ) {
if ( pvalue )
info += " " + prop + "=" + pvalue;
}
else if ( typeof pvalue == "object" ) {
if ( pvalue != null ) {
if ( prop == "style" ) {
var styleText = "";
var dlm = '';
for ( var style in pvalue ) {
if ( style != "cssText" &&
style != "accelerator" ) {
var styleOp = pvalue[style];
if ( ( typeof styleOp == "string" && styleOp.length > 0 ) ||
( typeof styleOp == "number" && styleOp != 0 ) ||
( typeof styleOp == "boolean" && styleOp ) ) {
styleText += dlm + style + "=" + styleOp;
dlm = ";";
}
}
}
if ( styleText.length > 0 )
info += ' style="' + styleText + '" ';
}
else if ( nodeName != "form" )
info += " " + prop + "=(object)";
}
}
else {
info += " " + prop + "=(" + typeof pvalue + ")";
}
}
}
info += ">";
}
if ( element.childNodes.length > 0 ) {
for ( var e = element.firstChild; e != null; e = e.nextSibling )
info += documentInfo(e, typeEnum, indent + "  ");
if ( nodeName != "tbody" )
info += "\n" + indent + "</" + nodeName + ">";
}
else if ( nodeName == "frame" || nodeName == "iframe" ) {
info += documentInfo(element.contentWindow.document.body,
typeEnum, indent + " ") +
"\n" + indent + "</" + nodeName + ">";
}
else if ( scriptText.length > 0 ) {
scriptText = scriptText.replace(/[\n\r]+/g, "\n  " + indent);
scriptText = scriptText.replace(/[\n\r\t ]+$/g, "");
info += scriptText + "\n" + indent + "</script>";
}
}
}
else if ( typeof nodeName == "string" &&
nodeName != "SCRIPT" &&
element.style.display != "none" ) {
if ( typeEnum != 1 ||
( typeof element.tabIndex == "number" &&
element.tabIndex > 0 ) ||
nodeName == "A" ||
nodeName == "BODY" ||
nodeName == "BUTTON" ||
nodeName == "FRAME" ||
nodeName == "IFRAME" ||
( nodeName == "IMG" && element.alt.length > 0 ) ||
( nodeName == "INPUT" && element.type != "hidden" ) ||
nodeName == "SELECT" ||
( nodeName == "TD" && element.id.length > 0 ) ||
( nodeName == "TH" && element.id.length > 0 ) ||
nodeName == "TEXTAREA" ) {
if ( nodeName == "INPUT" && element.type != "text" )
info = "\n" + indent + "<INPUT " + element.type + ">";
else if ( nodeName == "SELECT" && element.type != "select-one" )
info = "\n" + indent + "<" + element.type.toUpperCase() + ">";
else
info = "\n" + indent + "<" + nodeName + ">";
if ( typeof element.id == "string" && element.id.length > 0 )
info += ' id=' + element.id;
if ( typeof element.tabIndex != "undefined" && element.tabIndex != 0 )
info += ' tabIndex=' + element.tabIndex;
if ( typeof element.name == "string" && element.name.length > 0 )
info += ' name=' + element.name;
if ( typeof element.value == "string" && element.value.length > 0 )
info += ' value(' + element.value + ")";
if ( typeof element.src == "string" && element.src.length > 0 )
info += ' src(' + element.src + ')';
if ( typeof element.title == "string" && element.title.length > 0 )
info += ' title(' + element.title + ')';
if ( typeof element.alt == "string" && element.alt.length > 0 )
info += ' alt(' + element.alt + ')';
var inner = element.innerHTML.replace(/[\r\n]/g,"");
if ( inner.length > 0 ) {
if ( info.length + inner.length > 140 ) {
if ( info.length < 138 )
inner = inner.substring(0, 138-info.length);
else
inner = inner.substring(0, 10);
}
info += ": " + inner;
}
if ( nodeName == "FRAME" || nodeName == "IFRAME" ) {
info += documentInfo(element.contentWindow.document.body,
typeEnum, nodeName + "[" + element.name + "] ");
return info;
}
}
indent += ".";
for ( var e = element.firstChild; e != null; e = e.nextSibling )
info += documentInfo(e, typeEnum, indent);
}
return info;
}
function getHTMLText(reset)
{
return htmlTextHolder;
}
function startScrollbar(maindiv, bScroll, bAfterBtn)
{
if ( ahdtop.cstUsingScreenReader )
return;
try {
var scrolling = window.frameElement.scrolling.toLowerCase();
if ( scrolling == "yes" || scrolling == "auto" )
return;
}
catch(e) {}
if ((typeof bAfterBtn == "boolean") &&
bAfterBtn &&
(scrollDivsClosed < scrollDivCount) &&
(scrollDivCount == 1))
{
endScrollbar(false);
var btn_div = window.document.getElementById("scrollbarDiv0");
btn_div.style.overflowY = "hidden";
if (_browser.isIE)
{
var br_obj = document.createElement("br");
btn_div.appendChild(br_obj);
}
}
var overflow_style = "ScrollAuto";
if ( typeof bScroll != "undefined" && bScroll )
overflow_style = "ScrollScroll";
var div = "scrollbarDiv" + scrollDivCount;
var txt = "<div id=" + div + " class=" + overflow_style;
if (_browser.isIE && overflow_style == "ScrollAuto" )
{
txt += " style=position:relative;";
}
txt += ">\n";
document.write(txt);
if ( typeof maindiv == 'boolean' && maindiv == true) {
txt = "<SCRIPT>\n" +
"var targetdiv = window.document.getElementById('" +
div + "');\n" +
"if (typeof targetdiv == 'object' &&" +
" typeof targetdiv != null &&" +
" typeof targetdiv.focus != 'function')" +
"targetdiv.focus = function () {};</SCRIPT>\n";
document.write(txt);
}
scrollDivCount++;
}
function endScrollbar(postScroll)
{
if ( typeof postScroll == "number" ) {
while ( postScroll > 0 && scrollDivsClosed < scrollDivCount ) {
docWriteln("</DIV>");
scrollDivsClosed++;
postScroll--;
}
}
else if ( scrollDivCount > 0 ) {
while ( scrollDivsClosed < scrollDivCount ) {
docWriteln("</DIV>");
scrollDivsClosed++;
}
if ( postScrollDivOpen ) {
docWriteln("</DIV>");
postScrollDivOpen = false;
}
else {
if ( typeof postScroll != "boolean" )
postScroll = true;
if ( postScroll ) {
docWriteln("<DIV ID=postScrollbarDiv>");
postScrollDivOpen = true;
}
}
}
}
function adjScrollDivHeight()
{
if ( typeof _browser != "object" || typeof _browser.isIE != "boolean" )
{
return;
}
var root = is_standardmode_on ? document.documentElement : document.body;
var winHeight = ( _browser.isIE ? root.offsetHeight
: window.innerHeight );
if ( window == parent )
winHeight -= 5;
var e = document.getElementById("postScrollbarDiv");
if ( e != null && winHeight > ( e.offsetHeight + 100) )
winHeight -= e.offsetHeight;
var divTop = new Array();
var i, scrollDiv;
for ( i = 0; i < scrollDivCount; i++ ) {
scrollDiv = document.getElementById("scrollbarDiv" + i);
if ( scrollDiv != null )
if ( _browser.isIE && i > 0 )
divTop[i] = scrollDiv.offsetTop + divTop[i-1];
else
divTop[i] = scrollDiv.offsetTop;
}
for ( i = scrollDivCount - 1; i >= 0; i-- ) {
scrollDiv = document.getElementById("scrollbarDiv" + i);
if ( scrollDiv != null ) {
var h = winHeight - divTop[i];
if ( h <= 10 || ( h <= 50 && i != 0 ) )
h = "";
else
h=h+"px";
scrollDiv.style.height = h;
if(_browser.isIE)
adjInnerDivWidth(scrollDiv, i);
if ( typeof h == "number" || (typeof h=="string" && h.indexOf("px")!=-1))
winHeight = 0;
}
}
}
function hasVScrollbar(element) 
{ 
if (typeof element != "undefined")
return (element.clientHeight < element.scrollHeight);
else	
return false;
} 
function hasHScrollbar(element) 
{ 
if (typeof element != "undefined")
return (element.clientWidth < element.scrollWidth);
else	
return false;
} 
function adjInnerDivWidth(scrollDiv, i) {
var usp_div = document.getElementById("usp_preferences_div");
if(typeof usp_div == "object" && usp_div != null)
usp_div.style.width = scrollDiv.clientWidth - 8 + "px"; 
if(typeof jq == "function" && i > 0 && typeof jq('#gbox_dataGrid').css('height') == "string" && hasVScrollbar(scrollDiv))
jq('#gbox_dataGrid').css({'width':scrollDiv.clientWidth - 3});
}
function setScrollOverflow(val)
{
for ( var i = 0; i < scrollDivCount; i++ ) {
var scrollDiv = document.getElementById("scrollbarDiv" + i);
if ( scrollDiv != null )
scrollDiv.style.overflow= val;
}
}
function dLog()
{
if ( typeof ahdtop == "object" && ahdtop != null && ! ahdtop.closed ) {
var text = "";
for ( var i = 0; i < arguments.length; i++ ) {
var thisArg = "" + arguments[i];
if ( thisArg.length > 0 ) {
if ( text.length == 0 )
text = thisArg;
else
text += " " + thisArg;
}
}
var now = (new Date()).toTimeString();
now = now.replace(/^[^\d]*(\d+:\d+:\d+).*$/,"$1");
var name = window.name;
try {
if ( parent.name != window.name )
name = parent.name + "." + name;
}
catch(e) {}
text = now + " " + name + " " + text;
ahdtop.dLogSave(text);
}
}
function dLogSave(text)
{
if ( typeof debugLog == "undefined" ) {
debugLog = new Array();
debugLogLen = 0;
}
debugLog[debugLogLen] = text;
debugLogLen++;
}
function dLogShow()
{
if ( typeof ahdtop == "object" && ahdtop != null && ! ahdtop.closed &&
typeof ahdtop.debugLog == "object" &&
ahdtop.debugLogLen > 0 ) {
if ( window != ahdtop )
ahdtop.dLogShow();
else {
var linesPerBox = 30;
var boxCount = Math.ceil( debugLogLen / linesPerBox );
for ( var i = 0; i < boxCount; i++ ) {
var first = i * linesPerBox;
var last = Math.min( first + linesPerBox, debugLogLen);
var text = "";
if ( boxCount > 1 )
text = "   --- " + (i+1) + " of " + boxCount + " ---\n";
text += debugLog[first];
for ( var j = first + 1; j < last; j++ )
text += "\n" + debugLog[j];
if ( ! confirm(text) ) {
debugLogLen = 0;
break;
}
}
}
}
}
function focusById( id )
{
try {
var e = document.getElementById(id);
if ( e != null )
e.focus();
}
catch(e) {}
}
function display_new_page(url, win)
{
if ( typeof url != "string" )
alert("Bad argument to display_new_page()");
else {
if ( typeof win != "object" )
win = window;
win.location.href = add_popup_name(win,url);
}
}
function replace_page(url, win, bReloadWhenTempWindow)
{
if ( typeof win != "object" )
win = window;
if ( typeof win.temporaryWindow != "boolean" ||
! win.temporaryWindow )
win.location.replace(add_popup_name(win,url));
else {
try {
if ( typeof bReloadWhenTempWindow == "boolean" && bReloadWhenTempWindow ){
win.top.opener.location.replace(add_popup_name(win.top.opener,url));
}
else {
if ( typeof win.AlertMsg == "string" &&
win.AlertMsg.length > 0 &&
typeof win.top.opener == "object" &&
typeof win.top.opener.show_response != "undefined" )
{
win.formatAlertMsg();
var oTargetWin = win.top.opener;
if ( typeof oTargetWin.getAlertMsgWindow_prv != "undefined" )
{
oTargetWin = oTargetWin.getAlertMsgWindow_prv();
}
if (typeof oTargetWin.refreshFormWindow == "object") {
oTargetWin.refreshForm();
}
else {
oTargetWin.show_response(win.AlertMsg);
}
}
}
}
catch(e) {}
}
}
function add_popup_name(win, url)
{
if ( typeof ahdtop.cfgCgi != "undefined" &&
ahdtop.cfgCgi != null &&
url.indexOf(ahdtop.cfgCgi) == -1 )
return url;
if ( ! win.name.match(/work/) &&
typeof win.parent.set_action_in_progress != "undefined" )
win.parent.set_action_in_progress(ACTN_LOADFORM);
if ( url.indexOf("KEEP.POPUP_NAME") < 0 &&
( ahdtop.cstReducePopups ||
win.parent.ahdframeset.name != "AHDtop" ) ) {
if ( url.indexOf("DSM_Asset_Context=1") > 0 )
url += "&";
else if ( url.indexOf("?") < 0 )
url += "?";
else
url += "+";
url += "KEEP.POPUP_NAME=";
if ( win.parent.ahdframeset.name != "AHDtop" )
url += win.parent.ahdframeset.name;
}
if (typeof ahdtop.go_role_menubar != "undefined")
{
var role_menubar = ahdtop.go_role_menubar;
ahdtop.go_role_menubar = void(0);
if ((role_menubar != "") &&
(url.indexOf("prop.role_menubar=") < 0))
{
url += "+prop.role_menubar=" + role_menubar;
}
}
else
if (typeof propRoleMenubar == "string" &&
propRoleMenubar.length > 0 &&
url.indexOf("prop.role_menubar=") < 0)
{
url += "+prop.role_menubar=" + propRoleMenubar;
}
if ((typeof ahdtop.use_role != "undefined") &&
ahdtop.use_role)
{
url += "+KEEP.use_role=1";
}
if (typeof ahdframe != "undefined" && 
ahdframe.name == "page" && 
typeof find_role_menubar != "undefined" && 
url.indexOf("prop.role_menubar=") < 0)
{
var role_menubar = find_role_menubar();
if (role_menubar.length > 0)
url += "+prop.role_menubar=" + role_menubar; 
}
return url;
}
function get_next_window_name()
{
if ( typeof ahdtop == "object" && ahdtop != null && ! ahdtop.closed )
ahdtop.ahd_window_count++;
return "USD" + (new Date()).getTime();
}
function find_popup_window(w_name)
{
if ( typeof ahdtop == "object" && ahdtop != null && ! ahdtop.closed &&
typeof ahdtop.manage_popup_windows == "object" &&
typeof ahdtop.manage_popup_windows[w_name] == "string" ) {
var real_name = ahdtop.manage_popup_windows[w_name];
if ( typeof ahdtop.AHD_Windows[real_name] == "object" ) {
var w = ahdtop.AHD_Windows[real_name];
if ( ! w.closed )
return w;
delete ahdtop.AHD_Windows[real_name];
}
}
return null;
}
function get_popup_window_name(w_name)
{
if ( typeof ahdtop == "object" && ahdtop != null && ! ahdtop.closed )
{
if (typeof ahdtop.manage_popup_windows == "undefined")
return w_name;
if (typeof ahdtop.manage_popup_windows[w_name] != "undefined")
return ahdtop.manage_popup_windows[w_name];
var real_name = get_next_window_name();
ahdtop.manage_popup_windows[w_name] = real_name;
return real_name;
}
return w_name;
}
function popup_window_name(w_name)
{
if ( typeof ahdtop == "object" && ahdtop != null && ! ahdtop.closed )
{
if (typeof ahdtop.manage_popup_windows == "undefined")
return w_name;
if (typeof ahdtop.manage_popup_windows[w_name] != "undefined")
return ahdtop.manage_popup_windows[w_name];
}
return w_name;
}
function popup_window_org_name(w_name)
{
if ( typeof ahdtop == "object" && ahdtop != null && ! ahdtop.closed )
{
if (typeof ahdtop.manage_popup_windows == "undefined")
return w_name;
for (var popup_name in ahdtop.manage_popup_windows)
{
if (ahdtop.manage_popup_windows[popup_name] == w_name)
return popup_name;
}
}
return w_name;
}
function remove_popup_window_name (w_name)
{
try {	
if (typeof ahdtop == "object" && ahdtop != null && ! ahdtop.closed)
{
if (typeof ahdtop.manage_popup_windows != "undefined")
{
for (var tmp_name in ahdtop.manage_popup_windows)
{
if (ahdtop.manage_popup_windows[tmp_name] == w_name)
delete ahdtop.manage_popup_windows[tmp_name];
}
}
}
}
catch (e) {}
}
function wf_queue_item(url, request_reset, op_name)
{
this.url = url;
this.request_reset = request_reset;
this.op_name = op_name;
}
function wf_delay_item (queue_item, delay, before_queue_cb, arg)
{
if ( typeof ahdtop != "object" ||
ahdtop == null || ahdtop.closed ||
typeof ahdtop.wf_delay_list == "undefined" )
{
return;
}
var d_list = ahdtop.wf_delay_list;
this.queue_item = queue_item;
this.before_queue_cb = before_queue_cb;
this.arg = arg;
if ((before_queue_cb == "is_popup_window_still_up") &&
(typeof arg == "object") &&
(typeof arg.name == "string"))
this.popup_name = arg.name;
else
this.popup_name = "";
var i;
for (i = 0; (i < d_list.length) && (typeof d_list[i] != "undefined"); i++);
d_list[i] = this;
setTimeout("wf_delay_item.queue_it(" + i + ")", delay);
}
wf_delay_item.queue_it = function (idx)
{
if ( typeof ahdtop != "object" ||
ahdtop == null || ahdtop.closed ||
typeof ahdtop.wf_delay_list == "undefined" ||
typeof ahdtop.work_frame_mgr == "undefined" )
{
return;
}
var d_list = ahdtop.wf_delay_list;
var wf_queue = ahdtop.workframe_queue;
var wf_mgr = ahdtop.work_frame_mgr;
if ((idx >= 0) && (idx < d_list.length) &&
(typeof d_list[idx] != "undefined"))
{
if (typeof d_list[idx].before_queue_cb != "undefined")
{
var callback = d_list[idx].before_queue_cb + "(" + idx + ")";
if (eval(callback))
{
d_list[idx] = void(0);
return;
}
}
var item = d_list[idx].queue_item;
if (item.op_name == "ONE_WAY")
{
wf_mgr.issue_oneway_url(item);
}
else
{
wf_queue[wf_queue.length] = item;
next_workframe();
}
d_list[idx] = void(0);
}
}
function ahdtop_load_workframe(url, delay, op_name, before_queue_cb, arg)
{
if ( typeof ahdtop == "object" &&
ahdtop != null && ( ! ahdtop.closed ) &&
typeof ahdtop.load_workframe != "undefined" )
ahdtop.load_workframe(url, delay, op_name, before_queue_cb, arg);
}
function Work_Frame(name)
{
this.name = name;
this.url = "";
this.op_name = "";
this.frame_obj = eval("window." + name);
this.time_stamp = 0;
}
Work_Frame.prototype.issue_url = function (queue_item)
{
this.url = queue_item.url;
this.op_name = queue_item.op_name;
this.frame_obj.location.href = this.url;
var dt = new Date();
this.time_stamp = dt.getTime();
}
Work_Frame.prototype.free_me = function ()
{
if (_browser.isIE &&
(this.op_name == "SCOREBOARD" ||
this.op_name == "SCOREBOARD_EXTERN"))
{
var empty_url = cfgCAISD + "/html/empty.html";
this.frame_obj.location.href = empty_url;
}
this.url = "";
this.op_name = "";
this.time_stamp = 0;
}
Work_Frame.prototype.is_expired = function()
{
var dt = new Date();
var cur_time = dt.getTime();
if ((cur_time - this.time_stamp) > Work_Frame_Manager.work_frame_timeout)
{
this.free_me();
return true;
}
return false;
}
function Work_Frame_Manager()
{
var i;
this.frame_arr = new Array();
if (typeof work_frames == "undefined") return;
if (typeof window.oneway_frame == "undefined")
this.oneway_frame = void(0);
else
this.oneway_frame = window.oneway_frame;
for (i = 0; i < work_frames.length; i++)
{
if (typeof eval("window." + work_frames[i]) == "object")
this.frame_arr[i] = new Work_Frame(work_frames[i]);
}
if (typeof cfgWorkFrameTimeout != "undefined")
Work_Frame_Manager.work_frame_timeout = parseInt(cfgWorkFrameTimeout,10) * 1000;
}
Work_Frame_Manager.work_frame_timeout = 30000;
Work_Frame_Manager.prototype.free_work_frame = function (op_name)
{
var i;
for (i = 0; i < this.frame_arr.length; i++)
{
var frame = this.frame_arr[i];
if (frame.op_name == op_name)
{
frame.free_me();
break;
}
}
}
Work_Frame_Manager.prototype.is_expired = function (op_name)
{
if (typeof free_it == "undefined")
var free_it = 0;
for (var i = 0; i < this.frame_arr.length; i++)
{
var frame = this.frame_arr[i];
if (frame.op_name == op_name &&
frame.is_expired())
return true;
}
return false;
}
Work_Frame_Manager.prototype.workframe_is_defined = function()
{
return this.frame_arr.length;
}
var NOT_AVAIL = 0;
var ISSUED = 1;
var NEXT = 2;
var REMOVE = 3;
Work_Frame_Manager.prototype.issue_url = function (queue_item)
{
var i;
var ret = NOT_AVAIL;
var frame_found = void(0);
for (i = 0; i < this.frame_arr.length; i++)
{
var frame = this.frame_arr[i];
frame.is_expired();
if (typeof frame_found == "undefined" &&
frame.url == "")
frame_found = frame;
else
if (frame.url != "" &&
frame.op_name == queue_item.op_name)
{
if (frame.url == queue_item.url)
{
frame_found = void(0);
ret = REMOVE;
}
else
{
frame_found = void(0);
ret = NEXT;
}
break;
}
}
if (typeof frame_found == "undefined")
return ret;
frame_found.issue_url(queue_item);
return ISSUED;
}
Work_Frame_Manager.prototype.issue_oneway_url = function (queue_item)
{
if (typeof this.oneway_frame == "undefined")
return;
this.oneway_frame.location.href = queue_item.url;
}
Work_Frame_Manager.prototype.get_op_name = function (url)
{
if (url.match(/FID=0[\D$]+/i))
{
return "ONE_WAY";
}
else
{
var ret = url.match(/OP=(\w+)/i);
if (ret == null) return "NO_OP";
return ret[1];
}
}
var load_time = 0;
function load_workframe(url, delay, op_name, before_queue_cb, arg)
{
if (ahdframeset.name != "AHDtop")
{
return true;
}
var request_reset = 0;
if ((typeof delay == "string") && (delay == "request_reset"))
{
delay = 0;
request_reset = 1;
}
if ( typeof ahdtop != "object" ||
ahdtop == null || ahdtop.closed ||
typeof ahdtop.workframe_queue == "undefined" )
{
return false;
}
var wf_mgr = ahdtop.work_frame_mgr;
if (typeof wf_mgr == "undefined")
{
ahdtop.work_frame_mgr = new ahdtop.Work_Frame_Manager();
wf_mgr = ahdtop.work_frame_mgr;
}
if (!wf_mgr.workframe_is_defined())
return false;
if (typeof op_name == "undefined" ||
op_name == "")
op_name = wf_mgr.get_op_name(url);
var queue_item = new wf_queue_item(url, request_reset, op_name);
if ((typeof delay == "number") &&
(delay > 0))
{
new wf_delay_item(queue_item, delay, before_queue_cb, arg);
return true;
}
if (op_name == "ONE_WAY")
{
wf_mgr.issue_oneway_url(queue_item);
return true;
}
var wf_queue = ahdtop.workframe_queue;
wf_queue[wf_queue.length] = queue_item;
next_workframe();
return true;
}
function next_workframe(op_name)
{
if ( typeof ahdtop != "object" ||
ahdtop == null || ahdtop.closed ||
typeof ahdtop.workframe_queue == "undefined" ||
typeof ahdtop.work_frame_mgr == "undefined" )
{
return;
}
var wf_mgr = ahdtop.work_frame_mgr;
if (typeof op_name != "undefined" &&
op_name != "")
wf_mgr.free_work_frame(op_name);
var wf_queue = ahdtop.workframe_queue;
var i;
for (i = 0; (i < wf_queue.length) && !wf_queue[i].request_reset; i++);
if ((i == wf_queue.length) &&
(typeof ahdtop.scoreboard == "object") &&
(typeof ahdtop.scoreboard.request_reset_active == "boolean"))
ahdtop.scoreboard.request_reset_active = false;
if ( wf_queue.length == 0 ||
typeof wf_mgr != "object" ||
!wf_mgr.workframe_is_defined() ) {
return;
}
var next_queue_item;
var ret = NOT_AVAIL;
var nodes_to_try = wf_queue.length;
while (nodes_to_try)
{
next_queue_item = wf_queue[0];
ret = wf_mgr.issue_url(next_queue_item);
if (ret == ISSUED || ret == NEXT|| ret == REMOVE)
wf_queue = wf_queue.slice(1);
if (ret == ISSUED || ret == NOT_AVAIL)
break;
if (ret == NEXT)
wf_queue[wf_queue.length] = next_queue_item;
nodes_to_try--;
}
ahdtop.workframe_queue = wf_queue;
}
function is_popup_window_still_up(idx)
{
if ( typeof ahdtop != "object" ||
ahdtop == null || ahdtop.closed ||
typeof ahdtop.wf_delay_list == "undefined" )
return 1;
var item = ahdtop.wf_delay_list[idx];
if (typeof item == "undefined")
return 1;
var win = item.arg;
if ( typeof win == "object" &&
typeof win.closed == "boolean" &&
! win.closed )
return 1;
if (item.popup_name != "")
remove_popup_window_name(item.popup_name);
return 0;
}
function build_alertmsg()
{
if ( document.getElementById("alertmsg") != null )
return;
var txt1 = "<TABLE ID='alertmsg' class=alertmsg";
if ( ! _browser.supportsLayers )
txt1 += " STYLE='display:none'";
txt1 += "><TR><TD ID='alertmsgText'>";
var txt2 = "</TD></TR></TABLE>";
if ( window.name == "cai_main" &&
typeof AlertMsg == "string" &&
AlertMsg.length == 0 &&
typeof parent.AlertMsg == "string" &&
parent.AlertMsg.length != 0 &&
parent.AlertMsg != "updateOK" ) {
AlertMsg = parent.AlertMsg;
ShowLockCancel = parent.ShowLockCancel;
parent.AlertMsg = "";
parent.ShowLockCancel = "";
}
var my_top_ori_name, my_top = ahdframeset;
if ( typeof AlertMsg != "string" ||
AlertMsg.length == 0 ||
AlertMsg == "updateOK" ||
AlertMsg == msgtext("Save_Successful") ) {
if ( ! _browser.supportsLayers )
docWriteln(txt1+txt2);
my_top_ori_name = popup_window_org_name(my_top.name);
if ( my_top_ori_name.match(/popunder/) ) {
if ( typeof my_top.popunder_callback == "object" ||
typeof my_top.popunder_callback == "function" )
my_top.popunder_callback(form_title);
my_top.close();
}
}
else {
AlertMsg = AlertMsg.replace(/>/gi,'&gt;');
AlertMsg = AlertMsg.replace(/</gi,'&lt;');
AlertMsg = AlertMsg.replace(/\&lt;br\&gt;/gi,"<BR>");
if ( window.name == "workframe" )
alert(AlertMsg);
my_top_ori_name = popup_window_org_name(my_top.name);
if ( my_top_ori_name.match(/popunder/) ) {
my_top.name = "";
register_window(my_top);
var popup_factory = 'cr';
var ahdtop = get_ahdtop();
var w_name = popup_window_name("profile_browser");
if ( typeof ahdtop == "object" &&
typeof ahdtop.AHD_Windows[w_name] == "object")
{
var pb_frames = ahdtop.AHD_Windows[w_name];
if (typeof pb_frames == "object")
{
if (typeof pb_frames.frames["pb_frames"] == "object")
pb_frames = pb_frames.frames["pb_frames"];
var scratchpad = pb_frames.scratchpad;
if (scratchpad.curr_fac_name != "request")
popup_factory = 'iss';
}
}
my_top.moveTo( 10, 10 );
my_top.resizeTo( popupWidth(ahdtop.checkPopupSize(popup_factory)), popupHeight(ahdtop.checkPopupSize(popup_factory)));
my_top.focus();
if ( typeof my_top.popunder_callback == "object" ||
typeof my_top.popunder_callback == "function" )
my_top.popunder_callback(form_title,AlertMsg);
}
if ( _browser.supportsLayers ) {
if ( window.name != "workframe" )
docWriteln(txt1 + AlertMsg + txt2);
}
else {
txt1 = txt1.replace(/none/,"block");
docWriteln(txt1 + AlertMsg + txt2);
}
if ( typeof ShowLockCancel == "string" &&
ShowLockCancel.length > 0 &&
ShowLockCancel == "yes" &&
! _browser.supportsLayers ) {
docWrite('<TABLE ID=\"recordlockmsg\" class=alertmsg>\n' +
'<TR><TD>\n' +
'<form name="RECORD_LOCK_FORM">\n' +
msgtext("WARNING:_This_record_is_locked") +
'<INPUT TYPE=CHECKBOX NAME="RECORD_LOCK_DECISION" ' +
'onClick=\'setOverRideLock("RECORD_LOCK_FORM", "RECORD_LOCK_DECISION");\'>\n' +
msgtext("_to_clear_the_lock,_and_then_r") +
'</form></TD></TR>\n' +
'</TABLE>\n');
}
}
}
/* replace_location_with_forms takes a variable number of parameters.
* Each parameter is expected to be a form.
* The function grabs the first argument and uses the action of that form to start
* the url.
* After that, all of the elements of all of the forms are translated into a single URL.
* When the url is completed, window.location.replace is called.
* Essentially, this should provide the ability to forget that we had an edit form
* in the history.
*/
function replace_location_with_forms()
{
if (arguments.length <= 0)
return;
var url = arguments[0].action;
for (var i = 0; i < arguments.length; i++)
{
var f = arguments[i];
for (var j = 0; j < f.elements.length; j++)
{
var e = f.elements[j];
if (typeof e.name != "string" || e.name == "") continue;
if (url.indexOf("?") == -1)
url += "?";
else
url += "&";
if (e.type.indexOf("select") == 0)
{
if (e.selectedIndex == -1) continue;
url += e.name + "=" +
nx_escape(e.options[e.selectedIndex].value).replace(/\+/g,"%2B");
}
else if (e.type.indexOf("checkbox") == 0)
{
if(e.checked)
{
url += e.name + "=" +nx_escape(e.value).replace(/\+/g,"%2B");
} else
{
url += e.name + "=No" ;
}
} else
url += e.name + "=" + nx_escape(e.value).replace(/\+/g,"%2B");
}
}
if ( _browser.isIE )
{
window.location.replace("");
f.submit();
}
else
{
if (url.length > 2047)
f.submit();
else
window.location.replace(url);
}
}
var srtimer = false;
var srtimerid = null;
var srmsgtext = null;
function show_response(in_msgtext, duration, retryCount) {
if (typeof cfgMOPreviewMode == "number" && cfgMOPreviewMode == 1) {
return;
}
var pat = new RegExp("^" + msgtext("Save_Successful"));
if (ahdtop.cfgUserType != "analyst" &&
ahdtop.cstConfirmSave != "1" &&
in_msgtext.match(pat) != null)
return;
if ( ahdtop.cstUsingScreenReader || 
ahdtop.cfgUserType != "analyst" ) 
{
if (typeof in_msgtext == "string" && in_msgtext.length > 0) {	
var popupMsg = in_msgtext.replace(RegExp("<BR>","gi"),"\\n")
.replace(RegExp('"',"g"), '\\"');
window.setTimeout('alert("' + popupMsg + '")', 1);
var e = self.document.getElementById("alertmsgText");
if ( typeof e == "object" && e != null ) {
e.innerHTML = get_alert_banner(self.AlertMsg);
self.AlertMsg = e.innerHTML;
}
}	
return;
}
var msg_displayed = false;
var winobj = self;
do {
if ( typeof winobj.AlertMsg != "undefined" ) {
winobj.AlertMsg = in_msgtext;
var e = winobj.document.getElementById("alertmsgText");
if ( typeof e == "object" && e != null ) {
if ( winobj.srtimer ) {
winobj.clearTimeout(winobj.srtimerid);
winobj.srtimer = false;
winobj.srmsgtext = null;
}
e.innerHTML = get_alert_banner(winobj.AlertMsg);
var msglen = e.innerHTML.length;
winobj.AlertMsg = e.innerHTML;
e = winobj.document.getElementById("alertmsg");
if(msglen > 0) {
e.style.display = "block";
} else {
e.style.display = "none";
}
winobj.adjScrollDivHeight();
msg_displayed = true;
if ( typeof duration == 'number' && duration ) {
srtimer = true;
srmsgtext = winobj.AlertMsg;
winobj.AlertMsg = "";
srtimerid = setTimeout('expire_response()', duration * 1000);
}
break;
}
}
winobj = winobj.parent;
} while (winobj.parent != winobj);
if ( ! msg_displayed ) {
if ( typeof retryCount != "number" ) {
in_msgtext = in_msgtext.replace(RegExp('"',"g"), '\\"');
retryCount = 4;
if ( typeof duration != "number" )
duration = "void(0)";
}
if ( retryCount-- > 0 )
window.setTimeout('show_response("' + in_msgtext +
'",' + duration + ',' + retryCount + ');', 250 );
else {
var popupMsg = in_msgtext.replace(RegExp("<BR>","gi"),"\\n");
window.setTimeout('alert("' + popupMsg + '")', 1);
}
}
}
function expire_response() {
if ( srtimer ) {
var e = document.getElementById("alertmsg");
if ( typeof e == "object" && e != null ) {
var mtext = document.getElementById("alertmsgText");
if ( mtext.innerHTML == srmsgtext ) {
e.style.display = "none";
mtext.innerHTML = "";
adjScrollDivHeight();
}
srtimer = false;
srtimerid = null;
srmsgtext = null;
}
}
}
function clear_response()
{
var e = document.getElementById("alertmsg");
if ( typeof e == "object" && e != null && e.style.display != "none" ) {
e.style.display = "none";
var mtext = document.getElementById("alertmsgText");
if ( mtext != null )
mtext.innerHTML = "";
adjScrollDivHeight();
}
if ( srtimer ) {
clearTimeout(srtimerid);
srtimer = false;
srmsgtext = null;
}
}
function get_IMG_path(name)
{
if (typeof ahdtop == "object")
{
return eval("ahdtop." + name);
}
return "";
}
function display_lic_err(err)
{
if (typeof ahdtop == "object")
ahdtop.document.writeln(err);
}
function setTimeoutWarning( idleTime )
{
if ( typeof idleTime != "number" )
idleTime = 0;
else
work_frame_mgr.free_work_frame("TIMEOUT");
try {
if ( propTimeoutWarning > 0 ) {
var secsTimeoutWarning = 60 * propTimeoutWarning;
var timeLeft = ( 60 * propTimeout ) - idleTime;
if ( timeLeft > secsTimeoutWarning ) {
var timeToWarning = timeLeft - secsTimeoutWarning;
timeoutWarningHandle = setTimeout( "timeoutWarningPopped()",
timeToWarning * 1000 );
}
else {
if ( timeLeft < 0 )
timeLeft = 0;
var timeout = new Date((new Date()).getTime() + 1000 * timeLeft);
window.focus();
if ( ! confirm(msgtext("WARNING:_Your_session_will_tim", timeout.toLocaleString()) ) )
logout_all_windows(1);
else {
var url = cfgCgi + "?SID=" + cfgSID +
"+TIMEOUT=RESET+RETFUNC=parent.timeoutResetResponse";
load_workframe( url, 0, "TIMEOUT" );
}
}
}
}
catch(e) {}
}
function timeoutWarningPopped()
{
timeoutWarningHandle = void(0);
var url = cfgCgi + "?SID=" + cfgSID +
"+TIMEOUT=QUERY+RETFUNC=parent.setTimeoutWarning";
load_workframe( url, 0, "TIMEOUT" );
}
function timeoutResetResponse(success)
{
if ( success ) {
setTimeoutWarning(0);
alertmsg("Timeout_reset_-_your_session_w", propTimeout);
}
else {
alertmsg("Sorry,_your_session_has_alread");
window.location.href = cfgCgi;
}
}
function resolveWebFormVars (resource)
{
if(typeof ahdtop.cfgCgi == "string" &&
ahdtop.cfgCgi != "")
{
resource = resource.replace(/\$cgi/i, ahdtop.cfgCgi);
}
if(typeof ahdtop.cfgSID == "string" &&
ahdtop.cfgSID != "")
{
resource = resource.replace(/\$SESSION\.SID/i, ahdtop.cfgSID);
}
if(typeof cfgFID == "string" &&
cfgFID != "")
{
resource = resource.replace(/\$prop\.FID/i, cfgFID);
}
if (typeof ahdtop.cstID == "string" &&
ahdtop.cstID != "")
{
resource = resource.replace(/\$cst\.id/i, ahdtop.cstID);
}
if (typeof ahdtop.cfgBOServerURL == "string" &&
ahdtop.cfgBOServerURL != "")
{
resource = resource.replace(/\$BOServerURL/i, ahdtop.cfgBOServerURL);
}
if (typeof ahdtop.cfgBOServerCMS == "string" &&
ahdtop.cfgBOServerCMS != "")
{
resource = resource.replace(/\$BOServerCMS/i, ahdtop.cfgBOServerCMS);
}
if (typeof ahdtop.cfgBOServerAuth == "string" &&
ahdtop.cfgBOServerAuth != "")
{
resource = resource.replace(/\$BOServerAuth/i, ahdtop.cfgBOServerAuth);
}
return resource;
}
function nx_escape(str)
{
if (typeof str != "string" || str.length == 0) {
return str;
}
try {
str = encodeURIComponent(str);
str = str.replace(/\'/g, "%27");
}
catch (e) {}
return str;
}
function nx_unescape(str)
{
if (typeof str != "string" || str.length == 0) {
return str;
}
try {
str = decodeURIComponent(str);
str = str.replace(/%27/g, "\'");
}
catch (e) {}
return str;
}
function nx_html_encode(str)
{
if (typeof str != "string" || str.length == 0)
return str;
try {
str=str.replace(/\&/g, "&amp;");
str=str.replace(/'/g, "&#39;");
str=str.replace(/\\/g, "&#092;");
str=str.replace(/"/g, "&quot;");
str=str.replace(/\</g, "&lt;");
str=str.replace(/\>/g, "&gt;");
str=str.replace(/\r\n/g, "<BR>");
}
catch (e) {}
return str;
}
function generate_logo_product_name_html (product_name_style)
{
if ( typeof ahdtop != "object" || ahdtop == null )
ahdtop = get_ahdtop();
var sdm_product_name_style = "sdm_product_name sdm_product_name_dark_color"; 
if ( typeof product_name_style == "string" && product_name_style != "" )
{
sdm_product_name_style = product_name_style;
}
var lpn_html = '<div class="head_line"><nobr></div><table class="product_info_container"><tr><td colspan="4" style="height: 14px;"/></tr><tr>';
if ( typeof ahdframe == "object" && ahdframe != null &&
typeof ahdframe.argTenantLogo == "string" &&
ahdframe.argTenantLogo.length > 0 )
lpn_html += '<td class="gn_container_no_padding"><img id="logoImg" src="' + ahdframe.argTenantLogo + '"' +
' class="logo_img" alt="' + ahdframe.argTenantLogoAlt + '"></td>';
else if ( typeof ahdtop.cfgMultiTenancy == "string" &&
ahdtop.cfgMultiTenancy != "off" &&
typeof ahdtop.cstTenantLogo == "string" &&
ahdtop.cstTenantLogo.length > 0 )
lpn_html += '<td class="gn_container_no_padding"><img id="logoImg" src="' + ahdtop.cstTenantLogo + '"' +
' class="logo_img" alt="' + ahdtop.cstTenantLogoAlt + '"></td>';
else
lpn_html += '<td class="CA_logo"><img id="logoImg" src="' +
ahdtop.usdImg["circleca"] + '" class="logo_img" alt="CA"></td>';
lpn_html += '<td class="product_name_container"><p class="' + sdm_product_name_style + '" style="margin-bottom: 0px; margin-top: 5px;"><nobr>HELPDESK <span id="titleText"></span></nobr></p><p class="' + sdm_product_name_style + '" style="font-size: 13px; margin-top: -2px;">Centrum Wsparcia Użytkownika GK ORLEN</p></td></tr></table>';
lpn_html += '<div class="UserInfo" id="UserInfoDiv" style="visibility: hidden;"></div>'

return lpn_html;
}
function generate_basic_form_header_html()
{
var header_html = '<table class="gn_sdm_header_background gn_container_no_margin gn_container_no_border" width="100%"><tr><td>';
header_html += generate_logo_product_name_html( "sdm_product_name" );
header_html += '</td></tr></table>';
return header_html;
}
function clearAlertMsg(win)
{
var E = win.document.getElementById("alertmsgText");
if ( E != null )
{
E.innerHTML = "";
}
var alertmsg = document.getElementById("alertmsg");
if ( alertmsg != null )
{
alertmsg.style.display = "none";
adjScrollDivHeight();
}
}
function check_popup_blocker(win)
{
if (typeof win == "object" &&
win == null)
{
alertmsg("Unable_to_display_a_window");
return false;
}
return true;
}
function allocateArray()
{
return new Array();
}
function allocateObject()
{
return new Object();
}
function is_standardmode_on()
{
var engine = 5;
if (_browser.isIE)
{
if (document.documentMode)
engine = document.documentMode;
else
{
if (document.compatMode)
{
if (document.compatMode == "CSS1Compat")
engine = 7;
}
}
}
if (engine == 7)
return true;
else 
return false;
}
function alertSecUpd(){
var i, msg, ahdwin;
var window_name = new Array();
if( typeof ahdtop == "object" ){
for ( var registered_name in ahdtop.AHD_Windows )
window_name[window_name.length] = registered_name;
for ( i = window_name.length - 1; i >=0; i-- ) {
ahdwin = ahdtop.AHD_Windows[window_name[i]];
if ( typeof ahdwin == "object" &&
typeof ahdwin.opener == "object")
{	
if( typeof ahdwin.opener.ahdframeset == "object"){
if(typeof ahdwin.ahdframe.updCnt != "number")
ahdwin.ahdframe.updCnt = 1;
else
ahdwin.ahdframe.updCnt++;
AlertMsg = msgtext("This_record_has_%1_pending_updates", ahdwin.ahdframe.updCnt);
}
}
}
}
}
// Copyright (c) 2005 CA.  All rights reserved.
/**
* Method to create new XMLHttpObject
*
* @returns new XML Http onject or null
*/
function CreateXMLHttpRequest()
{
try { return new XMLHttpRequest(); } catch(e) {}
try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch (e) {}
try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch (e) {}
try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch (e) {}
try { return new ActiveXObject("Microsoft.XMLHTTP"); } catch (e) {}
return null;
}
/**
* Method to invoke server side code (i.e. web methods) using Asynchronous
* XMLHTTP. Once response is received from the server, user defined callback
* function will be invoked by passing XMLHTTP object as parameter.
*
* Note that GET responses are not cached, request is always sent to server
*
* Callback method implemented by the user should have at least one parameter.
*
* E.g. function AsyncResponseHandler(reqObj)
*
* @param	Web method url
* @param	Asynchronous callback function
* @param	Optional parameter HTTP method GET or POST
* @param	Optional parameter Connection timeout
* @param	Optional parameter Payload or data ( this parameter will be made null in case of HTTP GET)
*
*/
function AsyncAjaxCall(url, callback, method, connectionTimeout, payload )
{
var TimerId	=	0;
var req	=	CreateXMLHttpRequest();
var response	=	"";
if(	req == null)
{
showAlertmsg(msgtext("Error: Unable to create XMLHttp request"));
}
else
{
if( typeof method == "undefined" )
method = "GET";
connectionTimeout = (typeof connectionTimeout != "undefined" ? connectionTimeout : -1);
if( typeof payload == "undefined" || method=="GET" )
payload = null;
if( connectionTimeout > 0 )
TimerId = setTimeout( function() { OnTimeout( req ) }, connectionTimeout );
try
{
req.open(method, url, true);
if( method=="POST" )
{
req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
req.setRequestHeader("Content-length", payload.length);
req.setRequestHeader("Connection", "close");
}
else
{
req.setRequestHeader("If-Modified-Since", "Thu, 1 Jan 1970 00:00:00 GMT");
req.setRequestHeader("Cache-Control", "no-cache");
}
req.onreadystatechange = function ()
{
if (req.readyState == 4 )
{
if( req.status == 200 )
{
if( TimerId>0 )
{
clearTimeout( TimerId );
TimerId=0;
}
if( typeof callback != "undefined" && callback != "")
callback(req);
if( req != null )
{
req = null;
}
}
}
else
{
return;
}
}
function OnTimeout(pReq)
{
clearTimeout( TimerId );
if( pReq != null )
{
pReq.abort();
}
}
req.send(payload);
}
catch(e)
{
alert( e.message );
}
}
return response;
}
/**
* Method to invoke web method using synchronous ajax call using HTTP GET
*
* Note that GET responses are not cached, request is always sent to server
*
* @param	web method url
* @param	HTTP method GET or POST
* @param	Optional parameter to specify connection timeout
* @param	Optional parameter to specify payload or data.
*	Note:This parameter will be treated as null in case of HTTP GET.
*
* @returns	Data from Web Method
*/
function SyncAjaxCall(url, method, connectionTimeout, payload)
{
var req = CreateXMLHttpRequest();
var TimerId=0;
var response;
if(	req == null)
{
showAlertmsg(msgtext("Error: Unable to create XMLHttp request"));
}
else
{
if( typeof method == "undefined" )
method = "GET";
connectionTimeout = (typeof connectionTimeout != "undefined" ? connectionTimeout : -1);
if( typeof payload == "undefined" )
payload = null;
if( method=="GET" )
payload = null;
if( connectionTimeout > 0 )
TimerId = setTimeout( function() { OnTimeout( req ) }, connectionTimeout );
try
{
function OnTimeout(pReq)
{
clearTimeout( TimerId );
if( pReq != null )
{
pReq.abort();
}
}
req.open(method, url, false);
if( method=="POST" )
{
req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
req.setRequestHeader("Content-length", payload.length);
req.setRequestHeader("Connection", "close");
}
else
{
req.setRequestHeader("If-Modified-Since", "Thu, 1 Jan 1970 00:00:00 GMT");
req.setRequestHeader("Cache-Control", "no-cache");
}
req.send(payload);
if( TimerId>0 )
{
clearTimeout( TimerId );
TimerId=0;
}
response = req.responseText;
}
catch(e)
{
alert( e.message );
}
finally
{
if( req != null )
{
req = null;
}
}
}
return response;
}
/**
* Method to invoke web method using synchronous ajax call using HTTP GET and
* executes returned Java Script code using Java Script eval method
*
* @param	web method url
* @ throws	exception when no <SCRIPT> found in response
*/
function SyncAjaxJSCall(url)
{
var responseJS = SyncAjaxCall(url);
var sindex = responseJS.indexOf("<SCRIPT>");
var eindex = responseJS.indexOf("</SCRIPT>");
if ( sindex != -1 && eindex != -1 ) {
var _script = responseJS.substring(sindex+8,eindex);
eval ( _script );
}
else
{
throw "Error in response: No <SCRIPT> found";
}
}
/**
* Method to invoke web method using synchronous ajax call using HTTP GET and
* writes response to the document onf the window specified in parameter
*
* @param	web method url
* @param	Browser window
*/
function SyncAjaxHTMCall(url, wnd)
{
var responseJS = SyncAjaxCall(url);
wnd.document.writeln( responseJS );
}
/**
*	@deprecated
*
*	This is original Ajax code introduced in SDM 12.1 to execute web methods.
*
*	This method takes web method URL as parameter and sends it to the server
*	using HTTP GET. If return data contains java script code, code is executed
*	using "eval" methiod otherwise response from server is returned.
*
*	@param URL for the web method.
*/
function call_op_ajax(sourceURL)
{
var responseJS = SyncAjaxCall(sourceURL);
var sindex = responseJS.indexOf("<SCRIPT>");
var eindex = responseJS.indexOf("</SCRIPT>");
if ( sindex != -1 && eindex != -1 )
{
var _script = responseJS.substring(sindex+8,eindex);
eval ( _script );
}
else
{
return responseJS;
}
}
// Copyright (c) 2005 CA.  All rights reserved.
var dLayerArray = new Array();
var delayTime = 1000;
function DynLayer(id, parent, forPopupMenu, className, host_document, removeDuplicates)
{
switch(arguments.length) {
case 4,5,6:
if (typeof className == "string")
this.className = className
case 3:
if (typeof forPopupMenu == "number")
this.forPopupMenu = forPopupMenu;
}	
this.id = id;
this.hdlTimeout = null;
this.saveOnMouseOver = null;
this.saveOnMouseOut = null;
this.lastAction = "";
this.index = -1;
var cur_document;
if (typeof host_document != "undefined")
cur_document = host_document;
else
cur_document = document;
this.layer = cur_document.getElementById(id);
if (typeof this.layer != "object" || this.layer == null) {	
this.layer = cur_document.createElement("DIV");	
this.layer.id = id;
this.layer.className = this.className;
}	
this.style = this.layer.style;
this.style.position = "absolute";
this.style.display = "none";
if (typeof parent != "object" || parent == null)
this.parent = cur_document.body;
else
this.parent = parent;
if (typeof removeDuplicates == "boolean" && removeDuplicates) {
var childNodes = this.parent.childNodes;
for (var e = 0; e < childNodes.length; e++) {
var childNode = childNodes[e];
if (childNode.id == this.layer.id) {
childNode.innerHTML = "";
this.parent.removeChild(childNode);
}
}
}
this.parent.appendChild(this.layer);
}
DynLayer.prototype.forPopupMenu = 0;
DynLayer.prototype.className = "dynLayer";
DynLayer.prototype.appendChild = function(elem) {
return this.layer.appendChild(elem);
}
DynLayer.prototype.setBackgroundColor = function(color)
{
this.layer.style.backgroundColor = color;
return;
}
DynLayer.prototype.resizeTo = function(width, height)
{
/* Not implemented yet! */
}
DynLayer.prototype.resizeBy = function(width, height)
{
/* Not implemented yet! */
}
DynLayer.prototype.moveTo = function(left, top)
{
if ( left < 0 ) {
left = document.body.offsetWidth + left;
if ( left < 0 )
left = 0;
}
if ( top < 0 ) {
top = document.body.offsetHeight + top;
if ( top < 0 )
top = 0;
}
this.layer.style.left=""+left+"px";
this.layer.style.top=""+top+"px";
}
DynLayer.prototype.moveBy = function(left, top)
{
/* Not implemented yet! */
}
DynLayer.prototype.show = function()
{
if (this.forPopupMenu)
{
if (this.hdlTimeout != null)
{
this.lastAction = "show";
return;
}
DynLayer.addToArray(this);
this.setupTimeout();
}
this.layer.style.display = "";
}
DynLayer.prototype.hide = function(force)
{
if (typeof force == "undefined")
{
force = 0; 
}
if (this.forPopupMenu)
{
if (!force && this.hdlTimeout != null)
{
this.lastAction = "hide";
return 1;
}
DynLayer.delFromArray(this.index);
this.index = -1;
}
this.layer.style.display = "none";
return 0;
}
DynLayer.prototype.handleEvent = function(name, Callback)
{
switch(name.toLowerCase()) {
case 'onmouseover':
this.layer.onmouseover = Callback;
break;
case 'onmouseout':
this.layer.onmouseout = Callback;
break;
}
}
DynLayer.prototype.setupTimeout = function()
{
this.hdlTimeout = setTimeout("DynLayer.hide_or_show(" + this.index + ")", delayTime); 
this.saveOnMouseOver = this.layer.onmouseover;
var code = "{if (" + this.index + " >= dLayerArray.length ) return; var tmp = dLayerArray[" + 
this.index + "]; if (typeof tmp == 'object') tmp.show();}";
this.layer.onmouseover = new Function ("e", code); 
}
DynLayer.hide_or_show = function(index)
{
if (index >= dLayerArray.length) return; 
var layerObj = dLayerArray[index];
if (typeof layerObj == "object")
{
layerObj.layer.onmouseover = null;
layerObj.layer.onmouseover = layerObj.saveOnMouseOver;
layerObj.hdlTimeout = null;
if (layerObj.lastAction == "hide")
{
layerObj.hide();
}
}
}
DynLayer.addToArray = function(layerObj)
{
var i;
for (i = 0; i < dLayerArray.length; i++)
{
if (typeof dLayerArray[i] == "undefined")
{
break;
}
}
dLayerArray[i] = layerObj;
layerObj.index = i;
}
DynLayer.delFromArray = function (index)
{
if ((index == -1) || (index >= dLayerArray.length)) return;
dLayerArray[index] = void(0);
}
DynLayer.prototype.isInside = function (ev)
{
if ( _browser.isIE )
return this.layer.contains(ev.toElement);
var x, y, left, right, top, bottom;
x = ev.pageX;
y = ev.pageY;
left = this.layer.offsetLeft;
top = this.layer.offsetTop;
right = left + this.layer.offsetWidth;
bottom = top + this.layer.offsetHeight;
return ( x >= left && x <= right && y >= top && y <= bottom );
}
// Copyright (c) 2005 CA.  All rights reserved.
var retry_count = 0;
function setup_for_menubar(name)
{
window.__menuBar = void(0);
window.menubarFrame = void(0);
var mbFrame;
for ( var w = window;
w != null && w != ahdframeset && w != w.parent;
w = w.parent ) {
if ( typeof w.frameElement == "object" &&
w.frameElement != null &&
w.frameElement.tagName == "IFRAME" &&
! w.name.match(/menuOK/) )
break;
var xframe = w.parent.document.frames ? w.parent.document.frames["menubar"] : w.parent.document.getElementById("menubar");
if(xframe != null)
mbFrame = xframe.contentWindow || xframe;
if ( typeof mbFrame == "object" && mbFrame != null &&
mbFrame.name == "menubar" )
break;
}
if ( typeof mbFrame == "object" &&
mbFrame != null ) {
if ( typeof mbFrame.__menuBar != "object" ||
mbFrame.__menuBar == null ) {
retry_count++;
if ( retry_count < 10 ) {
var timeout = retry_count * 100;
if ( typeof name == "string" )
window.setTimeout("setup_for_menubar('" + name + "');", timeout);
else
window.setTimeout("setup_for_menubar();", timeout);
}
}
else {
window.menubarFrame = mbFrame;
window.__menuBar = mbFrame.__menuBar;
window.__menuBar.deferSetupCompletion = ahdtop.cstUsingScreenReader;
window.menubarOnload = null;
if ( typeof name != "string" ) {
if ( typeof propFormName != "string" ) 
name = ""; 
else {
name = propFormName;
if ( typeof propFormName3 == "string" &&
propFormName3.length > 0 )
name += "_" + propFormName3;
}
if ( typeof argPersistentID == "string" )
name += "_" + argPersistentID;
else if (typeof argID == "string")
name += "_" + argID;
if ( typeof rptName != "undefined" &&
typeof argSearchSqlClause == "string" &&
argSearchSqlClause.length > 0 )
name += "_" + argSearchSqlClause;
if ( typeof cawf_procid == "string" && cawf_procid.length > 0 )
name += "_" + cawf_procid;
if ( typeof argChange == "string" ) {
if ( ! argChange.match(/^\s*$/) )
name += "_attchg";
}
if ( typeof argActive == "string" &&
( typeof cfgNX_EDIT_INACTIVE != "string" ||
cfgNX_EDIT_INACTIVE != "no" ) )
name += "_" + argActive;
}
window.menubarName = name;
find_build_menubar();
if ( typeof window.onload != "undefined" )
window.menubarOnload = window.onload;
window.onload = find_build_menubar_onload;
}
}
}
function evaluate_menubar_func(win, func_name, parm_str, code_str)
{
eval("window." + func_name + " = function (" + parm_str + ") {" + code_str + "}");
var f = eval("window." + func_name);
f(window, win);
}
function find_build_menubar()
{
if ( menubarName != "" &&
menubarName == __menuBar.name ) {
__menuBar.reregisterActionKeys(window);
}
else {
var menubar_from_popup = 0;
var w = window;
var top_frame = ahdframeset;
while ( 1 ) {
if ( typeof w.build_menubar != "undefined" && typeof w.build_menubar != "unknown" ) {
var found = 0;
if ( w.menubarName != menubarName ||
w.menubarName == "" ||
w == window ) {
if (w != window &&
ahdframeset != ahdtop)	
{
var func_str = w.build_menubar.toString();
if (func_str.match(/^function *([^ \(]+) *\((.*)\) *[^\{]+\{([^$]+)\}$/))
{
evaluate_menubar_func(w, RegExp.$1, RegExp.$2, RegExp.$3);
found = 1;
}
else 
if (func_str.match(/^function *\((.*)\) *[^\{]+\{([^$]+)\}$/))
{
if (typeof w.__menuBar == "object" && 
w.__menuBar != null &&
typeof w.__menuBar.definingWindow == "object" &&
w.__menuBar.definingWindow != null)
{
w = w.__menuBar.definingWindow;
continue;
} 
found = 2;
}
}
if (!found)
w.build_menubar(window);
}
if (found != 2)
{
enableBackToList();
return;
}
}
try {
if (w.ahdframeset != ahdtop &&
!menubar_from_popup &&
typeof w.ahdframe != "undefined" && 
typeof w.ahdframe.find_menubar_from_popup == "string" && 
w.ahdframe.find_menubar_from_popup == "1") 
{
menubar_from_popup = 1;
}
} catch (e) {}
try 
{
if ( w != top_frame &&
typeof w.parent == "object" && w != w.parent )
w = w.parent;
else if ( w != ahdtop &&
typeof w.opener == "object" && w.opener != null && 
!w.opener.closed ) {
var cur_w = w;
w = w.opener;
if (w == ahdtop &&
typeof cur_w.ahdframeset.menubar_ahdframe != "undefined" &&
!cur_w.ahdframeset.menubar_ahdframe.closed)
{
w = cur_w.ahdframeset.menubar_ahdframe; 
}
else 
if (w == w.ahdframeset)
w = w.ahdframe; 
top_frame = w.ahdframeset;
}
else
if ((w != ahdtop) &&
(typeof ahdtop == "object") &&
(ahdtop != null) &&
!ahdtop.closed) 
{
w = ahdtop.ahdframe;
top_frame = ahdtop.ahdframeset;
}
else 
break;
} catch(e) { break; }
var orig_win = w;
try {
if (w.ahdframeset == ahdtop && 
menubar_from_popup &&
typeof ahdtop.role_menubar_win != "undefined" && 
!ahdtop.role_menubar_win.closed && 
w != ahdtop.role_menubar_win) 
{
w = ahdtop.role_menubar_win;
menubar_from_popup = 0;
}
}
catch (e) { w = orig_win; }
}
}
enableBackToList();
}
function enableBackToList() {
if ( ahdtop.cstReducePopups &&
ahdtop == ahdframeset ) {
var lastUrlIndex = -1;
var urlArray = menubarFrame.listUrlArray;
if ( typeof urlArray == "object" &&
urlArray.length > 0 &&
( typeof _dtl != "object" ||
typeof _dtl.edit != "boolean" ||
! _dtl.edit ) ) {
lastUrlIndex = urlArray.length - 1;
if ( urlArray[lastUrlIndex] == window.document.URL )
lastUrlIndex--;
}
if ( lastUrlIndex < 0 )
menubarFrame.ImgBtnDisableButton("btnbackToList");
else {
menubarFrame.ImgBtnEnableButton("btnbackToList");
}
}
}
function backToList()
{
if ( ahdtop == ahdframeset &&
typeof listUrlArray == "object" &&
listUrlArray.length > 0 ) {
var lastUrlIndex = listUrlArray.length - 1;
var url = listUrlArray[lastUrlIndex];
if ( url == ahdframeset.ahdframe.document.URL ) {
listUrlArray[lastUrlIndex] = void(0);
listUrlArray.length = lastUrlIndex;
if ( --lastUrlIndex < 0 ) {
ImgBtnDisableButton("btnbackToList");
return;
}
url = listUrlArray[lastUrlIndex];
}
listUrlArray[lastUrlIndex] = void(0);
listUrlArray.length = lastUrlIndex;
if(ahdframeset.ahdframe.name == "frmDTUserNode")
ahdframeset.ahdframe.parent.location.replace(url);
else
ahdframeset.ahdframe.location.replace(url);
}
}
function find_build_menubar_onload()
{
find_build_menubar();
if ( typeof window.menubarOnload == "function" ) {
window.saveMenubarOnload = window.menubarOnload;
window.menubarOnload = null;
window.saveMenubarOnload();
window.menubarOnload = window.saveMenubarOnload;
}
}
var menuActive;
var menuID;
var menuName;
var menuCount = 0;
var submenuCount = 0;
function addMenuItem(itemName, callExit)
{
menuActive = true;
var menuNameCurr = itemName;
if ( typeof callExit == "boolean" && callExit == true )
{
if ( submenuCount > 0 )
siteMenuitemAdd(menuName);
menuName = menuNameCurr;
var rc = siteMenuMod(menuName);
if ( typeof rc == "boolean" ||
typeof rc == "int" )
menuActive = rc;
else if ( typeof rc == "string" )
{
if ( rc.length == 0 )
menuActive = false;
else 
menuNameCurr = rc;
}
}
menuName = menuNameCurr; 
if ( menuActive )
{
menuCount++;
menuID = "mn" + menuCount;
if ( _browser.isNS == true )
NS_AddMenuItem(menuID, menuName);
else 
Menu_Lib_AddMenuItem(menuID, menuName, "", "");
}
submenuCount = 0;
}
function addSubMenuItem(itemName, script, callExit)
{
addSubMenuItem_internal(itemName,
"ahdtop." + script,
"cai_main",
callExit);
}
function addSubMenuItem_internal(itemName, script, target, callExit)
{
if ( menuActive )
{
var submenuActive = true;
var submenuName = itemName;
if ( typeof callExit == "boolean" && callExit )
{
var rc = siteMenuitemMod(menuName, submenuName);
if ( typeof rc == "boolean" |
typeof rc == "int" )
submenuActive = rc;
else if ( typeof rc == "string" )
{
if ( rc.length == 0 )
submenuActive = false;
else 
submenuName = rc;
}
}
if ( submenuActive )
{
submenuCount++;
var submenuID = menuID + "_" + submenuCount;
if ( _browser.isNS == true )
NS_AddSubMenuItem(submenuID,submenuName,script,target);
else 
Menu_Lib_AddSubMenuItem(submenuID,submenuName,"",script,target);
}
}
}
function EndMenu()
{
if ( submenuCount > 0 )
siteMenuitemAdd(menuName);
siteMenuAdd();
if ( _browser.isNS == true )
NS_EndMenu();
else 
Add_Input_Field();
submenuCount = 0;
}
var submenu_x_posn = 0;
var submenu_y_posn = 0;
function NS_AddMenuItem(menuID, menuName)
{
if ( menuCount == 1 )
document.write("<TABLE class='menuBarContainer' ><TR><TD>");
if ( submenuCount > 0 )
{
if ( _browser.supportsLayers == true )
document.write("</LAYER>");
else
document.write("</DIV>");
submenuCount = 0;
}
document.write("<A CLASS='clsMenuBarItem' HREF=\"javascript:void(0)\" " +
"onMouseOver=\"NS_ShowMenu('Menu" + menuCount +
"')\">&nbsp;" + menuName + "&nbsp;</A>");
submenu_x_posn = document.links[document.links.length-1].x;
submenu_y_posn = document.links[document.links.length-1].y+24;
document.write("<SPAN class=\"clsSeparator\">|</SPAN>");
}
function NS_AddSubMenuItem(menuID, menuName, script, target)
{
if ( submenuCount == 1 )
if ( _browser.supportsLayers == true )
document.write("<LAYER ID=Menu" + menuCount +
" left='" + submenu_x_posn +
"' top='" + submenu_y_posn + "' width='200'" +
" visibility=hidden bgColor=#9CC2E4" +
" onMouseOut=\"NS_ShowMenu()\"" +
" z-index=99>");
else
document.write("<DIV ID=Menu" + menuCount +
" left='" + submenu_x_posn +
"' top='" + submenu_y_posn +
"' class='subMenuItemContainer' onMouseOut=\"NS_ShowMenu()\">");
document.write("<A CLASS='clsSubMenuItem' HREF=\"javascript:" + script + "\"");
if (target != "")
document.write(" target=" + target);
document.write(">&nbsp;" + menuName + "</A>");
}
function NS_ShowMenu(tgt)
{
var i;
var filter_timeout_called = false;
for ( i = 0; i < document.layers.length; i++ )
{
var curr = document.layers[i];
if (curr.name.indexOf("Menu") < 0)
continue;
if ( curr.name == tgt )
{
curr.visibility = "show";
if ( typeof searchFilterSetTimeout == "function" )
{
searchFilterSetTimeout();
filter_timeout_called = true;
}
}	
else
{
curr.visibility = "hidden";
if ( ! filter_timeout_called )
{
if ( typeof searchFilterClearTimeout == "function" )
searchFilterClearTimeout();
filter_timeout_called = true;
}
}	
}
}
function NS_EndMenu()
{
if ( submenuCount > 0 )
{
if ( _browser.supportsLayers == true )
document.write("</LAYER>");
else
document.write("</DIV>");
submenuCount = 0;
}
if ( menuCount > 0 )
{
document.write("</TD><TD style='width:90%'>&nbsp;</TD></TR></TABLE>");
}
}
var win_width;
var win_height;
function NS_next()
{
var flds = NS_find_form();
}
function NS_find_form()
{
var flds;
var layers = document.layers;
var len = layers.length;
var i;
for (i = 0; i < len; i++)
{
if (layers[i].document.forms["menu_flds"])
{
flds = layers[i].document.forms["menu_flds"];
break;
}
}
return flds;
}
function do_openDetail(factory, num, text) 
{
var attr_name;
if ((factory == "cr") || (factory == "iss"))
attr_name = "ref_num";
else if (factory == "chg")
attr_name = "chg_ref_num";
else if ( factory.match(/^(\w+)\.(\w+)$/) ) {
factory = RegExp.$1;
attr_name = RegExp.$2;
if ( factory == "pb" ) {
if ( attr_name == "id" )
{
profile_browser("cnt:" + num, text);
} 
else
profile_browser("cnt:" + attr_name + ":" + num, text,1);
return;
} 
}
else 
{
alertmsg("Please_select_detail_type");
return;
}
if ( attr_name == "ref_num" ||
attr_name == "chg_ref_num" ) {
var ahdwin = ahdtop.detailForms[factory + num];
if ( typeof ahdwin == "object" &&
typeof ahdwin.name == "string" &&
typeof ahdwin.closed == "boolean" &&
! ahdwin.closed ) {
ahdwin.focus()
if ( typeof ahdframe._dtl == "object" )
ahdframe._dtl.firstField.focus();
return;
}
}
var query_str = cfgCgi + "?SID=" + cfgSID + "+FID=" + fid_generator() +
"+OP=GET_DOB+PERSID=" +
nx_escape(factory + ":" + attr_name + ":" + num) +
"+FACTORY_TEXT=" + nx_escape(text) +
"+KEEP.IsPopUp=1" +
"+KEEP.backfill_form=" + nx_escape("javascript:replaceList") +
"+KEEP.backfill_field=persistent_id" +
"+KEEP.Is3FieldContact=0";
if(factory=="cr") {
query_str+="+GLOBAL=1";
}
if(factory == "KD")
{	
OpenDocumentViewer(num, 2);
}	
else
{
popupWithURL(query_str);
}	
}
function replaceList(persid)
{
var url = cfgCgi + "?SID=" + cfgSID + "+FID=" + fid_generator() +
"+OP=GET_DOB+PERSID=" + nx_escape(persid);
replace_page(url);
}
function upd_main_window(form)
{
if ( ahdframeset.name != "AHDtop" ) 
ahdtop.focus();
var url = cfgCgi + "?SID=" + cfgSID + "+FID=" + fid_generator();
if ( form.match(/\.htmpl/) )
url +='+OP=DISPLAY_FORM+HTMPL=' + form;
else
url += '+OP=' + form;
for ( var i = 1; i < arguments.length; i++ )
url += "+" + arguments[i];
ahdtop.document.location.href = url;
}
function upd_frame(form)
{
var ahdtop = get_ahdtop(true);
if ( typeof ahdtop == "object" )
{
if ( window != ahdframe ) 
ahdtop.focus();
var url = cfgCgi + "?SID=" + cfgSID + "+FID=" + fid_generator();
if ( form.match(/\.htmpl/) )
url +='+OP=DISPLAY_FORM+HTMPL=' + form;
else
url += '+OP=' + form;
for ( var i = 1; i < arguments.length; i++ )
url += "+" + nx_escape(arguments[i]).replace(/%3D/i,"=");
ahdtop.ahdframe.document.location.href = url;
}
}
function upd_specific_frame(toolbarTab, form)
{
if (ahdtop.cstReducePopups && typeof _dtl != "undefined" && _dtl.edit)
{
alertmsg("Please_save_or_cancel_to_proceed");
return;
}
ahdtop.focus();
if (typeof ahdtop.toolbar == "object" && typeof ahdtop.toolbar.mainframe == "function")
var tgt = ahdtop.toolbar.mainframe(toolbarTab);
else 
var tgt = ahdtop.ahdframe;
if ( tgt != null ) {
var url = cfgCgi + "?SID=" + cfgSID + "+FID=" + fid_generator();
if ( form.match(/\.htmpl/) )
{
if (form.match(/search_(cr|chg|iss|in|pr)\.htmpl/) && ahdtop.cfgInitListSearch == "Yes")
{ 
var fac = RegExp.$1;
url += "+OP=SEARCH+FACTORY="+fac+"+QBE.EQ.active=1"+"+QBE.EQ.assignee="+ahdtop.cstID;
if (form == "search_cr.htmpl")
url += "+ADDITIONAL_WHERE=" + nx_escape("( type = 'R' OR type = '' OR type IS NULL )"); 
}
else if (form == "list_cr_kt.htmpl")
{
url += "+OP=SEARCH+FACTORY=cr+HTMPL=list_cr_kt.htmpl";	
}
else if (form == "list_iss_kt.htmpl")
{
url += "+OP=SEARCH+FACTORY=iss+HTMPL=list_iss_kt.htmpl";	
}
else
{
url +='+OP=DISPLAY_FORM+HTMPL=' + form;
if (form == "search_cr.htmpl")
url += "+DEFAULT_TO_CR=1";
}
}
else
url += '+OP=' + form;
for ( var i = 2; i < arguments.length; i++ )
url += "+" + nx_escape(arguments[i]).replace(/%3D/i,"=");
tgt.document.location.href = url;
}
}
function upd_workframe(form)
{
if ( typeof ahdframeset.workframe == "object" )
{
var url = cfgCgi + "?SID=" + cfgSID + "+FID=" + fid_generator();
if ( form.match(/\.htmpl/) )
url +='+OP=DISPLAY_FORM+HTMPL=' + form;
else
url += '+OP=' + form;
for ( var i = 1; i < arguments.length; i++ )
url += "+" + nx_escape(arguments[i]).replace(/%3D/i,"=");
if ((ahdframeset.name == "AHDtop") &&
(ahdframeset.frames.length > 1))
load_workframe(url, 0, "UPD_WORKFRAME");
else
if (typeof ahdframeset.workframe == "object" &&
ahdframeset.workframe != null) 
display_new_page(url,ahdframeset.workframe);
}
}
function invoke_sd_url(servername, jobcontainer)
{
var w, url;
if (servername == "ERROR" && jobcontainer == "ERROR")
{
url = ahdtop.cfgNX_SDURL+"html/web_dm_login.html?USERID=";
w = window.open(url,"","width=850,height=600,location");
next_workframe("UPD_WORKFRAME");
check_popup_blocker(w);
return;
}
url = ahdtop.cfgNX_SDURL + 
"servlet/iDispatcher?FILE=/html/web_dm_login_context.html.tpl&CALLINGAPP=SERVICEDESK&APPLICATION=SD&SERVER=" +
servername + 
"&NODEID=SDJobContainer@" + 
servername +
"!0!" + 
jobcontainer +
"&USERID="; 
w = window.open(url, "", "width=800,height=600,scrollbars,resizable,menubar,location,status,toolbar");
next_workframe("UPD_WORKFRAME"); 
check_popup_blocker(w);
}
function invoke_uam_url(policy_type, server_name, object_domain_id, object_id, domain_id)
{
var w, url;
if (policy_type == "ERROR")
{
url = ahdtop.cfgNX_UAMURL+"html/web_dm_login.html?USERID=";
w = window.open(url,"","width=850,height=600,location");
next_workframe("UPD_WORKFRAME");
check_popup_blocker(w);
return;
}
var policyType = "";
var minus_1 = "";
var delim = "!";
if (policy_type == "10")
{
policyType = "AmoEventPolicy";
minus_1 = "-1!";
delim = "~";
}
else if (policy_type == "11")
{
policyType = "AmoPolicy";
}
url = ahdtop.cfgNX_UAMURL + 
"servlet/iDispatcher?FILE=/html/web_dm_login_context.html.tpl&CALLINGAPP=SERVICEDESK&APPLICATION=AM&SERVER=" +
server_name + 
"&NODEID=" + 
policyType + 
"@" + 
object_domain_id + 
"!" +
minus_1 + 
object_id +
delim +
domain_id + 
"&USERID="; 
w = window.open(url, "", "width=800,height=600,scrollbars,resizable,menubar,location,status,toolbar");
next_workframe("UPD_WORKFRAME");
check_popup_blocker(w);
}
function invoke_uam_asset(server_name, unit_domain_id, unit_id, type, domain_id)
{
var w, url;
if (server_name == "ERROR")
{
url = ahdtop.cfgNX_UAMURL+"html/web_dm_login.html?USERID=";
w = window.open(url,"","width=850,height=600,location");
next_workframe("UPD_WORKFRAME");
check_popup_blocker(w);
return;
}
url = ahdtop.cfgNX_UAMURL + 
"servlet/iDispatcher?FILE=/html/web_dm_login_context.html.tpl&CALLINGAPP=SERVICEDESK&APPLICATION=AM&SERVER=" +
server_name + 
"&NODEID=AmoUnitComputer@" + 
unit_domain_id + 
"!" +
unit_id +
"!" +
type + 
"~" + 
domain_id + 
"&USERID=";
w = window.open(url, "", "width=800,height=600,scrollbars,resizable,menubar,location,status,toolbar");
next_workframe("UPD_WORKFRAME");
check_popup_blocker(w);
}
function post_external(form_name, bopsid)
{
if ( form_name == "no" ) {
popupCiWindow(ahdtop.ciSearchWindow, "BOPSID="+bopsid, "", 1);
next_workframe("UPD_WORKFRAME");
return;
}
var f = void(0);
if ( typeof ahdframe == "object" )
f = ahdframe.document.forms[form_name];
if ( typeof f != "object" || f == null ) { 
if ( typeof parent.gobtn == "object" )
f = parent.gobtn.document.forms[form_name];
if ( typeof f != "object" || f == null ) {
next_workframe("UPD_WORKFRAME");
alertmsg("182",form_name);
return;
}
}
if ( typeof f.target == "string" &&
f.target.length > 0 )
{
var w;
if (_browser.isIE && _browser.isMAC)
{
var features="menubar=1";
features=",location=1";
features+=",toolbar=1";
features+=",status=1";
features+=",scrollbars=yes";
w = window.open(cfgCAISD + "/html/empty.html", "", features);
}
else 
{
w = window.open(cfgCAISD + "/html/empty.html", "");
}
if (!check_popup_blocker(w))
return;
w.name = f.target;
w.focus();
}
if ( f.BOPSID.type == "hidden" ||
f.BOPSID.type == "text" )
f.BOPSID.value = bopsid;
f.submit();
next_workframe("UPD_WORKFRAME");
}
function customize_scoreboard()
{
var ahdtop = get_ahdtop(true);
if ( typeof ahdtop == "object" )
{
if ( ahdframeset != ahdtop )
ahdtop.focus();
if ("function" == typeof ahdtop.scoreboard.maintain_tree) {
ahdtop.scoreboard.maintain_tree("cnt:" + cstID);
} else {
alertmsg("Please_wait_until_the_scoreboa");
}
}
}
function img_button(btn_id, btn_name, btn_width, operation, alt)
{
document.writeln(img_button_text(btn_id, btn_name, btn_width, operation, alt));
}
function img_button_text(btn_id, btn_name, btn_width, operation, alt)
{
var up = cfgCAISD + "/img/b_" + btn_name + "_up.gif";
var down = cfgCAISD + "/img/b_" + btn_name + "_down.gif";
var func = operation;
if ( func.indexOf("(") == -1 )
func = "\"upd_frame('" + func + "'); return false;\"";
else if ( func.substr(0,1) != '"' &&
func.substr(0,1) != "'" )
func = '"' + func + ';return false;"';
else 
func = funcWithQuotes(func);
var temp_str = "<A ID=\"" + btn_id + "\" " +
"HREF=\"javascript:void(0)\" ";
temp_str += "onClick=" + func + ">" + 
"<IMG class='imgBtnText' SRC='" + up + "' " + 
"WIDTH=\"" + btn_width + "\"  " +
"onMouseOver=\"window.status='';return true;\"" +
"onMouseDown=\"this.src='" + down + "';return true;\" " +
"onMouseOut=\"this.src='" + up + "';return true;\" " +
"onMouseUp=\"this.src='" + up + "';return true;\"></A>";
if ( typeof default_button_name != "string" )
default_button_name = "btn001";
if ( btn_id == default_button_name &&
typeof imgBtnDefault != "object" ) {
imgBtnDefault = new Object();
imgBtnDefault.enabled = true;
imgBtnDefault.func = func.substr(1,func.length-14);
}
return temp_str;
}
function funcWithQuotes(func)
{
var pos = 0;
var isSQ = 1;
var pos_s = func.lastIndexOf("'");
var pos_d = func.lastIndexOf("\"");
if ((pos_s >= 0) && (pos_d >= 0))
{
if (pos_s > pos_d)
pos = pos_s;
else 
{
isSQ = 0;
pos = pos_d;
}
}
else if (pos_s >= 0)
pos = pos_s;
else
{
isSQ = 0;
pos = pos_d;
}
func = func.slice(0, pos) + ";return false;";
if (isSQ)
func += "'";
else 
func += "\"";
return func;
}
function pdm_submit(form_name, operation, action, replace)
{
if ( action_in_progress() && ahdframe.currentAction != 0 )
return;
if ( typeof ahdtop == "object" &&
typeof ahdtop.wspReplaceAllDone == "boolean" &&
ahdtop.wspReplaceAllDone &&
typeof operation == "string" &&
operation != "UPDATE" ) {
alertmsg("Operation_suppressed_in_WSP_pr");
return;
}
if ( typeof action == "number" )
set_action_in_progress(action);
var f = window.document.forms[form_name];
var set_id, htmpl;
if ( typeof f.elements["HTMPL"] == "object" )
htmpl = f.elements["HTMPL"];
if ( typeof f.elements["SET.id"] == "object" )
set_id = f.elements["SET.id"];
var is_55_analyst = 0;
if ( (typeof propFormRelease == "undefined" || propFormRelease < 60) &&
(typeof cfgUserType == "undefined" || cfgUserType == "analyst") )
is_55_analyst = 1;
if (is_55_analyst && typeof htmpl == "undefined" && typeof set_id == "object")
{
if (propFormName == "detail_alg_edit.htmpl" || 
propFormName == "xfer_esc_cr.htmpl" || 
propFormName == "request_status_change.htmpl" ||
propFormName == "cr_attach_chg.htmpl" ||
propFormName == "cr_detach_chg.htmpl" ) 
{
set_id.name = "INPUT_FIELDS_TO_PARSE";
ahdframeset.top_splash.next_persid = "cr:" + set_id.value;
set_id.value = "HTMPL=show_main_detail.htmpl&SET.id=" + set_id.value;
}
if (propFormName == "detail_chgalg_edit.htmpl" || 
propFormName == "xfer_esc_chg.htmpl" || 
propFormName == "order_status_change.htmpl")
{
set_id.name = "INPUT_FIELDS_TO_PARSE";
ahdframeset.top_splash.next_persid = "chg:" + set_id.value;
set_id.value = "HTMPL=show_main_detail.htmpl&SET.id=" + set_id.value;
}
if (propFormName == "nf.htmpl")
{
var factory = f.elements["FACTORY"];
if (typeof factory != "undefined")
{
set_id.name = "INPUT_FIELDS_TO_PARSE";
ahdframeset.top_splash.next_persid = factory.value + ":" + set_id.value;
set_id.value = "HTMPL=show_main_detail.htmpl&SET.id=" + set_id.value;
}
}
}
if (typeof f.elements["use_template"] == "object" && 
f.elements["use_template"].value == "1" && 
f.onsubmit == null)
{
set_action_in_progress(ACTN_SAVE);
}
if ( typeof f != "object" )
alertmsg("Operation_%1_ignored_-_can't_f", operation, form_name);
else
{
if ( typeof operation == "string" &&
operation.length > 0 )
{
if ( typeof f.OP == "object" )
f.OP.value = operation;
else
alertmsg("Form_operation_%1_ignored_-_fo", operation, f.name);
}
if ( typeof divLoadForm == "function" )
divLoadForm(f);
if ( typeof f.onsubmit == "undefined" ||
f.onsubmit == null ||
f.onsubmit() )
if (typeof replace == "boolean" && replace)
{
if ( _browser.isIE )
{
window.location.replace(""); 
f.submit();
}
else 
replace_location_with_forms(f);
}
else
f.submit();
}
}
function pdm_reset()
{
for (var i = 0; i < window.document.forms.length; i++) {
window.document.forms[i].reset();
}
}
function browseWithURL(url)
{
display_new_page(url);
}
function view_scoreboard()
{
var ahdtop = get_ahdtop();
if ( typeof ahdtop != "object" ||
ahdtop.propInitialPopup != "1" )
return;
if ( confirm(msgtext("Do_you_want_restart_your_sessi")) ) {
ahdtop.close_all_windows();
var url = cfgCgi +
"?SID=" + cfgSID +
"+FID=" + fid_generator() + 
"+OP=MENU";
ahdtop.onunload = null;
if (typeof ahdtop.AHD_logout_requested != "undefined")
ahdtop.AHD_logout_requested = true; 
ahdtop.document.location.href = url;
}
}
function doesContain(parent, child)
{
var elems = parent.getElementsByTagName(child.tagName);
for (var e = 0; e < elems.length; e++) {
if (child == elems[e])
return true;
}
return false;	
}
function ci_update_fields(from_window, from_fname, to_fname, attr_arr)
{
if ( action_in_progress() && ahdframe.currentAction != 0 )
return;
if (typeof document.forms[to_fname] == "undefined" && 
(typeof propFormRelease == "undefined" || propFormRelease < 60))
{
alertmsg("The_ci_search_form_is_missing.", "ci_search.htmpl", propFormName); 
return;
}
if (typeof propFormRelease == "number" && propFormRelease >= 60 &&
(typeof from_window == "undefined" || typeof from_window._dtl == "undefined" || !from_window._dtl.edit)) 
{
return;
}
var fromForm, toForm;
toForm = document.forms[to_fname];
if (typeof from_window == "object" && from_window != null) {
fromForm = from_window.document.forms[from_fname];
} else {
fromForm = document.forms[from_fname];
}
for (var i = 0; i < attr_arr.length; i++) {
var innerArr = attr_arr[i];
copy_set_or_key_val(fromForm, toForm, innerArr[0], innerArr[1]);
}
}
function copy_set_or_key_val(fromForm, toForm, from_attr, to_attr)
{
if (typeof fromForm == "undefined" || typeof toForm == "undefined" ||
typeof from_attr == "undefined" || typeof to_attr == "undefined") 
{
return -1;
}
var attrPrefix = "";
var plainAttrName = "";
if (0 == from_attr.indexOf("KEY.") || 0 == from_attr.indexOf("SET.")) {
attrPrefix = from_attr.slice(0, 3);
plainAttrName = from_attr.slice(4);
} else {
return -1;
}
var src_elm = fromForm.elements[from_attr];
if (typeof src_elm != "object" || src_elm == null) {
if ("KEY" == attrPrefix) {
src_elm = document.main_form.elements["SET." + plainAttrName]; 
if (typeof src_elm != "object" || src_elm == null || src_elm.type != "select-one") 
{
return -1; 
}
} else {
return -1;
}
} 
var val = null;
if (src_elm.type == "select-one") {
var opts = src_elm.options;
var idx = src_elm.selectedIndex;
if ("KEY" == attrPrefix) {
val = opts[idx].text;;
} else {
val = opts[idx].value;
}
} else {
val = src_elm.value;
}
if (null != val) {
var to = toForm.elements[to_attr];
if (typeof to == "object")
to.value = val;
else {
return -1;
}
}
return 0;
}
var mouseoverMenus = ( typeof ahdtop == "object" && ahdtop.mouseoverMenus );
var ctxMenus = new Array();
var activeCtxMenu = void(0);
function ContextMenu(name)
{
this.name = name;
this.mnum = ctxMenus.length;
this.itemCnt = 0;
this.actKeys = "";
this.items = new Array();
this.func = new Array();
this.dynlayer = void(0);
this.hdlTimeout = void(0);
this.isVisible = false;
this.mouseless = false;
this.focused = false;
this.owningWindow = window;
this.inum = -1;
this.changeLabel = void(0);
this.AlwaysShow = false;
ctxMenus[this.mnum] = this;
var out;
if ( ahdtop.cstUsingScreenReader &&
( name != "rClickMenu" ||
! ahdtop.propDebugScript ) ) {
this.usingScreenReader = true;
this.menuDisplayedOnce = false;
out = "<select id='ctx_" + this.mnum + "' style='display:none;'></select>";
}
else {
var bIsUniqueName = false;
var origName = name;
var curNameIndex = 0;
var curMenu = null;
while ( !bIsUniqueName )
{
curMenu = document.getElementById( name );
if( curMenu != null )
{
name = origName + curNameIndex;
curNameIndex++;
}
else
{
bIsUniqueName = true;
}
}
if ( origName != name )
{
this.name = name;
}
this.usingScreenReader = false;
out = "<div id='" + name +
"' style='display:none' class='ctxMenuContainer'";
if ( _browser.isIE55 )
out += "onMouseOut=\"parent.contextMenuMouseOut(event," +
this.mnum + ")\" "+
"onMouseOver=\"parent.contextMenuMouseOver(" +
this.mnum + ")\">\n";
else
out += "onMouseOut=\"contextMenuMouseOut(event," +
this.mnum + ")\" "+
"onMouseOver=\"contextMenuMouseOver(" +
this.mnum + ")\">\n";
out += "<table cellpadding=1 cellspacing=0 border=0 class=ctxMenuOuterColor><tr><td><table id='" + name + "Tbl' cellpadding=0 cellspacing=0 border=0>\n";
}
document.writeln(out);
}
ContextMenu.prototype.addItem = function( text, func, img, extended )
{
if ( typeof siteContextMenuitemMod != "undefined" ) {
var label = siteContextMenuitemMod(this.name, text);
if ( typeof label == "boolean" && ! label )
return;
if ( typeof label == "string" && label.length > 0 )
text = label;
}
var strID = "ctx_" + this.mnum + "_" + this.itemCnt;
this.items[this.itemCnt] = { id: strID,
label: text,
func: func,
img: img,
extended: extended,
isActive: true,
isHidden: false,
addArgLen: ContextMenu.prototype.addItem.arguments.length };
if ( ! this.usingScreenReader ) {
var out = "<TR id=tr" + strID + "><TD";
out+= ">";
if ( ContextMenu.prototype.addItem.arguments.length > 2 && img != "" )
out += "<IMG id=img" + strID + " src='" + img + "'>";
out += "</TD><TD CLASS=menubar_unselected_background ID=" + strID + "_cell";
if ( _browser.isIE55 )
{
out += " onMouseOver=\"parent.contextMenuCellMouseOver(" + this.mnum + "," + this.itemCnt + ")\"";
out += " onMouseOut=\"parent.contextMenuCellMouseOut(" + this.mnum + "," + this.itemCnt + ")\"";
}
else 
{
out += " onMouseOver=\"contextMenuCellMouseOver(" + this.mnum + "," + this.itemCnt + ")\"";
out += " onMouseOut=\"contextMenuCellMouseOut(" + this.mnum + "," + this.itemCnt + ")\"";
}
out += "><A ID=" + strID;
out += " CLASS='menu_unselected_text' onMouseOver='return true;' ondragstart='return false;' ";
if ( _browser.isIE55 )
{
out += " HREF=" + cfgCAISD + "/html/empty.html";
if ( ContextMenu.prototype.addItem.arguments.length > 3 && extended == 1 )
out += " onClick='parent.pm_execFunc(\"" + strID + "\")'";
else { 
if (mouseoverMenus)
out += " onClick=\"parent." + func + "\"";
else
out += " onClick=\"parent." + func + ";parent.contextMenuKeyDown(null,35,0);\"";
}
out += " onMouseOver=\"parent.contextMenuFocus(" + this.mnum + ")\">";
}
else
{
if ( ContextMenu.prototype.addItem.arguments.length > 3 && extended == 1 )
out += " HREF='javascript:pm_execFunc(\"" + strID + "\"," + String(this.mnum) + ")'>";
else
out += " HREF=\"javascript:" + func + "\" onclick=\"contextMenuHide(" + String(this.mnum) + ");\">";
}
var actKey = "";
if (text.indexOf("[") != -1)
{
var initialval = text.indexOf("[");
var endval = text.indexOf("]");
var actkeylen = (endval-1)-initialval;
actKey = text.substr(initialval+1,actkeylen); 
text = text.substr(0,initialval);
}
actKey = bestKey( actKey, text, this.actKeys );
this.actKeys += actKey;
out += fmtLabelWithActkey( text, actKey );
out += "</A></TD></TR>\n";
document.writeln(out);
}
this.itemCnt++;
return strID;
}
ContextMenu.prototype.eval_func = function (funcString)
{
eval(funcString); 
}
ContextMenu.prototype.changeItemLabel = function (itemCnt, changeToText)
{
if ( this.usingScreenReader ) {
if ( itemCnt < this.items.length )
this.items[itemCnt].label = changeToText;
return;
}
var id = "ctx_" + this.mnum + "_" + itemCnt;
var doc;
if ( _browser.isIE55 )
{
if (this.isVisible == false)
{
this.changeLabel = "this.changeItemLabel(" + itemCnt + ", '" + changeToText+ "')";
return;
}
if (typeof this.popup.document == "undefined") return;
doc = this.popup.document.body.document;
}
else
doc = document;
this.changeLabel = void(0);
var menuItem = doc.getElementById(id);
if (typeof menuItem == "undefined")
return;
var temp_str = this.actKeys.substring(0, itemCnt) + 
this.actKeys.substring(itemCnt + 1, this.actKeys.length);
var actKey = "";
if (changeToText.indexOf("[") != -1)
{
var initialval = changeToText.indexOf("[");
var endval = changeToText.indexOf("]");
var actkeylen = (endval-1)-initialval;
actKey = changeToText.substr(initialval+1,actkeylen); 
changeToText = changeToText.substr(0,initialval);
}
actKey = bestKey(actKey, changeToText, temp_str);
this.actKeys = this.actKeys.substring(0, itemCnt) + actKey + 
this.actKeys.substring(itemCnt + 1, this.actKeys.length);
menuItem.innerHTML = fmtLabelWithActkey(changeToText, actKey);
}
ContextMenu.prototype.finish = function()
{
if ( typeof siteContextMenuitemAdd != "undefined" )
siteContextMenuitemAdd(this.name, this);
if ( ! this.usingScreenReader )
document.writeln("</TABLE></TD></TR></TABLE></DIV>");
}
ContextMenu.prototype.tr = function(extraCode, tagargs )
{
var out = "<tr";
if ( typeof tagargs == "string" && tagargs.length > 0 )
out += " " + tagargs;
if ( ! ahdtop.mouseoverMenus ) {
out += " oncontextmenu=\"";
if ( typeof extraCode == "string" &&
extraCode.length > 0 )
out += extraCode + ";";
if ( this.usingScreenReader )
out += this.name + ".show(event,this,0);\"";
else
out += this.name + ".show(event,null,0);\"";
}
out += ">";
return out;
}
ContextMenu.prototype.mouseEvents = function(extraCode)
{
var out = "";
if ( ahdtop.mouseoverMenus &&
! this.usingScreenReader ) {
out = " onMouseOver=\"";
if ( typeof extraCode == "string" && extraCode.length > 0 )
for ( var i = 0; i < arguments.length; i++ )
out += extraCode + ";";
out += this.name + ".show(event,this);\"" +
" onMouseOut=\"" + this.name + ".hide();return true;\"";
}
return out;
}
ContextMenu.prototype.show = function( e, assoc, delay, IgnoreScroll )
{
if (ahdtop.cfgUserType == "analyst" && ! ahdtop.cstDisablePreviews) {
if (typeof ahdframeset == "object" && ahdframeset != null &&
typeof ahdframeset.ahdframe == "object" && ahdframeset.ahdframe != null &&
typeof ahdframeset.ahdframe.closeMOPreview == "function") {
ahdframeset.ahdframe.closeMOPreview();
}
else if (typeof mo_preview_win == "object" && mo_preview_win != null &&
typeof mo_preview_win.closeMOPreview == "function") {
mo_preview_win.closeMOPreview();
}
}
this.ifired = false;
if (typeof IgnoreScroll != "boolean")
{
IgnoreScroll = false;
}
var x = 0, y = 0;
var mouseless = ( typeof e == "string" && e == "mouseless" );
if ( typeof assoc == "object" &&
assoc != null && 
typeof assoc.tagName == "string" && 
( mouseoverMenus || mouseless ) ) {
x = jq("#"+assoc.id).offset().left + jq("#"+assoc.id).width() + 3;
y = jq("#"+assoc.id).offset().top;
/*
x = assoc.offsetWidth;
for ( e = assoc; e.tagName != "BODY"; e = e.parentNode ) {
if ( e.tagName == "TD" ) {
x += e.offsetLeft;
y += e.offsetTop;
if ( e.id.match(/sched_/) ) {
y += 20;
}
}
if ( e.tagName == "TABLE" ) {
x += e.offsetLeft;
y += e.offsetTop;
}
if (e.tagName == "A" ) {
if ( e.id.match(/sched_/) && !mouseoverMenus ) {
x += 20;
y += 20;
}
else {
x += e.offsetLeft;
y += e.offsetTop;
}
}
if ( e.tagName == "DIV" &&
e.id.match(/scrollbar|nbtab/) ) {
if ( _browser.isIE55 ) {
x += e.offsetLeft; 
y += e.offsetTop;
}
x -= e.scrollLeft;
y -= e.scrollTop;
}
}
if ( _browser.isIE55 ) {
x -= document.body.scrollLeft;
y -= document.body.scrollTop;
}
*/
}
else if ( _browser.isIE ) {
if ( window.event.ctrlKey )
return;
x = window.event.clientX - 3;
y = window.event.clientY - 3;
if ( _browser.isIE55 ) {
if ( ! IgnoreScroll ) {
x += document.body.scrollLeft;
y += document.body.scrollTop;
}
}
}
else {
if (( e.ctrlKey ) && (!_browser.isMAC))
return;
x = e.pageX - 3;
y = e.pageY - 3;
}
this.x = x;
this.y = y;
if ( typeof assoc != "object" )
assoc = null;
if ( typeof delay != "number" )
delay = 500;
if ( typeof this.hdlTimeout != "undefined" ) {
if ( assoc == this.assoc )
return;
window.clearTimeout(this.hdlTimeout);
this.hdlTimeout = void(0);
}
if ( ! _browser.isIE55 && this.isVisible && ! this.usingScreenReader ) {
if ( assoc != this.assoc ) {
this.assoc = assoc;
if (!_browser.isIE)
{
var menuData = document.getElementById(this.name);
var height = menuData.offsetHeight;
var width = menuData.offsetWidth;
if ( y+height > window.innerHeight)
{
y -= height;
if (y < 0)
y = 0;
}
if ( x+width > window.innerWidth)
{
x -= width;
if (x < 0)
x = 0; 
}
}
this.dynlayer.moveTo( x, y );
}
}
else {
if ( _browser.isIE55 && this.isVisible )
contextMenuHide(this.mnum);
this.assoc = assoc;
this.mouseless = mouseless;
if ( delay == 0 )
contextMenuShow(this.mnum);
else
this.hdlTimeout = window.setTimeout( "contextMenuShow(" + this.mnum + ")",
delay );
}
return false;
}
function contextMenuShow(mnum)
{
var ahdtop = get_ahdtop();
try 
{
if ( typeof ahdtop == "object" &&
typeof ahdtop.LoadingPopup == "object" &&
typeof ahdtop.LoadingPopup.closed == "boolean" &&
!ahdtop.LoadingPopup.closed &&
mnum.AlwaysShow == false)
return;
}
catch(e)
{
return;
}
if ( mnum < ctxMenus.length ) {
var e;
var td;
var m = ctxMenus[mnum];
if ( typeof m.hdlTimeout != "undefined" ) {
window.clearTimeout(m.hdlTimeout);
m.hdlTimeout = void(0);
}
if ( m.usingScreenReader ) {
contextMenuBuildScreenReaderMenu( m );
return false;
}
if ( mouseoverMenus )
m.owningWindow.focus();
m.owningWindow.setTempKeyDownHandler(contextMenuKeyDown);
if ( _browser.isIE55 ) {
var menuData = document.getElementById(m.name);
if ( typeof menuData == "object" && menuData != null ) {
menuData.style.display = "";
var width = menuData.scrollWidth;
var height = menuData.scrollHeight;
menuData.style.display = "none";
var popup = window.createPopup();
if ( typeof ahdtop == "object" && ahdtop != null ) {
var popupStyle = popup.document.createStyleSheet();
if ( ahdtop.menuStyles.length == 0 )
ahdtop.initMenuStyles(window);
for ( var i = 0; i < ahdtop.ctxmenuStyles.length; i++ ) {
var ruleName = ahdtop.ctxmenuStyles[i][0];
var ruleText = ahdtop.ctxmenuStyles[i][1];
popupStyle.addRule( ruleName, ruleText );
}
if ( typeof editPopupStyles == "function" )
editPopupStyles(popupStyle);
}
popup.document.body.innerHTML =
menuData.outerHTML.replace(/self\./ig,"parent.");
var html_text = popup.document.body.innerHTML;
var index = html_text.lastIndexOf("TABLE class=ctxMenuOuterColor");
if (index != "-1") {
width = width + 1;
height = height + 1;
html_text = html_text.replace("TABLE class=ctxMenuOuterColor","TABLE class=ctxMenuOuterColor Height="+ height +" Width="+ width +" ");	
popup.document.body.innerHTML = html_text;
}
e = popup.document.body.document.getElementById(m.name);
e.style.display = "";
var x = m.x;
var y = m.y;
if (typeof document.documentMode != "undefined")
{
if (y + height > document.body.clientHeight)
{
y -= height;
if ( y < 0 )
y = 0;
}
if (x + width > document.body.clientWidth)
{
x -= width;
if ( x < 0 )
x = 0;
}
}
popup.show( x, y, width, height, window.document.body );
m.popup = popup;
m.inum = -1;
}
}
else {
if ( typeof m.dynlayer != "object" )
m.dynlayer = new DynLayer(m.name);
var x = m.x;
var y = m.y;
if (!_browser.isIE)
{
m.dynlayer.show();
var menuData = document.getElementById(m.name);
var height = menuData.offsetHeight;
var width = menuData.offsetWidth;
if ( y+height > window.innerHeight)
{
y -= height;
if (y < 0)
y = 0;
}
if ( x+width > window.innerWidth)
{
x -= width;
if (x < 0)
x = 0; 
}
}
m.dynlayer.moveTo( x, y ); 
m.dynlayer.show();
if ( _browser.isIE )
m.dynlayer.layer.scrollIntoView();
}
m.isVisible = true;
activeCtxMenu = m;
if ( m.mouseless ) {
var d = ( _browser.isIE55 ? m.popup.document.body.document
: document ); 
for ( i = 0; i < m.items.length; i++ )
if ( m.items[i].isActive &&
! m.items[i].idHidden )
break;
if ( i >= m.items.length )
i = 0;
e = d.getElementById("ctx_" + m.mnum + "_" + i);
td = d.getElementById("ctx_" + m.mnum + "_" + i + "_cell");
if ( typeof e == "object" && e != null ) {
e.className = "menu_selected_text"; 
m.inum = i;
}
if ( typeof td == "object" && td != null ) {
td.className = "menubar_selected_background";
}
}
if ( typeof m.changeLabel != "undefined" )
{
m.eval_func(m.changeLabel);
m.changeLabel = void(0);
}
}
}
function contextMenuBuildScreenReaderMenu(menu)
{
if ( typeof menu.assoc == "object" && menu.assoc != null ) {
ahdtop.contextMenu = menu;
var w = ahdtop.contextMenuWindow;
if ( typeof w == "object" && ! w.closed )
w.close();
var features = "resizable" +
",height=" + (50 + menu.items.length * 14) +
",width=240";
w = window.open(ahdtop.usdHTML["ctxmenu"], "", features );
if (!check_popup_blocker(w))
return;
ahdtop.contextMenuWindow = w;
}
}
function contextMenuEval(i)
{
eval(ahdtop.contextMenu.items[i].func);
}
ContextMenu.prototype.hide = function( delay )
{
if ( typeof this.hdlTimeout != "undefined" ) {
window.clearTimeout(this.hdlTimeout);
this.hdlTimeout = void(0);
}
if ( this.isVisible &&
! this.usingScreenReader ) {
if ( typeof delay != "number" ) {
if ( typeof delay != "string" || delay != "nofocus" )
delay = 250;
else {
delay = 0;
if ( this.mnum < ctxMenus.length ) {
var m = ctxMenus[this.mnum];
m.assoc = null;
}
}
}
if ( delay == 0 )
contextMenuHide(this.mnum);
else
this.hdlTimeout = window.setTimeout( "contextMenuHide(" + this.mnum + ")",
delay );
}
}
function contextMenuHide(mnum)
{
if ( mnum < ctxMenus.length ) {
var m = ctxMenus[mnum];
if ( typeof m.hdlTimeout != "undefined" ) {
window.clearTimeout(m.hdlTimeout);
m.hdlTimeout = void(0);
}
if ( m.isVisible ) {
if ( _browser.isIE55 ) {
if ( mouseoverMenus && m.focused )
return;
if ( typeof m.popup == "object" )
m.popup.hide();
}
else
m.dynlayer.hide();
m.isVisible = false;
activeCtxMenu = void(0);
m.owningWindow.setTempKeyDownHandler(null);
if ( typeof m.assoc == "object" && m.assoc != null )
try {m.assoc.focus()} catch(e) {};
}
}
}
function contextMenuMouseOver(mnum)
{
if ( mnum < ctxMenus.length ) {
var m = ctxMenus[mnum];
m.focused = true;
if ( typeof m.hdlTimeout != "undefined" ) {
window.clearTimeout(m.hdlTimeout);
m.hdlTimeout = void(0);
}
} 
return true;
}
function contextMenuMouseOut(ev, mnum)
{
if ( _browser.isIE )
ev = window.event;
window.status = window.defaultStatus;
if ( mnum < ctxMenus.length ) {
try {
var m = ctxMenus[mnum];
m.focused = false;
if ( typeof m.hdlTimeout != "undefined" ) {
window.clearTimeout(m.hdlTimeout);
m.hdlTimeout = void(0);
}
if ( m.isVisible ) {
if ( _browser.isIE55 ) {
m.hide(100);
}
else if ( ! m.dynlayer.isInside(ev) ) {
m.dynlayer.hide();
m.isVisible = false;
activeCtxMenu = void(0);
m.owningWindow.setTempKeyDownHandler(null);
}
}
} catch(e) {}
}
return true;
}
function contextMenuCellMouseOver(mnum, itemCnt)
{
if ( mnum < ctxMenus.length ) {
try {
var m = ctxMenus[mnum]; 
var d = ( _browser.isIE55 ? m.popup.document.body.document
: document );
var e = d.getElementById("ctx_" + mnum + "_" + itemCnt);
var td = d.getElementById("ctx_" + mnum + "_" + itemCnt + "_cell");
if ( typeof e == "object" && e != null ) {
e.className = "menu_selected_text"; 
}
if ( typeof td == "object" && td != null ) {
td.className = "menubar_selected_background";
}
} catch(e) {}
}
return true;
}
function contextMenuCellMouseOut(mnum, itemCnt)
{
if ( mnum < ctxMenus.length ) {
try {
var m = ctxMenus[mnum]; 
var d = ( _browser.isIE55 ? m.popup.document.body.document
: document );
var e = d.getElementById("ctx_" + m.mnum + "_" + itemCnt);
var td = d.getElementById("ctx_" + m.mnum + "_" + itemCnt + "_cell");
if ( typeof e == "object" && e != null ) {
e.className = "menu_unselected_text"; 
}
if ( typeof td == "object" && td != null ) {
td.className = "menubar_unselected_background";
}
} catch(e) {}
}
return true;
}
function contextMenuKeyDown(active_element,keycode,shiftkey)
{
if ( typeof activeCtxMenu != "object" || activeCtxMenu == null )
return true;
var m = activeCtxMenu;
if ( _browser.isIE55 &&
( typeof m.popup != "object" ||
! m.popup.isOpen ) ) {
m.hide(0);
m.focused = false;
return true;
}
var i, new_inum = m.inum;
switch ( keycode ) {
case 38:
for ( i = m.inum - 1; i >= 0; i-- ) {
if ( m.items[i].isActive &&
! m.items[i].isHidden ) {
new_inum = i;
break;
}
}
break;
case 40:
for ( i = m.inum + 1; i < m.itemCnt; i++ ) {
if ( m.items[i].isActive &&
! m.items[i].isHidden ) {
new_inum = i;
break;
}
}
break;
case 9:
m.hide(0);
return true;
case 37:
m.hide(0);
break;
case 35:
m.hide(0);
break;
case 13:
m.hide(0);
m.ifired = true;
eval( m.items[m.inum].func );
break;
default:
var key = String.fromCharCode(keycode).toUpperCase();
var posn = m.actKeys.indexOf(key);
if ( posn != -1 ) {
m.hide(0);
if ( m.items[posn].isActive &&
! m.items[posn].isHidden ) 
eval( m.items[posn].func );
}
break;
}
if ( m.inum != new_inum ) {
var d, e, td;
if ( _browser.isIE55 )
d = m.popup.document.body.document;
else
d = document;
if ( m.inum >= 0 ) {
e = d.getElementById("ctx_" + m.mnum + "_" + m.inum);
td = d.getElementById("ctx_" + m.mnum + "_" + m.inum + "_cell");
if ( typeof e == "object" && e != null )
e.className = "menu_unselected_text";
if ( typeof td == "object" && td != null )
td.className = "menubar_unselected_background";
}
e = d.getElementById("ctx_" + m.mnum + "_" + new_inum); 
if ( typeof e == "object" && e != null )
e.className = "menu_selected_text";
td = d.getElementById("ctx_" + m.mnum + "_" + new_inum + "_cell"); 
if ( typeof td == "object" && td != null )
td.className = "menubar_selected_background";
m.inum = new_inum;
}
return false;
}
function bool(arg)
{
switch ( typeof arg ) {
case "boolean": return arg;
case "string": return arg.length == 1 && arg != "0";
case "number": return arg != 0;
default: return false;
}
}
function activateStatistics(showAlert)
{
if ( typeof ahdtop == "object" && ahdtop != null ) {
if ( typeof ahdframeset == "object" &&
ahdframeset != ahdtop )
ahdtop.activateStatistics(false)
else
ahdtop.popup_req_time = new Array();
if ( typeof showAlert != "boolean" || showAlert )
alertmsg("Response_time_statistics_activ");
}
}
function showStatistics()
{
var stats;
if ( typeof formCheckpoint == "object" ) {
var loadTime = formCheckpoint["load"];
if ( typeof formCheckpoint["request"] == "undefined" ) {
if ( typeof propFormName == "string" &&
propFormName == "bin_form_np.htmpl" )
return;
stats = msgtext("Request_Time:_unknown");
}
else {
var reqTime = formCheckpoint["request"];
stats = msgtext("Request_Time:_%1", fmtTimeDiff(reqTime));
}
var doneTime = new Date();
stats += "\n" + msgtext("Load_Start:_%1", fmtTimeDiff(loadTime,reqTime)) +
"\n" + msgtext("Load_Complete:_%1", fmtTimeDiff(doneTime,loadTime));
if ( typeof reqTime == "object" )
stats += "\n" + msgtext("User_Resp_Time:_%1_secs",
(doneTime.getTime() - reqTime.getTime()) / 1000);
if ( ! confirm(stats) ) {
var ahdtop = get_ahdtop();
if ( typeof ahdtop == "object" && ahdtop != null )
ahdtop.popup_req_time = void(0);
}
}
}
function fmtTimeDiff(endTime, startTime)
{
var s = endTime.toTimeString();
if ( typeof startTime == "object" ) {
var delta = endTime.getTime() - startTime.getTime();
s += " (" + delta / 1000 + " " + msgtext("secs") + ")";
}
return s;
}
function do_ci_60()
{
var w_name = get_popup_window_name("ci_window");
var js = "<script>var fromArr = new Array();";
js += 'fromArr[0] = ["KEY.category", "CATEGORY"];';
js += 'fromArr[1] = ["KEY.affected_resource", "ITEM"];';
js += 'fromArr[2] = ["SET.affected_resource", "SD_ASSET_ID"];';
js += 'var dOptField = cfgSearchStr;' ;
js += 'if (null == dOptField || "" == dOptField) ' ;
js += 'dOptField = "description";' ;
js += 'fromArr[3] = ["SET." + dOptField, "DESCRIPTION"];' ;
js += "</script>";
js += img_button_text('KT_NLS', 'search_nls', 125, "\"ci_update_fields(window, 'main_form', 'ci_search', fromArr);popupCiWindow('" + w_name + "' ,'ci_search', '', 1)\"", "<INPUT TYPE=BUTTON VALUE=\'Search NLS\' onClick=\"ci_update_fields(window, 'main_form', 'ci_search', fromArr);popupCiWindow('" + w_name + "' ,'ci_search', '', 1)\">");
document.writeln(js); 
}
function redo_ci_60()
{
var file_name = propFormName;
if (typeof cfgUserType == "string" &&
cfgUserType == "analyst" && 
propFormName == "detail_cr_ro.htmpl")
{
file_name = "crro_alg_tab.htmpl";
}
var temp = '<TD class=menuDetailro><A HREF="javascript:void(0)" onClick="alertmsg(\'To_browser_solution,_please_us\', \'' + file_name + '\')" >' + msgtext("Detail") + '</A></TD>';
return temp;
}
function cst_do_ci_60()
{
var tmp = img_button_text('KT_NLS', 'search_nls', 125, "\"cst_popup_knowledge()\"", "<INPUT TYPE=BUTTON VALUE=\'Search NLS\' onClick=\"cst_popup_knowledge()\">");
document.writeln(tmp); 
}
function cst_popup_knowledge()
{
var search_form = document.forms["ci_search"];
if (typeof search_form == "undefined")
{
alertmsg("The_ci_search_form_is_missing.", "cst_ci_search.htmpl", propFormName); 
return;
}
var description_elem = search_form.elements["DESCRIPTION"];
var main_form = document.forms["main_form"];
var set_desc_elem;
if (typeof main_form == "object")
set_desc_elem = main_form.elements["SET.description"];
if (typeof search_form !="object" || 
typeof description_elem !="object" ||
typeof set_desc_elem !="object")
return;
description_elem.value = set_desc_elem.value;
popupCiWindow("ci_search", "ci_search");
}
function copyContent()
{
var selectedText = document.selection;
if (selectedText.type == 'Text') {
var newRange = selectedText.createRange();
newRange.execCommand('copy');
} else 
alert('select a text in the page and then choose this option');
if (rClickMenu)
rClickMenu.hide(0);
}
function pasteContent()
{
if (paste_field && window.clipboardData)
{
var copy_content = window.clipboardData.getData('Text');
paste_field.value = copy_content;
} 
if (rClickMenu)
rClickMenu.hide(0);
}
function refreshForm()
{
var url = "";
if ((typeof propFormName == "string") && 
(propFormName == "window_list.html"))
{
window.location.reload();
return;
}
if ((typeof propFormName == "string") && 
(propFormName == "scoreboard.htmpl") &&
(typeof window.request_reload != "undefined"))
{
window.request_reload();
return;
}
if((typeof propFormName == "string" ) &&
(propFormName == "usq_update_control.htmpl"))
{
var treeFrame = parent.frames["usq_update_tree"];
var usq_owner = treeFrame.usq_owner;
var usq_owner_sym=treeFrame.usq_owner_sym;
var query_string = cfgCgi + "?OP=DISPLAY_FORM+SID="+cfgSID+"+FID="+fid_generator() +
"+HTMPL=usq_update.htmpl+KEEP.IsPopUp=1+KEEP.USQ_OWNER="+usq_owner+"+KEEP.USQ_OWNER_SYM="+nx_escape(usq_owner_sym)+
"+KEEP.POPUP_NAME=" + parent.argPopupName + "+KEEP.use_role=1";
window.parent.location=query_string;
return;
}
if((typeof propFormName == "string" ) &&
(propFormName == "list_dblocks.htmpl" ))
{
url = window.document.URL;
var current=Number(cfgCurrent);
if(current>1 && !url.match(/OP=LIST_ALL/))
{
url=cfgCgi+"?SID="+cfgSID+"+FID="+cfgFID+"+OP=LIST_LOCKS+FACTORY=dblocks+PG="+(current-1);
}
else
url=cfgCgi+"?SID="+cfgSID+"+FID="+cfgFID+"+OP=LIST_LOCKS+FACTORY=dblocks";
url = url.replace(/\'/g,"%27");
replace_page(url);
return;
}
if((typeof propFormName == "string") &&
(propFormName == "kt_document_view.htmpl"))
{
KDRefresh();
}
if ((typeof window.parent == "object") && 
(typeof window.parent.page == "object")) 
{
if ((typeof window.parent.menu == "object") && (propFormName == "profile_menu.htmpl")){
window.parent.menu.location.href = window.parent.menu.location.href;
}else{
if ((typeof window.parent.scratchpad == "object") && (propFormName == "scratchpad.htmpl")){
window.parent.scratchpad.location.href = window.parent.scratchpad.location.href;
}else{
window.parent.page.location.href = window.parent.page.location.href;
}
}
return;
}
if ( typeof propFormName3 != "string" ||
propFormName3.toString() != "edit" ) {
url = window.document.URL;
if ( typeof propFormName1 == "string" &&
propFormName1 == "detail" &&
typeof argPersistentID == "string" ) {
var colon = argPersistentID.indexOf(":");
if ( colon != -1 )
url = cfgCgi + "?SID=" + cfgSID + "+FID=" + cfgFID +
"+OP=SHOW_DETAIL+FACTORY=" +
argPersistentID.slice(0,colon) +
"+PERSID=" + nx_escape(argPersistentID);
}
if ((typeof propFormName1 == "string") &&
(propFormName1 == "list"))
{
if ((typeof cfgCurrent == "string") &&
(cfgCurrent == "1")&& !url.match(/OP=SEARCH/)) 
{
doSearch();
return;
}
else 
{
if ((url.match(/OP=PG/) || url.match(/OP=LIST_ALL/) || url.match(/OP=SEARCH/)) &&
!url.match(/REFRESH=1/)) 
{ 
url += "+REFRESH=1"; 
}
}
}
}
if ( url.indexOf("?") == -1 ||
url.match(/OP=(CANCEL|DELETE|UPDATE)/) ||
url.indexOf("HTMPL=update_lrel_") != -1 ||
url.indexOf("HTMPL=kt_dtbuilder") != -1 )
alertmsg("Sorry,_unable_to_refresh_this_");
else {
set_action_in_progress(ACTN_LOADFORM);
url = url.replace(/\'/g,"%27");
replace_page(url);
}
}
ContextMenu.prototype.activateItem = function( id )
{
for ( var i = this.items.length - 1; i >= 0; i-- ) {
var item = this.items[i];
if ( item.id == id ) {
if ( ! item.isActive ) {
item.isActive = true;
if ( ! this.usingScreenReader ) {
var oMenu = document.getElementById(id);
if ( oMenu != null )
{
oMenu.style.color = "";
}
}
}
return;
}
}
}
ContextMenu.prototype.deactivateItem = function( id )
{
for ( var i = this.items.length - 1; i >= 0; i-- ) {
var item = this.items[i];
if ( item.id == id ) {
if ( item.isActive ) {
item.isActive = false;
if ( ! this.usingScreenReader ) {
var oMenu = document.getElementById(id);
if ( oMenu != null ){
oMenu.style.color = "gray";
}
}
}
return;
}
}
}
ContextMenu.prototype.showItem = function( id )
{
for ( var i = this.items.length - 1; i >= 0; i-- ) {
var item = this.items[i];
if ( item.id == id ) {
if ( item.isHidden ) {
item.isHidden = false;
if ( ! this.usingScreenReader ) {
var oTR = document.getElementById("tr" + id);
if ( oTR != null )
oTR.style.display = "";
}
}
return;
}
}
}
ContextMenu.prototype.hideItem = function( id )
{
for ( var i = this.items.length - 1; i >= 0; i-- ) {
var item = this.items[i];
if ( item.id == id ) {
if ( ! item.isHidden ) {
item.isHidden = true;
if ( ! this.usingScreenReader ) {
var oTR = document.getElementById("tr" + id);
if ( oTR != null )
oTR.style.display = "none";
}
}
return;
}
}
}
ContextMenu.prototype.changeImage = function( id, img )
{
var oImg = document.getElementById("img" + id);
if (oImg != null)
{
oImg.src = img;
}
}
function pm_execFunc(id, mnum)
{
if ( typeof activeCtxMenu != "undefined" && activeCtxMenu != null ) {
for ( var i = activeCtxMenu.items.length - 1; i >= 0; i-- ) {
var item = activeCtxMenu.items[i];
if ( item.id == id ) 
{
if ( item.isActive && 
! item.isHidden ) 
{
eval(nx_unescape(item.func));
activeCtxMenu.hide(0);
}
if(typeof nmum != "undefined")
{
contextMenuHide(mnum);
}
return;
}
}
}
}
function showPreferences()
{
var features="directories=no"+
",location=no"+
",height=" + popupHeight(MEDIUM_POPUP) +
",width=" + popupWidth(MEDIUM_POPUP)+
",status=no";
if (typeof ahdtop.useDefaultPrefs == "undefined" || 
typeof ahdtop.prefsRecID == "undefined")
{
alertmsg("Unable_to_start_preferences_pa");
return;
}
if(ahdtop.useDefaultPrefs)
{	
popup_window('pref:' + ahdtop.cstID, 'CREATE_NEW', 0, 0, features, 'FACTORY=USP_PREFERENCES', 'PRESET=ANALYST_ID:' + ahdtop.cstID, 'KEEP.SHOW_KT_PREFS=' + ahdtop.CanUserPerformAction("ROLE_PREFERENCES"), "RELOAD_WIN=0");
}
else
{
popup_window('pref:' + ahdtop.prefsRecID, 'UPDATE', 0, 0, features, 'PERSID=USP_PREFERENCES:' + ahdtop.prefsRecID, 'KEEP.SHOW_KT_PREFS=' + ahdtop.CanUserPerformAction("ROLE_PREFERENCES"), "RELOAD_WIN=0");	
}	
}
function popup_solution_survey(doc_id, doc_BUID, doc_tenant, doc_title, sdLaunched, ticket_factory, launched_itil)
{
var features="directories=no"+
",location=no"+
",height=" + popupHeight(SMALL_POPUP) +
",width=" + popupWidth(SMALL_POPUP)+
",status=no";
popup_window('SOLUTION_SURVEY:' + doc_id, 'DISPLAY_FORM', -1, -1, features, 'HTMPL=kt_solution_survey_popup.htmpl', 'doc_id='+ doc_id, 'doc_BUID=' + doc_BUID, 'doc_tenant='+ doc_tenant, 'doc_title=' + doc_title, 'SD_LAUNCHED=' + sdLaunched, '+TICKET_FACTORY=' + ticket_factory, '+LAUNCHED_ITIL=' + launched_itil);	
}
function findIt(fromForm, from_attr)
{
if (typeof fromForm == "undefined" || typeof from_attr == "undefined") 
{
return null;
}
var attrPrefix = "";
var plainAttrName = "";
if (0 == from_attr.indexOf("KEY.") || 0 == from_attr.indexOf("SET.")) {
attrPrefix = from_attr.slice(0, 3);
plainAttrName = from_attr.slice(4);
} else {
return null;
}
var src_elm = fromForm.elements[from_attr];
if (typeof src_elm != "object" || src_elm == null) {
if ("KEY" == attrPrefix) {
src_elm = document.main_form.elements["SET." + plainAttrName]; 
if (typeof src_elm != "object" || src_elm == null || src_elm.type != "select-one") 
{
return null; 
}
} else {
return null;
}
} 
var val = null;
if (src_elm.type == "select-one") {
var opts = src_elm.options;
var idx = src_elm.selectedIndex;
if ("KEY" == attrPrefix) {
val = opts[idx].text;
} else {
val = opts[idx].value;
}
} else {
val = src_elm.value;
}
return val;
}
function logSolution( query_str )
{
query_str += "+ACTIVITY_LOG_TYPE=SOLN";
if (typeof propFormRelease != "undefined" && propFormRelease >= 60 &&
typeof _dtl != "undefined" && _dtl.edit) 
{
var pri = findIt(document.main_form, "SET.priority");
var sev = findIt(document.main_form, "SET.severity");
var urg = findIt(document.main_form, "SET.urgency");
var imp = findIt(document.main_form, "SET.impact");
if (null != pri)
query_str += "+KEEP.pri_enum=" + pri;
if (null != sev)
query_str += "+KEEP.sev_enum=" + sev;
if (null != urg)
query_str += "+KEEP.urg_enum=" + urg;
if (null != imp)
query_str += "+KEEP.imp_enum=" + imp;
} 
popupActivityWithURL(query_str,"soln");
if ( typeof window._dtl == "object" )
window._dtl.tabReloadOnSave += " soln";
}
function addViewSubMenuItems(menu, factory, RefNum)
{
if ((0 + cfgUserAuth) > 1)
{
if ((0 + cfgAccessFac_lr) > 0)
menu.addItem(menu.id + "NotifHst",
msgtext("Notification_History..."),
"",
"show_hist('" + factory + "', '" + RefNum + "', '" + argID + "')",
true);
menu.addItem(menu.id + "ATEV",
msgtext("Event_History..."),
"",
"show_evt('" + factory + "', 'atev', '" + argID + "')",
true, true);
menu.addItem(menu.id + "EVTDLY",
msgtext("Event_Delay_History..."),
"",
"show_evt('" + factory + "', 'evtdly', '" + argID + "')",
true, true);
}
menu.addInternalItem("idInTheKnowNotifyList",
msgtext("In-The-Know_Notify_List..."),
"",
"JavaScript: update_lrel('" + factory + "', '" + argPersistentID +
"', 'cnt', 'notify_list', '" + msgtext("Contact_List") + "', '" + msgtext("Contact_to_Notify") + "', '')",
"",
true);
}
/* Function: show_evt
* Parameters: fac	- object factory
* ref_num	- reference number
*	id	- id
*
* Return: none
*
* Purpose: Display the event history for a chg object in a new pop-up window
*/
function show_evt(fac, search_fac, id)
{
var wc = "+KEEP.where_clause=obj_id='" + fac + ":" + id + "'";
var obj = "+KEEP.obj_type=" + fac;
if (fac == "mgs") 
var q = cfgCgi + "?SID=" + cfgSID + "+FID=" + fid_generator() + 
"+OP=SEARCH+FACTORY="+search_fac+wc+obj;
else
var q = cfgCgi + "?SID=" + cfgSID + "+FID=" + fid_generator() + 
"+OP=SEARCH+FACTORY="+search_fac+wc;
var nh = preparePopup(q, "", "width=800,height=400,scrollbars,resizable");
nh.focus();
}	
function openDetail_role()
{
ImgBtnEnableButton("btndflt");
var searchKey = document.goBtnForm.searchKey;
var key = searchKey.value.replace(/[\<\\"]/g,"");
key=key.replace("\'","\\\'");
searchKey.value = "";
if ( key.match(/^ *$/) ) 
{
searchKey.focus();
return;
}
var ticket_type = document.goBtnForm.ticket_type;
var ticket_type_obj = ticket_type[ticket_type.selectedIndex];
var ticket_code = ticket_type_obj.value;
var resource = go_list[ticket_code].resource;
if (!ahdtop.cstReducePopups)
ahdtop.go_role_menubar = go_list[ticket_code].role_menu;
else 
ahdtop.go_role_menubar = void(0);
var add_where = ""
var fac_arr = resource.match(/^.*factory=([^\+]+)\+.*$/i);
if (fac_arr != null && fac_arr.length == 2)
{
var factory = fac_arr[1];
if (factory == "cr" ||
factory == "chg" ||
factory == "iss" ||
factory == "in" ||
factory == "pr") {
if (factory == "cr") {
add_where = "+ADDITIONAL_WHERE=" +
nx_escape("(type='R' OR type='' OR type IS NULL)");
}
if (factory == "in" || factory == "pr")
factory = "cr";
var ahdwin = ahdtop.detailForms[factory + key];
if (typeof ahdwin == "object" &&
typeof ahdwin.name == "string" &&
typeof ahdwin.closed == "boolean" &&
!ahdwin.closed) {
ahdwin.focus()
if (typeof ahdframe._dtl == "object")
ahdframe._dtl.firstField.focus();
return;
}
}
else if (factory == "kd") {
add_where = "+ADDITIONAL_WHERE=" + nx_escape("(ACTIVE_STATE=0)");
}
}
var srch_key = key;
if (!resource.match(/^Javascript/i))
srch_key = nx_escape(key);
resource = resource.replace(/\$searchKey/g, srch_key);
resource = resolveWebFormVars(resource);
if (resource.match(/^javascript:/i))
{
eval(resource);	
} 
else 
{
if (add_where != "")
resource += add_where;
resource += "+KEEP.GoBtnRole=1";
ahdtop.popupWithURL(resource);
}
}
function KDKeywordSearch (searchKey)
{
ahdtop.SearchText = "QBE.IN.ebr_search_text=" + searchKey;
var ebrSearchOrAndExact;
if (ahdtop.GetUSPPreferences("ONE_B_MATCH_TYPE") == "2")	
ebrSearchOrAndExact = "ALL";
else if (ahdtop.GetUSPPreferences("ONE_B_MATCH_TYPE") == "3")
ebrSearchOrAndExact = "EXACT";
else
ebrSearchOrAndExact = "ANY";
var lTab = -1;
for(var i=ahdtop.toolbarTab.length-1;i>=0;i--)
{
if (ahdtop.toolbarTab[i].code=="kt")
{
lTab = i;
break;
}
}
var sWC ="";
if (ahdtop.m_sDefStatusWhereClause != "" )
sWC = "("+ ahdtop.m_sDefStatusWhereClause+ ")";
if (lTab != -1)
{
ahdtop.upd_specific_frame(lTab, "SEARCH", "FACTORY=KD", ahdtop.SearchText, "QBE.EQ.ebr_search_type=KEYWORDS", 
"QBE.EQ.ebr_match_type=" + ebrSearchOrAndExact , "ADDITIONAL_WHERE="+sWC,
"QBE.EQ.ebr_primary_order=" + ahdtop.GetUSPPreferences("ONE_B_SEARCH_ORDER"), 
"DOMSET=KD_list_ebr_RELEVANCE"); 
}
}
// Copyright (c) 2005 CA.  All rights reserved.
function set_combo_name(form_name, object_name, key_name)
{
var ele_obj = document.forms[form_name].elements; 
var lname=object_name + "_lname";
var fname=object_name + "_fname";
var mname=object_name + "_mname";
var cname="KEY." + object_name;
if (key_name && typeof key_name != "undefined" && key_name != "")
cname=key_name + "." + object_name; 
var idname="SET." + object_name; 
var ele = ele_obj[object_name+"_combo_name"];
if ((ele_obj[lname].value == "") &&
(ele_obj[fname].value == "") &&
(ele_obj[mname].value == ""))
{
ele_obj[cname].value = "";
if (typeof ele == "object")
ele.value = "";
}
else
{
var lname_str = gsub(ele_obj[lname].value, ",", "%");
var fname_str = gsub(ele_obj[fname].value, ",", "%"); 
var mname_str = gsub(ele_obj[mname].value, ",", "%"); 
ele_obj[cname].value = lname_str + ", " +
fname_str + ", " +
mname_str;
if (typeof ele == "object")
{
ele.value = lname_str + ", " + fname_str + ", " + mname_str;
}
}
ele_obj[idname].value = "";
}
function write_contact_fields (form_name, field_name, lname_val, fname_val, 
mname_val, cname_val, name_id, is_group, 
keyname, onchange_func, external_name)
{
if (typeof onchange_func == "undefined")
onchange_func = "set_combo_name('" + form_name + "', '" + field_name + "', '" + keyname + "')";
if (!keyname || typeof keyname == "undefined" || keyname == "")
keyname = "";
if ( typeof external_name != "string" )
external_name = "";
document.writeln('   <TABLE CELLPADDING=0 CELLSPACING=0 >');
document.writeln('     <TR>');
document.writeln('       <TD VALIGN=TOP>');
document.writeln('        <INPUT TEXT NAME=' + field_name + '_lname VALUE="' + lname_val + '"');
document.writeln('         SIZE=10 onChange="' + onchange_func + '" title="' + msgtext(( is_group? 894 : 891), external_name) + '">');
document.writeln('       </TD>');
document.writeln('       <TD VALIGN=TOP>');
if (!is_group)
{
document.writeln('        <INPUT TEXT NAME=' + field_name + '_fname VALUE="' + fname_val + '"');
document.writeln('         SIZE=10 onChange="' + onchange_func + '" title="' + msgtext("%1_first_name",external_name) + '">');
}
else 
{
document.writeln('        <INPUT TYPE=HIDDEN NAME=' + field_name + '_fname VALUE="">');
}
document.writeln('       </TD>');
document.writeln('       <TD VALIGN=TOP>');
if (!is_group)
{
document.writeln('        <INPUT TEXT NAME=' + field_name + '_mname VALUE="' + mname_val + '"');
document.writeln('         SIZE=10 onChange="' + onchange_func + '" title="' + msgtext("%1_middle_name",external_name) + '">');
}
else 
{
document.writeln('        <INPUT TYPE=HIDDEN NAME=' + field_name + '_mname VALUE="">');
}
document.writeln('        <INPUT TYPE=hidden NAME=SET.' + field_name);
if (name_id == 0)
{
document.writeln('         VALUE="">');
}
else 
{
document.writeln('         VALUE=' + name_id + '>');
}
if (keyname != "")
document.writeln('        <INPUT TYPE=hidden NAME='+ keyname+'.' + field_name + ' SIZE=25');
else
document.writeln('        <INPUT TYPE=hidden NAME=KEY.' + field_name + ' SIZE=25');
document.writeln('         VALUE="' + cname_val + '">');
document.writeln('       </TD>');
document.writeln('     </TR>');
if (!is_group)
{
document.writeln('     <TR>');
document.writeln('       <TD VALIGN=TOP>');
document.writeln('        <SPAN class=hinttext>' + msgtext("Last") + '</SPAN>');
document.writeln('       </TD>');
document.writeln('       <TD VALIGN=TOP>');
document.writeln('        <SPAN class=hinttext>' + msgtext("First") + '</SPAN>');
document.writeln('       </TD>');
document.writeln('       <TD VALIGN=TOP>');
document.writeln('        <SPAN class=hinttext>' + msgtext("Middle") + '</SPAN>');
document.writeln('       </TD>');
document.writeln('     </TR>');
}
document.writeln('   </TABLE>');
}
function fill_name_fields( f, obj_type, attr_name, do_popup_search, extraURL )
{
if (typeof extraURL != "string") {
extraURL = "";
}
var rxAnyNonBlank = new RegExp("[^ ]");
var combo_name = f.elements[attr_name + "_combo_name"];
var lname = f.elements[attr_name + "_lname"];
var fname = f.elements[attr_name + "_fname"];
var mname = f.elements[attr_name + "_mname"];
lname.value = "";
fname.value = "";
mname.value = "";
var v = combo_name.value;
if ( ! do_popup_search &&
typeof f.elements["SET." + attr_name] == "object" )
f.elements["SET." + attr_name].value = "";
if ( v.match(rxAnyNonBlank) ) {
var r = v.match(/ *([^,]+) *, *(.*) */);
if ( r == null || obj_type == "grp" )
lname.value = v;
else {
lname.value = r[1];
var r2 = r[2].match(/ *([^,]+) *, *(.*) */);
if ( r2 == null) {
if ((typeof _dtl != "undefined" && _dtl.is_from_autoSuggest == "SKIP_AUTO_FILL" && v.match(/\s$/)) ||
(typeof __search_filter != "undefined" && __search_filter.is_from_autoSuggest == "SKIP_AUTO_FILL" && v.match(/\s$/)))
r[2] = r[2].substring(0, r[2].length-1);
else
r2 = r[2].match(/ *([^ ]+) +(.*) */);
}
if ( r2 == null )
fname.value = r[2];
else {
if ((typeof _dtl != "undefined" && _dtl.is_from_autoSuggest == "SKIP_AUTO_FILL" && r[2].match(/\s+/g).length > 1) ||
(typeof __search_filter != "undefined" && __search_filter.is_from_autoSuggest == "SKIP_AUTO_FILL" && r[2].match(/\s+/g).length > 1)){
r2 = r[2].match(/ *([^ ]+) +(.*) */);
fname.value = r2[1];
}
else {
fname.value = r2[1];
mname.value = r2[2];
}
}
}
}
if (fname.value == ",")
fname.value = "";
if ( typeof f.elements["KEY." + attr_name] == "object" )
{
var keyFld = f.elements["KEY." + attr_name];
keyFld.value = "";
if ( lname.value.length + mname.value.length + fname.value.length > 0 ) {
keyFld.value = lname.value;
if ( fname.value.length > 0 || mname.value.length > 0 || obj_type == "grp" ) {
keyFld.value += ", " + fname.value;
if ( mname.value.length > 0 || obj_type == "grp" )
keyFld.value += ", " + mname.value;
}
}
}
if ( do_popup_search ) {
var extra = fill_name_fields_text(obj_type, f, extraURL);	
if (obj_type == "g_cnt") 
{
popup_search("g_cnt", attr_name, f.name, extra, 1);
} else {
popup_search("cnt", attr_name, f.name, extra, 1);
}
}
}
function fill_name_fields_text(obj_type, f, extraURL)
{
if (typeof extraURL != "string") {
extraURL = "";
}
var extra = extraURL;
if ( obj_type == "agt" || (obj_type == "cnt" && propFormName == "detail_wf.htmpl"))
{
extra += "+KEEP.type.id=2307";
extra += "+QBE.EQ.delete_flag=0";
if (typeof f.elements["SET.wf_ins_grp"] == "object" &&
f.elements["SET.wf_ins_grp"].value != "")
extra += "+KEEP.in_group_id=" + f.elements["SET.wf_ins_grp"].value; 
if (typeof f.elements["SET.group"] == "object" &&
f.elements["SET.group"].value != "")
extra += "+KEEP.in_group_id=" + f.elements["SET.group"].value;
}
else if ( obj_type == "grp" )
{
extra += "+KEEP.type.id=2308";
extra += "+QBE.EQ.delete_flag=0";
}
else if ( obj_type == "agtgrp")
{
if(!(typeof cfgAnyContact=="string" && cfgAnyContact=="1"))
{
extra += "+KEEP.AgtGrp=1"
var addl_where = nx_escape("(type=2307 OR type=2308)");
var results = extra.match(/ADDITIONAL_WHERE=([^+]*)/);
if (results == null)
{
extra += "+ADDITIONAL_WHERE=" + addl_where;
}
else
{
var curr_addl_where = results[1];
var pos = extra.indexOf(curr_addl_where);
var new_addl_where = curr_addl_where + " AND (" + addl_where + ")";	
extra = extra.substring(0, pos) + new_addl_where + 
extra.substring(pos+curr_addl_where.length);	
}
}
}
return extra;
}
// Copyright (c) 2005 CA.  All rights reserved.
// fid_gen.js,v 1.3 2001/05/24 02:00:51
function fid_generator()
{
return Math.round(Math.random() * 10000); 
}
// Copyright (c) 2005 CA.  All rights reserved.
var LARGE_POPUP = 1;
var MEDIUM_POPUP = 2;
var SMALL_POPUP = 3;
var XSMALL_POPUP = 4;
var bopsid = 0;
var bo_info = "";
var artifact = 0;
var cancel_cnt_lookup = 0;
var callbackfunc = "";
function popupHeight(popup_size)
{
var size_obj = eval("ahdtop.cstPopup" + popup_size);
if (typeof size_obj != "object" ||
typeof size_obj[0] != "number" ||
typeof ahdtop.default_size_arr != "object")
{
alertmsg("Unable_to_get_the_popup_window");
return;
}
screenH = window.screen.availHeight-30; 
if(typeof screenH == "number"){
if( screenH <= size_obj[0]){
size_obj[0] = screenH;	
}
}
if (size_obj[0] > 0)
return size_obj[0];
else
return ahdtop.default_size_arr[popup_size][0];
}
function popupWidth(popup_size)
{
var size_obj = eval("ahdtop.cstPopup" + popup_size);
if (typeof size_obj != "object" ||
typeof size_obj[1] != "number" ||
typeof ahdtop.default_size_arr != "object")
{
alertmsg("Unable_to_get_the_popup_window");
return;
}
screenW = window.screen.availWidth-30; 
if(typeof screenW == "number"){
if( screenW <= size_obj[1]){
size_obj[1] = screenW;	
}
} 
if (size_obj[1] > 0)
return size_obj[1];
else
return ahdtop.default_size_arr[popup_size][1];
}
var autofill = void(0);
function prepareTenantedPopup(url, name, features, width, height, frame_args, pForcePopup)
{
if ( ahdtop.cfgMultiTenancy == "on" ) {
try {
var foundTenant = false;
for ( var w = window; typeof w.argTenantId == "string"; w = w.parent )
if ( w.argTenantId.length > 0 ) {
url += "+PRESET=tenant:" + w.argTenantId;
foundTenant = true;
break;
}
if ( ! foundTenant )
url += "+presetToPublic=1";
}
catch(w) {}
}
return preparePopup( url, name, features, width, height, frame_args, pForcePopup );
}
function prepareTenantedNonpublicPopup(url, name, features, width, height, frame_args)
{
if ( ahdtop.cfgMultiTenancy == "on" ) {
try {
for ( var w = window; typeof w.argTenantId == "string"; w = w.parent )
if ( w.argTenantId.length > 0 ) {
url += "+PRESET=tenant:" + w.argTenantId;
break;
}
}
catch(w) {}
}
return preparePopup( url, name, features, width, height, frame_args );
}
function preparePopup(url, name, features, width, height, frame_args, pForcePopup)
{
var w = null;
var popunder = false;
var force_popup = false;
if (typeof pForcePopup != "undefined")
force_popup = pForcePopup;
if (typeof propFormName == "string" && 
propFormName == "list_kt_report_card.htmpl")
force_popup = true;
if ( ( url.indexOf("FACTORY=risk_svy_qtpl")!=-1 && url.indexOf("PERSID=risk_svy_qtpl")!=-1 ) || 
( url.indexOf("FACTORY=risk_svy_atpl")!=-1 && url.indexOf("PERSID=risk_svy_atpl")!=-1 ) )
{
force_popup = true;
}
if ( !force_popup && ( url.indexOf("FACTORY=svy_qtpl")!=-1 && url.indexOf("PERSID=svy_qtpl")!=-1 ) || 
( url.indexOf("FACTORY=svy_atpl")!=-1 && url.indexOf("PERSID=svy_atpl")!=-1 ) )
{
force_popup = true;
}
var popup_type = LARGE_POPUP;
var w_name;
if ( typeof name == "string" && name == "popunder" ) {
name = "";
popunder = true;
width = 150;
height = 150;
}
if ( typeof width == "number" && width < 0 ) {
force_popup = true;
width = 0 - width;
height = 0 - height;
}
if ( typeof ahdtop == "object" )
{
w_name = name;
if (name.length > 0)
w_name = popup_window_name(name);
if ( w_name.length > 0 &&
typeof ahdtop.AHD_Windows[w_name] == "object" &&
! ahdtop.AHD_Windows[w_name].closed )
{
w = ahdtop.AHD_Windows[w_name];
if (url.indexOf("?") < 0)
url += "?";
else
url += "+";
url += "KEEP.POPUP_NAME=" + w_name;
if ( url.indexOf("+RELOAD_WIN=0") == -1 )
{
var objWin;
if ( w.ahdframe.name == "frmDTUserNode" &&
w.ahdframe.parent.name == "cai_main" &&
url.indexOf("HTMPL=kt_document_view.htmpl") != -1)
{
objWin = w.ahdframe.parent;
}
else
{
objWin = w.ahdframe;
}
display_new_page(url,objWin);
}
w.focus();
}
else if ( typeof ahdtop.popup_frames_info != "object" ) {
alertmsg("Can't_popup_window_-_popup_fra");
return null;
}
else {
if ( typeof width != "number" ||
typeof height != "number" ||
width < 150 ||
height < 150 ) {
width = popupWidth(LARGE_POPUP);
height = popupHeight(LARGE_POPUP);
factory_arr = url.split("PERSID=");
if ( factory_arr.length == 1 ) {
factory_arr = url.split("FACTORY=");
if ( factory_arr.length != 1 ) {
myFactory = factory_arr[1].split("+");
result = ahdtop.checkPopupSize(myFactory[0]);
if ( result != 0 ) {
width = popupWidth(result);
height = popupHeight(result);
popup_type = result;
}
}
}
else {
factory_arr[1] = factory_arr[1].replace(/:/g,"%3A");
myFactory = factory_arr[1].split("%3A");
result = ahdtop.checkPopupSize(myFactory[0]);
if ( result != 0 ) {
width = popupWidth(result);
height = popupHeight(result);
popup_type = result;
}
}
}
if ( ahdtop.cstReducePopups &&
( url.indexOf("INITFROM") == -1 ) &&
ahdframeset.name == "AHDtop" &&
( typeof ahdframe.edit_form != "number" ||
ahdframe.edit_form != 1 ) &&
! force_popup &&
! popunder ) {
if ( url.match(/^(.*[^\+])\+?KEEP.POPUP_NAME=(\w*)(.*)$/) )
url = RegExp.$1 + RegExp.$3;
if ( url.match(/^(.*[^\+])\+?KEEP.IsPopUp=1(.*)$/) )
url = RegExp.$1 + RegExp.$2;
ahdtop.focus();
set_action_in_progress(ACTN_LOADFORM);
ahdframe.document.location.href = url;
return ahdframe;
}
if ((ahdframeset != ahdtop && 
typeof ahdframe.find_menubar_from_popup == "string" &&
ahdframe.find_menubar_from_popup == "1") ||
(ahdframeset == ahdtop && 
typeof ahdtop.role_menubar_flag == "number" && 
ahdtop.role_menubar_flag == 1))
url += "+KEEP.find_menubar_from_popup=1";
var info = new Object();
info.popunder = popunder;
if(typeof callbackfunc == "object" || typeof callbackfunc == "function")
info.callbackfunc = callbackfunc;
info.url = url;
if (url.indexOf("popupType=") == -1)
info.url += "+popupType=" + popup_type;
info.name = name;
for ( var i = 0; i < ahdtop.popup_frames_info.length; i++ )
if ( typeof ahdtop.popup_frames_info[i] == "undefined" )
break;
ahdtop.popup_frames_info[i] = info;
if ( typeof ahdtop.popup_req_time == "object" )
ahdtop.popup_req_time[i] = (new Date()).getTime();
if ( typeof frame_args == "string" && frame_args.length > 0 )
frame_args += "+POPUP_URLIX=" + i;
else
frame_args = "POPUP_URLIX=" + i;
}
}
if ( w == null )
{
if ( typeof features != "string" )
features = "";
if ( features.indexOf("resizable") == -1 )
if ( cfgAllowPopupResize )
features += ",resizable";
if ( features.indexOf("scrollbars") == -1 )
features += ",scrollbars";
if ( features.indexOf("height") == -1 )
features += ",height=" + height;
if ( features.indexOf("width") == -1 )
features += ",width=" + width;
if ( ! popunder )
{
if ( _browser.isNS )
{
if ( features.indexOf("screenX") == -1 )
features += ",screenX=10";
if ( features.indexOf("screenY") == -1 )
features += ",screenY=10";
}
else
{
if ( features.indexOf("left") == -1 )
features += ",left=10";
if ( features.indexOf("top") == -1 )
features += ",top=10";
}
}
if ( features.substr(0,1) == "," )
features = features.substr(1,features.length-1);
var popup_url = ( cfgUserType == "analyst" ?
ahdtop.popup_frames_url :
ahdtop.cst_popup_frames_url );
ahdtop.initial_gobtn_url = ahdtop.usdHTML["gobtn"];
if ( typeof frame_args == "string" && frame_args.length > 0 )
popup_url += "?" + frame_args;
if (popup_url.indexOf("popupType=") == -1)
popup_url += "+popupType=" + popup_type;
if ( ahdtop.propDebugOptions != "" )
features = modifyWindowFeaturesForDebug(features);
if ( _browser.isSafari )
{	
w = window.open( "about:blank", "", features);	
w.location.href = popup_url;
}	
else if ( _browser.isNS )
{	
w = window.open( "", "", features);	
w.location.href = popup_url;
}
else	
w = window.open( popup_url, "", features);
if (!check_popup_blocker(w))
return;
if ( typeof ahdtop == "object" )
ahdtop.LoadingPopup = w;
if ( popunder )
window.setTimeout("window.focus()",100);
if (w_name.length > 0) 
ahdtop.AHD_Windows[get_popup_window_name(w_name)] = w;
}
return w;
}
var resume_cat_func = void(0);
function check_cnt_from_cat()
{
if (typeof resume_cat_func == "string")
{
eval(resume_cat_func);
ahdframe.resumeAction = "";
}
}
function setting_contact_in_progress(form_name, cnt_fld1, cnt_fld2)
{
var set_fld1 = "SET." + cnt_fld1;
var set_fld2 = "SET." + cnt_fld2;
var combo_name_fld1 = cnt_fld1 + "_combo_name"; 
var combo_name_fld2 = cnt_fld2 + "_combo_name";
var combo_fld_obj1;
var combo_fld_obj2;
var ret_obj = {set_fld_obj: null, delay: false};
var set_cst_fld = document.forms[form_name][set_fld1];
if (typeof set_cst_fld != "undefined")
{
if (set_cst_fld.value != null && set_cst_fld.value.length > 0)
{
ret_obj.set_fld_obj = set_cst_fld;
return ret_obj
}
if (cancel_cnt_lookup)
return ret_obj;
combo_fld_obj1 = document.forms[form_name][combo_name_fld1];
if (typeof combo_fld_obj1 != "undefined" &&
combo_fld_obj1.value.length > 0)
{
ret_obj.delay = true;
return ret_obj;
}
if (cnt_fld2 == "") 
return ret_obj;
set_cst_fld = document.forms[form_name][set_fld2];
if (typeof set_cst_fld != "undefined")
{
combo_fld_obj2 = document.forms[form_name][combo_name_fld2];
if (set_cst_fld.value != null && set_cst_fld.value.length == 0 && 
typeof combo_fld_obj2 != "undefined" &&
combo_fld_obj2.value.length > 0)
{
if (typeof propFactory == "string")
{
if (propFactory == "cr" && typeof cus_value == "string" && 
typeof combo_fld_obj1 != "undefined" && 
(combo_fld_obj1.value == cus_value || 
combo_fld_obj1.value == ""))
ret_obj.delay = true;
if (propFactory == "chg" && typeof aff_cnt_value == "string" && 
typeof combo_fld_obj1 != "undefined" && 
(combo_fld_obj1.value == aff_cnt_value || 
combo_fld_obj1.value == ""))
ret_obj.delay = true;
}
}
}
}
return ret_obj;
}
function popup_hier(factory, backfill_field, backfill_form, backfill_attr,
do_autofill)
{
if ("" == backfill_field || backfill_field+"" == "undefined" ||
backfill_field+"" == "NaN")
{
alertmsg("popup_search()_was_passed_blan");
return null;
}
if ("" == backfill_form || backfill_form+"" == "undefined" ||
backfill_form+"" == "NaN")
{
alertmsg("popup_search()_was_passed_blan");
return null;
}
var url = cfgCgi +
"?SID=" + cfgSID +
"+FID=" + fid_generator() +
"+KEEP.IsPopUp=1" +
"+KEEP.backfill_field=" + backfill_field +
"+KEEP.backfill_form=" + backfill_form +
"+KEEP.backfill_attr=" + backfill_attr;

// 20130907 bmalz @ e-xim
if(typeof OwningContracts !== "undefined") {
	if(OwningContracts != '')
		url += "+KEEP.UserOwningContracts=" + OwningContracts;
}
	
var e;
try {
if ( cfgAccessTenantRestriction != "1" ) {
url += "+KEEP.backfillPersid=" + argPersistentID +
"+KEEP.backfillFactory=" + propFactory +
"+KEEP.objectTenant=" + 
( argGlobalTenant ? "n/a" : argTenantId ) +
"+KEEP.objectTenantName=" + encodeURIComponent(argTenant);
}
}
catch(e) {}
var customerid;
var ret_obj = null;
var is_category = true;
switch ( factory ) {
case "pcat" :
case "pcat_cr" :
case "pcat_in" :
case "pcat_pr" :
case "pcat_cr_ss" :
case "pcat_in_ss" :
ret_obj = setting_contact_in_progress(backfill_form, "customer", "requested_by");
break;
case "chgcat" :
case "chgcat_ss" :
ret_obj = setting_contact_in_progress(backfill_form, "affected_contact", "requestor");
break;
case "isscat" :
case "isscat_ss" :
ret_obj = setting_contact_in_progress(backfill_form, "requestor", "");
break;
default:
is_category = false;
break;
}
if (ret_obj != null)
{
if (ret_obj.delay)
{	
resume_cat_func = "popup_hier('" + factory + "', '" + backfill_field +
"', '" + backfill_form + "', '" + backfill_attr + 
"', " + do_autofill + ");";
ahdframe.resumeAction = "check_cnt_from_cat();";
return null;
}
if (ret_obj.set_fld_obj != null)
{	
customerid = ret_obj.set_fld_obj.value;
url += "+SERVICE_CST=" + customerid;
}
}
var hier_key = "";
var f = document.forms[backfill_form];
if ( typeof f == "object" ) {
var e = f.elements[backfill_field];
if ( typeof e == "object" && e != null ) {
if ( e.type == "select-one" )
hier_key = e.options[e.selectedIndex].value;
else
hier_key = e.value;
if ( backfill_field.match(/KEY\.(.*)/) ) {
var attr = RegExp.$1;
e = f.elements["SET." + RegExp.$1];
if ( e != null && ! e.value.match(/^ *$/) )
hier_key = "";
}
var hier_key_orig = hier_key;
var esc_hier_key = nx_escape(hier_key);
var modified_hier_key = esc_hier_key.replace(/\+/,"%2B");
if((is_category == true) && (hier_key_orig != '') && (document.getElementById("propertyDiv") != null) &&
((typeof __search_filter == "object" && __search_filter.is_from_autoSuggest == "SKIP_AUTO_FILL") || 
(typeof _dtl == "object" && _dtl.is_from_autoSuggest == "SKIP_AUTO_FILL"))) 
{	
var url_str = cfgCgi + '?SID=' + cfgSID + '+FID=' + fid_generator() + "+OP=HIER_SELECT+KEEP.is_from_autoSuggest=1+FACTORY="
+ factory + "+category_sym=" + esc_hier_key + "+parent_factory=" + propFactory;
SyncAjaxJSCall(url_str);
if(typeof _dtl == "object")
_dtl.is_from_autoSuggest = true;
else
__search_filter.is_from_autoSuggest = true;	
return null;
}	
else if((typeof __search_filter == "object" && (hier_key_orig != '') && __search_filter.is_from_autoSuggest == "SKIP_AUTO_FILL") || 
(typeof _dtl == "object" && _dtl.is_from_autoSuggest == "SKIP_AUTO_FILL"))
{
if(typeof _dtl == "object")
_dtl.is_from_autoSuggest = true;
else
__search_filter.is_from_autoSuggest = true;
url += "+KEEP.HierKey=" + esc_hier_key +"+KEEP.skip_hier_fill=1";
}
else	
url += "+KEEP.HierKey=" + modified_hier_key;
if ( hier_key.length > 0 &&
typeof do_autofill != "undefined" && do_autofill ) {
var autofillUrl = url + "+OP=HIER_FILL+KEEP.Factory=" + factory;
if ( typeof argTenantId == "string" &&
cfgAccessTenantRestriction != "1" &&
typeof detailSetTenant != "undefined" )
autofillUrl += "+autofillTenant=1";
if ( initiate_autofill( autofillUrl, "0",
backfill_form,
backfill_attr, backfill_field ) )
return null;
}
}
}
if (factory == "KCAT")
{
return	do_search_popup(url+
"+OP=DISPLAY_FORM+HTMPL=list_KCAT_tree.htmpl");
}
else
{
return do_search_popup(url+
"+OP=HIER_SELECT+HTMPL=hiersel_"+factory+".htmpl");
}
}
function modify_search_extra(factory, backfill_field, backfill_form,is_3_field_contact, backfill_attr)
{
return "";
}
function popup_search(factory, backfill_field, backfill_form, extra,
is_3_field_contact, backfill_attr, callback )
{
var url = popup_search_text(factory, backfill_field, backfill_form, extra,
is_3_field_contact, backfill_attr, callback );
if(url == null)
return;
if ( initiate_autofill( url, is_3_field_contact, backfill_form,
backfill_attr, backfill_field, callback ) )
return null;
return do_search_popup( url );
}
function popup_search_text(factory, backfill_field, backfill_form, extra,
is_3_field_contact, backfill_attr, callback )
{
if (ahdframe.currentAction == ACTN_AUTOFILL && 
ahdframe.autofill_field == backfill_field)
return null;
if ( typeof backfill_field != "string" ||
typeof backfill_form != "string" ||
backfill_field.length == 0 ||
backfill_form.length == 0 )
{
alertmsg("popup_search()_was_passed_blan");
return null;
}
switch ( typeof is_3_field_contact ) {
case "boolean":
case "number":
is_3_field_contact = ( is_3_field_contact ? "1" : "0" );
break;
case "string":
is_3_field_contact = ( is_3_field_contact == "" ||
is_3_field_contact == "0" ) ? "0" : "1";
break;
default:
is_3_field_contact = "0";
}
if (factory == "OA_TABLES" && backfill_field == "QBE.IN.obj.TABLE_NAME")
backfill_field = "QBE.IN.obj";
if (factory == "OA_COLUMNS" && backfill_field == "QBE.IN.assignable_ci_attr.COLUMN_NAME")
backfill_field = "QBE.IN.assignable_ci_attr";
var url = cfgCgi +
"?SID=" + cfgSID +
"+FID=" + fid_generator() +
"+OP=SEARCH"; 
if(factory != "")
url += "+FACTORY=" + factory; 
url +="+KEEP.IsPopUp=1" +
"+KEEP.backfill_field=" + backfill_field +
"+KEEP.backfill_form=" + backfill_form +
"+KEEP.Is3FieldContact=" + is_3_field_contact; 
if (((backfill_field == "KEY.lval" || backfill_field == "KEY.rval_assoc") 
&& factory =="act_type_assoc") ||
((propFormName1 == "list") && 
(typeof __list_edit == "undefined" || !__list_edit.isVisible)))
url += "+KEEP.domset_name=MLIST_STATIC";
else if (backfill_field == "template_name" && backfill_form == "scrpadForm")
url += "+KEEP.domset_name=template_list";
else
{
/* Reverting the changes in SCO36099. David T. confirmed that the tickets are exception to the SCO36099
I am not removing the domset added by this SCO, which can be used from other functions if required.
if (factory == "cr" || factory == "pr" || 
factory == "in" || factory == "chg" || 
factory == "iss")
url += "+KEEP.domset_name=" + factory + 
"_list_web_active_only";
else */
url += "+KEEP.domset_name=RLIST_STATIC";
}
if (category_related_cnt(url))
cancel_cnt_lookup = 0;
var e;
try {
if ( cfgAccessTenantRestriction != "1" ) {
url += "+KEEP.backfillPersid=" + argPersistentID +
"+KEEP.backfillFactory=" + propFactory +
"+KEEP.objectTenant=" + 
( argGlobalTenant ? "n/a" : argTenantId ) +
"+KEEP.objectTenantName=" + encodeURIComponent(argTenant);
}
}
catch(e) {}
if (propFormName == "list_all_lr.htmpl" && backfill_field.indexOf("cntxt_obj.cnt") >= 0)
{
var cntxt_obj = searchFilterObjectOf("cntxt_obj");
if (typeof cntxt_obj == "object" && cntxt_obj != null) {
cntxt_obj.value = "";
}
}
if (propFormName == "list_all_lr.htmpl" &&
(backfill_field.indexOf("cntxt_obj") >= 0) && (backfill_field.indexOf("cntxt_obj.cnt") == -1))
{
if (backfill_field.indexOf("cntxt_obj.chg") != -1)
backfill_attr = "chg_ref_num";
else if (backfill_field.indexOf("cntxt_obj.nr") != -1)
backfill_attr = "name";
else 
backfill_attr = "ref_num";
}
if ( typeof backfill_attr == "string" && backfill_attr.length > 0 )
url += "+KEEP.backfill_attr=" + backfill_attr;
var customerid;
var ret_obj = null;
if (typeof callback == "undefined")
callback = ""; 
switch ( factory ) {
case "pcat" :
case "pcat_cr" :
case "pcat_pr" :
case "pcat_in" :
case "pcat_cr_ss" :
case "pcat_in_ss" :
ret_obj = setting_contact_in_progress(backfill_form, "customer", "requested_by");
break;
case "chgcat" :
case "chgcat_ss" :
ret_obj = setting_contact_in_progress(backfill_form, "affected_contact", "requestor");
break;
case "isscat" :
case "isscat_ss" :
ret_obj = setting_contact_in_progress(backfill_form, "requestor", "");
break;
default:
break;
}
if (ret_obj != null)
{
if (ret_obj.delay)
{
resume_cat_func = "popup_search('" + factory + "', '" + backfill_field +
"', '" + backfill_form + "', '" + extra + 
"', '" + is_3_field_contact + "', '" + backfill_attr + 
"', '" + callback + "');";
ahdframe.resumeAction = "check_cnt_from_cat();";
return null;
}
if (ret_obj.set_fld_obj != null)
{	
customerid = ret_obj.set_fld_obj.value;
url += "+SERVICE_CST=" + customerid;
}
}
switch (factory) 
{
case "crs_cr":
case "crs_in":
case "crs_pr":
case "chgstat":
case "issstat":
if (propFactory == "cr" || 
propFactory == "chg" || 
propFactory == "iss" || 
propFactory == "in" || 
propFactory == "pr")
{
if (typeof lookup_status != "undefined" || 
typeof lookup_status_sym != "undefined")
{
var tmp_fac = propFactory;
if (propFactory == "cr" && typeof requestType == "string")
{
if (requestType == "I")
tmp_fac = "in";
else 
if (requestType == "P")
tmp_fac = "pr" 
}
var tenant_val = "";
if (typeof ahdtop.cfgMultiTenancy == "string" && 
ahdtop.cfgMultiTenancy == "on")
{
if (typeof lookup_tenant_sym == "string")
tenant_val = lookup_tenant_sym;
else 
if (typeof argTenantId == "string")
tenant_val = argTenantId;
}
url += "+KEEP.backfillTicketType=" + tmp_fac + 
"+KEEP.backfillStatus=1";
if (typeof lookup_status_sym != "undefined")
{ 
url += "+KEEP.status_sym=" + nx_escape(lookup_status_sym) +
"+KEEP.tenant_sym=" + nx_escape(tenant_val);
}
else
{
url += "+KEEP.status_code=" + lookup_status +
"+KEEP.tenant_id=" + tenant_val;
}
} 
}
break;
default:
break;
}
var more_extra = modify_search_extra(factory, backfill_field, backfill_form,is_3_field_contact, backfill_attr);
if (typeof more_extra == "string")
{
extra += more_extra;
}
if ( extra.length > 0 )
{
if ( extra.indexOf("KEEP.exclude_") == -1 )
extra = extra.replace(/exclude_/,"KEEP.exclude_");
if ( extra.indexOf("KEEP.type.") == -1 )
{
extra = extra.replace(/\+type\./,"+KEEP.type.");
if ( extra.indexOf("KEEP.type.") == -1 )
extra = extra.replace(/type\./,"KEEP.type.");
}
if ( typeof cfgAnyContact == "string" &&
cfgAnyContact == "1" && extra.indexOf("KEEP.type.id=2308") < 0 )
extra = extra.replace(/KEEP.type.id=\d*\+?/, "");
}
if ( extra.length > 0 )
{
if ( extra.substr(0,1) == "+" )
url += extra;
else
url += "+" + extra;
}
return url;
}
function initiate_autofill_text(url, is_3_field_contact, backfill_form,
backfill_attr, backfill_field, callback )
{
var f = document.forms[backfill_form];
var backfill_field_org = backfill_field;
if ( typeof f != "object" )
return false;
var setfld;
if (propFormName1 == "list" || propFormName1 == "profile")
{
if ( backfill_field.match(/^KEY\.(.*)$/) )
setfld = "QBE.EQ." + RegExp.$1;
else
setfld = "QBE.EQ." + backfill_field;
}
else
{
if ( backfill_field.match(/^KEY\.(.*)$/) )
setfld = "SET." + RegExp.$1;
else
setfld = "SET." + backfill_field;
}
if (((propFormName == "detail_in.htmpl" || 
propFormName == "detail_pr.htmpl")) &&
backfill_field == "KEY.affected_service" && 
url.indexOf("KEEP.service_only") > 0 )
{
url += "+QBE.EQ.family.extension_name=entservx";
}
var str="FACTORY=nr";
if(url.search(str)!=-1 && ahdtop.cfgCI_FILTER=="Yes")
url +="+QBE.EQ.is_ci=1";	
if ( typeof f.elements[setfld] == "object" ) {
var setfld_obj = f.elements[setfld];
if ( typeof setfld_obj.value == "string" &&
setfld_obj.value.length > 0 ) {
return url;
}
} 
if( url.indexOf("KEEP.CrsqType=KPI") > 0)
url += "+QBE.NE.usage_flag=0";
if( url.indexOf("KEEP.CrsqType=Scoreboard") > 0){
url += "+ADDITIONAL_WHERE=" + nx_escape("( usage_flag = 0 OR usage_flag = 2 OR usage_flag IS NULL )");
}
if (backfill_form == "tenant_form" && backfill_field == "KEY.tenant") {
setfld = "SET.tenant";
if ( typeof document.forms["main_form"].elements[setfld] == "object" ) {
var setfld_obj = document.forms["main_form"].elements[setfld];
if ( typeof setfld_obj.value == "string" &&
setfld_obj.value.length > 0 ) {
return url;
}
}
}
if ( typeof backfill_attr == "undefined" &&
is_3_field_contact == "1" ) {
if ( backfill_field.match(/QBE\.IN\.(.*)$/) ) {
backfill_field = RegExp.$1 + "_combo_name";
backfill_attr = "QBE";
}
else {
backfill_field += "_lname";
backfill_attr = "combo_name";
}
url += "+KEEP.backfill_attr=" + backfill_attr;
}
var lookup_field_value = f.elements[backfill_field];
if ( typeof lookup_field_value == "object" && lookup_field_value.value != "" )
{
if(url.indexOf("+QBE.EQ.delete_flag=0") < 0)
{	
url += "+QBE.EQ.delete_flag=0"; 
}	
}
var auto_suggest_exact_match = 1;
if ((typeof __search_filter == "object" && __search_filter.is_from_autoSuggest != "SKIP_AUTO_FILL") ||
(typeof _dtl == "object" && _dtl.is_from_autoSuggest != "SKIP_AUTO_FILL") ||
(typeof _dtl != "object" && typeof __search_filter != "object"))
auto_suggest_exact_match = 0;
if ( typeof backfill_attr == "string" &&
backfill_attr.length != 0 ) {
var e = f.elements[backfill_field];
if ( typeof e == "object" && e != null ) {
var val = e.value;
var name_qbe = "";
if ( backfill_attr == "combo_name" ) {
backfill_attr = "last_name";
backfill_field = backfill_field.replace(/lname$/,"fname");
var e2 = f.elements[backfill_field];
if ( typeof e2 == "object" && e2 != null )
{
if ( ! auto_suggest_exact_match ) {
if (e2.value.length > 0 )
if ( e2.value.indexOf("%") == -1 )
name_qbe += "+QBE.IN.first_name=" + nx_escape(e2.value+"%");
else
name_qbe += "+QBE.IN.first_name=" + nx_escape(e2.value);
}
else {
if ( e2.value.length == 0 )
name_qbe += "+QBE.EQ.first_name=QBE_EMPTY_OR_NULL_STRING";
else
name_qbe += "+QBE.EQ.first_name=" + nx_escape(e2.value);
}
}
backfill_field = backfill_field.replace(/fname$/,"mname");
e2 = f.elements[backfill_field];
if ( typeof e2 == "object" && e2 != null )
{
if ( ! auto_suggest_exact_match ) {
if (e2.value.length > 0 )
if ( e2.value.indexOf("%") == -1 )
name_qbe += "+QBE.IN.middle_name=" + nx_escape(e2.value+"%");
else
name_qbe += "+QBE.IN.middle_name=" + nx_escape(e2.value);
}
else {
if ( e2.value.length == 0 )
name_qbe += "+QBE.EQ.middle_name=QBE_EMPTY_OR_NULL_STRING";
else
name_qbe += "+QBE.EQ.middle_name=" + nx_escape(e2.value);
}
}
if ( url.match(/KEEP\.type\.(\w+=\w+)/) )
url += "+QBE.EQ.type." + RegExp.$1;
}
else if ( backfill_attr == "QBE" && val.length > 0 ) {
var n = val.match(/^([^,]*),[ ]*([^,]*),[ ]*([^,]*)$/);
var num = 1;
if ( n == null )
{ 
n = val.split(/[, ][ ]*/,3);
num = 0;
}
if ( typeof n[num] == "string" && n[num].length > 0 )
name_qbe += "+QBE.IN.last_name=" + nx_escape(n[num]);
if ( typeof n[++num] == "string" && n[num].length > 0 )
name_qbe += "+QBE.IN.first_name=" + nx_escape(n[num]);
if ( typeof n[++num] == "string" && n[num].length > 0 )
name_qbe += "+QBE.IN.middle_name=" + nx_escape(n[num]);
val = "";
}
var val_orig = val;
if ( val.length > 0 || name_qbe.length > 0 ) {
if ( val.length > 0 ) {
if ( val.indexOf("%") == -1 )
val += "%";
if ( backfill_attr == "last_name" && val.slice(0,1) == '\\' )
url += "+QBE.IN.userid=" + nx_escape(val.slice(1));
else {
var esc_val = nx_escape(val);
var modified_val = esc_val.replace(/\+/,"%2B");
if ( ! auto_suggest_exact_match )
url += "+QBE.IN." + backfill_attr + "=" + modified_val;
else
{
url += "+QBE.EQ." + backfill_attr + "=" + nx_escape(val_orig);
if(typeof _dtl == "object")
_dtl.is_from_autoSuggest = true;
else
__search_filter.is_from_autoSuggest = true;
}	
}
}
if ( name_qbe.length > 0 )
url += name_qbe;
if ( typeof argTenantId == "string" &&
cfgAccessTenantRestriction != "1" &&
typeof detailSetTenant != "undefined" )
url += "+autofillTenant=1";
autofill = new Object();
autofill.url = url;
autofill.element = e;
autofill.form = f;
if ( typeof callback == "function" )
autofill.callback = callback;
var cb_func_name = ".popup_autofill_callback";
if (propFormName == "list_all_lr.htmpl" &&
(backfill_field.indexOf("cntxt_obj") >= 0) &&
(backfill_field.indexOf("cntxt_obj.cnt") == -1) )
cb_func_name = ".cntxt_obj_callback";
var cb_func = "javascript:parent.ahdframe" + cb_func_name;
if (window.name != ahdframe.name)
{
if (parent.name == ahdframe.name)
cb_func = "javascript:parent.ahdframe." + window.name + cb_func_name;
else
if (window.name == "scratchpad")
cb_func = "javascript:parent.ahdframe.parent.scratchpad" + cb_func_name;
else 
if(window.name.indexOf("tab")>=0)
cb_func="javascript:parent.ahdframeset.product."+window.name+cb_func_name;
else 
cb_func = "javascript:parent." + window.name + cb_func_name;
}
else if ( window.name != ahdframeset.name &&
parent.name == ahdframeset.name )
cb_func = "javascript:parent.ahdframeset." + window.name + cb_func_name;
url += "+HTMPL=" + nx_escape(cb_func);
}
}
}	
return url;
}
function initiate_autofill( url, is_3_field_contact, backfill_form,
backfill_attr, backfill_field, callback )
{
url = initiate_autofill_text(url, is_3_field_contact, backfill_form,
backfill_attr, backfill_field, callback);
var f = document.forms[backfill_form];
var backfill_field_org = backfill_field;
if ( typeof f != "object" )
return false;	
var setfld;
if (propFormName1 == "list" || propFormName1 == "profile")
{
if ( backfill_field.match(/^KEY\.(.*)$/) )
setfld = "QBE.EQ." + RegExp.$1;
else
setfld = "QBE.EQ." + backfill_field;
}
else
{
if ( backfill_field.match(/^KEY\.(.*)$/) )
setfld = "SET." + RegExp.$1;
else
setfld = "SET." + backfill_field;
}
if ( typeof backfill_attr == "undefined" &&
is_3_field_contact == "1" ) 
{
if ( backfill_field.match(/QBE\.IN\.(.*)$/) ) {
backfill_field = RegExp.$1 + "_combo_name";
backfill_attr = "QBE";
}
else 
{
backfill_field += "_lname";
backfill_attr = "combo_name";
}
}
if ( typeof f.elements[setfld] == "object" )
{
var setfld_obj = f.elements[setfld];
if ( typeof setfld_obj.value == "string" &&
setfld_obj.value.length > 0 )
return false;
} 
if (backfill_form == "tenant_form" && backfill_field == "KEY.tenant")
{
setfld = "SET.tenant";
if ( typeof document.forms["main_form"].elements[setfld] == "object" )
{
var setfld_obj = document.forms["main_form"].elements[setfld];
if ( typeof setfld_obj.value == "string" &&
setfld_obj.value.length > 0 )
return false;
}
}
if ( ahdframe.currentAction != 0 &&
backfill_field == "KEY.category" )
return true;
else if ( action_in_progress() )
return false;
if ( typeof backfill_attr == "string" &&
backfill_attr.length != 0 )
{	
var e = f.elements[backfill_field];
if ( typeof e == "object" && e != null && e.value.length > 0) 
{
if((typeof __search_filter == "object" && __search_filter.is_from_autoSuggest != true) || 
(typeof _dtl == "object" && _dtl.is_from_autoSuggest != true))
set_action_in_progress(ACTN_AUTOFILL);
else
set_action_in_progress(ACTN_COMPLETE); 
ahdframe.autofill_field = backfill_field_org; 
display_new_page(url,ahdframeset.workframe);
return true;
}
}
return false;
}
function category_related_cnt(url)
{
var ret = false;
if (typeof propFactory == "string" && 
(propFactory == "cr" || propFactory == "chg" || 
propFactory == "iss"))
{
var field_name = url;
if (url.match(/backfill_field=([^\+$]+)\+/))
field_name = RegExp.$1;
var f = document.main_form;
if (propFactory == "cr")
{
if (field_name == "customer") 
ret = true;
else
if (field_name == "requested_by" && typeof f == "object" &&
typeof f.customer_combo_name == "object" && 
typeof cus_value == "string" && 
(f.customer_combo_name.value == cus_value || 
f.customer_combo_name.value == ""))
ret = true;
}
if (propFactory == "chg")
{
if (field_name == "affected_contact") 
ret = true;
else
if (field_name == "requestor" && typeof f == "object" &&
typeof f.affected_contact_combo_name == "object" && 
typeof aff_cnt_value == "string" && 
(f.affected_contact_combo_name.value == aff_cnt_value || 
f.affected_contact_combo_name.value == ""))
ret = true;	
}
if (propFactory == "iss" && field_name == "requestor")
ret = true;
}
return ret; 
}
function do_search_popup( url )
{
var features = "directories=no" +
",location=no" +
",menubar=no" +
",status=no"+
",height=" + popupHeight(MEDIUM_POPUP) +
",width=" + popupWidth(MEDIUM_POPUP);
url += "+popupType=" + MEDIUM_POPUP;
var name = "";
if (category_related_cnt(url))
cancel_cnt_lookup = 1;
var search_window = preparePopup(url, name, features, -1);
return search_window;
}
function cntxt_obj_callback( persid, value, rel_attr_val, 
tenantId, tenantName )
{
if ( typeof autofill == "object" ) 
{
if ( typeof persid != "string" )
{
ahdframe.resumeAction = "";
do_search_popup( autofill.url );
}
else 
{
var e, f;
autofill.element.value = value;
var factory = persid.substr(0, persid.indexOf(":"));
f = autofill.form;
e = f.elements["QBE.IN.cntxt_obj"];
if (e != null) 
e.value = persid; 
if ( typeof tenantId == "string" &&
typeof detailSetTenant != "undefined" )
detailSetTenant(autofill.element.name, tenantId, tenantName);
}
}
set_action_in_progress(ACTN_COMPLETE);
}
function popup_autofill_callback( persid, value, rel_attr_val, 
tenantId, tenantName )
{
if ( typeof autofill == "object" ) {
if ( typeof persid != "string" )
{
if (typeof ahdframe.resumeAction == "string" && 
ahdframe.resumeAction == "check_cnt_from_cat();")
alertmsg("Specify_a_valid_Affected_End_User_first"); 
ahdframe.resumeAction = "";
do_search_popup( autofill.url );
}
else {
var e, is_contact;
var name = autofill.element.name;
if ( ! name.match(/^(.*)_lname$/) ) {
is_contact = false;
autofill.element.value = value;
if ( name.match(/^QBE\.\IN\.(.*)\.\w+$/) ) {
e = autofill.form.elements["QBE.EQ." + RegExp.$1];
if ( e != null )
e.value = rel_attr_val;
}
}
else {
is_contact = true;
name = RegExp.$1;
e = autofill.form.elements[name + "_combo_name"];
if ( e != null )
e.value = value;
e = autofill.form.elements["QBE.EQ." + name];
if ( e != null )
e.value = rel_attr_val;
if (name == "group")
{
autofill.element.value = value;
}
else
{
var v = value.match(/^([^,]*),[ ]*([^,]*),[ ]*([^,]*)$/);
var num = 1;
if (v == null)
{ 
v = value.split(/[,][ ]*/);
num = 0;
}
autofill.element.value = v[num];
num++;
e = autofill.form.elements[name + "_fname"];
if ( typeof e == "object" && e != null )
e.value = (typeof v[num] == "string") ? v[num] : "";
num++;
e = autofill.form.elements[name + "_mname"];
if ( typeof e == "object" && e != null )
e.value = (typeof v[num] == "string") ? v[num] : "";
}
}
var e, f = autofill.form;
e = f.elements[name + "_persid"];
if ( e == "object" )
e.value = persid;
else {
if ( name.match(/KEY.(.*)/) )
e = f.elements["SET." + RegExp.$1];
else
e = f.elements["SET." + name];
if ( typeof e == "object" )
{ 
e.value = rel_attr_val;
if ((propFactory == "cr" || propFactory == "chg" || 
propFactory == "iss") && (RegExp.$1 == "status") &&
(typeof set_required_flds != "undefined"))
{
set_required_flds(rel_attr_val);	
}	
}
}
if ( typeof autofill.callback == "function" )
autofill.callback();
if ( is_contact ) {
if ( typeof backfill_cnt_event != "undefined" )
backfill_cnt_event( f.name, name,
f.elements[name+"_lname"].value,
f.elements[name+"_fname"].value,
f.elements[name+"_mname"].value,
rel_attr_val, "autofill",
tenantId, tenantName );
}
else {
if ( typeof backfill_event != "undefined" )
backfill_event( f, name, value, persid,
rel_attr_val, "autofill",
tenantId, tenantName );
}
if ( typeof detailSetTenant != "undefined" ) {
if ( name == "KEY.tenant" )
detailSetTenant(name, rel_attr_val, value);
else if ( typeof tenantId == "string" )
detailSetTenant(name, tenantId, tenantName);
}
}
autofill = void(0);
}
set_action_in_progress(ACTN_COMPLETE);
}
function search_alg(in_form, in_persid) {
if ( in_persid.match(/(\w*):(\w*)/) ) {
var fac = RegExp.$1;
var id = RegExp.$2;
var algfac = ( fac == "cr" ? "alg" : fac + "alg" );
var url = cfgCgi + "?SID=" + cfgSID + "+FID=" + fid_generator() +
"+OP=SEARCH+FACTORY=" + algfac + "+KEEP.IsPopUp=1" +
"+RO_HTMPL=detail_" + fac + "_ro.htmpl" +
"+NEXT_PERSID=" + nx_escape(in_persid) +
"+KEEP." + fac + "_id=" +
( fac == "chg" ? id : nx_escape(in_persid) );
var features = "directories=no" +
",location=no" +
",menubar=no" +
",status=no";
var alg_search = preparePopup(url, "" , features);
alg_search.focus();
}
}
function search_issalg(in_form, in_iss_persid) {
var iss_num = in_iss_persid.substr(in_iss_persid.indexOf(":") + 1);
var query_string = cfgCgi + "?SID=" + cfgSID + "+FID=" + fid_generator() +
"+OP=SEARCH+FACTORY=issalg+KEEP.IsPopUp=1+RO_HTMPL=detail_iss_ro.htmpl+NEXT_PERSID=" + "iss" + "%3A" + iss_num;
query_string += "+KEEP.iss_id=" + in_iss_persid;
var issalg_search = preparePopup(query_string, "search_issalg",
"width=850,height=600,scrollbars,resizable,menubar,location,status,toolbar");
issalg_search.focus();
}
function search_chgalg(in_form, in_chg_persid) {
var chg_num = in_chg_persid.substr(in_chg_persid.indexOf(":") + 1);
var query_string = cfgCgi + "?SID=" + cfgSID + "+FID=" + fid_generator() +
"+OP=SEARCH+FACTORY=chgalg+KEEP.IsPopUp=1+RO_HTMPL=detail_chg_ro.htmpl+NEXT_PERSID=" + "chg" + "%3A" + chg_num;
var a_str = new String(in_chg_persid);
var obj_arr = a_str.split(":");
query_string += "+KEEP.chg_id=" + obj_arr[1];
var chgalg_search = preparePopup(query_string, "search_chgalg",
"width=850,height=600,scrollbars,resizable,menubar,location,status,toolbar");
chgalg_search.focus();
}
function check_parent(parent_obj, ref_num, org_ref_num)
{
if (parent_obj.value == ref_num)
{
parent_obj.value=org_ref_num;
alertmsg("Parent_request_can_not_be_the_");
}
}
function showDetailForm(sid, fid, factory, op)
{
var url = cfgCgi +
"?SID=" + cfgSID +
"+FID=" + fid.toString() +
"+FACTORY=" + factory +
"+OP=" + op +
"+KEEP.IsPopUp=1";
var features = "directories=no" +
",location=no" +
",menubar=no" +
",status=no";
preparePopup(url, "" , features);
return true;
}
function showDetail(persid, op)
{
var factory = persid.substr(0, persid.indexOf(":"));
var num = persid.substr(persid.indexOf(":") + 1);
if (op == void(0)) op = "SHOW_DETAIL";
var url = cfgCgi +
"?SID=" + cfgSID +
"+FID=" + fid_generator().toString() +
"+OP=" + op +
"+FACTORY=" + factory +
"+PERSID=" + factory + "%3A" + num;
var features = "directories=no" +
",location=no" +
",menubar=no" +
",status=no";
preparePopup(url, "", features);
}
function showEdit(PersId, fid, bHideMenuAndLogo, sAdditionalUrl, bOptOpeninNewWindow)
{
var bOpeninNewWindow = false;
if ( typeof bOptOpeninNewWindow == "boolean" ){
bOpeninNewWindow = bOptOpeninNewWindow
}
var factory = PersId.substr(0, PersId.indexOf(":"));
var num = PersId.substr(PersId.indexOf(":") + 1);
var url = cfgCgi +
"?SID=" + cfgSID +
"+FID=" + fid_generator().toString() +
"+OP=UPDATE" +
"+FACTORY=" + factory +
"+PERSID=" + nx_escape(PersId);
if(typeof bHideMenuAndLogo != "undefined" && bHideMenuAndLogo && typeof sAdditionalUrl != "undefined" && sAdditionalUrl != "" )
switchToDetail(PersId,0,false,void(0),url, bHideMenuAndLogo, sAdditionalUrl, void(0),void(0), bOpeninNewWindow);
else if(typeof bHideMenuAndLogo != "undefined" && bHideMenuAndLogo)
switchToDetail(PersId,0,false,void(0),url, bHideMenuAndLogo, void(0), void(0), void(0), bOpeninNewWindow);
else if	(typeof sAdditionalUrl != "undefined" && sAdditionalUrl != "" )
switchToDetail(PersId,0,false,void(0),url, undefined, sAdditionalUrl, void(0), void(0), bOpeninNewWindow);
else
switchToDetail(PersId,0,false,void(0),url, undefined, void(0), void(0), void(0), bOpeninNewWindow);
}
function create_new( factory, use_template, width, height)
{
var name = "";
if ( typeof factory == "string" && factory == "all_fmgrp") {
factory = "fmgrp";
}
if (typeof factory == "string" && (factory =="crs_cr" || factory =="crs_in" || factory=="crs_pr"))
{
factory = "crs";	
}
if (typeof factory == "string" && (factory =="act_type_assoc_all"))
{
factory = "act_type_assoc";
}
var url = cfgCgi +
"?SID=" + cfgSID +
"+FID=" + fid_generator() +
"+OP=CREATE_NEW" +
"+FACTORY=" + factory +
"+KEEP.IsPopUp=1";
if (factory == "cr" && typeof use_template != "string" && use_template)
url += "+ADDITIONAL_WHERE=" + nx_escape("( type = 'R' OR type='' OR type IS NULL )");
if (factory == "in" && typeof use_template != "string" && use_template)
url += "+ADDITIONAL_WHERE=" + nx_escape("type = 'I'");
if (factory == "pr" && typeof use_template != "string" && use_template)
url += "+ADDITIONAL_WHERE=" + nx_escape("type = 'P'");	
if ( typeof use_template == "string" && use_template.indexOf(":") > 0 )
url += "+use_template=1+PERSID=" + use_template;
else if ( typeof use_template != "string" && use_template )
if ( factory == "ldap" )
url += "+use_template=1";
else
url += "+use_template=1+KEEP.domset_name=template_list" +
"+QBE.EQ.template_name.delete_flag=0";
if ( typeof argKeepTenantWc == "string" && argKeepTenantWc != "")
url+="+KEEP.tenantWc="+argKeepTenantWc;

for ( var i = 4; i < arguments.length; i++ )
	url += "+" + nx_escape(arguments[i]).replace(/%3D/i,"=").replace(/\+/g,"%2b");
var newwin = preparePopup( url, name, "", width, height);
}
function popup_window(name, form, width, height, features)
{
var url = "";
if ( form.match(/^[\w\/]*\.html$/) || form.match(/^[\w\/]*\.asp$/) )
url = cfgCAISD + "/" + form;
else if ( form.match(/^\w*:/) )
url = form;
else {
url = cfgCgi +
"?SID=" + cfgSID +
"+FID=" + fid_generator();
for ( var i = 5; i < arguments.length; i++ )
url += "+" + nx_escape(arguments[i]).replace(/%3D/i,"=");
if ( form.match(/\.htmpl/) )
url += "+OP=DISPLAY_FORM+HTMPL=" + form;
else if ( ! form.match(/\+/) )
url += "+OP=" + form;
else {
var my_args = form.split(/\+/);
for ( i = 0; i < my_args.length; i++ )
url += "+" + nx_escape(my_args[i]).replace(/%3D/i,"=");
}
if (url.indexOf("KEEP.IsPopUp") == -1)
url += "+KEEP.IsPopUp=1";
}
if ( typeof features != "string" )
features = "";
var w;
var modal = false;
if ( features.indexOf("ahdmenu=no") == -1 ) {
var frame_args = "";
if ( features.indexOf("topsplash=no") >= 0 )
frame_args = "TOP_SPLASH=no";
if ( features.indexOf("forcescroll=yes") >= 0 ) {
if (frame_args == "")
frame_args = "FORCESCROLL=yes";
else
frame_args = frame_args + "+FORCESCROLL=yes";
}
if ( features.indexOf("menubar=no") >= 0 ) {
if (frame_args == "")
frame_args = "MENUBAR=no";
else
frame_args = frame_args + "+MENUBAR=no";
}
if ( features.indexOf("gobutton=no") >= 0 ) {
if (frame_args == "")
frame_args = "GOBUTTON=no";
else
frame_args = frame_args + "+GOBUTTON=no";
}
if ( features.indexOf("welcomebanner=no") >= 0 ) {
if (frame_args == "")
frame_args = "WELCOMEBANNER=no";
else
frame_args = frame_args + "+WELCOMEBANNER=no";
}
w = preparePopup(url,name,features,width,height,frame_args);
}
else
{
if ( typeof width != "number" || width < 150 )
width = popupWidth(LARGE_POPUP);
if ( typeof width != "number" ||
typeof height != "number" ||
height < 150 )
height = popupHeight(LARGE_POPUP);
if ( typeof features != "string" )
if (cfgAllowPopupResize)
features += ",resizable=yes";
else
features += ",resizable=no";
else if ( features.match(/^(.*)modal=yes(.*)$/) ) {
features = RegExp.$1 + "resizable=no" + RegExp.$2;
if ( _browser.isIE55 )
modal = true;
}
if ( form == 'help_about.htmpl' )
{
height = 360;
width = 1100;
if ( features.indexOf("scrollbars") == -1 )
features += ",scrollbars=no";
if ( features.indexOf("resizable") == -1 )
features += ",resizable=no";
var hasNoScrollbar = features.indexOf("scrollbars=no");
if ( hasNoScrollbar != -1 && ahdtop.cstUsingScreenReader) {
features = features.replace("scrollbars=no", "scrollbars=yes");
}
}
if ( features.indexOf("scrollbars") == -1 )
features += ",scrollbars=yes";
if ( features.indexOf("height") == -1 )
features += ",height=" + height;
if ( features.indexOf("width") == -1 )
features += ",width=" + width;
if ( _browser.isNS )
features = features.replace(/ahdmenu=no/,"screenX=10,screenY=10");
else
features = features.replace(/ahdmenu=no/,"left=10,top=10");
if ( features.substr(0,1) == "," )
features = features.substr(1,features.length-1);
var noregister = features.indexOf("register=no");
if ( noregister != -1 ) {
features = features.replace(/,register=no/,"");
features = features.replace(/register=no,/,"");
features = features.replace(/register=no/,"");
}
var w_name = name;
if (name.length > 0)
w_name = get_popup_window_name(name);
url += "+KEEP.POPUP_NAME=" + w_name + "+popupType=" + LARGE_POPUP;
if ( modal )
{
var ret = window.showModalDialog( url, w_name, features);
if (url.indexOf("help_about.htmpl") != -1 &&
ret == "session_timeout")
{
if ( typeof ahdtop != "object" || ahdtop == null )
document.location.href = cfgCgi;
else
{
alertmsg("Sorry,_your_session_has_timed_", msgtext("Press_OK_to_close_all_%1_windo", cfgProductName) );
ahdtop.session_timeout(cfgSID);
}
}
}
else
{
if ( ahdtop.propDebugOptions != "" )
features = modifyWindowFeaturesForDebug(features);
w = window.open( url, "", features);
if ( typeof w == "object" && w != null )
{
w.name = w_name;
if ( noregister == -1 )
register_window(w);
w.focus();
}
else 
check_popup_blocker(w);
}
}
}
function popunder_window(form, popunder_callback)
{
var url = "";
if ( form.match(/^[\w\/]*\.html$/) || form.match(/^[\w\/]*\.asp$/) )
url = cfgCAISD + "/" + form;
else if ( form.match(/^\w*:/) )
url = form;
else {
url = cfgCgi +
"?SID=" + cfgSID +
"+FID=" + fid_generator() +
"+KEEP.IsPopUp=1";
for ( var i = 1; i < arguments.length - 1; i++ )
url += "+" + nx_escape(arguments[i]).replace(/%3D/i,"=");
if ( form.match(/\.htmpl/) )
url += "+OP=DISPLAY_FORM+HTMPL=" + form;
else if ( ! form.match(/\+/) )
url += "+OP=" + form;
else {
var my_args = form.split(/\+/);
for ( i = 0; i < my_args.length; i++ )
url += "+" + nx_escape(my_args[i]).replace(/%3D/i,"=");
}
}
if(typeof popunder_callback == "object" ||
typeof popunder_callback == "function")
callbackfunc = popunder_callback;
var w = preparePopup(url,"popunder");
return w;
}
function cancel_update(factory, argID, next_persid, to_htmpl, replace)
{
if ( typeof action_in_progress == "function" ) {
if ( action_in_progress() && curr_form_action != 0 )
return;
}
if ((typeof ahdtop == "object") && (ahdtop != null))
{
if ( typeof ahdtop.wspReplaceAllDone == "boolean" &&
ahdtop.wspReplaceAllDone ) {
alertmsg("Operation_suppressed_in_WSP_pr");
return;
}
if ( typeof ahdtop.close_edit_window == "object" &&
ahdtop.close_edit_window.edit_windows.length > 0 &&
typeof parent.name == "string" )
{
var edit_windows = ahdtop.close_edit_window.edit_windows;
for(var i = 0; i < edit_windows.length; i++)
{
if (edit_windows[i].closed)
continue;
if (parent.name == edit_windows[i].name)
{
next_persid = "";
argID = 0;
to_htmpl = "cancel.htmpl";
break;
}
}
}
}
if ( typeof action_in_progress == "function" ) {
set_action_in_progress(ACTN_CANCEL);
}
var url = cfgCgi +
"?SID=" + cfgSID +
"+FID=" + cfgFID +
"+OP=CANCEL+FACTORY=" + factory;
if ( factory == "cr" ||
factory == "chg" ||
factory == "iss" )
{
var attmntlist = window.document.getElementById("NEW_ATTMNTS");
if ( typeof attmntlist == "object" &&
attmntlist != null &&
attmntlist.value.indexOf("@@") != -1)
{
url += "+NEW_ATTMNTS=" + attmntlist.value;
}
}
if (next_persid == "")
{
if ( argID.length > 0 && argID != "0" )
{
url += "+SET.id=" + argID;
if (((typeof RefreshCnote == "number") && (RefreshCnote == 1)) || 
((typeof propFormRelease == "undefined" || propFormRelease < 60) &&
(typeof cfgUserType == "undefined" || cfgUserType == "analyst") &&
(propFormName == "detail_alg_edit.htmpl" ||
propFormName == "xfer_esc_cr.htmpl" ||
propFormName == "request_status_change.htmpl" ||
propFormName == "cr_attach_chg.htmpl" ||
propFormName == "cr_detach_chg.htmpl" ||
propFormName == "detail_chgalg_edit.htmpl" ||
propFormName == "xfer_esc_chg.htmpl" ||
propFormName == "order_status_change.htmpl" ||
propFormName == "nf.htmpl")))
{
url += "+HTMPL=cancel.htmpl";
}
}
else
{
var htmpl = "+HTMPL=";
if ( typeof to_htmpl == "string" )
htmpl += to_htmpl;
else if ( ahdframeset != ahdtop )
htmpl += "cancel.htmpl";
else
{
if (typeof ahdtop.toolbarCurrentTab == "object" && ahdtop.toolbarTab[ahdtop.toolbarCurrentTab].code == "co_sched")
htmpl += "list_chgsched.htmpl";
else
htmpl += "bin_form_np.htmpl";
}
url += htmpl;
}
}
else if ( next_persid.match(/\.htmpl$/) )
url += "+HTMPL=" + next_persid;
if ( typeof propFormName == "string" &&
propFormName.match("zdetail") &&
url.indexOf("HTMPL") == -1 )
url += "+HTMPL=" + propFormName;
if ( typeof replace == "undefined" || ! replace )
display_new_page(url);
else
replace_page(url);
}
function f_cancel_update(frame,factory, argID, next_persid)
{
if ( action_in_progress() && ahdframe.currentAction != 0 )
return;
set_action_in_progress(ACTN_CANCEL);
var url = cfgCgi +
"?SID=" + cfgSID +
"+FID=" + cfgFID +
"+OP=CANCEL+FACTORY=" + factory;
if ( factory == "cr" ||
factory == "chg" ||
factory == "iss" )
{
var attmntlist = window.document.getElementById("NEW_ATTMNTS");
if ( typeof attmntlist == "object" &&
attmntlist != null &&
attmntlist.value.indexOf("@@") != -1)
{
url += "+NEW_ATTMNTS=" + attmntlist.value;
}
}
if (next_persid == "")
{
if ( typeof window.frames[frame].HTMPL == "object" &&
window.frames[frame].HTMPL.value.length)
url += "+HTMPL="+window.frames[frame].HTMPL.value;
else if ( argID.length > 0 && argID != "0" )
url += "+SET.id=" + argID;
else if ( ahdframeset != ahdtop )
url += "+HTMPL=cancel.htmpl";
else
url += "+HTMPL=bin_form_np.htmpl";
}
display_new_page(url);
}
function showDetailWithPersidKeep(persid, keep_name, keep_info)
{
var url = cfgCgi +
"?SID=" + cfgSID +
"+FID=" + cfgFID +
"+OP=SHOW_DETAIL" +
"+PERSID=" + persid +
"+KEEP."+keep_name+"="+keep_info;
var features = "directories=no" +
",location=no" +
",menubar=no" +
",status=no";
var w = preparePopup(url, "", features);
}
function showDetailWithPersid( persid )
{
var url = cfgCgi +
"?SID=" + cfgSID +
"+FID=" + cfgFID +
"+OP=SHOW_DETAIL" +
"+PERSID=" + nx_escape(persid);
switchToDetail(persid,0,false,void(0),url);
}
function help_on_form(form_name)
{
var interface_type = 0;
var help_info;
var interface_url;
var context_url;
if (cfgGuestUser == 1)	interface_type = 10;
else 
if (cfgUserType == "employee") interface_type = 1;
else
if (cfgUserType == "customer") interface_type = 2;
else
if (cfgUserType == "analyst") interface_type = 3;
interface_url = "INTERFACE_TYPE=" + interface_type;
if (typeof form_name == "string" && form_name != "")
{
context_url = "FORM_HELP=" + form_name;
} else {
context_url = "INITIAL=NOP";
}
ahdtop.upd_workframe("HELP_ON_FORM", 
interface_url,
context_url,
"callback_func=parent.ahdframe.launch_help_in_context"); 
}
function launch_help_in_context(help_prefix, help_context)
{
next_workframe("UPD_WORKFRAME");
if (typeof help_prefix != "string" || help_prefix == "")
{
alertmsg("Unable_to_display_help");
}
var help_url = cfgCAISD + "/help/web/SDHelp_index.htm?" + help_prefix;
if (typeof help_context == "string" && help_context != "")
{
help_url += "?" + help_context;
}
if ( typeof ahdtop.AHD_Windows["help"] == "object" && ahdtop.AHD_Windows["help"] != null &&
! ahdtop.AHD_Windows["help"].closed ) {
var w = ahdtop.AHD_Windows["help"];
w.document.location.href = help_url;
_w_help = w;
window.setTimeout("w_help_focus()", 10);
return;
}
window.setTimeout("_w_open_help('" + help_url + "')", 10);
}
function _w_open_help(initial_help)
{
var features = "resizable=yes,menubar=yes,toolbar=yes,scrollbars=yes" +
",height=" + popupHeight(MEDIUM_POPUP) +
",width=" + popupWidth(MEDIUM_POPUP);
if (_browser.isIE70)
features += ",location=yes"; 
var w = window.open(initial_help,"",features);
if (!check_popup_blocker(w))
return;
if ( typeof ahdtop.AHD_Windows == "object" )
ahdtop.AHD_Windows["help"] = w;
}
var _w_help = null;
function w_help_focus()
{
if (typeof _w_help == "object" && _w_help != null)
{
_w_help.focus();
}
}
function load_options_help(option_name)
{
help_on_form(option_name + "_index.html");
}
function showLog(logPersid, agtName) {
var keeps = "KEEP.AnalystName=" + agtName;
if (_dtl.edit) {
var pri = findIt(document.main_form,"SET.priority");
var sev = findIt(document.main_form,"SET.severity");
var urg = findIt(document.main_form,"SET.urgency");
var imp = findIt(document.main_form,"SET.impact");
if (null != pri)
keeps += "+KEEP.pri_enum="+pri;
if (null != sev)
keeps += "+KEEP.sev_enum="+sev;
if (null != urg)
keeps += "+KEEP.urg_enum="+urg;
if (null != imp)
keeps += "+KEEP.imp_enum="+imp;
}
showDetailWithPersidExtra(logPersid, keeps);
}
function showDetailWithPersidExtra(persid, extraURL)
{
var url = cfgCgi +
"?SID=" + cfgSID +
"+FID=" + cfgFID +
"+OP=SHOW_DETAIL" +
"+PERSID=" + persid;
if (typeof extraURL == "string" && extraURL.length > 0) {
url += "+" + extraURL
}
var features = "directories=no" +
",location=no" +
",menubar=no" +
",status=no";
var w = preparePopup(url, "", features);
}
function popupWithURL (url, is_external, is_eSupport, suppressMenuAndLogo, pForcePopup)
{
var features = "";
if (typeof is_eSupport == "undefined" ||
is_eSupport != 1)
{
features = "directories=no" +
",location=no" +
",status=no";
if (typeof is_external != "undefined" && is_external == 1 )
features += ",toolbar=yes,menubar=yes";
else
features += ",toolbar=no,menubar=no";
}
else
{
features = "directories=yes" +
",location=yes" +
",menubar=yes" +
",toolbar=yes" +
",status=yes" +
",resizable=yes";
}
var w = null;
if ( typeof is_external == "undefined" || is_external != 1 )
{
if ( typeof suppressMenuAndLogo == "undefined" || suppressMenuAndLogo != 1 )
{
w = preparePopup(url, "", features, undefined, undefined, undefined, pForcePopup);
}
else
{
w = preparePopup(url, "", features, undefined, undefined, 'TOP_SPLASH=no+MENUBAR=no', pForcePopup);
}
}
else
{
if (typeof is_eSupport == "undefined" ||
is_eSupport != 1)
{
features += ",height=" + popupHeight(LARGE_POPUP) +
",width=" + popupWidth(LARGE_POPUP) +
",scrollbars=yes";
}
else
{
features +=	",scrollbars=yes";
}
if ( ahdtop.propDebugOptions != "" )
features = modifyWindowFeaturesForDebug(features);
w = window.open(url, "", features, true);
if ( typeof w == "object" && w != null )
{
if (!w.closed)
{
try
{
w.focus();
}
catch (e)
{
w.close();
}
}
}
else 
if (!check_popup_blocker(w))
return;
}
if ((typeof attmnt_child_wins != "undefined") &&
(url.indexOf("FACTORY=attmnt") >= 0))
attmnt_child_wins[attmnt_child_wins.length] = w;
}
function popupGraphWindow(url, win_name, width, is_update)
{
if (!is_update)
{
if ((screen.width - 30) < width)
width = screen.width - 30;
if (width < 450)
width = 450;
}
var features = "directories=no" +
",location=no" +
",menubar=no" +
",scrollbars=yes" +
",status=no";
if (cfgAllowPopupResize)
features+=",resizable=yes";
else
features+=",resizable=no";
if (!is_update)
features +=",height=" + 700 + ",width=" + 850;
if ( _browser.isNS )
features += ",screenX=10,screenY=10";
else
features += ",left=10,top=10";
var w_name = win_name;
if (win_name.length > 0)
w_name = get_popup_window_name(win_name);
if ( ahdtop.propDebugOptions != "" )
features = modifyWindowFeaturesForDebug(features);
var w = window.open(url, "", features);
if (!check_popup_blocker(w))
return;
w.name = w_name;
register_window(w);
w.focus();
}
function popupCiWindow( win_name, form_name, extraJS, featureSet)
{
if ( action_in_progress() && ahdframe.currentAction != 0 )
return;
if (typeof featureSet == "undefined")
featureSet = 0;
var IWidth = Math.min(window.screen.availWidth, 850);
var IHeight = window.screen.availHeight * .90;
var ILeft=(window.screen.availWidth-IWidth)/2;
var ITop = window.screen.availHeight * .03;
if (1 == featureSet) {
IHeight = window.screen.availHeight * .75;
}
var features="directory=0";
features+=",width="+IWidth;
features+=",height="+IHeight;
features+=",left="+ILeft;
features+=",top="+ITop;
features+=",resizable=yes";
features+=",location=0";
if (1 == featureSet) {
features+=",menubar=1";
features+=",toolbar=1";
features+=",status=1";
features+=",scrollbars=yes";
} else {
features+=",menubar=0";
features+=",toolbar=0";
features+=",status=0";
}
if ( form_name != "no" ) {
var url;
if ( ! form_name.match(/BOPSID=/) )
url = cfgCAISD + "/html/empty.html";
else
url = ahdtop.propUrlCi + "?ACTION=AHD_CI_SEARCH&" + form_name;
if ( ahdtop.propDebugOptions != "" )
features = modifyWindowFeaturesForDebug(features);
var w = window.open(url, "", features);
if (!check_popup_blocker(w))
return;
w.name = win_name;
w.focus();
form_name = "";
}
if ( typeof form_name == "string" && form_name.length > 0 ) {
upd_workframe( "LINK_WITH_BOPSID",
"URL=javascript:parent." + ahdframe.name + ".post_external('" + form_name + "','%bopsid');" + extraJS,
"FORM=" + form_name );
}
}
function getEditWindows(persid)
{
var edit_windows = new Array();
if ( typeof ahdtop == "object" &&
ahdtop != null &&
! ahdtop.closed &&
! ahdtop.parent.closed ) {
for ( var name in ahdtop.AHD_Windows )
{
var w;
try
{
w = ahdtop.AHD_Windows[name];
}
catch (e)
{
w = null;
}
if ( typeof w == "object" && w != null &&
typeof w.name == "string" &&
! w.closed &&
w.name != window.ahdframeset.name ) {
if ( typeof w.ahdframe != "undefined" &&
typeof w.ahdframe.argPersistentID == "string" &&
w.ahdframe.argPersistentID == persid &&
typeof w.ahdframe._dtl == "object" &&
typeof w.ahdframe._dtl.edit == "boolean" &&
w.ahdframe._dtl.edit )
edit_windows[edit_windows.length] = w.ahdframe;
}
}
if (ahdtop.cstReducePopups) {	
if ( typeof ahdtop.detailForms != "undefined" &&
typeof ahdtop.detailForms[persid] == "object" ){
var d = ahdtop.detailForms[persid];
if( typeof d.ahdframe != "undefined" &&
typeof d.ahdframe._dtl == "object" &&
typeof d.ahdframe._dtl.edit == "boolean" && 
d.ahdframe._dtl.edit )
edit_windows[edit_windows.length] = ahdtop.detailForms[persid].ahdframe;
}
}
}
return edit_windows;
}
function popupActivityWithURL (url, actWinName, persid)
{
if ( ahdtop.cstReducePopups &&
parent.name == "AHDtop" ) {
var returnURL = document.URL;
if ( returnURL.indexOf("?") != -1 &&
! returnURL.match(/OP=(CANCEL|DELETE|UPDATE)/) )
ahdframeset.top_splash.returnURL = returnURL;
}
if ( typeof window._dtl == "object" ) {
if ( typeof actWinName == "string" &&
( actWinName == "chg" ||
actWinName == "status" ||
actWinName == "soln"
) )
_dtl.tabReloadOnSave = "";
else
_dtl.tabReloadOnSave = "alg";
}
if ( typeof actWinName == "string" && actWinName.length > 0 ) {
if ( typeof persid != "string" ||
persid.length == 0 )
persid = window.argPersistentID;
var edit_windows = getEditWindows(persid);
for ( var i = 0; i < edit_windows.length; i++ ) {
var w = edit_windows[i];
if ( typeof w.parent.actWinName == "string" &&
w.parent.actWinName == actWinName ) {
if ( actWinName == "xfer" &&
url.indexOf("=ESC") != -1 &&
typeof w.switch_to_escalate != "undefined" )
w.switch_to_escalate();
w.parent.focus();
if ( typeof w.detailTabOff != "undefined" )
w.detailTabOff();
return;
}
}
}
var features = "directories=no" +
",location=no" +
",menubar=no" +
",status=no"+
",height=" + popupHeight(MEDIUM_POPUP) +
",width=" + popupWidth(MEDIUM_POPUP);
url += "+popupType=" + MEDIUM_POPUP;
if ( typeof actWinName == "string" && actWinName.length > 0 )
url += "+actWinName=" + actWinName;
if ((actWinName == "status" || actWinName == "soln") && (typeof _dtl != "undefined") && 
(_dtl.id == 0))
{
url += "+NEW_TICKET=1"; 
}
w = preparePopup(url, "", features,0,0,"KEEP.AHD_menu=No");
if ( (typeof attmnt_child_wins != "undefined") &&
(url.indexOf("FACTORY=attmnt") >= 0) )
attmnt_child_wins[attmnt_child_wins.length] = w;
}
var ams_url = null;
var ams_win_arr = new Array(); 
function invoke_ams_asset(base_url, relAttr)
{
if (typeof relAttr != "undefined" && relAttr.length > 0) 
var id=relAttr; 
else
var id=ahdframe.argID;
var url=base_url+
"/AMS/login.do?UUID="+id+
"&Action_Code=ACTION_ASSET"+
"&Display_Tabs=3"+
"&Display_Links=6" +
"&DSM_Asset_Context=1";
window.focus();
ams_url = url;
window.setTimeout("popup_ams_win()", 500);
}
function popup_ams_win()
{
if (ams_url != null)
{
var features="width=800,height=600,scrollbars,resizable,menubar=no,location=no,status=no,toolbar=no,gobutton=no";
var w = window.open(ams_url, "", features);
if (!check_popup_blocker(w))
return;
ams_win_arr[ams_win_arr.length] = w;
ams_url = null;
}
}
function launchSDURL(host, userid)
{
var url = host + "html/web_dm_login.html?USERID=";
var w = window.open(url, "", "width=850,height=600,location");
check_popup_blocker(w);
}
function launchUAMURL(host)
{
var url = host;
var w = window.open(url, "launch_apm_hierarchy", "width=850,height=600,scrollbars,resizable,menubar,location,status,toolbar");
w.focus();
check_popup_blocker(w);
}
function alg_integration(persid,alg_preset,itg_url)
{
var factory=persid.substr(0,persid.indexOf(":"));
var num=persid.substr(persid.indexOf(":")+1);
var url=cfgCgi+
"?SID="+cfgSID+
"+FID="+fid_generator().toString()+
"+OP=SHOW_DETAIL"+
"+FACTORY="+factory+
"+HTMPL=detail_"+factory+"_ro.htmpl"+
"+PERSID="+factory+"%3A"+num;
url+="+CREATE_ALG="+"ITGL";
url+="+ALG_PRESET="+alg_preset;
url+="+itg_url_name="+itg_url;
display_new_page(url);
return;
}
function launchRCO(host,preset,persid)
{
var alg_preset = preset + "@@time_spent:00:00:00";
alg_integration(persid,alg_preset,host);
}
function popAuditTrail(audOwner, linkID) {
if (audOwner == "NLS_FAQ") {
popup_window('','LINK_WITH_BOPSID', 0, 0, 'ahdmenu=no,register=no','URL=%CI?BOPSID=%bopsid&ACTION=AHD_KT_AUDIT_TRAIL&ID=' + linkID);
} else {
alertmsg("No_owning_application_specifie");
}
}
function make_copy(persid_override)
{
if (typeof ahdframe._dtl != "object") return;
var persid;
if (typeof persid_override == "string" && persid_override.length > 0)
persid = persid_override;
else
persid = ahdframe.argPersistentID;
var factory = persid.substr(0,persid.indexOf(":"));
var method;
if(factory=="cr" && ahdframe._dtl.edit==true)
{
alertmsg("Save_updates_before_making_cop");
return;
}
switch(factory)
{
case "arcpur_rule":
method = "make_arcpur_rule_copy";
break;
case "cr":
method="copy_cr";
break;
case "iss":
method="copy_iss";
break;
case "chg":
method="copy_chg";
break;
case "svy_tpl":
method="make_survey_tpl_copy";
break;
case "nr":
method="make_asset_copy";
break;
default:
method = "make_" + factory + "_copy";
break;
}
var eval_str;
if (ahdframe._dtl.edit && !ahdframe.editing)
{
var factory = persid.substr(0,persid.indexOf(":"));
ahdtop.create_new(factory, 0, "", "", "KEEP.MAKE_COPY=1");
return;
}
eval_str = 'ahdtop.popup_window("", "MAKE_COPY", "", "", "", "FACTORY=' + factory + '", "PERSID=' + persid + '", "METHOD=' + method + '"';
if (ahdframe._dtl.edit)
{
eval_str += ',"KEEP.MAKE_COPY=1"';
}
for ( var i = 1; i < arguments.length; i++ )
eval_str += ',"' + arguments[i] + '"';
eval_str += ');';
eval(eval_str);
}
function make_substitute()
{
if (typeof ahdframe._dtl != "object") return;
var persid;
persid = ahdframe.argPersistentID;
var factory = persid.substr(0,persid.indexOf(":"));
var method;
var display_str;
method = "make_" + factory + "_substitute";
var display_str = cfgCgi + 
"?SID=" + cfgSID+
"+FID=" + cfgFID + 
"+OP=MAKE_COPY" +
"+FACTORY=" + factory +
"+PERSID=" + persid +
"+METHOD=" + method +
"+KEEP.MAKE_COPY=1" +
"+KEEP.SUBSTITUTE=1";
display_new_page(display_str); 
}
function apply_template(tmpl_form_name, cnt_elem, factory)
{
var url = cfgCgi+
"?SID="+ cfgSID +
"+FID="+ fid_generator() +
"+OP=SEARCH" +
"+FACTORY=" + factory +
"+use_template=1+QBE.NN.template_name=NULL" +
"+QBE.NE.template_name=QBE_EMPTY_STRING" +
"+QBE.EQ.template_name.delete_flag=0" +
"+KEEP.domset_name=template_list+KEEP.from_detail=1" +
"+KEEP.IsPopUp=1";
var top = get_ahdtop();
var add_where = "";
if (top.cfgNX_CLASSIC_SLA_PROCESSING != "Yes" && top.cfgNX_FILTER_TEMPLATE_SEARCH == "Yes")
{
var custObj = document.forms["main_form"].elements[cnt_elem];
var custId = "";
if (typeof custObj == "object")
custId = custObj.value;
if (custId.length <= 0)
{
add_where = "";
}
else
{
add_where = buildWcForSLATemplate(factory, custId, document.forms["main_form"].elements["org_id"].value, document.forms["main_form"].elements["user_contract"].value);
}
}
if (factory == "cr")
{
if (add_where != "")
add_where += " AND "; 
add_where += "( type = 'R' OR type='' OR type IS NULL )";
}
if (add_where != "")
url += "+ADDITIONAL_WHERE=" + nx_escape(add_where);
preparePopup( url, "", "");
}
function buildWcForSLATemplate(factory, cntId, orgId, contractId)
{
var wc = "";
var cnt_attr;
if ((typeof cntId != "string") || (cntId == ""))
return wc;
if ("chg" == factory) {
cnt_attr = "affected_contact";
} else if ("iss" == factory) {
cnt_attr = "requestor";
} else {
cnt_attr = "customer";
}
if (typeof orgId == "string" && orgId.length > 1) {
wc = cnt_attr + ".organization.id = U'" + orgId + "'";
} else {
wc = cnt_attr + ".organization IS NULL";
}
return wc;
}
function log_reader()
{
var browser = _browser;
if ( window.name != "AHDtop" ) {
if ( typeof ahdtop == "object" )
ahdtop.log_reader();
}
else {
var url;
if (typeof log_reader_window == "object" &&
!log_reader_window.closed)
{
log_reader_window.reload_initial_url();
}
else
{
var w_name = get_popup_window_name("log_reader");
url = cfgCgi + "?SID=" + cfgSID + "+FID=" + fid_generator() +
"+OP=DISPLAY_FORM+HTMPL=log_reader_fs.htmpl" +
"+KEEP.POPUP_NAME=" + w_name;
var features = "width=800,height=600,resizable=yes,scrollbars=" +
( _browser.isIE ? "no" : "yes" );
if ( ahdtop.propDebugOptions != "" )
features = modifyWindowFeaturesForDebug(features);
log_reader_window = window.open(url, "", features);
if (!check_popup_blocker(log_reader_window))
return;
register_window(log_reader_window, w_name);
}
if (typeof log_reader_window == "object" && log_reader_window != null)
{
log_reader_window.focus();
}
}
}
function findElem(e_name) {
var i, j, aForm, anElem;
var browser = _browser;
if ( browser.supportsLayers ) {
for (var z = 0; z < document.layers.length; z++) {
var zLayer = document.layers[z];
for (i = 0; i < zLayer.document.forms.length; i++) {
aForm = zLayer.document.forms[i];
for (j = 0; j < aForm.elements.length; j++) {
anElem = aForm.elements[j];
if (typeof anElem.name == "string" && anElem.name == e_name) {
return zLayer.document.forms[aForm.name].elements[anElem.name];
}
}
}
}
} else {
for (i = 0; i < document.forms.length; i++) {
aForm = document.forms[i];
for (j = 0; j < aForm.elements.length; j++) {
anElem = aForm.elements[j];
if (typeof anElem.name == "string" && anElem.name == e_name) {
return document.forms[aForm.name].elements[anElem.name];
}
}
}
}
return null;
}
function RefreshFormGroup(lFormGroupPersID)
{
set_action_in_progress(ACTN_RUN_FMGRP);
upd_workframe("REFRESH_FORM_GROUP", "PERSID=" + lFormGroupPersID,
"func=parent.ahdframeset.ahdframe.run_fmgrp_callback");
}
function run_fmgrp_callback(ret)
{
if (ret == "1")
{
alertmsg("The_form_group_refresh_process");
}
else if(ret =="2")
{
alertmsg("Unable_to_refresh_inactive_for");
}
else
{
alertmsg("The_form_group_refresh_process0");
}
set_action_in_progress(ACTN_COMPLETE);
next_workframe("UPD_WORKFRAME");
}
function pop_global_queue(obj_id, proto, web_srvr, web_url, factory, gsrvrname, popup, web_port, type)
{
if(ahdtop.gpb_gbl_name==gsrvrname)
{
var persid = factory + ":" + obj_id;
if(typeof type=="string" && type=="I") factory="in";
if(typeof type=="string" && type=="P") factory="pr";
if(typeof popup=="string")
{
var win = ahdtop.AHD_Windows[popup];
if(typeof win=="object")
{
win.close();
}
}
ahdtop.do_openDetail( factory+".persistent_id", persid);
} else {
ahdtop.gpb_obj_id=obj_id;
ahdtop.gpb_proto=proto;
ahdtop.gpb_web_srvr=web_srvr;
ahdtop.gpb_web_port=web_port;
ahdtop.gpb_web_url=web_url;
ahdtop.gpb_factory=factory;
ahdtop.gpb_gsrvrname=gsrvrname;
ahdtop.gpb_popup=popup;
upd_workframe("LINK_WITH_GLOBAL_BOPSID",
"GLOBAL_SERVER_NAME="+gsrvrname.toUpperCase(),
"CALLBACK=pop_global_queue_callback('%bopsid')",
"POPUP_NAME=AHDtop");
}
}
function pop_global_queue_callback(bopsid)
{
var obj_id=ahdtop.gpb_obj_id;
var proto=ahdtop.gpb_proto;
var web_srvr=ahdtop.gpb_web_srvr;
var web_port=ahdtop.gpb_web_port;
var web_url=ahdtop.gpb_web_url;
var factory=ahdtop.gpb_factory;
var gsrvrname=ahdtop.gpb_gsrvrname;
var popup=ahdtop.gpb_popup;
var host_addr=ahdtop.gpb_host_hash[web_srvr + ahdtop.gpb_active_zone];
var rem_url='';
if(typeof host_addr != "undefined" && host_addr != "")
{
rem_url+=proto + "://" + host_addr;
} else {
rem_url+=proto + "://" + web_srvr;
}
if(typeof web_port != "undefined" && web_port != "")
{
rem_url+=":"+web_port;
}
rem_url+=web_url;
rem_url+='?OP=SEARCH+BOPSID=' + bopsid + '+FACTORY=' + factory + '+SKIPLIST=1+QBE.EQ.id=' + obj_id + "+KEEP.IsPopUp=1";
var h = popupHeight(LARGE_POPUP);
var w = popupWidth(LARGE_POPUP);
var features = "scrollbars,resizable,width=" + w + ",height="+ h + ",ahdmenu=no";
features+=( _browser.supportsLayers ? ",screenX=10,screenY=10" : ",left=10,top=10" );
var win = ahdtop.AHD_Windows[popup];
if(typeof win=="object")
{
win.location.replace(rem_url);
} else {
win = popup_window("", rem_url, h, w, features);
}
next_workframe("UPD_WORKFRAME");
}
function ProcessNotification(persid, lType)
{
set_action_in_progress(ACTN_RUN_NOTIF);
upd_workframe("PROCESS_NOTIFICATION", "PERSID=" + persid, "TYPE=" + lType,
"func=parent.ahdframeset.ahdframe.run_notif_callback");
}
function run_notif_callback(ret)
{
if (ret == "1")
{
alertmsg("The_notification_process_has_f");
}
else
{
alertmsg("The_notification_process_has_s");
}
set_action_in_progress(ACTN_COMPLETE);
next_workframe("UPD_WORKFRAME");
}
function bmhier_delete_callback(ret)
{
if(ret!="") alert(ret);
set_action_in_progress(ACTN_COMPLETE);
next_workframe("UPD_WORKFRAME");
ahdtop.bmhier_delete.doSearch();
ahdtop.bmhier_delete.refreshForm();
ahdtop.bmhier_delete=void(0);
}
function do_catg_copy(factory) {
popup_window("","SEARCH","","","","FACTORY=" + factory,"KEEP.backfill_field=KEY.category_copy","KEEP.backfill_form=catg_copy");
}
function merge_ldap(rp)
{
set_action_in_progress(ACTN_FILLFORM);
upd_workframe("MERGE_LDAP", "CNT=" + cfgMergeLdap, "PERSID="+rp,
"FUNC=parent.ahdframeset.ahdframe.merge_ldap_callback", "prop_ref="+prop_ref);
}
function merge_ldap_callback(ret,errmsg)
{
set_action_in_progress(ACTN_COMPLETE);
next_workframe("UPD_WORKFRAME");
ahdtop.merge_ldap.pop_ldap_callback(ret,errmsg);
window.parent.close();
}
function modifyWindowFeaturesForDebug(features)
{
if ( ahdtop.propDebugOptions != "" ) {
var options = ahdtop.propDebugOptions;
if ( options.indexOf("menubar") != -1 ) {
if ( features.match(/menubar/i) )
features = features.replace(/menubar[=\w]*/i,"menubar");
else
features += ",menubar";
}
if ( options.indexOf("status") != -1 ) {
if ( features.match(/status/i) )
features = features.replace(/status[=\w]*/i,"status");
else
features += ",status";
}
if ( options.indexOf("toolbar") != -1 ) {
if ( features.match(/toolbar/i) )
features = features.replace(/toolbar[=\w]*/i,"toolbar");
else
features += ",toolbar";
}
features = features.replace(/,,+/g,",");
}
return features;
}
function fetch_artifact()
{
var error_str = "INVALID";
var target_url=cfgCgi+
"?SID="+cfgSID+
"+FID="+fid_generator()+
"+OP=GET_ARTIFACT"+
"+FACTORY=cr";
var response = parent.ahdframe.SyncAjaxCall(target_url);
response = response.replace(/\n/g,"");
if(response == error_str) {
artifact = "";
}
else {
artifact = response;
}
}
function fetch_bopsid()
{
var target_url=cfgCgi+
"?SID="+cfgSID+
"+FID="+fid_generator()+
"+OP=LINK_WITH_BOPSID"+
"+CALLBACK=set_bopsid('"+nx_escape("%")+"bopsid')"+
"+SHARE_SESSION=1+POPUP_NAME="+ahdframeset.name;
var responseJS = parent.ahdframe.SyncAjaxCall(target_url);
var sindex=responseJS.lastIndexOf("<SCRIPT>");
var eindex=responseJS.indexOf("</SCRIPT>", sindex);
if(sindex!=-1&&eindex!=-1)
{
var _script=responseJS.substring(sindex+8,eindex);
eval(_script);
}
}
function set_bopsid(bopsid_value)
{
bopsid = bopsid_value;
}
function sd_bo_call_funcs(bInfoView, bo_token)
{
if (typeof bInfoView == "undefined")
bInfoView = 0;
var func_str;
var first = true;
if ((bInfoView == 1 &&
BOFuncArray[0].indexOf("InfoView") >= 0) ||
bInfoView == 0) 
{
func_str = BOFuncArray[0] + "('" + bo_token + "');";
try 
{
eval(func_str);
}
catch (e) 
{}
BOFuncArray.splice(0, 1);
}
if (BOFuncArray.length > 0)
{
if (BOFuncArray[0].indexOf("InfoView") >= 0) 
check_bo_info(1);
else 
check_bo_info(0);
}
else 
{	
BOFuncInProgress = false;
}
}
function sd_get_bo_info(func, bInfoView)
{
if (window != ahdtop)
{
var rc = ahdtop.sd_get_bo_info(func);
return rc;
}
if (typeof BOFuncArray != "object" ||
typeof BOFuncInProgress != "boolean") 
return 1;
BOFuncArray[BOFuncArray.length] = func;
if (BOFuncInProgress)
return;
BOFuncInProgress = true;
if (typeof bInfoView == "undefined" &&
bInfoView != 1)
bInfoView = 0;
check_bo_info(bInfoView);
return; 
}
function check_bo_info(bInfoView, logoff)
{
var bo_path = window.location.href;
var idx = bo_path.lastIndexOf("/");
bo_path = bo_path.slice(0, idx) + "/html/bo_work.html";
fetch_bopsid();
var url; 
if (typeof ahdtop.cfgCAISD == "string" &&
ahdtop.cfgCAISD != "")
{	
url = ahdtop.cfgServletURL + ahdtop.cfgCAISD + 
"/BOServlet?BOPSID="+bopsid+"&USERID="+ahdtop.cfgUserid+"&";	
}
if (typeof logoff == "number" &&
logoff == 1)
{
if (typeof ahdtop.product == "object" && 
ahdtop.product != null && 
typeof ahdtop.product.show_rpt_logoff != "undefined")
{
ahdtop.product.show_rpt_logoff(true);
}
url += "LOGOFF=1&";
}
if ( typeof ahdtop.cfgBOServerAuth != "undefined" && "secLDAP" == ahdtop.cfgBOServerAuth )
{
if ( ahdtop.bo_auth == "0" )
{
var ajax_call_url = cfgCgi +
"?SID=" + cfgSID +
"+FID=" + fid_generator() +
"+OP=GET_BO_INFO" +
"+GET_BO_INFO=1";
var responseJS = parent.ahdframe.SyncAjaxCall(ajax_call_url);
var sindex=responseJS.lastIndexOf("<SCRIPT>");
var eindex=responseJS.indexOf("</SCRIPT>", sindex);
if(sindex!=-1&&eindex!=-1)
{
var _script=responseJS.substring(sindex+8,eindex);
eval(_script);
}
url += "BO_INFO=" + bo_info + "&";
}
}
url += "BO_PATH=" + bo_path;
if (bInfoView)
url += "&INFOVIEW=" + bInfoView;
url = resolveWebFormVars(url);
var boframe = ahdtop.boframe;
if (typeof boframe == "object" && 
boframe != null)
{
boframe.location.href = url;
} 
}
function load_bo_info_htmpl(bInfoView)
{
var url = cfgCgi +
"?SID=" + cfgSID +
"+FID=" + fid_generator() +
"+OP=GET_BO_INFO";
if (typeof bInfoView != "undefined" &&
bInfoView == 1)
{
url += "+INFOVIEW=1";
}
var boframe = ahdtop.boframe;
if (typeof boframe == "object" && 
boframe != null)
{
boframe.location.href = url;
} 
}
function conflict_analysis()
{
set_action_in_progress(ACTN_CONFLICT_ANALYSIS);
upd_workframe("CONFLICT_ANALYSIS", "CONFLICT_PERSID=" + argChgPersid,
"FUNC=parent.ahdframeset.ahdframe.conflict_analysis_callback",
"FACTORY=chgcnf_chg"
);
}
function conflict_analysis_callback(ret)
{
if(ret.length>0) {
show_response(ret);
}
set_action_in_progress(ACTN_COMPLETE);
next_workframe("UPD_WORKFRAME");
parent.ahdframeset.ahdframe.reloadTabs("chgcnf");
}
function GetResponseViaUrl(query_str) {
var response = SyncAjaxCall( query_str );
if( typeof response != "string" )
{
response = false;
}
return response;
}
function alert_banner(cnt_id) {
if(cnt_id.length==0) return;
if(cnt_id.slice(0, 4)!="cnt:") cnt_id="cnt:" + cnt_id;
var url= cfgCgi + "?SID=" + cfgSID + "+FID=" + cfgFID + 
"+OP=SPEC_HAND" +
"+FACTORY=cnt" +
"+PERSID=" + cnt_id;
var params_txt=GetResponseViaUrl(url);
if(params_txt.slice(0,1) == "0") {
alert_banner_clear();
return;
}
var params=params_txt.split("@");
if(params.length > 1 && params[0] > 0) {
var cntr=params[0] * 4;
var msgtxt="";
var do_notes=false;
var do_notes_txt;
for(var i=1; i<=cntr; i=i+4) {
var autod="";
var icon="";
var text="";
var notes="";
autod=alert_banner_fix_text(params[i]);
icon=alert_banner_fix_text(params[i+1]);
text=alert_banner_fix_text(params[i+2]);
notes=alert_banner_fix_text(params[i+3]);
if(msgtxt.length > 0 
&& ( icon.length > 0 || text.length > 0)
) msgtxt+="<BR>";
if(icon.length > 0) {
msgtxt+="<img src=\"" + icon + "\" alt=\"" + text + "\" title=\"" + text + "\" class=alert_banner_img>&nbsp;&nbsp;";
}
if(text.length > 0) {
msgtxt+=text;
}
if(autod==1 && notes.length > 0) {
do_notes=true;
do_notes_txt=notes;
}
}
if(do_notes) {
if(msgtxt.length > 0) msgtxt+="<HR>";
msgtxt+=do_notes_txt;
}
if(msgtxt.length > 0) {
alert_banner_last=msgtxt;
}
showAlertMsg();
} else {
alert_banner_clear();
}
}
function alert_banner_fix_text(txt) {
txt=nx_unescape(txt);
if(txt.charCodeAt(txt.length-1)==0) txt=txt.substr(0, txt.length-1);
if(txt.charCodeAt(txt.length-1)==10) txt=txt.substr(0, txt.length-1);
if(txt.charCodeAt(txt.length-1)==13) txt=txt.substr(0, txt.length-1);
txt=txt.replace(/\&/g, "&amp;");
txt=txt.replace(/'/g, "&#39;");
txt=txt.replace(/\\/g, "&#092;");
txt=txt.replace(/"/g, "&quot;");
txt=txt.replace(/\</g, "&lt;");
txt=txt.replace(/\>/g, "&gt;");
txt=txt.replace(/\r\n/g, "<BR>");
if(txt=="<BR>") txt="";
return txt;
}
function alert_banner_clear() {
alert_banner_last=null;
showAlertMsg();
}
function get_alert_banner(appnd) {
var rtn="";
if(typeof alert_banner_last == "string"
&& alert_banner_last != null
&& alert_banner_last.length >0) {
rtn=alert_banner_last;
} 
if(typeof appnd == "string"
&& appnd != null
&& appnd.length >0) {
if(rtn.length > 0) rtn=rtn + "<HR>";
rtn+=appnd;
}
return rtn;
}
// Copyright (c) 2005 CA.  All rights reserved.
var oBrowser = _browser;
var obtainedHotKeysFor = new Array();
var knownHotKeys = new Array();
function KnownHotKey(id,hotkey)
{
this.item_id = id;
this.item_hotkey = hotkey;
}
function SetFrameSet()
{
try 
{
var toolbarTable = document.getElementById("menubarTable");
var tabWidth = toolbarTable.clientWidth;
var oDiv = parent.document.getElementById("menubar");
var winWidth = oDiv.scrollWidth;
var addRowHeight = 17;
var RowNumber = 1;
var parentFrameSet = parent.document.getElementById("frameset1");
if(!parentFrameSet)
{
parentFrameSet = parent.document.getElementById("popupframeset");
RowNumber = 3;
}
var OrigRows = parentFrameSet.rows;
var ModifiedRows = "";
var arrayofRows;
var tempVar;
if((tabWidth > winWidth)&&(oDiv.scrolling == "no"))
{
oDiv.scrolling = "auto";
arrayofRows = OrigRows.split(",");
for (var i = 0; i < arrayofRows.length;i++)
{
if( RowNumber == (i +1))
{
tempVar = parseInt(arrayofRows[i],10) + addRowHeight;
ModifiedRows = ModifiedRows + tempVar 
}
else
ModifiedRows = ModifiedRows + arrayofRows[i];
if(arrayofRows.length != (i+1))
ModifiedRows = ModifiedRows + ",";
}
parentFrameSet.rows = ModifiedRows;
}
else
{
if((oDiv.scrolling == "auto") && 
((parentFrameSet.id == "frameset1") || (typeof resize != "undefined" && resize == 1)) && 
(tabWidth == winWidth))
{
oDiv.scrolling = "no";
var arrayofRows = OrigRows.split(",");
for (var i = 0; i < arrayofRows.length;i++)
{
if( RowNumber == (i +1))
{
tempVar = parseInt(arrayofRows[i],10) - addRowHeight;
ModifiedRows = ModifiedRows + tempVar; 
}
else
ModifiedRows = ModifiedRows + arrayofRows[i];
if(arrayofRows.length != (i+1))
ModifiedRows = ModifiedRows + ",";
}
parentFrameSet.rows = ModifiedRows;
}
}
}
catch (e)
{
}
}
function MenuBar()
{
this.menus = new Array();
this.owningWindow = window;
this.name = "";
this.WinFocus = true;
this.actKeyMenuState = new Object();
this.mouseoverMenus = ahdtop.mouseoverMenus;
this.altKeyAction = false;
this.toolbar = new Array();
this.bar_obj = void(0);
}
MenuBar.prototype.type = "menuBar";
MenuBar.prototype.window = void(0);
MenuBar.prototype.current = void(0);
MenuBar.prototype.setWinFocus = function(bFocus)
{
this.WinFocus = bFocus;
}
MenuBar.prototype.initMenus = function()
{
if ( typeof siteMenuAdd != "undefined" )
siteMenuAdd();
}
MenuBar.prototype.init = function(win)
{
if (typeof win == "undefined" || typeof win.document == "undefined")
return false;
this.window = win;
if (oBrowser.supportsDOM >= 2)
{
if ( ! oBrowser.isIE55 ) {
win.document.onmousemove = menuBarWindowMouseMove;
document.onmousemove = windowMouseMove;
win.document.getElementById("idMenuBar").onclick = onclickMenuBar;
}
win.document.getElementById("idMenuBar").menuBar = this;
}
else
win.document.all["idMenuBar"].menuBar = this;
return true;
}
function findPath( path, from, to )
{
for ( var i = from.frames.length - 1; i >= 0; i-- ) {
var f = from.frames[i];
if ( f == to )
return path + "." + to.name;
try {
var newpath = findPath(path + "." + f.name, f, to)
if ( newpath != "" )
return newpath;
} catch(e) {}
}
return "";
}
MenuBar.prototype.reset = function(definingWindow, owningWindow)
{
this.name = owningWindow.menubarName;
this.definingWindow = definingWindow;
this.owningWindow = owningWindow;
this.execPath = findPath("window.parent", window.parent, owningWindow);
for ( var i = this.menus.length - 1; i >= 0; i--) {
var m = this.menus[i];
if ( typeof m.items == "object" ) {
for ( var j = m.items.length - 1; j >= 0; j-- )
delete m.items[j];
}
delete m.items;
}
delete this.menus;
this.menus = new Array();
delete this.toolbar;
this.toolbar = new Array();
delete this.actKeyMenuState;
this.actKeyMenuState = new Object();
}
MenuBar.prototype.addMenu = function(id, idx_str, Img, Href, callExit, actKey, values)
{
var Label = idx_str;
var func_str = 'msgtext("' + idx_str + '"';
if (values != "")
{
var arr = values.split("@,@");
for (var i = 0; i < arr.length; i++)
{
func_str += ', "' + arr[i] + '"';
}
}
func_str += ");";
Label = eval(func_str);
if (typeof Label == "undefined")
{
Label = idx_str;
if (nonLatinFlag)
idx_str = void(0); 
} 
if (Label.indexOf("[") != -1)
{
var initalval = Label.indexOf("[");
var endval = Label.indexOf("]");
var actkeylen = (endval-1)-initalval;
actKey = Label.substr(initalval+1,actkeylen); 
Label = Label.substr(0,initalval);
}
else if ( typeof actKey != "string" )
actKey = "";
if ( callExit ) {
if ( typeof siteMenuMod != "undefined" ) {
var rc = siteMenuMod(Label);
switch( typeof rc ) {
case "string":
if ( rc.length == 0 )
return null;
else
Label = rc;
break;
case "number":
case "boolean":
if ( ! rc )
return null;
break;
default:
break;
}
}
}
var _m = new Menu(this, id, Label, Img, Href, callExit, actKey, idx_str);
_m.mnum = this.menus.length;
this.menus[_m.mnum] = _m;
if (typeof addMenuItem != "undefined" && 
!callExit && typeof Href == "string" && Href == "")
{
this.current_menu = _m;
}
return _m;
}
MenuBar.prototype.deactivate = function(id)
{
for ( var i = this.menus.length - 1; i >= 0; i-- ) {
var m = this.menus[i];
if ( m.id == id ) {
m.isActive = false;
var link = window.document.getElementById("menu_" + m.mnum);
if ( typeof link == "object" && link != null )
link.style.color = "gray";
if ( typeof m.imgobj == "object" && m.imgobj != null )
m.imgobj.style.display = "none";
}
}
}
MenuBar.prototype.draw = function()
{
if (this.window == void(0))
return false;
var bar = void(0);
var doc = this.window.document;
var e, _m, _a, _td, _i, top;
bar = doc.getElementById("idMenuBar");
for (e = 0; e < this.menus.length; e++) {
_m = this.menus[e];
_td = doc.createElement("TD");
_td.className = "menubar_unselected_background"; 
_td.noWrap = true;
_td.id = _m.id;
bar.appendChild(_td);
_m.tdId = _td.id;
if (ahdtop.cstUsingScreenReader ) {
_a = _m.buildScreenReaderMenu(doc);
_td.appendChild(_a);
}
else {
_a = doc.createElement("A");
_a.id = "menu_" + _m.mnum;
_a.tabIndex = 2;
_td.anchor = _a;
_td.appendChild(_a);
_a.className = "menu_unselected_text";
_a.href = "javascript:" + this.execPath +
".setActKeyMenuState(" + _m.mnum + ")"; 
if (_m.img.length > 0 )
{
_i = doc.createElement("IMG");
_i.border = 0;
_i.src = _m.img;
_a.appendChild(_i);
_a.appendChild(doc.createTextNode("  "));
}
_a.onmouseover = menuBarMouseOver;
_a.onmouseout = menuBarMouseOut;
if ( __menuBar.mouseoverMenus && ! oBrowser.isIE55 )
_a.onclick = menuBarClick;
if ( _m.hotkey.length == 0 ||
_m.hotkeyPosn == -1 )
{
if (_m.hotkey.length != 0)
{
var temp_lab = _m.label + " (";
_a.appendChild(doc.createTextNode(temp_lab));
var u = doc.createElement("U");
u.innerHTML = _m.hotkey;
_a.appendChild(u);
_a.appendChild(doc.createTextNode(") "));
}
else 
_a.appendChild(doc.createTextNode(_m.label));
}
else {
if ( _m.hotkey == fallbackHotkey &&
fallbackHotkey.length > 0 )
window.registerFallbackKey(_a.id);
if ( _m.hotkeyPosn != 0 )
_a.appendChild(doc.createTextNode(_m.label.substr(0,_m.hotkeyPosn)));
var u = doc.createElement("U");
u.innerHTML = _m.label.substr(_m.hotkeyPosn,1);
_a.appendChild(u);
if ( _m.hotkeyPosn < _m.label.length - 1 )
_a.appendChild(doc.createTextNode(_m.label.substr(_m.hotkeyPosn+1,_m.label.length-_m.hotkeyPosn-1)));
}
if (_m.img.length <= 0 && _m.isActive) {
_i = doc.createElement("IMG");
_i.border = 0;
_i.src = "/CAisd/img/arrow_asc_bk.png";
_i.width = 15;
_i.height = 10;
_a.appendChild(_i);
}
if (bar.offsetTop == 0)
{
top = (doc.body.offsetHeight - bar.offsetHeight) / 2;
if ( top < 0 )
top = 0;
bar.style.top = top;
}
_m.imgobj = _i;
if ( ! _m.isActive ) {
_a.style.color = "gray";
_a.href = "javascript:void(0);";
_a.onclick = "javascript:void(0);";
if ( typeof _i == "object" && _i != null )
_i.style.display = "none";
}
}
}
if (typeof bar == "undefined")
return false;
else
this.bar_obj = bar;
SetFrameSet();
return true;
}
MenuBar.prototype.add_toolbar_icon = function()
{
if (this.window == void(0) || 
this.bar_obj == void(0))
return false;
var doc = this.window.document;
var bar = this.bar_obj;
this.bar_obj = void(0);
var _t;
if (ahdtop.cstUsingScreenReader) 
return;
for (var i = 0; i< this.toolbar.length; i++)
{ 
_t = this.toolbar[i];
_t.toolbar_id = "toolbar_" + i;
_td = doc.createElement("TD");
_td.className = "menubar_unselected_background"; 
_td.noWrap = true;
_td.id = "tbtd_" + _t.toolbar_id;
_td.style.padding = 1 + "px";
bar.appendChild(_td);
_a = doc.createElement("A");
_a.id = _t.toolbar_id;
_a.tabIndex = 2;
_td.anchor = _a;
_td.appendChild(_a);
_a.className = "menu_unselected_text";
_a.href = "javascript:" + this.execPath +
".toolbar_action(" + i + ")"; 
_a.title = _t.tooltip;
_i = doc.createElement("IMG");
_i.border = 0;
_i.src = _t.icon_url;
_i.width = 20;
_i.height = 20;
_a.appendChild(_i);
_a.appendChild(doc.createTextNode("  "));
}
if (ahdframeset == ahdtop) {
_td = doc.createElement("TD");
_td.className = "menubar_unselected_background";
_td.width = "100%";
bar.appendChild(_td);
}
}
function load_menu_items ()
{
if (typeof __menuBar == "object")
{
var menu;
for (var i = 0; i < __menuBar.menus.length; i++)
{
menu = __menuBar.menus[i];
if (typeof menu == "object")
menu.buildItemsIfNecessary();
}
__menuBar.add_toolbar_icon(); 
}
}
MenuBar.prototype.set_toolbar_icon_state = function(id, b_display_icon)
{
var tb = this.toolbar;
if (typeof tb == "object") {
for ( var i = 0; i <= tb.length - 1; i++ ) {
if (tb[i].menu_item_id == id) {
var el_id = "tbtd_" + tb[i].toolbar_id;
var e = this.window.document.getElementById(el_id);
if ( e != null )
this.change_state(e, b_display_icon); 
return;
}
}
}
}
MenuBar.prototype.change_state = function(obj, b_display)
{
var new_display_state;
if ( b_display )
if (oBrowser.isIE)
new_display_state = "block";
else
new_display_state = "";
else
new_display_state = "none";
obj.style.display = new_display_state; 
}
function toolbar_action(t_id)
{
var tbar = __menuBar.toolbar[t_id];
if (typeof tbar == "undefined")
{
alertmsg("Failed_to_take_a_toolbar_action.");
return; 
}
var menu = __menuBar.getMenu(tbar.menubar_id);
if (typeof menu == "undefined")
{
alertmsg("Failed_to_take_a_toolbar_action.");
return; 
}
menu.buildItemsIfNecessary();
var items = menu.items;
var i;
for (i = 0; i < items.length; i++)
{
if (items[i].id == tbar.menu_item_id)
break; 
}
if (i == items.length) 
{
alertmsg("Failed_to_take_a_toolbar_action.");
return;
}
var href = items[i].href;
__menuBar.owningWindow.callMenuItem(href);
} 
MenuBar.prototype.clear = function()
{
var bar;
if (oBrowser.supportsDOM >= 2)
{
bar = this.window.document.getElementById("idMenuBar");
for (var e = bar.childNodes.length; e > 0; e--)
bar.removeChild(bar.childNodes[e - 1]);
}
else if (oBrowser.isIE)
{
bar = this.window.document.all["idMenuBar"];
bar.innerHTML = "";
}
}
MenuBar.prototype.getMenu = function(id)
{
for (var e = 0; e < this.menus.length; e++)
{
if (this.menus[e].id == id)
return this.menus[e];
}
return void(0);
}
MenuBar.prototype.reregisterActionKeys = function(win)
{
if ( win != this.owningWindow ) {
this.owningWindow = win;
for ( e = 0; e < this.menus.length; e++ ) {
var _m = this.menus[e];
var next_avail = void(0);
if (nonLatinFlag && _m.next_avail)
next_avail = "NEXT_AVAIL"; 
var key = win.registerActionKey( _m.actKey, _m.newlabel,
setActKeyMenuState, e, next_avail );
if ( key.match(/^\s*$/) &&
fallbackHotkey.length > 0 &&
! ahdtop.cstUsingScreenReader ) {
key = win.fallbackHotkey;
if ( _m.newlabel.indexOf(fallbackHotkey) == -1 )
_m.newlabel += " (" + fallbackHotkey + ")";
}
if ( key != _m.hotkey ) {
_m.hotkey = key;
_m.hotkeyPosn = _m.label.indexOf(_m.hotkey);
}
}
}
}
function ToolbarItem(icon_url, tooltip, menubar_id, menu_item_id)
{
this.icon_url = icon_url;
this.tooltip = tooltip;
this.menubar_id = menubar_id;
this.menu_item_id = menu_item_id; 
this.toolbar_id = void(0);
}
MenuBar.prototype.addToolbarItem = function(icon_url, tooltip, menubar_id, menu_item_id) 
{
this.toolbar[this.toolbar.length] = 
new ToolbarItem(icon_url, tooltip, menubar_id, menu_item_id);
}
function Menu(parent, id, Label, Img, Href, callExit, actKey, idx_str) 
{
this.parent = parent;
this.id = id;
this.next_avail = false;
if (nonLatinFlag &&
(typeof idx_str == "undefined"))
{
this.next_avail = true;
idx_str = Label;
}
if (!nonLatinFlag)
idx_str = Label;
idx_str = idx_str.replace(/%\d/g, "");
this.idx_str = idx_str; 
this.label = Label;
this.item_num = __menuBar.menus.length;
this.showMenuDelay = 0;
this.isActive = true;
this.isHidden = false;
if ( typeof actKey == "string" )
this.actKey = actKey;
else
this.actKey = "";
this.itemActKey = "";
if (typeof Img == "string" && Img.length > 0)
this.img = Img;
if (typeof Href == "string" && Href.length > 0)
this.href = Href;
if (typeof callExit == "boolean")
this.callExit = callExit;
var starIndex = this.actKey.indexOf("*");
if ( starIndex != -1 ) 
this.actKey = this.actKey.substr( starIndex+1, this.actKey.length );
this.newlabel= this.actKey + this.idx_str;
var next_avail = void(0);
if (nonLatinFlag && this.next_avail)
next_avail = "NEXT_AVAIL";
this.hotkey = this.parent.owningWindow.registerActionKey( this.actKey,
this.newlabel, setActKeyMenuState, this.item_num, next_avail);
if ( this.hotkey.match(/^\s*$/) &&
fallbackHotkey.length > 0 &&
! ahdtop.cstUsingScreenReader ) {
this.hotkey = fallbackHotkey;
if ( this.label.indexOf(fallbackHotkey) == -1 )
this.label += " (" + fallbackHotkey + ")";
}
if ( this.hotkey.length > 0 && this.hotkey != " " ) {
if ( starIndex == -1 )
this.hotkeyPosn = this.label.indexOf(this.hotkey);
else {
this.label += " (";
this.hotkeyPosn = this.label.length;
this.label += this.hotkey + ") ";
}
if ( this.hotkeyPosn == -1 )
this.hotkeyPosn = this.label.indexOf(this.hotkey.toLowerCase());
}
else {
this.hotkeyPosn = -1;
}
this.reset();
}
Menu.prototype.reset = function()
{
if ( typeof this.items == "object" ) {
for ( var i = this.items.length - 1; i >= 0; i-- )
delete this.items[i];
}
this.items = new Array();
this.menuTop = 0;
if ( ahdframeset == ahdtop &&
( typeof ahdframeset.propInitialPopup == "undefined" ||
ahdframeset.propInitialPopup == "" ) ) {
this.displaywindow = ahdtop.product.frames[ahdtop.toolbarCurrentTab];
this.menuTop = 21;
}
else if ( this.parent.owningWindow.name == "page" ||
this.parent.owningWindow.name == "frmKDs" ||
this.parent.owningWindow.name == "menu_tree_main" ||
this.parent.owningWindow.name == "impact_explorer_main" ||
this.parent.owningWindow.name == "frmDTBuilderTree" ) {
this.displaywindow = this.parent.owningWindow.parent;
}
else if ( this.parent.owningWindow.name == "kdlist" ) {
this.displaywindow = this.parent.owningWindow.parent;
if( ahdframeset.name == "cai_main")
{
if ( oBrowser.isIE )
this.menuTop = 49;
else
this.menuTop = 56;
}
else
{
if (typeof ahdframeset.propInitialPopup == "undefined" || ahdframeset.propInitialPopup == "" )
{
if ( oBrowser.isIE )
this.menuTop = 49;
else
this.menuTop = 56;
}	
else
{
this.menuTop = 21;
}	
}
}
else {
this.displaywindow = this.parent.owningWindow;
}
}
Menu.prototype.id = "";
Menu.prototype.label = "";
Menu.prototype.img = "";
Menu.prototype.href = "JavaScript: void(0);";
Menu.prototype.callExit = true;
Menu.prototype.type = "menu";
Menu.prototype.displaywindow = void(0);
Menu.prototype.submenuGap = 11;
Menu.prototype.addItem = function(id, idx_str, Img, Script, callExit, Local, extended, actKey, values,
menubar_id, icon_url, tooltip)
{
var Label = idx_str;
var func_str = 'msgtext("' + idx_str + '"';
if (values != "")
{
var arr = values.split("@,@");
for (var i = 0; i < arr.length; i++)
{
func_str += ', "' + arr[i] + '"';
}
}
func_str += ");";
Label = eval(func_str);
if (typeof Label == "undefined")
{
Label = idx_str;
if (nonLatinFlag)
idx_str = void(0); 
} 
if (Label.indexOf("[") != -1)
{
var initalval = Label.indexOf("[");
var endval = Label.indexOf("]");
var actkeylen = (endval-1)-initalval;
actKey = Label.substr(initalval+1,actkeylen); 
}
else if ( typeof actKey != "string" )
actKey = "";
return this.addInternalItem2(id, Label, Img, Script + ";", "content", callExit, actKey, idx_str, 
menubar_id, icon_url, tooltip);
}
Menu.prototype.addInternalItem = function(id, idx_str, Img, Href, target, callExit, actKey, values, 
menubar_id, icon_url, tooltip)
{
var Label = idx_str;
var func_str = 'msgtext("' + idx_str + '"';
if (values != "")
{
var arr = values.split("@,@");
for (var i = 0; i < arr.length; i++)
{
func_str += ', "' + arr[i] + '"';
}
}
func_str += ");";
Label = eval(func_str);
if (typeof Label == "undefined")
{
Label = idx_str;
if (nonLatinFlag)
idx_str = void(0); 
} 
return this.addInternalItem2(id, Label, Img, Href, target, callExit, actKey, idx_str, 
menubar_id, icon_url, tooltip);
}
Menu.prototype.addInternalItem2 = function(id, Label, Img, Href, target, callExit, actKey, idx_str, 
menubar_id, icon_url, tooltip)
{
if ( callExit &&
typeof siteMenuitemMod != "undefined" ) {
__menuBar.current_menu = this;
var rc = siteMenuitemMod(this.label, Label);
__menuBar.current_menu = void(0);
switch( typeof rc ) {
case "string":
if ( rc.length == 0 )
return null;
else
Label = rc;
break;
case "number":
case "boolean":
if ( ! rc )
return null;
break;
default:
break;
}
}
var _i = new menuItem(this, id, Label, Img, Href, callExit, actKey, idx_str);
this.items[this.items.length] = _i;
if (icon_url != "" && tooltip != "")
{
__menuBar.addToolbarItem(icon_url, tooltip, menubar_id, id);
}
return _i;
}
Menu.prototype.addMenu = function(id, Label, Img, Href, callExit) {
var _m = new Menu(this, id, Label, Img, Href, callExit);
this.items[this.items.length] = _m;
return _m;
}
function onCntxtMenuFunc ()
{
return false;
}
function menuOnClickFunc ()
{ 
__menuBar.owningWindow.callMenuItem(this.menuItem.href);
closeCurrentMenu(this.item_num); 
}
Menu.prototype.draw = function()
{
var gotHotKeys = false;
var knownHotKeysPos = obtainedHotKeysFor.length;
for(i=0;i<obtainedHotKeysFor.length; i++)
{
if(obtainedHotKeysFor[i] == this.id)
{
gotHotKeys = true;
knownHotKeysPos = i;
break;
} 
}	
if(!gotHotKeys)
{
knownHotKeys[knownHotKeysPos] = new Array();
} 
var menuWin = this.displaywindow.document.body;
if ( menuWin.nodeName == "FRAMESET" &&
! _browser.isIE ) {
menuWin = this.displaywindow.parent.document.body;
}
var _d = new DynLayer(this.id, menuWin, false, "", this.displaywindow.document, true);
if (oBrowser.supportsDOM >= 2)
{
var t, tr, td;
t = this.displaywindow.document.createElement("table");
t.cellPadding = "3";
t.cellSpacing = "0";
t.border = "0";
t.className = "submenu";
_d.appendChild(t);
if ( ! oBrowser.isIE ) {
tr = t.insertRow(0);
tr.height = "1px;";
for ( var i = 0; i < 3; i++ ) {
td = tr.insertCell(i);
td.id = "mx_" + this.mnum + "_" + i;
td.className = "menubar_unselected_background";
td.onmouseout = borderCellMouseout;
}
}
var _i, e, posn;
for (e = 0; e < this.items.length; e++)
{
_i = this.items[e];
if ( oBrowser.isIE ) {
tr = t.insertRow(e);
td = tr.insertCell(0); 
}
else {
tr = t.insertRow(e+1);
var td0 = tr.insertCell(0);
td = tr.insertCell(1);
var td2 = tr.insertCell(2);
td0.id = "mx_" + this.mnum + "_" + e + "_" + 0;
td0.className = "menubar_unselected_background";
td0.onmouseout = borderCellMouseout;
td0.width = "1px;";
td2.id = "mx_" + this.mnum + "_" + e + "_" + 2;
td2.className = "menubar_unselected_background";
td2.onmouseout = borderCellMouseout;
td2.width = "1px;";
}
tr.id = "tr" + _i.id;
td.id = "m" + this.mnum + "_i" + e + "_td" 
td.menuItem = _i;
td.className = "menubar_unselected_background";
td.onmouseover = menuCellMouseover;
td.onmouseout = menuCellMouseout;
td.oncontextmenu = onCntxtMenuFunc;
var _a = this.displaywindow.document.createElement("A");
td.anchor = _a;
_a.className = "menu_unselected_text";
_i.classname=td;
_i.tdId = td.id;
_a.id = "a" + _i.id;
if (_i.type == "item") { 
if ( oBrowser.isIE55 ) { 
_a.href = "javascript:parent.callMenuItem(\"" + _i.href + "\");parent.closeCurrentMenu(" + this.item_num + ");";
_a.onclick = closeCurrentMenu; 
}
else
{
_a.href = "javascript:void(0)";
}
td.onclick = menuOnClickFunc;
}
_i.href_active = _a.href;
_i.a_onclick_active = _a.onclick;
_i.td_onclick_active = td.onclick
if (_i.img.length > 0)
{
var _im = this.displaywindow.document.createElement("IMG");
_im.id = "img" + _i.id;
_im.border = 0;
_im.src = _i.img;
_a.appendChild(_im);
_a.appendChild(this.displaywindow.document.createTextNode("  "));
}
if (_i.label.indexOf("[") != -1)
{
var initalval = _i.label.indexOf("[");
var endval = _i.label.indexOf("]");
var actkeylen = (endval-1)-initalval;
_i.actKey = _i.label.substr(initalval+1,actkeylen); 
_i.label = _i.label.substr(0,initalval);
}
_i.storeactKey = _i.actKey;
if(_i.actKey.indexOf("*")!=-1)
{
var foundindex=_i.actKey.indexOf("*");
var keylength=_i.actKey.length;
_i.actKey=_i.actKey.substr(foundindex+1,keylength);
_i.newlabel= _i.actKey + _i.idx_str; 
} 
else {
_i.newlabel= _i.idx_str; 
}
if (!gotHotKeys)
{
var arr = knownHotKeys[knownHotKeysPos];
_i.actKey = bestKey( _i.actKey, _i.newlabel,
this.itemActKey, void(0), void(0), void(0), i.next_avail );
arr[arr.length] = new KnownHotKey(_i.tdId, _i.actKey);
}
else
{
for(ii=0;ii<knownHotKeys[knownHotKeysPos].length;ii++)
{
var arr = knownHotKeys[knownHotKeysPos];
if(arr[ii].item_id == _i.tdId)
{
_i.actKey = arr[ii].item_hotkey;
break;
}
}
}
this.itemActKey += _i.actKey;
var add_hotkey = 0;
var uc_label = _i.label.toUpperCase();
var uc_actKey = _i.actKey.toUpperCase(); 
if (nonLatinFlag && 
uc_label.indexOf(uc_actKey) == -1 &&
_i.actKey != " " )
add_hotkey = 1;
if(add_hotkey || _i.storeactKey.indexOf("*")!=-1)
{
_i.label += " (";
posn = _i.label.length; 
_i.label += _i.actKey + ") ";
}
else
posn = _i.label.indexOf(_i.actKey);
if ( posn == -1 )
posn = _i.label.indexOf(_i.actKey.toLowerCase());
if ( posn == -1 || _i.actKey == " " )
_a.appendChild(this.displaywindow.document.createTextNode(_i.label));
else {
if ( posn != 0 )
_a.appendChild(this.displaywindow.document.createTextNode(_i.label.substr(0,posn)));
var u = this.displaywindow.document.createElement("U");
u.innerHTML = _i.label.substr(posn,1);
_a.appendChild(u);
if ( posn < _i.label.length - 1 )
_a.appendChild(this.displaywindow.document.createTextNode(_i.label.substr(posn+1,_i.label.length-posn-1)));
}
_a.onmouseover = menuBarDefaultHandler;
_a.onmouseout = menuBarDefaultHandler;
td.appendChild(_a);
if ( _i.isHidden ) {
tr.style.display = "none";
_a.href = "javascript:void(0)";
_a.onclick = "return false;";
td.onclick = "return false;";
}
if ( ! _i.isActive ) {
_a.style.color = "gray";
_a.href = "javascript:void(0)";
_a.onclick = "return false;";
td.onclick = "return false;"
}
} 
if ( ! oBrowser.isIE ) {
tr = t.insertRow(e+1);
tr.height = "1px;";
for ( var i = 0; i < 3; i++ ) {
td = tr.insertCell(i);
td.id = "mx_" + this.mnum + "_" + (e+1) + "_" + i;
td.className = "menubar_unselected_background";
td.onmouseout = borderCellMouseout;
}
}
this.layer = _d;
}
else
{
var out = "";
out += "<table border=0 cellpadding=0 cellspacing=0>";
for (e = 0; e < this.items.length; e++)
{
_i = this.items[e];
out += "<tr id=tr" + _i.id + "><td id=" + _i.id + ">";
out += "<A id=a" + _i.id + " CLASS=\"menu\" HREF=\"" + _i.href + "\" ONMOUSEOVER=\"return true;\" ONCLICK=\"return closeCurrentMenu();\">";
if (_i.img.length > 0)
out += "<IMG ID=img" + _i.id + " BORDER=0 SRC=\"" + _i.img + "\">&nbsp;&nbsp;";
out += _i.label;
if (_i.type.indexOf("menu") != -1)
out += "<b>-&gt;</b>";
out += "</A>" +
"</td>";
out += "</tr>\n";
}
out += "</table>";
_d.writeContent(out);
this.layer = _d;
}
try { ahdframeset.ahdframe.UpdateSubmenusOnCreation(); }
catch(e) { }
obtainedHotKeysFor[obtainedHotKeysFor.length] = this.id;
}
function onclickMenuBar()
{
try {
closeCurrentMenu();
}
catch(m) {}
}
function borderCellMouseout()
{
if ( this.id.match(/mx_(\d+)/) ) {
var i = RegExp.$1;
try {
var m = __menuBar.menus[i];
if ( m.menuUsed )
closeCurrentMenu();
else
m.menuUsed = true;
}
catch(m) {}
}
}
function menuCellMouseover()
{
if ( this.style.color != "grey" ) {
this.className = "menubar_selected_background";
if ( typeof this.anchor == "object" )
this.anchor.className = "menu_selected_text";
} 
}
function menuCellMouseout()
{
if ( this.style.color != "grey" ) {
this.className = "menubar_unselected_background"; 
if ( typeof this.anchor == "object" )
this.anchor.className = "menu_unselected_text";
}
}
function whatadrag()
{
return false;
}
Menu.prototype.show = function(left, top)
{
if ( typeof top != "number" )
top = 0;
var i, e, w = this.parent.owningWindow;
this.buildItemsIfNecessary();
if ( w.ahdtop.cstUsingScreenReader ) {
if ( typeof left == "number" ) {
e = window.document.getElementById("menu_" + this.mnum + "_select");
if ( e != null )
e.focus();
}
return;
}
w.status = this.label;
this.menuUsed = false;
if ( oBrowser.isIE55 ) {
if (typeof this.layer == "undefined")
this.draw();
else if ( this.items.length > 0 ) {
var d = this.displaywindow.document.body.document;
e = d.getElementById(this.items[0].tdId);
if ( e == null ) {
this.draw();
}
}
if ( typeof __menuBar.autohideTimeout != "undefined" ) {
w.clearTimeout(__menuBar.autohideTimeout);
__menuBar.autohideTimeout = void(0);
}
var dropdownDiv = this.layer.layer;
dropdownDiv.style.display = "";
dropdownDiv.style.overflow = "auto";
var width = dropdownDiv.scrollWidth;
var height = dropdownDiv.scrollHeight;
dropdownDiv.style.overflow = "";
dropdownDiv.style.display = "none";
var popup = w.createPopup();
__menuBar.actKeyMenuState.popup = popup;
var ahdtop = get_ahdtop();
if ( typeof ahdtop == "object" && ahdtop != null ) {
var popupStyle = popup.document.createStyleSheet();
if ( ahdtop.menuStyles.length == 0 )
ahdtop.initMenuStyles(w);
for ( i = 0; i < ahdtop.menuStyles.length; i++ ) {
var ruleName = ahdtop.menuStyles[i][0];
var ruleText = ahdtop.menuStyles[i][1];
popupStyle.addRule( ruleName, ruleText );
}
}
for ( i = __menuBar.menus.length - 1; i >= 0; i-- ) {
if ( i != this.item_num ) {
var othermenu = __menuBar.menus[i];
e = __menuBar.window.document.getElementById(othermenu.tdId);
if ( e != null ) {
e.className = "menubar_unselected_background";
if ( typeof e.anchor == "object" )
e.anchor.className = "menu_unselected_text"; 
}
}
}
var html_text = dropdownDiv.innerHTML
.replace(/ href=/ig," onClick=") 
.replace(/\<TD /ig,"<TD oncontextmenu=\"return false;\" onMouseOver=\"this.className='menubar_selected_background';parent.ie55MenuMouseOver(" + this.mnum + ");\" onMouseOut=\"this.className='menubar_unselected_background';parent.ie55MenuMouseOut(" + this.mnum + ");\" ")
.replace(/\<A /ig,"<A onMouseOver=\"this.className='menu_selected_text';\" onMouseOut=\"this.className='menu_unselected_text';\" ");
var index = html_text.lastIndexOf("TABLE class=submenu");
if (index != "-1") {
width = width + 1;
height = height + 1;
html_text = html_text.replace("TABLE class=submenu", "TABLE class=submenu Height="+ height +" Width="+ width +" ");	
}
popup.document.body.innerHTML = html_text; 
e = __menuBar.window.document.getElementById(this.tdId);
if ( e != null ) {
e.className = "menubar_selected_background";
if ( typeof e.anchor == "object" )
e.anchor.className = "menu_selected_text"; 
}
popup.show( left+this.submenuGap, top, width, height, this.displaywindow.document.body );
popup.document.body.ondragstart=whatadrag;
}
else {
this.draw();
var _curr;
do {
if (isCurrentMenuEmpty() == true)
break;
else {
_curr = popCurrentMenu();
if (_curr.id == this.parent.id)
break;
if (_curr.id == this.id)
{
pushCurrentMenu(this);
return;
}
}
_curr.hide(false);
} while (1);
pushCurrentMenu(this);
if ( oBrowser.isIE ) {
left += document.body.scrollLeft+this.submenuGap;
top += document.body.scrollTop;
}
else {
top += w.pageYOffset;
left += w.pageXOffset+this.submenuGap;
}
e = __menuBar.window.document.getElementById(this.tdId);
if ( e != null ) {
e.className = "menubar_selected_background";
e.anchor.className = "menu_selected_text"; 
}
this.layer.moveTo(left, top);
this.layer.show();
}
}
Menu.prototype.evaluate_menu_func = function (func_name, parm_str, code_str)
{
eval ("window." + func_name + "= function (" + parm_str + ") {" + code_str + "}");
var f = eval("window." + func_name);
f(this, this.parent.owningWindow);
}
Menu.prototype.buildItemsIfNecessary = function()
{
if ( typeof this.items != "object" )
this.items = new Array();
if ( this.items.length == 0 && this.href.length > 0 ) {
if ( this.parent.deferSetupCompletion ) {
try {
var w = this.parent.owningWindow;
w.menubarFrame.finishMenus();
if ( w.menubarOnload != null )
w.menubarOnload();
}
catch(e) {}
if ( this.items.length > 0 )
return;
}
this.layer = void(0);
var func_str = eval(this.href + ".toString()");
if (__menuBar.definingWindow != window && 
ahdframeset != ahdtop &&
func_str.match(/^function *([^ \(]+) *\((.*)\) *[^\{]+\{([^$]+)\}$/))
{
this.evaluate_menu_func(RegExp.$1, RegExp.$2, RegExp.$3);
}
else 
{ 
var f = eval(this.href);
f(this,this.parent.owningWindow);
}
if ( this.callExit && 
typeof siteMenuitemAdd != "undefined" )
{
__menuBar.current_menu = this; 
siteMenuitemAdd(this.label);
__menuBar.current_menu = void(0);
}
}
}
function ie55MenuMouseOver(mnum)
{
if ( typeof __menuBar == "object" &&
typeof mnum == "number" &&
mnum < __menuBar.menus.length ) {
var menu = __menuBar.menus[mnum];
menu.focused = true;
if ( typeof __menuBar.autohideTimeout != "undefined" ) {
window.clearTimeout(__menuBar.autohideTimeout);
__menuBar.autohideTimeout = void(0);
}
}
return true;
}
function ie55MenuMouseOut(mnum)
{
if ( typeof __menuBar == "object" &&
typeof mnum == "number" &&
mnum < __menuBar.menus.length ) {
var menu = __menuBar.menus[mnum];
menu.focused = false;
if ( typeof __menuBar.autohideTimeout != "undefined" ) {
window.clearTimeout(__menuBar.autohideTimeout);
__menuBar.autohideTimeout = void(0);
}
__menuBar.autohideTimeout = window.setTimeout("ie55MenuHide(" +
mnum + ")", 100 );
}
return true;
}
function ie55MenuHide(mnum)
{
if ( typeof __menuBar == "object" &&
typeof mnum == "number" &&
mnum < __menuBar.menus.length ) {
var menu = __menuBar.menus[mnum];
if ( ! menu.focused )
menu.hide();
}
return true;
}
Menu.prototype.hide = function(cancelTimeout)
{
cancelActKeyMenuState();
if (isCurrentMenuEmpty() == false) {
var _curr = peekCurrentMenu();
if (_curr.id == this.id)
popCurrentMenu();
}
if (( ! oBrowser.isIE55 ) && ( typeof this.layer == "object" )) 
this.layer.hide();
}
function menuItem(parent, id, Label, Img, Href, callExit, actKey, idx_str)
{
this.classname = null;
this.parent = parent;
this.id = id;
this.next_avail = false;
if (nonLatinFlag &&
(typeof idx_str == "undefined"))
{
this.next_avail = true;
idx_str = Label;
}
if (!nonLatinFlag)
idx_str = Label;
idx_str = idx_str.replace(/%\d/g, "");
this.idx_str = idx_str;
this.label = Label;
this.isActive = true;
this.isHidden = false;
if ( typeof actKey == "string" &&
actKey.length == 1 )
this.actKey = actKey;
else
this.actKey = "";
if (typeof Img == "string" && Img.length > 0)
this.img = Img;
if (typeof Href == "string" && Href.length > 0)
this.href = Href;
if (typeof callExit == "boolean")
this.callExit = callExit;
}
menuItem.prototype.type = "item";
menuItem.prototype.parent = void(0);
menuItem.prototype.id = "";
menuItem.prototype.label = "";
menuItem.prototype.img = "";
menuItem.prototype.href = "";
menuItem.prototype.callExit = true;
function menuBarMouseOut(ev)
{
var _m = void(0);
window.status = window.defaultStatus;
if ( __menuBar.mouseoverMenus ) {
if ( oBrowser.isIE55 && typeof __menuBar == "object" ) {
ev = window.event;
_m = ev.srcElement;
if ( _m.tagName != "A" )
_m = _m.parentElement;
if ( typeof _m == "object" && _m.id.match(/menu_(\d+)/) ) {
_m = __menuBar.menus[RegExp.$1];
__menuBar.autohideTimeout = window.setTimeout("ie55MenuHide(" +
_m.mnum + ")", 100 );
_m.showMenuDelay = 0;
}
}
else 
{
_m = ev.currentTarget;
if ( _m.tagName != "A" )
_m = _m.parentElement;
if ( typeof _m == "object" && _m.id.match(/menu_(\d+)/) ) { 
_m = __menuBar.menus[RegExp.$1];
_m.showMenuDelay = 0;
}
}
}
return true;
}
function menuBarClick(ev)
{
return false;
}
function menuBarWindowMouseMove(ev)
{
var win = window;
var x, y;
var width, height;
var _mB;
if (oBrowser.isIE)
ev = win.event;
if (oBrowser.supportsDOM >= 2)
{
x = ev.clientX;
y = ev.clientY;
width = win.document.getElementById("idMenuBar").offsetWidth;
height = win.document.getElementById("idMenuBar").offsetHeight;
_mB = win.document.getElementById("idMenuBar").menuBar;
}
else if (oBrowser.supportsLayers)
{
x = ev.x;
y = ev.y;
width = win.document.layers["idMenuBar"].clip.width;
height = win.document.layers["idMenuBar"].clip.height;
_mB = win.document.layers["idMenuBar"].menuBar;
}
else
{
x = ev.clientX;
y = ev.clientY;
width = win.document.all["idMenuBar"].offsetWidth;
height = win.document.all["idMenuBar"].offsetHeight;
_mB = win.document.all["idMenuBar"].menuBar;
}
if (x <= 0 || x >= width || y <= 0)
{
if (typeof _mB == "object" && _mB != void(0) && _mB.current != void(0))
_mB.current.hide();
}
if (oBrowser.supportsLayers)
win.routeEvent(ev);
return true;
}
function setActKeyMenuState( num, startInum )
{
if (action_in_progress()) return;
if ( typeof __menuBar == "object" &&
typeof num == "number" &&
num < __menuBar.menus.length ) {
if ( typeof __menuBar.autohideTimeout != "undefined" ) {
window.clearTimeout(__menuBar.autohideTimeout);
__menuBar.autohideTimeout = void(0);
}
var actKeyMenuState = __menuBar.actKeyMenuState;
if ( typeof actKeyMenuState == "object" &&
typeof actKeyMenuState.active != "undefined" &&
actKeyMenuState.active ) {
try {
if ( oBrowser.isIE55 &&
typeof actKeyMenuState.popup == "object" &&
! actKeyMenuState.popup.isOpen )
actKeyMenuState.mnum = -1;
} catch(e) {
if ( oBrowser.isIE55 &&
typeof actKeyMenuState.popup == "object" )
actKeyMenuState.mnum = -1;
}
var curr_mnum = actKeyMenuState.mnum;
if ( curr_mnum == num )
return;
if ( curr_mnum >= 0 &&
curr_mnum < __menuBar.menus.length )
__menuBar.menus[curr_mnum].hide();
}
if ( typeof startInum != "number" )
startInum = 0;
var menu = __menuBar.menus[num];
actKeyMenuState.active = true;
actKeyMenuState.menu = menu;
actKeyMenuState.inum = startInum;
actKeyMenuState.mnum = num;
if ( __menuBar.WinFocus )
__menuBar.owningWindow.focus();
__menuBar.owningWindow.setTempKeyDownHandler(actKeyMenuKeyDown);
var e = __menuBar.window.document.getElementById(menu.tdId);
var left = e.offsetLeft;
menu.show(left,menu.menuTop);
if ( startInum >= 0 ) {
var item = menu.items[startInum];
if ( typeof item == "object" ) {
var w = ( oBrowser.isIE55 ? actKeyMenuState.popup : menu.displaywindow );
if ( typeof w == "object" && w != null && w.isOpen ) {
var e = w.document.getElementById(item.tdId);
if ( e != null ) {
e.className = "menubar_selected_background";
if ( typeof e.anchor == "object" )
e.anchor.className = "menu_selected_text";
}
}
}
}
}
}
function cancelActKeyMenuState()
{
var actKeyMenuState = __menuBar.actKeyMenuState;
if ( typeof actKeyMenuState == "object" &&
actKeyMenuState.active ) {
actKeyMenuState.active = false;
var e = __menuBar.window.document.getElementById(actKeyMenuState.menu.tdId);
if ( e != null ) {
e.className = "menubar_unselected_background";
if ( typeof e.anchor == "object" )
e.anchor.className = "menu_unselected_text";
}
__menuBar.owningWindow.setTempKeyDownHandler(null);
if ( actKeyMenuState.inum >= 0 &&
! ahdtop.cstUsingScreenReader ) {
var item = actKeyMenuState.menu.items[actKeyMenuState.inum];
if ( typeof item == "object" ) {
var w = ( oBrowser.isIE55 ? actKeyMenuState.popup : item.parent.displaywindow );
e = w.document.getElementById(item.tdId);
if ( e != null ) {
e.className = "menubar_unselected_background";
if ( typeof e.anchor == "object" )
e.anchor.className = "menu_unselected_text";
}
}
}
if ( oBrowser.isIE55 && 
typeof actKeyMenuState.popup == "object" ) {
actKeyMenuState.popup.hide();
actKeyMenuState.popup = void(0);
actKeyMenuState.mnum = -1;
}
}
}
function actKeyMenuKeyDown(active_element,keycode,shiftKey,altKey)
{
var actKeyMenuState = __menuBar.actKeyMenuState;
if ( typeof actKeyMenuState == "object" &&
actKeyMenuState.active ) {
if ( oBrowser.isIE55 &&
( typeof actKeyMenuState.popup != "object" ||
! actKeyMenuState.popup.isOpen ) ) {
cancelActKeyMenuState();
return true;
}
var menu = actKeyMenuState.menu;
var inum = actKeyMenuState.inum;
var mnum = actKeyMenuState.mnum;
var w = menu.parent.owningWindow;
var new_inum = inum;
var new_mnum = mnum;
if ( keycode == TAB )
keycode = ( shiftKey ? ARROW_LEFT : ARROW_RIGHT );
switch ( keycode ) {
case ARROW_UP:
if ( inum > 0 )
new_inum = inum - 1;
break;
case ARROW_DOWN:
if ( inum < menu.items.length - 1 )
new_inum = inum +1;
break;
case ARROW_RIGHT:
if ( mnum < __menuBar.menus.length - 1 )
new_mnum = mnum + 1;
break;
case ARROW_LEFT:
if ( mnum > 0 )
new_mnum = mnum - 1;
break;
case ESC:
menu.hide();
break;
case ENTER:
menu.hide(); 
w.document.location.href = "javascript:" + nx_escape(menu.items[inum].href);
break;
default:
var key = String.fromCharCode(keycode).toUpperCase();
var posn = menu.itemActKey.indexOf(key);
if ( posn != -1 ) {
if ( altKey && typeof __menuBar == "object" )
__menuBar.altKeyAction = true;
menu.hide();
w.document.location.href = "javascript:" + nx_escape(menu.items[posn].href);
}
break;
}
if ( mnum != new_mnum ) {
setActKeyMenuState(new_mnum);
}
else if ( inum != new_inum ) {
var e;
var w = ( oBrowser.isIE55 ? __menuBar.actKeyMenuState.popup : menu.displaywindow );
if ( inum >= 0 ) {
if (oBrowser.isIE55)
e = w.document.getElementById(menu.items[inum].tdId);
else
e = menu.items[inum].classname;
if ( e != null ) {
e.className = "menubar_unselected_background";
if ( typeof e.anchor == "object" )
e.anchor.className = "menu_unselected_text";
}
}
if (oBrowser.isIE55)
e = w.document.getElementById(menu.items[new_inum].tdId);
else
e = menu.items[new_inum].classname;
if ( e != null ) {
e.className = "menubar_selected_background";
if ( typeof e.anchor == "object" )
e.anchor.className = "menu_selected_text";
}
actKeyMenuState.inum = new_inum; 
}
return false;
}
return true;
}
function delay_show(num, startInum)
{
var menu = __menuBar.menus[num];
if (menu.showMenuDelay)
{
setActKeyMenuState(num, startInum);
}
menu.showMenuDelay = 0;
}
function menuBarMouseOver(ev)
{ 
var _m;
var left, top;
top = 0;
if (oBrowser.isIE)
{
ev = window.event;
_m = ev.srcElement;
if ( _m.tagName != "A" )
_m = _m.parentElement;
if ( typeof _m == "object" && _m.id.match(/menu_(\d+)/) ) {
left = _m.offsetLeft;
_m = __menuBar.menus[RegExp.$1];
}
}
else 
{
_m = ev.currentTarget;
if ( _m.tagName != "A" )
_m = _m.parentElement;
if ( typeof _m == "object" && _m.id.match(/menu_(\d+)/) ) { 
left = _m.offsetLeft;
_m = __menuBar.menus[RegExp.$1];
_m.showMenuDelay = 0;
}
}
if ( typeof _m == "object" &&
( window.currentMenu.length == 0 ||
_m != window.currentMenu[window.currentMenu.length - 1] ) ) {
if ( __menuBar.mouseoverMenus ) {
_m.showMenuDelay = 1;
window.setTimeout("delay_show(" + _m.mnum + ", -1)", 500);
}
else {
window.status = _m.label;
}
}
return true;
}
function windowMouseMove(ev)
{
var x, y;
var left, top;
var width, height;
if (isCurrentMenuEmpty() == true)
{
if (oBrowser.supportsLayers == true )
window.routeEvent(ev);
return;
}
var _curr = peekCurrentMenu();
if (_curr != void(0))
{ 
if (oBrowser.isIE == true)
ev = window.event;
if (oBrowser.supportsDOM >= 2 || oBrowser.isIE == true)
{ 
x = ev.clientX;
y = ev.clientY;
left = _curr.layer.layer.offsetLeft;
top = _curr.layer.layer.offsetTop;
if ( oBrowser.isIE )
{
x += document.body.scrollLeft;
y += document.body.scrollTop;
}
else {
x += window.pageXOffset;
y += window.pageYOffset;
}
width = _curr.layer.layer.offsetWidth;
height = _curr.layer.layer.offsetHeight;
}
else
{
x = ev.pageX;
y = ev.pageY;
left = _curr.layer.layer.left;
top = _curr.layer.layer.top;
width = _curr.layer.layer.clip.width;
height = _curr.layer.layer.clip.height;
}
if ( x <= left || x >= (left + width) || y >= (top + height) )
_curr.hide();
}
if (oBrowser.supportsLayers)
window.routeEvent(ev);
}
function hideMenus()
{
for (var i = 0; i < __menuBar.menus.length; i++)
__menuBar.menus[i].hide();
}
function closeCurrentMenu(num)
{
if (isCurrentMenuEmpty() == false) {
var _curr = peekCurrentMenu();
if (typeof _curr.hide == "function")
_curr.hide();
}
else if ( oBrowser.isIE55 ) {
var menu = __menuBar.menus[num];
var actKeyMenuState = __menuBar.actKeyMenuState;
actKeyMenuState.active = true;
actKeyMenuState.menu = menu;
cancelActKeyMenuState();
}
}
function menuBarDefaultHandler(ev)
{
return true;
}
function callMenuItem(href)
{
if (ahdframeset != ahdtop && 
typeof ahdframe.find_menubar_from_popup == "string" &&
ahdframe.find_menubar_from_popup == "1" && 
typeof ahdtop.role_menubar_flag == "number")
ahdtop.role_menubar_flag = 1;
eval(href);
if (ahdframeset != ahdtop &&
typeof ahdtop.role_menubar_flag == "number")
ahdtop.role_menubar_flag = 0;
}
function addMenuItem(name, actKey)
{
if ( typeof __menuBar != "object" )
__menuBar = new MenuBar();
var n = __menuBar.menus.length;
if ( typeof actKey == "string" &&
actKey.length > 0 )
name += "[" + actKey + "]";
__menuBar.addMenu("idUserMenu"+n, name, "", "", false);
}
function addSubMenuItem(name, script, actKey)
{
if (typeof __menuBar.current_menu == "undefined") return; 
var m = __menuBar.current_menu;
var n1 = m.items.length;
if ( typeof actKey == "string" &&
actKey.length > 0 )
name += "[" + actKey + "]";
m.addItem("idUserSubmenu" + m.item_num + "_" + n1,
name, "", script, false);
}
function addSubMenuItemLocal(name, script, actKey)
{
if (typeof __menuBar.current_menu == "undefined") return; 
var m = __menuBar.current_menu;
var n1 = m.items.length;
if ( typeof actKey == "string" &&
actKey.length > 0 )
name += "[" + actKey + "]";
m.addInternalItem("idUserSubmenu" + m.item_num + "_" + n1,
name, "", "javascript:" + script, false);
}
function finishMenus()
{
if (typeof window.location == "undefined")
window.setTimeout("finishMenus();", 250);
else
{
var url = window.location.href;
var form = "";
if (url.match(/menubar.htmp?l/))
{
if (typeof window.isLoaded != "boolean" ||
window.isLoaded == false ||
__menuBar.init(window) == false)
window.setTimeout("finishMenus();", 250);
else
{
__menuBar.deferSetupCompletion = false;
__menuBar.clear();
__menuBar.draw();
}
}
}
}
function invokeMenuItem(to_do)
{
if (OverRideLock != null)
to_do += "+OVERRIDE_LOCK=" + OverRideLock;
popup_window('', to_do, 650, 600);
}
function invokeProtectedMenuItem(to_do)
{
if ( action_in_progress() && ahdframe.currentAction != 0 )
return;
invokeMenuItem(to_do);
}
function getMenuBarDiv()
{
return document.getElementById("idMenuBar");
}
window.currentMenu = new Array();
function pushCurrentMenu(itm) {
for (var e = 0; e < window.currentMenu.length; e++)
if (window.currentMenu[e].id == itm.id)
alert("Please contact the site administrator: a loop was found in the menu system!");
window.currentMenu[window.currentMenu.length] = itm;
}
function popCurrentMenu() {
if (isCurrentMenuEmpty()) {
alert("Please contact the site administrator: an attempt was made to peek an empty menu stack!");
return void(0);
}
var _m = window.currentMenu[window.currentMenu.length - 1];
window.currentMenu.length--;
return _m;
}
function peekCurrentMenu() {
if (isCurrentMenuEmpty()) {
alert("Please contact the site administrator: an attempt was made to peek an empty menu stack!");
return void(0);
}
return window.currentMenu[window.currentMenu.length - 1];
}
function isCurrentMenuEmpty() {
if (window.currentMenu.length <= 0) {
window.currentMenu.length = 0;
return true;
}
else
return false;
}
Menu.prototype.activateSubItems = function()
{
if ( typeof this.items == "object" ) 
{
for ( var j = this.items.length - 1; j >= 0; j-- )
{
if ( typeof this.items[j] == "object" ) 
this.activateItem(this.items[j].id); 
}
}
}
Menu.prototype.deactivateSubItems = function()
{
if ( typeof this.items == "object" ) 
{
for ( var j = this.items.length - 1; j >= 0; j-- )
{
if ( typeof this.items[j] == "object" ) 
this.deactivateItem(this.items[j].id); 
}
}
}
Menu.prototype.activateItem = function( id )
{
this.buildItemsIfNecessary();
for ( var i = this.items.length - 1; i >= 0; i-- ) {
var _i = this.items[i];
if ( _i.id == id ) {
__menuBar.set_toolbar_icon_state(id, true);
if ( ! _i.isActive ) {
_i.isActive = true;
if ( ahdtop.cstUsingScreenReader )
this.rebuildScreenReaderMenu();
else {
var td = this.displaywindow.document.getElementById(_i.tdId);
var a = this.displaywindow.document.getElementById("a" + _i.id);
if ( a != null && td != null ) {
a.style.color = "";
a.href = _i.href_active; 
a.onclick = _i.a_onclick_active;
td.onclick = _i.td_onclick_active;
}
}
}
return;
}
}
}
Menu.prototype.deactivateItem = function( id )
{
this.buildItemsIfNecessary();
for ( var i = this.items.length - 1; i >= 0; i-- ) {
var _i = this.items[i];
if ( _i.id == id ) {
__menuBar.set_toolbar_icon_state(id, false);
if ( _i.isActive ) {
_i.isActive = false;
if ( ahdtop.cstUsingScreenReader )
this.rebuildScreenReaderMenu();
else {
var td = this.displaywindow.document.getElementById(_i.tdId);
var a = this.displaywindow.document.getElementById("a" + _i.id);
if ( a != null && td != null ) {
a.style.color = "gray";
a.href = "javascript:void(0)";
a.onclick = "return false;";
td.onclick = "return false;"
}
}
}
return;
}
}
}
Menu.prototype.isItemActive = function( id )
{
if ( ! this.isActive )
return false;
for ( var i = this.items.length - 1; i >= 0; i-- ) {
if ( this.items[i].id == id ) {
return this.items[i].isActive;
}
}
return true;
}
Menu.prototype.showItem = function( id )
{
this.buildItemsIfNecessary();
for ( var i = this.items.length - 1; i >= 0; i-- ) {
var _i = this.items[i];
if ( _i.id == id ) {
__menuBar.set_toolbar_icon_state(id, true);
if ( _i.isHidden ) {
_i.isHidden = false;
if ( ahdtop.cstUsingScreenReader )
this.rebuildScreenReaderMenu();
else {
var td = this.displaywindow.document.getElementById(_i.tdId);
var a = this.displaywindow.document.getElementById("a" + _i.id);
var tr = this.displaywindow.document.getElementById("tr" + _i.id);
if ( a != null && td != null && tr != null ) {
tr.style.display = "";
a.href = _i.href_active; 
a.onclick = _i.a_onclick_active;
td.onclick = _i.td_onclick_active;
}
}
}
return;
}
}
}
Menu.prototype.hideItem = function( id )
{
this.buildItemsIfNecessary();
for ( var i = this.items.length - 1; i >= 0; i-- ) {
var _i = this.items[i];
if ( _i.id == id ) {
__menuBar.set_toolbar_icon_state(id, false);
if ( ! _i.isHidden ) {
_i.isHidden = true;
if ( ahdtop.cstUsingScreenReader )
this.rebuildScreenReaderMenu();
else {
var td = this.displaywindow.document.getElementById(_i.tdId);
var a = this.displaywindow.document.getElementById("a" + _i.id);
var tr = this.displaywindow.document.getElementById("tr" + _i.id);
if ( a != null && td != null && tr != null ) {
tr.style.display = "none";
a.href = "javascript:void(0)";
a.onclick = "return false;";
td.onclick = "return false;";
}
}
}
return;
}
}
}
Menu.prototype.changeImage = function( id, img )
{
this.buildItemsIfNecessary();
for ( var i = this.items.length - 1; i >= 0; i-- ) {
var _i = this.items[i];
if ( _i.id == id ) {
_i.img = img;
if ( ! _i.isHidden ) {
var oImg = this.displaywindow.document.getElementById("img" + _i.id);
if ( oImg != null ) {
oImg.src = img;
}
}
return;
}
}
}
Menu.prototype.buildScreenReaderMenu = function(doc)
{
var resultmenu;
var select = doc.createElement("select");
this.selectId = "menu_" + this.mnum + "_select";
select.id = this.selectId;
select.tabIndex = 2;
var title = msgtext("%1_Menu", this.label);
select.options[0] = new Option( title, "", true, true );
select.title = title;
if ( this.mnum == 0 || this.hotkey.length > 0 )
{ 
resultmenu = doc.createElement("label");
if ( this.mnum == 0 )
{
resultmenu.accessKey = msgtext("M");
}
else
{
resultmenu.accessKey = this.hotkey.substring(0,1);
}
resultmenu.appendChild( select );
}
else
{
resultmenu = select;
}
this.buildItemsIfNecessary();
var len = this.items.length;
for ( var i = 0; i < len; i++ ) {
var item = this.items[i];
if ( item.isActive && ! item.isHidden ) {
var option = new Option( item.label, item.href );
select.options[select.options.length] = option;
}
}
select.onfocus = function() {
this.selectedIndex = 0;
}
select.onblur = function() {
this.selectedIndex = 0;
};
select.onclick = function() {
if ( this.selectedIndex != 0 )
__menuBar.owningWindow.callMenuItem(this.options[this.selectedIndex].value);
};
select.onkeypress = function(e) {
if ( oBrowser.isIE )
e = window.event;
if ( e.keyCode == ENTER &&
this.selectedIndex != 0 )
__menuBar.owningWindow.callMenuItem(this.options[this.selectedIndex].value);
};
return resultmenu;
}
Menu.prototype.rebuildScreenReaderMenu = function()
{
var sel = this.parent.window.document.getElementById(this.selectId);
if ( sel != null ) {
sel.options.length = 1;
var itemCount = this.items.length;
for ( var i = 0; i < itemCount; i++ ) {
var item = this.items[i];
if ( item.isActive && ! item.isHidden ) {
var option = new Option( item.label, item.href );
sel.options[sel.options.length] = option;
}
}
}
}
// Copyright (c) 2005 CA.  All rights reserved.
var pb_field_name;
var pb_form_name;
var pb_id_val = "";
var pb_name_val = "";
var pb_window_features = "scrollbars,resizable,width=950,height=700";
var profile_browser_window = null;
function profile_search()
{
actKeyWinUnload(); 
profile_browser("search");
}
function find_role_menubar()
{
var ret_menubar = "";
if (typeof ahdframe != "undefined" && 
typeof ahdframeset != "undefined")
{
var w = ahdframe;
while (1)
{
if (typeof w.propRoleMenubar == "string" && 
w.propRoleMenubar.length > 0)
{
ret_menubar = w.propRoleMenubar;
break; 
}
if (w == ahdframeset) break;
w = w.parent; 
}
}
return ret_menubar; 
}
function profile_browser( cnt_persid, factory_text,FromGoBtn, call_req_id )
{
var ahdtop = get_ahdtop(true);
if ( window.name != "AHDtop" ) {
if ( typeof ahdtop == "object" )
{
if (typeof propRoleMenubar == "string" && 
propRoleMenubar.length > 0)
{
ahdtop.go_role_menubar = propRoleMenubar;
}
ahdtop.profile_browser( cnt_persid, factory_text,FromGoBtn, call_req_id );
}
}
else {
ahdtop.pb_args = new profile_browser_args(cnt_persid, factory_text,FromGoBtn, call_req_id);
if ( cnt_persid.match(/^cnt:/) && ! cnt_persid.match(/^cnt:\w{32}/) ) {
if (FromGoBtn == 1) {
upd_workframe("PB_COUNT_CNT_DOBS", "IN_PERSID=" + cnt_persid, "FromGoBtn=1","FACTORY=cnt", "callback_func=parent.ahdframe.profile_browser_cnt_cb");
}	
else {
upd_workframe("PB_COUNT_CNT_DOBS", "IN_PERSID=" + cnt_persid, "FACTORY=cnt", "callback_func=parent.ahdframe.profile_browser_cnt_cb");
}
}
else {
if ( cnt_persid.match(/^cnt:\w{32}/) ) {
profile_browser_cnt_cb(1, cnt_persid);
}
else {
profile_browser_cnt_cb(0);
}
}
}
}
var cb_after_showing_pb = void(0);
function find_unselected_tab(pattern, cb_func)
{
if (typeof ahdtop.toolbarTab != "undefined")
{
var tb = ahdtop.toolbarTab;
var pat_upper = pattern.toUpperCase();
var src_upper;
for (i = 0; i < tb.length; i++)
{
src_upper = tb[i].src.toUpperCase();
if (src_upper.indexOf(pat_upper) >= 0)
{
if(typeof ahdtop.toolbar != "undefined")
{
var func = "ahdtop.toolbar.tabClick('" + tb[i].id + "');";
if (typeof cb_func != "undefined")
{
if (typeof tb[i].loaded != "boolean" || 
!tb[i].loaded)
ahdtop.cb_after_showing_pb = cb_func;
else 
func += cb_func;
}
setTimeout(func, 500);
return 1;
}
}
} 
}
return 0;
}
function is_tab_selected( pattern )
{
var result = false;
if ( typeof ahdtop != "object" || ahdtop == null )
ahdtop = get_ahdtop();
if ( typeof ahdtop.toolbarTab != "undefined" )
{
var tb = ahdtop.toolbarTab;
var pat_upper = pattern.toUpperCase();
var src_upper;
var iCurTab;
for (iCurTab = 0; iCurTab < tb.length; iCurTab++)
{
src_upper = tb[iCurTab].src.toUpperCase();
if ( src_upper.indexOf( pat_upper ) >= 0 )
{
if ( iCurTab == ahdtop.toolbarCurrentTab )
{
result = true;
}
break;
}
} 
}
return result;
}
function profile_browser_cnt_cb(cnt_count, cnt_pid, pb_window_name)
{
var factory_text = ahdtop.pb_args.factory_text;
var FromGoBtn = ahdtop.pb_args.FromGoBtn;
var call_req_id = ahdtop.pb_args.call_req_id;
var cnt_persid = ahdtop.pb_args.cnt_persid;
ahdtop.pb_args.cnt_count = cnt_count;
if ( cnt_count == 1 && cnt_pid.match(/^cnt:\w{32}/) ) {
cnt_persid = cnt_pid;
}
if ( typeof ahdtop == "object" ) {
profile_browser_window = find_popup_window("profile_browser");
if (profile_browser_window == null)
{
if ( (ahdtop.ahdframe.parent.name == "pbwindow_menuOK")||
( typeof pb_window_name != "undefined" && 
ahdtop.ahdframe.parent.name == pb_window_name ) )
{
profile_browser_window = ahdtop.ahdframe.parent;
}
else
{
var func = "profile_browser_cnt_cb(";
var cnt_added = 0;
var pid_added = 0;
if (typeof cnt_count != "undefined")
{
func += cnt_count;
cnt_added = 1;
}
if (typeof cnt_pid == "string")
{
if (!cnt_added)
func += "void(0),";
else
func += ",";
func += "'" + cnt_pid + "'"; 
pid_added = 1;
}
if ( ahdtop.cstUsingScreenReader )
{
if ( !pid_added )
{
if ( !cnt_added )
func += "void(0),";
else
func += ",";
func += "void(0)";
}
func += ",'role_main'";
}
func += ");";
if (find_unselected_tab("HTMPL=profile_browser.htmpl", func))
{
if ( ahdtop.cstUsingScreenReader && 
typeof ahdtop.cb_after_showing_pb == "undefined" &&
!is_tab_selected( "HTMPL=profile_browser.htmpl" ) )
{
ahdtop.cb_after_showing_pb = func;
}
return;
}
}
}
if ( profile_browser_window != null && ! profile_browser_window.closed ) {
profile_browser_window.profile_start(cnt_persid);
}
else {
ahdtop.pb_initial_persid = cnt_persid;
var form = "profile_browser.htmpl";
var url = cfgCgi + "?SID=" + cfgSID + "+FID=" + fid_generator() +
'+OP=DISPLAY_FORM+HTMPL=' + form;
if (FromGoBtn == 1)
url += "+KEEP.FromGoBtn=1";
if ( typeof factory_text == "string" && factory_text.length > 0 )
url += "+FACTORY_TEXT=" + nx_escape(factory_text);
var posn = ( _browser.supportsLayers ?
",screenX=10,screenY=10" :
",left=10,top=10" );
var w_name = get_popup_window_name("profile_browser");
url += "+KEEP.POPUP_NAME=" + w_name;
if(typeof call_req_id=="string" && call_req_id !="")
url+="+SD_LAUNCHED=" + call_req_id; 
var features = pb_window_features + posn;
if ( ahdtop.propDebugOptions != "" )
features = modifyWindowFeaturesForDebug(features);
if (typeof go_role_menubar == "string" && 
go_role_menubar.length > 0 &&
url.indexOf("prop.role_menubar=") < 0)
{
url += "+prop.role_menubar=" + go_role_menubar; 
go_role_menubar = void(0);
}
else 
{
var role_menubar = find_role_menubar();
if (role_menubar.length > 0 &&
url.indexOf("prop.role_menubar=") < 0)
url += "+prop.role_menubar=" + role_menubar;
}
profile_browser_window = window.open( url, "", features ); 
if (!check_popup_blocker(profile_browser_window))
return;
if (typeof profile_browser_window == "object" && profile_browser_window != null) 
{ 
profile_browser_window.name = w_name; 
}
register_window(profile_browser_window, w_name);
}
}
next_workframe("UPD_WORKFRAME");
}
function edit_profile_browser( attr_name, attr_value )
{
if (typeof currentAction != "undefined" && 
currentAction == ACTN_AUTOFILL)
return;
var ahdtop = get_ahdtop();
if ( typeof ahdtop == "object" ) {
ahdtop.edit_profile_browser_opener = window;
autoset_caller_name = true;
}
var arg = "search";
if ( ! attr_value.match(/^[, ]*$/) ) {
if ( attr_value.match(/^\\([\w*%\?])/) )
arg = "cnt:userid:" + RegExp.$1;
else
switch( attr_name ) {
case "id": arg = "cnt:" + attr_value; break;
case "persistent_id": arg = attr_value; break;
default: arg = "cnt:" + attr_name + ":" + attr_value;
}
}
profile_browser(arg);
var w_name = popup_window_name("profile_browser");
var pb_window = ahdtop.AHD_Windows[w_name];
if (typeof pb_window == "object" && pb_window != null )
{
var can_set_focus;
try 
{
if ( pb_window.type != "hidden" && pb_window.style.display != "none" ) 
can_set_focus = true;
else
can_set_focus = false;
}
catch(ex)
{
can_set_focus = false;
}
if ( can_set_focus )
{
pb_window.focus(); 
}
}
}
function set_ahdframe_in_tab (pb_window)
{
var tb = ahdtop.toolbarTab;
var idx = ahdtop.toolbarCurrentTab;
if ((typeof tb == "object") &&
(typeof idx != "undefined") &&
(idx >= 0) &&
(idx < tb.length) &&
typeof tb[idx].iframe == "object" && 
tb[idx].iframe != null)
tb[idx].iframe.ahdframe = pb_window.ahdframe;
}
function profile_start(in_persid,FromGoBtn)
{
if ( typeof ahdtop != "object" || ahdtop == null )
ahdtop = get_ahdtop();
if (typeof ahdtop.cb_after_showing_pb != "undefined")
{
if ( is_tab_selected( "HTMPL=profile_browser.htmpl" ) )
{
var process_callback = true;
var w_name = popup_window_name("profile_browser");
if ( w_name == "profile_browser" )
{
var pb_window = ahdtop.AHD_Windows[w_name];
if ( ( typeof pb_window != "undefined" ) && 
( typeof pb_window.ahdframe != "undefined" ) )
{
try {
var temp = pb_window.ahdframe;
} 
catch (ex)
{
process_callback = false;
}
}
else
{
process_callback = false;
}
}
if ( process_callback )
{
var temp = ahdtop.cb_after_showing_pb;
ahdtop.cb_after_showing_pb = void(0);
ahdtop.eval(temp);
}
}
return;
}
var w_name = popup_window_name("profile_browser");
var pb_window = ahdtop.AHD_Windows[w_name];
if ((typeof pb_window == "object") && 
(w_name == "profile_browser"))
{
set_ahdframe_in_tab(pb_window);
}
if ( typeof pb_window == "object" &&
pb_window != null &&
pb_window != window ) {
pb_window.menu = window.menu;
pb_window.page = window.page;
pb_window.scratchpad = window.scratchpad;
window.workframe = pb_window.workframe;
if ( typeof pb_window.pbwindow == "object" ) {
pb_window.pbwindow.menu = window.menu;
pb_window.pbwindow.page = window.page;
pb_window.pbwindow.scratchpad = window.scratchpad;
}
}
if ( typeof in_persid != "string" || 
in_persid == "" ) {
var ahdtop = get_ahdtop();
if ( typeof ahdtop != "object" ||
typeof ahdtop.pb_initial_persid != "string" )
{
if ((typeof ahdtop == "object") && 
(typeof ahdtop.pb_refresh_urls == "object"))
{
if (typeof window.page == "object")
window.page.location.href = ahdtop.pb_refresh_urls["page"];
if (typeof window.menu == "object")
{
setTimeout("window.menu.location.href = '" + 
ahdtop.pb_refresh_urls["menu"] + "'", 
500);
}
ahdtop.pb_refresh_urls = void(0);
var w_name = get_popup_window_name("profile_browser");
ahdframeset.name = w_name;
ahdtop.AHD_Windows[w_name]= ahdframeset;
ahdframeset.page = window.page;
ahdframeset.menu = window.menu;
}
return;
}
in_persid = ahdtop.pb_initial_persid;
ahdtop.pb_initial_persid = false;
}
if ( in_persid == "search" ) {
var url = cfgCgi + "?SID=" + cfgSID + "+FID=" + fid_generator() +
"+FACTORY=cnt+OP=SEARCH+" +
"+KEEP.IsProfileBrowser=1" +
"+KEEP.IsPopUp=1" + 
"+KEEP.backfill_field=KEY.profile_search" +
"+KEEP.backfill_form=globals" +
"+KEEP.Is3FieldContact=0";
display_new_page(url,pb_window.page);
}
else if ( typeof window.menu == "object" && 
typeof window.menu.persid == "string" && 
window.menu.persid == in_persid ) {
if (window.page.propFormName != "profile_infocnt.htmpl")
item_click('profile_infocnt.htmpl', in_persid);
pb_check_for_editwin();
}
else {
if ( in_persid.match(/cnt:combo_name:(.*)$/) ) {
var combo_name = RegExp.$1;
if ( combo_name.match(/ *([^,]*) *, *([^,]*) *, *(.*) *$/) ) {
combo_name = RegExp.$1;
if ( RegExp.$2.length > 0 && RegExp.$3.length > 0 )
combo_name += ", " + RegExp.$2 + " " + RegExp.$3;
else if ( RegExp.$2.length > 0 || RegExp.$3.length > 0 )
combo_name += ", " + RegExp.$2 + RegExp.$3;
}
if ( combo_name == window.menu.combo_name ) {
pb_check_for_editwin();
window.focus();
return;
}
}
pb_refresh(in_persid,FromGoBtn);
}
window.focus();
}
function profile_reset_if_necessary(persid)
{
var ahdtop = get_ahdtop();
var w_name = popup_window_name("profile_browser");
if ( typeof ahdtop == "object" &&
typeof ahdtop.AHD_Windows[w_name] == "object" &&
! ahdtop.AHD_Windows[w_name].closed ) {
var pb_window = ahdtop.AHD_Windows[w_name];
if ( typeof pb_window.menu.persid == "string" &&
pb_window.menu.persid == persid &&
typeof pb_window.closePopup != "undefined" &&
pb_window.closePopup == 1 ) {
pb_window.closePopup = 0;
pb_window.pb_refresh(persid);
pb_window.focus()
var win;
if (typeof window.parent == "object")
win = window.parent;
else
win = window;
if (typeof win.doClose == "function" )
win.doClose();
else
win.close();
}
}
}
function pb_refresh(persid,FromGoBtn)
{
var esc_persid = nx_escape(persid);
var modified_persid= esc_persid.replace(/\+/,"%2B");
var url = cfgCgi + "?SID=" + cfgSID + "+FID=" + fid_generator() +
"+FACTORY=cnt+OP=GET_DOB+" +
"PERSID=" + modified_persid;
if ( persid.match(/^cnt:/) && 
((typeof ahdtop.pb_args == "object" && ahdtop.pb_args.cnt_count == "1") || 
persid.match(/^cnt:\w{32}/)) ) {
url += "+HTMPL=profile_menu.htmpl+get_pref_doc=1";
item_click('profile_infocnt.htmpl', persid);
setTimeout("replace_page('" + url + "', window.menu)", 500); 
}
else {
url += "+HTMPL=profile_infocnt.htmpl" +
"+KEEP.IsProfileBrowser=1" +
"+KEEP.IsPopUp=1" + 
"+KEEP.backfill_field=KEY.profile_search" +
"+KEEP.backfill_form=globals" +
"+KEEP.Is3FieldContact=0";
if (FromGoBtn == 1)
url += "+KEEP.FromGoBtn=1";
window.menu_reload_required = true;
replace_page(url,window.page);
}
}
function item_click(html, in_persid, fac, qbe)
{
var page_frame = window.parent.page;
if ( typeof page_frame != "object" )
page_frame = window.page;
if ( typeof page_frame == "object" ) {
if ( typeof page_frame.action_in_progress != "undefined" ) {
if ( page_frame.action_in_progress() &&
page_frame.currentAction != 0 )
return;
page_frame.set_action_in_progress(ACTN_LOADFORM);
}
var query_string = cfgCgi + "?SID=" + cfgSID +
"+FID=" + fid_generator();
if ( typeof qbe == "string" && qbe.length > 0 )
query_string += "+OP=SEARCH+" + qbe + "+FACTORY=" + fac;
else {
var esc_in_persid = nx_escape(in_persid);
var modified_in_persid = esc_in_persid.replace(/\+/,"%2B");
query_string += "+OP=GET_DOB+PERSID=" + modified_in_persid;
}
query_string += "+HTMPL=" + html;
if(find_unselected_tab("HTMPL=profile_browser.htmpl"))
{
if ( typeof menu == "object" && 
typeof menu.argTenantId == "string" &&
menu.argTenantId.length > 0 )
query_string += "+pbTenant=" + menu.argTenantId;
}
else{
if ( typeof parent.menu == "object" && 
typeof parent.menu.argTenantId == "string" &&
parent.menu.argTenantId.length > 0 )
query_string += "+pbTenant=" + parent.menu.argTenantId;
}
replace_page(query_string, page_frame);
}
}
function env_item_click( fac, html, in_persid ) 
{
var page_frame = window.parent.page;
if ( typeof page_frame != "object" )
page_frame = window.page;
if ( typeof page_frame == "object" ) {
if ( typeof page_frame.action_in_progress != "undefined" ) {
if ( page_frame.action_in_progress() &&
page_frame.currentAction != 0 )
return;
page_frame.set_action_in_progress(ACTN_LOADFORM);
}
var url = cfgCgi + "?SID=" + cfgSID + "+FID=" + fid_generator() +
'+OP=SHOW_DETAIL+HTMPL=' + html +
'+FACTORY=' + fac + '+PERSID=' + nx_escape(in_persid);
replace_page(url,page_frame);
}
}
function pb_keydown( active_element, keycode, shiftkey )
{
if ( typeof active_element == "object" &&
( shiftkey || active_element.type != "select-one" ) ) {
var id = active_element.id;
if ( typeof id != "string" )
id = "";
if ( id.match(/pbfld(\d*)/) || id.match(/pbfld(\d*)_lnk/)) {
var row = RegExp.$1 - 0;
switch ( keycode ) {
case ARROW_DOWN:
if ( id.match(/_lnk/) ) 
e = document.getElementById("pbfld" + row);
if ( typeof e != "object" || e == null )
e = document.getElementById("pbfld" + (row-1));
break;
case ARROW_UP:
if ( ! id.match(/_lnk/) ) 
e = document.getElementById("pbfld" + row + "_lnk");
if ( typeof e != "object" || e == null )
e = document.getElementById("pbfld" + (row-1));
break;
case ENTER:
if ( ! shiftkey )
break;
if ( typeof showCtxMenu != "function" )
return false;
case ARROW_RIGHT:
if ( typeof showCtxMenu == "function" ) {
showCtxMenu("mouseless",active_element,0);
return false;
}
case TAB:
if ( ! shiftkey &&
typeof active_element.name == "string" &&
active_element.name == "template_name" &&
active_element.value != "" )
{
var temp_obj = document.scrpadForm["SET.template_name"];
if (typeof temp_obj == "object")
temp_obj.value = ""; 
pb_select_template();
}
}
}
if ( shiftkey &&
( keycode == HOME || keycode == PAGE_UP ||
keycode == END || keycode == PAGE_DOWN ) ) {
var e = window;
if ( typeof window.parent.page == "object" )
e = window.parent.page;
if ( typeof e.propFormName == "string" &&
e.propFormName.substr(0,12) == "profile_hist" )
e = e.document.getElementById("rslnk_0_0");
else
e = e.document.getElementById("pbfld0");
switch ( keycode ) {
case HOME:
if ( typeof active_element.type == "string" &&
( active_element.type == "text" ||
active_element.type == "textarea" ) ) {
e = null;
break;
}
case PAGE_UP:
break;
case END:
if ( typeof active_element.type == "string" &&
( active_element.type == "text" ||
active_element.type == "textarea" ) ) {
e = null;
break;
}
case PAGE_DOWN:
if ( typeof e == "object" && e != null ) {
var next = e;
for ( var i = 1; next != null ; i++ ) {
e = next;
next = document.getElementById("pbfld" + i);
}
}
break;
}
}
if ( typeof e == "object" && e != null ) {
e.focus();
return false;
}
if ((keycode == ENTER) &&
(active_element.type == "text") && 
(typeof imgBtnDefault != "object"))
return false;
}
return true;
}
function pb_focus(name, name2)
{
var e = document.getElementById(name);
if ( typeof e != "object" || e == null ) {
var menu = parent.menu;
if ( typeof menu == "object" && menu != null ) {
if ( typeof name2 == "string" )
e = menu.document.getElementById(name2);
else
e = menu.document.getElementById(name);
}
}
try {
if ( e != null ) 
e.focus();
}
catch(e) {}
if ( name == "pbfld0" &&
typeof parent.menu == "object" &&
typeof parent.menu.loaded == "boolean" &&
typeof parent.scratchpad == "object" &&
typeof parent.scratchpad.loaded == "boolean")
{ 
if ((window.name != "scratchpad") &&
(parent.menu.loaded || parent.scratchpad.loaded))
{
if (typeof parent.scratchpad_desc == "string")
{
var text = parent.scratchpad.document.scrpadForm.pbfld100.value;
if (text != "")
parent.scratchpad_desc = text; 
}
// if (typeof parent.scratchpad_category == "string")
// {
// var text = parent.scratchpad.document.scrpadForm.pbfld103.value;
// if (text != "")
// parent.scratchpad_category = text; 
// }
lurl=parent.scratchpad.document.location.href;
if (lurl.indexOf("+force_refresh")<0)
lurl+="+force_refresh="+Math.floor(Math.random()*100);
else{
spos=lurl.indexOf("+force_refresh");
epos=lurl.indexOf("+", spos+1);
lurl=lurl.substring(0,spos)+"+force_refresh="+Math.floor(Math.random()*100); 
if(epos>0)
lurl=lurl.substring(0,spos)+"+force_refresh="+Math.floor(Math.random()*100)+lurl.substring(epos); 
}
parent.scratchpad.document.location.href=lurl;
}
else 
if (window.name == "scratchpad" && 
typeof parent.scratchpad_desc == "string" &&
parent.scratchpad_desc != "")
{
parent.scratchpad.document.scrpadForm.pbfld100.value =
parent.scratchpad_desc;
parent.scratchpad_desc = "";
}
// if (window.name == "scratchpad" && 
// typeof parent.scratchpad_category == "string" &&
// parent.scratchpad_category != "")
// {
// parent.scratchpad.document.scrpadForm.pbfld103.value =
// parent.scratchpad_category;
// parent.scratchpad_category = "";
// }
if (parent.menu.loaded &&
parent.scratchpad.loaded )
parent.scratchpad.pb_scratchpad_setup( parent.menu.call_type );
}
}
function load_from_scratchpad(id, check_ahdtop)
{
if ( ( typeof id == "string" && id != "0" ) ||
( typeof AlertMsg == "string" && AlertMsg.length > 0 ) ||
(document.getElementById("alertmsg").style.display == "block")) {
ImgBtnEnableButton("PROFILE_BROWSER");
ImgBtnEnableButton("PROFILE_BROWSER2");
return;
}
var ahdtop = get_ahdtop();
if (typeof "check_ahdtop" == "string" && "1" == check_ahdtop) {
var desc_elem = findElem("SET.description");
if (null != desc_elem && typeof ahdtop.PROF_BRWS_DESC == "string") {
desc_elem.value = msgtext("%1\n%2", ahdtop.PROF_BRWS_DESC, desc_elem.value);
ahdtop.PROF_BRWS_DESC = null;
ImgBtnEnableButton("PROFILE_BROWSER");
ImgBtnEnableButton("PROFILE_BROWSER2");	
return;
}
// var cat_elem = findelem("set.category");
// if (null != cat_elem && typeof ahdtop.prof_brws_desc == "string") {
// cat_elem.value = msgtext("%1\n%2", ahdtop.prof_brws_desc, cat_elem.value);
// ahdtop.prof_brws_desc = null;
// imgbtnenablebutton("profile_browser");
// imgbtnenablebutton("profile_browser2");	
// return;
// }
}
try {
var i, w = window;
while ( w.parent != w && typeof w.parent.name == "string" )
w = w.parent;
if (( typeof w.opener == "object" &&
w.opener != null &&
typeof w.opener.parent.scratchpad == "object" &&
typeof w.opener.parent.menu.id == "string" ) ||
ahdtop.cstReducePopups)
{
var pb, text;
if (ahdtop.cstReducePopups && typeof ahdtop.AHD_Windows.profile_browser != "undefined")
pb = ahdtop.ahdframeset.ahdframe.parent;
else
pb = w.opener.parent;
var text = pb.scratchpad.document.scrpadForm.pbfld100.value;
if ( typeof formEnduser != "object" )
formEnduser = new Array("n/a","n/a");
var names = "";
for ( i = 1; i < formEnduser.length; i++ ) {
if ( i == 1 )
names += formEnduser[i];
else
names += "|" + formEnduser[i];
}
var rxCust = new RegExp("(.*)(" + names + ")(.*)");
for ( i = 0; i < window.document.forms.length; i++ ) {
var f = window.document.forms[i];
	for ( var j = 0; j < f.elements.length; j++ ) {
	var e = f.elements[j];
		if ( e.type == "text" ||
		e.type == "hidden" ||
		e.type == "textarea" ) {
		if ( e.name == "SET.description" ||
		e.name == "SET.alg.description" ||
		e.name == "SET.issalg.description" ||
		e.name == "SET.chgalg.description") {
			if ( text.length > 0 )
				e.value = text;
			}
			else if ( f.name == formEnduser[0] &&
				e.name.match(rxCust) ) {
				var temp=RegExp.$1;
				var check=true;
				if(temp.substring(0,5)=="SET.z" || temp.substring(0,5)=="KEY.z")
				check=false;
				switch (RegExp.$3) {
					case "_fname": e.value = pb.menu.first_name; break;
					case "_lname": e.value = pb.menu.last_name; break;
					case "_mname": e.value = pb.menu.middle_name; break;
					default:
						switch ( RegExp.$1 ) {
							case "SET.": e.value = pb.menu.id; break;
							case "KEY.": e.value = ""; break;
							default: if(check == true) e.value = pb.menu.combo_name; break;
						}
				}
			}
		}
	}
}
//cat
// if (ahdtop.cstReducePopups && typeof ahdtop.AHD_Windows.profile_browser != "undefined")
// pb = ahdtop.ahdframeset.ahdframe.parent;
// else
// pb = w.opener.parent;
// var text = pb.scratchpad.document.scrpadForm.pbfld103.value;
// if ( typeof formEnduser != "object" )
// formEnduser = new Array("n/a","n/a");
// var names = "";
// for ( i = 1; i < formEnduser.length; i++ ) {
// if ( i == 1 )
// names += formEnduser[i];
// else
// names += "|" + formEnduser[i];
// }
// var rxCust = new RegExp("(.*)(" + names + ")(.*)");
// for ( i = 0; i < window.document.forms.length; i++ ) {
// var f = window.document.forms[i];
	// for ( var j = 0; j < f.elements.length; j++ ) {
	// var e = f.elements[j];
		// if ( e.type == "text" ||
		// e.type == "hidden" ||
		// e.type == "textarea" ) {
		// if ( e.name == "SET.category") {
			// if ( text.length > 0 )
				// e.value = text;
			// }
			// else if ( f.name == formEnduser[0] &&
				// e.name.match(rxCust) ) {
				// var temp=RegExp.$1;
				// var check=true;
				// if(temp.substring(0,5)=="SET.z" || temp.substring(0,5)=="KEY.z")
				// check=false;
				// switch (RegExp.$3) {
					// case "_fname": e.value = pb.menu.first_name; break;
					// case "_lname": e.value = pb.menu.last_name; break;
					// case "_mname": e.value = pb.menu.middle_name; break;
					// default:
						// switch ( RegExp.$1 ) {
							// case "SET.": e.value = pb.menu.id; break;
							// case "KEY.": e.value = ""; break;
							// default: if(check == true) e.value = pb.menu.combo_name; break;
						// }
				// }
			// }
		// }
	// }
// }
if ( typeof pb.menu.argTenantId == "string" &&
pb.menu.argTenantId.length > 0 )
{
if (typeof w.cai_main == "object" && w.cai_main != null && typeof w.cai_main.detailCopyTenant != "undefined") {
w.cai_main.detailCopyTenant( pb.menu );
}
else if (typeof window.detailCopyTenant != "undefined") {
window.detailCopyTenant( pb.menu );
}
}
if ( ahdtop.cfgClearScratchPad=="Yes" )
pb_clear_pad_option(pb.scratchpad);
if ( typeof ahdtop == "object" &&
typeof pb.menu == "object" &&
typeof pb.menu.pb_edit_window_available != "undefined") {
ahdtop.edit_profile_browser_opener = window;
autoset_caller_name = false;
pb.menu.pb_edit_window_available(true);
}
}
}
catch(e) {}
ImgBtnEnableButton("PROFILE_BROWSER");
ImgBtnEnableButton("PROFILE_BROWSER2");
}
function pb_check_for_editwin()
{
var ahdtop = get_ahdtop();
if ( typeof ahdtop == "object" &&
ahdtop != null &&
typeof window.parent.menu == "object" &&
typeof ahdtop.edit_profile_browser_opener == "object" &&
! ahdtop.edit_profile_browser_opener.closed ) {
window.parent.menu.pb_edit_window_available(true);
var editwin = ahdtop.edit_profile_browser_opener;
if ( typeof editwin.autoset_caller_name == "boolean" &&
editwin.autoset_caller_name ) {
window.parent.menu.pb_copy_to_edit(false);
editwin.autoset_caller_name = false;
}
}
}
function pb_env_mouseover(e, linkid, delay)
{
if ( _browser.isIE ) {
if ( window.event.ctrlKey )
return;
}
else if ( typeof e == "object" &&
e.ctrlKey )
return;
var asset = myAssets[linkid];
if ( typeof backfillActive == "boolean" && 
backfillActive &&
typeof asset == "object" && asset != null ) {
activePersid = asset[0];
activeKey = asset[1];
ctxMenu.show(e,document.getElementById(linkid),delay);
}
return true;
}
function pb_env_mouseout(e)
{
if ( backfillActive )
ctxMenu.hide();
return true;
}
function pb_env_backfill(name)
{
if ( typeof ahdtop == "object" &&
typeof ahdtop.edit_profile_browser_opener == "object" &&
! ahdtop.edit_profile_browser_opener.closed )
{
var b = ahdtop.edit_profile_browser_opener;
if ( typeof b == "object" &&
typeof b.formAsset == "object" ) {
var f = b.document.forms[b.formAsset[0]];
if ( typeof f == "object" ) {
e = f.elements[b.formAsset[1]];
if ( typeof e == "object" ) {
e.value = name;
var setfld=f.elements["SET.affected_resource"];
if(setfld!=null)
setfld.value="";
b.focus();
}
}
}
}
}
function pb_env_set_select(select)
{
backfillActive = select;
if (propFormName != "list_nr.htmpl")
return;
if (cfgRecordCount == "0")
return;
if ( select && typeof sel_ci_msg == "string") {
show_response(sel_ci_msg);
}
else { 
clear_response();
}
}
function pb_env_mouseclick(linkid)
{
var asset = myAssets[linkid];
if ( typeof asset == "object" && asset != null ) {
if ( backfillActive )
pb_env_backfill(asset[1]);
else
showDetailWithPersidKeep(asset[0], "IsProfileBrowser", "1");
}
}
function pb_link( idx_str, form, fac, qbe, gif )
{
var label = msgtext(idx_str);
var next_avail = void(0);
if (typeof label == "undefined")
{
if (nonLatinFlag)
next_avail = "NEXT_AVAIL";
label = idx_str; 
}
if (!nonLatinFlag)
idx_str = label;
if ( typeof gif != "string" )
gif = "pb_node";
if (gif == "pb_node")
var image = get_IMG_path("IMG_pb_node");
else if (gif == "pb_lastnode")
var image = get_IMG_path("IMG_pb_lastnode");
else
var image = cfgCAISD + "/img/" + gif + ".gif";
form += ".htmpl";
var linkname = "pbfld" + (linkno++);
label = linkno + ". " + label;
idx_str = linkno + ". " + idx_str;
var actkey = registerActionKey( (linkno%10).toString(), idx_str,
pb_dolink, linkname, form, persid, fac, qbe, next_avail )
var text = "<tr>\n" +
"<td class=profile_browser_link>\n" +
"<img src='" + image +
"' class=profile_browser_img alt=''>\n" +
"</td>\n" +
"<td class=profile_browser_link valign=top>\n" +
"<a id=" + linkname + " name=" + linkname +
" onFocus=\"this.className='focusField'\" " +
" onBlur=\"this.className=''\" " +
" href=\"javascript:parent.item_click('" + form + "','" + persid;
if ( typeof qbe == "string" && qbe.length > 0 )
text += "','" + fac + "','" + qbe;
text += "')\">&nbsp;" + fmtLabelWithActkey( label, actkey ) +
"</a></td></tr>";
document.writeln(text);
}
function pb_linklast( idx_str, form, fac, qbe )
{
pb_link( idx_str, form, fac, qbe, "pb_lastnode" );
}
function pb_dolink( name, form, persid, fac, qbe )
{
var e = document.getElementById(name);
if ( typeof e == "object" && e != null )
e.focus();
parent.item_click( form, persid, fac, qbe );
}
function pb_envlink( idx_str, form, fac, in_persid )
{
var label = msgtext(idx_str);
var next_avail = void(0);
if (typeof label == "undefined")
{
if (nonLatinFlag)
next_avail = "NEXT_AVAIL";
label = idx_str; 
}
if (!nonLatinFlag)
idx_str = label;
form += ".htmpl";
var linkname = "pbfld" + (linkno++);
label = linkno + ". " + label;
idx_str = linkno + ". " + idx_str;
var actkey = registerActionKey( (linkno%10).toString(), idx_str, pb_doenvlink,
linkname, form, in_persid, fac, next_avail )
var text = "<tr>\n" +
"<td class=profile_browser_link>\n" +
"<img src='" + get_IMG_path("IMG_pb_node") + "' " +
" class=profile_browser_img alt=''>\n" +
"</td>\n" +
"<td class=profile_browser_link valign=top>\n" +
"<a id=" + linkname + " name=" + linkname +
" onFocus=\"this.className='focusField'\" " +
" onBlur=\"this.className=''\" " +
" href=\"javascript:parent.env_item_click('" + fac + "','" +
form + "','" + in_persid + "')\">" +
"&nbsp;" + fmtLabelWithActkey( label, actkey ) + "</a></td></tr>";
document.writeln(text);
}
function pb_doenvlink( name, form, in_persid, fac )
{
pb_focus(name);
parent.env_item_click( fac, form, in_persid );
}
function pb_copy_to_edit(focus)
{
var i, ahdtop = get_ahdtop();
if ( typeof ahdtop == "object" )
var editwin = ahdtop.edit_profile_browser_opener; 
if ( typeof editwin != "object" ||
typeof editwin.formEnduser != "object" ) {
ImgBtnDisableButton("btn003");
}
else {
var f = editwin.document.forms[editwin.formEnduser[0]];
var names = "";
for ( i = 1; i < editwin.formEnduser.length; i++ ) {
if ( i == 1 )
names += editwin.formEnduser[i];
else
names += "|" + editwin.formEnduser[i];
}
var rxCust = new RegExp("(.*)(" + names + ")(.*)");
if ( typeof f == "object" ) {
for ( i = 0; i < f.elements.length; i++ ) {
var e = f.elements[i];
if ( e.name.match(rxCust) ) {
switch (RegExp.$3) {
case "_fname": e.value = first_name; break;
case "_lname": e.value = last_name; break;
case "_mname": e.value = middle_name; break;
default:
switch ( RegExp.$1 ) {
case "SET.": e.value = id; break;
case "KEY.": e.value = ""; break;
default: e.value = combo_name; break;
}
}
}
}
}
if ( focus )
editwin.focus();
}
}
function pb_edit_window_available(available)
{
if ( available )
ImgBtnEnableButton("btn003");
else
ImgBtnDisableButton("btn003");
parent.page.pb_env_set_select(available);
}
function pb_scratchpad_setup( new_call_type )
{
var bDisableUpdate = ( ahdtop.cfgMultiTenancy == "on" &&
typeof parent.menu.tenantUserAuth == "number" &&
parent.menu.tenantUserAuth < 2 );
var bDisableQuickButtons = bDisableUpdate;
call_type = new_call_type;
if ( call_type == "1" ) {
curr_fac = "cr";
curr_fac_name = msgtext("Request")
ImgBtnChangeCaption( "btn009", "Quick_Request");
ImgBtnChangeCaption( "btn012", "Quick_Close_Request");
if ( cfgAccessFac_cr < 2 )
bDisableQuickButtons = true;
}
else if ( call_type == "2" ) {
curr_fac = "iss";
curr_fac_name = msgtext("Issue")
ImgBtnChangeCaption( "btn009", "Quick_Issue");
ImgBtnChangeCaption( "btn012", "Quick_Close_Issue");
if ( cfgAccessFac_iss < 2 )
bDisableQuickButtons = true;
}
else if ( call_type == "3" ) {
curr_fac = "in";
curr_fac_name = msgtext("Incident")
ImgBtnChangeCaption( "btn009", "Quick_Incident");
ImgBtnChangeCaption( "btn012", "Quick_Close_Incident");
if ( cfgAccessFac_in < 2 )
bDisableQuickButtons = true;
}
else if ( call_type == "4" ) {
curr_fac = "pr";
curr_fac_name = msgtext("Problem")
ImgBtnChangeCaption( "btn009", "Quick_Problem");
ImgBtnChangeCaption( "btn012", "Quick_Close_Problem");
if ( cfgAccessFac_pr < 2 )
bDisableQuickButtons = true;
}
var obj_type = document.getElementById("obj_type");
if ( obj_type != null && obj_type.type == "select-one" ) {
var test_fac_name = curr_fac_name.toLowerCase();
for ( var i = obj_type.options.length - 1; i >= 0; i-- )
if ( obj_type.options[i].text.toLowerCase() == test_fac_name ) {
obj_type.selectedIndex = i;
break;
}
obj_type.disabled = bDisableUpdate;
}
var descriptionField = document.getElementById("pbfld100");
var templateField = document.getElementById("pbfld101");
var templateLookup = document.getElementById("pbfld101_lnk");
if ( bDisableQuickButtons )
ImgBtnDisableButton( "btn012" );
else
ImgBtnEnableButton( "btn012" );
if ( bDisableUpdate ) {
ImgBtnDisableButton( "btn005" );
ImgBtnDisableButton( "btn007" );
ImgBtnDisableButton( "btn010" );
ImgBtnDisableButton( "btn011" );
if ( descriptionField != null )
descriptionField.disabled = true;
if ( templateField != null )
templateField.disabled = true;
if ( templateLookup != null ) {
templateLookup.disabled = true;
templateLookup.onclick = null;
}
}
else {
ImgBtnEnableButton( "btn005" );
ImgBtnEnableButton( "btn007" );
ImgBtnEnableButton( "btn010" );
ImgBtnEnableButton( "btn011" );
if ( descriptionField != null )
descriptionField.disabled = false;
if ( templateField != null )
templateField.disabled = false;
if ( templateLookup != null ) {
templateLookup.disabled = false;
templateLookup.onclick = pb_select_template;
}
}
var qt_selector = document.getElementById("pbfld102");
if ( typeof qt_selector == "object" && qt_selector != null ) {
var qt_label = document.getElementById("pblab102");
var qt_selections = parent.menu.qt_selections;
if ( bDisableQuickButtons ||
typeof qt_selections != "object" ||
qt_selections.length == 0 ) {
ImgBtnDisableButton( "btn009" );
qt_label.style.display = "none";
qt_selector.style.display = "none";
}
else {
ImgBtnEnableButton( "btn009" );
qt_label.style.display = "block";
qt_selector.style.display = "block";
qt_selector.options.length = 0;
for ( var i = 0; i < qt_selections.length; i++ ) {
var qt_selection = qt_selections[i];
qt_selector.options[i] = new Option(qt_selection[1],
qt_selection[0]);
}
}
adjScrollDivHeight();
}
try {
if ( parent.menu.combo_name.length > 0 )
setWindowTitle(msgtext("%1_Quick_Profile",parent.menu.combo_name),1);
}
catch(e) {}
if ( (! nbtab_processed ) &&
parent.location.search.match(/NBTAB=([^\+]+)/) ) {
nbtab_processed = true;
var tabname = RegExp.$1;
var links = parent.menu.document.links;
var rxItemClick = new RegExp("javascript:(.*item_click.*" +
tabname + ".*$)");
for ( var i = links.length - 1; i >= 0; i-- ) {
if ( links[i].href.match(rxItemClick) ) {
eval(RegExp.$1);
return;
}
}
var e = parent.page.document.getElementById("alertmsgText");
if ( e != null ) {
e.innerHTML = msgtext("Can't_view_pane_\_%1\__on_this", tabname);
e = parent.page.document.getElementById("alertmsg");
e.style.display = "block";
parent.page.adjScrollDivHeight();
if ( ahdtop.cstUsingScreenReader )
alert(e.innerHTML.replace(/<[^>]+>/g,"").replace(/[\n\r]/g,""));
}
}
}
function reset_scratchpad(p_win, s_form)
{
s_form.reset();
if (p_win.menu.loaded &&
p_win.scratchpad.loaded)
p_win.scratchpad.pb_scratchpad_setup(p_win.menu.call_type); 
}
function pb_clear_scratchpad()
{
var f = window.parent.scratchpad.document.scrpadForm;
if ( typeof f == "object" ) {
reset_scratchpad(parent, f);
if ( ! ImgBtnDisabled("btn009") || ! ImgBtnDisabled("btn012") ) {
var qtstatus = window.document.getElementById("alertmsgText");
if (qtstatus != null)
{ 
qtstatus.innerHTML = "";
var e = window.document.getElementById("alertmsg");
e.style.display = "none";
}
}
var hidden_e = window.parent.scratchpad.document.getElementById("pbfld101_persid");
if ( typeof hidden_e == "object" && hidden_e != null )
hidden_e.value = "";
pb_focus('pbfld100');
}
}
function get_sel_obj_type()
{
var fac = "cr";
var f = window.document.scrpadForm;
if (typeof f == "object")
{
var sel_obj = f.elements["obj_type"];
if (typeof sel_obj == "object")
fac = sel_obj.options[sel_obj.selectedIndex].value; 
}
return fac;
}
var selected_obj_type = "cr";
function clear_template_name()
{
var obj_type = get_sel_obj_type();
if (obj_type == selected_obj_type)
return;
selected_obj_type = obj_type;
var f = window.document.scrpadForm;
if ( typeof f == "object" ) 
{
f.template_name.value = "";
f["SET.template_name"].value = "";
} 
}
function pb_create()
{
var obj_type = get_sel_obj_type();
deferred_create_pending = false;
deferred_create_callback = void(0);
var f = window.document.scrpadForm;
if ( typeof f == "object" ) {
var CategorySET;
var CategoryKEY;
if (f.CatSET != null)
	CategorySET = "KEEP.category_set=" + f.CatSET.value;
if(f.CatKEY != null)
	CategoryKEY = "KEEP.category_key=" + f.CatKEY.value;

var template = f.template_name.value;
var template_persid = f["SET.template_name"].value;
if ( template_persid.length > 0 ) {
create_new( obj_type, template_persid, null, null, CategorySET, CategoryKEY );
}
else if ( template.length == 0 ) {
create_new( obj_type, 0, null, null, CategorySET, CategoryKEY );
}
else {
pb_select_template(pb_create);
}
}
}
function pb_select_template(callback)
{
var obj_type = get_sel_obj_type(); 
var extra = "QBE.NE.template_name=null+use_template=1" + 
"+QBE.EQ.template_name.delete_flag=0";
if ( obj_type == "cr" ) 
extra += "+QBE.NE.type=I+QBE.NE.type=P";
if ( typeof parent.menu.argTenantId == "string" &&
parent.menu.argTenantId.length > 0 )
extra += "+QBE.EQ.tenant=" + parent.menu.argTenantId +
"+KEEP.backfillMessage=" + msgtext("AHD05348", parent.menu.argTenant);
if ( ahdtop.cfgNX_CLASSIC_SLA_PROCESSING.toLowerCase() != "yes" &&
ahdtop.cfgNX_FILTER_TEMPLATE_SEARCH.toLowerCase() == "yes" ) 
{
extra += "+ADDITIONAL_WHERE=";
extra += buildWcForSLATemplate( obj_type, parent.menu.id,
parent.menu.org_id,
parent.menu.org_contract );
}
deferred_create_callback = callback;
popup_search( obj_type, "template_name", "scrpadForm", extra,
"0","template_name", callback);
}
function pb_qtemplate()
{
alert('pb_qtemplate');
var qtemplate = document.getElementById("pbfld102");
qtemplate = qtemplate.options[qtemplate.selectedIndex];
var qt_value = qtemplate.value.match(/(.*);(.*)/);
var qtstatus = window.document.getElementById("alertmsgText");
if ( qt_value[2] == "2" ) {
if (qtstatus != null)
qtstatus.innerHTML = "";
create_new( curr_fac, qt_value[1] );
}
else {
if (curr_fac_name == msgtext("Request") 
|| curr_fac_name == msgtext("Incident")
|| curr_fac_name == msgtext("Problem")) {
if (qtstatus != null)
qtstatus.innerHTML = msgtext("Quick_create_of_%1_%2_for_%3_i", qtemplate.text,
msgtext("Template"), parent.menu.combo_name);
} else {
if (qtstatus != null)
qtstatus.innerHTML = msgtext("Quick_create_of_%1_%2_for_%3_i", qtemplate.text,
curr_fac_name, parent.menu.combo_name);
}
ImgBtnDisableButton( "btn009" );
document.qtemplate_form.factory.value = curr_fac;
document.qtemplate_form.description.value = document.scrpadForm.pbfld100.value;
document.qtemplate_form.qtemplate_persid.value = qt_value[1];
document.qtemplate_form.customer_id.value = parent.menu.id;
var popunder_callback = pb_qtemplate_callback;
var w = popunder_window("profile_qtemplate.htmpl", popunder_callback);
}
if (qtstatus != null)
{ 
var e = window.document.getElementById("alertmsg");
if (qtstatus.innerHTML != "")
e.style.display = "block";
else
e.style.display = "none";
}	
}
function pb_qtemplate_callback( title, msg )
{
var ahdtop = get_ahdtop();
var w_name = popup_window_name("profile_browser");
if ( typeof ahdtop == "object" &&
typeof ahdtop.AHD_Windows[w_name] == "object" &&
! ahdtop.AHD_Windows[w_name].closed ) {
var scratchpad = ahdtop.AHD_Windows[w_name].scratchpad;
var qtstatus = scratchpad.document.getElementById("alertmsgText");
if ( typeof qtstatus == "object" && qtstatus != null ) {
if ( typeof msg == "string" && msg.length > 0 )
qtstatus.innerHTML = msg;
else if ( title.match(/ *([^ ]+) /) ) {
var issue_or_request_name = RegExp.$1;
if (scratchpad.curr_fac_name == msgtext("Request")
|| scratchpad.curr_fac_name == msgtext("Incident")
|| scratchpad.curr_fac_name == msgtext("Problem")) {
title.match(/\w+\s+(\w+)/);
var request_type_name = RegExp.$1;
qtstatus.innerHTML = msgtext("Quick_%1_%2_created", request_type_name,
issue_or_request_name );
} else {
qtstatus.innerHTML = msgtext("Quick_%1_%2_created", scratchpad.curr_fac_name,
issue_or_request_name );
}
}
else
qtstatus.innerHTML = "";
var e = window.document.getElementById("alertmsg");
if (qtstatus.innerHTML == "")
e.style.display = "none";
else {
e.style.display = "block";
if ( ahdtop.cstUsingScreenReader )
alert(e.innerHTML.replace(/<[^>]+>/g,"").replace(/[\n\r]/g,""));
}
}
pb_clear_pad_option(scratchpad); 
}
}
function pb_clear_pad_option(scratchpad)
{
var ahdtop = get_ahdtop();
if (typeof ahdtop != "object" || ahdtop.cfgClearScratchPad != "Yes" || scratchpad == null)
return;
var f = scratchpad.document.scrpadForm;
if ( typeof f == "object" ) 
{
var w_name = popup_window_name("profile_browser");
var pb;
if (typeof ahdtop.AHD_Windows[w_name] == "object" && ! ahdtop.AHD_Windows[w_name].closed)
pb = ahdtop.AHD_Windows[w_name] ;
else
pb = window;
reset_scratchpad(pb, f);
var hidden_e = scratchpad.document.getElementById("pbfld101_persid");
if ( typeof hidden_e == "object" && hidden_e != null )
hidden_e.value = "";
pb_focus('pbfld100');
}
}
function pb_qclose()
{
alert('pb_qclose');
var qtstatus = window.document.getElementById("alertmsgText");
var quick_close_preset = "";
if (qtstatus != null)
{ 
if ( call_type == "1" ) 
qtstatus.innerHTML = msgtext("Quick_close_request_for_%1_in_",parent.menu.combo_name);
else if ( call_type == "2" ) 
qtstatus.innerHTML = msgtext("Quick_close_issue_for_%1_in_pr", parent.menu.combo_name);
else if ( call_type == "3" ) 
qtstatus.innerHTML = msgtext("Quick_close_incident_for_%1_in", parent.menu.combo_name);
else if ( call_type == "4" ) 
qtstatus.innerHTML = msgtext("Quick_close_problem_for_%1_in_", parent.menu.combo_name);
var e = window.document.getElementById("alertmsg");
e.style.display = "block";	
}
ImgBtnDisableButton( "btn012" );
var the_factory;
if (call_type == "1")
{
the_factory = "cr";
if (ahdtop.quick_close_preset_cr != null && typeof ahdtop.quick_close_preset_cr == "string")
quick_close_preset = ahdtop.quick_close_preset_cr;
}
else if (call_type == "2")
{
the_factory = "iss";
if (ahdtop.quick_close_preset_iss != null && typeof ahdtop.quick_close_preset_iss == "string")
quick_close_preset = ahdtop.quick_close_preset_iss;
}
else if (call_type == "3")
{
the_factory = "in";
if (ahdtop.quick_close_preset_in != null && typeof ahdtop.quick_close_preset_in == "string")
quick_close_preset = ahdtop.quick_close_preset_in;
}
else if (call_type == "4") 
{
the_factory = "pr";
if (ahdtop.quick_close_preset_pr != null && typeof ahdtop.quick_close_preset_pr == "string")
quick_close_preset = ahdtop.quick_close_preset_pr;
}
var qtemplate=document.getElementById("pbfld102");
if (qtemplate != null && qtemplate.selectedIndex >= 0)
{
qtemplate=qtemplate.options[qtemplate.selectedIndex];
var qt_value=qtemplate.value.match(/(.*);(.*)/);
upd_workframe("QUICK_CLOSE",
"FACTORY=" + the_factory,
"cust_id=" + parent.menu.id, 
"log_agent_id=" + argCstID,
"desc=" + document.scrpadForm.pbfld100.value,
"PERSID=" + qt_value[1],
"call_back=parent.ahdframe.parent." + window.name + ".pb_qclose_callback", quick_close_preset); 
}
else 
{
upd_workframe("QUICK_CLOSE",
"FACTORY=" + the_factory,
"cust_id=" + parent.menu.id, 
"log_agent_id=" + argCstID,
"desc=" + document.scrpadForm.pbfld100.value,
"call_back=parent.ahdframe.parent." + window.name + ".pb_qclose_callback", quick_close_preset); 
}
}
function pb_qclose_callback(ref_num)
{
ImgBtnEnableButton( "btn012" );
var qtstatus = window.document.getElementById("alertmsgText");
if (qtstatus != null)
{
if (ref_num == "-1")
{
if ( call_type == "1" ) 
qtstatus.innerHTML = msgtext("Quick_close_request_failed");
else if ( call_type == "2" ) 
qtstatus.innerHTML = msgtext("Quick_close_issue_failed");	
else if ( call_type == "3" ) 
qtstatus.innerHTML = msgtext("Quick_close_incident_failed");	
else if ( call_type == "4" ) 
qtstatus.innerHTML = msgtext("Quick_close_problem_failed");	
}
else 
{
if ( call_type == "1" ) 
qtstatus.innerHTML = msgtext("Quick_close_request_%1_created", ref_num);
else if ( call_type == "2" ) 
qtstatus.innerHTML = msgtext("Quick_close_issue_%1_created", ref_num);
else if ( call_type == "3" ) 
qtstatus.innerHTML = msgtext("Quick_close_incident_%1_create", ref_num);
else if ( call_type == "4" ) 
qtstatus.innerHTML = msgtext("Quick_close_problem_%1_created", ref_num);	
}
var e = window.document.getElementById("alertmsg");
e.style.display = "block";
if ( ahdtop.cstUsingScreenReader )
alert(e.innerHTML.replace(/<[^>]+>/g,"").replace(/[\n\r]/g,""));
}
pb_clear_pad_option(this);	
next_workframe("UPD_WORKFRAME");
}
function profile_browser_args (cnt_persid, factory_text, FromGoBtn, call_req_id, cnt_count) {
this.cnt_persid = cnt_persid;
this.factory_text = factory_text;
this.FromGoBtn = FromGoBtn;
this.call_req_id = call_req_id;
this.cnt_count = cnt_count;
}
function gpb_escape(text)
{
var ahdtop=get_ahdtop();
text=nx_escape(text);
text=text.replace(/\*/g, "%2a");
text=text.replace(/\+/g, "%2b");
text=text.replace(/\-/g, "%2d");
text=text.replace(/\./g, "%2e");
text=text.replace(/\//g, "%2f");
text=text.replace(/\@/g, "%40");
text=text.replace(/\_/g, "%5f");
return text;
}
function KD_search() {
var scrText = document.scrpadForm.pbfld100.value;
var cntId = window.parent.menu.id;
ahdtop.PROF_BRWS_DESC = scrText;
var re = new RegExp("[^ ]");
if (scrText.search( re ) == -1)
var url = "OP=SEARCH+FACTORY=KD+KEEP.PROF_BRWS_USER=" + cntId;
else
var url = "OP=SEARCH+FACTORY=KD+KEEP.PROF_BRWS_USER=" + cntId + "+set_search_text=" + nx_escape(scrText) + "+DO_SEARCH=1";
if(typeof m_sdLaunched == "string" && m_sdLaunched != "")
url += "+KEEP.SD_LAUNCHED=" + m_sdLaunched;	
popup_window("", url, "", "", "");
}
// Copyright (c) 2005 CA.  All rights reserved.
// gsub.js,v 1.3 2001/05/24 02:00:56
function gsub(text, target, replacement)
{
if (!target.length)
return text;
var offset;
var result = "";
var begin = 0;
for (offset = text.indexOf(target, 0);
-1 < offset;
offset = text.indexOf(target, begin))
{
result += text.substring (begin, offset);
result += replacement;
begin = offset + target.length;
}
if (begin < text.length)
result += text.substring (begin, text.length);
return result;
}
// Copyright (c) 2005 CA.  All rights reserved.
var imgbutton = {};
var imgBtnArray = new Array();
var imgBtnID = 0;
var imgBtnRowCentered = true;
var imgBtnDisabledSupported = false;
var imgBtnPadding = "";
var imgBtnRowCount = 0;
var imgBtnRowActive = false;
var imgBtnDefault, imgBtnCancel, imgBtnDeferred;
var imgBtnScreenReaderHotkeys = null;
var imgBtnDefaultTabIndex;
var imgBtnNegativeClass = "grey";
if (typeof ahdtop == "undefined")
ahdtop = get_ahdtop();
var cancel_button_name;
var default_button_name;
if ( typeof _browser == "undefined" ) {
var _browser = new Object();
_browser.supportsLayers = ! document.all;
_browser.isIE = document.all;
}
function ImgBtnMouseOver( lID)
{
var btn = imgBtnArray[lID];
if ( typeof btn == "object" ) {
if ( btn.enabled )	
window.status = btn.help;	
else	
window.status = window.defaultStatus;
}
return true;
}
function ImgBtnExecute(lID)
{
if ( typeof lID == "object" )
lId = lID[0];
var btn = imgBtnArray[lID];
if ( btn.enabled ) {
if ( typeof btn.obj == "string" )
btn.obj = document.getElementById(btn.obj);
try { btn.obj.focus(); } catch(e) {}
eval( btn.func );
}
return false;
}
function ImgBtnObject(btnID)
{
for ( var i = imgBtnArray.length - 1; i >= 0; i-- ) {
var btn = imgBtnArray[i];
if ( btn.id == btnID ) {
if ( typeof btn.obj == "string" )
btn.obj = document.getElementById(btn.obj);
return btn.obj;
}
}
return null;
}
function ImgBtnChangeCaption( btnID, idx_str )
{
var next_avail = void(0);
var func_str = 'msgtext("' + idx_str + '"'; 
for (var i = 2; i < arguments.length; i++)
{
func_str += ', "' + arguments[i] + '"';	
}
func_str += ");";
var sNewCaption = eval(func_str); 
if (typeof sNewCaption == "undefined") 
{
if (nonLatinFlag) 
next_avail = "NEXT_AVAIL";
sNewCaption = idx_str;
}
if (!nonLatinFlag)
idx_str = sNewCaption;
if ( ! _browser.supportsLayers ) {
for ( var i=0; i < imgBtnArray.length;i++ ) {
var btn = imgBtnArray[i];
var reg_fallback = 0;
if ( btn.id == btnID ) {
if ( typeof btn.actKey == "string" &&
btn.actKey != " " &&
btn.actKey.length == 1 ) {
if ( btn.actKey == fallbackHotkey &&
fallbackHotkey.length > 0 )
{	
sNewCaption += " (<u>" + fallbackHotkey + "</u>)";
reg_fallback = 1;
}
else {
var posn = sNewCaption.indexOf(btn.actKey);
if ( posn == -1 )
posn = sNewCaption.indexOf(btn.actKey.toLowerCase());
if (typeof nonLatinFlag != "undefined" &&
nonLatinFlag == 1)
{
actKey = btn.acKey;
}
else 
if ( posn == -1)
{
var w = getActionKeyWindow();
var keyCode = btn.actKey.charCodeAt(0);
w.actionKey[keyCode] = void(0);
var actKey = sNewCaption.slice(0, 1);
actKey=registerActionKey(actKey,idx_str,ImgBtnExecute,i, next_avail);
if (actKey != " ")
btn.actKey = actKey;
posn = sNewCaption.indexOf(btn.actKey.toLowerCase());
}
if ( posn != -1 && actKey != " ") {
var text = "";
if ( posn != 0 )
text += sNewCaption.substr(0,posn);
text += "<U>" + sNewCaption.substr(posn,1) + "</U>";
if ( posn < sNewCaption.length - 1 )
text += sNewCaption.substr(posn+1,sNewCaption.length-posn-1);
sNewCaption = text;
}
else 
{
sNewCaption += " (<u>" + btn.actKey + "</u>)";
}
}
} 
if ( typeof btn.obj == "string" )
btn.obj = document.getElementById(btn.obj);
btn.obj.firstChild.innerHTML = sNewCaption; 
if (reg_fallback)
registerFallbackKey("imgBtn" + i, true);
break;
}
}
}
}
function ImgBtnSetDefaultTabIndex(newTabIndex)
{
imgBtnDefaultTabIndex = newTabIndex;
}
function ImgBtnDisabled(btnName) {
for ( var i=0; i < imgBtnArray.length;i++ ) {
var btn = imgBtnArray[i];
if ( btn.id == btnName )
return ! btn.enabled;
}
return true;
}
function ImgBtnEnableDeferred()
{
if ( typeof imgBtnDeferred == "object" ) {
for ( var i = imgBtnDeferred.length-1; i >=0; i-- )
ImgBtnEnableButton(imgBtnDeferred[i]);
imgBtnDeferred = void(0);
}
}
function ImgBtnEnableButton( btnName, btnEnable )
{
if ( typeof btnEnable == "boolean" && ! btnEnable ) {
ImgBtnDisableButton( btnName );
return;
}
for ( var i=0; i < imgBtnArray.length;i++ ) {
var btn = imgBtnArray[i];
if ( btn.id == btnName ) {
if ( typeof btn.obj == "string" )
btn.obj = document.getElementById(btn.obj);
if ( typeof btn.obj != "object" || btn.obj == null)
return;
btn.obj.className = ImgBtnClass(btn, true);
btn.obj.tabIndex = btn.tabIndex;
btn.enabled = true;
return;
}
}
}
function ImgBtnDisableButton( btnName )
{
for ( var i=0; i < imgBtnArray.length;i++ ) {
var btn = imgBtnArray[i];
if ( btn.id == btnName ) {
if ( typeof btn.obj == "string" )
btn.obj = document.getElementById(btn.obj);
if ( typeof btn.obj != "object" || btn.obj == null)
return;
btn.obj.className = ImgBtnClass(btn, false);
btn.obj.tabIndex = -1;
btn.enabled = false;
return;
}
}
}
function ImgBtnClass( btn, btnEnable )
{
btnClass = "button";
if (typeof btn.type == "string" && btn.type == "negative") {
btnClass += " " + imgBtnNegativeClass;
}
if ( typeof btnEnable == "boolean" && btnEnable == false ) {
btnClass += " disabledattr";
if (typeof btn.type == "string" && btn.type == "negative") {
btnClass += " disabledattr_grey";
}
}
else {
btnClass += " enabledattr buttonEnabled";
}
return btnClass;
}	
function ImgBtnHideButton( btnName )
{
for ( var i=0; i < imgBtnArray.length;i++ ) {
var btn = imgBtnArray[i];
if ( btn.id == btnName ) {
var tbl = document.getElementById("imgBtn" + i);
if ( tbl != null )
tbl.style.display = "none";
ImgBtnDisableButton( btnName );
return;
}
}
}
function ImgBtnShowButton( btnName )
{
for ( var i=0; i < imgBtnArray.length;i++ ) {
var btn = imgBtnArray[i];
if ( btn.id == btnName ) {
var tbl = document.getElementById("imgBtn" + i);
if ( tbl != null )
tbl.style.display = "";
return;
}
}
}
function ImgBtnInExternalTable()
{
if ( typeof _dtl == "object" ) {
if ( _dtl.tableStarted &&
! _dtl.doingLabelButton )
return 1;
}
else if ( typeof __search_filter == "object" ) {
if ( __search_filter.layerStarted )
return 2;
}
return 0;
}
function ImgBtnShow( btnID )
{
for ( var i=0; i < imgBtnArray.length;i++ )
{
var btn = imgBtnArray[i];
if ( btn.id == btnID )
{
btn = document.getElementById("imgBtn" + String(i));
if (typeof btn == "object") {
recursively_set_display(btn, "");
adjScrollDivHeight();
}
break;
}
}
}
function ImgBtnHide( btnID )
{
for ( var i=0; i < imgBtnArray.length;i++ )
{
var btn = imgBtnArray[i];
if ( btn.id == btnID )
{
btn = document.getElementById("imgBtn" + String(i));
if (typeof btn == "object") {
recursively_set_display(btn, "none");
adjScrollDivHeight();
}
break;
}
}
}
function ImgBtnRow(padding,centered)
{
if ( typeof cfgMOPreviewMode == "number" && cfgMOPreviewMode == 1) {
return;	
}
switch ( ImgBtnInExternalTable() ) {
case 1: detailEndTable(); break;
case 2: __search_filter.endLayer(); break;
}
var text = "";
var tablecenter = "";
imgBtnRowCentered = typeof centered != "boolean" || centered;
if ( imgBtnRowCentered )
tablecenter += " class='tablecenter'";
imgBtnPadding = "";
var width = "";
if ( typeof padding == "number" )
for ( ; padding > 0; padding-- )
imgBtnPadding += "&nbsp;";
else if ( typeof padding == "string" &&
padding.match(/\d+%/) )
width = " WIDTH='" + padding + "'";
if ( _browser.supportsLayers && imgBtnPadding.length == 0 )
imgBtnPadding = "&nbsp;";
text += "<TABLE border=0" + width + tablecenter + "><TR>\n";
docWrite(text);
imgBtnRowActive = true;
imgBtnRowCount = 0;
}
function ImgBtnEndRow()
{
if ( typeof cfgMOPreviewMode == "number" && cfgMOPreviewMode == 1) {
return;	
}
if ( imgBtnRowActive ) {
var text = "</TR></TABLE>";
docWrite(text);
imgBtnRowActive = false;
}
}
function ImgBtnDoCancel()
{
if ( typeof imgBtnCancel == "object" &&
typeof imgBtnCancel.enabled == "boolean" &&
imgBtnCancel.enabled ) {
if ( typeof imgBtnCancel.obj == "string" )
imgBtnCancel.obj = document.getElementById(imgBtnCancel.obj);
eval( imgBtnCancel.func );
return true;
}
return false;
}
function ImgBtnKeydownHandler(e)
{
var f, i, j, len;
if ( ( typeof imgBtnDefault.enabled != "boolean" ||
! imgBtnDefault.enabled ) &&
( typeof imgBtnCancel.enabled != "boolean" ||
! imgBtnCancel.enabled ) )
return true;
var key_pressed;
var active_element;
if ( _browser.supportsLayers )
{
key_pressed = e.which;
active_element = e.target;
}
else if (_browser.isIE )
{
e = window.event;
key_pressed = e.keyCode;
active_element = document.activeElement;
}
else
{
key_pressed = e.keyCode;
active_element = e.target;
}
if ( key_pressed == 13 &&
typeof active_element.type == "string" &&
active_element.type != "textarea" &&
typeof imgBtnDefault == "object" &&
typeof imgBtnDefault.enabled == "boolean" &&
imgBtnDefault.enabled ) {
if ( typeof imgBtnDefault.obj == "string" )
imgBtnDefault.obj = document.getElementById(imgBtnDefault.obj);
len = document.forms.length;
for ( i = 0; i < document.forms.length; i++ ) {
f = document.forms[i];
for ( j = 0; j < f.length; j++ )
if ( f.elements[j] == active_element ) {
if ( typeof active_element.onchange == "function" )
active_element.onchange();
if ( _browser.supportsLayers &&
typeof active_element.onblur == "function" )
active_element.onblur();
eval( imgBtnDefault.func );
return false;
}
}
if (_browser.isIE && _browser.isMAC && 
typeof active_element.onclick == "function")
{
active_element.onclick(); 
return false;
} 
}
if ( key_pressed == 27 &&
typeof active_element.type == "string" &&
typeof imgBtnCancel == "object" &&
typeof imgBtnCancel.enabled == "boolean" &&
imgBtnCancel.enabled ) {
len = document.forms.length;
for ( i = 0; i < document.forms.length; i++ ) {
f = document.forms[i];
for ( j = 0; j < f.length; j++ )
if ( f.elements[j] == active_element ) {
ImgBtnDoCancel();
return true;
}
}
}
return true;
}
function ImgBtnCreate( btnID, idx_str, func, btnEnabled, btnWidth,
help, tabIndex, btnType )
{
var next_avail = void(0);
var func_str = 'msgtext("' + idx_str + '"'; 
for (var i = 8; i < arguments.length; i++)
{
func_str += ', "' + arguments[i] + '"';	
}
func_str += ");";
btnCaption = eval(func_str);
if (typeof btnCaption == "undefined")
{
if (nonLatinFlag) 
next_avail = "NEXT_AVAIL";
btnCaption = idx_str;
}
ImgBtnCreate_internal( btnID, btnCaption, func, btnEnabled, btnWidth,
help, tabIndex, idx_str, btnType, next_avail); 
}
function buttonAltKey(lID)
{
if (event.altKey)
{
return ImgBtnExecute(lID);
}
return false;
}
function ImgBtnCreate_internal( btnID, caption, func, btnEnabled, btnWidth,
help, tabIndex, hotkey_name, btnType, next_avail )
{
if ( typeof cfgMOPreviewMode == "number" && cfgMOPreviewMode == 1) {
return;	
}
if ( typeof tabIndex == "number" && tabIndex == -1) {
tabIndex = "";
}
var lID;
lID = imgBtnID;
imgBtnID++;
btnCaption = caption;
if (!nonLatinFlag)
hotkey_name = btnCaption;
if ( typeof btnID != "string" || btnID.length == 0 ) {
if ( lID < 10 )
btnID = "btn00" + lID;
else if ( lID < 100 )
btnID = "btn0" + lID;
else
btnID = "btn" + lID;
}
if (typeof ahdtop == "object" &&
(typeof ahdtop.cfgShowNegativeButtons == "string") &&
(ahdtop.cfgShowNegativeButtons.match(/^yes\s*$/i) != null) )
{
var checkNegative = true;
if ( typeof propFormName == "string" &&
(propFormName == "kd_permissions_tab.htmpl" || propFormName == "category_permissions_tab.htmpl") && 
(btnID != "btnRemoveWrite" || btnID != "btnRemoveAllWrite" || 
btnID != "btnRemoveRead" || btnID != "btnRemoveAllRead") ) {
checkNegative = false;
}
if (checkNegative && (typeof btnType == "undefined" || btnType.length == 0 || btnType == "positive") ) {
if ( btnID == "btncncl" || 
btnID.toLowerCase().indexOf("cancel") != -1 ||
btnID.toLowerCase().indexOf("reject") != -1 ||
btnID.toLowerCase().indexOf("delete") != -1 ||
btnID.toLowerCase().indexOf("deactivate") != -1 ||
btnID.toLowerCase().indexOf("remove") != -1 ||
btnID.toLowerCase().indexOf("deinstall") != -1 ) {
btnType = "negative";
}
}
}
else
{
btnType = "positive";
}
if ( func.indexOf("(") == -1 )
func = "upd_frame('" + func + "')";
var initialval;
var actKey;
var btnCaptionLen;
var btnCaptionBeforeSpecialChar;
var btnCaptionAfterSpecialChar;
if (btnCaption.indexOf("[") != -1)
{
btnCaptionLen = btnCaption.length;
initialval = btnCaption.indexOf("[");
var endval = btnCaption.lastIndexOf("]");
var actkeylen = (endval-1)-initialval;
actKey = btnCaption.substr(initialval+1,actkeylen);	
btnCaptionBeforeSpecialChar = btnCaption.substr(0,initialval);
btnCaptionAfterSpecialChar = btnCaption.substr(endval+1,btnCaptionLen);
btnCaption = btnCaptionBeforeSpecialChar + btnCaptionAfterSpecialChar;
}
if ( typeof help != "string" || help == "n/a" )
help = "";
if ( typeof actKey != "string" )
actKey = "";
var force_key = "" 
if (actKey.indexOf("*")!=-1)
{ 
var foundindex = actKey.indexOf("*");
var keylength = actKey.length;
actKey = actKey.substr(foundindex+1,keylength);
force_key = actKey;
}
actKey = registerActionKey( actKey, hotkey_name, ImgBtnExecute, lID, next_avail);
if ( actKey.match(/^\s*$/) &&
typeof ahdtop == "object" &&
( ahdtop.cfgUserType == "analyst" &&
! ahdtop.cstUsingScreenReader ) )
actKey = fallbackHotkey;
var uc_akey = actKey.toUpperCase();
var uc_label = btnCaption.toUpperCase();
if (uc_label.indexOf(uc_akey) == -1 && actKey != " ")
force_key = actKey;
if (force_key.length > 0)
{
var uc_fkey = force_key.toUpperCase();
if ((uc_fkey == uc_akey) && 
(uc_label.indexOf(uc_fkey) == -1))
btnCaption += "(" + force_key + ")";
}
var hideButton = false;
if ( typeof btnEnabled != "boolean" ) {
if ( typeof btnEnabled == "string" ) {
if ( btnEnabled == "hide" ) {
btnEnabled = false;
hideButton = true;
}
else if ( btnEnabled == "defer" ) {
btnEnabled = false;
if ( typeof imgBtnDeferred == "undefined" )
imgBtnDeferred = new Array();
imgBtnDeferred[imgBtnDeferred.length] = btnID;
}
}
else if ( ( typeof btnEnabled != "boolean" &&
typeof btnEnabled != "number" ) ||
btnEnabled )
btnEnabled = true;
else
btnEnabled = false;
}
var sTDWidth="";
if (( typeof ahdtop == "object") &&	
( typeof ahdtop.cfgSuppressImgButtonWidth == "string" ) &&
( ahdtop.cfgSuppressImgButtonWidth == "1" )) {
sTDWidth = " width=0";
btnWidth = 0;
}
else {
if ( typeof btnWidth == "number" && btnWidth > 30 )
{
btnWidth -= 9;
sTDWidth = " width=" + btnWidth;
}
else if ( typeof btnWidth == "string" )
sTDWidth = " width=" + btnWidth;
}
imgBtnArray[lID] = new Object();
imgBtnArray[lID].id = btnID;
imgBtnArray[lID].caption = btnCaption;
imgBtnArray[lID].func = func;
imgBtnArray[lID].enabled = btnEnabled;
imgBtnArray[lID].nohighlight = false;
imgBtnArray[lID].actKey = actKey;
imgBtnArray[lID].help = help;
imgBtnArray[lID].type = btnType;
var actions, actions_img, name;
var text = "";
if ( imgBtnRowActive ) {
if ( imgBtnRowCount > 0 &&
imgBtnPadding.length > 0 )
text += "<TD>" + imgBtnPadding + "</TD>";
text = "<TD ALIGN=center HEIGHT=21>\n";
imgBtnRowCount++;
}
var buttonHTML = "";
if ( typeof tabIndex == "number" && btnEnabled )
buttonHTML += " tabindex=" + tabIndex;
else if ( typeof imgBtnDefaultTabIndex == "number" && btnEnabled )
buttonHTML += " tabindex=" + imgBtnDefaultTabIndex;
else if ( ! btnEnabled )
buttonHTML += " tabindex=-1"; 
if (typeof tabIndex == "number")
imgBtnArray[lID].tabIndex = tabIndex;
else if ( typeof imgBtnDefaultTabIndex == "number")
imgBtnArray[lID].tabIndex = imgBtnDefaultTabIndex;
var captionText = fmtLabelWithActkey(btnCaption,actKey);
try {
if ( ahdtop.cstUsingScreenReader ) {
if ( ahdframe.imgBtnScreenReaderHotkeys == null ) {
ahdframe.imgBtnScreenReaderHotkeys = new Object();
for ( var i = 811; i < 830; i++ ) {
var m = ahdtop.__messages[i];
if ( typeof m == "string" &&
m.match(/^(.*)\[(\w)\]$/) )
ahdframe.imgBtnScreenReaderHotkeys[RegExp.$1] = RegExp.$2;
}
}
var hotkey = ahdframe.imgBtnScreenReaderHotkeys[captionText];
if ( typeof hotkey == "string" && hotkey.length == 1 ) {
buttonHTML += " accesskey=" + hotkey;
if (!_browser.isIE)
{
var w = getActionKeyWindow();
actKey = new Object;
w.actionKey[hotkey.charCodeAt(0)] = actKey;
actKey.args = new Array;
actKey.args[0] = lID; 
actKey.label = captionText;
actKey.win = window;
actKey.func = ImgBtnExecute;
actKey.activated = false;
}
else 
{
buttonHTML += " onfocus='return buttonAltKey(" + 
lID + ")'";
}
if ( typeof ahdtop.__messages["_(Alt+%1)"] == "string" &&
ahdtop.__messages["_(Alt+%1)"].length > 0 )
captionText += msgtext("_(Alt+%1)",hotkey);
for ( var xCaption in ahdframe.imgBtnScreenReaderHotkeys ) {
if ( hotkey == ahdframe.imgBtnScreenReaderHotkeys[xCaption] )
ahdframe.imgBtnScreenReaderHotkeys[xCaption] = "";
}
}
}
}
catch(e) {}
if ( typeof help == "string" &&
help.length > 0 ) {
if ( help.match(/^([^\[]*)\[.*\]\s*$/) )
help = RegExp.$1;
if ( help != captionText )
buttonHTML += " title=\"" + help + "\"";
}
var style = btnEnabled ? "enabledattr" : "disabledattr";
var buttonEnabled = "";
if (btnEnabled)
buttonEnabled = "buttonEnabled";
if (!btnEnabled && (typeof btnType == "string" && btnType == "negative"))
style += " disabledattr_grey";
var actions = "";
if ( typeof ahdtop != "object" ||
typeof ahdtop.cstUsingScreenReader == "undefined" ||
( ahdtop.cfgUserType == "analyst" &&
! ahdtop.cstUsingScreenReader ) )
actions += " onMouseOver='return ImgBtnMouseOver(" + lID + ");'" + 
" onMouseOut='window.status = window.defaultStatus;return true;'";
var pdmqaTag = "";
if (typeof ahdtop != "undefined" && typeof ahdtop == "object")
{
if (typeof ahdtop.cfgPdmQA == "string" && ahdtop.cfgPdmQA.toLowerCase() == "yes")
{
pdmqaTag = imgbutton.pdmqa(captionText, "imgBtn" + lID);
}
}
var exStyle = "";
if ((typeof btnWidth == "number" && 
btnWidth > 0) || 
(typeof btnWidth == "string")) {
exStyle = "style='width:" + btnWidth + "px' ";
}
var btnTypeClass = "button";
if (typeof btnType == "string" && btnType == "negative") {
btnTypeClass += " " + imgBtnNegativeClass;
}
text += "<a ID=imgBtn" + lID + " NAME=imgBtn" + lID + 
" class='" + btnTypeClass + " " + style + " " + buttonEnabled + "' " + buttonHTML + 
" ondragstart = 'return false' " +
" onClick='return ImgBtnExecute(" + lID + ")' " + actions + " href='#'" + pdmqaTag;
if ( hideButton )
text += " style='display:none;'";
text += "><span " + exStyle + ">" + captionText + "</span></a>";
if ( imgBtnRowActive )
text += "</TD>";
switch ( ImgBtnInExternalTable() ) {
case 1:
if (_dtl.edit)
detailExternal(text);
else
detailExternal("",text);
break;
case 2:
searchFilterExternal(text);
break;
default:
docWrite(text); 
break;
}
imgBtnArray[lID].obj = "imgBtn" + lID; 
if ( actKey == fallbackHotkey && fallbackHotkey.length > 0 )
registerFallbackKey("imgBtn" + lID);
if ( typeof default_button_name != "string" )
default_button_name = "btndflt";
if ( typeof cancel_button_name != "string" )
cancel_button_name = "btncncl";
if ( btnID == default_button_name &&
typeof imgBtnDefault != "object" ) {
imgBtnDefault = imgBtnArray[lID];
if (_browser.isMAC)
{
if ( typeof document.onkeypress != "function" )
document.onkeypress = ImgBtnKeydownHandler;
}
else
{
if ( typeof document.onkeydown != "function" )
document.onkeydown = ImgBtnKeydownHandler;
}
}
else if ( btnID == cancel_button_name &&
typeof imgBtnCancel != "object" ) {
imgBtnCancel = imgBtnArray[lID];
if (_browser.isMAC)
{
if ( typeof document.onkeypress != "function" )
document.onkeypress = ImgBtnKeydownHandler;
}
else 
{
if ( typeof document.onkeydown != "function" )
document.onkeydown = ImgBtnKeydownHandler;
}
}
return btnID;
}
/* SDT 26462
The name of this routine may be a little confusing if we're IE.
IE doesn't support the DOM spec very well.  That means that
it has no idea what a Node is (which is an interface, hence an object/
function). So.. if the typeof Node != function, then we really don't
recurse. Besides, we're only having problems with Mozilla/Netscape7,
not IE! */
function recursively_set_display(elem, display)
{
if (typeof Node == "function")
{
if (typeof elem.firstChild == "object" && elem.firstChild != null)
recursively_set_display(elem.firstChild, display);
if (typeof elem.nextSibling == "object" && elem.nextSibling != null)
recursively_set_display(elem.nextSibling, display);
if (elem.nodeType == Node.ELEMENT_NODE &&
typeof elem.style == "object" &&
typeof elem.style.display == "string")
elem.style.display = display;
}
else
elem.style.display = display;
}
function displayButtons( buttonState )
{
tab_frame = document.getElementById("Associated_CIs_iframe");
var imgBtnArray2 = new Array();
if(tab_frame != null)
{
load_iframe("Associated_CIs_iframe");
button_arr = jq("#Associated_CIs_iframe").contents().find(".button");
imgBtnArray2 = tab_frame.contentWindow.imgBtnArray;
}
else {
button_arr = jq('.button');
imgBtnArray2 = imgBtnArray;
}
for (var buttonIndex = 0; buttonIndex < button_arr.length; buttonIndex++)
{	
if ( buttonState == true )
{
if( buttonIndex != button_arr.length-1 )
{	
for ( var i=0; i < imgBtnArray2.length;i++ ) {
var btn = imgBtnArray2[i];
if ( typeof btn.obj == "string" && btn.obj == button_arr[buttonIndex].id ) 
{
if(tab_frame != null)
btn.obj = tab_frame.contentWindow.document.getElementById(btn.obj); 
else
btn.obj = document.getElementById(btn.obj);
try {
jq(button_arr[buttonIndex]).addClass('disabledattr');
jq(button_arr[buttonIndex]).removeClass('enabledattr');
jq(button_arr[buttonIndex]).removeClass('buttonEnabled');
}
catch(e) {}
btn.obj.tabIndex = -1;
btn.enabled = false;
break;
}
else if(typeof btn.obj != "string" && btn.obj.id == button_arr[buttonIndex].id)
{
try {
jq(button_arr[buttonIndex]).addClass('disabledattr');
jq(button_arr[buttonIndex]).removeClass('enabledattr');
jq(button_arr[buttonIndex]).removeClass('buttonEnabled');
}
catch(e) {}
btn.obj.tabIndex = -1;
btn.enabled = false;
break;
}
}	
}
}
else
{	
for ( var i=0; i < imgBtnArray2.length;i++ ) {
var btn = imgBtnArray2[i];
if ( typeof btn.obj == "string" && btn.obj == button_arr[buttonIndex].id ) 
{
if(tab_frame != null)
btn.obj = tab_frame.contentWindow.document.getElementById(btn.obj); 
else
btn.obj = document.getElementById(btn.obj);
try {
jq(button_arr[buttonIndex]).addClass('enabledattr');
jq(button_arr[buttonIndex]).removeClass('disabledattr');
jq(button_arr[buttonIndex]).addClass('buttonEnabled');
}
catch(e) {}
btn.obj.tabIndex = btn.tabIndex;
btn.enabled = true;
break;
}
else if(typeof btn.obj != "string" && btn.obj.id == button_arr[buttonIndex].id)
{
try {
jq(button_arr[buttonIndex]).addClass('enabledattr');
jq(button_arr[buttonIndex]).removeClass('disabledattr');
jq(button_arr[buttonIndex]).addClass('buttonEnabled');
}
catch(e) {}
btn.obj.tabIndex = btn.tabIndex;
btn.enabled = true;
break;
}
}	
}
}
}
function loadButtons(non_global, delete_flag, window_type)
{
var global;
var inactive;
var bwindow;
global=((non_global=="0" || non_global == "")?true:false);
inactive = ( delete_flag == "1" ? true : false );
bwindow = ( window_type == "401" ? true : false );
displayButtons(global || inactive || bwindow);
}
imgbutton.pdmqa = function(caption, id) 
{
if (typeof caption == "string" && caption.length == 0)
{
return " pdmqa='" + id + "'";
}
else if (typeof caption == "string" && caption.length > 0)
{
var result = "";
var ULStartTag = /<U>/gi;
var ULEndTag = /<\/U>/gi;
var charsToKeep = /[^a-zA-Z0-9^\s^<^>]/g;
var blanksAtStart = /^\s*/;
var blanksAtEnd = /\s*$/;
result = caption.replace(ULStartTag, "");
result = result.replace(ULEndTag, "");
result = result.replace(charsToKeep, "");
result = result.replace(blanksAtStart, "").replace(blanksAtEnd, "");
result = result.replace(/\s+/g, "_");
if (result == "<")
{
result = "Left_Arrow";
} 
else if (result == "<<")
{
result = "Double_Left_Arrow"; 
} 
else if (result == ">")
{
result = "Right_Arrow";
} 
else if (result == ">>")
{
result = "Double_Right_Arrow";
}
return " pdmqa='" + result + "'";
}
else
{
return "";
}
}
// Copyright (c) 2005 CA.  All rights reserved.
function SubmitKnowledge()
{ 
if (ahdtop.CanUserPerformAction("ROLE_SUBMIT_KNOWLEDGE_ATTACHMENTS"))
{
var iCanAttach = 1; 
}
else
{
var iCanAttach = 0;
} 
var url=cfgCgi+
"?SID="+cfgSID+
"+FID="+fid_generator().toString()+
"+OP=CREATE_NEW" +
"+FACTORY=KD" +
"+HTMPL=detail_KD.htmpl" + 
"+KEEP.ATTACHMENT=" + iCanAttach;
var strFeatures="directories=no"+
",location=no"+
",menubar=no"+
",status=no";
preparePopup(url, "", strFeatures, undefined, undefined, '');
}
function CreateKnowledgeDocument()
{
var mf = ahdframeset.ahdframe;
if( typeof mf.__menuKnowledgeFile == "object" && mf.__menuKnowledgeFile != null )
{
var oMenuFile = mf.__menuKnowledgeFile;
if (!(oMenuFile.isItemActive("m_itmCreateDoc"))) 
{
return;	
}
}
var url=mf.cfgCgi+
"?SID="+mf.cfgSID+
"+FID="+fid_generator().toString()+
"+OP=CREATE_NEW" +
"+FACTORY=KD" +	
"+KEEP.IS_TREE=0";
if ( mf.parent.m_CurrentIndex > 1 )	
url += "+PRESET=PRIMARY_INDEX:" + mf.parent.m_CurrentIndex;
var strFeatures="directories=no"+
",location=no"+
",menubar=no"+
",status=no";
preparePopup(url, "", strFeatures, undefined, undefined, '');	
}
function CreateKnowledgeTree()
{
var mf = ahdframeset.ahdframe;
if( typeof mf.__menuKnowledgeFile == "object" && mf.__menuKnowledgeFile != null )
{
var oMenuFile = mf.__menuKnowledgeFile;
if (!(oMenuFile.isItemActive("m_itmCreateTree")))
{
return;	
}
}
var url=mf.cfgCgi+
"?SID="+mf.cfgSID+
"+FID="+fid_generator().toString()+
"+OP=CREATE_NEW" +
"+FACTORY=KD" +	
"+PRESET=DOC_TYPE_ID:2" + 
"+KEEP.IS_TREE=1";
if ( mf.parent.m_CurrentIndex > 1 )	
url += "+PRESET=PRIMARY_INDEX:" + mf.parent.m_CurrentIndex;
var strFeatures="directories=no"+
",location=no"+
",menubar=no"+
",status=no";
preparePopup(url,"",strFeatures, undefined, undefined, '');	
}
function CreateKnowledgeQA()
{
var mf = ahdframeset.ahdframe;
if( typeof mf.__menuKnowledgeFile == "object" && mf.__menuKnowledgeFile != null )
{
var oMenuFile = mf.__menuKnowledgeFile;
if (!(oMenuFile.isItemActive("m_itmCreateQA")))
{
return;	
}
}
if ( mf.parent.m_CurrentIndex > 0 )	
{
var url=mf.cfgCgi+
"?SID="+mf.cfgSID+
"+FID="+fid_generator().toString()+
"+OP=CREATE_NEW" +
"+FACTORY=KD_QA" +
"+PRESET=PRIMARY_INDEX:" + mf.parent.m_CurrentIndex;
var strFeatures="directories=no"+
",location=no"+
",menubar=no"+
",status=no";
preparePopup(url,"",strFeatures, undefined, undefined, '');	
}
}
function CreateKnowledgeFile()
{
var mf = ahdframeset.ahdframe;
if( typeof mf.__menuKnowledgeFile == "object" && mf.__menuKnowledgeFile != null )
{
var oMenuFile = mf.__menuKnowledgeFile;
if (!(oMenuFile.isItemActive("m_itmCreateFile")))
{
return;	
}
}
if ( mf.parent.m_CurrentIndex > 1 )	
{
var url=mf.cfgCgi+
"?SID="+mf.cfgSID+
"+FID="+fid_generator().toString()+
"+OP=CREATE_NEW" +
"+FACTORY=KD_FILE" +
"+PRESET=PRIMARY_INDEX:" + mf.parent.m_CurrentIndex;
var strFeatures="directories=no"+
",location=no"+
",menubar=no"+
",status=no";
preparePopup(url,"",strFeatures, undefined, undefined, '');	
}
}
function popupKnowledgeCategories() {
var form = "kt_architect.htmpl";
var url = cfgCgi + "?SID=" + cfgSID + "+FID=" + cfgFID +
"+OP=DISPLAY_FORM+HTMPL=" + form +
"+KEEP.IsPopUp=1+RELOAD_WIN=0";
var features="directories=no"+
",location=no"+
",status=no";
preparePopup(url, "ARCHITECT", features, -1, 1, "MENUBAR=no");
}
function popupKnowledgeReportCard() {
var form = "kt_report_card_init.htmpl";
var url = cfgCgi + "?SID=" + cfgSID + "+FID=" + cfgFID +
"+OP=DISPLAY_FORM+HTMPL=" + form +
"+KEEP.IsPopUp=1";
var features="directories=no"+
",location=no"+
",status=no";
preparePopup(url, "REPORT_CARD", features, -1, 1, "MENUBAR=no");
}
// Copyright (c) 2005 CA.  All rights reserved.
function ArchitectShowHideDetails()
{
ahdframe.parent.m_bShowDetails = !parent.m_bShowDetails;
ahdframe.parent.frmKCATs.LoadSkeletons(parent.m_CurrentIndex, parent.m_CurrentRelationalPath, parent.m_bShowDetails);	
}
function DeleteDocumentList()
{
ahdframe.DeleteDocumentList();
}
function ArchitectCategoriesAdd()
{
var LTreeID = ahdframe.parent.getTreeId();
var lKCAT = ahdframe.parent.m_CurrentIndex; 
ahdframeset.kt_catTreeWindow[LTreeID].AddCategory(lKCAT);
}
function ArchitectCategoriesModify()
{
var LTreeID = ahdframe.parent.getTreeId();
var lKCAT = ahdframe.parent.m_CurrentIndex; 
ahdframeset.kt_catTreeWindow[LTreeID].ModifyCategory(lKCAT);
}
function ArchitectCategoriesDelete()
{
var lKCAT = ahdframe.parent.getCurrentIndex();
var LTreeID = ahdframe.parent.getTreeId();
ahdframeset.kt_catTreeWindow[LTreeID].DeleteKCAT(lKCAT);
}
function ArchitectCategoriesCopy()
{
var LTreeID = ahdframe.parent.getTreeId();
if (ahdframe.parent.m_CurrentIndex != 0 && ahdframe.parent.m_CurrentIndex != 1)
ahdframeset.kt_catTreeWindow[LTreeID].CopyKCatWithNoKdLinks(ahdframe.parent.m_CurrentIndex);
}
function ArchitectCategoriesCopyWithLinks()
{
var LTreeID = ahdframe.parent.getTreeId();
if (ahdframe.parent.m_CurrentIndex != 0 && ahdframe.parent.m_CurrentIndex != 1)
ahdframeset.kt_catTreeWindow[LTreeID].CopyKCatWithKdLinks(ahdframe.parent.m_CurrentIndex);
}
function ArchitectCategoriesCut()
{
var LTreeID = ahdframe.parent.getTreeId();
if (ahdframe.parent.m_CurrentIndex != 0 && ahdframe.parent.m_CurrentIndex != 1)
ahdframeset.kt_catTreeWindow[LTreeID].CutKCat(ahdframe.parent.m_CurrentIndex);
}
function ArchitectCategoriesPaste()
{
var LTreeID = ahdframe.parent.getTreeId();
if (ahdframe.parent.m_CurrentIndex != 0)
ahdframeset.kt_catTreeWindow[LTreeID].PasteKCat(ahdframe.parent.m_CurrentIndex);
}
function KTHelpContents()
{
alert("KTHelpContents");
}
function KTHelpAbout()
{
alert("KTHelpAbout");
}
function CreateDocument()
{
if (ahdframe.parent.m_CurrentIndex > 1 )
{
var url=ahdtop.cfgCgi+
"?SID="+ahdtop.cfgSID+
"+FID="+fid_generator().toString()+
"+OP=CREATE_NEW" +
"+FACTORY=KD" +
"+PRESET=PRIMARY_INDEX:" + ahdframe.parent.m_CurrentIndex + 
"+KEEP.IS_TREE=0";
var strFeatures="directories=no"+
",location=no"+
",menubar=no"+
",status=no";
var width = ahdtop.GetUSPPreferences("WEB_POPUP1_WIDTH");
var height = ahdtop.GetUSPPreferences("WEB_POPUP1_HEIGHT");	
preparePopup(url, "", strFeatures, width, height, '');	
}
}
function CreateTree()
{
if (ahdframe.parent.m_CurrentIndex > 1 )
{
var url=ahdtop.cfgCgi+
"?SID="+ahdtop.cfgSID+
"+FID="+fid_generator().toString()+
"+OP=CREATE_NEW" +
"+FACTORY=KD" +
"+PRESET=PRIMARY_INDEX:" + ahdframe.parent.m_CurrentIndex +
"+PRESET=DOC_TYPE_ID:2" + 
"+KEEP.IS_TREE=1";
var strFeatures="directories=no"+
",location=no"+
",menubar=no"+
",status=no";
var width = ahdtop.GetUSPPreferences("WEB_POPUP1_WIDTH");
var height = ahdtop.GetUSPPreferences("WEB_POPUP1_HEIGHT");	
preparePopup(url, "", strFeatures, width, height, '');	
}
}
function CreateQA()
{
if (ahdframe.parent.m_CurrentIndex > 0 )
{
var url=ahdtop.cfgCgi+
"?SID="+ahdtop.cfgSID+
"+FID="+fid_generator().toString()+
"+OP=CREATE_NEW" +
"+FACTORY=KD_QA" +
"+PRESET=PRIMARY_INDEX:" + ahdframe.parent.m_CurrentIndex;
var strFeatures="directories=no"+
",location=no"+
",menubar=no"+
",status=no";
var width = ahdtop.GetUSPPreferences("WEB_POPUP1_WIDTH");
var height = ahdtop.GetUSPPreferences("WEB_POPUP1_HEIGHT");	
preparePopup(url, "", strFeatures, width, height, '');	
}
}
function CreateFile()
{
if (ahdframe.parent.m_CurrentIndex > 1 )
{
var url=ahdtop.cfgCgi+
"?SID="+ahdtop.cfgSID+
"+FID="+fid_generator().toString()+
"+OP=CREATE_NEW" +
"+FACTORY=KD_FILE" +
"+PRESET=PRIMARY_INDEX:" + ahdframe.parent.m_CurrentIndex;
var strFeatures="directories=no"+
",location=no"+
",menubar=no"+
",status=no";
var width = ahdtop.GetUSPPreferences("WEB_POPUP1_WIDTH");
var height = ahdtop.GetUSPPreferences("WEB_POPUP1_HEIGHT");	
preparePopup(url, "", strFeatures, width, height, '');	
}
}
// Copyright (c) 2005 CA.  All rights reserved.
var intCurrentStatus = 0;
var STATUS_SEARCHING=10;
var STATUS_FORMATTING=100;
var intIntervalBlink = 0;
var system_m_oNLSWindow = null;
var system_m_oDiscoverWindow = null;
var system_m_oFAQWindow = null;
var system_m_oExpertWindow = null;
var system_m_oArchitectWindow = null;
var bCheckCookiesOnStart = false;
var system_oWindowtoFocusOn=null;
document.onmouseover = system_doOver;
document.onmouseout = system_doOut;
document.onmousedown = system_doDown;
document.onmouseup = system_doUp;
document.onselectstart = document_onselectstart;
function system_FocusWstart(oWin)
{
system_oWindowtoFocusOn = oWin;
}
function system_FocusW(){
try
{
system_oWindowtoFocusOn.focus();
}
catch(e)
{
}
}
function document_onselectstart()
{
try
{
if (event.srcElement.tagName=="BODY")
{
event.returnValue = false;
}
}
catch(e)
{
}
}
function system_doDown(){
try
{
switch(event.srcElement.className)
{
case "clsBtnOn":
event.srcElement.className = "clsBtnDown";
break;
case "clsBtnOnIMG":
event.srcElement.parentElement.className = "clsBtnDown";
event.srcElement.className = "clsBtnDownIMG";
break;	
case "clsTBBtnOn":
event.srcElement.className = "clsTBBtnDown";
break;
case "clsTBBtnOnIMG":
event.srcElement.parentElement.className = "clsTBBtnDown";
event.srcElement.className = "clsTBBtnDownIMG";
break;	
default:
}
}
catch(e)
{
}
}
function system_doUp(){
try
{
switch(event.srcElement.className)
{
case "clsBtnDown":
event.srcElement.className = "clsBtnOn";
break;	
case "clsBtnDownIMG":
event.srcElement.parentElement.className = "clsBtnOn";
event.srcElement.className = "clsBtnOnIMG";
break;
case "clsTBBtnDown":
event.srcElement.className = "clsTBBtnOn";
break;	
case "clsTBBtnDownIMG":
event.srcElement.parentElement.className = "clsTBBtnOn";
event.srcElement.className = "clsTBBtnOnIMG";
break;	
default:
}
}
catch(e)
{
}
}
function system_doOver(){
{
try
{
if (event.srcElement.className=="")
{
return;
}
}
catch(e)
{
return;
}
try
{
switch(event.srcElement.className)
{
case "clsItemNonMarked":
event.srcElement.style.textDecoration = "underline";
break;
case "clsAnchorVisited":
event.srcElement.className = "clsAnchorVisitedRed";
break;
case "clsAnchor":
event.srcElement.className = "clsAnchorRed";
break;
case "TblHeaders":
event.srcElement.className = "TblHeadersRaised";
break;
case "MenuItem":
event.srcElement.className = "MenuItemMarked";
break;
case "clsMenuTD":
case "clsSubMenuItemIMG":
var oTR = system_GetParentElement(event.srcElement, "TR");
if (oTR != null)
{
if (oTR.className == "MenuItem")
{
oTR.className = "MenuItemMarked";
}
}	
break;
case "Categorycls":
event.srcElement.className = "CategoryMarkedcls";
break;
case "clsBtnOff":
event.srcElement.className = "clsBtnOn";
break;	
case "clsBtnOffIMG":
event.srcElement.parentElement.className = "clsBtnOn";
event.srcElement.className = "clsBtnOnIMG";
break;	
case "clsBtnOffU":
event.srcElement.parentElement.className = "clsBtnOn";
event.srcElement.className = "clsBtnOnU";
break;	
default:
}
switch(event.srcElement.className)
{
case "clsTBBtnOff":
event.srcElement.className = "clsTBBtnOn";
break;	
case "clsTBBtnOffIMG":
event.srcElement.parentElement.className = "clsTBBtnOn";
event.srcElement.className = "clsTBBtnOnIMG";
break;	
default:
}
if(event.srcElement.ButttonType=="dynamicButton"
||event.srcElement.parentElement.ButttonType=="dynamicButton")
{
if(event.srcElement.tagName=="IMG")
event.srcElement.src=event.srcElement.parentElement.Img;
else if(event.srcElement.tagName=="SPAN")
event.srcElement.parentElement.children(0).src=event.srcElement.parentElement.Img;
else 
event.srcElement.children(0).src=event.srcElement.Img;
} 
}
catch(e)
{
return;
}
}
try
{
Menu_Lib_Divonmouseover();
}
catch(e)
{
return;
}
}
function system_doOut(){
try
{
Menu_Lib_Divonmouseout();
}
catch(e)
{
}
try
{
if (event.srcElement.tagName=="INPUT")
{
if(event.srcElement.type=="image")
{
event.srcElement.style.position="relative";
event.srcElement.style.top = "0px";
event.srcElement.style.left = "0px";
}
}
switch(event.srcElement.className)
{
case "clsItemNonMarked":
event.srcElement.style.textDecoration = "";
break;
case "clsAnchorVisitedRed":
event.srcElement.className = "clsAnchorVisited"
break;
case "clsAnchorRed":
event.srcElement.className = "clsAnchor";
break;
case "TblHeadersRaised":
event.srcElement.className = "TblHeaders";
break;
case "MenuItemMarked":
event.srcElement.className = "MenuItem";
break;
case "clsMenuTD":
case "clsSubMenuItemIMG":
var oTR = system_GetParentElement(event.srcElement, "TR");
if (oTR != null)
{
if (oTR.className == "MenuItemMarked")
{
oTR.className = "MenuItem";
}
}	
break;	
case "CategoryMarkedcls":
event.srcElement.className = "Categorycls";
break;
case "clsBtnOn":
event.srcElement.className = "clsBtnOff";
break;	
case "clsBtnOnIMG":
event.srcElement.parentElement.className = "clsBtnOff";
event.srcElement.className = "clsBtnOffIMG";
break;
case "clsBtnOnU":
event.srcElement.parentElement.className = "clsBtnOff";
event.srcElement.className = "clsBtnOffU";
break;
case "clsBtnDown":
event.srcElement.className = "clsBtnOn";
break;	
case "clsBtnDownIMG":
event.srcElement.parentElement.className = "clsBtnOn";
event.srcElement.className = "clsBtnOnIMG";
break;	
case "clsBtnDownU":
event.srcElement.parentElement.className = "clsBtnOn";
event.srcElement.className = "clsBtnOnU";
break;	
default:
}
if (event.srcElement.tagName=="INPUT")
{
if(event.srcElement.type=="image")
{
event.srcElement.style.position="relative";
event.srcElement.style.top = "0px";
event.srcElement.style.left = "0px";
}
}
switch(event.srcElement.className)
{
case "clsTBBtnOn":
event.srcElement.className = "clsTBBtnOff";
break;	
case "clsTBBtnOnIMG":
event.srcElement.parentElement.className = "clsTBBtnOff";
event.srcElement.className = "clsTBBtnOffIMG";
break;	
case "clsTBBtnDown":
event.srcElement.className = "clsTBBtnOn";
break;	
case "clsTBBtnDownIMG":
event.srcElement.parentElement.className = "clsTBBtnOn";
event.srcElement.className = "clsTBBtnOnIMG";
break;	
default:
}
if(event.srcElement.ButttonType=="dynamicButton"
||event.srcElement.parentElement.ButttonType=="dynamicButton")
{
if(event.srcElement.tagName=="IMG")
event.srcElement.src=event.srcElement.parentElement.ImgDimmed;
else if(event.srcElement.tagName=="SPAN")
event.srcElement.parentElement.children(0).src=event.srcElement.parentElement.ImgDimmed;
else 
event.srcElement.children(0).src=event.srcElement.ImgDimmed;
} 
}
catch(e)
{
}
}
function system_ReplaceCharInString(parmStr,parmStrToFind,parmStrToReplace,intNumber)
{
return parmStr.toString().split(parmStrToFind).join(parmStrToReplace);
}
function system_GetXMLSignOut(strIn){
var strRetVal = strIn;
var intNumber= 0;
strRetVal = system_ReplaceCharInString(strRetVal,"&","&amp;",intNumber);
strRetVal = system_ReplaceCharInString(strRetVal,"<","&lt;",intNumber);
strRetVal = system_ReplaceCharInString(strRetVal,">","&gt;",intNumber);
strRetVal = system_ReplaceCharInString(strRetVal,"\"","&quot;",intNumber);
return strRetVal;
}
function system_GetXMLSignIn(strIn){
var strRetVal = strIn;
var intNumber= 0;
strRetVal = system_ReplaceCharInString(strRetVal,"&lt;","<",intNumber);
strRetVal = system_ReplaceCharInString(strRetVal,"&gt;",">",intNumber);
strRetVal = system_ReplaceCharInString(strRetVal,"&apos;","'",intNumber);
strRetVal = system_ReplaceCharInString(strRetVal,"&quot;","\"",intNumber);
strRetVal = system_ReplaceCharInString(strRetVal,"&amp;","&",intNumber);
return strRetVal;
}
function system_ValidateEmailAddress(strEmail)
{
return true;
/*
var emailPat=/^(.+)@(.+)$/;
var specialChars="\\(\\)<>@,;:\\\\\\\"\\.\\[\\]";
var validChars="\[^\\s" + specialChars + "\]";
var quotedUser="(\"[^\"]*\")";
var ipDomainPat=/^\[(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\]$/;
var atom=validChars + '+';
var word="(" + atom + "|" + quotedUser + ")";
var domainPat=new RegExp("^" + atom + "(\\." + atom +")*$");
var matchArray=strEmail.match(emailPat);
if (matchArray==null)
{
return false;
}
var user=matchArray[1];
var domain=matchArray[2];
var IPArray=domain.match(ipDomainPat);
if (IPArray!=null) {
for (var i=1;i<=4;i++) 
{
if (IPArray[i]>255) 
{
return false;
}
}
return true;
}
var domainArray=domain.match(domainPat);
if (domainArray==null) 
{
return false;
}
var atomPat=new RegExp(atom,"g");
var domArr=domain.match(atomPat);
var len=domArr.length;
if (domArr[domArr.length-1].length<2 || 
domArr[domArr.length-1].length>3) {
return false;
}
if (len<2) {
return false;
}
return true;
*/
}
var Divsysten_getTextFromHTML;
function system_GetTextFromHTML(sHTML)
{
if (_browser.isIE && _browser.version.major>3)
{
if (!Divsysten_getTextFromHTML)
{
Divsysten_getTextFromHTML = document.createElement("div");
}
Divsysten_getTextFromHTML.innerHTML = sHTML;
return Divsysten_getTextFromHTML.innerText;
}
else
{
return sHTML;
}
}	
function system_Trim(sString) {
var sNew = new String(sString);
if (sNew == "")
{
return "";
}
if (sNew == null)
{
return "";
}
while(sNew.charAt(0) == " ") {
sNew = sNew.substring(1, sNew.length);	
}
while(sNew.charAt(sNew.length-1) == " ") {
sNew = sNew.substring(0, sNew.length-1);	
}
return sNew;
}
function system_BreakString(strInput, intMaxLengthWithNoSpace)
{
var intBreakTimes;
var arrString = strInput.split(" ");
for (var i = 0; i<arrString.length; i++)
{
if (arrString[i].length > intMaxLengthWithNoSpace)
{
intBreakTimes = arrString[i].length / intMaxLengthWithNoSpace
for (var j =0;j<intBreakTimes;j++)
{
arrString[i] = arrString[i].substring(0,(j+1) * intMaxLengthWithNoSpace + j ) + " " + 
arrString[i].substring(intMaxLengthWithNoSpace * (j+1) + j);
}
}
}
return arrString.join(" ");
}
function OpenDocumentViewer(doc_id, open_mode, opener, doc_type, cat_tree_id, disable_solution_survey, disable_comment, disable_kd_links, disable_attachments)
{
if(isNaN(doc_id))
{
alertmsg("Document_ID_must_be_numeric!");
return;
}
if ( typeof disable_solution_survey == "string")
disable_solution_survey = disable_solution_survey.toLowerCase();
if ( typeof disable_solution_survey != "string" || disable_solution_survey != "true")
disable_solution_survey = "false";
if ( typeof disable_comment == "string")
disable_comment = disable_comment.toLowerCase();
if ( typeof disable_comment != "string" || disable_comment != "true")
disable_comment = "false";
if ( typeof disable_kd_links == "string")
disable_kd_links = disable_kd_links.toLowerCase();
if ( typeof disable_kd_links != "string" || disable_kd_links != "true")
disable_kd_links = "false";
if ( typeof disable_attachments == "string")
disable_attachments = disable_attachments.toLowerCase();
if ( typeof disable_attachments != "string" || disable_attachments != "true")
disable_attachments = "false";	
var features="directories=no"+
",location=no"+
",menubar=no"+
",status=no";
var fid = fid_generator();
var url = cfgCgi + "?SID=" + cfgSID + "+FID=" + fid;
url += "+OP=SHOW_DETAIL+HTMPL=kt_document_view.htmpl+PERSID=KD:" + doc_id;
if(typeof cat_tree_id != undefined)
if(opener == "architect")
url += "+KEEP.TreeID=" + cat_tree_id;
else
url	+= "+TreeID=" + cat_tree_id;
url += "+opener=" + opener + "+open_mode=" + open_mode +
"+doc_type=" + doc_type + "+disable_solution_survey=" + disable_solution_survey + 
"+disable_comment=" + disable_comment + "+disable_kd_links=" + disable_kd_links +
"+disable_attachments=" + disable_attachments;
for ( var i = 9; i < arguments.length; i++ )
url += "+" + nx_escape(arguments[i]).replace(/%3D/i,"=").replace(/\+/g,"%2b");
if(typeof m_SD_LAUNCHED!="undefined"&&m_SD_LAUNCHED!=null)
{
var sTicketPersID = m_SD_LAUNCHED;
var sTicketFactory = "";
if (sTicketPersID != '')
{
var arrtmp= sTicketPersID.split(":");
if (arrtmp.length > 0)
{
sTicketFactory = arrtmp[0];
}	
}
url += "+SD_LAUNCHED=" + m_SD_LAUNCHED + "+TICKET_FACTORY=" + sTicketFactory;	
if(typeof m_LAUNCHED_ITIL!="undefined"&&m_LAUNCHED_ITIL!=null)
{
url += "+LAUNCHED_ITIL=" + m_LAUNCHED_ITIL;
}
}
if (typeof b_Print_Version=="boolean" && b_Print_Version!=null )
{
url+= "+printable="+b_Print_Version;
if (b_Print_Version)
preparePopup(url,"DOC_VIEW_WIN"+doc_id,features,undefined,undefined,'GOBUTTON=no+MENUBAR=no');
else 
preparePopup(url,"DOC_VIEW_WIN"+doc_id,features,undefined,undefined,'');
return;
}
if(open_mode == 1 || (ahdtop.cstReducePopups && arguments.length <3))
ahdtop.ahdframe.document.location.href = url;	
else if(open_mode == 2)	
{
if(typeof _dtl == "object" || 
(typeof m_bForceReloadKD != "undefined" && m_bForceReloadKD))
{
replace_page(url);
return;
}
var bOpenInNewWindow = false;
if ( typeof m_bOpenDocInPopUp != "undefined" && m_bOpenDocInPopUp )
bOpenInNewWindow = true;
switchToDetail("KD:"+doc_id, 0, false, void(0), url, void(0), void(0), void(0), void(0), bOpenInNewWindow);
}
else
document.location.href = url;	
}
function OpenDocument(kdid)
{
var url = cfgCgi + "?SID=" + cfgSID + "+FID=" + cfgFID +
"+OP=SHOW_DETAIL+PERSID=KD:" + kdid + "+HTMPL=kt_document_view.htmpl+opener=user_view+disable_kcat_links=true+RELOAD_WIN=0";
if (typeof argsDocTemplateId != "undefined")
url+= "+disable_solution_survey=true+disable_comment=true";
else
url+= "+open_mode=2+disable_solution_survey=false+disable_comment=false";
var features="directories=no"+
",location=no"+
",menubar=no"+
",status=no";
preparePopup(url, "DOC_VIEW_WIN" + kdid, features, undefined, undefined, 'GOBUTTON=no+MENUBAR=no');	
}
function HTML_Entity_Decoder(str) 
{
var TextArea=document.createElement("textarea");
TextArea.innerHTML=str.replace(/</g,"&lt;").replace(/>/g,"&gt;");
return TextArea.value;
}
/*
* This is the function that actually highlights a text string by
* adding HTML tags before and after all occurrences of the search
* term. You can pass your own tags if you'd like, or if the
* highlightStartTag or highlightEndTag parameters are omitted or
* are empty strings then the default <font> tags will be used.
*/
function doHighlight(bodyText, searchTerm, highlightStartTag, highlightEndTag, matchBeginning) 
{
if (ahdtop.cfgHighlightKeywords == "No")
{
return bodyText;
}
if ((!highlightStartTag) || (!highlightEndTag)) {
highlightStartTag = "<B>";
highlightEndTag = "</B>";
}
if ((!matchBeginning)) {
matchBeginning = false;
} 
var newText = "";
var i = -1;
var lcSearchTerm = searchTerm.toLowerCase();
var lcBodyText = bodyText.toLowerCase();
lcBodyText= HTML_Entity_Decoder(lcBodyText);
bodyText = HTML_Entity_Decoder(bodyText);
var rngWordChr = "[" + ahdtop.m_sValidCharRange + "_0-9]";
var rngNonWordChr = "[^" + ahdtop.m_sValidCharRange + "_0-9]"
while (bodyText.length > 0) {
i = lcBodyText.indexOf(lcSearchTerm, i+1);
if (i < 0) {
newText += bodyText;
bodyText = "";
} else {
if (bodyText.lastIndexOf(">", i) >= bodyText.lastIndexOf("<", i)) {
if (lcBodyText.lastIndexOf("/script>", i) >= lcBodyText.lastIndexOf("<script", i)) {
if (ahdtop.cfgEBRVersion == 'SEARCH_ENGINE')
{
if (searchTerm.length > 1)
{
bodyText = " " + bodyText + " ";
var lIndex = -1;
var bFound = false;
var strPattern = rngNonWordChr + searchTerm + rngNonWordChr;
while ( bodyText.search(RegExp(strPattern, "i")) != -1 )
{
lIndex = bodyText.search(RegExp(strPattern, "i"));
if (!bFound)
{
bodyText = bodyText.substr(1);
lIndex--;
bFound = true;
}
if (bodyText.lastIndexOf(">", lIndex) >= bodyText.lastIndexOf("<", lIndex)) {
if (lcBodyText.lastIndexOf("/script>", i) >= lcBodyText.lastIndexOf("<script", i)) {
newText += bodyText.substring(0, lIndex+1) + highlightStartTag + bodyText.substr(lIndex+1, searchTerm.length) + highlightEndTag;	
}
else {
newText += bodyText.substring(0, lIndex+1 + searchTerm.length);
}
}	
else {
newText += bodyText.substring(0, lIndex+1 + searchTerm.length);
}
bodyText = bodyText.substr(lIndex+1 + searchTerm.length);
lcBodyText = bodyText.toLowerCase();
}
if (!bFound)
{
bodyText = bodyText.substr(1);
}
bodyText = bodyText.substr(0, bodyText.length - 1);
}
newText += bodyText;
bodyText = "";
}
else
{
if (!matchBeginning) {
try
{
var rxWhWrd = new RegExp(searchTerm, "i");
var isTheWholeWord = "";
if (i>0)
isTheWholeWord += bodyText.substr(i-1, 1);
isTheWholeWord = bodyText.substr(i, searchTerm.length);
if (i+searchTerm.length<bodyText.length)
isTheWholeWord += bodyText.substr(i+searchTerm.length, 1);
if (searchTerm.search(RegExp(rngNonWordChr,"i")) < 0)
{
if (null != isTheWholeWord.match(rxWhWrd)) {
newText += bodyText.substring(0, i) + highlightStartTag + bodyText.substr(i, searchTerm.length) + highlightEndTag;
bodyText = bodyText.substr(i + searchTerm.length);
lcBodyText = bodyText.toLowerCase();
i = -1;
}	
}
}
catch(e)
{
}
}
else {
try
{
var rxWhWrd = new RegExp(searchTerm, "i");
var isTheWholeWord = "";
if (i>0)
isTheWholeWord += bodyText.substr(i-1, 1);
isTheWholeWord = bodyText.substr(i, searchTerm.length);
if (i+searchTerm.length<bodyText.length)
isTheWholeWord += bodyText.substr(i+searchTerm.length, 1);
if (searchTerm.search(RegExp(rngWordChr,"i")) == 0)
{	
if (null != isTheWholeWord.match(rxWhWrd)) {
newText += bodyText.substring(0, i) + highlightStartTag + bodyText.substr(i, searchTerm.length) + highlightEndTag;
bodyText = bodyText.substr(i + searchTerm.length);
lcBodyText = bodyText.toLowerCase();
i = -1;
}
}
}
catch(e)
{
}
}
}
}
}
}
}
return newText;
}
function getAvgRatingText(iAvgRating, iTotalVotes)
{
var sText;
if(typeof iTotalVotes!= "undefined" && iTotalVotes!=null)
{
if (iTotalVotes == 0 || iTotalVotes == "" || iTotalVotes == "N/A")
{
sText = msgtext("N/A");
return sText;
}
}
if(iAvgRating <= 1)
sText = msgtext("Not_helpful_at_all");
else if (iAvgRating <= 3)
sText = msgtext("Somewhat_helpful");
else
sText = msgtext("Very_helpful");
return sText;
}
function getAvgRatingTextLong(iAvgRating, iTotalVotes)
{
var sText;
if(typeof iTotalVotes!= "undefined" && iTotalVotes!=null)
{
if (iTotalVotes == 0 || iTotalVotes == "" || iTotalVotes == "N/A")
{
sText = msgtext("N/A");
return sText;
}
}
if (ahdtop.cstUsingScreenReader)
{
if(iAvgRating <= 1)
sText = msgtext(" Average rating is <b>Not helpful at all</b>.");
else if (iAvgRating <= 3)
sText = msgtext(" Average rating is <b>Somewhat helpful</b>.");
else
sText = msgtext(" Average rating is <b>Very helpful</b>.");
} else {
if(iAvgRating <= 1)
sText = msgtext(" Average rating<BR>is <b>Not helpful at all</b>.");
else if (iAvgRating <= 3)
sText = msgtext(" Average rating<BR>is <b>Somewhat helpful</b>.");
else
sText = msgtext(" Average rating<BR>is <b>Very helpful</b>.");
}
return sText;
}
function replaceQuote(textIn)
{
var rxQuote = new RegExp(/"/g);
textIn = textIn.replace(rxQuote, "&quot;");
return textIn;
}	
function replaceGT_LT(textIn)
{
var rxQuote = new RegExp(/&gt;/g);
textIn = textIn.replace(rxQuote, ">");
rxQuote = new RegExp(/&lt;/g);
textIn = textIn.replace(rxQuote, "<");
return textIn;
}
// Copyright (c) 2005 CA.  All rights reserved.
var orig_onload = null,
orig_onunload = null,
orig_onresize = null;
function std_footer_setup()
{
ImgBtnEnableDeferred();
if ( typeof window.onload != "undefined" )
orig_onload = window.onload;
if ( typeof window.onunload != "undefined" )
orig_onunload = window.onunload;
if ( typeof window.onresize != "undefined" )
orig_onresize = window.onresize;
window.onload = do_this_onload;
window.onunload = do_this_onunload;
if (typeof FrontPage != "undefined" && 
FrontPage)
{
window.onload = null;
window.onunload = null;
}
if (typeof endScrollbar == "function")
endScrollbar(false);
if (typeof popupHTMLText == "function")
popupHTMLText();
}
function do_this_onunload()
{
var e;
try {
var ahdtop;
if ((typeof window.ahdtop == "object") && 
(window.ahdtop != null))
ahdtop = window.ahdtop;
else 
if ((typeof window.parent.ahdtop == "object") &&
(window.parent.ahdtop != null))
ahdtop = window.parent.ahdtop;
else 
if (typeof window.parent.opener == "object")
{
if (window.parent.opener.closed)
return;
else 
{
if ((typeof window.parent.opener.ahdtop == "object") && 
(window.parent.opener.ahdtop != null))
ahdtop = window.parent.opener.ahdtop;
else 
if (typeof get_ahdtop == "function")
ahdtop = get_ahdtop();
}
}
if ( typeof ahdtop == "object" && ahdtop != null ) {
if ( typeof _dtl == "object" &&
typeof ahdtop.detailForms == "object" )
detailOnUnload();
if ( typeof ahdtop.propSupportR50 == "string" && 
ahdtop.propSupportR50 != "no" && 
typeof parent.menubar == "object" )
parent.menubar.location.reload();
if (ahdframeset == ahdtop &&
ahdtop.cstReducePopups &&
typeof _dtl == "object" && _dtl.edit &&
ahdframe.currentAction == ACTN_COMPLETE) 
{
if (typeof noCancelAtomicCond != "number" || noCancelAtomicCond != 1)
cancel_window();
}
}	
if (orig_onunload != null) 
orig_onunload();
if ( ahdframe.name != "cai_main" &&
ahdframe.name != "content" &&
ahdframe.name != "kdlist" &&
ahdframe.name != "frmKDs" &&
ahdframe.name != "page" &&
typeof argPopupName == "string" ) {
var url = cfgCgi + "?SID=" + cfgSID + "+FID=0+REMOVECACHE=" + argPopupName;
ahdtop_load_workframe(url, 30000, "ONE_WAY", "is_popup_window_still_up", parent); 
}
else if ( typeof clearSpigotReq == "boolean" && clearSpigotReq ) {
var url = cfgCgi + "?SID=" + cfgSID + "+FID=0+CLEARSPIGOT=" + cfgFID;
if ( ahdframe.parent.name.match(/^USD\d*$/) )
url += "+POPUP=" + ahdframe.parent.name;
ahdtop_load_workframe(url, 0, "ONE_WAY");
}
if (typeof ams_win_arr == "object" &&
ams_win_arr.length > 0)
{
for (var i = 0; i < ams_win_arr.length; i++)
{
if (typeof ams_win_arr[i] == "object" &&
!ams_win_arr[i].closed)
ams_win_arr[i].close(); 
}
} 
}
catch(e) {}
}
function set_default_for_gobtn()
{
if ( typeof propFormName == "string" &&
propFormName.indexOf("profile_") == -1 &&
typeof ahdframeset != "undefined" &&
typeof ahdframeset.gobtn == "object" ) {
if (ahdtop.cstReducePopups)
ahdframeset.gobtn.form_cancelled = false;
var sel;
if ((typeof ahdtop.use_role != "undefined") && 
ahdtop.use_role)
sel = ahdframeset.gobtn.document.getElementById("ticket_type");
else 
sel = ahdframeset.gobtn.document.getElementById("factory");
if ( typeof sel == "object" &&
sel != null &&
sel.type == "select-one" ) {
var fac = "";
var specialCase = 0;
if ( propFormName == "scratchpad.htmpl" ) {
fac = "pb";
specialCase = 1;
}
else {
if (typeof propFactory == "string" && 
propFactory != "")
{
if (propFactory == "cr")
fac = propFormName2;
else 
fac = propFactory;
}
else if ( propFormName.match(/list_(\w*)\./) ||
propFormName.match(/detail_(\w+)/) )
fac = RegExp.$1;
}
if (fac == "KCAT" || fac == "BU_TRANS" || fac == "EBR_LOG")
fac = "KD";
if (window.name != ahdframe.name && !specialCase)
return;
var selectionMade = 0;
if ( fac.length > 0 ) {
var dflt_go_code="";
var dflt_go_obj="";
dflt_go_code=ahdframeset.gobtn.find_dflt_go();
if(typeof dflt_go_code != "undefined" && dflt_go_code.length > 0)
dflt_go_obj=ahdframeset.gobtn.find_dflt_obj_type(dflt_go_code);
if(dflt_go_obj.length > 0 && fac == dflt_go_obj) {
} else {
for ( var i = 0; i < sel.length; i++ ) {
var t = sel.options[i].value;
if ((typeof ahdtop.use_role != "undefined") && 
ahdtop.use_role)
t = ahdframeset.gobtn.find_dflt_obj_type(t);
t = t.toUpperCase();
fac = fac.toUpperCase();
if ( t.length >= fac.length &&
( t == fac ||
t.substr(0,fac.length+1) == fac + "." ) ) {
sel.selectedIndex = i;
selectionMade = 1;
break;
}
}
}
}
if (!selectionMade) {
for ( var i = 0; i < sel.length; i++ ) {
if (sel.options[i].defaultSelected == true) {
sel.selectedIndex = i;
break;
}
}
}
}
} 
}
function do_this_onload()
{
if (ahdframeset != ahdtop &&
window.name == "page" && 
typeof window.find_menubar_from_popup != "undefined")
{
window.find_menubar_from_popup = "1";
if (typeof ahdtop.role_menubar_win != "undefeined")
ahdtop.role_menubar_win = window;
}
if ( ahdtop.cfgUserType != "analyst" && 
typeof AlertMsg == "string" &&
AlertMsg.length > 0 ) {
formatAlertMsg();
show_response(AlertMsg.replace(RegExp("<BR>","gi"),"\n"));
}
else if ( ahdtop.cstUsingScreenReader ) {
var e = document.getElementById("alertmsgText");
if ( e != null &&
e.innerHTML.length > 0 )
show_response(e.innerHTML.replace(RegExp("<BR>","gi"),"\n"));
}
ahdtop.saveAckMsgNum = void(0);
if ( typeof ahdtop.savedShowMsg == "string" && ahdtop.savedShowMsg != "" ) {
show_response(msgtext(ahdtop.savedShowMsg));
ahdtop.savedShowMsg = void(0);
}
if ( typeof start_notebook_used == "boolean" &&
start_notebook_used )
show_notebook();
if (typeof setup_for_menubar == "function" && 
typeof load_menu_items == "function")
{
load_menu_items();
}
if (orig_onload != null) 
{ 
orig_onload();
}
if (typeof parent.is_form_loaded == "boolean")
parent.is_form_loaded = true;
if ( typeof scrollDivCount == "number" && scrollDivCount > 0 ) {
adjScrollDivHeight();
if(_browser.isIE && is_standardmode_on && window != undefined && 
window.parent != undefined && window.parent.attachEvent){
window.parent.attachEvent( "onresize", callOnResizeEvents );
} else {
window.onresize=callOnResizeEvents;	
}
}
jq("div").scroll(function() {
closeAutosuggestList()	
});
set_default_for_gobtn();
if (typeof set_action_in_progress == "function")
set_action_in_progress(0);
if ( typeof formCheckpoint == "object" )
showStatistics();
if (typeof exp_sec_node != "undefined")
exp_sec_node.on_load_func();
if ((propFormName1 == "list") &&
(parent.name == "cai_main") &&
(typeof checkTabLoadFlag == "function") &&
checkTabLoadFlag())
setTabLoadComplete(); 
if ( typeof __menuBar == "object" &&
__menuBar != null &&
__menuBar.deferSetupCompletion ) {
try {
menubarFrame.finishMenus();
}
catch(e) {}
}
if ( typeof initialFocusElement == "object" ) {
try{ initialFocusElement.focus() }
catch(e) {}
initialFocusElement = void(0);
}
else
{	
var url = window.location.href;
var s = url.indexOf('&KEEP.cur_sort_key=');	
if (parent.name == "cai_main" && propFormName1 == "list") {
if( typeof rs != "undefined" &&
typeof rs.records != "undefined" &&
rs.records.length > 0 && s != -1 )	
selectRow(0);
}
}
if (!_browser.isIE &&
typeof ahdframe == "object" && 
ahdframe != null && typeof doNotSetFocus != "undefined" && doNotSetFocus != 1)
ahdframe.focus(); 
set_tab_height();
} 
function resizeScrollDiv()
{
adjScrollDivHeight();
if ( orig_onresize != null )
orig_onresize();
}
function callOnResizeEvents()
{
if(orig_onresize==null)
adjScrollDivHeight();
else
resizeScrollDiv();
closeAutosuggestList();	
}
function closeAutosuggestList()
{
var focus_ele = jq('.focusField');
if(focus_ele != null && typeof focus_ele != "undefined")
{
if(focus_ele.length != 0 && focus_ele[0].id != "")
{
var autocomplete_widget = jq('#'+focus_ele[0].id).autocomplete('ui.autocomplete');
if(autocomplete_widget != null && typeof autocomplete_widget != "undefined")
{
autocomplete_widget.autocomplete('close');
}	
}
}	
}
function set_tab_height()
{
var accordion_table_height = 0, dummy_img_height = 0, acc_tbl, acc_img;
if( jq('#acc_table_toplevel') != null && jq('#acc_table_toplevel').length > 0 && 
jq('#acc_table_toplevel_img') != null && jq('#acc_table_toplevel_img').length > 0 ) 
{
acc_tbl = jq('#acc_table_toplevel');
acc_img = jq('#acc_table_toplevel_img');
} 
else if ( jq('#acc_table_inner') != null && jq('#acc_table_inner').length > 0 && 
jq('#acc_table_inner_img') != null && jq('#acc_table_inner_img').length > 0 ) 
{
acc_tbl = jq('#acc_table_inner');
acc_img = jq('#acc_table_inner_img');
}	
if ((typeof acc_tbl == "object") && (typeof acc_img == "object"))
{
accordion_table_height = acc_tbl.attr('clientHeight');
dummy_img_height = acc_img.attr('height');
if( accordion_table_height > dummy_img_height )
acc_img.css({'height':accordion_table_height});	
}
}
// Copyright (c) 2005 CA.  All rights reserved.
// frameset.js,v 1.5 2007/01/04 23:19:16
function createFrameset(id, frame_border, border_space, cols, rows, 
onload_func, onunload_func)
{
var html_str = "<FRAMESET ID='" + id + "' frameborder=" + frame_border;
if (border_space != "")
if (!_browser.isIE)
html_str += " frameborder=" + border_space;
else 
html_str += " framespacing=" + border_space;
if (cols != "")
html_str += " COLS='" + cols + "'";
else 
html_str += " ROWS='" + rows + "'";
if (onload_func != "")
html_str += " onLoad='" + onload_func + "'";
if (onunload_func != "")
html_str += " onUnload='" + onunload_func + "'";
html_str += ">";
document.writeln(html_str);
}
function createFrame(id, frame_name, web_form_name, src, frame_border, 
noresize, scrolling, marginheight, marginwidth, 
style, title, tabindex, extra)
{
if (src == "<report>")
{
src = ahdtop.cfgCgi +
"?SID=" + ahdtop.cfgSID +
"+FID=" + fid_generator() +
"+OP=SHOW_REPORT" +
"+HTMPL=report_frames.htmpl" + 
"+frame_name=" + frame_name + 
"+web_form_name=" + web_form_name;
var tab_id = getCurrTabID();
if (tab_id == "")
alertmsg("The_current_tab_id_is_missing.");
else 
src += "+tab_id=" + tab_id;
if (typeof ahdtop.cfgCurrentRoleID != "string")
alertmsg("The_current_role_id_is_missing");
else 
src += "+role_id=" + ahdtop.cfgCurrentRoleID;
}
src = resolveWebFormVars(src); 
var html_str = "<FRAME ID='" + id + "' SRC='" + src + "'" +
" name='" + frame_name + "' frameborder=" + frame_border;
if (noresize == "true")
html_str += " NORESIZE";
html_str += " scrolling=" + scrolling;
if (marginheight != "")
html_str += " marginheight=" + marginheight;
if (marginwidth != "")
html_str += " marginwidth=" + marginwidth;
if (style != "")
html_str += " style='" + style + "'";
if (title != "")
html_str += " title='" + title + "'";
if (tabindex != "")
html_str += " tabindex=" + tabindex + "'";
if (extra != "")
html_str += extra;
html_str += ">";
document.writeln(html_str);
}
function getCurrTabID()
{
var tab_id = "";
var toolbarTab = ahdtop.toolbarTab;
var currID = ahdtop.toolbarCurrentTab;
if (typeof toolbarTab != "undefined" &&
typeof currID != "undefined")
{
tab_id = toolbarTab[currID].id;
var arr = tab_id.match(/tab_(.+)$/);
if (arr != null) 
tab_id = arr[1];
}
return tab_id; 
}
// Copyright (c) 2005 CA.  All rights reserved.
var moPreviewTimeoutToken;
var mo_preview_win = void(0);
function startMOPreviewTimeout( persid, keep_name, keep_value )
{
var base_args_len = 3;
var extra_args_len = arguments.length - base_args_len;
if (typeof cfgCanViewMOPreview == "boolean") {
if ( ! cfgCanViewMOPreview ) {
return;
}
}
else if (typeof cfgCanView == "boolean" && ! cfgCanView) {
return;
}
var colIdx = persid.indexOf(":");
if (colIdx < 0)
return;
var factory = persid.substr(0, colIdx);
var id = persid.substr(colIdx + 1);
if ( id == "" || factory == "") {
return;
}
var delay_time = 1000;
if (typeof cfgMOPreviewDelayTime == "number" && cfgMOPreviewDelayTime >= 0) {
delay_time = cfgMOPreviewDelayTime;
}
if ((typeof keep_name != "string" || keep_name == "") ||
(typeof keep_value != "string" || keep_value == ""))
{
keep_name = "";
keep_value = "";
}
var buildStr = "buildMOPreviewInfo('" + factory + "'" +
",'" + id + "'" +
",'" + keep_name + "'" +
",'" + keep_value + "'";
if (extra_args_len > 0 && (extra_args_len % 2 == 0))
{
for (var i=base_args_len; i < arguments.length; i+=2)
{
if (typeof arguments[i] == "string" && arguments[i] != "" &&
typeof arguments[i+1] == "string" && arguments[i+1] != "")
{
buildStr += ",'" + arguments[i] + "'" +
",'" + arguments[i+1] + "'";
}
}
}
buildStr += ");"
moPreviewTimeoutToken = window.setTimeout( buildStr, delay_time );
}
function closeMOPreview( )
{
jq("#mo_preview_container_div").trigger("mouseup");
clearTimeout(moPreviewTimeoutToken);
moPreviewTimeoutToken = void(0);
var preview_iframe = document.getElementById("mo_preview_iframe");
if (typeof preview_iframe == "object" && preview_iframe != null) {
preview_iframe.src = "";
if (typeof preview_iframe.contentDocument == "object" && preview_iframe.contentDocument != null &&
typeof preview_iframe.contentDocument.body == "object" && preview_iframe.contentDocument.body != null) {
preview_iframe.contentDocument.body.innerHTML = "";
}
}
var preview_div = document.getElementById("mo_preview_container_div");
if (typeof preview_div == "object" && preview_div != null) {
preview_div.style.display = "none";
}
if (typeof ahdframe == "object" && ahdframe.currentAction == ACTN_LOADFORM) {
set_action_in_progress(ACTN_COMPLETE);
}
}
function cancelBuildingMOPreview( )
{
if ( typeof moPreviewTimeoutToken != "undefined" ) {
window.clearTimeout(moPreviewTimeoutToken);
moPreviewTimeoutToken = void(0);
}
}
function buildMOPreviewInfo( factory, id, keep_name, keep_value )
{
var base_args_len = 4;
var extra_args_len = arguments.length - base_args_len; 
closeMOPreview();
if (typeof propFormName == "string")
{
if (propFormName == "list_KD_ATTMNT.htmpl" && typeof arrFields == "object") {
id = arrFields["KD_ATTMNT:" + id + "-doc_id"];
factory = "KD";
}
if (propFormName == "detail_QUERY_POLICY.htmpl" && factory == "QUERY_POLICY_ACTIONS" &&
typeof arrMacrosByQPid == "object") {
id = arrMacrosByQPid[id];
factory = "macro";
}
}
var url = cfgCgi +
"?SID=" + cfgSID +
"+FID=" + fid_generator().toString() +
"+OP=SHOW_DETAIL" + 
"+FACTORY=" + factory +
"+PERSID=" + factory + "%3A" + id +
"+KEEP.MO_PREVIEW_MODE=1";
if (typeof keep_name == "string" && keep_name != "" &&
typeof keep_value == "string" && keep_value != "") {
url += "+KEEP." + keep_name + "=" + keep_value;	
}
if (extra_args_len > 0 && (extra_args_len % 2 == 0))
{
for (var i=base_args_len; i < arguments.length; i+=2)
{
if (typeof arguments[i] == "string" && arguments[i] != "" &&
typeof arguments[i+1] == "string" && arguments[i+1] != "")
{
url += "+" + arguments[i] + "=" + arguments[i+1];
}
}
}
var preview_iframe = document.getElementById("mo_preview_iframe");
var preview_div = document.getElementById("mo_preview_container_div");
if (typeof preview_iframe == "object" && preview_iframe != null) 
{
preview_iframe.src = url;
if (typeof preview_div == "object" && preview_div != null) {
preview_div.style.display = "block";
}	
}
mo_preview_win = window;
moPreviewTimeoutToken = void(0);
}
var draggable_option = new Object();
draggable_option.cursor = 'move';
draggable_option.grid = [5,5];
draggable_option.iframeFix = true;
draggable_option.containment = 'document';
var resizable_option = new Object();
resizable_option.minHeight = 200;
resizable_option.minWidth = 200;
resizable_option.helper = 'mo_preview_resizable_helper';
resizable_option.resize = function(event, ui){resizePreviewResize(ui);};
resizable_option.stop = function(event, ui){resizePreviewStop(ui);};
function mo_preview(draggable_option, resizable_option)
{
this.draggable_option = draggable_option;
this.resizable_option = resizable_option;
}
function moPreviewHTML ()
{
var mo_preview_html = "<div class=\"mo_preview_container\" id=\"mo_preview_container_div\">";
mo_preview_html += "<div class=\"mo_preview_foreground\" id=\"mo_preview_div_foreground\">";
mo_preview_html += "<iframe class=\"mo_preview_contents\" id=\"mo_preview_iframe\" src=\"" + cfgCAISD + "/html/empty.html\" scrolling='auto'>";
mo_preview_html += msgtext("This_window_requires_iframe");
mo_preview_html += "</iframe>";
mo_preview_html += "</div>";
mo_preview_html += "<div class=\"mo_preview_background\" id=\"mo_preview_div_background\" ></div>";
mo_preview_html += "</div>";
return mo_preview_html;
}	
function resizePreviewResize(ui)
{
var win_l = mo_preview_win.document.body.clientLeft;
var win_w = mo_preview_win.document.body.clientWidth;
var win_t = mo_preview_win.document.body.clientTop;
var win_h = mo_preview_win.document.body.clientHeight;
var maxUIWidth = win_w - win_l - ui.position.left - 10;
var maxUIHeight = win_h - win_t - ui.position.top - 10;
if (ui.size.width > maxUIWidth) {
ui.size.width = maxUIWidth;
jq("#mo_preview_container_div").trigger("mouseup");
}
if (ui.size.height > maxUIHeight) {
ui.size.height = maxUIHeight;
jq("#mo_preview_container_div").trigger("mouseup");
}
}
var moPreviewBordersDiffs = [];
function resizePreviewStop(ui)
{
var bg_div = jq("#mo_preview_div_background").get(0);
if (moPreviewBordersDiffs.length < 2)
{
var borderTop = 0;
var borderBottom = 0;
var borderLeft = 0;
var borderRight = 0;
if (bg_div.currentStyle) {
var borderTop = bg_div.currentStyle.borderTopWidth;
var borderBottom = bg_div.currentStyle.borderBottomWidth;
var borderLeft = bg_div.currentStyle.borderLeftWidth;
var borderRight = bg_div.currentStyle.borderRightWidth;
}
else {
var compStyle =	window.getComputedStyle(bg_div, null);
borderTop = compStyle.getPropertyValue("border-top-width");
borderBottom = compStyle.getPropertyValue("border-bottom-width");
borderLeft = compStyle.getPropertyValue("border-left-width");	
borderRight = compStyle.getPropertyValue("border-right-width");	
}
if ( borderTop.match(/^(.*)(px)$/) ) {
if ( RegExp.$2.length > 0 ) {
borderTop = RegExp.$1;
}
}
if ( borderBottom.match(/^(.*)(px)$/) ) {
if ( RegExp.$2.length > 0 ) {
borderBottom = RegExp.$1;
}
}
if ( borderLeft.match(/^(.*)(px)$/) ) {
if ( RegExp.$2.length > 0 ) {
borderLeft = RegExp.$1;
}
}
if ( borderRight.match(/^(.*)(px)$/) ) {
if ( RegExp.$2.length > 0 ) {
borderRight = RegExp.$1;
}
}
moPreviewBordersDiffs[0] = parseInt(borderLeft) + parseInt(borderRight);
moPreviewBordersDiffs[1] = parseInt(borderBottom) + parseInt(borderTop);
}
bg_div.style.width = ui.size.width - moPreviewBordersDiffs[0] + 'px';
bg_div.style.height = ui.size.height - moPreviewBordersDiffs[1] + 'px';
var fg_div = jq("#mo_preview_div_foreground").get(0);
fg_div.style.width = ui.size.width - moPreviewBordersDiffs[0] + 'px';
fg_div.style.height = ui.size.height - moPreviewBordersDiffs[1] + 'px';
var mo_iframe = jq("#mo_preview_iframe").get(0);
mo_iframe.style.width = ui.size.width - moPreviewBordersDiffs[0] + 'px';
mo_iframe.style.height = ui.size.height - moPreviewBordersDiffs[1] + 'px';
}
function getMOPreviewEventHtml( persid, keep_name, keep_value )
{
var moEventHtml = "";
var ahdtop = get_ahdtop();
if ( (typeof ahdtop == "object" && ahdtop.cfgUserType == "analyst" && ! ahdtop.cstDisablePreviews ) &&
(typeof persid == "string" && persid != "")) {
var moKeepName = "";
var moKeepValue = "";
if (typeof keep_name == "string" && keep_name != "") {
moKeepName = keep_name;
if (typeof keep_value == "string" && keep_value != "") {
moKeepValue = keep_value;
}
}
moEventHtml += " onmouseover=\"ahdframe.startMOPreviewTimeout('" + persid + "','" + moKeepName + "','" + moKeepValue + "');\"" + 
" onmouseout=\"ahdframe.cancelBuildingMOPreview()\"" +
" onclick=\"ahdframe.closeMOPreview()\" ";
}
return moEventHtml;
}
