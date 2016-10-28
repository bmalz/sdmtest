OBJECT cnt {
	TRIGGERS {
	POST_VALIDATE ldap_dn_change( ldap_dn ) 11 FILTER(ldap_dn {});
	POST_VALIDATE ldap_inactive( zuserAccountControl ) 12 FILTER(zuserAccountControl {});
	};
};