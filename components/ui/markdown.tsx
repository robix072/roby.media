import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import type { ComponentProps } from "react";

const components = {
  a: ({ href = "", children, ...rest }: ComponentProps<"a">) =>
    href.startsWith("/") ? (
      <Link href={href} {...rest}>{children}</Link>
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>{children}</a>
    ),
  // Titlurile din articole încep de la H2 (H1 este titlul paginii).
  h1: (p: ComponentProps<"h2">) => <h2 {...p} />,
};

/** Randează Markdown/MDX (blog, pagini legale). */
export function Markdown({ source }: { source: string }) {
  return (
    <div className="prose-roby">
      <MDXRemote source={source} components={components} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
    </div>
  );
}
