import { CourseDetail } from "../../../components/CourseDetail";

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CourseDetail slug={slug} />;
}
