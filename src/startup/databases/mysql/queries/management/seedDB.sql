USE `grade_goose_main_db`;

--Setting up a pass variable (should be 1234)
SET @passhash1234 = "$2b$12$cGdEpBP/XRMzrxHPAOCiZ.996nJuoCrPE5Q2d8w6F0o81F/dp5NBi";

--Populating students
INSERT INTO `students`
    (student_id, email, password_hash, first_name, last_name, patronymic_name)
VALUES
    (0, "nikian7781", @passhash1234, "Mykyta", "Novosolov", "Heorgiyevich"),
    (1, "nikian7782", @passhash1234, "Oleg", "Olegovich", "Olegov"),
    (2, "nikian7783", @passhash1234, "Maksim", "Maksimovich", "Maksimov"),
    (3, "nikian7784", @passhash1234, "Olena", "Olenova", "Olenivna"),
    (4, "nikian7785", @passhash1234, "Marina", "Marinovna", "Sergiivna"),
    (5, "nikian7786", @passhash1234, "Petro", "Poroshenko", "Sergiyovich"),
    (6, "nikian7787", @passhash1234, "Stepan", "Stepanovich", "Stepanko"),
    (7, "nikian7788", @passhash1234, "Bohdan", "Bohdanovich", "Bohdanov"),
    (8, "nikian7789", @passhash1234, "Oleksandr", "Oleksandrovich", "Oleksandrov");

--Populating teachers
INSERT INTO `teachers`
    (teacher_id, email, password_hash, first_name, last_name, patronymic_name)
VALUES
    (0, "nikian7781", @passhash1234, "Oleksandr", "Shevchenko", "Petrovych"),
    (1, "nikian7782", @passhash1234, "Olena", "Kovalenko", "Ivanivna"),
    (2, "nikian7783", @passhash1234, "Mykola", "Bondarenko", "Serhiovych"),
    (3, "nikian7784", @passhash1234, "Kateryna", "Tkachenko", "Pavlivna"),
    (4, "nikian7785", @passhash1234, "Andrii", "Horbachenko", "Mykolayovych"),
    (5, "nikian7786", @passhash1234, "Iryna", "Melnyk", "Oleksandrivna"),
    (6, "nikian7787", @passhash1234, "Vasyl", "Khmelytskyi", "Andriivych"),
    (7, "nikian7788", @passhash1234, "Sofiya", "Kravchenko", "Volodymyrivna"),
    (8, "nikian7789", @passhash1234, "Dmytro", "Lysenko", "Yuriiovych");

--Populating student groups
INSERT INTO `student_groups`
    (student_group_id, name, description)
VALUES
    (0, "SDE-22", "A group that supposedly was registered in 2022 with a specific goal of studying the specialty of Software Development and Engineering (SDE)."),
    (1, "CS-22", "Another group that was supposedly registered in 2022, but now with a different goal - namely, that of learning and researching Computer Science (CS) in general.");

--Populating specialties
INSERT INTO `specialties`
    (specialty_id, name, abbreviation, description)
VALUES
    (0, "Software Development and Engineering", "SDE", "A specialty that encompasses everything to do with the development and engineering of computer software."),
    (1, "Computer Science", "CS", "A different specialty that makes its goal the learning and research of computer science in general.");

--Populating subjects
INSERT INTO `subjects`
    (subject_id, name, description)
VALUES
    (0, "Higher mathematics", "A subject that is sometimes incredibly difficult to learn and apply for certain students. Is part of university curriculum for many specialties in varying fields."),
    (1, "Ukrainian", "Another subject that often times haunts students for all their life until they stop interacting with state education. Is forced into practically every academical nook and cranny in order to quell the people's fear of the country imploding on itself once enough people forget the national language."),
    (2, "History of Ukraine", "Yet another subject that is widely studied by practically every student in the country. Is deemed of extreme importance by the government, but usually hated and despised by students for its usual complete lack of use for the specialty that is being studied by the student in question."),
    (3, "Web design", "A subject studied by the prospective developers in universities. An interesting detail about the subject is that it is usually studied several times during several semesters, which often makes the studetns wonder if they are a parth of a university-wide temporal anomaly."),
    (4, "Computer architecture", "Another subject studied by both the more down-to-earth SDE students and the more scientifically-inclined (?) CS students. The usability of the knowledge is.. not as bad as with the forced humanitarian subjects, but the knowledge itself is still quite specific and difficult to use in a wide amount of settings."),
    (5, "Software testing", "An interesting subject that teaches the students to expect things that seem simple to actually have a decent chance of being unnecessarily boring and difficult once one starts learning them as part of a course or a subject in a higher educational institution. Has huge amounts of difficult theoretical information, criteria etc. that is quite frustrating to memorize."),
    (6, "User interface design", "Yet another subject that, just like Software testing, turns something that seems simple into a difficult mess. Also it's not quite like the Higher mathematics, as most of the information provided is not too precise and forces the student to kind of guess if the design that's being developed is good or not."),
    (7, "Python development", "An interesting subject that kind of teaches the students about the 1s and 0s of Python. The students will look back on this subject with warmth in their hearts, as studying it would end up having been much easier than writing a Course project or, God forbid, a diploma."),
    (8, "Database development", "A funky little subject that might look quite simple, but usually ends up as one of the most difficult, frustrating and time-consuming subjects for all the students that, in one way or another, find themselves forced to come in contact with it.");