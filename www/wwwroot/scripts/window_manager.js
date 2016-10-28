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
// Module:  window_manager.js
// Created: 05/07/01
////////////////////////////////////////////////////////////////////////////
// Description:
//    Functions to manage popup windows
//
//
////////////////////////////////////////////////////////////////////////////



// @(#)$Id: window_manager.js ASPEN.52 2012/05/25 15:37:35 kumka02 Exp $

var scrollDivCount = 0;
var scrollDivsClosed = 0;
var postScrollDivOpen = false;

// get_ahdtop()
//    Get a value for ahdtop if at all possible.  We search the parents of
//    this window or frame, and their openers till we find AHDtop or reach
//    a null value.
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
                typeof win.name == "string"  &&
                win.name == "AHDtop" ) {
              window.ahdtop = win;
              return window.ahdtop;
           }
       }
    }
    catch (e) {}

    // Uh-oh - we cannot find ahdtop.  Give an alert if requested

    if ( typeof alert_on_error == "boolean"  &&
	     alert_on_error )
	  alert("Unable to perform requested operation in window " +
             window.name + " - ahdtop not found");
      // Note: this message must be hardcoded, as we cannot retrieve
      //       from msg_cat without ahdtop!
    window.ahdtop = void(0);
    return window.ahdtop;
}
var ahdtop = get_ahdtop();
var _browser;
if ( typeof ahdtop == "object" )
  _browser = ahdtop._browser;

// register_window()
//    Add a new window to the AHD_Windows object in AHDtop
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
      //alert("Registering " + newwin.name + " ahdtop is " + typeof ahdtop)
      ahdtop.AHD_Windows[newwin.name] = newwin;

      // If the user is displaying a window list, refresh it

      if ( newwin.name != popup_window_name("ahdwlist") &&
            newwin.document.title.length > 0 ) {
          refresh_window_list();
      }
    }

    // If we're unable to access the new window, but caller provided
    // a name, just accept it without further verification (SCO 6470)

    else if ( typeof name == "string" && name.length > 0 ) {
      //alert("Registering " + name + " ahdtop is " + typeof ahdtop)
      ahdtop.AHD_Windows[name] = newwin;
    }
  }
}

// cancel_actlog()
// Use the main window to cancel an actlog because
// occasionally, the cancel URL didn't get sent out
// when the window was closed with the X button.
function cancel_actlog(ahdframe)
{
    // Check if it has info for cancelling a actlog
    if (typeof ahdframe.propFormName != "string" ||
	typeof ahdframe.cfgCgi != "string" ||
	typeof ahdframe.cfgSID != "string" ||
	typeof ahdframe.cfgFID != "string" ||
	typeof ahdframe.propFactory != "string")
	return 0;
    // Check if it's a actlog
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
    // Construct the cancel URL
    var url = ahdframe.cfgCgi +
        "?SID=" + ahdframe.cfgSID +
        "+FID=" + ahdframe.cfgFID +
        "+OP=CANCEL+FACTORY=" + ahdframe.propFactory +
	"+HTMPL=cancel_empty.htmpl";
    // Send it through main form. We don't care
    // the returning page, so use "ONE_WAY".
    ahdtop_load_workframe(url, 0, "ONE_WAY");
    if (window.name == "welcomebanner")
	ahdframeset.close();
    return 1;
}

