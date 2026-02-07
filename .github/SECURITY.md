# Security Policy

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue, please follow responsible disclosure practices:

**Do not open a public GitHub issue for security vulnerabilities.**

Instead, email your findings directly to the team lead:
- **Archit Jain** (@0xarchit) - Team Lead

Include:
- Description of the vulnerability
- Steps to reproduce (if applicable)
- Potential impact
- Suggested fix (if you have one)

## Security Best Practices

When contributing to CityTrack, please follow these security guidelines:

### Authentication & Authorization
- Never hardcode credentials or API keys
- Use environment variables for sensitive data
- Implement proper role-based access control (RBAC)

### Data Protection
- All images and GPS data must be encrypted in transit (HTTPS/TLS)
- User authentication must use [Supabase Auth](https://supabase.com)
- Implement rate limiting on API endpoints

### Code
- Keep dependencies updated
- Run security audits regularly
- Use parameterized queries to prevent SQL injection
- Validate all user inputs

### Infrastructure
- Deploy in secure, containerized environments
- Use environment variables for configuration
- Implement proper logging and monitoring
- Regular security updates for all services

## Supported Versions

- **MVP Release (v0.1.x):** Security updates will be provided

## Disclosure Timeline

- **Report:** Contact the team immediately
- **Acknowledgment:** Within 48 hours
- **Fix & Release:** Target 7-14 days for critical issues
- **Public Disclosure:** After fix is released

---

Thank you for helping keep CityTrack secure!
