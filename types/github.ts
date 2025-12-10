export interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubRepo {
  name: string;
  full_name: string;
  description: string;
  stargazers_count: number;
  language: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  owner?: {
    login: string;
  };
  permissions?: {
    push: boolean;
  };
}

export interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  repository?: {
    full_name: string;
  };
}

export interface GitHubStats {
  totalCommits: number;
  totalRepos: number;
  topLanguages: { [key: string]: number };
  commitsByHour: number[];
  commitsByDay: number[];
  longestStreak: number;
  currentStreak: number;
  totalDaysActive: number;
  linesAdded: number;
  linesDeleted: number;
  favoriteRepo: {
    name: string;
    commits: number;
  };
  topRepos: Array<{
    name: string;
    commits: number;
  }>;
  codingPattern: 'Night Owl' | 'Early Bird' | 'Afternoon Coder' | 'All Day Coder';
  achievements: Achievement[];
  developerProfile: DeveloperProfile;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export type DeveloperProfile =
  | 'Refactor Addict'
  | 'Commit Machine'
  | 'Language Explorer'
  | 'Open Source Hero'
  | 'Bug Squasher'
  | 'Feature Factory'
  | 'Code Poet'
  | 'Weekend Warrior';

export interface WrappedSlide {
  id: number;
  type: 'intro' | 'stats' | 'languages' | 'pattern' | 'repo' | 'streak' | 'achievements' | 'lines' | 'profile' | 'final';
  data?: any;
}
