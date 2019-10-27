-- table setups

create table if not exists users
(
	id serial not null
		constraint users_pk
			primary key,
	name varchar(256)
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
	createdby integer
		constraint bills_users_id_fk
			references users
);

alter table bills owner to postgres;

create unique index if not exists bills_id_uindex
	on bills (id);


-- sample data

insert into users (name)
values ('Anthony');

insert into bills (name, description, amount, currency, createdby)
values ('Test bill', 'Test description', 100, 'USD', 1);
