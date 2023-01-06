import { getMDXComponent } from "mdx-bundler/client";
import React from "react";
import { useMemo } from "react";
import { getAllPostIds, getPostData, Meta } from "../../lib/posts";
import SyntaxHighlighter from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import Link from "next/link";
const components = {
  a: (props: any) => (
    <Link
      {...props}
      className="text-5xl hover:underline hover:text-teal-400 hover:bg-gray-700"
    />
  ),
  h1: (props: any) => (
    <h1 className="md:text-7xl text-5xl text-teal-400" {...props} />
  ),
  h2: (props: any) => (
    <h2 className="md:text-5xl text-3xl text-teal-400" {...props} />
  ),
  h3: (props: any) => (
    <h3 className="md:text-3xl text-2xl text-teal-400" {...props} />
  ),
  h4: (props: any) => (
    <h4 className="md:text-1xl text-xl text-teal-400" {...props} />
  ),
  h5: (props: any) => (
    <h5 className="md:text-lg text-lg text-teal-400" {...props} />
  ),
  h6: (props: any) => (
    <h6 className="md:text-base text-base text-teal-400" {...props} />
  ),
  pre: (props: any) => {
    // There is a code block inside the pre block
    const defaultCodeLanguage = "rust";
    const codeBlock = props.children;
    const { className, children }: { className: string; children: string } =
      codeBlock.props;

    return (
      <div className="mx-2 my-4 md:mx-8">
        <SyntaxHighlighter
          // {...codeBlock.props}
          codeTagProps={{ className }}
          style={dracula}
          language={(className || defaultCodeLanguage).replace("language-", "")}
          showLineNumbers
          className="rounded-lg border-cyan-500 border-2 border-dotted"
        >
          {children}
        </SyntaxHighlighter>
      </div>
    );
    // <pre
    //   {...props}
    //   className="bg-gray-500 p-3 m-1 rounded-md [&>code]:text-red-500 [&>code]:bg-gray-500"
    // />
  },
  code: (props: any) => (
    <code
      {...props}
      className="text-yellow-600 bg-gray-700 rounded-lg p-1 italic"
    />
  ),
  p: (props: any) => <p {...props} className="text-xs md:text-base" />
};

export default function BlogPost({ code, meta }: { code: string; meta: Meta }) {
  const Component = useMemo(() => getMDXComponent(code), [code]);

  return (
    <div className="m-24">
      <h1>{meta.title}</h1>
      {/* <p>{frontmatter.description}</p> */}
      <p>{meta.date.toString()}</p>
      <article className="mt-10">
        <Component components={components} />
      </article>
    </div>
  );
}

export async function getStaticPaths() {
  // Return a list of possible value for id
  const paths = getAllPostIds();

  return {
    paths,
    fallback: false
  };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  // Fetch necessary data for the blog post using params.id
  const postData = await getPostData(params.slug);

  return {
    props: {
      ...postData
    }
  };
}
