import random
from datetime import timedelta
from faker import Faker
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from django.db import IntegrityError

# --- IMPORTS ---
# Ensure these paths match your project structure
from admin_panel.models import (
    Classroom, 
    TeacherNIC, 
    GuardianDetail, 
    StudentDetail, 
    TeacherDetail,
    ClassSubjectAssignment # Added missing model
)

# Use try/except blocks to handle cases where apps might not be installed yet
try:
    from attendence.models import teacherAttendence, studentAttendence
except ImportError:
    class teacherAttendence: pass
    class studentAttendence: pass

try:
    from chat.models import Message
except ImportError:
    class Message: pass

try:
    from term_test.models import TermName, Subject, TermTest, SubjectwiseMark
except ImportError:
    class TermName: pass
    class Subject: pass
    class TermTest: pass
    class SubjectwiseMark: pass

# --- Configuration ---
NUM_TEACHERS = 70
NUM_GUARDIANS = 600
NUM_STUDENTS = 800
NUM_SUBJECTS = 8 

FAKE = Faker() 
PHONE_PREFIXES = ['+9471', '+9477', '+9478', '+9472']

class Command(BaseCommand):
    help = 'Seeds the database with mock data for all applications.'

    def _generate_phone(self):
        """Generates a phone number matching the +<9-15 digits> regex."""
        prefix = random.choice(PHONE_PREFIXES)
        return prefix + str(random.randint(1000000, 9999999))

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("--- Starting Database Seeding ---"))

        # --- 1. Cleanup Old Data ---
        self.stdout.write(self.style.WARNING("Clearing existing data..."))
        
        # Delete Transactional Data first
        if hasattr(SubjectwiseMark, 'objects'): SubjectwiseMark.objects.all().delete()
        if hasattr(TermTest, 'objects'): TermTest.objects.all().delete()
        if hasattr(teacherAttendence, 'objects'): teacherAttendence.objects.all().delete()
        if hasattr(studentAttendence, 'objects'): studentAttendence.objects.all().delete()
        if hasattr(Message, 'objects'): Message.objects.all().delete()
        
        # Delete Assignments
        ClassSubjectAssignment.objects.all().delete()

        # Delete Core Entities
        StudentDetail.objects.all().delete()
        TeacherDetail.objects.all().delete()
        GuardianDetail.objects.all().delete()
        
        # Delete Lookups
        Classroom.objects.all().delete()
        TeacherNIC.objects.all().delete()
        User.objects.filter(is_superuser=False).delete()
        
        if hasattr(TermName, 'objects'): TermName.objects.all().delete()
        if hasattr(Subject, 'objects'): Subject.objects.all().delete()
        
        self.stdout.write(self.style.WARNING("Cleanup complete."))

        # --- 2. Seed Independent Entities ---
        users = self._seed_users()
        classes = self._seed_classrooms()
        nics = self._seed_teacher_nics() 
        guardians = self._seed_guardians()
        
        terms = self._seed_terms() if hasattr(TermName, 'objects') else []
        subjects = self._seed_subjects() if hasattr(Subject, 'objects') else []

        # --- 3. Seed Core Entities ---
        teachers = self._seed_teachers(users, nics, classes)
        students = self._seed_students(guardians, classes) 

        # --- 4. Seed Relationships & Assignments ---
        # This populates the ClassSubjectAssignment table
        if subjects:
            self._seed_class_subject_assignments(teachers, classes, subjects)

        # --- 5. Seed Transactional Data ---
        self._seed_attendance(teachers, students, classes) 
        self._seed_messages(teachers, students)
        
        if terms: 
            self._seed_term_tests(students, terms)

        if terms and subjects: 
            self._seed_subjectwise_marks(students, teachers, terms, subjects)

        self.stdout.write(self.style.SUCCESS('--- Database Seeding Complete! ---'))

    # ----------------------------------------------------------------------
    # Helper Functions
    # ----------------------------------------------------------------------

    def _seed_users(self):
        self.stdout.write("Seeding Users...")
        users = []
        for i in range(NUM_TEACHERS):
            username = FAKE.user_name() + str(i)
            user = User.objects.create_user(
                username=username,
                email=FAKE.unique.email(), 
                password='password123'
            )
            users.append(user)
        return users

    def _seed_classrooms(self):
        self.stdout.write("Seeding Classrooms...")
        classes = []
        for grade in range(6, 12): 
            for class_name in ['A', 'B', 'C','D']:
                c = Classroom.objects.create(
                    className=class_name,
                    grade=grade
                )
                classes.append(c)
        return classes

    def _seed_teacher_nics(self):
        self.stdout.write("Seeding Teacher NICs...")
        nics = []
        for i in range(NUM_TEACHERS):
            nic_number = FAKE.unique.bothify(text='#########v') if random.random() < 0.5 else FAKE.unique.bothify(text='############')
            nic = TeacherNIC.objects.create(
                nic_number=nic_number,
                is_used=False
            )
            nics.append(nic)
        FAKE.unique.clear()
        return nics

    def _seed_guardians(self):
        self.stdout.write("Seeding Guardians...")
        guardians = []
        title_choices = [c[0] for c in GuardianDetail.TITLE_CHOICES]
        type_choices = [c[0] for c in GuardianDetail.GUARDIAN]
        
        for _ in range(NUM_GUARDIANS):
            guardian_type = random.choice(type_choices)
            if guardian_type in ['M', 'G']: 
                 name = FAKE.name_female()
            else: 
                 name = FAKE.name_male()
            
            g = GuardianDetail.objects.create(
                title=random.choice(title_choices),
                guardianNIC=FAKE.unique.ssn(), 
                guardianName=name,
                guardianType=guardian_type,
                guardianEmail=FAKE.unique.email(), 
                permanentAddress=FAKE.address(),
                currentAddress=FAKE.address(),
                guardianContactNumber=self._generate_phone(),
                alternativeContactNumber=self._generate_phone(),
                jobTitle=FAKE.job()
            )
            guardians.append(g)
        FAKE.unique.clear()
        return guardians

    def _seed_teachers(self, users, nics, classes):
        self.stdout.write("Seeding Teachers...")
        teachers = []
        assigned_classes = list(classes) 
        
        for i, user in enumerate(users):
            if i >= len(nics): break 
            
            nic_obj = nics[i]
            nic_obj.is_used = True
            nic_obj.save()

            first_name = FAKE.first_name()
            last_name = FAKE.last_name()
            
            assigned_class = None
            if assigned_classes:
                # Assign 1 class as the "Class Teacher" for
                assigned_class = assigned_classes.pop(random.randrange(len(assigned_classes)))
            
            t = TeacherDetail.objects.create(
                owner=user,
                nic_number=nic_obj,
                title=random.choice([c[0] for c in TeacherDetail.TITLE_CHOICES]),
                nameWithInitials=f"{first_name} {last_name[0]}.",
                fullName=f"{first_name} {last_name}",
                dateOfBirth=FAKE.date_of_birth(minimum_age=25, maximum_age=55),
                gender=random.choice([c[0] for c in TeacherDetail.GENDER.items()]),
                email=user.email,
                address=FAKE.address(),
                enrollmentDate=FAKE.date_this_decade(),
                mobileNumber=self._generate_phone(),
                section=random.choice(['Primary', 'Junior Secondary', 'Senior Secondary']),
                assignedClass=assigned_class
            )
            
            # Populate M2M teachingClasses field
            teaching_classes = [assigned_class] if assigned_class else []
            other_classes = [c for c in classes if c not in teaching_classes]
            num_to_add = random.randint(1, 4)
            if other_classes:
                teaching_classes.extend(random.sample(other_classes, min(num_to_add, len(other_classes))))
            
            t.teachingClasses.set(teaching_classes)
            teachers.append(t)
        return teachers

    def _seed_students(self, guardians, classes):
        self.stdout.write("Seeding Students...")
        students = []
        for i in range(NUM_STUDENTS):
            first_name = FAKE.first_name()
            last_name = FAKE.last_name()
            
            unique_index = 100000 + i 
            
            s = StudentDetail.objects.create(
                indexNumber=unique_index, 
                guardian=random.choice(guardians),
                nameWithInitials=f"{first_name} {last_name[0]}.",
                fullName=f"{first_name} {last_name}",
                dateOfBirth=FAKE.date_of_birth(minimum_age=11, maximum_age=17),
                gender=random.choice([c[0] for c in StudentDetail.GENDER.items()]),
                email=FAKE.unique.email(),
                address=FAKE.address(),
                enrollmentDate=FAKE.date_this_decade(),
                mobileNumber=self._generate_phone(),
                enrolledClass=random.choice(classes)
            )
            students.append(s)
        FAKE.unique.clear() 
        return students

    def _seed_terms(self):
        self.stdout.write("Seeding Terms...")
        terms = []
        if not hasattr(TermName, 'objects'): return []
        for choice in [c[0] for c in TermName.TERM_CHOICES]:
            t = TermName.objects.create(termName=choice)
            terms.append(t)
        return terms

    def _seed_subjects(self):
        self.stdout.write("Seeding Subjects...")
        subjects = []
        if not hasattr(Subject, 'objects'): return []
        subject_names = [
            'Mathematics', 'Science', 'English Language', 'Sinhala Language',
            'History', 'Geography', 'Information Technology', 'Art'
        ]
        for name in subject_names:
            s = Subject.objects.create(subjectName=name)
            subjects.append(s)
        return subjects

    def _seed_class_subject_assignments(self, teachers, classes, subjects):
        """
        Seeds the ClassSubjectAssignment junction table.
        This ensures every class has teachers assigned to subjects.
        """
        self.stdout.write("Seeding Class-Subject Assignments...")
        
        # To satisfy unique_together = ('classroom', 'subject'), keep track of what's assigned
        assigned_pairs = set() 

        for class_obj in classes:
            # Ensure every subject has a teacher for every class
            for subject in subjects:
                if (class_obj.pk, subject.pk) in assigned_pairs:
                    continue

                # Try to find a teacher who lists this class in their 'teachingClasses'
                # This makes the data consistent with the TeacherDetail model
                eligible_teachers = [
                    t for t in teachers 
                    if class_obj in t.teachingClasses.all()
                ]
                
                # If no specific teacher found, pick a random teacher (fallback)
                teacher = random.choice(eligible_teachers) if eligible_teachers else random.choice(teachers)

                try:
                    ClassSubjectAssignment.objects.create(
                        teacher=teacher,
                        classroom=class_obj,
                        subject=subject
                    )
                    assigned_pairs.add((class_obj.pk, subject.pk))
                except IntegrityError:
                    pass # Skip duplicates if they somehow happen

    def _seed_attendance(self, teachers, students, classes):
        if not hasattr(teacherAttendence, 'objects') and not hasattr(studentAttendence, 'objects'): return
        self.stdout.write("Seeding Attendance records...")
        
        today = timezone.now().date()
        
        # 1. Seed Teacher Attendance
        if hasattr(teacherAttendence, 'objects'):
            for i in range(30):
                date = today - timedelta(days=i)
                if date.weekday() >= 5: continue # Skip weekends
                for teacher in teachers:
                    teacherAttendence.objects.create(
                        teacher_id=teacher,
                        date=date,
                        status="Present" if random.random() < 0.95 else "Absent"
                    )

        # 2. Seed Student Attendance (Aggregate Model)
        if hasattr(studentAttendence, 'objects'):
            # Group students by class for efficiency
            students_by_class = {}
            for student in students:
                class_key = student.enrolledClass.pk
                if class_key not in students_by_class:
                    students_by_class[class_key] = []
                students_by_class[class_key].append(student)

            for i in range(30): # Last 30 days
                date = today - timedelta(days=i)
                if date.weekday() >= 5: continue # Skip weekends
                
                for class_obj in classes:
                    class_students = students_by_class.get(class_obj.pk, [])
                    total_students = len(class_students)

                    if total_students == 0:
                        present_percentage = 0.0
                        absent_list = []
                    else:
                        # Randomly mark 5-15% of students absent
                        # Note: Sometimes 0 absent for realistic data
                        if random.random() > 0.2:
                            num_absent = random.randint(0, int(total_students * 0.15))
                        else:
                            num_absent = 0
                            
                        absent_students = random.sample(class_students, num_absent)
                        
                        # Store only Index Numbers in the JSON list
                        absent_list = [s.indexNumber for s in absent_students]
                        
                        present_count = total_students - num_absent
                        present_percentage = round((present_count / total_students) * 100, 2)

                    studentAttendence.objects.create(
                        className=class_obj,
                        date=date,
                        isMarked=True,
                        presentPercentage=present_percentage,
                        absentList=absent_list
                    )
    
    def _seed_messages(self, teachers, students):
        if not hasattr(Message, 'objects'): return
        self.stdout.write("Seeding Message records...")
        
        teacher_emails = [t.email for t in teachers]
        student_emails = [s.email for s in students]
        all_emails = teacher_emails + student_emails
        
        category_choices = [c[0] for c in Message.CATEGORY_CHOICES]

        for i in range(30):
            sender = random.choice(teachers) 
            receivers = random.sample(all_emails, random.randint(2, min(5, len(all_emails)))) 
            
            # Create a read_status dictionary: { "email": "timestamp" }
            read_status = {email: FAKE.date_time_this_month().isoformat() for email in receivers[:random.randint(0, len(receivers))]}
            
            Message.objects.create(
                sender=sender.fullName,
                sender_email=sender.email,
                receivers=receivers,
                subject=FAKE.catch_phrase(),
                content=FAKE.paragraph(nb_sentences=3),
                category=random.choice(category_choices),
                urgent=FAKE.boolean(chance_of_getting_true=20),
                read_status=read_status
            )

    def _seed_term_tests(self, students, terms):
        if not hasattr(TermTest, 'objects'): return []
        self.stdout.write("Seeding Term Tests...")
        termtests = []
        for student in students:
            for term in terms:
                total = random.randint(400, 800)
                average = total / NUM_SUBJECTS
                
                tt = TermTest.objects.create(
                    student=student,
                    term=term,
                    total=total,
                    average=round(average, 2),
                    rank=None 
                )
                termtests.append(tt)
        return termtests

    def _seed_subjectwise_marks(self, students, teachers, terms, subjects):
        if not hasattr(SubjectwiseMark, 'objects'): return
        self.stdout.write("Seeding Subject-wise Marks...")
        
        if not terms or not subjects: return

        for student in students:
            for term in terms:
                for subject in subjects:
                    # Try to find the teacher assigned to this subject for this student's class
                    try:
                        assignment = ClassSubjectAssignment.objects.filter(
                            classroom=student.enrolledClass,
                            subject=subject
                        ).first()
                        teacher = assignment.teacher if assignment else random.choice(teachers)
                    except:
                        teacher = random.choice(teachers)
                    
                    SubjectwiseMark.objects.create(
                        subject=subject,
                        studentID=student,
                        term=term,
                        marksObtained=round(random.uniform(35, 100), 2),
                        teacherID=teacher,
                    )