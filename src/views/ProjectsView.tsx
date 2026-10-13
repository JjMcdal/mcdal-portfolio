import ProjectsGrid from '@/components/ProjectsGrid'
import GitHubContributions from '@/components/GitHubContributions'

export default function ProjectsView() {
  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <ProjectsGrid />
      <div style={{ padding: '0 calc(clamp(1rem, 3.5vw, 3rem) + 5px) 3rem', marginTop: '-3rem' }}>
        <GitHubContributions username="JjMcdal" palette="forest" />
      </div>
    </div>
  )
}