// cancel_window()
//    Deregister a window and run its cancel function
function cancel_window()
{
   if ( typeof sessionEnded == "boolean" && sessionEnded )
      return true;
   if ( ahdframeset.name == "AHDtop" ) {
      if ( ! ahdframeset.gobtn.form_cancelled ) {
         ahdframeset.gobtn.form_cancelled = true;
         // PWC - 02/27/04 - Replace xxx.content eith ahdframe
         //if ( typeof parent.content.ImgBtnDoCancel != "undefined" )
         //   parent.content.ImgBtnDoCancel();
         if ( typeof ahdframe.ImgBtnDoCancel != "undefined" )
			ahdframe.ImgBtnDoCancel();
      }
      return true;
   }
   // Alway use the ahdframe window saved with the ahdframeset because the
   // local ahdframe variable could save the window other than cai_main.
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
      // If it is editing, make sure it does cancel only once.
      // STAR 12916945
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
   // If user closes the window before the updating form
   // shows up, we use the following code to send the
   // REMOVECACHE url to the webengine without delay, so
   // the group_leader can be unchecked.
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

   // avoid the extra call to show_detail
   if (typeof ahdframe.propFormName == "string" && ahdframe.propFormName == "show_main_detail.htmpl") 
	  return;

   // If our opener has an auto refresh window list that includes us,
   // refresh it
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
          // Detail form
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
				// Check the status of the page before trying to refresh it in order to avoid errors displaying the page.
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

// deregister_window()
//    Remove a window from the AHD_Windows object in AHDtop
function deregister_window()
{
  var non_top = 0;
  try {
    if ( window == window.parent ||
        window.ahdframeset != ahdtop ) {
      if ( typeof ahdtop == "object" &&
          ahdtop != null &&
          ! ahdtop.closed ) {

        // If the caller provided an argument, take it as the window to
        // deregister.  Otherwise, deregister the current window.

        var closing_window = window;
	// Set closing_window to the top window,
	// so it can find all child windows.
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

        // Skip out if we're closing all windows - everything's going
        // away anyway.

        if ( typeof ahdtop.closing_all_windows == "boolean" &&
            ! ahdtop.closing_all_windows ) {

          // Close all windows opened by this one except editing
          // windows.

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
                // If the children window is in edit mode, keep
                // it up because user may like to finish editing.
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

          // Delete the closing window and refresh the list

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

// all_child_edit_windows_closed()
//   Determine if a window has any child edit windows (including LREL forms).
//   If so, ask the user if it's OK to close them.  Return false if there are
//   edit windows the user is unwilling to close; true otherwise.
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

        // We have a child of the window in the argument!
        // Test whether or not it's an edit or LREL window.

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

  // OK, there's at least one popup edit window.  Ask the user if they're
  // willing to close them.

  msg += "\n" + msgtext("Press_OK_to_close_them",caption);
  if ( ! confirm(msg) )
    return false;

  // The user confirmed close.  Go ahead and close all edit windows

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

// closing_main_window()
//    The main AHD window is being closed.  Do a logout if necessary
function closing_main_window()
{
  if(typeof ahdtop == "object" && typeof ahdtop.ticketObj == "object")
	ahdtop.ticketObj.closeObject(1);

  if ( typeof ahdtop == "object" &&
       ahdtop != null && ( ! ahdtop.closed ) &&
       typeof ahdtop.AHD_logout_requested != "undefined" &&
       !ahdtop.AHD_logout_requested ) {

    // If there is an object is in the process of loading,
    // we close it, so no generate Javascript errors.

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

      // Send an URL to BO to logoff
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

      // valre03 - Add a delay so that the URL replace can complete
      // before the frames are destroyed.
      var before_time = (new Date()).getTime();
      var after_time;
      do {
        after_time = (new Date()).getTime();
      } while (after_time < before_time + 1000);	// 1 second delay
    }
    close_all_windows(1);
    ahdtop.window.name = "";
    ahdtop.ahdtop = void(0);
  }
}

// During logout, check for log_reader form.
// If there is one, test the CloseLogReader user preference
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

// Close all windows with a check for
// editing windows
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
            ahdtop.close_edit_window.skipAdd = 1; // Close all editing windows
        else 
	        return 1; // More editing
    }
    else
	ahdtop.close_edit_window = new CloseEditWindow(query_string, 0);
    ret = close_all_windows(0, chgRole);
    // 0 - All windows are closed.
    // 1 - User wants to go ahead and close all editing windows.
    // 2 - User wants to do more editing.
    if (ret == 2)
        return 2;
    if (ret == 1 &&
	typeof ahdtop.close_edit_window == "object")
    {
	// Close editing windows
        ahdtop.close_edit_window.skipAdd = 1;
	close_all_windows(1, chgRole);
    }
    return 0;
}

// logout_all_windows()
//    Close all known windows and logout
function logout_all_windows(need_logout)
{
    if (typeof ahdtop == "object" && ahdtop != null &&
	typeof need_logout == "number" &&
	need_logout == 1 &&
	typeof ahdtop.cfgBOServerLocation == "string" &&
	ahdtop.cfgBOServerLocation != "")
    {
	// Logoff Business Objects
	ahdtop.check_bo_info(0, 1);
    }
   // else
	logout_all_windows_cb(need_logout);
}

function logout_all_windows_cb(need_logout) {
	// Self service code
	if(typeof ahdtop == "object" && typeof ahdtop.ticketObj == "object")
		ahdtop.ticketObj.closeObject(1);

    // If this function called through the object
    // that has a label, "Log Out", we know an
    // action key has been pressed. Confirm
    // the logout action with user.
    if ((typeof this.label == "string") &&
	(this.label == "Log Out"))
    {
	if (!confirm(msgtext("Received_logout_action_key_req")))
	    return;
    }
    // pre-logout opportunity for forms.
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

       // If user wants to keep log_reader, use URL
       // to get only login page, but skip logout,
       // so the session can be used by log_reader.

       if (!check_log_reader(ahdtop))
           query_string += "?SID=" + cfgSID + "+FID=1";
       else
           need_logout = 0;

       // If calling this function from login.htmpl, we know
       // the session is gone. No logout is necessary.
       // By default, this function will do logout.

       if ((typeof need_logout == "undefined") || need_logout) {
           query_string += "+OP=LOGOUT";
           if ( ahdtop.popupResized ||
                ahdtop.toolbarInitalTab != ahdtop.toolbarCurrentTab ) {
              // Update user preferences
              var attrs = "";
              var vals = "";
              if ( ahdtop.cstPopup1[0] != 0 ) {
                 attrs = "WEB_POPUP1_HEIGHT,WEB_POPUP1_WIDTH";
                 vals  = ahdtop.cstPopup1[0] + "," + ahdtop.cstPopup1[1];
              }
              if ( ahdtop.cstPopup2[0] != 0 ) {
                 if ( attrs.length > 0 ) {
                    attrs += ",";
                    vals += ",";
                 }
                 attrs += "WEB_POPUP2_HEIGHT,WEB_POPUP2_WIDTH";
                 vals  += ahdtop.cstPopup2[0] + "," + ahdtop.cstPopup2[1];
              }
              if ( ahdtop.cstPopup3[0] != 0 ) {
                 if ( attrs.length > 0 ) {
                    attrs += ",";
                    vals += ",";
                 }
                 attrs += "WEB_POPUP3_HEIGHT,WEB_POPUP3_WIDTH";
                 vals  += ahdtop.cstPopup3[0] + "," + ahdtop.cstPopup3[1];
              }
              if ( ahdtop.cstPopup4[0] != 0 ) {
                 if ( attrs.length > 0 ) {
                    attrs += ",";
                    vals += ",";
                 }
                 attrs += "WEB_POPUP4_HEIGHT,WEB_POPUP4_WIDTH";
                 vals  += ahdtop.cstPopup4[0] + "," + ahdtop.cstPopup4[1];
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

       // Add pointers to the user open scoreboard folders.
       // Commented out because the best place to store it would be
       // in USP_PREFERENCES, and it is too late to add a new column.

       //try {
       //  var openFolders = ahdtop.product.sd.scoreboard.openFolders();
       //  if ( typeof openFolders == "string" &&
       //       openFolders.length > 0 )
       //    query_string += "+SCBD=" + nx_escape(openFolders);
       //}
       //catch(e) {}

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
        // Delay needed for Netscape 6.2
        setTimeout("window.document.location.replace('" + this.query_string + "')", 100);
   }
}

// The close_all_window function called from
// menubar. It doesn't return any value back,
// so it won't have a problem of showing the
// return code on the page while accessing
// through keys.
function menubar_close_all_windows()
{
    close_all_windows();
}

// close_all_windows()
//    Close all known windows
//    The force flag is used when onUnload is
//    called for the main page. This closes all
//    the windows regardless. The termination
//    of the session should cancel the checkout
//    on the editing form.
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
            // For logout, save all editing windows and
            // do not close them yet
            if ((typeof ahdtop.close_edit_window == "object") &&
                !ahdtop.close_edit_window.skipAdd &&
                (typeof ahdwin.cai_main != "undefined") &&
                (ahdwin.cai_main.edit_form == 1))
            {
                ahdtop.close_edit_window.add_window(ahdwin);
                continue;
            }

                    // Skip windows marked with exclude_from_win_close.
                    if (typeof ahdwin.exclude_from_win_close == "boolean" && ahdwin.exclude_from_win_close) {
                       continue;
                    }
		    // Skip the Log Reader if the user preference is set
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
		    // When cancelling the editable form, it returns cancel.htmpl form
		    // which uses ahdtop, so cannot set andtop to null before the
		    // ImgBtnDoCancel code.
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
		// Make sure it is not gone yet before setting focus on it.
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

// session_timeout()
//    Tell the user his session is toast and give him a login form
function session_timeout(sid, currWin)
{

  if ( typeof cfgCgi == "string" ) {
    if ( typeof workframe == "object" &&
         typeof sid == "string" && sid != "0" ) {
      workframe.location.href =
                            cfgCgi + "?SID=" + sid + "+FID=0+ENDSESSION=1";

      // Send an URL to BO to logoff
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

    // Build URL to display login form.  We need this only if we are
    // not already displaying login in ahdtop

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

	// SDT 19909-- Need to use window.setTimeout
	// Because mozilla drops the call stack when a window closes.
    setTimeout("finish_session_timeout('" + url + "');",10);
  }
}

// SDT 19909
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
// popup_window_list
//    Popup a list of all windows
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

// refresh_window_list()
//    Reload the window list
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

// cleanup_window_list()
//    Remove closed windows from the list
function cleanup_window_list()
{
    if ( typeof ahdtop == "object"  && ahdtop != null && ! ahdtop.closed ){
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

/////////////////////////////////////////
//	Additional way of showing the notification history form.
//	Pops up Notification History from the Service Desk View Menu .
//	This version shows all log records without restrictions.
/////////////////////////////////////////

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

/////////////////////////////////////////
//	Standard way of showing the notification history form.
//	Pops up the Notification History form from an object detail.
//	'form' is the HTML form name which contains the 'FACTORY' element, standard on
//	HTMPL details.
//	We currently only support 'cr' and 'chg' factories.
/////////////////////////////////////////
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

// focus_windows()
//    Bring the specified window to the top
function focus_window(window_name)
{
    if ( typeof ahdtop == "object"  && ahdtop != null && ! ahdtop.closed )
    {
	var win = ahdtop.AHD_Windows[window_name];
	if ( typeof win == "object" &&
	     typeof win.closed == "boolean" &&
	     ! win.closed )
	    win.focus();
    }
}

// focus_main_windows()
//    Bring the main window to the top
function focus_main_window()
{
    if ( typeof ahdtop == "object"  && ahdtop != null && ! ahdtop.closed )
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

// switchToDetail()
//    Switch the focus to the detail window for a specified object
// Parameters:
//		factory - object factory, may be a persid
//		id - object ID
//		reload - bollean if to reload the page
//		popup_url
//		bHideMenuAndLogo
//		sAdditionalUrl - Additional URL to use
//		bForceEdit - Open the detail page in edit mode no matter what the source is
//	    do_ReloadOnTmpWin - Used to reload the detail page after temp window show_main_detail is closed. Mainly used to change the persid
//		bOptOpeninNewWindow - (Optional) Open in new window even when suggest knowledge is in use
//						this parameter is needed when opening a document from a ticket search when avoid popup is selected
function switchToDetail( factory, id, reload, GLType, popup_url, bHideMenuAndLogo, sAdditionalUrl, bForceEdit, do_ReloadOnTmpWin, bOptOpeninNewWindow)
{
   //Assigning bOpeninNewWindow value using the optional parameter
   var bOpeninNewWindow = false;
   if ( typeof bOptOpeninNewWindow == "boolean" ){
	  bOpeninNewWindow = bOptOpeninNewWindow
   }
   //
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
   //
   var bReloadOnTmpWin = false;
   if ( typeof  do_ReloadOnTmpWin == "boolean" )
	 bReloadOnTmpWin = do_ReloadOnTmpWin
   //alert("switchToDetail("+factory+","+id+")" );
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
		 if ( ahdwin.ahdframe.name == "frmDTUserNode" && // Case when switching from DT viewer to DT editor
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
                // If AlertMsg has message string in it,
                // we skip reload and show the message on
                // the cai_main frame.
                if (typeof AlertMsg == "string" &&
                    AlertMsg != "" &&
                    AlertMsg != "updateOK" &&
                    typeof cai_main.AlertMsg != "undefined" &&
                    typeof cai_main.detailValidate != "undefined")

                {
                    cai_main.AlertMsg = AlertMsg;
                    cai_main.detailValidate(2);  // Setting special case for switchToDetail, we need to display error
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
                      formatAlertMsg(); // Change "updateOK" flag
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
				
				 // Find safari or chrome - Assumption safari word is present in chrome user agent string too.
				_browser.isSafari = navigator.userAgent.toLowerCase().indexOf('webkit') > -1;
    
				// window,focus() doesnt work properly in Chrome and Safari. 
				// So, calling window.blur() and then window.focus() as a workaround
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
        formatAlertMsg(); // Change "updateOK" flag
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
					&& sAdditionalUrl.indexOf("FOR_CAPREASON=") != -1 ) // sAdditionalUrl has 'FOR_CAPREASON' if escalate activity was a success
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
            var  dtlwin_str = "window." + dtlWin.name;
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
				// Notification (Factory "aty") is a special case. Because of the way "aty" is designed we need to pass
				// the macro persid and not the aty persid in the lrel_parent_persid argument
				// in request_to_update() (see update_lrel.js) before calling switchToDetail(). Hence the factory right
				// here in the code will be "macro" and not "aty". so check for "macro" instead of "aty" and don't pass true in the
				// 3rd argument of replace_page().
				// Note that this check will not affect the lrel's in detail_macro.htmpl who's factory is also "macro".
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

// formatAlertMsg()
//   Replace the "updateOK" flag with "Save Successful" and append details
//   about what was saved if available
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
          // Replace all "<" and ">" with corresponding char constants so name is not interpreted as a html tags.
          ahdtop.saveAckMsgObjectName = ahdtop.saveAckMsgObjectName.replace(/>/gi,'&#062;'); // > (greater than)
          ahdtop.saveAckMsgObjectName = ahdtop.saveAckMsgObjectName.replace(/</gi,'&#060;'); // < (less than)
      }
      AlertMsg += msgtext(ahdtop.saveAckMsgNum,
                           " " + ahdtop.saveAckMsgFactoryName,
                           " " + ahdtop.saveAckMsgObjectName );
		//Check fo rexistance of variable 'saveAckMsgExtra'
		//if value in it is not empty, append it to 'AlertMsg'
		//E.g. value for "saveAckMsgExtra" is initialized usign a local attribute
		//of change object
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

// alertSecondaryUpd()
//     Check if we need to amend the AlertMsg for a secondary update
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
// disable_right_click()
//   Disable the mouse right click
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
    
    // SCO 42397 : Enter this if condition, for left click (i.e mouse_event == 1) in Mac OS
    // to achieve context menu on Ctrl + Click
    if ( ! bOverrideDisableRightClick  &&
	 (((mouse_event == 1) && (_browser.isMAC))||
	   mouse_event == 2 ||
	   mouse_event == 3 ||
	   mouse_event == 19))
    {
	var alert_msg = "";
	if ( typeof propFormName == "string" )
	    alert_msg = ahdtop.msgtext_with_pfx("This_form_is_%1\n",propFormName); // This form is %1

	// Suppress the print message if we do not have a file menu.
	if( typeof __menuBar != "undefined" )
		alert_msg += ahdtop.msgtext_with_pfx("Use_File_menu_to_print_or_refr"); // Use File menu to print or refresh this page
	alert(alert_msg);
	return false;
    }
    if (_browser.isIE)
	return true;
    else
	return false;
}
// CAisdPrint()
//   This function prepares the window for printing by changing
//   the Overflow attribute to visible.  If you do not do this
//   you will only get the visible portion of the window.  This
//   is only required for MSIE.
function CAisdPrint()
{
   // Call OnBeforePrint() if exists
   if (typeof OnBeforePrint == "function")
   {
      OnBeforePrint();
   }

   if(typeof window.parent.frames['page']=="object")
      window.parent.frames['page'].print();
   else
      window.setTimeout("ahdframe.print()", 100);
}
// KDRefresh()
//   This function calls the OnBeforeKDRefresh function to set a
//   flag so the survey comment form don't pop up, when the survey 
//   comment option is on and a Knowledge Document is refreshed 
function KDRefresh()
{
    if(typeof OnBeforeKDRefresh == "function")
    {
        OnBeforeKDRefresh();
    }
}

var rClickMenu = void(0);
// showAboutAndRefresh - If true, hides the About and Refresh context menu items, used for limited display areas 
//                       with Firefox since context menus are not shown in a popup.
function disable_right_click(showMenu, showAboutAndRefresh)
{
    // SCO 40433 START		
    // Find safari|chrome or firefox - Assumption safari word is present in chrome user agent string too.
    _browser.isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;
    _browser.isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    // SCO 40433 END
    	
    // When a form is shown in a Mouseover Preview, set showMenu to false - no Context Menu.
    if (typeof cfgMOPreviewMode == "number" && cfgMOPreviewMode == 1) {
        showMenu = false;
    }
    
    // SCO 40433 - below if condition modified
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
            rClickMenu.addItem( msgtext("Print_Form%1...",formName), "CAisdPrint()" ); // Print
            if ( typeof showAboutAndRefresh != "boolean" || showAboutAndRefresh )
            {
                rClickMenu.addItem( msgtext("Refresh"), "refreshForm()" ); // Refresh
            }
            if ( typeof propFormName == "string" )
              rClickMenu.addItem( msgtext("Help_on_This_Window..."), // Help On This Window...
                                  "help_on_form(self.propFormName)" );

            rClickMenu.finish();
          }
       }
    }
}

// showRClickMenu()
//    Show the right-click menu
var paste_field;
function showRClickMenu(evt)
{
  paste_field = null;
  if ( typeof event == "object" )
    evt = event;

  
  // SCO 42397 : Don't ignore Ctrl key in MAC OS
  // else context menu on Ctrl + Click will fail in MAC 
  
   if (( evt.ctrlKey ) && (!_browser.isMAC))
    return true;

  if ( typeof ahdtop != "object" || ! ahdtop.mouseoverMenus ) {
    // We are using right click for a context menu.  Find out if the
    // standard USD context menu has been overridden with an
    // oncontextmenu attribute on a parent tag
    var node;
    if ( evt.srcElement )
      node = evt.srcElement; // IE target
    else if ( evt.target )
      node = evt.target; // Mozilla target
    if ( typeof node == "object" &&
         node != null ) {
      // Only editable fields(text, text area) allow paste.
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
    // First, if we are opening a Mouseover Preview, do nothing.
    if (typeof cfgMOPreviewMode == "number" && cfgMOPreviewMode == 1) {
        return;
    }

    // Perform some magic here...
    // If this is the top level window, or a child-frame of, the title should be:
    // FormTitle - ...
    // If it is a popup window (is the parent frame AHDTop?), the title should be
    // ... - FormTitle.

    // Loop up through the windows / frames until we get to the top
    var win;
    for (win = self;
	 win.name != "AHDtop" && typeof win.parent == "object" && typeof win.parent.name == "string" && win != win.parent;
	 win = win.parent);

	//SDT 34512 window titles kludge for Knowledge Categories and Category Browse popups
	var url=window.location.href;
	if(url.search("KEEP.IsPopUp=1") != -1 && url.search("FACTORY=KD")!= -1 && (!(url.search("list_architect_KDs.htmpl")!= -1 || url.search("list_architect_KDs_Pref.htmpl")!= -1)))
	{
		title =  window.ahdframe.hdrTitlePopup;
	}
	if(url.search("list_architect_KDs.htmpl")!= -1 || url.search("list_architect_KDs_Pref.htmpl")!= -1)
	{
		title =  window.ahdframe.hdrTitle;
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
		if(title.indexOf("<%") > -1) title.replace(/\<\%/g,"&lt;%"); 	// work around IE "feature"
		document.title= title ;
	}
}

// std_head_setup()
//    Record request time and set security
var show_header,            //
    cfgIsCS,                // Obsolete - is this Customer Service?
    cfgAllowPopupResize,    // Always true except for Netscape 4
    timeoutId,              // ?
    currDocument,           // Obsolete - equivalent to document
    cfgCAISD,               // Path to CAISD virtual directory
    cfgCgi,                 // Name of CGI executable
    cfgCgiReportScript,     // Name of CGI report executable
    cfgSID,                 // Current session ID
    cfgProductName,         // Name of this product
    cfgProductID,           // Internal code for product
    cstID,                  // Contact ID of logged-in user
    cfgUserType,            // Type - analyst, customer, employee
    cfgGuestUser,           // "1" if this is the anonymous user
    cfgARGISurl,            // URL for Argis or null
    cfgLdapEnabled,         // "1" if LDAP in use
    cfgCIurl,               // URL for Knowledge Tools or null
    cfgHTurl,               // URL for Collabartion Tools or null
    cfgETRUSTurl,           // URL for ETrust or null
    cfgAnyContact,          // Obsolete - Affected End User unrestricted
    cfgSearchStr,           // Search string
    cfgAccessReqMgr,        // Security for requests
    cfgAccessChgMgr,        // Security for change orders
    cfgAccessIssMgr,        // Security for issue
    cfgAccessAdmin,         // Security for administration functions
    cfgAccessInventory,     // Security for assets
    cfgAccessRef,           // Security for reference tables
    cfgAccessNotify,        // Security for notifications
    cfgAccessSecurity,      // Security for security itself
	cfgAccessAnmt,			// Security for announcements
	cfgAccessCallMgrRef,	// Security for incident/problem/request reference
	cfgAccessCallMgrTpl,	// Security for incident/problem/request templates
	cfgAccessChgMgrTpl,		// Security for change order templates
	cfgAccessChgRef,		// Security for change order reference
	cfgAccessCi ,			// Security for configuration items
	cfgAccessCiComn,		// Security for configuration item common readonly
	cfgAccessCiRef,			// Security for configuration item reference
	cfgAccessContact,		// Security for contacts
	cfgAccessGroup,			// Security for groups
	cfgAccessIssMgrTpl,		// Security for issue templates
	cfgAccessIssRef,		// Security for issue reference
	cfgAccessLoc,			// Security for locations
	cfgAccessNotRef,		// Security for notification reference
	cfgAccessOrg,			// Security for organizations
	cfgAccessPri,			// Security for prioritization
	cfgAccessSvcLvl,		// Security for service levels
	cfgAccessSite,			// Security for sites
	cfgAccessStoredQuery,	// Security for stored queries
	cfgAccessSurvey,		// Security for surveys
	cfgAccessTentAdmin,		// Security for tenant administration
	cfgAccessTimeZone,		// Security for timezones
	cfgAccessWfRef,			// Security for workflow reference
	cfgAccessWorkshift,		// Security for workshift
	cfgAccessFac_lr,		// Security for Notification log factory
	cfgAccessFac_in,		// Security for incident factory
	cfgAccessFac_pr,		// Security for problem factory
	cfgAccessFac_cr,		// Security for request factory
	cfgAccessFac_chg,		// Security for change order factory
	cfgAccessFac_iss,		// Security for issue factory
	cfgAccessFac_all_lr,	// Security for all_lr factory
	cfgAccessFac_cnt,		// Security for contact factory
    cfgUserid,              // Userid of logged in user
    cfgDateFormat,          // Current date format
    cfgDateFormatNoTime,	// Current date format without time
    cfgCIEbrUrl,            // Obsolete - see cfgCIurl
    cfgFaqInstalled,        // Obsolete - see cfgCIurl
    cfgCIEbrInstalled,      // Obsolete - see cfgCIurl
    propIframe,             // Form loaded into an IFRAME
    ahdframe = window,      // Main AHD frame (cai_main or content)
    ahdframeset,            // Top-level frameset
    form_title;             // Title of current form

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
		 // PWC - 02/27/04 - w.content is an intrinsic property of
		 // the window object in Mozilla - replace 'content' frame with 'cai_main'
		 // in sd_main.htmpl
         //if ( typeof w.content == "object" )
         //   ahdframe = w.content;
         if ( typeof w.cai_main == "object" )	// main window and popup window
            ahdframe = w.cai_main;
         else if ( typeof w.role_main == "object" )	// role main window
            ahdframe = w.role_main;
         else if ( typeof w.page == "object" )	// profile browser window
            ahdframe = w.page;
         else if ( typeof w.frmKDs == "object" ) // knowledge architect window
            ahdframe = w.frmKDs;
         else if ( typeof w.menu_tree_main == "object" ) // menu tree editor window
            ahdframe = w.menu_tree_main;
         else if ( typeof w.impact_explorer_main == "object" ) // impact explorer window
            ahdframe = w.impact_explorer_main;
          else if ( typeof w.frmAdmin == "object" ) // administration window
            ahdframe = w.frmAdmin;
          else if ( typeof w.kdlist == "object" ) // knowledge faq/search tools window
            ahdframe = w.kdlist;
          else if ( typeof w.tourframe == "object") // tour window
			ahdframe = w.tourframe;
		  else if ( typeof w.frmDTUserNode == "object") // decision tree window
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
         // SEVERE ERROR: Cannot find USP frames in %1
         alertmsg("SEVERE_ERROR:_can't_find_USP_f", window.name );
         return;
      }
   }

  // When accessing SD through portal the parent window of "ahdtop" will be the portal
  // and results in a "permission denied" Error for the "welcome_banner" window.
  // So to safe-guard from the Error adding the check below.
  // try&catch added as sometimes ahdframe could be wrongly set yet and will be reassinged
  // a little bit later while ahdframeset is already set correctly
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
      // Continue initializing the page because IE7
      // doesn't close the page right away and gives
      // error when loading rest of the page.

      // return;
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

   // Copy values from ahdtop

   if ( typeof ahdtop == "object"  && ahdtop != null && ! ahdtop.closed ) {
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

   // For R5.5 form
   if ( forLrel == "1" &&
   		propFormName1 == "update" &&
		propFormName2 == "lrel" &&
        typeof window.opener != "object")
   {
       window.opener = parent.opener;
   }
}

// set_action_in_progress()
//    Display the spinning ball to indicate something is active
var currentAction = 0; // Was curr_form_action - renamed to detect usage without ahdframe
var resumeAction = void(0);
var ACTN_COMPLETE = 0;
var ACTN_SAVE     = 1;
var ACTN_CANCEL   = 2;
var ACTN_LOADPROP = 3;
var ACTN_FILLFORM = 4;
var ACTN_SEARCH   = 5;
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

// For ACTN_AUTOFILL, we delay the time of setting it 
// to other action, so we can properly handle 
// firing up multiple events at the same time.  
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
	    
	setTimeout("set_action_in_progress_intern(" + action + "," +  setReqTime + ")", 1000);
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
	      ahdtop.propInitialPopup == "1" ){ // If coming from KT this flag is "1"
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
		//this portion is used if users did not implement the banner & go button and
		//they have implemented the <PDM_INCLUDE FILE=hourglass.htmpl> in the pages
		//so that they can have the hourglass shown on these pages
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

// is_action_in_progress()
//    Silent (no alert) to get if ahdframe.currentAction == ACTN_COMPLETE
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
// action_in_progress()
//    Check if something is active
function action_in_progress()
{
   if ( ahdframe.currentAction == ACTN_COMPLETE )
      return false;
   if ( typeof ahdtop != "object" || ahdtop == null || ahdtop.closed )
      return false;
   if ( typeof ahdtop.AHD_logout_requested != "undefined" &&
        ahdtop.AHD_logout_requested )
      return false;

   // Note: Cannot use symbolics in switch statement below because this
   //       file is used in customer & employee interfaces which must
   //       support (ugh) Netscape 4
   switch ( ahdframe.currentAction ) {
      case 1: // ACTN_SAVE (Save)
         alertmsg("Save_in_progress_-_please_wait");
         return true;

      case 2: // ACTN_CANCEL (Cancel)
         alertmsg("Cancel_in_progress_-_please_wa");
         return true;

      case 3: // ACTN_LOADPROP (Load properties)
	 if (typeof ahdframe.resumeAction == "undefined" ||
	     ahdframe.resumeAction.indexOf("detailCancel") == -1)
	    alertmsg("Currently_adding_property_fiel");
         return true;

      case 4: // ACTN_FILLFORM (Form incomplete)
         alertmsg("Form_incomplete_-_please_wait");
         return true;

      case 5: // ACTN_SEARCH (Search)
         alertmsg("Search_in_progress_-_please_wa");
         return true;

      case 6: // ACTN_AUTOFILL (Autofill)
         alertmsg("Field_completion_in_progress_-");
         return true;

      case 7: // ACTN_LOADFORM (Loading form)
         alertmsg("Page_load_in_progress_-_please");
         return true;

      case 8: // ACTN_UPDATE_COUNTS (Scoreboard update counts)
         alertmsg("Update_counts_in_progress_-_pl");
         return true;

      case 9: // ACTN_CHK_ASSIGNEE
		 if (typeof ahdframe.resumeAction == "undefined")
			alertmsg("Assignee_check_in_progress_-_p");
		 return true;
      case 10: // ACTN_RUN_ARCPUR
		alertmsg("Issuing_request(s)_to_run_arch");
		return true;
      case 11: // ACTN_RUN_FMGRP
		alertmsg("Processing_request_to_refresh_");
		return true;
      case 12: // ACTN_RUN_NOTIF
		alertmsg("Processing_request_to_refresh_");
		return true;
      case 13: // ACTN_CIA_MAINT
		alertmsg("Change_Impact_Analyzer_mainten");
		return true;
      case 14: // ACTN_UPLOAD
		alertmsg("Upload_is_in_progress_-_please");
		return true;
      case 15: // ACTN_BO_LOGOFF
		alertmsg("Logout_is_in_progress_-_please");
		return true;
      case 16: // ACTN_CONFLICT_ANALYSIS
		alertmsg("Conflict_is_in_progress_-_please");
		return true;
      case 17: //ACTN_UPD_TRANS
        alertmsg("Transition_update_in_progress_-_please_wait");
		return true;
      default:
         alertmsg("Currently_performing_action_%1", ahdframe.currentAction);
         return true;
   }
}

// getActionKeyWindow()
//    Find the window containing the action key array
function getActionKeyWindow(useCurTab)
{
   var w = ( typeof ahdframeset == "object" ? ahdframeset : ahdtop );
   if ( w == ahdtop &&
        typeof w.toolbarTab == "object" ) {

     // If we are on the main frame, store the action key array in the
     // toolbar tab iframe.  This makes action keys local to the
     // currently active tab.
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

// createTabActionKeyArray()
//    Create an action key array to store action keys on a notebook tab
function createTabActionKeyArray()
{
  var w = getActionKeyWindow();
  w.actionKeyTab = new Array();
  w.tabLoading = true;
  return w.actionKeyTab;
}

// setTabLoadComplete()
//    Turn off the tabLoading flag
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

// setTabActionKey()
//    Reset the action key array for the current notebook tab
function setTabActionKey(actionKeyTab)
{
  var w = getActionKeyWindow();
  w.actionKeyTab = actionKeyTab;
}

///////////////////////
// Character codes
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
////////////////////////

var shiftKey = false;
var ctrlKey_saved = false;
var fallbackHotkey = "$"; // The fallback hotkey when all are in use
try { if ( ahdtop.cfgUserType != "analyst" ) fallbackHotkey = ""; }
catch(e) {}

// Use this function to handle F5 and
// ctrl-r on a popup.
function refresh_handler(key_pressed)
{
    // F5 refreshing profile browser had problem
    // in both IE and mozilla.
    if (ahdframeset.name != "AHDtop")
    {
	var main_frame = ahdframeset.ahdframe;
	// The profile browser does not use lastClosedURL
	// so save the urls for page and menu frames.
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

    // IE and a popup
    if (_browser.isIE &&
	(ahdframeset.name != "AHDtop"))
    {
	// Ignore ctrl-r
	if (ctrlKey_saved && key_pressed == 82 && _browser.systemLanguage != "de")
	{
	    ctrlKey_saved = false;
	    return false;
	}
	ctrlKey_saved = window.event.ctrlKey;

	// F5 is pressed, ready for refresh
	if (key_pressed == 116)
	{
	    if (typeof ahdtop == "object")
	    {
		var top_url = ahdframeset.location.href;
		var doc_url = ahdframeset.ahdframe.location.href;
		var main_frame = ahdframeset.ahdframe;

		var fid = ahdtop.fid_generator();
		var useParent = 0;

		// If the ahdframe is not the cai_main, we assume
		// that some where between ahdframe and ahdframeset,
		// we can find the cai_main which is the frame we need
		// to get the URL from.
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
		    // Remove POPUP_NAME
		    var pat = new RegExp("[\\+]{0,1}KEEP.POPUP_NAME[^ \\+$]+",  "g");
		    var temp_str1 = doc_url.replace(pat, "");
		    var temp_str = temp_str1.replace(/\? *\+/g, "?");
		    // Reset FID
		    pat = new RegExp("FID[^ \\+$]+",  "g");
		    doc_url = temp_str.replace(pat, "FID=" + fid);
		}
		ahdtop.lastClosedURL = doc_url;
	    }
	    return false;
	}
    }
    return true;
}




// nestedTabKeyDownHandler - handle navigation within a notebook.
//   The first number key pressed after pressing Alt selects the panel;
//   subsequent number keys that the user presses without releasing Alt
//   select tabs within the panel.  To select a new panel, the user must
//   release Alt and press it again.

var accordionSelected = -1;
var prevKey = -1;

function nestedTabKeyDownHandler( altkey, key_pressed )
{				
  // dLog("nestedTab: altkey("+altkey+") key_pressed("+key_pressed+") prevkey("+prevKey+")");
  if ( ! altkey )
  {
    altPressed = false;
    accordionSelected = -1;
  }
  else
  {
	var numkeyPressed = key_pressed - 48; // 48 = Ascii zero
    altPressed = true;
    if ( key_pressed == ALT )
    {
      accordionSelected = -1; // The user is pressing the Alt key itself
      //ahdframe.makeSomeFocus();
    }

    // Check whether the user pressed a number key; that the key doesn't
    // duplicate the previous key (prevents multiple hits from a user
    // pressing (for example) Alt+2), and verify that ahdframe is pointing
    // to a document containing a detail form with a notebook.

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

// uspKeyupHandler - on a key up event, clear the prevKey flag so that we
//    can detect repeated keydown events for the same key.
function uspKeyupHandler (event)
{
	prevKey = -1;	
}


// uspKeydownHandler
//    Check user input for action keys ("heads down")
function uspKeydownHandler(e)
{
    // Find the active element

    var altKey;
    var ctrlKey;
    // also be accessible to other frame
    if (typeof ahdframeset.shiftKey == "boolean")
	ahdframeset.shiftKey = false;
    shiftKey = false;
    var key_pressed;
    var active_element;

    if (_browser.isIE ) {
        // Internet Explorer
        e = window.event;
        altKey = e.altKey;
        ctrlKey = e.ctrlKey;
        shiftKey = e.shiftKey;
        key_pressed = e.keyCode;
       	active_element = document.activeElement;
    }
    else {
        // Netscape 6.x
        altKey = e.altKey;
        ctrlKey = e.ctrlKey;
        shiftKey = e.shiftKey;
       	key_pressed = e.keyCode;
       	active_element = e.target;
    }
   
    // Fix for SCO 40586. In non-US key board layouts, 
    // hitting Alt Gr with a hot key should generate the special
    // character associated with the keyboard layout, rather than 
    // opening up the new tab resgistered for the Hot Key.
    if (ctrlKey && altKey)
		return true;    
     
    // Fix for SCO 38608
    // nestedTabKeyHandler should ignore the numeric key combination with 'shift'
    // E.g fallback key $ ==> alt + shift + 4
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
	// If ALT-SHIFT-4 is pressed, it's
	// ALT-$ (fallback hotkey)
	if (shiftKey &&
	    key_pressed == 52)
	    str_key = fallbackHotkey;
	var ret = true;
	// Skip alt+ctrl+<key> and alt+F1 to alt+F12
	if (!ctrlKey &&
	    (key_pressed < F01 ||  key_pressed > F12))
	{
	    ret = altKeyPressed(str_key, shiftKey);
	}
	if (ret && window != ahdframeset.ahdframe)
	{
	    ret = ahdframeset.ahdframe.uspKeydownHandler(e);
	}
	// If it's not defined in our keydown handler, we
	// let Firefox handle it, so user can enter key 
	// combinations like alt+ctrl+q or alt+F4.
	if (ret)
	    return true;
	// Return false, so it doesn't get processed
	// by Firefox.
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

    // Execute the default button if the user pressed enter in a form element

    if ( key_pressed == ENTER &&
         typeof active_element.type == "string" &&
         active_element.type != "select-one" &&
         active_element.type != "select-multiple" && // ENTER in selection might be making selections.
         active_element.type != "textarea" &&  // ENTER in textarea is newline
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
        // Use the ESC to close the Mouseover Preview.
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

//  setTempKeyDownHandler()
//     Replace the generic keydown handler with one specific to the current event
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

// Alt-D is used by IE7 for setting focus on the
// address bar and used by Firefox 2.0 and later
// for also popping up an address bar dialog if
// the address bar is hidden. In IE7, it doesn't
// even pass the key event for the "D" key to us
// at all. So the decision is to take the "D" key
// out.
// 
// The number keys are reserved for handling navigation within a notebook,
// and are supported in function nestedTabKeyDownHandler()
var allHotkeys = "ABCEFGHIJKLMNOPQRSTUVWXYZ0123456789<>()$";
// If it's a tab deferred page or it's a page containing tabs, 
// remove numbers from allHotkeys.
try {  
if (typeof parent.accordion_tab_info_array != "undefined" ||
    typeof accordion_tab_info_array != "undefined")	
    allHotkeys = "ABCEFGHIJKLMNOPQRSTUVWXYZ<>()$";
}
catch(e) {}

var nonLatinFlag = 0;
// Set the flag regardless if ahdtop exists or not
if ((typeof __messages != "undefined" &&
    __messages["non_latin_flag"] == 1) ||
    (typeof ahdtop == "object" &&
     typeof ahdtop.__messages != "undefined" &&
     ahdtop.__messages["non_latin_flag"] == 1))
    nonLatinFlag = 1;

//  registerActionKey
//     Register a key for alt+x invocation
//        key   - the desired single-character key or null
//        label - the label on the menu item
//        func  - the function to invoke
//        args  - one or more arguments
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
   // Remove void(0) at the end
   for (idx = args.length - 1; idx >=0 ; idx--)
   {
	if (typeof args[idx] != "undefined")
	{
	    args.length = idx + 1;
	    break;
	}
   }

   // Determine the action key

   if ( typeof actionKey == "object" ) {

      // Determine which keys are in use and clean up actionKey arrays

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
		// Occasionally it gives "permission denied" when trying to
		// access actKey.win.closed. Unset the tab action key when
		// this happens.
		w.actionKeyTab[test_key.charCodeAt(0)] = void(0);
	      }

            }
	    // If it's not for a notebook tab, make sure it's
	    // not used in any notebook tab. 
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

      // Create a new action key entry

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

      // Debug: popup warning for inabiity to assign action key

      //else {
      //  var emsg = "Unable to establish hotkey for \"" + label + "\":";
      //  for ( var posn = 0; posn < uc_label.length; posn++ ) {
      //    test_key = uc_label.substr(posn,1);
      //    if ( test_key.match(/\w/) ) {
      //        emsg += "\n" + test_key + ": ";
      //        actKey = actionKey[test_key.toUpperCase().charCodeAt(0)];
      //        if ( typeof actKey != "object" ||
      //            typeof actKey.label != "string" ) {
      //          if ( typeof actKey == "object" )
      //            emsg += "invalid label type " + typeof actKey.label +
      //                    " on existing entry";
      //          else
      //            emsg += "invalid existing entry - " + typeof actKey;
      //          continue;
      //        }
      //        if ( actKey.label != label ||
      //            actKey.func != func ) {
      //          emsg += " is use for " + actKey.label;
      //          continue;
      //        }
      //        if ( typeof args == "object" ) {
      //          if ( args.length != actKey.args.length ) {
      //            emsg += "args length of " + args.length +
      //                    " different from existing length of " +
      //                    actKey.args.length;
      //            continue;
      //          }
      //          for ( i = 0; i < args.length; i++ )
      //            if ( args[i] != actKey.args[i] )
      //              break;
      //          if ( i < args.length ) {
      //            emsg += "conflict with argument " + i +
      //                    " of existing entry";
      //            continue;
      //          }
      //      }
      //      emsg += "uhhh - dunno why we rejected this one";
      //    }
      //  }
      //  alert(emsg);
      //}

      // End of debug code - uncomment to activate
   }

   return my_key;
}

// Create and return a new array.
// Called by registerFallbackKey() to create the 
// fallback key array in the same window as the 
// actionKey array.
function createNewArray ()
{
	var newArray = new Array();
	return newArray;
}	

// registerFallbackKey
//    Register an object for focusing when the user presses the
//    fallback hotkey (usually z)
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

   // Set up the fallback array if necessary

   var fallbackArray = w.actionKey[fallbackHotkey];
   if ( typeof fallbackArray != "object" ) {
     fallbackArray = w.createNewArray();
     fallbackArray[0] = 0; // Current position
     w.actionKey[fallbackHotkey] = fallbackArray;
   }

   // Clean up the fallback array

   var newArray = null;
   for ( var i = 1; i < fallbackArray.length; i++ ) {
     actkeyObj = fallbackArray[i];
     try {
       // Same objID can be used in different deferred tabs
       // so we need to check its window object too.
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
       // If keepPos is true, we simply make sure
       // the object is current and keep the rest.
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

   // Add an object for the new fallback

   actkeyObj = new Object();
   actkeyObj.id = objID;
   actkeyObj.win = window;
   actkeyObj.obj = document.getElementById(objID);
   fallbackArray[fallbackArray.length] = actkeyObj;
}

// actKeyWinUnload()
//    Clear action keys for an unloaded window from the array
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

// bestKey()
//    Find the best key code for a label
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

   // For non-latin label, we get the next available key
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

   // Test the label for valid keys

   var candidate_key = " ";
   for ( var posn = 0; posn < label.length; posn++ ) {
      test_key = uc_label.substr(posn,1);
      // Exclude underscore
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

// fmtLabelWithActkey()
//    Build HTML for a label with one character underlined
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
          // Skip past HTML tag
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

// activateActionKeys()
//    Create links with ACCESSKEY for all 36 action keys
function activateActionKeys()
{
   // If it's not IE, don't activate accesskey.
   // Take care hotkey in uspKeydownHandler
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

// altKeyPressed()
//    Perform an action associated with the alt key
function altKeyPressed(key, shift_key)
{
  //alert("altKeyPressed("+key+")");
  // Set up actionKeys array to reference the actionKey objects for the
  // current notebook tab, the current page, and ahdtop

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

  // Check for the key pressed in all available locations.  If the shift
  // key is pressed, start with ahdtop; otherwise, start with the notebook

  var i;
  var sf_key = shiftKey;
  // The shiftKey is set in the frame which has
  // input focus. The focus may not be on the
  // same frame where it catches the alt key,
  // so, save and retrieve the shiftKey value
  // from the same location, ahdframeset.
  if (typeof ahdframeset.shiftKey == "boolean")
    sf_key = ahdframeset.shiftKey;
  // For Firefox
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

// doHotkeyAction()
//   Execute the action associated with an action key (aka hotkey)
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
      // If it's a disabled button, return false to 
      // find next matching object 
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
         case 0:  actkey.func(); break;
         case 1:  actkey.func(a[0]); break;
         case 2:  actkey.func(a[0],a[1]); break;
         case 3:  actkey.func(a[0],a[1],a[2]); break;
         case 4:  actkey.func(a[0],a[1],a[2],a[3]); break;
         case 5:  actkey.func(a[0],a[1],a[2],a[3],a[4]); break;
         default: actkey.func(a); break;
      }
    return true;
  }

  // If this is the fallback hotkey, find an object to focus on

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
	  // If it's hidden or disabled (not tab-able), skip it. 
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

// clickOnLink
//    Activate the specified link
function clickOnLink(id)
{
  try {
    var link = document.getElementById(id);
    if ( link != null )
      document.location.href = link.href;
  }
  catch(e) {}
}

// setRadioButton
//    Simulate clicking on a radio button
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

// setCheckbox
//    Simulate clicking on a checkbox
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

// setFocus
//    Focus on a specified element in a window or one of its frames
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

// callInFrame()
//   Run some JavaScript in the specified frame
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

// bubbleToMainWIndow()
//    Bubble the current key to the content window keydown handler
function bubbleToMainWindow( active_element, keycode, shiftkey )
{
   var f = parent.ahdframe;
   if ( typeof f == "object" &&
        typeof f.tempKeyDownHandler == "function" )
      return ! f.tempKeyDownHandler( active_element, keycode, shiftkey );
   return false;
}

// insertTabToFrameLink()
//   Generate a hidden link to move the focus to a target frame(s)
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
  // The arguments are a list of frame names.  Copy to a local array
  //  and tack on the name of the current frame as a fallback

  var i, j, frameList = new Array();
  for ( i = 0; i < arguments.length; i++ )
    frameList[i] = arguments[i];
  frameList[i] = window.name;

  // Attempt to find a focusable field in each frame in turn

  for ( var fnum = 0; fnum < frameList.length; fnum++ ) {
    var e, f = parent.frames[frameList[fnum]];
    if ( typeof f != "object" || f == null )
      f = parent.parent.frames[frameList[fnum]];
    if ( typeof f != "object" || f == null )
      f = window.frames[frameList[fnum]];
    if ( typeof f == "object" && f != null ) {

      // First, see if the frame has a preferred intial focus field

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

      // Next, try to find a focusable form field

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

      // No forms fields - try to find a focusable link

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

      // Well, how about a button?
      // Well, maybe not - too confusing on certain panels

      //var buttons = f.document.getElementsByTagName("BUTTON");
      //if ( buttons != null && buttons.length > 0 ) {
      //  for ( i = 0; i < buttons.length; i++ ) {
      //    try { buttons[i].focus(); }
      //    catch(e) { continue; }
      //    return;
      //  }
      //}
    }
  }
}

// isHidden()
//   Determine an element or any of its parents is hidden
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

// holdHTMLText
//    Start holding text written through docWrite
var holdingHTMLText = false;
var writingHTMLText = true;
var htmlTextHolder = "";
function holdHTMLText(writeText)
{
   htmlTextHolder = "";
   holdingHTMLText = true;
   writingHTMLText = ( typeof writeText != "boolean" || writeText );
}

// resetHTMLTextHold()
//    Stop holding text and restore all defaults
function resetHTMLTextHold()
{
    htmlTextHolder = "";
    holdingHTMLText = false;
    writingHTMLText = true;
}

// docWrite()
//   Write a line to the document, with optional save to the text holder
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

// popupHTMLText()
//    Popup a window with the held text
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

// popupDocumentInfo()
//   Popup information about the specified element, including the
//   entire tree below it.
var propIndex;
function popupDocumentInfo(type, element)
{
  // Index of properties needing special handling:
  //   0 => do not incude this property when outputting HTML
  //   "xxx" => rename this property to "xxx" in output HTML
  // Note that this list was compiled for IE - there are a number of
  // Firefox-only properties that should be suppressed that I am leaving
  // as a task for a future release.
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
                textContent: 0 };  // Firefox only
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

// documentInfo()
//   Format information about a single form element
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
      //if ( element.nodeValue.length < 100 )
        info += "\n" + indent + element.nodeValue;
      //else
      //  info += "\n" + indent + element.nodeValue.substring(0,100) + "...";
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
            //else if ( typeof pvalue == "function" ) {
            //  if ( pvalue != null )
            //    info += " " + prop + "=\"" + pvalue.toString().replace(/[\n\r]/g," ");
            //}
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

// getHTMLText()
//    Retrieve the held text
function getHTMLText(reset)
{
    return htmlTextHolder;
}

// startScrollbar()
//    Define the scrollbar DIV
function startScrollbar(maindiv, bScroll, bAfterBtn)
{
	if ( ahdtop.cstUsingScreenReader )
      return;
    try {
      // Do not activate smart scrollbars if a window has its own scrolling
      var scrolling = window.frameElement.scrolling.toLowerCase();
      if ( scrolling == "yes" || scrolling == "auto" )
        return;
    }
    catch(e) {}
    // For list form, if it's right after displaying buttons
    // and there is an open scroll div, we end the scroll
    // div here, so we can have a horizontal scrollbar for
    // buttons.
    if ((typeof bAfterBtn == "boolean") &&
	bAfterBtn &&
	(scrollDivsClosed < scrollDivCount) &&
	(scrollDivCount == 1))
    {
	endScrollbar(false);
	var btn_div = window.document.getElementById("scrollbarDiv0");
	// Hide vertical scrollbar
	btn_div.style.overflowY = "hidden";
	// For IE, add an additional <BR>, so the scrollbar doesn't
	// cover the title.
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
		// Added to support correct positioning of DIVs in IE when doctype validation is added.
		// Bottom code is moved from styles_ahd.css from class ScrollAuto. 
		// But if position:relative is applied on DIV,  method adjScrollDivHeight doesn't 
		// work properly in Firefox. style=position:relative will solve problem in IE in 
		// displaying Scrollbars in list views.
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

// endScrollbar()
//    Terminate the scrollbar DIV
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

// adjScrollDivHeight()
//    Adjust the height of the scollbar DIV on initial load or resize
function adjScrollDivHeight()
{
   if ( typeof _browser != "object" || typeof _browser.isIE != "boolean" )
   {
       // Browser object does not exist or type unknown, don't continue.
       return;
   }
   //document.body.offsetHeight does not give correct height in standard-compliant mode
   //(i.e, when Doctype validation is added, IE only Problem).
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

//This method will verify whether Element has Vertical scrollbar or not.
function hasVScrollbar(element) 
{ 
	if (typeof element != "undefined")
		return (element.clientHeight < element.scrollHeight);
	else	
		return false;
} 

//This method will verify whether Element has Horizontal scrollbar or not.
function hasHScrollbar(element) 
{ 
	if (typeof element != "undefined")
		return (element.clientWidth < element.scrollWidth);
	else	
		return false;
} 

//If inner div is assigned 100% width, it takes 100% of outer divs width. 100% width of outer 
//div includes width of outer divs scrollbars as well.In case outer div has a scrollbar, 
//inner div content is overflowing outer div when Doctype validation is added. 
//Hence instead of 100%, inner div width should be calculated based on 
//outer div clientwidth. clientWidth retrieves the width of the object including padding, 
//but not including margin, border, or scroll bar.(IE only problem with Doctype validation)
function adjInnerDivWidth(scrollDiv, i) {
	//preferences form
	var usp_div = document.getElementById("usp_preferences_div");
	if(typeof usp_div == "object" && usp_div != null)
	usp_div.style.width = scrollDiv.clientWidth - 8 + "px"; 
	//list forms
	if(typeof jq == "function" && i > 0 && typeof jq('#gbox_dataGrid').css('height') == "string" && hasVScrollbar(scrollDiv))
		jq('#gbox_dataGrid').css({'width':scrollDiv.clientWidth - 3});
}

// setScrollOverflow(val)
// Set the overflow value for the scrollbars.  I needed to set this
// value to visible when printing the document.  If it is set to scroll
// auto or hidden then the hidden portions of your document will not
// be printed.
function setScrollOverflow(val)
{
   for ( var i = 0; i < scrollDivCount; i++ ) {
      var scrollDiv = document.getElementById("scrollbarDiv" + i);
      if ( scrollDiv != null )
         scrollDiv.style.overflow= val;
   }
}

// dLog()
//    Debugging function to log a line of data
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

// dLogSave()
//    Internal function to save text into the ahdtop dLog array
function dLogSave(text)
{
  if ( typeof debugLog == "undefined" ) {
     debugLog = new Array();
     debugLogLen = 0;
  }
  debugLog[debugLogLen] = text;
  debugLogLen++;
}

// dLogShow()
//    Display the debug log
function dLogShow()
{
   if ( typeof ahdtop == "object"  && ahdtop != null && ! ahdtop.closed &&
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

// focusById()
//    Convenience function to set focus
function focusById( id )
{
  try {
   var e = document.getElementById(id);
   if ( e != null )
      e.focus();
  }
  catch(e) {}
}

// display_new_page(), replace_page()
//    Load a URL into a page and set POPUP_NAME
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
			// we are in a window that is about to close (show_main_detail).
			// No point in trying to reload it; see if we need to put an
			// AlertMsg in its parent
			if ( typeof win.AlertMsg == "string" &&
				win.AlertMsg.length > 0 &&
				typeof win.top.opener == "object" &&
				typeof win.top.opener.show_response != "undefined" )
				{
				win.formatAlertMsg(); // Change "updateOK" flag

				var oTargetWin = win.top.opener;
				// If the Opener is the  tree the send the message to the list page
				//(The function has been added to kt_faq_tree.htmpl and hiersel_kcat.js returning a handle to list_KD.htmpl)
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

    // first things first,
    // verify ahdtop.cfgCgi then..
    // return unadorned url if it is for an external page

    if ( typeof ahdtop.cfgCgi != "undefined" &&
    		ahdtop.cfgCgi != null &&
    		url.indexOf(ahdtop.cfgCgi) == -1 )
    	return url;

	// It's all SDM url's from here...
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
    // If go_role_menubar is defined,
    // set prop.role_menubar
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
    // Set use_role flag
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
   if ( typeof ahdtop == "object"  && ahdtop != null && ! ahdtop.closed )
      ahdtop.ahd_window_count++;
   return "USD" + (new Date()).getTime();
}

// find_popup_window()
//    Find a popup window by name; return null if not defined
function find_popup_window(w_name)
{
   if ( typeof ahdtop == "object"  && ahdtop != null && ! ahdtop.closed &&
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

// Get real window name if already created, otherwise
// create a new one.
// The real window name is USD<random number>.
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

// Use original window name to find real window name which
// is USD<random number>.
function popup_window_name(w_name)
{
    if ( typeof ahdtop == "object" && ahdtop != null && ! ahdtop.closed )
    {
        if (typeof ahdtop.manage_popup_windows == "undefined")
            return w_name;
        if (typeof ahdtop.manage_popup_windows[w_name] != "undefined")
	    return  ahdtop.manage_popup_windows[w_name];
    }
    return w_name;
}

// Use real window name to find original window name.
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

// Constructor for workframe queue item
// url -- url needs to be issued from workframe
// request_rest -- a flag for the scoreboard
// op_name -- name to identify each url, so we
// will not send the same type of url twice at a
// time.
function wf_queue_item(url, request_reset, op_name)
{
    this.url = url;
    this.request_reset = request_reset;
    this.op_name = op_name;
}

// Constructor for workframe queue item with delay
// queue_item -- workframe queue item object
// delay -- queue the item after the time specified in this variable
// before_queue_cb -- Before queue the item, run this function
// If before_queue_cb return 0, it continues to queue the item,
// otherwise, only removes the item from delay list.
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

// Class function gets called by the setTimeout. It queues the
// item.
// Return value of the callback function:
// 1 -- do not need to queue node
// 0 -- queue the node
wf_delay_item.queue_it = function (idx)
{
    if ( typeof ahdtop != "object" ||
         ahdtop == null || ahdtop.closed ||
	     typeof ahdtop.wf_delay_list == "undefined"  ||
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
	    // If callback function returns 1, remove the node from
	    // delay list and return.
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
    // For IE, after completing a SCOREBOARD request
    // the status progress bar stays active and never
    // ends until other event occurs, ex: clicking on
    // Search or refreshing a frame. Use the following
    // code to solve the problem. It browses an empty
    // html file in the workframe used by the
    // SCOREBOARD request.
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

// The work frame manager is in charge of four hidden
// frames in ahdtop. We use these frames to issue url
// in the background.
// For one-way url, the url does not expect to have
// a returning page, we use onwway_frame to issue it
// and the queuing is not necessary.
// For other url, the url expects to have a returning
// page, we use three frames, workframe, workframe_1,
// workframe_2, to handle it.
// The frame assignment relies on the op_name passed
// in with the function, load_workframe. The op_name
// is not necessary to be an OP variable in the url.
// It can be any unique name, but the same op_name has
// to appear in both load_workframe and next_workframe
// functions for each url.
// All the urls with the same op_name will use the same
// frame to issue them, one at a time. It is recommended
// that each url has its own unique name, so when one
// failed, other urls still can go through other frames
// to issue the requests.
// There is, by default, a 30 second timeout on each
// frame, but it does not get checked actively. The code
// only checks for the expired frame in the url issuing
// time or whenever the is_expired function is called.
// A web.cfg variable, WorkFrameTimeout, can be used to
// set the timeout value.
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

var NOT_AVAIL = 0;  // No available frame.
var ISSUED = 1;	    // url has been issued
var NEXT = 2;	    // The frame for the same op_name is in use
var REMOVE = 3;	    // The url issued from the frame matches the new url
// Go through the frames and see which one is available and
// use it to issue the url.
// If there is a frame that is currently used by the url with
// the same op_name, do not take the next available frame and
// put the queue_item back to the queue because we do not want
// the same operation gets issued twice from different frames.
Work_Frame_Manager.prototype.issue_url = function (queue_item)
{
    var i;
    var ret = NOT_AVAIL;
    var frame_found = void(0);
    for (i = 0; i < this.frame_arr.length; i++)
    {
	var frame = this.frame_arr[i];
	// If it is expired, free it first.
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

// Three possible op names:
// 1. FID=0, op_name="ONE_WAY". This goes to the oneway_frame.
// 2. OP is specified, op_name=<value of the OP>
// 3. No OP, op_name="NO_OP"
// We use this function to figure out the op_name. Since many
// urls use the same op name, for example, LINK_WITH_BOPSID,
// so it would be better if the coder can come up with his
// own unique name.
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
// load_workframe()
//    Queue a URL into the workframe.
//	SDT 24197 Removed restrictions from this working with a non-DOM
//	browser.
// For properly using multiple frames to handle issuing urls in the
// background, we need to make sure there is no racing condition between
// urls. If two urls have the same SID and FID and they get issued from
// different frames at almost the same time, it could only return one
// result. To avoid this timing issue, we may use fid_generator() to
// generate FID, if possible.
// If in case that we have to use the same FID, we may use the same
// op_name for them, so they can be assigned to the same frame and one
// will wait for the other one.
function load_workframe(url, delay, op_name, before_queue_cb, arg)
{

//exit out if customize scbd window
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

   // If no op_name specified, try best to get the name.
   if (typeof op_name == "undefined" ||
       op_name == "")
	  op_name = wf_mgr.get_op_name(url);

   var queue_item = new  wf_queue_item(url, request_reset, op_name);
   if ((typeof delay == "number") &&
       (delay > 0))
   {
	new wf_delay_item(queue_item, delay, before_queue_cb, arg);
	return true;
   }
   // If it is oneway, do not queue it. Do it
   // right away.
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

// next_workframe()
//    Load the next URL into the workframe
function next_workframe(op_name)
{
   if ( typeof ahdtop != "object"  ||
        ahdtop == null || ahdtop.closed ||
        typeof ahdtop.workframe_queue == "undefined"  ||
        typeof ahdtop.work_frame_mgr == "undefined" )
   {
	return;
   }

   var wf_mgr = ahdtop.work_frame_mgr;
   if (typeof op_name != "undefined" &&
       op_name != "")
	wf_mgr.free_work_frame(op_name);
   var wf_queue = ahdtop.workframe_queue;
   var  i;
   // First check if there is any request reset left.
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

// Before adding the REMOVECACHE request to the queue,
// we like to know if the popup_window is still up. If
// it is, we do not queue the request, so the fid cache
// for this popup window does not go away.
function is_popup_window_still_up(idx)
{
    if ( typeof ahdtop != "object"  ||
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

// build_alertmsg()
//    Add the form elements for displaying the yellow alert message
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
      // Replace all "<" and ">" with corresponding &gt; and &lt; literals.
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
           ShowLockCancel == "yes"   &&
           ! _browser.supportsLayers ) {
         docWrite('<TABLE ID=\"recordlockmsg\" class=alertmsg>\n' +
            '<TR><TD>\n' +
            '<form name="RECORD_LOCK_FORM">\n' +
            msgtext("WARNING:_This_record_is_locked") + // WARNING: This record is locked...
            '<INPUT TYPE=CHECKBOX NAME="RECORD_LOCK_DECISION" ' +
            'onClick=\'setOverRideLock("RECORD_LOCK_FORM", "RECORD_LOCK_DECISION");\'>\n' +
            msgtext("_to_clear_the_lock,_and_then_r") + // to clear the lock and then resubmit
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
// SDT 27287. Merged Jon's fix.
// This function is only for non-IE browser because the URL for IE can't be greater
// than 2047 bytes.
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
		if (typeof e.name != "string" ||  e.name == "") continue;
			if (url.indexOf("?") == -1)
				url += "?";
			else
				url += "&";

               if (e.type.indexOf("select") == 0)
	       {
		   // In detail_USP_PREFERENCES, the selectedIndex gets set to -1
		   // which can cause error for mozilla.
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
						// This is a little cheat but it makes my life easier.
						// Normally if a box is not selected the value does not appear.
						// I am setting this to No.  If you have to change this
						// then please have me fix the Options Manager configuration
						// tool to recognize the change.
                   		url += e.name + "=No" ;
					}
			   } else
                   url += e.name + "=" + nx_escape(e.value).replace(/\+/g,"%2B");
	    }
	}
    // IE browser should not call this function. If it does,
    // simply replace the page with nothing and submit the
    // page.
    if ( _browser.isIE )
    {
       window.location.replace("");
       f.submit();
    }
    else
    {
       // Mozilla connecting to Tomcat has size limitation
       // when using HTTP GET.
       if (url.length > 2047)
	    f.submit();
       else
	    window.location.replace(url);
    }
}

// Display an alertMsg on the parent form
var srtimer = false;	// timer running?
var srtimerid = null;	// timer 'opaque' object
var srmsgtext = null;	// last msg processed

function show_response(in_msgtext, duration, retryCount) {

  // Do not show the message when the form is displayed as a Mouseover Preview.
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
           self.AlertMsg = e.innerHTML; // innerHTML removes extra spaces.
         }
      }	 
      return;
  }

  var msg_displayed = false;
  var winobj = self;
  do {
    // look for our alertmsg element and put the msg there if possible
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
        winobj.AlertMsg = e.innerHTML; // innerHTML removes extra spaces.
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
    // We were unable to find an alertmsg element to hold the message.  It's
    // possible that this is because the form is still loading and hasn't yet
    // built it.  Set a timer to retry in 1/4 second.  Do this four times
    // before giving up.
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
      // Too many retries - give up
      var popupMsg = in_msgtext.replace(RegExp("<BR>","gi"),"\\n");
      window.setTimeout('alert("' + popupMsg + '")', 1);
    }
  }
}

 // msg expiration, clear the alertmsg field IFF it contains the text that we last placed there
 function expire_response() {

  // This always runs in the context of the target window; no explicit window object ref needed
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

// clear_response()
//   Unconditionally clear the AlertMsg field.
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

// function to get img file name and path from ahdtop
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
    // Write license error to the top
    // window, so it does not show
    // error from each frame window.
    if (typeof ahdtop == "object")
	ahdtop.document.writeln(err);
}

// setTimeoutWarning
//   Set or reset a timeout to warn a user of session expiration.  This
//   is controlled by the Timeout and TimeoutWarning web.cfg properties.
//   THe original timeout is set for TimeoutWarning minutes prior to
//   session expiration.  Once the timer pops, we query the server for
//   the actual time since the last interaction and either reset the
//   timer or pop up an alert box, as appropriate.
//   NOTE: Called only by the ahdtop window.

function setTimeoutWarning( idleTime )
{
   if ( typeof idleTime != "number" )
     idleTime = 0; // Initial call from menu_frames.htmpl
   else
     work_frame_mgr.free_work_frame("TIMEOUT"); // Response from query
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
           // WARNING: Your CA Service Desk session will time out at %1
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
    alertmsg("Timeout_reset_-_your_session_w", propTimeout); // Timeout reset...%1 minutes of inactivity
  }
  else {
    alertmsg("Sorry,_your_session_has_alread"); // Sorry, your session has already timed out
    window.location.href = cfgCgi;
  }
}

// The reosurce field in a web form record can use
// the variables, $cgi, $SESSION.SID, $prop.FID,
// and $cst.id. We resolve the variables here.
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
    // FID has to come from the current web page
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

	//
	// We added a try...catch block here so we do not get an error
	// on invalid characters (see SCO11376).
	//
	try {
		str = encodeURIComponent(str);
		// encodeURIComponent does not replace single quote with the hex value so need to do that manually
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

	 //
	 // We added a try...catch block here so we do not get an error
	 // on invalid characters (see SCO11376).
	 //
	 try {
		str = decodeURIComponent(str);
		// decodeURIComponent does not replace single quote so need to do that manually.
		str = str.replace(/%27/g, "\'");
	 }
	 catch (e) {}

	 return str;
}



// nx_html_encode
//   Encodes a string for HTML display by replacing HTML special characters
//   with their escaped equivalent:  EG '<' is replaced with '&lt;'
//   This should be used to 'scrub' user supplied text in order to 
//   prevent cross site scripting attacks, etc
//
//   Note that this escaping is distinct from nx_escape which is URI-centric
//   and encodes special characters using the hex escaping which does not
//   accomplish the same result

function nx_html_encode(str)
{
    if (typeof str != "string" || str.length == 0)
        return str;

    try {
        str=str.replace(/\&/g,   "&amp;");
        str=str.replace(/'/g,    "&#39;");
        str=str.replace(/\\/g,   "&#092;");
        str=str.replace(/"/g,    "&quot;");
        str=str.replace(/\</g,   "&lt;");
        str=str.replace(/\>/g,   "&gt;");
        str=str.replace(/\r\n/g, "<BR>");
    }
    catch (e) {}

    return str;
}


// Generate the HTML code to display the CA logo and Product Name.
// If the user is assigned to a Tenant that has a logo, use the Tenant's logo instead.
//   product_name_style -- (optional) CSS style name used for displaying product name
function generate_logo_product_name_html (product_name_style)
{
   if ( typeof ahdtop != "object" || ahdtop == null )
      ahdtop = get_ahdtop();

   var sdm_product_name_style =  "sdm_product_name sdm_product_name_dark_color"; 
   if ( typeof product_name_style == "string" && product_name_style != "" )
   {
       // Overide the default style
       sdm_product_name_style = product_name_style;
   }

   var lpn_html = '<table class="product_info_container"><tr><td colspan="4" class="head_line"/></tr><tr>';

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

// Generate the HTML code to for displaying the basic form header with the CA logo and Product Name
function generate_basic_form_header_html()
{
   var header_html = '<table class="gn_sdm_header_background gn_container_no_margin gn_container_no_border" width="100%"><tr><td>';
   // Add the product logo and name, override default style so product name shows on dark background.
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

// allocateArray()
//    Allocate a JavaScript array in the context of the window
function allocateArray()
{
  return new Array();
}

// allocateObject()
//    Allocate a JavaScript object in the context of the window
function allocateObject()
{
  return new Object();
}

//Determine Document compatibility mode
function is_standardmode_on()
{
var engine = 5; // Assume quirks mode unless proven otherwise
if (_browser.isIE)
{
   // This is an IE browser. What mode is the engine in?
   if (document.documentMode) // IE8
      engine = document.documentMode;
   else // IE 5-7
   {
      if (document.compatMode)
      {
         if (document.compatMode == "CSS1Compat")
            engine = 7; // standards mode
      }
   }
   // the engine variable now contains the document compatibility mode.
}
if (engine == 7)
	return true;
else 
	return false;
}

// Function to display an alert message on the parent detail form 
// when the main detail form (like ticket detail form) is in view mode and
// there are pending updates and other activities windows still open. 
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

