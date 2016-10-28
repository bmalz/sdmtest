OBJECT lrel_cenv_cntref {
    TRIGGERS {
       POST_CI insert(cnt, nr) 50 FILTER( EVENT("INSERT") ); 
	   POST_CI delete(cnt, nr) 51 FILTER( EVENT("DELETE") );
    };
 
} ;