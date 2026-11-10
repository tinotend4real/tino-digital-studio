import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Badge, Card, Empty } from "@/components/ui";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Blog" };

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" } });

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Blog</h1>
      <p className="mt-2 text-slate-600">Tips and news for small businesses online.</p>

      {posts.length === 0 ? (
        <div className="mt-8">
          <Empty>No posts yet. Check back soon.</Empty>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {posts.map((p) => (
            <Link key={p.id} href={`/blog/${p.slug}`} className="block">
              <Card className="transition hover:border-brand-500">
                <div className="flex items-center gap-3">
                  <Badge>{p.category}</Badge>
                  {p.publishedAt ? <span className="text-xs text-slate-500">{formatDate(p.publishedAt)}</span> : null}
                </div>
                <h2 className="mt-3 text-lg font-semibold">{p.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{p.excerpt}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
