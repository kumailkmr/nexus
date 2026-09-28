# Security Policy

NEXUS takes the security of our private creative operating system seriously.

## Reporting a Vulnerability

If you discover a security vulnerability within NEXUS, please report it immediately.

**Do not file a public issue.**

Please contact the repository owner directly to report any security vulnerabilities, or use the GitHub Security Advisories private reporting feature if available on this repository.

## Secret Management

Secrets must **never** be committed to the repository. This includes but is not limited to:
- `.env`, `.env.local`, or any environment file containing real values
- Supabase Service Role keys
- OpenAI API keys
- Higgsfield API keys
- NEXUS_OWNER_EMAIL or other administrative configuration
- Database connection strings or passwords
- JWT signing secrets or private certificates

Always use `.env.example` to document required configuration variables without including actual credentials.

## Supported Versions

Currently, only the `main` branch is supported for security updates. 

## Responsible Disclosure

We ask that you:
- Provide us a reasonable amount of time to resolve the issue before disclosing it to the public or a third party.
- Make a good faith effort to avoid violating privacy, destroying data, or interrupting or degrading our service.

## Security-Sensitive Changes

Any pull request that introduces changes to authentication, authorization, database access, external APIs, or sensitive configuration must be clearly labeled and undergo strict security review before being merged into the `main` branch.
