"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Lesson = {
  id: string;
  position: number;
  slug: string;
  title: string;
  summary: string;
  estimated_minutes: number;
};

type Module = {
  id: string;
  position: number;
  title: string;
  description: string;
  lessons: Lesson[];
};

type Course = {
  id: string;
  slug: string;
  title: string;
  description: string;
  level: string;
  estimated_minutes: number;
};

export function CourseDetail({ slug }: { slug: string }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: courseData } = await supabase
        .from("courses")
        .select("id, slug, title, description, level, estimated_minutes")
        .eq("slug", slug)
        .single();

      if (!courseData) {
        setLoading(false);
        return;
      }

      const { data: moduleData } = await supabase
        .from("modules")
        .select("id, position, title, description")
        .eq("course_id", courseData.id)
        .order("position");

      const populated: Module[] = [];
      for (const item of moduleData ?? []) {
        const { data: lessonData } = await supabase
          .from("lessons")
          .select("id, position, slug, title, summary, estimated_minutes")
          .eq("module_id", item.id)
          .eq("is_published", true)
          .order("position");
        populated.push({ ...item, lessons: lessonData ?? [] });
      }

      setCourse(courseData);
      setModules(populated);
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) return <div className="page shell"><div className="notice">Carregando curso…</div></div>;
  if (!course) return <div className="page shell"><div className="notice error">Curso não encontrado.</div></div>;

  return (
    <main className="page shell">
      <section className="course-hero">
        <span className="eyebrow">Curso publicado</span>
        <h1>{course.title}</h1>
        <p>{course.description}</p>
        <div className="meta-row">
          <span className="badge">Iniciante</span>
          <span>{course.estimated_minutes} minutos</span>
          <span>{modules.reduce((total, item) => total + item.lessons.length, 0)} aulas</span>
        </div>
      </section>

      <section className="module-list">
        {modules.map((module) => (
          <article className="module-card" key={module.id}>
            <div>
              <span className="eyebrow">Módulo {module.position}</span>
              <h2>{module.title}</h2>
              <p>{module.description}</p>
            </div>
            <div className="lesson-list">
              {module.lessons.map((lesson) => (
                <Link className="lesson-row" href={`/cursos/${course.slug}/aulas/${lesson.slug}`} key={lesson.id}>
                  <span className="lesson-number">{String(lesson.position).padStart(2, "0")}</span>
                  <span className="lesson-copy">
                    <strong>{lesson.title}</strong>
                    <small>{lesson.summary}</small>
                  </span>
                  <span className="lesson-time">{lesson.estimated_minutes} min</span>
                </Link>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
