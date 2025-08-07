use FINAL_ADT
switched to db FINAL_ADT
db.createCollection("users");

db.createCollection("courses");
db.createCollection("modules");
db.createCollection("lessons");
db.createCollection("quizzes");
db.createCollection("enrollments");
db.createCollection("progress");
db.createCollection("attempts");
db.createCollection("reviews");
db.createCollection("notifications");
db.createCollection("audit_logs");
{ ok: 1 }
// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ is_active: 1 });
db.users.createIndex({ "account_valid_from": 1, "account_valid_to": 1 });
db.users.createIndex({ preferences: 1 });
db.users.createIndex({ user_type: 1 }); // For type discrimination
db.users.createIndex({ "student.academic_status": 1 }); // Student-specific index
db.users.createIndex({ "instructor.expertise": 1 }); // Instructor-specific index
instructor.expertise_1
db.courses.createIndex({ instructor_id: 1 });
db.courses.createIndex({ is_active: 1 });
db.courses.createIndex({ categories: 1 });
db.courses.createIndex({ "enrollment_start": 1, "enrollment_end": 1 });
db.courses.createIndex({ analytics: 1 });
analytics_1
db.modules.createIndex({ course_id: 1 });
db.modules.createIndex({ parent_module_id: 1 });
parent_module_id_1
db.lessons.createIndex({ module_id: 1 });
db.lessons.createIndex({ type: 1 });
type_1
db.quizzes.createIndex({ module_id: 1 });
module_id_1
db.enrollments.createIndex({ student_id: 1 });
db.enrollments.createIndex({ course_id: 1 });
db.enrollments.createIndex({ status: 1 });
db.enrollments.createIndex({ "enrollment_valid_from": 1, "enrollment_valid_to": 1 });
db.enrollments.createIndex({ student_id: 1, course_id: 1 }, { unique: true });
student_id_1_course_id_1
db.progress.createIndex({ student_id: 1 });
db.progress.createIndex({ lesson_id: 1 });
db.progress.createIndex({ student_id: 1, lesson_id: 1 }, { unique: true });
student_id_1_lesson_id_1
db.attempts.createIndex({ student_id: 1 });
db.attempts.createIndex({ quiz_id: 1 });
db.attempts.createIndex({ start_time: 1, end_time: 1 });
start_time_1_end_time_1
db.reviews.createIndex({ course_id: 1 });
db.reviews.createIndex({ student_id: 1, course_id: 1 }, { unique: true });
student_id_1_course_id_1
db.notifications.createIndex({ recipients: 1 });
db.notifications.createIndex({ expires_at: 1 });
expires_at_1
db.audit_logs.createIndex({ table_name: 1 });
db.audit_logs.createIndex({ timestamp: 1 });
timestamp_1
//INSERT USERS
db.users.insertMany([
  // USER 1: Instructor 1
  {
    user_id: 1,
    name: "Gibson Chengetanai",
    email: "gibson.chengetanai@example.com",
    password: "password123",
    user_type: "instructor",
    contact_info: {
      primary_email: "gibson.chengetanai@example.com",
      phone_numbers: ["+1234567890", "+0987654321"],
      address: {
        street: "123 Main St",
        city: "City",
        state: "State",
        postal_code: "12345",
        country: "Country"
      },
      emergency_contact: {
        name: "Emergency Contact",
        phone: "+1111111111"
      }
    },
    preferences: {
      theme: "dark",
      language: "en",
      notifications: true
    },
    instructor: {
      bio: "Senior software engineer with 10 years of experience",
      expertise: ["Programming", "Algorithms"],
      hire_date: new Date(),
      qualifications: [],
      teaching_load: 0,
      performance_ratings: [],
      courses_taught: []
    },
    last_login: new Date(),
    created_at: new Date(),
    account_valid_from: new Date(),
    account_valid_to: ISODate("9999-12-31T23:59:59.999Z"),
    is_active: true
  },
  
  // USER 2: Instructor 2
  {
    user_id: 2,
    name: "Keitumetse Gobotsamang",
    email: "keitumetse.gobotsamang@example.com",
    password: "password123",
    user_type: "instructor",
    contact_info: {
      primary_email: "keitumetse.gobotsamang@example.com",
      phone_numbers: ["+1234567890", "+0987654321"],
      address: {
        street: "123 Main St",
        city: "City",
        state: "State",
        postal_code: "12345",
        country: "Country"
      },
      emergency_contact: {
        name: "Emergency Contact",
        phone: "+1111111111"
      }
    },
    preferences: {
      theme: "dark",
      language: "en",
      notifications: true
    },
    instructor: {
      bio: "Data science expert and machine learning practitioner",
      expertise: ["Data Science", "Machine Learning"],
      hire_date: new Date(),
      qualifications: [],
      teaching_load: 0,
      performance_ratings: [],
      courses_taught: []
    },
    last_login: new Date(),
    created_at: new Date(),
    account_valid_from: new Date(),
    account_valid_to: ISODate("9999-12-31T23:59:59.999Z"),
    is_active: true
  },
  
  // USER 3: Student 1
  {
    user_id: 3,
    name: "Kaone Watlhaga",
    email: "kaone.watlhaga@example.com",
    password: "password123",
    user_type: "student",
    contact_info: {
      primary_email: "kaone.watlhaga@example.com",
      phone_numbers: ["+1234567890", "+0987654321"],
      address: {
        street: "123 Main St",
        city: "City",
        state: "State",
        postal_code: "12345",
        country: "Country"
      },
      emergency_contact: {
        name: "Emergency Contact",
        phone: "+1111111111"
      }
    },
    preferences: {
      theme: "dark",
      language: "en",
      notifications: true
    },
    student: {
      enroll_date: new Date(),
      completed_courses: [],
      grade_history: [],
      gpa: 0.00,
      learning_analytics: {},
      academic_status: "active",
      current_courses: []
    },
    last_login: new Date(),
    created_at: new Date(),
    account_valid_from: new Date(),
    account_valid_to: ISODate("9999-12-31T23:59:59.999Z"),
    is_active: true
  },
  
  // USER 4:Student 2
  {
    user_id: 4,
    name: "Boemo Marumo",
    email: "boemo.marumo@example.com",
    password: "password123",
    user_type: "student",
    contact_info: {
      primary_email: "boemo.marumo@example.com",
      phone_numbers: ["+1234567890", "+0987654321"],
      address: {
        street: "123 Main St",
        city: "City",
        state: "State",
        postal_code: "12345",
        country: "Country"
      },
      emergency_contact: {
        name: "Emergency Contact",
        phone: "+1111111111"
      }
    },
    preferences: {
      theme: "dark",
      language: "en",
      notifications: true
    },
    student: {
      enroll_date: new Date(),
      completed_courses: [],
      grade_history: [],
      gpa: 0.00,
      learning_analytics: {},
      academic_status: "active",
      current_courses: []
    },
    last_login: new Date(),
    created_at: new Date(),
    account_valid_from: new Date(),
    account_valid_to: ISODate("9999-12-31T23:59:59.999Z"),
    is_active: true
  },
  
  // USER 5: INSTUCTOR 3
  {
    user_id: 5,
    name: "John Smith",
    email: "john.smith@example.com",
    password: "password123",
    user_type: ["instructor", "student"], // Can have multiple roles
    contact_info: {
      primary_email: "john.smith@example.com",
      phone_numbers: ["+1234567890", "+0987654321"],
      address: {
        street: "456 Oak St",
        city: "Town",
        state: "Province",
        postal_code: "67890",
        country: "Country"
      },
      emergency_contact: {
        name: "Emergency Contact 2",
        phone: "+12223334444"
      }
    },
    preferences: {
      theme: "light",
      language: "en",
      notifications: true
    },
    instructor: {
      bio: "Web development specialist with focus on modern frameworks",
      expertise: ["Web Development", "JavaScript", "React"],
      hire_date: new Date(),
      qualifications: [],
      teaching_load: 0,
      performance_ratings: [],
      courses_taught: []
    },
    last_login: new Date(),
    created_at: new Date(),
    account_valid_from: new Date(),
    account_valid_to: ISODate("9999-12-31T23:59:59.999Z"),
    is_active: true
  },
  
  // USER 6: Student 3
  {
    user_id: 6,
    name: "Amantle Gaabatholwe",
    email: "amantle.gaabatholwe@example.com",
    password: "password123",
    user_type: "student",
    contact_info: {
      primary_email: "amantle.gaabatholwe@example.com",
      phone_numbers: ["+1234567890", "+0987654321"],
      address: {
        street: "789 Pine St",
        city: "Village",
        state: "Region",
        postal_code: "54321",
        country: "Country"
      },
      emergency_contact: {
        name: "Emergency Contact 3",
        phone: "+13334445555"
      }
    },
    preferences: {
      theme: "dark",
      language: "en",
      notifications: true
    },
    student: {
      enroll_date: new Date(),
      completed_courses: [],
      grade_history: [],
      gpa: 0.00,
      learning_analytics: {},
      academic_status: "active",
      current_courses: []
    },
    last_login: new Date(),
    created_at: new Date(),
    account_valid_from: new Date(),
    account_valid_to: ISODate("9999-12-31T23:59:59.999Z"),
    is_active: true
  }
]);
{
  acknowledged: true,
  insertedIds: {
    '0': ObjectId('6838dbbeb7da03bcd9e48767'),
    '1': ObjectId('6838dbbeb7da03bcd9e48768'),
    '2': ObjectId('6838dbbeb7da03bcd9e48769'),
    '3': ObjectId('6838dbbeb7da03bcd9e4876a'),
    '4': ObjectId('6838dbbeb7da03bcd9e4876b'),
    '5': ObjectId('6838dbbeb7da03bcd9e4876c')
  }
}
// Insert courses that reference instructors from the users collection
db.courses.insertMany([
  {
    course_id: 1,
    title: "Introduction to Programming",
    description: "Learn the basics of programming",
    created_date: new Date(),
    instructor_id: 1,
    categories: ["Programming", "Beginner"],
    price: 49.99,
    difficulty_level: "beginner",
    max_students: 100,
    current_enrollment: 0,
    rating: 0.00,
    prerequisites: [],
    learning_outcomes: ["Outcome 1", "Outcome 2", "Outcome 3"],
    analytics: { views: 150, rating_count: 25 },
    enrollment_start: new Date(new Date() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    enrollment_end: new Date(new Date() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    is_active: true
  },
  {
    course_id: 2,
    title: "Advanced Data Analysis",
    description: "Master data analysis techniques",
    created_date: new Date(),
    instructor_id: 2,
    categories: ["Data Science", "Statistics"],
    price: 79.99,
    difficulty_level: "advanced",
    max_students: 100,
    current_enrollment: 0,
    rating: 0.00,
    prerequisites: [1],
    learning_outcomes: ["Outcome 1", "Outcome 2", "Outcome 3"],
    analytics: { views: 120, rating_count: 18 },
    enrollment_start: new Date(new Date() - 30 * 24 * 60 * 60 * 1000),
    enrollment_end: new Date(new Date() + 60 * 24 * 60 * 60 * 1000),
    is_active: true
  },
  {
    course_id: 3,
    title: "Modern Web Development",
    description: "Build responsive web applications",
    created_date: new Date(),
    instructor_id: 5,
    categories: ["Web Development", "JavaScript"],
    price: 59.99,
    difficulty_level: "intermediate",
    max_students: 100,
    current_enrollment: 0,
    rating: 0.00,
    prerequisites: [1],
    learning_outcomes: ["Outcome 1", "Outcome 2", "Outcome 3"],
    analytics: { views: 80, rating_count: 10 },
    enrollment_start: new Date(new Date() - 30 * 24 * 60 * 60 * 1000),
    enrollment_end: new Date(new Date() + 60 * 24 * 60 * 60 * 1000),
    is_active: true
  }
]);
{
  acknowledged: true,
  insertedIds: {
    '0': ObjectId('6838dbceb7da03bcd9e4876d'),
    '1': ObjectId('6838dbceb7da03bcd9e4876e'),
    '2': ObjectId('6838dbceb7da03bcd9e4876f')
  }
}

//INSERT MODULES
db.modules.insertMany([
  {
    module_id: 1,
    title: "Programming Fundamentals",
    course_id: 1,
    objectives: ["Understand basic syntax", "Write simple programs"],
    estimated_duration: "2 weeks",
    display_order: 1,
    parent_module_id: null
  },
  {
    module_id: 2,
    title: "Data Structures",
    course_id: 1,
    objectives: ["Learn about arrays and lists", "Understand algorithms"],
    estimated_duration: "3 weeks",
    display_order: 2,
    parent_module_id: null
  },
  {
    module_id: 3,
    title: "Data Cleaning",
    course_id: 2,
    objectives: ["Handle missing data", "Clean messy datasets"],
    estimated_duration: "1 week",
    display_order: 1,
    parent_module_id: null
  },
  {
    module_id: 4,
    title: "Statistical Analysis",
    course_id: 2,
    objectives: ["Perform hypothesis testing", "Understand distributions"],
    estimated_duration: "2 weeks",
    display_order: 2,
    parent_module_id: null
  },
  {
    module_id: 5,
    title: "HTML & CSS Basics",
    course_id: 3,
    objectives: ["Create basic web pages", "Style with CSS"],
    estimated_duration: "2 weeks",
    display_order: 1,
    parent_module_id: null
  },
  {
    module_id: 6,
    title: "JavaScript Fundamentals",
    course_id: 3,
    objectives: ["Understand JS syntax", "DOM manipulation"],
    estimated_duration: "3 weeks",
    display_order: 2,
    parent_module_id: null
  }
]);
{
  acknowledged: true,
  insertedIds: {
    '0': ObjectId('6838dbddb7da03bcd9e48770'),
    '1': ObjectId('6838dbddb7da03bcd9e48771'),
    '2': ObjectId('6838dbddb7da03bcd9e48772'),
    '3': ObjectId('6838dbddb7da03bcd9e48773'),
    '4': ObjectId('6838dbddb7da03bcd9e48774'),
    '5': ObjectId('6838dbddb7da03bcd9e48775')
  }
}
//INSERT LESSONS
db.lessons.insertMany([
  {
    lesson_id: 1,
    type: "video",
    content: {
      content_type: "video",
      content_data: "https://example.com/video1",
      duration: "30 minutes"
    },
    module_id: 1,
    display_order: 1,
    prerequisites: [],
    resources: [],
    interaction_data: {},
    version: 1,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    lesson_id: 2,
    type: "text",
    content: {
      content_type: "text",
      content_data: "Introduction to variables and data types",
      duration: "20 minutes"
    },
    module_id: 1,
    display_order: 2,
    prerequisites: [],
    resources: [],
    interaction_data: {},
    version: 1,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    lesson_id: 3,
    type: "quiz",
    content: {
      content_type: "quiz",
      content_data: "Quiz on programming basics",
      duration: "15 minutes"
    },
    module_id: 1,
    display_order: 3,
    prerequisites: [],
    resources: [],
    interaction_data: {},
    version: 1,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    lesson_id: 4,
    type: "video",
    content: {
      content_type: "video",
      content_data: "https://example.com/video2",
      duration: "45 minutes"
    },
    module_id: 2,
    display_order: 1,
    prerequisites: [],
    resources: [],
    interaction_data: {},
    version: 1,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    lesson_id: 5,
    type: "text",
    content: {
      content_type: "text",
      content_data: "Understanding arrays and linked lists",
      duration: "30 minutes"
    },
    module_id: 2,
    display_order: 2,
    prerequisites: [],
    resources: [],
    interaction_data: {},
    version: 1,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    lesson_id: 6,
    type: "video",
    content: {
      content_type: "video",
      content_data: "https://example.com/video3",
      duration: "40 minutes"
    },
    module_id: 3,
    display_order: 1,
    prerequisites: [],
    resources: [],
    interaction_data: {},
    version: 1,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    lesson_id: 7,
    type: "assignment",
    content: {
      content_type: "assignment",
      content_data: "Clean this dataset",
      duration: "2 hours"
    },
    module_id: 3,
    display_order: 2,
    prerequisites: [],
    resources: [],
    interaction_data: {},
    version: 1,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    lesson_id: 8,
    type: "video",
    content: {
      content_type: "video",
      content_data: "https://example.com/video4",
      duration: "50 minutes"
    },
    module_id: 4,
    display_order: 1,
    prerequisites: [],
    resources: [],
    interaction_data: {},
    version: 1,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    lesson_id: 9,
    type: "quiz",
    content: {
      content_type: "quiz",
      content_data: "Statistics quiz",
      duration: "20 minutes"
    },
    module_id: 4,
    display_order: 2,
    prerequisites: [],
    resources: [],
    interaction_data: {},
    version: 1,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    lesson_id: 10,
    type: "video",
    content: {
      content_type: "video",
      content_data: "https://example.com/video5",
      duration: "35 minutes"
    },
    module_id: 5,
    display_order: 1,
    prerequisites: [],
    resources: [],
    interaction_data: {},
    version: 1,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    lesson_id: 11,
    type: "text",
    content: {
      content_type: "text",
      content_data: "HTML document structure",
      duration: "25 minutes"
    },
    module_id: 5,
    display_order: 2,
    prerequisites: [],
    resources: [],
    interaction_data: {},
    version: 1,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    lesson_id: 12,
    type: "video",
    content: {
      content_type: "video",
      content_data: "https://example.com/video6",
      duration: "40 minutes"
    },
    module_id: 6,
    display_order: 1,
    prerequisites: [],
    resources: [],
    interaction_data: {},
    version: 1,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    lesson_id: 13,
    type: "assignment",
    content: {
      content_type: "assignment",
      content_data: "Build a simple interactive page",
      duration: "3 hours"
    },
    module_id: 6,
    display_order: 2,
    prerequisites: [],
    resources: [],
    interaction_data: {},
    version: 1,
    created_at: new Date(),
    updated_at: new Date()
  }
]);
{
  acknowledged: true,
  insertedIds: {
    '0': ObjectId('6838dbf6b7da03bcd9e48776'),
    '1': ObjectId('6838dbf6b7da03bcd9e48777'),
    '2': ObjectId('6838dbf6b7da03bcd9e48778'),
    '3': ObjectId('6838dbf6b7da03bcd9e48779'),
    '4': ObjectId('6838dbf6b7da03bcd9e4877a'),
    '5': ObjectId('6838dbf6b7da03bcd9e4877b'),
    '6': ObjectId('6838dbf6b7da03bcd9e4877c'),
    '7': ObjectId('6838dbf6b7da03bcd9e4877d'),
    '8': ObjectId('6838dbf6b7da03bcd9e4877e'),
    '9': ObjectId('6838dbf6b7da03bcd9e4877f'),
    '10': ObjectId('6838dbf6b7da03bcd9e48780'),
    '11': ObjectId('6838dbf6b7da03bcd9e48781'),
    '12': ObjectId('6838dbf6b7da03bcd9e48782')
  }
}
//INSERT QUIZZES
db.quizzes.insertMany([
  {
    quiz_id: 1,
    module_id: 1,
    title: "Programming Basics Quiz",
    total_marks: 100,
    passing_score: 70,
    questions: [
      {
        question_id: 1,
        question_text: "What is a variable?",
        options: ["A container for storing data", "A type of loop", "A function"],
        correct_answer: 1,
        points: 30
      },
      {
        question_id: 2,
        question_text: "Which keyword declares a variable?",
        options: ["var", "function", "return"],
        correct_answer: 1,
        points: 30
      },
      {
        question_id: 3,
        question_text: "What does == compare?",
        options: ["Values", "Memory locations", "Data types"],
        correct_answer: 1,
        points: 40
      }
    ],
    time_limit: "30 minutes",
    attempts_allowed: 3,
    availability_start: new Date(),
    availability_end: ISODate("9999-12-31T23:59:59.999Z"),
    analytics: {}
  },
  {
    quiz_id: 2,
    module_id: 4,
    title: "Statistics Quiz",
    total_marks: 100,
    passing_score: 75,
    questions: [
      {
        question_id: 1,
        question_text: "What is the mean of [1,2,3,4,5]?",
        options: ["3", "2.5", "4"],
        correct_answer: 1,
        points: 50
      },
      {
        question_id: 2,
        question_text: "What does p-value represent?",
        options: ["Probability", "Variance", "Mean"],
        correct_answer: 1,
        points: 50
      }
    ],
    time_limit: "20 minutes",
    attempts_allowed: 2,
    availability_start: new Date(),
    availability_end: ISODate("9999-12-31T23:59:59.999Z"),
    analytics: {}
  },
  {
    quiz_id: 3,
    module_id: 5, // HTML & CSS Basics
    title: "Web Basics Quiz",
    total_marks: 100,
    passing_score: 65,
    questions: [
      {
        question_id: 1,
        question_text: "What does HTML stand for?",
        options: [
          "HyperText Markup Language", 
          "Hyperlinks and Text Markup Language", 
          "Home Tool Markup Language"
        ],
        correct_answer: 1,
        points: 40
      },
      {
        question_id: 2,
        question_text: "Which CSS property changes text color?",
        options: ["color", "text-color", "font-color"],
        correct_answer: 1,
        points: 40
      },
      {
        question_id: 3,
        question_text: "Which tag creates a paragraph?",
        options: ["<p>", "<para>", "<paragraph>"],
        correct_answer: 1,
        points: 20
      }
    ],
    time_limit: "25 minutes",
    attempts_allowed: 2,
    availability_start: new Date(),
    availability_end: ISODate("9999-12-31T23:59:59.999Z"),
    analytics: {}
  }
]);
{
  acknowledged: true,
  insertedIds: {
    '0': ObjectId('6838dc15b7da03bcd9e48783'),
    '1': ObjectId('6838dc15b7da03bcd9e48784'),
    '2': ObjectId('6838dc15b7da03bcd9e48785')
  }
}
//INSERT ENROLLMENTS
db.enrollments.insertMany([
  {
    enrollment_id: 1,
    student_id: 3, // Kaone Watlhaga
    course_id: 1, // Introduction to Programming
    enrollment_date: new Date(),
    completion_date: null,
    current_module: null,
    last_accessed: new Date(),
    progress_percentage: 0.00,
    total_time_spent: "0 minutes",
    access_count: 0,
    status: "active",
    payment_status: "pending",
    analytics: {},
    enrollment_valid_from: new Date(),
    enrollment_valid_to: ISODate("9999-12-31T23:59:59.999Z")
  },
  {
    enrollment_id: 2,
    student_id: 3, // Kaone Watlhaga
    course_id: 2, // Advanced Data Analysis
    enrollment_date: new Date(),
    completion_date: null,
    current_module: null,
    last_accessed: new Date(),
    progress_percentage: 0.00,
    total_time_spent: "0 minutes",
    access_count: 0,
    status: "active",
    payment_status: "pending",
    analytics: {},
    enrollment_valid_from: new Date(),
    enrollment_valid_to: ISODate("9999-12-31T23:59:59.999Z")
  },
  {
    enrollment_id: 3,
    student_id: 4, // Boemo Marumo
    course_id: 2, // Advanced Data Analysis
    enrollment_date: new Date(),
    completion_date: null,
    current_module: null,
    last_accessed: new Date(),
    progress_percentage: 0.00,
    total_time_spent: "0 minutes",
    access_count: 0,
    status: "active",
    payment_status: "pending",
    analytics: {},
    enrollment_valid_from: new Date(),
    enrollment_valid_to: ISODate("9999-12-31T23:59:59.999Z")
  },
  {
    enrollment_id: 4,
    student_id: 6, // Amantle Gaabatholwe
    course_id: 3, // Modern Web Development
    enrollment_date: new Date(),
    completion_date: null,
    current_module: null,
    last_accessed: new Date(),
    progress_percentage: 0.00,
    total_time_spent: "0 minutes",
    access_count: 0,
    status: "active",
    payment_status: "pending",
    analytics: {},
    enrollment_valid_from: new Date(),
    enrollment_valid_to: ISODate("9999-12-31T23:59:59.999Z")
  },
  {
    enrollment_id: 5,
    student_id: 6, // Amantle Gaabatholwe
    course_id: 1, // Introduction to Programming
    enrollment_date: new Date(),
    completion_date: null,
    current_module: null,
    last_accessed: new Date(),
    progress_percentage: 0.00,
    total_time_spent: "0 minutes",
    access_count: 0,
    status: "active",
    payment_status: "pending",
    analytics: {},
    enrollment_valid_from: new Date(),
    enrollment_valid_to: ISODate("9999-12-31T23:59:59.999Z")
  }
]);
{
  acknowledged: true,
  insertedIds: {
    '0': ObjectId('6838dc2cb7da03bcd9e48786'),
    '1': ObjectId('6838dc2cb7da03bcd9e48787'),
    '2': ObjectId('6838dc2cb7da03bcd9e48788'),
    '3': ObjectId('6838dc2cb7da03bcd9e48789'),
    '4': ObjectId('6838dc2cb7da03bcd9e4878a')
  }
}
//INSERT PROGRESS
db.progress.insertMany([
  // Kaone Watlhaga's progress
  {
    progress_id: 1,
    student_id: 3,
    lesson_id: 1, // Programming Fundamentals video
    status: "completed",
    last_accessed: new Date(),
    time_spent: "35 minutes",
    notes: [],
    completion_percentage: 100.00,
    interaction_count: 0,
    engagement_score: null,
    difficulty_rating: null,
    bookmarks: []
  },
  {
    progress_id: 2,
    student_id: 3,
    lesson_id: 2, // Programming Fundamentals text
    status: "completed",
    last_accessed: new Date(),
    time_spent: "25 minutes",
    notes: [],
    completion_percentage: 100.00,
    interaction_count: 0,
    engagement_score: null,
    difficulty_rating: null,
    bookmarks: []
  },
  {
    progress_id: 3,
    student_id: 3,
    lesson_id: 3, // Programming Fundamentals quiz
    status: "completed",
    last_accessed: new Date(),
    time_spent: "20 minutes",
    notes: [],
    completion_percentage: 100.00,
    interaction_count: 0,
    engagement_score: null,
    difficulty_rating: null,
    bookmarks: []
  },
  {
    progress_id: 4,
    student_id: 3,
    lesson_id: 4, // Data Structures video
    status: "in_progress",
    last_accessed: new Date(),
    time_spent: "15 minutes",
    notes: [],
    completion_percentage: 50.00,
    interaction_count: 0,
    engagement_score: null,
    difficulty_rating: null,
    bookmarks: []
  },
  // Boemo Marumo's progress
  {
    progress_id: 5,
    student_id: 4,
    lesson_id: 6, // Data Cleaning video
    status: "completed",
    last_accessed: new Date(),
    time_spent: "45 minutes",
    notes: [],
    completion_percentage: 100.00,
    interaction_count: 0,
    engagement_score: null,
    difficulty_rating: null,
    bookmarks: []
  },
  {
    progress_id: 6,
    student_id: 4,
    lesson_id: 7, // Data Cleaning assignment
    status: "completed",
    last_accessed: new Date(),
    time_spent: "130 minutes", // 2 hours 10 minutes
    notes: [],
    completion_percentage: 100.00,
    interaction_count: 0,
    engagement_score: null,
    difficulty_rating: null,
    bookmarks: []
  },
  // Amantle Gaabatholwe's progress
  {
    progress_id: 7,
    student_id: 6,
    lesson_id: 10, // HTML & CSS Basics video
    status: "completed",
    last_accessed: new Date(),
    time_spent: "40 minutes",
    notes: [],
    completion_percentage: 100.00,
    interaction_count: 0,
    engagement_score: null,
    difficulty_rating: null,
    bookmarks: []
  },
  {
    progress_id: 8,
    student_id: 6,
    lesson_id: 11, // HTML & CSS Basics text
    status: "in_progress",
    last_accessed: new Date(),
    time_spent: "15 minutes",
    notes: [],
    completion_percentage: 50.00,
    interaction_count: 0,
    engagement_score: null,
    difficulty_rating: null,
    bookmarks: []
  }
]);
{
  acknowledged: true,
  insertedIds: {
    '0': ObjectId('6838dc43b7da03bcd9e4878b'),
    '1': ObjectId('6838dc43b7da03bcd9e4878c'),
    '2': ObjectId('6838dc43b7da03bcd9e4878d'),
    '3': ObjectId('6838dc43b7da03bcd9e4878e'),
    '4': ObjectId('6838dc43b7da03bcd9e4878f'),
    '5': ObjectId('6838dc43b7da03bcd9e48790'),
    '6': ObjectId('6838dc43b7da03bcd9e48791'),
    '7': ObjectId('6838dc43b7da03bcd9e48792')
  }
}
//INSERT REVIEWS
db.reviews.insertMany([
  {
    review_id: 1,
    student_id: 3, // Kaone Watlhaga
    course_id: 1, // Introduction to Programming
    rating: 5,
    comment: "Excellent course for beginners!",
    review_date: new Date(),
    content_rating: null,
    instructor_rating: null,
    difficulty_rating: null,
    would_recommend: null,
    helpful_votes: 0,
    verified_purchase: false
  },
  {
    review_id: 2,
    student_id: 4, // Boemo Marumo
    course_id: 2, // Advanced Data Analysis
    rating: 4,
    comment: "Very informative but some sections were challenging",
    review_date: new Date(),
    content_rating: null,
    instructor_rating: null,
    difficulty_rating: null,
    would_recommend: null,
    helpful_votes: 0,
    verified_purchase: false
  },
  {
    review_id: 3,
    student_id: 6, // Amantle Gaabatholwe
    course_id: 3, // Modern Web Development
    rating: 5,
    comment: "Great content and well-structured lessons!",
    review_date: new Date(),
    content_rating: null,
    instructor_rating: null,
    difficulty_rating: null,
    would_recommend: null,
    helpful_votes: 0,
    verified_purchase: false
  }
]);
{
  acknowledged: true,
  insertedIds: {
    '0': ObjectId('6838dc5db7da03bcd9e48793'),
    '1': ObjectId('6838dc5db7da03bcd9e48794'),
    '2': ObjectId('6838dc5db7da03bcd9e48795')
  }
}
db.courses.updateMany(
  { course_id: { $in: [1, 2, 3] } },
  [
    {
      $set: {
        rating: {
          $avg: {
            $ifNull: [
              {
                $map: {
                  input: {
                    $filter: {
                      input: "$reviews",
                      as: "review",
                      cond: { $gt: ["$$review.rating", 0] }
                    }
                  },
                  as: "r",
                  in: "$$r.rating"
                }
              },
              0
            ]
          }
        }
      }
    }
  ]
);
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 3,
  modifiedCount: 3,
  upsertedCount: 0
}
//INSERT NOTIFICATIONS
db.notifications.insertMany([
  {
    notification_id: 1,
    recipients: [1],
    message: "Welcome to our platform!",
    timestamp: new Date(),
    status: "read",
    metadata: null,
    notification_type: "general",
    priority: "normal",
    expires_at: null,
    delivery_channels: ["in_app"]
  },
  {
    notification_id: 2,
    recipients: [1, 2],
    message: "System maintenance scheduled for tonight",
    timestamp: new Date(),
    status: "sent",
    metadata: null,
    notification_type: "general",
    priority: "normal",
    expires_at: null,
    delivery_channels: ["in_app"]
  },
  {
    notification_id: 3,
    recipients: [6], 
    message: "Your enrollment in Modern Web Development was successful",
    timestamp: new Date(),
    status: "sent",
    metadata: null,
    notification_type: "enrollment_confirmation",
    priority: "normal",
    expires_at: null,
    delivery_channels: ["in_app"]
  }
]);
{
  acknowledged: true,
  insertedIds: {
    '0': ObjectId('6838dc7bb7da03bcd9e48796'),
    '1': ObjectId('6838dc7bb7da03bcd9e48797'),
    '2': ObjectId('6838dc7bb7da03bcd9e48798')
  }
}
//FUNCTIONS AND PROCEDURES
// 1. set_attempt_passed_status (as a document validation or application logic)
function setAttemptPassedStatus(attemptDoc) {
  const quiz = db.quizzes.findOne({ quiz_id: attemptDoc.quiz_id });
  attemptDoc.is_passed = attemptDoc.score >= quiz.passing_score;
  return attemptDoc;
}
[Function: setAttemptPassedStatus]
// 2. update_course_rating (as a trigger equivalent - MongoDB has change streams)
function updateCourseRating(courseId) {
  const avgRating = db.reviews.aggregate([
    { $match: { course_id: courseId } },
    { $group: { _id: null, avgRating: { $avg: "$rating" } } }
  ]).toArray()[0]?.avgRating || 0;
  
  db.courses.updateOne(
    { course_id: courseId },
    { $set: { rating: avgRating } }
  );
}
[Function: updateCourseRating]
// 3. check_enrollment_before_review 
function checkEnrollmentBeforeReview(reviewDoc) {
  const enrollment = db.enrollments.findOne({
    student_id: reviewDoc.student_id,
    course_id: reviewDoc.course_id
  });
  
  if (!enrollment) {
    throw new Error("Student must be enrolled in the course to submit a review");
  }
}
[Function: checkEnrollmentBeforeReview]
// 4. update_completion_status 
function updateCompletionStatus(progressDoc) {
  // Get the course_id from the lesson and module
  const lesson = db.lessons.findOne({ lesson_id: progressDoc.lesson_id });
  const module = db.modules.findOne({ module_id: lesson.module_id });
  const courseId = module.course_id;
  
  // Get the enrollment for this student and course
  const enrollment = db.enrollments.findOne({
    student_id: progressDoc.student_id,
    course_id: courseId
  });
  
  if (!enrollment) return;
  
  // Get total lessons in course
  const totalLessons = db.lessons.countDocuments({
    "module_id": { $in: db.modules.find({ course_id: courseId }).map(m => m.module_id) }
  });
  
  // Get completed lessons for this student in course
  const completedLessons = db.progress.countDocuments({
    student_id: progressDoc.student_id,
    status: "completed",
    "lesson_id": { $in: db.lessons.find({
      "module_id": { $in: db.modules.find({ course_id: courseId }).map(m => m.module_id) }
    }).map(l => l.lesson_id) }
  });
  
  // Update completion date if all lessons are completed
  if (completedLessons >= totalLessons) {
    db.enrollments.updateOne(
      { enrollment_id: enrollment.enrollment_id },
      { $set: { completion_date: new Date() } }
    );
    
    // Add to student's completed courses array
    db.students.updateOne(
      { user_id: progressDoc.student_id },
      { $addToSet: { completed_courses: courseId } }
    );
  }
}
[Function: updateCompletionStatus]
// 5. notify_instuctor_on_review
function notifyInstructorOnReview(reviewDoc) {
  const course = db.courses.findOne({ course_id: reviewDoc.course_id });
  
  db.notifications.insertOne({
    recipients: [course.instructor_id],
    message: "New review received for your course",
    metadata: {
      course_id: reviewDoc.course_id,
      review_id: reviewDoc.review_id,
      rating: reviewDoc.rating
    },
    timestamp: new Date(),
    status: "sent",
    notification_type: "review_notification",
    priority: "normal",
    expires_at: null,
    delivery_channels: ["in_app"]
  });
}
[Function: notifyInstructorOnReview]
// 6.ENROLL STUDENT WITH VALIDATION
function enrollStudentWithValidation(studentId, courseId) {
  const course = db.courses.findOne({
    course_id: courseId,
    is_active: true
  });

  if (!course) {
    throw new Error("Course not found or not active");
  }

  if (course.max_students !== null && course.current_enrollment >= course.max_students) {
    throw new Error("Course is full");
  }

  const student = db.students.findOne({ user_id: studentId });

  if (course.prerequisites && course.prerequisites.length > 0) {
    const hasPrerequisites = course.prerequisites.every(preq =>
      student.completed_courses.includes(preq)
    );

    if (!hasPrerequisites) {
      throw new Error("Prerequisites not met");
    }
  }

  db.enrollments.insertOne({
    student_id: studentId,
    course_id: courseId,
    enrollment_date: new Date(),
    completion_date: null,
    current_module: null,
    last_accessed: new Date(),
    progress_percentage: 0.00,
    total_time_spent: "0 minutes",
    access_count: 0,
    status: "active",
    payment_status: "pending",
    analytics: {},
    enrollment_valid_from: new Date(),
    enrollment_valid_to: ISODate("9999-12-31T23:59:59.999Z")
  });

  db.courses.updateOne(
    { course_id: courseId },
    { $inc: { current_enrollment: 1 } }
  );

  print("Enrollment successful.");
}
[Function: enrollStudentWithValidation]
// 7. get_student_analytics (as a function)
function getStudentAnalytics(studentId) {
  // Calculate total time spent
  const totalTimeResult = db.progress.aggregate([
    { $match: { student_id: studentId } },
    { $group: { _id: null, totalSeconds: { $sum: "$time_spent" } } }
  ]).toArray()[0];
  const totalTime = totalTimeResult ? totalTimeResult.totalSeconds : 0;
  
  // Calculate average score
  const avgScoreResult = db.attempts.aggregate([
    { $match: { student_id: studentId } },
    { $group: { _id: null, avgScore: { $avg: "$score" } } }
  ]).toArray()[0];
  const avgScore = avgScoreResult ? avgScoreResult.avgScore : 0;
  
  // Calculate completion rate
  const enrollmentStats = db.enrollments.aggregate([
    { $match: { student_id: studentId } },
    { $group: { 
      _id: null, 
      total: { $sum: 1 },
      completed: { 
        $sum: { 
          $cond: [{ $eq: ["$status", "completed"] }, 1, 0] 
        } 
      }
    } }
  ]).toArray()[0];
  
  const completionRate = enrollmentStats ? 
    (enrollmentStats.completed / enrollmentStats.total) * 100 : 0;
  
  // Count enrolled courses
  const courseCount = db.enrollments.countDocuments({ student_id: studentId });
  
  // Build result
  return {
    total_time_spent: totalTime,
    average_score: avgScore,
    completion_rate: completionRate,
    total_courses: courseCount,
    generated_at: new Date()
  };
}
[Function: getStudentAnalytics]
// 8. audit_data_changes (using MongoDB change streams)
function setupAuditLogChangeStream() {
  const collections = [
    "enrollments", "attempts", "courses", "students", 
    "instructors", "progress", "reviews"
  ];
  
  collections.forEach(collName => {
    const collection = db.getCollection(collName);
    const changeStream = collection.watch();
    
    changeStream.on("change", (change) => {
      let operation, oldValues, newValues;
      
      if (change.operationType === "delete") {
        operation = "DELETE";
        oldValues = change.fullDocumentBeforeChange;
      } else if (change.operationType === "update") {
        operation = "UPDATE";
        oldValues = change.fullDocumentBeforeChange;
        newValues = change.fullDocument;
      } else if (change.operationType === "insert") {
        operation = "INSERT";
        newValues = change.fullDocument;
      }
      
      if (operation) {
        db.audit_logs.insertOne({
          table_name: collName,
          operation: operation,
          user_id: null, // Would need context from application
          old_values: oldValues,
          new_values: newValues,
          timestamp: new Date(),
          ip_address: null // Would need context from application
        });
      }
    });
  });
}
[Function: setupAuditLogChangeStream]
// TESTING FUNCTIONS AND STORED PROCEDURES
// 1. Test set_attempt_passed_status function
print("=== Testing set_attempt_passed_status ===");


const quiz1 = db.quizzes.findOne({ quiz_id: 1 });
print(`Quiz 1 passing score: ${quiz1.passing_score}`);

// test attempt that should pass
const passingAttempt = {
  attempt_id: 100,
  quiz_id: 1,
  student_id: 3,
  score: 80, // Above passing score of 70
  attempt_time: new Date()
};

// Process the attempt
const processedPassingAttempt = setAttemptPassedStatus(passingAttempt);
print(`Passing attempt is_passed status: ${processedPassingAttempt.is_passed}`); // Should be true

// Test attempt that should fail
const failingAttempt = {
  attempt_id: 101,
  quiz_id: 1,
  student_id: 3,
  score: 60, // Below passing score of 70
  attempt_time: new Date()
};

// Process the attempt
const processedFailingAttempt = setAttemptPassedStatus(failingAttempt);
print(`Failing attempt is_passed status: ${processedFailingAttempt.is_passed}`); // Should be false
=== Testing set_attempt_passed_status ===
Quiz 1 passing score: 70
Passing attempt is_passed status: true
Failing attempt is_passed status: false
// 2. Test update_course_rating function
print("\n=== Testing update_course_rating ===");

// Get current rating for course 1
const courseBefore = db.courses.findOne({ course_id: 1 });
print(`Course 1 current rating: ${courseBefore.rating}`);

// Add a new review for course 1
db.reviews.insertOne({
  review_id: 100,
  student_id: 4,
  course_id: 1,
  rating: 4,
  comment: "Additional test review",
  review_date: new Date()
});

// Update the course rating
updateCourseRating(1);

// Check the updated rating
const courseAfter = db.courses.findOne({ course_id: 1 });
print(`Course 1 updated rating: ${courseAfter.rating}`); 

=== Testing update_course_rating ===
Course 1 current rating: 0
Course 1 updated rating: 4.5
// Clean up
db.reviews.deleteOne({ review_id: 100 });
{
  acknowledged: true,
  deletedCount: 1
}
// 3. Test check_enrollment_before_review function
print("\n=== Testing check_enrollment_before_review ===");

// Test with valid enrollment (student 3 is enrolled in course 1)
const validReview = {
  review_id: 101,
  student_id: 3,
  course_id: 1,
  rating: 5,
  comment: "Valid review test"
};

print("Testing valid review (should succeed):");
try {
  checkEnrollmentBeforeReview(validReview);
  print("Validation passed - student is enrolled");
} catch (e) {
  print(`Error: ${e.message}`);
}

// Test with invalid enrollment (student 6 is not enrolled in course 2)
const invalidReview = {
  review_id: 102,
  student_id: 6,
  course_id: 2,
  rating: 5,
  comment: "Invalid review test"
};

print("\nTesting invalid review (should fail):");
try {
  checkEnrollmentBeforeReview(invalidReview);
  print("Validation passed - but shouldn't have");
} catch (e) {
  print(`Expected error: ${e.message}`);
}

=== Testing check_enrollment_before_review ===
Testing valid review (should succeed):
Validation passed - student is enrolled

Testing invalid review (should fail):
Expected error: Student must be enrolled in the course to submit a review
// 4. Test update_completion_status function
print("\n=== Testing update_completion_status ===");

// First, check student Amantle's current progress in course 1
const enrollmentBefore = db.enrollments.findOne({ enrollment_id: 1 });
print(`Enrollment 1 completion_date before: ${enrollmentBefore?.completion_date}`); // Should be null
const studentBefore = db.users.findOne({ user_id: 3, "student.completed_courses": { $exists: true } });
print(`Student 3 completed_courses before: ${studentBefore?.student?.completed_courses}`); // Should be empty or not include course 1

// Get all lessons in course 1 - fixed version
const moduleIds = db.modules.find({ course_id: 1 }).toArray().map(m => m.module_id);
const course1Lessons = db.lessons.find({ module_id: { $in: moduleIds } }).toArray();

print(`Course 1 has ${course1Lessons.length} lessons`)

=== Testing update_completion_status ===
Enrollment 1 completion_date before: null
Student 3 completed_courses before: 
Course 1 has 5 lessons
//TESTING TEMPORAL DATA
print("\nTesting temporal features:");
const activeEnrollments = db.enrollments.find(
  { "enrollment_valid_to": { $gt: new Date() } },
  { enrollment_id: 1, student_id: 1, course_id: 1, enrollment_valid_from: 1, enrollment_valid_to: 1 }
).toArray();
printjson(activeEnrollments);

Testing temporal features:
[
  {
    _id: ObjectId('6838dc2cb7da03bcd9e48786'),
    enrollment_id: 1,
    student_id: 3,
    course_id: 1,
    enrollment_valid_from: 2025-05-29T22:14:04.084Z,
    enrollment_valid_to: 9999-12-31T23:59:59.999Z
  },
  {
    _id: ObjectId('6838dc2cb7da03bcd9e48787'),
    enrollment_id: 2,
    student_id: 3,
    course_id: 2,
    enrollment_valid_from: 2025-05-29T22:14:04.084Z,
    enrollment_valid_to: 9999-12-31T23:59:59.999Z
  },
  {
    _id: ObjectId('6838dc2cb7da03bcd9e48788'),
    enrollment_id: 3,
    student_id: 4,
    course_id: 2,
    enrollment_valid_from: 2025-05-29T22:14:04.084Z,
    enrollment_valid_to: 9999-12-31T23:59:59.999Z
  },
  {
    _id: ObjectId('6838dc2cb7da03bcd9e48789'),
    enrollment_id: 4,
    student_id: 6,
    course_id: 3,
    enrollment_valid_from: 2025-05-29T22:14:04.084Z,
    enrollment_valid_to: 9999-12-31T23:59:59.999Z
  },
  {
    _id: ObjectId('6838dc2cb7da03bcd9e4878a'),
    enrollment_id: 5,
    student_id: 6,
    course_id: 1,
    enrollment_valid_from: 2025-05-29T22:14:04.084Z,
    enrollment_valid_to: 9999-12-31T23:59:59.999Z
  }
]
//TESTING STORED PROCEDURES
print("\nTesting stored procedures and functions:");
// Test enroll_student_with_validation
try {
  const testStudentId = db.users.findOne({ user_type: "student" }).user_id;
  const testCourseId = db.courses.findOne().course_id;
  
  // Removes any existing enrollment
  db.enrollments.deleteOne({ student_id: testStudentId, course_id: testCourseId });
  
  // Test the enrollment
  print(`Attempting to enroll student ${testStudentId} in course ${testCourseId}`);
  enrollStudentWithValidation(testStudentId, testCourseId);
  
  // Verify the enrollment was created
  const enrollment = db.enrollments.findOne({ student_id: testStudentId, course_id: testCourseId });
  if (enrollment) {
    print(`Test passed: Student ${testStudentId} successfully enrolled in course ${testCourseId}`);
  } else {
    print("Test failed: Enrollment not created");
  }
} catch (e) {
  print(`Test failed with error: ${e.message}`);
}

Testing stored procedures and functions:
Attempting to enroll student 3 in course 1
Enrollment successful.
Test passed: Student 3 successfully enrolled in course 1
// Test get_student_analytics
print("\nTesting student analytics function:");
const testStudentId = db.users.findOne({ user_type: "student" }).user_id;
const analytics = getStudentAnalytics(testStudentId);
printjson(analytics);

if (analytics && typeof analytics.total_time_spent !== 'undefined' && 
    typeof analytics.average_score !== 'undefined') {
  print("Test passed: Analytics function returned valid data");
} else {
  print("Test failed: Missing expected analytics fields");
}

Testing student analytics function:
{
  total_time_spent: 0,
  average_score: 0,
  completion_rate: 0,
  total_courses: 2,
  generated_at: 2025-05-29T22:23:09.308Z
}
Test passed: Analytics function returned valid data
// Test audit log
print("\nTesting audit log:");
const initialLogCount = db.audit_logs.countDocuments();

// Create a test audit log entry
db.audit_logs.insertOne({
  table_name: "enrollment",
  operation: "INSERT",
  new_values: {
    student_id: db.users.findOne({ user_type: "student" }).user_id,
    course_id: db.courses.findOne().course_id,
    enrollment_date: new Date()
  },
  timestamp: new Date()
});

if (db.audit_logs.countDocuments() === initialLogCount + 1) {
  print("Test passed: Audit log entry successfully created");
} else {
  print("Test failed: Audit log entry not created");
}

// View recent audit log entries
print("\nRecent audit log entries:");
const recentAuditLogs = db.audit_logs.find().sort({ timestamp: -1 }).limit(5).toArray();
printjson(recentAuditLogs);

Testing audit log:
Test passed: Audit log entry successfully created

Recent audit log entries:
[
  {
    _id: ObjectId('6838dedeb7da03bcd9e4879b'),
    table_name: 'enrollment',
    operation: 'INSERT',
    new_values: {
      student_id: 3,
      course_id: 1,
      enrollment_date: 2025-05-29T22:25:34.983Z
    },
    timestamp: 2025-05-29T22:25:34.983Z
  }
]
//TEST PROGRESS TRACKING
print("\nTesting progress tracking:");
const studentProgress = db.progress.aggregate([
  {
    $match: { student_id: db.users.findOne({ user_type: "student" }).user_id }
  },
  {
    $lookup: {
      from: "lessons",
      localField: "lesson_id",
      foreignField: "lesson_id",
      as: "lesson"
    }
  },
  {
    $unwind: "$lesson"
  },
  {
    $lookup: {
      from: "modules",
      localField: "lesson.module_id",
      foreignField: "module_id",
      as: "module"
    }
  },
  {
    $unwind: "$module"
  },
  {
    $project: {
      student_id: 1,
      lesson_title: "$lesson.content.content_data",
      module_title: "$module.title",
      status: 1,
      completion_percentage: 1,
      time_spent: 1
    }
  }
]).toArray();
printjson(studentProgress);

Testing progress tracking:
[
  {
    _id: ObjectId('6838dc43b7da03bcd9e4878b'),
    student_id: 3,
    status: 'completed',
    time_spent: '35 minutes',
    completion_percentage: 100,
    lesson_title: 'https://example.com/video1',
    module_title: 'Programming Fundamentals'
  },
  {
    _id: ObjectId('6838dc43b7da03bcd9e4878c'),
    student_id: 3,
    status: 'completed',
    time_spent: '25 minutes',
    completion_percentage: 100,
    lesson_title: 'Introduction to variables and data types',
    module_title: 'Programming Fundamentals'
  },
  {
    _id: ObjectId('6838dc43b7da03bcd9e4878d'),
    student_id: 3,
    status: 'completed',
    time_spent: '20 minutes',
    completion_percentage: 100,
    lesson_title: 'Quiz on programming basics',
    module_title: 'Programming Fundamentals'
  },
  {
    _id: ObjectId('6838dc43b7da03bcd9e4878e'),
    student_id: 3,
    status: 'in_progress',
    time_spent: '15 minutes',
    completion_percentage: 50,
    lesson_title: 'https://example.com/video2',
    module_title: 'Data Structures'
  }
]
// Final verification summary
print("\n=== Verification Summary ===");
const collections = db.getCollectionNames().filter(c => !c.startsWith("system"));
let allTestsPassed = true;

collections.forEach(coll => {
  const count = db[coll].countDocuments();
  print(`${coll}: ${count} documents`);
  if (count === 0) {
    allTestsPassed = false;
    print(`  WARNING: ${coll} collection is empty!`);
  }
});

if (allTestsPassed) {
  print("\nAll verification tests passed successfully!");
} else {
  print("\nSome verification tests failed - please check the warnings above.");
}

db.users.updateOne(
  { user_id: 5, name: "John Smith" }, 
  {
    $set: {
      user_type: "instructor" 
    },
    $unset: {
      student: "" 
    }
  }
);

=== Verification Summary ===
FINAL: 0 documents
  WARNING: FINAL collection is empty!
notifications: 3 documents
lessons: 13 documents
attempts: 0 documents
  WARNING: attempts collection is empty!
users: 6 documents
modules: 6 documents
quizzes: 3 documents
reviews: 3 documents
progress: 8 documents
courses: 3 documents
enrollments: 5 documents
audit_logs: 1 documents

Some verification tests failed - please check the warnings above.
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}
//TASK 6
//PART A
db.enrollments.aggregate([
  {
    $match: {
      status: "active"
    }
  },
  {
    $lookup: {
      from: "courses",
      localField: "course_id",
      foreignField: "course_id",
      as: "course"
    }
  },
  {
    $unwind: "$course"
  },
  {
    $match: {
      "course.is_active": true
    }
  },
  {
    $lookup: {
      from: "users",
      localField: "student_id",
      foreignField: "user_id",
      as: "student"
    }
  },
  {
    $unwind: "$student"
  },
  {
    $lookup: {
      from: "modules",
      localField: "course_id",
      foreignField: "course_id",
      as: "modules"
    }
  },
  {
    $unwind: "$modules"
  },
  {
    $lookup: {
      from: "lessons",
      localField: "modules.module_id",
      foreignField: "module_id",
      as: "lessons"
    }
  },
  {
    $unwind: {
      path: "$lessons",
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $lookup: {
      from: "progress",
      let: {
        student_id: "$student_id",
        lesson_id: "$lessons.lesson_id"
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$student_id", "$$student_id"] },
                { $eq: ["$lesson_id", "$$lesson_id"] }
              ]
            },
            status: "completed"
          }
        }
      ],
      as: "completed_progress"
    }
  },
  {
    $group: {
      _id: {
        course_title: "$course.title",
        student_name: "$student.name",
        enrollment_date: "$enrollment_date",
        completion_date: "$completion_date"
      },
      total_lessons: {
        $sum: {
          $cond: [{ $ifNull: ["$lessons.lesson_id", false] }, 1, 0]
        }
      },
      completed_lessons: {
        $sum: {
          $size: "$completed_progress"
        }
      }
    }
  },
  {
    $match: {
      total_lessons: { $gt: 0 }
    }
  },
  {
    $project: {
      _id: 0,
      course_title: "$_id.course_title",
      student_name: "$_id.student_name",
      completed_lessons: 1,
      total_lessons: 1,
      completion_percentage: {
        $round: [
          {
            $multiply: [
              {
                $divide: [
                  "$completed_lessons",
                  "$total_lessons"
                ]
              },
              100
            ]
          },
          2
        ]
      },
      enrollment_date: "$_id.enrollment_date",
      completion_date: "$_id.completion_date"
    }
  },
  {
    $sort: {
      completion_percentage: -1
    }
  }
]);
{
  total_lessons: 5,
  completed_lessons: 3,
  course_title: 'Introduction to Programming',
  student_name: 'Kaone Watlhaga',
  completion_percentage: 60,
  enrollment_date: 2025-05-29T22:22:59.408Z,
  completion_date: null
}
{
  total_lessons: 4,
  completed_lessons: 2,
  course_title: 'Advanced Data Analysis',
  student_name: 'Boemo Marumo',
  completion_percentage: 50,
  enrollment_date: 2025-05-29T22:14:04.084Z,
  completion_date: null
}
{
  total_lessons: 4,
  completed_lessons: 1,
  course_title: 'Modern Web Development',
  student_name: 'Amantle Gaabatholwe',
  completion_percentage: 25,
  enrollment_date: 2025-05-29T22:14:04.084Z,
  completion_date: null
}
{
  total_lessons: 4,
  completed_lessons: 0,
  course_title: 'Advanced Data Analysis',
  student_name: 'Kaone Watlhaga',
  completion_percentage: 0,
  enrollment_date: 2025-05-29T22:14:04.084Z,
  completion_date: null
}
{
  total_lessons: 5,
  completed_lessons: 0,
  course_title: 'Introduction to Programming',
  student_name: 'Amantle Gaabatholwe',
  completion_percentage: 0,
  enrollment_date: 2025-05-29T22:14:04.084Z,
  completion_date: null
}
//PART B
const activeStudents = db.users.aggregate([
  {
    $match: {
      user_type: "student",
      is_active: true
    }
  },
  {
    $project: {
      user_id: 1,
      name: 1,
      email: 1,
      role: { $literal: "student" },
      join_date: "$student.enroll_date",
      contact_email: "$contact_info.primary_email"
    }
  }
]);

