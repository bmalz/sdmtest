////////////////////////////////////////////////////////////////
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
// Module:  profile_browser.js
// Created: 07/07/01
////////////////////////////////////////////////////////////////////////////
// Description:
//
//
//
////////////////////////////////////////////////////////////////////////////

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

// Find the tab with src that matches the passed-in pattern. 
// If found, switch to the tab. 
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

// Routine that determines if a particular high level tab is currently selected. 
//   pattern - unique text used in tab url - e.g. "HTMPL=profile_browser.htmpl"
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
                    // Tab is currently selected.
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

   // If the PB_COUNT_CNT_DOBS operation found cnt_count = 1 and the
   // cnt_pid is a real persid, then use cnt_pid.
   ahdtop.pb_args.cnt_count = cnt_count;
   if ( cnt_count == 1 && cnt_pid.match(/^cnt:\w{32}/) ) {
      cnt_persid = cnt_pid;
   }

   if ( typeof ahdtop == "object" ) {

      profile_browser_window = find_popup_window("profile_browser");
        if (profile_browser_window == null)
        {
            // Find in tab
            
            // Profile browser parent name is "pbwindow_menuOK" when screen reader is off
            // "role_main" in the profile browser tab when screen reader is on.
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
                // Provide pb_window_name override if screen reader is enabled
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
                    // Profile browser parent name is "role_main" 
                    func += ",'role_main'";
                }
                func += ");";
                if (find_unselected_tab("HTMPL=profile_browser.htmpl", func))
                {
                    if ( ahdtop.cstUsingScreenReader && 
                         typeof ahdtop.cb_after_showing_pb == "undefined" &&
                         !is_tab_selected( "HTMPL=profile_browser.htmpl" ) )
                    {
                        // The profile browser tab is not selected/active, add a
                        // callback so the profile browser is properly loaded with 
                        // the contact information when tab is reloaded.
                        // This condition occurs when the profile tab was 
                        // previously selected/active and is no longer active 
                        // and the screen reader option is active.
                        ahdtop.cb_after_showing_pb  = func;
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
            url +=    "+KEEP.FromGoBtn=1";
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

// edit_profile_browser()
//    Invoke profile browser and pass in a reference to an asset field
function edit_profile_browser( attr_name, attr_value )
{
   // Return if autofill is in progress
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
            case "id":         arg = "cnt:" + attr_value; break;
            case "persistent_id": arg = attr_value; break;
            default:           arg = "cnt:" + attr_name + ":" + attr_value;
         }
   }
   profile_browser(arg);
   //put the focus on the profile browser window once the "quick profile" button has been clicked
   var w_name = popup_window_name("profile_browser");
   var pb_window = ahdtop.AHD_Windows[w_name];
   if (typeof pb_window == "object" && pb_window != null )
   {
      var can_set_focus;
      try 
      {
         // Determine if we can set focus to the window
         if ( pb_window.type != "hidden" && pb_window.style.display != "none" ) 
            can_set_focus = true;
         else
            can_set_focus = false;
      }
      catch(ex)
      {
          // Window is not accessible
          can_set_focus = false;
      }
      if ( can_set_focus )
      {
          pb_window.focus();   
      }
   }
}

// Properly set ahdframe if Profile Broswer 
// is displayed in a tab.
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
// profile_start()
//    Change the contact in the profile browser
function profile_start(in_persid,FromGoBtn)
{
   if ( typeof ahdtop != "object" || ahdtop == null )
     ahdtop = get_ahdtop();
    if (typeof ahdtop.cb_after_showing_pb != "undefined")
    {
        if ( is_tab_selected( "HTMPL=profile_browser.htmpl" ) )
        {
            // Profile browser tab is currently selected, we need to
            // verify that the profile browser tab is currently active and 
            // the child window exists to handle cases where the tab is not
            // finish loading.
            var process_callback = true;
            var w_name = popup_window_name("profile_browser");
            if ( w_name == "profile_browser" )
            {
                // We are showing profile browser in a tab, get the window
                var pb_window = ahdtop.AHD_Windows[w_name];
                if ( ( typeof pb_window != "undefined" ) && 
                     ( typeof pb_window.ahdframe != "undefined" ) )
                {
                    try {
                        // Verify that we can access ahdframe on the profile 
                        // browser window, permission denied exception occurs 
                        // if window is still not accessible.
                        var temp = pb_window.ahdframe;
                    } 
                    catch (ex)
                    {
                        // Profile browser window is not defined, don't process the callback.
                        process_callback = false;
                    }
                }
                else
                {
                    // Profile browser window is not defined.
                    process_callback = false;
                }
            }
            if ( process_callback )
            {
                // Invoke the callback to load the profile browser with the 
                // contact information only when the tab is currently selected/active. 
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
	 // Check if it is a F5 refresh 
	 if ((typeof ahdtop == "object") && 
	     (typeof ahdtop.pb_refresh_urls == "object"))
	 {
	    if (typeof window.page == "object")
		window.page.location.href = ahdtop.pb_refresh_urls["page"];
	    if (typeof window.menu == "object")
	    {
		// Delay half second before loading menu, so it 
		// can display hotkeys in the same way every time 
		setTimeout("window.menu.location.href = '" + 
			   ahdtop.pb_refresh_urls["menu"] + "'", 
			   500);
	    }
	    ahdtop.pb_refresh_urls = void(0);
	    var w_name = get_popup_window_name("profile_browser");
	    // window.name = w_name; 
	    //register_window(window, w_name);
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

// profile_reset_if_necessary()
//    Called on load of the contact read-only form to refresh a profile
//    browser displaying the same contact
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

// pb_refresh()
//    Refresh the contents of the Profile Browser window
function pb_refresh(persid,FromGoBtn)
{
   var esc_persid = nx_escape(persid);
   var modified_persid= esc_persid.replace(/\+/,"%2B"); // replace + with %2B
   var url = cfgCgi + "?SID=" + cfgSID + "+FID=" + fid_generator() +
             "+FACTORY=cnt+OP=GET_DOB+" +
             "PERSID=" + modified_persid;

   if ( persid.match(/^cnt:/) && 
	((typeof ahdtop.pb_args == "object" && ahdtop.pb_args.cnt_count == "1") || 
	persid.match(/^cnt:\w{32}/)) ) {
      url += "+HTMPL=profile_menu.htmpl+get_pref_doc=1";
      item_click('profile_infocnt.htmpl', persid);
      // Delay half second before loading menu, so it 
      // can display hotkeys in the same way every time
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
          url +=    "+KEEP.FromGoBtn=1";
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
       		var modified_in_persid = esc_in_persid.replace(/\+/,"%2B"); // replace + with %2B
         	 query_string += "+OP=GET_DOB+PERSID=" + modified_in_persid;
            }
       query_string += "+HTMPL=" + html;
       if(find_unselected_tab("HTMPL=profile_browser.htmpl")) //if Quick Profile is a tab
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

// Use this function environment lrel attribute, so 
// we can easily plug in the lrel update code. 
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

// pb_keydown()
//    Keydown handler for Profile Browser window
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
               // Fall through... (Shift+Enter = context menu)

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
		   // To do the autofill, the "SET." field has to be set 
		   // to an empty string. In the scratchpad.htmpl, we have 
		   // an onChange handler to set it for the template_name 
		   // field, but in many cases, the onChange handler gets 
		   // called after this function, so it has to be set 
		   // here. The only problem is that it will do autofill 
		   // even when the template_name value is not changed.
		   var temp_obj = document.scrpadForm["SET.template_name"];
		   if (typeof temp_obj == "object")
			temp_obj.value = ""; 
                   pb_select_template();
	       }
         }
      }

      // HOME, END, PAGE_UP, or PAGE_DOWN keys anywhere

      if ( shiftkey &&
           ( keycode == HOME || keycode == PAGE_UP ||
             keycode == END  || keycode == PAGE_DOWN ) ) {
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
               // Falling through...

            case PAGE_UP:
               break;

            case END:
               if ( typeof active_element.type == "string" &&
                    ( active_element.type == "text" ||
                      active_element.type == "textarea" ) ) {
                   e = null;
                   break;
               }
               // Falling through...

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

      // Scratch pad does not have default button, if user
      // presses ENTER on an input text field, ex: Template, 
      // we ignore it. We probably could handle this 
      // globally.
      if ((keycode == ENTER) &&
          (active_element.type == "text") && 
	      (typeof imgBtnDefault != "object"))
        return false;
   }
   return true;
}

//  pb_focus()
//     Focus on a particular item in the current form or in the menu
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
	    // Save the string in the scratchpad before refreshing 
	    if (typeof parent.scratchpad_desc == "string")
	    {
		var text = parent.scratchpad.document.scrpadForm.pbfld100.value;
		if (text != "")
		   parent.scratchpad_desc = text; 
	    }
//	    parent.scratchpad.document.location.reload();

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
	if (parent.menu.loaded &&
	    parent.scratchpad.loaded )
	    parent.scratchpad.pb_scratchpad_setup( parent.menu.call_type );
   }
}

// load_from_scratchpad()
//    Load inital values into a form from the scratchpad
//	set check_ahdtop to "1"  (string) if we are to grab the description
//	from ahdtop, otherwise we auto-detect if we were opened from the PB.
function load_from_scratchpad(id, check_ahdtop)
{
   if ( ( typeof id == "string" && id != "0" ) || // Editing existing
        ( typeof AlertMsg == "string" && AlertMsg.length > 0 ) || // Error
   		(document.getElementById("alertmsg").style.display == "block")) { //yellow bar is displayed, 
		//we don't expect to have a yellow bar when we open the first time a new ticket from profile browser.
      ImgBtnEnableButton("PROFILE_BROWSER");
      ImgBtnEnableButton("PROFILE_BROWSER2");
      return;
   }


	var ahdtop = get_ahdtop();
	
	if (typeof "check_ahdtop" == "string" && "1" == check_ahdtop) {
		// This case typically occurs when ticket's created from a KD opened from Profile Browser
		var desc_elem = findElem("SET.description");
		
		// Prepend PB description to whatever's preset in the ticket desc.
		if (null != desc_elem && typeof ahdtop.PROF_BRWS_DESC == "string") {
			desc_elem.value = msgtext("%1\n%2", ahdtop.PROF_BRWS_DESC, desc_elem.value);
			ahdtop.PROF_BRWS_DESC = null;
			ImgBtnEnableButton("PROFILE_BROWSER");
			ImgBtnEnableButton("PROFILE_BROWSER2");			
			return;
		}
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
                     e.name == "SET.chgalg.description" ||
					 e.name == "SET.category") {
                    if ( text.length > 0 ) {
                      e.value = text;
					  }
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

        // Fill tenant field if present

        if ( typeof pb.menu.argTenantId == "string" &&
             pb.menu.argTenantId.length > 0 )
        {
          if (typeof w.cai_main == "object" && w.cai_main != null && typeof w.cai_main.detailCopyTenant != "undefined") {
            w.cai_main.detailCopyTenant( pb.menu );
	  }
          else if (typeof window.detailCopyTenant != "undefined") {
            // Quick Profile is a Tab and Avoid Popups is on - the new ticket is opened in QP's main pane.
            window.detailCopyTenant( pb.menu );
	  }
        }
       
        // Clear scratch pad if the clear scratch pad 
        // option is on.  
        if ( ahdtop.cfgClearScratchPad=="Yes" )
	      pb_clear_pad_option(pb.scratchpad);

        // Tell profile browser there is an edit form
        
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

// pb_check_for_editwin()
//   Check whether we should enable the "Copy to Edit Form" button on menu
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

// The following functions are used only on the environment forms

// pb_env_mouseover()
//    Show context menu on a mouseover
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

// pb_env_mouseout()
//   Hide the context menu
function pb_env_mouseout(e)
{
   if ( backfillActive )
      ctxMenu.hide();
   return true;
}

// pb_env_backfill()
//    Backfill an asset back to the edit form
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
               //15094252- reset SET field if one exists.
               //alert(setfld.value);
               var setfld=f.elements["SET.affected_resource"];
               if(setfld!=null)
                   setfld.value="";
               b.focus();
            }
         }
      }
   }
}

