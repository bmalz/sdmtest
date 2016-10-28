OBJECT cr {
    TRIGGERS {
		PRE_VALIDATE HR_set_default_status( status, category ) 56 FILTER( EVENT("INSERT")  );
    };
} ;