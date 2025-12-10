import { GitHubUser, GitHubRepo, GitHubCommit, GitHubStats, Achievement, DeveloperProfile } from '@/types/github';

const GITHUB_API_BASE = 'https://api.github.com';

export class GitHubAPI {
  private username: string;
  private token?: string;
  private isOwnProfile: boolean;

  constructor(username: string, token?: string, isOwnProfile: boolean = false) {
    this.username = username;
    this.token = token;
    this.isOwnProfile = isOwnProfile;
  }

  private async fetch(endpoint: string, options?: RequestInit) {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
    };

    if (options?.headers) {
      const existingHeaders = options.headers as Record<string, string>;
      Object.assign(headers, existingHeaders);
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('GitHub user not found');
      }
      if (response.status === 409) {
        return [];
      }
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    return response.json();
  }

  async getUser(): Promise<GitHubUser> {
    return this.fetch(`/users/${this.username}`);
  }

  async getRepos(since?: string): Promise<GitHubRepo[]> {
    const repos = [];
    let page = 1;

    while (true) {
      const endpoint = this.isOwnProfile
        ? `/user/repos?per_page=100&page=${page}&sort=updated&affiliation=owner,collaborator,organization_member`
        : `/users/${this.username}/repos?per_page=100&page=${page}&sort=updated&type=owner`;
      
      const data = await this.fetch(endpoint);
      if (data.length === 0) break;

      if (since) {
        const filteredData = data.filter((repo: GitHubRepo) =>
          new Date(repo.pushed_at) >= new Date(since)
        );
        repos.push(...filteredData);
        console.log(`  Page ${page}: ${filteredData.length}/${data.length} repos match date filter`);
        if (filteredData.length < data.length) break;
      } else {
        repos.push(...data);
      }

      page++;
      if (page > 5) break; 
    }

    const accessType = this.isOwnProfile ? 'all (including private)' : 'public';
    console.log(`📚 Found ${repos.length} ${accessType} repos for ${this.username}`);
    return repos;
  }

  async getCommitsForRepo(repo: GitHubRepo, since: string): Promise<GitHubCommit[]> {
    try {
      const commits = [];
      let page = 1;

      while (page <= 2) { 
        const data = await this.fetch(
          `/repos/${repo.full_name}/commits?since=${since}&per_page=100&page=${page}&author=${this.username}`
        );

        if (!data || data.length === 0) break;

        const commitsWithRepo = data.map((commit: GitHubCommit) => ({
          ...commit,
          repository: { full_name: repo.full_name }
        }));

        commits.push(...commitsWithRepo);
        page++;
      }

      return commits;
    } catch (error) {
      console.error(`Error fetching commits for ${repo.full_name}:`, error);
      return [];
    }
  }

  async getAllCommits(since: string): Promise<GitHubCommit[]> {
    const repos = await this.getRepos(since);
    const allCommits: GitHubCommit[] = [];

    console.log(`Total repos found: ${repos.length}`);

    const sortedRepos = repos.sort((a, b) =>
      new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
    );

    const reposToAnalyze = sortedRepos.slice(0, 50);
    console.log(`Analyzing ${reposToAnalyze.length} repos for commits...`);

    for (const repo of reposToAnalyze) {
      const commits = await this.getCommitsForRepo(repo, since);
      if (commits.length > 0) {
        console.log(`  ✓ ${repo.full_name}: ${commits.length} commits`);
      }
      allCommits.push(...commits);
    }

    console.log(`Total commits collected: ${allCommits.length}`);
    return allCommits;
  }

  async getLanguages(repos: GitHubRepo[]): Promise<{ [key: string]: number }> {
    const languages: { [key: string]: number } = {};

    for (const repo of repos.slice(0, 30)) {
      try {
        const repoLanguages = await this.fetch(`/repos/${repo.full_name}/languages`);
        for (const [lang, bytes] of Object.entries(repoLanguages)) {
          languages[lang] = (languages[lang] || 0) + (bytes as number);
        }
      } catch (error) {
        console.error(`Error fetching languages for ${repo.full_name}:`, error);
      }
    }

    return languages;
  }

  async getStats(): Promise<GitHubStats> {
    const user = await this.getUser();

    const currentYear = new Date().getFullYear();
    const yearStart = new Date(`${currentYear}-01-01T00:00:00Z`);
    const since = yearStart.toISOString();

    const repos = await this.getRepos(since);

    const commits = await this.getAllCommits(since);
    const languages = await this.getLanguages(repos);

    const commitsByHour = new Array(24).fill(0);
    const commitsByDay = new Array(7).fill(0);
    const commitDates = new Set<string>();

    commits.forEach(commit => {
      const date = new Date(commit.commit.author.date);
      commitsByHour[date.getHours()]++;
      commitsByDay[date.getDay()]++;
      commitDates.add(date.toDateString());
    });

    const sortedDates = Array.from(commitDates).sort();
    let longestStreak = 0;
    let currentStreak = 0;
    let tempStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1]);
      const currDate = new Date(sortedDates[i]);
      const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    const today = new Date().toDateString();
    if (sortedDates[sortedDates.length - 1] === today ||
        sortedDates[sortedDates.length - 1] === new Date(Date.now() - 86400000).toDateString()) {
      currentStreak = tempStreak;
    }

    const nightCommits = commitsByHour.slice(22).concat(commitsByHour.slice(0, 6)).reduce((a, b) => a + b, 0);
    const morningCommits = commitsByHour.slice(6, 12).reduce((a, b) => a + b, 0);
    const afternoonCommits = commitsByHour.slice(12, 18).reduce((a, b) => a + b, 0);
    const eveningCommits = commitsByHour.slice(18, 22).reduce((a, b) => a + b, 0);

    const max = Math.max(nightCommits, morningCommits, afternoonCommits, eveningCommits);
    let codingPattern: GitHubStats['codingPattern'] = 'All Day Coder';
    if (max === nightCommits) codingPattern = 'Night Owl';
    else if (max === morningCommits) codingPattern = 'Early Bird';
    else if (max === afternoonCommits) codingPattern = 'Afternoon Coder';

    const repoCommitCounts: { [key: string]: number } = {};
    commits.forEach(commit => {
      const repoName = commit.repository?.full_name;
      if (repoName && repoName !== 'Unknown') {
        repoCommitCounts[repoName] = (repoCommitCounts[repoName] || 0) + 1;
      }
    });

    const favoriteRepoEntry = Object.entries(repoCommitCounts)
      .sort(([, a], [, b]) => b - a)[0];

    const favoriteRepo = {
      name: favoriteRepoEntry?.[0] || 'Various Projects',
      commits: favoriteRepoEntry?.[1] || commits.length,
    };

    const topRepos = Object.entries(repoCommitCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([name, commits]) => ({ name, commits }));

    const estimatedLines = commits.length * 15;
    const linesAdded = Math.floor(estimatedLines * 0.6);
    const linesDeleted = Math.floor(estimatedLines * 0.4);

    const achievements = this.generateAchievements(commits.length, longestStreak, Object.keys(languages).length, repos.length);

    const developerProfile = this.determineDeveloperProfile(commits, languages, commitsByDay);

    return {
      totalCommits: commits.length,
      totalRepos: repos.length,
      topLanguages: languages,
      commitsByHour,
      commitsByDay,
      longestStreak,
      currentStreak,
      totalDaysActive: commitDates.size,
      linesAdded,
      linesDeleted,
      favoriteRepo,
      topRepos,
      codingPattern,
      achievements,
      developerProfile,
    };
  }

  private generateAchievements(commits: number, streak: number, languages: number, repos: number): Achievement[] {
    const achievements: Achievement[] = [
      {
        id: 'active-year',
        title: 'Active Year',
        description: `Made ${commits} commits this year`,
        icon: '⭐',
        unlocked: commits >= 10,
      },
      {
        id: 'century',
        title: 'Century Club',
        description: 'Reached 100 commits this year',
        icon: '💯',
        unlocked: commits >= 100,
      },
      {
        id: 'commit-machine',
        title: 'Commit Machine',
        description: 'Made 500+ commits this year',
        icon: '🤖',
        unlocked: commits >= 500,
      },
      {
        id: 'streak-master',
        title: 'Streak Master',
        description: 'Maintained a 30-day streak',
        icon: '🔥',
        unlocked: streak >= 30,
      },
      {
        id: 'consistency',
        title: 'Consistent Coder',
        description: 'Maintained a 7-day streak',
        icon: '📅',
        unlocked: streak >= 7,
      },
      {
        id: 'polyglot',
        title: 'Polyglot',
        description: 'Coded in 5+ languages',
        icon: '🌐',
        unlocked: languages >= 5,
      },
      {
        id: 'repo-collector',
        title: 'Repo Collector',
        description: 'Created 10+ repositories',
        icon: '📚',
        unlocked: repos >= 10,
      },
    ];

    return achievements;
  }

  private determineDeveloperProfile(commits: GitHubCommit[], languages: { [key: string]: number }, commitsByDay: number[]): DeveloperProfile {
    const totalCommits = commits.length;
    const languageCount = Object.keys(languages).length;
    const weekendCommits = commitsByDay[0] + commitsByDay[6];
    const weekdayCommits = commitsByDay.slice(1, 6).reduce((a, b) => a + b, 0);

    if (weekendCommits > weekdayCommits * 0.4) return 'Weekend Warrior';
    if (totalCommits > 1000) return 'Commit Machine';
    if (languageCount > 10) return 'Language Explorer';
    if (totalCommits > 500) return 'Feature Factory';

    const profiles: DeveloperProfile[] = ['Refactor Addict', 'Bug Squasher', 'Code Poet', 'Open Source Hero'];
    return profiles[Math.floor(Math.random() * profiles.length)];
  }
}

export function validateUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;
  return usernameRegex.test(username);
}
