// Copyright (c) 2005 CA.  All rights reserved.
var foldersTree = void(0);
var hierObj = void(0);
var hierFirst = void(0);
function HierAddLine( level_name, common_name, desc, rel_attr, persid,
is_node, has_children, tenant, tenantName )
{
rel_attr = nx_unescape(rel_attr);
if ( typeof hierObj.currFolder != "object" ) {
if ( ! HierStart(level_name) ) {
hierFirst = arguments;
return;
}
}
if ( HierShowFirst(common_name) ) {
if ( level_name.match(/^ *$/) ) {
var info = HierBuildInfo( common_name, common_name, desc,
rel_attr, persid, "1", "2" );
hierObj.currFolder = info.entry;
HierSetCurrName(common_name);
}
else {
HierBuildInfo( level_name, common_name, desc,
rel_attr, persid, is_node, has_children,
tenant, tenantName );
}
}
return;
}
function HierShowFirst(common_name)
{
if ( typeof hierObj.currFolder != "object" ) {
if ( hierObj.rxFilter == null )
HierStart("");
else {
if ( typeof parent == "object" )
parent.nomatchHierKey = hierObj.origHierKey;
HierShowEntireTree();
return false;
}
}
if ( typeof hierFirst == "object" ) {
HierBuildInfo( hierFirst[0], hierFirst[1], hierFirst[2],
hierFirst[3], hierFirst[4], hierFirst[5],
hierFirst[6], hierFirst[7], hierFirst[8] );
hierFirst = void(0);
}
return true;
}
function HierSetCurrFolder(index)
{
if ( typeof index == "number" &&
index < hierObj.itemInfo.length &&
index >= 0 ) {
hierObj.currParent = hierObj.itemInfo[index];
hierObj.currFolder = hierObj.currParent.entry;
HierSetCurrName(hierObj.currParent.level_name);
}
}
function HierRedraw()
{
displayChildren(hierObj.currFolder);
hierObj.currParent.children_loaded = true;
hierObj.currParent.entry.setState(1);
}
function HierInsert( level_name, common_name, desc, rel_attr, persid,
is_node, has_children, tenant, tenantName)
{
if ( ! level_name.match(/^ *$/) &&
level_name != hierObj.currName )
HierBuildInfo( level_name, common_name, desc,
rel_attr, persid, is_node, has_children,
tenant, tenantName );
}
function HierBuildInfo( level_name, common_name, desc, rel_attr, persid,
is_node, has_children, tenant, tenantName )
{
var info, itemInfoID, newEntry, display_name = level_name;
if ( hierObj.rxCurrName != null ) {
if ( level_name.match(hierObj.rxCurrName) )
display_name = level_name.slice(hierObj.currName.length+1);
else
display_name = level_name;
}
if ( has_children == "0" ) {
itemInfoID = hierObj.itemInfo.length;
if ( is_node == "0" ) {
var x = common_name.indexOf(level_name + ahdtop.propHierDlm);
if ( x == 0 ) {
display_name += common_name.substr(level_name.length);
is_node = "1";
}
}
if ( argFactoryTenancy != "0" &&
tenantName.length > 0 ) {
if ( cfgAccessTenantRestriction != "1" ) {
desc = msgtext("tenant_%1",tenantName) + desc;
}
else if ( itemInfoID > 0 &&
is_node == "1" &&
hierObj.itemInfo[itemInfoID-1].is_node &&
hierObj.itemInfo[itemInfoID-1].sym == common_name ) {
info = hierObj.itemInfo[itemInfoID-1];
info.rel_attr = rel_attr;
info.persid = persid;
info.desc = nx_unescape(desc);
info.tenant = tenant;
info.tenantName = tenantName;
return;
}
}
newEntry = new Item( nx_unescape(display_name),
"", "", itemInfoID, "" );
insDoc( hierObj.currFolder, newEntry );
}
else {
itemInfoID = hierObj.itemInfo.length;
newEntry = new Folder( nx_unescape(display_name), itemInfoID );
insFld( hierObj.currFolder, newEntry );
}
if ( typeof itemInfoID == "number" ) {
info = new Object();
info.level_name = level_name;
info.rel_attr = rel_attr;
info.persid = persid;
info.sym = common_name;
info.desc = nx_unescape(desc);
info.is_node = ( is_node == "1" );
info.children_loaded = ( has_children != "1" );
if ( ahdtop.cfgMultiTenancy != "off" ) {
info.tenant = tenant;
info.tenantName = tenantName;
}
info.entry = newEntry;
hierObj.itemInfo[itemInfoID] = info;
}
return info;
}
function HierLoadRequired(index)
{
if ( typeof index == "number" &&
index < hierObj.itemInfo.length &&
index >= 0 ) {
var info = hierObj.itemInfo[index];
if ( ! info.children_loaded ) {
if ( ! action_in_progress() ) {
var esc_level_name = nx_escape(info.level_name);
var modified_level_name = esc_level_name.replace(/\+/,"%2B");
var esc_filter = nx_escape(hierObj.filter);
var modified_filter = esc_filter.replace(/\+/,"%2B");
var url = cfgCgi + "?SID=" + cfgSID +
"+FID=" + cfgFID +
"+OP=DISPLAY_FORM+HTMPL=hierload_" + argFactory + ".htmpl" +
"+KEEP.HierKey=" +
modified_level_name + ahdtop.propHierDlm +
"+KEEP.HierFilter=" + modified_filter +
"+KEEP.Index=" + index;
set_action_in_progress(ACTN_FILLFORM);
ahdframeset.workframe.location.href = url;
}
return true;
}
}
return false;
}
function HierBackfill(index)
{
HierCloseMOPreview();
if ( index < hierObj.itemInfo.length &&
index >= 0 ) {
var info = hierObj.itemInfo[index];
if ( argFactory == "KCAT" )
return CatTreeOnClick(info);
else
backfill( nx_unescape(info.sym), info.persid, info.rel_attr,
info.tenant, info.tenantName );
}
}
function HierSetCurrName(value)
{
hierObj.currName = value;
if ( value.length == 0 )
hierObj.rxCurrName = null;
else {
value = value.replace(/([\\|\(\)\[\]\{\}\^\$\*\+\.])/g, "\\$1");
var dlm = ahdtop.propHierDlm;
var rxDlm = dlm.replace(/([\\|\(\)\[\]\{\}\^\$\*\+\.])/g, "\\$1");
if ( dlm.length > 1 )
rxDlm = "[" + rxDlm + "]";
for ( var i = value.length - 1; i >= 0; i-- ) {
var d = value.substring(i,i+1);
if ( dlm.indexOf(d) != -1 ) {
if ( i > 0 &&
value.substring(i-1,i) == '\\' )
value = value.substring(0,i-1) + rxDlm +
value.substring(i+1);
else
value = value.substring(0,i) + rxDlm +
value.substring(i+1);
}
}
value = "^" + value + rxDlm;
if ( ahdtop.propHierCaseSensitive )
hierObj.rxCurrName = new RegExp(value);
else
hierObj.rxCurrName = new RegExp(value,"i");
}
}
function HierIsNode(index)
{
if ( typeof index == "number" &&
index < hierObj.itemInfo.length &&
index >= 0 ) {
var info = hierObj.itemInfo[index];
return info.is_node;
}
return false;
}
function HierDesc(index)
{
if ( typeof index == "number" &&
index < hierObj.itemInfo.length &&
index >= 0 ) {
var info = hierObj.itemInfo[index];
if ( info.desc != nx_unescape(info.sym) )
return info.desc;
}
return "";
}
function HierHideMenu(e)
{
if ( typeof hierObj.ctxMenu == "object" && hierObj.ctxMenu )
hierObj.ctxMenu.hide();
}
function HierInit(treetop_txt, alertmsg, hierKey)
{
hierObj = new Object();
hierObj.treetop_txt = treetop_txt.replace(/&#39;/g, "'");
hierObj.alertmsg = alertmsg.replace(/&#39;/g, "'");
hierObj.itemInfo = new Array();
hierObj.currentID = -1;
hierObj.currentName = "";
hierObj.currParent = null;
hierObj.origHierKey = hierKey;
if ( hierKey.match(/^ *$/) ) {
hierObj.filter = "";
hierObj.rxFilter = null;
}
else {
hierObj.filter = hierKey;
var rxKey = hierKey.replace(/([\\|\(\)\[\]\{\}\^\$\*\+\.])/g, "\\$1");
if ( rxKey.indexOf("%") != -1 )
rxKey = rxKey.replace(/%/g,"[^\.]*");
else
rxKey = rxKey + "[^\.]*";
if ( ahdtop.propHierCaseSensitive )
hierObj.rxFilter = new RegExp(rxKey);
else
hierObj.rxFilter = new RegExp(rxKey,"i");
}
var ctxMenu = void(0);
if (typeof cfgUserType != "string" ||
(cfgUserType != "employee" && cfgUserType != "customer"))
{
if ( argFactory == "KCAT" )
ctxMenu = SetCatTreeMenu();
else {
var ctxMenu = new ContextMenu("idHierSearchInfo");
ctxMenu.addItem(msgtext("Select"),
"HierBackfill(self.hierObj.currentID)");
ctxMenu.addItem(msgtext("View_Detail"),
"HierShowDetail(self.hierObj.currentID)");
ctxMenu.finish();
}
}
hierObj.ctxMenu = ctxMenu;
}
function HierStart(level_name)
{
if ( hierObj.rxFilter != null ) {
docWriteln("<CENTER>");
ImgBtnCreate("btn001", "Show_Entire_Tree",
"HierShowEntireTree()", true, 0 );
docWriteln("</CENTER><BR>");
}
/*    var out = '<TABLE WIDTH="100%" CLASS=alertmsg><TR><TD>';
if ( typeof parent == "object" &&
typeof parent.nomatchHierKey == "string" ) {
if ( parent.nomatchHierKey.length > 0 ) 
out += msgtext("No_matches_found_for_\_%1\_",parent.nomatchHierKey) + "<BR>";
parent.nomatchHierKey = void(0);
}
out += hierObj.alertmsg + "</TD></TR></TABLE>";
docWriteln(out);
*/
foldersTree = createRootFolder(hierObj.treetop_txt, "hierSelect");
hierObj.currFolder = foldersTree;
HierSetCurrName("");
return ( hierObj.rxFilter == null || level_name.match(/^ *$/) );
}
function HierShowDetail(index)
{
if (index < hierObj.itemInfo.length ) {
var info = hierObj.itemInfo[index];
var factory = info.persid.substr(0, info.persid.indexOf(":"));
var url = cfgCgi +
"?SID=" + cfgSID +
"+FID=" + fid_generator().toString() +
"+OP=SHOW_DETAIL" + 
"+FACTORY=" + factory +
"+PERSID=" + nx_escape(info.persid);
var features = "directories=no" +
",location=no" +
",menubar=no" +
",status=no";
preparePopup(url, "", features);
}
}
function HierShowMenu(e, bid, assoc, delay)
{
hierObj.currentID = bid;
if ( typeof hierObj.ctxMenu == "object" )
hierObj.ctxMenu.show(e,assoc,delay);	
}
function HierShowEntireTree()
{
var url = document.URL;
if ( url.match(/(.*HierKey=)[^\+]*(\+.*)$/) )
url = RegExp.$1 + RegExp.$2;
replace_page( url );
}
function HierShowMOPreview(bid)
{
startMOPreviewTimeout(hierObj.itemInfo[bid].persid);
}
function HierCancelBuildingMOPreview()
{
cancelBuildingMOPreview();
}
function HierCloseMOPreview()
{
if (ahdtop.cfgUserType == "analyst" && ! ahdtop.cstDisablePreviews) {
closeMOPreview();
}
}
