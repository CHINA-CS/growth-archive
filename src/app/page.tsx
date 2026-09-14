import { getFeaturedProjects, loadContent } from "@/lib/content";
import { LandingExperience } from "@/components/LandingExperience";

export default function HomePage() {
  const { profile } = loadContent();
  const featured = getFeaturedProjects(4).map((p) => ({
    id: p.id,
    title: p.title,
    summary: p.summary,
    slug: p.slug,
    stack: p.stack,
  }));

  return (
    <LandingExperience
      name={profile.name}
      title={profile.title}
      bio={profile.bio}
      featured={featured}
    />
  );
}