const activeInstructors = db.users.aggregate([
  {
    $match: {
      user_type: "instructor",
      is_active: true
    }
  },
  {
    $project: {
      user_id: 1,
      name: 1,
      email: 1,
      role: { $literal: "instructor" },
      join_date: "$instructor.hire_date",
      contact_email: "$contact_info.primary_email"
    }
  }
]);
print("Active Students:");
activeStudents.forEach(printjson);

print("\nActive Instructors:");
activeInstructors.forEach(printjson);
Active Students:
{
  _id: ObjectId('6838dbbeb7da03bcd9e48769'),
  user_id: 3,
  name: 'Kaone Watlhaga',
  email: 'kaone.watlhaga@example.com',
  role: 'student',
  join_date: 2025-05-29T22:12:14.121Z,
  contact_email: 'kaone.watlhaga@example.com'
}
{
  _id: ObjectId('6838dbbeb7da03bcd9e4876a'),
  user_id: 4,
  name: 'Boemo Marumo',
  email: 'boemo.marumo@example.com',
  role: 'student',
  join_date: 2025-05-29T22:12:14.121Z,
  contact_email: 'boemo.marumo@example.com'
}
{
  _id: ObjectId('6838dbbeb7da03bcd9e4876c'),
  user_id: 6,
  name: 'Amantle Gaabatholwe',
  email: 'amantle.gaabatholwe@example.com',
  role: 'student',
  join_date: 2025-05-29T22:12:14.121Z,
  contact_email: 'amantle.gaabatholwe@example.com'
}

