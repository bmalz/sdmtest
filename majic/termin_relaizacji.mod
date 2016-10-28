OBJECT cr {
    TRIGGERS {
		POST_CI  set_termin_realizacji( persistent_id ) 35
					FILTER( EVENT("INSERT UPDATE") && ( priority {} || zsdsc {} ) );
		POST_CI  set_fztermin_realizacji( persistent_id ) 36
					FILTER( EVENT("INSERT UPDATE") && ( priority {} || zfzsdsc {} ) );
    };
} ;