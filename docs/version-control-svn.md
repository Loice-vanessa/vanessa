# Local SVN Version Control Setup for DHAMS

## Purpose

This document shows how DHAMS can be captured in Apache Subversion for assignment evidence. SVN will track the application source code, Docker configuration, and documentation while excluding generated files and local machine artifacts.

## Installed Tool

SVN command-line tools were installed with Slik Subversion:

```text
C:\Program Files\SlikSvn\bin\svn.exe
C:\Program Files\SlikSvn\bin\svnadmin.exe
```

Verify installation:

```powershell
& 'C:\Program Files\SlikSvn\bin\svn.exe' --version --quiet
& 'C:\Program Files\SlikSvn\bin\svnadmin.exe' --version --quiet
```

Both commands should show `1.14.2-SlikSvn`.

## Repository Layout

The local repository was created with the standard SVN layout:

```text
C:\svn-repos\dhams
  trunk/
  branches/
  tags/
```

`trunk` contains active development. `branches` is for experiments or release work. `tags` is for fixed submission snapshots.

## Create the Local Repository

The repository can be recreated with these PowerShell commands:

```powershell
New-Item -ItemType Directory -Force C:\svn-repos
& 'C:\Program Files\SlikSvn\bin\svnadmin.exe' create C:\svn-repos\dhams
& 'C:\Program Files\SlikSvn\bin\svn.exe' mkdir file:///C:/svn-repos/dhams/trunk file:///C:/svn-repos/dhams/branches file:///C:/svn-repos/dhams/tags -m "Create DHAMS SVN layout"
```

## Import the Application

From the project root:

```powershell
& 'C:\Program Files\SlikSvn\bin\svn.exe' checkout file:///C:/svn-repos/dhams/trunk C:\svn-workspaces\dhams
```

Copy the required project files into `C:\svn-workspaces\dhams`, excluding generated folders. Then run:

```powershell
cd C:\svn-workspaces\dhams
& 'C:\Program Files\SlikSvn\bin\svn.exe' add backend frontend docs docker-compose.yml README.md vercel.json
```

If SVN tries to add generated folders, remove them from version control before committing:

```powershell
& 'C:\Program Files\SlikSvn\bin\svn.exe' revert --depth infinity frontend\node_modules frontend\dist backend\target
```

## Ignore Generated Files

Set SVN ignore rules in the working copy:

```powershell
& 'C:\Program Files\SlikSvn\bin\svn.exe' propset svn:ignore "node_modules`ndist`n.env`n.env.local`n*.log" frontend
& 'C:\Program Files\SlikSvn\bin\svn.exe' propset svn:ignore "target`n.m2`n*.log" backend
& 'C:\Program Files\SlikSvn\bin\svn.exe' propset svn:ignore "*.log`n.history" .
```

Check the status:

```powershell
& 'C:\Program Files\SlikSvn\bin\svn.exe' status
```

Commit the first version:

```powershell
& 'C:\Program Files\SlikSvn\bin\svn.exe' commit -m "Capture DHAMS healthcare prototype source"
```

Actual repository evidence:

```text
r1: Create DHAMS SVN layout
r2: Capture DHAMS healthcare prototype source
```

## Files to Track

- Backend source code and Maven wrapper files.
- Frontend source code, public assets, package files, Vite config, and Nginx config.
- Dockerfiles and `docker-compose.yml`.
- Documentation in `docs/`.
- Root project files such as `README.md` and `vercel.json`.

## Files to Exclude

- `frontend/node_modules/`
- `frontend/dist/`
- `backend/target/`
- `*.log`
- local IDE files and temporary editor files
- Docker database volumes

## Suggested Evidence Screenshots

Capture these screenshots for the report or presentation:

- `svn --version --quiet` showing SVN is installed.
- `svn status` after adding files and setting ignore rules.
- `svn commit` output showing the first commit revision number.
- SVN repository folder containing `trunk`, `branches`, and `tags`.
- Browser showing DHAMS running from Docker at `http://localhost:8082`.

## Normal SVN Workflow

```powershell
svn update
svn status
svn add <new-file-or-folder>
svn commit -m "Describe the change"
svn log --limit 5
```

This setup ensures the complete DHAMS prototype can be recovered, reviewed, and submitted without depending on the previous Git repository.
