  
OBJECT ldap LDAP {
    ATTRIBUTES LDAP_Entry{
		zNRE NRE STRING;
		whenCreated whenCreated STRING ;
		whenChanged whenChanged STRING ;
		userAccountControl "!userAccountControl:1.2.840.113556.1.4.803:" INTEGER ;
    } ;
} ;