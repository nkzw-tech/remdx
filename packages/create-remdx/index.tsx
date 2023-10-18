#!/usr/bin/env node

// Copied and modified from https://github.com/slidevjs/slidev/blob/main/packages/create-app/index.js
// MIT License – Copyright (c) 2020-2021 Anthony Fu
import fs from 'node:fs';
import path from 'node:path';
// @ts-expect-error
import { execa } from 'execa';
import { blue, bold, dim, green, yellow } from 'kolorist';
import prompts from 'prompts';

const argv = require('minimist')(process.argv.slice(2));
const cwd = process.cwd();

async function create() {
  console.log(`\n${bold('  ReMDX')}\n`);

  let targetDir = argv._[0];
  if (!targetDir) {
    const { projectName } = await prompts({
      initial: 'remdx',
      message: 'Project name:',
      name: 'projectName',
      type: 'text',
    });
    targetDir = projectName.trim();
  }
  const packageName = await getValidPackageName(targetDir);
  const root = path.join(cwd, targetDir);

  if (!fs.existsSync(root)) {
    fs.mkdirSync(root, { recursive: true });
  } else {
    const existing = fs.readdirSync(root);
    if (existing.length) {
      console.log(yellow(`  Target directory "${targetDir}" is not empty.`));
      const { yes } = await prompts({
        initial: 'Y',
        message: 'Remove existing files and continue?',
        name: 'yes',
        type: 'confirm',
      });
      if (yes) {
        emptyDir(root);
      } else {
        return;
      }
    }
  }

  console.log(dim('  Scaffolding project in ') + targetDir + dim(' ...'));

  const templateDir = path.join(__dirname, 'template');

  const write = (file: string, content?: string) => {
    const targetPath = path.join(root, file);
    if (content) {
      fs.writeFileSync(targetPath, content);
    } else {
      copy(path.join(templateDir, file), targetPath);
    }
  };

  const files = fs.readdirSync(templateDir);
  for (const file of files.filter((f) => f !== 'package.json')) {
    write(file);
  }

  const pkg = require(path.join(templateDir, 'package.json'));

  pkg.name = packageName;

  write('package.json', JSON.stringify(pkg, null, 2));

  const pkgManager =
    /pnpm/.test(process.env.npm_execpath || '') ||
    /pnpm/.test(process.env.npm_config_user_agent || '')
      ? 'pnpm'
      : /yarn/.test(process.env.npm_execpath || '')
      ? 'yarn'
      : 'npm';

  const related = path.relative(cwd, root);

  console.log(green('  Done.\n'));

  const { yes } = await prompts({
    initial: 'Y',
    message: 'Install and start the dev server now?',
    name: 'yes',
    type: 'confirm',
  });

  if (yes) {
    const { agent } = await prompts({
      choices: ['npm', 'yarn', 'pnpm'].map((i) => ({ title: i, value: i })),
      message: 'Choose your package manager',
      name: 'agent',
      type: 'select',
    });

    if (!agent) {
      return;
    }

    await execa(agent, ['install'], { cwd: root, stdio: 'inherit' });
    await execa(agent, ['run', 'dev'], { cwd: root, stdio: 'inherit' });
  } else {
    console.log(dim('\n  start it later by:\n'));
    if (root !== cwd) {
      console.log(blue(`  cd ${bold(related)}`));
    }

    console.log(
      blue(`  ${pkgManager === 'yarn' ? 'yarn' : `${pkgManager} install`}`),
    );
    console.log(
      blue(`  ${pkgManager === 'yarn' ? 'yarn dev' : `${pkgManager} run dev`}`),
    );
  }
}

const copy = (src: string, dest: string) => {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest);
  } else {
    fs.copyFileSync(src, dest);
  }
};

const getValidPackageName = async (projectName: string) => {
  projectName = path.basename(projectName);
  const packageNameRegExp =
    /^(?:@[\d*a-z~-][\d*._a-z~-]*\/)?[\da-z~-][\d._a-z~-]*$/;
  if (packageNameRegExp.test(projectName)) {
    return projectName;
  } else {
    const suggestedPackageName = projectName
      .trim()
      .toLowerCase()
      .replaceAll(/\s+/g, '-')
      .replace(/^[._]/, '')
      .replaceAll(/[^\da-z~-]+/g, '-');

    const { inputPackageName } = await prompts({
      initial: suggestedPackageName,
      message: 'Package name:',
      name: 'inputPackageName',
      type: 'text',
      validate: (input) =>
        packageNameRegExp.test(input) ? true : 'Invalid package.json name',
    });
    return inputPackageName;
  }
};

const copyDir = (srcDir: string, destDir: string) => {
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);
    copy(srcFile, destFile);
  }
};

const emptyDir = (dir: string) => {
  if (fs.existsSync(dir)) {
    for (const file of fs.readdirSync(dir)) {
      const abs = path.resolve(dir, file);
      fs.rmSync(abs, { force: true, recursive: true });
    }
  }
};

try {
  // eslint-disable-next-line unicorn/prefer-top-level-await
  create();
} catch (error) {
  console.log(error);
}
