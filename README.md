# React Based Blog Website

## Preview

You can preview in [Zhongbr's Blog](https://zhongbr.cn)

![img_1.png](img_1.png)

This is a React Blog website based on GitHub Pages and GitHub Actions.

The GitHub Action, `build-posts` will be started
When you modify markdown files in `/posts/**` and then push it to the `main` branch,
turns the markdown files to ast json files.

The GitHub Action, `build-website` will be started 
when you modify React files in `/src` and then push it to the `main` branch,
builds the frontend resources, like html, javascript and css files.

Both frontend resources and markdown ast json files will be packed and pushed to the
`github-pages` branch, which is the branch that GitHub Pages deploys on.

> Please use pnpm to manage packages.

## 1. npm scripts and introductions

| script          | description                            |
|-----------------|----------------------------------------|
| build-website   | build website resources                |
| build-markdown  | build markdown files to ast json files |
| install-website | install websites dependencies by pnpm  |
| start-website   | start blog website local               |

## 2. steps to start my blog

### 1. fork this repository

Star and fork this project, open the repository forked.

### 2. modify the secrets in repository settings

Open the repository settings tab, and modify the repository secrets DOMAIN to your own domain.

This domain will be your blog website domain. So you should set a valid dns record before deploy.

![img.png](img.png)

### 3. write your posts and push to the `main` branch

Now you can write your blog posts in `/posts`.

It will be deployed about 5 minutes after you push them to the `main` branch.

> In the post markdown file, you can set the post meta info by following code block
> ```
> ---
> title: my hello world blog title
> tags: ['tag1', 'tag2']
> recommend: topic-id
> ---
> ```

> There is a `topics.yaml` file in the `posts` directory, it defines the topics displayed in blog index page.
> Each item of topics arrays has the following properties:
> ```yaml
> - id: 'topic-id, used in the post meta `recommend` property'
> - topicName: 'name of the topic'
> - desc: 'some descriptions text of this topic'
> - tags:
>   - 'tag1'
>   - 'tag2'
> - icon: 'icon font class name of the topic'
> - color: 'color of the topic card'
> ```
