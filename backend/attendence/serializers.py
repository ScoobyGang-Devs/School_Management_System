from rest_framework import serializers
from .models import *
from admin_panel.models import *
# from admin_panel.serializers import StudentDetailSerializer

class studentAttendenceSerializer(serializers.ModelSerializer):

    className = serializers.CharField()

    class Meta:
        model = studentAttendence
        fields = [
            'attendenceId',
            'className',
            'date',
            'isMarked',
            'presentPercentage',
            'absentList'
        ]

    def validate_className(self, value):
        
        parts = value.split()
        grade, className = parts
        className = value.split()[1]

        # Lookup classroom
        try:
            classroom = Classroom.objects.get(grade=int(grade), className=className)
        except Classroom.DoesNotExist:
            raise serializers.ValidationError(f"Classroom '{value}' does not exist.")

        return classroom
    
    def to_representation(self, instance):
        """
        When returning API response → show "6 A" instead of pk.
        """
        data = super().to_representation(instance)
        data["className"] = str(instance.className)

        return data

        # studentId = data.get("studentId")
        # attendance = data.get("status")
        # date = data.get('date')

        # # ---- FIELD VALIDATIONS ----
        # # 1. Check student exists

        # if not StudentDetail.objects.filter(indexNumber=studentId).exists():
        #     raise serializers.ValidationError({
        #         "student_id": f"Student with ID {studentId} does not exist"
        #     })

        # # 2. Attendance must be valid
        # valid_status = ["P", "A"]
        # if attendance not in valid_status:
        #     raise serializers.ValidationError({
        #         "attendance": f"Invalid status '{attendance}'. Valid: {valid_status}"
        #     })
        
        # # 3. check unique date, student, attendence
        # if studentAttendence.objects.filter(
        #     studentId = studentId,
        #     date = date
        # ):
        #     raise serializers.ValidationError({
        #         "error" : "This attendence is already exists"
        #     })

        # data['studentId'] = StudentDetail.objects.get(indexNumber=studentId)
        
        # return data


class teacherAttendenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = teacherAttendence
        fields = '__all__'