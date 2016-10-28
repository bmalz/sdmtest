var exim_CategoryField;
var exim_CategoryDefaultValue = "";
var exim_CategoryOldValue = "";
var exim_valuesArray = [];
var exim_classificationInputTitle = "Klasyfikacja";
var exim_classificationHiddenInputName = "SET.category";
var exim_descriptionFieldName = "SET.description";
var exim_description = [];

var OwningContracts = "";
var FZId = "";
var IsHidden = false;

jq(document).ready(function() {
	exim_CategoryField = jq("input[name='" + exim_classificationHiddenInputName + "']");
	
	if(exim_CategoryField.length == 1) {
		exim_CategoryDefaultValue = exim_CategoryField.val();
		exim_CategoryOldValue = exim_CategoryField.val();
		var exim_input = jq("input[title='" + exim_classificationInputTitle + "']");
		exim_input.focus( function() {
			exim_StoreProperties();
		});
		var exim_link = jq("label[for='" + exim_input.attr('id') + "']").closest('a');
		exim_link.click(function() {
			exim_StoreProperties();
		});		
	}
});

// 20130907 bmalz @ e-xim
function GetOwningContracts(OContracts) {
	if(OContracts.length == 1) {
		OwningContracts = "delete_flag = 0 AND owning_contract = " + OContracts[0];
	} else if (OContracts.length > 1) {
		OwningContracts = "delete_flag = 0 AND owning_contract IN (";
		OwningContracts += OContracts.join();
		OwningContracts += ")";
	} else {
		OwningContracts = "";
	}
}

// 20131025 bmalz @ e-xim
function GetFZId(FZIdValue) {
	FZId = FZIdValue;
	if (typeof SetZFOnChangeEvent == "function")
		SetZFOnChangeEvent();
}

// 20131023 mch @ e-xim
function GetZfzsdsc(zsdscName, zsdscCode) {
	document.main_form.elements["KEY.zfzsdsc"].value = zsdscName;
	document.main_form.elements["SET.zfzsdsc"].value = zsdscCode;
}

// 20130826 bmalz @ e-xim
function SetzSLA(zSLAId, zSLAName) {
	document.main_form.elements["KEY.zsla"].value = zSLAName;
	document.main_form.elements["SET.zsla"].value = zSLAId;
}

// 20131015 mch @ e-xim
function GetZsdsc(zsdscName, zsdscCode) {
	document.main_form.elements["KEY.zsdsc"].value = zsdscName;
	document.main_form.elements["SET.zsdsc"].value = zsdscCode;
}

// 20131029 bmalz @ e-xim
function SetManager(managerName, managerCode) {
	if (jq("td[pdmqa=zinitmanager]").length > 0) {
		jq("td[pdmqa=zinitmanager]").val(managerName);
	}

	if(typeof document.main_form.elements["SET.zinitmanager"] != "undefined" && typeof document.main_form.elements["KEY.zinitmanager"] != "undefined") {
		document.main_form.elements["SET.zinitmanager"].value = managerCode;
		document.main_form.elements["KEY.zinitmanager"].value = managerName;
	}
}

// 20131105 bmalz @ e-xim
function SetChgGroup(groupName, groupCode) {
	if (typeof document.main_form.elements["KEY.group"] != "undefined" && typeof document.main_form.elements["SET.group"] != "undefined") {
		document.main_form.elements["KEY.group"].value = groupName;
		document.main_form.elements["SET.group"].value = groupCode;

		jq("input[pdmqa=group]").val(groupName);
	}
}

// 20131105 bmalz @ e-xim
function SetChgZCategory(zcategoryCode) {
	if (typeof document.main_form.elements["SET.chgtype"] != "undefined") {
		document.main_form.elements["SET.chgtype"].value = zcategoryCode;
		jq("select[pdmqa=chgtype]").val(zcategoryCode).attr('selected', true);
	}
}

