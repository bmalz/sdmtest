// Copyright (c) 2005 CA.  All rights reserved.
var win_width;
var win_height;
var catg_key_obj = void(0);
var catg_key_val = "";
var catg_key_initial_val = void(0);
var catg_set_obj = void(0);
var catg_set_val = "";
var catg_set_initial_val = void(0);
var cawf_defid_old = "";
var cawf_defid = "";
function save_category_value()
{
catg_key_obj = document.forms["main_form"].elements["KEY.category"];
catg_set_obj = document.forms["main_form"].elements["SET.category"];
if ( typeof catg_key_obj == "object" )
catg_key_val = catg_key_obj.value;
else
catg_key_val = "";
catg_set_val = "";
if ( typeof catg_set_obj == "object" ) {
switch ( catg_set_obj.type ) {
case "select-one":
catg_set_val =
catg_set_obj.options[catg_set_obj.selectedIndex].value;
break;
case "text":
case "hidden":
catg_set_val = catg_set_obj.value;
break;
}
}
if ( typeof catg_key_initial_val == "undefined" ) {
catg_key_initial_val = catg_key_val;
catg_set_initial_val = catg_set_val;
}
}
function change_category_func(factory, is_hier, attr_fac, rel_attr, sym)
{
if((typeof _dtl == "object" && _dtl.is_from_autoSuggest == true) || (typeof __search_filter == "object" && __search_filter.is_from_autoSuggest == true))
{	
if(typeof _dtl == "object")
_dtl.is_from_autoSuggest = false;
else
__search_filter.is_from_autoSuggest = false;
return null;
}
if(typeof rel_attr != "undefined" && typeof sym != "undefined")
{
document.forms["main_form"].elements["KEY.category"].value = sym;
document.forms["main_form"].elements["SET.category"].value = rel_attr;
}
if((factory=="cr") &&
(typeof loadFilterArr != "undefined"))
{
loadFilterArr["catFlag"]=0;
}
var ahdtop = get_ahdtop();
if ( typeof ahdtop == "object" && ahdtop != null &&
ahdtop.cfgSuppressHier.indexOf(attr_fac) != -1 )
is_hier = false;
else if ( typeof is_hier != "boolean" )
is_hier = true;
var prev_catg_key_val = catg_key_val;
var prev_catg_set_val = catg_set_val;
save_category_value();
if ( catg_key_val == prev_catg_key_val &&
catg_set_val == prev_catg_set_val )
return;
if ( ahdframe.currentAction != 0 ) {
if ( typeof catg_key_obj == "object" )
catg_key_obj.value = prev_catg_key_val;
if ( typeof catg_set_obj == "object" ) {
switch ( catg_set_obj.type ) {
case "select-one":
for ( var i = 0; i < catg_set_obj.length; i++ ) {
var o = catg_set_obj.options[i];
if ( o.value == prev_catg_set_val ||
prev_catg_set_val.length == 0 ) {
o.selected = 1;
break;
}
}
break;
case "text":
case "hidden":
catg_set_obj.value = prev_catg_set_val;
break;
}
}
save_category_value();
action_in_progress();
return;
}
var change_category = document.forms["main_form"].elements["change_category"];
if (typeof change_category != "undefined")
{
change_category.value = 0;
}
var FID = document.forms["main_form"].elements["FID"].value;
var SID = document.forms["main_form"].elements["SID"].value;
var url = cfgCgi + '?SID=' + SID + '+FID=' + FID + '+OP=UPDATE' +
'+change_category=1+IS_NOT_SAVE=1+FACTORY=' + factory;
var customerid;
switch ( factory ) {
case "cr" :
case "in" :
case "pr" :
if ( typeof document.forms["main_form"]['SET.customer'] != "undefined" ) {
customerid = document.forms["main_form"]['SET.customer'].value;
url += "+SERVICE_CST=" + customerid;
}
break;
case "chg" :
if ( typeof document.forms["main_form"]['SET.affected_contact'] != "undefined" ) {
customerid = document.forms["main_form"]['SET.affected_contact'].value;
url += "+SERVICE_CST=" + customerid;
}
break;
case "iss" :
if ( typeof document.forms["main_form"]['SET.requestor'] != "undefined" ) {
customerid = document.forms["main_form"]['SET.requestor'].value;
url += "+SERVICE_CST=" + customerid;
}
break;
default:
break;
}
if ((typeof cfgCheckAgtInAreaDef != "undefined") && (cfgCheckAgtInAreaDef.toUpperCase() == "YES") &&
(factory == "cr"))
{
var agt_id = document.forms["main_form"].elements["SET.assignee"].value;
var agt_name = document.forms["main_form"].elements["KEY.assignee"].value;
if (agt_id != "" || agt_name != "")
url += "+check_agt=1+agt_id=" + agt_id + "+agt_name=" + agt_name
}
if ( catg_set_val.length > 0 )
url += "+SET.category=" + gsub(nx_escape(catg_set_val), "+", "%2B");
else {
if ( catg_key_val.length > 0 &&
catg_key_val.indexOf("%") == -1 &&
typeof _dtl == "object" &&
_dtl.lastKeycode == TAB ) {
catg_key_val += "%";
document.main_form.elements["KEY.category"].value = catg_key_val;
}
url += "+KEY.category=";
catg_key_val = catg_key_val.replace(/\%/g, "%25");
url += gsub(nx_escape(catg_key_val), "+", "%2B");
}
if ((prev_catg_key_val != "") && (prev_catg_set_val != ""))
detailResetPropertyValidate();
var e;
try {
if ( cfgAccessTenantRestriction != "1" ) 
{
url += "+TWC_TENANT=" + ( argGlobalTenant ? "n/a" : argTenantId );
}
}
catch(e) {}
if ( typeof _dtl == "object" ) {
url += "+HTMPL=load_properties.htmpl";
if ( is_hier )
url += "+IS_HIER=1";
var workframe = ahdframeset.workframe;
var tgt = ahdframe.document.getElementById("propertyDiv");
if ( typeof tgt == "object" && tgt != null &&
typeof workframe == "object" ) {
var lbl;
if ( factory != "cr" )
lbl = msgtext("category");
else
lbl = msgtext("Incident/Problem/Request_Area");
tgt.innerHTML="<span CLASS='labeltext font_normal' >"+
msgtext("Now_loading_properties_for_new",lbl) +
"</span>";
set_action_in_progress(ACTN_LOADPROP);
display_new_page(url, workframe);
}
else if ( tgt == null ) {	
set_action_in_progress(ACTN_LOADPROP);
display_new_page(url, workframe);
}
}
else {
url += "+HTMPL=edit_prop_dyn.htmpl";
set_action_in_progress(ACTN_LOADPROP);
if ( _browser.supportsLayers )
{
url=url.replace(/:/g,"%3A");
document.layers["prop_layer"].src = url;
}
else
{
if (_browser.isIE)
{
display_new_page(url, window.frames["iframe_prop_layer"]);
}
else
{
var ifr = document.getElementById("iframe_prop_layer");
if ( ahdframeset.name != "AHDtop" )
url += "+KEEP.POPUP_NAME=" + ahdframeset.name;
ifr.setAttribute("src", url);
}
}
}
}
var cur_FID;
function copy_FID(from, to)
{
var old_fid = to.elements["FID"].value;
if (to.elements["FID"] && from.elements["FID"])
{
if (from.elements["FID"].value)
{
var temp = "" + from.elements["FID"].value;
var pat = /\D/;
if (pat.exec(temp))
{
to.elements["FID"].value = cur_FID;
}
else
{
to.elements["FID"].value = from.elements["FID"].value;
cur_FID = from.elements["FID"].value;
}
}
else
if (cur_FID)
{
to.elements["FID"].value = cur_FID;
}
}
}
function reset_vals(from)
{
if ( typeof from != "object" ) {
if ( _browser.supportsLayers )
{
from = document.layers["prop_layer"].document.forms[0];
}
else
{
var innerHTML = window.frames["iframe_prop_layer"].document.getElementById("new_prop_layer").innerHTML;
document.getElementById("span_prop_layer").innerHTML = innerHTML;
from = window.frames["iframe_prop_layer"].document.forms[0];
}
}
var to = document.forms["main_form"];
copy_FID(from, to);
copy_field_val("assignee", from, to, "agt");
copy_field_val("group", from, to, "grp");
copy_field_val("organization", from, to, "");
/* Following Line added by permo03 for copying cab field from category*/
copy_field_val("cab",from,to,"grp");
/*End of permo03 addition*/
copy_field_val("chgtype", from, to, "chgtype");
if ("iss" == propFactory || "chg" == propFactory || "cr" == propFactory ||
"in" == propFactory || "pr" == propFactory) {
cawf_defid_old = cawf_defid ;
copy_field_val("catg_cawf_defid", from, to, "");
}
if ("iss" == propFactory || "chg" == propFactory || "cr" == propFactory ||
"in" == propFactory || "pr" == propFactory) {
copy_field_val("category_contract", from, to, "");
}
if (reset_flag)
{
reset_flag = 0;
reset_props(1);
save_initial_vals();
}
popup_category_list(from, to);
var wf_message = document.getElementById("T13B343");
if (wf_message != null) {
wf_message.style.display = "block";
}
set_action_in_progress(ACTN_COMPLETE);
}
var assignee_initial_val;
var group_initial_val;
var organization_initial_val;
var chgtype_initial_val;
var props = new Array();
var reset_flag = 0;
function save_initial_vals()
{
var ele_obj = document.forms["main_form"].elements;
if (typeof ele_obj["assignee_combo_name"] != "undefined")
{
assignee_initial_val = ele_obj["assignee_combo_name"].value;
}
if (typeof ele_obj["group_combo_name"] != "undefined")
{
group_initial_val = ele_obj["group_combo_name"].value;
}
if(typeof ele_obj["cab_combo_name"]!="undefined")
{
cab_initial_val=ele_obj["cab_combo_name"].value;
}
organization_initial_val = key_or_set_init(ele_obj, "organization");
chgtype_initial_val = key_or_set_init(ele_obj, "chgtype");
reset_props(0);
save_category_value();
}
function key_or_set_init(ele_obj, field_name)
{
var set_name = "SET." + field_name;
var key_name = "KEY." + field_name;
var initial_val = "";
if (typeof ele_obj[set_name] != "undefined" &&
((ele_obj[set_name].type == "select-one") ||
(ele_obj[set_name].type == "text")))
{
if (ele_obj[set_name].type == "select-one")
{
var idx = ele_obj[set_name].selectedIndex;
initial_val = ele_obj[set_name].options[idx].value;
}
else
if (ele_obj[set_name].type == "text")
{
initial_val = ele_obj[set_name].value;
}
}
else
if (typeof ele_obj[key_name] != "undefined")
{
initial_val = ele_obj[key_name].value;
}
return initial_val;
}
function reset_props(reset)
{
var eles;
if ( _browser.supportsLayers == true )
{
eles = document.layers["prop_layer"].document.forms[0].elements;
}
else
{
eles = document.forms[0].elements;
}
var i;
var tmp_str;
var end = 23;
if (reset)
{
end = props.length;
}
for (i = 0; i < end; i++)
{
tmp_str = "SET.prop" + i + ".value";
if (typeof eles[tmp_str] == "undefined")
{
break;
}
if (reset)
{
eles[tmp_str].value = props[i];
}
else
{
props[i] = eles[tmp_str].value;
}
}
}
function copy_field_val(field_name, from, to, field_type)
{
if ((field_type == "agt") || (field_type == "grp"))
{
var cname = field_name + "_combo_name";
var ele_obj=document.forms["main_form"].elements;
var group_combo_field=ele_obj[field_name+"_combo_name"];
var cab_combo_field=ele_obj[field_name+"_combo_name"];	
var assignee_combo_field=ele_obj[field_name+"_combo_name"];
if (typeof to.elements[cname]=="undefined") return;
if (to.elements[cname].value != eval(field_name + "_initial_val"))
{
return;
}
var lname;
var fname;
var mname;
if (field_type == "agt")
{
fname = field_name + "_fname";
mname = field_name + "_mname";
to.elements[fname].value = from.elements[fname + "_new"].value;
to.elements[mname].value = from.elements[mname + "_new"].value;
}
lname = field_name + "_lname";
to.elements[lname].value = from.elements[lname + "_new"].value;
window.set_combo_name("main_form", field_name);
if (field_type == "agt")
{
var agt_idname = field_name + "_id_new";
if (typeof from.elements[agt_idname] != "undefined")
to.elements["SET." + field_name].value = from.elements[agt_idname].value; 
}
var idname = field_name + "_id_new";
if ( field_name == "group")
{
if(typeof group_combo_field=="object")
group_combo_field.value=ele_obj[field_name+"_lname"].value;
if (typeof from.elements[idname] != "undefined")
to.elements["SET." + field_name].value = from.elements[idname].value; 
}
if ( field_name == "cab")
{
if(typeof cab_combo_field=="object")
cab_combo_field.value=ele_obj[field_name+"_lname"].value;
if (typeof from.elements[idname] != "undefined")
to.elements["SET." + field_name].value = from.elements[idname].value; 
}	
if ( field_name == "assignee")
{
if(typeof assignee_combo_field=="object")
{
assignee_combo_field.value=ele_obj[field_name+"_lname"].value;	
if(ele_obj[field_name+"_fname"].value)
{
assignee_combo_field.value += ", ";
assignee_combo_field.value += ele_obj[field_name+"_fname"].value;
}
if(ele_obj[field_name+"_mname"].value)
{
assignee_combo_field.value += ", ";
assignee_combo_field.value += ele_obj[field_name+"_mname"].value;
}
}
}
var tmp_val = gsub(to.elements[cname].value, "'", "\\\'");
eval(field_name + "_initial_val = '" + tmp_val + "';");
if ((field_type == "grp") &&
(typeof cfgCheckAgtInAreaDef != "undefined") && (cfgCheckAgtInAreaDef.toUpperCase() == "YES") &&
(typeof from.elements[idname] != "undefined"))
{
var f = document.main_form;
var cnt_id = from.elements[idname].value;
detailAgtCheck(f, "group", cnt_id, prop_ref);
}
}
else
{
var set_name = "SET." + field_name;
var key_name = "KEY." + field_name;
if (typeof from.elements[set_name + "_new"] == "undefined")
{
return;
}
if (typeof to.elements[set_name] != "undefined" &&
((to.elements[set_name].type == "select-one") ||
(to.elements[set_name].type == "text")))
{
if (to.elements[set_name].type == "select-one")
{
var i;
var options = to.elements[set_name].options;
var idx = to.elements[set_name].selectedIndex;
if (options[idx].value != eval(field_name + "_initial_val"))
{
return;
}
var value = from.elements[set_name + "_new"].value;
for (i = 0; i < options.length; i++)
{
if (options[i].value == value)
{
break;
}
}
if (i < options.length)
{
to.elements[set_name].selectedIndex = i;
var o_val = gsub(options[i].value, "'", "\\\'");
eval(field_name + "_initial_val = '" + o_val + "';");
}
}
else
if (to.elements[set_name].type == "text")
{
if (to.elements[set_name].value != eval(field_name + "_initial_val"))
{
return;
}
to.elements[set_name].value = from.elements[set_name + "_new"].value;
var set_val = gsub(to.elements[set_name].value, "'", "\\\'");
eval(field_name + "_initial_val = '" + set_val + "';");
}
}
else
if (typeof to.elements[key_name] != "undefined")
{
if (to.elements[key_name].value != eval(field_name + "_initial_val"))
{
return;
}
to.elements[key_name].value = from.elements[key_name+ "_new"].value;
var key_val = gsub(to.elements[key_name].value, "'", "\\\'");
eval(field_name + "_initial_val = '" + key_val + "';");
} else if (typeof to.elements[field_name] != "undefined" && typeof from.elements[set_name+ "_new"] != "undefined") {
to.elements[field_name].value = from.elements[set_name+ "_new"].value;
cawf_defid = to.elements[field_name].value;
if(_dtl.edit && typeof change_visibility == "function"){
if (cawf_defid != cawf_defid_old)
change_visibility();
}
}
}
}
function popup_category_list(from, to)
{
var cur_category = to.elements["KEY.category"];
var cur_set_category = to.elements["SET.category"];
var new_category = from.elements["new_category"];
var new_set_category = from.elements["new_set_category"];
var do_popup = from.elements["do_popup"];
if (typeof cur_category == "undefined")
{
return;
}
if ((typeof do_popup == "undefined") || (do_popup.value != "1"))
{
var new_cat_val = nx_unescape(new_category.value);
if ((typeof do_popup != "undefined") && (do_popup.value == "0"))
{
if (new_cat_val != cur_category.value) {
cur_category.value = new_cat_val;
if ( typeof detailSetTenant != "undefined" ) {
var tenantId = from.elements["tenantId"];
if ( typeof tenantId == "object" && tenantId != null ) {
var tenantName = from.elements["tenantName"];
if ( typeof tenantName == "object" && tenantName != null )
detailSetTenant( cur_category.name, 
tenantId.value, tenantName.value );
}
}
}
if (typeof cur_set_category != "undefined" &&
typeof new_set_category != "undefined")
{
var new_set_cat_val = nx_unescape(new_set_category.value);
cur_set_category.value = new_set_cat_val;
}
save_category_value();
}
return;
}
var factory;
var list_form_name;
if (propFormName == "detail_chg_edit.htmpl")
{
factory = "chgcat";
list_form_name = "list_chgcat.htmpl";
}
else
if (propFormName == "detail_cr_edit.htmpl")
{
factory = "pcat";
list_form_name = "list_pcat.htmpl";
}
else
if (propFormName == "detail_iss_edit.htmpl")
{
factory = "isscat";
list_form_name = "list_isscat.htmpl";
}
else
{
return;
}
var change_category = to.elements["change_category"];
if (typeof change_category != "undefined")
{
change_category.value = 1;
}
var category_val = cur_category.value;
if (category_val.indexOf("%") < 0)
{
category_val += "%";
}
var FID = document.forms["main_form"].elements["FID"].value;
var SID = document.forms["main_form"].elements["SID"].value;
var query_str = cfgCgi + '?SID=' + SID + '+FID=' + FID + '+OP=SEARCH' +
'+QBE.IN.sym=' + nx_escape(category_val) +
'+FACTORY=' + factory + '+HTMPL=' + list_form_name +
"+KEEP.IsPopUp=1" + "+KEEP.backfill_field=KEY.category" +
"+KEEP.backfill_form=main_form" + "+KEEP.Is3FieldContact=0";
var name = "";
var features = "location=no" +
",menubar=no" +
",toolbar=no";
if (search_window && !search_window.closed)
{
search_window.focus();
search_window = preparePopup(query_str, name, features);
}
else
search_window = preparePopup(query_str, name, features);
}
function reset_FID()
{
var from = document.layers["prop_layer"].document.forms[0];
var to = document.forms["main_form"];
copy_FID(from, to);
}
function check_category_at_submit(form_name, field_name, label)
{
check_category_field.prototype.cat_check = new check_category_field(form_name, field_name, label);
}
function check_category_field(form_name, field_name, label)
{
this.old_onsubmit = window.document.forms[form_name].onsubmit;
window.document.forms[form_name].onsubmit = check_category_field.check_cat_func;
this.form_name = form_name;
this.field_name = field_name;
this.label= label;
}
check_category_field.check_cat_func = function ()
{
var obj = check_category_field.prototype.cat_check;
var cat_f = window.document.forms[obj.form_name].elements[obj.field_name];
if ((typeof cat_f != "undefined") &&
(cat_f.type == "select-one") &&
(cat_f.options[cat_f.selectedIndex].value == ""))
{
alertmsg("Required_field_%1_is_empty", obj.label);
cat_f.focus();
return false;
}
return ( typeof obj.old_obsubmit == "undefined" ? true : obj.old_onsubmit() );
}
function do_reset(factory)
{
document.forms["main_form"].reset();
if ( typeof catg_key_obj == "object" )
catg_key_obj.value = catg_key_initial_val;
if ( typeof catg_set_obj == "object" ) {
switch ( catg_set_obj.type ) {
case "select-one":
for ( var i = 0; i < catg_set_obj.length; i++ ) {
var o = catg_set_obj.options[i];
if ( o.value == catg_set_initial_val ||
catg_set_initial_val.length == 0 ) {
o.selected = 1;
break;
}
}
break;
case "text":
case "hidden":
catg_set_obj.value = catg_set_initial_val;
break;
}
}
if ( catg_key_val != catg_key_initial_val ||
catg_set_val != catg_set_initial_val ) {
save_category_value();
reset_flag = 1;
change_category_func(factory);
}
else {
save_category_value();
reset_props(1);
}
}
function get_svc_callback(org_id, svc_id) {
	if ((ahdframeset.name == "AHDtop") &&
	(ahdframeset.frames.length > 1))
		next_workframe("UPD_WORKFRAME");	
		
	var cur_catg_contract = document.main_form.category_contract;
	
	document.main_form.elements["user_contract"].value=svc_id; // bmalz @ e-xim
	//svc_id = document.main_form.elements["user_contract"].value;
	
	document.main_form.elements["org_id"].value=org_id;

	if (svc_id == "0") svc_id = "";
		// if (svc_id != cur_catg_contract.value &&
		// (document.main_form.elements["SET.category"].value.length > 0 ||
		// document.main_form.elements["KEY.category"].value.length > 0)) 
		// {
			// var err_msg;
			// if (propFactory == "cr")
			// {
				// err_msg = msgtext("The_current_request_area_can_not_b");
				// if (typeof requestType == "string")
				// {
					// if (requestType == "I")
						// err_msg = msgtext("The_current_incident_area_can_not_b");
					// else 
						// if (requestType == "P")
							// err_msg = msgtext("The_current_problem_area_can_not_b"); 
						// }
			// }
				
			// if (propFactory == "chg" || propFactory == "iss")
				// err_msg = msgtext("The_current_category_can_not_b");
				
			// show_response(err_msg, 15);
			// // return false; // 20130919 bmalz @ e-xim
		// }
	return true;	
}
var asset_key_val = "";
var asset_set_val = "";
function assetChanged()
{
if ( typeof ahdtop.cfgNetresPty != "undefined" &&
ahdtop.cfgNetresPty ) {
if ( ahdframe.currentAction != 0 ) {
if ( typeof ahdframe.resumeAction != "string" ||
ahdframe.resumeAction.length == 0 )
ahdframe.resumeAction = "assetChanged()";
return;
}
var prev_asset_key_val = asset_key_val;
var prev_asset_set_val = asset_set_val;
var formElements = document.forms["main_form"].elements;
asset_key_val = getElementValue(formElements["KEY.affected_resource"]);
asset_set_val = getElementValue(formElements["SET.affected_resource"]);
if ( asset_key_val == prev_asset_key_val &&
asset_set_val == prev_asset_set_val )
return;
var FID = formElements["FID"].value;
var SID = formElements["SID"].value;
var url = cfgCgi + "?SID=" + SID + "+FID=" + FID + 
"+OP=SET_ASSET_NETRES_PTY" +
"+PERSID=" + nx_escape(argPersistentID) +
"+PRIO=" + getElementValue(formElements["SET.priority"]); 
if ( asset_set_val.length > 0 )
url += "+SET.affected_resource=" + asset_set_val;
else 
url += "+KEY.affected_resource=" +
gsub(nx_escape(asset_key_val), "+", "%2B");
set_action_in_progress(ACTN_LOADPROP);
var returnPrio = SyncAjaxCall(url);
returnPrio = rtrim_nonchar(returnPrio);
var prioArr = returnPrio.split("@!@");
var newPrio = prioArr[0];
var asset_uuid = prioArr[1];
var asset_name = prioArr[2]; 
set_action_in_progress(ACTN_COMPLETE);
if ( newPrio != -1 ) {
var prio_obj = document.forms["main_form"].elements["SET.priority"];
if ( typeof prio_obj == "object" && prio_obj.type == "select-one" ) {
for ( var i = prio_obj.options.length - 1; i >= 0; i-- )
if ( prio_obj.options[i].value == newPrio ) {
prio_obj.selectedIndex = i;
break;
}
}
if ( typeof asset_uuid != "undefined" ) {
var formElements = document.forms["main_form"].elements;
var e = formElements["SET.affected_resource"];
if ( typeof e == "object" &&
( e.type == "text" || e.type == "hidden" ) )
e.value = asset_uuid;
var e = formElements["KEY.affected_resource"];
if ( typeof e == "object" &&
( e.type == "text" || e.type == "hidden" ) )
e.value = asset_name;
}
}
}
}
function getElementValue(e)
{
var val = "";
if ( typeof e == "object" && e != null ) {
switch ( e.type ) {
case "select-one":
val = e.options[e.selectedIndex].value;
break;
case "text":
case "hidden":
val = e.value;
break;
}
}
return val;
}
