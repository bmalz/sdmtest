OBJECT zCorrespondenceIncome {
    TRIGGERS {
       POST_VALIDATE setRef_num() 50 FILTER( EVENT("INSERT") ); 
    };
 
} ;

OBJECT zCorrespondanceOucome {
    TRIGGERS {
       POST_VALIDATE setRef_num() 50 FILTER( EVENT("INSERT") ); 
    };
 
} ;