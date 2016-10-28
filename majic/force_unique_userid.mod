MODIFY cnt userid  {ON_PRE_VAL validate_userid() 40
			FILTER (delete_flag != 1);
			};
						
MODIFY cnt delete_flag  {ON_PRE_VAL validate_delete_flag() 40
			FILTER (delete_flag != 1);
			};