// 20131106 bmalz @ e-xim
function SetChgClass(chgclassCode) {
	if (typeof document.main_form.elements["SET.zchgclass"] != "undefined") {
		document.main_form.elements["SET.zchgclass"].value = chgclassCode;
		jq("select[pdmqa=zchgclass]").val(chgclassCode).attr('selected', true);
	}
}

// 20131105 bmalz @ e-xim
function SetChgAssignee(zassigneName, zassigneCode) {
	if (typeof document.main_form.elements["KEY.assignee"] != "undefined" && typeof document.main_form.elements["SET.assignee"] != "undefined") {
		document.main_form.elements["KEY.assignee"].value = zassigneName;
		document.main_form.elements["SET.assignee"].value = zassigneCode;

		jq("input[pdmqa=assignee]").val(zassigneCode);
	}
}

function GetChgCategory(categoryName, categoryCode) {
	if (typeof document.main_form.elements["KEY.category"] != "undefined" && typeof document.main_form.elements["SET.category"] != "undefined"
		&& categoryName != "" && categoryCode != "") {
		document.main_form.elements["KEY.category"].value = categoryName;
		document.main_form.elements["SET.category"].value = categoryCode;

		jq("input[pdmqa=category]").val(categoryName);

		SetChgCatDetails();
	}
}

function SetTitle(Sym) {
	var SymSplitted = Sym.split('.');
	jq('input[pdmqa=summary]').val(SymSplitted[SymSplitted.length-2] + " " + SymSplitted[SymSplitted.length-1]);
}

function exim_InitFromEvent() {
	if (typeof document.main_form.elements["KEY.customer"] != "undefined" && typeof document.main_form.elements["SET.customer"] != "undefined") {
		GetCntMore();
	}
}

function exim_UpdateCategoryEvent() {
	if (document.main_form.elements["SET.category"].value.indexOf("pcat:") > -1) {
		// Sprawdzić czy działa na ss_sym na innych formatkach
		var catid = document.main_form.elements["SET.category"].value.replace("pcat:", "");
		var catsym = document.main_form.elements["KEY.category"].value;
		// alert('exim_UpdateCategoryEvent');
		var url = cfgCgi + "?SID=" + cfgSID + "+FID=" + fid_generator() +
				"+OP=SEARCH+FACTORY=pcat+SKIPLIST=1+HTMPL=exim_pcat_getdetails.htmpl"+
				"+QBE.EQ.id=" + encodeURIComponent(catid);

		jq("#HiddenDiv").load(url, function(response, status, xhr) {
	      if (status == "error") {
	        var msg = "Sorry but there was an error: ";
	        alert( msg + xhr.status + " " + xhr.statusText );
	      }
	    });

		SendForZsdsc(catid);

		SetPropertiesSection();
		SetTitle(catsym);
	} else if (document.main_form.elements["SET.category"].value.length > 0) {
		SetChgCatDetails();
	}

	exim_CopyFieldValues();
}

function SendForZsdsc(catid) {
	var url3 = cfgCgi + "?SID=" + cfgSID + "+FID=" + fid_generator() +
		"+OP=SEARCH+FACTORY=pcat+SKIPLIST=1+HTMPL=exim_pcat_getzsdsc.htmpl"+
		"+QBE.EQ.id=" + encodeURIComponent(catid);

	jq("#HiddenDiv").load(url3, function(response, status, xhr) {
      if (status == "error") {
        var msg = "Sorry but there was an error: ";
        alert( msg + xhr.status + " " + xhr.statusText );
      }
    });
}

function SetChgCatDetails() {
	var catcode = document.main_form.elements["SET.category"].value;
	var catsym = document.main_form.elements["KEY.category"].value;
	// alert('exim_UpdateCategoryEvent');
	var url = cfgCgi + "?SID=" + cfgSID + "+FID=" + fid_generator() +
			"+OP=SEARCH+FACTORY=chgcat+SKIPLIST=1+HTMPL=exim_chgcat_getdetails.htmpl"+
			"+QBE.EQ.code=" + encodeURIComponent(catcode);

	jq("#HiddenDiv").load(url, function(response, status, xhr) {
      if (status == "error") {
        var msg = "Sorry but there was an error: ";
        alert( msg + xhr.status + " " + xhr.statusText );
      }
    });
}

