# In: admin_panel/management/commands/populate_db.py

import random
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from faker import Faker
from admin_panel.models import (
    Classroom, TeacherNIC, GuardianDetail, StudentDetail, TeacherDetail
)
from django.db import transaction

# Initialize Faker
fake = Faker()

class Command(BaseCommand):
    help = 'Populates the database with realistic fake data'

    @transaction.atomic
    def handle(self, *args, **kwargs):
        self.stdout.write('Deleting old data...')
        
        # Delete in reverse order of creation to avoid FK constraint errors
        StudentDetail.objects.all().delete()
        TeacherDetail.objects.all().delete()
        GuardianDetail.objects.all().delete()
        TeacherNIC.objects.all().delete()
        Classroom.objects.all().delete()
        User.objects.filter(is_superuser=False).delete()

        self.stdout.write('Creating new data...')

        # --- 1. Create Classrooms (No dependencies) ---
        classrooms = []
        for grade in range(6, 13): # Grades 6 through 12
            for class_name in ['A', 'B', 'C', 'D']:
                classroom = Classroom.objects.create(
                    grade=grade, 
                    className=class_name
                )
                classrooms.append(classroom)
        self.stdout.write(f'Created {len(classrooms)} classrooms.')

        # --- 2. Create Teacher NICs (No dependencies) ---
        teacher_nics = []
        for _ in range(100): # Create 30 teacher NICs
            nic = TeacherNIC.objects.create(
                nic_number=fake.unique.bothify(text='19#########V'), 
                is_used=False
            )
            teacher_nics.append(nic)
        self.stdout.write(f'Created {len(teacher_nics)} teacher NICs.')

        # --- 3. Create Guardians (No dependencies) ---
        guardians = []
        for _ in range(100): # Create 700 guardians
            guardian = GuardianDetail.objects.create(
                guardianNic=fake.unique.bothify(text='19#########V'),
                guardianName=fake.name(),
                guardianType=random.choice(['M', 'F', 'G']),
                guardianEmail=fake.unique.email(),
                permanentAddress=fake.address(),
                currentAddress=fake.address(),
                guardianContactNumber=fake.numerify(text='07#######'),
                alternativeContactNumber=fake.numerify(text='07#######'),
                jobTitle=fake.job()
            )
            guardians.append(guardian)
        self.stdout.write(f'Created {len(guardians)} guardians.')

        # --- 4. Create Teachers (Depends on User, TeacherNIC, Classroom) ---
        # Make a copy of classrooms list to assign teachers
        # A class can only have one teacher (OneToOneField)
        available_classes = list(classrooms) 
        
        for nic in teacher_nics:
            first_name = fake.first_name()
            last_name = fake.last_name()
            
            # Create a user for the teacher
            user = User.objects.create_user(
                username=fake.unique.user_name(),
                email=fake.unique.email(),
                password='password123',
                first_name=first_name,
                last_name=last_name
            )

            # Assign a class if available
            assigned_class = None
            if available_classes:
                # Pop a random class from the list to ensure uniqueness
                assigned_class = available_classes.pop(
                    random.randint(0, len(available_classes) - 1)
                )

            TeacherDetail.objects.create(
                owner=user,
                nic_number=nic,
                firstName=first_name,
                lastName=last_name,
                surName=fake.last_name(),
                fullName=f"{first_name} {last_name}",
                dateOfBirth=fake.date_of_birth(minimum_age=25, maximum_age=60),
                gender=random.choice(['M', 'F']),
                email=user.email,
                address=fake.address(),
                enrollmentDate=fake.date_this_decade(),
                mobileNumber=fake.numerify(text='07#######'),
                section="General",
                assignedClass=assigned_class
            )
        self.stdout.write(f'Created {len(teacher_nics)} teachers.')

        # --- 5. Create Students (Depends on Guardian, Classroom) ---
        for i in range(400): # Create 1000 students
            first_name = fake.first_name()
            last_name = fake.last_name()
            
            StudentDetail.objects.create(
                indexNumber=10000 + i, # Unique index number
                guardian=random.choice(guardians),
                firstName=first_name,
                lastName=last_name,
                surName=fake.last_name(),
                fullName=f"{first_name} {last_name}",
                dateOfBirth=fake.date_of_birth(minimum_age=11, maximum_age=18),
                gender=random.choice(['M', 'F']),
                email=fake.unique.email(),
                address=fake.address(),
                enrollmentDate=fake.date_this_decade(),
                mobileNumber=fake.numerify(text='07#######'),
                enrolledClass=random.choice(classrooms)
            )
        self.stdout.write('Created 1000 fake students.')
        
        self.stdout.write(self.style.SUCCESS('Successfully populated the database!'))