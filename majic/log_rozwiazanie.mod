OBJECT alg {
    TRIGGERS {
		POST_CI  log_rozwiazanie( call_req_id, description, system_time, zresolution_code ) 130
					FILTER( EVENT("INSERT") && type == "SOLN" );
    };
} ;