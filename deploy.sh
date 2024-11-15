#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

rm -rf docs/.vuepress/dist

# 生成静态文件
npm run docs:build

# 进入生成的文件夹
cd docs/.vuepress/dist

cp -r ../../../CNAME ./

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:lijileiGood/lijileiGood.github.io.git main:gh-pages --verbose

cd -
