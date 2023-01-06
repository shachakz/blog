import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { bundleMDX } from "mdx-bundler";

const root = process.cwd();
const postsDirectory = path.join(root, "posts");

export interface Meta {
  slug: string;
  date: Date;
  title: string;
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        slug: fileName.replace(/\.mdx?$/, "")
      }
    };
  });
}

export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData: Meta[] = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const slug = fileName.replace(/\.mdx?$/, "");

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Use gray-matter to parse the post metadata section
    const meta = matter(fileContents);

    // Combine the data with the id
    return {
      ...meta.data,
      slug
    } as Meta;
  });

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getPostData(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  const mdxSource = fs.readFileSync(fullPath, "utf8");

  const { code, frontmatter } = await bundleMDX<Meta>({
    source: mdxSource,
    mdxOptions(options, frontmatter) {
      // this is the recommended way to add custom remark/rehype plugins:
      // The syntax might look weird, but it protects you in case we add/remove
      // plugins in the future.
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? [])
        // myRemarkPlugin
      ];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? [])
        // myRehypePlugin
      ];

      return options;
    }
  });

  return {
    meta: {
      ...frontmatter,
      slug
    } as Meta,
    code
  };
}
