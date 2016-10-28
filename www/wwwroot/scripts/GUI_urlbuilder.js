// 201306 bmalz @ e-xim

function OpenContract(ContractName)
{
	var fid = fid_generator();
	var url = cfgCgi + "?SID=" + cfgSID + "+FID=" + fid + "+OP=DISPLAY_FORM+HTMPL=home.htmpl+CONTRACT=" + encodeURIComponent(ContractName);
	document.location.href = url;	
}

function NewIncident(ContractName)
{
	var fid = fid_generator();
	var url = cfgCgi + "?SID=" + cfgSID + "+FID=" + fid;
	url += "+OP=CREATE_NEW+FACTORY=cr";
	url += "+PRESET_REL=category:pcat.persistent_id:ss_sym:" + encodeURIComponent(ContractName); // 20130830 bmalz @ e-xim
	url += "+PRESET=type%3AI";
	document.location.href = url;
}

function NewRequest(ContractName)
{
	var fid = fid_generator();
	var url = cfgCgi + "?SID=" + cfgSID + "+FID=" + fid;
	url += "+OP=CREATE_NEW+FACTORY=cr";
	url += "+PRESET_REL=category:pcat.persistent_id:ss_sym:" + encodeURIComponent(ContractName); 
	url += "+PRESET=type%3AR";
	document.location.href = url;
}

function RefreshScratchpad()
{
	var lurl = parent.scratchpad.document.location.href;
	lurl += "+force_refresh="+Math.floor(Math.random()*100);

	parent.scratchpad.document.location.href = lurl;
}

function OpenFavs() {
	var fid = fid_generator();
	var url = cfgCgi + "?SID=" + cfgSID + "+FID=" + fid + "+HTMPL=list_zfav_pcat.htmpl+OP=SEARCH+FACTORY=zfav_pcat+QBE.EQ.id!=0";
	ahdframeset.product.location.href = url;
}

function OpenPops() {
	var fid = fid_generator();
	var url = cfgCgi + "?SID=" + cfgSID + "+FID=" + fid + "+HTMPL=list_zpop_pcat.htmpl+OP=SEARCH+FACTORY=zpop_pcat+QBE.EQ.id!=0";
	ahdframeset.product.location.href = url;
}

function SearchKB(SearchPhrase) {
	var fid = fid_generator();
	var url = cfgCgi + "?SID=" + cfgSID + "+FID=" + fid;
	url += "+OP=SEARCH";
	url += "+FACTORY=KD";
	url += "+HTMPL=list_KD.htmpl";
	url += "+DOMSET=KD_list_ebr_RELEVANCE";
	url += "+ADDITIONAL_WHERE=ACTIVE_STATE%3D0";
	url += "+QBE.EQ.ebr_search_type=KEYWORDS";
	url += "+QBE.EQ.ebr_match_type=ALL";
	url += "+QBE.EQ.ebr_search_in=15";
	url += "+QBE.EQ.ebr_fuzziness=MINI";
	url += "+QBE.EQ.ebr_order=RELEVANCE";
	url += "+QBE.EQ.ebr_primary_order=RELEVANCE";
	url += "+QBE.EQ.ebr_order_direction=DESC";
	url += "+KEEP.categoryRadio=checked";
	url += "+KEEP.categoryID=-1";
	url += "+KEEP.relationalID=1";
	url += "+KEEP.categoryPath=All";
	url += "+KEEP.initial_ebr=1";
	url += "+KEEP.resume_ticket=0";
	url += "+KEEP.itilinfo=0";
	url += "+KEEP.from_bookmark=0";
	url += "+QBE.IN.ebr_search_text=" + encodeURIComponent(SearchPhrase);
	url += "+NO_COUNT=1";
	url += "+QBE.EQ.ebr_add_blc=1";
	parent.frames["product"].window.document.location.href = url;
}

function ShowServiceCatalog() {
	var fid = fid_generator();
	var url = cfgCgi + "?SID=" + cfgSID + "+FID=" + fid + "+OP=DISPLAY_FORM+HTMPL=home.htmpl";
	ahdframeset.product.location.href = url;
}

function ShowAnnouncments() {
	var fid = fid_generator();
	var url = cfgCgi + "?SID=" + cfgSID + "+FID=" + fid + "+OP=DISPLAY_FORM+HTMPL=home.htmpl";
	url += "+ShowAnnouncments=true";
	ahdframeset.product.location.href = url;
}

function ShowMyItems() {
	var fid = fid_generator();
	var url = cfgCgi + "?SID=" + cfgSID + "+FID=" + fid + "+OP=DISPLAY_FORM+HTMPL=myitems.htmpl";
	ahdframeset.product.location.href = url;
}

function ShowMyTasks() {
	var where_clause = "task IN ('TSKAPP', 'CRAPPTSK') AND assignee_agt = U'" + cstID + "'"; // "assignee = U'" + cstID + "' AND task IN ('TSKAPP', 'CRAPPTSK')"; // AND active = 1";
	var fid = fid_generator();
	var url = cfgCgi + "?SID=" + cfgSID + "+FID=" + fid + "+OP=SEARCH+FACTORY=ztask+KEEP.where_clause=";
	url += encodeURIComponent(where_clause);
	ahdframeset.product.location.href = url;

	// var fid = fid_generator();
	// var url = cfgCgi + "?SID=" + cfgSID + "+FID=" + fid + "+OP=DISPLAY_FORM+HTMPL=myitems.htmpl";
	// ahdframeset.product.location.href = url;
}

