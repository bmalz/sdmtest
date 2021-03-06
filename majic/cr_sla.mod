////////////////////////////////////////////////////////////////////////////
// Copyright (C) 1997, 1995 Computer Associates International, Inc
//
// Copyright (C) 1991 - 1993 NetWorx, Incorporated.  All Rights Reserved.
//
// Copyright (C) 1994, 1995 Legent Software, Inc., as an
// unpublished work. This notice does not imply unrestricted or public
// access to these materials which are a trade secret of Legent
// Corporation or its subsidiaries or affiliates (together referred to
// as "LEGENT"), and which may not be reproduced, used, sold or
// transferred to any third party without LEGENT's prior written consent.
//
// All Rights Reserved.
//
// RESTRICTED RIGHTS LEGEND
// Use, duplication, or disclosure by the Government is subject to
// restrictions as set forth in subparagraph (c)(1)(ii) of the Rights in
// Technical Data and Computer Software clause at DFARS 252.227-7013.
////////////////////////////////////////////////////////////////////////////
// Module:      cr_sla.mod
// Created:     20-oct-1997
////////////////////////////////////////////////////////////////////////////
// Description:
//
//      BOP config file for Service Level Agreement Support of
//      Call Management. 
//
////////////////////////////////////////////////////////////////////////////
 
// calculate the sla for the call request.  These are triggers which
// fire when the attribute is modified.
MODIFY cr customer ON_POST_VAL calculate_sla( ) 80 
	FILTER( EVENT("INSERT(NX_CLASSIC_SLA_PROCESSING) UPDATE(NX_CLASSIC_SLA_PROCESSING) DELETE(NX_CLASSIC_SLA_PROCESSING)") );

MODIFY cr affected_resource ON_POST_VAL calculate_sla( ) 80 
	FILTER( EVENT("INSERT(NX_CLASSIC_SLA_PROCESSING) UPDATE(NX_CLASSIC_SLA_PROCESSING) DELETE(NX_CLASSIC_SLA_PROCESSING)") );

MODIFY cr priority ON_POST_VAL calculate_sla( ) 80 
	FILTER( EVENT("INSERT(NX_CLASSIC_SLA_PROCESSING) UPDATE(NX_CLASSIC_SLA_PROCESSING) DELETE(NX_CLASSIC_SLA_PROCESSING)") );

MODIFY cr category ON_POST_VAL calculate_sla( ) 80 
	FILTER( EVENT("INSERT(NX_CLASSIC_SLA_PROCESSING) UPDATE(NX_CLASSIC_SLA_PROCESSING) DELETE(NX_CLASSIC_SLA_PROCESSING)") );


