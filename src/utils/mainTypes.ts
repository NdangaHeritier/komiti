// types
export type Commit ={
  id: string,
  commitId: '',
  projectId: string,
  branch: string,
  title: string,
  message?: string,
  status?: "verified" | "pending" | "rejected",
  user: {uid: string, name: string},
  createdOn: Date,
  verificationLink?: string
}
export type Project = {
  id: string;
  name: string,
  description?: string,
  createdBy: string,
  createdOn: Date,
  contributors: string[],
  team: string,
  repoLink: string,
  branches: string[],
  latestCommit: Commit | null,
  totalCommits: number
};