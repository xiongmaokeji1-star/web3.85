# Basic Git Commands

Git is a distributed version control system that helps you track changes in your code and collaborate with others. Below are the most essential Git commands with explanations and examples.

---

## `git init`

Initializes a new, empty Git repository in the current directory. This creates a hidden `.git` folder that Git uses to track your project.

**Syntax:**
```bash
git init
```

**Example:**
```bash
mkdir my-project
cd my-project
git init
# Output: Initialized empty Git repository in /path/to/my-project/.git/
```

---

## `git clone`

Copies an existing remote repository to your local machine. This downloads the entire project history and files.

**Syntax:**
```bash
git clone <repository-url>
git clone <repository-url> <directory-name>
```

**Examples:**
```bash
# Clone a repository into a folder named after the repo
git clone https://github.com/user/my-project.git

# Clone into a custom folder name
git clone https://github.com/user/my-project.git my-custom-folder
```

---

## `git status`

Shows the current state of your working directory and staging area. It tells you which files have been modified, which are staged for the next commit, and which are untracked.

**Syntax:**
```bash
git status
```

**Example:**
```bash
git status
# Output:
# On branch main
# Changes not staged for commit:
#   modified:   index.html
# Untracked files:
#   new-file.txt
```

---

## `git add`

Stages changes (new files, modifications, or deletions) so they are included in the next commit. Think of it as selecting which changes you want to save.

**Syntax:**
```bash
git add <file>         # Stage a specific file
git add .              # Stage all changes in the current directory
git add -A             # Stage all changes (including deletions) in the entire repo
```

**Examples:**
```bash
# Stage a single file
git add index.html

# Stage multiple specific files
git add index.html style.css

# Stage everything
git add .
```

---

## `git commit`

Records the staged changes as a new snapshot in the repository history. Always include a descriptive message with `-m`.

**Syntax:**
```bash
git commit -m "Your commit message"
git commit -am "Your commit message"   # Stage tracked files and commit in one step
```

**Examples:**
```bash
# Commit with a message
git commit -m "Add homepage layout"

# Stage all tracked changes and commit in one step
git commit -am "Fix typo in README"
```

---

## `git push`

Uploads your local commits to a remote repository (e.g., GitHub). This makes your changes available to others.

**Syntax:**
```bash
git push <remote> <branch>
git push                   # Push to the default remote and branch
```

**Examples:**
```bash
# Push the main branch to the origin remote
git push origin main

# Push and set the upstream tracking branch for the first time
git push -u origin main
```

---

## `git pull`

Downloads changes from a remote repository and merges them into your current local branch. It combines `git fetch` and `git merge` in one step.

**Syntax:**
```bash
git pull <remote> <branch>
git pull                    # Pull from the default remote and branch
```

**Examples:**
```bash
# Pull the latest changes from the main branch on origin
git pull origin main

# Pull from the default tracked remote branch
git pull
```

---

## Quick Reference

| Command | Description |
|---|---|
| `git init` | Initialize a new local repository |
| `git clone <url>` | Clone a remote repository locally |
| `git status` | Check the status of your working directory |
| `git add <file>` | Stage a file for the next commit |
| `git add .` | Stage all changes |
| `git commit -m "msg"` | Commit staged changes with a message |
| `git push origin <branch>` | Push commits to a remote repository |
| `git pull origin <branch>` | Pull and merge remote changes locally |

---

## Typical Workflow

```bash
# 1. Clone a repository
git clone https://github.com/user/my-project.git
cd my-project

# 2. Check current status
git status

# 3. Make changes to files, then stage them
git add .

# 4. Commit the changes
git commit -m "Describe what you changed"

# 5. Push to the remote repository
git push origin main

# 6. Before starting new work, pull the latest changes
git pull origin main
```
