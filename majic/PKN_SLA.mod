OBJECT attached_sla {
    TRIGGERS {
       //POST_CI update_sdscs( _mapped_cr, map_sdsc, zforfz ) 1001 FILTER( EVENT("INSERT") ); 
    };
	FACTORY {
		METHODS {
			set_zforfz( string , int );
		};
	};
} ;

OBJECT cr {
    TRIGGERS {
       POST_VALIDATE set_zsdsc( category ) 505 FILTER( EVENT("INSERT") ); 
    };
} ;