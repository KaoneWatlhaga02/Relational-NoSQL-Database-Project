DROP TABLE IF EXISTS attempt CASCADE;
DROP TABLE IF EXISTS progress CASCADE;
DROP TABLE IF EXISTS enrollment CASCADE;
DROP TABLE IF EXISTS review CASCADE;
DROP TABLE IF EXISTS notification CASCADE;
DROP TABLE IF EXISTS quiz CASCADE;
DROP TABLE IF EXISTS lesson CASCADE;
DROP TABLE IF EXISTS module CASCADE;
DROP TABLE IF EXISTS course CASCADE;
DROP TABLE IF EXISTS student CASCADE;
DROP TABLE IF EXISTS instructor CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;
DROP TYPE IF EXISTS notification_status CASCADE;
DROP TYPE IF EXISTS lesson_content CASCADE;
DROP TYPE IF EXISTS quiz_question CASCADE;

DROP TABLE IF EXISTS audit_log CASCADE;
DROP PROCEDURE IF EXISTS enroll_student_with_validation(INTEGER, INTEGER);
DROP FUNCTION IF EXISTS get_student_analytics(INTEGER);
DROP FUNCTION IF EXISTS audit_data_changes();

DROP TYPE IF EXISTS notification_status CASCADE;
DROP TYPE IF EXISTS lesson_content CASCADE;
DROP TYPE IF EXISTS quiz_question CASCADE;

DROP TYPE IF EXISTS contact_info CASCADE;
DROP TYPE IF EXISTS address_type CASCADE;
DROP TYPE IF EXISTS temporal_grade CASCADE;

--Custom types
CREATE TYPE notification_status AS ENUM ('sent', 'read', 'archived');
CREATE TYPE lesson_content AS (
    content_type VARCHAR(20),
    content_data TEXT,
    duration INTERVAL
);
CREATE TYPE quiz_question AS (
    question_id INTEGER,
    question_text TEXT,
    options TEXT[],
    correct_answer INTEGER,
    points INTEGER
);

CREATE TYPE address_type AS (
    street VARCHAR(100),
    city VARCHAR(50),
    state VARCHAR(30),
    postal_code VARCHAR(20),
    country VARCHAR(50)
);

CREATE TYPE contact_info AS (
    primary_email VARCHAR(100),
    phone_numbers VARCHAR(15)[],
    address address_type,
    emergency_contact JSONB
);

CREATE TYPE temporal_grade AS (
    quiz_id INTEGER,
    score NUMERIC(5,2),
    attempt_date TIMESTAMP WITH TIME ZONE,
    time_taken INTERVAL,
    valid_from TIMESTAMP WITH TIME ZONE,
    valid_to TIMESTAMP WITH TIME ZONE
);

--Tables with object-relational features
CREATE TABLE "user" (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    contact_info contact_info, -- NEW: Using composite type
    preferences JSONB DEFAULT '{}', -- NEW: Advanced JSON storage
    last_login TIMESTAMP WITH TIME ZONE, -- ENHANCED: With timezone
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- ENHANCED
    -- NEW: Temporal data features
    account_valid_from TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    account_valid_to TIMESTAMP WITH TIME ZONE DEFAULT 'infinity'::timestamp,
    is_active BOOLEAN DEFAULT TRUE
);

-- Instructor inherits from user
CREATE TABLE instructor (
    bio TEXT,
    expertise TEXT[],
    hire_date DATE,
    qualifications JSONB DEFAULT '[]', --JSON STORAGE
    teaching_load INTEGER DEFAULT 0,
    performance_ratings NUMERIC(3,2)[] DEFAULT ARRAY[]::NUMERIC[]
) INHERITS ("user");

-- Student inherits from user
CREATE TABLE student (
    enroll_date DATE DEFAULT CURRENT_DATE,
    completed_courses INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    grade_history temporal_grade[] DEFAULT ARRAY[]::temporal_grade[], -- NEW: Temporal grades
    gpa NUMERIC(3,2) DEFAULT 0.00,
    learning_analytics JSONB DEFAULT '{}', -- NEW: Advanced analytics
    academic_status VARCHAR(20) DEFAULT 'active',
    CHECK (academic_status IN ('active', 'probation', 'suspended', 'graduated'))
) INHERITS ("user");

CREATE TABLE course (
    course_id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, 
    instructor_id INTEGER, 
    categories VARCHAR(50)[],
    price NUMERIC(10,2),
    difficulty_level VARCHAR(20),
    max_students INTEGER,
    current_enrollment INTEGER DEFAULT 0,
    rating NUMERIC(3,2) DEFAULT 0.00,
    prerequisites INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    learning_outcomes TEXT[] DEFAULT ARRAY[]::TEXT[],
    analytics JSONB DEFAULT '{}', 
    enrollment_start DATE,
    enrollment_end DATE,
    is_active BOOLEAN DEFAULT TRUE,
    CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced'))
);

CREATE TABLE module (
    module_id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    course_id INTEGER REFERENCES course(course_id) ON DELETE CASCADE,
    objectives TEXT[],
    estimated_duration INTERVAL,
    display_order INTEGER,
	parent_module_id INTEGER REFERENCES module(module_id)
);

CREATE TABLE lesson (
    lesson_id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    content lesson_content,
    module_id INTEGER REFERENCES module(module_id) ON DELETE CASCADE,
    display_order INTEGER,
    prerequisites INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    resources JSONB DEFAULT '[]',
    interaction_data JSONB DEFAULT '{}',
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (type IN ('video', 'text', 'quiz', 'assignment', 'discussion'))
);

