import { useState, useEffect } from "react";
import { courseService } from "../services/course.service";
import { useApiError } from "../hooks/useApiError";
import { Course } from "../types/course";

export const CourseList = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { error, handleError, clearError } = useApiError();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        clearError();
        const response = await courseService.getAllCourses();
        setCourses(response.data);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [clearError, handleError]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {courses.map((course) => (
        <div key={course._id}>
          <h2>{course.title}</h2>
          <p>{course.description}</p>
        </div>
      ))}
    </div>
  );
};
