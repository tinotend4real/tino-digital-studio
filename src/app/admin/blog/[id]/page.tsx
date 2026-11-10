import { notFound } from "next/navigation";
import { deleteBlogPost } from "@/actions/blog";
import { BlogForm } from "@/components/blog-form";
import { Button, PageHeader } from "@/components/ui";
import { prisma } from "@/lib/db";

export default async function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <>
      <PageHeader title={`Edit: ${post.title}`} />
      <BlogForm post={post} />
      <form action={deleteBlogPost} className="mt-10 max-w-2xl border-t border-slate-200 pt-6">
        <input type="hidden" name="id" value={post.id} />
        <Button variant="danger">Delete post</Button>
      </form>
    </>
  );
}
