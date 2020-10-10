# Gitlab Backup

Backup all your projects from Gitlab at once

> For using this library you should generate a Gitlab access token

## Installation

```bash
npm install gitlab-backup -g
```

### Options

| Name   | Description              | Default                     |
| ------ | ------------------------ | --------------------------- |
| token  | Your Gitlab access token | This option is **REQUIRED** |
| url    | Url of gitlab instance   | https://gitlab.com          |
| output | Path of output directory | `./gitlab-backup/`          |

## Usage

```bash
gitlab-backup -t TOKEN -o ./my-projects
```