// pb_env_set_select()
//    Show the alert message band
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

// pb_env_mouseclick()
//   Respond to a mouseclick by either backfilling or popping up a detail
function pb_env_mouseclick(linkid)
{
   var asset = myAssets[linkid];
   if ( typeof asset == "object" && asset != null ) {
      if ( backfillActive )
         pb_env_backfill(asset[1]);
      else
         //showDetailWithPersidKeep(asset[0], "frm001");
         showDetailWithPersidKeep(asset[0], "IsProfileBrowser", "1");
   }
}

// The following functions are used only in profile_menu.htmpl

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
   label =  linkno + ". " + label;
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
   label =  linkno + ". " + label;
   idx_str =  linkno + ". " + idx_str;
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
                         default:  e.value = combo_name; break;
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

// The following functions are used only in scratchpad.htmpl

function pb_scratchpad_setup( new_call_type )
{
   // Need to Disabled btn008( New Change Order) for all contact types other than Analyst --- SDT 20811
   // ImgBtnEnableButton( "btn008" );

   // Disable the Quick buttons (btn009 and btn012) if the analyst does not 
   // have 'Modify' access for the contact's Preferred Document.

   var bDisableUpdate = ( ahdtop.cfgMultiTenancy == "on" &&
                          typeof parent.menu.tenantUserAuth == "number" &&
                          parent.menu.tenantUserAuth < 2 );
   var bDisableQuickButtons = bDisableUpdate;

   call_type = new_call_type;
   if ( call_type == "1" ) {
     curr_fac =  "cr";
     //curr_fac_name = "request";
     curr_fac_name = msgtext("Request")
     ImgBtnChangeCaption( "btn009", "Quick_Request"); // Quick Request
     ImgBtnChangeCaption( "btn012", "Quick_Close_Request"); // Quick Close Request
     if ( cfgAccessFac_cr < 2 )
       bDisableQuickButtons = true;
   }
   else if ( call_type == "2" ) {
     curr_fac =  "iss";
     //curr_fac_name = "issue";
     curr_fac_name = msgtext("Issue")
     ImgBtnChangeCaption( "btn009", "Quick_Issue"); // Quick Issue
     ImgBtnChangeCaption( "btn012", "Quick_Close_Issue"); // Quick Close Issue         
     if ( cfgAccessFac_iss < 2 )
       bDisableQuickButtons = true;
   }
   else if ( call_type == "3" ) {
     curr_fac =  "in";
     //curr_fac_name = "incident";
     curr_fac_name = msgtext("Incident")
     ImgBtnChangeCaption( "btn009", "Quick_Incident"); // Quick Incident
     ImgBtnChangeCaption( "btn012", "Quick_Close_Incident"); // Quick Close Incident           
     if ( cfgAccessFac_in < 2 )
       bDisableQuickButtons = true;
   }
   else if ( call_type == "4" ) {
     curr_fac =  "pr";
     //curr_fac_name = "problem";
     curr_fac_name = msgtext("Problem")
     ImgBtnChangeCaption( "btn009", "Quick_Problem"); // Quick Problem
     ImgBtnChangeCaption( "btn012", "Quick_Close_Problem"); // Quick Close Problem           
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

   // Setup buttons - disable all fields if update not allowed

   var descriptionField  = document.getElementById("pbfld100");
   var templateField  = document.getElementById("pbfld101");
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

   // Set form title

   try {
    if ( parent.menu.combo_name.length > 0 )
      setWindowTitle(msgtext("%1_Quick_Profile",parent.menu.combo_name),1);
      //             "%1 Quick Profile"
     
   }
   catch(e) {}

   // Test for specific tab request
   
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
                     // Cannot view pane %1 on this Profile Browser
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
            // Cannot view pane %1 on this Profile Browser
            var e = window.document.getElementById("alertmsg");
            e.style.display = "none";
        }
      }
      // USVSWS PROB# 303 - CLEAR SCRATCHPAD DOES NOT CLEAR TEMPLATE ON MOZILLA
      // f.reset does not clear hidden objects instantly when using Mozilla and possibly Netscape
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
	alert('pb_create');
   var obj_type = get_sel_obj_type();
   deferred_create_pending = false;
   deferred_create_callback = void(0);
   var f = window.document.scrpadForm;
   alert(f);
   if ( typeof f == "object" ) {
      var template = f.template_name.value;
      var template_persid = f["SET.template_name"].value;
      if ( template_persid.length > 0 )
         create_new( obj_type, template_persid );
      else if ( template.length == 0 )
		create_new( obj_type, 0 );
      else
         pb_select_template(pb_create);
   }
}

