export type ThemeName = 'mac' | 'powershell' | 'professional';

export type Profile = {
    id?: number;
    name: string;
    headline: string | null;
    bio: string | null;
    email: string | null;
    location: string | null;
    github_url: string | null;
    linkedin_url: string | null;
    avatar_url: string | null;
    resume_url: string | null;
    theme?: ThemeName;
};

export type Skill = {
    id: number;
    skill_category_id: number;
    name: string;
    /** Proficiency 0-100; null hides the bar. */
    level: number | null;
    sort_order: number;
};

export type SkillCategory = {
    id: number;
    name: string;
    sort_order: number;
    skills: Skill[];
};

export type Experience = {
    id: number;
    company: string;
    position: string;
    start_date: string;
    end_date: string | null;
    description: string | null;
    skills: Skill[];
};

export type ProjectImage = {
    id: number;
    project_id: number;
    path: string;
    url: string;
    caption: string | null;
    is_cover: boolean;
    sort_order: number;
};

export type Project = {
    id: number;
    title: string;
    slug: string;
    summary: string | null;
    description: string | null;
    role: string | null;
    github_url: string | null;
    live_url: string | null;
    built_at: string | null;
    is_published: boolean;
    is_featured: boolean;
    sort_order: number;
    updated_at: string;
    cover?: ProjectImage | null;
    images?: ProjectImage[];
    skills: Skill[];
};

export type Message = {
    id: number;
    name: string;
    email: string;
    body: string;
    read_at: string | null;
    created_at: string;
};

export type HomeProps = {
    theme: ThemeName;
    profile: Profile;
    categories: SkillCategory[];
    experiences: Experience[];
    projects: Project[];
};

export type ProjectsProps = {
    theme: ThemeName;
    profile: Pick<Profile, 'name' | 'email' | 'github_url' | 'linkedin_url'>;
    projects: Project[];
    skills: string[];
    activeSkill: string | null;
};

export type ProjectShowProps = {
    theme: ThemeName;
    profile: Pick<Profile, 'name' | 'email' | 'github_url' | 'linkedin_url'>;
    project: Project;
};

export type DashboardStats = {
    projects: number;
    published: number;
    skills: number;
    categories: number;
    experiences: number;
    current: number;
    unread: number;
};
