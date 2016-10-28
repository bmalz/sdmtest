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
// Module:  fldrtree.js
// Created: 03/16/01
////////////////////////////////////////////////////////////////////////////
// Description:
//    Folder tree support.  This script is based on ftiens4.js, a script
//    written by Marcelino Alves Martins (martins@hks.com) December '97
////////////////////////////////////////////////////////////////////////////

// @(#)$Id: fldrtree.js ASPEN.17 2012/03/22 11:12:07 kumka02 Exp $

// Are we in maintainence (update) mode?
// If so, setup tree to exclude counts, include stuff needed
// to add/remove nodes & folders
var maintain_mode = 0;
if (typeof maintain != "undefined") maintain_mode = 1;

var itemPtrs = new Array();

var current_id = -1;
var graph_folder_menu = void(0);
var root_graph_folder_menu = void(0);
var graph_item_menu = void(0);
var graph_all_menu = void(0);
var graph_call_back = void(0);

function graph_cb (isFolder, id, is_update)
{
    this.id = id;
    this.is_update = is_update;
    this.isFolder = isFolder;
}

graph_cb.prototype.call_back = function ()
{
    graph_call_back = void(0);
    if (this.isFolder)
    Folder.graphFolders(this.id, this.is_update);
    else 
    Folder.graphItems(this.id, this.is_update);
}

// All menu items for Graph are not in use in R12. (SCO 10578)
// Keep the code here, so we can easily add the Graph feature
// in the future. 
function init_graph_menus() {
   root_graph_folder_menu = new ContextMenu("root_graph_folder_menu");
   root_graph_folder_menu.addItem(msgtext("Open"), // Open 
        "Folder.selectFolder(self.current_id)");
   root_graph_folder_menu.finish();

   graph_folder_menu = new ContextMenu("graph_folder_menu");
   graph_folder_menu.addItem(msgtext("Open"), // Open 
                  "Folder.selectFolder(self.current_id)");
   graph_folder_menu.addItem(msgtext("Graph_Folders"), // Graph Folders
                             "Folder.graphFolders(self.current_id)");
   graph_folder_menu.finish();
   graph_item_menu = new ContextMenu("graph_item_menu");
   graph_item_menu.addItem(msgtext("Open"), // Open 
                 "Folder.selectFolder(self.current_id)");
   graph_item_menu.addItem(msgtext("Graph_Items"), // Graph Items
                           "Folder.graphItems(self.current_id)");
   graph_item_menu.finish();

   graph_all_menu = new ContextMenu("graph_all_menu");
   graph_all_menu.addItem(msgtext("Open"), // Open 
                 "Folder.selectFolder(self.current_id)");
   graph_all_menu.addItem(msgtext("Graph_Folders"), // Graph Folders
                          "Folder.graphFolders(self.current_id)");
   graph_all_menu.addItem(msgtext("Graph_Items"), // Graph Items
                          "Folder.graphItems(self.current_id)");
   graph_all_menu.finish();
}

// Definition of class Folder 
//    backend_id is the unique id for the User_Query object
// ***************************************************************** 

function Folder(folderDescription, folderID, hreference, rawDescription, openDefault) //constructor 
{ 
    
    //constant data
    this.className = "Folder";
    this.desc = folderDescription; 
    
    // If this node label was expanded (e.g. a user_query), this is the 'raw' expansion string
    if (typeof rawDescription == "string") {
        this.rawDesc = rawDescription;
    } else {
        this.rawDesc = "";
    }
    
    if ( typeof folderID == "number" )
       this.backend_id = folderID;
    else
    {
       this.backend_id = -1;
       // Save this piece of information for use with the daemon
       // configuration tool
       this.daemon_id = folderID;
    }
    this.hreference = hreference; 
    this.id = nCurrentEntry++;  // must match webengine order
    this.nodeId = -1;           //initialized in initalize()
    this.iconImg = 0;  
    this.nodeImg = 0; 
    this.parent = null;
 
    //dynamic data 
    this.openDefault = ( typeof openDefault == "boolean" && openDefault );
    this.isOpen = false;
    this.openedAtLeastOnce = false;
    this.iconSrc = "ftv2folderopen.gif";   
    this.children = new Array(); 
    this.nChildren = 0; 
    this.menu = null;
    this.rendered = false;
    this.graphVars = new folderGraphVars();
    this.stateSpan = null; 
    this.iconImg = null;
 
    //methods 
    this.draw = drawFolder; 
    this.setState = setStateFolder; 
    this.addChild = addChild; 
    this.createIndex = createEntryIndex; 
    this.subEntries = folderSubEntries; 
    this.outputLink = outputFolderLink; 
    this.path = getPath;
    this.pathIDs = getPathIDs;
}

function getPathIDs(strSeparator)
{
   if (this.parent != null)
   {
      if (this.parent.nodeId == 0)
      {
         return this.id.toString();
      }
      if (this.parent.nodeId == 1)
      {
         return this.parent.id.toString() + strSeparator + this.id.toString();
      }
      else
      {
         return this.parent.pathIDs(strSeparator) + strSeparator + this.id.toString();
      }
   }
   else
   {
      return this.desc;
   }
}

function getPath(strSeparator)
   {
   if (this.parent != null)
   {
      if (this.parent.id == 0)
      {
         return this.desc;
      }
      if (this.parent.id == 1)
      {
         return this.parent.desc + strSeparator + this.desc;
      }
      else
      {
         return this.parent.path(strSeparator) + strSeparator + this.desc;
      }
   }
   else
   {
      return this.desc;
   }
}

function fldrtreeTabOff(direction)
{
   if ( typeof direction != "number" )
      direction = 1;
   else if ( _browser.isIE )
      direction = ( window.event.altKey ? -1 : 1 );
   var start, end;
   if ( direction == 1 ) {
      start = 0;
      end = tabField.length;
   }
   else {
      start = tabField.length - 1;
      end = -1;
   }
   for ( var i = start; i != end; i += direction ) 
   {
      var e = document.getElementById(tabField[i]);
      if ( e != null ) 
      {
         for ( var p = e.parentNode; 
                 p != null && p.tagName != "BODY" && p.style != null && p.style.display != "none";
                    p = p.parentNode )
            ;

         if ( p == null || p.tagName == "BODY" ) 
         {
            if (typeof e.id == "string" && e.id != "")
            {
               setTimeout("try{document.getElementById('" + e.id + "').focus();}catch(e){}", 50);
            }
            else 
            {
               try
               {
                  e.focus();
               }
               catch (e) {}
            }
            break;
         }
      }
   }

}

// for 5.5 form
var onload_and_onresize_for_55 = void(0);

function onload_and_onresize()
{
    this.orig_onload = window.onload;
    this.orig_onresize = window.onresize;
    this.onload_func = function () {adjScrollDivHeight(); if (this.orig_onload != null) this.orig_onload();}
    this.onresize_func = function () {adjScrollDivHeight(); if (this.orig_onresize != null) this.orig_onresize();}
    window.onload = this.onload_func;
    window.onresize = this.onresize_func;
}

// We may customize the tree for the current
// login user or any contact type. In case 
// of contact type, we want to show the sym 
// value of the contact type on the root node.
// SDT 23396  remember root node should have id = 0! 
function createRootFolder(default_root_str, type)
{
    // for 5.5 form
    // 5.5 scoreboard.htmpl does not have propFormName 
    // defined. 
    if ( typeof propFormName == "undefined" &&
     _browser.isIE &&
     typeof scrollDivCount != "undefined" &&
     !scrollDivCount )
    {
    onload_and_onresize_for_55 = new onload_and_onresize();        
    startScrollbar();
    }
    isHierSelect = ( typeof type == "string" && type == "hierSelect" ) ||
                   ( typeof hierarchical_node != "undefined" );
    var backend_id = ( isHierSelect ? -1 : 0 );
    if ((typeof usq_owner_sym != "undefined") &&
    (usq_owner_sym != ""))
    {
    return new Folder("<B>" + usq_owner_sym + "<B>", backend_id,
                      void(0), "", true);
    }
    return new Folder(default_root_str, backend_id,
                      void(0), "", true);
}
 