function SetPropertiesSection() {
	// 20131028 bmalz @ e-xim : For 'section' when generated properties (rel: detail_form.js & load_properties.htmpl)
	jq(document).ready(function() {
		jq("[id^='PropSection_']").closest("td").attr("colSpan", "3");
	});
}

function exim_CopyFieldValues() {
	var exim_props = jq('#propertyDiv');
	var exim_table = exim_props.find('table');
	
	var exim_inputs = exim_GetInputFields(exim_table);
	for(var i = 0; i < exim_inputs.length; i++) {
		var exim_index = exim_FindObjectByLabel(exim_valuesArray, exim_inputs[i].label, exim_inputs[i].type);
		if(exim_index !== -1) {
			var exim_oldItem = exim_valuesArray[exim_index];
			var exim_newItem = jq('#' + exim_inputs[i].id);
			if(exim_newItem.attr('type') === 'text') {
				exim_newItem.val(exim_oldItem.value);
			}
			else if(exim_newItem.attr('type') === 'checkbox') {
				var exim_pdmqa = exim_newItem.attr('pdmqa');
				var exim_hidden_checkbox = jq("input[name='SET." + exim_pdmqa + ".value']");
			
				if(exim_oldItem.value) {
					exim_newItem.attr('value', 'Yes');
					exim_newItem.attr('checked', 'checked');
					exim_hidden_checkbox.attr('value', 'Yes');
				}
				else {
					exim_newItem.attr('value', 'No');
					exim_hidden_checkbox.attr('value', 'No');
				}
			}
		}		
	}
	
	var exim_selections = exim_GetSelectionFields(exim_table);
	for(var i = 0; i < exim_selections.length; i++) {
		var exim_index = exim_FindObjectByLabel(exim_valuesArray, exim_selections[i].label, exim_selections[i].type);
		if(exim_index !== -1) {
			var exim_oldItem = exim_valuesArray[exim_index];
			jq('#' + exim_selections[i].id).find('option').each(function() {
				if(jq(this).text() === exim_oldItem.value) {
					jq(this).attr('selected', true);
				}
			});
		}
	}
	
	var exim_temp1 = exim_inputs.concat(exim_selections);
	for(var i = 0; i < exim_valuesArray.length; i++) {
		var exim_index = exim_FindObjectByLabel(exim_temp1, exim_valuesArray[i].label, exim_valuesArray[i].type);
		if(exim_index === -1) {
			exim_description.push(exim_valuesArray[i].label + ": " + exim_valuesArray[i].value);
		}
	}
	
	if(exim_description.length > 0) {
	 	var exim_description_textarea = jq("textarea[name='" + exim_descriptionFieldName + "']");
		if(exim_description_textarea.length > 0) {
			exim_description_textarea.val(function(index, val) {
				if(val.length > 0) {
					return val + "\r\n\r\n" + exim_description.join("\r\n");
				}
				else {
					return exim_description.join("\r\n");
				}
			});
		}
	}
}

function exim_FindObjectByLabel(exim_array, label, type) {
	if(exim_array.length > 0) {
		for(var i = 0; i < exim_array.length; i++) {
			if(  jq.trim(exim_array[i].label.toLowerCase().replace('*', '')) == jq.trim(label.toLowerCase().replace('*', '')) && exim_array[i].type == type) {
				return i;
			}
		}
		return -1;
	}
	else {
		return -1;
	}
}

function exim_GetInputFields(exim_table) {
	var exim_localArray = [];
	exim_table.find("input[pdmqa^='prop']").each(function() {
		var exim_item = jq(this);
		var obj = {};
		if(exim_item.attr('type') === 'text') {
			obj = { label: exim_item.attr('title'), type: 'text', id: exim_item.attr('id'), pdmqa: exim_item.attr('pdmqa'), name: exim_item.attr('name'), value: exim_item.val() };
		}
		else if(exim_item.attr('type') === 'checkbox') {
			obj = { label: exim_item.attr('title'), type: 'checkbox', id: exim_item.attr('id'), pdmqa: exim_item.attr('pdmqa'), name: exim_item.attr('name'), value: exim_item.attr('checked') };
		}
		exim_localArray.push(obj);
	});	
	return exim_localArray;
}