Active Instructors:
{
  _id: ObjectId('6838dbbeb7da03bcd9e48767'),
  user_id: 1,
  name: 'Gibson Chengetanai',
  email: 'gibson.chengetanai@example.com',
  role: 'instructor',
  join_date: 2025-05-29T22:12:14.118Z,
  contact_email: 'gibson.chengetanai@example.com'
}
{
  _id: ObjectId('6838dbbeb7da03bcd9e48768'),
  user_id: 2,
  name: 'Keitumetse Gobotsamang',
  email: 'keitumetse.gobotsamang@example.com',
  role: 'instructor',
  join_date: 2025-05-29T22:12:14.121Z,
  contact_email: 'keitumetse.gobotsamang@example.com'
}
{
  _id: ObjectId('6838dbbeb7da03bcd9e4876b'),
  user_id: 5,
  name: 'John Smith',
  email: 'john.smith@example.com',
  role: 'instructor',
  join_date: 2025-05-29T22:12:14.121Z,
  contact_email: 'john.smith@example.com'
}
//PART C
db.users.aggregate([
  {
    $match: {
      user_type: "student"
    }
  },
  {
    $lookup: {
      from: "courses",
      localField: "student.completed_courses",
      foreignField: "course_id",
      as: "completed_courses_info"
    }
  },
  {
    $project: {
      _id: 0,
      student_name: "$name",
      num_completed_courses: {
        $size: {
          $ifNull: ["$student.completed_courses", []]
        }
      },
      completed_course_titles: {
        $map: {
          input: "$completed_courses_info",
          as: "course",
          in: "$$course.title"
        }
      }
    }
  },
  {
    $sort: {
      student_name: 1
    }
  }
]);
{
  student_name: 'Amantle Gaabatholwe',
  num_completed_courses: 0,
  completed_course_titles: []
}
{
  student_name: 'Boemo Marumo',
  num_completed_courses: 0,
  completed_course_titles: []
}
{
  student_name: 'Kaone Watlhaga',
  num_completed_courses: 0,
  completed_course_titles: []
}
//PART D
const sixMonthsAgo = new Date();
sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

