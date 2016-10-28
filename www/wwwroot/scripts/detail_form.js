// Copyright (c) 2005 CA.  All rights reserved.
var _dtl = void(0);
var _dtl_debug = false;
var rxQuote = new RegExp(/"/g);
var cur_row_num = -1;
var cur_exp_row_arr = void(0);
var exp_sec_num = 0;
var resp_on_blur_flag = 0;
var autoComplete_parameter= "";
var autosuggest_arr = new Array();
var _bHideTenantSelection = false;
function exp_row_node(row_num)
{
this.row_num = row_num;
this.row_id_arr = new Array();
}
exp_row_node.prototype.add_row_id = function (id)
{
var idx = this.row_id_arr.length;
var row_id;
if (typeof id == "string" && id != "")
row_id = id;
else
row_id = "exp_row" + exp_sec_num + this.row_num + "_" + idx;
this.row_id_arr[idx] = row_id;
return row_id;
}
exp_row_node.prototype.hide_row = function ()
{
return this.change_row_disp_state("none");
}
exp_row_node.prototype.show_row = function ()
{
var show_str = "block";
if (!_browser.isIE)
show_str = "";
return this.change_row_disp_state(show_str);
}
exp_row_node.prototype.change_row_disp_state = function (disp)
{
var len = this.row_id_arr.length;
var id;
var row;
var height = 0;
var prev_disp;
for (var i = (len - 1); i >= 0; i--)
{
id = this.row_id_arr[i];
if (typeof id == "string")
{
row = document.getElementById(id);
if (typeof row == "object")
{
prev_disp = row.style.display;
if (prev_disp != "none" &&
disp == "none")
height += row.offsetHeight;
row.style.display = disp;
if (prev_disp == "none" &&
disp != "none")
height += row.offsetHeight;
}
}
}
return height;
}
function get_exp_row_id(id)
{
if (cur_row_num == -1)
return id;
var len = cur_exp_row_arr.length;
for (var i = 0; i < len; i++)
{
if (cur_exp_row_arr[i].row_num == cur_row_num)
break;
}
if (i == len) return id;
return cur_exp_row_arr[i].add_row_id(id);
}
function createExpandableRow (exp_rows)
{
cur_exp_row_arr = new Array();
cur_row_num = 0;
var arr = exp_rows.split(",");
for (var i = 0; i < arr.length; i++)
cur_exp_row_arr[cur_exp_row_arr.length] = new exp_row_node(arr[i]);
return cur_exp_row_arr;
}
function DetailForm(factory, id, next_persid, stdbuttons, skip_page_hdr, onsubmit, hideEditBtn, saveclose_button, skip_tenant_hdr)
{
this.is_from_autoSuggest = false;
if ( factory == "defer" ) {
this.edit = true;
holdHTMLText(false);
stdbuttons = false;
saveclose_button = false;
this.win = window;
if ( typeof skip_page_hdr == "undefined")
skip_page_hdr = "skip";
}
else {
this.edit = ( typeof edit_form == "number" && edit_form == 1 );
this.id = id;
this.next_persid = next_persid;
}
this.saveclose_button = saveclose_button;
this.skip_tenant_hdr = skip_tenant_hdr;
if ( typeof onsubmit == "string" )
this.onsubmit = onsubmit ;
else
this.onsubmit = "return check_submit();" ;
this.lastKeycode = 0;
this.html = "";
this.expSecHtml = "";
this.factory = factory;
this.displayName = "";
try {
if ( this.factory == propFactory &&
factoryDisplayName.length > 0 )
this.displayName = factoryDisplayName;
}
catch(e) {}
this.lastTableNum = -1;
this.rowNum = 0;
this.colNum = 0;
this.hdrColNum = -1;
this.maxCol = 0;
this.colID = 0;
this.currID = "";
this.rowData = new Array();
this.dateField = new Array();
this.colSpan = new Array();
this.form = new Array();
this.formStarted = false;
this.tableStarted = false;
this.doingLabelButton = false;
this.rowOpen = false;
this.TDOpen = false;
this.tabIndex = 100;
this.imgBtnRow = false;
this.roclass = " CLASS=detailro";
this.eventHandler = "";
this.firstField = void(0);
this.firstFieldFocused = 0;
this.onload = void(0);
this.fieldToValidate = new Array();
this.attrReqArray = new Array();
this.currAttrName = "";
this.errorCount = 0;
this.serverErrorCount = 0;
this.propertyRow = void(0);
this.spellchk = false;
this.fieldsToReset = void(0);
this.syncing = false;
this.secondary = false;
this.skip_agt_check = false;
this.dataoverrideclass="";
this.editAttrs = new Object();
this.lookupAttrs = new Object();
this.doSrchKnow = 0;
this.lastHdrtext = "";
this.propId = "id";
this.propHdr= "hdrtext";
this.propMaxSize = "maxsize";
this.propIsReq = "is_required";
this.propServerErr = "serverFoundError";
this.propError = "error";
this.propExtError = "extError";
this.propBrowserError = "browserFoundError";
this.propSDProp = "is_property";
this.propNotFound = null;
this.tenantFieldEditable = false;
this.tenantFieldValue="";
this.tenantFieldId="";
this.tenantDropdownArray = new Array();
this.hasGlobalSharedOption = false;
if ( ! this.edit ) {
this.hdrclass = "detailro";
this.reqhdrclass = "detailro";
this.reqlookupclass = "detailro";
this.dataclass = this.roclass;
this.backfillReq = false;
}
else {
this.hdrclass = "labeltext";
this.reqhdrclass = "requiredlabeltext";
this.reqlookupclass = "requiredlookup";
this.dataclass = "";
var opnr = ahdframeset.opener;
this.backfillReq = ( this.id == "0" &&
typeof opnr == "object" && opnr != null &&
typeof opnr.cfgIsPopup == "string" &&
typeof opnr.argBackfillField == "string" &&
opnr.cfgIsPopup.length > 0 &&
opnr.argBackfillField.length > 0 );
}
if ( typeof propGLType == "string" &&
propGLType == "secondary" )
{
this.secondary = true;
if ( typeof argPersistentID != "undefined")
{
var edit_windows = getEditWindows(argPersistentID);
for ( var i = 0; i < edit_windows.length; i++ ) {
var w = edit_windows[i];
if ( typeof w._dtl == "object" &&
! w._dtl.secondary ) {
window.opener = w.parent;
}
}
}
}
if (ahdtop.cfgUserType == "analyst" && ! ahdtop.cstDisablePreviews) {
if ( typeof cfgMOPreviewMode != "number" || cfgMOPreviewMode != 1) {
mo_preview_def_obj = new mo_preview(draggable_option, resizable_option);
docWriteln( moPreviewHTML() );
}
}
if(skip_page_hdr != "skip")
{
if (ahdtop.cfgUserType == "analyst")
docWriteln('<DIV style="overflow: auto;width: 100%; overflow-y: hidden;">');
docWriteln("<TABLE cellSpacing=0 cellPadding=0 width='100%' border=0  class=page_header>");
docWriteln("<TR>");
docWriteln("<TD align=left width='99%' NOWRAP><h2 style='margin:0px;'>" + form_title + "</h2></TD>");
docWriteln("<TD align=right width='1%'>");
ImgBtnSetDefaultTabIndex(this.edit ? 30000 : this.tabIndex);
if ( typeof cfgMOPreviewMode != "number" || cfgMOPreviewMode != 1 ) 
{
if ( typeof stdbuttons != "boolean" || stdbuttons ) {
this.imgBtnRow = true;
if ( ! this.edit ) {
ImgBtnRow(void(0),false);
if ((0 + cfgUserAuth) > 1 && (typeof hideEditBtn != "boolean" || !hideEditBtn )) {
if (( ahdtop.cfgMultiTenancy == "on" ) && ahdtop.cstTenantId != ahdtop.serviceProviderUuid &&
propFactory.match(/^tenant/) && propFormName == "detail_tenant.htmpl")
ImgBtnCreate("btn001", "Edit[d]", "detailEdit()", false); 
else
ImgBtnCreate("btn001", "Edit[d]", "detailEdit()", true);
}
if ( typeof detailExtraROButtons == "function" ) {
detailExtraROButtons();
} 
}
else {
var saveButtonFieldset = false;
if ( typeof detailExtraSaveButtons != "undefined" ) {
var count = detailExtraSaveButtons(false);
if ( count > 0 ) {
saveButtonFieldset = true;
this.imgBtnRow = count + 1;
var fieldset = "<table><tr><td>";
if ( _browser.isIe )
fieldset += "<fieldset>";
else
fieldset += "<fieldset class=firefox_fieldset>";
var legend = msgtext("Save_Buttons");
if ( typeof factoryDisplayName == "string" &&
factoryDisplayName.length > 0 )
legend = msgtext("Save_%1",factoryDisplayName);
docWriteln(fieldset + "<legend class=button_legend>" +
legend + "</legend>");
}
}
ImgBtnRow(void(0),false);
if ( !this.secondary )
{
ImgBtnCreate("btn001", "Save[S]", "detailSave()", true);
var bEnable = true;
if (ahdframeset == ahdtop)
bEnable = false;
if (this.saveclose_button) 
ImgBtnCreate("btn002", "Save and Close[a]", "SaveAndClose();detailSave();", bEnable);
}
else
ImgBtnCreate("btn001", "Accept", "detailSave()", true);
if ( saveButtonFieldset ) {
detailExtraSaveButtons(true);
ImgBtnEndRow();
docWriteln("</fieldset></td><td valign=bottom>");
ImgBtnRow(void(0),false);
}
ImgBtnCreate("btncncl", "Cancel[n]", "detailCancel()", true, 0, void(0), "", "negative" );
ImgBtnCreate("btn003", "Reset[R]",
"check_reset();detailReset()", true);
}
if ( typeof argTenant == "string" && argTenant == "" ) {
if ( argFactoryTenancy == "1" &&
typeof cfgAccessUpdateModify == "string" &&
cfgAccessUpdateModify == "0" ) {
if ( ! this.edit )
ImgBtnHideButton( "btn001" );
if ( this.edit && this.id != "0" )
ImgBtnDisableButton( "btn001" );
}
}
}
}
else {
var closePreviewLabel = msgtext("Close_Preview_escape_key");
docWriteln("<td nowrap valign='middle' align='right'>");
docWriteln("<span class='close_mo_preview_label'></span><a href=\"javascript:window.parent.closeMOPreview()\" class='close_mo_preview_link' tabindex=1><u>" + closePreviewLabel + "</u></a><span class='closepreviewlabel'></span>");
docWriteln("</td>");
}
}
}
function DetailForm_getHTMLText()
{
if ( typeof this.win == "object" && ! this.win.closed )
return this.win.getHTMLText();
else
return "";
}
DetailForm.prototype.getHTMLText = DetailForm_getHTMLText;
function startDetail(options, bScroll)
{
if ( _dtl.imgBtnRow ) {
ImgBtnEndRow();
if ( typeof _dtl.imgBtnRow == "number" && _dtl.imgBtnRow > 1 )
docWriteln("</td></tr></table>");
_dtl.imgBtnRow = false;
}
docWrite("</TD></TR>");
if ( argFactoryTenancy == "1" || argFactoryTenancy == "2" ) {
docWrite("<FORM NAME=tenant_form onsubmit='return false'>");
if(!_dtl.skip_tenant_hdr)
showTenantField(); 
docWrite("</FORM>");
}
docWrite("</TABLE>");
if (ahdtop.cfgUserType == "analyst")
{
if (_browser.isIE)
docWrite("<BR>");
docWriteln("</DIV>");
}
ImgBtnSetDefaultTabIndex(_dtl.tabIndex);
build_alertmsg();
if ( typeof options != "string" )
options = "";
if ( options == "" || null == options.match(/noscroll/i) ) {
if (typeof bScroll == "undefined")
bScroll = 0;
startScrollbar(false, bScroll);
}
_dtl.center = ( options != "" && null != options.match(/center/i));
if ( _dtl.center )
docWriteln("<CENTER>");
if ( _dtl.factory.length > 0 ) {
_dtl.formStarted = true;
var out = "<FORM NAME=main_form ACTION='" + cfgCgi + "' METHOD=";
if ( ! _dtl.edit )
out += "GET>\n";
else
out += "POST STYLE='display:none' onSubmit='" + _dtl.onsubmit + "'>\n" +
"<INPUT TYPE=HIDDEN NAME=JEDIT VALUE=1>\n";
out += '<INPUT TYPE=HIDDEN NAME=SID VALUE="' + cfgSID + '">\n' +
'<INPUT TYPE=HIDDEN NAME=FID VALUE="' + cfgFID + '">\n' +
'<INPUT TYPE=HIDDEN NAME=OP VALUE="UPDATE">\n' +
'<INPUT TYPE=HIDDEN NAME=FACTORY VALUE="' + _dtl.factory + '">\n';
if ( _dtl.id.length > 0 )
out += "<INPUT TYPE=HIDDEN NAME=SET.id VALUE='" + _dtl.id + "'>\n";
if ( argFactoryTenancy == "1" || argFactoryTenancy == "2" ) {
if ( _dtl.edit && argTenantId == "" &&
ahdtop.cstTenantId != ahdtop.serviceProviderUuid &&
( argFactoryTenancy == "2" ||
( argFactoryTenancy == "1" &&
cfgAccessUpdateModify != "1" ) ) &&
typeof ahdtop.cfgAccessUpdatableTenantUuids == "object" &&
ahdtop.cfgAccessUpdatableTenantUuids.length == 1 ) {
argTenantId = ahdtop.cfgAccessUpdatableTenantUuids[0];
argTenantName = ahdtop.cfgAccessUpdatableTenantNames[0];
}
out += "<INPUT TYPE=HIDDEN NAME=SET.tenant VALUE='" + argTenantId + "'>\n";
}
docWriteln(out);
_dtl.form[0] = document.main_form;
}
}
function endDetail()
{
detailEndRow();
var out = "";
if ( _dtl.tableStarted )
out = "</TABLE>\n";
if ( _dtl.formStarted )
out += "</FORM>";
docWriteln(out);
_dtl.tableStarted = false;
if ( typeof AlertMsg == "string" && AlertMsg.length > 0 ) {
var e = document.getElementById("alertmsgText");
if ( typeof e == "object" && e != null ) {
e.innerHTML = AlertMsg;
e = document.getElementById("alertmsg");
e.style.display = "block";
adjScrollDivHeight();
}
}
if ( typeof _dtl.firstField != "string" ) {
if ( _dtl.edit )
_dtl.form[0].style.display = "block";
}
else {
_dtl.firstField = document.getElementById(_dtl.firstField);
if ( _dtl.firstField != null ) {
_dtl.onload = window.onload;
window.onload = detailOnload;
}
else if ( _dtl.edit )
_dtl.form[0].style.display = "block";
}
if ( _dtl.center )
docWriteln("</CENTER>");
if ( typeof ahdtop == "object" &&
typeof ahdtop.detailForms == "object" &&
( typeof alg_factory != "string" ||
alg_factory == propFactory ) ) {
if ( typeof argPersistentID == "string" &&
argPersistentID.length > 0 )
ahdtop.detailForms[argPersistentID] = window.parent;
if ( propFactory == "chg" && typeof argChgRefNum == "string")
ahdtop.detailForms["chg" + argChgRefNum] = window.parent;
else if ( ( propFactory == "cr" || propFactory == "iss" ) &&
typeof argRefNum == "string" )
ahdtop.detailForms[propFactory + argRefNum] = window.parent;
}
if ( _dtl.spellchk ) {
do_hiddenfm('spell_form','main_form');
}
}
function copy_group_done (flag)
{
}
function copyStatusDropdown(w, to_f, from_f)
{
if (to_f.type == "select-one")
{	
var from_opts = from_f.options;
var to_opts = to_f.options;
var selIdx = -1;
var defSelIdx = -1;
to_opts.length = 0; 
for (var i = 0; i < from_opts.length; i++)
{
to_opts.length++;
to_opts[i].text = from_opts[i].text;
to_opts[i].value = from_opts[i].value;
if (from_opts[i].selected) selIdx = i;
if (from_opts[i].defaultSelected) defSelIdx = i;
}
if (defSelIdx >= 0) to_opts[defSelIdx].defaultSelected = true;
if (selIdx >= 0) to_opts[selIdx].selected = true;
to_opts.selectedIndex = selIdx;
return true; 
}
return false;
}
function detailOnload()
{
var i;
if ( typeof _dtl.form[0] == "object" ) {
var f = _dtl.form[0];
f.style.display = "block";
if ( propFormName.match(/^zdetail/i) &&
typeof f.HTMPL != "object" ) {
var htmpl = document.createElement("input");
htmpl.type = "hidden";
htmpl.name = "HTMPL";
htmpl.value = propFormName;
f.appendChild(htmpl);
}
}
if ( typeof _dtl.onload == "function" )
_dtl.onload();
setTempKeyDownHandler(detailKeyDown);
try {
if ( _dtl.serverErrorCount == 0 ) {
if ( _dtl.firstField.offsetTop > 0 &&
window.parent.name != "popunder" &&
_dtl.lastKeycode == 0 &&
( typeof ahdframeset.workframe != "object" ||
typeof ahdframeset.workframe.SkipInitialFocus == "undefined" ||
ahdframeset.workframe.SkipInitialFocus != "1" ) ) {
_dtl.firstField.focus();
_dtl.firstFieldFocused = 1;
}
}
else {
var firstBadField = detailValidate();
if ( typeof firstBadField == "object" )
detailSetFocus(firstBadField);
else {
_dtl.firstField.focus();
_dtl.firstFieldFocused = 1;
}
}
}
catch(e) {}
if ( typeof top.workframe == "object" )
setTimeout("top.workframe.SkipInitialFocus = 0", 3000);
if (_dtl.edit && typeof default_trans_code == "string")
{
set_required_flds(default_trans_code);
if (typeof initial_trans == "string" && 
initial_trans == "1")
lookup_status = "";
else 
lookup_status = default_trans_code;
} 
if ( document.location.search.match(/INITFROM=(\w*)/) &&
typeof top.opener == "object" &&
top.opener != null &&
! top.opener.closed &&
typeof top.opener.document.forms[RegExp.$1] == "object" ) {
var srcForm = top.opener.document.forms[RegExp.$1];
for ( i = 0; i < srcForm.elements.length; i++ ) {
var e = srcForm.elements[i];
var tgt = document.main_form.elements[e.name];
if ( typeof tgt == "object" && tgt != null ) {
if ( tgt.type != "select-one" )
{
if (e.name == "SET.description" || e.name == "SET.summary")
tgt.value=nx_unescape(e.value);
else
{
tgt.value = e.value;
if (tgt.value != "" && 
e.name.match(/^(.*)_combo_name$/))
{
var attr_name = RegExp.$1;
if ( tgt.value.match(/^([^,]*),([^,]*),(.*)$/) ) {
if ( RegExp.$2.length > 0 || RegExp.$3.length > 0 )
tgt.value = RegExp.$1 + ", " + RegExp.$2 + " " + RegExp.$3;
else
tgt.value = RegExp.$1;
}
if(attr_name == "group" && 
typeof document.main_form.elements["SET.group"] == "object")
{
var group_id = document.main_form.elements["SET.group"].value;
var cb = "func=parent.ahdframe.copy_group_done"; 
detailAgtCheck(document.main_form, "group", group_id, prop_ref, cb);
if (typeof group_initial_val == "string")
{
group_initial_val = tgt.value;
}
}
if(attr_name == "assignee" && 
typeof document.main_form.elements["SET.assignee"] == "object" &&
typeof assignee_initial_val == "string")
{
assignee_initial_val = tgt.value; 
}
}
}
}
else {
for ( var j = 0; j < tgt.options.length; j++ ) {
var o = tgt.options[j];
if ( o.value == e.value ) {
tgt.selectedIndex = j;
break;
}
}
}
}
}
detailCopyTenant( top.opener );
}
if (( typeof _dtl == "object" ) &&( _dtl.secondary )) {
var edit_windows = getEditWindows(argPersistentID);
var elements = window.document.main_form.elements;
for ( var i = 0; i < edit_windows.length; i++ ) {
var w = edit_windows[i];
var f = w.document.main_form;
if ( w != window &&
typeof w._dtl == "object" &&
typeof f == "object" ) {
var rmtElements = f.elements;
var testElements = ( elements.length < rmtElements.length ?
elements : rmtElements );
for ( var j = testElements.length - 1; j >= 0; j-- ) {
var e = testElements[j];
if ( typeof e.name == "string" &&
e.name.length > 0 && e.name != "FID" ) {
var lclField = elements[e.name];
var rmtField = rmtElements[e.name];
if ( typeof lclField == "object" &&
typeof rmtField == "object" &&
lclField.type == rmtField.type ) {
if (!w._dtl.secondary && 
e.name == "SET.status" &&
e.type != "hidden" &&
copyStatusDropdown(w, lclField, rmtField))
continue;
if ( lclField.type == "text" ||
lclField.type == "hidden" )
lclField.value = rmtField.value;
else if ( lclField.type == "select-one" ) {
var v = rmtField.options[rmtField.selectedIndex].value;
for ( var k = lclField.options.length - 1; k >= 0; k-- ) {
if ( lclField.options[k].value == v ) {
lclField.selectedIndex = k;
break;
}
}
}
}
}
}
}
}
}
detailProcessPresetTenantImplyingFields();
var tenantField, tenantForm=document.tenant_form;
if( _dtl.tenantFieldEditable && typeof tenantForm == "object" && tenantForm != null)
{
tenantField = tenantForm.elements["SET.tenant"];
if(tenantField == null)
tenantField=tenantForm.elements["KEY.tenant"];
if( tenantField != null )
{
_dtl.tenantFieldValue=argTenant;
_dtl.tenantFieldId=argTenantId;
if ( tenantField.type == "select-one")
{
for(var i = 0; i < tenantField.length; i++)
{
_dtl.tenantDropdownArray[i] = new Object();
_dtl.tenantDropdownArray[i].tenantValue=tenantField.options[i].text;
_dtl.tenantDropdownArray[i].tenantId=tenantField.options[i].value;
}
}
}
}
if(typeof user_set_status != "undefined" && typeof user_set_status != null && user_set_status != "")
{
var status_fld = window.document.forms["main_form"].elements["SET.status"];
var status_fld_key = window.document.forms["main_form"].elements["KEY.status"];
if (typeof status_fld != "undefined" && 
typeof status_fld != null)
{ 
if (status_fld.type == "select-one")
{
for(var i=0; i<status_fld.options.length; i++)
{
if(status_fld.options[i].value == user_set_status)
{
status_fld.options[i].selected = true;
break;
}
}	
}
else {
if (typeof status_fld_key != "undefined" && 
typeof status_fld_key != null){
status_fld.value = user_set_status;
status_fld_key.value = user_set_status_sym;
}
}
}
}
if (typeof detailPostOnloadAction == "function" && detailPostOnloadAction != null)
detailPostOnloadAction();
if(_browser.isSafari && typeof ahdframe.DrawGrid_onload_call == "undefined")
{
var detail_onload_call = true;
ahdframe.detail_onload_call = detail_onload_call;
setTimeout("ahdframe.detail_onload_call=false;",1000);
}
// 20131111 bmalz @ e-xim
if(typeof exim_InitFromEvent == "function")
	exim_InitFromEvent();
}
function detailCopyTenant( srcWindow )
{
if ( _dtl.tenantFieldEditable &&
argFactoryTenancy != '0' ) {
var i, tenantCopied = false;
var srcTenantId = srcWindow.argTenantId;
var srcTenantName = srcWindow.argTenant;
var mainFormTenant = document.main_form.elements["SET.tenant"];
var tenantForm = document.tenant_form;
if ( typeof tenantForm == "object" && tenantForm != null ) {
if ( typeof mainFormTenant == "object" && mainFormTenant != null )
mainFormTenant.value = srcTenantId;
var keyTenant = tenantForm.elements["KEY.tenant"];
if ( typeof keyTenant == "object" && keyTenant != null ) {
keyTenant.value = srcTenantName;
keyTenant.disabled = true;
tenantCopied = true;
if (typeof _dtl.attrReqArray["tenant"] == "object" && _dtl.attrReqArray["tenant"] != null)
{
var obj = _dtl.attrReqArray["tenant"];
var req_id = obj.req_id;
var lbl = document.getElementById(req_id);
if (typeof lbl != "undefined" && lbl != null)
{
var lbl_th_node = lbl.parentNode.parentNode;
if (typeof lbl_th_node == "object" && lbl_th_node != null && lbl_th_node.tagName == "TH")
{
lbl_th_node.className = _dtl.hdrclass;
lbl_th_node.innerHTML = msgtext("Tenant") + ": ";
}
}
}
}
var setTenant = tenantForm.elements["SET.tenant"];
if ( typeof setTenant == "object" && setTenant != null ) {
if ( setTenant.type == "text" ||
setTenant.type == "hidden" )
setTenant.value = srcTenantId;
else if ( setTenant.type == "select-one" ) {
for ( i = setTenant.length-1; i >= 0; i-- ) {
if ( setTenant.options[i].value.toUpperCase() == srcTenantId.toUpperCase() ) {
setTenant.selectedIndex = i;
setTenant.disabled = true;
tenantCopied = true;
var tenant_hdr = document.getElementById("tenant_drop");
if (typeof tenant_hdr == "object" && tenant_hdr != null && tenant_hdr.tagName == "TH")
{
tenant_hdr.className = _dtl.hdrclass;
tenant_hdr.innerHTML = msgtext("Tenant") + ": ";
}
break;
}
}
if ( i < 0 )
setTenant.selectedIndex = -1;
}
}
if ( tenantCopied ) {
argTenantId = srcTenantId;
argTenant = srcTenantName;
try {
if ( typeof srcWindow.argTenantLogo == "string" &&
srcWindow.argTenantLogo.length > 0 ) {
argTenantLogo = srcWindow.argTenantLogo;
argTenantLogoAlt = srcWindow.argTenantLogoAlt;
var logoImg = top.gobtn.document.getElementById("logoImg");
if ( logoImg != null ) {
logoImg.src = argTenantLogo;
logoImg.alt = argTenantLogoAlt;
}
}
}
catch(i) {}
var e = document.main_form.elements;
for ( i = 0; i < e.length; i++ ) {
if ( e[i].type != "hidden" && ! e.disabled ) {
_dtl.firstField = e[i];
if ( _dtl.firstFieldFocused )
_dtl.firstField.focus();
break;
}
}
}
}
}
}
function detailOnUnload()
{
if(typeof ahdtop!="undefined") {
if ( typeof alg_factory != "string" ||
alg_factory == propFactory ) {
if ( typeof argPersistentID == "string" &&
argPersistentID.length > 0 )
delete ahdtop.detailForms[argPersistentID];
if ( propFactory == "chg" && typeof argChgRefNum == "string")
delete ahdtop.detailForms["chg" + argChgRefNum];
else if ( ( propFactory == "cr" || propFactory == "iss" ) &&
typeof argRefNum == "string" )
delete ahdtop.detailForms[propFactory + argRefNum];
}
}
}
function detailFocus1st()
{
var bSkipFocus = false;
if (typeof ahdframeset.workframe == "object")
{
if (ahdframeset.workframe.SkipInitialFocus != "undefined")
{
if (ahdframeset.workframe.SkipInitialFocus == "1")
{
bSkipFocus = true;
}
}
}
if (bSkipFocus)
{
return;
}
if (typeof _dtl != "undefined" &&
(!_dtl.firstFieldFocused || ahdtop.cstUsingScreenReader) )
{
if (typeof parent.DoNotSetFocusOnDetailLoad != "undefined" && parent.DoNotSetFocusOnDetailLoad)
{
parent.DoNotSetFocusOnDetailLoad = false;
ahdframeset.workframe.SkipInitialFocus = "1";
}
else
{
window.focus();
try {
_dtl.firstField.focus();
_dtl.firstFieldFocused = 1;
}
catch(e) {}
}
}
try {
if ( _dtl.edit )
ahdframeset.workframe.SkipInitialFocus = "1";
}
catch(e) {}
}
function detailAddTenantImplyingAttr( attr_name,
tenant_id,
tenant_name,
tenancy,
service_provider_eligible )
{
try {
if ( ! tenant_id.match(/^[0\s]*$/) &&
( tenancy == "1" || tenancy == "2" ) &&
( service_provider_eligible != "1" ||
tenant_id != ahdtop.serviceProviderUuid ) ) {
if ( typeof _dtl.presetTenantImplyingAttrs == "undefined" )
_dtl.presetTenantImplyingAttrs = new Object();
_dtl.presetTenantImplyingAttrs[attr_name] = { tenancy: tenancy,
tenant_id: tenant_id,
tenant_name: tenant_name,
readonly: false };
}
}
catch(tenant_id) {}
}
function detailAddReadonlyTenantImplyingAttr( attr_name,
tenant_id,
tenant_name,
tenancy,
service_provider_eligible )
{
detailAddTenantImplyingAttr(attr_name,tenant_id,tenant_name,tenancy);
try {
_dtl.presetTenantImplyingAttrs[attr_name].readonly = true;
}
catch(tenant_id) {}
}
function detailProcessPresetTenantImplyingFields()
{
if ( typeof _dtl.presetTenantImplyingAttrs != "undefined" &&
_dtl.presetTenantImplyingAttrs != null ) {
var deletePresets = true;
for ( var attr_name in _dtl.presetTenantImplyingAttrs ) {
var tenantId = _dtl.presetTenantImplyingAttrs[attr_name].tenant_id;
var tenantName = _dtl.presetTenantImplyingAttrs[attr_name].tenant_name;
if ( ! tenantId.match(/^[0\s]*$/) ) {
detailSetTenant( attr_name, tenantId, tenantName );
if ( _dtl.tenantFieldEditable && 
_dtl.presetTenantImplyingAttrs[attr_name].readonly ) {
var tenantField, tenantForm = document.tenant_form;
if ( typeof tenantForm == "object" &&
tenantForm != null ) {
tenantField = tenantForm.elements["SET.tenant"];
if ( tenantField != null &&
tenantField.type == "select-one" ) {
for ( var i = tenantField.options.length-1 ; i >= 0 ; i-- ) {
if (tenantField.options[i].text == msgtext("global_(shared)")){
if ( i == tenantField.selectedIndex )
tenantField.selectedIndex = 0;
tenantField.options[i] = null;
break;
}
}
}
}
}
}
if ( _dtl.presetTenantImplyingAttrs[attr_name].readonly )
deletePresets = false;
else
delete _dtl.presetTenantImplyingAttrs[attr_name];
}
if ( deletePresets )
delete _dtl.presetTenantImplyingAttrs;
}
}
function detailStartExpRow(form_name, label, exp_rows, colspan, tblClass)
{
if ((form_name != "") &&
(exp_rows != "") &&
(colspan > 0) &&
! ahdtop.cstUsingScreenReader)
{
detailEndTable();
detailExpandSec(form_name, label, exp_rows, colspan);
}
detailStartRow(tblClass);
}
function detailStartRow(tblClass,hrSpan,hrClass)
{
if ( tblClass == "CLASS=" )
tblClass = void(0);
detailCloseForm()
var html = "";
detailEndRow();
if ( _dtl.tableStarted &&
( typeof tblClass != "undefined" ||
ahdtop.cstUsingScreenReader ||
( ahdtop.cfgUserType != "analyst" && ! _dtl.edit ) ) ) {
html += "</TABLE>\n";
_dtl.tableStarted = false;
}
if ( ! _dtl.tableStarted ) {
if ( _dtl.rowNum == _dtl.lastTableNum )
_dtl.rowNum++;
_dtl.lastTableNum = _dtl.rowNum;
_dtl.currTblId = "dtltbl" + _dtl.rowNum;
_dtl.currTblObj = null;
html += "<TABLE id=" + _dtl.currTblId + " ";
if ( typeof tblClass == "string" && tblClass.length > 0 )
html += tblClass;
else {
html += "cellpadding=1 cellspacing=5";
if ( ! _dtl.center )
html += " WIDTH='90%'";
}
html += " class=detailro";
html += ">\n";
_dtl.tableStarted = true;
docWrite(html);
html = "";
_dtl.currTblObj = document.getElementById(_dtl.currTblId);
if ( _dtl.currTblObj != null ) {
var summary;
if ( typeof notebook_current_tabinfo == "object" )
summary = msgtext("%1_Notebook_Tab_row_%2_-",notebook_current_tabinfo.tab_name,_dtl.rowNum+1);
else if ( typeof hdrTitle == "string" && hdrTitle.length > 0 )
summary = msgtext("%1_row_%2_-",hdrTitle,_dtl.rowNum+1);
else 
summary = msgtext("%1_Detail_row_%2_-",_dtl.displayName,_dtl.rowNum+1);
if ( ahdtop.cfgUserType == "analyst" &&
! ahdtop.cstUsingScreenReader )
summary = summary.replace(/[\s-]*$/,"");
_dtl.currTblObj.summary = summary;
}
}
if (_dtl.expSecHtml != "")
{
html += _dtl.expSecHtml;
_dtl.expSecHtml = "";
}
if (cur_row_num != -1)
cur_row_num++;
var row_id = get_exp_row_id("");
if (row_id != "") row_id = " ID='" + row_id + "' ";
html += '<TR' + row_id + ' VALIGN=TOP>';
if(typeof hrSpan != "undefined" && hrSpan != "0" )	
{	if (hrClass == "")
html += '<td colspan='+ hrSpan + '><hr></td></tr>';
else
html += '<td colspan='+ hrSpan + '><hr CLASS='+ hrClass + '></td></tr>';
row_id++;
html += '<TR' + row_id + ' VALIGN=TOP>';
}
docWriteln(html);
_dtl.rowOpen = true;
}
function detailCloseForm()
{
if ( ! _dtl.edit && _dtl.formStarted ) {
document.writeln("</form>");
_dtl.formStarted = false;
}
}
function detailWriteRow()
{
detailEndRow(false);
}
function detailEndRow(closeRow)
{
var html = "";
if ( _dtl.colNum > 0 ) {
if ( _dtl.rowOpen ) {
if ( _dtl.colNum == 1 && ahdtop.cstUsingScreenReader ) {
if ( _dtl.currTblObj == null )
_dtl.currTblObj = document.getElementById(_dtl.currTblId);
if ( _dtl.currTblObj != null )
_dtl.currTblObj.cellSpacing = "0";
var th = document.getElementsByTagName("th");
html += "<th>&nbsp;</th>";
_dtl.colSpan[_dtl.colNum] = "";
detailSetRowData("&nbsp;");
}
html += "</TR>\n";
}
var row_id = get_exp_row_id("");
if (row_id != "") row_id = " ID='" + row_id + "' ";
html += '<TR' + row_id + '>\n';
_dtl.rowOpen = true;
for ( var i = 0; i < _dtl.colNum; i++ ) {
var text = _dtl.rowData[i];
html += "<td";
if ( typeof _dtl.colSpan[i] == "string" )
html += _dtl.colSpan[i];
_dtl.colSpan[i] = "";
html += _dtl.dataclass + " ALIGN=left VALIGN=top>\n";
if ( typeof _dtl.dateField[i] != "number" ||
_dtl.dateField[i] != 1 ) {
html += text + "\n";
}
else {
var next_id = void(0);
var date_data = text.split(":",5);
if ( date_data.length == 4 )
html += date_input_text(detailCurrForm(), "", date_data[0],
date_data[1], date_data[2], date_data[3]);
if ( date_data.length == 5 )
{
html += date_input_text(detailCurrForm(), "", date_data[0],
date_data[1], date_data[2], date_data[3],
date_data[4]);
}
}
if ( ! text.match(/<\/td>/i) )
html += "</td>\n";
}
_dtl.colNum = 0;
_dtl.hdrColNum = -1;
_dtl.colID = 0;
_dtl.rowNum++;
}
else if ( _dtl.rowOpen ) {
if ( _dtl.TDOpen ) {
html += "</td>";
_dtl.TDOpen = false;
}
if ( _dtl.currTblId == "dtltbl" + _dtl.rowNum ) {
_dtl.currObj = document.getElementById(_dtl.currTblId);
if ( _dtl.currObj != null ) {
_dtl.currObj.id = "";
_dtl.currObj.summary = "";
}
}
}
if ( typeof closeRow != "boolean" || closeRow ) {
if ( _dtl.rowOpen ) {
html += "</tr>";
_dtl.rowOpen = false;
}
}
else {
html += "<td " + _dtl.roclass + ">";
_dtl.TDOpen = true;
}
if ( html.length > 0 )
docWriteln(html);
}
function detailEndHdrRow()
{
_dtl.colNum = 0;
_dtl.hdrColNum = -1;
_dtl.colID = 0;
if ( _dtl.rowOpen ) {
docWriteln("</TR>");
_dtl.rowOpen = false;
}
}
function detailEndTable()
{
detailEndRow();
docWriteln("</TABLE>");
_dtl.tableStarted = false;
}
function detailSetEventHandler(text,readonly)
{
if ( _dtl.edit ||
(typeof readonly == "boolean" && readonly ) ) {
_dtl.eventHandler = text;
}
}
function detailSetFieldTitle(title)
{
_dtl.fieldTitle = title;
}
function detailNextID(colspan,lastInRow,attr_name)
{
var text = "";
var id = "df_" + _dtl.rowNum + "_" + _dtl.colID;
_dtl.currID = id;
if ( typeof _dtl.firstField == "undefined" )
_dtl.firstField = id;
if ( typeof notebook_current_tabinfo == "object" )	
notebook_current_tabinfo.setFirstField(id);
if ((typeof accordion_tab_info=="object") && (accordion_deferred_div_open ==true)) 
{
accordion_tab_info.firstField = id;
}
if ( typeof colspan == "number" )
_dtl.colID += colspan;
else {
if ( typeof colspan == "boolean" )
lastInRow = colspan;
_dtl.colID++;
}
if ( typeof attr_name != "string" )
attr_name = id;
text = " ID=" + id + pdmqa(attr_name) + " tabindex=" + _dtl.tabIndex;
var eh = _dtl.eventHandler;
if ( eh.length == 0 ) {
text += " onFocus=\"return detailFocus(this);\"" +
" onBlur=\"return detailBlur(this);\"";
}
else {
_dtl.eventHandler = "";
eh = " " + eh;
if ( eh.match(/^(.*onFocus=\\?['"'])(.*)$/i) )
eh = RegExp.$1 + "detailFocus(this);" + RegExp.$2;
else
text += " onFocus=\"return detailFocus(this);\"";
if ( eh.match(/^(.*onBlur=\\?['"'])(.*)$/i) )
eh = RegExp.$1 + "detailBlur(this);" + RegExp.$2;
else
text += " onBlur=\"return detailBlur(this);\"";
text += eh;
}
if ( typeof lastInRow == "boolean" && lastInRow ) {
_dtl.rowNum++;
_dtl.colID = 0;
_dtl.colNum = 0;
_dtl.hdrColNum = -1;
}
return text;
}
function detailNextLinkID()
{
var text = " ID=dflnk_" + _dtl.rowNum + "_" + _dtl.colID;
text += " tabindex=-1";
text += " onFocus=\"return detailFocus(this);\"" +
" onBlur=\"return detailBlur(this);\"";
return text;
}
function detailIncrCol(colspan)
{
if ( typeof colspan == "number" )
_dtl.colID += colspan;
else
_dtl.colID++;
}
function detailFocus(e)
{
if ( typeof e == "object" && e != null ) {
if ( e.className != "errorField" &&
e.className != "focusErrorField" )
e.className = "focusField";
else
e.className = "focusErrorField";
if ( _dtl.lastKeycode == 0 )
_dtl.lastKeycode = 1;
if ((typeof _dtl.firstField == "object") &&
(_dtl.firstField == e))
_dtl.firstFieldFocused = 1;
}
return true;
}
function detailBlur(e)
{
if (e.className=="focusErrorField" && e.value=="noneoftheabove") 
{
refreshNoneOfTheAbove()
}
if (propFactory == "cr" || propFactory == "chg" || 
propFactory == "iss")
{
var name = e.name;
if (name == "SET.status")
{
set_required_flds(e);
}
if (name == "KEY.status")
{
set_default_toggle(e);
}
if (name == "assignee_combo_name" && e.value == "")
{
window.main_form.elements["SET.assignee"].value = "";
}
}
if ( typeof e == "object" && e != null ) {
if ( e.className != "errorField" &&
e.className != "focusErrorField" )
e.className = "";
else {
detailValidate(true, false);
if ( _dtl.errorCount ) {
e.className == "errorField";
// 20131030 bmalz @ e-xim
if(typeof IsHidden != "undefined") {
	if (IsHidden) {
		if (typeof ShowFrameOnError == "function") {
			ShowFrameOnError();
		}
	}
}
}
else
{
e.className == "";
}
}
if ((typeof _dtl.firstField == "object") &&
(_dtl.firstField == e))
_dtl.firstFieldFocused = 0;
if ( (e.name == "SET.tenant" || e.name == "KEY.tenant") && typeof tenantOnBlur == "function" )
{
tenantOnBlur();
}
}
return true;
}
function refreshNoneOfTheAbove()
{
var buttonArray;
if ( typeof window.imgBtnArray == "undefined" ) return;
buttonArray = window.imgBtnArray;
var localizedSave = msgtext("Save");
var localizedAccept=msgtext("Accept");
var ibutton;
for (ibutton in buttonArray)
{
var buttonObj;
buttonObj = buttonArray[ibutton];
if ( buttonObj.caption == localizedSave || buttonObj.caption == localizedAccept)
{
ImgBtnExecute(ibutton);
break;
}
else if ( buttonObj.actKey.length > 0 )
{
var SaveWithActKey = localizedSave + "("+ buttonObj.actKey + ")";
var AcceptWithActKay= localizedAccept+ "("+ buttonObj.actKey + ")";
if ( buttonObj.caption == SaveWithActKey || buttonObj.caption==AcceptWithActKey )
{
ImgBtnExecute(ibutton);
break;
}
}
}
return;
}
function detailCurrForm()
{
var n = _dtl.form.length - 1;
if ( n <= 0 )
return "main_form";
else
return "main_form" + n;
}
function detailLabelFor(hdrtext, labelForId)
{
var id, doLabelFor;
if ( typeof labelForId == "boolean" )
doLabelFor = labelForId;
else
doLabelFor = ( typeof _dtl.fieldTitle != "string" ||
_dtl.fieldTitle.length == 0 );
if ( doLabelFor ) {
if ( typeof labelForId == "string" )
id = labelForId;
else
id = "df_" + _dtl.rowNum + "_" + _dtl.colID;
}
if ( _dtl.currTblObj == null )
_dtl.currTblObj = document.getElementById(_dtl.currTblId);
if ( _dtl.currTblObj != null &&
( ahdtop.cstUsingScreenReader ||
ahdtop.cfgUserType != "analyst" ) ) {
var newSummaryText = ( _dtl.colNum == 0 ? " " : ", " ) + hdrtext;
if ( typeof _dtl.fieldTitle == "string" &&
_dtl.fieldTitle.length > 0 ) {
newSummaryText = ( _dtl.colNum == 0 ? " " : ", " ) + _dtl.fieldTitle;
if ( ! _dtl.edit )
_dtl.fieldTitle = void(0);
}
_dtl.currTblObj.summary += newSummaryText;
}
if ( doLabelFor )
return " scope='col'><label for=" + id + ">" + hdrtext + "</label>";
else
return " scope='col'>" + hdrtext;
}
function detailRowHdr(hdrtext,colspan,is_required,writeToDoc,labelForId,hdrclass)
{
var cols = "";
var tmptext = hdrtext;
if ( typeof colspan != "number" )
colspan = 1;
else if ( colspan > 1 )
cols = " colspan=" + colspan;
_dtl.lastHdrtext = hdrtext;
if ( hdrtext.length > 0 ) {
if ( ahdtop.cfgUserType == "analyst" &&
! ahdtop.cstUsingScreenReader )
hdrtext = hdrtext + "&nbsp;&nbsp;&nbsp;";
var html = "<th" + cols + " ALIGN=left VALIGN=baseline";
if ( ! hdrtext.match(/^ +$/) ) {
if( hdrclass )
html += " class=" + hdrclass;
else
if ( ! bool(is_required) )
html += " class=" + _dtl.hdrclass;
else {
html += " class=" + _dtl.reqhdrclass;
var trailingNbsp = 0;
while ( hdrtext.match(/^(.*)&nbsp;\s*$/i) ) {
hdrtext = RegExp.$1;
trailingNbsp++;
}
hdrtext += ahdtop.cfgIndRequired;
_dtl.lastHdrtext += ahdtop.cfgIndRequired;
while ( trailingNbsp-- > 2 )
hdrtext += "&nbsp;";
}
}
html += detailSetReqArray(tmptext);
html += detailLabelFor(hdrtext,labelForId) + "</th>";
if ( typeof writeToDoc != "boolean" || writeToDoc )
docWriteln(html);
}
_dtl.colSpan[++_dtl.hdrColNum] = cols;
if ( _dtl.hdrColNum > _dtl.maxCol )
_dtl.maxCol = _dtl.hdrColNum;
return html;
}
function detailReadonlyFormRowHdr(hdrtext,colspan,is_required,writeToDoc)
{
var saveEdit = _dtl.edit;
_dtl.edit = false;
detailRowHdr(hdrtext,colspan,is_required,writeToDoc);
_dtl.edit = saveEdit;
}
function pdmqa( attr_name )
{
var result;
if ( typeof attr_name == "string" && attr_name.length == 0 )
result = "";
else
result = " pdmqa='" + attr_name + "'";
return result;
}
function detailSetReadonlyRowData(attr_name, value, colspan, id, rows, size, inlinehdr, hdrclass)
{
if ( typeof value != "string" ) {
switch ( arguments.length ) {
default: size = rows;
case 4: rows = id;
case 3: id = colspan;
case 2: colspan = value;
case 1: value = attr_name;
case 0: attr_name = "";
}
}
if ( typeof id != "string" || id.length == 0 ) {
id = "df_" + _dtl.rowNum + "_" + _dtl.colID;
detailIncrCol(colspan);
}
var html = "";
var idinfo = " id=" + id + pdmqa(attr_name);
if (typeof inlinehdr != "undefined" && inlinehdr != "") {
html += "<span class=";
if (typeof hdrclass != "undefined" && hdrclass != "") {
html += "'" + hdrclass + "'" + ">";
} else {
html += "'label gn_text_normal'>";
}
html += inlinehdr + ": " + "</span>";
}
if ( ( ! ahdtop.cstUsingScreenReader ) ||
value.match(/^\s*\<a /i) ) 
{
if ( !ahdtop.cstDisablePreviews )
{
var span_str = "<span "
var a_string = "";
if ( value.match(/^\s*\<span\s([^\>]*)\>(.*)\<\/span\>\s*$/i) != null ) {
span_str += RegExp.$1;
a_string = RegExp.$2;
}
else {
a_string = value;
}
if ( a_string.match(/^\s*<A\s[^\>]*\>(.*)\<\/A\>\s*$/i) != null )
{
if ( typeof cfgMOPreviewMode == "number" && cfgMOPreviewMode == 1 ) {
value = RegExp.$1;
}	
else if ( ahdtop.cfgUserType == "analyst" ) {
if ( a_string.match(/showDetailWithPersid\s*\(['"](.*)['"]\)/) != null ) {
var a_html = span_str;
a_html += " onmouseover=\"startMOPreviewTimeout('" + RegExp.$1 + "')\"" + 
" onmouseout=\"cancelBuildingMOPreview()\"" +
" onclick=\"closeMOPreview()\"";
a_html += ">";
value = a_html + a_string + "</span>"; 
}
}
}
}
html += value.replace(/\n/g,"<br>");
if ( _dtl.edit )
idinfo += " style='font-size:0.7em;'"; 
if ( typeof _dtl.colSpan[_dtl.colNum] == "string" )
_dtl.colSpan[_dtl.colNum] += idinfo ;
else
_dtl.colSpan[_dtl.colNum] = idinfo ; 
}
else {
if ( typeof _dtl.firstField == "undefined" )
_dtl.firstField = id;
idinfo += " tabindex=" + _dtl.tabIndex +
" class=dtl_field_val_ro";
if ( ! _dtl.edit )
idinfo += " style=font-size:1.0em;";
if ( typeof size != "number" ) {
if ( value.length < 20 )
size = 20;
else if ( value.length > 100 )
size = 100;
else
size = value.length;
}
var titleText = _dtl.lastHdrtext;
if ( typeof _dtl.fieldTitle == "string" &&
_dtl.fieldTitle.length > 0 ) {
titleText = _dtl.fieldTitle;
_dtl.fieldTitle = void(0);
}
if ( typeof rows == "number" && rows > 1 ) {
html = "<textarea readonly rows=" + rows + " cols=" + size +
idinfo + ' title="' + titleText + '">' +
value + "</textarea>";
}
else {
html = "<input type=text readonly size=" + size + idinfo;
if ( value != "&nbsp;" ) {
value = value.replace(/"/g,'&quot;');
html += ' value="' + value + '"';
}
html += ' title="' + titleText + '">';
}
}
detailSetRowData(html);
return;
}
function detailSetRowData( text, isDate )
{
if (_dtl.dataoverrideclass !="")
{
_dtl.colSpan[_dtl.colNum] += _dtl.dataoverrideclass;
_dtl.dataoverrideclass = "";
}
else
{
if ( _dtl.dataclass.length == 0 && text.substr(0,1) != "<" )
_dtl.colSpan[_dtl.colNum] += _dtl.roclass;
}
_dtl.rowData[_dtl.colNum] = text;
if ((typeof isDate == "number") && (isDate == 1))
_dtl.dateField[_dtl.colNum] = 1;
else
_dtl.dateField[_dtl.colNum] = 0;
_dtl.colNum++;
if ( _dtl.colNum > _dtl.maxCol )
_dtl.maxCol = _dtl.colNum;
}
function detailDate( hdrtext, attr_name, colspan, size,time,
is_required, value, locked )
{
if (typeof validate_date != "function") {
alertmsg("Can't_validate_Date");
}
var ind = value.indexOf("/");
if(ind > 0)
{
value = string_to_date("", value, attr_name);
value = value.toString();
}
if ( !bool(locked) && _dtl.edit )
detailDateEdit( hdrtext, attr_name, colspan, size,time,
is_required,value );
else
detailDateReadonly( hdrtext, attr_name, colspan, time, value );
}
function detailDateReadonly( hdrtext, attr_name, colspan, time, value )
{
detailRowHdr(hdrtext,colspan,false);
if ( value.length > 0 )
value = date_to_string(value,0,0,time);
else
value = "&nbsp;";
_dtl.lookupAttrs[attr_name] = { id: "df_" + _dtl.rowNum + "_" + _dtl.colID};
detailSetReadonlyRowData( attr_name, value, colspan );
}
function detailDateEdit( hdrtext, attr_name, colspan, size,time,
is_required, value )
{
if ( ! detailOK2Edit(attr_name, hdrtext) ) {
detailDateReadonly( hdrtext, attr_name, colspan, time, value );
return;
}
var field_name;
if ( attr_name.match(/^KEEP\./) )
field_name = attr_name;
else
field_name = "SET." + attr_name;
detailWriteDateHdr( hdrtext, field_name, colspan, is_required, false,"", time );
if ( typeof size != "number" || size < 2 )
size = 20;
var nextid = detailNextID(colspan,false,attr_name);
if ( ahdtop.cstUsingScreenReader ) {
var titletext = hdrtext;
if ( bool(is_required) )
titletext += ahdtop.cfgIndRequired;
nextid += ' title="' + msgtext("%1_-_autofill;_up_arrow_for_lo",titletext) + '"';
}
detailSetRowData( field_name +
":" + value + ":" + size +
":" + nextid + ":" + time, 1);
detailSetValidate( hdrtext, is_required, 100 );
}
function detailWriteDateHdr( hdrtext, field_name, colspan,
is_required, selector_id, flag_name, time )
{
detailRowHdr("",colspan,is_required);
var n = _dtl.form.length - 1;
var hdrhtml = "<TH" +
_dtl.colSpan[_dtl.hdrColNum] +
' ALIGN=left VALIGN=middle>';
var link;
link='<A class=lookup1em'+detailNextLinkID()+
' HREF="javascript:void(0)" onClick=\"';
if ( typeof selector_id == "string" )
link += "detailSwitchDateToText('" + selector_id + "','" +
field_name + "','" + flag_name + "', true);return false;\" ";
else
{
if(typeof time!="undefined" && time=="no")
{
link += "popup_date_helper('" + detailCurrForm() + "','" +
field_name + "','" +
time + "');return false;\" ";
}
else
{
link += "popup_date_helper('" + detailCurrForm() + "','" +
field_name + "');return false;\" ";
}
}
var titletext = msgtext("Pop_up_%1_calendar_helper",hdrtext);
var lbltext = hdrtext;
if ( ahdtop.cstUsingScreenReader ) {
lbltext = msgtext("%1_Lookup0",hdrtext);
hdrhtml += link + 'title="' + msgtext("%1_-_to_navigate_to_edit_field",titletext) + '">';
}
else {
link += 'title="' + titletext + '" onMouseOver="window.status=\'' +
msgtext("Popup_search_window_for_%1",hdrtext.toLowerCase()).replace(/&#39;/g, "'").replace(/\'/g,"\\\'") +
'\';return true" ' +
'onMouseOut="window.status=window.defaultStatus;return true">';
hdrhtml += link +
'<IMG class=dtl_img_attr  SRC="' +
get_IMG_path("IMG_lookup_cal") + '" alt="' +
msgtext("Pop_up_%1_calendar_helper",hdrtext) + '">&nbsp;';
}
hdrhtml += "<SPAN CLASS=";
if ( ! bool(is_required) )
hdrhtml += "lookup";
else {
hdrhtml += _dtl.reqlookupclass;
lbltext += ahdtop.cfgIndRequired;
}
hdrhtml += detailSetReqArray(hdrtext);
hdrhtml += detailLabelFor(lbltext) + "</SPAN></A>";
docWriteln(hdrhtml);
}
var DATE_DD_EMPTY = '';
function detailDateDropdown(hdrtext, attr_name, colspan, size,
is_required, flag_name, selections )
{
var field_name;
if ( attr_name.indexOf("SET") == 0 )
field_name = attr_name;
else
field_name = "SET." + attr_name;
var date_id = "df_" + _dtl.rowNum + "_" + _dtl.colID;
_dtl.currAttrName = attr_name;
detailWriteDateHdr( hdrtext, field_name, colspan, is_required, date_id, flag_name );
var dateNextID = detailNextID();
var text = date_input_text("main_form", "", field_name, "", size,
dateNextID.replace(date_id, date_id + "_hdn") +
" STYLE='display:none'");
var eh = "detailSwitchDateToText('" + date_id +
"','" + field_name + "','" + flag_name + "', false);";
var p = dateNextID.match(/^(.*)return (detailBlur.this.;)(.*)$/);
if ( p == null )
{
p = dateNextID.match(/^(.*)(detailBlur.this.;)(.*)$/);
if(p == null)
dateNextID += " " + eh;
else
dateNextID = p[1] + p[2] + eh + p[3];
}
else
dateNextID = p[1] + p[2] + eh + "return false;" + p[3];
var titletext = hdrtext;
if ( bool(is_required) )
titletext += ahdtop.cfgIndRequired;
text += "<SELECT" + dateNextID + pdmqa(attr_name) +
" title=\"" + titletext + "\"" +
" onClick=\"_dtl.lastKeycode=0;" + eh + "\"" +
" STYLE='width:" + (size * 10) + "'>\n";
text += "<OPTION VALUE="+DATE_DD_EMPTY+">&lt;" + msgtext("empty") + "&gt;\n";
for ( var i = 6; i < arguments.length - 1; i+=2 )
text += "<OPTION VALUE=" + arguments[i] + ">" +
arguments[i+1] + "\n";
text += "<OPTION VALUE=other>" + msgtext("Other...") + "\n";
text += "</SELECT>";
detailSetRowData(text);
detailSetValidate( hdrtext, is_required, 100 );
}
function detailSwitchDateToText( id, field_name, flag_name, popup_helper )
{
var selector = document.getElementById(id);
var input = document.getElementById(id + "_hdn");
if ( selector == null || input == null )
{
if (popup_helper)
popup_date_helper('main_form', field_name);
}
else {
var v = selector[selector.selectedIndex].value;
if ( v != DATE_DD_EMPTY || popup_helper ) {
selector.onblur=null;
selector.id = id + "_selector";
selector.tabIndex=-1;
input.id = id;
input.style.display = "";
input.setAttribute("autocomplete","OFF");
if ( _dtl.lastKeycode == 0 || _dtl.lastKeycode == ENTER )
input.focus();
selector.style.display = "none";
var flag = document.getElementById(flag_name);
if ( flag != null )
flag.value = "1";
if ( v == "other" || popup_helper )
popup_date_helper('main_form', field_name);
else {
var today = new Date();
if ( v - 0 > 0 ) {
var tmp = Math.round( today.getTime() / 1000) + (v - 0);
input.value = date_to_string(tmp, 0);
}
}
adjScrollDivHeight();
}
}
}
function detailGetTenancyType( tenancy )
{
var tenancyType = "";
try {
if ( _dtl.tenantFieldEditable &&
argFactoryTenancy != '0' &&
cfgAccessTenantRestriction != "1" &&
( tenancy == "1" || tenancy == "2" ) ) {
tenancyType = ( tenancy == "2" ? ahdtop.cfgIndTenant
: ahdtop.cfgIndTenantOpt );
if ( typeof _dtl.serviceProviderEligibleFields == "undefined" )
_dtl.serviceProviderEligibleFields = new Object();
}
}
catch(tenancy) {}
return tenancyType;
}
function detailTenantChange(e)
{
var o = e.options[e.selectedIndex];
detailSetTenant( e.name, o.value, o.text );
}
function detailSetTenant( fieldName, tenantId, tenantName )
{
if ( typeof _dtl != "object" ||
typeof tenantId != "string" ||
argFactoryTenancy == "0" ||
argFactoryTenancy == "" ||
_dtl.tenantFieldEditable == false )
return;
if ( typeof _dtl.alertmsgField == "string" &&
_dtl.alertmsgField == fieldName ) {
AlertMsg = "";
var alertmsg = document.getElementById("alertmsg");
if ( alertmsg != null ) {
alertmsg.style.display = "none";
adjScrollDivHeight();
}
_dtl.alertmsgField = void(0);
}
var i;
if ( tenantId.match(/^0*$/) ) {
tenantId = "";
tenantName = "";
}
var tenantField, tenantForm = document.tenant_form;
if ( typeof tenantForm == "object" && tenantForm != null ) {
tenantField = tenantForm.elements["SET.tenant"];
if ( tenantField == null )
tenantField = tenantForm.elements["KEY.tenant"];
}
if ( typeof tenantField != "object" || tenantField == null ) {
alert("Internal error in detailSetTenant() - can't find tenant field");
return;
}
if (fieldName == "KEY.tenant" || fieldName == "SET.tenant") {
if ( tenantId.length > 0 ) {
document.main_form.elements["SET.tenant"].value = tenantId;
argTenantId = tenantId;
argTenant = tenantName;
return;
}
else {
document.main_form.elements["SET.tenant"].value = "";
argTenantId = "";
argTenant = "";
}
if ( typeof _dtl.tenantImplyingFields != "object" )
return;
var saveAction = ahdframe.currentAction;
ahdframe.currentAction = ACTN_COMPLETE;
var formFields = document.main_form.elements;
for ( fieldName in _dtl.tenantImplyingFields ) {
var e = formFields[fieldName];
if ( typeof e == "object" && e != null ) {
if ( e.type == "select-one" )
e.selectedIndex = -1;
else
e.value = "";
call_event_handlers(e);
}
e = formFields["SET." + fieldName];
if ( typeof e == "object" && e != null ) {
if ( e.type == "select-one" )
e.selectedIndex = -1;
else
e.value = "";
call_event_handlers(e);
}
e = formFields["KEY." + fieldName];
if ( typeof e == "object" && e != null ) {
if ( e.type == "select-one" )
e.selectedIndex = -1;
else
e.value = "";
call_event_handlers(e);
}
if ( typeof formFields[fieldName + "_lname"] == "object" ) {
formFields[fieldName + "_lname"].value = "";
formFields[fieldName + "_fname"].value = "";
formFields[fieldName + "_mname"].value = "";
formFields[fieldName + "_combo_name"].value = "";
}
}
ahdframe.currentAction = saveAction;
_dtl.tenantImplyingFields = void(0);
_dtl.fkeyTenants = void(0);
var url = cfgCgi +
"?SID=" + cfgSID +
"+FID=" + cfgFID +
"+OP=GET_CANDIDATE_TENANTS" +
"+persid=" + nx_escape(argPersistentID) +
"+srelTenant=!";
var response = SyncAjaxCall(url);
if ( response.match(/-1,(.*)/) )
alert(RegExp.$1);
restoreOriginalTenantField(tenantField);
return;
}
if ( typeof _dtl.tenantImplyingFields == "undefined" ) {
_dtl.tenantImplyingFields = new Object();
_dtl.fkeyTenants = new Object();
}
var currTenantInfo;
var prevTenant = _dtl.tenantImplyingFields[fieldName];
if ( typeof prevTenant == "undefined" ) {
if ( tenantId == "" ||
( tenantId == ahdtop.serviceProviderUuid &&
typeof _dtl.serviceProviderEligibleFields=="object" &&
typeof _dtl.serviceProviderEligibleFields[fieldName] == "string" ) )
return;
_dtl.tenantImplyingFields[fieldName] = tenantId;
currTenantInfo = _dtl.fkeyTenants[tenantId];
if ( typeof currTenantInfo == "object" ) {
currTenantInfo.refcount++;
return;
}
currTenantInfo = new Object();
currTenantInfo.refcount = 1;
_dtl.fkeyTenants[tenantId] = currTenantInfo;
}
else {
if ( prevTenant == tenantId )
return;
var prevTenantInfo = _dtl.fkeyTenants[prevTenant];
var controllingTenant = ""; 
if ( typeof prevTenantInfo != "object" )
alert("Internal error - lost info for tenant " + prevTenant);
else {
if ( --prevTenantInfo.refcount == 0 ) {
delete _dtl.fkeyTenants[prevTenant];
var minCandidateCount = 999999;
for ( tenantId in _dtl.fkeyTenants ) {
var currCandidateCount = _dtl.fkeyTenants[tenantId].candidateCount;
if ( currCandidateCount < minCandidateCount ) {
minCandidateCount = currCandidateCount;
controllingTenant = tenantId;
}
}
}
}
if ( tenantId == "" ||
( tenantId == ahdtop.serviceProviderUuid &&
typeof _dtl.serviceProviderEligibleFields[fieldName] == "string" )){
delete _dtl.tenantImplyingFields[fieldName];
if ( controllingTenant == "" ) {
restoreOriginalTenantField(tenantField);
}
else {
if ( _dtl.candidateTenantCount >= minCandidateCount )
return;
currTenantInfo = _dtl.fkeyTenants[controllingTenant];
}
tenantId = "!" + controllingTenant;
}
else {
_dtl.tenantImplyingFields[fieldName] = tenantId;
var currTenantInfo = _dtl.fkeyTenants[tenantId];
if ( typeof currTenantInfo == "object" ) {
currTenantInfo.refcount++;
if ( controllingTenant == "" )
return;
}
else {
currTenantInfo = new Object();
currTenantInfo.refcount = 1;
_dtl.fkeyTenants[tenantId] = currTenantInfo;
}
}
}
var url = cfgCgi +
"?SID=" + cfgSID +
"+FID=" + cfgFID +
"+OP=GET_CANDIDATE_TENANTS" +
"+persid=" + nx_escape(argPersistentID) +
"+srelTenant=" + nx_escape(tenantId);
var response = SyncAjaxCall(url);
if ( response.match(/^(-?\d+)@?,@?(.*)/) ) {
var rc = RegExp.$1 - 0;
var value = RegExp.$2;
switch ( rc ) {
case -1:
alert(value);
return;
case 0:
_dtl.candidateTenantCount = 0;
argTenantId = "";
argTenant = "";
break;
case 1:
_dtl.candidateTenantCount = 1;
currTenantInfo.candidates = value;
currTenantInfo.candidateCount = 1;
argTenantId = tenantId;
argTenant = tenantName;
ahdtop.lastTenantId = tenantId;
ahdtop.lastTenantName = tenantName;
document.main_form.elements["SET.tenant"].value = tenantId;
if ( tenantField.type != "select-one" )
tenantField.value = tenantName;
else {
if( tenantField.options.length >= 2 &&
tenantField.options[1].text == msgtext("global_(shared)"))
tenantField.options.length = 2;
else
tenantField.options.length = 1;
tenantField.options[tenantField.options.length] = 
new Option(tenantName, tenantId, false, true );
if ( _dtl.hasGlobalSharedOption &&
tenantField.options[1].text == msgtext("global_(shared)") ) {
tenantField.remove(1);
}
}
break;
default: 
_dtl.candidateTenantCount = rc;
currTenantInfo.candidates = value;
currTenantInfo.candidateCount = rc;
if ( tenantField.type == "select-one" ) {
if ( value.indexOf("@,@") == -1 ) {
argTenantId = "";
argTenant = "";
for ( var i = tenantField.length-1; i >= 0; i-- ) {
var optval = tenantField.options[i].value.toUpperCase();
if ( value.indexOf(optval) == -1 )
tenantField.remove(i);
}
}
else {
if ( tenantField.options.length >= 2 &&
tenantField.options[1].text == msgtext("global_(shared)"))
tenantField.options.length = 2;
else
tenantField.options.length = 1;
tenantField.selectedIndex = -1;
value = value.split("@,@");
for ( i = value.length - 1; i > 0; i -= 2 ) {
tenantField.options[tenantField.options.length] =
new Option( value[i], value[i-1], false, false );
if ( value[i-1] == argTenantId ) {
tenantField.selectedIndex = tenantField.options.length - 1;
}
}
if ( tenantField.selectedIndex == -1 ) {
tenantField.selectedIndex = 0;
argTenantId = "";
argTenant = "";
}
}
if ( _dtl.hasGlobalSharedOption &&
tenantField.options[1].text == msgtext("global_(shared)") ) {
tenantField.remove(1);
}
}
else {
argTenantId = "";
argTenant = "";
}
break;
}
}
}
function detailSetTenantFromPresetField( fieldName, tenantId, tenantName )
{
detailSetTenant( fieldName, tenantId, tenantName );
if ( ahdtop.cfgMultiTenancy == "on" )
{
var tenantField, tenantForm = document.tenant_form;
if ( typeof tenantForm == "object" && tenantForm != null ) {
tenantField = tenantForm.elements["SET.tenant"];
}
if ( typeof tenantField != "object" || tenantField == null ) {
return;
}
var rxEmpty = new RegExp("^." + msgtext("empty") + ".$");
for ( var i = tenantField.options.length-1 ; i >= 0 ; i-- ) {
if ( tenantField.options[i].text.match(rxEmpty) ||
(tenantField.options[i].text == msgtext("global_(shared)") && tenantId != ""))
tenantField.options[i] = null;
}
detailTenantChange(tenantField);
}
}
function restoreOriginalTenantField(tenantField)
{
if ( tenantField != null && tenantField.type == "select-one" ) {
if ( tenantField.options.length >= 2 &&
tenantField.options[1].text == msgtext("global_(shared)"))
tenantField.options.length = 2;
else
tenantField.options.length = 1;
if ( tenantField.options.length == 1 && _dtl.hasGlobalSharedOption &&
tenantField.options[0].text != msgtext("global_(shared)") ) {
tenantField.options[tenantField.options.length] = 
new Option(msgtext("global_(shared)"),"",false,false);
}
if ( typeof cfgTenantSelections == "string" ) {
tenantList = cfgTenantSelections;
if ( tenantList.match(/^@,@/) )
tenantList = tenantList.substring(3, tenantList.length);
tenantList = tenantList.split("@,@");
for ( i = 0; i < tenantList.length; i += 2 )
tenantField.options[tenantField.options.length] = 
new Option(tenantList[i], tenantList[i+1], false, true );
}
else if ( typeof ahdtop.cfgAccessUpdatableTenantUuids == "object" ) {
for ( i = ahdtop.cfgAccessUpdatableTenantUuids.length - 1;
i >= 0; i-- ) {
tenantField.options[tenantField.options.length] = 
new Option( ahdtop.cfgAccessUpdatableTenantNames[i],
ahdtop.cfgAccessUpdatableTenantUuids[i],
false, true );
}
}
tenantField.selectedIndex = 0;
}
argTenantId = "";
argTenant = "";
detailProcessPresetTenantImplyingFields();
}
var LOOKUP = 1;
var DROPDOWN = 2;
var UNKNOWN = 3;
function checkParentStatusField(attr_name)
{
if	((attr_name == "status") && 
_dtl.secondary)
{
var edit_windows = getEditWindows(argPersistentID);
for ( var i = 0; i < edit_windows.length; i++ ) 
{
var e_win = edit_windows[i];
if (typeof e_win._dtl == "object" && 
!e_win._dtl.secondary)
{ 
var set_status_fld = e_win.document.forms["main_form"].elements["SET.status"];
if (typeof set_status_fld != "undefined" && 
typeof set_status_fld != null)
{ 
if (set_status_fld.type == "select-one")
return DROPDOWN;
else 
return LOOKUP; 
}
}
}
}
return UNKNOWN; 
}
function detailDropdown(hdrtext, attr_name, obj_type, colspan, size,
is_required, persid, rel_attr,
autofill, common_name_attr, common_name_value,
search_status, search_results, link, cbwidth, extraURL,
dflt, selections )
{
var i, field_name;
var parent_status_fld = checkParentStatusField(attr_name);
if (parent_status_fld == DROPDOWN && 
selections == "SelListCacheMax") 
{
dflt = "";
rel_attr = "";
selections = "";
}
else 
if (parent_status_fld == LOOKUP &&
selections != "SelListCacheMax") 
selections = "SelListCacheMax";
var new_val;
var new_reg;
if ( typeof dflt == "string" )
new_reg = dflt.match(/^!(.+)!$/);
if ( typeof new_reg != "undefined" && new_reg != null && new_reg != "" ) {
try {
new_val = eval(RegExp.$1);
} catch (e) { alert(e); }
if (typeof new_val != "undefined")
dflt = new_val;
}
new_reg = rel_attr.match(/^!(.+)!$/)
if ( typeof new_reg != "undefined" && new_reg != null && new_reg != "" ) {
try {
new_val = eval(RegExp.$1);
} catch (e) { alert(e); }
if (typeof new_val != "undefined")
rel_attr = new_val;
}
var tenancy = "0";
var serviceProviderEligible = "0";
if ( typeof autofill == "string" &&
autofill.match(/^(\w*):(.*)$/) ) {
tenancy = RegExp.$2;
autofill = RegExp.$1;
if ( tenancy.match(/^(\w+):(\w+)$/) ) {
tenancy = RegExp.$1;
serviceProviderEligible = RegExp.$2;
}
}
var locked = false;
if ( typeof is_required == "string" &&
is_required.match(/^(\w*):(.*)$/) ) {
is_required = ( RegExp.$1.length > 0 ? bool(RegExp.$1) : false );
locked = ( RegExp.$2.length > 0 ? bool(RegExp.$2) : false );
}
rel_attr = nx_unescape(rel_attr);
if ( typeof selections != "string" )
selections = "";
if ( ! bool(locked) && 
( selections == "SelListCacheMax" ||
( tenancy != "0" &&
tenancy != "tenant" &&
argFactoryTenancy != "0" &&
_dtl.tenantFieldEditable ) ) ) {
detailLookupEdit( hdrtext, attr_name, obj_type, colspan, size,
is_required, persid, rel_attr,
autofill, common_name_attr, common_name_value,
search_status, search_results, "yes", extraURL,
0, tenancy, serviceProviderEligible );
return;
}
if ( selections.length == 0 )
selections = new Array();
else {
selections = nx_unescape(selections);
selections = selections.split( "@,@" );
for ( i = 18; i < arguments.length; i++ )
selections[selections.length] = nx_unescape(arguments[i]);
}
if ( ! detailOK2Edit(attr_name, hdrtext) ) {
var sDisplayValue = common_name_value;
if ( common_name_attr == "" )
{
for ( var iSelectionCounter = 0; iSelectionCounter < selections.length / 2; iSelectionCounter++ )
{
var iIDPos = iSelectionCounter * 2 + 1;
if ( selections[iIDPos] == rel_attr )
{
sDisplayValue = selections[iIDPos - 1];
break;
}
}
}
else
{
for ( i = 1; i < selections.length; i += 2 ) 
{
var sym = selections[i-1];
var code = selections[i];
if ( code == rel_attr ) 
{ 
sDisplayValue = sym;
break;
}
}
}
detailLookupReadonly( hdrtext, attr_name, colspan,
persid, sDisplayValue, link );
return;
}
common_name_value = nx_unescape(common_name_value);
var item="";
var _dflt_obj;
try {
_dflt_obj=eval("dflt_" + attr_name);
}
catch(e) { }
if(typeof _dflt_obj=="object") {
_dtl.tabIndex++;
var lnkTab=_dtl.tabIndex;
_dtl.tabIndex++;
var lnkId = "";
var imgId = "";
if( _dtl.currID != "" )
{
lnkId =_dtl.currID.replace("df", "dflnk2");
imgId =_dtl.currID.replace("df", "dfimg");
}
else
{	
lnkId = "dflnk2" + attr_name;
imgId = "dfimg" + attr_name;
} 
var dflt_key = _dflt_obj["KEY"];
var dflt_set = _dflt_obj["SET"];
dflt_key=dflt_key.replace(/&#39;/g, "'").replace(/\'/g,"\\\'");
dflt_txt=dflt_set.replace(/&#39;/g, "'").replace(/\'/g,"\\\'");
var lblt=hdrtext.replace(/ \*$/,"");
var def_alt = msgtext("Set_default_%1_to_%2", lblt, dflt_key);
var def_click = "detailLookupEdit_setDefault('" + attr_name + "','" + dflt_key + "','" + dflt_set + "');";
var def_mouse_out = 'window.status=window.defaultStatus; return true;';
var def_mouse_over = 'window.status=\'' + def_alt.replace(/&#39;/g, "'").replace(/\'/g,"\\\'") + 
'\';return true;';
var def_src = get_IMG_path("IMG_default");
var def_link = '<A class=lookup1em' + lnkId +
' HREF="javascript:void(0);" onclick="' + def_click + '"' +
' title="' + def_alt + '"' +
' onMouseOver="' + def_mouse_over +'" ID="' + lnkId + '"' +
' onMouseOut="' + def_mouse_out + '" tabIndex=' + lnkTab + '>' +
' <IMG class=dtl_img_attr SRC="' + def_src + 
'" alt="' + def_alt + '" name="IMG.' + attr_name + '" ID="' + imgId + '"/></A>&nbsp;</TH>';
item = def_link + item;
_dflt_obj["img"]=def_src;
_dflt_obj["tab"]=lnkTab;
_dflt_obj["clk"]=new Function(def_click + ";");
_dflt_obj["imgId"]=imgId;
_dflt_obj["lnkId"]=lnkId;
_dflt_obj["alt"]=def_alt;
}
var tenancyType = detailGetTenancyType(tenancy);
if (tenancy != "tenant")
detailRowHdr(hdrtext + tenancyType,colspan,is_required);
if ( attr_name.match(/^KEEP\./) )
field_name = attr_name;
else
field_name = "SET." + attr_name;
item += '<SELECT' + detailNextID(colspan,false,attr_name);
if(typeof _dflt_obj != "undefined") {
if ( item.match(/^(.*onChange=\\?['"'])(.*)$/i) )
item = RegExp.$1 + "set_default_toggle(this); " + RegExp.$2;
else
item += ' onChange="set_default_toggle(this);"';
}
if ( cbwidth != 0 )
item += ' STYLE="WIDTH:' + cbwidth + 'px;"';
if ( typeof _dtl.fieldTitle != "string" ||
_dtl.fieldTitle.length == 0 ) {
var titletext = hdrtext;
if ( bool(is_required) )
titletext += ahdtop.cfgIndRequired;
item += " title=\"" + titletext + "\"";
}
else {
item += " title=\"" + _dtl.fieldTitle + "\"";
_dtl.fieldTitle = void(0);
}
item += ' NAME="' + field_name + '">\n';
var options = "";
if ( ! bool(is_required) ||
( rel_attr.length == 0 && ( dflt.length == 0 || tenancy == "tenant") ) )
options += '<OPTION VALUE="">&lt;' + msgtext("empty") + '&gt;\n';
var curr_found = false;
var common_name_code = null;
for ( i = 1; i < selections.length; i += 2 ) {
var sym = selections[i-1];
var code = selections[i];
if ( sym == common_name_value )
common_name_code = code;
if ( code == rel_attr ||
( sym == dflt &&
rel_attr.length == 0 &&
dflt.length > 0 ) ) {
curr_found = true;
options += '<OPTION SELECTED VALUE="' + code + '">' + sym + '\n';
}
else
options += '<OPTION VALUE="' + code + '">' + sym + '\n';
}
if ( ! curr_found ) {
if ( common_name_code != null ) {
options = options.replace( 'VALUE="'+common_name_code+'">',
'SELECTED VALUE="'+common_name_code+'">');
}
else if ( rel_attr.length > 0 ) {
if ( common_name_value.length == 0 ) {
common_name_value = "?";
rel_attr="";
}
options += '<OPTION SELECTED VALUE="' + rel_attr + '">' + common_name_value + '\n';
}
}
item += options + '</SELECT>\n';
if ( tenancy == "tenant" )
return (item);
detailSetRowData(item);
detailSetValidate( hdrtext, is_required );
if ( serviceProviderEligible == "1" &&
typeof _dtl.serviceProviderEligibleFields == "object" )
_dtl.serviceProviderEligibleFields[field_name] = "1";
}
function detailHier( hdrtext, attr_name, obj_type, colspan, size,
is_required, persid, rel_attr,
autofill, common_name_attr, common_name_value,
search_status, search_results, tenancy,
serviceProviderEligible, locked )
{
common_name_value = nx_unescape(common_name_value);
rel_attr = nx_unescape(rel_attr);
var ahdtop = get_ahdtop();
var suppress_hier_fac = obj_type;
if ( suppress_hier_fac.match(/^(.*)(_ss)$/) ) {
if ( RegExp.$2.length > 0 ) {
suppress_hier_fac = RegExp.$1;
}
}
if( !bool(locked) && typeof ahdtop=="object"&&ahdtop!=null&&
ahdtop.cfgSuppressHier.indexOf(" "+suppress_hier_fac+" ")!=-1){
detailLookupEdit(hdrtext,attr_name,obj_type,colspan,size,
is_required,persid,rel_attr,
autofill,common_name_attr,common_name_value,
search_status,search_results, "yes", "", 0,
tenancy, serviceProviderEligible);
return;
}
if ( !bool(locked) && _dtl.edit )
detailHierEdit( hdrtext, attr_name, obj_type, colspan, size,
is_required, persid, rel_attr,
autofill, common_name_attr, common_name_value,
search_status, search_results,
tenancy, serviceProviderEligible )
else
detailLookupReadonly( hdrtext, attr_name, colspan,
persid, common_name_value );
}
var cat_validate_fld = void(0);
function detailHierEdit( hdrtext, attr_name, obj_type, colspan, size,
is_required, persid, rel_attr,
autofill, common_name_attr, common_name_value,
search_status, search_results,
tenancy, serviceProviderEligible )
{
if ( ! detailOK2Edit(attr_name, hdrtext) ) {
detailLookupReadonly( hdrtext, attr_name, colspan,
persid, common_name_value );
return;
}
var arr = persid.split(":");
var is_contact = arr[0] == "agt" ||
arr[0] == "cnt" ||
arr[0] == "cst" ||
arr[0] == "agtgrp"||
arr[0] == "grp";
if ( typeof size != "number" || size < 2 )
size = 20;
var n = _dtl.form.length - 1;
var item, do_autofill;
var field_name;
var tenancyType = detailGetTenancyType(tenancy);
detailRowHdr("",colspan,is_required);
if ( typeof common_name_attr != "string" ||
common_name_attr.length == 0 )
do_autofill = false;
else
do_autofill = ( autofill == "yes" );
var hdrhtml = "<TH" +
_dtl.colSpan[_dtl.hdrColNum] +
' ALIGN=left VALIGN=middle>';
var link = '<A class=lookup1em' + detailNextLinkID() +
' HREF="javascript:void(0)" onclick="popup_hier(\'' +
obj_type + "','KEY." + attr_name +
"','" + detailCurrForm() + "','" +
common_name_attr + "',1)\" ";
var lbltext = hdrtext;
var titletext = msgtext("Pop_up_%1_lookup_form",hdrtext);
if ( ahdtop.cstUsingScreenReader ) {
lbltext = msgtext("%1_Hierarchical_Lookup",lbltext);
hdrhtml += link + ' title="' + msgtext("%1_-_to_navigate_to_edit_field",titletext) + '">';
}
else {
link += 'title="' + titletext + '" onMouseOver="window.status=\'' +
msgtext("Popup_search_window_for_%1",lbltext.toLowerCase()).replace(/&#39;/g, "'").replace(/\'/g,"\\\'") +
'\';return true" ' +
'onMouseOut="window.status=window.defaultStatus;return true">';
hdrhtml += link +
'<IMG class=dtl_img_attr SRC="' +
get_IMG_path("IMG_lookup_hier") + '" alt="' +
msgtext("Pop_up_%1_lookup_form",hdrtext) + '">&nbsp;';
}
hdrhtml += "<SPAN CLASS=";
if ( ! bool(is_required) )
hdrhtml += "lookup";
else {
hdrhtml += _dtl.reqlookupclass;
lbltext += ahdtop.cfgIndRequired;
}
hdrhtml += detailSetReqArray(hdrtext);
hdrhtml += detailLabelFor(lbltext+tenancyType) + "</SPAN></A></TH>";
docWriteln(hdrhtml);
var onchg;
if ( do_autofill )
onchg = "detailAutofill(this,'" + obj_type +
"',0,'" + common_name_attr + "',true);";
else
onchg = "detailClearSetField(this)";
var eh = _dtl.eventHandler;
if ( eh.length == 0 )
_dtl.eventHandler = "onChange=\"" + onchg + "\" ";
else if ( ! eh.match(/^(.*onChange=\\?)(['"'])(.*)$/i) )
_dtl.eventHandler += " onChange=\"" + onchg + "\" ";
else {
if ( RegExp.$2 == "'" )
onchg = onchg.replace(/'/g,'"');
_dtl.eventHandler = RegExp.$1 + RegExp.$2 + onchg + ";" + RegExp.$3;
}
var field_name = "KEY." + attr_name;
if (obj_type == "KCAT" && (attr_name == "PRIMARY_INDEX" || attr_name == "KCAT"))
{
item = "<INPUT" + detailNextID(colspan,false,attr_name) + " TYPE=text readonly class=dtl_txt_ro VALUE=\"" +
common_name_value.replace(rxQuote,"&quot;") +
"\" SIZE=100%" + " NAME=\"" + field_name + "\"";
}
else
{
item = "<INPUT" + detailNextID(colspan,false,attr_name) + " TYPE=text VALUE=\"" +
common_name_value.replace(rxQuote,"&quot;") +
"\" SIZE=" + size + " NAME=\"" + field_name + "\"";
}
if ( ahdtop.cstUsingScreenReader) {
titletext = hdrtext;
if ( bool(is_required) )
titletext += ahdtop.cfgIndRequired;
item += ' title="' + msgtext("%1_-_autofill;_up_arrow_for_lo",titletext) + '">\n';
}
else {
item += ' title="' + hdrtext + '">\n';
}
if ( typeof search_status == "string" && search_status.length > 0 )
rel_attr = "";
item += '<INPUT TYPE=hidden NAME="' +
"SET." + attr_name + '" VALUE="' + rel_attr + '">\n';
var errtext = "";
if ( typeof search_status == "string" && search_status.length > 0 ) {
item += "<BR><SPAN ID=search_status_span CLASS=statuslabeltext>" +
search_status + "</SPAN>";
errtext = hdrtext + ": " + search_status;
if ( typeof AlertMsg == "string" && AlertMsg.length > 0 )
AlertMsg += "<BR>" + errtext;
else
AlertMsg = errtext;
}
autoComplete_parameter = "QBE.IN."+common_name_attr;
if(common_name_attr == "")
{
if ( typeof AlertMsg == "string" && AlertMsg.length > 0 )
AlertMsg += "<BR>" + msgtext("Invalid_attribute_name: \'%1\' provided_for_%2_lookup",attr_name,hdrtext);
else
AlertMsg = msgtext("Invalid_attribute_name: \'%1\' provided_for_%2_lookup",attr_name,hdrtext);
}
else
{
populate_autosuggest_array(obj_type, attr_name, common_name_attr, '', is_contact, autoComplete_parameter, _dtl.currID);
}
detailSetRowData(item);
if ( serviceProviderEligible == "1" &&
typeof _dtl.serviceProviderEligibleFields == "object" )
_dtl.serviceProviderEligibleFields[field_name] = "1";
var f_obj = detailSetValidate( hdrtext, is_required, 0, errtext );
if (attr_name == "category")
cat_validate_fld = f_obj;
}
function detailLookup( hdrtext, attr_name, obj_type, colspan, size,
is_required, persid, rel_attr,
autofill, common_name_attr, common_name_value,
search_status, search_results, link, extraURL,
tenancy, serviceProviderEligible, locked )
{
if ( attr_name == "group")
{
common_name_value = common_name_value.replace(", ,", "");
}
if ( !bool(locked) && _dtl.edit )
detailLookupEdit( hdrtext, attr_name, obj_type, colspan, size,
is_required, persid, rel_attr,
autofill, common_name_attr, common_name_value,
search_status, search_results, link, extraURL, 0, 
tenancy, serviceProviderEligible );
else
detailLookupReadonly( hdrtext, attr_name, colspan,
persid, common_name_value, link );
}
function detailLookupReadonly( hdrtext, attr_name, colspan,
persid, common_name_value, link )
{
var item;
common_name_value = nx_unescape(common_name_value);
var arr = persid.split(":");
var is_contact = arr[0] == "agt" ||
arr[0] == "cnt" ||
arr[0] == "cst" ||
arr[0] == "agtgrp"||
arr[0] == "grp";
if (is_contact)
{
arr = common_name_value.split(",");
if (arr.length == 3) {
if ( arr[1].length > 0 )
common_name_value = arr[0] + ", " + arr[1] + " " + arr[2];
else if ( arr[2].length > 0 )
common_name_value = arr[0] + ",, " + arr[2];
else
common_name_value = arr[0];
}
}
var addMOPreview = true;
if ((typeof link == "string" && link != "yes") || ahdtop.cstDisablePreviews ) {
addMOPreview = false;
}
if (typeof cfgMOPreviewMode == "number" && cfgMOPreviewMode == 1) {
addMOPreview = false;
link = "no";
}	
var nextIdText = detailNextID(colspan, null, attr_name);
var id = _dtl.currID + "_" + attr_name;
if (typeof link == "string" && link == "yes") {
_dtl.lookupAttrs[attr_name + "_hdr"] = { id: hdrtext };
if ( persid == "" ) {
var tpl = '<A' + nextIdText + ' title="' + hdrtext +
' #@#CNAME" HREF=\'javascript:showDetailWithPersid("#@#PERSID")\'><SPAN class=lookup1em>#@#CNAME</SPAN></A>';
_dtl.lookupAttrs[attr_name + "_tpl"] = { id: tpl };
}
}
if ( common_name_value.length == 0 ) {
_dtl.lookupAttrs[attr_name] = { id: id };
detailRowHdr(hdrtext, colspan, false, void(0), id);
detailSetReadonlyRowData(attr_name,"&nbsp;",colspan,id);
return;
}
else if (typeof link == "string" && link == "no") {
_dtl.lookupAttrs[attr_name] = { id: id };
detailRowHdr(hdrtext, colspan, false, void(0), id);
detailSetReadonlyRowData(attr_name,common_name_value,colspan,id);
return;
}
else {
detailRowHdr(hdrtext, colspan, false, void(0), false);
var lookupClass = ( _dtl.edit ? 'lookup' : 'lookup1em' );
if (typeof link == "string" && link != "yes") {
item = '<A' + nextIdText + pdmqa(attr_name) + ' HREF="javascript:' +
link + ' " title="' + hdrtext + " " + common_name_value +
'"><SPAN class=' + lookupClass + '>' +
common_name_value + '</SPAN></A>';
}
else {
item = "<A" + nextIdText + pdmqa(attr_name);
if ( !addMOPreview ) {
item += ' title="' + hdrtext + " " + common_name_value + '"';
}
item += " HREF='javascript:showDetailWithPersid(\"" + persid + "\")'";
if ( addMOPreview ) {
item += " onmouseover=\"startMOPreviewTimeout('" + persid + "');\"" + 
" onmouseout=\"cancelBuildingMOPreview()\"" +
" onclick=\"closeMOPreview()\"";
}
item += "><SPAN class=" + lookupClass + '>';
item += common_name_value + '</SPAN></A>';
} 
id = _dtl.currID;
}
_dtl.lookupAttrs[attr_name] = { id: id };
detailSetRowData(item);
}
function selAgtCheck(sel)
{
if (_dtl.edit && !_dtl.skip_agt_check)
{
var opt = sel.options[sel.selectedIndex];
if (typeof opt.value == "undefined" || opt.value == "") return;
var f = document.main_form;
var prop_ref_str = ""; 
if (typeof prop_ref != "undefined")
prop_ref_str = prop_ref; 
detailAgtCheck(f, "group", opt.value, prop_ref_str);
}
}
function detailLookupEdit( hdrtext, attr_name, obj_type, colspan, size,
is_required, persid, rel_attr,
autofill, common_name_attr, common_name_value,
search_status, search_results, linkinfo, extraURL,
bSetFontTo1em, tenancy, serviceProviderEligible )
{
if ( common_name_attr == "combo_name" &&
common_name_value.match(/^([^,]*),([^,]*),(.*)$/) ) {
if ( RegExp.$2.length > 0 || RegExp.$3.length > 0 )
common_name_value = RegExp.$1 + ", " + RegExp.$2 + " " + RegExp.$3;
else
common_name_value = RegExp.$1;
}
if (typeof bSetFontTo1em != "undefined" )
{
if (bSetFontTo1em == 1)
{
_dtl.dataoverrideclass = " style='font-size:1.0em;'";
}
}
if ( ! detailOK2Edit(attr_name, hdrtext) ) {
detailLookupReadonly( hdrtext, attr_name, colspan,
persid, common_name_value );
return;
}
if (typeof extraURL == "undefined")
extraURL = "";
else
{
if (extraURL.indexOf("javascript:") == 0)
{
extraURL = eval(extraURL);
}
} 
extraURL = extraURL.replace(/'/g, nx_escape("'"));
common_name_value = nx_unescape(common_name_value);
if ( typeof size != "number" || size < 2 )
size = 20;
var n = _dtl.form.length - 1;
var is_contact = obj_type == "agt" ||
obj_type == "cnt" ||
obj_type == "cst" ||
obj_type == "agtgrp"||
obj_type == "grp";
var item, field_name, do_autofill;
if ( typeof search_results != "string" || search_results.length == 0 )
search_results = "";
else
search_results = search_results.split( "@,@" );
var tenancyType = detailGetTenancyType(tenancy);
if ( search_results.length > 2 ) {
detailRowHdr(hdrtext + tenancyType,colspan,is_required);
if ( attr_name.match(/^KEEP\./) )
field_name = attr_name;
else
field_name = "SET." + attr_name;
if (attr_name == "group")
{
var onblur = "selAgtCheck(this)";
var eh = _dtl.eventHandler;
if ( eh.length == 0 )
_dtl.eventHandler = "onBlur=\"" + onblur + "\" ";
else if ( ! eh.match(/^(.*onBlur=\\?)(['"'])(.*)$/i) )
_dtl.eventHandler += " onBlur=\"" + onblur + "\" ";
else
_dtl.eventHandler = RegExp.$1 + RegExp.$2 + onblur + ";" + RegExp.$3;
}
item = '<SELECT' + detailNextID(colspan,false,attr_name) +
' NAME="' + field_name + '">\n';
var options = "";
if ( ! bool(is_required) )
options += '<OPTION VALUE="">&lt;' + msgtext("empty") +'&gt;\n';
for ( var i = 1; i < search_results.length; i += 2 ) {
var sym = search_results[i-1];
var code = search_results[i];
options += '<OPTION VALUE="' + code + '">' + sym + '\n';
}
options += "<OPTION VALUE='noneoftheabove'>" +
msgtext("None_of_the_Above") + "\n";
item += options + '</SELECT>\n';
}
else {
detailRowHdr("",colspan,is_required);
if ( search_results.length == 2 ) {
common_name_value = search_results[0];
rel_attr = search_results[1];
}
if ( typeof common_name_attr != "string" ||
common_name_attr.length == 0 )
do_autofill = false;
else
do_autofill = ( autofill == "yes" );
var hdrhtml= "<TH" +
_dtl.colSpan[_dtl.hdrColNum] +
' ALIGN=left VALIGN=middle';
if (attr_name.match(/menu_bar_obj/) != null)
{
hdrhtml += ' ID=MenuBarObjHdr';
}
hdrhtml += '>';
var link = '<A class=lookup1em' +
detailNextLinkID() +
' HREF="javascript:void(0)" onclick="';
if (typeof linkinfo == "string" && linkinfo != "yes") {
link += linkinfo + "\" ";
}
else if ( is_contact )
link += "fill_name_fields(_dtl.form[" + n + "],'" +
obj_type + "','" + attr_name + "',true,'" + extraURL +"' )\" ";
else {
if (attr_name == "tenant") {
link += "popup_search('" + obj_type + "','KEY." + attr_name +
"','tenant_form', '" + extraURL + "',0,'" +
common_name_attr + "')\" ";
}
else {
link += "popup_search('" + obj_type + "','KEY." + attr_name +
"','" + detailCurrForm() + "', '" + extraURL + "',0,'" +
common_name_attr + "')\" ";
}
}
var titletext = msgtext("Pop_up_%1_lookup_form",hdrtext);
var lbltext = hdrtext;
if ( ahdtop.cstUsingScreenReader ) {
lbltext = msgtext("%1_Lookup",lbltext);
hdrhtml += link + ' title="' + msgtext("%1_-_to_navigate_to_edit_field",titletext) +'">';
}
else {
link += 'title="' + titletext + '" onMouseOver="window.status=\'' +
msgtext("Popup_search_window_for_%1",lbltext.toLowerCase()).replace(/&#39;/g, "'").replace(/\'/g,"\\\'") +
'\';return true" ' +
'onMouseOut="window.status=window.defaultStatus;return true">';
hdrhtml += link +
'<IMG class=dtl_img_attr SRC="' +
get_IMG_path("IMG_lookup") + '" alt="' +
msgtext("Pop_up_%1_lookup_form",hdrtext) + '">&nbsp;';
}
hdrhtml += "<SPAN CLASS=";
if ( ! bool(is_required) )
hdrhtml += "lookup";
else {
hdrhtml += _dtl.reqlookupclass;
lbltext += ahdtop.cfgIndRequired;
}
hdrhtml += detailSetReqArray(hdrtext);
hdrhtml += detailLabelFor(lbltext+tenancyType) + "</SPAN></A></TH>";
docWriteln(hdrhtml);
var onchg;
if ( do_autofill )
onchg = "detailAutofill(this,'" + obj_type +
"'," + is_contact + ",'" + common_name_attr + "',false,'" + extraURL + "');";
else if ( is_contact )
onchg = "fill_name_fields('main_form','" + obj_type +
"','" + attr_name + "',true,'" + extraURL + "');";
else
onchg = "detailClearSetField(this);";
var eh = _dtl.eventHandler;
if ( eh.length == 0 )
_dtl.eventHandler = "onChange=\"" + onchg + "\" ";
else if ( ! eh.match(/^(.*onChange=\\?)(['"'])(.*)$/i) )
_dtl.eventHandler += " onChange=\"" + onchg + "\" ";
else {
if ( RegExp.$2 == "'" )
onchg = onchg.replace(/'/g,'"');
_dtl.eventHandler = RegExp.$1 + RegExp.$2;
var func_str = RegExp.$3;
var end_q = RegExp.$2;
if (do_autofill && func_str.indexOf("backfill_cnt_event") >= 0)
{
var idx = func_str.lastIndexOf(end_q);
_dtl.eventHandler += func_str.slice(0, idx) + ";" + onchg + end_q;
}
else 
_dtl.eventHandler += onchg + func_str;
}
item="";
if (attr_name == "KD" && typeof cfgLookupLabel=="boolean" && cfgLookupLabel)
{
item = "<INPUT" + detailNextID(colspan,false,attr_name) + " TYPE=text readonly class=dtl_txt_ro VALUE=\"" +
common_name_value.replace(rxQuote,"&quot;") +
"\" SIZE=80";
}
else
{
var _dflt_obj;
try {
_dflt_obj=eval("dflt_" + attr_name);
}
catch(e) { }
if(typeof _dflt_obj=="object") {
_dtl.tabIndex++;
var lnkTab=_dtl.tabIndex;
_dtl.tabIndex++;
var nxtId=detailNextID(colspan,false,attr_name);
var lnkId=_dtl.currID.replace("df", "dflnk2");
var imgId=_dtl.currID.replace("df", "dfimg");
var dflt_key = _dflt_obj["KEY"];
var dflt_set = _dflt_obj["SET"];
dflt_key=dflt_key.replace(/&#39;/g, "'").replace(/\'/g,"\\\'");
dflt_txt=dflt_set.replace(/&#39;/g, "'").replace(/\'/g,"\\\'");
var lblt=lbltext.replace(/ \*$/,"");
var def_alt = msgtext("Set_default_%1_to_%2", lblt, dflt_key);
var def_click = "detailLookupEdit_setDefault('" + attr_name + "','" + dflt_key + "','" + dflt_set + "');";
var def_mouse_out = 'window.status=window.defaultStatus; return true;';
var def_mouse_over = 'window.status=\'' + def_alt.replace(/&#39;/g, "'").replace(/\'/g,"\\\'") + 
'\';return true;';
var def_src = get_IMG_path("IMG_default");
var def_link = '<A class=lookup1em' + lnkId +
' HREF="javascript:void(0);" onclick="' + def_click + '"' +
' title="' + def_alt + '"' +
' onMouseOver="' + def_mouse_over +'" ID="' + lnkId + '"' +
' onMouseOut="' + def_mouse_out + '" tabIndex=' + lnkTab + '>' +
' <IMG class=dtl_img_attr SRC="' + def_src + 
'" alt="' + def_alt + '" name="IMG.' + attr_name + '" ID="' + imgId + '"/></A>&nbsp;</TH>';
item += def_link;
item += "<INPUT" + nxtId + " TYPE=text VALUE=\"" +
common_name_value.replace(rxQuote,"&quot;") +
"\" SIZE=" + size;
_dflt_obj["img"]=def_src;
_dflt_obj["tab"]=lnkTab;
_dflt_obj["clk"]=new Function(def_click + ";");
_dflt_obj["imgId"]=imgId;
_dflt_obj["lnkId"]=lnkId;
_dflt_obj["alt"]=def_alt;
_dtl.tabIndex++;
} else { 
item += "<INPUT" + detailNextID(colspan,false,attr_name) + " TYPE=text VALUE=\"" +
common_name_value.replace(rxQuote,"&quot;") +
"\" SIZE=" + size;
}
}
if ( ahdtop.cstUsingScreenReader ) {
var titletext = hdrtext;
if ( bool(is_required) )
titletext += ahdtop.cfgIndRequired;
item += ' title="' + msgtext("%1_-_autofill;_up_arrow_for_lo",titletext) + '"';
}
item += " NAME=\"";
if ( ! is_contact ) {
field_name = "KEY." + attr_name;
item += field_name + "\">\n";
}
else {
field_name = attr_name;
item += field_name + "_combo_name\">\n";
item += '<INPUT TYPE=hidden NAME="' +
"KEY." + attr_name + '"'; 
if ( typeof search_status == "string" && search_status.length > 0 )
item += ' VALUE="' + common_name_value.replace(rxQuote,"&quot;") +
'"'; 
item += '>\n';
item += '<INPUT TYPE=hidden NAME="' +
attr_name + '_lname">\n';
item += '<INPUT TYPE=hidden NAME="' +
attr_name + '_fname">\n';
item += '<INPUT TYPE=hidden NAME="' +
attr_name + '_mname">\n';
}
if ( typeof search_status == "string" && search_status.length > 0 )
rel_attr = ""; 
if (attr_name != "tenant") {
item += '<INPUT TYPE=hidden NAME="' +
"SET." + attr_name + '" VALUE="' + rel_attr + '">\n';
}
}
var errtext = "";
if ( typeof search_status == "string" && search_status.length > 0 ) {
item += "<BR><SPAN CLASS=statuslabeltext>" +
search_status + "</SPAN>";
errtext = hdrtext + ": " + search_status;
if ( typeof AlertMsg == "string" && AlertMsg.length > 0 )
AlertMsg += "<BR>" + errtext;
else
AlertMsg = errtext;
}
autoComplete_parameter = "QBE.IN."+common_name_attr;
if(common_name_attr == "")
{
if ( typeof AlertMsg == "string" && AlertMsg.length > 0 )
AlertMsg += "<BR>" + msgtext("Invalid_attribute_name: \'%1\' provided_for_%2_lookup",attr_name,hdrtext);
else
AlertMsg = msgtext("Invalid_attribute_name: \'%1\' provided_for_%2_lookup",attr_name,hdrtext);
}
else
{
var obj_auto_suggest = obj_type;
var extraURL_autosuggest = extraURL;
if(is_contact){
extraURL_autosuggest = fill_name_fields_text(obj_type, _dtl.form[n], extraURL);
if(obj_type != "g_cnt")
obj_auto_suggest = "cnt";
else if(is_contact)
obj_auto_suggest = "g_cnt";
autoComplete_parameter = "QBE.IN.last_name";	
}
populate_autosuggest_array(obj_auto_suggest, attr_name, common_name_attr, extraURL_autosuggest, is_contact, autoComplete_parameter, _dtl.currID);
}
if (attr_name == "tenant") {
return item;
}
detailSetRowData(item);
detailSetValidate(hdrtext, is_required, 0, errtext);
if ( serviceProviderEligible == "1" &&
typeof _dtl.serviceProviderEligibleFields == "object" )
_dtl.serviceProviderEligibleFields[field_name] = "1";
}
function detailAutofill(e, obj_type, is_contact, common_name_attr, is_hier, extraURL)
{
if(typeof _dtl == "object" && _dtl.is_from_autoSuggest == true) 
{	
_dtl.is_from_autoSuggest = false;
return null;
}
if(typeof _dtl=="object" &&
typeof _dtl.is_from_setDefault != "undefined" && _dtl.is_from_setDefault==true)
{
_dtl.is_from_setDefault=false;
return null;
}
detailClearSetField(e,false);
var do_search = false;
if ( ahdframe.currentAction == ACTN_COMPLETE ) {
if ( e.name == "KEY.tenant" ) {
if ( e.value.match(/^\s*$/) )
detailSetTenant(e.name, "", "");
else
popup_search( obj_type, e.name, "tenant_form",
extraURL, 0, common_name_attr );
}
else if (
! e.value.match(/^\s*$/) ) {
if ( is_contact )
do_search = true;
else if ( is_hier )
popup_hier( obj_type, e.name, "main_form", common_name_attr, true);
else{
if(obj_type == "OA_TABLES" && common_name_attr == "TABLE_NAME")
{
if(e.value == "" || e.value == null)
popup_search( obj_type, e.name, "main_form",
extraURL, 0, common_name_attr );
else
popup_search( obj_type, e.name, "main_form",
"", 0, common_name_attr );
}
else
popup_search( obj_type, e.name, "main_form",
extraURL, 0, common_name_attr );
}
}
}
if(obj_type=="cnt" && e.value.length==0 && this.propFormName3=="edit") {
if(typeof alert_banner_obj!="undefined" && typeof alert_banner_attr!="undefined"
&& alert_banner_obj.length>0 && alert_banner_attr.length>0) {
var fld=alert_banner_attr + "_combo_name";
if(alert_banner_obj==this.propFormName2 && fld==e.name)
alert_banner_clear();
}
}
if ( is_contact &&
e.name.match(/^(.*)_combo_name$/) )
fill_name_fields( _dtl.form[0], obj_type, RegExp.$1, do_search, extraURL );
}
function detailClearSetField(e,callSetTenant)
{
var attrName;
var set_fld_val = "";
if ( e.name.match(/^SET\.(.*)$/) )
attrName = RegExp.$1;
else if ( e.name.match(/^KEY\.(.*)$/) ||
e.name.match(/^(.*)_combo_name$/) ) {
attrName = RegExp.$1;
var setfld = document.main_form["SET." + attrName];
if ( setfld != null )
{
set_fld_val = setfld.value;
setfld.value = "";
}
}
if ( typeof attrName == "string" &&
typeof _dtl.tenantImplyingFields == "object" &&
( typeof callSetTenant == "undefined" || callSetTenant ) )
detailSetTenant( attrName, "", "" );
}
function detailCheckbox( hdrtext, attr_name, colspan, value, on, off, locked )
{
if ( !bool(locked) && _dtl.edit)
detailCheckboxEdit( hdrtext, attr_name, colspan, value );
else
detailCheckboxReadonly( hdrtext, attr_name, colspan, value, on, off );
}
function detailCheckboxReadonly( hdrtext, attr_name, colspan, value, on, off )
{
detailRowHdr(hdrtext,colspan,false);
if ( value.length == 0 || value.match(/^[ 0]*$/) ) {
if ( typeof off == "string" &&
off.length > 0 &&
! off.match(/^ +$/) )
value = off;
else
value = "&nbsp;";
}
else {
if ( typeof on == "string" && on.length > 0 )
value = on;
else
value = "X";
}
detailSetReadonlyRowData(attr_name,value, colspan);
}
function detailCheckboxEdit( hdrtext, attr_name, colspan, value )
{
if ( ! detailOK2Edit(attr_name, hdrtext) ) {
detailCheckboxReadonly( hdrtext, attr_name, colspan, value );
return;
}
detailRowHdr(hdrtext,colspan,false);
var item = "<INPUT TYPE=hidden NAME=SET." + attr_name +
" VALUE=\"" + value.replace(rxQuote,"&quot;") + "\">\n" +
"<INPUT" + detailNextID(colspan,false,attr_name) +
" TYPE=checkbox VALUE='1' NAME=CBX." + attr_name +
" onClick=\"detailSetCbxFlag(this)\"";
if ( typeof _dtl.fieldTitle != "string" ||
_dtl.fieldTitle.length == 0 )
item += " title=\"" + hdrtext + "\"";
else {
item += " title=\"" + _dtl.fieldTitle + "\"";
_dtl.fieldTitle = void(0);
}
if ( value.length > 0 && ! value.match(/^[ 0]*$/) )
item += " CHECKED";
item += ">";
detailSetRowData(item);
}
function detailSetCbxFlag( element )
{
if ( element.name.match(/CBX\.([\.\w]*)/ ) ) {
var f = document.main_form["SET." + RegExp.$1];
if ( f != null )
f.value = ( element.checked ? "1" : "0" );
}
var dep_element_name = "";
if ( element.name == "CBX.ACCTYP_KT.c_qa_browse_search" )
{
dep_element_name = "CBX.ACCTYP_KT.c_qa_submit";
}
else if ( element.name == "CBX.ACCTYP_KT.c_qa_submit" )
{
dep_element_name = "CBX.ACCTYP_KT.c_qa_answer";
}
else if ( element.name == "CBX.ACCTYP_KT.c_qa_answer" )
{
dep_element_name = "CBX.ACCTYP_KT.c_qa_close";
}
else if ( element.name == "CBX.ACCTYP_KT.c_file_browse_search" )
{
dep_element_name = "CBX.ACCTYP_KT.c_file_edit";
}
else if ( element.name == "CBX.EXP_SEC_CAT" )
{
dep_element_name = "CBX.EXP_ALL_DOCS";
}
if ( dep_element_name != "" )
{
var dep_element = document.getElementsByName(dep_element_name)[0];
if ( !element.checked )
{
dep_element.checked = false;
}
dep_element.disabled = !element.checked;
detailSetCbxFlag( dep_element );
}
if ( element.name == "CBX.OVERRIDE_PUB" || element.name == "CBX.OVERRIDE_UNPUB" )
{
document.getElementsByName("CBX.OVERRIDE_DEFAULTS")[0].disabled = !document.getElementsByName("CBX.OVERRIDE_PUB")[0].checked &&
!document.getElementsByName("CBX.OVERRIDE_UNPUB")[0].checked;
}
}
function detailTextbox( hdrtext, attr_name, colspan, rows, size,
is_required, maxsize, value, spellchk, srchknow,
JSButton, dataType, password, locked, id )
{
if (!bool(locked) && _dtl.edit )
detailTextboxEdit( hdrtext, attr_name, colspan, rows, size,
is_required, maxsize, value, spellchk, srchknow,
JSButton, dataType, password, id )
else {
if ( typeof password == "string" && 
password.match(/yes/i) &&
value != "" ) {
value = "";
for ( var i = size; i > 0; i-- )
value += "&bull;";
}
detailTextboxReadonly( hdrtext, attr_name, colspan, value,
void(0), void(0), rows, size );
}
}
function detailTextboxReadonly( hdrtext, attr_name, colspan, value, id, overrideclass, rows, size, common_name_attr, hdrclass, inline )
{
if ( typeof common_name_attr == "string" &&
common_name_attr == "combo_name" &&
value.match(/^([^,]*),([^,]*),(.*)$/) ) {
if ( RegExp.$2.length > 0 || RegExp.$3.length > 0 )
value = RegExp.$1 + ", " + RegExp.$2 + " " + RegExp.$3;
else
value = RegExp.$1;
}
value = nx_unescape(value);
if (typeof inline == "undefined" || inline == "no" || 
( inline == "yes" && ahdtop.cstUsingScreenReader )) {
detailRowHdr(hdrtext,colspan,false,void(0),void(0),hdrclass);
}
if ( value.length == 0 || value.match(/^ *$/) )
value = "&nbsp;";
if (typeof overrideclass != "undefined")
_dtl.dataoverrideclass = " CLASS=" + overrideclass;
if ( typeof id == "string" && id.length > 0 )
_dtl.lookupAttrs[attr_name] = { id: id };
else
_dtl.lookupAttrs[attr_name] = { id: "df_"+_dtl.rowNum+"_"+_dtl.colID };
if (typeof inline == "undefined" || inline == "no") {
detailSetReadonlyRowData(attr_name, value, colspan, id, rows, size);
} else {
detailSetReadonlyRowData(attr_name, value, colspan, id, rows, size, hdrtext, hdrclass);
}
}
function detailTextboxEdit( hdrtext, attr_name, colspan, rows, size,
is_required, maxsize, value, spellchk, srchknow,
JSButton, dataType, password ,id )
{
if ( ! detailOK2Edit(attr_name, hdrtext) ) {
detailTextboxReadonly( hdrtext, attr_name, colspan, value );
return;
}
if (typeof dataType == "undefined")
dataType = "";
var item, th, field_name;
value = nx_unescape(value);
if ( typeof size != "number" || size < 2 )
size = 20;
if ( attr_name.match(/^KEEP\./) )
field_name = attr_name;
else
field_name = "SET." + attr_name;
var spellchk_button = ( typeof spellchk == "string" && spellchk.match(/^[Yy]/) );
var srchknow_button = ( typeof srchknow == "string" && srchknow.match(/^[Yy]/) );
if ( ( ! spellchk_button ) && ( ! srchknow_button ) && ( typeof JSButton == "undefined" || JSButton == ""))
detailRowHdr(hdrtext,colspan,is_required);
else {
_dtl.doingLabelButton = true;
var rowHdr = detailRowHdr(hdrtext,colspan,is_required,false);
if ( typeof colspan != "number" || colspan == 1 )
th = "<TH";
else
th = "<TH COLSPAN=" + colspan;
rowHdr = rowHdr.replace("baseline","middle");
var row_id = get_exp_row_id("");
if ( row_id != "" )
row_id = " ID='" + row_id + "' ";
docWriteln(th + " ALIGN=left><TABLE><TR" + row_id + ">" + rowHdr);
if ( spellchk_button ) {
_dtl.spellchk = true;
ImgBtnSetDefaultTabIndex(_dtl.tabIndex+1);
docWriteln("<TH>");
ImgBtnCreate("", "Spelling[p]",
"popup_spellchecker('spell_form','main_form','" +
field_name + "')", true, 0, msgtext("Check_spelling_of_%1",hdrtext));
docWriteln("</TH>");
}
if ( srchknow_button ) {
_dtl.srhknow = true;
ImgBtnSetDefaultTabIndex(_dtl.tabIndex+1);
docWriteln("<TH>");
ImgBtnCreate("", "Search_Knowledge",
"srchknow('" + field_name + "')", true, 0,
msgtext("Search_knowledge_based_on_%1",hdrtext));
docWriteln("</TH>");
}
if (typeof JSButton != "undefined" && JSButton != "")
{
try
{
eval(JSButton);
}
catch (e)
{}	
}
docWriteln("</TR></TABLE></TH>");
_dtl.doingLabelButton = false;
}
if (propFactory == "KD")
{
_dtl.spellchk=true;
}
if (typeof id == "undefined" || id == "")
id = detailNextID(colspan,false,attr_name);
else 
id = " ID=" + id + pdmqa(id);
var titletext = hdrtext;
if ( bool(is_required) )
titletext += ahdtop.cfgIndRequired;
if ( rows - 0 == 1 )
{
item = "<INPUT" + id;
if ( typeof password == "string" && password.match(/yes/i) )
item += " TYPE=password";
else
item += " TYPE=text";
item += " VALUE=\"" + value.replace(rxQuote,"&quot;") +
"\" SIZE=" + size + " NAME='" + field_name + "'";
if ( typeof _dtl.fieldTitle != "string" ||
_dtl.fieldTitle.length == 0 )
item += " title=\"" + titletext + "\"";
else {
item += " title=\"" + _dtl.fieldTitle + "\"";
_dtl.fieldTitle = void(0);
}
if (dataType == "0" && typeof validate_int != "undefined")
item += ' onChange="validate_int(this.value)"';
if (maxsize > 0)
item += " MAXLENGTH=" + maxsize + ">";
else
item += ">";
}
else {
item = "<TEXTAREA" + id +
" ROWS=" + rows + " COLS=" + size;
if ( typeof _dtl.fieldTitle != "string" ||
_dtl.fieldTitle.length == 0 )
item += " title=\"" + titletext + "\"";
else {
item += " title=\"" + _dtl.fieldTitle + "\"";
_dtl.fieldTitle = void(0);
}
item += " NAME='" + field_name + "'";
if ( maxsize > 0 )
item += " MAXLENGTH=" + maxsize;
item += ">" + value + "</TEXTAREA>";
}
detailSetRowData(item);
detailSetValidate( hdrtext, is_required, maxsize );
if ( spellchk_button || srchknow_button )
_dtl.tabIndex++;
}
function detailExternal( hdrtext, text, colspan )
{
if ( typeof text != "string" ) {
if ( typeof text == "number" &&
typeof colspan == "undefined" )
colspan = text;
if ( typeof hdrtext != "string" || hdrtext.length == 0 )
return;
text = hdrtext;
hdrtext = " ";
}
detailRowHdr(hdrtext,colspan,false);
if ( ! text.match(/^\s*\</) )
detailSetReadonlyRowData("",text, colspan);
else
detailSetRowData(text);
}
function detailHTMLEditBox( hdrtext, attr_name, colspan, rows, size,
is_required, maxsize, value, spellchk, preview, optionid, readonly, toolbar, className )
{
var row_id;
var id = "df_" + _dtl.rowNum + "_" + _dtl.colID;
var divId = "div" + id;
var generatedButton = false;
if ( (typeof readonly=="string" && readonly.match(/^[Yy]/)) ||
! detailOK2Edit(attr_name,hdrtext) )
{
detailHTMLEditBoxReadOnly( hdrtext, attr_name, colspan, rows, size,
is_required, maxsize, value, preview, optionid, divId, className );
return;
}
var bShowEditor = true;
if (ahdtop.cfgNX_KT != "Yes" && toolbar == "kd")
bShowEditor = false;
var th, field_name,spellButId;
if (optionid.length == 0 || optionid == "")
optionid = "id" + attr_name;
if ( typeof size != "number" || size < 2 )
size = 20;
if ( attr_name.match(/^KEEP\./) )
field_name = attr_name;
else
field_name = "SET." + attr_name;
var rowHdr = detailRowHdr(hdrtext,colspan,is_required,false);
if ( typeof colspan != "number" || colspan == 1 )
th = "<TH";
else
th = "<TH COLSPAN=" + colspan;
rowHdr = rowHdr.replace("baseline","middle");
row_id = get_exp_row_id("");
if (row_id != "") row_id = " ID='" + row_id + "' ";
docWriteln(th + " ALIGN=left><TABLE><TR" + row_id + ">" + rowHdr + "<TH>");
_dtl.doingLabelButton = true;
if ( bShowEditor ||
( typeof spellchk == "string" && spellchk.match(/^[Yy]/) ) ) {
generatedButton = true;
ImgBtnRow(10);
if(bShowEditor)
{
ImgBtnSetDefaultTabIndex(_dtl.tabIndex+1);
ImgBtnCreate("", "Edit_%1",
"OpenHTMLEditor('"+ field_name +"','"+divId+"','" +
toolbar + "')",true,0,msgtext("Open_HTML_editor_on_%1",hdrtext), void(0), "positive", hdrtext);
}
if (typeof spellchk == "string" && spellchk.match(/^[Yy]/) )
{
_dtl.spellchk = true;
ImgBtnSetDefaultTabIndex(_dtl.tabIndex+1);
spellButId = ImgBtnCreate("", "Spelling[p]",
"popup_spellchecker('spell_form','main_form','" +
field_name + "')", true, 0, msgtext("Check_spelling_of_%1",hdrtext));
}
ImgBtnEndRow();
}
docWriteln("</TH>");
if(bShowEditor && typeof preview=="string" && preview.match(/^[Yy]/))
{
var caption = msgtext("Quick_View");
var caption_loc = "Quick_View";
if (!nonLatinFlag)
caption_loc = caption; 
var qvKey = registerActionKey("", caption_loc, setRadioButton,
_dtl.form[0].name, optionid, 0);
caption = msgtext("HTML_Source");
caption_loc = "HTML_Source";
if (!nonLatinFlag)
caption_loc = caption; 
var htmlKey = registerActionKey("", caption_loc, setRadioButton,
_dtl.form[0].name, optionid, 1);
docWriteln("<TH><INPUT TYPE=radio ID=radioPreview NAME=" + 
optionid + 
" onclick=detailHTMLEditBoxMode('1','" + divId + "','" +
id + "','" + spellButId +
"') tabindex=" + (_dtl.tabIndex+1) + 
"><SPAN class=labeltext><label for='radioPreview'>" +
fmtLabelWithActkey(msgtext("Quick_View"), qvKey) +
"</label></SPAN><INPUT TYPE=radio CHECKED ID=radioSource NAME=" +
optionid + 
" onclick=detailHTMLEditBoxMode('0','" + divId + "','" +
id + "','" + spellButId +
"') tabindex=" + (_dtl.tabIndex+1) + 
"><SPAN class=labeltext><label for='radioSource'>" +
fmtLabelWithActkey(msgtext("HTML_Source"), htmlKey) +
"</label></SPAN></TH>");
}
docWriteln("</TR></TABLE></TH>");
_dtl.doingLabelButton = false;
var item="";
item+="<TABLE style='padding:0px;margin:0px;'>";
if(bShowEditor)
{
row_id = get_exp_row_id("");
if (row_id != "") row_id = " ID='" + row_id + "' ";
item+="<TR" + row_id + ">" + "<TD style='padding:0px;margin:0px;'><DIV ID='"+divId+"' "+
" class='dtl_html_edit_box'>"+
"</DIV></TD></TR>";
}
row_id = get_exp_row_id("");
var titletext = hdrtext;
if ( bool(is_required) )
titletext += ahdtop.cfgIndRequired;
if (row_id != "") row_id = " ID='" + row_id + "' ";
item += "<TR><TD" + row_id + " style='padding:0px;margin:0px;'><TEXTAREA " +
detailNextID(colspan,false,attr_name) +
" title=\"" + titletext + "\"" +
" ROWS="+rows+" COLS="+size+
" NAME='"+field_name+"'></TEXTAREA></TD></TR></TABLE>";
detailSetRowData(item);
detailSetValidate( hdrtext, is_required, maxsize );
var sCMD = "SetHTMLValue('" + value + "','" + field_name + "',true);";
window.setTimeout(sCMD, 50);	
if ( generatedButton )
_dtl.tabIndex++;
}
function SetHTMLValue(sValue,sFldName,bSetDefValue)
{
sValue= nx_unescape(sValue);
var e = null;
for(var i=0;i<document.forms.length;i++){
e=document.forms[i].elements[sFldName];
if(typeof e=="object")
break;
}
if(typeof e=="object")
try{
e.value = sValue;
if (typeof bSetDefValue != "undefined" && bSetDefValue != null && bSetDefValue == true)
e.defaultValue = sValue;
}
catch(e){}
}
function detailHTMLEditBoxReadOnly(hdrtext, attr_name, colspan, rows, size,
is_required, maxsize, value, preview, optionid, divId, className)
{
var row_id;
var field_name;
value = nx_unescape(value);
value = ReplaceRepIdToImgPath(value);
if (optionid == 0 || optionid.length == 0 || optionid == "")
optionid = "id" + attr_name;
if ( typeof size != "number" || size < 2 )
size = 20;
if ( attr_name.match(/^KEEP\./) )
field_name = attr_name;
else
field_name = "SET." + attr_name;
detailRowHdr(hdrtext,colspan,false);
detailIncrCol(colspan);
var sAttr = detailNextID(colspan);
var startPos = sAttr.indexOf("=");
var endPos = sAttr.indexOf(" ", startPos);
var sID = sAttr.substring(startPos+1,endPos);
var item="";
row_id = get_exp_row_id("");
if ( row_id != "" )
row_id = " ID='" + row_id + "' ";
item += "<table class='labeltext dtl_html_edit_box_ro";
if ( className != "" )
item += " " + className;
item += "'><tr" + row_id +
"><td style='padding:0p;margin:0px;'><div id='"+ divId + "' tabindex=" + _dtl.tabIndex +
" title=\"" + hdrtext + "\" class='html_heading_ro'>"+
value + "</div></td></tr></table>";
detailSetRowData(item);
}
function detailKeyDown( active_element, keycode, shiftkey, altkey )
{
_dtl.lastKeycode = keycode;
var r, c, e = null, v;
if ( typeof active_element == "object" ) {
var id = active_element.id;
if ( typeof id != "string" )
id = "";
if ( id.match(/df([\w]*)_([\d]+)_([\d]+)/) ) {
var lnk = RegExp.$1;
var row = RegExp.$2 - 0;
var col = RegExp.$3 - 0;
var maxRow = _dtl.rowNum - 1;
var maxCol = _dtl.maxCol;
if ( row == _dtl.propertyRow ) {
switch ( keycode ) {
case ARROW_UP:
if ( col > 0 )
if(!((active_element.type=="select-one"||
active_element.type=="select-multiple")&&
(_browser.isNS||!shiftkey)))
e=document.getElementById("df_"+row+"_"+(col-1));
break;
case ARROW_DOWN:
if(!((active_element.type=="select-one"||
active_element.type=="select-multiple")&&
(_browser.isNS||!shiftkey))) 
e = document.getElementById("df_" + row + "_" + (col+1));
break;
}
if ( e != null )
keycode = 0;
}
switch ( keycode ) {
case ARROW_LEFT:
if ( ahdtop.cfgUserType != "analyst" ||
ahdtop.cstUsingScreenReader )
break;
if ( ! altkey ) {
if ( ( active_element.type == "text" ||
active_element.type == "textarea" ) &&
active_element.value.length > 0 )
break;
}
while ( e == null ) {
col--;
if ( col < 0 ) {
col = maxCol;
if ( row > 0 )
row--;
else
row = maxRow;
}
e = document.getElementById("df_" + row + "_" + col);
}
break;
case ARROW_RIGHT:
if ( active_element.tagName == "A" &&
! altkey &&
! shiftkey ) {
for ( var p = active_element;
p != null && p.tagName != "FORM" && p.tagName != "HTML";
p = p.parentNode ) {
var handler = p.oncontextmenu;
if ( handler == null )
handler = p.onmouseover;
if ( handler != null ) {
var script = handler.toString().replace(/\n/g," ");
if ( script.match(/\{(.*\.show)/) ) {
eval(RegExp.$1 + "('mouseless',active_element,0)");
return false;
}
}
}
}
if ( ahdtop.cfgUserType != "analyst" ||
ahdtop.cstUsingScreenReader )
break;
if ( ! altkey ) {
if ( ( active_element.type == "text" ||
active_element.type == "textarea" ) &&
active_element.value.length > 0 )
break;
}
while ( e == null ) {
col++;
if ( col > maxCol ) {
col = 0;
if ( row < maxRow )
row++;
else
row = 0;
}
e = document.getElementById("df_" + row + "_" + col);
}
break;
case ARROW_UP:
if ( ahdtop.cstUsingScreenReader ) {
if ( active_element.type == "text" )
e = document.getElementById("dflnk_" + row + "_" + col);
if ( e == null )
break;
}
if ( ( active_element.type == "select-one" ||
active_element.type == "select-multiple" ) &&
( _browser.isNS || ! shiftkey ) )
break;
if ( ! altkey ) {
if ( active_element.type == "textarea" &&
active_element.value.length > 0 )
break;
}
if ( lnk != "lnk" )
e = document.getElementById("dflnk_" + row + "_" + col);
for ( r = row-1; r > 0 && e == null; r-- )
e = document.getElementById("df_" + r + "_" + col);
while ( e == null ) {
if ( row > 0 )
row--;
else
row = maxRow;
for ( c = col ; e == null && c >= 0; c-- )
e = document.getElementById("df_" + row + "_" + c);
}
break;
case ARROW_DOWN:
if ( ahdtop.cstUsingScreenReader &&
active_element.tagName != "A" )
break;
if ( ( active_element.type == "select-one" ||
active_element.type == "select-multiple" ) &&
( _browser.isNS || ! shiftkey ) )
break;
if ( ! altkey ) {
if ( active_element.type == "textarea" &&
active_element.value.length > 0 )
break;
}
if ( lnk == "lnk" )
e = document.getElementById("df_" + row + "_" + col);
for ( r = row+1; r <= maxRow && e == null; r++ )
e = document.getElementById("df_" + r + "_" + col);
while ( e == null ) {
if ( row < maxRow )
row++;
else
row = 0;
for ( c = col; e == null && c >= 0; c-- )
e = document.getElementById("df_" + row + "_" + c);
}
break;
case TAB:
if ( _dtl.errorCount ) {
for ( var i = 0; i < _dtl.fieldToValidate.length; i++ ) {
v = _dtl.fieldToValidate[i];
if ( v.id == active_element.id ) {
if ( v.browserFoundError ) {
v.browserFoundError = v.error;
var incr = shiftkey ? -1 : +1;
while (true) {
i += incr;
if ( i < 0 )
i = _dtl.fieldToValidate.length - 1;
else if ( i >= _dtl.fieldToValidate.length )
i = 0;
v = _dtl.fieldToValidate[i];
if ( v.error ) {
if ( v.id != active_element.id )
e = document.getElementById(v.id);
break;
}
}
}
break;
}
}
}
break;
case ENTER:
if ( active_element.type == "checkbox" ) {
active_element.checked = ! active_element.checked;
detailSetCbxFlag(active_element);
return false;
}
if ( typeof active_element.onblur != "undefined" &&
active_element.onblur != null &&
( active_element.type == "select-one" ||
active_element.type == "text" ) ) {
active_element.onblur();
return false;
}
if ( shiftkey )
return false;
break;
}
}
if ( shiftkey ) {
switch ( keycode ) {
case HOME:
if ( typeof active_element.type == "string" &&
( active_element.type == "text" ||
active_element.type == "textarea" ) )
break;
case PAGE_UP:
detailTabOff(1);
return false;
case END:
if ( typeof active_element.type == "string" &&
( active_element.type == "text" ||
active_element.type == "textarea" ) )
break;
case PAGE_DOWN:
detailTabOff(-1);
return false;
}
}
if ( e != null ) {
detailSetFocus(e);
return false;
}
}
return true;
}
function detailTabOff(direction)
{
if ( typeof direction != "number" ) {
if ( ( ! _browser.isIE ) ||
window.event == null )
direction = 1;
else
direction = ( window.event.shiftKey ? -1 : 1 );
}
var e, startRow, startCol, endRow, endCol;
if ( direction == 1 ) {
startRow = 0;
startCol = 0;
endRow = _dtl.rowNum;
endCol = _dtl.maxCol;
}
else {
startRow = _dtl.rowNum - 1;
startCol = _dtl.maxCol - 1;
endRow = -1;
endCol = -1;
}
for ( var row = startRow; row != endRow; row += direction ) {
for ( var col = startCol; col != endCol; col += direction ) {
e = document.getElementById("df_" + row + "_" + col);
if ( e != null && 
(e.tagName.toUpperCase() == 'INPUT' || 
e.tagName.toUpperCase() == 'SELECT' || 
e.tagName.toUpperCase() == 'TEXTAREA' ||
e.tagName.toUpperCase() == 'RADIO') && 
(e.readOnly != true && e.disabled != true) 
)
{
var p = e.parentNode;
while ((p != null) && (p != document) && (p.style.display != "none")) {
p = p.parentNode;
}
if (p == document) { 
if ( typeof ahdframeset.workframe != "object" ||
typeof ahdframeset.workframe.SkipInitialFocus == "undefined" ||
ahdframeset.workframe.SkipInitialFocus != "1") {
setTimeout("try { document.getElementById('" + e.id +
"').focus(); } catch(e) {}",0);
}
return true;
}
}
}
}
var evt = window.event;
/*
var outstr = " info: ";
if ( evt.srcElement && typeof evt.srcElement.name != "undefined") {
outstr = "name = ";
outstr += evt.srcElement.name;
}
if ( evt.srcElement && typeof evt.srcElement.id != "undefined" ) {
outstr += " id = ";
outstr += evt.srcElement.id;
}
*/
if (evt != null )
{
if ( evt.srcElement.name == "end" && ! evt.altKey ) {
e = document.getElementById("start");
if ( typeof e != "undefined" ) {
e.focus();
}
}
}
return true;
}
function detailSetFocus(e)
{
if ( typeof e == "object" &&
e != null ) {
for ( var p = e.parentNode; p != null; p = p.parentNode ) {
if ( p.tagName == "DIV" && p.id.match(/nbtab_(\d+)/) ) {
if((accordion_control_used)&&(!ahdtop.cstUsingScreenReader))
{
var ids = p.id.match(/nbtab_(\d+)_(\d+)/);
var selected = get_tab_id_for_accrn_tab((RegExp.$1-1), (RegExp.$2-1));
show_accordion_tab(selected,false);
prevTabSelected = cur_selected;
cur_selected = selected;
}
else
{
var n = RegExp.$1 - 0;
show_tab_src(n,false);
break;
}
}
}
if ( typeof ahdframeset.workframe != "object" ||
typeof ahdframeset.workframe.SkipInitialFocus == "undefined" ||
ahdframeset.workframe.SkipInitialFocus != "1") {
if( !ahdtop.cstUsingScreenReader )
{
setTimeout("try { document.getElementById('" + e.id +
"').focus(); } catch(e) {}",0);
}
else
{
setTimeout("try { document.getElementById('" + e.id +"').focus(); document.getElementById('" + e.id +"').select(); } catch(ex) {}", 25);
}
}
return;
}
if ( (typeof ahdframeset.workframe != "object" ||
typeof ahdframeset.workframe.SkipInitialFocus == "undefined" ||
ahdframeset.workframe.SkipInitialFocus != "1") &&
typeof detailFocus1st != "undefined") {
detailFocus1st();
}
}
function detailNoProperties(factory)
{
detailEndRow();
if ( typeof factory != "string" || factory.length == 0 )
factory = _dtl.factory;
var catg;
if ( factory != "cr" )
catg = msgtext("category");
else
catg = msgtext("Incident/Problem/Request_Area");
var row_id = get_exp_row_id("");
if (row_id != "") row_id = " ID='" + row_id + "' ";
var out = "<TR" + row_id + "><TD COLSPAN=3 ALIGN=CENTER CLASS=labeltext>" +
msgtext("No_properties_are_defined_for_", catg) +
"</TD></TR>";
docWriteln(out);
_dtl.propertyRow = _dtl.rowNum;
_dtl.propertyTabFirstIndex = _dtl.tabIndex;
_dtl.propertyTabIndex = _dtl.tabIndex;
}
function detailSetPcbFlag( element )
{
if ( element.name.match(/PCB\.([\.\w]*)/ ) ) {
var f = document.main_form["SET.prop" + RegExp.$1];
if (f == null)
{
f = document.getElementById("SET.prop" + RegExp.$1); 
}
if ( f != null )
{
f.value = ( element.checked ? "Yes" : "No" );
}
}
}
function detailWriteProperty(propNum,required,label,value,sample,type,options,isCalendar,isTime,isSection,isTextArea,InputWidth)
{
	var attr_name = "prop" + propNum;
	
	if ( typeof _dtl.propertyRow == "undefined" ) {
		_dtl.propertyRow = _dtl.rowNum;
		_dtl.propertyTabFirstIndex = _dtl.tabIndex;
		_dtl.propertyTabIndex = _dtl.tabIndex;
	}
	
	if ( ! _dtl.edit ) {
		if(isSection == "1") {
			var rowData = '<table id="PropSection_' + propNum + '" cellspacing="0" class="dtl_page_hdr_container" style="cursor: default;"><tbody><tr><td style="width:4px;height:22px;" class="page_section_header_left dtl_page_hdr_container" style="cursor: default;"><img src="/CAisd/img/spacer.png" style="width:4px;height:22px" alt=""></td><td class="page_section_header_center dtl_page_hdr_container" style="cursor: default;"><span class="page_section_header_text_hs" style="display:block; cursor: default;">' + label + '</span></td><td style="width:4px;height:22px" class="page_section_header_right dtl_page_hdr_container"  style="cursor: default;"><img src="/CAisd/img/spacer.png" style="width:4px;height:22px" alt=""></td></tr></tbody></table>';

			detailSetRowData(rowData);
			//_dtl.lastHdrtext = label;
			//detailSetReadonlyRowData(attr_name, value);
		} else {
			detailSetRowData(label);
			_dtl.lastHdrtext = label;
			detailSetReadonlyRowData(attr_name, value);
		}
	} 
	else 
	{
		var checked = "";
		
		if ( typeof type != "string" )
		{
			type = "TEXT";
		} 
		else
		{
			if ( type == "CHECKBOX" )
			{
				if ( value == "" || value == null)
				{
					value = "No";
				} 
				else if ( value.toLowerCase() == "yes" ) 
				{
					checked = " checked='checked'";
				}
			}
		}
		
		var hdrtext = label;
		
		if ( required != "1" )
			_dtl.colSpan[_dtl.colNum] = " CLASS=" + _dtl.hdrclass;
		else 
		{
			hdrtext += ahdtop.cfgIndRequired;
			_dtl.colSpan[_dtl.colNum] = " CLASS=" + _dtl.reqhdrclass;
		}
		
		if(isSection != "1")
			_dtl.rowData[_dtl.colNum++] = hdrtext;

		_dtl.tabIndex = _dtl.propertyTabIndex;
		var rowData;
		
		if ( typeof type == "string" && type == "SELECT" )
		{
			var option_data = options.split("@,@");
			var i;
			rowData = "<select " + detailNextID(1,false,attr_name) +
				" title=\"" + hdrtext + "\"" +
				" name=SET.prop" + propNum + ".value>";
			rowData += '<option value="">&lt;' + msgtext("empty") + '&gt;' + '</option>';
			
			for ( i = 1; i < option_data.length; i += 2 )
			{
				rowData += "<option value='" + option_data[i] + "'";
				
				if ( option_data[i-1] == "1" && ( value == "" || value == null ) && (required != "1"))
				{
					rowData += "selected ";
				} 
				else if ( option_data[i] == value ) 
				{
					rowData += "selected ";
				}
				
				rowData += ">"+option_data[i]+"</option>";
			}
			
			rowData += "</select>";
		} 
		else if ( typeof type == "string" && type == "CHECKBOX" )
		{
			rowData = "<INPUT TYPE=hidden NAME=SET.prop" + propNum + ".value " +
				"size=50 " +
				"value=\"" + value.replace(rxQuote,"&quot;") + "\">\n" +
				"<input" + detailNextID(1,false,attr_name) + " TYPE='" + type + "'" +
				" title=\"" + hdrtext + '"' +
				checked + " name=PCB." + propNum + ".value " +
				"value=\"" + value.replace(rxQuote,"&quot;") +
				"\" onClick=\"detailSetPcbFlag(this)\"" + ">";
		} 
		else
		{
			var ControlWidth = "50";

			// 20131003 bmalz @ e-xim
			if(isCalendar == '1') {
				var hasTime = "";
				
				if (isTime == 0) {
					hasTime = ",'no'";
				}
				
				rowData = "<table style='border: 0px; border-spacing: 0px;'><TBODY><tr><td>";
				rowData += "<input" + detailNextID(1,false,attr_name) + " TYPE='" + type + "'" +	" title=\"" + hdrtext + '"' + checked + " name=SET.prop" + propNum + ".value " + "size=50 " + "value=\"" + value.replace(rxQuote,"&quot;") + "\">";
				rowData += "</td><td>";
				rowData += "<a href=\"javascript:popup_date_helper('main_form','SET.prop" + propNum + ".value'" + hasTime + ");\">";
				rowData += "<img style='border: 0px;' src='/CAisd/sitemods/img/calendar.png'></a>";
				rowData += "</td></tr></TBODY></table>";
			} else if(isTextArea == "1") {
				ControlWidth = "80";
				if(InputWidth != "")
					ControlWidth = InputWidth;

				rowData = "<textarea" + detailNextID(1,false,attr_name) + " title=\"" + hdrtext + '"' + checked + " name=SET.prop" + propNum + ".value " + "cols=" + ControlWidth + " rows=4>" + value.replace(rxQuote,"&quot;") + "</textarea>";
			} else if(isSection == "1") {
				rowData = '<table id="PropSection_' + propNum + '" cellspacing="0" class="dtl_page_hdr_container" style="cursor: default;"><tbody><tr><td style="width:4px;height:22px;" class="page_section_header_left dtl_page_hdr_container" style="cursor: default;"><img src="/CAisd/img/spacer.png" style="width:4px;height:22px" alt=""></td><td class="page_section_header_center dtl_page_hdr_container" style="cursor: default;"><span class="page_section_header_text_hs" style="display:block; cursor: default;">' + label + '</span></td><td style="width:4px;height:22px" class="page_section_header_right dtl_page_hdr_container"  style="cursor: default;"><img src="/CAisd/img/spacer.png" style="width:4px;height:22px" alt=""></td></tr></tbody></table>';
			} else {
				var ControlWidth = "50";
				if(InputWidth != "")
					ControlWidth = InputWidth;

				rowData = "<input" + detailNextID(1,false,attr_name) + " TYPE='" + type + "'" +	" title=\"" + hdrtext + '"' + checked + " name=SET.prop" + propNum + ".value " + "size=" + ControlWidth + " " + "value=\"" + value.replace(rxQuote,"&quot;") + "\">";
			}
		}
		
		_dtl.colSpan[_dtl.colNum] = "";
		detailSetRowData(rowData);
		detailSetValidate( msgtext("Property_%1",label), required, 4000, "", true );
		_dtl.propertyTabIndex = _dtl.tabIndex;
	}
	
	_dtl.colSpan[_dtl.colNum] = "";
	_dtl.lastHdrtext = msgtext("%1_example",label);
	detailSetReadonlyRowData(attr_name + "_sample", sample, void(0), _dtl.currID + "_sample");
	_dtl.rowData[_dtl.colNum-1] += "</td></tr><tr>";
}
function detailMergeProperties( srcDtl )
{
var tgt = document.getElementById("propertyDiv");
if ( tgt == null ||
typeof _dtl.propertyRow != "number" ||
typeof srcDtl.propertyRow != "number" ||
srcDtl.factory != "defer" )
return;
var i, j;
var currPropCnt = 0;
var propIndex = 0;
var currValCnt = _dtl.fieldToValidate.length;
var propErrorFound = false;
for ( i = currValCnt - 1; i >= 0; i-- ) {
var v = _dtl.fieldToValidate[i];
if ( v.id.match(/df_(\d+)_\d+/) ) {
row = RegExp.$1 - 0;
if ( row == _dtl.propertyRow ) {
currPropCnt++
if ( v.error )
propErrorFound = true;
}
else if ( row < _dtl.propertyRow ) {
propIndex = i + 1;
break;
}
}
}
if ( propErrorFound )
detailValidate();
tgt.innerHTML = srcDtl.getHTMLText();
resetHTMLTextHold();
var newPropCnt = srcDtl.fieldToValidate.length;
if ( newPropCnt < currPropCnt ) {
for ( i = propIndex + newPropCnt, j = propIndex + currPropCnt;
j < currValCnt;
i++, j++ ) 
_dtl.fieldToValidate[i] = _dtl.fieldToValidate[j];
_dtl.fieldToValidate.length = currValCnt + newPropCnt - currPropCnt;
}
else if ( newPropCnt > currPropCnt ) {
for ( i = currValCnt + newPropCnt - currPropCnt - 1, j = currValCnt - 1;
i >= propIndex + newPropCnt;
i--, j-- )
_dtl.fieldToValidate[i] = _dtl.fieldToValidate[j];
}
for ( i = propIndex, j = 0; j < newPropCnt; i++, j++ )
_dtl.fieldToValidate[i] = srcDtl.fieldToValidate[j];
if ( typeof notebook_set_first_property == "function" )
notebook_set_first_property( tgt, srcDtl.firstField );

var frm = "";
if ( !parent.cai_main )
{
	frm = parent.ahdframe;
}
else { frm = parent.cai_main; }
if (typeof frm.exim_UpdateCategoryEvent == "function") {
	frm.exim_UpdateCategoryEvent();
}

}
function detailWritePropertyDropdownValues(value,options)
{
var hdrtext="Value";
if ( ! _dtl.edit ) {
detailRowHdr(hdrtext);
detailSetReadonlyRowData("",value);
}
else {
var rowData;
var option_data = options.split("@,@");
var i;
rowData = "<select " + detailNextID() +
" title=\"" + hdrtext + "\"" + 
" name=SET.selected_value>";
for ( i = 1; i < option_data.length; i += 2 )
{
rowData += "<option value='" + option_data[i] + "'";
if ( option_data[i-1] == value )
rowData += "selected ";
rowData += ">"+option_data[i]+"</option>";
}
rowData += "</select>";
detailSetRowData(rowData);
}
detailWriteRow();
}
function createValidateObject(fld_id, hdrtext, maxsize, is_required,
emsg, is_prop)
{
var v = new Object();
v.id = fld_id;
v.hdrtext = hdrtext;
v.maxsize = maxsize;
v.is_required = is_required;
v.serverFoundError = ( emsg.length > 0 );
v.error = false;
v.extError = false;
v.browserFoundError = false;
v.is_property = ( typeof is_prop == "boolean" && is_prop );
v.serverErrorText = emsg;
return v;
}
function detailSetValidate( hdrtext, is_required, maxsize, emsg, is_prop )
{
if ( typeof is_required == "string" )
is_required = parseInt(is_required,10);
if ( typeof maxsize == "undefined" )
maxsize = 0;
else if ( typeof maxsize == "string" )
maxsize = parseInt(maxsize,10);
if ( typeof emsg != "string" )
emsg = "";
if (typeof _dtl.attrReqArray[_dtl.currAttrName] != "undefined" && 
_dtl.attrReqArray[_dtl.currAttrName].fld_id == "")
{
_dtl.attrReqArray[_dtl.currAttrName].fld_id = _dtl.currID;
_dtl.attrReqArray[_dtl.currAttrName].stay_req = is_required;
_dtl.currAttrName = "";	
} 
if ( is_required || maxsize > 0 || emsg.length > 0 ) {
for(var i=0;i<_dtl.fieldToValidate.length;i++)
if(_dtl.currID == _dtl.fieldToValidate[i].id)
return void(0);
var v = createValidateObject(_dtl.currID, hdrtext, 
maxsize, is_required,
emsg, is_prop);
_dtl.fieldToValidate[_dtl.fieldToValidate.length] = v;
if ( v.serverFoundError )
_dtl.serverErrorCount++;
return v;
}
return void(0);
}
function detailOK2Edit(attr_name, hdrtext)
{
if ( _dtl.edit ) {
if ( typeof _dtl.editAttrs[attr_name] == "undefined" || attr_name=="") { 
if ( typeof hdrtext != "string" || hdrtext.length == 0 )
hdrtext = attr_name;
_dtl.editAttrs[attr_name] = hdrtext;
if ("nr" == propFactory && typeof ufam_restricted == "number" && 1 == ufam_restricted) {
var ahdtop = get_ahdtop();
if (typeof ahdtop == "object") {
if (ahdtop.cfgUfamAttributes.indexOf(" " + attr_name + " ") >= 0) {
return false;
}
}
}
_dtl.currAttrName = attr_name;
return true;
}
showAlertMsg( msgtext("Attribute_%1_with_caption_\_%2", attr_name, hdrtext,
_dtl.editAttrs[attr_name] ) );
}
return false;
}
function SaveAndClose()
{
var f = _dtl.form[0];
if(typeof f.HTMPL != "object" ) 
{
if(!_browser.isIE){
var htmpl = document.createElement("input");
htmpl.name = "HTMPL"; 
}else{
var htmpl=document.createElement('<input name="HTMPL"/>');
}
htmpl.type = "hidden";
htmpl.value = htmpl.value = "show_main_detail.htmpl";;
f.appendChild(htmpl);
}
else
{
f.HTMPL.value = "show_main_detail.htmpl";
}
}
function service_contract_check()
{
if (typeof propFactory == "string" && 
(propFactory == "cr" || propFactory == "chg" || 
propFactory == "iss"))
{
var cnt_obj = null;
if (propFactory == "cr")
cnt_obj = document.main_form["SET.customer"];
else 
if (propFactory == "chg")
cnt_obj = document.main_form["SET.affected_contact"];
else 
if (propFactory == "iss")
cnt_obj = document.main_form["SET.requestor"];
if (typeof cnt_obj == "object" && cnt_obj != null && 
typeof get_svc_callback != "undefined")
{
var service_cst = cnt_obj.value;
if (typeof service_cst == "string" && service_cst.length > 0)
{
var url = cfgCgi+ "?SID="+cfgSID+ "+FID="+fid_generator()+
"+OP=GET_SVC_CONTRACT" +
"+new_customer=cnt:" + service_cst +
"+func=get_svc_callback";	
var reply = SyncAjaxCall(url);
var sindex = reply.indexOf("<SCRIPT>");
var eindex = reply.indexOf("</SCRIPT>");
if ( sindex != -1 && eindex != -1 ) {
var _script = reply.substring(sindex+8,eindex);
return eval(_script);
}
}	
}	
}
return true;
}
function detailSave(op)
{
if( typeof CheckCancel != "undefined" && CheckCancel == 0)
CheckCancel = 1;
if ( (ahdframe.currentAction == ACTN_LOADPROP ||
ahdframe.currentAction == ACTN_CHK_ASSIGNEE) &&
typeof ahdframe.resumeAction == "undefined" ) {
if ( typeof op == "string" && op.length > 0 )
ahdframe.resumeAction = "detailSave('" + op + "')";
else
ahdframe.resumeAction = "detailSave()";
return;
}
if (typeof ahdtop == "object" && ahdtop != null)
{
if (typeof ahdtop.AHD_Windows == "object" && ahdtop.AHD_Windows != null)
{
var i, ahdwin;
var window_name = new Array();
for ( var registered_name in ahdtop.AHD_Windows ) {
if (registered_name.match(/^spell_form/))
window_name[window_name.length] = registered_name;
}
for ( i = window_name.length - 1; i >=0; i-- ) {
ahdwin = ahdtop.AHD_Windows[window_name[i]];
try
{
if (typeof ahdwin == "object" && ahdwin != null &&
typeof ahdwin.opener == "object" && ahdwin.opener != null &&
typeof ahdwin.opener.ahdframeset == "object" && ahdwin.opener.ahdframeset != null &&
window.ahdframeset == ahdwin.opener.ahdframeset &&
window == ahdwin.opener)
{
ahdwin.alert(msgtext("Cannot_proceed_until_spell_check"));
return;
}
}
catch(e) {}
}
}
}
if (typeof check_manual_change == "function" )
{
var nextAction = "";
if ( typeof op == "string" && op.length > 0 )
nextAction = "detailSave('" + op + "')";
else
nextAction = "detailSave()";
if ( ! check_manual_change(nextAction) )
{
ahdframe.resumeAction = nextAction;
return;
}
}
if ( typeof preSaveTrigger == "function" )
if ( ! preSaveTrigger() )
return;
if (ahdtop.cfgUserType == "analyst" && !service_contract_check())
return;
e = document.getElementById("alertmsgText");
if ( e != null )
e.innerHTML = "";
var firstBadField = detailValidate();
var f = document.main_form;
if ( _dtl.errorCount > _dtl.serverErrorCount )
detailSetFocus(firstBadField);
else {
if (typeof propRoleMenubar == "string" &&
propRoleMenubar.length > 0)
{
var role_mb = document.createElement("input");
role_mb.name = "prop.role_menubar";
role_mb.value = propRoleMenubar;
f.appendChild(role_mb);
}
if ( _dtl.secondary ) {
if ( propFormName2 == propFactory ) {
if ( typeof f.HTMPL != "object" ) {
ahdframeset.top_splash.next_persid = argPersistentID;
var htmpl = document.createElement("input");
htmpl.name = "HTMPL";
htmpl.value = "show_main_detail.htmpl";
f.appendChild(htmpl);
}
}
}
else {
var edit_windows = getEditWindows(argPersistentID);
for ( var i = 0; i < edit_windows.length; i++ ) {
var w = edit_windows[i];
if ( typeof w._dtl == "object" ) {
firstBadField = w.detailValidate();
if ( w._dtl.errorCount > w._dtl.serverErrorCount ) {
w.detailSetFocus(firstBadField);
return;
}
else
{
if (w != window)
w.pdm_submit("main_form","UPDATE",void(0),true);
}
}
}
}
if ( _dtl.backfillReq ) {
if (typeof set_extra_backfill_vals != "undefined")
{
set_extra_backfill_vals();
}	
if ( typeof f.HTMPL != "object" ) {
ahdframeset.top_splash.next_persid = "backfill";
var htmpl = document.createElement("input");
htmpl.type = "hidden";
htmpl.name = "HTMPL";
htmpl.value = "show_main_detail.htmpl";
f.appendChild(htmpl);
var arr = argPersistentID.split(":");
var is_contact = arr[0] == "agt" ||
arr[0] == "cnt" ||
arr[0] == "cst" ||
arr[0] == "agtgrp"||
arr[0] == "grp";
if (is_contact)
{
var is_cnt = document.createElement("input");
is_cnt.type = "hidden";
is_cnt.name = "KEEP.is_contact";
is_cnt.value = "1";
f.appendChild(is_cnt);
}
}
}
try {
if ( typeof top.opener.autoRefreshWindows == "object" )
top.opener.autoRefreshWindows[parent.window.name] = true;
}
catch(e) {}
if ( typeof alg_factory == "string" &&
_dtl.factory != alg_factory ) {
ahdtop.saveAckMsgNum = 920;
ahdtop.saveAckMsgFactoryName = msgtext("Activity_Log");
ahdtop.saveAckMsgObjectName = "";
}
else {
if ( _dtl.id == 0 )
ahdtop.saveAckMsgNum = 920;
else
ahdtop.saveAckMsgNum = 921;
ahdtop.saveAckMsgFactoryName = factoryDisplayName;
if ( argCommonNameAttr == "id" ||
argCommonNameAttr == "description" ||
argCommonNameAttr == "text" ||
argCommonNameAttr == "COMMENT_TEXT" ||
argCommonNameAttr == "constraint_majic" )
ahdtop.saveAckMsgObjectName = "";
else {
e = f.elements["SET." + argCommonNameAttr];
if ( typeof e == "object" && e != null && e.type == "text" )
saveAckMsgObjectName = e.value;
else {
e = f.elements["KEY." + argCommonNameAttr];
if ( typeof e == "object" && e != null && e.type == "text" )
saveAckMsgObjectName = e.value;
}
ahdtop.saveAckMsgObjectName = saveAckMsgObjectName;
}
}
if ( typeof op == "string" && op.length > 0 )
pdm_submit('main_form',op,void(0),true);
else
pdm_submit('main_form','UPDATE',void(0),true);
}
}
function detailCancel()
{
if(typeof updCnt == "number" && updCnt > 0)
{
var msg = msgtext("Cancel_pending_updates", updCnt); 
if(! confirm(msg) ){
return;
}
if( typeof argPersistentID!="undefined" &&
typeof argPersistentID == "string" && 
typeof ahdtop == "object" &&
typeof ahdtop.detailForms == "object" ){
var ahdwin = ahdtop.detailForms[argPersistentID]; 
var cancelled_msg = msgtext("Cancelled_updates", updCnt);
if( typeof ahdwin == "object" &&
typeof ahdwin.ahdframeset == "object" &&
typeof ahdwin.ahdframeset.ahdframe == "object" ){	
var e = ahdwin.ahdframeset.ahdframe.document.getElementById("alertmsgText");
if( e != null )
e.innerHTML = cancelled_msg;
}	
else if( typeof ahdtop.ahdframeset == "object" &&
typeof ahdtop.ahdframeset.ahdframe == "object" ){	
var e = ahdtop.ahdframeset.ahdframe.document.getElementById("alertmsgText");
if( e != null )
e.innerHTML = cancelled_msg;
}	
}
}
if ( ahdframe.currentAction == ACTN_LOADPROP &&
typeof ahdframe.resumeAction == "undefined" ) {
ahdframe.resumeAction = "detailCancel()";
return;
}
if ( typeof preCancelTrigger == "function" )
if ( ! preCancelTrigger() )
return;
detailResetSyncFields()
if (( typeof _dtl == "object") && ( _dtl.secondary )) {
if ( propFormName2 == propFactory ) {
ahdframeset.top_splash.next_persid = argPersistentID;
_dtl.next_persid = "show_main_detail.htmpl";
}
}
else {
if( typeof argPersistentID!="undefined" ){
var edit_windows = getEditWindows(argPersistentID);
for ( var i = 0; i < edit_windows.length; i++ ) {
var w = edit_windows[i];
if ( w.ahdframeset != ahdtop ) {
w.ImgBtnDisableButton("btncncl");
w.parent.close();
}
}
}
}
if ( typeof _dtl == "object")
{
cancel_update(_dtl.factory, _dtl.id, _dtl.next_persid, void(0), true );
}
}
function detailEdit()
{
if ( ! action_in_progress() &&
all_child_edit_windows_closed( window, "Edit" ) ) {
set_action_in_progress(ACTN_LOADFORM);
var url = cfgCgi;
var dlm = "?";
var f = document.main_form;
var element_count = f.elements.length;
for ( var i = 0; i < element_count; i++ ) {
var e = f.elements[i];
url += dlm + e.name + "=" + nx_escape(e.value);
dlm = "+";
}
replace_page( url );
}
}
function detailReportValidation( field, has_error, emsg )
{
var badField = null;
if ( typeof _dtl == "object" && _dtl != null )
{
for ( var i = 0; i < _dtl.fieldToValidate.length; i++ ) {
var v = _dtl.fieldToValidate[i];
if ( v.id == field.id ) {
if ( has_error ) {
v.extError = true;
v.extErrorMsg = emsg;
badField = detailValidate();
}
else if ( v.extError ) {
v.extError = false;
badField = detailValidate();
}
return badField;
}
}
}
if ( has_error )
alert(emsg);
return badField;
}
function detailReset()
{
for ( var i = 0; i < _dtl.fieldToValidate.length; i++ ) {
var v = _dtl.fieldToValidate[i];
v.extError = false;
}
if (_dtl.edit) 
clearErrorMsgs();
try
{
if ( typeof _dtl.firstField == "object" ) {
_dtl.firstField.focus();
_dtl.firstFieldFocused = 1;
}
}
catch(e)
{
}
detailResetSyncFields();
detailResetTenant();
if (propFactory == "USP_PREFERENCES")
{
if ( typeof window_onload == "function")
{
window_onload();
}
}
}
function detailResetTenant()
{
var tenantField, tenantForm=document.tenant_form;
if( typeof tenantForm == "object" && tenantForm != null)
{
tenantForm.reset();
if(_dtl.tenantFieldEditable)
{
tenantField=tenantForm.elements["SET.tenant"];
if(tenantField == null)
tenantField=tenantForm.elements["KEY.tenant"];
if(tenantField != null)
{
argTenant=_dtl.tenantFieldValue;
argTenantId=_dtl.tenantFieldId;
if(tenantField.type == "select-one")
{
for(var i =0; i<tenantField.length; i++)
tenantField.remove(i); 
for ( var i= 0; i<_dtl.tenantDropdownArray.length; i++)
{
if(_dtl.tenantFieldValue== _dtl.tenantDropdownArray[i].tenantValue)
tenantField.options[i]=new Option(_dtl.tenantDropdownArray[i].tenantValue,
_dtl.tenantDropdownArray[i].tenantId, false, true);
else
tenantField.options[i]=new Option(_dtl.tenantDropdownArray[i].tenantValue,
_dtl.tenantDropdownArray[i].tenantId, false, false);
}
}
else
{
var set_field = document.main_form.elements["SET.tenant"];
if( typeof set_field == "object" && set_field != null)
set_field.value=_dtl.tenantFieldId;
tenantField.value = _dtl.tenantFieldValue;
}
}
}
}
}
function detailResetPropertyValidate()
{
if (_dtl.fieldToValidate.length > 0){
for (var i = 0; i < _dtl.fieldToValidate.length; i++)
{
var v = _dtl.fieldToValidate[i];
if ( v.is_property && v.is_required ){
v.is_required = 0;
_dtl.fieldToValidate[i] = v;
}
}
}
}
function detailValidate(display_alertmsg, popup_alertmsg)
{
if ((typeof display_alertmsg != "undefined") && (display_alertmsg == 2))
display_alertmsg = 1;
else 
if (typeof AlertMsg == "string")
AlertMsg = "";
if (typeof display_alertmsg == "undefined")
display_alertmsg = 0;
_dtl.errorCount = 0;
_dtl.serverErrorCount = 0;
var e, v, firstBadField;
var alertmsg = document.getElementById("alertmsg");
var msg = AlertMsg;
AlertMsg = "";
if ( _dtl.fieldToValidate.length > 0 ) {
for ( var i = 0; i < _dtl.fieldToValidate.length; i++ ) {
v = _dtl.fieldToValidate[i];
e = document.getElementById(v.id);
if ( typeof skip_field_validation == "function")
{
if (skip_field_validation(e.name)) continue;
}
var newmsg = "";
v.error = false;
if ( e != null ) {
e.className = "";
var val = "";
if (e.type == "select-multiple")
{
for (var j = 0; j < e.length; j++)
{
var e_val = e.options[j].value;
if (e_val.length > 0)
{
val = e_val;
break;
}
}
}
else if ( e.type != "select-one" )
val = e.value;
else if ( e.selectedIndex != -1 )
val = e.options[e.selectedIndex].value;
if ( v.is_required && 
val.match(/^\s*$/) )
newmsg = msgtext_with_pfx("%1_is_required", v.hdrtext );
else if ( v.maxsize > 0 && 
v.maxsize < val.length )
newmsg = msgtext_with_pfx("%1_contains_%2_characters,_but", 
v.hdrtext, val.length, 
v.maxsize );
else if ( v.serverFoundError ) {
_dtl.serverErrorCount++;
newmsg = v.serverErrorText;
}
if ( v.extError ) {
if ( newmsg.length > 0 )
newmsg += "<BR>";
newmsg += v.hdrtext + ": " + v.extErrorMsg;
}
if ( newmsg.length > 0 || v.serverFoundError ) {
// 20131030 bmalz @ e-xim
if(typeof IsHidden != "undefined") {
	if (IsHidden) {
		if (typeof ShowFrameOnError == "function") {
			ShowFrameOnError();
		}
	}
}
e.className = "errorField";
v.error = true;
v.browserFoundError = true;
_dtl.errorCount++;
if ( typeof firstBadField != "object" )
firstBadField = e;
if ( msg.length == 0 )
msg = newmsg;
else
msg += "<BR>" + newmsg;
}
}
}
}
if ( _dtl.errorCount == 0 && ! display_alertmsg ) {
if ( alertmsg != null ) {
alertmsg.style.display = "none";
adjScrollDivHeight();
}
}
else
showAlertMsg(msg, popup_alertmsg);
if ( typeof reshow_curr_tab != "undefined" )
reshow_curr_tab();
return firstBadField;
}
function fAlertBannerContentChanged(curr, proj)
{
var delim = "~";
var a = (typeof curr == "string" && curr.length>0) ? curr.replace(/\<br\>/i, delim).replace(/\<hr\>/i, delim).split(delim) : new Array();
var b = (typeof proj == "string" && proj.length>0) ? proj.replace(/\<br\>/i, delim).replace(/\<hr\>/i, delim).split(delim) : new Array();
if (a.length != b.length)
return true;
var matches = 0;
var i, j;
for (i=0; i<a.length; i++)
{
if (a[i].length > 0)
{
for (j=0; j<b.length; j++)
{
if (b[j].length > 0 && a[i] == b[j])
{
matches++;
b[j] = "";
break;
}
}
}
}
if (matches != a.length)
return true;
return false;
}
function showAlertMsg(msg, popup_alertmsg)
{
e = document.getElementById("alertmsgText");
if ( e == null )
return;
if ( typeof msg == "string")
{
if (msg.length > 0 ) 
{
if ( typeof AlertMsg != "string" )
AlertMsg = "";
if ( AlertMsg.length > 0 )
AlertMsg += "<BR>" + msg;
else
AlertMsg = msg;
}
else
{
AlertMsg = "";
}
}
if (fAlertBannerContentChanged(e.innerHTML, get_alert_banner(AlertMsg))) 
{
e.innerHTML = get_alert_banner(AlertMsg);
if ( ( ahdtop.cstUsingScreenReader ||
!(ahdtop.cfgUserType == "analyst" || ahdtop.cfgUserType == "employee") ) &&
( typeof popup_alertmsg != "boolean" || popup_alertmsg ) ) {
var alrtmsg = get_alert_banner(AlertMsg);
var popupMsg = alrtmsg.replace(RegExp("<BR>","gi"),"\\n")
.replace(RegExp('\n',"g"), "\\n")
.replace(RegExp('"',"g"), '\\"');
window.setTimeout('alert("' + popupMsg + '")', 1);
}
}
var alertmsg = document.getElementById("alertmsg");
if ( alertmsg != null ) {
if (e.innerHTML.length > 0 &&
alertmsg.style.display != "block" ) {
alertmsg.style.display = "block";
adjScrollDivHeight();
}
if (e.innerHTML.length == 0) {
alertmsg.style.display = "none";
adjScrollDivHeight();
}
}
}
function call_event_handlers(e)
{
if ( typeof e.onchange != "undefined" &&
e.onchange != null )
e.onchange();
if ( typeof e.onblur != "undefined" &&
e.onblur != null )
e.onblur();
}
function detailSyncEditForms(srcElement, isGroup)
{
if ( ! _dtl.syncing &&
typeof srcElement == "object" &&
typeof srcElement.type == "string" &&
typeof argPersistentID == "string" &&
argPersistentID.length > 0 ) {
_dtl.syncing = true;
var saveCurrVal = false;
if ( typeof _dtl.fieldsToReset == "undefined" ) {
_dtl.fieldsToReset = new Object();
saveCurrVal = true;
}
else if ( typeof _dtl.fieldsToReset[srcElement.name] == "undefined" )
saveCurrVal = true;
var newValue;
if ( srcElement.type != "select-one" )
newValue = srcElement.value;
else if ( typeof srcElement == "object" && srcElement != null && srcElement.selectedIndex >= 0 ) {
newValue = srcElement.options[srcElement.selectedIndex].value;
}
else {
newValue = 0;
}
if ( srcElement.name.match(/^SET\.([^\.]+)$/) ||
srcElement.name.match(/^(.+)_combo_name$/) ) {
var attr_name = RegExp.$1;
if ( typeof top.opener == "object" &&
top.opener != null &&
typeof top.opener._dtl == "object" ) {
var attr_info = top.opener._dtl.lookupAttrs[attr_name];
if ( typeof attr_info == "object" ) {
attr_info["newValueWindow"] = window;
if ( srcElement.type != "select-one" )
attr_info["newValue"] = newValue;
else
attr_info["newValue"] =
srcElement.options[srcElement.selectedIndex].text;
}
}
}
var edit_windows = getEditWindows(argPersistentID);
for ( var i = 0; i < edit_windows.length; i++ ) {
var w = edit_windows[i];
var f = w.document.main_form;
if ( typeof f == "object" ) {
var tgtElement = f.elements[srcElement.name];
if ( typeof tgtElement == "object" && tgtElement != null ) {
if ( tgtElement.type != "select-one" ) {
if ( saveCurrVal ) {
_dtl.fieldsToReset[srcElement.name] = tgtElement.value;
saveCurrVal = false;
}
if ( newValue == tgtElement.value )
break;
tgtElement.value = newValue;
}
else {
if ( saveCurrVal ) {
_dtl.fieldsToReset[srcElement.name] =
tgtElement.options[tgtElement.selectedIndex].value;
saveCurrVal = false;
}
for ( var k = tgtElement.length - 1; k >= 0; k-- )
if ( tgtElement.options[k].value == newValue )
break;
if ( k < 0 || k == tgtElement.selectedIndex )
break;
tgtElement.selectedIndex = k;
}
if (typeof isGroup == "boolean" && isGroup &&
typeof w._dtl == "object" &&
typeof w._dtl.skip_agt_check == "boolean")
w._dtl.skip_agt_check = true;
call_event_handlers(tgtElement);
break;
}
}
}
_dtl.syncing = false;
}
}
function detailResetSyncFields()
{
if (( typeof _dtl == "object" ) &&( typeof _dtl.fieldsToReset == "object" )) {
for ( var name in _dtl.fieldsToReset ) {
var v = _dtl.fieldsToReset[name];
var e = document.main_form.elements[name];
if ( typeof e == "object" && e != null ) {
if ( e.type != "select-one" )
e.value = v;
else for ( var i = e.options.length - 1; i >= 0; i-- ) {
if ( e.options[i].value == v ) {
e.selectedIndex = i;
break;
}
}
detailSyncEditForms(e);
}
}
_dtl.fieldsToReset = void(0);
}
}
function detailHideElements(id, count, new_first_id)
{
count = 2 * count;
var e = document.getElementById(id);
var hiddenElements = new Array();
if ( e != null ) {
var td = e.parentNode;
var tr = td.parentNode;
var rows = tr.parentNode.childNodes;
var found = false;
for ( var i = 0; i < rows.length; i++ ) {
if ( tr == rows[i] ) {
for ( var col = 0; col < tr.childNodes.length; col++ ) {
if ( tr.childNodes[col] == td ) {
found = true;
break;
}
}
break;
}
}
if ( found ) {
for ( ; i >= 0; i-- ) {
if ( typeof rows[i].childNodes == "object" &&
rows[i].childNodes.length > col ) {
e = rows[i].childNodes[col];
hiddenElements[hiddenElements.length] = e;
e.style.display = "none";
if ( typeof _dtl.firstField != "object" ||
_dtl.firstField == null ||
typeof _dtl.firstField.parentNode != "object" ||
e == _dtl.firstField.parentNode )
if ( typeof new_first_id == "string" )
_dtl.firstField = document.getElementById(new_first_id);
count--;
if ( count <= 0 )
break;
}
}
}
}
adjScrollDivHeight();
return hiddenElements;
}
function backfill_cnt_event( form_name, base_name, lname, fname, mname,
cntID, caller_type )
{
detailCntBackfill( form_name, base_name, lname, fname, mname,
cntID, caller_type );
}
function detailCntBackfill( form_name, base_name, lname, fname, mname,
cntID, caller_type )
{
var f = void(0);
var r = form_name.match(/main_form([0-9]*)/);
if ( r != null ) {
if ( r[1].length == 0 )
f = _dtl.form[0];
else
f = _dtl.form[r[1]-0];
}
if ( typeof f == "object" && f != null ) {
var combo_name = f.elements[base_name + "_combo_name"];
if ( typeof combo_name != "object" || combo_name == null )
combo_name = f.elements[base_name];
if ( typeof combo_name == "object" || combo_name != null ) {
if ( _dtl.errorCount ) {
for ( var i = 0; i < _dtl.fieldToValidate.length; i++ ) {
var v = _dtl.fieldToValidate[i];
if ( v.id == combo_name.id ) {
if ( v.error && v.is_required )
detailValidate();
}
}
}
if(typeof _dtl.is_from_autoSuggest != "undefined" && _dtl.is_from_autoSuggest != false)
if ( typeof caller_type != "string" || caller_type != "autofill" )
{
try{combo_name.focus();} catch(err) {};
}
if ( typeof top.opener == "object" &&
top.opener != null &&
typeof top.opener._dtl == "object" ) {
var attr_info = top.opener._dtl.lookupAttrs[base_name];
if ( typeof attr_info == "object" ){
attr_info["newValue"] = combo_name.value;
attr_info["newCNTID"] = cntID;
}
}
}
}
}
function backfill_event( form, field_name, value,
persid, rel_attr_val, caller_type )
{
if((field_name == "KEY.category" && typeof _dtl == "object" && _dtl.is_from_autoSuggest == true))
{	
if(typeof _dtl == "object")
_dtl.is_from_autoSuggest = false;
}
if ( field_name == "keitCatBackfill" )
{
var caption_field = document.forms[form.name].elements[g_keitCatSelectID];
var arr = persid.split(":");
var id = arr[1];
var relational_id = rel_attr_val;
if ( typeof caption_field == "object" ) 
{
catOption = new Option(value, id, false, false);
caption_field.options[caption_field.options.length] = catOption;	
arrCatsText[arrCatsText.length] = value;
arrCatsValue[arrCatsValue.length]= id;
}
return;
}
var e = form.elements[field_name];
if ( caller_type != "autofill" && e.type != "hidden" ) {
_dtl.lastKeycode = 0;
try{e.focus();} catch(err) {};
}
if ( field_name == "SET.category" )
change_category_func(propFactory);
else if ( field_name == "KEY.category" ) {
e = form.elements["SET.category"];
if ( typeof e == "object" ) {
if ( e.type == "text" ||
e.type == "hidden" )
e.value = rel_attr_val;
else if ( e.type == "select-one" ) {
for ( var i = 0; i < e.length; i++ ) {
var o = e.options[i];
if ( o.value == value ) {
o.selected = 1;
break;
}
}
}
}
change_category_func(propFactory);
}
if(field_name=="KEY.lval" && propFactory=="atomic_cond")
{
if ( typeof set_action_in_progress == "function") 
set_action_in_progress(ACTN_COMPLETE);
refresh_atomic_cond_screen();
}
if (field_name == "KEY.PRIMARY_INDEX" || field_name == "KEY.KCAT")
{
var sAttrName = field_name.slice(4);
if (field_name == "KEY.PRIMARY_INDEX")
{
var iStartPos;
while(true)
{
iStartPos = value.indexOf(">");
if (iStartPos == -1)
{
break;
}
else
{
value = value.substring(iStartPos+1, value.length);
}
}
form.elements["KEY." + sAttrName].value=value;
}
form.elements["SET." + sAttrName].value=rel_attr_val;
}
if (	field_name == "KEY.DOC_TEMPLATE_ID" ){
if ( typeof template_onChange == "function" ){
template_onChange();
}
}
if ( field_name.match(/^.*\.(\w+)$/) &&
typeof top.opener == "object" &&
top.opener != null &&
typeof top.opener._dtl == "object" ) {
var attr_info = top.opener._dtl.lookupAttrs[RegExp.$1];
if ( typeof attr_info == "object" )
attr_info["newValue"] = value;
}
}
function detailSwitchToEsc(typefld)
{
if ( typeof typefld == "object" && typefld.value == "TR" ) {
typefld.value = "ESC";
var h1 = document.getElementsByTagName("h1");
for ( var i = 0; i < h1.length; i++ )
h1[i].innerHTML = escalate_title;
if ( typeof prioElements == "object" ) {
for ( i = 0; i < prioElements.length; i++ )
prioElements[i].style.display = "";
_dtl.firstField = document.getElementById(prio_id);
}
}
}
function detailAgtCheck(f, base_name, cntID, prop_ref, cb)
{
if (typeof prop_ref == "undefined")
prop_ref = "";
if ((base_name == "group" || base_name == "wf_ins_grp") && cntID != "" &&
typeof f == "object" && f != null &&
(typeof f.elements["SET.assignee"] == "object" || typeof f.elements["SET.wf_ins_agt"] == "object"))
{
if (typeof f.elements["SET.assignee"] == "object")
{
var agt_id = f.elements["SET.assignee"].value;
var agt_name = f.elements["KEY.assignee"].value;
}
else if (typeof f.elements["SET.wf_ins_agt"] == "object")
{
var agt_id = f.elements["SET.wf_ins_agt"].value;
var agt_name = f.elements["KEY.wf_ins_agt"].value;
} 
if (typeof cb == "undefined")
cb = "func=parent.ahdframe.clear_agt_callback";
var e;
try {
if ( cfgAccessTenantRestriction != "1" ) 
{
var twc_tenant = "TWC_TENANT=" + ( argGlobalTenant ? "n/a" : argTenantId );
var twc_persid = "TWC_PERSID=" + argPersistentID;
}
}
catch(e) {}
set_action_in_progress(ACTN_CHK_ASSIGNEE);
if ( typeof twc_persid == "string" && twc_persid != null ) 
{
upd_workframe("AGT_IN_GROUP", "agt_id=" + agt_id,
"agt_name=" + agt_name, "group_id=" + cntID,
cb,
"prop_ref=" + prop_ref,
twc_tenant, twc_persid);
}
else
{
upd_workframe("AGT_IN_GROUP", "agt_id=" + agt_id,
"agt_name=" + agt_name, "group_id=" + cntID,
cb,
"prop_ref=" + prop_ref);
}
}
}
function detailXferEscBackfill( base_name, lname, fname, mname,
cntID, caller_type )
{
var f = _dtl.form[0];
if ( typeof caller_type == "string" && caller_type == "backfill") {
var combo_name = f.elements[base_name + "_combo_name"];
if ( typeof combo_name == "object" && combo_name != null )
detailSyncEditForms(combo_name, (base_name == "group"));
}
detailAgtCheck(f, base_name, cntID);
if ( caller_type == "autofill" ) {
var e = document.main_form.elements[base_name + "_combo_name"];
if ( typeof e == "object" && e != null )
detailSyncEditForms(e);
}
}
function clear_agt_callback(bClear)
{
if ((ahdframeset.name == "AHDtop") &&
(ahdframeset.frames.length > 1))
next_workframe("UPD_WORKFRAME");
if (bClear && typeof document.main_form != "undefined")
{
var f = document.main_form;
if (typeof f == "object" && f != null)
{
if (typeof f.elements["SET.assignee"] == "object")	
{
var key_fld = f.elements["KEY.assignee"];
var set_fld = f.elements["SET.assignee"];
var combo_fld = f.elements["assignee_combo_name"];
}
if (typeof f.elements["SET.wf_ins_agt"] == "object")
{
var key_fld = f.elements["KEY.wf_ins_agt"];
var set_fld = f.elements["SET.wf_ins_agt"];
var combo_fld = f.elements["wf_ins_agt_combo_name"];	
}
}
if (typeof key_fld == "object")
key_fld.value = "";
if (typeof set_fld == "object")
set_fld.value = "";
if (typeof combo_fld == "object")
{
combo_fld.value = "";
call_event_handlers(combo_fld);
}
}
set_action_in_progress(ACTN_COMPLETE);
}
function detailExtUpdate(in_args) {
if (!_dtl.edit) {
if (typeof refreshForm != "undefined") {
refreshForm();
}
return;
}
if (typeof in_args == "undefined") return;
var key, val;
for (key in in_args) {
if (0 == key.indexOf("KEY.") || 0 == key.indexOf("SET.")) {
var overWrite = 0;
var attr = key.slice(4);
var owKey = "OW." + attr;
var owVal = in_args[owKey];
if ("string" == typeof owVal && "1" == owVal) {
overWrite = "1";
}
val = in_args[key];
if ("KEY.category" == key) {
setEditElements("SET.category", "", overWrite);
}
setEditElements( key, val, overWrite);
}
}
}
function setEditElements(elementName, val, overWrite)
{
var attrPrefix = "";
var plainAttrName = "";
var input_el = null;
if (!_dtl.edit) return 0;
if (typeof document.main_form == "undefined")
return -1;
if (0 == elementName.indexOf("KEY.") || 0 == elementName.indexOf("SET.")) {
attrPrefix = elementName.slice(0, 3);
plainAttrName = elementName.slice(4);
} else {
return -1;
}
input_el = document.main_form.elements[elementName];
if (typeof input_el != "object" || input_el == null) {
if ("KEY" == attrPrefix) {
input_el = document.main_form.elements["SET." + plainAttrName];
if (typeof input_el != "object" || input_el == null || input_el.type != "select-one")
{
return -1;
}
} else {
return -1;
}
}
if (1 != overWrite) {
var oldVal = "";
if ("select-one" == input_el.type) {
oldVal = input_el.options[input_el.selectedIndex].value;
} else {
oldVal = input_el.value;
}
if (typeof oldVal == "string" && oldVal.length > 0) {
return 0;
}
}
if (input_el.type == "select-one") {
for (var i = 0; i < input_el.options.length; i++) {
var candidate;
if ("KEY" == attrPrefix) {
candidate = input_el.options[i].text;
} else {
candidate = input_el.options[i].value;
}
if (candidate == val) {
input_el.selectedIndex = i;
break;
}
}
} else {
val = val.replace(/'/g, "\'");
input_el.value = val;
}
if (typeof input_el.onblur == "function") {
input_el.onblur();
}
if (typeof input_el.onchange == "function") {
input_el.onchange();
}
return 1;
}
function detailCopyEditForm(exceptions)
{
var parent_win = ahdframeset.opener;
var from_f = parent_win.document.main_form;
var	to_f = window.document.main_form;
if (typeof from_f == "object" &&
typeof to_f == "object")
{
var eles = from_f.elements;
var val;
for (var i = 0; i < eles.length; i++)
{
var from_e = eles[i];
if (typeof from_e == "object" &&
from_e != null &&
typeof from_e.name == "string" &&
from_e.name != "" &&
from_e.name != "FID" &&
from_e.name != "SID")
{
var j;
for (j = 0; j < exceptions.length; j++)
{
if (from_e.name == exceptions[j])
break;
}
if (j < exceptions.length) continue;
var to_e = to_f.elements[from_e.name];
if (typeof to_e != "object" || to_e == null)
continue;
if (from_e.type == "select-one")
{
to_e.selectedIndex = from_e.selectedIndex;
}
else
if (from_e.type == "radio")
{
from_e = eles[from_e.name];
for (var k = 0; k < from_e.length; k++)
{
to_e[k].checked = from_e[k].checked;
}
i += (from_e.length - 1);
}
else
{
to_e.value = from_e.value;
}
}
}
}
}
function detailDropdownEdit( hdrtext, attr_name, obj_type, colspan, size,
is_required, persid, rel_attr,
autofill, common_name_attr, common_name_value,
search_status, search_results, link,
cbwidth, extraURL, dflt, selections )
{
var i, field_name;
common_name_value = nx_unescape(common_name_value);
selections = nx_unescape(selections);
rel_attr = nx_unescape(rel_attr);
if( typeof selections == "string" && selections.length > 0 ) {
selections = selections.split("@,@");
for( i=18; i < arguments.length; i++)
selections[selections.length] = nx_unescape(arguments[i]);
}
var tenancy = "0";
var serviceProviderEligible = "0";
if ( typeof autofill == "string" &&
autofill.match(/^(\w*):(.*)$/) ) {
tenancy = RegExp.$2;
autofill = RegExp.$1;
if ( tenancy.match(/^(\w+):(\w+)$/) ) {
tenancy = RegExp.$1;
serviceProviderEligible = RegExp.$2;
}
}
if ( selections.length <= 1 ) {
detailLookupEdit( hdrtext, attr_name, obj_type, colspan, size,
is_required, persid, rel_attr,
autofill, common_name_attr, common_name_value,
search_status, search_results, "yes", extraURL,
0, tenancy, serviceProviderEligible );
return;
}
detailRowHdr(hdrtext,colspan,is_required);
if ( attr_name.match(/^KEEP\./) )
field_name = attr_name;
else
field_name="SET."+attr_name;
var item = '<select' + detailNextID(colspan,false,attr_name);
if ( typeof _dtl.fieldTitle != "string" ||
_dtl.fieldTitle.length == 0 ) {
var titletext = hdrtext;
if ( bool(is_required) )
titletext += ahdtop.cfgIndRequired;
item += " title=\"" + titletext + "\"";
}
else {
item += " title=\"" + _dtl.fieldTitle + "\"";
_dtl.fieldTitle = void(0);
}
if ( cbwidth == 0 ) {
if ( ! _dtl.edit )
item += " style='font-size:1.0em;'";
}
else if ( _dtl.edit )
item += " style='width:'" + cbwidth + "px;'";
else
item += " style='font-size:0em; width:'" + cbwidth + "px;'";
item += ' name="' + field_name + '">\n';
var options = "";
if ( ! bool(is_required) ||
( rel_attr.length == 0 && dflt.length == 0 ) )
options += '<OPTION VALUE="">&lt;' + msgtext("empty") + '&gt;\n';
var curr_found = false;
for ( i = 1; i < selections.length; i += 2 ) {
var sym = selections[i-1];
var code = selections[i];
if ( code == rel_attr ||
( sym == dflt &&
rel_attr.length == 0 &&
dflt.length > 0 )) {
curr_found = true;
options += '<OPTION SELECTED VALUE="' + code + '">' + sym + '\n';
}
else
options += '<OPTION VALUE="' + code + '">' + sym + '\n';
}
if( ! curr_found && rel_attr.length > 0 ) {
if ( common_name_value.length == 0 )
common_name_value = "?";
options += '<OPTION SELECTED VALUE="' + rel_attr + '">' +
common_name_value + '\n';
}
item += options + '</SELECT>\n';
detailSetRowData( item );
detailSetValidate( hdrtext, is_required );
}
var exp_sec_arr = new Array();
function exp_sec_node (form_name, init_state, exp_rows, label)
{
this.form_name = form_name;
this.down_id = "exp_sec_down_id" + exp_sec_num;
this.up_id = "exp_sec_up_id" + exp_sec_num;
this.state = init_state;
this.exp_sec_num = exp_sec_num;
this.exp_rows_obj = createExpandableRow(exp_rows);
this.adj_height = 0;
this.label = label;
exp_sec_arr[exp_sec_num] = this;
exp_sec_num++;
}
exp_sec_node.on_load_func = function ()
{
var len = exp_sec_arr.length;
var cur;
for (var i = 0; i < len; i++)
{
cur = exp_sec_arr[i];
if (cur.state == "up")
cur.show_rows(true);
else
if (cur.state == "down")
cur.hide_rows(true);
}
}
exp_sec_node.prototype.hide_rows = function (bLoad)
{
this.adj_height = 0;
var len = this.exp_rows_obj.length;
for (var i = (len - 1); i >= 0 ; i--)
{
this.adj_height += this.exp_rows_obj[i].hide_row();
}
if (typeof reshow_curr_tab != "undefined" &&
(typeof bLoad != "boolean" ||
!bLoad))
reshow_curr_tab(this.adj_height);
}
exp_sec_node.prototype.show_rows = function (bLoad)
{
this.adj_height = 0;
var len = this.exp_rows_obj.length;
for (var i = 0; i < len; i++)
{
if ( typeof skip_row_expansion == "function")
{ 
if (skip_row_expansion(this.exp_rows_obj[i])) continue;
}
this.adj_height -= this.exp_rows_obj[i].show_row();
}
if (typeof reshow_curr_tab != "undefined" &&
(typeof bLoad != "boolean" ||
!bLoad))
reshow_curr_tab(this.adj_height);
}
function hideExpRow(idx){
if (idx >= exp_sec_arr.length ||
typeof exp_sec_arr[idx] == "undefined"){
return;
}
var obj = exp_sec_arr[idx];
obj.state = "up"
exp_sec_clicked(idx);
}
function ShowExpRow(idx){
if (idx >= exp_sec_arr.length ||
typeof exp_sec_arr[idx] == "undefined"){
return;
}
var obj = exp_sec_arr[idx];
obj.state = "down"
exp_sec_clicked(idx); 
}
function exp_sec_clicked(idx)
{
if (idx >= exp_sec_arr.length ||
typeof exp_sec_arr[idx] == "undefined")
{
alertmsg("Failed_to_find_expandable_sect");
return;
}
var obj = exp_sec_arr[idx];
var down_obj = document.getElementById(obj.down_id);
var up_obj = document.getElementById(obj.up_id);
if (obj.state == "up")
{
if (obj.label != "")
{
down_obj.style.display = "block";
up_obj.style.display = "none";
}
obj.state = "down";
obj.hide_rows();
}
else
if (obj.state == "down")
{
if (obj.label != "")
{
down_obj.style.display = "none";
up_obj.style.display = "block";
}
obj.state = "up";
obj.show_rows();
}
ahdtop.set_expand_sec_state(obj.form_name, obj.exp_sec_num, obj.state);
}
function detailExpandSec(form_name, label, exp_rows, colspan)
{
if ( label != "" )
var init_state = ahdtop.get_expand_sec_state(form_name, exp_sec_num);
else
var init_state = "up";
var html = "";
var node = new exp_sec_node(form_name, init_state, exp_rows, label);
if ( label != "" ) {
html += '<TR><TD COLSPAN=' + colspan + '><TABLE cellspacing="0" class=dtl_page_hdr_container><TR>';
html += '<TD style="width:4px;height:22px;" class="page_section_header_left dtl_page_hdr_container"><IMG SRC="' + get_IMG_path("IMG_spacer") +
'" style="width:4px;height:22px" alt=""></TD>';
html += '<TD class="page_section_header_center dtl_page_hdr_container"><SPAN  id="' + node.down_id +
'" class="page_section_header_text_hs" style="display:';
if (init_state == "down")
html += 'block" ';
else
html += 'none" ';
html += 'onClick="exp_sec_clicked(' + node.exp_sec_num + ')">' +
'<IMG SRC="' + get_IMG_path("IMG_arrow_down") + '"  style="width:14px;height:14px;border:none;" ' +
' class="hide_show_button" alt="' + msgtext("Show_this_section") + '">' + label + '</SPAN>' +
'<SPAN class="page_section_header_text_hs" id="' + node.up_id + '" style="display:';
if (init_state == "up")
html += 'block" ';
else
html += 'none" ';
html += 'onClick="exp_sec_clicked(' + node.exp_sec_num + ')">' +
'<IMG SRC="' + get_IMG_path("IMG_arrow_up") + '" style="width:14px;height:14px;border:none;" ' +
'class="hide_show_button" alt="' + msgtext("Hide_this_section") + '">' + label + '</SPAN>' +
'</TD><TD style="width:4px;height:22px" class="page_section_header_right dtl_page_hdr_container">' +
'<IMG SRC="' + get_IMG_path("IMG_spacer") + '" style="width:4px;height:22px" alt=""></TD></TR></TABLE></TD></TR>';
_dtl.expSecHtml = html;
}
}
function add_response(i)
{
if ( ahdframe.currentAction == 0 && i>0 && resp_on_blur_flag ==0)
{
var url = cfgCgi + "?SID=" + cfgSID + "+FID=" + fid_generator() +
"+OP=PERSRESP_EXPAND+MSG_ID=" + resp_ids[i] +
"+PERSID=" + resp_persid +
"+CALLBACK=parent.ahdframe.add_response_callback";
display_new_page(url, ahdframeset.workframe);
set_action_in_progress(ACTN_AUTOFILL);
}
}
function add_response_callback(msg) {
set_action_in_progress(0);
if ( document.main_form.elements[resp_field].value == "")
document.main_form.elements[resp_field].value+=nx_unescape(msg);
else
document.main_form.elements[resp_field].value+="\n"+nx_unescape(msg);
resp_on_blur_flag = 1;
}
function reset_resp_on_blur_flag(){
resp_on_blur_flag = 0;
}
function gblsd_ck_prefix(value)
{
var colon=/\:$/;
var result=value.match(colon);
if(result==null) alertmsg("Prefix_must_end_in_a_colon.__E", value);
}
function gblsd_upcase(field)
{
field.value=field.value.toUpperCase();
}
function gblsd_set_global_name(v)
{
var f=document.main_form.elements["SET.global_name"];
if(f.value.length==0) f.value=v.toUpperCase();
}
function gblsd_ck_master(cb, g)
{
var f=document.main_form.elements["SET.is_master"];
if(cb.checked==true) {
if(g!="") {
if(!confirm(msgtext("%1_is_already_defined_as_the_M", g))) {
f.value=0;
cb.checked=false;
return;
}
}
f.value=1;
} else {
f.value=0;
}
return;
}
function detailValueOf(field_name)
{
var	form = window.document.main_form;
if (typeof form == "undefined")
return "";
var obj = form.elements[field_name];
if (typeof obj == "undefined")
return "";
if (obj.type == "select-one")
return obj.options[obj.selectedIndex].value;
else
return obj.value;
}
function loadFilterArray()
{
var attrs = propSearchConfig.split(",");
for(var i=0; i<attrs.length; i++)
{
if(attrs[i].substr(attrs[i].length-1, 1) == "*"){
attrs[i] = attrs[i].substr(0,attrs[i].length - 1);
}
var e=document.forms["main_form"].elements;
loadFilterArr[attrs[i]]="";
if(typeof e["SET."+attrs[i]]!="undefined" && e["SET."+attrs[i]].value.length>0)
{
loadFilterArr[attrs[i]]=e["SET."+attrs[i]].value;
}
if(typeof e["KEY."+attrs[i]]!="undefined" && e["KEY."+attrs[i]].value.length>0)
{
loadFilterArr[attrs[i]]=e["KEY."+attrs[i]].value;
}
if(attrs[i]=="priority" || attrs[i]=="severity" || attrs[i]=="impact" || attrs[i]=="urgency")
{
continue;
} else {
for(var j=0; j<e.length; j++)
{
if ( typeof e[j].type == "string" &&
e[j].type=="select-one" &&
e[j].name.substr(0,4)=="SET." &&
e[j].value.length>0)
{
var attrlen=attrs[i].length;
if(e[j].name.substr(0, attrlen+4+1)=="SET."+attrs[i])
{
for(var k=0; k<e[j].length; k++)
{
if(e[j].options[k].selected==true)
{
loadFilterArr[attrs[i]]=e[j].options[k].text;
}
}
}
}
}
}
}
}
function srchknow(field)
{
if(typeof document.main_form.elements[field]=="undefined" ||
typeof document.main_form.elements[field].value=="undefined" ||
document.main_form.elements[field].value=="")
{
alertmsg("Field_contains_no_text_to_sear");
return;
}
if ( action_in_progress() )
{
return;
} else {
set_action_in_progress(ACTN_SEARCH);
}
var idx=find_tab_by_src("SD_LAUNCHED");
if(idx!=null)
{
var tab_name=tab_name_by_id(idx);
var fac=argPersistentID.split(":");
if(fac[0] != 'cr' && fac[0] != 'iss')
{
alert(msgtext("Knowledge_Search_for_%1_object", fac[0]));
return;
}
if (typeof _dtl == "object")
_dtl.doSrchKnow = 1;
if ((typeof cur_selected != "undefined") &&
(cur_selected == idx))
{
var tab_obj = window.frames[tab_name];
if ((typeof tab_obj == "object") &&
(typeof tab_obj.loadFilter != "undefined"))
{
tab_obj.loadFilter();
return;
}
}
if ((accordion_control_used) && (!ahdtop.cstUsingScreenReader))
{
show_kwlg_search(idx);
}
else 
show_tab_src(idx);
} else {
alertmsg("Can't_find_Knowledge_notebook_");
}
}
function getDetailElementProperty(elementId, propKey)
{
var propValue = this.propNotFound;
if ( _dtl.fieldToValidate.length > 0 ) {
for ( var i = 0; i < _dtl.fieldToValidate.length; i++ ) {
if ( _dtl.fieldToValidate[i].id == elementId ) {
var targetElement = _dtl.fieldToValidate[i];
if ( typeof targetElement[propKey] != "undefined")
propValue = targetElement[propKey];
break;
}
}
}
return propValue;
}
function detailValidateFileName(fld_obj)
{
if (typeof fld_obj == "undefined")
return true;
var val = fld_obj.value;
if(val.match(/[\\\/:\*\?"<>'\|^&,;+]/)!=null)
{
detailReportValidation( fld_obj, 1, msgtext("This_field_Cannot_contain_any_"));
return false;
}
else
{
val = ltrim(val);
val = rtrim(val);
fld_obj.value = val;
detailReportValidation(fld_obj,0);
return true;
}
}
function ltrim(argvalue)
{
while (1)
{
if (argvalue.substring(0, 1) != " ")
break;
argvalue = argvalue.substring(1, argvalue.length);
}
return argvalue;
}
function rtrim(argvalue)
{
while (1)
{
if (argvalue.substring(argvalue.length - 1, argvalue.length) != " ")
break;
argvalue = argvalue.substring(0, argvalue.length - 1);
}
return argvalue;
}
function contactLookup( Header, frameName, cntFactory, lookupName, extraURL )
{
var sExtraURL = "" ;
if ( typeof extraURL != "undefined" ) {
sExtraURL = extraURL;
}
docWriteln("<A class=sfLookup id=" + lookupName + "_lookup_name name=" + lookupName + "_lookup_name" +
" href=\"javascript:lookForUser('" + lookupName + "', '" + frameName + "', '" + cntFactory +"','" + sExtraURL + "' )\"" +
" title='" + msgtext("Pop_up_%1_lookup_form", Header) + "'>");
if ( ahdtop.cstUsingScreenReader == '1' )
{
docWriteln("<SPAN class=lookup style='font-size:1.0em;'>" + Header + "</SPAN></A>");
}
else
{
docWriteln("<IMG class=dtl_img_attr src='" + cfgCAISD + "/img/lookup.gif'" + 
" alt='" + msgtext("Pop_up_%1_lookup_form", Header) + "'>");
docWriteln("<SPAN class=lookup style='font-size:1.0em;'>" + Header + "</SPAN></A>");
}
docWriteln("<br>&nbsp;");
docWriteln("<input id=" + lookupName + "_combo_name name=" + lookupName + "_combo_name" +
" type=text class=clsPaneData style='font-size:1.0em;' size=18" +
" onchange=\"cleanUser('" + lookupName + "');" +
" if (this.value != '') {lookForUser('" + lookupName + "', '" + frameName + "', '" + cntFactory + "','" + sExtraURL + "');}\">");
docWriteln("<input type=hidden id=SET." + lookupName + " name=SET." + lookupName + ">");
docWriteln("<input type=hidden id=KEY." + lookupName + " name=KEY." + lookupName + ">");
docWriteln("<input type=hidden id=" + lookupName + "_lname name=" + lookupName + "_lname>");
docWriteln("<input type=hidden id=" + lookupName + "_fname name=" + lookupName + "_fname>");
docWriteln("<input type=hidden id=" + lookupName + "_mname name=" + lookupName + "_mname>");
}
function lookForUser( lookupName, frameName, factory, extraURL )
{
var e = document.getElementById(lookupName + "_lookup_name");
if (e != null && !e.disabled)
{
fill_name_fields( document.forms["frm_comment"], factory, lookupName, true, extraURL );
}
}
function contactLookupDisable( lookupName, bDisable )
{
document.getElementById(lookupName + "_lookup_name").disabled=bDisable;
document.getElementById(lookupName + "_combo_name").disabled=bDisable;
}
function cleanUser( lookupName )
{
document.getElementById("SET." + lookupName).value = "";
document.getElementById("KEY." + lookupName).value = "";
document.getElementById(lookupName + "_lname").value = "";
document.getElementById(lookupName + "_fname").value = "";
document.getElementById(lookupName + "_mname").value = "";
}
function showTenantField()
{
if ( _dtl.factory != "tenant" ) {
var accessTenantRestriction = ahdtop.cfgAccessTenantWriteRestriction;
var existingTenant;
var multipleTenants = false;
if ( argTenant != "" ) {
existingTenant = true;
if ( _dtl.edit && _dtl.id == 0 && 
( ahdtop.cfgAccessTenantWriteRestriction == 0 ||
( typeof ahdtop.cfgAccessUpdatableTenantUuids == "object" &&
ahdtop.cfgAccessUpdatableTenantUuids.length > 1 ) ) &&
( typeof _bHideTenantSelection == "boolean" && ! _bHideTenantSelection ) )
multipleTenants = true;
}
else {
existingTenant = false;
if ( _dtl.edit &&
typeof ahdtop.cfgAccessUpdatableTenantUuids == "object" &&
ahdtop.cfgAccessUpdatableTenantUuids.length <= 1 )
accessTenantRestriction = 1;
}
if ( ( argFactoryTenancy == "1" &&
( cfgAccessUpdateModify == 1 ||
accessTenantRestriction != 1) ) ||
( argFactoryTenancy == "2" && accessTenantRestriction != 1) ) {
docWrite("<TR><TD align=left>");
docWrite("<TABLE cellpadding=1 cellspacing=5><TR valign=TOP>");
var showList = false;
var tenantRequired = false;
var useGlobalForEmpty = false;
if ( ! existingTenant &&
( typeof _bHideTenantSelection == "boolean" &&
_bHideTenantSelection ) ) {
existingTenant = true;
useGlobalForEmpty = true;
multipleTenants = false;
}
var useLookup = false;
if( typeof getTenantSelections == "function")
getTenantSelections();
if ( ahdtop.cfgAccessTenantWriteRestriction == 0 &&
typeof cfgTenantSelections == "string" ) {
if ( cfgTenantSelections == "SelListCacheMax" )
useLookup = true;
}
else {
if ( typeof ahdtop.cfgAccessUpdatableTenantUuids != "object" ||
ahdtop.cfgAccessUpdatableTenantUuids.length > propSelListCacheMax )
useLookup = true;
}
if ( (! existingTenant || multipleTenants) && 
_dtl.edit &&
! window.name.match(/_iframe$/) && 
(typeof argMakeCopy=="undefined" || argMakeCopy != "1")) {
if (_dtl.id == 0 && document.URL.indexOf("presetToPublic") == -1 && (typeof argTenantIsPreset=="undefined" || !argTenantIsPreset))
showList = true;
if ( argFactoryTenancy == "2" && cfgAccessUpdateModify == 1 )
showList = true;
}
if (showList && ahdtop.cfgMultiTenancy == "on") {
if (argFactoryTenancy == "2")
tenantRequired = true;
if (argFactoryTenancy == "1" && cfgAccessUpdateModify == 0)
tenantRequired = true;
if (argFactoryTenancy == "1" && cfgAccessUpdateModify == 1)
useGlobalForEmpty = true;
}
if ( !showList && !existingTenant && argFactoryTenancy == "1" )
useGlobalForEmpty = true;
if ( !showList ) {
show_tenant_existing_object(existingTenant, useGlobalForEmpty);
return;
}
if ( showList && !useLookup ) {
show_tenant_dropdown(tenantRequired, useGlobalForEmpty);
return;
}
if ( showList && useLookup ) {
show_tenant_lookup(tenantRequired);
return;
}
}
}
}
function show_tenant_dropdown(tenantRequired, useGlobalForEmpty)
{
var html;
if ( tenantRequired ) {
html = "<th id=tenant_drop style='float:left;' valign=baseline class=requiredlabeltext scope='col'>";
html += msgtext("Tenant") + ahdtop.cfgIndRequired + ahdtop.cfgIndTenant;
}
else {
html = "<th id=tenant_drop style='float:left;' valign=baseline class=labeltext scope='col'>";
html += msgtext("Tenant") + ahdtop.cfgIndTenant;
}
html += "</th>";
var tenantList = "";
if ( typeof cfgTenantSelections == "string" ) {
tenantList = cfgTenantSelections;
if ( tenantList.match(/^@,@/) )
tenantList = tenantList.substring(3, tenantList.length);
}
else if ( typeof ahdtop.cfgAccessUpdatableTenantUuids == "object" ) {
var len = ahdtop.cfgAccessUpdatableTenantUuids.length;
tenantList = ahdtop.cfgAccessUpdatableTenantNames[len-1] + "@,@" +
ahdtop.cfgAccessUpdatableTenantUuids[len-1];
for ( var i = len - 2; i >= 0; i-- ) {
tenantList += "@,@" + ahdtop.cfgAccessUpdatableTenantNames[i] + "@,@" +
ahdtop.cfgAccessUpdatableTenantUuids[i];
}
}
var tenantId = "";
if ( ahdtop.cstRetainTenant &&
typeof ahdtop.lastTenantId != "undefined" &&
typeof ahdtop.lastTenantName != "undefined" ) {
argTenantId = ahdtop.lastTenantId;
argTenant = ahdtop.lastTenantName;
}
detailSetEventHandler("onChange='detailTenantChange(this)'");
var selectStr = "";
selectStr = detailDropdown( msgtext("Tenant"), "tenant", "tenant", 1, 20, 
tenantRequired, "", "",
"yes:tenant", "name", "",
"", "", "no", "0", "", 
argTenant, tenantList );
_dtl.tenantFieldEditable = true;
if ( useGlobalForEmpty )
{
var emptyOption="&lt;"+msgtext("empty")+"&gt;\n";
var index = selectStr.search(emptyOption);
if(index !=-1) 
{
selectStr = selectStr.substr(0, index+emptyOption.length) +
'<OPTION VALUE="">' + msgtext("global_(shared)") +
'\n'+selectStr.substr(index+emptyOption.length);
_dtl.hasGlobalSharedOption = true;
}
}
html += "<td>";
html += selectStr;
html += "</td>";
html += "</tr></table>";
html += "</td></tr>";
document.write(html);
if ( tenantRequired )
detailSetValidate( msgtext("Tenant"), true );
}
function show_tenant_lookup(tenantRequired)
{
var itemHtml = "<td>";
if ( ahdtop.cstRetainTenant &&
typeof ahdtop.lastTenantId != "undefined" && 
typeof ahdtop.lastTenantName != "undefined" ) {
argTenantId = ahdtop.lastTenantId;
argTenant = ahdtop.lastTenantName;
}
var extraURL="";
if( typeof cfgTenantFieldLookupWc == "string")
extraURL=cfgTenantFieldLookupWc;
itemHtml += detailLookupEdit( msgtext("Tenant"), "tenant", "tenant", 1, 20,
tenantRequired, "", argTenantId,
"yes", "name", argTenant,
"", "", "yes", extraURL, 0, "2");
_dtl.tenantFieldEditable = true;
itemHtml += "</td>";
itemHtml += "</tr></table>";
itemHtml += "</td></tr>";
document.write(itemHtml);
_dtl.rowNum = 1;
_dtl.colID = 0;
_dtl.colNum = 0;
_dtl.hdrColNum = -1; 
if ( tenantRequired )
detailSetValidate( msgtext("Tenant"), true );
}
function show_tenant_existing_object(existingTenant, useGlobalForEmpty)
{
docWrite("<TH ALIGN=left VALIGN=baseline class=labeltext scope='col'>");
docWrite(msgtext("Tenant") + ": ");
docWrite("</TH>");
docWrite("<TD class=table_data>");
if (existingTenant) {
docWrite(argTenant);
ahdtop.lastTenantId = argTenantId;
ahdtop.lastTenantName = argTenant;
}
if (useGlobalForEmpty) {
docWrite(msgtext("global_(shared)"));
argGlobalTenant = true;
}
if (argFactoryTenancy == "2" && argTenant == "") {
docWrite("&lt;" + msgtext("empty") + "&gt;");
}
_dtl.tenantFieldEditable = false;
docWrite("</TD>");
docWrite("</TR></TABLE>");
docWrite("</TD></TR>");
}
function find_similar_tickets(sITILFactory)
{
var sHTMPL = "list_cr_kt.htmpl";
if ( sITILFactory == "iss" )
var sHTMPL = "list_iss_kt.htmpl";
var sExtraURL = "+KEEP.FIND_SIMILAR_PERSID=" + argPersistentID + 
"+KEEP.FIND_SIMILAR_FACTORY=" + sITILFactory + 
"+HTMPL=" + sHTMPL; 
var sMTURL = "";	
if ( ahdtop.cfgMultiTenancy == "on" )
{
sMTURL = 
"+KEEP.backfillPersid=" + argPersistentID +
"+KEEP.backfillFactory=" + propFactory + 
"+KEEP.objectTenant=" + ( argGlobalTenant ? "n/a" : argTenantId ) +
"+KEEP.objectTenantName=" + nx_escape(argTenant);
if (sITILFactory == "in")
sMTURL += "+KEEP.backfill_field=problem";
else
sMTURL += "+KEEP.backfill_field=parent";
}
if ( _dtl.edit && sITILFactory == "in" )
{
popup_search('cr','KEY.problem','main_form', sExtraURL ,0,'ref_num', void(0), 
popupWidth(LARGE_POPUP), popupHeight(LARGE_POPUP));
}
else
{
var url = cfgCgi +
"?SID=" + cfgSID +
"+FID=" + fid_generator() +
"+OP=SEARCH" + 
"+FACTORY=" + propFactory + 
sExtraURL + sMTURL + 
"+KEEP.backfill_fieldRO=1";
preparePopup(url, "", "", void(0), void(0), void(0), true);
}
}
function re_auto_assign(re_assignee, re_group, re_customer, re_category, re_auto_assign, re_persid, re_affected_resource, re_auto_flag)
{
if (typeof re_affected_resource == "undefined")
re_affected_resource = "";
var url = cfgCgi + 
"?SID=" + cfgSID +
"+FID=" + fid_generator() +
"+OP=RE_AUTO_ASSIGN" +
"+ASSIGNEE=" + re_assignee +
"+GROUP=" + re_group +
"+CUSTOMER=" + re_customer +
"+AFFECTED_RESOURCE=" + re_affected_resource +
"+CATEGORY=" + re_category +
"+AUTO_ASSIGN=" + re_auto_assign +
"+PERSID=" + re_persid +
"+FACTORY=" + propFactory + 
"+AUTO_FLAG=" + re_auto_flag +
"+CALLBACK=window.parent.ahdframe.auto_assign_refresh";
display_new_page(url, ahdframeset.workframe);
}
function auto_assign_refresh(re_persid)
{
var url_str = cfgCgi + 
"?SID=" + cfgSID +
"+FID=" + fid_generator() +
"+OP=SHOW_DETAIL" +
"+FACTORY=" + propFactory +
"+PERSID=" + re_persid;
display_new_page(url_str);	
}
function detailSetReqArray(hdrtext)
{
if (!_dtl.edit || _dtl.currAttrName == "") return "";
if (typeof _dtl.attrReqArray[_dtl.currAttrName] == "undefined")
{
var id = "req_" + _dtl.rowNum + "_" + _dtl.colID;
var obj = new Object();
obj.req_id = id;
obj.hdrtext = hdrtext;
obj.fld_id = "";
obj.stay_req = 0;
_dtl.attrReqArray[_dtl.currAttrName] = obj;
return " ID=" + id + " ";
}
return "";
}
function detailMakeReq(attr_names, bNot)
{
var attrs = attr_names.split(",");
var required = 1;
var class_name = _dtl.reqhdrclass;
if (typeof bNot == "boolean" && bNot)
{
required = 0;
class_name = _dtl.hdrclass;
}
else 
{
bNot = false;
} 
if (attrs.length > 0)
{
var i, j, attr_name, fld_id, obj;
var hdrtext, req_idi, lbl, fld;
var validates, v, tmptext, idx;
for (i = 0; i < attrs.length; i++)
{
attr_name = attrs[i];
attr_name = gsub(attr_name, " ", "");
if (typeof _dtl.attrReqArray[attr_name] == "undefined")
{
continue;
}
obj = _dtl.attrReqArray[attr_name];
if (obj.stay_req) continue;
fld_id = obj.fld_id;
req_id = obj.req_id;
hdrtext = obj.hdrtext;
lbl = document.getElementById(req_id);
if (typeof lbl != "undefined" && 
lbl != null)
{
lbl.className = class_name;
tmptext = lbl.innerHTML;
if (bNot)
{
tmptext = gsub(tmptext, ahdtop.cfgIndRequired, ""); 
lbl.innerHTML = tmptext;
}
else 
{
idx = tmptext.indexOf(ahdtop.cfgIndRequired);
if (idx < 0)
{	
idx = tmptext.indexOf("&nbsp;");
if (idx < 0) 
lbl.innerHTML = tmptext + ahdtop.cfgIndRequired;
else 
{
tmptext = tmptext.substring(0, idx) + ahdtop.cfgIndRequired + 
tmptext.substring(idx, tmptext.length);
lbl.innerHTML = tmptext;
}
}
}
} 
validates = _dtl.fieldToValidate;
for (j = 0; j < validates.length; j++)
{	
if (validates[j].id == fld_id)
{
validates[j].is_required = required;
break;
}	
}
if (!bNot && j == validates.length)
{
v = createValidateObject(fld_id, hdrtext, 0, 1, "", 0);
validates[validates.length] = v;
} 
}
}
}
function rtrim_nonchar(argvalue)
{
while (1)
{
if (argvalue.substring(argvalue.length - 1, argvalue.length).match(/\w/))
break;
argvalue = argvalue.substring(0, argvalue.length - 1);
}
return argvalue;
}
var status_processed = void(0); 
function set_required_flds(val)
{
var status = val;
if ( typeof val == "object" &&
val.type == "select-one" )
status = val.options[val.selectedIndex].value;
if ( typeof prop_ref != "string" ||
typeof status != "string" ||
status == "" )
return;
if (status != status_processed)
status_processed = status;
else 
return;
var url = cfgCgi +
"?SID=" + cfgSID +
"+FID=" + cfgFID +
"+OP=GET_REQUIRED_FIELDS" +
"+FACTORY=" + propFactory +
"+status=" + nx_escape(status) + 
"+prop_ref=" + nx_escape(prop_ref);
if ( ahdtop.cfgMultiTenancy == "on" )
{
url += "+tenant=" + nx_escape(argTenantId);
} 
set_action_in_progress(ACTN_LOADPROP);
var req_list = SyncAjaxCall(url);
set_action_in_progress(ACTN_COMPLETE);
if ( typeof req_list == "string" && 
req_list.length > 0 )
{
req_list = rtrim_nonchar(req_list);
if ( req_list.match(/^AHD/) ) {
if ( ! req_list.match(/^AHD04406/) )
alert(req_list);
req_list = "";
}
var not_reqs = "", reqs = "";
if (typeof required_list == "undefined" || required_list.length == 0)
reqs = req_list;
else if (req_list.length == 0)
not_reqs = required_list;
else 
{ 
var cur_reqs = required_list.split(",");
var new_reqs = req_list.split(",");
var i, k;
for (i = 0; i < cur_reqs.length; i++)
{
for (j = 0; j < new_reqs.length; j++)
{
if (cur_reqs[i] == new_reqs[j])
{
cur_reqs[i] = "<1>";
new_reqs[j] = "<2>"; 
break;
}
}
}
for (i = 0; i < cur_reqs.length; i++)
{
if (cur_reqs[i] != "<1>")
{
if (not_reqs.length == 0)
not_reqs = cur_reqs[i];
else 
not_reqs += "," + cur_reqs[i];
}
}
for (i = 0; i < new_reqs.length; i++)
{
if (new_reqs[i] != "<2>")
{
if (reqs.length == 0)
reqs = new_reqs[i];
else 
reqs += "," + new_reqs[i];
}
}
}
if ( reqs.length > 0 )
detailMakeReq(reqs);
if ( not_reqs.length > 0 )
detailMakeReq(not_reqs, true);
required_list = req_list; 
}
return "";
}
function detailLookupEdit_setDefault(attr_name, dflt_key, dflt_set) {
var setinp=document.main_form.elements["SET." + attr_name];
if(setinp.type == "select-one") {
setinp.value=dflt_set;
} else if(setinp.type == "hidden") {
setinp.value=dflt_set;
setinp=document.main_form.elements["KEY." + attr_name];
if(typeof setinp != "undefined" && setinp != null) {
setinp.value=dflt_key;
_dtl.is_from_setDefault=true;
}
} else {
alert("can't figure out input type");
}
set_default_toggle(setinp);
setinp.focus();
if(setinp.onchange != null) setinp.onchange();
}
function set_default_toggle(setinp) {
var _dflt_obj;
try {
_dflt_obj=eval("dflt_" + setinp.attributes["pdmqa"].value);
}
catch(e) {
return; 
}
if (typeof _dflt_obj == "undefined" || 
_dflt_obj == null)
return; 
var currVal=setinp.value;
var dflt_key="";
var dflt_set="";
dflt_key=_dflt_obj["KEY"];
dflt_set=_dflt_obj["SET"];
var imgId=_dflt_obj["imgId"];
var lnkId=_dflt_obj["lnkId"];
var img=document.getElementById(imgId);
var lnk=document.getElementById(lnkId);
if (img != null && lnk != null) {
if (currVal == dflt_key || currVal == dflt_set) {
img.src = get_IMG_path("IMG_spacer");
lnk.tabIndex = -1;
lnk.onclick = "javascript: return false;";
lnk.title = null;
lnk.style.display = "none";
} else {
img.src = _dflt_obj["img"];
lnk.tabIndex = _dflt_obj["tab"];
lnk.onclick = _dflt_obj["clk"];
lnk.title = _dflt_obj["alt"];
lnk.style.display = "inline";
}
}
}
function findFieldAndLabelFromTable(field_name,td_flag)
{
if ( typeof field_name != "string" || field_name.length == 0 )
return null;
var real_field_name = field_name;
if ( typeof document.main_form.elements[real_field_name] == "undefined" )
{
real_field_name = "KEY." + field_name;
if ( typeof document.main_form.elements[real_field_name] == "undefined" )
{
real_field_name = "SET." + field_name;
if ( typeof document.main_form.elements[real_field_name] == "undefined" )
return null;
}
}
var fieldRowNode = document.main_form.elements[real_field_name].parentNode;
while ( fieldRowNode != null && fieldRowNode.nodeName.toLowerCase() != "tr" )
{
fieldRowNode = fieldRowNode.parentNode;
}
if ( fieldRowNode == null || fieldRowNode.childNodes.length == 0 )
return null;
var colNum = fieldRowNode.childNodes.length - 1;
while (colNum >= 0)
{
var fieldNode = fieldRowNode.childNodes[colNum];
if ( fieldNode.nodeName.toLowerCase() == "td" && 
fieldNode.childNodes.length > 0 )
{
var k = 0;
while ( k < fieldNode.childNodes.length )
{
if ( typeof fieldNode.childNodes[k].name != "undefined" && 
fieldNode.childNodes[k].name == real_field_name )
break;
k++;
}
if ( k < fieldNode.childNodes.length )
break;
}
colNum--;
}
if ( colNum < 0 )
return null;
var labelRowNode = fieldRowNode.previousSibling;
while ( labelRowNode != null && labelRowNode.nodeName.toLowerCase() != "tr" )
{
labelRowNode = labelRowNode.previousSibling;
}
if ( labelRowNode == null || 
labelRowNode.childNodes.length == 0 ||
labelRowNode.childNodes.length <= colNum )
return null;
if ( labelRowNode.childNodes[colNum].nodeName.toLowerCase() != "th" )
return null;
var retArray = new Array(); 
retArray[0] = document.main_form.elements[real_field_name];
retArray[1] = labelRowNode.childNodes[colNum];
if ( typeof td_flag == "number" && td_flag == 1 )
{
var tdNode = retArray[0].parentNode;
while ( tdNode != null && tdNode.nodeName.toLowerCase() != "td" )
tdNode = tdNode.parentNode;
if ( tdNode == null )
return null;
retArray[0] = tdNode;
}
return retArray;
}
function detailDropdownWithDesc(label, attr, value, desc, title)
{
var i;
detailRowHdr(label);
if (!_dtl.edit)
{
docWrite("<TD valign=middle class=detailro style='width:20%'>");
docWrite(detailGetReadonlyData( attr, value));
docWriteln("</TD>");
}
else
{ 
docWrite("<TD valign=middle style='width:15%'>");
var set_attr = "SET." + attr;
docWriteln('<SELECT' + detailNextID(1, false, attr) + " NAME=" + set_attr + " title=\"" + label + "\" >");
docWriteln("<OPTION VALUE= ''>&lt;" + msgtext("empty") + "&gt;</OPTION>");
var sel_arr = new Array();
for( i = 5; i < arguments.length; i++)
sel_arr[sel_arr.length] = nx_unescape(arguments[i]);
if( sel_arr.length == 1 )
{
sel_arr = sel_arr[0].split("@,@");
}
for (i = 1; i < sel_arr.length; i += 2 ) 
{
var sym = sel_arr[i-1];
var code = sel_arr[i];
if ( sym == value)
{
docWrite('<OPTION SELECTED VALUE="' + code + '">' + sym);
}
else
{
docWrite('<OPTION VALUE="' + code + '">' + sym);
}
docWriteln("</OPTION>");
}	
docWriteln("</SELECT>");
docWriteln("</TD>");
} 
docWrite("<TD valign=middle colspan=2 class=detailro style='width:65%;float:left' >");
docWrite(desc);
docWriteln("</TD>");
}
function detailCheckboxWithDesc(label, attr, value, code, desc, title, event, 
id, func, sameCol, padding)
{
var i;
detailRowHdr(label);
if (!_dtl.edit)
{
docWrite("<TD valign=middle class=detailro style='width:20%'>");
docWrite(detailGetReadonlyData( attr, value));
docWriteln("</TD>");
}
else
{ 
if (!sameCol)
docWrite("<TD valign=middle style='width:15%'>");
else 
docWrite("<TD valign=middle aling=left>");
var cbx_attr = "CBX." + attr;
var set_attr = "SET." + attr;
if (title == "") 
title = label;
if (func != "")
code = eval(func);
if (id == "")
id = detailNextID(1, false, attr);
else 
id = " ID=" + id + pdmqa(attr);
for (var i = 0; i < padding; i++)
docWrite("&nbsp;");	
if(code=='1')
{
docWriteln("<INPUT TYPE=checkbox VALUE='1'" + id +" NAME=" + cbx_attr +" CHECKED "+ event+ " title=\"" + title + "\" >");
}
else
{
docWriteln("<INPUT TYPE=checkbox VALUE='1'" + id +" NAME=" + cbx_attr +" " + event + " title=\"" + title + "\" >");
}
docWriteln("<INPUT TYPE=hidden" + " NAME=" + set_attr + " VALUE=\"" + code + "\">\n");
if (!sameCol)
docWriteln("</TD>");
}
if (!sameCol) 
docWrite("<TD valign=middle colspan=2 class=detailro style='width:65%;float:left'>");
docWrite(desc);
docWriteln("</TD>");
}
function detailGetReadonlyData(attr_name, value,colspan, id, rows, size)
{
if ( typeof value != "string" ) {
switch ( arguments.length ) {
default: size = rows;
case 4: rows = id;
case 3: id = colspan;
case 2: colspan = value;
case 1: value = attr_name;
case 0: attr_name = "";
}
}
if ( typeof id != "string" || id.length == 0 ) {
id = "df_" + _dtl.rowNum + "_" + _dtl.colID;
detailIncrCol(colspan);
}
var html, idinfo = " id=" + id + pdmqa(attr_name);
if ( ( ! ahdtop.cstUsingScreenReader ) ||
value.match(/^\s*\<a /i) ) {
html = value.replace(/\n/g,"<br>");
if ( _dtl.edit )
idinfo += " style='font-size:0.7em;'"; 
if ( typeof _dtl.colSpan[_dtl.colNum] == "string" )
_dtl.colSpan[_dtl.colNum] += idinfo ;
else
_dtl.colSpan[_dtl.colNum] = idinfo ; 
}
else {
if ( typeof _dtl.firstField == "undefined" )
_dtl.firstField = id;
idinfo += " tabindex=" + _dtl.tabIndex +
" class=dtl_field_val_ro";
if ( ! _dtl.edit )
idinfo += "style='font-size:1.0em;'";
if ( typeof size != "number" ) {
if ( value.length < 20 )
size = 20;
else if ( value.length > 100 )
size = 100;
else
size = value.length;
}
var titleText = _dtl.lastHdrtext;
if ( typeof _dtl.fieldTitle == "string" &&
_dtl.fieldTitle.length > 0 ) {
titleText = _dtl.fieldTitle;	
_dtl.fieldTitle = void(0);
}
if ( typeof rows == "number" && rows > 1 ) {
html = "<textarea readonly rows=" + rows + " cols=" + size +
idinfo + ' title="' + titleText + '">' +
value + "</textarea>";
}
else {
html = "<input type=text readonly size=" + size + idinfo;
if ( value != "&nbsp;" ) {
value = value.replace(/"/g,'&quot;');
html += ' value="' + value + '"';
}
html += ' title="' + titleText + '">';
}
} 
return html;
}
function isAttrPreset(url, attr)
{
var isPreset = false;
var checkStr1 = "=" + attr;
var checkStr2 = "@@" + attr;
var presetIdx = url.indexOf("PRESET");
while (presetIdx != -1 && ! isPreset) 
{
var presetEnd = url.indexOf("+", presetIdx+6);
if (presetEnd == -1) {
presetEnd = url.length;
}
var presetStr = url.substr(presetIdx, presetEnd-presetIdx);
if (presetStr.length > 0 && 
(presetStr.indexOf(checkStr1) != -1 || presetStr.indexOf(checkStr2) != -1)) {
isPreset = true;
}
presetIdx = url.indexOf("PRESET", presetEnd);
}
return isPreset;
}
function detailShowText( dtltext,colspan,dataclass,showbarimg )
{
var cols ="";
var html = "";
var txtclass = "";
dtltext = nx_unescape(dtltext);
if ( typeof colspan != "number" )
cols = " colspan=1";
else if ( colspan > 1 )
cols = " colspan=" + colspan;
if (typeof dataclass == "string" && dataclass == "pageHeader")
{
txtclass = "page_section_header_center";
html = "<table width='100%' cellspacing='0' cellpadding='0' class='gn_container_no_border'><tr>"; 
html += "<td width='4' height='22' class='page_section_header_left'><img src='" + 
cfgCAISD + "/img/spacer.png' width='4' height='22' alt=''></td>";
docWriteln(html);
html = "";
} 
else if(typeof dataclass == "string" && dataclass == "bold")
txtclass = "refdata0";
else if(typeof dataclass == "string" && dataclass == "required")
txtclass = "requiredlabeltext";
else if(typeof dataclass == "string" && dataclass == "alertmsg")
txtclass = "detailro alertmsg";
else if(typeof dataclass=="string"&&dataclass=="hdr")
{
detailRowHdr(dtltext,colspan);
detailSetRowData("");
return;
}
else if(typeof dataclass == "string" && dataclass != "none")
txtclass = dataclass;
else
txtclass = _dtl.hdrclass;
if ( typeof dtltext == "string" && dtltext.length>0 ) {
if ( ahdtop.cfgUserType == "analyst" && !ahdtop.cstUsingScreenReader )
dtltext = dtltext + "&nbsp;&nbsp;&nbsp;";
html = "<td";
var id,doLabelFor;
doLabelFor = (typeof _dtl.fieldTitle!="string" || _dtl.fieldTitle.length==0 );
if ( doLabelFor )
html += " id=df_" + _dtl.rowNum + "_" + _dtl.colID;
if (typeof dataclass == "string" && dataclass != "pageHeader")
html += cols + " ALIGN=left VALIGN=baseline";
html += " class='" + txtclass + "'";
html += " scope='col'>";
if (typeof dataclass == "string" && dataclass == "pageHeader")
html += "<span  class='page_section_header_text'>";
html += dtltext; 
if (typeof dataclass == "string" && dataclass == "pageHeader")
html += "</span>";
html += "</td>";
}
if (typeof dataclass == "string" && dataclass == "pageHeader")
html += "<td width='4' height='22' class='page_section_header_right'><span class='page_section_header_right'><img src='" + 
cfgCAISD + "/img/spacer.png' width='4' height='22' alt=''></span></td></tr></table>";
if ( typeof showbarimg == "string" && showbarimg == "yes" )	{
html += "<tr>";
html += "<td valign=top>";
html += "<img SRC='" + cfgCAISD + "/img/bar.gif' WIDTH='100%' HEIGHT='4' ALT=''> <br>";
html += "</td></tr>";
}
docWriteln( html );
return html;
}
function detailSurvey( questionid,questionmultiflag,answerid,
answerwtg,answertext,displayview,parentsequence,
answerselected,colspan )
{
var html = "";
var localMax=Number(0);
var localMin=Number(-1);
var frm=document.frm001;
var attr_name="q"+questionid;
if ( typeof colspan != "number" )
colspan = 1;
if ( typeof frm == "object" && frm != null 
&& typeof frm.elements["localMax"] != "undefined"
&& typeof frm.elements["localMin"] != "undefined" ) {
localMax = frm.elements["localMax"].value;
localMin = frm.elements["localMin"].value
if ( questionmultiflag == 1) {
localMax = Number( localMax ) + Number( answerwtg );
}
else{
if ( Number( answerwtg ) > localMax ) {
localMax = Number( answerwtg );
}
}
if ( Number( answerwtg ) < Number( localMin ) || Number( localMin ) == -1) {
localMin = Number( answerwtg );
}
frm.elements["localMax"].value = Number( localMax );
frm.elements["localMin"].value = Number( localMin );
}
html += "<tr>";
html += "<td align=left valign=top class=labeltext>";
if(displayview != "undefined" && typeof displayview == "string" ) {
if( questionmultiflag == '1' ) {
html += "<INPUT " + detailNextID(colspan,false,attr_name) + 
" type='checkbox' name='q" + questionid + "' value='" + answerid + "'";
if( displayview == "doview" || displayview == "viewsubmitted" )
html += " onclick='ck_req(idx" + parentsequence + ",this.name);' ";
if( displayview == "viewsubmitted" ) {
if( answerselected != "undefined" && answerselected == "1")
html += " checked";
html += " disabled=true>" + answertext;
} else if( displayview == "preview" )
html += ">" + answertext + "<b> (" + answerwtg + ")</b>";
else if( displayview == "doview" )
html += " >" + answertext;
} else {
html += "<INPUT " + detailNextID(colspan,false,attr_name) +
" type='radio' name='q" + questionid + "' value='" + answerid + "'";
if(displayview=="doview" || displayview=="viewsubmitted")
html += " onclick='ck_req(idx" + parentsequence + ",this.name);'";
if( displayview == "viewsubmitted" ) {
if( answerselected != "undefined" && answerselected == "1" )
html += " checked";
html += " disabled=true>" + answertext;
}
else if( displayview == "preview" )
html += ">" + answertext + "<b> (" + answerwtg + ")</b>";
else if( displayview == "doview" )
html += " >" + answertext;
}
}
html += "</td></tr>";
document.write( html );
}
function detailRadio(hdr, code ,title, attr, attr_id, sameRow, class_name)
{
var i;
detailRowHdr(hdr,3); 
var set_attr;
var sel_arr = new Array();
var form_name = detailCurrForm(); 
var onClick = ''; 
var radioEvents = '';	
var eh = '';
if ( attr.toLowerCase() == "n/a" ) {
set_attr = "SET.action";
attr="action";
} 
else {
set_attr = "SET."+attr;
}
for( i = 7; i < arguments.length; i++){	
sel_arr[sel_arr.length] = nx_unescape(arguments[i]);}
if ( typeof code != "string" || code == '' || code > sel_arr.length ){
code = 0;}
if (!_dtl.edit)	{	
detailSetReadonlyRowData( attr, sel_arr[code] );}	
else{
var html= "";
html += '<input type=hidden id="'+set_attr+'" name="'+set_attr+'" value=' + code + '>\n';
for (	i = 0; i < sel_arr.length; i ++ ){
if (attr == "action")
html += '<input type=radio name="ACTIONS"';
else
html += '<input type=radio name="'+attr+'"';
if ( typeof attr_id == "string" && attr_id != '' ) {
html += ' id="' + attr_id + i + '" ';
}	
html += 'title="' + sel_arr[i] +
'" tabIndex=' + _dtl.tabIndex;	
onClick = ''; 
radioEvents = '';	
if (code == i ) {
html+= ' checked = true';
}
eh = _dtl.eventHandler;
onClick = 'setRadioAttrValue('+i+',\''+set_attr+'\')';
if ( eh.length == 0 )
radioEvents = "onClick=\"" + onClick + "\" ";
else if ( ! eh.match(/^(.*onClick=\\?)(['"'])(.*)$/i) )
radioEvents += " onClick=\"" + onClick + "\" ";
else
radioEvents = RegExp.$1 + RegExp.$2 + onClick + ";" + RegExp.$3;
html += ' '+radioEvents+'>';
if (typeof class_name == "string" && class_name != '' ) {
html += '<span class="' + class_name + '">';
}
else 
html += '<span class=labeltext>';
html += sel_arr[i] + '</span>\n'	;
if((i < sel_arr.length-1) && !sameRow) {
html+='<br><br>';}	
}
detailSetRowData(html);}
}
function setRadioAttrValue(code, set_attr)
{
var form_name = detailCurrForm(); 
var ele = document.forms[form_name].elements[set_attr];
ele.value = code;
}
function detailLrelMultiselbox(rec_count,total,current,direct_index,colspan)
{
var p = parent.opener;
var hdrtext = "";
var rowData = "";
var label2 = p.lrel_label2.replace(/\<BR\>/g," ");
direct_index = direct_index.replace(/\&gt;/g,">");
direct_index = direct_index.replace(/\&lt;/g,"<");
if (p.search_lrel_form == 0)
form_title = label2 + " - " + msgtext("Update");
else
form_title = label2 + " - " + msgtext("Search");
hdrtext = p.lrel_label1 +"<br>"+ rec_count;
if(rec_count == 1)
hdrtext += " " + msgtext("Match");
else
hdrtext += " " + msgtext("Matches");
if( total > 1 )
hdrtext += ('<br>' + current + msgtext("of") + total +"");
if ( typeof colspan != "number" )
colspan = 1;
rowData = '<td colspan=' + colspan + 'align="center" valign=top><table class=multi_list_selection cellspacing=0 align=center width=100% summary="' + form_title + '">';
rowData += '<tr>';
rowData += '<th width=45% class=detailro align=center valign=top>' + hdrtext + '</th>';
rowData += '<th id=midLabel width=10% class=detailro align=center valign=middle>&#160;</th>';
hdrtext = label2 + "<br>" + p.new_list.length;
rowData += '<th id=rhsLabel width=45% class=detailro align=center valign=top>' + hdrtext + '</th>';
rowData += '</tr>';
document.write(rowData);
rowData = '<tr ID="lrel_list">';
rowData += '<td align=center>';
rowData += "<select multiple id=lhs name=lhs size=" + p.sel_box_size + 
" onFocus=\"this.className='focusField'\"" +
" onBlur=\"this.className=''\">";
for ( var i = 0; i < p.pick_list.length; i++)
{
if (i == 0)
rowData += "<option selected value=\"" + p.pick_list[i].common_name + "\">";
else 
rowData += "<option value=\"" + p.pick_list[i].common_name + "\">";
rowData += p.pick_list[i].disp_val + "</option>";
}
rowData += "</select>";
rowData += '</td>';
document.write(rowData);
_dtl.doingLabelButton = true;
document.write('<td align=center>');
ImgBtnCreate("btn002", ">>[>]", "parent.opener.add_entry()", true, 0, msgtext("Add_to_selection"));
document.write('<br>');
ImgBtnCreate("btn003", "<<[<]", "parent.opener.remove_entry()", true, 0, msgtext("Remove_from_selection"));
document.write('</td>');
rowData = '<td align=center>';
rowData += "<select multiple id=rhs name=rhs size=" + p.sel_box_size + 
" onFocus=\"this.className='focusField'\"" +
" onBlur=\"this.className=''\">";
if (_browser.supportsLayers)
{
rowData += "<option value='dummy'>----&gt;"+msgtext("Loading...")+"&lt;----</option>";
}
else 
{
for ( i = 0; i < p.new_list.length; i++)
{
rowData += "<option value=\"" + p.new_list[i].common_name;
rowData += "\">" + p.new_list[i].common_name + "</option>";
}
}
rowData += "</select>";
if (_browser.supportsLayers)
{
var opts = document.main_form.rhs.options;
if (!p.new_list.length)
{
opts[0] = null;
}
else 
{
var aname;
var new_opt;
for ( i = 0; i < p.new_list.length; i++)
{
aname = p.new_list[i].common_name;
new_opt = new Option(aname, aname, false, false);
opts[i] = new_opt;
}
}
}
rowData += '</td></tr>';
rowData += '<tr><td class=detailro>';
if(total > 1)
rowData += '<center>'+ direct_index + '</center>';
rowData += '</td>'
rowData += '<td>&#160;</td><td>&#160;</td>';
rowData += '</tr>';
rowData += '<tr>';
document.write(rowData);
document.write('<td align=center>');
ImgBtnCreate("btn004", "Clear_Selection[l]", "parent.opener.unsel1()", true, 0, msgtext("Clear_selection_in_source_list"));
document.write('</td>');
document.write('<td>&#160;</td>');
document.write('<td align=center>');
ImgBtnCreate("btn005", "Clear_Selection[t]", "parent.opener.unsel2()", true, 0, msgtext("Clear_selection_in_selected_li"));
document.write('</td></tr>');
document.write('</table><br><br></td>');
_dtl.doingLabelButton = false;
}
/**
* Clears error messages
*/
function clearErrorMsgs(){
var alertmsg = document.getElementById("alertmsg");
if ( alertmsg != null ) {
alertmsg.style.display = "none";
alertmsg = "";
adjScrollDivHeight();
}
for ( var i = 0; i < _dtl.fieldToValidate.length; i++ ) {
v = _dtl.fieldToValidate[i];
e = document.getElementById(v.id);
if( typeof e == "object" && e != null )
e.className = "";
}
}
function populate_autosuggest_array(obj_type, attr_name, common_name_attr, extraURL, is_contact, autoComplete_parameter, currID)
{
var tmp_obj = new Object();
tmp_obj.obj_type = obj_type;
tmp_obj.backfill_field = attr_name;
tmp_obj.common_name = common_name_attr;
tmp_obj.extraURL = extraURL;
tmp_obj.is_contact = is_contact;
tmp_obj.autoComplete_parameter = autoComplete_parameter;
autosuggest_arr[currID] = new Object();
autosuggest_arr[currID] = tmp_obj;
}
