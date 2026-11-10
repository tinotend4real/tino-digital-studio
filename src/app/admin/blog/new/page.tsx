import { BlogForm } from "@/components/blog-form";
import { PageHeader } from "@/components/ui";

export default function NewPost() {
  return (
    <>
      <PageHeader title="New post" />
      <BlogForm />
    </>
  );
}
