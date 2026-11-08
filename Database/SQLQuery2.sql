insert into tMainCategories ([MainCategoryName]) values 
('Push Workouts'),
('Pull Workouts'),
('Leg Workouts'),
('Arm Workouts'),
('Core Workouts')
go
insert into tSubCategories ([SubCategoryName], [MainCategoryID]) values 
('Chest',1),('Shoulder',1),('Triceps',1),
('Lats',2),('Rhomboids',2),('Biceps',2),
('Quadriceps',3),('Hamstrings',3),('Calves',3),
('Biceps',4),('Triceps',4),('Forearm',4),
('Abdominals',5),('Lower Back',5)