db.enrollments.aggregate([
  {
    $match: {
      enrollment_valid_from: { $lte: new Date() },
      enrollment_valid_to: { $gt: new Date() },
      $or: [
        { enrollment_date: { $gte: sixMonthsAgo } },
        { 
          $and: [
            { completion_date: { $ne: null } },
            { completion_date: { $gte: sixMonthsAgo } }
          ]
        }
      ]
    }
  },
  {
    $lookup: {
      from: "users",
      localField: "student_id",
      foreignField: "user_id",
      as: "student"
    }
  },
  {
    $unwind: "$student"
  },
  {
    $lookup: {
      from: "courses",
      localField: "course_id",
      foreignField: "course_id",
      as: "course"
    }
  },
  {
    $unwind: "$course"
  },
  {
    $project: {
      _id: 0,
      student_name: "$student.name",
      course_title: "$course.title",
      enrollment_date: 1,
      completion_date: 1,
      enrollment_duration: {
        $divide: [
          {
            $subtract: [
              { $ifNull: ["$completion_date", new Date()] },
              "$enrollment_date"
            ]
          },
          1000 * 60 * 60 * 24 // Converts milliseconds to days
        ]
      },
      enrollment_valid_from: 1,
      enrollment_valid_to: 1,
      enrollment_status: {
        $cond: {
          if: { $eq: ["$enrollment_valid_to", ISODate("9999-12-31T23:59:59.999Z")] },
          then: "Current",
          else: "Expired"
        }
      }
    }
  },
  {
    $sort: {
      enrollment_duration: -1
    }
  }
]);
{
  enrollment_date: 2025-05-29T22:14:04.084Z,
  completion_date: null,
  enrollment_valid_from: 2025-05-29T22:14:04.084Z,
  enrollment_valid_to: 9999-12-31T23:59:59.999Z,
  student_name: 'Kaone Watlhaga',
  course_title: 'Advanced Data Analysis',
  enrollment_duration: 0.015260231481481482,
  enrollment_status: 'Current'
}
{
  enrollment_date: 2025-05-29T22:14:04.084Z,
  completion_date: null,
  enrollment_valid_from: 2025-05-29T22:14:04.084Z,
  enrollment_valid_to: 9999-12-31T23:59:59.999Z,
  student_name: 'Boemo Marumo',
  course_title: 'Advanced Data Analysis',
  enrollment_duration: 0.015260231481481482,
  enrollment_status: 'Current'
}
{
  enrollment_date: 2025-05-29T22:14:04.084Z,
  completion_date: null,
  enrollment_valid_from: 2025-05-29T22:14:04.084Z,
  enrollment_valid_to: 9999-12-31T23:59:59.999Z,
  student_name: 'Amantle Gaabatholwe',
  course_title: 'Modern Web Development',
  enrollment_duration: 0.015260231481481482,
  enrollment_status: 'Current'
}
{
  enrollment_date: 2025-05-29T22:14:04.084Z,
  completion_date: null,
  enrollment_valid_from: 2025-05-29T22:14:04.084Z,
  enrollment_valid_to: 9999-12-31T23:59:59.999Z,
  student_name: 'Amantle Gaabatholwe',
  course_title: 'Introduction to Programming',
  enrollment_duration: 0.015260231481481482,
  enrollment_status: 'Current'
}
{
  enrollment_date: 2025-05-29T22:22:59.408Z,
  completion_date: null,
  enrollment_valid_from: 2025-05-29T22:22:59.408Z,
  enrollment_valid_to: 9999-12-31T23:59:59.999Z,
  student_name: 'Kaone Watlhaga',
  course_title: 'Introduction to Programming',
  enrollment_duration: 0.009064351851851851,
  enrollment_status: 'Current'
}
//PART E
db.progress.aggregate([
  {
    $lookup: {
      from: "lessons",
      localField: "lesson_id",
      foreignField: "lesson_id",
      as: "lesson"
    }
  },
  {
    $unwind: "$lesson"
  },
  {
    $lookup: {
      from: "modules",
      localField: "lesson.module_id",
      foreignField: "module_id",
      as: "module"
    }
  },
  {
    $unwind: "$module"
  },
  {
    $lookup: {
      from: "courses",
      localField: "module.course_id",
      foreignField: "course_id",
      as: "course"
    }
  },
  {
    $unwind: "$course"
  },
  {
    $group: {
      _id: {
        course_title: "$course.title",
        module_title: "$module.title",
        progress_status: "$status"
      },
      lesson_count: { $sum: 1 },
      total_minutes_spent: {
        $sum: {
          $divide: [
            {
              $subtract: [
                { $ifNull: ["$end_time", new Date()] },
                { $ifNull: ["$start_time", new Date()] }
              ]
            },
            1000 * 60 // Convert milliseconds to minutes
          ]
        }
      },
      avg_completion_percentage: { $avg: "$completion_percentage" }
    }
  },
  {
    $match: {
      lesson_count: { $gt: 0 }
    }
  },
  {
    $project: {
      _id: 0,
      course_title: "$_id.course_title",
      module_title: "$_id.module_title",
      progress_status: "$_id.progress_status",
      lesson_count: 1,
      total_minutes_spent: { $round: ["$total_minutes_spent", 2] },
      avg_completion_percentage: { $round: ["$avg_completion_percentage", 2] }
    }
  },
  {
    $sort: {
      course_title: 1,
      module_title: 1,
      progress_status: 1
    }
  }
]);

const progressAnalysis = db.progress.aggregate([
]);
{
  lesson_count: 2,
  course_title: 'Advanced Data Analysis',
  module_title: 'Data Cleaning',
  progress_status: 'completed',
  total_minutes_spent: 0,
  avg_completion_percentage: 100
}
{
  lesson_count: 1,
  course_title: 'Introduction to Programming',
  module_title: 'Data Structures',
  progress_status: 'in_progress',
  total_minutes_spent: 0,
  avg_completion_percentage: 50
}
{
  lesson_count: 3,
  course_title: 'Introduction to Programming',
  module_title: 'Programming Fundamentals',
  progress_status: 'completed',
  total_minutes_spent: 0,
  avg_completion_percentage: 100
}
{
  lesson_count: 1,
  course_title: 'Modern Web Development',
  module_title: 'HTML & CSS Basics',
  progress_status: 'completed',
  total_minutes_spent: 0,
  avg_completion_percentage: 100
}
{
  lesson_count: 1,
  course_title: 'Modern Web Development',
  module_title: 'HTML & CSS Basics',
  progress_status: 'in_progress',
  total_minutes_spent: 0,
  avg_completion_percentage: 50
}
FINAL_ADT

