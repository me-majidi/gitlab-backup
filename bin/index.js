const path = require("path");
const args = require("args");
const Request = require("./request");
const cmd = require("node-cmd");
const Promise = require("bluebird");
const cmdAsync = Promise.promisify(cmd.get, { multiArgs: true, context: cmd });
const colors = require("colors");
const cliProgress = require("cli-progress");
const Spinner = require("cli-spinner").Spinner;

args
  .option("token", "Gitlab token")
  .option("output", "Output directory")
  .option("url", "Gitlab instance url", "https://gitlab.com");
const flags = args.parse(process.argv);
const defaultOutput = path.resolve(__dirname, "gitlab-projects");

(async function ({ token, output = defaultOutput, url }) {
  if (!token) {
    return console.log("x Please provide your Gitlab access token".red);
  }
  const request = new Request(url, token);
  const projects = new Set();

  const fetchingSpinner = new Spinner("Fetching projects list".blue);
  fetchingSpinner.setSpinnerString(18);
  fetchingSpinner.start();
  const groups = await request.get("api/v4/groups", {
    per_page: 999,
  });

  for (const group of groups) {
    const groupProjects = (
      await request.get(`api/v4/groups/${group.id}/projects`, { per_page: 999 })
    )
      .map((p) => p.ssh_url_to_repo)
      .forEach((p) => projects.add(p));
  }

  (await request.get("api/v4/projects", { per_page: 999, owned: "yes" }))
    .map((p) => p.ssh_url_to_repo)
    .forEach((p) => projects.add(p));

  const dlBar = new cliProgress.SingleBar(
    {
      format: "Progress |" + "{bar}" + "| " + "{project}" + " | {percentage}%",
    },
    cliProgress.Presets.legacy
  );

  fetchingSpinner.stop(true);
  console.log(`✔ Found ${projects.size} projects`.green);
  dlBar.start(projects.size, 1, { project: "N/A" });
  const failedItems = [];

  for (const url of projects) {
    const projectName = url.replace(".git", "").split(":").slice(1).join("");
    const projectPath = path.resolve(output, projectName);
    dlBar.update({ project: projectName });

    try {
      await cmdAsync(`git clone ${url} ${projectPath}`);
    } catch (err) {
      failedItems.push(projectName);
    }
    dlBar.increment();
  }
  dlBar.stop();

  console.log(
    `✔ Successfully cloned ${projects.size - failedItems.length} projects`.green
  );
  if (failedItems.length) {
    console.log("x Failed to clone these projects:".red);
    for (const project of failedItems) {
      console.log(`${project}`.red);
    }
  }
})(flags);
