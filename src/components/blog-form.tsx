import type { BlogPost } from "@prisma/client";
import { saveBlogPost } from "@/actions/blog";
import { Button, ButtonLink, Checkbox, Field, TextArea } from "@/components/ui";

export function BlogForm({ post }: { post?: BlogPost }) {
  return (
    <form action={saveBlogPost} className="max-w-2xl space-y-4">
      <input type="hidden" name="id" defaultValue={post?.id ?? ""} />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Title" name="title" defaultValue={post?.title} required />
        <Field label="URL slug (optional)" name="slug" defaultValue={post?.slug} placeholder="auto-generated from title" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Author" name="author" defaultValue={post?.author} />
        <Field label="Category" name="category" defaultValue={post?.category ?? "General"} />
      </div>
      <TextArea label="Short excerpt (shown in the blog list)" name="excerpt" defaultValue={post?.excerpt} rows={2} />
      <TextArea label="Article (blank lines start a new paragraph)" name="content" defaultValue={post?.content} rows={14} />
      <Checkbox label="Published" name="published" defaultChecked={post?.published} />
      <div className="flex gap-3">
        <Button>Save post</Button>
        <ButtonLink href="/admin/blog" variant="ghost">
          Cancel
        </ButtonLink>
      </div>
    </form>
  );
}
