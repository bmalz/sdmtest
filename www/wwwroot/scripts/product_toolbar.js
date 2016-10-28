// Copyright (c) 2005 CA.  All rights reserved.
function generateToolbar()
{
var allTabs = "";
var toolbarTab = parent.toolbarTab;
var tbarData = parent.tbarData;
var tabWidth = "";
for ( var i = 0; i < toolbarTab.length; i++ ) {
/*
if (toolbarTab[i].label.length > 12)
tabWidth = toolbarTab[i].label.length * 9;
else 
tabWidth = 90;
*/
tabWidth = "100%";
var label = toolbarTab[i].label;
var label_loc = label;
if (nonLatinFlag &&
(typeof toolbarTab[i].code == "string") &&
(toolbarTab[i].code != ""))
label_loc = toolbarTab[i].code; 
var actKey = registerActionKey("", label_loc, tabClick, i);
label = fmtLabelWithActkey( label, actKey ).replace(/ /g, "&nbsp;");
var nextTab = "<td class='tab_container'>\n" +
"<table class=generic_table><tr>\n" +
"<td id='tableft" + i + "' class='headertab_unselected_left_top' " +
" nowrap><img src=" + tbarData["space1x1"] + " alt='' class='tab_unselected_edge_space_img'></td>\n" +
"<td id='tabmiddle" + i + "' width='" + tabWidth + "' class='headertab_unselected_center' nowrap " +
">\n" + 
"<a id='tabhref" + i + "' href='javascript:tabClick(" + i + ")' class='headertab_text' tabindex=1" +
" onMouseover=\"window.status='" + toolbarTab[i].tooltip.replace(/\"/g, "&quot;").replace(/&#39;/g, "'").replace(/'/g,"\\'") + 
"';return true;\" onMouseout='window.status=window.defaultStatus;'><span>" + label + "</span></a>";
if ( ahdtop.cstUsingScreenReader && i == 0 ) 
{
nextTab += "<a accesskey=\"" + msgtext("P") + "\" tabindex=-1"; 
if (_browser.isIE)
nextTab += " href='javascript:void(0)' onfocus='javascript:tabSetFocus(0)'></a>";
else
nextTab += " href='javascript:tabSetFocus(0)'></a>";
}
nextTab += "</td>\n" + "<td id='tabright" + i + "' class='headertab_unselected_right_top' " +
" nowrap><img src=" + tbarData["space1x1"] + " alt=''  class='tab_unselected_edge_space_img'></td>\n" +
"</tr></table></td>\n";
allTabs += nextTab;
}
document.writeln(allTabs);
}	
function generateIframes()
{
if ( ! ahdtop.cstUsingScreenReader ) {
var toolbarTab = parent.toolbarTab;
var tbarData = parent.tbarData;
var allFrames = "";
for ( var i = 0; i < toolbarTab.length; i++ ) {	
var nextDiv = "<div id='tbarDiv" + i +
"' class='main_content_container_hidden'>";
var nextFrame = "<iframe id='" + toolbarTab[i].id + "' name='" +
toolbarTab[i].id + "' class='main_content' " +
"src='" + tbarData["empty"] + "'></iframe>";
allFrames += nextDiv + nextFrame + "</div>\n";
}
document.writeln(allFrames);
}
}	
function scrollbarFrame()
{
try
{
if(_browser.isPad==true)
return;
var toolbarTable = document.getElementById("toolbarTable");
var tabWidth = toolbarTable.clientWidth;
var oDiv = parent.document.getElementById("toolbarframe");
var winWidth = oDiv.scrollWidth;
var count=0,pos=0;
var len = parent.document.getElementById("mainFrameSet").rows.length;
while(pos < len)
{
pos = parent.document.getElementById("mainFrameSet").rows.indexOf(",", pos+1);
if( pos !=-1)
count++;
else 
break;
}
if (tabWidth>= winWidth)
{
if(count ==13)
{
if(_browser.isFirefox)
parent.document.getElementById("mainFrameSet").rows = "80,26,35,*,40,1,1,1,1,1,1,1,1,1";
else 
parent.document.getElementById("mainFrameSet").rows = "80,26,43,*,40,1,1,1,1,1,1,1,1,1";
}
else
document.getElementById("mainFrameSet").rows = "80,26,*,40,1,1,1,1,1,1,1,1,1";
}
else
{
if (count ==13)
{
if(_browser.isSafari || _browser.isIE )
parent.document.getElementById("mainFrameSet").rows ="80,26,26,*,40,1,1,1,1,1,1,1,1,1";
else
parent.document.getElementById("mainFrameSet").rows ="80,26,22,*,40,1,1,1,1,1,1,1,1,1";
}
else 
{
parent.document.getElementById("mainFrameSet").rows ="80,24,*,40,1,1,1,1,1,1,1,1,1";
}
}
}
catch (e)
{
}
}
function loadOK()
{
scrollbarFrame();
var toolbarTab = parent.toolbarTab;
--parent.tbarFrameCount;
if ( parent.tbarFrameCount <= 0 )
{
parent.toolbar.tabClick(parent.toolbarInitialTab);
}
else
{ 
if (toolbarTab.length == 1 &&
typeof toolbarTab[0].role_menubar == "string" && 
toolbarTab[0].role_menubar != "")
{
var ahdtop = parent;
var tbar = toolbarTab[0];
var url;
tbar.div = parent.product.document.getElementById("tbarDiv0"); 
if ( ahdtop.cstUsingScreenReader )
tbar.iframe = parent.product;
else
tbar.iframe = parent.product.frames[tbar.id];
if ( ! ahdtop.cstUsingScreenReader ) 
{
tbar.div.className = "main_content_container_visible";
tbar.iframe.focus();
}
if (!tbar.src.match(/\.htmpl/) || 
tbar.src.match(/.+SID=.+FID=.+/))
url = tbar.src;
else
url = ahdtop.cfgCgi + "?SID=" + ahdtop.cfgSID +
"+FID=10" + "+OP=DISPLAY_FORM" +
"+HTMPL=" + tbar.src;
tbar.src = url;
url = ahdtop.cfgCgi + "?SID=" + ahdtop.cfgSID +
"+FID=20" + "+OP=DISPLAY_FORM" +
"+HTMPL=role_main.htmpl" +
"+prop.role_menubar=" + tbar.role_menubar; 
tbar.iframe.location.replace(url);
tbar.loaded = true;
window.ahdtop.toolbarCurrentTab = 0;
}
}
}
function tabSetFocus(id)
{
var toolbarTab = window.ahdtop.toolbarTab;
for ( var i = toolbarTab.length - 1; i >= 0; i-- )
{
if ( toolbarTab[i].id == id ) 
{
id = i;
break;
}
}
if (typeof toolbarTab[id] == "undefined") id = 0;
var tabhref = document.getElementById("tabhref" + id);
if ( typeof tabhref != "undefined" && tabhref != null )
{
tabhref.focus();
}
}
var _PrevTabId = -1;
var state = 1;
function tabClick(id, bTimeout)
{
var toolbarTab = window.ahdtop.toolbarTab;
var currID = window.ahdtop.toolbarCurrentTab;
if ((typeof ahdtop.cfgBOServerLocation == "string" && 
ahdtop.cfgBOServerLocation == "") || 
(typeof ahdtop.cfgBOServerCMS == "string" && 
ahdtop.cfgBOServerCMS == "") ||
(typeof bTimeout == "boolean" && bTimeout) ||
(currID != -1 && !toolbarTab[currID].code.match(/^.*_rpt$/))) 
state = 0;
if ((currID != -1 && toolbarTab[currID].code.match(/^.*_rpt$/) 
&& state))
{
if (state == 2) return;
else 
state = 2;	
var func = "tabClick(";
if (typeof id == "string")
func += "'" + id + "'";
else 
func += id;
func += ", true)";
setTimeout(func, 2000);
return;	
}
if (_browser.isIE)
{
delay_tabClick(id);
}
else
{
var func = "delay_tabClick(";
if (typeof id == "string")
func += "'" + id + "'";
else 
func += id;
func += ")";
setTimeout(func, 500);
}
}
function delay_tabClick(id)
{
var toolbarTab = window.ahdtop.toolbarTab;
var tbarData = window.ahdtop.tbarData;
var currID = window.ahdtop.toolbarCurrentTab;
if ( typeof ahdtop != "object" )
ahdtop = parent;
for ( var i = toolbarTab.length - 1; i >= 0; i-- )
if ( toolbarTab[i].id == id ) {
id = i;
break;
}
if (typeof toolbarTab[id] == "undefined") id = 0;
var tbar, url;
if ( currID == id )
return;
else if ( currID != -1 ) {
tbar = toolbarTab[currID];
tbar.tabLeft.className = "headertab_unselected_left_top"; 
tbar.tabMiddle.className = "headertab_unselected_center"; 
tbar.tabRight.className = "headertab_unselected_right_top"; 
tbar.tabHref.className = "headertab_text";
if ( ! ahdtop.cstUsingScreenReader ) {
tbar.div.className = "main_content_container_hidden";
}
}
window.ahdtop.toolbarCurrentTab = id;
tbar = toolbarTab[id];
if ( typeof tbar.div == "undefined" ) {
tbar.tabLeft = document.getElementById("tableft" + id);
tbar.tabMiddle = document.getElementById("tabmiddle" + id);
tbar.tabRight = document.getElementById("tabright" + id);
tbar.tabHref = document.getElementById("tabhref" + id);
tbar.div = parent.product.document.getElementById("tbarDiv" + id);
if ( ahdtop.cstUsingScreenReader )
tbar.iframe = parent.product;
else
tbar.iframe = parent.product.frames[tbar.id];
tbar.loaded = false;
}
tbar.tabLeft.className = "headertab_selected_left_top"; 
tbar.tabMiddle.className = "headertab_selected_center"; 
tbar.tabRight.className = "headertab_selected_right_top"; 
tbar.tabHref.className = "headertab_text";
if ( ahdtop.cstUsingScreenReader && ! _browser.isIE )
{
var tabhref = document.getElementById("tabhref" + id);
if ( typeof tabhref != "undefined" && tabhref != null )
{
tabhref.blur();
}
}
if ( ! ahdtop.cstUsingScreenReader ) {
tbar.div.className = "main_content_container_visible";
tbar.iframe.focus();
}
if ( tbar.loaded &&
(! ahdtop.cstUsingScreenReader ) &&
typeof tbar.iframe != "undefined" &&
typeof tbar.iframe.ahdframe != "undefined" ) {
window.ahdtop.ahdframe = tbar.iframe.ahdframe;
if (typeof tbar.iframe.role_main != "undefined" && 
typeof tbar.iframe.role_main.scoreboard == "object" && 
tbar.iframe.role_main.scoreboard != null) {
window.ahdtop.scoreboard = tbar.iframe.role_main.scoreboard;
}
else
window.ahdtop.scoreboard = void(0);
var w = window.ahdtop.ahdframe;
if (typeof w.setWindowTitle != "undefined" &&
typeof w.form_title != "undefined")
w.setWindowTitle(w.form_title, 1);
if (typeof w.set_default_for_gobtn != "undefined")
w.set_default_for_gobtn();
if (_browser.isIE)
tbar.iframe.ahdframe.focus();
else 
tbar.iframe.ahdframe.setTimeout("window.focus();", 100);
}
else {
var ahdtop = parent;
if ( ! tbar.src.match(/\.htmpl/) || 
tbar.src.match(/.+SID=.+FID=.+/))
url = tbar.src;
else
url = ahdtop.cfgCgi + "?SID=" + ahdtop.cfgSID +
"+FID=" + (id * 10 + 10) + "+OP=DISPLAY_FORM" +
"+HTMPL=" + tbar.src;
if (typeof tbar.role_menubar == "string" &&
tbar.role_menubar != "")
{
tbar.src = url;
url = ahdtop.cfgCgi + "?SID=" + ahdtop.cfgSID +
"+FID=" + (id * 10 + 20) + "+OP=DISPLAY_FORM" +
"+HTMPL=role_main.htmpl" +
"+prop.role_menubar=" + tbar.role_menubar; 
}
tbar.iframe.location.replace(url);
if(tbar.src.match(/OP\=DISPLAY_FORM\+HTMPL\=sd_main_role\.htmpl/))
tbar.loaded=false;
else
tbar.loaded = true;
}
try
{
if(_PrevTabId != -1)
parent.frames["product"].frames[_PrevTabId].frames[0].hideMenus();
_PrevTabId = tbar.id;
}
catch(e)
{
}
}	
function mainframe(name)
{
var toolbarTab = ahdtop.toolbarTab;
var id = window.ahdtop.toolbarCurrentTab;
if ( typeof name == "number" &&
name >= 0 && name < toolbarTab.length )
id = name;
else if ( typeof name == "string" ) {
for ( var i = toolbarTab.length - 1; i >= 0; i-- )
if ( toolbarTab[i].id == name ) {
id = i;
break;
}
}
var tbar = toolbarTab[id];
if ( typeof tbar.loaded != "boolean" ||
! tbar.loaded ) { 
tabClick(id);
return null;
}
tabClick(id);
return tbar.iframe.ahdframe;
}
function setNewPrefs()
{
var toolbarTab = ahdtop.toolbarTab;
for ( var i = toolbarTab.length - 1; i >= 0; i-- ) {
var tbar = toolbarTab[i];
if ( typeof tbar.loaded == "boolean" &&
tbar.loaded &&
typeof tbar.iframe.menubar == "object" ) {
if ( ahdtop.cstReducePopups )
tbar.iframe.document.getElementById("menubar").contentWindow.ImgBtnShowButton("btnbackToList");
else
tbar.iframe.document.getElementById("menubar").contentWindow.ImgBtnHideButton("btnbackToList");
}
}
}
