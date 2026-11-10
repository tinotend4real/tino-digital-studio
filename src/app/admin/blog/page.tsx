import Link from "next/link";
import { prisma } from "@/lib/db";
import { Badge, ButtonLink, Card, Empty, PageHeader } from "@/components/ui";
import { formatDate } from "@/lib/utils";

export default async function AdminBlog() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <PageHeader title="Blog" action={<ButtonLink href="/admin/blog/new">New post</ButtonLink>} />
      {posts.length === 0 ? (
        <Empty>No posts yet.</Empty>
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Published</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {posts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <Link href={`/admin/blog/${p.id}`} className="font-medium text-brand-700 hover:underline">
                      {p.title}
                    </Link>
                  </td>
                  <td className="px-5 py-3">{p.category}</td>
                  <td className="px-5 py-3">
                    <Badge>{p.published ? "Published" : "Draft"}</Badge>
                  </td>
                  <td className="px-5 py-3">{p.publishedAt ? formatDate(p.publishedAt) : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}