function pb_select_template(callback)
{
alert('4')
  var obj_type = get_sel_obj_type(); 
  var extra = "QBE.NE.template_name=null+use_template=1" + 
	      "+QBE.EQ.template_name.delete_flag=0";

  if ( obj_type == "cr" ) 
    extra += "+QBE.NE.type=I+QBE.NE.type=P";

  // Append tenant restriction if appropriate

  if ( typeof parent.menu.argTenantId == "string" &&
        parent.menu.argTenantId.length > 0 )
    extra += "+QBE.EQ.tenant=" + parent.menu.argTenantId +
      "+KEEP.backfillMessage=" + msgtext("AHD05348", parent.menu.argTenant);
                              // AHD05348 Selections restricted to tenant %1
  
  // Do an initial filter so we find templates with similar
  // service Contracts.  
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
alert('3')
   var qtemplate = document.getElementById("pbfld102");
   qtemplate = qtemplate.options[qtemplate.selectedIndex];
   var qt_value = qtemplate.value.match(/(.*);(.*)/);
   var qtstatus = window.document.getElementById("alertmsgText");
   if ( qt_value[2] == "2" ) { // Review Before Save 
      if (qtstatus != null)
	qtstatus.innerHTML = "";
      create_new( curr_fac, qt_value[1] );
   }
   else {
      //                           Quick create of %1 %2 for %3 in progress
      //if (propIsITIL && (curr_fac_name == "request"
      //			|| curr_fac_name == "incident"
      //			|| curr_fac_name == "problem")) {
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
	  document.qtemplate_form.category.value = document.scrpadForm.pbfld103.value;
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
alert('2')
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
            //                            Quick create of %1 %2 successful
            //if (propIsITIL && (scratchpad.curr_fac_name == "request"
	    //|| scratchpad.curr_fac_name == "incident"
	    //|| scratchpad.curr_fac_name == "problem")) {
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
    alert('1')
     //option clear_scratch_pad will automatically clear off the scratch pad tex and
     //the hidden field.
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

    var qtstatus = window.document.getElementById("alertmsgText");
    var quick_close_preset = ""; //For quick close preset
    // show status
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

// this is for global profile browser
// it escapes a string that can be safely sent in a url
function gpb_escape(text)
{
	var ahdtop=get_ahdtop();
	text=nx_escape(text);

	// nx_escape() does not get everything!
	text=text.replace(/\*/g, "%2a");
	text=text.replace(/\+/g, "%2b");
	text=text.replace(/\-/g, "%2d");
	text=text.replace(/\./g, "%2e");
	text=text.replace(/\//g, "%2f");
	text=text.replace(/\@/g, "%40");
	text=text.replace(/\_/g, "%5f");
	return text;
}


// Does a KT search, passing the contact of the PB and 
// the scratchpad text.
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
