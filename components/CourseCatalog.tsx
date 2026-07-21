"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Course = {
  id: string;
  slug: string;
  title: string;
  description: string;
  level: string;
  estimated_minutes: number;
};

export function CourseCatalog() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("courses")
      .select("id, slug, title, description, level, estimated_minutes")
      .eq("status", "published")
      .order("created_at")
      .then(({ data, error: queryError }) => {
        if (queryError) setError("Não foi possível carregar o catálogo agora.");
        setCourses((data as Course[]) ?? []);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="notice">Carregando catálogo…</div>;
  if (error) return <div className="notice error">{error}</div>;

  return (
    <div className="catalog-grid">
      {courses.map((course) => (
        <article className="course-card" key={course.id}>
          <div className="course-card-topline">
            <span className="badge">{course.level === "beginner" ? "Iniciante" : course.level}</span>
            <span className="muted">{course.estimated_minutes} min</span>
          </div>
          <h2>{course.title}</h2>
          <p>{course.description}</p>
          <Link className="button primary" href={`/cursos/${course.slug}`}>Abrir curso</Link>
        </article>
      ))}
    </div>
  );
}
