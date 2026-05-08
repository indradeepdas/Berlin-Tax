# PR Template

GitHub uses `.github/PULL_REQUEST_TEMPLATE.md` for pull requests in this repository. This file is kept as a discoverable pointer for tools and contributors that look for `PR_TEMPLATE.md`.

Before opening a pull request:

- Run `npm test`.
- Run `npm run stress` when workflows, examples, config, or validators changed.
- Run `git diff --check`.
- Confirm source-backed values are in `config/` and `sources/`.
- Confirm examples are fictional, redacted, and explicit about evidence state.
- Confirm no generated output is described as professional advice or compliance certification.