function exim_GetSelectionFields(exim_table) {
	var exim_localArray = [];
	exim_table.find("select[pdmqa^='prop']").each(function() {
		var exim_item = jq(this);
		var exim_Selected = exim_item.find(':selected').text();
		var obj = { label: exim_item.attr('title'), type: 'select', id: exim_item.attr('id'), pdmqa: exim_item.attr('pdmqa'), name: exim_item.attr('name'), value: exim_Selected };
		exim_localArray.push(obj);
	});
	return exim_localArray;
}

function exim_StoreProperties() {
	var exim_props = jq('#propertyDiv');
	var exim_table = exim_props.find('table');
	var exim_inputs = exim_GetInputFields(exim_table);
	var exim_selection = exim_GetSelectionFields(exim_table);
	
	if(exim_inputs.length === 0 && exim_selection.length === 0) {
		return;
	}
	else {	
		exim_valuesArray = [];
		exim_valuesArray = exim_inputs.concat(exim_selection);
	}	
}

// 20130919 bmalz @ e-xim
function setCookie(c_name, value, exdays)
{
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie=c_name + "=" + c_value;
}

// 20130919 bmalz @ e-xim
function getCookie(c_name)
{
	var c_value = document.cookie;
	var c_start = c_value.indexOf(" " + c_name + "=");
	if (c_start == -1)
	  {
	  c_start = c_value.indexOf(c_name + "=");
	  }
	if (c_start == -1)
	  {
	  c_value = null;
	  }
	else
	  {
	  c_start = c_value.indexOf("=", c_start) + 1;
	  var c_end = c_value.indexOf(";", c_start);
	  if (c_end == -1)
	  {
	c_end = c_value.length;
	}
	c_value = unescape(c_value.substring(c_start,c_end));
	}
	return c_value;
}

// 20130919 bmalz @ e-xim
function checkCnoteCookie(position)
{
	var CnoteVal=getCookie('Cnote_' + position + '_date');
	if (CnoteVal!=null && CnoteVal!="")
		return CnoteVal;
	else
		return "";
}

// 20131012 bmalz @ e-xim
function check_post_code(fld_obj, fld_country)
{
    if (typeof fld_obj == "undefined" || typeof fld_country == "undefined")
		return true;

	if (jq('input[name=SET.' + fld_country + ']').val().toUpperCase() == "197") {
		var str = fld_obj.value;
		if (str.match(/^\d{2}-\d{3}$/)) {
			detailReportValidation(fld_obj,0);
			return true;
		} 
		else
		{
			detailReportValidation( fld_obj, 1, "Niepoprawny kod pocztowy");
			return false;
		}
	} else {
		detailReportValidation(fld_obj,0);
		return true;
	}
}

// 20131030 bmalz @ e-xim
function ShowFrameOnError() {
	var url;
	if (ahdtop.frames[11].name = "workframe_3") {
		url = ahdtop.frames[11].location.href;
	}
	else 
	{
		url = ahdtop.frames[10].location.href;
	}

	url = url.replace("+KEEP.Hidden=1", "+KEEP.Hidden=0");

	if (typeof(ahdtop.product.frames[0].frames[1]) != "undefined") {
		ahdtop.product.frames[0].frames[1].location.href = url;
	}
	else 
	{
		ahdtop.product.frames[1].location.href = url;
	}
}

var exim = {
	// 20131110 bmalz @ e-xim
	StringToUnixTimestamp: function(datestr)
	{
		if (typeof datestr != "undefined" && datestr != "") {
			var dateSplit = datestr.split('.');
			return new Date(dateSplit[2], dateSplit[1]-1, dateSplit[0]).getTime() / 1000;
		} else {
			return "";
		}
	}
}