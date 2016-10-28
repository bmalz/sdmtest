////////////////////////////////////////////////////////////////////////////
//         Copyright (C) 1999 Computer Associates International, Inc
// as an unpublished work. This notice does not imply unrestricted or public
// access to these materials which are a trade secret of Computer Associates
// International or its subsidiaries or affiliates (together referred to as
// CA), and which may not be reproduced, used, sold or
// transferred to any third party without CA's prior written consent.
//
//                         All Rights Reserved.
//
//                       RESTRICTED RIGHTS LEGEND
// Use, duplication, or disclosure by the Government is subject to
// restrictions as set forth in subparagraph (c)(1)(ii) of the Rights in
// Technical Data and Computer Software clause at DFARS 252.227-7013.
////////////////////////////////////////////////////////////////////////////
// Module:  popup.js
// Created: 09/08/00
////////////////////////////////////////////////////////////////////////////
// Description:
//
//
//
////////////////////////////////////////////////////////////////////////////
// <GLOBAL_VARS>
// cfgAnyContact = $ANY_CONTACT
// </GLOBAL_VARS>
////////////////////////////////////////////////////////////////////////////



// popup.js 1.226 2004/02/13 00:08:57

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
    
    // get available screen Height and subtract 30 
    // (10px for top, 10px for scroll bar, 10px for taskbar)
    // and don't let a window be taller than the resulted number.
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
    
    // get available screen Width and subtract 30 
    // (10px for left, 10px for scroll bar, 10px for right)
    // and don't let a window be wider than the resulted number.    
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

// prepareTenantedPopup()
//   Variant on preparePopup() to popup a CREATE_NEW form with tenant
//   set to the same tenant as that of the parent form
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

// prepareTenantedNonpublicPopup()
//   Same as prepareTenantPopup() except that tenant is not preset for
//   a popup from a public object
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

