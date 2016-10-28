// Copyright (c) 2005 CA.  All rights reserved.
var is_netscape = !navigator.appName.indexOf("Netscape");
function popup_date_helper(form_name, control_name, time)
{
	if(typeof time!="undefined" && time=="no")
	{
		var query_str = cfgCgi + "?SID=" + cfgSID + "+FID=" + fid_generator() +
		"+OP=DISPLAY_FORM+HTMPL=v30_date_helper.htmpl" + 
		"+KEEP.form_name=" + form_name +
		"+KEEP.control_name=" + control_name +
		"+KEEP.time=" + time;
	} 
	else
	{
		var query_str = cfgCgi + "?SID=" + cfgSID + "+FID=" + fid_generator() +
		"+OP=DISPLAY_FORM+HTMPL=v30_date_helper.htmpl" + 
		"+KEEP.form_name=" + form_name +
		"+KEEP.control_name=" + control_name;
	}
	var helperWidth = 400; // 20131110 bmalz @ e-xim : prev value 325

	// 20131110 bmalz @ e-xim
	// if (typeof ahdtop == "object" && 
	// 	typeof ahdtop.helperWidth_mod == "number")
	// 	helperWidth = ahdtop.helperWidth_mod;
	if(typeof time!="undefined" && time=="no")
	{
		var helperHeight = 275;
		if (typeof ahdtop == "object" &&
			typeof ahdtop.helperHeight_noTime_mod == "number")
			helperHeight = ahdtop.helperHeight_noTime_mod;	
	}
	else
	{	
		var helperHeight = 400;
		if (typeof ahdtop == "object" && 
			typeof ahdtop.helperHeight_mod == "number")
			helperHeight = ahdtop.helperHeight_mod;
	}
	var helperTop = window.screen.height / 2 - helperHeight / 2;
	var helperLeft = window.screen.width / 2 - helperWidth / 2;
	var features = "scrollbars,resizable,width=" + helperWidth +
	",height=" + helperHeight +
	",top=" + helperTop +
	",left=" + helperLeft;
	if ( ahdtop.propDebugOptions != "" )
		features = modifyWindowFeaturesForDebug(features);
	var popup_win = window.open(query_str, "", features);
	if (!check_popup_blocker(popup_win))
		return;
	register_window(popup_win);
}
function popup_schedule_dialog(form_name, control_name, 
	schedStartvalue, duration)
{
	var w;
	var show_err = false;
	var forceEdit = false;
	if (typeof window.parent.opener == "object" &&
		window.parent.opener != null &&
		typeof window.parent.opener.new_list == "object" &&
		window.parent.opener.new_list != null &&
		typeof window.parent.opener.scheduler_tracked_asset == "object" &&
		window.parent.opener.scheduler_tracked_asset != null) 
	{
		w = window.parent.opener;
		forceEdit = true;
	}
	else
	{
		w = window;
	}
	var chgnr_frm = w.document.getElementById("chgnr_iframe");
	if (chgnr_frm != null)
	{	
		if (typeof chgnr_frm.contentWindow == "object" &&
			chgnr_frm.contentWindow != null && 
			typeof chgnr_frm.contentWindow.new_list == "object" && 
			chgnr_frm.contentWindow.new_list != null &&
			typeof chgnr_frm.contentWindow.try_lrel == "number" &&
			chgnr_frm.contentWindow.try_lrel == 1 )
		{
			w.new_list = chgnr_frm.contentWindow.new_list;
		}
		else 
		{
			w.new_list = w.scheduler_tracked_asset;
		}
		show_err = (w.new_list.length == 0);	
	}
	else 
	{
		show_err = (w.new_list.length == 0 && 
			w.scheduler_tracked_asset == 0);
	}
	if (show_err)
	{
		alertmsg("No_Configuration_Items_selecte");
		return false;	
	}
	if(_dtl.edit || forceEdit)
	{
		isEditForm = true; 
	}
	else
	{
		isEditForm = false;
	}
	var schedStartDate;
	var schedDuration;
	var userInputDate;
	var dateDisplay = new Date();
	dateDisplay.setHours(0);
	dateDisplay.setMinutes(0);
	dateDisplay.setSeconds(0);
	dateDisplay.setMilliseconds(0);
	dateDisplay = dateDisplay.getTime();	
	dateDisplay = dateDisplay / 1000;
	if(schedStartvalue == "" || schedStartvalue == null)
	{
		if (_dtl.edit)
		{
			schedStartDate = document.main_form.elements["SET.sched_start_date"].value;
			schedDuration = document.main_form.elements["SET.sched_duration"].value;
		}
		else
		{
			schedStartDate = argSchedStartDate;
			schedDuration = argSchedDuration;
		}
	}
	else
	{
		schedStartDate = schedStartvalue;
		schedDuration = duration;
	}
	if(schedStartDate != "")
	{
		dateDisplay = new Date();
		userInputDate = string_to_date('', schedStartDate, '');
		dateDisplay.setTime(userInputDate * 1000);
		var hours = dateDisplay.getHours();
		dateDisplay.setMinutes(0);
		dateDisplay.setSeconds(0);
		dateDisplay.setMilliseconds(0);
		if(hours > 11)
		{
			dateDisplay.setHours(12);
		}
		else
		{
			dateDisplay.setHours(0);
		}
		dateDisplay = dateDisplay.getTime() / 1000;
	}
	var win_name_str = "sched_dialog_popup_" + argChgRefNum;
	if (!_dtl.edit) 
	{
		win_name_str += "_ro";
	}
	else 
	{
		try
		{
			var test_win = win_name_str + "_ro";
			var test_win_id = popup_window_name(test_win);
			if (test_win_id.length > 0 &&
				typeof ahdtop.AHD_Windows[test_win_id] == "object" &&
				! ahdtop.AHD_Windows[test_win_id].closed )
			{
				var ro_win = ahdtop.AHD_Windows[test_win_id];
				ro_win.name = "goner";
				delete ahdtop.AHD_Windows[test_win_id];
				ro_win.ahdtop = null;
				ro_win.close();
			}
		}
		catch(e){}
	}
	var win_name = get_popup_window_name(win_name_str);
	var query_str = cfgCgi + "?SID=" + cfgSID+"+FID=" + fid_generator() +
	"+OP=DISPLAY_FORM" + "+displayDate=" + dateDisplay +
	"+persId=" + argPersistentID + "+chgRefNum=" + 
	argChgRefNum + "+chgDuration=" + schedDuration +
	"+userInputDate=" + userInputDate +
	"+HTMPL=schedule_dialog_template.htmpl" +
	"+KEEP.form_name=" + form_name +
	"+KEEP.control_name=" + control_name +
	"+KEEP.IsPopUp=1" +
	"+KEEP.POPUP_NAME=" + win_name +
	"+RELOAD_WIN=0";
	schedule_window = preparePopup(query_str, win_name_str,
		"menubar=no,GOBUTTON=no", 
		void(0), void(0), void(0), true);
	schedule_window.focus();
}