// setStateFolder()
//   Set the folder state (open or closed) per the argument.  This
//   involves showing or hiding the contents div, as well as changing
//   the folder icon and the alt text.
function setStateFolder(isOpen) 
{ 
  if ( isOpen != this.isOpen ) {
    var folderDesc = this.desc.replace(/<[^>]+>/g,"");
    this.isOpen = isOpen; 
    var auxName = "s" + this.id + "pm";
    if ( ! isOpen ) {

      // Folder being closed - set closed folder image
 
      this.fldrContentsDiv.style.display = "none";
      if ( this.stateSpan != null ) {
	this.stateSpan.innerHTML = "<IMG name=" + "nodeImg" + this.id + " id="  + "nodeImgs" + this.id + "pm" + 
	    " width=11 height=16 border=0 src=" + get_IMG_path("IMG_tree_plus") + " class=treeNodeImagePlusMinus alt='" + 
	    msgtext("Closed_folder_-_click_to_open_", folderDesc) + "'>";
                            // "Closed folder - click to open %1"
      }
      if ( this.iconImg != null && this.id > 0 ) {
        this.iconImg.alt = "";
        this.iconImg.src = get_IMG_path("IMG_treenode_normal"); 
      }
    }
    else {

      // Folder being opened - see if any children need rendering;
      // also, list the ids of any children needing a count filled in

      var nc = this.nChildren; 
      if ( nc > 0 ) {
        for ( var i = 0; i < nc; i++ ) {
          var thisChild = this.children[i];
          if ( ! thisChild.rendered )
            thisChild.draw(this.fldrContentsDiv, this.level, i);
          if ( thisChild.className == "Item" &&
               thisChild.count == "?" ) {
            if ( typeof itemsNeedingCount != "undefined" )
              itemsNeedingCount += " " + thisChild.id;
            else
              itemsNeedingCount = thisChild.id;
          }
        }
      } 

      // Set open folder image and show the folder

      this.openedAtLeastOnce = true;
     if ( this.stateSpan != null ) {
	this.stateSpan.innerHTML = "<IMG name=" + "nodeImg" + this.id + " id="  + "nodeImgs" + this.id + "pm" + 
	    " width=11 height=16 border=0 src=" + get_IMG_path("IMG_tree_minus") + " class=treeNodeImagePlusMinus alt='" + 
	    msgtext("Open_folder_-_click_to_close_%", folderDesc) + "'>";
                            // "Open folder - click to close %1"
      }
      if ( this.iconImg != null && this.id > 0 ) {
        this.iconImg.alt = "";
        this.iconImg.src = get_IMG_path("IMG_treenode_open"); 
      }
      this.fldrContentsDiv.style.display = "block";
    }
  }
}
 
// drawFolder()
//    Draw the contents of a folder.  Folders have two-DIV structure:
//
//     <div>folder icon and caption  <-- the "fldrDiv"
//       <div style="display:none">  <-- the "fldrContentsDiv"
//         contents of folder
//       </div>
//     </div>
//
//    Arguments:
//      parentDiv - an object reference to the parent DIV
//      level     - level of indentation
//      row       - row number within parent
function drawFolder(parentDiv, level, row) 
{ 
    if ( this.rendered )
      return;
    var j=0;
    var i=0; 
    var numberOfFolders; 
    var numberOfDocs; 
   
    this.createIndex(); 
 
    var auxEv = ""; 
 
    var auxName = "s" + this.id + "pm";
    tabField[tabField.length] = auxName;
 
    if ( level == 0 )
      this.fldrDiv = parentDiv;
    else {
      this.fldrDiv = document.createElement("DIV");
      this.fldrDiv.style.fontWeight = "normal";
      parentDiv.appendChild(this.fldrDiv);
    }

    var folderDesc = this.desc.replace(/<[^>]+>/g,"");
    var fldrLink;

    if ( level == 0 ) {

      // Top level (always open); use special treetop icon

      fldrLink = this.fldrDiv;
      fldrLink.className = "fldrtext";
      if ( ! isHierSelect ) {
        this.stateSpan = document.createElement("SPAN");
	this.stateSpan.innerHTML = "<IMG name=folderIcon0 id=iconImgs0pm width=24 height=24 border=0 src=" + 
	    get_IMG_path("IMG_treetop") + " align=middle alt=" + msgtext("%1_top_of_tree.__Press_Alt+X_t",folderDesc) + ">";
        fldrLink.appendChild(this.stateSpan);
        if ( ahdtop.cstUsingScreenReader )
          accesskey = " accesskey=" + msgtext("X");
	if ( maintain_mode ) {
	    fldrLink = document.createElement("A");
	    this.fldrDiv.appendChild(fldrLink);
	    fldrLink.id = auxName;
	    fldrLink.tabIndex = 3;
	    fldrLink.onfocus = itemFoc;
	    fldrLink.onblur = itemBlur;
	    fldrLink.className = "scbdtext";
	    fldrLink.href = "javascript:do_setup_link(" + this.id + ")";
	}
      }
    }
    else {

      // Levels other than the top level are created closed.  Indicate
      // this with plus and closed folder icons.

      fldrLink = document.createElement("A");
      this.fldrDiv.appendChild(fldrLink);
	  // SCO40271: Set the accessKey for the first row. This is so that  
	  // the scoreboard gets the focus on Alt+X when using Screen Reader
      if(ahdtop.cstUsingScreenReader && row == 0)
	      fldrLink.accessKey = msgtext("X");  
      fldrLink.tabIndex = 3;
      fldrLink.onfocus = itemFoc;
      fldrLink.onblur = itemBlur;
      fldrLink.className = "scbdtext";
      fldrLink.id = auxName;
	  fldrLink.ondragstart = function() {return false;};
      // SCO 40564 : START
      // Safari and Chrome refreshes the page on link click if I use href="#"
      // So, if its safari or chrome using javascript:void() instead of #
	  
      // Find safari or chrome - Assumption safari word is present in chrome user agent string too.
      _browser.isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;
    
      if(_browser.isSafari) {
          // With JAWS 12. javascript:void(0) works fine. only with IE it skips the focus on the link
	  // So else part will take care of it.
	  fldrLink.href = "javascript:void(0)";
      } else {
          // Changed href from "javascript:void()" to # so that the minus/plus icons are focused 
	  // when using JAWS 12. javascript:void(0) isnt doing anything and this call is causing a delay
	  // because of which JAWS is skipping the focus on this element
	  // Using # doesnt call anything and instead returns focus to the same element
	  fldrLink.href = "#";
      }
      // SCO 40564 : END
      fldrLink.onclick = clickOnNode;
      // Using DOM object to create IMG element didn't work 
      // well in other languages. When user clicked on the 
      // plus sign to expand a tree node, it didn't show 
      // the minus sign and open folder. 
      // We use the following code to work around this
      // issue.    
      this.stateSpan = document.createElement("SPAN");
      fldrLink.appendChild(this.stateSpan);
      this.stateSpan.innerHTML = "<IMG name=" + "nodeImg" + this.id + " id="  + "nodeImgs" + this.id + "pm" + 
	    " width=11 height=16 border=0 src=" + get_IMG_path("IMG_tree_plus") + " class=treeNodeImagePlusMinus alt='" + 
	    msgtext("Closed_folder_-_click_to_open_",folderDesc) + "'>";
      this.stateSpan.id = "nodeImgs" + this.id + "pm";

      // Append the closed folder icon
      
      if ( ! ahdtop.cstUsingScreenReader ) {
        this.iconImg = document.createElement("IMG");
        fldrLink.appendChild(this.iconImg);
        this.iconImg.name = "folderIcon" + this.id;
        this.iconImg.id = "iconImgs" + this.id + "pm";
        //this.iconImg.align = "middle";
		this.iconImg.className = "imgTreeNodeFolder"
        this.iconImg.height = 16;
        this.iconImg.width = 16;
        this.iconImg.border = 0;
        this.iconImg.src = get_IMG_path("IMG_treenode_normal");
        this.iconImg.alt = msgtext("Closed_folder_-_click_to_open_",folderDesc);
        folderDesc = " " + folderDesc;
		if ( !maintain_mode && isHierSelect && !ahdtop.mouseoverMenus && HierIsNode(this.backend_id) ) {
             this.iconImg.oncontextmenu = new Function("event",
                                          "HierShowMenu(event," +
                                          this.backend_id + ",void(0),0);");
        }    
      }

      // In maintenance mode (the "Customize Scoreboard" form), create an
      // independent link for the text that allows selection without changing
      // the folder's open/closed state.

      if ( maintain_mode ) {
        fldrLink = document.createElement("A");
        this.fldrDiv.appendChild(fldrLink);
        fldrLink.id = auxName;
        fldrLink.tabIndex = 3;
        fldrLink.onfocus = itemFoc;
        fldrLink.onblur = itemBlur;
        fldrLink.className = "scbdtext";
        fldrLink.href = "javascript:do_setup_link(" + this.id + ")";

        //
        // Write 'pdmqa' tags/attributes for the Customize Scoreboard (note 
        // only the top level/root nodes, the leaf nodes are handle elsewhere).
        //
        if (ahdtop.cfgPdmQA.toLowerCase() == "yes") {
          var desc = Folder.get_desc(indexOfEntries[this.id].desc);
          var parsed_label = PdmQA.parse_label(desc, TRUNCATE_TO);
          var pdmqa_tag = new Object();
          
          pdmqa_tag.desc = parsed_label;
          pdmqa_tag.id = "s" + this.id + "pm";
          pdmqaTags.push(pdmqa_tag); // Note we are only handling the top level nodes here, we handle the leaf nodes in   
                                     // 'usq_update_tree.htmpl' by calling 'Folder.pdmqa' which calls the 'PdmQA' object.     
          var unique_pdmqaTags = PdmQA.create_unique_tags(pdmqaTags);
       
          PdmQA.write_tag(pdmqa_tag, unique_pdmqaTags, fldrLink);
        } 
      }
      else if ( ! isHierSelect ) {
        if ( ! ahdtop.mouseoverMenus )
            fldrLink.oncontextmenu = new Function("event",
                                          "Folder.show_menu(event," +
                                          this.id + ",void(0),0);");
        else {
            fldrLink.onmouseover = new Function("event",
                                          "Folder.show_menu(event," +
                                          this.id + ",void(0),0);");
            fldrLink.onmouseout = new Function("event",
                                          "Folder.hide_menu(event)");
        }
      }
      else {
        // Hierarchical select - if the folder is not a selectable node,
        // just boldface its name; otherwise, create a second link (the
        // first was the open/close folder link) allowing the node to
        // be selected

        if ( ! HierIsNode(this.backend_id) ) {
          fldrLink.className = "fldrtext";
          fldrLink.style.color = "black";
        }
        else {
          fldrLink = document.createElement("A");
          this.fldrDiv.appendChild(fldrLink);
          
          // Fix for the SCO 35303
          
          //ID auxname is assigned to two (hyper)links (i.e A element), this creates the ambiguity in showing the 
          //context menus (when menuover option is set)
          //hence prepending "parent_node_" text to this hyperlink's ID                    
          fldrLink.id = "parent_node_" +auxName;
          
          // End of Fix for the SCO 35303
          
          fldrLink.tabIndex = 3;
          fldrLink.onfocus = itemFoc;
          fldrLink.onblur = itemBlur;
          fldrLink.href = "javascript:void(0)";
          fldrLink.onclick = new Function("",
                                      "HierBackfill(" + this.backend_id + ")");
          if ( ! ahdtop.mouseoverMenus ) {
             fldrLink.oncontextmenu = new Function("event",
                                          "HierShowMenu(event," +
                                          this.backend_id + ",void(0),0);");
             // Add Mouseover Preview links.
             if (ahdtop.cfgUserType == "analyst" && ! ahdtop.cstDisablePreviews) {
                fldrLink.onmouseover = new Function("",
                                             "HierShowMOPreview(" + this.backend_id + ");");
                fldrLink.onmouseout = new Function("",
                                             "HierCancelBuildingMOPreview();");
             }
          }
          else {
            fldrLink.onmouseover = new Function("event",
                                            "HierShowMenu(event," +
                                            this.backend_id + ",this,0);");
            fldrLink.onmouseout = new Function("event", "HierHideMenu(event)");
          }
        }
      }
    }

    // Add the text of the node

    // var textNode = document.createTextNode(folderDesc);
    var spanNode = document.createElement("SPAN");
    spanNode.innerHTML = "&nbsp;" + this.desc;
	spanNode.className = "spanTreeNodeText";
    fldrLink.appendChild(spanNode);
    this.level = level;

    // Show the folder description for hierarchical selection

    if ( isHierSelect && HierIsNode(this.backend_id) ) {
      var desc = HierDesc(this.backend_id);
      if ( ! desc.match(/^\s*$/) ) {
        textNode = document.createTextNode(" " + desc);
        this.fldrDiv.appendChild(textNode);
      }
    }

    // Build the folder's contents

    if ( level == 0 )
      this.fldrContentsDiv = this.fldrDiv;
    else {
      this.fldrContentsDiv = document.createElement("DIV");
      this.fldrContentsDiv.style.display = "none";
      this.fldrContentsDiv.style.marginLeft = "16px";
      this.fldrDiv.appendChild(this.fldrContentsDiv);
    }
    var nc = this.nChildren; 
    if ( nc > 0 ) {
      level = level + 1; 
      for ( var i = 0; i < nc; i++ )
        this.children[i].draw(this.fldrContentsDiv, level, i);
    } 
    this.rendered = true;
} 
 
