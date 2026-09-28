# NEXUS Repository Security Checklist

These rules are permanent.

### Secrets
Never commit secrets.

### Environment
Use `.env.local` / deployment environment variables.

### Commits
Use Conventional Commits.

### Branches
Use feature/fix/security branches.

### Main
Do not force push.

### Validation
Run:
pnpm lint
pnpm typecheck
pnpm test
when available.

### Security
Run security checks before pushing.

### Authentication
Never expose private auth credentials.

### Database
Never commit production database credentials.

### AI Providers
Never expose OpenAI/Higgsfield private keys.

### Supabase
Never expose the Supabase service-role key.
