create database ProgressiveOverload;
go 
use ProgressiveOverload;

create table tUsers
(
	ID int primary key identity(1,1),
	FirstName varchar(200),
	SurName varchar(300),
	BirthDay date,
	BodyWeight float
)

create table tCategories
(
	ID int primary key identity(1,1),
	CategoryName varchar(150)
)

create table tExercises 
(
	ID int primary key identity(1,1),
	CategoryID int foreign key references tCategories(ID),
	ExercisesName varchar(300)
)

create table tWorkouts
(
	ID int primary key identity(1,1),
	UsersID int foreign key references tUsers(ID),
	WorkoutName varchar(100),
	WorkoutDate datetime default getdate()
)

create table tLogs
(
	ID int primary key identity(1,1),
	WorkoutID int foreign key references tWorkouts(ID),
	ExercisesID int foreign key references tExercises(ID),
	SetNo int,
	Weight float,
	RepRangeMin int,
	RepRangeMax int,
	Rep int,
	RIR int,
	Progress varchar (500)	
)

create table tMainCategories
(
	ID int primary key identity(1,1),
	MainCategoryName varchar(300)
)
go
alter table tCategories add MainCategoryID int null foreign key references tMainCategories(ID) 
go
exec sp_rename 'tCategories','tSubCategories'
go
EXEC sp_rename 'tSubCategories.CategoryName', 'SubCategoryName', 'COLUMN';
go
alter table tExercises Drop Constraint FK__tExercise__Categ__3B75D760
go
alter table tExercises add constraint FK_tExercises_tSubCategories foreign key (CategoryID) references tSubCategories(ID);

