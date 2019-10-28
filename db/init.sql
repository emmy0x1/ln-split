-- table setups

create table if not exists users
(
	id serial not null
		constraint users_pk
			primary key,
	name varchar(256),
	"emailAddress" varchar(32),
	"passwordHash" varchar(256),
	salt varchar(256)
);

alter table users owner to postgres;

create unique index if not exists users_id_uindex
	on users (id);

create table if not exists bills
(
	id serial not null
		constraint bills_pk
			primary key,
	name varchar(256),
	description varchar(256),
	amount double precision,
	currency varchar(10),
	"createdBy" integer
		constraint bills_users_id_fk
			references users
);

alter table bills owner to postgres;

create unique index if not exists bills_id_uindex
	on bills (id);


-- sample data

insert into users (name, "emailAddress", "passwordHash", salt)
values ('Anthony', 'anthonyronning@gmail.com', '9c8f0c08c35979f61c58e9293a91401325a04754d2fd0ddd9b12aa0cd89764f6fec3fd7e24e9f83522db009678d73e85f9e720c6ac3024cd2e053596521bba1c', '0040439ad3a0a195');

insert into bills (name, description, amount, currency, "createdBy")
values ('Test bill', 'Test description', 100, 'USD', 1);