// preparePopup()
//   Replacement for window.open().  Save the target URL in ahdtop and
//   popup popup_frames.htmpl
function preparePopup(url, name, features, width, height, frame_args, pForcePopup)
{
  var w = null;
  var popunder = false;
  var force_popup = false;
  if (typeof pForcePopup != "undefined")
	force_popup = pForcePopup;
  if (typeof propFormName == "string" && 
      propFormName == "list_kt_report_card.htmpl")	// always force popup for KRC
	force_popup = true;
  
  // always force popup for risk survey question and answer templates
  if ( ( url.indexOf("FACTORY=risk_svy_qtpl")!=-1 && url.indexOf("PERSID=risk_svy_qtpl")!=-1 ) || 
		( url.indexOf("FACTORY=risk_svy_atpl")!=-1 && url.indexOf("PERSID=risk_svy_atpl")!=-1 ) )
	{
		force_popup = true;
	}

	// always force popup for survey question and answer templates
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
  //A Tricky way to force a popup
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
      // PWC - 02/27/04 - Replace xxx.cai_main with xxx.ahdframe
      //display_new_page(url,w.cai_main);
      if ( url.indexOf("+RELOAD_WIN=0") == -1 )
      {
        var objWin;
        if ( w.ahdframe.name == "frmDTUserNode" &&
             w.ahdframe.parent.name == "cai_main" &&
             url.indexOf("HTMPL=kt_document_view.htmpl") != -1)
        {
           objWin = w.ahdframe.parent; // This ensure dt viewer will reload.
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
              alertmsg("Can't_popup_window_-_popup_fra"); // Can not popup window
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
        //PWC - 02/27/04 - Replace xxx.content with ahdframe
        //return ahdtop.content;
        return ahdframe;
      }
      // Added find_menubar_from_popup to URL, so it can 
      // get menubar from a popup window (default is from 
      // a tab).
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
    //Added the following condition, as the popup does not launch in Safari.
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
   // register the window so it can be re-used when open again with the same name
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

// If setting contact is in progress, we delay category lookup.
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
	// If "set." value is set, we can use it to set SERVICE_CST.
	// Return "set." field object.  
	if (set_cst_fld.value != null && set_cst_fld.value.length > 0)
	{
	    ret_obj.set_fld_obj = set_cst_fld;
	    return ret_obj
	}
	// If "set." value is not set and "combo_name" value is set, 
	// we are in the middle of getting contact value. Exclude the
	// case when user has cancelled contact lookup. 
	if (cancel_cnt_lookup)
	    return ret_obj;
	combo_fld_obj1 = document.forms[form_name][combo_name_fld1];
	if (typeof combo_fld_obj1 != "undefined" &&
	    combo_fld_obj1.value.length > 0)
	{
	    ret_obj.delay = true;
	    return ret_obj;
	}
	// If there is no cesond contact field, return ret_obj.
	if (cnt_fld2 == "") 
	    return ret_obj;
	// If "combo_name" value is also not set, we check the second 
	// contact field because the code conditionally copies the 
	// value of the second contact field to the first contact 
	// field when the second contact field is set.   
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

// popup_hier()
//     Popup the hierarchical select form
function popup_hier(factory, backfill_field, backfill_form, backfill_attr,
                    do_autofill)
{
    if ("" == backfill_field || backfill_field+"" == "undefined" ||
        backfill_field+"" == "NaN")
    {
        alertmsg("popup_search()_was_passed_blan");
        // popup_search() was passed blank or invalid backfill_field
        return null;
    }
    if ("" == backfill_form || backfill_form+"" == "undefined" ||
        backfill_form+"" == "NaN")
    {
        alertmsg("popup_search()_was_passed_blan");
        // popup_search() was passed blank or invalid backfill_field
        return null;
    }

    var url = cfgCgi +
	"?SID=" + cfgSID +
	"+FID=" + fid_generator() +
	"+KEEP.IsPopUp=1" +
	"+KEEP.backfill_field=" + backfill_field +
	"+KEEP.backfill_form=" + backfill_form +
	"+KEEP.backfill_attr=" + backfill_attr;

    // Tack on tenant restriction information if appropriate

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
		 
		 // If an option was selected manually from the options of Auto Suggest, then DO NOT proceed further to launch a popup
		 // Instead invoke the web method: HIER_SELECT which will in turn call load_cat_properties() to call the JavaScript function:
		 // change_category_func() which will load the properties associated with the selected category		
		 // Call this piece of code only if properties div is defined in the form
		if((is_category == true) && (hier_key_orig != '') && (document.getElementById("propertyDiv") != null) &&
			((typeof __search_filter == "object" && __search_filter.is_from_autoSuggest == "SKIP_AUTO_FILL") ||  
				(typeof _dtl == "object" && _dtl.is_from_autoSuggest == "SKIP_AUTO_FILL"))) 
			{	
				// Calling OP=HIER_SELECT in order to retrieve the details of the category selected using Auto Suggest
				var url_str = cfgCgi + '?SID=' + cfgSID + '+FID=' + fid_generator() + "+OP=HIER_SELECT+KEEP.is_from_autoSuggest=1+FACTORY="
					+ factory + "+category_sym=" + esc_hier_key + "+parent_factory=" + propFactory;
				SyncAjaxJSCall(url_str);
				if(typeof _dtl == "object")
					_dtl.is_from_autoSuggest = true;
				else
					__search_filter.is_from_autoSuggest = true;	
				return null;
			}	
		// Setting the is_from_autoSuggest to TRUE, so that next time when this function is called 
		// when we tab out of the lookup, the popup is not launched. This code is for forms in which 
		// properties div is not defined
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
         
		 if ( hier_key.length > 0  &&
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
	// When a user uses the dtlHier to show the Knowledge Category,
    // the popup page is list_KCAT_tree.htmpl
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

// override this function if you want to dynamically add to the extra url. 
// this is helpful for dynamically changing the search criteria
function modify_search_extra(factory, backfill_field, backfill_form,is_3_field_contact, backfill_attr)
{
	return "";
}

// for most situations backfill_field will be KEY.attribute_name, but the
// special case for Contacts it should just be attribute, sans the 'KEY.'
//
//	If you want to limit the search of a contact field (say 'Assignee'), use
//	"KEEP.type.id=xxxx" for the 'extra' parameter.  This is necessary so the any_contact option will
//	work properly.
function popup_search(factory, backfill_field, backfill_form, extra,
		      is_3_field_contact, backfill_attr, callback )
{
	// Call popup_search_text to form the URL used to launch the popup
	var url = popup_search_text(factory, backfill_field, backfill_form, extra,
		      is_3_field_contact, backfill_attr, callback );

	// If popup_search_text() returns null, then return 
	if(url == null)
		return;

	// Test for autofill; if not, popup a search form
    if ( initiate_autofill( url, is_3_field_contact, backfill_form,
                            backfill_attr, backfill_field, callback ) )
       return null;

    return do_search_popup( url );
}


// popup_search_text 
// This function returns the URL which is used to launch the popup 
function popup_search_text(factory, backfill_field, backfill_form, extra,
		      is_3_field_contact, backfill_attr, callback )
{
    // If an autofill is in progress, cancel popup_search. 
    if (ahdframe.currentAction == ACTN_AUTOFILL && 
	ahdframe.autofill_field == backfill_field)
	return null;

    if ( typeof backfill_field != "string" ||
         typeof backfill_form != "string" ||
         backfill_field.length == 0 ||
         backfill_form.length == 0 )
    {
        alertmsg("popup_search()_was_passed_blan");
        // popup_search() was passed blank or invalid backfill_field
        return null;
    }

    // Change is_3_field_contact to a string "0" or "1"
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

    // Special case for the attr_alias form.
    if (factory == "OA_TABLES" && backfill_field == "QBE.IN.obj.TABLE_NAME")
       backfill_field = "QBE.IN.obj";
    // Special case for the detail_pcat form.
    if (factory == "OA_COLUMNS" && backfill_field == "QBE.IN.assignable_ci_attr.COLUMN_NAME")
       backfill_field = "QBE.IN.assignable_ci_attr";

     var url = cfgCgi +
	       "?SID=" + cfgSID +
	       "+FID=" + fid_generator() +
	       "+OP=SEARCH"; 
	 // If factory is not null, only then append it to the URL
	 if(factory != "")
        url += "+FACTORY=" + factory;     	 
	 url +="+KEEP.IsPopUp=1" +
	       "+KEEP.backfill_field=" + backfill_field +
	       "+KEEP.backfill_form=" + backfill_form +
	       "+KEEP.Is3FieldContact=" + is_3_field_contact;    
	// If the field is lval or rval_assoc from the act_type_assoc factory use MLIST_STATIC -- SDT 32702
	// Also, if it's a list form and it's not "Edit in List", use MLIST_STATIC.
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
	
    // Tack on tenant restriction information if appropriate

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

    // Clear contxt_obj on the Notification History form if searching
    // For Contact.
    if (propFormName == "list_all_lr.htmpl" && backfill_field.indexOf("cntxt_obj.cnt") >= 0)
    {
        var cntxt_obj = searchFilterObjectOf("cntxt_obj");
        if (typeof cntxt_obj == "object" && cntxt_obj != null) {
            cntxt_obj.value = "";
        }
    }
    
    // If it's for for the field, cntxt_obj.<factory>, in 
    // the Notification History form, we need to set the 
    // correct attr name for the factory. Note that we 
    // can't use the name, cntxt_obj.ref_num, in the 
    // htmpl file because cr and iss both have the same 
    // attr name.  
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

    if ( typeof backfill_attr == "string"  && backfill_attr.length > 0 )
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
	// allow dynamically changing the search parm
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
	    // For using 5.5 in 6.0
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

// initiate_autofill_text
// Add query parameters to the URL based on some 
// KEEP variables 
// Return value: transformed URL
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
	
   //For Configuration items, if ci_filter option is installed, check if is_ci is 1.
   //url should be updated here before validating for No autofill, so that configuration items are filtered.
   var str="FACTORY=nr";
   if(url.search(str)!=-1 && ahdtop.cfgCI_FILTER=="Yes")
   url +="+QBE.EQ.is_ci=1";	
  
    if ( typeof f.elements[setfld] == "object" ) {
        var setfld_obj = f.elements[setfld];
        if ( typeof setfld_obj.value == "string" &&
             setfld_obj.value.length > 0 ) {
            return url; // No autofill if we already have rel_attr value
        }
    }  

    //Handle Stored Queries autofill in KPI detail form
    if( url.indexOf("KEEP.CrsqType=KPI") > 0)
	url += "+QBE.NE.usage_flag=0";

   //Handle Stored Queries autofill in Customize Scoreboard usp_update_control form
   if( url.indexOf("KEEP.CrsqType=Scoreboard") > 0){
	url += "+ADDITIONAL_WHERE=" + nx_escape("( usage_flag = 0 OR usage_flag = 2 OR usage_flag IS NULL )");
   }
	 
   // Handle special case of tenant field
   if (backfill_form == "tenant_form" && backfill_field == "KEY.tenant") {
      setfld = "SET.tenant";
      if ( typeof document.forms["main_form"].elements[setfld] == "object" ) {
         var setfld_obj = document.forms["main_form"].elements[setfld];
         if ( typeof setfld_obj.value == "string" &&
              setfld_obj.value.length > 0 ) {
            return url; // No autofill if we already have rel_attr value
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
  	            	

   var lookup_field_value = f.elements[backfill_field]; //checking if the field has a value and thena ppending +QBE.EQ.delete_flag=0 to url
   if ( typeof lookup_field_value == "object" && lookup_field_value.value != "" )
   {
   	if(url.indexOf("+QBE.EQ.delete_flag=0") < 0)      //for  assignee and group +QBE.EQ.delete_flag=0 already present
   	{	
   		url += "+QBE.EQ.delete_flag=0"; 
   	}	
   }

   // Auto Suggest feature needs to do exact match searching using = sign instead of using IN clause and % sign.
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
               // Auto Suggest feature needs to do exact match searching using = sign instead of using IN clause and % sign.
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
               // Auto Suggest feature needs to do exact match searching using = sign instead of using IN clause and % sign.
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
                 var modified_val = esc_val.replace(/\+/,"%2B"); // replace + with %2B
                 // Auto Suggest feature needs to do exact match searching using = sign instead of using IN clause and % sign.
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
           // Use a different callabck if it is for the 
           // field, cntxt_obj.<factory>, in the 
           // Notification History form. 
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
	     // Make a special case for Quick Profile
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

// initiate_autofill()
//    See if autofill is appropriate and initiate if so
function initiate_autofill( url, is_3_field_contact, backfill_form,
                            backfill_attr, backfill_field, callback )
{
	// Get the url after setting few other QBE variables
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
		return false; // No autofill if we already have rel_attr value
	}  
	// Handle special case of tenant field
	if (backfill_form == "tenant_form" && backfill_field == "KEY.tenant")
	{
      setfld = "SET.tenant";
      if ( typeof document.forms["main_form"].elements[setfld] == "object" )
	  {
         var setfld_obj = document.forms["main_form"].elements[setfld];
         if ( typeof setfld_obj.value == "string" &&
              setfld_obj.value.length > 0 )
            return false; // No autofill if we already have rel_attr value
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
		   // If this is being called after a value has been set from Search as you Type options then
		   // set the current action to complete
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

// Identify contact fields that can determine 
// what categories to show through thier 
// organization's service contracts    
function category_related_cnt(url)
{
    var ret = false;
    if (typeof propFactory == "string" && 
	(propFactory == "cr" || propFactory == "chg" || 
	 propFactory == "iss"))
    {
	// url could be the field name or a URL containing 
	// the field name
	var field_name = url;
	if (url.match(/backfill_field=([^\+$]+)\+/))
	    field_name = RegExp.$1;

	var f = document.main_form;
	// Only these fields are checked by the category lookup
	if (propFactory == "cr")
	{
	    if (field_name == "customer") 
		ret = true;
	    else
	    // We copy the value of requested_by to customer when 
	    // user hasn't manually modified customer. See 
	    // detail_in.htmpl, detail_pr.htmpl, or detail_cr.htmpl. 
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
	    // We copy the value of requestor to affected_contact  
	    // when user hasn't manually modified affected_contact. 
	    // See detail_chg.htmpl. 
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

// do_search_popup()
//    Popup a search window from a previously-prepared URL
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
   // If we are going to show a cnt lookup, set 
   // cancel_cnt_lookup to 1 first and set 
   // it to 0 again in backfill_cnt_event() in 
   // each ticket HTMPL file to indicate whether 
   // user cancels the lookup window. 
   if (category_related_cnt(url))
       cancel_cnt_lookup = 1;
   var search_window = preparePopup(url, name, features, -1);

   return search_window;
}

// cntxt_obj_callback()
//    Handle the response from an autofill request for 
//    the field, cntxt_obj.<factory>, in the Notification 
//    History form.
function cntxt_obj_callback( persid, value, rel_attr_val, 
                             tenantId, tenantName )
{
    if ( typeof autofill == "object" ) 
    {
	if ( typeof persid != "string" )
	{
	    // If we need to popup a search window,
	    // do not resume the action.
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


// popup_autofill_callback()
//    Handle the response from an autofill request
function popup_autofill_callback( persid, value, rel_attr_val, 
                                  tenantId, tenantName )
{
   if ( typeof autofill == "object" ) {
      if ( typeof persid != "string" )
      {
         // If we need to popup a search window,
         // do not resume the action.
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

         // Set the SET.Tenant value on the main_form.

         if ( typeof detailSetTenant != "undefined" ) {
           if ( name == "KEY.tenant" )
             detailSetTenant(name, rel_attr_val, value);
           else if ( typeof tenantId == "string" )
             detailSetTenant(name, tenantId, tenantName);
         }
      }
      autofill = void(0);
   }
   // Set action complete here because this may resume
   // a Save action which better have the value filled
   // first.
   set_action_in_progress(ACTN_COMPLETE);
}

// search_alg()
// Display a search form for request, change, or issue activity logs.
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
      var alg_search = preparePopup(url, "" ,  features);
      alg_search.focus();
   }
}

// Display a search form (in a new window) for
//	issue activity logs.
//
//	We have to forward iss_id so we search on a single
//	issue.
//	Input:
//	in_form - calling form obj
//	in_iss_persid - persistent_id of a iss object
function search_issalg(in_form, in_iss_persid) {
	var iss_num = in_iss_persid.substr(in_iss_persid.indexOf(":") + 1);
	var query_string = cfgCgi + "?SID=" + cfgSID + "+FID=" + fid_generator() +
		"+OP=SEARCH+FACTORY=issalg+KEEP.IsPopUp=1+RO_HTMPL=detail_iss_ro.htmpl+NEXT_PERSID=" + "iss" + "%3A" + iss_num;
	query_string += "+KEEP.iss_id=" + in_iss_persid;
	var issalg_search = preparePopup(query_string, "search_issalg",
				"width=850,height=600,scrollbars,resizable,menubar,location,status,toolbar");
	issalg_search.focus();
}


// Display a search form (in a new window) for
//	change order or issue activity logs.
//
//	We have to forward chg_id so we search on a single
//	change order or issue.
//	Input:
//	in_form - calling form obj
//	in_chg_persid - persistent_id of a chg object
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

// This function has nothing to do with popup. We may need to create a file
// for this type of functions. We use this function to check the parent
// call request ref_num to make sure it is not the same as the call request
// itself.
function check_parent(parent_obj, ref_num, org_ref_num)
{
    if (parent_obj.value == ref_num)
    {
	parent_obj.value=org_ref_num;
	alertmsg("Parent_request_can_not_be_the_"); // Parent request can not be the same as request itself
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
   //Assigning bOpeninNewWindow value using the optional parameter
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

// create_new()
//    Popup a window to create a new record.
function create_new( factory, use_template, width, height )
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

//  popup_window()
//     Popup a window with a specific form or command.
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

		// If topsplash=no is passed into the features, then pass TOP_SPLASH=no
		// as an argument to the frame set
		if ( features.indexOf("topsplash=no") >= 0 )
			frame_args = "TOP_SPLASH=no";

		// Sets cai_main SCROLLABLE attr to 'auto'
		if ( features.indexOf("forcescroll=yes") >= 0 ) {
			if (frame_args == "")
				frame_args = "FORCESCROLL=yes";
			else
				frame_args = frame_args + "+FORCESCROLL=yes";
		}

		// If menubar=no is passed into the features, then pass MENUBAR=no
		// as an argument to the frame set
		if ( features.indexOf("menubar=no") >= 0 ) {
			if (frame_args == "")
				frame_args = "MENUBAR=no";
			else
				frame_args = frame_args + "+MENUBAR=no";
		}

		// If gobutton=no is passed into the features, then pass GOBUTTON=no
		// as an argument to the frame set
		if ( features.indexOf("gobutton=no") >= 0 ) {
			if (frame_args == "")
				frame_args = "GOBUTTON=no";
			else
				frame_args = frame_args + "+GOBUTTON=no";
		}

		// If welcomebanner=no is passed into the features, then pass WELCOMEBANNER=no
		// as an argument to the frame set
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
        //if ( _browser.isNS )
        //   url = url.replace(/:/g,"%3a");
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
	//UCD r7 standard
	if ( form == 'help_about.htmpl' )
	{
		height = 360;
		width = 1100;
		if ( features.indexOf("scrollbars") == -1 )
			features += ",scrollbars=no";
		if ( features.indexOf("resizable") == -1 )
			features += ",resizable=no";
			
		// We need Scrollbar in Screenreader mode because deferred Notebook 
		// Tab appear one below another, so that User can scroll through it.
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
		    // Sorry, your session has timed out.
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

// popunder_window()
//    Prepare a popunder window for a specified form
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

// cancel_update()
//    Cancel an update and close the window
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
	    return; // WSP readonly preview session
	}

	if ( typeof ahdtop.close_edit_window == "object" &&
	     ahdtop.close_edit_window.edit_windows.length > 0 &&
	     typeof parent.name == "string" )
	{
	    var edit_windows = ahdtop.close_edit_window.edit_windows;
	    for(var i = 0; i < edit_windows.length; i++)
	    {
		// If the edit window is already closed, 
		// go next.
		if (edit_windows[i].closed)
		    continue;
		if (parent.name == edit_windows[i].name)
		{
		    // Force to use cancel.htmpl as returning page.
		    next_persid = "";
		    argID = 0;
		    to_htmpl = "cancel.htmpl";
		    break;
		}
	    }
	}
    }

    if ( typeof action_in_progress == "function" ) {
      set_action_in_progress(ACTN_CANCEL); // cancelled
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
    			// if "Avoid popup" preference is set and if in the "Change Order Schedule" tab then default to "list_chgsched.htmpl"
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

    if  ( typeof replace == "undefined" || ! replace )
       display_new_page(url);
    else
       replace_page(url);

}
// f_cancel_update()
//    Cancel an update and close the window
function f_cancel_update(frame,factory, argID, next_persid)
{
    if ( action_in_progress() && ahdframe.currentAction != 0 )
       return;

    set_action_in_progress(ACTN_CANCEL); // cancelled
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

// showDetailWithPersid
//    Show detail (honors data partitions in r11 - see freeaccess.spl)
function showDetailWithPersid( persid )
{
    var url = cfgCgi +
	"?SID=" + cfgSID +
	"+FID=" + cfgFID +
	"+OP=SHOW_DETAIL" +
	"+PERSID=" + nx_escape(persid);

    switchToDetail(persid,0,false,void(0),url);
}

// help_on_form()
//    Function to pop up help for forms
function help_on_form(form_name)
{
	var interface_type = 0;
	var help_info;
	var interface_url;
	var context_url;
	
	if (cfgGuestUser == 1)	       interface_type = 10;
	else 
	if (cfgUserType == "employee") interface_type = 1;
	else
	if (cfgUserType == "customer") interface_type = 2;
	else
	if (cfgUserType == "analyst")  interface_type = 3;
	interface_url = "INTERFACE_TYPE=" + interface_type;
	
	if (typeof form_name == "string" && form_name != "")
	{
		context_url = "FORM_HELP=" + form_name;
	} else {
		context_url = "INITIAL=NOP";  // dummy (ignored)
	}
	// send to back end to get help prefix and optional context
	ahdtop.upd_workframe("HELP_ON_FORM", 
			     interface_url,
			     context_url,
			     "callback_func=parent.ahdframe.launch_help_in_context");    

}

// Callback routine to launch help in context 
function launch_help_in_context(help_prefix, help_context)
{
	// clear to process next workframe.
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

	// Popup the form requested, using the existing window if available

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

//function to open a new help window, called by setTimeout in help_on_form
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
//function to set focus to help window, called by setTimeout in help_on_form
var _w_help = null;
function w_help_focus()
{
	if (typeof _w_help == "object" && _w_help != null)
	{
		_w_help.focus();
	}
}
// Option Manager Help.
// Loads the appropriate Help for the Option when the "Help" Btn is clicked.
function load_options_help(option_name)
{
  help_on_form(option_name + "_index.html");
}




// Use this to show a log from a ticket detail window
//	It will capture some special values for us, similar to logSolution()
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

//  Like the other showDetail functions, but we can pass
//	in extra stuff
//	extraURL - extra stuff to tack on.  We supply the first '+' prefix
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
	// If it is external URL which usually has
	// http:// at the beginning of the URL. We
	// cannot replace the colon of it.
        //if ( _browser.isNS )
	//{
	//    if (url.search(/http:\/\//i) < 0)
	//    {
	//	url = url.replace(/:/g,"%3A");
	//    }
	//}
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
	// For showing an attached file (for attachment),
	// it is possible that an application (ex: paint)
	// instead of the browser is used to display a
	// file (ex: .bmp file), so we need to make sure
	// the browser is still alive before setting the
	// focus.
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

    // Save the popup window for attmnt, so we can
    // prevent user from saving parent cr or chg
    // record while attmnt is still in process of
    // uploading a file.
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

// Open empty window for the Customer Intelligence.
// When the form is submitted use win_name as the target
// to fill in this window.
// SDT 20227 - added extraJS parameter, esp. for
//		save_and_submit operations.
//	extraJS - this is any extra JavaScript that is tacked
//			to the end of the workframe URL.  This is a good
//			place to put any cleanup code in the parent window
//			because it is pretty much the last thing called
// featureSet - if undefined or 0, use the standard
//				set of features used to open most KT windows.
//				If 1, we use the feature set to open KT Search windows
//				for AHD_CI_SEARCH ops
///////////////////////////////////////////////////////////////////////////

function popupCiWindow( win_name, form_name, extraJS, featureSet)
{
    if ( action_in_progress() && ahdframe.currentAction != 0 )
       return;

    if (typeof featureSet == "undefined")
		featureSet = 0;


    // Try to get it looking alright for 800x600, too.
	//	Remember featureSet=1 adds height to the browser - see below.
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

// getEditWindows()
//    Find all windows editing the current object
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
      // If "Avoid Popups" is on, also collect the editing form 
      // from ahdtop.detailForms.
      if (ahdtop.cstReducePopups) {	

         if ( typeof ahdtop.detailForms != "undefined" &&
              typeof ahdtop.detailForms[persid] == "object" ){
	      var d =  ahdtop.detailForms[persid];
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

// Check to see if this object is being edited.  And if not
// popup a half size window to perform the activity.
function popupActivityWithURL (url, actWinName, persid)
{
   if ( ahdtop.cstReducePopups &&
        parent.name == "AHDtop" ) {
      var returnURL = document.URL;
      if ( returnURL.indexOf("?") != -1 &&
           ! returnURL.match(/OP=(CANCEL|DELETE|UPDATE)/) )
         ahdframeset.top_splash.returnURL = returnURL;
   }

   // Set a flag to refresh the Activites tab on a change.
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

   // If this is a named window, see if it is active already.
   // If so, focus the active window.  The possibilities are:
   //   chg - Attach/Detach Change Order
   //   esc - Escalate
   //   status - Update Status
   //   xfer - Transfer
   //   upd_sched - Update Schedule
   //   soln - Solution

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

   // If this is a named window, save the name in the window

   if ( typeof actWinName == "string" && actWinName.length > 0 )
      url += "+actWinName=" + actWinName;

   // Set NEW_TICKET flag if it's changing status 
   // while creating a new ticket, so we can come 
   // up with a correct transition list. 
   if ((actWinName == "status" || actWinName == "soln") && (typeof _dtl != "undefined") && 
       (_dtl.id == 0))
   {
      url += "+NEW_TICKET=1"; 
   }

   w = preparePopup(url, "", features,0,0,"KEEP.AHD_menu=No");

   // Save the popup window for attmnt, so we can
   // prevent user from saving parent cr or chg
   // record while attmnt is still in process of
   // uploading a file.

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
   // Set window focus to close context menu 
   // if it's on a list form.
   window.focus();
   // Delay popup, so we don't have a focus
   // issue. 
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

//	This function displays an audit trail detail
//	Right now, our only audit trail owner is the external KT app
//	Input:
//	Input are fields from the activity log where type=AUDTRAIL:
//
//	audOwner - unique symbol for the audit owner (alg.k_tool)
//	linkID - audit trail id (alg.session)
function popAuditTrail(audOwner, linkID) {

	if (audOwner == "NLS_FAQ") {
		popup_window('','LINK_WITH_BOPSID', 0, 0, 'ahdmenu=no,register=no','URL=%CI?BOPSID=%bopsid&ACTION=AHD_KT_AUDIT_TRAIL&ID=' + linkID);
	} else {
		alertmsg("No_owning_application_specifie");
	}

}

// Issue a request to make a copy of the current
// dob and pop up a new form with the values of
// the new dob for editing.
// It requires two values:
// 1. The persid of the current dob.
// 2. The name of the method defined in the majic
//    and spel files (domsrvr side) for doing the
//    actual dob copy.
//
//	By default, the server-side method invoked is, "make_<factory>_copy".
//
//	persid_override - a persid of object to copy, otherwise we default it from 'ahdframe.argPersistentID';
//					the defaulting is the normal case.
//	arguments[1..x] - extra URL parameters to tack onto the make_copy op.  Note
//					KEEP and PRESET params work here.

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

    // do not allow copying cr from edit menu
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
		// Wildly assuming a copy function exists for this
		// factory and is conventionally named.
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

    // Build up a popup_window call, tacking on any extra params passed in
    eval_str = 'ahdtop.popup_window("", "MAKE_COPY", "", "", "", "FACTORY=' + factory + '", "PERSID=' + persid + '", "METHOD=' + method + '"';
    if (ahdframe._dtl.edit)
    {
		eval_str += ',"KEEP.MAKE_COPY=1"';
    }

    // Tack on anything extra passed in
    for ( var i = 1; i < arguments.length; i++ )
        eval_str += ',"' + arguments[i] + '"';

    // close it out and execute
    eval_str += ');';

    eval(eval_str);
}

// The make_substitute() method piggy-backs on the 
// make_copy() function which displays a second form for the
// copy.  With Substitute, we replace the original form
// with the new editable substitute in the same popup.
//
// Like make_copy(), it requires two values:
// 1. The persid of the current dob.
// 2. The name of the method defined in the majic
//    and spel files (domsrvr side) for doing the
//    actual dob copy.

function make_substitute()
{
    if (typeof ahdframe._dtl != "object") return;

    var persid;
    persid = ahdframe.argPersistentID;

    var factory = persid.substr(0,persid.indexOf(":"));
    var method;

    var display_str;

    // Assume there is a make copy function for this factory.
    method = "make_" + factory + "_substitute";

    // Build a string for display_new_page.
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


//	Use this function to apply a template to a new ticket.  We simply submit
//	a special form on the ticket detail page.  We may also restrict the search
//	to templates where the affected organization matches the current end user
//	for the ticket.  This is a Service Contract feature; it ensures the category
//	of the template will be usable.
//
//	tmpl_form_name is the name of the HTML form element to submit.  This function
//	assumes the form has an input element with the name "ADDITIONAL_WHERE".
//	cnt_elem is the name of the element holding the Contact id.
//		For cr, this is the 'customer' field.
//		For iss, it is 'requestor'
//		For chg, it is 'affected_contact'
//	factory is the factory of the ticket object
//	We expect certain elements on the main form:  'org_id' and 'user_contract'
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
	    // Set up a where clause to grab requests with the same affected
	    // organization.
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
///////////////////////////////////////////////////////////////////
//	Returns a where clause (string) of the form
//		"<srelName>.organization.my_cnts IN (<cntId>)"
//
//	Used to help find templates that match the affected organization
//	- and therefore Service Contract - for a ticket with a certain end user.
//
//	factory - fac of ticket.  Can be chg, iss, cr, in or pr.
//	cntId - contact id of the ticket end user
//	orgId - affected organization.  We do not check active flag here.
//  contractId - contract for orgId.
////////////////////////////////////////////////////////////////////
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


// If the window name is log_reader, we reset it to the real name
// saved in the AHDtop. We cannot do this in the log_reader.htmpl file
// because the window_manager.js is not there when the window name is
// set.
function log_reader()
{
    var browser = _browser;
    // Make sure we are always opened from the top window

    if ( window.name != "AHDtop" ) {
       if ( typeof ahdtop == "object" )
          ahdtop.log_reader();
    }
    else {
	var url;
	// If the log_reader form has already been
	// created, refresh the form.
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

// Helper - returns an element object that might exist somewhere
// in a document.
// e_name - the 'name' attribute of an HTML element.
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

						// return this way to return an array, if it is one.
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

				// return this way to return an array, if it is one.
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
// this pops an object off the global queue list screens:
// list_g_cr_queue.htmpl, list_g_chg_queue.htmpl, list_g_iss_queue.htmpl
//  if gservername is blank, we just try to pop locally
function pop_global_queue(obj_id, proto, web_srvr, web_url, factory, gsrvrname, popup, web_port, type)
{
	if(ahdtop.gpb_gbl_name==gsrvrname)
	{
		// local tickets
		var persid = factory + ":" + obj_id;
		if(typeof type=="string" && type=="I") factory="in";
		if(typeof type=="string" && type=="P") factory="pr";

		// is there already an open window?
		if(typeof popup=="string")
		{
			// come here for tickets from gobtn
			var win = ahdtop.AHD_Windows[popup];
			if(typeof win=="object")
			{
				win.close();
			}
		}

		// come here for tickets from list_g_xxx_queue
		ahdtop.do_openDetail( factory+".persistent_id", persid);
	} else {
		// remote tickets
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
	features+=( _browser.supportsLayers ?  ",screenX=10,screenY=10" : ",left=10,top=10" );

	var win = ahdtop.AHD_Windows[popup];
	if(typeof win=="object")
	{
		win.location.replace(rem_url);
	} else {
		win = popup_window("", rem_url, h, w, features);
	}

	next_workframe("UPD_WORKFRAME");
}

// This function calls a freeaccess.spl function which processes
// Managed Survey Notifications
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

// this is for delete on the right-click menu for list_bmhier.htmpl
function bmhier_delete_callback(ret)
{
	if(ret!="") alert(ret);

	set_action_in_progress(ACTN_COMPLETE);
	next_workframe("UPD_WORKFRAME");
	ahdtop.bmhier_delete.doSearch();
	ahdtop.bmhier_delete.refreshForm();
	ahdtop.bmhier_delete=void(0);
}

//	For generic copying of categories within a service contract
function do_catg_copy(factory) {
	popup_window("","SEARCH","","","","FACTORY=" + factory,"KEEP.backfill_field=KEY.category_copy","KEEP.backfill_form=catg_copy");
}

// for Merge Into Contact from ctxMenu on list_ldap when launched from Merge LDAP button on detail_cnt
function merge_ldap(rp)
{
	//alert("merge_ldap()\nrow persid="+rp+"\ncnt persid="+cfgMergeLdap);

	set_action_in_progress(ACTN_FILLFORM);

	upd_workframe("MERGE_LDAP", "CNT=" + cfgMergeLdap, "PERSID="+rp,
		"FUNC=parent.ahdframeset.ahdframe.merge_ldap_callback", "prop_ref="+prop_ref);
}

// this is the callback for merge_ldap
function merge_ldap_callback(ret,errmsg)
{
	//alert("merge_ldap_callback\n"+ret);

	set_action_in_progress(ACTN_COMPLETE);
	next_workframe("UPD_WORKFRAME");

	//ahdtop.merge_ldap.refreshForm();
	// add the returned data to the form
	ahdtop.merge_ldap.pop_ldap_callback(ret,errmsg);
	window.parent.close();
}

// modifyWindowFeaturesForDebug()
//   Modify popup window features according to the DebugOptions string
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

//To fetch the bopsid
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
	//display_new_page( target_url, ahdframeset.workframe );
}

function set_bopsid(bopsid_value)
{
	bopsid = bopsid_value;
}


//  Show BO reports by calling saved functions
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

// This function gets called when a frame tries to show a 
// BO report
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
    // Save the callback func, so we can 
    // call it later when we have bo info
    BOFuncArray[BOFuncArray.length] = func;
    if (BOFuncInProgress)
	return;
    BOFuncInProgress = true;
    if (typeof bInfoView == "undefined" &&
	bInfoView != 1)
	bInfoView = 0;
     
    // Issue a request to check BO info
    check_bo_info(bInfoView);
    return; 
}

// Send an URL to BO to verify logon 
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
	// Display the BO server logoff message 
	// box
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
			//make the web method call and get bo info and send it to the boservlet
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

// Get BO_INFO from Service Desk
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

// this is the special handling type/autodisplay notes alert banner in various places
// there's also a piece of code in detailAutofill() to handle when the field is cleared
function alert_banner(cnt_id) {
	// leave if no cnt provided
	if(cnt_id.length==0) return;

	// make sure alert_banner_last is defined on the form
	//if(typeof alert_banner_last=="undefined") {
	//	alert("alert_banner_last is undefined");
	//	return;
	//}

	// did we get an id or persid?
	if(cnt_id.slice(0, 4)!="cnt:") cnt_id="cnt:" + cnt_id;

	var url= cfgCgi + "?SID=" + cfgSID + "+FID=" + cfgFID + 
			"+OP=SPEC_HAND" +
			"+FACTORY=cnt" +
			"+PERSID=" + cnt_id;
	
	// lookup special handling types
	var params_txt=GetResponseViaUrl(url);

	// this means we found nothing
	if(params_txt.slice(0,1) == "0") {
		alert_banner_clear();
		return;
	}

	// parse what we got back
	var params=params_txt.split("@");
	// [0] 		count of rows returned
	// [1] 		autodisplay_notes
	// [2]		alert_icon_url
	// [3]		alert_text
	// [4]		notes

	// did we get anything?
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

			// make html safe
			autod=alert_banner_fix_text(params[i]);
			icon=alert_banner_fix_text(params[i+1]);
			text=alert_banner_fix_text(params[i+2]);
			notes=alert_banner_fix_text(params[i+3]);

			// start a new line if we need to
			if(msgtxt.length > 0 
				&& ( icon.length > 0 || text.length > 0)
			) msgtxt+="<BR>";
			
			// create the icon link
			if(icon.length > 0) {
				msgtxt+="<img src=\"" + icon + "\" alt=\"" + text + "\" title=\"" + text + "\" class=alert_banner_img>&nbsp;&nbsp;";
			}

			// add the text if there is any
			if(text.length > 0) {
				msgtxt+=text;
			}

			// add the notes if any of the autodisplay_notes were set
			if(autod==1 && notes.length > 0) {
				do_notes=true;
				do_notes_txt=notes;
			}
		}

		// where any autodisplay_notes set?
		if(do_notes) {
			if(msgtxt.length > 0) msgtxt+="<HR>";
			msgtxt+=do_notes_txt;
		}

		// display the banner
		if(msgtxt.length > 0) {
			alert_banner_last=msgtxt;
		}

		showAlertMsg();
	} else {
		alert_banner_clear();
	}
}

// makes special characters safe for straight html display
function alert_banner_fix_text(txt) {

	// escape some special charcters
	txt=nx_unescape(txt);

	// with some browsers and web server combinations, there's garbage on the end
	if(txt.charCodeAt(txt.length-1)==0) txt=txt.substr(0, txt.length-1);
	if(txt.charCodeAt(txt.length-1)==10) txt=txt.substr(0, txt.length-1);
	if(txt.charCodeAt(txt.length-1)==13) txt=txt.substr(0, txt.length-1);

	// escape some more special charcters that nx_exscape didn't do
	txt=txt.replace(/\&/g, "&amp;");
	txt=txt.replace(/'/g, "&#39;");
	txt=txt.replace(/\\/g, "&#092;");
	txt=txt.replace(/"/g, "&quot;");
	txt=txt.replace(/\</g, "&lt;");
	txt=txt.replace(/\>/g, "&gt;");
	txt=txt.replace(/\r\n/g, "<BR>");

	// clear the text if all that's left is a carriage return
	if(txt=="<BR>") txt="";
	
	return txt;
}

// clear the alert msg if it's ours
function alert_banner_clear() {
	alert_banner_last=null;
	showAlertMsg();
}

// return the value of alert_banner_last
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
