# Running GitHub Actions Workflows Locally with `act`

This guide explains how to run your GitHub Actions workflows locally using `act`.

## Prerequisites

1. **Docker Desktop** - Must be installed and running
   - Download from: https://www.docker.com/products/docker-desktop/
   - Ensure Docker Desktop is running before using `act`

2. **Node.js** - Required for the project (v20+ recommended)

## Installation Steps

### Step 1: Install `act`

**On Windows (using winget):**
```powershell
winget install nektos.act
```

**On macOS (using Homebrew):**
```bash
brew install act
```

**On Linux:**
```bash
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash
```

### Step 2: Verify Installation

```bash
act --version
```

You should see the version number (e.g., `act version 0.2.82`)

### Step 3: Start Docker Desktop

**On Windows:**
- Open Docker Desktop application
- Wait until it shows "Docker Desktop is running"
- Or use PowerShell:
```powershell
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
```

**On macOS/Linux:**
- Start Docker Desktop from Applications
- Or verify Docker is running:
```bash
docker ps
```

## Setting Up Secrets

### Step 4: Create `.secrets` File

Create a `.secrets` file in your project root with your environment variables:

```
USERNAME=your_username
PASSWORD=your_password
USERID=your_user_id
USERNAME_ADMIN=admin_username
USERNAME_USER=user_username
ENV=
APPLITOOLS_API_KEY=your_api_key
```

**Note:** You can also copy from your `.env` file:
```powershell
# Windows PowerShell
Get-Content .env | Where-Object { $_ -match '^[A-Z_]+=' -and -not $_ -match '^#' } | Out-File -FilePath .secrets -Encoding utf8
```

## Running Workflows

### Step 5: List Available Workflows

```bash
act --list
```

This shows all available workflows and jobs.

### Step 6: Run a Specific Job

```bash
act -W .github/workflows/playwright.yml --secret-file .secrets -j test
```

**Flags explained:**
- `-W` or `--workflows`: Path to workflow file
- `--secret-file`: Path to secrets file
- `-j` or `--job`: Specific job to run

### Step 7: Run with Custom Docker Image (Recommended)

To avoid interactive prompts, specify a platform image:

```bash
act -W .github/workflows/playwright.yml --secret-file .secrets -j test -P ubuntu-latest=catthehacker/ubuntu:act-latest --container-architecture linux/amd64
```

**Additional flags:**
- `-P`: Platform image mapping
- `--container-architecture`: Container architecture

### Step 8: Run All Jobs in a Workflow

```bash
act -W .github/workflows/playwright.yml --secret-file .secrets
```

## Common Use Cases

### Run Only on Specific Event

```bash
act push -W .github/workflows/playwright.yml --secret-file .secrets
```

### Run with Verbose Output

```bash
act -W .github/workflows/playwright.yml --secret-file .secrets -j test -v
```

### Run with Debug Mode

```bash
act -W .github/workflows/playwright.yml --secret-file .secrets -j test -vv
```

### Dry Run (List what would run)

```bash
act --list -W .github/workflows/playwright.yml
```

## Configuration

### Configure Default Image (Optional)

Create `~/.actrc` (or `C:\Users\YourName\AppData\Local\act\actrc` on Windows) with:

```
-P ubuntu-latest=catthehacker/ubuntu:act-latest
--container-architecture linux/amd64
```

This avoids specifying the platform each time.

## Troubleshooting

### Issue: Docker not running
**Solution:** Start Docker Desktop and wait until it's fully initialized.

### Issue: "Couldn't get a valid docker connection"
**Solution:** 
- Verify Docker is running: `docker ps`
- Restart Docker Desktop if needed

### Issue: Interactive prompt for image selection
**Solution:** Use `-P` flag to specify the platform image:
```bash
-P ubuntu-latest=catthehacker/ubuntu:act-latest
```

### Issue: Secrets not being passed
**Solution:** 
- Verify `.secrets` file exists and has correct format (no spaces around `=`)
- Check file path with `--secret-file` flag

### Issue: Tests failing in `act` but passing on GitHub
**Solution:** 
- Some GitHub-specific features aren't fully supported
- Artifact uploads may fail (expected behavior)
- Check environment variables are set correctly

## Quick Reference

```bash
# List workflows
act --list

# Run specific job
act -W .github/workflows/playwright.yml --secret-file .secrets -j test -P ubuntu-latest=catthehacker/ubuntu:act-latest --container-architecture linux/amd64

# Run all jobs
act -W .github/workflows/playwright.yml --secret-file .secrets -P ubuntu-latest=catthehacker/ubuntu:act-latest

# Verbose output
act -W .github/workflows/playwright.yml --secret-file .secrets -j test -vv
```

## Additional Resources

- `act` GitHub: https://github.com/nektos/act
- Documentation: https://nektosact.com/
- Docker Desktop: https://www.docker.com/products/docker-desktop/

