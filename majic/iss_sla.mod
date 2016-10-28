////////////////////////////////////////////////////////////////////////////
//         Copyright (C) 2002 Computer Associates International, Inc
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
// Module:  iss_sla.mod
// Created: 03/26/02
////////////////////////////////////////////////////////////////////////////
// Description:
//
//      BOP config file for Service Level Agreement Support of Issues.
//
////////////////////////////////////////////////////////////////////////////
// $Header: /base/source/bp/change_mgr/options/isssla/.RCS/iss_sla.mod,v 1.3 2004/01/26 23:18:50 magri05 Exp $

 
////////////////////////////////////////////////////////////////////////////
// calculate the sla for the change order.  These are triggers which
// fire when the attribute of the change order is modified.
// Can't use asset to determine sla because there may be multiple assets
// affected by a change order.
////////////////////////////////////////////////////////////////////////////
MODIFY iss requestor        ON_POST_VAL calculate_sla( ) 80 
	FILTER( EVENT("INSERT(NX_CLASSIC_SLA_PROCESSING) UPDATE(NX_CLASSIC_SLA_PROCESSING) DELETE(NX_CLASSIC_SLA_PROCESSING)") );

MODIFY iss priority         ON_POST_VAL calculate_sla( ) 80 
	FILTER( EVENT("INSERT(NX_CLASSIC_SLA_PROCESSING) UPDATE(NX_CLASSIC_SLA_PROCESSING) DELETE(NX_CLASSIC_SLA_PROCESSING)") );

MODIFY iss category         ON_POST_VAL calculate_sla( ) 80 
	FILTER( EVENT("INSERT(NX_CLASSIC_SLA_PROCESSING) UPDATE(NX_CLASSIC_SLA_PROCESSING) DELETE(NX_CLASSIC_SLA_PROCESSING)") );