// drawItem()
//   Build the DIV containing the contents of an item
//
//   Arguments:
//      parentDiv - an object reference to the parent DIV
//      level     - level of indentation
//      row       - row number within parent
function drawItem(parentDiv, level, row) 
{  
    if ( this.rendered )
      return;

    this.createIndex();

    var itemDiv = document.createElement("DIV");
    itemDiv.style.fontWeight = "normal";
    parentDiv.appendChild(itemDiv);

    // Build the count element and link, and set them 
    // according to the scoreCountLeft option

    var itemLink = document.createElement("A");
    if ( ahdtop.cstScoreCountLeft ) {
      itemDiv.appendChild(itemLink);
    }
    else {
      itemDiv.appendChild(itemLink);
      appendItemCount(itemDiv, this);
    }

    itemLink.id = "s" + this.id + "ds";
    itemLink.tabIndex = 3;
    itemLink.style.cursor = "pointer";
    itemLink.onfocus = itemFoc;
    itemLink.onblur = itemBlur;
	itemLink.ondragstart = function() {return false;};
    tabField[tabField.length] = itemLink.id;

    // Stick on the item image icon.  This is the same as the closed folder
    // icon, which strikes me as a mistake, but people are used to it now.

    var itemDesc = this.desc.replace(/<[^>]+>/g,"");
    if ( level > 0 &&
         ! ahdtop.cstUsingScreenReader ) {
         	
      this.iconImg2 = document.createElement("IMG");
      itemLink.appendChild(this.iconImg2);
      this.iconImg2.name = "spacer_nodeImg" + this.id;
      this.iconImg2.id = "spacer_nodeImgs" + this.id + "pm";
      this.iconImg2.className = "scbdnode";
      this.iconImg2.src = get_IMG_path("IMG_spacer");
      this.iconImg2.align = "middle";
      this.iconImg2.height = 16;
      this.iconImg2.width = 8;
      this.iconImg2.border = 0;      
         	
      this.iconImg = document.createElement("IMG");
      itemLink.appendChild(this.iconImg);
      this.iconImg.name = "nodeImg" + this.id;
      this.iconImg.id = "nodeImgs" + this.id + "pm";
      this.iconImg.className = "scbdnode";
      this.iconImg.src = get_IMG_path("IMG_treenode_normal");
      this.iconImg.align = "middle";
      this.iconImg.height = 16;
      this.iconImg.width = 16;
      this.iconImg.border = 0;
      this.iconImg.alt = msgtext("Node_%1", itemDesc);
      itemDesc = " " + itemDesc;
    }
    if ( ahdtop.cstScoreCountLeft ) 
	appendItemCount(itemLink, this);
    // var textNode = document.createTextNode(itemDesc);
    var spanNode = document.createElement("SPAN");
    spanNode.innerHTML = "&nbsp;" + nx_html_encode(this.desc);
    itemLink.appendChild(spanNode);
    this.itemLink = itemLink;
    itemPtrs[this.id] = this;

    // Set the function invoked by the link

    if ( maintain_mode ) {
      // Allow selection (but no real link behavior) in maintain mode
      itemLink.href = "javascript:do_setup_link(" + this.id + ")";
    }
    else if ( ! isHierSelect ) {
      itemLink.className = "scbd";
      itemLink.href = "javascript:do_link(" + this.id + ");";
      if ( ( ! ahdtop.cstUsingScreenReader ) &&
           ( ! this.link.match(/^\s*$/) ) ) {
        var link = this.link;
        link = link.replace(/\%0a/gi," ");
        link = nx_unescape(link).replace(/'/g,"\\'");
        if ( link.match(/OP=SEARCH\+FACTORY=(\w*)\+KEEP\.where_clause=(.*)$/) )
           link = "Query " + RegExp.$1 + ": " + RegExp.$2;
        itemLink.onmouseover = new Function("",
                                    "window.status='" + link + "';return true;");
        itemLink.onmouseout = new Function("",
                                    "window.status=window.defaultStatus;" +
                                    ";return true;");
      }
    }
    else {
      // For hierachical tree, backend_id is the index of the tree node
      // in the global array nodeArray
      itemLink.href = "javascript:void(0)";
      itemLink.onclick = new Function("",
                                      "HierBackfill(" + this.backend_id + ")");
      if ( !ahdtop.mouseoverMenus ) {
         itemLink.oncontextmenu = new Function("event",
                                    "HierShowMenu(event," +
                                    this.backend_id + ",this,0);");
         // Add Mouseover Preview links.
         if (ahdtop.cfgUserType == "analyst" && ! ahdtop.cstDisablePreviews) {
            itemLink.onmouseover = new Function("",
                                         "HierShowMOPreview(" + this.backend_id + ");");
            itemLink.onmouseout = new Function("",
                                         "HierCancelBuildingMOPreview();");
         }	    
      }
      else {
         itemLink.onmouseover = new Function("event",
                                      "HierShowMenu(event," +
                                      this.backend_id + ",this);" +
                                      "return true;");
         itemLink.onmouseout = new Function("event",
                                      "HierHideMenu(event);return true");
      }
      var desc = HierDesc(this.backend_id);
      if ( ! desc.match(/^\s*$/) ) {
        var textNode = document.createTextNode(" " + desc);
        itemDiv.appendChild(textNode);
      }
    }
    this.rendered = true;
}

// appendItemCount()
//   Append a parenthesized count field to an item
function appendItemCount( itemDiv, item )
{
  if ( typeof item.count == "string" &&
        item.count.length > 0 ) {
    check_count_url(item.id);
    itemDiv.appendChild(document.createTextNode(" ("));
    var countElement = document.createElement("A");
    countElement.className = "scbd";
    countElement.id = "s" + item.id + "ct";
    countElement.tabIndex = 3;
    var cntTxt = document.createTextNode(nx_unescape(item.count));
    countElement.appendChild(cntTxt);
    itemDiv.appendChild(countElement);
    itemDiv.appendChild(document.createTextNode(") "));
  }
}

function itemFoc( name )
{
   var c = this.className;
   if ( c.indexOf("foc") == -1 )
     if ( c.length > 0 )
       this.className = c + "foc";
     else
       this.className = "focusField";
      
   window.status = window.defaultStatus;
   if ( this.id.match(/s(\d*)ds/) ) {
      var row = RegExp.$1 - 0;
      var type = String(Folder.graph_type(row));
      if ( type.length > 0 )
         window.status = msgtext("Press_-->_(right_arrow)_for_gr");
                         // Press --> for graph menu
   }
}

function itemBlur( name )
{
   var c = this.className;
   if ( c.indexOf("foc") > 0 )
      this.className = c.replace(/foc/,"");
   else if ( c == "focusField" )
      this.className = "";
   else
      this.className = "scbd";
   window.status = window.defaultStatus;
}

Folder.graph_type = function(id)
{
    var folder = indexOfEntries[id];
    if (folder.backend_id == 0)
        return "Root";
    
    if ( folder.className == "Folder" ) {
       var hasItem = false;
       var hasFolder = false;
       for ( var i = folder.nChildren - 1; i >= 0; i-- ) {
          var child = folder.children[i];
          if ( ! hasItem && child.className == "Item" ) {
             hasItem = true;
             if ( hasFolder )
                return "All";
          }
          if ( ! hasFolder && child.className == "Folder" ) {
             // Only folder with items count.
             for ( var j = child.nChildren - 1; j >= 0; j-- ) {
                if (child.children[j].className == "Item") {
                   hasFolder = true;
                   if ( hasItem )
                      return "All";
                   break;
                }
              }
           }
       }
       if ( hasFolder )
           return "Folder";
       else if ( hasItem )
           return "Item";
    }
    return "";
}

var current_menu = null;

Folder.show_menu = function (e, id, delay)
{
   current_id = id;
   current_menu = Folder.get_current_menu(id);
   if (current_menu != null)
   {
      var assoc = null;
      var folder = indexOfEntries[id];
      if (folder.isOpen)
      {
        current_menu.changeItemLabel(0, msgtext("Close"));
      }
      else
      {
        current_menu.changeItemLabel(0, msgtext("Open"));
      }
      assoc = document.getElementById("s" + id + "pm");
      current_menu.show(e,assoc,delay);
   }
}

Folder.get_current_menu = function (id)
{
   var type = String(Folder.graph_type(id));
   var ret_menu = null;
   // Take out all menu items for Graph. (SCO 10578) 
   if ( type.length > 0 ) {
        ret_menu = root_graph_folder_menu;
   }
   return ret_menu;
}

Folder.selectFolder = function (id)
{
    if ( id != 0 )
      clickOnNode(id);
}

Folder.hide_menu = function (e)
{
    if ( current_menu )
       current_menu.hide();
    current_menu = null;
}

var esc_dq="";
var IMG_SRC_CONSTANT="BoxAxis=false"+esc_dq+
"@"+esc_dq+"BarSpacing=8"+esc_dq+
"@"+esc_dq+"ShadowDepth=4"+esc_dq;

function folderGraphVars()
{
    this.gType = "bar";
    this.gItemsWidth = 0;
    this.gFoldersWidth = 0;
    this.gItemsHeight = 300;
    this.gFoldersHeight = 300;
    this.gCum = 0;
}
Folder.saveFolderGraphVars = function (wname, gType, gCum, gWidth, gHeight)
{
    wname = popup_window_org_name(wname);
    var g_info = wname.match(/graph__([0-9]+)__(\w+)/);
    var folder = indexOfEntries[g_info[1]];
    if (!folder)
    return 0;

    var target_name = g_info[2];
    folder.graphVars.gType = gType;
    folder.graphVars.gCum = gCum;
    if (target_name == "Items")
    {
    folder.graphVars.gItemsWidth = gWidth;
    folder.graphVars.gItemsHeight = gHeight;
    }
    else if (target_name == "Folders")
    {
    folder.graphVars.gFoldersWidth = gWidth;
    folder.graphVars.gFoldersHeight = gHeight;
    }
    return 1;
}

Folder.get_desc = function (desc)
{
    var temp = desc.replace(/<[^>]+>/g, "");
    return temp;
}

Folder.get_width = function (lab_len, nCol)
{
    
    var width = (lab_len + 2) * 5 * nCol;
    if (width < 400)
    return 400;

    return width;
}

Folder.graphItems = function (id, is_update)
{
    var folder = indexOfEntries[id];
    var counts = Folder.getItemCounts(folder);
    var title;
    if ( ! folder.openedAtLeastOnce ) {
      graph_call_back = new graph_cb(0, id, is_update);
      clickOnNode(id);
      return;
    }
    if (!folder.graphVars.gItemsWidth)
    folder.graphVars.gItemsWidth = Folder.get_width(counts[2], folder.nChildren);

    title = Folder.get_desc(folder.desc);
    for ( var f = folder.parent; f != null && f.parent != null; f = f.parent )
      title = Folder.get_desc(f.desc) + " " + title;
    var img_src=IMG_SRC_CONSTANT+"@"+esc_dq+"TITLETEXT="+
                title+esc_dq+"@"+esc_dq+"YLabelSkip=1"+
                esc_dq+"@"+esc_dq+"XVALUELIST="+counts[0]+
                esc_dq+"@"+esc_dq+"GraphWidth="+
                folder.graphVars.gItemsWidth+esc_dq+"@"+esc_dq+
                "GraphType="+folder.graphVars.gType+esc_dq+"@"+
                esc_dq+"GraphHeight="+folder.graphVars.gItemsHeight+
                esc_dq+"@"+esc_dq+"Cumulate="+
                folder.graphVars.gCum+esc_dq+"@-y0="+counts[1];
    
    var URL = cfgCgi + "?OP=DISPLAY_FORM+SID=" + cfgSID + "+FID=" + 
              fid_generator() + "+KEEP.img_src=" + nx_escape(img_src) + 
              "+HTMPL=pdm_graph.htmpl" + "+KEEP.title=" + nx_escape(title);
    
    var graph_name = "graph__" + folder.id + "__Items";
    if (typeof is_update == "undefined")
    is_update = 0;

    popupGraphWindow(URL, graph_name, (50 + parseInt(folder.graphVars.gItemsWidth,10)), 
             is_update);
}

Folder.getItemCounts = function (folder)
{
    var len = folder.nChildren;
    var item_counts = new Array(); 
    var blank = " ";
    var longest_lab = 0;
    var ret_cnt = "";
    var ret_lab = "";

    for (var i = 0; i < len; i++)
    {
    var child = folder.children[i];
    if (child.className == "Item")
    {
        ret_cnt += blank + ( child.count - 0 );
        if (ret_lab != "")
        ret_lab += ",";

        ret_lab += child.desc;
        if (child.desc.length > longest_lab)
        longest_lab = child.desc.length;    

    }
    }

    if (ret_cnt != "")
    ret_cnt = esc_dq + ret_cnt + esc_dq;
    else 
    return null;

    item_counts[0] = ret_lab;
    item_counts[1] = ret_cnt;
    item_counts[2] = longest_lab;

    return item_counts;
}

Folder.graphFolders = function (id, is_update)
{
    var folder = indexOfEntries[id];
    var len = folder.nChildren;
    var folder_counts = new Array();
    var l_list = "";
    var nCol = 0;
    var i;

    // Check folders to make sure they are 
    // open first. 
    if (!folder.openedAtLeastOnce)
    {
    graph_call_back = new graph_cb(1, id, is_update);
    clickOnNode(id);
    return;
    }
 
    for (i = 0; i < len; i++)
    {
    var child = folder.children[i];
    if (child.className == "Folder")
    {
        if (l_list != "")
        l_list += ",";

        //l_list += child.desc;
        var counts = Folder.getItemCounts(child);
        if (counts)
            {
        if (!child.isOpen)
        { 
            // If folder does not have values, setup
            // a callabck for it.
            if (counts[1].match(/[0-9]/) == null)
            {
            graph_call_back = new graph_cb(1, id, is_update);
            clickOnNode(child.id);
            break; 
            }
            else 
            // Open the folder if it already has 
            // values.
            child.setState(1);
        }
                l_list+=child.desc;
        folder_counts[folder_counts.length] = counts;
            }

        if (!i)
        nCol = child.nChildren;
    }
    }

    if (typeof graph_call_back == "object") return;

    len = folder_counts.length;
    if (!len)
    return;

    if (!folder.graphVars.gFoldersWidth)
    folder.graphVars.gFoldersWidth = Folder.get_width(folder_counts[0][2], nCol); 

    var title = Folder.get_desc(folder.desc);
    for ( var f = folder.parent; f != null && f.parent != null; f = f.parent )
      title = Folder.get_desc(f.desc) + " " + title;
    
    var img_src=IMG_SRC_CONSTANT+"@"+esc_dq+"TITLETEXT="+
    title+esc_dq+"@"+esc_dq+"YLabelSkip="+
    len+esc_dq+"@"+esc_dq+"XVALUELIST="+
    folder_counts[0][0]+esc_dq+"@"+esc_dq+
    "LEGENDLIST="+l_list+esc_dq+"@"+esc_dq+
    "GraphWidth="+folder.graphVars.gFoldersWidth+esc_dq+
    "@"+esc_dq+"GraphType="+
    folder.graphVars.gType+esc_dq+"@"+esc_dq+
    "GraphHeight="+folder.graphVars.gFoldersHeight+esc_dq+
    "@"+esc_dq+"Cumulate="+folder.graphVars.gCum+
    esc_dq;
    
    for (i = 0; i < len; i++)
     img_src += "@-y" + i + "=" + folder_counts[i][1];

    var URL = cfgCgi + "?OP=DISPLAY_FORM+SID=" + cfgSID + "+FID=" + 
              fid_generator() + "+KEEP.img_src=" + nx_escape(img_src) + 
              "+HTMPL=pdm_graph.htmpl" + "+KEEP.title=" + nx_escape(title);
    var graph_name = "graph__" + folder.id + "__Folders";
    if (typeof is_update == "undefined")
    is_update = 0;

    popupGraphWindow(URL, graph_name, (50 + parseInt(folder.graphVars.gFoldersWidth,10)), 
             is_update);
}

Folder.update_graph = function ()
{
    var ahdtop = get_ahdtop(true);
    if (typeof ahdtop != "undefined" && typeof ahdtop == "object" && ahdtop != null) 
    {
    var i = 0;
        var window_name = new Array();
    var prefix;
    var wname;
    var g_info;
    var j;
    var start;
    var end;
    var id = 0;
        for ( var registered_name in ahdtop.AHD_Windows )
        window_name[i++] = registered_name;
        for ( i = 0; i < window_name.length; i++ ) 
    {
        wname = popup_window_org_name(window_name[i]);
        g_info = wname.match(/graph__([0-9]+)__(\w+)/);
        if (!g_info)
        continue;

        id = parseInt(g_info[1],10);
        if (g_info[2] == "Items")
        Folder.graphItems(id, 1); 

        else if (g_info[2] == "Folders")
        Folder.graphFolders(id, 1);
    }

    g_info = null;
    window_name = null;
    }
}

Folder.kill_graph = function()
{
    var ahdtop = get_ahdtop(true);
    var wname;
    var i = 0;
    var window_name = new Array();
    if (typeof ahdtop != "undefined" && typeof ahdtop == "object" && ahdtop != null) 
    {
        for ( var registered_name in ahdtop.AHD_Windows )
        window_name[i++] = registered_name;
    for ( i = 0; i < window_name.length; i++ ) 
    {
        wname = popup_window_org_name(window_name[i]);
        var g_info = wname.match(/graph__([0-9]+)__(\w+)/);
        if (!g_info)
        continue;

        var folder = indexOfEntries[g_info[1]];
        if (typeof folder != "undefined")
        {
        var ahdwin = ahdtop.AHD_Windows[wname];
        if (typeof ahdwin == "object")
        {
            delete ahdtop.AHD_Windows[wname];
            deregister_window(ahdwin);
            ahdwin.ahdtop = null;
            if ( ! ahdwin.closed )
            ahdwin.close();
        }
        }
    }
    }
}

//
// This function adds 'pdmqa' tags to the 'scoreborad.htmpl' form to 
// support form automation testing. It calls the user defined PdmQA 
// JavaScript Class/Object to do the actual work.   
//
Folder.pdmqa = function() {
  //
  // indexOfEntries - array of node objects (global variable)
  // tabField       - array of node ids     (global variable)
  //
  var pdmqa = new PdmQA(indexOfEntries, tabField);
  var labels = pdmqa.get_node_labels();
  var parsed_labels = pdmqa.parse_labels(labels, TRUNCATE_TO);
  var unique_labels = pdmqa.create_unique_labels(parsed_labels);
 
  //
  // Write the tags using the parsed unique tree node text 
  // descriptions for the values in the tags/attribute.
  //
  pdmqa.write_tags(unique_labels);
}

function outputFolderLink() 
{ 
    if ( this.hreference )
       return "<a href='" + this.hreference + "' tabindex=3 TARGET=\"basefrm\">"; 
    else 
       return "<a>"; 
} 
 
function addChild(childNode) 
{ 
    childNode.parent = this;
    childNode.childNum = this.nChildren;
    this.children[this.nChildren] = childNode; 
    this.nChildren++; 
    return childNode; 
} 
 

// Beware - recursion!!
function totalNumberDescendents(folder) {
    var cur_count = folder.nChildren;
    for (var i = 0; i < folder.nChildren; i++) {
        var an_item = folder.children[i];
        if ("Folder" == an_item.className) {
            var x = totalNumberDescendents(an_item);
            cur_count += x;
        }
    
    }
    return cur_count;
}


function folderSubEntries() 
{ 
    var i = 0; 
    var se = this.nChildren; 
 
    for (i=0; i < this.nChildren; i++)
    { 
    if (this.children[i].children) //is a folder 
        se = se + this.children[i].subEntries(); 
    } 
 
    return se; 
} 
 
 
// Definition of class Item (a document or link inside a Folder) 
// ************************************************************* 
 
// SDT 14074 add sqID param so we can get the crsq object later
function Item(itemDescription, itemCount, itemLink, itemID, sqID, rawDescription )
{ 
    // constant data
    this.className = "Item";
    this.desc = itemDescription; 
    
    // If this node label was expanded (e.g. a user_query), this is the 'raw' expansion string
    if (typeof rawDescription == "string") {
        this.rawDesc = rawDescription;
    } else {
        this.rawDesc = "";
    }
    
    if ( itemCount.match(/https?:/) ||
         itemCount.match(/URL=.*LINK_WITH_BOPSID/) ) {
       if ( maintain_mode ) {
          this.count = "";
          this.count_url = "";
       }
       else {
          this.count = "?";
          this.count_url = itemCount;
       }
    }
    else {
       this.count_url = "";
       if ( typeof itemCount == "string" && itemCount.length == 0 )
          this.count = "";
       else if ( typeof itemCount == "number" )
          this.count = itemCount - 0;
       else if ( ! maintain_mode )
          this.count = itemCount;
       else
          this.count = "";
    }
    this.link = itemLink;
    if ( typeof itemID == "number" )
       this.backend_id = itemID;  // User_Query id
    else
    {
       this.backend_id = -1;
       // Save this piece of information for use with the daemon
       // configuration tool
       this.daemon_id = itemID;
    }
    
    this.id = nCurrentEntry++;  // must match webengine order
    this.nodeId = -1;           //initialized in initalize()
    
    // We nx_escape the crsq_id (code) in the c code and 
    // nx_unescape it here.
    this.crsq_id = nx_unescape(sqID);    // Stored query CODE
    this.iconImg = null;
    this.iconSrc = "";
    this.isOpen = false;
    this.rendered = false;
    this.parent = null;
 
    // methods 
    this.draw = drawItem; 
    this.createIndex = createEntryIndex; 
    this.path = getPath;
    this.pathIDs = getPathIDs;
} 
 
function do_item_link(item_num)
{
    var item_name = "s" + item_num + "ds";
    var anchor_obj = document.getElementById(item_name);
    if (typeof anchor_obj == "object")
    {
    if (typeof anchor_obj.onclick != "undefined")
        anchor_obj.onclick();
    else 
    if (typeof anchor_obj.href != "undefined")
        eval(anchor_obj.href);
    else 
        anchor_obj.click();
    } 
} 

// check_count_url
//    If the count URL is a URL to a different application, verify it can be used
function check_count_url(itemNum, request_reset)
{
   var item = indexOfEntries[itemNum];
   var op_name = "SCOREBOARD_EXTERN";
   if ( typeof item.count == "string" &&
        item.count == "?" &&
        item.count_url.match(/^(.*)%cb(.*)$/) ) {
       var url_pre_cb = RegExp.$1;
       var url_post_cb = RegExp.$2;
       var tgt_domain = url_pre_cb;
       if ( tgt_domain.match(/URL=%([A-Z]+)\?/) ) {
          if ( RegExp.$1 == "CI" && typeof cfgCIurl == "string" )
             tgt_domain = cfgCIurl;
          else if ( RegExp.$1 == "HT" && typeof cfgHTurl == "string" )
             tgt_domain = cfgHTurl;
       }
       if ( tgt_domain.match(/https?:\/\/([^\/]*)\// ) ) {
          var cb = "";
          tgt_domain = RegExp.$1;
          var my_domain = document.domain;
          if ( tgt_domain == my_domain ) {
             // Domains match! We can update directly.
             cb = "parent.scoreboard.reset_bin(" + itemNum + ",_count,'" + op_name + "')";
          }
          else {
             // Domains do not match.  We have to stand on our heads
         var protocol = "http";
         var win_url = window.location.href;
         if (win_url.indexOf("https") != -1)
        protocol = "https";
             cb = 'document.location.href="' + protocol + '://' + document.domain +
                  cfgCgi + "?SID=" + cfgSID + "+FID=" + fid_generator() +
                  "+OP=RESET_BIN+OP_NAME=" + op_name + "+BIN=" + 
          itemNum + '+CT=_count"';
          }
          var old_cb = cb;
          cb = nx_escape(cb).replace(/\+/g,"%252b");
          cb = nx_escape(cb);
          var url = "";
          if ( ! url_pre_cb.match(/https?:/) )
             url = cfgCgi + "?SID=" + cfgSID + "+FID=" + fid_generator() + "+" + url; 
          if ( url_pre_cb.match(/(.*URL=)(.*)$/) )
             url_pre_cb = RegExp.$1 + nx_escape(RegExp.$2);
          if ( url_post_cb.match(/([^\+]+)(\+.*)$/) )
             url_post_cb = nx_escape(RegExp.$1) + RegExp.$2;
          url += url_pre_cb + cb + url_post_cb;
      if ((typeof request_reset != "undefined") &&
          request_reset)
        load_workframe(url, "request_reset", op_name);
      else 
        load_workframe(url, 0, op_name);
       }
   }
}

function do_link(id) {
    var clicked = indexOfEntries[id];
    var href = nx_unescape(clicked.link);
    selected_item = indexOfEntries[id]; // for maintain_mode
    if ( ! href.match(/OP=SEARCH/) ) {
       var features = "";
       if ( href.match(/\w*:/) || 
            href.match(/LINK_WITH_BOPSID/i) )
          features = "ahdmenu=no,register=no";
       popup_window('', href, 0, 0, features);
    }
    else {
       var name = "s" + id + "ds";

       reset_selected();
       selectedElement = doc.getElementById(name);
       selectedElement.className = "scbdselectedfoc";
       var cnt = doc.getElementById("s" + id + "ct");
       if ( cnt != null )
         cnt.className = "scbd";
       var i;
       href = cfgCgi + "?SID=" + cfgSID + "+FID=" + 
              fid_generator() + "+" + clicked.link;

       var f = parent.frames[tgt_frame];
       if ( typeof f != "object" || f == null )
          window.document.location.href = href;
       else if ( typeof f.action_in_progress == "function" &&
          f.action_in_progress() )
          return;
       else {
          if (ahdtop.cstReducePopups &&
              typeof f._dtl == "object" && 
              f._dtl.edit &&
              typeof f.currentAction != "undefined" &&	
              f.currentAction == ACTN_COMPLETE)
          {
            f.cancel_window();
          }
          else
          {     
            if ( typeof f.action_in_progress == "function" )
	        f.set_action_in_progress(ACTN_SEARCH);
            f.location = href;
          } 
       }
    }
}

// SDT 14074 Also fire the setup mode callback, maintainClickEvent().  This lets
// us know when the user clicks node/folder in maintainence mode.
function do_setup_link(id)
{
    // For setup  mode - simply highlight
    // and record the selection

    selected_item = indexOfEntries[id]; // for maintain_mode
    var name;
    if (selected_item.className == "Folder")
	name = "s" + id + "pm";
    else 
	name = "s" + id + "ds";
    reset_selected();
    selectedElement = doc.getElementById(name);
    selectedElement.className = "scbdselectedfoc";
    var cnt = doc.getElementById("s" + id + "ct");
    if ( cnt != null )
        cnt.className = "scbd";
    
    if (typeof maintainClickEvent != "undefined") {
        maintainClickEvent();
    }
}

function reset_selected()
{
    if ( selectedElement != null )
    {
        selectedElement.className = "scbd";
        selectedElement = null;
    }
}


// Disable update counts
function disable_updates()
{
    if ( typeof cfgTimeoutID != "undefined" ) {
       window.clearTimeout(cfgTimeoutID);
       cfgTimeoutID = void(0);
    }
    var e = document.getElementById("autoUpdTime");
    if ( typeof e == "object" && e != null )
       e.innerHTML = "---";
    ImgBtnDisableButton("btn001");
}

// If possible, request new counts for all bins.
function request_reset(itemList)
{
    if (window.name == "scoreboard")
    window.ahdtop.scoreboard = window;

    var i;
    if ( request_reset_active ) {
       // If any of the frame for issuing scoreboard request_reset 
       // url is expired (times out), we may go on to process the 
       // request.
       if (typeof ahdtop != "undefined" && null != ahdtop &&
       typeof ahdtop.work_frame_mgr != "undefined" && 
       !ahdtop.work_frame_mgr.is_expired("SCOREBOARD") &&
       !ahdtop.work_frame_mgr.is_expired("SCOREBOARD_EXTERN"))
       {
        alertmsg("Update_counts_in_progress_-_pl");
                // Update counts in progress - please wait for response
        return;
       }
    }
    request_reset_active = true;
    if ( typeof cfgTimeoutID != "undefined" ) {
       window.clearTimeout(cfgTimeoutID);
       cfgTimeoutID = void(0);
    }
    cleanup_window_list();

    var url = cfgCgi + "?OP=REFRESH_SCOREBOARD+SID=" +
              cfgSID + "+FID=" + fid_generator() +
              "+TGT=" + self.name + "+TS=" + usq_time_stamp;
    // If this is an auto-update, all update requests need 
    // to be auto-update.
    if ( typeof cfgAutoUpdate == "number" && cfgAutoUpdate > 0 )
       url += "+BKGD=1";
    if ( typeof itemList != "undefined" )
      url += "+ITEMS=" + nx_escape(itemList);
    else {
       for ( i = 0; i < nEntries; i++ ) {
          var e = document.getElementById("s" + i + "ct");
          if ( e != null )
             e.className = "scbd";
       }
    }
    if ( ! load_workframe(url, "request_reset", "SCOREBOARD") ) {
       request_reset_active = false;
       request_reload(1);
    }
    else if ( typeof itemList == "undefined" ) {
       for ( i = 0; i < nEntries; i++ ) {
          var item = indexOfEntries[i];
          if ( typeof item.count_url == "string" &&
               item.count_url.length > 0 ) {
             reset_bin(i, "?");
             check_count_url(i, 1);
          }  
       }
    }
}

//    If reset_folder_status is true, do not attempt to reopen
//    tree folders.  This is mostly necessary when the scoreboard
//  has just been customized.
function request_reload(is_update, reset_folder_status)
{
    var folder_status = "";
    
    if (typeof reset_folder_status != "number" || reset_folder_status <= 0) {
        for ( var i = 0; i < nEntries; i++ )
        {
        if ( indexOfEntries[i].isOpen )
            folder_status += '+';
        else
            folder_status += '-';
        }
    }
    if (typeof ahdtop != "undefined" && null != ahdtop &&
    typeof ahdtop.gobtn != "undefined")
    ahdtop.gobtn.document.globals.folder_status.value = folder_status;

    if ((typeof is_update == "undefined") || 
    !is_update)
    Folder.kill_graph();

    var z = cfgCgi + "?SID=" + cfgSID + "+FID=" + fid_generator() +
            "+OP=DISPLAY_FORM+HTMPL=";
    if ( cfgUserType != "analyst" )
       z += "buttons.htmpl";
    else
       z += "load_wait.htmpl+KEEP.new_htmpl=scoreboard.htmpl+KEEP.wait_msg=553";

    // Make the frames used by the scorebaord available again
    if (typeof ahdtop == "object" && ahdtop != null &&
    typeof ahdtop.work_frame_mgr != "undefined")
    {
    var wf_mgr = ahdtop.work_frame_mgr;
    wf_mgr.free_work_frame("SCOREBOARD");
    wf_mgr.free_work_frame("SCOREBOARD_EXTERN");
    }

    // If this is an auto-update, all update requests need 
    // to be auto-update.
    if ( typeof cfgAutoUpdate == "number" && cfgAutoUpdate > 0 )
       z += "+BKGD=1";
   
    // use replace() - avoids caching errors
    window.document.location.replace(z);
}

// reset_bin()
//    Reset the count field in a single bin
function reset_bin( bin, count, op_name )
{
   if (typeof op_name == "undefined")
      op_name = "";
   var anchor = document.getElementById("s" + bin + "ct");
   if ( typeof anchor == "object" && anchor != null ) {
      if (_browser.isIE)
	anchor.innerText = count;
      else 
	anchor.innerHTML = count;
      itemPtrs[bin].count = count;
   }
   if ( count != "?" )
      next_workframe(op_name);
}

// reset_bins()
//    Reset multiple bins.  The argument is a string of the form:
//       "nn:xx nn:xx ..."
//    where nn is the index of a bin to reset, and xx is its new count
function reset_bins(upd_string)
{
    reset_selected();
    var e = document.getElementById("scoreboard_asof_date");
    if ( e != null )
      e.innerHTML = date_to_string(Math.round( new Date().getTime() / 1000));       
    var updates = upd_string.split(/ +/);
    for ( var i = 0; i < updates.length; i++ ) {
       if ( updates[i].match(/^([^:]+):(.*)$/) ) {
          var index = RegExp.$1 - 0;
          var newCount = RegExp.$2;
          e = document.getElementById("s" + index + "ct");
          if ( e != null ) {
             var oldCount = e.innerHTML;
	     if (_browser.isIE)
		e.innerText = newCount;
	     else 
		e.innerHTML = newCount;
             newCount = newCount - 0;
             itemPtrs[index].count = newCount;
             if ( oldCount != "?" &&
                  (oldCount - 0) != newCount )
                e.className = "scbdupdated";
          }
       }
    }
    Folder.update_graph();
    var isAutoUpdate = false;
    if ( typeof cfgAutoUpdate == "number" && cfgAutoUpdate > 0 ) {
       e = document.getElementById("autoUpdTime");
       if ( typeof e == "object" && e != null ) {
          var next = new Date((new Date()).getTime() + cfgAutoUpdate);
			// 20130925 bmalz @ e-xim
			var godz = next.getHours();
			var min = next.getMinutes();
			var sec = next.getSeconds();
			if (min < 10)
		    	min = '0' + min;
			if (sec < 10)
			    sec = '0' + sec;
			 e.innerHTML = godz + ":" + min + ":" + sec;
          // e.innerHTML = next.toTimeString(); // 20130925 bmalz @ e-xim
          cfgTimeoutID = window.setTimeout("request_reset()", cfgAutoUpdate);
	  isAutoUpdate = true;
       }
    }
    if ( typeof itemsNeedingCount != "undefined" )
      itemsNeedingCount = void(0);
    else if ( ! isAutoUpdate )
       fldrtreeTabOff();
    // If My Document (KT) does not work, setting this flag 
    // to false can keep the scoreboard going.
    request_reset_active = false;
    if (typeof graph_call_back == "object")
    graph_call_back.call_back(); 
    next_workframe("SCOREBOARD");
}

 
// Methods common to both objects (pseudo-inheritance) 
// ******************************************************** 
 
function createEntryIndex() 
{ 
    if ( this.nodeId == -1 ) {
       this.nodeId = nEntries++; 
       indexOfEntries[this.id] = this; 
    }
} 
 
// clickOnNode()
//   Invoked by an onclick() event handler on the plus or minus sign
//   adjacent to a folder.  Open or close the folder as appropriate by
//   calling setState() to display or hide the fldrContentsDiv
function clickOnNode(folderId, doReset) 
{ 
    var clickedFolder = 0; 
    var state = 0; 
    if ( typeof folderId != "number" ) {
      if ( this.id.match(/s(\d+)pm/) )
        folderId = RegExp.$1;
      else
        return;
    }
    clickedFolder = indexOfEntries[folderId]; 
    state = clickedFolder.isOpen; 
    if ( state && folderId == 0 )
      return;

    if ( isHierSelect &&
         HierLoadRequired( clickedFolder.backend_id ) )
       return;
 
    clickedFolder.setState(!state); //open<->close
    var temp_menu = Folder.get_current_menu(clickedFolder.id);
    if (temp_menu == null) return;
    if (clickedFolder.isOpen)
    {
        temp_menu.changeItemLabel(0, msgtext("Close"));
    }
    else
    {
        temp_menu.changeItemLabel(0, msgtext("Open"));
    }
    if ( typeof itemsNeedingCount != "undefined" ) {
      if ( typeof doReset != "boolean" || doReset )
        request_reset(itemsNeedingCount);
    }
    else 
    {
    if (typeof graph_call_back == "object")
        graph_call_back.call_back();
    }
}

var fldrtree;
var fldrtreeOnload = null;
function displayFolderTree()
{
    var scrollDiv = document.getElementById("scrollbarDiv0"); 
	if ( scrollDiv == null )
      scrollDiv = document.body;
    var disp_height = scrollDiv.clientHeight + scrollDiv.offsetTop + 500;
    fldrtree.style.height = disp_height + "px";
    if ( isHierSelect )
	fldrtree.style.fontSize = "0.8em";
    else 
	fldrtree.style.fontSize = "0.7em";
    
    scrollDiv.appendChild(fldrtree);
    fldrtreeIsDrawn = true;
    if ( fldrtreeOnload != null )
      fldrtreeOnload();
}
 
function initializeDocument() 
{ 
    if ( ! isHierSelect &&
         cfgUserType == "analyst" &&
         typeof graph_folder_menu == "undefined")
       init_graph_menus();

    if ( typeof uspKeydownHandler != "undefined" ) {
       if (_browser.isMAC)     
        document.onkeypress = uspKeydownHandler;
       else
        document.onkeydown = uspKeydownHandler;
       setTempKeyDownHandler(scoreboardKeyDown);
    }

    // Create the folder tree

    fldrtree = document.createElement("DIV");
    fldrtree.id = "fldrtree";
    foldersTree.draw(fldrtree, 0, 0); 
    fldrtreeOnload = window.onload;
    window.onload = displayFolderTree;

    if ( isHierSelect ) {
        // Create the Mouseover Preview structure.
        if (ahdtop.cfgUserType == "analyst" && ! ahdtop.cstDisablePreviews) {
            mo_preview_def_obj = new mo_preview(draggable_option, resizable_option);
            docWriteln( moPreviewHTML() );
            //removing position:relative to make the Mouseover Preview immovable
            //relative to fldrtree.
            if(_browser.isIE)
            {
                var scrollDiv = document.getElementById("scrollbarDiv0"); 
	            if ( scrollDiv != null )
                    scrollDiv.style.position="";
            }

        }
    }
} 
 
function insFld(parentFolder, childFolder) 
{ 
    parentFolder.addChild(childFolder); 
    return childFolder;
} 
 
function insDoc(parentFolder, document) 
{ 
    parentFolder.addChild(document); 
} 

function displayChildren(parentFolder)
{
    parentFolder.isOpen = false;
    parentFolder.setState(true);
}

// openFolders - return a list of open folders
function openFolders()
{
  var list = "";
  for ( i = 0; i < nEntries; i++ ) {
    var item = indexOfEntries[i];
    if ( item.className = "Folder" &&
         item.isOpen )
      list += " " + i;
  }
  return list.substring(1);
}
 
// Global variables 
// ****************

var indexOfEntries = new Array();
var nCurrentEntry = 0;      // incremented by order passed by webengine
var nEntries = 0;           // incremented by order of tree initialization
var doc = document; 
var selectedFolder = 0;
var selectedElement = null;
var nctemNum = 0;
var tabField = new Array();
var ahdtop = ( parent.name == "AHDtop" ? parent : get_ahdtop(true) );
var request_reset_active = false;
var isHierSelect = false;
var fldrtreeIsDrawn = false;
var itemsNeedingCount = void(0);
var pdmqaTags = new Array(); // Array of objects/tags (with each object having desc and id as attributes).

if (typeof ahdtop == "undefined" || null == ahdtop)
    alertmsg("Error_-_could_not_find_main_me"); // Error - could not find main menu in a browser window!

var selected_item = null;

// Popup a window for tree maintenance.
var usq_update = null;
function maintain_tree(login_id)
{
    if (usq_update == null || usq_update.closed)
    {

    // monitor changes to user sql if we made a copy of it from the default
    ahdtop.usq_changed=0;
    ahdtop.usq_copy_made=0;

    var w_name = get_popup_window_name("usq_update");
    var query_string = cfgCgi + "?SID=" + cfgSID + "+FID=" + fid_generator() + "+KEEP.IsPopUp=1";
    query_string += "+KEEP.POPUP_NAME=" + w_name;
    
    if ( (typeof usq_owner != "undefined") &&  usq_owner != login_id)
    {
        var msg = msgtext("Preparing_for_customization..."); // Preparing for customization...
        query_string += "+OP=DISPLAY_FORM+KEEP.Message=" + nx_escape(msg) +
                            "+KEEP.COPY_FROM=" + nx_escape(usq_owner) +
                            "+HTMPL=working.htmpl";
    }
    else
        query_string += "+OP=DISPLAY_FORM+HTMPL=usq_update.htmpl";
    
    var features = "width=800,height=625,scrollbars,resizable";
    if ( ahdtop.propDebugOptions != "" )
      features = modifyWindowFeaturesForDebug(features);
    usq_update = window.open(query_string, "", features);
    if ( typeof usq_update == "object" && usq_update != null )
    {
 	usq_update.name = w_name;
	register_window(usq_update);
    }
    else
	check_popup_blocker(usq_update); 
    }
    if ( typeof usq_update == "object" && usq_update != null )
	usq_update.focus();
}

// This function is used exclusively to pop the
// customize scbd form for a specific Access Type.
function maintain_tree_for_acctyp(acctyp_id)
{
    // Need to check if it exists?
    if (null == acctyp_id || acctyp_id.length <= 0) {
        alert("Bad id passed: " + acctyp_id);
        return;
    }
    
    var query_string = cfgCgi + "?SID=" + cfgSID + "+FID=" + fid_generator() + "+KEEP.IsPopUp=1";

    query_string += "+KEEP.USQ_OWNER=" + acctyp_id + "+OP=DISPLAY_FORM+HTMPL=usq_update.htmpl";

    var w_name = get_popup_window_name("usq_update");
    var features = "width=800,height=625,scrollbars,resizable";
    if ( ahdtop.propDebugOptions != "" )
      features = modifyWindowFeaturesForDebug(features);
    usq_update = window.open(query_string, "", features);
    if (!check_popup_blocker(usq_update))
	return;
    usq_update.name = w_name; 
    register_window(usq_update);

    usq_update.focus();
}


function scoreboardKeyDown( active_element, keycode, shiftkey )
{
   var e;
   if ( typeof active_element == "object" ) {
      var id = active_element.id;
      if ( typeof id != "string" )
         id = "";
      if ( id.match(/s(\d*)(ds|pm)/) ) {
         var row = RegExp.$1 - 0;
         var suffix = RegExp.$2;
         var tgt = null;
         var entry = indexOfEntries[row];
         switch ( keycode ) {
            case ARROW_DOWN:
               if ( entry.className == "Folder" &
                    entry.nChildren > 0 &&
                    entry.isOpen )
                  tgt = entry.children[0];
               else if ( entry.parent != null ) {
                  if ( entry.childNum+1 < entry.parent.nChildren )
                     tgt = entry.parent.children[entry.childNum+1];
                  else {
                     var parent = entry.parent;
                     while ( true ) {
                        var tgtPosn = parent.childNum + 1;
                        parent = parent.parent;
                        if ( parent == null )
                           break;
                        if ( tgtPosn < parent.nChildren ) {
                           tgt = parent.children[tgtPosn];
                           break;
                        }
                     }
                  }
               }
               break;

            case ARROW_UP:
               if ( entry.childNum == 0 )
                  tgt = entry.parent;
               else if ( entry.parent != null ) {
                  tgt = entry.parent.children[entry.childNum-1];
                  if ( tgt != null &&
                       tgt.className == "Folder" &&
                       tgt.nChildren > 0 &&
                       tgt.isOpen ) {
                     tgt = tgt.children[tgt.nChildren-1];
                     while ( tgt.className == "Folder" &&
                             tgt.nChildren > 0 &&
                             tgt.isOpen )
                       tgt = tgt.children[tgt.nChildren-1];
                  }
               }
               break;

            case ENTER:
               if ( ! shiftkey )
	       {
		 // Occasionally pressing ENTER to open 
		 // a folder had a problem to show the 
		 // minus sign and the folder icon. If we 
		 // catch the key here and process it, the 
		 // problem seems to go away. 
		 if (_browser.isIE && suffix == "pm")
		 {
		    // Call the function to open or 
		    // close the folder tree.
		    clickOnNode(row);
		    // Return false, so it doesn't call 
		    // the onclick handler. 
		    return false;
		 }
                 break;
	       }
               if ( suffix != "ds" && suffix != "pm" )
                 return false;
               // Fall though... (Shift+Enter = show context menu)

            case ARROW_RIGHT:
               if ( suffix == "ds" ) {
                  Folder.show_menu("mouseless",row,0);
                  return false;
               }
               else if ( suffix == "pm" ) {
                  e = document.getElementById("s" + row + "ds" );
                  if ( e != null ) {
                     e.focus();
                     return false;
                  }
                  break;
               }

            case ARROW_LEFT:
               if ( suffix == "ds" ) {
                  e = document.getElementById("s" + row + "pm");
                  if ( typeof e == "object" && e != null ) {
                     e.focus();
                     return false;
                  }
               }
               break;

            case HOME:
            case PAGE_UP:
               if ( shiftkey ) {
                  if ( ! isHierSelect )
                     return bubbleToMainWindow( active_element,
                                                keycode, shiftkey );
                  else {
                     fldrtreeTabOff();
                     return false;
                  }
               }
         }
      }
      if ( tgt != null ) {
         if ( tgt.className == "Folder" )
            e = document.getElementById("s" + tgt.id + "pm" );
         else
            e = document.getElementById("s" + tgt.id + "ds" );
         if ( e != null ) {
            e.focus();
            return false;
         }
      }
   }
   return true;
}
