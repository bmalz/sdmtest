OBJECT cr {
    TRIGGERS {
       POST_VALIDATE acceptances_copy() 51 FILTER( EVENT("INSERT") ); 
    };
 
} ;