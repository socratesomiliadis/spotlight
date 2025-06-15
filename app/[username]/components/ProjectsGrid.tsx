import ProjectCard from "./ProjectCard";

export default function ProjectsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-11 pr-9">
      <ProjectCard variant="team" />
      <ProjectCard variant="preview" />
    </div>
  );
}