function OpenMyCategory(Type, Category) {
	var where_clause = "customer = U'" + cstID + "' AND active = 1 AND type = '" + Type + "' AND category.sym like '" + Category + "%'";
	var fid = fid_generator();
	var url = cfgCgi + "?SID=" + cfgSID + "+FID=" + fid + "+OP=SEARCH+FACTORY=cr+KEEP.NoBar=1+KEEP.where_clause=";
	url += encodeURIComponent(where_clause);
	parent.MyItemsList.location.href = url;
}

function SearchMyCategory(phrase, datefrom, dateto) {
	var strdate = "";
	if (datefrom != "" && dateto != "") {
		strdate = " AND (last_mod_dt > " + exim.StringToUnixTimestamp(datefrom) + " AND last_mod_dt < " + exim.StringToUnixTimestamp(dateto) + ")";
	} else if (datefrom != "" && dateto == "") {
		strdate = " AND last_mod_dt > " + exim.StringToUnixTimestamp(datefrom);
	} else if (datefrom == "" && dateto != "") {
		strdate = " AND last_mod_dt < " + exim.StringToUnixTimestamp(dateto);
	}

	var where_clause = "customer = U'" + cstID + "' AND (category.ss_sym in (\'%" + phrase + "%\') OR description like \'%" + phrase + "%\' OR summary like \'%" + phrase + "%\')" + strdate;

	var fid = fid_generator();
	var url = cfgCgi + "?SID=" + cfgSID + "+FID=" + fid + "+OP=SEARCH+FACTORY=cr+KEEP.NoBar=1+KEEP.where_clause=";
	url += encodeURIComponent(where_clause);

	parent.MyItemsList.location.href = url;
}

function create_new_telecentrum( factory, use_template, width, height)
{
    var name = "";
    if ( typeof factory == "string" && factory == "all_fmgrp") {
        factory = "fmgrp";
    }
    
    if (typeof factory == "string" && (factory =="crs_cr" || factory =="crs_in" || factory=="crs_pr"))
    {
        factory = "crs";	
    }
	// act_type_assoc_all has been added to handle a customer issue, but there is no detail form for this object
	// it should continue to use the detail form of act_type_assoc object. Changing the factory here to display the
	// detail form for creating a new activity association.
	if (typeof factory == "string" && (factory =="act_type_assoc_all"))
	{
		factory = "act_type_assoc";
	}

	if(factory == "cr")
		url += "+HTMPL=detail_cr_simple.htmpl";
    
    var url = cfgCgi +
	"?SID=" + cfgSID +
	"+FID=" + fid_generator() +
	"+OP=CREATE_NEW" +
	"+FACTORY=" + factory;

	if(factory == "cr")
		url += "+HTMPL=detail_cr_simple.htmpl";
	else if(factory == "in")
		url += "+HTMPL=detail_in_simple.htmpl";

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

	if(typeof(hide) == "undefined") {
		if (typeof(ahdtop.product.frames[0].frames[1]) != "undefined") {
			ahdtop.product.frames[0].frames[1].location.href = url;
		}
		else 
		{
			ahdtop.product.frames[1].location.href = url;
		}
	} 
	else
	{
		if (ahdtop.frames[11].name = "workframe_3") {
			ahdtop.frames[11].location.href = url;
		}
		else 
		{
			ahdtop.frames[10].location.href = url;
		}
	}
}

function create_new_telecentrum_hidden( factory, use_template, width, height)
{
    var name = "";
    if ( typeof factory == "string" && factory == "all_fmgrp") {
        factory = "fmgrp";
    }
    
    if (typeof factory == "string" && (factory =="crs_cr" || factory =="crs_in" || factory=="crs_pr"))
    {
        factory = "crs";	
    }
	// act_type_assoc_all has been added to handle a customer issue, but there is no detail form for this object
	// it should continue to use the detail form of act_type_assoc object. Changing the factory here to display the
	// detail form for creating a new activity association.
	if (typeof factory == "string" && (factory =="act_type_assoc_all"))
	{
		factory = "act_type_assoc";
	}
    
    var url = cfgCgi +
	"?SID=" + cfgSID +
	"+FID=" + fid_generator() +
	"+OP=CREATE_NEW" +
	"+FACTORY=" + factory;

	if(factory == "cr")
		url += "+HTMPL=detail_cr_simple.htmpl";
	else if(factory == "in")
		url += "+HTMPL=detail_in_simple.htmpl";

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

	if (ahdtop.frames[11].name = "workframe_3") {
		ahdtop.frames[11].location.href = url;
	}
	else 
	{
		ahdtop.frames[10].location.href = url;
	}
}

function DownloadFile(filename) {
	var url = "http://" + location.hostname + "/SDMAttachments/" + filename;
	document.location.href = url;
}