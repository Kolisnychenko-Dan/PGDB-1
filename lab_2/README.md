Laboratory topic: Creating a database application focused on interaction with the PostgreSQL DBMS

                                    Table "public.heroes"
   Column    |       Type        | Collation | Nullable |              Default               
-------------+-------------------+-----------+----------+------------------------------------
 heroes_id   | integer           |           | not null | nextval('heroes_id_seq'::regclass)
 hero        | character varying |           | not null | 
 stats_str   | integer           |           | not null | 
 stats_agile | integer           |           | not null | 
 stats_int   | integer           |           | not null | 
 damage      | integer           |           | not null | 
Indexes:
    "heroes_pk" PRIMARY KEY, btree (heroes_id)
    "unique_hero" UNIQUE CONSTRAINT, btree (hero)
Referenced by:
    TABLE "itembuilds" CONSTRAINT "suggested_items_hero_id_fkey" FOREIGN KEY (hero_id) REFERENCES heroes(heroes_id) ON UPDATE CASCADE ON DELETE CASCADE


Table "public.items"
   Column    |       Type        | Collation | Nullable |              Default              
-------------+-------------------+-----------+----------+-----------------------------------
 items_id    | integer           |           | not null | nextval('items_id_seq'::regclass)
 price       | integer           |           | not null | 
 stats_str   | integer           |           | not null | 
 stats_agile | integer           |           | not null | 
 stats_int   | integer           |           | not null | 
 damage      | integer           |           | not null | 
 item        | character varying |           | not null | 
Indexes:
    "items_pk" PRIMARY KEY, btree (items_id)
    "unique_item" UNIQUE CONSTRAINT, btree (item)
Referenced by:
    TABLE "itembuild_links" CONSTRAINT "suggested_item_links_item_id_fkey" FOREIGN KEY (item_id) REFERENCES items(items_id) ON UPDATE CASCADE ON DELETE CASCADE


Table "public.itembuilds"
    Column     |       Type        | Collation | Nullable |                           Default             
              
---------------+-------------------+-----------+----------+-----------------------------------------------
--------------
 itembuilds_id | integer           |           | not null | nextval('suggested_items_suggested_items_id_se
q'::regclass)
 hero_id       | integer           |           | not null | 
 patch         | character varying |           | not null | 
 winrate       | numeric(5,2)      |           |          | 0
Indexes:
    "suggested_items_pkey" PRIMARY KEY, btree (itembuilds_id)
Check constraints:
    "itembuilds_winrate_check" CHECK (winrate <= 100.00 AND winrate >= 0.00)
Foreign-key constraints:
    "suggested_items_hero_id_fkey" FOREIGN KEY (hero_id) REFERENCES heroes(heroes_id) ON UPDATE CASCADE ON
 DELETE CASCADE
Referenced by:
    TABLE "itembuild_links" CONSTRAINT "itembuild_id_fkey" FOREIGN KEY (itembuild_id) REFERENCES itembuild
s(itembuilds_id) ON UPDATE CASCADE ON DELETE CASCADE


Table "public.itembuild_links"
    Column    |  Type   | Collation | Nullable | Default 
--------------+---------+-----------+----------+---------
 itembuild_id | integer |           | not null | 
 item_id      | integer |           | not null | 
 amount       | integer |           | not null | 1
Indexes:
    "suggested_item_links_pk" PRIMARY KEY, btree (itembuild_id, item_id)
Foreign-key constraints:
    "itembuild_id_fkey" FOREIGN KEY (itembuild_id) REFERENCES itembuilds(itembuilds_id) ON UPDATE CASCADE ON DELETE CASCADE
    "suggested_item_links_item_id_fkey" FOREIGN KEY (item_id) REFERENCES items(items_id) ON UPDATE CASCADE ON DELETE CASCADE
