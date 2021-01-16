BEGIN;
INSERT INTO users (user_name, full_name, nickname, password)
VALUES (
		'nagleg',
		'Grey Nagle',
		null,
		'$2a$12$lHK6LVpc15/ZROZcKU00QeiD.RyYq5dVlV/9m4kKYbGibkRc5l4Ne'
	),
	(
		'j.C01l',
		'Jennifer Collins',
		'J Col',
		'$2a$12$VQ5HgWm34QQK2rJyLc0lmu59cy2jcZiV6U1.bE8rBBnC9VxDf/YQO'
	),
	(
		'naglegrey',
		'Grey Nagle',
		'Nagz',
		'$2a$12$yaRLSYgfCMr.e57VjWyjDuWypHh79jR0szDEonWInK4WFgjS3VI6K'
	);
COMMIT;