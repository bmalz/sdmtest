(function ($) {
    $.timepicker.regional['pl'] = {
        timeOnlyTitle: 'Wybierz godzinę',
        timeText: 'Czas',
        hourText: 'Godzina',
        minuteText: 'Minuta',
        secondText: 'Sekunda',
        millisecText: 'Milisekunda',
        microsecText: 'Mikrosekunda',
        timezoneText: 'Strefa czasowa',
        currentText: 'Teraz',
        closeText: 'Gotowe',
        timeFormat: 'HH:mm',
        amNames: ['AM', 'A'],
        pmNames: ['PM', 'P'],
        isRTL: false,
        monthNames: ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'],
        monthNamesShort: ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'],
        dayNames: ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'],
        dayNamesShort: ['nie', 'pon', 'wto', 'śro', 'czw', 'pia', 'sob'],
        dayNamesMin: ['nd', 'pn', 'wt', 'śr', 'cz', 'pt', 'sb'],
        firstDay: 1
    };
    $.timepicker.setDefaults($.timepicker.regional['pl']);
})(jQuery);