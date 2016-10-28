OBJECT cnt PDM {
	ATTRIBUTES ca_contact {
		userAccountControl INTEGER ;
		};
	};
	
OBJECT pcat {
  ATTRIBUTES Prob_Category {
    zcntref BREL zlrel_pcat_cnt pcat { LREL cnt; } ;
	zcntref1 BREL zlrel_pcat_cnt1 pcat { LREL cnt; } ;
	zcntref2 BREL zlrel_pcat_cnt2 pcat { LREL cnt; } ;
	zcntref3 BREL zlrel_pcat_cnt3 pcat { LREL cnt; } ;
  };
};

OBJECT cr {
  ATTRIBUTES Prob_Category {
    zcntref BREL zlrel_cr_cnt cr { LREL cnt; } ;
	zcntref1 BREL zlrel_cr_cnt1 cr { LREL cnt; } ;
	zcntref2 BREL zlrel_cr_cnt2 cr { LREL cnt; } ;
	zcntref3 BREL zlrel_cr_cnt3 cr { LREL cnt; } ;
  };
};


OBJECT cnt {
  ATTRIBUTES usp_contact SECONDARY {
    zpcatref BREL zlrel_pcat_cnt cnt { LREL pcat; } ;
	zpcatref1 BREL zlrel_pcat_cnt1 cnt { LREL pcat; } ;
	zpcatref2 BREL zlrel_pcat_cnt2 cnt { LREL pcat; } ;
	zpcatref3 BREL zlrel_pcat_cnt3 cnt { LREL pcat; } ;
	zcrref BREL zlrel_cr_cnt cnt { LREL pcat; } ;
	zcrref1 BREL zlrel_cr_cnt1 cnt { LREL cr; } ;
	zcrref2 BREL zlrel_cr_cnt2 cnt { LREL cr; } ;
	zcrref3 BREL zlrel_cr_cnt3 cnt { LREL cr; } ;
  };
};