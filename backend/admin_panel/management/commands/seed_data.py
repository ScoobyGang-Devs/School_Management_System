import random
import io
from datetime import timedelta
from faker import Faker
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from django.db import IntegrityError
from django.core.files.base import ContentFile
from PIL import Image as PilImage

# --- IMPORTS ---
# Ensure these paths match your project structure
from admin_panel.models import (
    Classroom, 
    StaffNIC, 
    GuardianDetail, 
    StudentDetail, 
    TeacherDetail,
    ClassSubjectAssignment,
    AdminProfile
)

# Try imports for apps that might not be migrated yet
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
    from SystemSettings.models import SchoolDetail
except ImportError:
    class SchoolDetail: pass

try:
    from term_test.models import TermName, Subject, TermTest, SubjectwiseMark
except ImportError:
    class TermName: pass
    class Subject: pass
    class TermTest: pass
    class SubjectwiseMark: pass

# --- Configuration ---
NUM_TEACHERS = 50
NUM_ADMINS = 5 # Principal, VP, etc.
NUM_GUARDIANS = 200
NUM_STUDENTS = 300
NUM_SUBJECTS = 8 

FAKE = Faker() 
PHONE_PREFIXES = ['+9471', '+9477', '+9478', '+9472']

class Command(BaseCommand):
    help = 'Seeds the database with mock data for all applications.'

    def _generate_phone(self):
        """Generates a phone number matching the +<9-15 digits> regex."""
        prefix = random.choice(PHONE_PREFIXES)
        return prefix + str(random.randint(1000000, 9999999))
    
    def _create_dummy_png(self):
        """Creates a small valid PNG in memory to satisfy validators."""
        image = PilImage.new('RGB', (100, 100), color=(73, 109, 137))
        img_io = io.BytesIO()
        image.save(img_io, format='PNG')
        return ContentFile(img_io.getvalue(), name='signature.png')

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("--- Starting Database Seeding ---"))

        # --- 1. Cleanup Old Data ---
        self.stdout.write(self.style.WARNING("Clearing existing data..."))
        
        # Transactional
        if hasattr(SubjectwiseMark, 'objects'): SubjectwiseMark.objects.all().delete()
        if hasattr(TermTest, 'objects'): TermTest.objects.all().delete()
        if hasattr(teacherAttendence, 'objects'): teacherAttendence.objects.all().delete()
        if hasattr(studentAttendence, 'objects'): studentAttendence.objects.all().delete()
        if hasattr(Message, 'objects'): Message.objects.all().delete()
        
        # Relationships
        ClassSubjectAssignment.objects.all().delete()

        # Core Entities
        StudentDetail.objects.all().delete()
        TeacherDetail.objects.all().delete()
        AdminProfile.objects.all().delete() # New
        GuardianDetail.objects.all().delete()
        if hasattr(SchoolDetail, 'objects'): SchoolDetail.objects.all().delete() # New
        
        # Lookups
        Classroom.objects.all().delete()
        StaffNIC.objects.all().delete()
        User.objects.filter(is_superuser=False).delete()
        
        if hasattr(TermName, 'objects'): TermName.objects.all().delete()
        if hasattr(Subject, 'objects'): Subject.objects.all().delete()
        
        self.stdout.write(self.style.WARNING("Cleanup complete."))

        # --- 2. Seed Independent Entities ---
        # Generate enough NICs for Teachers AND Admins
        nics = self._seed_staff_nics(NUM_TEACHERS + NUM_ADMINS) 
        classes = self._seed_classrooms()
        guardians = self._seed_guardians()
        
        terms = self._seed_terms() if hasattr(TermName, 'objects') else []
        subjects = self._seed_subjects() if hasattr(Subject, 'objects') else []
        
        if hasattr(SchoolDetail, 'objects'): self._seed_school_details()

        # --- 3. Seed Core Entities ---
        # Split NICs list
        teacher_nics = nics[:NUM_TEACHERS]
        admin_nics = nics[NUM_TEACHERS:]

        teachers = self._seed_teachers(teacher_nics, classes)
        self._seed_admins(admin_nics) # New Admin Profile Seeder
        
        students = self._seed_students(guardians, classes) 

        # --- 4. Seed Relationships & Assignments ---
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

    def _seed_staff_nics(self, count):
        self.stdout.write("Seeding Staff NICs...")
        nics = []
        for i in range(count):
            nic_number = FAKE.unique.bothify(text='#########v') if random.random() < 0.5 else FAKE.unique.bothify(text='############')
            nic = StaffNIC.objects.create(
                nic_number=nic_number,
                is_used=False
            )
            nics.append(nic)
        FAKE.unique.clear()
        return nics

    def _seed_classrooms(self):
        self.stdout.write("Seeding Classrooms...")
        classes = []
        for grade in range(6, 12): 
            for class_name in ['A', 'B', 'C']:
                c = Classroom.objects.create(
                    className=class_name,
                    grade=grade
                )
                classes.append(c)
        return classes

    def _seed_guardians(self):
        self.stdout.write("Seeding Guardians...")
        guardians = []
        title_choices = [c[0] for c in GuardianDetail.TITLE_CHOICES]
        type_choices = [c[0] for c in GuardianDetail.GUARDIAN]
        
        for _ in range(NUM_GUARDIANS):
            guardian_type = random.choice(type_choices)
            name = FAKE.name_female() if guardian_type in ['M', 'G'] else FAKE.name_male()
            
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

    def _seed_teachers(self, nics, classes):
        self.stdout.write("Seeding Teachers...")
        teachers = []
        assigned_classes = list(classes) # Copy list to pop from
        
        for nic_obj in nics:
            nic_obj.is_used = True
            nic_obj.save()

            username = FAKE.user_name() + str(nic_obj.id)
            user = User.objects.create_user(
                username=username,
                email=FAKE.unique.email(),
                password='password123'
            )

            first_name = FAKE.first_name()
            last_name = FAKE.last_name()
            
            # Logic: Assign 1 class as "Class Teacher" if available
            assigned_class = None
            if assigned_classes:
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
                section=random.choice(['Junior', 'Senior']),
                assignedClass=assigned_class
            )
            
            # M2M teachingClasses
            teaching_classes = [assigned_class] if assigned_class else []
            other_classes = [c for c in classes if c not in teaching_classes]
            if other_classes:
                teaching_classes.extend(random.sample(other_classes, k=min(3, len(other_classes))))
            
            t.teachingClasses.set(teaching_classes)
            teachers.append(t)
        return teachers

    def _seed_admins(self, nics):
        self.stdout.write("Seeding Admin Profiles...")
        
        positions = list(AdminProfile.POSITONS.keys()) # ['Principal', 'Vice Principal', etc.]
        
        for i, nic_obj in enumerate(nics):
            nic_obj.is_used = True
            nic_obj.save()

            username = f"admin_{i}"
            user = User.objects.create_user(
                username=username,
                email=FAKE.unique.email(),
                password='password123'
            )

            # Assign specific roles based on index
            if i == 0: position = 'Principal'
            elif i == 1: position = 'Vice Principal'
            else: position = 'Section Head'

            AdminProfile.objects.create(
                owner=user,
                nic_number=nic_obj,
                title='Mr' if i % 2 == 0 else 'Mrs',
                nameWithInitials=FAKE.name(),
                fullName=FAKE.name(),
                dateOfBirth=FAKE.date_of_birth(minimum_age=35, maximum_age=60),
                gender='M' if i % 2 == 0 else 'F',
                email=user.email,
                address=FAKE.address(),
                enrollmentDate=FAKE.date_this_decade(),
                mobileNumber=self._generate_phone(),
                position=position
            )

    def _seed_students(self, guardians, classes):
        self.stdout.write("Seeding Students...")
        students = []
        for i in range(NUM_STUDENTS):
            unique_index = 20000 + i 
            
            s = StudentDetail.objects.create(
                indexNumber=unique_index, 
                guardian=random.choice(guardians),
                nameWithInitials=FAKE.name(),
                fullName=FAKE.name(),
                dateOfBirth=FAKE.date_of_birth(minimum_age=11, maximum_age=17),
                gender=random.choice(['M', 'F']),
                email=FAKE.unique.email(),
                address=FAKE.address(),
                enrollmentDate=FAKE.date_this_decade(),
                mobileNumber=self._generate_phone(),
                enrolledClass=random.choice(classes)
            )
            students.append(s)
        FAKE.unique.clear() 
        return students
    
    def _seed_school_details(self):
        self.stdout.write("Seeding School Details...")
        # Create one active principal
        SchoolDetail.objects.create(
            schoolName="Moratuwa Central College",
            motto="Wisdom is Power",
            principalName="Mrs. S. Perera",
            principlSignature=self._create_dummy_png(),
            isActive=True
        )

    def _seed_terms(self):
        if not hasattr(TermName, 'objects'): return []
        terms = []
        for choice in [c[0] for c in TermName.TERM_CHOICES]:
            t = TermName.objects.create(termName=choice)
            terms.append(t)
        return terms

    def _seed_subjects(self):
        if not hasattr(Subject, 'objects'): return []
        subjects = []
        names = ['Maths', 'Science', 'English', 'History', 'ICT', 'Religion']
        for name in names:
            s = Subject.objects.create(subjectName=name)
            subjects.append(s)
        return subjects

    def _seed_class_subject_assignments(self, teachers, classes, subjects):
        self.stdout.write("Seeding Class-Subject Assignments...")
        assigned_pairs = set() 

        for class_obj in classes:
            for subject in subjects:
                if (class_obj.pk, subject.pk) in assigned_pairs: continue

                eligible_teachers = [t for t in teachers if class_obj in t.teachingClasses.all()]
                teacher = random.choice(eligible_teachers) if eligible_teachers else random.choice(teachers)

                try:
                    ClassSubjectAssignment.objects.create(
                        teacher=teacher,
                        classroom=class_obj,
                        subject=subject
                    )
                    assigned_pairs.add((class_obj.pk, subject.pk))
                except IntegrityError:
                    pass 

    def _seed_attendance(self, teachers, students, classes):
        if not hasattr(teacherAttendence, 'objects'): return
        self.stdout.write("Seeding Attendance...")
        
        today = timezone.now().date()
        
        # 1. Teacher Attendance
        for i in range(14): # Past 2 weeks
            date = today - timedelta(days=i)
            if date.weekday() >= 5: continue 
            for teacher in teachers:
                teacherAttendence.objects.create(
                    teacher_id=teacher,
                    date=date,
                    status="P" if random.random() < 0.9 else "A"
                )

        # 2. Student Attendance
        if hasattr(studentAttendence, 'objects'):
            students_by_class = {}
            for student in students:
                ck = student.enrolledClass.pk
                if ck not in students_by_class: students_by_class[ck] = []
                students_by_class[ck].append(student)

            for i in range(14): 
                date = today - timedelta(days=i)
                if date.weekday() >= 5: continue 
                
                for class_obj in classes:
                    c_students = students_by_class.get(class_obj.pk, [])
                    total = len(c_students)
                    if total == 0: continue

                    # Mark some absent
                    num_absent = random.randint(0, int(total * 0.1))
                    absent_students = random.sample(c_students, num_absent)
                    absent_ids = [s.indexNumber for s in absent_students]
                    
                    perc = round(((total - num_absent) / total) * 100, 2)

                    try:
                        studentAttendence.objects.create(
                            className=class_obj,
                            date=date,
                            isMarked=True,
                            presentPercentage=perc,
                            absentList=absent_ids
                        )
                    except IntegrityError:
                        pass
    
    def _seed_messages(self, teachers, students):
        if not hasattr(Message, 'objects'): return
        self.stdout.write("Seeding Messages...")
        
        # Collect emails
        teacher_emails = [t.email for t in teachers if t.email]
        student_emails = [s.email for s in students if s.email]
        all_emails = teacher_emails + student_emails
        
        categories = [c[0] for c in Message.CATEGORY_CHOICES]

        for _ in range(30):
            sender = random.choice(teachers)
            
            # Select random recipients (emails)
            num_recipients = random.randint(1, 4)
            recipients_list = random.sample(all_emails, min(num_recipients, len(all_emails)))
            
            # Generate read status dictionary
            read_status = {}
            for email in recipients_list:
                if random.choice([True, False]):
                    read_status[email] = timezone.now().isoformat()

            Message.objects.create(
                sender_teacher=sender,  # Using ForeignKey now
                recipients=recipients_list, # JSON field
                subject=FAKE.sentence(nb_words=4),
                content=FAKE.paragraph(nb_sentences=2),
                category=random.choice(categories),
                urgent=FAKE.boolean(chance_of_getting_true=15),
                read_status=read_status
            )

    def _seed_term_tests(self, students, terms):
        if not hasattr(TermTest, 'objects'): return []
        self.stdout.write("Seeding Term Tests...")
        termtests = []
        for student in students:
            for term in terms:
                total = random.randint(200, 800)
                tt = TermTest.objects.create(
                    student=student,
                    term=term,
                    total=total,
                    average=round(total / NUM_SUBJECTS, 2),
                )
                termtests.append(tt)
        return termtests

    def _seed_subjectwise_marks(self, students, teachers, terms, subjects):
        if not hasattr(SubjectwiseMark, 'objects'): return
        self.stdout.write("Seeding Marks...")

        for student in students:
            for term in terms:
                for subject in subjects:
                    # Find assigned teacher or fallback
                    assignment = ClassSubjectAssignment.objects.filter(
                        classroom=student.enrolledClass, subject=subject
                    ).first()
                    teacher = assignment.teacher if assignment else random.choice(teachers)
                    
                    SubjectwiseMark.objects.create(
                        subject=subject,
                        studentID=student,
                        term=term,
                        marksObtained=round(random.uniform(35, 100), 2),
                        teacherID=teacher,
                    )