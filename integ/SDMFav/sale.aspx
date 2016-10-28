<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="sale.aspx.cs" Inherits="SDMFavService.sale" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <title></title>
    <script src="js/jquery-1.9.1.min.js"></script>
    <script src="js/jquery-ui.min.js"></script>
    <script src="js/jquery.ui.combobox.js"></script>
    <script src="js/jquery.ui.timepicker.js"></script>
    <script src="js/jquery.ui.timepicker.locale-pl.js"></script>
    <script src="js/jquery.dataTables.min.js"></script>
    <script src="js/json2.min.js"></script>
    <link href="css/jquery-ui.min.css" rel="stylesheet" />
    <link href="css/jquery.ui.combobox.css" rel="stylesheet" />
    <link href="css/jquery.ui.timepicker.css" rel="stylesheet" />
    <link href="css/jquery.dataTables.css" rel="stylesheet" />
    <link href="css/style.css" rel="stylesheet" />
    <style type="text/css">
        .ui-widget input { font-size: 10px; }
        .page {
            height: 350px;
        }

        #exim-container {
            width: 600px;
        }

        #locationSelect_1 {
            width: 225px;
        }
    </style>
</head>
<body>
    <script type="text/javascript">
        var filterbybusinessowner = false;
        var isrecurrence = false;
        var recurrencerule = "";
        var wsurl = "";
        var divs = [];
        var selectedIndex = 0;
        var ajaxLoading = false;
        var $globalGrid;
        var kateringAdditionalInfo = "";
        var cateringInfoRequired = false;

        function showAjaxLoader() {
            $('#loader').show();
            ajaxLoading = true;
        }

        function hideAjaxLoader() {
            if (ajaxLoading) {
                $('#loader').hide();
                ajaxLoading = false;
            }
        }

        $(document).ready(function () {

            $(document).tooltip();

            showAjaxLoader();

            if ($('#badreq').val() == "1") {
                showErrorBox("Błędne wywołanie systemu rezerwacji sal.");

                $('#slider').hide();
                $('#navigationbuttons').hide();

                return;
            }

            $('#slider').children('div').each(function () {
                divs.push({ id: $(this).attr('id'), selected: false });
                $(this).hide();
            });
            $('#' + divs[selectedIndex].id).show();

            wsurl = $('#wsurl').val();

            getAllLocations(wsurl);
            createTimePicker('#datestart');
            createTimePicker('#dateend');

            $('#cancelbtn').bind('click', function () {
                parent.window.close();
            });
            $('#getbackbtn').bind('click', function () {
                if (selectedIndex == 0) {
                    return;
                }
                else {
                    $('#' + divs[selectedIndex].id).hide();
                    $('#' + divs[selectedIndex - 1].id).show();
                    selectedIndex--;
                }

                $('#createReservationBtn').hide();
                $('#gonextbtn').show();
                $('#gonextbtn').removeAttr('disabled');
            });
            $('#gonextbtn').bind('click', function () {
                if (selectedIndex == divs.length-1) {
                    return;
                }
                else {
                    showAjaxLoader();
                    var isValid = false;

					$('#navigationbuttons').css('margin-top', '0px');

                    if (divs[selectedIndex].id == 'page1') {
                        isValid = validateStep1();
                        if (isValid) {
                            getRoomsForLocation(wsurl);
                        }
                    }
                    else if (divs[selectedIndex].id == 'page2') {
                        isValid = validateStep2();
                        if (isValid) {
                            $('#gonextbtn').hide();
                            //pokaz podsumowanie
                            $('#createReservationBtn').show();
                            var $selectedRow = $globalGrid.$('tr.row_selected');
                            var aData = $globalGrid.fnGetData($selectedRow.get(0));
                            var start = $('#datestart').val();
                            var end = $('#dateend').val();
                            $('#summary_reservationStart').text(start);
                            $('#summary_reservationEnd').text(end);
                            $('#summary_roomName').text(aData['SalaNazwa']);
                            $('#summary_location').text(aData['LokalizacjaNazwa']);
                            $('#summary_rs').val(start);
                            $('#summary_re').val(end);
                            $('#summary_roomuuid').val(aData['SalaUuid']);
                            
                            $('#summary_katering').val($('#kateringBox option:selected').val());
                            $('#summary_katering_span').text($('#kateringBox option:selected').text());
                            $('#summary_urgency').val($('#urgencyBox option:selected').val());
                            $('#summary_urgency_span').text($('#urgencyBox option:selected').text());
                            $('#summary_impact').val($('#impactBox option:selected').val());
                            $('#summary_impact_span').text($('#impactBox option:selected').text());
                            $('#summary_uwagi').text($('#additional_info').val());
                            $('#summary_mpk_span').text($('#selected_mpk').val());
                            $('#summary_mpk').val($('#selected_mpk').val());

                            hideAjaxLoader();
                        }
                    }
                    if (isValid) {
                        $('#' + divs[selectedIndex].id).hide();
                        $('#' + divs[selectedIndex + 1].id).show();

                        selectedIndex++;
                    }
                    else {
                        hideAjaxLoader();
                    }
                }
            });

            $('#gridFilter').accordion({
                collapsible: true,
                active: false,
                heightStyle: "content",
				activate: function(ev, ui) { 
					if(ui.oldPanel.height() > 0) {
						$('#navigationbuttons').css('margin-top', '0px');
					}
					else {
						$('#navigationbuttons').css('margin-top', '130px');
					}
				}
            });

            $('#createReservationBtn').bind('click', function () {
                
                var zdesc = getDescription();
                
                var u = gup('exim_persistent_id').replace("+popupType=1", "");
                var r = $('#summary_roomuuid').val();
                var rn = $('#summary_roomName').text();
                var s = $('#summary_rs').val();
                var e = $('#summary_re').val();

                var zmpk = $('#summary_mpk').val();
                var kat = $('#summary_katering').val();

                var kai = "";
                var kdh = "";

                
                if(kat != "400001") {
                    kai = $('#kateringAdditionalInfoText').val();
                    kdh = $('#kateringDeliveryHour').val();
                }

                var pc = $('#personCount').val();
                
                showAjaxLoader();
                $.ajax({
                    type: "POST",
                    url: wsurl + "MakeReservation",
                    data: JSON.stringify({ userPersistentId: u, roomUuid: r, start: s, end: e, mpk: zmpk, katering: kat, roomName: rn, desc: zdesc, isrec: isrecurrence, recrule: recurrencerule, kateringDodatkoweInfo: kai, kateringDostawa: kdh, iloscOsob: pc }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (msg) {

                        $('#getbackbtn').hide();
                        $('#gonextbtn').hide();
                        $('#createReservationBtn').hide();
                        $('#cancelbtn').val('Zamknij');

                        showSuccessBox('Sala została zarezerwowana.');
                        hideAjaxLoader();
                    },
                    error: function (e) {
                        showErrorBox(e.statusText);
                    }
                });
            });

            initiateMpkDialog();
            initiateRecurrenceDialog();

            $('#kateringDeliveryHour').timepicker();
            $('#personCount').spinner({
                min: 1,
                max: 320,
                step: 1,
                numberFormat: "n"
            });
            $('#personCount').on('keyup', function (e) {
                //48-57
                parseSpinner(e);
            });

            $('#personCount').on('blur', function () {
                parseSpinner();
            });
            
            $('#kateringBox').change(function () {
				
                if (this.value == "400001") {
                    cateringInfoRequired = false;
                    kateringAdditionalInfo = "";
                    $('.kateringTR').each(function () {
                        $(this).hide();
                    });
                }
                else {
                    cateringInfoRequired = true;
                    //pokaz opcje
                    $('.kateringTR').each(function() {
                        $(this).show();
                    });
                    
                }
            });
			
			$('.kateringTR').each(function () {
				$(this).hide();
			});

            hideAjaxLoader();
        });

        function updateCateringDeliveryTime() {
            var vds = $('#datestart').val();
            if(vds.length > 0) {
                var dd = vds.split(' ')[0];
                var ds = new Date(dd.split('-')[0], parseInt(dd.split('-')[1], 10) - 1, dd.split('-')[2]);
                var tt = vds.split(' ')[1];
                ds.setHours(tt.split(':')[0]);
                ds.setMinutes(tt.split(':')[1]);
                $('#kateringDeliveryHour').timepicker("setDate", ds);
            }
        }

        function parseSpinner(e) {
            var v = $('#personCount').val();
            if (!isNaN(v)) {
				if(e != undefined) {
					if (e.keyCode < 48 || e.keyCode > 57) {
						$('#personCount').val(v.substring(0, v.length - 1));
					}
				}
            }
            else {
                $('#personCount').val('');
            }
        }

        function getDescription() {
            var zdesc = "";
            var hardware = "";
            $('#gridFilterContainer').find('input:checkbox').each(function () {
                var $chk = $(this);
                if ($chk.is(':checked')) {
                    hardware += $chk.next('label').text() + "; ";
                }
            });

            var additional_info = $('#additional_info').val();
            if (additional_info.length > 0) {
                zdesc = "Informacje dodatkowe: " + additional_info;
            }
            if (hardware.length > 0) {
                if (zdesc.length > 0) {
                    zdesc += "\r\n";
                }
                zdesc += "Wyposażenie: " + hardware;
            }

            return zdesc;
        }

        function initiateRecurrenceDialog() {
            $('#recurrenceDialog_cancel').click(function () { $('#recurrenceDialog').dialog("close"); });
            $('#recurrenceDialog_save').click(function () {

                if (validateReccurenceDialog()) {

                    var desc = getReccurenceDescription();

                    $('#reccurenceLabel').text(desc);
                    $('#summary_recurrence').text(desc);

                    $('#recurrenceDialog').dialog("close");
                }
            });
            $('#reccurenceBtn').click(function () {
                $('#recurrenceDialog').dialog("open");
            });
            $('#recurrenceDialog_repeat').on('change', function () {
                var classname = $(this).val();
                var desc = $('label[for="repeat_every_text"]');
                if (classname == 'daily') {
                    desc.text('dzień (-dni)');
                }
                else if (classname == 'weekly') {
                    desc.text('tydzień (-tygodnie)');
                }
                else if (classname == 'monthly') {
                    desc.text('miesiąc (-e)');
                }

                $('#recurrenceDialog').find('tr').each(function () {
                    $(this).hide();
                });

                $('.' + classname).show();
            });

            $('#repeat_end_on_date').datepicker({
                showOn: "button",
                buttonImage: "css/images/calendar.png",
                buttonImageOnly: true,
                dateFormat: 'yy-mm-dd'
            });

            $('#repeat_every_text').spinner({ min: 1 });

            $('#repeat_end_on_date').datepicker("option", "disabled", true);

            $('#repeat_end_after').spinner({ min: 1 });
            $('#repeat_end_after').spinner("disable");

            $('#monthly_day').spinner({ min: 1 });
            var now = new Date();
            $('#monthly_day').spinner("value", now.getDate());

            $('input[name="repeat-end-group"]').change(function () {
                var opt = $(this).closest('li').attr('id');
                if (opt == 'repeat-end-group-never-li') {
                    $('#repeat_end_after').spinner("disable");
                    if (!$('label[for="repeat_end_after"]').hasClass('label-disabled')) {
                        $('label[for="repeat_end_after"]').addClass('label-disabled');
                    }
                    $('#repeat_end_on_date').datepicker("option", "disabled", true);
                }
                else if (opt == 'repeat-end-group-after-li') {
                    $('#repeat_end_after').spinner("enable");
                    if ($('label[for="repeat_end_after"]').hasClass('label-disabled')) {
                        $('label[for="repeat_end_after"]').removeClass('label-disabled');
                    }
                    $('#repeat_end_on_date').datepicker("option", "disabled", true);
                }
                else if (opt == 'repeat-end-group-on-li') {
                    $('#repeat_end_after').spinner("disable");
                    if (!$('label[for="repeat_end_after"]').hasClass('label-disabled')) {
                        $('label[for="repeat_end_after"]').addClass('label-disabled');
                    }
                    $('#repeat_end_on_date').datepicker("option", "disabled", false);
                }
            });

            $('#recurrenceDialog').dialog({
                autoOpen: false,
                resizable: false,
                modal: true,
                width: 480,
                height: 300,
                show: {
                    effect: "fadeIn",
                    duration: 100
                },
                hide: {
                    effect: "fadeOut",
                    duration: 100
                }
            });
        }

        function getReccurenceDescription() {
            var desc = "";
            
            var repeat_every_text = parseInt($('#repeat_every_text').val(), 10);
            var roption = $('#recurrenceDialog_repeat').find(':selected').val();
            
            if (roption == 'never') { return "Brak"; }
            else if (roption == 'daily') {
                recurrencerule = "D:"+ repeat_every_text;
                desc = "codziennie, co " + repeat_every_text;
                if (repeat_every_text == 1) {
                    desc += " dzień,";
                }
                else {
                    desc += " dni,";
                }
            }
            else if (roption == 'weekly') {
                recurrencerule = "W:" + repeat_every_text
                desc = "tygodniowo, co " + repeat_every_text;
                if (repeat_every_text == 1) {
                    desc += " tydzień,";
                }
                else if (repeat_every_text > 1 && repeat_every_text < 5) {
                    desc += " tygodnie,";
                }
                else {
                    desc += " tygodni,";
                }

                desc += " w każdy " + getSelectedDays() + ",";
                recurrencerule += ":" + getSelectedDays();
            }
            else if (roption == 'monthly') {
                recurrencerule = "M:" + repeat_every_text
                desc = "miesięcznie, co " + repeat_every_text;
                if (repeat_every_text == 1) {
                    desc += "miesiąc,";
                }
                else if (repeat_every_text > 1 && repeat_every_text < 5) {
                    desc += "miesiące,";
                }
                else {
                    desc += "miesięcy,";
                }

                desc += " każdego " + $('#monthly_day').val() + " dnia miesiąca,";
                recurrencerule += ":" + $('#monthly_day').val();
            }
            isrecurrence = true;
            desc += getRecurrenceEndDescription();

            return desc;
        }

        function getRecurrenceEndDescription() {
            var desc = "";
            var repeat_end = $('input[name=repeat-end-group]:checked').val();
            var repeat_end_after = $('#repeat_end_after').val();
            var repeat_end_on_date = $('#repeat_end_on_date').val();
            if (repeat_end == 'never') {
                recurrencerule += ":N";
                desc = " bez daty końca";
            }
            else if (repeat_end == 'after') {
                recurrencerule += ":A:" + repeat_end_after;
                desc = " koniec po " + repeat_end_after + " wystąpieniach";
            }
            else if (repeat_end == 'on') {
                recurrencerule += ":O:" + repeat_end_on_date;
                desc = " koniec w dniu " + repeat_end_on_date;
            }

            return desc;
        }

        function getSelectedDays() {
            var arr = [];
            if ($('#repeat-on-mon').is(':checked'))
                arr.push('pon');
            if ($('#repeat-on-tue').is(':checked'))
                arr.push('wt');
            if ($('#repeat-on-wed').is(':checked'))
                arr.push('śr');
            if ($('#repeat-on-thu').is(':checked'))
                arr.push('czw');
            if ($('#repeat-on-fri').is(':checked'))
                arr.push('pt');
            if ($('#repeat-on-sat').is(':checked'))
                arr.push('sb');
            if ($('#repeat-on-sun').is(':checked'))
                arr.push('nd');

            return arr.join(', ');
        }

        function validateReccurenceDialog() {
            var roption = $('#recurrenceDialog_repeat').find(':selected').val();
            if (roption == "never") { 
                return true; 
            }
            else if (roption == "daily") {
                var repeat_every_text = $('#repeat_every_text');
                if (repeat_every_text.val().length == 0) {
                    repeat_every_text.addClass("input-error");
                    return false;
                }
                if (!validateReccurenceDialogEnd()) {
                    return false;
                }
            }
            else if (roption == "weekly") {
                var repeat_every_text = $('#repeat_every_text');
                if (repeat_every_text.val().length == 0) {
                    repeat_every_text.addClass("input-error");
                    return false;
                }
                var days = getSelectedDays();
                if (days.length == 0) {
                    $('.select-days').addClass("input-error");
                    return false;
                }
                if (!validateReccurenceDialogEnd()) {
                    return false;
                }
            }
            else if (roption == "monthly") {
                var repeat_every_text = $('#repeat_every_text');
                if (repeat_every_text.val().length == 0) {
                    repeat_every_text.addClass("input-error");
                    return false;
                }
                var monthly_day = $('#monthly_day');
                if (monthly_day.val().length == 0) {
                    monthly_day.addClass("input-error");
                    return false;
                }
                if (!validateReccurenceDialogEnd()) {
                    return false;
                }
            }

            return true;    
        }

        function validateReccurenceDialogEnd() {
            var repeat_end = $('input[name=repeat-end-group]:checked').val();
            if (repeat_end == "after") {
                var repeat_end_after = $('#repeat_end_after');
                if (repeat_end_after.val().length == 0) {
                    repeat_end_after.addClass("input-error");
                    return false;
                }
            }
            else if (repeat_end == "on") {
                var repeat_end_on_date = $('#repeat_end_on_date');
                if (repeat_end_on_date.val().length == 0) {
                    repeat_end_on_date.addClass("input-error");
                    return false;
                }
            }

            return true;
        }

        function selectMpk(val, text) {
            $('#mpkDialog').dialog("close");
            $('#selected_mpk').val(text);
            $('#summary_mpk_span').val(text);
            $('#summary_mpk').val(val);
        }

        function gup(name) {
            name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            var regexS = "[\\?&]" + name + "=([^&#]*)";
            var regex = new RegExp(regexS);
            var results = regex.exec(window.location.href);
            if (results == null)
                return "";
            else
                return results[1];
        }

        function attachEventsForDataTable($grid) {
            $('td.sorting_1').each(function () {
                $(this).removeClass(' sorting_1');
            });

            $('#avaliable_rooms tbody tr').find(':checkbox').each(function () {
                $(this).change(function (e) {
                    var cl = $(this).closest('tr');
                    if (cl.length == 1) {
                        cl.click();
                    }
                });
            });
            
            $('#avaliable_rooms tbody tr').click(function (e) {
                var ele = $(this).find(':checkbox');
                if (!ele.is(':checked')) {
                    //odznacz wszystko
                    $('#avaliable_rooms tbody tr').each(function () {
                        var $tr = $(this);
                        if ($tr.hasClass('row_selected')) {
                            $tr.removeClass('row_selected');
                            $tr.find(':checkbox').prop('checked', false);
                        }
                    });

                    ele.prop('checked', true);
                    $(this).addClass('row_selected');
                }
                else {
                    ele.prop('checked', false);
                    if ($(this).hasClass('row_selected')) {
                        $(this).removeClass('row_selected');
                    }
                }
            });

            $('#gridFilterContainer').find(':checkbox').each(function () {
                $(this).change(function () {
                    var columnIndex = $(this).val();
                    var filterVal = $(this).is(':checked');
                    if (filterVal) {
                        $grid.fnFilter(filterVal, columnIndex);
                    }
                    else {
                        $grid.fnFilter('', columnIndex);
                    }
                });
            });
			
			$('#avaliable_rooms_wrapper').css('height', '100%').css('overflow-y', 'scroll').css('overflow-x', 'hidden');
        }

        function createTimePicker(id) {
            var myControl = {
                create: function (tp_inst, obj, unit, val, min, max, step) {
                    $('<input class="ui-timepicker-input" value="' + val + '" style="width:50%">')
                        .appendTo(obj)
                        .spinner({
                            min: min,
                            max: max,
                            step: step,
                            change: function (e, ui) { // key events
                                // don't call if api was used and not key press
                                if (e.originalEvent !== undefined)
                                    tp_inst._onTimeChange();
                                tp_inst._onSelectHandler();

                                updateCateringDeliveryTime();
                            },
                            spin: function (e, ui) { // spin events
                                tp_inst.control.value(tp_inst, obj, unit, ui.value);
                                tp_inst._onTimeChange();
                                tp_inst._onSelectHandler();

                                updateCateringDeliveryTime();
                            }
                        });
                    return obj;
                },
                options: function (tp_inst, obj, unit, opts, val) {
                    if (typeof (opts) == 'string' && val !== undefined)
                        return obj.find('.ui-timepicker-input').spinner(opts, val);
                    return obj.find('.ui-timepicker-input').spinner(opts);
                },
                value: function (tp_inst, obj, unit, val) {
                    if (val !== undefined)
                        return obj.find('.ui-timepicker-input').spinner('value', val);
                    return obj.find('.ui-timepicker-input').spinner('value');
                }
            };

            var now = new Date();
            var minHour = now.getHours();
            var minMinutes = 0;
            var minutes = now.getMinutes();

            if (minutes >= 0 && minutes <= 15)
                minMinutes = 15;
            else if (minutes > 15 && minutes <= 30)
                minMinutes = 30;
            else if(minutes > 30 && minutes <= 45 )
                minutes = 45;
            else if (minutes > 45) {
                minMinutes = 0;
                minHour += 1;
            }

            $(id).datetimepicker({
                controlType: myControl,
                minDate: new Date(now.getFullYear(),now.getMonth(),now.getDate(), minHour, minMinutes, 0, 0),
                maxDate: "+12W",
                dateFormat: 'yy-mm-dd',
                stepMinute: 15,
                onClose: toggleInfoForUserAboutFiltering
            });
        }

        function toggleInfoForUserAboutFiltering(date, sender) {
            if (sender.id == 'dateend') {
                if ($('#datestart').val().length > 0) {
                    var dd = $('#datestart').val().split(' ')[0];
                    var ds = new Date(dd.split('-')[0], parseInt(dd.split('-')[1], 10) - 1, dd.split('-')[2]);
                    var de = new Date(sender.selectedYear, sender.selectedMonth, sender.selectedDay);
                    if (de - ds > 2595600000) { // powyzej 30 dni
                        addInfoBox("Lista sal zostanie zawężona do tych, w których jesteś koordynatorem, ponieważ wybrany zakres dat rezerwacji przekroczył 30 dni.", 'filter-rooms');
                        filterbybusinessowner = true;
                    }
                    else {
                        $('.filter-rooms').hide();
                        filterbybusinessowner = false;
                    }
                }
            }
            else if (sender.id == 'datestart') {
                if ($('#dateend').val().length > 0) {
                    var dd = $('#dateend').val().split(' ')[0];
                    sender.id = 'dateend';
                    sender.selectedYear = dd.split('-')[0];
                    sender.selectedMonth = parseInt(dd.split('-')[1], 10) - 1;
                    sender.selectedDay = dd.split('-')[2];
                    toggleInfoForUserAboutFiltering(null, sender);
                }
            }

            updateCateringDeliveryTime();
        }

        function addInfoBox(msg, cls) {
            $msg = $('<div class="info ' + cls + '"></div>');
            $msg.html(msg);
            $('#messagepanel').append($msg);
            $msg.show();
        }

        function getAllActiveRooms(uurl) {
            $.ajax({
                type: "POST",
                url: uurl + "GetAllActiveRooms",
                data: '{}',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (msg) {
                    return msg;
                },
                error: function (e) {
                    showErrorBox(e.statusText);
                }
            });
        }

        function getAllLocations(uurl) {
            $.ajax({
                type: "POST",
                url: uurl + "GetLocations",
                data: '{}',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (msg) {
                    var locations = msg.d;
                    var $select = $('#locationSelect');
                    $.each(locations, function () {
                        $select.append('<option value="' + this.Uuid + '">' + this.Name + '</option>');
                        $('#locationSelect').combobox({});
                    });
                },
                error: function (e) {
                    showErrorBox("Wystąpił problem podczas pobierania lokalizacji:<br /><br />" + e.statusText);
                }
            });
        }

        function getRoomsForLocation(uurl) {
            var locationUuid = $('#locationSelect').combobox('value');
            var start = $('#datestart').val();
            var end = $('#dateend').val();

            $('.error').hide();
            if ($('#avaliable_rooms').hasClass('input-error')) {
                $('#avaliable_rooms').removeClass('input-error');
            }

            $.ajax({
                type: "POST",
                url: uurl + "GetRoomsFromLocation",
                data: JSON.stringify({ locationUuid: locationUuid, start: start, end: end }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (msg) {
                    var rooms = msg.d;
					
                    var $grid = $('#avaliable_rooms').dataTable({
                        bProcessing: true,
                        bPaginate: false,
                        bInfo: false,
                        bDestroy: true,
                        bAutoWidth: false,
                        "aaData": rooms,
                        aoColumnDefs  : [{
                            aTargets: [0],
                            fnRender: function (o, v) {
                                return '<input type="checkbox" name="selectBox" />';
                            }
                        }],
                        "aoColumns": [
                            { "mData": "SelectBox", "sWidth": "20px", "bSortable": false },
                            { "sTitle": "Nazwa sali", "mData": "SalaNazwa", "sWidth": "150px" },
                            { "mData": "SalaUuid", "bVisible": false },
                            { "sTitle": "Nazwa lokalizacji", "mData": "LokalizacjaNazwa", "sWidth": "150px" },
                            { "mData": "Ekran", "bVisible": false },
                            { "mData": "Flipchart", "bVisible": false },
                            { "mData": "Monitor", "bVisible": false },
                            { "mData": "Naglosnienie", "bVisible": false },
                            { "mData": "Projektor", "bVisible": false },
                            { "mData": "ProjektorPrzenosny", "bVisible": false },
                            { "mData": "TablicaSuchoscieralna", "bVisible": false },
                            { "mData": "Telekonferencja", "bVisible": false },
                            { "mData": "Videokonferencja", "bVisible": false },
                            { "mData": "Wifi", "bVisible": false },
                            { "mData": "DodatkoweMiejsca", "bVisible": false },
                            { "sTitle": "Pojemność", "mData": "PojemnoscKonferencyjna", "bVisible": true },
                            { "mData": "PojemnoscTeatralna", "bVisible": false },
							{ "mData": "Collisions", "bVisible": false }
                        ],
                        "oLanguage": {
                            "sSearch": "Szukaj sali:"
                        }
                    });

                    $globalGrid = $grid;
                    renderSliderFilters($grid);
                    prefilterData($grid);

                    var pc = $('#personCount').val();
                    filterGridByMinCapacity(pc, $grid);

                    if($globalGrid.fnSettings().fnRecordsDisplay() == 0) {
                        var crit = "- dostępność w terminie od <b>" + $("#datestart").val() + "</b> do <b>" + $("#dateend").val() + "</b><br/>" + 
                            "- lokalizacja: <b>" + $('#locationSelect :selected').text() + "</b><br/>" +
                            "- minimalna pojemność: <b>" + $('#personCount').val() + " osób</b>";

                        $(".dataTables_empty").html("Brak sal spełniających kryteria wyszukiwania:<br/><br/>" + crit)
                        .css('color', '#D8000C').css('text-align', 'left');

                        $(".dataTables_empty").closest('tbody').prev().find('tr').hide();
                        $('.dataTables_filter').hide();
                        $('#gridFilter').accordion("disable");
                        $('#gonextbtn').attr('disabled', 'true');
                    }
                    else {
                        $('#gonextbtn').removeAttr('disabled');
                        $('#gridFilter').accordion("enable");
                        $('#avaliable_rooms > thead > tr').show();

                        attachEventsForDataTable($grid);
                        unbindEventsForDisabledRooms();
                    }

                    hideAjaxLoader();
                },
                error: function (e) {
                    showErrorBox("Wystąpił problem podczas pobierania sal dla wybranej lokalizacji.<br/><br/>test" + e.statusText);
                    hideAjaxLoader();
                }
            });
        }

        function toggleInfoBox(msg, show) {
            if (show) {
                $('.info').text(msg).show();
            }
            else {
                $('.info').hide();
            }
        }

        function showSuccessBox(msg) {
            $('.success').text(msg).show();
        }

        function showErrorBox(msg, cl) {
            hideAjaxLoader();
			if(cl == "undefined") {
				$(".error").html(msg).show();
			}
			else {
				$(".error").html(msg).addClass(cl).show();
			}
        }

        var konfSlider_val1 = 0;
        var konfSlider_val2 = 5;
        var teatrSlider_val1 = 0;
        var teatrSlider_val2 = 5;

        var slider_min = 0;
        var slider_max = 50;

        function renderSliderFilters($grid) {
            $('#konfSlider').slider({
                min: slider_min,
                max: slider_max,
                range: true,
                values: [0, 5],
                slide: function (ev, ui) {
                    
                    if (ui.values[0] != konfSlider_val1) {
                        //ruszony pierwszy box
                        if (ui.values[0] + 5 <= slider_max) {
                            konfSlider_val1 = ui.values[0];
                            konfSlider_val2 = ui.values[0] + 5;
                            $('#konfSlider').slider("values", 1, konfSlider_val2);
                        }
                        else {
                            return;
                        }
                    }
                    else if (ui.values[1] != konfSlider_val2) {
                        //ruszony drugi box
                        if (ui.values[1] -5 >= slider_min) {
                            konfSlider_val2 = ui.values[1];
                            konfSlider_val1 = ui.values[1] - 5;
                            $('#konfSlider').slider("values", 0, konfSlider_val1);
                        }
                        else {
                            return;
                        }
                    }
                    $('#konf').text(konfSlider_val1 + " - " + konfSlider_val2);
                    filterGridByRange(15, konfSlider_val1, konfSlider_val2, $grid);
                }
            });

            $('#teatrSlider').slider({
                min: slider_min,
                max: slider_max,
                range: true,
                values: [0, 5],
                slide: function (ev, ui) {
                    if (ui.values[0] != teatrSlider_val1) {
                        if (ui.values[0] + 5 <= slider_max) {
                            teatrSlider_val1 = ui.values[0];
                            teatrSlider_val2 = ui.values[0] + 5;
                            $('#teatrSlider').slider("values", 1, teatrSlider_val2);
                        }
                        else {
                            return;
                        }
                    }
                    else if (ui.values[1] != teatrSlider_val2) {
                        if (ui.values[1] - 5 >= slider_min) {
                            teatrSlider_val2 = ui.values[1];
                            teatrSlider_val1 = ui.values[1] - 5;
                            $('#teatrSlider').slider("values", 0, teatrSlider_val1);
                        }
                        else {
                            return;
                        }
                    }

                    $('#teatr').text(teatrSlider_val1 + " - " + teatrSlider_val2);
                    filterGridByRange(16, teatrSlider_val1, teatrSlider_val2, $grid);
                }
            });
        }

        function filterGridByRange(columnIndex, val1, val2, $grid) {
            $.fn.dataTableExt.afnFiltering = [];
            $.fn.dataTableExt.afnFiltering.push(function (oSettings, aData, iDataIndex) {
                var iMin = val1;
                var iMax = val2;
                var iVersion = aData[columnIndex] == "-" ? 0 : aData[columnIndex] * 1;
                if (iMin == "" && iMax == "") {
                    return true;
                }
                else if (iMin == "" && iVersion < iMax) {
                    return true;
                }
                else if (iMin < iVersion && "" == iMax) {
                    return true;
                }
                else if (iMin <= iVersion && iVersion <= iMax) {
                    return true;
                }
                return false;
            });

            $grid.fnDraw();
        }

        function filterGridByMinCapacity(val, $grid) {
            $.fn.dataTableExt.afnFiltering = [];
            $.fn.dataTableExt.afnFiltering.push(function (oSettings, aData, iDataIndex) {
                var iMin = val;
                var iVersion = aData[15] == "-" ? 0 : aData[15] * 1;
                if (iMin == "") {
                    return true;
                }
                else if (iVersion >= iMin) {
                    return true;
                }
                return false;
            });

            $grid.fnDraw();
        }

        function convertToDate(p) {
            var s_date = p.substr(0, 10);
            var s_time = p.substr(11);
            var d = s_date.split('-');
            var t = s_time.split(':');

            return new Date(d[0], d[1]-1, d[2], t[0], t[1], 0, 0);
        }

        function raiseDateError(msg) {
            $('#datestart').addClass('input-error');
            $('#dateend').addClass('input-error');
            $(".error").text(msg).show();
        }

        function raiseLocationError(msg) {
            $('#locationSelect').closest('td').addClass('input-error');
            $(".error").text(msg).show();
        }

        function validateCateringInfo() {
            if (cateringInfoRequired) {
                var carAddText = $('#kateringAdditionalInfoText');
                var carDelTime = $('#kateringDeliveryHour');
				if (carAddText.val().length > 0 && carDelTime.val().length > 0) {
					return true;
				}
				else {
					return false;
				}
            }
            else {
                return true;
            }
        }

        function validateStep1() {
            var locationUuid = $('#locationSelect').combobox('value');
            var start = $('#datestart').val();
            var end = $('#dateend').val();
			
            if (locationUuid == null || locationUuid == 'null' || locationUuid == undefined) {
                raiseLocationError("Wskazane pola nie mogą być puste. Wybierz wartości i spróbuj ponownie.");
                return false;
            }

            if (locationUuid.length > 0 && start.length > 0 && end.length > 0) {
                var dStart = convertToDate(start);
                var dEnd = convertToDate(end);
                if (dStart.getTime() == dEnd.getTime()) {
                    raiseDateError("Daty początku i końca rezerwacji są takie same.");
                    return false;
                }
                else if (dEnd.getTime() < dStart.getTime()) {
                    raiseDateError("Data końca rezerwacji jest mniejsza od daty początku rezerwacji.");
                    return false;
                }
                                    
                if (dEnd - dStart > 432000000 && !isrecurrence) {
                   raiseDateError("Masz możliwość rezerwacji sali na maksymalnie 5 dni.");
                   return false;
                }

                if ($('#personCount').val().length == 0) {
                    $('#personCount').closest('td').addClass('input-error');
                    showErrorBox('Podaj liczbę osób uczestniczących w spotkaniu.', 'personcount');
					return false;
                }
                if (validateCateringInfo()) {
                    if ($('#kateringAdditionalInfoText').hasClass('input-error')) {
                        $('#kateringAdditionalInfoText').removeClass('input-error');
                    }
                    if ($('#kateringDeliveryHour').hasClass('input-error')) {
                        $('#kateringDeliveryHour').removeClass('input-error');
                    }
                    //return true;
                }
                else {
                    showErrorBox('Uzupełnij szczegóły związane z kateringiem oraz datę dostawy.', 'catering');
                    $('#kateringAdditionalInfoText').addClass('input-error');
                    $('#kateringDeliveryHour').addClass('input-error');
                    return false;
                }

                $(".error").hide();
				$('.personcount').hide();
				
                if ($('#datestart').hasClass('input-error')) {
                    $('#datestart').removeClass('input-error');
                }
                if ($('#dateend').hasClass('input-error')) {
                    $('#dateend').removeClass('input-error');
                }
                if ($('#personCount').closest('td').hasClass('input-error')) {
                    $('#personCount').closest('td').removeClass('input-error');
                }
                return true;
            }
            else {
                raiseDateError("Wskazane pola nie mogą być puste. Wybierz wartości i spróbuj ponownie.");
            }
            

            return false;
        }

        function validateStep2() {
            var $selectedRow = $('#avaliable_rooms input:checkbox:checked');
            if ($selectedRow.length == 0) {
                $('#avaliable_rooms').addClass('input-error');
                $(".error").text("Wybierz salę, którą chcesz zarezerwować i kliknij dalej.").show();
            }
            else {
                $(".error").hide();
                if ($('#avaliable_rooms').hasClass('input-error')) {
                    $('#avaliable_rooms').removeClass('input-error');
                }
                return true;
            }

            return false;
        }

		function formatDate(d) {
			var y = d.getFullYear();
			var m = (d.getMonth() +1);
			var da = d.getDate();
			var h = d.getHours();
			var min = d.getMinutes();
			
			return y + "-" + (m<=9 ? '0' + m : m)  + "-" + (da<=9 ? '0' + da : da) + " " + (h<=9 ? '0' + h : h) + ":" + (min<=9 ? '0' + min : min);
		}
		
        function prefilterData($grid) {
            var userpersistenid = gup('exim_persistent_id');

            $('#avaliable_rooms tr').each(function () {
                var $row = $(this);
                var aData = $globalGrid.fnGetData($row.get(0));
                if (aData !== null) {
					for(var i = 0; i < aData.Collisions.length; i++) {
						var collision = aData.Collisions[i];
						
						var d1 = new Date(parseInt(collision.Start.replace('/', '').replace('Date(', '').replace(')', '')));
						var d2 = new Date(parseInt(collision.End.replace('/', '').replace('Date(', '').replace(')', '')));						
						var desc = "<i>" + collision.Subject + "</i><br/>Rezerwujący: <b>" + collision.Person + ', ' + collision.Organization + "</b><br/>Data od: <b>" +
							formatDate(d1) + "</b><br/>Data do: <b>" + formatDate(d2) + "</b><br/>Status: <b>" + collision.Status + "</b>";
						$row.find('td').each(function() {
							$(this).attr('title', 'tytul');
							$(this).tooltip({
								content: function() {
									return desc;
								}
							});
						});
					}
                }
            });
        }

        function unbindEventsForDisabledRooms() {
            $('#avaliable_rooms tr').each(function () {
                var $row = $(this);
                var aData = $globalGrid.fnGetData($row.get(0));
                if (aData !== null) {

                    if (!aData["IsAvaliable"]) {
                        setRoomDisabled($row);
                    }

                    if (filterbybusinessowner) {
                        if (aData["BillingOwnerUuid"] != userpersistenid) {
                            setRoomDisabled($row);
                        }
                    }

                }
            });
        }

        function setRoomDisabled($row) {
            $row.addClass("row_strikethrough");
            var $checkbox = $row.find("input[name='selectBox']");
            if ($checkbox.length == 1) {
                $checkbox.attr('disabled', true);
            }

            // if($._data($row.get(0), "events") != undefined) {
            //    if($._data($row.get(0), "events").length > 0) {
                    if ($._data($row.get(0), "events")["click"].length == 1) {
                        $row.unbind('click');
                    }
            //    }
           // }
        }

        function initiateMpkDialog() {
            $('#mpkDialog').dialog({
                autoOpen: false,
                resizable: false,
                modal: true,
                width: 400,
                height: 340,
                show: {
                    effect: "fadeIn",
                    duration: 100
                },
                hide: {
                    effect: "fadeOut",
                    duration: 100
                }
            });

            $('#mpkdialog_pick').hide();
            $('#mpkdialog_searchbtn').click(function () {
                var $mpkgrid = $('#mpkgrid');
                var str = $('#mpkdialog_seachbox').val();
                if (str.length < 2) {
                    $mpkgrid.find('tr').remove();
                    var $row = $('<tr class="mpk_row"><td colspan="5">Proszę wpisać minimum dwa znaki.</td></tr>');
                    $mpkgrid.append($row);
                    return;
                }
                var str = $('#mpkdialog_seachbox').val();
                
                var $mpk_loader = $('#mpk_loader');
                $mpk_loader.show();
                $.ajax({
                    type: "POST",
                    url: wsurl + "FindMpk",
                    data: JSON.stringify({ searchstring: str }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (msg) {
                        $mpkgrid.find("tr").remove();
                        var results = msg.d;
                        if (results.length == 0) {
                            var $row = $('<tr class="mpk_row"><td colspan="5">Brak wyników spełniających kryteria wyszukiwania.</td></tr>');
                            $mpkgrid.append($row);
                            $('#mpkdialog_pick').hide();
                        }
                        else {
                            $.each(results, function () {
                                var $row = $('<tr class="mpk_row"><td><input type="radio" name="mpk_group" value="' + this.name + '" /></td><td>' + this.name + '</td><td>' + this.namename + '</td><td>' + this.shortname + '</td><td>' + this.shortname2 + '</td></tr>');
                                $mpkgrid.append($row);
                            });
                            $('#mpkdialog_pick').show();
                        }
                        $mpk_loader.hide();

                        //zrobic linka
                        $('#mpkgrid tbody tr').click(function (e) {
                            var ele = $(this).find(':radio');
                            if (ele.length > 0) {
                                ele.prop('checked', true);
                            }
                        });
                    },
                    error: function (e) {
                        $mpkgrid.find("tr").remove();
                        showErrorBox("Wystąpił problem podczas pobierania lokalizacji:<br /><br />" + e.statusText);
                        $mpk_loader.hide();
                    }
                });
            });

            $('#selectmpk').bind('click', function () {
                $('#mpkDialog').dialog("open");
            });

            $('#mpkdialog_pick').click(function () {
                var selected_mpk = $('input[name="mpk_group"]:checked');
                if(selected_mpk.length > 0) {
                    selected_mpk.val();
                    selectMpk(selected_mpk.val(), selected_mpk.val());
                }
            });
        }

        jQuery.events = function(expr) {
            var rez = [], evo;
            jQuery(expr).each(function () {
                if(evo = jQuery._data(this,"events")) {
                    rez.push({ element: this, events: evo });
                }
            });
            return rez.length > 0 ? rez : null;
        }

    </script>
    <div id="loader">
        <img src="css/images/loading_icon.gif" class="ajax-loader" />
    </div>
    <form id="form1" runat="server">
        <input type="hidden" runat="server" id="wsurl" value="" />
        <input type="hidden" runat="server" id="badreq" value="0" />
        <div id="mpkDialog" title="Wybierz MPK" style="display: none;">
            <div id="mpk_loader" style="width: 100%; height: 100%; top: 0; left: 0; background-color: #000; opacity: 0.6; filter: alpha(opacity=60); zoom: 1; position: absolute; display: none;">
                <img src="css/images/loading_icon.gif" style="position: absolute; left: 50%; top: 50%; margin-left: -32px; margin-top: -32px; display: block;" />
            </div>
            <span>
                Wpisz numer MPK, imię/nazwisko dysponenta lub jednostkę organizacyjną:
            </span>
            <div style="width: 370px;">
                <input type="text" id="mpkdialog_seachbox" style="width: 300px;" />
                <input type="button" id="mpkdialog_searchbtn" value="Szukaj" />
            </div>
            <div style="width: 370px; height: 170px; overflow-y: auto;">
                <table id="mpkgrid" class="mpk_class" style="width: 100%; margin-top: 2px;">
                    <colgroup>
                        <col style="width: 20px;" />
                        <col />
                        <col />
                        <col />
                        <col style="width: 40px;" />
                    </colgroup>
                </table>
            </div>
            <div style="width: 370px; height: 30px;">
                <div style="float: right;">
                    <input type="button" value="Wybierz" id="mpkdialog_pick" />
                </div>
            </div>
        </div>
        <div id="recurrenceDialog" title="Rezerwacja cykliczna" style="display: none;">
            <div style="height: 210px;">
                <table border="0" cellpadding="0" cellspacing="0">
                    <colgroup>
                        <col />
                        <col style="width: 300px; text-align: left;" />
                    </colgroup>
                    <tr class="never daily weekly monthly">
                        <td class="table-label">Powtarzaj:</td>
                        <td>
                            <select id="recurrenceDialog_repeat" style="width: 150px;">
                                <option value="never" selected="selected">Nigdy</option>
                                <option value="daily">Codziennie</option>
                                <option value="weekly">Tygodniowo</option>
                                <option value="monthly">Miesięcznie</option>
                            </select>
                        </td>
                    </tr>
                    <tr class="daily weekly monthly" style="display: none;">
                        <td class="table-label">Powtarzaj co:</td>
                        <td>
                            <input type="text" id="repeat_every_text" value="1" style="width: 40px" /><label for="repeat_every_text">dzień (-dni)</label>
                        </td>
                    </tr>
                    <tr class="weekly" style="display: none;">
                        <td class="table-label">W dniach:</td>
                        <td class="select-days">
                            <input type="checkbox" id="repeat-on-mon" /><label for="repeat-on-mon">pon</label>
                            <input type="checkbox" id="repeat-on-tue" /><label for="repeat-on-tue">wt</label>
                            <input type="checkbox" id="repeat-on-wed" /><label for="repeat-on-wed">śr</label>
                            <input type="checkbox" id="repeat-on-thu" /><label for="repeat-on-thu">czw</label>
                            <input type="checkbox" id="repeat-on-fri" /><label for="repeat-on-fri">pt</label>
                            <input type="checkbox" id="repeat-on-sat" /><label for="repeat-on-sat">sb</label>
                            <input type="checkbox" id="repeat-on-sun" /><label for="repeat-on-sun">nd</label>
                        </td>
                    </tr>
                    <tr class="monthly" style="display: none;">
                        <td class="table-label">Każdego:</td>
                        <td>
                            <label><input type="text" id="monthly_day" value="1" style="width: 40px;" />dnia miesiąca</label>
                        </td>
                    </tr>
                    <tr class="daily weekly monthly" style="display: none;">
                        <td class="table-label" style="vertical-align: top;">Koniec:</td>
                        <td>
                            <ul>
                                <li class="table-bullet" id="repeat-end-group-never-li">
                                    <input type="radio" id="repeat-end-group-never" name="repeat-end-group" value="never" checked="checked" />
                                    <label for="repeat-end-group-never">nigdy</label>
                                </li>
                                <li class="table-bullet" id="repeat-end-group-after-li">
                                    <input type="radio" id="repeat-end-group-after" name="repeat-end-group" value="after" />
                                    <label for="repeat-end-group-after">po</label>
                                    <input type="text" id="repeat_end_after" value="1" style="width: 30px;margin-left:4px; margin-right:4px;" />
                                    <label for="repeat_end_after" class="label-disabled">wystąpieniu(-ach)</label>
                                </li>
                                <li class="table-bullet" id="repeat-end-group-on-li">
                                    <input type="radio" id="repeat-end-group-on" name="repeat-end-group" value="on" />
                                    <label for="repeat-end-group-on">w dniu</label>
                                    <input type="text" id="repeat_end_on_date" value="" style="width: 100px;margin-left: 4px;" />
                                </li>
                            </ul>
                        </td>
                    </tr>
                </table>
            </div>
            <div style="float: right;">
                <input type="button" id="recurrenceDialog_cancel" value="Anuluj" style="width: 70px;height: 30px;" />
                <input type="button" id="recurrenceDialog_save" value="Zapisz" style="width: 70px;height: 30px;" />
            </div>
        </div>
        <div id="exim-container">
            <h2 style="text-align:center;">Rezerwacja sali konferencyjnej</h2>
            <div class="error"></div>
            <div class="warning"></div>
            <div class="success"></div>
            <div class="info"></div>
            <div id="messagepanel"></div>
            <div id="slider">
                <div id="page1" class="page border-topbottom" style="display: block;">
                    <div id="one" class="column" style="border-right: 1px solid #dadada;">
                        <div style="padding: 5px;">
                            <table border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td><b>Użytkownik</b></td>
                                </tr>
                                <tr>
                                    <td>
                                        <span>
                                            <img runat="server" id="userImage" src="css/images/user_red.png" title="oddziaływanie zgłoszenia na organizację PKN Orlen lub spółki zależne" />&nbsp;
                                            <asp:Label runat="server" ID="usernameLabel" />
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height: 15px;" />
                                </tr>
                                <tr>
                                    <td><b>Początek rezerwacji</b></td>
                                </tr>
                                <tr>
                                    <td><input type="text" id="datestart" style="width: 250px;" readonly="readonly"/></td>
                                </tr>
                                <tr>
                                    <td style="height: 15px;" />
                                </tr>
                                <tr>
                                    <td><b>MPK</b></td>
                                </tr>
                                <tr>
                                    <td>
                                        <%--<input type="text" id="selected_mpk" style="width: 178px;" />--%>
                                        <asp:TextBox runat="server" ID="selected_mpk" ClientIDMode="Static" style="width: 178px;" ReadOnly="true"></asp:TextBox>
                                        <input type="button" id="selectmpk" value="Wybierz" style="width: 70px;" />
                                    </td>
                                </tr>
                                <%--<tr>
                                    <td style="height: 15px;" />
                                </tr>
                                <tr>
                                    <td><b>Dodatkowe informacje</b></td>
                                </tr>
                                <tr>
                                    <td>
                                        <textarea id="additional_info" style="width: 250px; height: 50px; resize: none;"></textarea> 
                                    </td>
                                </tr>--%>
                                <tr>
                                    <td style="height: 15px;" />
                                </tr>
                                <tr>
                                    <td><b>Ilość osób na spotkaniu:</b></td>
                                </tr>
                                <tr>
                                    <td>
                                        <input type="text" id="personCount" style="width: 225px; height: 16px;" />
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div id="two" class="column">
                        <div style="padding: 5px;">
                            <table border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td><b>Lokalizacja</b></td>                                        
                                </tr>
                                <tr>
                                    <td><select id="locationSelect" style="width: 250px;" /></td>
                                </tr>
                                <tr><td style="height: 7px;" /></tr>
                                <tr>
                                    <td><b>Koniec rezerwacji</b></td>
                                </tr>
                                <tr>
                                    <td><input type="text" id="dateend" style="width: 250px;" readonly="readonly"/></td>
                                </tr>
                                <tr>
                                    <td style="height: 15px;" />
                                </tr>
                                <tr>
                                    <td><b>Katering</b></td>
                                </tr>
                                <tr>
                                    <td>
                                        <asp:DropDownList runat="server" ID="kateringBox" style="width: 254px;" />
                                    </td>
                                </tr>
                                <tr class="kateringTR">
                                    <td style="height: 15px;" />
                                </tr>
                                <tr class="kateringTR">
                                    <td><b>Dodatkowe informacje o kateringu</b></td>
                                </tr>
                                <tr class="kateringTR">
                                    <td>
                                        <textarea id="kateringAdditionalInfoText" style="width: 250px; height: 50px; resize: none;"></textarea>
                                    </td>
                                </tr>
                                <tr class="kateringTR">
                                    <td style="height: 15px;" />
                                </tr>
                                <tr class="kateringTR">
                                    <td><b>Godzina dostawy kateringu</b></td>
                                </tr>
                                <tr class="kateringTR">
                                    <td>
                                        <input type="text" id="kateringDeliveryHour" style="width: 250px;" readonly="readonly" />
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height: 15px;" />
                                </tr>
                                <tr>
                                    <td><b>Rezerwacja cykliczna</b></td>
                                </tr>
                                <tr>
                                    <td>
                                        <asp:Label runat="server" ClientIDMode="Static" ID="reccurenceLabel" style="width:182px; display: inline-block;" Text="Brak" />
                                        <input type="button" id="reccurenceBtn" value="Wybierz" style="width: 70px;" />
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
                <div id="page2" class="page border-topbottom">
                    <div id="gridFilter">
                        <h3>Filtry</h3>
                        <div id="gridFilterContainer" style="width: 540px; height: 100px; display: block; ">
                            <div style="width: 198px; height: 100px; display: inline-block; float: left;border-right: 1px solid #dadada;">
                                <ul>
                                    <li><input type="checkbox" id="Projektor" value="7" /><label for="Projektor">Projektor</label></li>
                                    <li><input type="checkbox" id="Monitor" value="5" /><label for="Monitor">Monitor</label></li>
                                    <li><input type="checkbox" id="Naglosnienie" value="4" /><label for="Naglosnienie">Nagłośnienie</label></li>
                                    <li style="margin-left: 4px;">Poj. konferencyjna:<b><span id="konf" title="Poj. konferencyjna">0 - 5</span></b></li>
                                    <li style="margin-left: 10px; margin-top: 7px;"><div id="konfSlider" style="width: 140px;"></div></li>
                                </ul>
                            </div>
                            <div style="width: 178px; height: 100px; display: inline-block; float: left; border-right: 1px solid #dadada;">
                                <ul>
                                    <li><input type="checkbox" id="ProjektorPrzenosny" value="8" /><label for="ProjektorPrzenosny">Projektor przenośny</label></li>
                                    <li><input type="checkbox" id="TablicaSuchoscieralna" value="9" /><label for="TablicaSuchoscieralna">Tablica suchościeralna</label></li>
                                    <li><input type="checkbox" id="Telekonferencja" value="10" /><label for="Telekonferencja">Telekonferencja</label></li>
                                    <li style="margin-left: 4px;">Poj. teatralna:<b><span id="teatr" title="Poj. teatralna">0 - 5</span></b></li>
                                    <li style="margin-left: 10px; margin-top: 7px;"><div id="teatrSlider" style="width: 140px;"></div></li>                                    
                                </ul>
                            </div>
                            <div style="width: 158px; height: 100px; display: inline-block; float: left;">
                                <ul>
                                    <li><input type="checkbox" id="Ekran" value="3" /><label for="Ekran">Ekran</label></li>
                                    <li><input type="checkbox" id="Flipchart" value="4" /><label for="Flipchart">Flipchart</label></li>
                                    <li><input type="checkbox" id="DodatkoweMiejsca" value="13" /><label for="DodatkoweMiejsca">Dodatkowe miejsca</label></li>
                                    <li><input type="checkbox" id="Videokonferencja" value="11" /><label for="Videokonferencja">Wideokonferencja</label></li>
                                    <li><input type="checkbox" id="Wifi" value="12" /><label for="Wifi">Wifi</label></li>
                                </ul>
                            </div>                           
                        </div>
                    </div>
                    <div style="overflow: hidden; height: 265px;">
                    <table id="avaliable_rooms" cellpadding="0" cellspacing="0"></table>
                    </div>
                </div>
                <div id="page3" class="page border-topbottom">
                    <input type="hidden" runat="server" id="summary_rs" />
                    <input type="hidden" runat="server" id="summary_re" />
                    <input type="hidden" runat="server" id="summary_roomuuid" />
                    <input type="hidden" runat="server" id="summary_user" />
                    <input type="hidden" runat="server" id="summary_mpk" />
                    <input type="hidden" runat="server" id="summary_katering" />
                    <input type="hidden" runat="server" id="summary_impact" />
                    <input type="hidden" runat="server" id="summary_urgency" />
                    <div class="column" style="border-right: 1px solid #dadada;">
                        <div style="padding: 5px;">
                            <table border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td><b>Początek rezerwacji:</b></td>
                                </tr>
                                <tr>
                                    <td><span id="summary_reservationStart"></span></td>
                                </tr>
                                <tr>
                                    <td style="height: 15px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td><b>Koniec rezerwacji:</b></td>
                                </tr>
                                <tr>
                                    <td><span id="summary_reservationEnd"></span></td>
                                </tr>
                                <tr>
                                    <td style="height: 15px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td><b>MPK</b></td>
                                </tr>
                                <tr>
                                    <td><span id="summary_mpk_span"></span></td>
                                </tr>
                                <tr>
                                    <td style="height: 15px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td><b>wyposażenie</b></td>
                                </tr>
                                <tr>
                                    <td><span id="summary_uwagi"></span></td>
                                </tr>
                                <tr>
                                    <td style="height: 15px;" />
                                </tr>
                                <tr>
                                    <td><b>Dodatkowe informacje</b></td>
                                </tr>
                                <tr>
                                    <td>
                                        <textarea id="additional_info" style="width: 250px; height: 50px; resize: none;"></textarea> 
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div class="column">
                        <div style="padding: 5px;">
                            <table border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td><b>Sala:</b></td>
                                </tr>
                                <tr>
                                    <td><span id="summary_roomName"></span></td>
                                </tr>
                                <tr>
                                    <td style="height: 15px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td><b>Lokalizacja:</b></td>
                                </tr>
                                <tr>
                                    <td><span id="summary_location"></span></td>
                                </tr>
                                <tr>
                                    <td style="height: 15px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td><b>Katering</b></td>
                                </tr>
                                <tr>
                                    <td><span id="summary_katering_span"></span></td>
                                </tr>
                                <tr>
                                    <td style="height: 15px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td><b>Rezerwacja cykliczna</b></td>
                                </tr>
                                <tr>
                                    <td><span id="summary_recurrence">Brak</span></td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div style=" float: right; " id="navigationbuttons">
                <input type="button" value="Anuluj" id="cancelbtn" style="width: 60px;" />
                <input type="button" value="Wróć" id="getbackbtn" style="width: 60px;" />
                <input type="button" value="Dalej" id="gonextbtn" style="width: 60px;" />
                <input type="button" value="Rezerwuj" id="createReservationBtn" style="width: 80px; display: none;" />
            </div>
        </div>
    </form>
</body>
</html>
