// Copyright (c) 2005 CA.  All rights reserved.
var folderTrees = void(0);
var knowledge_window = void(0);
var knowledge_url = "";
function createRootFolder(default_root_str)
{
//alert(usq_owner_sym);
if ((typeof usq_owner_sym != "undefined") &&
(usq_owner_sym != ""))
{
return new Folder("<B>" + usq_owner_sym + "<B>");
}
return new Folder(default_root_str);
}
function Folder(folderDescription, folderId, hreference) {
//alert(folderDescription);
this.desc = folderDescription;
this.backend_id = folderId;
this.href = hreference;
this.children = new Array();
}
Folder.prototype.children = void(0);
Folder.prototype.nChildren = 0;
Folder.prototype.addChild = function(childNode)
{
this.children[this.nChildren] = childNode;
this.nChildren++;
return childNode;
}
function Item(itemDescription, itemCount, itemLink, itemID, itemCode) {
this.desc = itemDescription;
this.count = itemCount;
this.link = itemLink;
this.id = itemID;	
this.code = itemCode;	
}
function insFld(parentFolder, childFolder) 
{ 
//document.write("<p class=\"scoreboardCell\"><a href=\"javascript:OpenContract(\'"+childFolder.desc+"\')\">"+childFolder.desc+"</a></p>");
newEntry = new Item( nx_unescape(childFolder.desc), "", "", "", "f");
parentFolder.addChild(newEntry);


if ((void(0) === foldersTree))
{
	return parentFolder;
}
else
{
	return foldersTree;
}
} 
function insDoc(parentFolder, document) {
parentFolder.addChild(document);	
}
function doLink(id) {
var url = cfgCgi +
"?SID=" + cfgSID +
"+FID=" + fid_generator() +
"+" + foldersTree.children[id].link;
window.location.href = url;
}
function initializeDocument() {
	var out = "";
	var className;
	
	if (cfgUserType == "customer")
		className = "cst";
	else if (cfgUserType == "employee")
		className = "emp";
	
	// 20130926 bmalz @ e-xim
	var Category = CategoryRoot;
	var CategoryFlag = false;
	
	for (var e = 0; e < foldersTree.nChildren; e++)
	{
		var i = foldersTree.children[e];
		if (i.code == "f") {
			// 20130926 bmalz @ e-xim
			if (Category == '') {
				out += "<p class=\"scoreboardCell\"><a href=\"javascript:OpenContract(\'"+i.desc+"\')\">"+i.desc+"</a></p>";
				CategoryFlag = true;
			} else {
				if (i.desc.toLowerCase() == Category.toLowerCase()) {
					out += "<p class=\"scoreboardCell\"><a href=\"javascript:OpenContract(\'"+i.desc+"\')\">"+i.desc+"</a></p>";
					CategoryFlag = true;
				} else {
					CategoryFlag = false;
				}
			}
		} else {
			if (CategoryFlag) { // 20130926 bmalz @ e-xim
				var sTmp = i.desc;
				sTmp = sTmp.replace("'", "\'");
				sTmp = msgtext("You_have_%1_%2", i.count, sTmp)
				var tmp_msg;
				
				if (sTmp.indexOf("'") != -1 || sTmp.indexOf("\"") != -1)
					tmp_msg = "";
				else
					tmp_msg = sTmp;
					
				var is_cr = false;
				var is_chg = false;
				var is_inc = false;
				var temp_var = nx_unescape(foldersTree.children[String(e)].link);
				temp_var = temp_var.replace(/\s*/g, "");
				temp_var = temp_var.toLowerCase();
				if (temp_var.indexOf("factory=cr") != -1)
				{
					if (temp_var.indexOf("type='i'") != -1)
					{
						is_inc = true;
					}
					else
					{
						is_cr = true;
					}
				}
				
				if (temp_var.indexOf("factory=chg") != -1)
				{
					is_chg = true;
				}
				
				if (cfgUserType == "employee")
				{
					if (ahdtop.cfgNX_EMPLOYEE_INTF_INCIDENT_SUPPORT =="Incident")
					{
						if (!is_cr)
						out += "<a " +
						"class=" + className + " " +
						"href=\"JavaScript: doLink(" + String(e) + ");\" " +
						"onmouseover=\"window.status = '" + tmp_msg + "'; return true;\" " +
						"onmouseout=\"window.status = window.defaultStatus;\"" +
						">" +sTmp + "</a><br>\n"
					}	
					else if (ahdtop.cfgNX_EMPLOYEE_INTF_INCIDENT_SUPPORT =="Request")
					{	
						if (!is_inc)
							out += "<a " +
							"class=" + className + " " +
							"href=\"JavaScript: doLink(" + String(e) + ");\" " +
							"onmouseover=\"window.status = '" + tmp_msg + "'; return true;\" " +
							"onmouseout=\"window.status = window.defaultStatus;\"" +
							">" +sTmp + "</a><br>\n"
					}
					else if (ahdtop.cfgNX_EMPLOYEE_INTF_INCIDENT_SUPPORT =="IncidentandRequest")
					{
						out += "<a " +
						"class=" + className + " " +
						"href=\"JavaScript: doLink(" + String(e) + ");\" " +
						"onmouseover=\"window.status = '" + tmp_msg + "'; return true;\" " +
						"onmouseout=\"window.status = window.defaultStatus;\"" +
						">" +sTmp + "</a><br>\n"
					}	
					else
					{	
						out += "<a " +
						"class=" + className + " " +
						"href=\"JavaScript: doLink(" + String(e) + ");\" " +
						"onmouseover=\"window.status = '" + tmp_msg + "'; return true;\" " +
						"onmouseout=\"window.status = window.defaultStatus;\"" +
						">" +sTmp + "</a><br>\n"	
					}	
				}
				else
				{
					out += "<a " +
					"class=" + className + " " +
					"href=\"JavaScript: doLink(" + String(e) + ");\" " +
					"onmouseover=\"window.status = '" + tmp_msg + "'; return true;\" " +
					"onmouseout=\"window.status = window.defaultStatus;\"" +
					">" +sTmp + "</a><br>\n"
				}
			}				
		}
	}
	
	document.write(out);
	return;
}
function submitMouseOver(factoryName) {
var t;
if (factoryName == "change order")
t = document.forms["frmSearchChg"].elements["number"].value;
else
t = document.forms["frmSearch"].elements["number"].value;
if (t.length <= 0)
window.status = msgtext("You_must_enter_an_%1_number_fi", factoryName);
else
window.status = msgtext("Look_up_%1_#%2", factoryName, String(t));
return true;
}
function doSearch() {
var f = document.forms["frmSearch"];
if (typeof f == "undefined") return false; 
var id = f.elements["number"];
var ref_num = f.elements["QBE.EQ.ref_num"];
if (typeof ref_num == "undefined" || typeof id == "undefined")
return false;
if (id.value.length <= 0) {
if (cfgUserType == "employee")
alertmsg("You_must_enter_a_request_numbe", "request");
else
alertmsg("You_must_enter_an_issue_number", "issue");
return false;
}	
ref_num.value=id.value.replace(/</g,"&lt;");
return true;
}
function doSearchInc(){
var f=document.forms["frmSearchInc"];
if(typeof f=="undefined")return false;
var id=f.elements["number"];
var ref_num=f.elements["QBE.EQ.ref_num"];
if(typeof ref_num=="undefined"||typeof id=="undefined")
return false;
if(id.value.length<=0){
alertmsg("You_must_enter_an_incident_numbe","incident");
return false;
}
ref_num.value=id.value.replace(/</g,"&lt;");
return true;
}
function doSearchChg() {
var f = document.forms["frmSearchChg"];
if (typeof f == "undefined") return false; 
var id = f.elements["number"];
var chg_ref_num = f.elements["QBE.EQ.chg_ref_num"];
if (typeof chg_ref_num == "undefined" || typeof id == "undefined")
return false;
if (id.value.length <= 0) {
alertmsg("You_must_enter_a_change_order_", "change order");	
return false;
}	
chg_ref_num.value=id.value.replace(/</g,"&lt;");
return true;
}
function prompt_for_knowledge(itilinfo)
{
var f = document.forms["frmOpenNew"];
if (typeof cfgPromptForKnowledge == "boolean" && cfgPromptForKnowledge)
{
var alg_preset;
if (propFormRelease == 60 && cfgCIurl == "") 
alg_preset = void(0);
else 
alg_preset = f.elements["ALG_PRESET"].value;
if(typeof alg_preset != "undefined" && 
typeof ahdtop.checked_knowledge=="boolean" && ahdtop.checked_knowledge ==true)
{
alg_preset += ":";
var last_query = document.forms["soln_search"].elements["keywords"].value;
if (last_query.length > 0)
alg_preset += msgtext("Client_tried_searching_for_a_s0", last_query);
else 
alg_preset += msgtext("Client_tried_searching_for_a_s");
alg_preset += ".";
ahdtop.checked_knowledge = false;
f.elements["ALG_PRESET"].value = alg_preset;
f.submit();
}
else
{
if ((typeof knowledge_window == "object") &&
(typeof knowledge_window.closed == "boolean") &&
(knowledge_window.closed == false))
knowledge_window.focus();
else
{
var features = "location=no," +
"menubar=no," +
"resizable," +
"scrollbars=no," +
"status=no," +
"toolbar=no,";
features += "width=600,height=220";
var url = cfgCgi +
"?SID=" + cfgSID +
"+FID=" + fid_generator() +
"+OP=DISPLAY_FORM" +
"+HTMPL=prompt_for_knowledge.htmpl";
if (cfgUserType == "customer")
url += "+FACTORY=iss";
else if (cfgUserType == "employee")
{
url += "+FACTORY=cr";
if (itilinfo == "type:I")
url+="+KEEP.incident=1"; 
}
if ( ahdtop.propDebugOptions != "" )
features = modifyWindowFeaturesForDebug(features);
knowledge_window = window.open(url, "", features);
if (!check_popup_blocker(knowledge_window))
return;
knowledge_window.name = "KNOWLEDGE_PROMPT";
}
}
}
else {
if (propFormRelease != 60 || cfgCIurl != "")
{
f.elements["ALG_PRESET"].value = "";
if (itilinfo != null && itilinfo == "type:I" && typeof f.elements["PRESET"] == "object")
f.elements["PRESET"].value = itilinfo;	
} 
f.submit();
}
}
function prompt_for_knowledge_backfill(keywords, itilinfo)
{
var f = document.forms["frmOpenNew"];
var alg_preset;
if (propFormRelease == 60 && cfgCIurl == "") 
alg_preset = "";
else
alg_preset = f.elements["ALG_PRESET"].value;
alg_preset += ":";
if (typeof document.forms["keywordSearch"] != "undefined" && 
keywords != null)
{
document.forms["keywordSearch"].elements["QBE.IN.ebr_search_text"].value = keywords;
document.forms["keywordSearch"].elements["KEEP.resume_ticket"].value = "1";
if (itilinfo != null && itilinfo == 1)
document.forms["keywordSearch"].elements["KEEP.itilinfo"].value = "1";	
document.forms["keywordSearch"].onsubmit();
return;
}
if(typeof ahdtop.checked_knowledge=="boolean" && ahdtop.checked_knowledge==false)
{
alg_preset += msgtext("Client_did_not_use_the_prompt");
}
else
{
alg_preset += msgtext("Client_tried_searching_for_a_s");
}
if (propFormRelease != 60 || cfgCIurl != "")
f.elements["ALG_PRESET"].value = alg_preset;
create_new_ticket(itilinfo);
}
function create_new_ticket(itilinfo)
{
if(typeof ahdtop.ticketObj == "object")
ahdtop.ticketObj.resetTicket();
var frm = document.forms["frmOpenNew"];
var url=cfgCgi+
"?SID="+cfgSID+
"+FID="+fid_generator();
for(var i=0; i < frm.length; i++)
{
url += "+" + frm.elements[i].name +
"=" + nx_escape(frm.elements[i].value);
}
if (itilinfo != null && (itilinfo == 1 || itilinfo == "type:I"))
url+= "+PRESET=" + nx_escape('type:I');
window.location=url;
}
function close_knowledge_window()
{
if ((typeof knowledge_window == "object") &&
(typeof knowledge_window.closed == "boolean") &&
(knowledge_window.closed == false))
knowledge_window.close();
return true;
}
document.write("<script language=\"JavaScript\" src=\"" + ahdtop.cfgCAISD + "/scripts/ajax.js\"><\/script>");
function check_sa_hours (queue_id) {
var url = cfgCgi +
"?SID=" + cfgSID +
"+FID=" + cfgFID +
"+OP=CHECK_SA_HOURS"
if (typeof queue_id != "undefined" && queue_id != "") {
url += "+sa_queue=" + queue_id;
}
if (typeof ahdtop.cstTenantId != "undefined" && ahdtop.cstTenantId != "") {
url += "+tenant=" + ahdtop.cstTenantId;
}
var req_list = SyncAjaxCall(url);
return ( req_list.match(/1/) );
}
function live_chat_link(itiltype,launchType)
{
if (check_sa_hours () ) {
var url=cfgCgi+
"?SID="+cfgSID+
"+FID="+cfgFID+
"+OP=CREATE_NEW"+
"+FACTORY=sa_user_route"+
"+KEEP.itiltype=" + itiltype+
"+KEEP.launchType=" +launchType;
window.location=url;
}
else {
alert (msgtext("SA_Closed"));	
}
}
