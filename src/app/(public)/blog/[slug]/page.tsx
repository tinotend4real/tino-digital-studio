import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Badge, ButtonLink } from "@/components/ui";
import { formatDate } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  return { title: post?.title ?? "Blog", description: post?.excerpt || undefined };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || !post.published) notFound();

  const paragraphs = post.content.split(/\n\s*\n/).filter(Boolean);

  return (
    <article className="mx-auto max-w-2xl px-6 py-14">
      <Link href="/blog" className="text-sm text-slate-500 hover:text-slate-900">
        ← Blog
      </Link>
      <div className="mt-4 flex items-center gap-3">
        <Badge>{post.category}</Badge>
        {post.publishedAt ? <span className="text-sm text-slate-500">{formatDate(post.publishedAt)}</span> : null}
      </div>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">{post.title}</h1>
      {post.author ? <p className="mt-2 text-sm text-slate-500">By {post.author}</p> : null}

      <div className="mt-8 space-y-4 text-slate-700">
        {paragraphs.map((para, i) => (
          <p key={i} className="whitespace-pre-line">
            {para}
          </p>
        ))}
      </div>

      <div className="mt-12 rounded-xl border border-slate-200 bg-white p-6">
        <p className="font-medium">Need help with your website?</p>
        <p className="mt-1 text-sm text-slate-600">Get in touch for a free, no-pressure quote.</p>
        <div className="mt-4">
          <ButtonLink href="/contact">Contact us</ButtonLink>
        </div>
      </div>
    </article>
  );
}
