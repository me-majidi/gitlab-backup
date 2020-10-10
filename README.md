# Gitlab Backup

Clone all your projects from Gitlab with one command

> For using this library you should generate a __Gitlab access token__

<p align="center">
    <img src="https://raw.githubusercontent.com/me-majidi/gitlab-backup/master/demo.gif"/>
</p>

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
gitlab-backup --token TOKEN --output ./my-projects
```
