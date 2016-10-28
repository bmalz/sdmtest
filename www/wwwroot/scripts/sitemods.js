////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////
// Module:  sitemods.js
// Created: 06/08/01
////////////////////////////////////////////////////////////////////////
// Description:
//    This file is provided to allow a customer site to add its own
//    JavaScript functions to the AHD web interface.  It is included in
//    all AHD web pages as the last JavaScript include, and so can be
//    used to provide site-written versions of standard functions.
//
//    In addition to new functions, this file can be used to provide
//    site versions of the menubar customization functions.  This
//    allows customization of the menubar without modifying menubar.js.
//    The menubar customization functions are:
//
//    siteMenuMod()     - called once for each menubar item
//    siteMenuAdd()     - called once at the end of the menubar
//    siteMenuitemMod() - called once for each menu item
//    siteMenuitemAdd() - called once at the end of each menubar item
//
//    siteContextMenuitemMod() - called once for each context menu item
//    siteContextMenuitemAdd() - called once at the end of each context menu
//
//    These functions can add, delete, and rename items in the menu.
//    See comments on the functions themselves for usage.
////////////////////////////////////////////////////////////////////////
// $Header: /base/source/bp/freeaccess/jsdir/.RCS/sitemods.js,v 1.9 2005/01/14 00:29:45 jenji01 Exp $


////////////////////////////////////////////////////////////////////////
// siteMenuMod()
//     Site-supplied function called once for each menubar item.
//
//     Arguments:
//        menuName - the name on the menu
//
//     Return value:
//        true     - add the menubar item
//        false    - do not add the menubar item
//        "xxxx"   - rename the menubar item to xxxx
// Note: Legacy function for pre-R11. Use WSP for menu customization. 
////////////////////////////////////////////////////////////////////////
//function siteMenuMod(menuName)
//{
//   return true;
//}

////////////////////////////////////////////////////////////////////////
// siteMenuAdd()
//     Site-supplied function to add new items to the end of the menubar
//
//     To add a new menubar item or items, call functions as follows:
//
//       addMenuItem(menuName[, accKey])
//       addSubMenuItem(submenuName, script[, accKey])
//       addSubMenuItem(submenuName, script[, accKey])
//       ...
//
//     where:
//        menuName    - is the name on the menubar
//        submenuName - is the name of an item in the menu
//        script      - is a JavaScript function to call when the
//                      menu item is selected.
//        accKey      - an optional argument providing suggestions for
//                      the access key (alt+x) associated with this item.
//                      Normally, the access key is assigned automatically
//                      as the first letter in the name not already in use
//                      for an access key, with a preference for upper case.
//                      You can specify one or more letter or numbers, and
//                      the access key will be selected from the first one
//                      not in already in use that is also in the name.
//                      You can prefix the list with an exclamation point
//                      to indicate it is a list of letters not to use.
//
//     The following predefined functions may be usefule for scripts:
//        upd_frame(form)  
//             - load a new form into the main window content frame
//        create_new(factory, use_template, width, height [,args])
//             - popup a form to define a new record
//        popup_window(name, form[, width, height [,features [,args]]])
//             - popup a new window
//        showDetailWithPersid(persid)
//             - popup a detail record
//
//        In the above functions:
//           form - is either an HTMPL file name of the form xxx.htmpl
//                  or an operation code (eg CREATE_NEW)
//           factory  - is the name of a database object
//           use_template - is either true or false
//           width    - desired form width or zero for default
//           height   - desired form height or zero for defualt
//           features - is a list of window features, in the same format
//                      used with the standard window.open function
//           args     - is one or more args of the form "keyword=value"
//                      for the operation specified for form
//           persid   - is a persistent ID in the form factory:id
//
//     Arguments:
//        none
//
//     Return value:
//        none
// Note: Legacy function for pre-R11. Use WSP for menu customization. 
////////////////////////////////////////////////////////////////////////
//function siteMenuAdd()
//{
//}

////////////////////////////////////////////////////////////////////////
// siteMenuitemMod()
//     Site-supplied function called once for each menu selection
//
//     Arguments:
//        menuName - the name on the menubar
//        itemName - the item name on the menu
//
//     Return value:
//        true     - add the menu item
//        false    - do not add the menu item
//        "xxxx"   - rename the menu item to xxxx
// Note: Legacy function for pre-R11. Use WSP for menu customization. 
////////////////////////////////////////////////////////////////////////
//function siteMenuitemMod(menuName, itemName)
//{
//   return true;
//}

