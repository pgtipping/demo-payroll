import { FEATURES as FrontendFeatures } from "../Frontend/lib/config/features";
import { FEATURES as BackendFeatures } from "../Backend/src/config/features";
import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";

interface ComplianceIssue {
  file: string;
  line: number;
  issue: string;
  severity: "error" | "warning";
}

const issues: ComplianceIssue[] = [];

// Combine features from both frontend and backend
const FEATURES = {
  ...FrontendFeatures,
  ...BackendFeatures,
};

// Check for advanced feature usage
function checkFile(filePath: string) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");

  lines.forEach((line, index) => {
    // Check for advanced feature imports
    Object.keys(FEATURES).forEach((feature) => {
      if (FEATURES[feature].isAdvanced) {
        if (line.includes(feature)) {
          issues.push({
            file: filePath,
            line: index + 1,
            issue: `Advanced feature "${feature}" referenced`,
            severity: "error",
          });
        }
      }
    });

    // Check for disabled feature flags
    if (line.includes("isEnabled(") && !line.includes("// MVP:")) {
      issues.push({
        file: filePath,
        line: index + 1,
        issue: "Feature flag usage without MVP comment",
        severity: "warning",
      });
    }

    // Check for advanced feature directories
    if (
      filePath.includes("advanced-features") ||
      filePath.includes("experimental")
    ) {
      issues.push({
        file: filePath,
        line: 1,
        issue: "File in advanced/experimental feature directory",
        severity: "error",
      });
    }
  });
}

// Recursively check all TypeScript files
function checkDirectory(dir: string) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (
      stat.isDirectory() &&
      !file.includes("node_modules") &&
      !file.includes(".next") &&
      !file.includes("dist")
    ) {
      checkDirectory(filePath);
    } else if (
      stat.isFile() &&
      (file.endsWith(".ts") || file.endsWith(".tsx"))
    ) {
      checkFile(filePath);
    }
  });
}

// Start checking both frontend and backend
console.log(chalk.blue("🔍 Checking MVP compliance..."));

// Check Frontend
console.log(chalk.blue("\nChecking Frontend:"));
checkDirectory(path.join(__dirname, "../Frontend"));

// Check Backend
console.log(chalk.blue("\nChecking Backend:"));
checkDirectory(path.join(__dirname, "../Backend"));

// Report results
const errors = issues.filter((i) => i.severity === "error");
const warnings = issues.filter((i) => i.severity === "warning");

if (errors.length === 0 && warnings.length === 0) {
  console.log(chalk.green("\n✅ No MVP compliance issues found!"));
} else {
  if (errors.length > 0) {
    console.log(chalk.red(`\n❌ Found ${errors.length} compliance errors:`));
    errors.forEach((issue) => {
      console.log(chalk.yellow(`\n${issue.file}:${issue.line}`));
      console.log(chalk.red(`Error: ${issue.issue}`));
    });
  }

  if (warnings.length > 0) {
    console.log(
      chalk.yellow(`\n⚠️ Found ${warnings.length} compliance warnings:`)
    );
    warnings.forEach((issue) => {
      console.log(chalk.yellow(`\n${issue.file}:${issue.line}`));
      console.log(chalk.yellow(`Warning: ${issue.issue}`));
    });
  }

  if (errors.length > 0) {
    process.exit(1);
  }
}
