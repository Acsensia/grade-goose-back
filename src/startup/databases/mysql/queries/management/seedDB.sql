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

--Populating tasks
INSERT INTO `tasks`
    (task_id, name, instructions, time_due, can_be_handed_in_past_due)
VALUES
    (0, "Prepare project brief", "Draft a one-page project brief summarizing objectives, scope, timeline, and stakeholders.", "2026-06-10 09:00:00", 0),
    (1, "Team kickoff", "Organize and run a 60-minute kickoff meeting; share agenda and notes afterward.", "2026-06-14 10:30:00", 0),
    (2, "Research competitors", "Collect and summarize competitor features and pricing in a 2-page report.", "2026-06-18 14:00:00", 0),
    (3, "Design wireframes", "Create low-fidelity wireframes for the main user flows and export as PNG.", "2026-06-22 16:00:00", 0),
    (4, "Write user stories", "Write 15 user stories with acceptance criteria for sprint planning.", "2026-06-26 11:00:00", 0),
    (5, "Set up analytics", "Install analytics tracking and verify key events fire correctly.", "2026-06-30 09:30:00", 0),
    (6, "Prototype clickable", "Build a clickable prototype of the onboarding flow.", "2026-07-04 15:00:00", 0),
    (7, "Content outline", "Produce an outline for the help center article on account setup.", "2026-07-08 10:00:00", 0),
    (8, "Code review", "Perform code review for the authentication module and leave comments.", "2026-07-12 13:45:00", 0),--set1

    (9, "Database backup", "Run a full database backup and verify checksum.", "2026-07-16 08:00:00",  0),
    (10, "Customer survey", "Draft and send a 5-question customer satisfaction survey.", "2026-07-20 12:00:00", 0),
    (11, "Fix bug #342", "Investigate and resolve the race condition causing login failures.", "2026-07-24 17:00:00", 0),
    (12, "Optimize images", "Compress and replace large images on the marketing site.", "2026-07-28 14:30:00", 0),
    (13, "Create onboarding emails", "Write 3 onboarding email templates with subject lines and CTAs.", "2026-08-01 09:00:00", 0),
    (14, "Performance test", "Run load tests for peak traffic scenarios and document results.", "2026-08-05 18:00:00", 0),
    (15, "Update roadmap", "Revise product roadmap for next two quarters and share with stakeholders.", "2026-08-09 11:30:00", 0),
    (16, "Legal review", "Submit terms of service changes for legal team review.", "2026-08-13 10:00:00", 0),
    (17, "SEO audit", "Perform an SEO audit and list top 10 improvement opportunities.", "2026-08-17 15:15:00", 0),--set2

    (18, "Integrate payment gateway", "Implement and test payment gateway sandbox integration.", "2026-08-21 09:45:00", 0),
    (19, "Prepare demo", "Create a 10-minute product demo and practice delivery.", "2026-08-25 14:00:00", 0),
    (20, "Update FAQ", "Add five new FAQ entries addressing common signup issues.", "2026-08-29 10:00:00", 0),
    (21, "Mobile UI polish", "Refine mobile UI spacing and typography for key screens.", "2026-09-02 16:30:00", 0),
    (22, "Set up CI/CD", "Configure CI/CD pipeline to run tests and deploy to staging.", "2026-09-06 09:00:00", 0),
    (23, "Translate UI", "Translate main UI strings to Spanish and French.", "2026-09-10 13:00:00", 0),
    (24, "Accessibility check", "Run accessibility audit and fix critical WCAG failures.", "2026-09-14 11:00:00", 0),
    (25, "Prepare press release", "Draft press release for upcoming feature launch.", "2026-09-18 10:30:00", 0),
    (26, "Onboard new hire", "Complete orientation checklist and assign first-week tasks.", "2026-09-22 09:00:00", 0),--set3

    (27, "Refactor module", "Refactor legacy billing module for improved testability.", "2026-09-26 15:00:00", 0),
    (28, "Create onboarding video", "Record and edit a 3-minute onboarding video.", "2026-09-30 14:45:00", 0),
    (29, "Fix UI bug #207", "Resolve layout glitch on Safari for the settings page.", "2026-10-04 12:00:00", 0),
    (30, "Audit security", "Run dependency vulnerability scan and remediate critical items.", "2026-10-08 09:30:00", 0),
    (31, "Design social post", "Design three social media images for the campaign.", "2026-10-12 16:00:00", 0),
    (32, "Update marketing copy", "Rewrite homepage headlines to improve clarity and conversion.", "2026-10-16 11:15:00", 0),
    (33, "Customer onboarding checklist", "Create a step-by-step onboarding checklist for customer success.", "2026-10-20 10:00:00", 0),
    (34, "Prepare investor deck", "Update slides with latest metrics and milestones.", "2026-10-24 13:00:00", 0),
    (35, "A/B test setup", "Implement A/B test for headline variations and configure tracking.", "2026-10-28 09:00:00", 0),--set4

    (36, "Migrate CDN", "Migrate static assets to new CDN and validate caching headers.", "2026-11-01 17:00:00", 0),
    (37, "Organize files", "Clean up shared drive folders and enforce naming conventions.", "2026-11-05 10:30:00", 0),
    (38, "Weekly sprint plan", "Create sprint backlog and estimate tasks for two-week sprint.", "2026-11-09 08:30:00", 0),
    (39, "Update SDK", "Publish SDK update and write release notes.", "2026-11-13 15:45:00", 0),
    (40, "Host webinar", "Plan webinar agenda, speakers, and registration page.", "2026-11-17 12:00:00", 0),
    (41, "Conduct interviews", "Interview three candidates and score using rubric.", "2026-11-21 09:00:00", 0),
    (42, "Refine KPIs", "Define OKRs for next quarter with measurable targets.", "2026-11-25 14:00:00", 0),
    (43, "Prepare tax docs", "Gather receipts and prepare documents for accounting.", "2026-11-29 10:00:00", 0),
    (44, "Holiday campaign", "Plan holiday email campaign calendar and creative assets.", "2026-12-03 11:30:00", 0),--set5

    (45, "Cleanup tech debt", "Identify top five tech-debt items and schedule fixes.", "2026-12-07 16:00:00", 0),
    (46, "Finalize roadmap", "Lock roadmap features and communicate scope to teams.", "2026-12-11 09:15:00", 0),
    (47, "Year-end retrospective", "Facilitate retrospective and document action items.", "2026-12-15 13:00:00", 0),
    (48, "Plan Q1 hires", "Create hiring plan and job descriptions for Q1 roles.", "2026-12-19 10:00:00", 0),
    (49, "Audit billing", "Review invoices and resolve any discrepancies.", "2026-12-23 09:00:00", 0),
    (50, "New year kickoff", "Prepare agenda for New Year strategy meeting.", "2026-12-27 15:00:00", 0),
    (51, "Update privacy policy", "Draft updates reflecting recent product changes.", "2026-12-31 11:00:00", 0),
    (52, "Database migration", "Plan and dry-run migration to new schema.", "2027-01-04 08:00:00", 0),
    (53, "Sales enablement", "Create one-pager sales collateral and demo script.", "2027-01-08 14:00:00", 0),--set6

    (54, "Implement caching", "Add server-side caching for product listing endpoints.", "2027-01-12 10:30:00", 0),
    (55, "Customer success call", "Schedule and run quarterly review calls with top clients.", "2027-01-16 09:00:00", 0),
    (56, "Design icons", "Design a set of 20 UI icons and export SVGs.", "2027-01-20 16:00:00", 0),
    (57, "Content calendar", "Build editorial calendar for next three months.", "2027-01-24 11:45:00", 0),
    (58, "Refresh onboarding flow", "Shorten onboarding to three steps and track conversions.", "2027-01-28 13:00:00", 0),
    (59, "Test backups", "Restore a backup to staging to validate integrity.", "2027-02-01 09:30:00", 0),
    (60, "Competitor pricing analysis", "Compare pricing tiers and produce recommendation.", "2027-02-05 14:00:00", 0),
    (61, "Legal compliance check", "Confirm product compliance with new regulations.", "2027-02-09 10:00:00", 0),
    (62, "Optimize search", "Improve search relevance and test with sample queries.", "2027-02-13 15:30:00", 0),--set7

    (63, "Employee training", "Host a training session on new customer support tools.", "2027-02-17 09:00:00", 0),
    (64, "Refine onboarding emails", "A/B test subject lines and CTAs for onboarding sequence.", "2027-02-21 12:00:00", 0),
    (65, "Scale database", "Provision read replicas and monitor replication lag.", "2027-02-25 16:00:00", 0),
    (66, "Prepare case study", "Write a 2-page customer case study with metrics.", "2027-03-01 11:00:00", 0),
    (67, "Design landing page", "Design and hand off landing page to dev for implementation.", "2027-03-05 10:30:00", 0),
    (68, "Implement feature flag", "Add feature flagging and rollout plan for new feature.", "2027-03-09 09:00:00", 0),
    (69, "Run usability tests", "Recruit 5 users and run moderated usability sessions.", "2027-03-13 14:00:00", 0),
    (70, "Update onboarding checklist", "Add new steps based on recent product changes.", "2027-03-17 08:30:00", 0),
    (71, "Optimize checkout", "Reduce checkout friction and measure conversion uplift.", "2027-03-21 13:45:00", 0),--set8

    (72, "Set up monitoring", "Configure alerts for error rates and latency spikes.", "2027-03-25 17:00:00", 0),
    (73, "Prepare mid-year review", "Collect performance data and write review summaries.", "2027-03-29 10:00:00", 0),
    (74, "Launch beta", "Open beta to 100 users and collect feedback.", "2027-04-02 09:00:00", 0),
    (75, "Customer feedback analysis", "Aggregate and summarize feedback into themes.", "2027-04-06 15:30:00", 0),
    (76, "Polish onboarding copy", "Refine microcopy across onboarding screens for clarity.", "2027-04-10 11:00:00", 0),
    (77, "Enhance logging", "Improve structured logging and retention policies.", "2027-04-14 10:00:00", 0),
    (78, "Plan user meetup", "Organize logistics for a local user meetup event.", "2027-04-18 13:00:00", 0),
    (79, "Refactor search service", "Split monolith search into microservice and test.", "2027-04-22 09:30:00", 0),
    (80, "Create API docs", "Write developer-facing API documentation and examples.", "2027-04-26 14:00:00", 0),--set9

    (81, "Universal task 1", "This is the description of a universal task number 1. Since I could not think of anything more creative, you will have to look at this description while viewing this and every other created universal task. Sorry.", "2026-06-11 01:00:00", 0),
    (82, "Universal task 2", "This is the description of a universal task number 2. Since I could not think of anything more creative, you will have to look at this description while viewing this and every other created universal task. Sorry.", "2026-06-12 02:00:00", 0),
    (83, "Universal task 3", "This is the description of a universal task number 3. Since I could not think of anything more creative, you will have to look at this description while viewing this and every other created universal task. Sorry.", "2026-06-13 03:00:00", 0),
    (84, "Universal task 4", "This is the description of a universal task number 4. Since I could not think of anything more creative, you will have to look at this description while viewing this and every other created universal task. Sorry.", "2026-06-14 04:00:00", 0),
    (85, "Universal task 5", "This is the description of a universal task number 5. Since I could not think of anything more creative, you will have to look at this description while viewing this and every other created universal task. Sorry.", "2026-06-15 05:00:00", 0),
    (86, "Universal task 6", "This is the description of a universal task number 6. Since I could not think of anything more creative, you will have to look at this description while viewing this and every other created universal task. Sorry.", "2026-06-16 06:00:00", 0),
    (87, "Universal task 7", "This is the description of a universal task number 7. Since I could not think of anything more creative, you will have to look at this description while viewing this and every other created universal task. Sorry.", "2026-06-17 07:00:00", 0),
    (88, "Universal task 8", "This is the description of a universal task number 8. Since I could not think of anything more creative, you will have to look at this description while viewing this and every other created universal task. Sorry.", "2026-06-18 08:00:00", 0),
    (89, "Universal task 9", "This is the description of a universal task number 9. Since I could not think of anything more creative, you will have to look at this description while viewing this and every other created universal task. Sorry.", "2026-06-19 09:00:00", 0),--set10(universal tasks)