////////////////////////////////////////////////////////////////////////
// siteMenuitemAdd()
//     Site-supplied function to add new items to a menu
//
//     To add a new menu item or items, call functions as follows:
//
//       addSubMenuItem(submenuName, script[, accKey])
//       addSubMenuItemLocal(submenuName, script[, accKey])
//       ...
//
//     where:
//        submenuName - is the name of an item in the menu
//        script      - is a JavaScript function to call when the
//                      menu item is selected.
//        accKey      - an optional argument providing suggestions for
//                      the access key (alt+x) associated with this item.
//                      Normally, the access key is assigned automatically
//                      as the first letter in the name not already in use
//                      for an access key, with a preference for upper case.
//                      You can specify one or more letter or numbers, and
//                      the access key will be selected from the first one
//                      not in already in use that is also in the name.
//                      You can prefix the list with an exclamation point
//                      to indicate it is a list of letters not to use.
//
//     Use addSubMenuItem() to specify a script that will be executed in the
//     context of the main window (ahdtop); use addSubMenuItemLocal() to
//     specify a script that will be executed in the context of the window
//     containing the menubar from which the selection was made.
//
//     The following predefined functions may be usefule for scripts:
//        upd_frame(form)  
//             - load a new form into the main window content frame
//        create_new(factory, use_template, width, height [,args])
//             - popup a form to define a new record
//        popup_window(name, form, width, height [,args])
//             - popup a new window
//        showDetailWithPersid(persid)
//             - popup a detail record
//
//        In the above functions:
//           form - is either an HTMPL file name of the form xxx.htmpl
//                  or an operation code (eg CREATE_NEW)
//           factory - is the name of a database object
//           use_template - is either true or false
//           width   - desired form width or zero for default
//           height  - desired form height or zero for defualt
//           args    - is one or more args of the form "keyword=value"
//                     for the operation specified for form
//           persid  - is a persistent ID in the form factory:id
//
//
//     Arguments:
//        menuName - the name on the menubar
//
//     Return value:
//        none
// Note: Legacy function for pre-R11. Use WSP for menu customization. 
////////////////////////////////////////////////////////////////////////
//function siteMenuitemAdd(menuName)
//{
//}

////////////////////////////////////////////////////////////////////////
// siteContextMenuitemMod()
//     Site-supplied function called once for each context menu selection
//
//     Arguments:
//        menuName - the name of the context menu
//        itemName - the item name in the menu
//
//     Some of the context menu names used in Service Desk are:
//        "idGraphFolder" - the scoreboard folder menu
//        "idGraphItem"   - the scoreboard item menu
//        "idGraphAll"    - the scoreboard combined menu
//        "idDetailsMenu" - the menu on a search results set
//        "rClickMenu"    - the right click menu on all forms
//
//     Return value:
//        true     - add the menu item
//        false    - do not add the menu item
//        "xxxx"   - rename the menu item to xxxx
////////////////////////////////////////////////////////////////////////
//function siteContextMenuitemMod(menuName, itemName)
//{
//   return true;
//}

////////////////////////////////////////////////////////////////////////
// siteContextMenuitemAdd()
//     Site-supplied function called once for each context menu
//
//     To add an item or items, issue one or more calls of the form:
//
//     menu.addItem( text, script );
//
//     where:
//        text   - is the text to go on the menu
//        script - is a string containing JavaScript to execute when the
//                 menu item is selected.
//
//     Note that your siteContextMenuItemMod() function will be called for
//     each menu item you add.
//
//     Arguments:
//        menuName - the name of the context menu
//        menu     - a reference to the menu itself
//
//     Return value:
//        none
////////////////////////////////////////////////////////////////////////
//function siteContextMenuitemAdd(menuName,menu)
//{
//}

function siteContextMenuitemAdd(menuName,menu)
{
 if ( propFormName=='list_zCorrespondenceIncome.htmpl' && menuName=='idDetailsMenu') {
 menu.addItem('Utwórz odpowiedź', "CorrespondenceReply(self.activePersid)" );
 }
 return true;
}

function CorrespondenceReply(persid)
{
	popup_window('RequestDetail', 'CREATE_NEW', 0, 0, 
	'ahdmenu=yes,register=yes,resizable=yes,scrollbars=yes',
	'FACTORY=zCorrespondanceOucome', 
	'', 
	'KEEP.IsReply=1', 'KEEP.SelectedPersId=' + persid);
}
