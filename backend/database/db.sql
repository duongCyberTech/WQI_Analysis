create database do_an_HTTT;
use do_an_HTTT;

create table alldata(
	id int auto_increment primary key,
	place int not null,
    observation_point nvarchar(255)	not null,
    province nvarchar(255) not null,
    district nvarchar(255) not null,
    coordinate nvarchar(255) not null,
    date date not null,
    temperature decimal(12,4) not null,
    pH decimal(12,4) not null,
    DO decimal(12,4) not null,
    conductivity decimal(12,4) not null,
    alkalinity decimal(12,4) not null,
    no2 decimal(12,4) not null,
    nh4 decimal(12,4) not null,
    po4 decimal(12,4) not null,
    h2s decimal(12,4) not null,
    tss decimal(12,4) not null,
    cod decimal(12,4) not null,
    aeromonas_total decimal(12,4) not null,
    edwardsiella_ictaluri bool not null,
    aeromonas_hydrophila bool not null,
    coliform decimal(12,4) not null,
    wqi smallint not null,
    water_quality smallint not null,
    exceeding_index text  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    recommendation text  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
);

alter table alldata
drop column recommendation;
LOAD DATA INFILE 'C:/ProgramData/MySQL/MySQL Server 9.1/Uploads/data_process.csv'
INTO TABLE alldata
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"' 
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(
    place,
    observation_point,
    province,
    district,
    coordinate,
    @date_str,
    temperature,
    pH,
    DO,
    conductivity,
    alkalinity,
    no2,
    nh4,
    po4,
    h2s,
    tss,
    cod,
    aeromonas_total,
    edwardsiella_ictaluri,
    aeromonas_hydrophila,
    coliform,
    wqi,
    water_quality
)
SET date = STR_TO_DATE(@date_str, '%d/%m/%Y'); 
SHOW VARIABLES LIKE 'secure_file_priv';

create table province(
pid		int			auto_increment primary key,
pname	nvarchar(255)	unique
);

insert into province(pname)
select distinct province
from alldata;

create table district(
w_id	int			auto_increment primary key,
dname   nvarchar(255)	not null,
pid		int			not null,
constraint	fk_w_to_p	foreign key(pid) references province(pid)
);

INSERT INTO district (dname, pid)
SELECT DISTINCT a.district, p.pid
FROM alldata a
JOIN province p ON a.province = p.pname;
drop table observation;
drop table observe_place;
create table observe_place(
	opid int auto_increment primary key,
    opname nvarchar(255) not null,
    placenum int not null,
    coordinate nvarchar(100),
    wid int not null,
    constraint fk_op_to_w foreign key(wid) references district(w_id)
);

ALTER TABLE observe_place
ADD CONSTRAINT unique_op_place_coord UNIQUE(opname, placenum, coordinate);

INSERT INTO observe_place (opname, placenum, coordinate, wid)
SELECT DISTINCT a.observation_point, a.place, a.coordinate, d.w_id
FROM alldata a
JOIN district d ON a.district = d.dname
ON DUPLICATE KEY UPDATE wid = VALUES(wid);

create table observation(
	oid int auto_increment primary key,
    date date not null,
    temperature decimal(12,4) not null,
    pH decimal(12,4) not null,
    DO decimal(12,4) not null,
    conductivity decimal(12,4) not null,
    alkalinity decimal(12,4) not null,
    no2 decimal(12,4) not null,
    nh4 decimal(12,4) not null,
    po4 decimal(12,4) not null,
    h2s decimal(12,4) not null,
    tss decimal(12,4) not null,
    cod decimal(12,4) not null,
    aeromonas_total decimal(12,4) not null,
    edwardsiella_ictaluri bool not null,
    aeromonas_hydrophila bool not null,
    coliform decimal(12,4) not null,
    wqi smallint not null,
    water_quality smallint not null,
    opid int not null,
    constraint fk_o_to_op foreign key(opid) references observe_place(opid)
);

INSERT INTO observation (date, temperature,pH,DO,conductivity,alkalinity,no2,nh4,po4,h2s,tss,cod,aeromonas_total,edwardsiella_ictaluri,aeromonas_hydrophila,coliform,wqi,water_quality,opid)
SELECT distinct a.date,a.temperature,a.pH,a.DO,a.conductivity,a.alkalinity,a.no2,a.nh4,a.po4,a.h2s,a.tss,a.cod,a.aeromonas_total,a.edwardsiella_ictaluri,a.aeromonas_hydrophila,a.coliform,a.wqi,a.water_quality, op.opid
FROM alldata a
JOIN observe_place op ON a.observation_point = op.opname and a.place = op.placenum and a.coordinate = op.coordinate;

select * from observation limit 57300;

SELECT opname, placenum, coordinate, COUNT(*) as c
FROM observe_place
GROUP BY opname, placenum, coordinate
HAVING c > 1;


select *from province;

select*from district;

SELECT COUNT(*) FROM alldata;

SELECT COUNT(*) FROM observation;




