CREATE TABLE quiz (
    quiz_id SERIAL PRIMARY KEY,
    module_id INTEGER REFERENCES module(module_id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    total_marks INTEGER,
    passing_score INTEGER,
    questions quiz_question[],
    time_limit INTERVAL,
    attempts_allowed INTEGER,
	availability_start TIMESTAMP WITH TIME ZONE,
    availability_end TIMESTAMP WITH TIME ZONE,
    analytics JSONB DEFAULT '{}'
);

CREATE TABLE enrollment (
    enrollment_id SERIAL PRIMARY KEY,
    student_id INTEGER, -- References student via inheritance 
    course_id INTEGER REFERENCES course(course_id),
    enrollment_date DATE DEFAULT CURRENT_DATE,
    completion_date DATE,
    current_module INTEGER REFERENCES module(module_id),
    last_accessed TIMESTAMP WITH TIME ZONE, 
    progress_percentage NUMERIC(5,2) DEFAULT 0.00,
    total_time_spent INTERVAL DEFAULT '0 minutes',
    access_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    payment_status VARCHAR(20) DEFAULT 'pending',
    analytics JSONB DEFAULT '{}',
    enrollment_valid_from TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    enrollment_valid_to TIMESTAMP WITH TIME ZONE DEFAULT 'infinity'::timestamp,
    UNIQUE(student_id, course_id),
    CHECK (status IN ('active', 'completed', 'withdrawn', 'suspended')),
    CHECK (payment_status IN ('pending', 'paid', 'refunded', 'waived'))
);

CREATE TABLE progress (
    progress_id SERIAL PRIMARY KEY,
    student_id INTEGER,
    lesson_id INTEGER REFERENCES lesson(lesson_id),
    status VARCHAR(20) DEFAULT 'not_started',
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, 
    time_spent INTERVAL DEFAULT '0 minutes',
    notes TEXT[],
    completion_percentage NUMERIC(5,2) DEFAULT 0.00,
    interaction_count INTEGER DEFAULT 0,
    engagement_score NUMERIC(5,2),
    difficulty_rating INTEGER,
    bookmarks JSONB DEFAULT '[]',
    UNIQUE(student_id, lesson_id),
    CHECK (status IN ('not_started', 'in_progress', 'completed')),
    CHECK (difficulty_rating IS NULL OR (difficulty_rating >= 1 AND difficulty_rating <= 5))
);

CREATE TABLE attempt (
    attempt_id SERIAL PRIMARY KEY,
    quiz_id INTEGER REFERENCES quiz(quiz_id),
    student_id INTEGER,
    score NUMERIC(5,2),
    attempt_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, 
    answers INTEGER[],
    feedback TEXT,
    is_passed BOOLEAN,
    attempt_number INTEGER NOT NULL DEFAULT 1,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP WITH TIME ZONE,
    time_taken INTERVAL GENERATED ALWAYS AS (end_time - start_time) STORED,
    detailed_results JSONB DEFAULT '{}',
    integrity_score NUMERIC(3,2),
    ip_address INET,
    CHECK (attempt_number > 0)
);

CREATE TABLE review (
    review_id SERIAL PRIMARY KEY,
    student_id INTEGER,
    course_id INTEGER REFERENCES course(course_id),
    rating INTEGER NOT NULL,
    comment TEXT,
    review_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, 
    CHECK (rating BETWEEN 1 AND 5),
    UNIQUE(student_id, course_id),
    content_rating INTEGER,
    instructor_rating INTEGER,
    difficulty_rating INTEGER,
    would_recommend BOOLEAN,
    helpful_votes INTEGER DEFAULT 0,
    verified_purchase BOOLEAN DEFAULT FALSE,
    CHECK (content_rating IS NULL OR content_rating BETWEEN 1 AND 5),
    CHECK (instructor_rating IS NULL OR instructor_rating BETWEEN 1 AND 5),
    CHECK (difficulty_rating IS NULL OR difficulty_rating BETWEEN 1 AND 5)
);


CREATE TABLE notification (
    notification_id SERIAL PRIMARY KEY,
    recipients INTEGER[] NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status notification_status DEFAULT 'sent',
    metadata JSONB,
    notification_type VARCHAR(50) DEFAULT 'general',
    priority VARCHAR(20) DEFAULT 'normal',
    expires_at TIMESTAMP WITH TIME ZONE,
    delivery_channels VARCHAR(20)[] DEFAULT ARRAY['in_app'],
    CHECK (priority IN ('low', 'normal', 'high', 'urgent'))
);

CREATE TABLE audit_log (
    audit_id SERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    operation VARCHAR(10) NOT NULL,
    user_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE'))
);


--CREATING INDEXES
CREATE INDEX idx_course_instructor ON course(instructor_id);
CREATE INDEX idx_module_course ON module(course_id);
CREATE INDEX idx_lesson_module ON lesson(module_id);
CREATE INDEX idx_quiz_module ON quiz(module_id);
CREATE INDEX idx_enrollment_student ON enrollment(student_id);
CREATE INDEX idx_enrollment_course ON enrollment(course_id);
CREATE INDEX idx_progress_student ON progress(student_id);
CREATE INDEX idx_progress_lesson ON progress(lesson_id);
CREATE INDEX idx_attempt_student ON attempt(student_id);
CREATE INDEX idx_attempt_quiz ON attempt(quiz_id);
CREATE INDEX idx_review_course ON review(course_id);

--Indexes for Performances
CREATE INDEX idx_user_active ON "user"(is_active);
CREATE INDEX idx_user_temporal ON "user"(account_valid_from, account_valid_to);
CREATE INDEX idx_course_active ON course(is_active);
CREATE INDEX idx_course_enrollment_period ON course(enrollment_start, enrollment_end);
CREATE INDEX idx_enrollment_temporal ON enrollment(enrollment_valid_from, enrollment_valid_to);
CREATE INDEX idx_enrollment_status ON enrollment(status);
CREATE INDEX idx_attempt_temporal ON attempt(start_time, end_time);
CREATE INDEX idx_notification_expires ON notification(expires_at);

--Indexes for JSONB Columns
CREATE INDEX idx_user_preferences ON "user" USING GIN(preferences);
CREATE INDEX idx_course_analytics ON course USING GIN(analytics);
CREATE INDEX idx_enrollment_analytics ON enrollment USING GIN(analytics);
CREATE INDEX idx_attempt_results ON attempt USING GIN(detailed_results);
CREATE INDEX idx_audit_values ON audit_log USING GIN(old_values, new_values);

--Triggers and functions
CREATE OR REPLACE FUNCTION set_attempt_passed_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Update is_passed based on the quiz's passing_score
    NEW.is_passed := NEW.score >= (SELECT passing_score FROM quiz WHERE quiz_id = NEW.quiz_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trg_set_attempt_passed_status
BEFORE INSERT OR UPDATE ON attempt
FOR EACH ROW EXECUTE FUNCTION set_attempt_passed_status();

CREATE OR REPLACE FUNCTION update_course_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE course
    SET rating = (
        SELECT AVG(rating) 
        FROM review 
        WHERE course_id = NEW.course_id
    )
    WHERE course_id = NEW.course_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_course_rating
AFTER INSERT OR UPDATE OR DELETE ON review
FOR EACH ROW EXECUTE FUNCTION update_course_rating();

CREATE OR REPLACE FUNCTION check_enrollment_before_review()
RETURNS TRIGGER AS $$
DECLARE
    v_enrollment_exists BOOLEAN;
BEGIN
    -- Check enrollment using the same ID types as your tables
    SELECT EXISTS (
        SELECT 1 FROM enrollment 
        WHERE student_id = NEW.student_id 
        AND course_id = NEW.course_id
    ) INTO v_enrollment_exists;
    
    IF NOT v_enrollment_exists THEN
        RAISE EXCEPTION 'Student must be enrolled in the course to submit a review';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_enrollment_before_review
BEFORE INSERT ON review
FOR EACH ROW EXECUTE FUNCTION check_enrollment_before_review();

CREATE OR REPLACE FUNCTION update_completion_status()
RETURNS TRIGGER AS $$
DECLARE
    total_lessons INTEGER;
    completed_lessons INTEGER;
BEGIN
    -- Get total lessons in course
    SELECT COUNT(*) INTO total_lessons
    FROM lesson l
    JOIN module m ON l.module_id = m.module_id
    WHERE m.course_id = (SELECT course_id FROM enrollment WHERE enrollment_id = NEW.enrollment_id);
    
    -- Get completed lessons for this student in course
    SELECT COUNT(*) INTO completed_lessons
    FROM progress p
    JOIN lesson l ON p.lesson_id = l.lesson_id
    JOIN module m ON l.module_id = m.module_id
    WHERE p.student_id = NEW.student_id 
    AND m.course_id = (SELECT course_id FROM enrollment WHERE enrollment_id = NEW.enrollment_id)
    AND p.status = 'completed';
    
    -- Update completion date if all lessons are completed
    IF completed_lessons >= total_lessons THEN
        UPDATE enrollment
        SET completion_date = CURRENT_DATE
        WHERE enrollment_id = NEW.enrollment_id;
        
        -- Add to student's completed courses array
        UPDATE student
        SET completed_courses = array_append(completed_courses, 
            (SELECT course_id FROM enrollment WHERE enrollment_id = NEW.enrollment_id))
        WHERE student_id = NEW.student_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_completion_status
AFTER INSERT OR UPDATE ON progress
FOR EACH ROW EXECUTE FUNCTION update_completion_status();

CREATE OR REPLACE FUNCTION notify_instructor_on_review()
RETURNS TRIGGER AS $$
DECLARE
    instructor_id INTEGER;
BEGIN
    SELECT c.instructor_id INTO instructor_id
    FROM course c
    WHERE c.course_id = NEW.course_id;
    
    INSERT INTO notification (recipients, message, metadata)
    VALUES (
        ARRAY[instructor_id],
        'New review received for your course',
        jsonb_build_object(
            'course_id', NEW.course_id,
            'review_id', NEW.review_id,
            'rating', NEW.rating
        )
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_notify_instructor_on_review
AFTER INSERT ON review
FOR EACH ROW EXECUTE FUNCTION notify_instructor_on_review();

DROP TRIGGER IF EXISTS trg_update_completion_status ON progress;
DROP FUNCTION IF EXISTS update_completion_status();

CREATE OR REPLACE FUNCTION update_completion_status()
RETURNS TRIGGER AS $$
DECLARE
    total_lessons INTEGER;
    completed_lessons INTEGER;
    v_course_id INTEGER;
    v_enrollment_id INTEGER;
BEGIN
    -- Get the course_id from the lesson and module
    SELECT m.course_id INTO v_course_id
    FROM module m
    JOIN lesson l ON m.module_id = l.module_id
    WHERE l.lesson_id = NEW.lesson_id;
    
    -- Get the enrollment_id for this student and course
    SELECT enrollment_id INTO v_enrollment_id
    FROM enrollment
    WHERE student_id = NEW.student_id AND course_id = v_course_id;
    
    -- Get total lessons in course
    SELECT COUNT(*) INTO total_lessons
    FROM lesson l
    JOIN module m ON l.module_id = m.module_id
    WHERE m.course_id = v_course_id;
    
    -- Get completed lessons for this student in course
    SELECT COUNT(*) INTO completed_lessons
    FROM progress p
    JOIN lesson l ON p.lesson_id = l.lesson_id
    JOIN module m ON l.module_id = m.module_id
    WHERE p.student_id = NEW.student_id 
    AND m.course_id = v_course_id
    AND p.status = 'completed';
    
    -- Update completion date if all lessons are completed
    IF completed_lessons >= total_lessons AND v_enrollment_id IS NOT NULL THEN
        UPDATE enrollment
        SET completion_date = CURRENT_DATE
        WHERE enrollment_id = v_enrollment_id;
        
        -- Add to student's completed courses array
        UPDATE student
        SET completed_courses = array_append(completed_courses, v_course_id)
        WHERE student_id = NEW.student_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_completion_status
AFTER INSERT OR UPDATE ON progress
FOR EACH ROW EXECUTE FUNCTION update_completion_status();

CREATE OR REPLACE FUNCTION get_student_analytics(p_student_id INTEGER)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
    total_time INTERVAL;
    avg_score NUMERIC(5,2);
    completion_rate NUMERIC(5,2);
    course_count INTEGER;
BEGIN
    -- Calculate total time spent
    SELECT COALESCE(SUM(time_spent), '0'::INTERVAL)
    INTO total_time
    FROM progress
    WHERE student_id = p_student_id;
    
    -- Calculate average score
    SELECT COALESCE(AVG(score), 0)
    INTO avg_score
    FROM attempt
    WHERE student_id = p_student_id;
    
    -- Calculate completion rate
    SELECT 
        CASE WHEN COUNT(*) > 0 
             THEN (COUNT(CASE WHEN status = 'completed' THEN 1 END)::NUMERIC / COUNT(*)::NUMERIC) * 100
             ELSE 0 
        END
    INTO completion_rate
    FROM enrollment
    WHERE student_id = p_student_id;
    
    -- Count enrolled courses
    SELECT COUNT(*)
    INTO course_count
    FROM enrollment
    WHERE student_id = p_student_id;
    
    -- Build result JSON
    result := jsonb_build_object(
        'total_time_spent', EXTRACT(EPOCH FROM total_time),
        'average_score', avg_score,
        'completion_rate', completion_rate,
        'total_courses', course_count,
        'generated_at', CURRENT_TIMESTAMP
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION audit_data_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (table_name, operation, old_values)
        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(OLD));
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (table_name, operation, old_values, new_values)
        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(OLD), row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (table_name, operation, new_values)
        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(NEW));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;


--STORED PROCEDURES
CREATE OR REPLACE PROCEDURE enroll_student_with_validation(
    p_student_id INTEGER,
    p_course_id INTEGER
)
LANGUAGE plpgsql AS $$
DECLARE
    v_max_students INTEGER;
    v_current_enrollment INTEGER;
    v_prerequisites INTEGER[];
    v_completed_courses INTEGER[];
BEGIN
    -- Get course details
    SELECT max_students, current_enrollment, prerequisites
    INTO v_max_students, v_current_enrollment, v_prerequisites
    FROM course
    WHERE course_id = p_course_id AND is_active = TRUE;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Course not found or not active';
    END IF;
    
    -- Check capacity
    IF v_max_students IS NOT NULL AND v_current_enrollment >= v_max_students THEN
        RAISE EXCEPTION 'Course is full';
    END IF;
    
    -- Get student's completed courses
    SELECT completed_courses INTO v_completed_courses
    FROM student WHERE user_id = p_student_id;
    
    -- Check prerequisites
    IF v_prerequisites IS NOT NULL AND array_length(v_prerequisites, 1) > 0 THEN
        IF NOT (v_prerequisites <@ COALESCE(v_completed_courses, ARRAY[]::INTEGER[])) THEN
            RAISE EXCEPTION 'Prerequisites not met';
        END IF;
    END IF;
    
    -- Enroll student
    INSERT INTO enrollment (student_id, course_id)
    VALUES (p_student_id, p_course_id);
    
    -- Update course enrollment count
    UPDATE course 
    SET current_enrollment = current_enrollment + 1
    WHERE course_id = p_course_id;
    
    -- Send notification
    INSERT INTO notification (recipients, message, notification_type)
    VALUES (
        ARRAY[p_student_id], 
        'Successfully enrolled in course', 
        'enrollment_confirmation'
    );
    
    RAISE NOTICE 'Student % enrolled in course %', p_student_id, p_course_id;
END;
$$;

--ENHANCED TRIGGERS
CREATE TRIGGER audit_enrollment_changes
    AFTER INSERT OR UPDATE OR DELETE ON enrollment
    FOR EACH ROW EXECUTE FUNCTION audit_data_changes();

CREATE TRIGGER audit_attempt_changes
    AFTER INSERT OR UPDATE OR DELETE ON attempt
    FOR EACH ROW EXECUTE FUNCTION audit_data_changes();


--Insert Sample data section
--Users
INSERT INTO "user" (name, email, password) VALUES
('Gibson Chengetanai', 'gibson.chengetanai@example.com', 'password123'),
('Keitumetse Gobotsamang', 'keitumetse.gobotsamang@example.com', 'password123'),
('Kaone Watlhaga', 'kaone.watlhaga@example.com', 'password123'),
('Boemo Marumo', 'boemo.marumo@example.com', 'password123'),
('John Smith', 'john.smith@example.com', 'password123'),
('Amantle Gaabatholwe', 'amantle.gaabatholwe@example.com', 'password123');
--Instructors section
INSERT INTO instructor (user_id, name, email, password, bio, expertise) 
SELECT user_id, name, email, password, 
       'Senior software engineer with 10 years of experience', 
       ARRAY['Programming', 'Algorithms']
FROM "user" WHERE name = 'Gibson Chengetanai';

INSERT INTO instructor (user_id, name, email, password, bio, expertise) 
SELECT user_id, name, email, password, 
       'Data science expert and machine learning practitioner', 
       ARRAY['Data Science', 'Machine Learning']
FROM "user" WHERE name = 'Keitumetse Gobotsamang';

INSERT INTO instructor (user_id, name, email, password, bio, expertise) 
SELECT user_id, name, email, password, 
       'Web development specialist with focus on modern frameworks', 
       ARRAY['Web Development', 'JavaScript', 'React']
FROM "user" WHERE name = 'John Smith';


-- Student section
INSERT INTO student (user_id, name, email, password, enroll_date)
SELECT user_id, name, email, password, CURRENT_DATE
FROM "user" WHERE name = 'Kaone Watlhaga';

INSERT INTO student (user_id, name, email, password, enroll_date)
SELECT user_id, name, email, password, CURRENT_DATE
FROM "user" WHERE name = 'Boemo Marumo';

INSERT INTO student (user_id, name, email, password, enroll_date)
SELECT user_id, name, email, password, CURRENT_DATE
FROM "user" WHERE name = 'Amantle Gaabatholwe';


--Courses section
INSERT INTO course (title, description, instructor_id, categories, price, difficulty_level) VALUES
('Introduction to Programming', 'Learn the basics of programming', 
 (SELECT user_id FROM instructor WHERE name = 'Gibson Chengetanai'), 
 ARRAY['Programming', 'Beginner'], 49.99, 'beginner'),
('Advanced Data Analysis', 'Master data analysis techniques', 
 (SELECT user_id FROM instructor WHERE name = 'Keitumetse Gobotsamang'), 
 ARRAY['Data Science', 'Statistics'], 79.99, 'advanced'),
('Modern Web Development', 'Build responsive web applications', 
 (SELECT user_id FROM instructor WHERE name = 'John Smith'), 
 ARRAY['Web Development', 'JavaScript'], 59.99, 'intermediate');

 
--Modules
INSERT INTO module (title, course_id, objectives, estimated_duration) VALUES
('Programming Fundamentals', 
 (SELECT course_id FROM course WHERE title = 'Introduction to Programming'), 
 ARRAY['Understand basic syntax', 'Write simple programs'], '2 weeks'),
('Data Structures', 
 (SELECT course_id FROM course WHERE title = 'Introduction to Programming'), 
 ARRAY['Learn about arrays and lists', 'Understand algorithms'], '3 weeks'),
('Data Cleaning', 
 (SELECT course_id FROM course WHERE title = 'Advanced Data Analysis'), 
 ARRAY['Handle missing data', 'Clean messy datasets'], '1 week'),
('Statistical Analysis', 
 (SELECT course_id FROM course WHERE title = 'Advanced Data Analysis'), 
 ARRAY['Perform hypothesis testing', 'Understand distributions'], '2 weeks'),
('HTML & CSS Basics', 
 (SELECT course_id FROM course WHERE title = 'Modern Web Development'), 
 ARRAY['Create basic web pages', 'Style with CSS'], '2 weeks'),
('JavaScript Fundamentals', 
 (SELECT course_id FROM course WHERE title = 'Modern Web Development'), 
 ARRAY['Understand JS syntax', 'DOM manipulation'], '3 weeks');


 --Lessons
 INSERT INTO lesson (type, content, module_id) VALUES
('video', ROW('video', 'https://example.com/video1', '30 minutes')::lesson_content, 
 (SELECT module_id FROM module WHERE title = 'Programming Fundamentals')),
('text', ROW('text', 'Introduction to variables and data types', '20 minutes')::lesson_content, 
 (SELECT module_id FROM module WHERE title = 'Programming Fundamentals')),
('quiz', ROW('quiz', 'Quiz on programming basics', '15 minutes')::lesson_content, 
 (SELECT module_id FROM module WHERE title = 'Programming Fundamentals')),
('video', ROW('video', 'https://example.com/video2', '45 minutes')::lesson_content, 
 (SELECT module_id FROM module WHERE title = 'Data Structures')),
('text', ROW('text', 'Understanding arrays and linked lists', '30 minutes')::lesson_content, 
 (SELECT module_id FROM module WHERE title = 'Data Structures')),
('video', ROW('video', 'https://example.com/video3', '40 minutes')::lesson_content, 
 (SELECT module_id FROM module WHERE title = 'Data Cleaning')),
('assignment', ROW('assignment', 'Clean this dataset', '2 hours')::lesson_content, 
 (SELECT module_id FROM module WHERE title = 'Data Cleaning')),
('video', ROW('video', 'https://example.com/video4', '50 minutes')::lesson_content, 
 (SELECT module_id FROM module WHERE title = 'Statistical Analysis')),
('quiz', ROW('quiz', 'Statistics quiz', '20 minutes')::lesson_content, 
 (SELECT module_id FROM module WHERE title = 'Statistical Analysis')),
('video', ROW('video', 'https://example.com/video5', '35 minutes')::lesson_content, 
 (SELECT module_id FROM module WHERE title = 'HTML & CSS Basics')),
('text', ROW('text', 'HTML document structure', '25 minutes')::lesson_content, 
 (SELECT module_id FROM module WHERE title = 'HTML & CSS Basics')),
('video', ROW('video', 'https://example.com/video6', '40 minutes')::lesson_content, 
 (SELECT module_id FROM module WHERE title = 'JavaScript Fundamentals')),
('assignment', ROW('assignment', 'Build a simple interactive page', '3 hours')::lesson_content, 
 (SELECT module_id FROM module WHERE title = 'JavaScript Fundamentals'));


--Quizzes
INSERT INTO quiz (module_id, title, total_marks, passing_score, questions, time_limit, attempts_allowed) VALUES
((SELECT module_id FROM module WHERE title = 'Programming Fundamentals'), 
 'Programming Basics Quiz', 100, 70, 
 ARRAY[
  ROW(1, 'What is a variable?', ARRAY['A container for storing data', 'A type of loop', 'A function'], 1, 30)::quiz_question,
  ROW(2, 'Which keyword declares a variable?', ARRAY['var', 'function', 'return'], 1, 30)::quiz_question,
  ROW(3, 'What does == compare?', ARRAY['Values', 'Memory locations', 'Data types'], 1, 40)::quiz_question
 ], '30 minutes', 3),
((SELECT module_id FROM module WHERE title = 'Statistical Analysis'), 
 'Statistics Quiz', 100, 75, 
 ARRAY[
  ROW(1, 'What is the mean of [1,2,3,4,5]?', ARRAY['3', '2.5', '4'], 1, 50)::quiz_question,
  ROW(2, 'What does p-value represent?', ARRAY['Probability', 'Variance', 'Mean'], 1, 50)::quiz_question
 ], '20 minutes', 2),
((SELECT module_id FROM module WHERE title = 'HTML & CSS Basics'), 
 'Web Basics Quiz', 100, 65, 
 ARRAY[
  ROW(1, 'What does HTML stand for?', ARRAY['HyperText Markup Language', 'Hyperlinks and Text Markup Language', 'Home Tool Markup Language'], 1, 40)::quiz_question,
  ROW(2, 'Which CSS property changes text color?', ARRAY['color', 'text-color', 'font-color'], 1, 40)::quiz_question,
  ROW(3, 'Which tag creates a paragraph?', ARRAY['<p>', '<para>', '<paragraph>'], 1, 20)::quiz_question
 ], '25 minutes', 2);


 --Enrollments
INSERT INTO enrollment (student_id, course_id) VALUES
((SELECT user_id FROM student WHERE name = 'Kaone Watlhaga'), 
 (SELECT course_id FROM course WHERE title = 'Introduction to Programming')),
((SELECT user_id FROM student WHERE name = 'Kaone Watlhaga'), 
 (SELECT course_id FROM course WHERE title = 'Advanced Data Analysis')),
((SELECT user_id FROM student WHERE name = 'Boemo Marumo'), 
 (SELECT course_id FROM course WHERE title = 'Advanced Data Analysis')),
((SELECT user_id FROM student WHERE name = 'Amantle Gaabatholwe'), 
 (SELECT course_id FROM course WHERE title = 'Modern Web Development')),
((SELECT user_id FROM student WHERE name = 'Amantle Gaabatholwe'), 
 (SELECT course_id FROM course WHERE title = 'Introduction to Programming'));
 
-- Progress
INSERT INTO progress (student_id, lesson_id, status, time_spent) VALUES
((SELECT user_id FROM student WHERE name = 'Kaone Watlhaga'), 
 (SELECT lesson_id FROM lesson l JOIN module m ON l.module_id = m.module_id 
  WHERE m.title = 'Programming Fundamentals' AND l.type = 'video'), 
 'completed', '35 minutes'),
((SELECT user_id FROM student WHERE name = 'Kaone Watlhaga'), 
 (SELECT lesson_id FROM lesson l JOIN module m ON l.module_id = m.module_id 
  WHERE m.title = 'Programming Fundamentals' AND l.type = 'text'), 
 'completed', '25 minutes'),
((SELECT user_id FROM student WHERE name = 'Kaone Watlhaga'), 
 (SELECT lesson_id FROM lesson l JOIN module m ON l.module_id = m.module_id 
  WHERE m.title = 'Programming Fundamentals' AND l.type = 'quiz'), 
 'completed', '20 minutes'),
((SELECT user_id FROM student WHERE name = 'Kaone Watlhaga'), 
 (SELECT lesson_id FROM lesson l JOIN module m ON l.module_id = m.module_id 
  WHERE m.title = 'Data Structures' AND l.type = 'video'), 
 'in_progress', '15 minutes'),
((SELECT user_id FROM student WHERE name = 'Boemo Marumo'), 
 (SELECT lesson_id FROM lesson l JOIN module m ON l.module_id = m.module_id 
  WHERE m.title = 'Data Cleaning' AND l.type = 'video'), 
 'completed', '45 minutes'),
((SELECT user_id FROM student WHERE name = 'Boemo Marumo'), 
 (SELECT lesson_id FROM lesson l JOIN module m ON l.module_id = m.module_id 
  WHERE m.title = 'Data Cleaning' AND l.type = 'assignment'), 
 'completed', '2 hours 10 minutes'),
((SELECT user_id FROM student WHERE name = 'Amantle Gaabatholwe'), 
 (SELECT lesson_id FROM lesson l JOIN module m ON l.module_id = m.module_id 
  WHERE m.title = 'HTML & CSS Basics' AND l.type = 'video'), 
 'completed', '40 minutes'),
((SELECT user_id FROM student WHERE name = 'Amantle Gaabatholwe'), 
 (SELECT lesson_id FROM lesson l JOIN module m ON l.module_id = m.module_id 
  WHERE m.title = 'HTML & CSS Basics' AND l.type = 'text'), 
 'in_progress', '15 minutes'); 

-- Reviews
INSERT INTO review (student_id, course_id, rating, comment) VALUES
((SELECT user_id FROM student WHERE name = 'Kaone Watlhaga'), 
 (SELECT course_id FROM course WHERE title = 'Introduction to Programming'), 
 5, 'Excellent course for beginners!'),
((SELECT user_id FROM student WHERE name = 'Boemo Marumo'), 
 (SELECT course_id FROM course WHERE title = 'Advanced Data Analysis'), 
 4, 'Very informative but some sections were challenging'),
((SELECT user_id FROM student WHERE name = 'Amantle Gaabatholwe'), 
 (SELECT course_id FROM course WHERE title = 'Modern Web Development'), 
 5, 'Great content and well-structured lessons!');

INSERT INTO notification (recipients, message, status) VALUES
(ARRAY[(SELECT DISTINCT user_id FROM "user" WHERE name = 'Gibson Chengetanai')], 
 'Welcome to our platform!', 'read'),
(ARRAY[
  (SELECT DISTINCT user_id FROM "user" WHERE name = 'Gibson Chengetanai'),
  (SELECT DISTINCT user_id FROM "user" WHERE name = 'Keitumetse Gobotsamang'),
  (SELECT DISTINCT user_id FROM "user" WHERE name = 'John Smith')
 ], 'System maintenance scheduled for tonight', 'sent'),
(ARRAY[(SELECT DISTINCT user_id FROM "user" WHERE name = 'Amantle Gaabatholwe')], 
 'Your enrollment in Modern Web Development was successful', 'sent');

 
UPDATE "user" SET 
    contact_info = ROW(
        email,
        ARRAY['+1234567890', '+0987654321'],
        ROW('123 Main St', 'City', 'State', '12345', 'Country')::address_type,
        '{"name": "Emergency Contact", "phone": "+1111111111"}'::JSONB
    )::contact_info,
    preferences = '{"theme": "dark", "language": "en", "notifications": true}'::JSONB
WHERE user_id <= 6;

--Update course with new fields
UPDATE course SET 
    max_students = 100,
    prerequisites = CASE 
        WHEN title = 'Advanced Data Analysis' THEN ARRAY[1]
        WHEN title = 'Modern Web Development' THEN ARRAY[1]
        ELSE ARRAY[]::INTEGER[]
    END,
    learning_outcomes = ARRAY['Outcome 1', 'Outcome 2', 'Outcome 3'],
    analytics = CASE
        WHEN title = 'Introduction to Programming' THEN '{"views": 150, "rating_count": 25}'::JSONB
        WHEN title = 'Advanced Data Analysis' THEN '{"views": 120, "rating_count": 18}'::JSONB
        WHEN title = 'Modern Web Development' THEN '{"views": 80, "rating_count": 10}'::JSONB
    END,
    enrollment_start = CURRENT_DATE - INTERVAL '30 days',
    enrollment_end = CURRENT_DATE + INTERVAL '60 days';

--TESTING STORED PROCEDURES
--Test for enroll student with validation
DO $$
DECLARE
    v_student_id INTEGER;
    v_course_id INTEGER;
BEGIN
    SELECT user_id INTO v_student_id 
    FROM student WHERE name = 'Kaone Watlhaga' LIMIT 1;
    
    SELECT course_id INTO v_course_id 
    FROM course WHERE title = 'Introduction to Programming' LIMIT 1;
    
    DELETE FROM enrollment 
    WHERE student_id = v_student_id AND course_id = v_course_id;
    
    CALL enroll_student_with_validation(v_student_id, v_course_id);
    
    IF EXISTS (SELECT 1 FROM enrollment 
              WHERE student_id = v_student_id 
              AND course_id = v_course_id) THEN
        RAISE NOTICE 'Test passed: Student % successfully enrolled in course %', 
            v_student_id, v_course_id;
    ELSE
        RAISE EXCEPTION 'Test failed: Enrollment not created';
    END IF;
END;
$$;

--Test for get_students_analytics with validation
DO $$
DECLARE
    v_student_id INTEGER;
    v_analytics JSONB;
BEGIN
    SELECT user_id INTO v_student_id 
    FROM student WHERE name = 'Kaone Watlhaga' LIMIT 1;
    
    v_analytics := get_student_analytics(v_student_id);
    
    IF v_analytics IS NULL THEN
        RAISE EXCEPTION 'Test failed: Analytics function returned NULL';
    ELSIF NOT (v_analytics ? 'total_time_spent' AND v_analytics ? 'average_score') THEN
        RAISE EXCEPTION 'Test failed: Missing expected analytics fields';
    ELSE
        RAISE NOTICE 'Test passed: Analytics for student %: %', 
            v_student_id, v_analytics;
    END IF;
END;
$$;

--Test for audit log
DO $$
DECLARE
    v_log_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_log_count FROM audit_log;
    
    INSERT INTO audit_log (table_name, operation, new_values) 
    VALUES (
        'enrollment', 
        'INSERT', 
        jsonb_build_object(
            'student_id', (SELECT user_id FROM student WHERE name = 'Kaone Watlhaga' LIMIT 1),
            'course_id', (SELECT course_id FROM course WHERE title = 'Introduction to Programming' LIMIT 1),
            'enrollment_date', CURRENT_DATE
        )
    );
    
    IF (SELECT COUNT(*) FROM audit_log) = v_log_count + 1 THEN
        RAISE NOTICE 'Test passed: Audit log entry successfully created';
    ELSE
        RAISE EXCEPTION 'Test failed: Audit log entry not created';
    END IF;
END;
$$;


--VERIFICATION QUERIES

-- Test inheritance
SELECT 'Testing inheritance:' as test_type;
SELECT user_id, name, email, bio, expertise FROM instructor;
SELECT user_id, name, email, enroll_date, completed_courses FROM student;

-- Test arrays and composite types
SELECT 'Testing arrays and composite types:' as test_type;
SELECT name, (contact_info).phone_numbers, (contact_info).address FROM "user" WHERE contact_info IS NOT NULL;

-- Test JSONB and analytics
SELECT 'Testing JSONB features:' as test_type;
SELECT title, analytics, preferences FROM course c JOIN "user" u ON c.instructor_id = u.user_id WHERE c.analytics IS NOT NULL;

-- Test temporal data
SELECT 'Testing temporal features:' as test_type;
SELECT enrollment_id, student_id, course_id, enrollment_valid_from, enrollment_valid_to 
FROM enrollment WHERE enrollment_valid_to > CURRENT_TIMESTAMP;

-- Test stored procedure and functions
SELECT 'Testing stored procedures and functions:' as test_type;
SELECT get_student_analytics(user_id) FROM student LIMIT 1;

-- Test audit log
SELECT 'Testing audit log:' as test_type;
SELECT * FROM audit_log ORDER BY timestamp DESC LIMIT 5;


----------
--TASK 5--
----------
--PART A
-- Query: Find course completion analytics with different join types
SELECT 
    c.title AS course_title,
    s.name AS student_name,
    COUNT(p.lesson_id) FILTER (WHERE p.status = 'completed') AS completed_lessons,
    COUNT(l.lesson_id) AS total_lessons,
    ROUND(100.0 * COUNT(p.lesson_id) FILTER (WHERE p.status = 'completed') / 
          COUNT(l.lesson_id), 2) AS completion_percentage,
    e.enrollment_date,
    e.completion_date
FROM 
    course c
INNER JOIN 
    module m ON c.course_id = m.course_id
LEFT JOIN 
    lesson l ON m.module_id = l.module_id
RIGHT JOIN 
    enrollment e ON c.course_id = e.course_id
LEFT JOIN 
    progress p ON e.student_id = p.student_id AND l.lesson_id = p.lesson_id
LEFT JOIN 
    student s ON e.student_id = s.user_id
WHERE 
    c.is_active = TRUE
    AND e.status = 'active'
GROUP BY 
    c.title, s.name, e.enrollment_date, e.completion_date
HAVING 
    COUNT(l.lesson_id) > 0
ORDER BY 
    completion_percentage DESC;

--TASK B
-- Combines active student and instructor profiles into one unified user list.
SELECT 
    u.user_id,
    u.name,
    u.email,
    'student' AS role,
    s.enroll_date AS join_date,
    (u.contact_info).primary_email AS contact_email
FROM 
    "user" u
JOIN 
    student s ON u.user_id = s.user_id
WHERE 
    u.is_active = TRUE

UNION

SELECT 
    u.user_id,
    u.name,
    u.email,
    'instructor' AS role,
    i.hire_date AS join_date,
    (u.contact_info).primary_email AS contact_email
FROM 
    "user" u
JOIN 
    instructor i ON u.user_id = i.user_id
WHERE 
    u.is_active = TRUE
ORDER BY 
    name;



--TASK C
-- Lists each student with the number and titles of courses they have completed.
SELECT 
    s.name AS student_name,
    COALESCE(array_length(s.completed_courses, 1), 0) AS num_completed_courses,
    COALESCE(array_agg(c.title), ARRAY[]::TEXT[]) AS completed_course_titles
FROM 
    student s
LEFT JOIN 
    course c ON c.course_id = ANY(s.completed_courses)
GROUP BY 
    s.user_id, s.name, s.completed_courses
ORDER BY 
    student_name;


--TASK D
-- Displays enrollment duration and status for students with enrollments in the last 6 months.
SELECT 
    s.name AS student_name,
    c.title AS course_title,
    e.enrollment_date,
    e.completion_date,
    COALESCE(e.completion_date, CURRENT_DATE) - e.enrollment_date AS enrollment_duration,
    e.enrollment_valid_from,
    e.enrollment_valid_to,
    CASE 
        WHEN e.enrollment_valid_to = 'infinity'::timestamp THEN 'Current'
        ELSE 'Expired'
    END AS enrollment_status
FROM 
    student s
JOIN 
    enrollment e ON s.user_id = e.student_id
JOIN 
    course c ON e.course_id = c.course_id
WHERE 
    e.enrollment_valid_from <= CURRENT_TIMESTAMP
    AND e.enrollment_valid_to > CURRENT_TIMESTAMP
    AND (e.enrollment_date, COALESCE(e.completion_date, CURRENT_DATE)) 
        OVERLAPS (CURRENT_DATE - INTERVAL '6 months', CURRENT_DATE)
ORDER BY 
    enrollment_duration DESC;


 --TASK E
 --Analyzes progress data including time spent and completion rate, with and without ROLLUP.
SELECT
    c.title AS course_title,
    m.title AS module_title,
    p.status AS progress_status,
    COUNT(*) AS lesson_count,
    SUM(EXTRACT(EPOCH FROM p.time_spent)/60) AS total_minutes_spent,
    AVG(p.completion_percentage) AS avg_completion_percentage
FROM
    progress p
JOIN
    lesson l ON p.lesson_id = l.lesson_id
JOIN
    module m ON l.module_id = m.module_id
JOIN
    course c ON m.course_id = c.course_id
GROUP BY
    c.title,
    m.title,
    p.status -- Change CUBE to a regular GROUP BY
HAVING
    COUNT(*) > 0
ORDER BY
    c.title,
    m.title,
    p.status;

UPDATE progress SET completion_percentage = 100 WHERE status = 'completed';
UPDATE progress SET completion_percentage = 50 WHERE status = 'in_progress';

SELECT
    CASE 
        WHEN c.title IS NULL THEN 'All Courses'
        ELSE c.title 
    END AS course_title,
    
    CASE 
        WHEN m.title IS NULL AND c.title IS NOT NULL THEN 'All Modules in Course'
        WHEN m.title IS NULL AND c.title IS NULL THEN ''
        ELSE m.title 
    END AS module_title,
    
    CASE 
        WHEN p.status IS NULL AND m.title IS NOT NULL THEN 'All Progress Statuses'
        WHEN p.status IS NULL AND m.title IS NULL THEN ''
        ELSE p.status 
    END AS progress_status,
    
    COUNT(*) AS lesson_count,
    
    ROUND(SUM(EXTRACT(EPOCH FROM p.time_spent) / 60), 2) AS total_minutes_spent,
    
    ROUND(AVG(p.completion_percentage), 2) AS avg_completion_percentage

FROM progress p
JOIN lesson l ON p.lesson_id = l.lesson_id
JOIN module m ON l.module_id = m.module_id
JOIN course c ON m.course_id = c.course_id

GROUP BY ROLLUP(c.title, m.title, p.status)

ORDER BY 
    c.title NULLS LAST,
    m.title NULLS LAST,
    p.status NULLS LAST;






