import { PostForm } from "~/components/posts/post-form";
import { Card } from "~/components/ui/card";
import { Container } from "~/components/ui/container";
import { withAuth } from "~/security/protected";

export const metadata = {
  title: "UCollab — New Post",
};

export const dynamic = "force-dynamic";

async function Page() {
  return (
    <Container className="max-w-5xl">
      <Card variant="glossy" className="p-4 sm:p-8">
        <PostForm />
      </Card>
    </Container>
  );
}

export default withAuth(Page);
